'use client';

import { useSearchParams } from 'next/navigation';
import Head from 'next/head';

export default function KonfirmasiPesanan() {
  const searchParams = useSearchParams();

  const date = searchParams.get('date');
  const time = searchParams.get('time');
  const field = searchParams.get('field');
  const duration = searchParams.get('duration');
  const totalPrice = searchParams.get('totalPrice');
  const paymentMethod = searchParams.get('paymentMethod');

  return (
    <>
      <Head>
        <title>Konfirmasi Pesanan</title>
      </Head>
      <div style={{ padding: '20px' }}>
        <h1>Konfirmasi Pesanan Anda</h1>
        {date && time && field && duration && totalPrice && paymentMethod && (
          <div>
            <p>Terima kasih! Pesanan Anda untuk lapangan {field} pada tanggal {date} jam {time} selama {duration} jam sudah diterima.</p>
            <p>Total harga: Rp{totalPrice}.</p>
            <p>Metode pembayaran: {paymentMethod === 'cash' ? 'Cash' : 'QRIS'}.</p>
            <p>{paymentMethod === 'cash' ? 'Silakan bayar di lokasi .' : 'Pembayaran QRIS akan dikirimkan.'}</p>
          </div>
        )}
        {!date && (
          <p>Ada yang salah dengan data Anda, coba ulangi pemesanan Anda.</p>
        )}
      </div>
    </>
  );
}