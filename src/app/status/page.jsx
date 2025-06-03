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

  const [timeRemaining, setTimeRemaining] = useState(15 * 60); // 15 menit
  const [status, setStatus] = useState('waiting for payment');

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/transactions/by-order/${orderId}`);
        const data = await res.json();
        if (!data.success) throw new Error(data.message);
        setTransaction(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchTransaction();
    } else {
      setError('Order ID tidak ditemukan.');
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setStatus('payment expired');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  if (loading) return <div className={styles.pageWrapper}>Loading...</div>;
  if (error) return <div className={styles.pageWrapper}><p style={{ color: 'red' }}>{error}</p></div>;
  if (!transaction) return <div className={styles.pageWrapper}>Transaksi tidak ditemukan.</div>;

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <div className={styles.cardHeader}>
          <h1 className={styles.title}>Status Pembayaran</h1>
          <hr />
        </div>

        <div className={styles.card}>
          <h3>Rincian Pemesanan</h3>
          <div className={styles.bookingDetails}>
            <p><strong>Nomor Pemesanan:</strong> {transaction.no_pemesanan}</p>
            <p><strong>Status Pembayaran:</strong> {transaction.payment_status}</p>
            <p><strong>Status Transaksi:</strong> {transaction.status}</p>
            <p><strong>Metode Pembayaran:</strong> {transaction.payment_method.toUpperCase()}</p>

            {transaction.bookings?.map((b, i) => (
              <div key={i} className={styles.bookingItem}>
                <p><strong>Lapangan:</strong> {b.court?.name || b.court_id}</p>
                <p><strong>Tanggal:</strong> {b.booking_date}</p>
                <p><strong>Jam:</strong> {b.start_time} - {b.end_time}</p>
                <p><strong>Durasi:</strong> {b.duration} jam</p>
                <hr />
              </div>
            ))}

            <p><strong>Total Harga:</strong> Rp {transaction.total_amount.toLocaleString('id-ID')}</p>
          </div>
        </div>

        <div className={styles.qrisContainer}>
          {transaction.payment_method === 'qris' && (
            <div className={styles.qrisInfo}>
              <img src="/images/qr-code.png" alt="QRIS" className={styles.qrisImage} />
              <p>Silahkan scan atau screenshot QRIS untuk melakukan pembayaran.</p>
            </div>
          )}
          {transaction.payment_method === 'transfer' && (
            <div className={styles.transferInfo}>
              <p>Silakan transfer ke rekening BCA 123456789 a.n. LJ Futsal.</p>
            </div>
          )}
          {transaction.payment_method === 'cod' && (
            <div className={styles.codInfo}>
              <p>Bayar langsung di tempat saat datang.</p>
            </div>
          )}
        </div>

        <div className={styles.cardTimer}>
          <h2>Status: {status}</h2>
          {status === 'waiting for payment' && (
            <div className={styles.timer}>
              <p>Waktu tersisa: {formatTime(timeRemaining)}</p>
            </div>
          )}
          {status === 'payment expired' && (
            <p>Waktu pembayaran telah habis. Silakan lakukan pemesanan ulang.</p>
          )}
        </div>

        <div className={styles.cardAdmin}>
          <p className={styles.adminMessage}>Jika ada kendala, harap hubungi admin.</p>
          <a
            href="https://wa.me/087870463683"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.whatsappButton}
          >
            Hubungi Admin via WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
