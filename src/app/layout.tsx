import type { Metadata } from "next";
import "./globals.css";
import { Poppins } from "next/font/google";
import Navbar from "./components/Navbar"; // pakai alias kalau sudah ada

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Laga Jawa Futsal",
  description: "Pusat Penyewaan Lapangan Futsal di Jawa",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning> {/* BONUS #1: Suppress hydration warning */}
      <head>
        {/* FontAwesome for icons */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body className={poppins.className}>
        <Navbar />
        <main className="pt-20">
          {children}
        </main>
      </body>
    </html>
  );
}
