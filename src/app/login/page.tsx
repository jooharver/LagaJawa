'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
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
  const [errorMessage, setErrorMessage] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('https://portal.lagajawa.site/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message || 'Login gagal. Periksa email dan password.');
        setIsLoading(false);
        return;
      }

      localStorage.clear();
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Delay sebelum redirect
      setTimeout(() => {
        router.push('/booking');
      }, 1500);
    } catch (err) {
      console.error('Login error:', err);
      setErrorMessage('Terjadi kesalahan pada server. Silakan coba lagi.');
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

  //untuk icon mata
  const EyeIcon = ({ visible }: { visible: boolean }) => (
    visible ? (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        width={20}
        height={20}
      >
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M2.25 12s3.75-6.75 9.75-6.75 9.75 6.75 9.75 6.75-3.75 6.75-9.75 6.75S2.25 12 2.25 12z" />
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ) : (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        width={20}
        height={20}
      >
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M3 3l18 18M10.477 10.477A3 3 0 0113.5 13.5m3.016 1.016A9.71 9.71 0 0121.75 12s-3.75-6.75-9.75-6.75c-1.746 0-3.358.398-4.778 1.048M9.75 9.75A3 3 0 0112 9a3 3 0 013 3" />
      </svg>
    )
  );

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
            <label htmlFor="password">Kata Sandi</label>
            <div className={styles.passwordWrapper}>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className=""
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className={styles.toggleButton}
                tabIndex={-1}
              >
                <EyeIcon visible={showPassword} />
              </button>
            </div>
          </div>

          {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}

          <button type="submit" disabled={isLoading} className={styles.button}>
            {isLoading ? <div className={styles.spinner} /> : 'Masuk'}
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
    </div>
  );
}
