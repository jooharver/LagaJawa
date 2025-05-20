'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import styles from './resetPassword.module.css'; // Ganti dengan path CSS yang sesuai

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('Token reset password tidak ditemukan. Link mungkin sudah tidak valid.');
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!password || !confirmPassword) {
      setError('Password dan konfirmasi password wajib diisi');
      return;
    }

    if (password !== confirmPassword) {
      setError('Password dan konfirmasi password tidak sama');
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
        setError(data.message || 'Gagal mereset password');
      } else {
        setSuccess('Password berhasil diubah. Anda akan diarahkan ke halaman login...');
        setTimeout(() => router.push('/login'), 3000);
      }
    } catch (err) {
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
            <label className={styles.label}>
              Password Baru:
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={styles.input}
              />
            </label>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              Konfirmasi Password:
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className={styles.input}
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
