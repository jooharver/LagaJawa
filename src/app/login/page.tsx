'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './LoginGallery.module.css';

const galleryItems = [
  {
    id: 1,
    title: 'Tempat Nyaman',
    description: 'comfortable place to play',
    image: '/images/court1.jpg',
  },
  {
    id: 2,
    title: 'Kemudahan dalam pemesanan',
    description: 'easy booking to suit your needs',
    image: '/images/court2.jpg',
  },
  {
    id: 3,
    title: 'Akses mudah',
    description: 'easy access to the location',
    image: '/images/OIP.jpeg',
  },
];

export default function LoginGallery() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      toast.error(data.message || 'Login gagal. Periksa email dan password.');
      setIsLoading(false);
      return;
    }

    localStorage.clear();
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    toast.success('Login berhasil!');

    // Delay 2 detik baru redirect ke halaman /booking
    setTimeout(() => {
      router.push('/booking');
    }, 2000);

  } catch (err) {
    console.error('Login error:', err);
    toast.error('Terjadi kesalahan pada server. Silakan coba lagi.');
  } finally {
    setIsLoading(false);
  }
};

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    if (sliderRef.current) {
      sliderRef.current.style.transform = `translateX(-${index * 100}%)`;
    }
  };

  const nextSlide = () => {
    const next = (currentSlide + 1) % galleryItems.length;
    goToSlide(next);
  };

  const prevSlide = () => {
    const prev = (currentSlide - 1 + galleryItems.length) % galleryItems.length;
    goToSlide(prev);
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginSection}>
        <h1>Masuk</h1>
        <h2>Silahkan masuk atau daftar untuk melanjutkan pemesanan lapangan</h2>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="email">Alamat Email terdaftar</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Kata sandi</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" disabled={isLoading} className={styles.button}>
            {isLoading ? <span>Loading...</span> : 'Masuk'}
          </button>
        </form>

        <div className={styles.footerLinks}>
          <a href="/forgot-password">Lupa Kata Sandi?</a>
          <span>•</span>
          <a href="/signup">Buat akun</a>
        </div>
      </div>

      <div className={styles.gallerySection}>
        <div className={styles.sliderContainer}>
          <div className={styles.slider} ref={sliderRef}>
            {galleryItems.map((item) => (
              <div
                key={item.id}
                className={styles.slide}
                style={{ backgroundImage: `url(${item.image})` }}
              >
                <div className={styles.slideContent}>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.sliderControls}>
            <button onClick={prevSlide} className={styles.controlButton}>
              &lt;
            </button>
            <div className={styles.dots}>
              {galleryItems.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`${styles.dot} ${index === currentSlide ? styles.activeDot : ''}`}
                />
              ))}
            </div>
            <button onClick={nextSlide} className={styles.controlButton}>
              &gt;
            </button>
          </div>
        </div>
      </div>

      {/* ToastContainer harus ada agar notifikasi toast muncul */}
      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
}
