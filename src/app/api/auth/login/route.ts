import { NextResponse } from 'next/server';
import pool from '../../../lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Cek JWT_SECRET dari environment
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not set.');
}

// Tipe data untuk User
type User = {
  id: number;
  name: string;
  email: string;
  password: string;
  phone?: string; // tambahkan jika field ini opsional
};

export async function POST(request: Request) {
  const { email, password } = await request.json();

  try {
    // Ambil data user dari database
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    const users = rows as User[];

    // Cek apakah email terdaftar
    if (users.length === 0) {
      return NextResponse.json(
        { message: 'Email tidak terdaftar' },
        { status: 401 }
      );
    }

    const user = users[0];

    // Bandingkan password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { message: 'Password salah' },
        { status: 401 }
      );
    }

    // Buat token JWT
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      JWT_SECRET!,
      { expiresIn: '2h' }
    );

    // Kirim response dengan token dan data user
    return NextResponse.json(
      {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
        },
        message: 'Login berhasil',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
