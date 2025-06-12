// src/app/layout.tsx

import { Poppins } from "next/font/google";
import Navbar from "./components/Navbar";
import WhatsAppPopup from "./components/WhatsAppPopup"; // Pastikan import ini ada
import "./globals.css"; // Pastikan import ini ada

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"], // Pastikan semua bobot font yang digunakan ada
  variable: '--font-poppins', // Penting untuk penggunaan font di Tailwind jika Anda menggunakannya
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true} className={`${poppins.variable}`}>
      <head>
        {/* Link Font Awesome untuk ikon silang dan WhatsApp */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body className="font-poppins"> {/* Menggunakan font Poppins untuk seluruh body */}
        <Navbar />
        <main className="pt-20">
          {children}
        </main>
        <WhatsAppPopup /> {/* Ini akan menampilkan komponen pop-up di semua halaman */}
      </body>
    </html>
  );
}