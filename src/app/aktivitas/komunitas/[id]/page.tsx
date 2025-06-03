'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import styles from './KomunitasDetail.module.css';

interface Komunitas {
  id: number;
  title: string;
  user_id: number;
  image: string;
  image_logo: string;
  image_banner: string;
  phone: string;
  deskripsi: string;
}

export default function KomunitasDetailPage() {
  const { id } = useParams();
  const [komunitas, setKomunitas] = useState<Komunitas | null>(null);

  useEffect(() => {
    fetch(`http://localhost:8000/api/komunitas/${id}`)
      .then((res) => res.json())
      .then((response) => {
        if (response && response.data) {
          setKomunitas(response.data);
        }
      });
  }, [id]);

  if (!komunitas) return <div>Loading...</div>;

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.container}>
          <div className={styles.bannerSection}>
            <img
              src={`http://localhost:8000/storage/${komunitas.image_banner}`}
              alt="Banner"
              className={styles.banner}
            />
            <img
              src={`http://localhost:8000/storage/${komunitas.image_logo}`}
              alt="Logo"
              className={styles.logo}
            />
          </div>

          <h1 className={styles.title}>{komunitas.title}</h1>

          <div className={styles.adminSection}>
            <p>Admin ID: {komunitas.user_id}</p>
            <a
              href={`https://wa.me/${komunitas.phone}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.joinButton}
            >
              Bergabung
            </a>
          </div>

          <div className={styles.deskripsi}>
            <h3>Deskripsi</h3>
            <p>{komunitas.deskripsi}</p>
          </div>

          <div className={styles.gallery}>
            <h3>Galeri</h3>
            <img
              src={`http://localhost:8000/storage/${komunitas.image}`}
              alt="Galeri"
              className={styles.galleryImage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
