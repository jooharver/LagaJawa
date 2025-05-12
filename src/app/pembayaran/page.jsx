import { Suspense } from 'react';
import PembayaranPage from './PembayaranPage';

export default function Page() {
  return (
    <Suspense fallback={<div style={{
      padding: '2rem', textAlign: 'center',
      background: 'linear-gradient(to bottom, #0b7a50, #5bd79b)', 
      minHeight: '100vh', color: 'white'
    }}>
      Memuat halaman pembayaran...
    </div>}>
      <PembayaranPage />
    </Suspense>
  );
}
