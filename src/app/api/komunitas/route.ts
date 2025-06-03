// src/app/api/komunitas/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch('http://localhost:8000/api/komunitas');

    if (!res.ok) {
      console.error('Respon dari Laravel tidak OK:', res.status);
      return NextResponse.json({ error: 'Gagal mengambil data komunitas' }, { status: res.status });
    }

    const data = await res.json();
    console.log('Data dari Laravel:', data);

    return NextResponse.json({ data: data.data?.data || [] });
  } catch (error) {
    console.error('Gagal fetch dari Laravel:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan saat mengambil data' }, { status: 500 });
  }
}
