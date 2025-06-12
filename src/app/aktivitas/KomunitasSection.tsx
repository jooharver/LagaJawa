'use client'; // Menandakan ini adalah Client Component

import Link from 'next/link';
import Image from 'next/image';
import styles from './Aktivitas.module.css'; // Menggunakan CSS yang sama

interface Komunitas {
  id: number;
  title: string;
  image_logo: string;
}

interface KomunitasSectionProps {
  komunitas: Komunitas[];
}

export default function KomunitasSection({ komunitas }: KomunitasSectionProps) {
  return (
    <section className={styles.section}>
      <h2>Komunitas</h2>
      <p>Berbagai komunitas futsal aktif yang dapat kamu ikuti kegiatannya.</p>
      <div className={styles.itemGrid}>
        {/* Tampilkan hingga 5 item komunitas pertama */}
        {komunitas.slice(0, 5).map((item) => (
          <Link
            key={item.id}
            href={`/aktivitas/komunitas/${item.id}`}
            className={styles.aktivitasCard}
          >
            <Image
              src={`https://portal.lagajawa.site/storage/${item.image_logo}`}
              alt={item.title}
              width={100} // Sesuaikan ukuran sesuai kebutuhan styling
              height={100}
              className={styles.cardImage}
              priority={false} // Tidak memprioritaskan pemuatan gambar ini secara eager
            />
            <p className={styles.cardTitle}>{item.title}</p>
          </Link>
        ))}
      </div>
      <Link href="/aktivitas/komunitas" className={styles.moreButton}>
        Selengkapnya
      </Link>
    </section>
  );
}
