'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import styles from './detail.module.css';

type BookingDetail = {
  id: number;
  user_id: number;
  no_pemesanan: string;
  payment_method: string;
  total: number;
  status: string;
  paid_at: string;
};

export default function DetailTransaksiPage() {
  const { id } = useParams();
  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchDetail = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Token saat request:', token);
      if (!token) {
        console.error('Token tidak ditemukan, user belum login');
        return;
      }

      const res = await axios.get(`/api/transaction/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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
  if (!booking) return <p>Data tidak ditemukan atau Anda belum login.</p>;

return (
  <div className={styles.receipt}>
    <h1>Rincian Transaksi #{booking.id}</h1>
    <p><strong>No Pemesanan:</strong> {booking.no_pemesanan}</p>
    <p><strong>Metode Pembayaran:</strong> {booking.payment_method}</p>
    <p>
  <strong>Dibayar Pada:</strong>{' '}
  {booking.paid_at
    ? new Date(booking.paid_at).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })
    : 'Belum dibayar'}
</p>

    <p><strong>Total:</strong> Rp {booking.total.toLocaleString('id-ID')}</p>
    <p><strong>Status:</strong> {booking.status}</p>
  </div>
);
}
