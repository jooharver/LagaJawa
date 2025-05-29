'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import styles from './AutoCarousel.module.css';

interface Item {
  id: number;
  title: string;
  image: string;
  date?: string; // Optional for acara
  link: string;
}

interface AutoCarouselProps {
  items: Item[];
  interval?: number;
  itemWidth?: string;
}

const AutoCarousel: React.FC<AutoCarouselProps> = ({ items, interval = 4000, itemWidth = '200px' }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = containerRef.current;
    let scrollInterval: NodeJS.Timeout;

    if (scrollContainer) {
      const cardWidth = 160; // Sesuaikan jika lebar kartu berubah di CSS
      const gap = 16; // Sesuaikan jika nilai gap di CSS berubah
      const scrollAmount = cardWidth + gap;

      scrollInterval = setInterval(() => {
        // Jika sudah mencapai akhir, kembali ke awal
        // Tambahkan -1 untuk mengatasi potensi pembulatan atau presisi
        if (scrollContainer.scrollLeft + scrollContainer.clientWidth >= scrollContainer.scrollWidth -1) {
          scrollContainer.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          // Gulir sejumlah lebar kartu + gap
          scrollContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
      }, interval);
    }

    return () => clearInterval(scrollInterval);
  }, [interval]);

  return (
    <div className={styles.carouselContainer}>
        <div className={styles.carouselTrack}>
            {items.map((item) => (
            <Link key={item.id} href={item.link} className={styles.card}>
                <img src={item.image} alt={item.title} className={styles.image} />
                <p className={styles.title}>{item.title}</p>
            </Link>
            ))}
        </div>
    </div>
  );
};

export default AutoCarousel;
