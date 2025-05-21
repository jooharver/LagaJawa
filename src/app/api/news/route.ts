// app/api/news/route.ts
import { NextResponse } from 'next/server';
import db from '../../lib/db'; // Adjust the import path as necessary

export async function GET() {
  try {
    console.log('Fetching news from DB...');
    const [rows] = await db.query('SELECT * FROM news ORDER BY tanggal DESC');
    console.log('News fetched:', rows);
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}