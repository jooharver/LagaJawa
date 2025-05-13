'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useMemo, useEffect } from 'react';
import styles from './Pembayaran.module.css';

function decodeBookingData(encoded) {
  try {
    return JSON.parse(atob(decodeURIComponent(encoded)));
  } catch (e) {
    return null;
  }
}

function encodeStatusData(data) {
  return encodeURIComponent(btoa(JSON.stringify(data)));
}

function generateBookingId() {
  const random = Math.floor(Math.random() * 900000) + 1100000000; // 6 digit acak
  return `NTR-${random}`;
}

export default function PembayaranPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const encodedData = searchParams.get('data');
  const rawBookingData = useMemo(() => decodeBookingData(encodedData), [encodedData]);

  const [selectedPayment, setSelectedPayment] = useState('qris');
  const [bookingData, setBookingData] = useState(null);

  useEffect(() => {
    if (rawBookingData) {
      const withBookingId = {
        ...rawBookingData,
        bookingId: generateBookingId(),
      };
      setBookingData(withBookingId);
    }
  }, [rawBookingData]);

  if (!bookingData) {
    return <div className={styles.pageWrapper}>Data pemesanan tidak ditemukan atau rusak.</div>;
  }

  const { date, bookings, totalPrice, bookingId } = bookingData;

  const handleBayar = () => {
    const statusData = {
      ...bookingData,
      paymentMethod: selectedPayment,
      status: 'waiting',
      timestamp: new Date().toISOString(),
    };

    const encodedStatus = encodeStatusData(statusData);
    router.push(`/pembayaran/status?data=${encodedStatus}`);
  };

  const paymentMethods = [
    { id: 'qris', label: 'QRIS' },
    { id: 'transfer', label: 'Transfer' },
    { id: 'cod', label: 'COD' },
  ];

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.section}>
        <div className={styles.cardHeader}>
          <h1 className={styles.title}>Konfirmasi Pemesanan</h1>
        </div>
      </div>

      {/* DETAIL PEMESANAN */}
      <div className={styles.section}>
        <div className={styles.card}>
          <h2>Detail Pemesanan</h2>
          <p><strong>Nomor Pemesanan:</strong> {bookingId}</p>
          {bookings.map((b, index) => (
            <div key={index} className={styles.bookingGroup}>
              <p><strong>Lapangan :</strong> {b.court}</p>
              <p><strong>Tanggal  :</strong> {date}</p>
              <p><strong>Jam  :</strong> {b.start} - {b.duration + parseInt(b.start.split(':')[0], 10)}:00</p>
              <p><strong>Durasi :</strong> {b.duration} jam</p>
              <hr />
            </div>
          ))}
          <p className={styles.total}><strong>Total Harga:</strong> Rp{totalPrice.toLocaleString('id-ID')}</p>
        </div>
        <p className={styles.warning}>*Mohon periksa kembali pemesanan Anda</p>
      </div>

      {/* PILIH METODE PEMBAYARAN */}
      <div className={styles.section}>
        <div className={styles.card}>
          <h2>Pilih Metode Pembayaran</h2>
          <div className={styles.paymentOptions}>
            {paymentMethods.map(method => (
              <div
                key={method.id}
                className={`${styles.paymentCard} ${selectedPayment === method.id ? styles.selected : ''}`}
                onClick={() => setSelectedPayment(method.id)}
              >
                {method.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TOMBOL BAYAR */}
      <div className={styles.section}>
        <div className={styles.card}>
          <button className={styles.payButton} onClick={handleBayar}>Bayar Sekarang</button>
        </div>
      </div>
    </div>
  );
}
