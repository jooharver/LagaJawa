import { NextResponse } from 'next/server';
import pool from '../../lib/db';
import crypto from 'crypto';
import { sendEmail } from '../../lib/email';

export async function POST(request: Request) {
  const { email } = await request.json();

  try {
    // 1. Cari user berdasarkan email
    const [users]: any = await pool.query(
      'SELECT * FROM users WHERE email = ?', 
      [email]
    );

    if (users.length === 0) {
      return NextResponse.json(
        { message: 'Jika email terdaftar, kami akan mengirim link reset password' },
        { status: 200 }
      );
    }

    const user = users[0];

    // 2. Generate token dan expiry (1 jam dari sekarang)
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 jam

    // 3. Update user dengan token
    await pool.query(
      'UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE id = ?',
      [resetToken, resetTokenExpiry, user.id]
    );

    // 4. Kirim email
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;

// kirim email pakai resetUrl ini
await sendEmail({
  to: email,
  subject: 'Reset Password Anda',
  html: `
    <h2>Reset Password</h2>
    <p>Silakan klik link di bawah ini untuk mengatur ulang password Anda:</p>
    <a href="${resetUrl}">${resetUrl}</a>
    <p>Link ini akan kedaluwarsa dalam 1 jam.</p>
  `,
});


    return NextResponse.json(
      { message: 'Link reset password telah dikirim ke email Anda' },
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