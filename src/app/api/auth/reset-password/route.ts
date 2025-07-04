import { NextResponse } from 'next/server';
import pool from '../../../lib/db';
import bcrypt from 'bcryptjs';

// Tipe untuk user hasil query
type User = {
  id: number;
  email: string;
  password: string;
  reset_token: string | null;
  reset_token_expiry: string | null;
};

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json();

    // Validasi input
    if (!token || !password) {
      return NextResponse.json(
        { message: 'Token dan password wajib diisi' },
        { status: 400 }
      );
    }

    // Cari user dengan token valid yang belum expired
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE reset_token = ? AND reset_token_expiry > NOW()',
      [token]
    );
    const users = rows as User[];

    if (users.length === 0) {
      return NextResponse.json(
        { message: 'Token tidak valid atau sudah kadaluarsa' },
        { status: 400 }
      );
    }

    const user = users[0];

    // Hash password baru
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password dan hapus token reset
    await pool.query(
      'UPDATE users SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE id = ?',
      [hashedPassword, user.id]
    );

    return NextResponse.json(
      { message: 'Password berhasil diubah' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Reset Password Error:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
