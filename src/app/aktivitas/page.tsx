import styles from './Aktivitas.module.css';
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
      <section className={styles.section}>
        <h2>Komunitas</h2>
        <p>Berbagai komunitas futsal aktif yang dapat kamu ikuti kegiatannya.</p>
        <div className={styles.itemGrid}>
          {komunitas.slice(0, 5).map((item) => ( 
            <Link key={item.id} href={`/aktivitas/komunitas/${item.id}`} className={styles.aktivitasCard}>
              <img src={`http://localhost:8000/storage/${item.image_logo}`} alt={item.title} className={styles.cardImage} />
              <p className={styles.cardTitle}>{item.title}</p>
            </Link>
          ))}
        </div>
        <Link href="/aktivitas/komunitas" className={styles.moreButton}>Selengkapnya</Link>
      </section>

      {/* Acara Section */}
      <section className={styles.section}>
        <h2>Acara Terbaru</h2>
        <p>Ikuti acara-acara seru yang akan datang!</p>
        <div className={styles.itemGrid}>
          {acara.slice(0, 5).map((item) => ( 
            <Link key={item.id_news} href={`/aktivitas/acara/${item.id_news}`} className={styles.aktivitasCard}>
              <img src={`http://localhost:8000/storage/${item.image}`} alt={item.judul} className={styles.cardImage} />
              <p className={styles.cardTitle}>{item.judul}</p>
            </Link>
          ))}
        </div>
        <Link href="/aktivitas/acara" className={styles.moreButton}>Selengkapnya</Link>
      </section>
    </main>
    </>
  );
}
