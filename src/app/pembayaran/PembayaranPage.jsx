'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useMemo } from 'react';
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

export default function PembayaranPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const encodedData = searchParams.get('data');
  const bookingData = useMemo(() => decodeBookingData(encodedData), [encodedData]);

  if (!bookingData) {
    return <div className={styles.pageWrapper}>Data pemesanan tidak ditemukan atau rusak.</div>;
  }

  const { date, bookings, totalPrice } = bookingData;
  const [selectedPayment, setSelectedPayment] = useState('qris');

  const handleBayar = () => {
    const statusData = {
      ...bookingData,
      paymentMethod: selectedPayment,
      status: 'waiting',
      timestamp: new Date().toISOString(),
      orderNumber: 'ORD-' + Math.random().toString(36).substring(2, 10).toUpperCase()
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

      <div className={styles.section}>
        <div className={styles.card}>
          <h2>Detail Pemesanan</h2>
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

      <div className={styles.section}>
        <div className={styles.card}>
          <button className={styles.payButton} onClick={handleBayar}>Bayar Sekarang</button>
        </div>
      </div>
    </div>
  );
}
