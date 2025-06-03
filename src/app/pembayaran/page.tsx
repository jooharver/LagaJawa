'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useMemo, useEffect } from 'react';
import styles from './Pembayaran.module.css';

function decodeBookingData(encoded: string | null) {
  try {
    if (!encoded) return null;
    return JSON.parse(atob(decodeURIComponent(encoded)));
  } catch {
    return null;
  }
}

function formatTimeSlot(time: string) {
  const [hour, minute] = time.split(':');
  const formattedHour = hour.padStart(2, '0');
  return `${formattedHour}:${minute}`;
}

const ensureHmsFormat = (timeStr: string) => {
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

  const [bookingData, setBookingData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('transfer');

  useEffect(() => {
    if (rawBookingData) setBookingData(rawBookingData);
  }, [rawBookingData]);

  if (!bookingData) {
    return <div className={styles.pageWrapper}>Data pemesanan tidak ditemukan atau rusak.</div>;
  }

  const { date, bookings, totalPrice } = bookingData;

  const formatHourToHms = (hour: number) => {
    const h = hour.toString().padStart(2, '0');
    return `${h}:00:00`;
  };

  const calculateEndTime = (startTime: string, duration: number) => {
    const startHour = parseInt(startTime.split(':')[0], 10);
    const endHour = (startHour + duration) % 24;
    return formatHourToHms(endHour);
  };

  const handleBayar = async () => {
    setLoading(true);

    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (!user?.id) {
        alert("User tidak ditemukan. Silakan login ulang.");
        setLoading(false);
        return;
      }

      // Payload transaksi dengan user_id dari localStorage
      const transactionPayload = {
        user_id: user.id,
        payment_method: paymentMethod,
      };

      const transactionRes = await fetch('http://localhost:8000/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transactionPayload),
      });

      const transactionData = await transactionRes.json();

      if (!transactionRes.ok) {
        const errMsg = transactionData.message || JSON.stringify(transactionData);
        throw new Error(`Gagal membuat transaksi: ${errMsg}`);
      }

      const transactionId =
        transactionData.data?.transaction?.id_transaction ??
        transactionData.data?.id_transaction ??
        transactionData.id_transaction;

      if (!transactionId) throw new Error('id_transaction tidak ditemukan');

      // Group booking berdasarkan court_id
      const groupedBookings: Record<string, Set<string>> = {};
      for (const b of bookings) {
        const courtId = b.court_id;
        if (!groupedBookings[courtId]) groupedBookings[courtId] = new Set();
        b.time_slots.forEach((slot: string) => groupedBookings[courtId].add(slot));
      }

      // Kirim booking tiap court
      const bookingRequests = Object.entries(groupedBookings).map(async ([courtId, slotSet]) => {
        const timeSlotsHms = Array.from(slotSet).map(ensureHmsFormat).sort();

        const bookingPayload = {
          court_id: parseInt(courtId, 10),
          booking_date: date,
          time_slots: timeSlotsHms,
          transaction_id: transactionId,
        };

        const res = await fetch('http://localhost:8000/api/bookings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bookingPayload),
        });

        const text = await res.text();
        if (!res.ok) {
          let errMsg = text;
          try {
            const json = JSON.parse(text);
            errMsg = json.message || text;
          } catch {}
          throw new Error(`Gagal booking Court ${courtId}: ${errMsg}`);
        }

        return JSON.parse(text);
      });

      await Promise.all(bookingRequests);

      alert('Booking dan transaksi berhasil diproses!');
    } catch (error: any) {
      console.error(error);

      if (error instanceof Error && error.message.includes('transactionId')) {
        try {
          await fetch(`http://localhost:8000/api/transactions/${error.message}`, {
            method: 'DELETE',
          });
        } catch (err) {
          console.error('Gagal menghapus transaksi:', err);
        }
      }

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

      <div className={styles.section}>
        <div className={styles.card}>
          <h2>Detail Pemesanan</h2>
          {bookings.map((b: any, index: number) => {
            const start = ensureHmsFormat(b.time_slots[0]);
            const duration = b.time_slots.length;
            const end = calculateEndTime(start, duration);

            return (
              <div key={`${b.court_id}-${start}-${index}`} className={styles.bookingGroup}>
                <p><strong>Lapangan :</strong> {b.court}</p>
                <p><strong>Jenis    :</strong> {b.type}</p>
                <p><strong>Tanggal  :</strong> {date}</p>
                <p><strong>Slot Waktu :</strong> {b.time_slots.map(formatTimeSlot).join(', ')}</p>
                <p><strong>Jam      :</strong> {start} - {end}</p>
                <p><strong>Durasi   :</strong> {duration} jam</p>
                <p><strong>Amount   :</strong> Rp{b.amount.toLocaleString('id-ID')}</p>
                <hr />
              </div>
            );
          })}
          <p className={styles.total}><strong>Total Harga:</strong> Rp{totalPrice.toLocaleString('id-ID')}</p>
        </div>
        <p className={styles.warning}>*Mohon periksa kembali pemesanan Anda</p>
      </div>

      <div className={styles.section}>
        <div className={styles.card}>
          <label htmlFor="paymentMethod"><strong>Metode Pembayaran:</strong></label>
          <select
            id="paymentMethod"
            className={styles.select}
            value={paymentMethod}
            onChange={e => setPaymentMethod(e.target.value)}
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
            {loading ? 'Memproses...' : 'Bayar Sekarang'}
          </button>
        </div>
      </div>
    </div>
  );
}
