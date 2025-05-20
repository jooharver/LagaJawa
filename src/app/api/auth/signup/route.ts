import { NextResponse } from 'next/server';
import pool from '../../../lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  // Mulai transaction
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

    const { name,phone ,email, password } = await request.json();

    // 1. Validasi data
    if (!name || !phone || !email || !password) {
      throw new Error('Semua field harus diisi');
    }

    // 2. Cek email sudah terdaftar
    const [existingUsers]: any = await connection.query(
      'SELECT id FROM users WHERE email = ?', 
      [email]
    );

    if (existingUsers.length > 0) {
      throw new Error('Email sudah terdaftar');
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Simpan ke database
    const [result]: any = await connection.query(
      'INSERT INTO users (name, phone, email, password) VALUES (?,?, ?, ?)',
      [name, phone ,email, hashedPassword]
    );

    // Commit transaction
    await connection.commit();

    return NextResponse.json(
      { 
        success: true,
        message: 'Registrasi berhasil',
        userId: result.insertId 
      },
      { status: 201 }
    );

  } catch (error: any) {
  await connection.rollback();
  
  console.error('Signup error:', error); // Tambahkan ini
  
  return NextResponse.json(
    { 
      success: false,
      message: error.message || 'Registrasi gagal'
    },
    { status: 400 }
  );

  } finally {
    // Selalu release connection
    connection.release();
  }
}