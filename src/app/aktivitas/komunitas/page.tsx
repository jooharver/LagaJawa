'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Komunitas.module.css';
import Link from 'next/link';

interface Komunitas {
  id: number;
  title: string;
  image_logo: string;
  // bisa tambah properti lain sesuai kebutuhan
}

export default function KomunitasPage() {
  const [komunitas, setKomunitas] = useState<Komunitas[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const router = useRouter();

  useEffect(() => {
    fetch('http://localhost:8000/api/komunitas')
      .then((res) => res.json())
      .then((response) => {
        // Ambil data komunitas yang sebenarnya ada di response.data.data
        if (response && response.data && Array.isArray(response.data.data)) {
          setKomunitas(response.data.data);
        } else {
          setKomunitas([]);
          console.error('Format data API tidak sesuai:', response);
        }
      })
      .catch((error) => {
        console.error('Gagal mengambil data komunitas:', error);
      });
  }, []);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const paginatedData = komunitas.slice(startIndex, endIndex);

  const handleDetail = (id: number) => {
    router.push(`/aktivitas/komunitas/${id}`); // Sesuaikan route detail komunitas
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (endIndex < komunitas.length) setCurrentPage(currentPage + 1);
  };

  return (
    <div className={styles.container}>
      <section className={styles.header}>
        <h1 className={styles.title}>Daftar Komunitas</h1>
        <p className={styles.description}>
          Pilih komunitas yang ingin kamu lihat detailnya
        </p>
      </section>

      <section className={styles.grid}>
        {paginatedData.map((item) => (
          <div
            key={item.id}
            className={styles.card}
            onClick={() => handleDetail(item.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleDetail(item.id);
            }}
          >
            <img
                src={`http://localhost:8000/storage/${item.image_logo}`}
                alt={item.title}
                width={160}
                height={160}
                className={styles.image}
            />
            <h3 className={styles.cardTitle}>{item.title}</h3>
          </div>
        ))}
      </section>

      <section className={styles.pagination}>
        <button onClick={handlePrev} disabled={currentPage === 1}>
          Sebelumnya
        </button>
        <button onClick={handleNext} disabled={endIndex >= komunitas.length}>
          Selanjutnya
        </button>
      </section>
    </div>
  );
}
