// app/transaksi/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';

type BookingDetail = {
  id: number;
  nama: string;
  lapangan: string;
  tanggal: string;
  durasi: number;
  total: number;
  status: string;
};

export default function DetailTransaksiPage() {
  const { id } = useParams();
  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/bookings/${id}`);
        setBooking(res.data);
      } catch (err) {
        console.error('Gagal ambil data booking:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDetail();
  }, [id]);

  if (loading) return <p>Memuat rincian transaksi...</p>;
  if (!booking) return <p>Data tidak ditemukan</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Rincian Transaksi #{booking.id}</h1>
      <p><strong>Nama:</strong> {booking.nama}</p>
      <p><strong>Lapangan:</strong> {booking.lapangan}</p>
      <p><strong>Tanggal:</strong> {new Date(booking.tanggal).toLocaleString('id-ID')}</p>
      <p><strong>Durasi:</strong> {booking.durasi} jam</p>
      <p><strong>Total:</strong> Rp {booking.total.toLocaleString('id-ID')}</p>
      <p><strong>Status:</strong> {booking.status}</p>
    </div>
  );
}
