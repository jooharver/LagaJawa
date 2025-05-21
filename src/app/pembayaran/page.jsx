'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useMemo, useEffect } from 'react';
import styles from './Pembayaran.module.css';

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

export default function PembayaranPage() {
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
  
      // --- STEP 1: Buat booking + payment otomatis via POST /api/bookings ---
      // Karena backend buat payment otomatis, kita kirim payload booking per court (karena booking per lapangan)
      // Namun, sebelumnya kita akan buat booking untuk semua lapangan secara paralel
  
      // Grouping time_slots per court_id
      const groupedBookings = {};
      for (const b of bookings) {
        const courtId = b.court_id;
        if (!groupedBookings[courtId]) groupedBookings[courtId] = new Set();
        b.time_slots.forEach(slot => groupedBookings[courtId].add(slot));
      }
  
      // Array untuk simpan promise booking
      const bookingRequests = Object.entries(groupedBookings).map(async ([courtId, slotSet]) => {
        const timeSlotsHms = Array.from(slotSet).map(ensureHmsFormat).sort();
  
        const bookingPayload = {
          requester_id: 1, // sesuaikan user login nanti
          court_id: parseInt(courtId, 10),
          booking_date: date,
          time_slots: timeSlotsHms,
          // Jangan kirim payment_id dan payment_method karena backend buat otomatis
        };
  
        console.log(`Mengirim booking untuk court ${courtId}:`, bookingPayload);
  
        const res = await fetch('http://localhost:8000/api/bookings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bookingPayload),
        });
  
        const text = await res.text();
        console.log(`Booking API response status (Court ${courtId}):`, res.status);
        console.log(`Booking API response text (Court ${courtId}):`, text);
  
        if (!res.ok) {
          // Coba parse json error
          let errMsg = text;
          try {
            const json = JSON.parse(text);
            errMsg = json.message || text;
          } catch {}
          throw new Error(`Gagal booking Court ${courtId}: ${errMsg}`);
        }
  
        let json;
        try {
          json = JSON.parse(text);
        } catch {
          throw new Error(`Response bukan JSON dari booking Court ${courtId}: ${text}`);
        }
  
        return json;
      });
  
      // Tunggu semua booking selesai
      const bookingResults = await Promise.all(bookingRequests);
  
      // --- STEP 2: Ambil payment_id dari salah satu booking (anggap semua sama payment_id) ---
      const paymentId = bookingResults[0]?.data?.payment_id;
      if (!paymentId) throw new Error('payment_id tidak ditemukan dari response booking');
  
      console.log('Payment ID didapat dari booking:', paymentId);
  
      // --- STEP 3: Update payment_method via PUT /api/payments/{paymentId} ---
      const updatePaymentPayload = { payment_method: paymentMethod };
      console.log('Mengupdate payment_method:', updatePaymentPayload);
  
      const paymentUpdateRes = await fetch(`http://localhost:8000/api/payments/${paymentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatePaymentPayload),
      });
  
      const paymentUpdateText = await paymentUpdateRes.text();
      console.log('Update Payment API response status:', paymentUpdateRes.status);
      console.log('Update Payment API response text:', paymentUpdateText);
  
      if (!paymentUpdateRes.ok) {
        let errMsg = paymentUpdateText;
        try {
          const json = JSON.parse(paymentUpdateText);
          errMsg = json.message || paymentUpdateText;
        } catch {}
        throw new Error(`Gagal update payment_method: ${errMsg}`);
      }
  
      alert('Booking dan pembayaran berhasil diproses!');
    } catch (error) {
      console.error(error);
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
