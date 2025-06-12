'use client'

import { useState } from 'react'
import Script from 'next/script'
import styles from './Page.module.css'

export default function UjicobaMidtrans() {
  const [snapToken, setSnapToken] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState('transfer')

  const handleCreateTransaction = async () => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('http://localhost:8000/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: 1,
          payment_method: paymentMethod,
          total_amount: 100000,
        }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Gagal membuat transaksi')
      }

      if (paymentMethod === 'cod') {
        alert('Transaksi berhasil dibuat dengan metode COD.\nSilakan tunggu konfirmasi admin.')
      } else if (data.data.snap_token) {
        setSnapToken(data.data.snap_token)
        window.location.href = `https://app.sandbox.midtrans.com/snap/v2/vtweb/${data.data.snap_token}`
      }

      setLoading(false)
    } catch (e) {
      setError('Error: ' + e.message)
      setLoading(false)
    }
  }

  return (
    <>
      <Script
        src="https://app.sandbox.midtrans.com/snap/snap.js"
        data-client-key="SB-Mid-client-OBJH6ErFKBOsUYCj"
        strategy="afterInteractive"
      />
      <div className={styles.container}>
        <h1 className={styles.title}>Ujicoba Midtrans Snap</h1>

        <div className={styles.selectWrapper}>
          <label htmlFor="paymentMethod">Metode Pembayaran:</label>
          <select
            id="paymentMethod"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className={styles.select}
          >
            <option value="transfer">Transfer Bank (via Midtrans)</option>
            <option value="cod">Cash on Delivery (COD)</option>
          </select>
        </div>

        <button
          onClick={handleCreateTransaction}
          disabled={loading}
          className={styles.button}
        >
          {loading ? 'Loading...' : 'Buat Transaksi & Bayar'}
        </button>

        {error && <p className={styles.error}>{error}</p>}
      </div>
    </>
  )
}
