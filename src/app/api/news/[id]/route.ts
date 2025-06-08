import { NextRequest, NextResponse } from 'next/server';
import pool from '../../../lib/db';
import type { RowDataPacket } from 'mysql2';

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

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const pathname = url.pathname;
    const segments = pathname.split('/');
    const id = segments[segments.length - 1];

    if (!id) {
      return NextResponse.json({ message: 'ID tidak ditemukan di URL' }, { status: 400 });
    }

    // cast rows ke tipe News[] yang extend RowDataPacket
    const [rows] = await pool.query<News & RowDataPacket[]>(
      'SELECT * FROM news WHERE id_news = ?',
      [id]
    );

    if (rows.length === 0) {
      return NextResponse.json({ message: 'Berita tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ data: rows[0] }, { status: 200 });
  } catch (error) {
    console.error('Error fetching news by ID:', error);
    return NextResponse.json({ message: 'Terjadi kesalahan' }, { status: 500 });
  }
}
