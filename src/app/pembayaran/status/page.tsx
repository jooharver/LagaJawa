import { Suspense } from 'react';
import StatusForm from './PembayaranStatus';

export default function Page() {
  return (
    <Suspense fallback={<div>Memuat status pembayaran...</div>}>
      <StatusForm />
    </Suspense>
  );
}
