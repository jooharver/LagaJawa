import { Suspense } from 'react';
import ResetPasswordForm from './ResetPasswordPage';

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Memuat halaman reset password...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );

}
