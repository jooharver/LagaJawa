import { Suspense } from 'react';
import PembayaranForm from './PembayaranForm';

export default function Page() {
  return (
    <Suspense fallback={<div>Memuat halaman pembayaran...</div>}>
      <PembayaranForm />
    </Suspense>
  );
}
