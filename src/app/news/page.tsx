'use client';

import { useEffect, useState } from 'react';
import styles from './news.module.css';

type NewsItem = {
  id_news: number;
  judul: string;
  sub_judul: string;
  tempat: string;
  tanggal: Date;
  image: string;
  deskripsi: string;
  kategori: string;
};

const NewsMenu = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [filteredNews, setFilteredNews] = useState<NewsItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'event' | 'announcement'>('all');

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch('/api/news');
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();

        if (Array.isArray(data)) {
          setNews(data);
        } else {
          console.error('Unexpected response format:', data);
        }
      } catch (error) {
        console.error('Error fetching news:', error);
        setNews([]);
      }
    };

    fetchNews();
  }, []);

  useEffect(() => {
    if (filter === 'all') {
      setFilteredNews(news);
    } else {
      const filtered = news.filter((item) => item.kategori.toLowerCase() === filter);
      setFilteredNews(filtered);
    }
  }, [filter, news]);

  // untuk deskripsi singkat
  const truncate = (text: string, maxLength: number) => {
  return text.length > maxLength
      ? text.slice(0, text.lastIndexOf(' ', maxLength)) + '...'
      : text;
  };


  return (
    <div className={styles.container}>
      <h1>Berita</h1>

      {/* Filter Buttons */}
      <div className={styles.filterButtons}>
        <button onClick={() => setFilter('all')} className={filter === 'all' ? styles.active : ''}>Semua</button>
        <button onClick={() => setFilter('event')} className={filter === 'event' ? styles.active : ''}>Event</button>
        <button onClick={() => setFilter('announcement')} className={filter === 'announcement' ? styles.active : ''}>Pengumuman</button>
      </div>

      <div className={styles.newsList}>
        {filteredNews.length > 0 ? (
          filteredNews.map((item) => (
            <div key={item.id_news} className={styles.newsItem}>
              <div className={styles.imageButtonWrapper}>
                <img
                  src={`http://localhost:8000/storage/${item.image}`}
                  alt={item.judul}
                  className={styles.newsImage}
                />
                <button
                  className={styles.detailButton}
                  onClick={() => window.location.href = `/news/${item.id_news}`}
                >
                  Baca Selengkapnya
                </button>
              </div>

              <div className={styles.newsContent}>
                <h3>{item.judul}</h3>
                <p className={styles.meta}>
                  {item.tanggal instanceof Date ? item.tanggal.toLocaleDateString() : new Date(item.tanggal).toLocaleDateString()} | {item.kategori.toUpperCase()}
                </p>
                <p><strong>{item.sub_judul}</strong></p>
                <p>{truncate(item.deskripsi, 150)}</p>
                <p><em>Lokasi: {item.tempat}</em></p>
              </div>
            </div>
          ))
        ) : (
          <p>Berita tidak ditemukan.</p>
        )}
      </div>
    </div>
  );
};

export default NewsMenu;
