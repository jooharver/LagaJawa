'use client';
import styles from './newsdetail.module.css';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

type News = {
  id_news: number;
  judul: string;
  sub_judul: string;
  tempat: string;
  tanggal: string;
  image: string;
  deskripsi: string;
  kategori: string;
};

const NewsDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [news, setNews] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchNews = async () => {
      try {
        const res = await fetch(`/api/news/${id}`);
        if (!res.ok) throw new Error('Berita tidak ditemukan');
        const data = await res.json();
        setNews(data);
      } catch (err) {
        if (err instanceof Error) {
          console.error(err.message);
        } else {
          console.error(err);
        }
        setNews(null);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [id]);

  if (loading) return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>;
  if (!news) return <div style={{ textAlign: 'center', padding: '2rem' }}>Berita tidak ditemukan</div>;

  return (
    <div className={styles.containerWrapper}>
        <div className={styles.container}>

        <h1 className={styles.title}>{news.judul}</h1>

        <div className={styles.separator}></div>
        <img
            src={`http://localhost:8000/storage/${news.image}`}
            alt={news.judul}
            className={styles.newsImage}
            />

        <div className={styles.metaInfo}>
            <span>{new Date(news.tanggal).toLocaleDateString('id-ID', { dateStyle: 'long' })}</span>
            <span>{news.kategori.toUpperCase()}</span>
            <span>{news.tempat}</span>
        </div>

        <article className={styles.article}>{news.deskripsi}</article>
        </div>
    </div>
  );
};

export default NewsDetailPage;
