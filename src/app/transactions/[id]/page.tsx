'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import styles from './detail.module.css';

type BookingItem = {
  id: number;
  booking_date: string;
  time_slots: string[];
  price?: number;
  court: {
    name: string;
  };
};

type BookingDetail = {
  id: number;
  user_id: number;
  user_name?: string;
  no_pemesanan: string;
  payment_method: string;
  total: number;
  status: string;
  paid_at: string;
  bookings: BookingItem[];
};

export default function DetailTransaksiPage() {
  const { id } = useParams();
  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token || !id) return;

        const res = await axios.get(`https://portal.lagajawa.site/api/transactions/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        });

        setBooking(res.data.data);
      } catch (err) {
        console.error('Gagal ambil data booking:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  if (loading) return <p>Memuat rincian transaksi...</p>;
  if (!booking) return <p>Data tidak ditemukan atau Anda belum login.</p>;

  return (
    <div className={styles.receipt}>
      <h1 className={styles.textCenter}>Rincian Transaksi</h1>

      {booking.user_name && (
        <p><strong>Nama Pemesan:</strong> {booking.user_name}</p>
      )}
      <p><strong>No Pemesanan:</strong> {booking.no_pemesanan}</p>
      <p><strong>Metode Pembayaran:</strong> {booking.payment_method}</p>
      <p>
        <strong>Status:</strong>{' '}
        <span className={`${styles.status} ${styles[booking.status.toLowerCase()]}`}>
          {booking.status}
        </span>
      </p>
      <p>
        <strong>Dibayar Pada:</strong>{' '}
        {booking.paid_at && booking.paid_at !== 'null'
          ? new Date(booking.paid_at).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })
          : '-'}
      </p>

      {booking.bookings && booking.bookings.length > 0 && (
        <>
          <h2 className={styles.subHeading}>Rincian Pesanan Lapangan</h2>
          <ul className={styles.bookingList}>
            {booking.bookings.map((item, idx) => (
              <li key={idx} className={styles.bookingItem}>
                <p><strong>Lapangan:</strong> {item.court?.name ?? '-'}</p>
                <p><strong>Tanggal:</strong> {new Date(item.booking_date).toLocaleDateString('id-ID')}</p>
                <p><strong>Jam:</strong> {item.time_slots.join(', ')}</p>
                <p><strong>Harga Lapangan:</strong> Rp {item.price?.toLocaleString('id-ID') ?? '-'}</p>
              </li>
            ))}
          </ul>
          <hr />
          <p><strong>Total Harga:</strong> Rp {booking.total.toLocaleString('id-ID')}</p>
        </>
      )}
    </div>
  );
}
