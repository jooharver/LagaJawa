'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from './Status.module.css';

export default function StatusPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!orderId) {
      setError('Order ID tidak ditemukan di URL.');
      setLoading(false);
      return;
    }

    const fetchTransaction = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/transactions/by-order/${orderId}`);
        const json = await res.json();

        if (!json.success) {
          setError('Transaksi tidak ditemukan.');
        } else {
          setTransaction(json.data);
        }
      } catch (err) {
        setError('Gagal mengambil data transaksi.');
      } finally {
        setLoading(false);
      }
    };

    fetchTransaction();
  }, [orderId]);

  const handlePayAgain = () => {
    if (!transaction?.snap_token) {
      alert('Snap Token tidak tersedia.');
      return;
    }

    const snapUrl = `https://app.sandbox.midtrans.com/snap/v2/vtweb/${transaction.snap_token}`;
    window.open(snapUrl, '_blank');
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!transaction) return <div className={styles.error}>Transaksi tidak ditemukan.</div>;

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>Status Pembayaran</div>

        <div className={styles.cardContent}>
          {/* KIRI - Detail Lapangan */}
          <div className={styles.leftColumn}>
            <h4 className={styles.sectionTitle}>Detail Lapangan</h4>
            <ul className={styles.bookingList}>
              {transaction.bookings?.map((booking, index) => (
                <li key={index} className={styles.bookingItem}>
                  <p><strong>Lapangan:</strong> {booking.court?.name}</p>
                  <p><strong>Tanggal:</strong> {new Date(booking.booking_date).toLocaleDateString('id-ID', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })}</p>
                  <p><strong>Jam:</strong> {booking.time_slots.join(', ')}</p>

                </li>
              ))}
            </ul>
            <hr />
          </div>

          {/* KANAN - Detail Pemesanan */}
          <div className={styles.rightColumn}>
            <h3 className={styles.subHeader}>Detail Pemesanan</h3>
            <p><strong>Nama Pemesan:</strong> {transaction.user?.name}</p>
            <p><strong>Order ID:</strong> {transaction.no_pemesanan}</p>
            <p><strong>Status:</strong> {transaction.payment_status}</p>
          </div>
        </div>

        <div className={styles.totalAmount}>
          <span>Total:</span>
          <span>Rp {transaction.total_amount.toLocaleString()}</span>
        </div>

        {transaction.payment_status === 'waiting' && transaction.snap_token && (
          <button onClick={handlePayAgain} className={styles.payButton}>
            Lanjutkan Pembayaran
          </button>
        )}
      </div>
    </div>
  );
}
