'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function StatusPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!orderId) {
      setError('Order ID tidak ditemukan di URL.');
      setLoading(false);
      return;
    }

    const fetchTransaction = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/transactions/by-order/${orderId}`);
        const json = await res.json();

        if (!json.success) {
          setError('Transaksi tidak ditemukan.');
        } else {
          setTransaction(json.data);
        }
      } catch (err) {
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!transaction) return <p>Transaksi tidak ditemukan.</p>;

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '2rem' }}>
      <h1>Status Pembayaran</h1>
      <p><strong>No Pemesanan:</strong> {transaction.no_pemesanan}</p>
      <p><strong>Status:</strong> {transaction.payment_status}</p>
      <p><strong>Total:</strong> Rp {transaction.total_amount.toLocaleString()}</p>

      {transaction.payment_status === 'waiting' && transaction.snap_token && (
        <button
          onClick={handlePayAgain}
          style={{
            marginTop: '1rem',
            background: 'green',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Lanjutkan Pembayaran
        </button>
      )}
    </div>
  );
}
