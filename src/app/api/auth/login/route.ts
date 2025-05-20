import { NextResponse } from 'next/server';
import pool from '../../../lib/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'rahasia_jwt';

export async function POST(request: Request) {
  const { email, password } = await request.json();

  try {
    const [users]: any = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

    if (users.length === 0) {
      return NextResponse.json({ message: 'Email tidak terdaftar' }, { status: 401 });
    }

    const user = users[0];
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return NextResponse.json({ message: 'Password salah' }, { status: 401 });
    }

    // Generate token JWT (atau session)
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    return NextResponse.json({ token, message: 'Login berhasil' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Terjadi kesalahan server' }, { status: 500 });
  }
}
