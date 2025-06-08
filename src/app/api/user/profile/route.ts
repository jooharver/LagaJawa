import { NextResponse } from 'next/server';
import { verifyToken } from '../../../lib/auth'; // sesuaikan path
import pool from '../../../lib/db'; // sesuaikan path

type User = {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
};

// Tipe hasil query untuk MySQL, hasil query berupa array berisi array baris dan metadata
type QueryResult<T> = [T[], unknown];

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    console.log('Authorization header:', authHeader);

    const token = authHeader?.split(' ')[1];
    if (!token) {
      console.log('Token tidak ditemukan di header');
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token) as { userId: number };
    console.log('Decoded payload:', payload);

    // Jalankan query tanpa generic type pada pool.query
    const [rows] = await pool.query(
      'SELECT id, name, email, phone, address FROM users WHERE id = ?',
      [payload.userId]
    ) as QueryResult<User>;

    if (!rows || rows.length === 0) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const user = rows[0];

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json({ message: 'Invalid token or server error' }, { status: 403 });
  }
}
