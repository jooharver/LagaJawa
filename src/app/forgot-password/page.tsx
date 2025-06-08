'use client';
import { useState } from 'react';
import Link from 'next/link';
import styles from './forgotPassword.module.css';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Validasi email
      if (!email) {
        throw new Error('Email harus diisi');
      }

      if (!/^\S+@\S+\.\S+$/.test(email)) {
        throw new Error('Format email tidak valid');
      }

      // Panggil API endpoint
      const response = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Gagal mengirim permintaan reset password');
      }

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {success ? (
        <>
          <div className={`${styles.alert} ${styles.success}`}>
            <h3 className={styles.title}>Permintaan Diterima!</h3>
            <p>Kami telah mengirimkan instruksi reset password ke email Anda.</p>
          </div>
          <div className={styles.footer}>
            <Link href="/login" className={styles.link}>
              Kembali ke halaman login
            </Link>
          </div>
        </>
      ) : (
        <>
          <div className={styles.header}>
            <h1 className={styles.title}>Lupa Kata Sandi?</h1>
            <p className={styles.subtitle}>
              Masukkan email Anda untuk menerima link reset password
            </p>
          </div>

          {error && (
            <div className={`${styles.alert} ${styles.error}`}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>
                Alamat Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
                placeholder="email@contoh.com"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={styles.button}
            >
              {isLoading ? (
                <>
                  <svg
                    className={styles.spinner}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    width="20"
                    height="20"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Memproses...
                </>
              ) : (
                'Kirim Link Reset'
              )}
            </button>
          </form>

          <div className={styles.footer}>
            <Link href="/login" className={styles.link}>
              Kembali ke halaman login
            </Link>
          </div>
        </>
      )}
    </div>
  );
}