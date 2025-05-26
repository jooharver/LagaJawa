'use client';
import { useEffect, useState } from "react";
import axios from "axios";
import styles from './transaction.module.css';
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

type Transaction = {
  id: number;
  tanggal: string;
  lapangan: string;
  harga: number;
  status: 'berhasil' | 'gagal';
};

export default function Transactions() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [bookingDetails, setBookingDetails] = useState<Transaction | null>(null);

  useEffect(() => {
    axios.get("/api/riwayat-transaksi", {
      params: { status: statusFilter, tanggal: selectedDate }
    }).then(res => setTransactions(res.data.data));
  }, [statusFilter, selectedDate]);

  const fetchBookingDetails = async (id: number) => {
      try {
        const res = await axios.get(`http://localhost:8000/api/bookings/${id}`);
        setBookingDetails(res.data);
        setSelectedTransaction(transactions.find(trx => trx.id === id) || null);
      } catch (err) {
        console.error("Gagal mengambil detail booking:", err);
      }
    };


  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Riwayat Transaksi</h1>

      <div className={styles.filters}>
        <select className={styles.select} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">Semua Status</option>
          <option value="berhasil">Berhasil</option>
          <option value="gagal">Gagal</option>
        </select>

        <input
          type="date"
          className={styles.input}
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      {transactions.map(trx => (
        <div key={trx.id} className={styles.transactionCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>{new Date(trx.tanggal).toLocaleString('id-ID')}</span>
            <span className={`${styles.status} ${styles[trx.status]}`}>
              {trx.status.toUpperCase()}
            </span>
          </div>
          <div>Lapangan: {trx.lapangan}</div>
          <div>Harga: Rp {trx.harga.toLocaleString("id-ID")}</div>
          <button
            onClick={() => router.push(`/transaksi/${trx.id}`)}
            className={styles.detailButton}
          >
            Lihat Rincian
          </button>
          
        </div>
      ))}
    </div>
  );
}
