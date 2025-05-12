'use client';

import Image from 'next/image';
import styles from './Home.module.css';
import { useEffect } from 'react';

export default function HomePage() {
  useEffect(() => {
    const judul = document.querySelector(`.${styles.judulHero}`);
    const deskripsi = document.querySelector(`.${styles.deskripsiHero}`);
    const cards = document.querySelectorAll(`.${styles.featureCard}`);

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            if (entry.target.classList.contains(styles.featureCard)) {
              setTimeout(() => {
                entry.target.classList.add(styles.show);
              }, index * 250);
            } else {
              entry.target.classList.add(styles.show);
            }
          } else {
            entry.target.classList.remove(styles.show);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (judul) observer.observe(judul);
    if (deskripsi) observer.observe(deskripsi);
    cards.forEach(card => observer.observe(card));

    return () => {
      if (judul) observer.unobserve(judul);
      if (deskripsi) observer.unobserve(deskripsi);
      cards.forEach(card => observer.unobserve(card));
    };
  }, []);

  return (
    <div className={styles.homepage}>
      <section id="hero" className={styles.heroContainer}>
        <div className={styles.heroTextContainer}>
          <div className={styles.judulHero}>
            <h1>LAGA JAWA FUTSAL</h1>
          </div>
          <div className={styles.deskripsiHero}>
            <h3>Pesan Lapangan Futsal dengan Mudah dan Cepat</h3>
          </div>
        </div>

        <div className={styles.banner}>
          <div className={styles.product}>
            <div
              className={styles.ball}
              style={{ '--url': 'url(/images/tekstur4.jpg)' } as React.CSSProperties}
            ></div>
            <div
              className={styles.ball}
              style={{ '--url': 'url(/images/tekstur4.jpg)' } as React.CSSProperties}
            ></div>
            <a href="https://jayaprana.id/booking" className={styles.bookNow}>Book Now</a>
          </div>

          <div className={styles.rock}>
            <Image src="/images/rock1.png" alt="Rock 1" width={170} height={170} />
            <Image src="/images/gawang-kiri.png" alt="Rock 2" width={170} height={170} />
            <Image src="/images/gawang-kanan.png" alt="Rock 3" width={170} height={170} />
          </div>
        </div>
      </section>
    </div>
  );
}