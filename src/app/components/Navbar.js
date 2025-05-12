'use client'; // Untuk Next.js App Router

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import styles from './Navbar.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { FaHome, FaUser, FaShoppingBag, FaImages, FaCog } from 'react-icons/fa';

// Tambahkan label untuk mobile menu
const mobileMenu = [
  { icon: FaHome, label: 'Home', href: '/' },
  { icon: FaUser, label: 'Profile', href: '/profile' },
  { icon: FaShoppingBag, label: 'Booking', href: '/booking' },
  { icon: FaImages, label: 'Event', href: '/event' },
  { icon: FaCog, label: 'Setting', href: '/setting' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [activeIndex, setActiveIndex] = useState(2); // Default ke item ke-3 (index 2)
  const navRef = useRef(null);
  const liRefs = useRef([]);

  const menu = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'Contact', href: '/contact' },
    { label: 'Booking', href: '/booking' },  // Menambahkan menu Booking untuk desktop
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (liRefs.current[activeIndex]) {
      const offsetLeft = liRefs.current[activeIndex].offsetLeft;
      navRef.current.style.setProperty('--position-x-active', `${offsetLeft}px`);
    }
  }, [activeIndex]);

  if (isDesktop) {
    return (
      <motion.nav
        className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className={styles.logo}>
          <Link href="/">
            <Image src="/images/logo.png" alt="Logo" width={250} height={50} />
          </Link>
        </div>
        <ul className={styles.navMenu}>
          {menu.map(({ label, href }) => (
            <li key={href}>
              <Link href={href} className={styles.navLink}>
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </motion.nav>
    );
  } else {
    return (
      <nav ref={navRef} className={styles.mobileNavbar}>
        <ul className={styles.navList}>
          {mobileMenu.map(({ icon: Icon, label, href }, index) => (
            <li
              key={index}
              ref={(el) => (liRefs.current[index] = el)}
              className={activeIndex === index ? styles.active : ''}
              onClick={() => setActiveIndex(index)}
            >
              <Link href={href} className={styles.navLink}>
                <Icon size={16} />
                <span className={styles.iconLabel}>{label}</span>
              </Link>
            </li>
          ))}
        </ul>
        <div className={styles.effect}>
          <div className={styles.circle}></div>
        </div>
      </nav>
    );
  }
}
