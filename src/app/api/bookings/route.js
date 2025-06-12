
// app/api/booking.route.js
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const booking_date = searchParams.get('booking_date');

  if (!booking_date) {
    return NextResponse.json({ error: 'booking_date is required' }, { status: 400 });
  }

  // fetch data dari backend 
  const res = await fetch(`http://localhost:8000/api/bookings?booking_date=${booking_date}`);
  if (!res.ok) {
    return NextResponse.json({ error: 'Failed to fetch from backend' }, { status: 500 });
  }

  const data = await res.json();

  return NextResponse.json(data);
}
