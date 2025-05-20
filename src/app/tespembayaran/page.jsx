'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useMemo, useEffect } from 'react';
import styles from './TesPembayaran.module.css';

function decodeBookingData(encoded) {
  try {
    return JSON.parse(atob(decodeURIComponent(encoded)));
  } catch (e) {
    return null;
  }
}

// Helper agar waktu selalu lengkap format "HH:mm:ss"
const ensureHmsFormat = (timeStr) => {
  const parts = timeStr.split(':');

  let h = parts[0].padStart(2, '0');
  let m = parts[1] ? parts[1].padStart(2, '0') : '00';
  let s = parts[2] ? parts[2].padStart(2, '0') : '00';

  return `${h}:${m}:${s}`;
};

export default function TesPembayaranPage() {
  const searchParams = useSearchParams();
  const encodedData = searchParams.get('data');
  const rawBookingData = useMemo(() => decodeBookingData(encodedData), [encodedData]);

  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('transfer');

  useEffect(() => {
    if (rawBookingData) {
      setBookingData(rawBookingData);
    }
  }, [rawBookingData]);

  if (!bookingData) {
    return <div className={styles.pageWrapper}>Data pemesanan tidak ditemukan atau rusak.</div>;
  }

  const { date, bookings, totalPrice } = bookingData;

  // Format jam ke "HH:00:00"
  const formatHourToHms = (hour) => {
    const h = hour.toString().padStart(2, '0');
    return `${h}:00:00`;
  };

  const calculateEndTime = (startTime, duration) => {
    const startHour = parseInt(startTime.split(':')[0], 10);
    const endHour = (startHour + duration) % 24;
    return formatHourToHms(endHour);
  };
  
  const handleBayar = async () => {
    setLoading(true);
    try {
      // Gabungkan semua slot waktu dari semua booking (bisa beda lapangan)
      const allTimeSlots = bookings
        .flatMap((b) => b.time_slots)
        .map(ensureHmsFormat)
        .sort();
  
      // Group booking per court dengan time slots
      const groupedBookings = {};
      for (const b of bookings) {
        const courtId = b.court_id;
        if (!groupedBookings[courtId]) groupedBookings[courtId] = new Set();
        b.time_slots.forEach(slot => groupedBookings[courtId].add(slot));
      }
  
      // Buat array booking detail yang dikirim ke backend
      const bookingDetails = Object.entries(groupedBookings).map(([courtId, slotSet]) => ({
        court_id: parseInt(courtId, 10),
        time_slots: Array.from(slotSet).map(ensureHmsFormat).sort(),
      }));
  
      const transactionPayload = {
        requester_id: 1, // ganti sesuai user login nanti
        booking_date: date,
        payment_method: paymentMethod,
        bookings: bookingDetails,
        total_price: totalPrice,
      };
  
      console.log('Mengirim transaksi:', transactionPayload);
  
      const res = await fetch('http://localhost:8000/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transactionPayload),
      });
  
      const text = await res.text();
      console.log('Response API transaksi status:', res.status);
      console.log('Response API transaksi text:', text);
  
      let json;
      try {
        json = JSON.parse(text);
      } catch (e) {
        throw new Error(`Gagal parsing JSON dari response transaksi: ${e.message}`);
      }
  
      if (!res.ok) throw new Error(json.message || 'Gagal melakukan transaksi');
  
      alert('Transaksi berhasil!');
  
      // Jika mau redirect ke halaman lain, bisa di sini
      // router.push('/somepage');
  
    } catch (error) {
      alert(`Terjadi kesalahan: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };  

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
          {bookings.map((b, index) => {
            const start = ensureHmsFormat(b.time_slots[0]);
            const duration = b.time_slots.length;
            const end = calculateEndTime(start, duration);

            return (
              <div key={`${b.court_id}-${start}-${index}`} className={styles.bookingGroup}>
                <p><strong>Lapangan :</strong> {b.court}</p>
                <p><strong>Tanggal  :</strong> {date}</p>
                <p><strong>Jam      :</strong> {start} - {end}</p>
                <p><strong>Durasi   :</strong> {duration} jam</p>
                <hr />
              </div>
            );
          })}
          <p className={styles.total}><strong>Total Harga:</strong> Rp{totalPrice.toLocaleString('id-ID')}</p>
        </div>
        <p className={styles.warning}>*Mohon periksa kembali pemesanan Anda</p>
      </div>

      {/* PEMILIHAN METODE + TOMBOL BAYAR */}
      <div className={styles.section}>
        <div className={styles.card}>
          <label htmlFor="paymentMethod"><strong>Metode Pembayaran:</strong></label>
          <select
            id="paymentMethod"
            className={styles.select}
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="transfer">Transfer Bank</option>
            <option value="qris">QRIS</option>
            <option value="cod">Bayar di Tempat (COD)</option>
          </select>

          <button
            className={styles.payButton}
            onClick={handleBayar}
            disabled={loading}
          >
            {loading ? 'Memproses...' : 'Tes Booking Sekarang'}
          </button>
        </div>
      </div>
    </div>
  );
}
