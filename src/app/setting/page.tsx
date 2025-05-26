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
  const [userData, setUserData] = useState({ name: '', email: '', phone: '' });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      fetchUserProfile(token);
    }
  }, []);

  interface UserProfile {
    name: string;
    email: string;
    phone: string;
  }

  const fetchUserProfile = async (token: string): Promise<void> => {
    try {
      const res: Response = await fetch('/api/user/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data: UserProfile = await res.json();
        setUserData(data);
      } else {
        console.error('Gagal mengambil data profil');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleLogout = () => {
    setIsLoggingOut(true);
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
          <h2>Akun</h2>
        </header>

        {isLoggedIn ? (
          <>
            {/* Info Akun */}
            <section className={styles.profileSection}>
              <h3>Informasi Akun</h3>
              <p><strong>Nama     :</strong> {userData.name}</p>
              <p><strong>Email    :</strong> {userData.email}</p>
              <p><strong>Nomor HP :</strong> {userData.phone}</p>
            </section>

            <div className={styles.divider}></div>

            <section className={styles.loggedInSection}>
              <button
                className={styles.logoutButton}
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? (
                  <span className={styles.spinner}></span>
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
              <p className={styles.cartNote}>
                Lihat riwayat transaksi dan pesanan Anda
              </p>
              <button
                className={styles.viewAllButton}
                onClick={() => router.push('/transactions')}
              >
                <ShoppingCart size={18} />
                VIEW ALL TRANSACTIONS
              </button>
            </section>
          </>
        ) : (
          <>
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
