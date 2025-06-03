import { NextRequest, NextResponse } from 'next/server';
import pool from '../../../lib/db';

export async function GET(req: NextRequest, context: { params: { id: string } }) {
  const id = context.params.id;

  try {
    const [rows]: any = await pool.query('SELECT * FROM news WHERE id_news= ?', [id]);

    if (rows.length === 0) {
      return NextResponse.json({ message: 'Berita tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    return NextResponse.json({ message: 'Terjadi kesalahan', error }, { status: 500 });
  }
}
