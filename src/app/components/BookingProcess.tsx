import React from 'react';

const steps = [
  {
    title: "Login / Buat Akun",
    description: "Masuk ke akun kamu atau buat akun baru.",
    number: "01"
  },
  {
    title: "Pilih Menu Booking",
    description: "Buka halaman booking untuk mulai pemesanan.",
    number: "02"
  },
  {
    title: "Pilih Jadwal & Lapangan",
    description: "Sesuaikan jadwal dan lapangan yang tersedia.",
    number: "03"
  },
  {
    title: "Pilih Pembayaran",
    description: "Gunakan metode pembayaran yang tersedia.",
    number: "04"
  },
  {
    title: "Datang Tepat Waktu",
    description: "Nikmati permainan di waktu yang sudah dipesan.",
    number: "05"
  }
];

const BookingProcess = () => {
  return (
    <section id="booking-process" className="py-16 px-4 bg-gray-100">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-4">
          Proses <span className="text-pink-400">Pemesanan</span>
        </h2>
        <p className="mb-10 text-lg">
          Ikuti langkah mudah berikut untuk memesan lapangan futsal di <strong>Laga Jawa</strong>.
        </p>

        <div className="flex flex-wrap justify-center gap-6">
          {steps.map((step, index) => (
            <div key={index} className="relative w-56 bg-[#1a1a2e] text-white p-5 rounded-xl shadow-md text-left">
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-sm mb-3">{step.description}</p>
              <div className="absolute bottom-4 right-4 w-10 h-10 bg-pink-400 text-white rounded-full flex items-center justify-center font-bold">
                {step.number}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BookingProcess;
