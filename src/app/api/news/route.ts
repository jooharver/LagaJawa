import { NextResponse } from 'next/server';
import db from '../../lib/db';
import type { FieldPacket } from 'mysql2';

type News = {
  id_news: number;
  judul: string;
  sub_judul: string;
  tempat: string;
  tanggal: string;
  image: string;
  kategori: string;
  deskripsi: string;
};

export async function GET() {
  try {
    const [rows] = await db.query(
      'SELECT * FROM news ORDER BY tanggal DESC'
    ) as [News[], FieldPacket[]];

    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}
