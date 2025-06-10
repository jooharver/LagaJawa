'use client';

import Image from 'next/image';
import styles from './Home.module.css';
import Link from 'next/link';
import { useEffect } from 'react';

export default function HomePage() {
useEffect(() => {
  const animatedElements = document.querySelectorAll(
    `.${styles.judulHero}, .${styles.deskripsiHero}, .${styles.judulFasilitas}, .${styles.deskripsiFasilitas},
     .${styles.featureCard}, .${styles.judulGallery}, .${styles.deskripsiGallery}, .${styles.galleryBanner},
     .${styles.judulBooking}, .${styles.deskripsiBooking}, .${styles.stepCard}, .${styles.judulLokasi},
     .${styles.deskripsiLokasi}`
  );

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add(styles.show);
          }, index * 150);
        } else {
          entry.target.classList.remove(styles.show);
        }
      });
    },
    { threshold: 0.1 }
  );

  animatedElements.forEach(el => observer.observe(el));

  return () => {
    animatedElements.forEach(el => observer.unobserve(el));
  };
}, []);


  return (
    <div className={styles.homepage}>
      <section id="hero" className={styles.heroContainer}>
        <Image
          src="/images/lapangan7.jpg"
          alt="Background"
          fill
          priority
          className={styles.heroBackground}
        />
        <div className={styles.heroOverlay}>
          <div className={styles.heroTextContainer}>
            <div className={styles.judulHero}>
              <h1>LAGA JAWA FUTSAL</h1>
            </div>
            <div className={styles.deskripsiHero}>
              <h3>Pesan Lapangan Futsal dengan Mudah dan Cepat</h3>
            </div>
          </div>
        </div>

        <div className={styles.banner}>
          <div className={styles.product}>
            <div
              className={styles.ball}
              style={{ '--url': 'url(/images/tekstur4.jpg)' } as React.CSSProperties}
            ></div>
            <div
              className={styles.ball}
              style={{ '--url': 'url(/images/tekstur4.jpg)' } as React.CSSProperties}
            ></div>
              <Link href="/booking" className={styles.bookNow}>
                Book Now
              </Link>
          </div>

          <div className={styles.rock}>
            <Image src="/images/rock1.png" alt="Rock 1" width={170} height={170} />
            <Image src="/images/gawang-kiri.png" alt="Rock 2" width={170} height={170} />
            <Image src="/images/gawang-kanan.png" alt="Rock 3" width={170} height={170} />
          </div>
        </div>
      </section>
      <section id="features" className={styles.featuresContainer}>
        <div className={styles.judulFasilitas}>
          <h1>Fasilitas</h1>
        </div>
        <div className={styles.deskripsiFasilitas}>
           <h3>Di Laga Jawa Futsal, kami tidak hanya menyediakan lapangan futsal berkualitas tinggi, tetapi juga berbagai fasilitas penunjang untuk meningkatkan pengalaman bermain Anda.</h3>
        </div>

        <div className={styles.features}>
          <div className={styles.featureCard}>
            <div className={styles.imageWrapper}>
              <Image src="/images/papanSkor.png" alt="Sistem Skor Otomatis" width={300} height={200} className="feature-image" />
            </div>
            <h3>Sistem Skor Otomatis</h3>
            <p>Skor pertandingan secara real-time dengan sistem yang terintegrasi.</p>
            <button className={styles.featureButton}>Detail</button>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.imageWrapper}>
              <Image src="/images/kantin.jpg" alt="Kantin & Minuman" width={300} height={200} className="feature-image" />
            </div>
            <h3>Kantin & Minuman</h3>
            <p>Istirahat dengan nyaman sambil beli jajan dan minuman di kantin.</p>
            <button className={styles.featureButton}>Detail</button>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.imageWrapper}>
              <Image src="/images/areaParkir.jpg" alt="Area Parkir Luas" width={300} height={200} className="feature-image" />
            </div>
            <h3>Area Parkir Luas</h3>
            <p>Tersedia area parkir aman dan luas untuk kendaraan Anda.</p>
            <button className={styles.featureButton}>Detail</button>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.imageWrapper}>
              <Image src="/images/toilet.jpeg" alt="Toilet Bersih" width={300} height={200} className="feature-image" />
            </div>
            <h3>Toilet Bersih</h3>
            <p>Tersedia ruang ganti dan toilet yang bersih dan nyaman.</p>
            <button className={styles.featureButton}>Detail</button>
          </div>
        </div>
      </section>
      {/* SECTION GALERRY */}
      <section id="gallery" className={styles.galleryContainer}>
      <div className={styles.judulGallery}>
        <h1>Gallery</h1>
      </div>
      <div className={styles.deskripsiGallery}>
        <h3>Temukan inspirasimu dan jadi bagian dari perjalanan kami!</h3>
      </div>
      <div className={styles.galleryBanner}></div>


          <div className={styles.slider} style={{
                '--width': '200px',
                '--height': '50px',
                '--quantity': '10',
              } as React.CSSProperties}>
                <div className={styles.list}>
                  <div className={styles.item} style={{ '--position': 1 } as React.CSSProperties}>
                    <Image src="/images/slide1.jpg" alt="Slider 1" width={100} height={50} />
                  </div>
                  <div className={styles.item} style={{ '--position': 2 } as React.CSSProperties}>
                    <Image src="/images/slide2.jpg" alt="Slider 2" width={100} height={50} />
                  </div>
                  <div className={styles.item} style={{ '--position': 3 } as React.CSSProperties}>
                    <Image src="/images/slide3.jpg" alt="Slider 3" width={100} height={50} />
                  </div>
                  <div className={styles.item} style={{ '--position': 4 } as React.CSSProperties}>
                    <Image src="/images/slide4.jpg" alt="Slider 4" width={100} height={50} />
                  </div>
                  <div className={styles.item} style={{ '--position': 5 } as React.CSSProperties}>
                    <Image src="/images/slide5.jpg" alt="Slider 5" width={100} height={50} />
                  </div>
                  <div className={styles.item} style={{ '--position': 6 } as React.CSSProperties}>
                    <Image src="/images/slide1.jpg" alt="Slider 6" width={100} height={50} />
                  </div>
                  <div className={styles.item} style={{ '--position': 7 } as React.CSSProperties}>
                    <Image src="/images/slide2.jpg" alt="Slider 7" width={100} height={50} />
                  </div>
                  <div className={styles.item} style={{ '--position': 8 } as React.CSSProperties}>
                    <Image src="/images/slide3.jpg" alt="Slider 8" width={100} height={50} />
                  </div>
                  <div className={styles.item} style={{ '--position': 9 } as React.CSSProperties}>
                    <Image src="/images/slide4.jpg" alt="Slider 9" width={100} height={50} />
                  </div>
                  <div className={styles.item} style={{ '--position': 10 } as React.CSSProperties}>
                    <Image src="/images/slide5.jpg" alt="Slider 10" width={100} height={50} />
                  </div>
                </div>
              </div>

              <div className={styles.slider} data-reverse="true" style={{
                '--width': '200px',
                '--height': '200px',
                '--quantity': '9',
                '--margin-top' : '1rem'
              } as React.CSSProperties}>
                <div className={styles.list}>
                  <div className={styles.item} style={{ '--position': 1 } as React.CSSProperties}>
                    <Image src="/images/slider_1.jpg" alt="Slider 1" width={200} height={200} />
                  </div>
                  <div className={styles.item} style={{ '--position': 2 } as React.CSSProperties}>
                    <Image src="/images/slider_2.jpeg" alt="Slider 2" width={200} height={200} />
                  </div>
                  <div className={styles.item} style={{ '--position': 3 } as React.CSSProperties}>
                    <Image src="/images/slider_3.jpeg" alt="Slider 3" width={200} height={200} />
                  </div>
                  <div className={styles.item} style={{ '--position': 4 } as React.CSSProperties}>
                    <Image src="/images/slider_4.jpg" alt="Slider 4" width={200} height={200} />
                  </div>
                  <div className={styles.item} style={{ '--position': 5 } as React.CSSProperties}>
                    <Image src="/images/slider_5.jpg" alt="Slider 5" width={200} height={200} />
                  </div>
                  <div className={styles.item} style={{ '--position': 6 } as React.CSSProperties}>
                    <Image src="/images/slider_6.jpg" alt="Slider 6" width={200} height={200} />
                  </div>
                  <div className={styles.item} style={{ '--position': 7 } as React.CSSProperties}>
                    <Image src="/images/slider_7.jpg" alt="Slider 7" width={200} height={200} />
                  </div>
                  <div className={styles.item} style={{ '--position': 8 } as React.CSSProperties}>
                    <Image src="/images/slider_8.jpg" alt="Slider 8" width={200} height={200} />
                  </div>
                  <div className={styles.item} style={{ '--position': 9 } as React.CSSProperties}>
                    <Image src="/images/slider_9.jpg" alt="Slider 9" width={200} height={200} />
                  </div>
                </div>
              </div>
        </section>
        {/* END SECTION GALLERY */}

        {/* SECTION ALUR PEMESANAN */}
        <section className={styles.bookingSection}>
          <div className={styles.bookingOverlay}>
            <div className={styles.judulBooking}>
              <h1>Alur Pemesanan</h1>
            </div>
            <div className={styles.deskripsiBooking}>
              <h3>Ikuti langkah mudah berikut untuk memesan lapangan futsal di <strong>LAGA JAWA FUTSAL</strong></h3>
            </div>

            <div className={styles.bookingSteps}>
              <div className={styles.stepCard}>
                <div className={styles.stepNumber}>1</div>
                <h3>Login / Buat Akun</h3>
                <p>Masuk ke akun kamu atau buat akun baru.</p>
              </div>
              <div className={styles.stepCard}>
                <div className={styles.stepNumber}>2</div>
                <h3>Pilih Menu Booking</h3>
                <p>Buka halaman booking untuk memesan</p>
              </div>
              <div className={styles.stepCard}>
                <div className={styles.stepNumber}>3</div>
                <h3>Pilih Jadwal</h3>
                <p>Sesuaikan jadwal dan lapangan yang tersedia</p>
              </div>
              <div className={styles.stepCard}>
                <div className={styles.stepNumber}>4</div>
                <h3>Pilih Pembayaran</h3>
                <p>Sesuaikan metode pembayaran yang diinginkan</p>
              </div>
              <div className={styles.stepCard}>
                <div className={styles.stepNumber}>5</div>
                <h3>SELESAI</h3>
                <p>Screenshot bukti bayar dan datang tepat waktu</p>
              </div>
            </div>
          </div>
        </section>
        {/* END SECTION ALUR PEMESANAN */}

        {/* SECTION LOKASI */}
        <section className={styles.lokasiSection}>
          <div className={styles.judulLokasi}>
            <h1>Lokasi</h1>
          </div>
          <div className={styles.deskripsiLokasi}>
            <h3>Ikuti langkah mudah berikut untuk memesan lapangan futsal di <strong>LAGA JAWA FUTSAL</strong></h3>
          </div>

        <div className={styles.contentLokasi}>
          <div className={styles.mapFrame}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3951.5026830854117!2d112.6161209!3d-7.946891200000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e78827687d272e7%3A0x789ce9a636cd3aa2!2sPoliteknik%20Negeri%20Malang!5e0!3m2!1sid!2sid!4v1745550213010!5m2!1sid!2sid"
              loading="lazy"
              width="100%"
              height="100%"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

          <div className={styles.detailAlamat}>
            <div className={styles.fotoContainer}>
              <Image src="/images/toilet.jpeg" alt="Gedung" width={200} height={80} className={styles.fotoGedung} />
              <div className={styles.logoOverlay}>
                <Image src="/images/logo.png" alt="Logo" width={80} height={30} />
              </div>
            </div>
            <div className={styles.rincianAlamat}>
              <strong>Alamat :</strong> Jl. Soekarno Hatta 17, Lowokwaru, Kota Malang - 65142
            </div>
            <a
              href="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3951.5026830854117!2d112.6161209!3d-7.946891200000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e78827687d272e7%3A0x789ce9a636cd3aa2!2sPoliteknik%20Negeri%20Malang!5e0!3m2!1sid!2sid!4v1745550213010!5m2!1sid!2sid"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.buttonMap}
            >
              Go to Map
            </a>
          </div>
        </div>
      </section>
      
    
      </div>
    );
}