'use client';

import React, { useState, useEffect } from 'react';
import { LogIn, ShoppingCart, PhoneCall, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import styles from './settingPage.module.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const SettingPage = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    // Cek token atau session di localStorage
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
      setTimeout(() => {
      localStorage.removeItem('token');
      setIsLoggedIn(false);
      setIsLoggingOut(false);
      router.push('/login');
    }, 1000);
  };


  return (
    <div className={styles.container}>
      <main className={styles.mainContent}>
        <header className={styles.header}>
          <h1>Akun</h1>
        </header>

        {isLoggedIn ? (
          <>
            {/* Jika sudah login */}
            <section className={styles.loggedInSection}>
              <button
                className={styles.logoutButton}
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? (
                  <span className={styles.spinner}></span> // spinner animasi loading
                ) : (
                  <>
                    <LogOut size={18} />
                    LOGOUT
                  </>
                )}
              </button>
            </section>

            <div className={styles.divider}></div>

            <section className={styles.transactionSection}>
              <h2>Riwayat Transaksi</h2>
              <button
                className={styles.viewAllButton}
                onClick={() => router.push('/transactions')}
              >
                <ShoppingCart size={18} />
                VIEW ALL TRANSACTIONS
              </button>
              <p className={styles.cartNote}>
                Lihat riwayat transaksi dan pesanan Anda
              </p>
            </section>
          </>
        ) : (
          <>
            {/* Jika belum login */}
            <section className={styles.loginSection}>
              <button
                className={styles.loginButton}
                type="button"
                onClick={() => router.push('/login')}
              >
                <LogIn size={18} />
                LOGIN / DAFTAR
              </button>
              <p className={styles.loginNote}>
                Masuk atau daftar untuk mulai memesan lapangan
              </p>
            </section>
          </>
        )}

        <div className={styles.divider}></div>

        <section className={styles.contactSection}>
          <h3>Contact Support</h3>
          <p>Tim dukungan kami siap membantu Anda</p>
          <button
            className={styles.contactButton}
            onClick={() => router.push('/contact')}
          >
            <PhoneCall size={18} />
            CONTACT SUPPORT
          </button>
        </section>

        <div className={styles.divider}></div>

        <section className={styles.socialSection}>
          <h3>Follow Us</h3>
          <p>Stay updated with our latest news and offers</p>
          <div className={styles.socialIcons}>
            <a href="#" className={styles.socialLink}>
              <i className="fab fa-instagram"></i> INSTAGRAM
            </a>
            <a href="#" className={styles.socialLink}>
              <i className="fab fa-facebook"></i> FACEBOOK
            </a>
            <a href="#" className={styles.socialLink}>
              <i className="fab fa-twitter"></i> TWITTER
            </a>
          </div>
        </section>
      </main>
    </div>
  );
};

export default SettingPage;
