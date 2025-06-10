'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import styles from './resetPassword.module.css';

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token: string = searchParams.get('token') ?? '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('Token reset password tidak ditemukan. Link mungkin sudah tidak valid.');
    } else {
      setError('');
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!password || !confirmPassword) {
      setError('Password dan konfirmasi password wajib diisi');
      return;
    }

    if (password.length < 8) {
      setError('Password harus memiliki minimal 8 karakter');
      return;
    }

    if (password !== confirmPassword) {
      setError('Password dan konfirmasi password tidak sama');
      return;
    }

    if (!token) {
      setError('Token reset password tidak ditemukan atau tidak valid.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message ?? 'Gagal mereset password');
      } else {
        setSuccess('Password berhasil diubah. Anda akan diarahkan ke halaman login...');
        setTimeout(() => router.push('/login'), 3000);
      }
    } catch {
      setError('Terjadi kesalahan saat mengirim permintaan');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Reset Password</h2>

      {error && <p className={`${styles.message} ${styles.error}`}>{error}</p>}
      {success && <p className={`${styles.message} ${styles.success}`}>{success}</p>}

      {!success && (
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="password">
              Password Baru:
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={styles.input}
                minLength={6}
              />
            </label>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="confirmPassword">
              Konfirmasi Password:
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className={styles.input}
                minLength={6}
              />
            </label>
          </div>

          <button type="submit" disabled={isLoading} className={styles.button}>
            {isLoading ? 'Memproses...' : 'Ubah Password'}
          </button>
        </form>
      )}
    </div>
  );
}
