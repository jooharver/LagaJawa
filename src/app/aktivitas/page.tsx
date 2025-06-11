import React, { Suspense } from 'react'; // Import React dan Suspense
import styles from './Aktivitas.module.css';
import Image from 'next/image';

const LazyKomunitasSection = React.lazy(() => import('./KomunitasSection'));
const LazyAcaraSection = React.lazy(() => import('./AcaraSection'));

interface Komunitas {
  id: number;
  title: string;
  image_logo: string;
}

interface Berita {
  id_news: number;
  judul: string;
  tanggal: string;
  image: string;
  kategori: string;
}

// Memaksa halaman ini jadi dynamic agar tidak error saat fetch no-store
export const dynamic = 'force-dynamic';

const getKomunitas = async (): Promise<Komunitas[]> => {
  try {
    const res = await fetch('http://localhost:8000/api/komunitas', {
      cache: 'no-store',
    });

    const result = await res.json();

    if (
      !result ||
      typeof result !== 'object' ||
      result.success !== true ||
      !result.data ||
      !Array.isArray(result.data.data)
    ) {
      console.error('Struktur JSON komunitas tidak valid:', result);
      throw new Error('Format data komunitas tidak valid');
    }

    return result.data.data;
  } catch (err) {
    console.error('Gagal fetch komunitas:', err);
    return [];
  }
};

const getBeritaEvent = async (): Promise<Berita[]> => {
  try {
    const res = await fetch('http://localhost:8000/api/news', {
      cache: 'no-store',
    });

    const result = await res.json();

    if (
      !result ||
      typeof result !== 'object' ||
      result.success !== true ||
      !result.data ||
      !Array.isArray(result.data.data)
    ) {
      console.error('Struktur JSON berita tidak valid:', result);
      throw new Error('Format data berita tidak valid');
    }

    // Ambil hanya kategori 'event'
    const eventBerita = result.data.data.filter(
      (item: any) => item.kategori === 'event'
    );

    return eventBerita;
  } catch (err) {
    console.error('Gagal fetch berita:', err);
    return [];
  }
};

export default async function AktivitasPage() {
  const [komunitas, acara] = await Promise.all([
    getKomunitas(),
    getBeritaEvent(),
  ]);

  return (
    <>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <h1>Aktivitas LJ Futsal</h1>
            <p>Jelajahi berbagai komunitas dan acara yang ada di LJ Futsal.</p>
          </div>
        </div>
      </section>

      <main className={styles.container}>
        {/* Komunitas Section */}
        <Suspense fallback={<div>Memuat komunitas...</div>}>
          <LazyKomunitasSection komunitas={komunitas} />
        </Suspense>

        {/* Acara Section */}
        <Suspense fallback={<div>Memuat acara...</div>}>
          <LazyAcaraSection acara={acara} />
        </Suspense>
      </main>
    </>
  );
}
