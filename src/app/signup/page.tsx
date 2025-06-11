'use client';

import { useState } from 'react';
import styles from './SignupForm.module.css';
import { useRouter } from 'next/navigation';

type FormData = {
  name: string;
  email: string;
  phone: string;
  address: string;
  password: string;
  confirmPassword: string;
};

type FormErrors = Partial<FormData> & { api?: string };

export default function SignupForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Nama wajib diisi.';
    if (!formData.phone.trim()) newErrors.phone = 'Nomor telepon wajib diisi.';
    else if (!/^\d{10,15}$/.test(formData.phone)) newErrors.phone = 'Format nomor tidak valid.';

    if (!formData.address.trim()) newErrors.address = 'Alamat wajib diisi.';

    if (!formData.email.trim()) newErrors.email = 'Email wajib diisi.';
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Format email tidak valid.';

    if (!formData.password) newErrors.password = 'Password wajib diisi.';
    else if (formData.password.length < 8) newErrors.password = 'Minimal 8 karakter.';

    if (!formData.confirmPassword) newErrors.confirmPassword = 'Konfirmasi password diperlukan.';
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Password tidak cocok.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);

    try {
      const response = await fetch('https://portal.lagajawa.site/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          password: formData.password, // ✅ cukup password saja
        }),

      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server mengembalikan respon yang tidak valid (bukan JSON)');
      }

      const data = await response.json();

      if (!response.ok) {
        setErrors((prev) => ({ ...prev, api: data.message || 'Pendaftaran gagal.' }));
        setIsSubmitting(false);
        return;
      }

      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        api: err instanceof Error ? err.message : 'Terjadi kesalahan.',
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const EyeIcon = ({ visible }: { visible: boolean }) => (
    visible ? (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={20} height={20}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12s3.75-6.75 9.75-6.75 9.75 6.75 9.75 6.75-3.75 6.75-9.75 6.75S2.25 12 2.25 12z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ) : (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={20} height={20}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M10.477 10.477A3 3 0 0113.5 13.5m3.016 1.016A9.71 9.71 0 0121.75 12s-3.75-6.75-9.75-6.75c-1.746 0-3.358.398-4.778 1.048M9.75 9.75A3 3 0 0112 9a3 3 0 013 3" />
      </svg>
    )
  );

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h2>Buat akun anda</h2>
          <p>Bergabung dengan kami dan nikmati kemudahan dalam satu akses</p>
        </div>

        {errors.api && <div className={styles.errorMessage}>{errors.api}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Nama Pengguna</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? styles.errorInput : ''}
            />
            {errors.name && <span className={styles.errorText}>{errors.name}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">Alamat Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? styles.errorInput : ''}
            />
            {errors.email && <span className={styles.errorText}>{errors.email}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="phone">Nomor Telepon</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              placeholder="081234567890"
              value={formData.phone}
              onChange={handleChange}
              className={errors.phone ? styles.errorInput : ''}
            />
            {errors.phone && <span className={styles.errorText}>{errors.phone}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="address">Alamat</label>
            <input
              type="text"
              id="address"
              name="address"
              placeholder="Jl. Merdeka No. 123"
              value={formData.address}
              onChange={handleChange}
              className={errors.address ? styles.errorInput : ''}
            />
            {errors.address && <span className={styles.errorText}>{errors.address}</span>}
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
                className={errors.password ? styles.errorInput : ''}
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
            {errors.password && <span className={styles.errorText}>{errors.password}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword">Konfirmasi Kata Sandi</label>
            <div className={styles.passwordWrapper}>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={errors.confirmPassword ? styles.errorInput : ''}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className={styles.toggleButton}
                tabIndex={-1}
              >
                <EyeIcon visible={showConfirmPassword} />
              </button>
            </div>
            {errors.confirmPassword && (
              <span className={styles.errorText}>{errors.confirmPassword}</span>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={styles.submitButton}
          >
            {isSubmitting ? (
              <span className={styles.spinner}>
                <svg
                  className={styles.spinnerIcon}
                  viewBox="0 0 50 50"
                >
                  <circle
                    className={styles.path}
                    cx="25"
                    cy="25"
                    r="20"
                    fill="none"
                    strokeWidth="5"
                  ></circle>
                </svg>
              </span>
            ) : (
              'Sign Up'
            )}
          </button>
        </form>

        <div className={styles.footer}>
          <p>Sudah Memiliki Akun? <a href="/login">Log in</a></p>
        </div>
      </div>
    </div>
  );
}
