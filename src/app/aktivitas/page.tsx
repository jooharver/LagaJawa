import styles from './Aktivitas.module.css';
import AutoCarousel from '@/app/components/AutoCarousel';
import Link from 'next/link';

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
  const komunitas = await getKomunitas();
  const acara = await getBeritaEvent();

  return (
    <main className={styles.container}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroText}>
          <h1>Aktivitas Laga Jawa</h1>
          <p>Jelajahi komunitas dan acara futsal terbaik dari berbagai penjuru Jawa.</p>
        </div>
        <div className={styles.heroImage}>
          <img src="/images/Futsal.jpg" alt="Aktivitas" />
        </div>
      </section>

      {/* Komunitas Section */}
      <section className={styles.section}>
        <h2>Komunitas</h2>
        <p>Berbagai komunitas futsal aktif yang dapat kamu ikuti dan ikuti kegiatannya.</p>
        <AutoCarousel
          items={komunitas.slice(0,5).map((item) => ({
            id: item.id,
            title: item.title,
            image: `http://localhost:8000/storage/${item.image_logo}`,
            link: `/aktivitas/komunitas/${item.id}`,
          }))}
          interval={4000}
          itemWidth="160px"
        />
        <Link href="/aktivitas/komunitas" className={styles.moreButton}>Lihat Selengkapnya</Link>
      </section>

      {/* Acara Section */}
      <section className={styles.section}>
        <h2>Acara Terbaru</h2>
        <p>Ikuti acara-acara seru yang akan datang!</p>
        <AutoCarousel
          items={acara.slice(0,5).map((item) => ({
            id: item.id_news,
            title: item.judul,
            image: `http://localhost:8000/storage/${item.image}`,
            link: `/aktivitas/acara/${item.id_news}`,
          }))}
            interval={4000}
            itemWidth="160px"
        />
        <Link href="/aktivitas/acara" className={styles.moreButton}>Lihat Selengkapnya</Link>
      </section>
    </main>
  );
}
