'use client';

import React, { useState, useEffect } from 'react';
import { LogIn, ShoppingCart, PhoneCall, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import styles from './settingPage.module.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

interface UserProfile {
  name: string;
  email: string;
  phone?: string;
}

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

  const fetchUserProfile = async (token: string): Promise<void> => {
    try {
      const res: Response = await fetch('https://portal.lagajawa.site/api/auth/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data: UserProfile = await res.json();
        setUserData({
          name: data.name,
          email: data.email,
          phone: data.phone ?? '',
        });
      } else {
        console.error('Gagal mengambil data profil');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleLogout = async () => {
  setIsLoggingOut(true);
  const token = localStorage.getItem('token');

  try {
    const res = await fetch('https://portal.lagajawa.site/api/auth/logout', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // tetap hapus token walau response error
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUserData({ name: '', email: '', phone: '' });
    router.push('/login');
  } catch (err) {
    console.error('Logout gagal:', err);
  } finally {
    setIsLoggingOut(false);
  }
};


  return (
    <div className={styles.container}>
      <main className={styles.mainContent}>
        <header className={styles.header}>
          <h2>Profile Pengguna</h2>
        </header>

        {isLoggedIn ? (
          <>
            {/* Info Akun */}
            <section className={styles.profileSection}>
              <h2>Informasi Akun</h2>
              <div className={styles.infoRow}>
                <span className={styles.label}>Nama</span>
                <span className={styles.separator}>:</span>
                <span className={styles.value}>{userData?.name || '-'}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.label}>Email</span>
                <span className={styles.separator}>:</span>
                <span className={styles.value}>{userData?.email || '-'}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.label}>Nomor HP</span>
                <span className={styles.separator}>:</span>
                <span className={styles.value}>{userData?.phone || '-'}</span>
              </div>
            </section>

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
            onClick={() =>
              window.open(
                'https://wa.me/62895600389272?text=Halo%20Admin,%20saya%20butuh%20bantuan%20dengan%20pemesanan%20Lapangan%20Futsal.',
                '_blank'
              )
            }
          >
            <PhoneCall size={18} style={{ marginRight: '8px' }} />
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
        <footer className={styles.footer}>
          <p>&copy; {new Date().getFullYear()} LJ Futsal. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
};

export default SettingPage;
