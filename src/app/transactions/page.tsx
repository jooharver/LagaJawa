'use client';
import { useEffect, useState } from "react";
import styles from './transaction.module.css';
import { useRouter } from "next/navigation";

type Transaction = {
  id_transaction: number;
  no_pemesanan: string;
  payment_method: 'qris' | 'transfer' | 'cod' | string;
  total_amount: number;
  payment_status: 'waiting' | 'paid' | 'failed' | string;
  paid_at: string | null;
  created_at: string;
};

export default function Transactions() {
  const router = useRouter();
  const [originalTransactions, setOriginalTransactions] = useState<Transaction[]>([]);
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const mapPaymentStatusLabel = (status: string) => {
    switch (status) {
      case 'waiting': return 'Menunggu Pembayaran';
      case 'paid': return 'Sudah Dibayar';
      case 'failed': return 'Gagal Bayar';
      default: return status;
    }
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      const token = localStorage.getItem('token');
      setIsLoading(true);

      try {
        const res = await fetch('https://portal.lagajawa.site/api/transactions', {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        });

        if (!res.ok) {
          const errorText = await res.text();
          console.error('Gagal fetch:', res.status, errorText);
          setOriginalTransactions([]);
          return;
        }

        const result = await res.json();
        console.log('Hasil transaksi:', result);

        const data = Array.isArray(result.data?.data) ? result.data.data : [];
        setOriginalTransactions(data);
      } catch (err) {
        console.error('Fetch error:', err);
        setOriginalTransactions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // Filter hanya berdasarkan status pembayaran
  const filteredTransactions = originalTransactions.filter((trx) =>
    paymentStatusFilter ? trx.payment_status === paymentStatusFilter : true
  );

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Riwayat Transaksi</h1>

      <div className={styles.filterContainer}>
        <select
          className={styles.select}
          value={paymentStatusFilter}
          onChange={(e) => setPaymentStatusFilter(e.target.value)}
        >
          <option value="">Semua Status Pembayaran</option>
          <option value="waiting">Menunggu Pembayaran</option>
          <option value="paid">Sudah Dibayar</option>
          <option value="failed">Gagal Bayar</option>
        </select>
      </div>

      {isLoading ? (
        <p className={styles.loading}>Loading...</p>
      ) : filteredTransactions.length === 0 ? (
        <p className={styles.emptyMessage}>Tidak ada transaksi dengan status yang dipilih.</p>
      ) : (
        <div className={styles.cardContainer}>
          {filteredTransactions.map((trx) => (
            <div key={trx.id_transaction} className={styles.card}>
              <div className={styles.cardHeader}>
                <span>{new Date(trx.created_at).toLocaleString('id-ID')}</span>
                <span className={`${styles.status} ${styles[trx.payment_status]}`}>
                  {mapPaymentStatusLabel(trx.payment_status)}
                </span>
              </div>
              <div className={styles.detailsGrid}>
                <div>No Pemesanan: {trx.no_pemesanan}</div>
                <div>Metode: {trx.payment_method.toUpperCase()}</div>
                <div>Total: Rp {trx.total_amount.toLocaleString('id-ID')}</div>
                <div>
                  Dibayar: {trx.payment_status === 'paid'
                    ? (trx.paid_at ? new Date(trx.paid_at).toLocaleString('id-ID') : 'Sudah Dibayar')
                    : 'Belum Dibayar'}
                </div>
              </div>
              <button
                onClick={() => router.push(`/transactions/${trx.id_transaction}`)}
                className={styles.detailButton}
              >
                Lihat Rincian
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
