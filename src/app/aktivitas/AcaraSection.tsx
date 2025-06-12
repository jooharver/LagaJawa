'use client'; // Menandakan ini adalah Client Component

import Link from 'next/link';
import Image from 'next/image';
import styles from './Aktivitas.module.css'; // Menggunakan CSS yang sama

interface Berita {
  id_news: number;
  judul: string;
  tanggal: string;
  image: string;
  kategori: string;
}

interface AcaraSectionProps {
  acara: Berita[];
}

export default function AcaraSection({ acara }: AcaraSectionProps) {
  return (
    <section className={styles.section}>
      <h2>Acara Terbaru</h2>
      <p>Ikuti acara-acara seru yang akan datang!</p>
      <div className={styles.itemGrid}>
        {/* Tampilkan hingga 5 item acara pertama */}
        {acara.slice(0, 5).map((item) => (
          <Link
            key={item.id_news}
            href={`/aktivitas/acara/${item.id_news}`}
            className={styles.aktivitasCard}
          >
            <Image
              src={`http://localhost:8000/storage/${item.image}`}
              alt={item.judul}
              width={100} // Sesuaikan ukuran sesuai styling
              height={100}
              className={styles.cardImage}
              priority={false} // Tidak memprioritaskan pemuatan gambar ini secara eager
            />
            <p className={styles.cardTitle}>{item.judul}</p>
          </Link>
        ))}
      </div>
      <Link href="/aktivitas/acara" className={styles.moreButton}>
        Selengkapnya
      </Link>
    </section>
  );
}
