import { NextResponse } from 'next/server';
import pool from '../../../lib/db';
import bcrypt from 'bcryptjs';
import { RowDataPacket, OkPacket } from 'mysql2';

// Tipe hasil query untuk users
type User = {
  id: number;
};

export async function POST(request: Request) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const { name, phone, email, password } = await request.json();

    // 1. Validasi data
    if (!name || !phone || !email || !password) {
      throw new Error('Semua field harus diisi');
    }

    // 2. Cek apakah email sudah terdaftar
    const [existingUsers] = await connection.query<RowDataPacket[] & User[]>(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      throw new Error('Email telah terdaftar. Silakan reset kata sandi apabila Anda lupa.');
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Simpan user baru
    const [result] = await connection.query<OkPacket>(
      'INSERT INTO users (name, phone, email, password) VALUES (?, ?, ?, ?)',
      [name, phone, email, hashedPassword]
    );

    // Commit transaksi
    await connection.commit();

    return NextResponse.json(
      {
        success: true,
        message: 'Registrasi berhasil',
        userId: result.insertId,
      },
      { status: 201 }
    );
  } catch (error) {
    await connection.rollback();

    console.error('Signup error:', error);

    const message =
      error instanceof Error ? error.message : 'Registrasi gagal';

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 400 }
    );
  } finally {
    connection.release();
  }
}
