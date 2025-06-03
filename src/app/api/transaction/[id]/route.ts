import { NextResponse } from 'next/server';
import { headers } from 'next/headers'; // <-- PENTING: dari next/headers
import pool from '../../../lib/db';
import { verifyToken } from '../../../lib/auth';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const headersList =  await headers(); // ✅ Ini asynchronous dari next/headers
    const authHeader = headersList.get('authorization') || '';
    console.log('Authorization header:', authHeader);

    const token = authHeader && authHeader.startsWith('Bearer ')
      ? authHeader.slice(7).trim()
      : '';
    console.log('Extracted token:', token);

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized, token missing' }, { status: 401 });
    }

    const payload = verifyToken(token);
    console.log('Payload from verifyToken:', payload);

    if (!payload) {
      return NextResponse.json({ message: 'Unauthorized, invalid token' }, { status: 401 });
    }

    const userId = payload.userId;
    const transactionId = params.id;
    console.log('userId:', userId, 'transactionId:', transactionId);

    const [rows]: any = await pool.query(
      `SELECT 
        id_transactions AS id,
        no_pemesanan,
        payment_method,
        total_amount AS total,
        payment_status,
        paid_at AS tanggal,
        status
      FROM transactions
      WHERE id_transactions = ? AND user_id = ?`,
      [transactionId, userId]
    );

    if (!rows || rows.length === 0) {
      return NextResponse.json({ message: 'Transaction not found' }, { status: 404 });
    }

    return NextResponse.json(rows[0], { status: 200 });
  } catch (error) {
    console.error('API transaction error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
