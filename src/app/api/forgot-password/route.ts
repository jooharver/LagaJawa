import { NextResponse } from 'next/server';
import pool from '../../lib/db';
import crypto from 'crypto';
import { sendEmail } from '../../lib/email';

// Definisikan tipe user sesuai kolom yang dipakai
type User = {
  id: number;
  email: string;
};

export async function POST(request: Request) {
  const { email } = await request.json();

  try {
    // Query dengan tipe generic User[]
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    const users = rows as User[];

    // Jika user tidak ditemukan, tetap kirim response 200 (untuk keamanan)
    if (users.length === 0) {
      return NextResponse.json(
        { message: 'Jika email terdaftar, kami akan mengirim link reset password' },
        { status: 200 }
      );
    }

    const user = users[0];

    // Generate token dan expiry 1 jam ke depan
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 jam

    // Simpan token dan expiry di DB
    await pool.query(
      'UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE id = ?',
      [resetToken, resetTokenExpiry, user.id]
    );

    // Buat URL reset password
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`;

    // Kirim email
    await sendEmail({
      to: email,
      subject: 'Reset Password Anda',
      html: `
        <h2>Reset Password</h2>
        <p>Silakan klik link di bawah ini untuk mengatur ulang password Anda:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>Link ini akan kedaluwarsa dalam 1 jam.</p>
      `
    });

    return NextResponse.json(
      { message: 'Link reset password telah dikirim ke email Anda' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Forgot Password Error:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
