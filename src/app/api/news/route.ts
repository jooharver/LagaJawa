// app/api/news/route.ts
import { NextResponse } from 'next/server';
import db from '../../lib/db'; // sesuaikan path

export async function GET() {
  try {
    console.log('Fetching news from DB...');
    const [rows]: any = await db.query('SELECT * FROM news ORDER BY tanggal DESC');

    // Cek apakah rows berbentuk array
    if (!Array.isArray(rows)) {
      return NextResponse.json({ error: 'Unexpected DB response format' }, { status: 500 });
    }

    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}
