'use client';

import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from './Status.module.css';

function decodeBookingData(encoded) {
  try {
    return JSON.parse(atob(decodeURIComponent(encoded)));
  } catch (e) {
    return null;
  }
}

export default function StatusPage() {
  const searchParams = useSearchParams();
  const encodedData = searchParams.get('data');
  const data = useMemo(() => decodeBookingData(encodedData), [encodedData]);

  const [timeRemaining, setTimeRemaining] = useState(15 * 60); // 15 menit
  const [status, setStatus] = useState('waiting for payment');

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

  if (!data) {
    return <div className={styles.pageWrapper}>Data tidak valid atau rusak.</div>;
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        {/* Card Header */}
        <div className={styles.cardHeader}>
          <h1 className={styles.title}>Status Pembayaran</h1>
          <hr />
        </div>

        {/* Rincian Pemesanan */}
        <div className={styles.card}>
          <h3>Rincian Pemesanan</h3>
          <div className={styles.bookingDetails}>
          <p><strong>Nomor Pemesanan:</strong> {data.bookingId}</p>
            <p><strong>Tanggal:</strong> {data.date}</p>
            <p><strong>Metode Pembayaran:</strong> {data.paymentMethod.toUpperCase()}</p>
            {data.bookings.map((b, i) => (
              <div key={i} className={styles.bookingItem}>
                <p><strong>Lapangan:</strong> {b.court}</p>
                <p><strong>Jam:</strong> {b.start} - {b.duration + parseInt(b.start.split(':')[0])}:00</p>
                <p><strong>Durasi:</strong> {b.duration} jam</p>
                <hr />
              </div>
            ))}
            <p><strong>Total Harga:</strong> Rp {data.totalPrice.toLocaleString('id-ID')}</p>
          </div>
        </div>

        {/* QRIS or Other Payment Instructions */}
        <div className={styles.qrisContainer}>
          {data.paymentMethod === 'qris' && (
            <div className={styles.qrisInfo}>
              <img src="/images/qr-code.png" alt="QRIS" className={styles.qrisImage} />
              <p>Silahkan scan atau screenshot QRIS untuk melakukan pembayaran.</p>
            </div>
          )}
          {data.paymentMethod === 'transfer' && (
            <div className={styles.transferInfo}>
              <p>Silakan transfer ke rekening BCA 123456789 a.n. LJ Futsal.</p>
            </div>
          )}
          {data.paymentMethod === 'cod' && (
            <div className={styles.codInfo}>
              <p>Bayar langsung di tempat saat datang.</p>
            </div>
          )}
        </div>

        {/* Timer */}
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

        {/* Admin Contact Card */}
        <div className={styles.cardAdmin}>
          <p className={styles.adminMessage}>Jika ada kendala, harap hubungi admin.</p>
          <a
            href="https://wa.me/087870463683" // Replace with your admin's WhatsApp number
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
