import { NextResponse } from 'next/server';
import pool from '../../../lib/db';
import { verifyToken } from '../../../lib/auth';

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization') || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized, token missing' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload || typeof payload.userId !== 'number') {
      return NextResponse.json({ message: 'Unauthorized, invalid token' }, { status: 401 });
    }

    const userId = payload.userId;

    const url = new URL(req.url);
    const pathnameSegments = url.pathname.split('/');
    const transactionId = pathnameSegments[pathnameSegments.length - 1];

    if (!transactionId || isNaN(Number(transactionId))) {
      return NextResponse.json({ message: 'Invalid transaction ID' }, { status: 400 });
    }

    // Ambil data transaksi utama
    const [transactions] = await pool.query(
      `SELECT 
        id_transaction AS id,
        no_pemesanan,
        payment_method,
        total_amount AS total,
        payment_status,
        paid_at,
        status
      FROM transactions
      WHERE id_transaction = ? AND user_id = ?`,
      [transactionId, userId]
    ) as any;

    if (!transactions || transactions.length === 0) {
      return NextResponse.json({ message: 'Transaction not found' }, { status: 404 });
    }

    const transaction = transactions[0];

    // Ambil data bookings terkait
    const [bookings] = await pool.query(
      `SELECT 
        b.id_booking AS id,
        b.booking_date,
        b.time_slots,
        b.amount,
        c.name AS court_name
      FROM bookings b
      JOIN courts c ON b.court_id = c.id_court
      WHERE b.transaction_id = ?`,
      [transactionId]
    ) as any;

    // Format bookings dan parsing time_slots dengan aman
    const formattedBookings = bookings.map((b: any) => {
    let timeSlots: string[] = [];

    try {
      if (typeof b.time_slots === 'string' && b.time_slots.trim().startsWith('[')) {
        timeSlots = JSON.parse(b.time_slots);
      } else if (Array.isArray(b.time_slots)) {
        timeSlots = b.time_slots;
      }
    } catch (e) {
      console.error('Failed to parse time_slots:', b.time_slots);
    }

    return {
      id: b.id,
      booking_date: b.booking_date,
      time_slots: timeSlots,
      price: b.amount, // ✅ tambahkan ini!
      court: {
        name: b.court_name
      }
    };
  });



    const fullData = {
      ...transaction,
      bookings: formattedBookings
    };

    return NextResponse.json({ data: fullData }, { status: 200 });

  } catch (error) {
    console.error('API transaction error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}





