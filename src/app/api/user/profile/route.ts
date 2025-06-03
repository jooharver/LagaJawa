import { NextResponse } from 'next/server';
import { verifyToken } from '../../../lib/auth'; // pastikan path-nya benar
import pool from '../../../lib/db'; // sesuaikan jika path kamu berbeda

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    console.log('Authorization header:', authHeader);

    const token = authHeader?.split(' ')[1];
    console.log('Extracted token:', token);

    if (!token) {
      console.log('Token tidak ditemukan di header');
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token);
    console.log('Decoded payload:', payload);

    const [rows]: any = await pool.query(
      'SELECT id, name, email, phone, address FROM users WHERE id = ?',
      [payload.userId]
    );
    console.log('Query result rows:', rows);

    if (!rows || rows.length === 0) {
      console.log('User dengan id', payload.userId, 'tidak ditemukan');
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const user = rows[0];

    return NextResponse.json(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json({ message: 'Invalid token or server error' }, { status: 403 });
  }
}
