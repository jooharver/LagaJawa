// app/transactions/layout.tsx
'use client';
import { Poppins } from "next/font/google";
import "../globals.css"; // sesuaikan jika perlu

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export default function TransactionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Jangan pakai <html> atau <body> di sini
    <div className={poppins.className}>
      <main className="pt-20">{children}</main>
    </div>
  );
}
