'use client';

import Image from 'next/image';
import './globals.css';
import { useEffect } from 'react';

export default function HomePage() {
useEffect(() => {
  const judul = document.querySelector('.judulFasilitas');
  const deskripsi = document.querySelector('.features-description');
  const cards = document.querySelectorAll('.feature-card');

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          if (entry.target.classList.contains('feature-card')) {
            setTimeout(() => {
              entry.target.classList.add('show');
            }, index * 250); // delay antar card
          } else {
            entry.target.classList.add('show');
          }
        } else {
          // Hapus class show saat tidak terlihat
          entry.target.classList.remove('show');
        }
      });
    },
    {
      threshold: 0.1,
    }
  );

  if (judul) observer.observe(judul);
  if (deskripsi) observer.observe(deskripsi);
  cards.forEach(card => observer.observe(card));

  return () => {
    if (judul) observer.unobserve(judul);
    if (deskripsi) observer.unobserve(deskripsi);
    cards.forEach(card => observer.unobserve(card));
  };
}, []);

  return (
    <div className="homepage">

      {/* Sections */}
      
      <section id="hero" className="hero-container">
        <div className="hero-text-container">
          <div className='judulHero'>
            <h1>LAGA JAWA FUTSAL</h1>
          </div>
          <div className='deskripsiHero'>
            <h3>Pesan Lapangan Futsal dengan Mudah dan Cepat</h3>
          </div>

          </div>

          <div className="banner">
            <div className="product">
              <div
                 className="ball"
                style={{ '--url': 'url(/images/tekstur4.jpg)' } as React.CSSProperties}
              ></div>

              <div
                 className="ball"
                style={{ '--url': 'url(/images/tekstur4.jpg)' } as React.CSSProperties}
              ></div>
              <a href="https://jayaprana.id/booking" className="book-now">Book Now</a>
            </div>

              <div className="rock">
              <Image src="/images/rock1.png" alt="Rock 1" width={170} height={170} />
              <Image src="/images/gawang-kiri.png" alt="Rock 2" width={170} height={170} />
              <Image src="/images/gawang-kanan.png" alt="Rock 3" width={170} height={170} />
            </div>
          </div>
      </section>

      {/* SECTION FASILITAS */}
      <section id="features" className="features-section">
        <div className='judulFasilitas'>
        <h1>Fasilitas</h1>
        </div>
        <p className="features-description">
          Kami menyediakan berbagai fasilitas penunjang untuk memastikan kenyamanan dan kepuasan Anda saat bermain. Mulai dari sistem skor otomatis hingga kantin dan area parkir yang luas, semuanya kami hadirkan untuk pengalaman futsal terbaik.
        </p>

          <div className="features">
            <div className="feature-card">
              <div className="image-wrapper">
                <Image src="/images/papanSkor.png" alt="Fitur 1" width={300} height={200} className="feature-image" />
              </div>
              <h3>Sistem Skor Otomatis</h3>
              <p>Skor pertandingan secara real-time dengan sistem yang terintegrasi.</p>
              <button className="feature-button">Detail</button>
            </div>

            <div className="feature-card">
              <div className="image-wrapper">
                <Image src="/images/kantin.jpg" alt="Fitur 2" width={300} height={200} className="feature-image" />
              </div>
              <h3>Kantin & Minuman</h3>
              <p>Istirahat dengan nyaman sambil beli jajan dan minuman di kantin.</p>
              <button className="feature-button">Detail</button>
            </div>

            <div className="feature-card">
              <div className="image-wrapper">
                <Image src="/images/kantin.jpg" alt="Fitur 2" width={300} height={200} className="feature-image" />
              </div>
              <h3>Kantin & Minuman</h3>
              <p>Istirahat dengan nyaman sambil beli jajan dan minuman di kantin.</p>
              <button className="feature-button">Detail</button>
            </div>

            <div className="feature-card">
              <div className="image-wrapper">
                <Image src="/images/areaParkir.jpg" alt="Fitur 3" width={300} height={200} className="feature-image" />
              </div>
              <h3>Area Parkir Luas</h3>
              <p>Tersedia area parkir aman dan luas untuk kendaraan Anda.</p>
              <button className="feature-button">Detail</button>
            </div>

            <div className="feature-card">
              <div className="image-wrapper">
                <Image src="/images/toilet.jpeg" alt="Fitur 4" width={300} height={200} className="feature-image" />
              </div>
              <h3>Toilet Bersih</h3>
              <p>Tersedia ruang ganti dan toilet yang bersih dan nyaman.</p>
              <button className="feature-button">Detail</button>
            </div>
          </div>
      </section>
      {/* END SECTION FASILITAS */}

      
      {/* SECTION GALERRY */}
      <section id="gallery" className='gallery-section'>
      <h2 className="gallery-title fade-slide delay1">Gallery</h2>
      <p className="deskripsi-galeri fade-slide delay2">Temukan inspirasimu dan jadi bagian dari perjalanan kami!</p>
      <div className="gallery-banner fade-slide delay3"></div>


          <div className="slider" style={{
                '--width': '200px',
                '--height': '50px',
                '--quantity': '10',
              } as React.CSSProperties}>
                <div className="list">
                  <div className="item" style={{ '--position': 1 } as React.CSSProperties}>
                    <Image src="/images/slide1.jpg" alt="Slider 1" width={100} height={50} />
                  </div>
                  <div className="item" style={{ '--position': 2 } as React.CSSProperties}>
                    <Image src="/images/slide2.jpg" alt="Slider 2" width={100} height={50} />
                  </div>
                  <div className="item" style={{ '--position': 3 } as React.CSSProperties}>
                    <Image src="/images/slide3.jpg" alt="Slider 3" width={100} height={50} />
                  </div>
                  <div className="item" style={{ '--position': 4 } as React.CSSProperties}>
                    <Image src="/images/slide4.jpg" alt="Slider 4" width={100} height={50} />
                  </div>
                  <div className="item" style={{ '--position': 5 } as React.CSSProperties}>
                    <Image src="/images/slide5.jpg" alt="Slider 5" width={100} height={50} />
                  </div>
                  <div className="item" style={{ '--position': 6 } as React.CSSProperties}>
                    <Image src="/images/slide1.jpg" alt="Slider 6" width={100} height={50} />
                  </div>
                  <div className="item" style={{ '--position': 7 } as React.CSSProperties}>
                    <Image src="/images/slide2.jpg" alt="Slider 7" width={100} height={50} />
                  </div>
                  <div className="item" style={{ '--position': 8 } as React.CSSProperties}>
                    <Image src="/images/slide3.jpg" alt="Slider 8" width={100} height={50} />
                  </div>
                  <div className="item" style={{ '--position': 9 } as React.CSSProperties}>
                    <Image src="/images/slide4.jpg" alt="Slider 9" width={100} height={50} />
                  </div>
                  <div className="item" style={{ '--position': 10 } as React.CSSProperties}>
                    <Image src="/images/slide5.jpg" alt="Slider 10" width={100} height={50} />
                  </div>
                </div>
              </div>

              <div className="slider" data-reverse="true" style={{
                '--width': '200px',
                '--height': '200px',
                '--quantity': '9',
                '--margin-top' : '1rem'
              } as React.CSSProperties}>
                <div className="list">
                  <div className="item" style={{ '--position': 1 } as React.CSSProperties}>
                    <Image src="/images/slider_1.jpg" alt="Slider 1" width={200} height={200} />
                  </div>
                  <div className="item" style={{ '--position': 2 } as React.CSSProperties}>
                    <Image src="/images/slider_2.jpeg" alt="Slider 2" width={200} height={200} />
                  </div>
                  <div className="item" style={{ '--position': 3 } as React.CSSProperties}>
                    <Image src="/images/slider_3.jpeg" alt="Slider 3" width={200} height={200} />
                  </div>
                  <div className="item" style={{ '--position': 4 } as React.CSSProperties}>
                    <Image src="/images/slider_4.jpg" alt="Slider 4" width={200} height={200} />
                  </div>
                  <div className="item" style={{ '--position': 5 } as React.CSSProperties}>
                    <Image src="/images/slider_5.jpg" alt="Slider 5" width={200} height={200} />
                  </div>
                  <div className="item" style={{ '--position': 6 } as React.CSSProperties}>
                    <Image src="/images/slider_6.jpg" alt="Slider 6" width={200} height={200} />
                  </div>
                  <div className="item" style={{ '--position': 7 } as React.CSSProperties}>
                    <Image src="/images/slider_7.jpg" alt="Slider 7" width={200} height={200} />
                  </div>
                  <div className="item" style={{ '--position': 8 } as React.CSSProperties}>
                    <Image src="/images/slider_8.jpg" alt="Slider 8" width={200} height={200} />
                  </div>
                  <div className="item" style={{ '--position': 9 } as React.CSSProperties}>
                    <Image src="/images/slider_9.jpg" alt="Slider 9" width={200} height={200} />
                  </div>
                </div>
              </div>
        </section>
        {/* END SECTION GALLERY */}

      {/* SECTION ALUR PEMESANAN */}
      <section className="booking-section">
        <div className="booking-overlay">
          <h2 className="booking-title">Alur Pemesanan</h2>
          <p className="booking-desc">
            Ikuti langkah mudah berikut untuk memesan lapangan futsal di <strong>LAGA JAWA FUTSAL</strong>
          </p>

          <div className="booking-steps">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3>Login / Buat Akun</h3>
              <p>Masuk ke akun kamu atau buat akun baru.</p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h3>Pilih Menu Booking</h3>
              <p>Buka halaman booking untuk memesan</p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h3>Pilih Jadwal</h3>
              <p>Sesuaikan jadwal dan lapangan yang tersedia</p>
            </div>
            <div className="step-card">
              <div className="step-number">4</div>
              <h3>Pilih Pembayaran</h3>
              <p>Sesuaikan metode pembayaran yang diinginkan</p>
            </div>
            <div className="step-card">
              <div className="step-number">5</div>
              <h3>SELESAI</h3>
              <p>Screenshot bukti bayar dan datang tepat waktu</p>
            </div>
          </div>
        </div>
      </section>
      {/* END SECTION ALUR PEMESANAN */}

      {/* SECTION LOKASI */}
      <section id="location" className="location-section">
  <h2 className="location-title">LOKASI KAMI</h2>
  <p className="location-description">
    Lokasi yang strategis berada di tegah kota dekat dengan akses<br />
    jalan raya dan fasilitas umum
  </p>

  <div className="location-wrapper">
    <div className="location-map">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3951.5026830854117!2d112.6161209!3d-7.946891200000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e78827687d272e7%3A0x789ce9a636cd3aa2!2sPoliteknik%20Negeri%20Malang!5e0!3m2!1sid!2sid!4v1745550213010!5m2!1sid!2sid"
        width="100%"
        height="100%"
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>

    <div className="location-info">
      <div className="info-box">
        <img src="/images/ball-sphere.png" alt="Icon Futsal" className="location-icon" />
        <div>
          <h3 className="info-title">LAGA JAWA FUTSAL</h3>
          <p className="info-address">Jl. Soekarno Hatta, Lowokwaru, Kota Malang</p>
        </div>
      </div>
      <a
        href="https://maps.app.goo.gl/BfYubdazE8EjYgEd9"
        target="_blank"
        rel="noopener noreferrer"
        className="location-button"
      >
        Go to Map
      </a>
    </div>
  </div>
</section>

        {/* END SECTION LOKASI */}

    </div>
  );
}

