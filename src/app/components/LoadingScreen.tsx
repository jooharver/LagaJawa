'use client';

import { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';
import styles from './LoadingScreen.module.css';

const LoadingScreen = () => {
  const pathname = usePathname();
  const isFirstLoad = useRef(true); // hanya true sekali saat pertama render
  const [showLoader, setShowLoader] = useState(false);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isFirstLoad.current) {
      // 👇 Force show loading screen saat pertama kali load (initial page load)
      setShowLoader(true);

      const timeout = setTimeout(() => {
        setShowLoader(false);
        isFirstLoad.current = false;
      }, 1500); // tampil 1 detik

      return () => clearTimeout(timeout);
    } else {
      // 👇 Untuk navigasi antar halaman
      const delay = setTimeout(() => {
        setShowLoader(true);
      }, 500);

      setTimer(delay);

      const cleanup = setTimeout(() => {
        if (timer) clearTimeout(timer);
        setShowLoader(false);
      }, 1000);

      return () => {
        clearTimeout(delay);
        clearTimeout(cleanup);
      };
    }
  }, [pathname]);

  if (!showLoader) return null;

  return (
    <div className={`${styles.overlay} ${showLoader ? styles.show : ''}`}>
      <div className={styles.loader}>
        <img src="/images/logo.png" alt="Logo" className={styles.logo} />
        <div className={styles.barContainer}>
          <div className={styles.bar}></div>
        </div>
      </div>
    </div>
  );
  
};

export default LoadingScreen;
