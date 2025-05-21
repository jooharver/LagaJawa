'use client';

import { useEffect, useState } from 'react';
import styles from './news.module.css';

type NewsItem = {
  id: number;
  title: string;
  content: string;
  type: 'event' | 'announcement';
  date: string;
  image: string;
};

const NewsMenu = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'event' | 'announcement'>('all');

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/news');
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const json = await res.json();

        // Ambil data berita dari pagination 'data.data'
        if (json.data && Array.isArray(json.data.data)) {
          // Optional: map data untuk menyesuaikan field jika perlu
          const mappedNews = json.data.data.map((item: any) => ({
            id: item.id,
            title: item.title || item.judul || '', // sesuaikan jika backend pakai field 'judul'
            content: item.content || item.deskripsi || '',
            type: (item.type === 'event' || item.type === 'announcement') ? item.type : 'announcement', // fallback jika field type tidak ada
            date: item.date || item.tanggal || '',
            image: item.image ? `http://localhost:8000/storage/news/${item.image}` : '',
          }));
          setNews(mappedNews);
        } else {
          setNews([]);
          console.error('Data is not an array:', json);
        }
      } catch (error) {
        console.error('Error fetching news:', error);
        setNews([]);
      }
    };

    fetchNews();
  }, []);

  const filteredNews = news.filter((item) =>
    filter === 'all' ? true : item.type === filter
  );

  return (
    <div className={styles.container}>
      <h1>Berita</h1>

      <div className={styles.filterButtons}>
        {['all', 'event', 'announcement'].map((type) => (
          <button
            key={type}
            className={`${styles.filterButton} ${filter === type ? styles.active : ''}`}
            onClick={() => setFilter(type as 'all' | 'event' | 'announcement')}
          >
            {type.toUpperCase()}
          </button>
        ))}
      </div>

      <div className={styles.newsList}>
        {filteredNews.length > 0 ? (
          filteredNews.map((news) => (
            <div key={news.id} className={styles.newsItem}>
              <div className={styles.imageButtonWrapper}>
                <img src={news.image} alt={news.title} className={styles.newsImage} />
                <button
                  className={styles.detailButton}
                  onClick={() => window.location.href = `/news/${news.id}`}
                >
                  Baca Selengkapnya
                </button>
              </div>

              <div className={styles.newsContent}>
                <h3>{news.title}</h3>
                <p className={styles.meta}>
                  {news.date} | {news.type.toUpperCase()}
                </p>
                <p>{news.content}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No news found.</p>
        )}
      </div>
    </div>
  );
};

export default NewsMenu;
