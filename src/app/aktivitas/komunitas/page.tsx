'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Komunitas.module.css';
import Link from 'next/link';
import Image from 'next/image';

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
    fetch('https://portal.lagajawa.site/api/komunitas')
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
            <Image
              src={`https://portal.lagajawa.site/storage/${item.image_logo}`}
              alt={item.title}
              width={150}
              height={150}
              className={styles.image}
              style={{ borderRadius: "8px" }}
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
