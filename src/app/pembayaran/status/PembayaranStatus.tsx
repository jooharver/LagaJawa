'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from './Status.module.css';

export default function StatusForm() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');
  const [transaction, setTransaction] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) {
      setError('Order ID tidak ditemukan.');
      setLoading(false);
      return;
    }

    const fetchTransaction = async () => {
      try {
        const res = await fetch(`https://portal.lagajawa.site/api/transactions/by-order/${orderId}`);
        const json = await res.json();

        if (!json.success) {
          setError('Transaksi tidak ditemukan.');
        } else {
          setTransaction(json.data);
        }
      } catch {
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

  if (loading) {
    return (
      <div className={styles.loaderContainer}>
        <div className={styles.spinner}></div>
        <p>Memuat detail pembayaran...</p>
      </div>
    );
  }

  if (error || !transaction) {
    return <div className={styles.error}>{error || 'Transaksi tidak ditemukan.'}</div>;
  }

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const time = date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false }).replace(':', '.');
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${time} WIB, ${day}-${month}-${year}`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.header}>Status Pembayaran</h1>

        <div className={styles.cardContent}>
          <div className={styles.leftColumn}>
            <h2 className={styles.sectionTitle}>Detail Pemesanan</h2>
            <p><strong>Nama Pemesan:</strong> {transaction.user?.name}</p>
            <p><strong>Order ID:</strong> {transaction.no_pemesanan}</p>
            <p><strong>Tanggal Pemesanan:</strong> {formatDate(transaction.created_at)}</p>
            <p><strong>Dibayar Pada:</strong> {transaction.paid_at ? formatDate(transaction.paid_at) : '-'}</p>
            <p><strong>Status:</strong> {transaction.payment_status}</p>
          </div>

          <div className={styles.rightColumn}>
            <h2 className={styles.sectionTitle}>Detail Lapangan</h2>
            <ul className={styles.bookingList}>
              {transaction.bookings?.map((booking: any, index: number) => (
                <li key={index} className={styles.bookingItem}>
                  <p><strong>Lapangan:</strong> {booking.court?.name}</p>
                  <p><strong>Tanggal:</strong> {new Date(booking.booking_date).toLocaleDateString('id-ID')}</p>
                  <p><strong>Jam:</strong> {booking.time_slots.join(', ')}</p>
                </li>
              ))}
            </ul>
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
