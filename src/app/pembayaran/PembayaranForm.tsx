'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useMemo, useEffect } from 'react';
import styles from './Pembayaran.module.css';
import {jwtDecode} from 'jwt-decode';

type JwtPayload = {
  userId: number;
};

function decodeBookingData(encoded: string) {
  try {
    return JSON.parse(atob(decodeURIComponent(encoded)));
  } catch (e) {
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
  const rawBookingData = useMemo(() => decodeBookingData(encodedData || ''), [encodedData]);

  const [bookingData, setBookingData] = useState<any>(null);
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

  const formatHourToHms = (hour: number | string) => {
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
    let transactionId: number | null = null;

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token tidak ditemukan. Anda harus login terlebih dahulu.');

      const decoded = jwtDecode<JwtPayload>(token);
      const userId = decoded.userId;

      const transactionPayload = {
        user_id: userId,
        payment_method: paymentMethod,
      };

      const transactionRes = await fetch('https://portal.lagajawa.site/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transactionPayload),
      });

      const transactionData = await transactionRes.json();
      console.log('Response transaksi:', transactionData);

      if (!transactionRes.ok) {
        let errMsg = transactionData.message || JSON.stringify(transactionData);
        throw new Error(`Gagal membuat transaksi: ${errMsg}`);
      }

      transactionId =
        transactionData.data?.transaction?.id_transaction ??
        transactionData.data?.id_transaction ??
        transactionData.id_transaction;

      if (!transactionId) throw new Error('id_transaction tidak ditemukan');
      console.log('id_transaction:', transactionId);

      const groupedBookings: Record<string, Set<string>> = {};
      for (const b of bookings) {
        const courtId = b.court_id;
        if (!groupedBookings[courtId]) groupedBookings[courtId] = new Set();
        b.time_slots.forEach((slot: string) => groupedBookings[courtId].add(slot));
      }

      const bookingRequests = Object.entries(groupedBookings).map(async ([courtId, slotSet]) => {
        const timeSlotsHms = Array.from(slotSet).map(ensureHmsFormat).sort();

        const bookingPayload = {
          court_id: parseInt(courtId, 10),
          booking_date: date,
          time_slots: timeSlotsHms,
          transaction_id: transactionId,
        };

        console.log(`Mengirim booking untuk court ${courtId}:`, bookingPayload);

        const res = await fetch('https://portal.lagajawa.site/api/bookings', {
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

      const bookingResults = await Promise.all(bookingRequests);
      console.log('Hasil booking:', bookingResults);

      const snapResponse = await fetch(`https://portal.lagajawa.site/api/transactions/${transactionId}/generate-snap`);
      const snapData = await snapResponse.json();
      if (!snapData.success) throw new Error(snapData.message);

      if (paymentMethod === 'cod') {
        alert('Transaksi berhasil dibuat dengan metode COD.\nSilakan tunggu konfirmasi admin.');
        window.location.href = `https://lagajawa.site/pembayaran/status?order_id=${snapData.data.transaction.no_pemesanan}`;
      } else if (snapData.data.snap_token) {
        window.location.href = `https://app.sandbox.midtrans.com/snap/v2/vtweb/${snapData.data.snap_token}`;
      } else {
        throw new Error('Snap token tidak ditemukan untuk metode pembayaran selain COD.');
      }

    } catch (error: any) {
      console.error(error);

      if (transactionId) {
        try {
          await fetch(`https://portal.lagajawa.site/api/transactions/${transactionId}`, {
            method: 'DELETE',
          });
          console.log(`Transaksi ${transactionId} dibatalkan karena gagal booking.`);
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
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="transfer">Transfer Bank</option>
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
