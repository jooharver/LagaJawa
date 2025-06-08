import { NextResponse } from 'next/server';
import pool from '../../../lib/db';
import { verifyToken } from '../../../lib/auth';

type Transaction = {
  id: number;
  no_pemesanan: string;
  payment_method: string;
  total: number;
  payment_status: string;
  tanggal: string;
  status: string;
};

export async function GET(req: Request) {
  try {
    // Ambil header Authorization
    const authHeader = req.headers.get('authorization') || '';
    console.log('Authorization header:', authHeader);

    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
    console.log('Extracted token:', token);

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized, token missing' }, { status: 401 });
    }

    // Verifikasi token
    const payload = verifyToken(token);
    console.log('Payload from token:', payload);

    if (!payload || typeof payload.userId !== 'number') {
      return NextResponse.json({ message: 'Unauthorized, invalid token' }, { status: 401 });
    }

    const userId = payload.userId;

    // Ambil transactionId dari URL
    const url = new URL(req.url);
    const pathnameSegments = url.pathname.split('/');
    const transactionId = pathnameSegments[pathnameSegments.length - 1];
    console.log('Transaction ID from URL:', transactionId);

    // Validasi transactionId, harus angka
    if (!transactionId || isNaN(Number(transactionId))) {
      return NextResponse.json({ message: 'Invalid transaction ID' }, { status: 400 });
    }

    // Query ke database
    const [rows] = await pool.query(
      `SELECT 
        id_transaction AS id,
        no_pemesanan,
        payment_method,
        total_amount AS total,
        payment_status,
        paid_at AS tanggal,
        status
      FROM transactions
      WHERE id_transaction = ? AND user_id = ?`,
      [transactionId, userId]
    ) as unknown as [Transaction[]];

    if (!rows || rows.length === 0) {
      return NextResponse.json({ message: 'Transaction not found' }, { status: 404 });
    }

    // Return data transaksi
    return NextResponse.json(rows[0], { status: 200 });

  } catch (error) {
    console.error('API transaction error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
