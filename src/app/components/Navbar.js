'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Navbar.module.css';
import {
  Home,
  CalendarCheck,
  ClipboardList,
  Newspaper,
  User
} from 'lucide-react';

import { useEffect, useState } from 'react';

const menuItems = [
  { label: 'Home', href: '/home', icon: <Home size={24} /> },
  { label: 'Activities', href: '/aktivitas', icon: <ClipboardList size={24} /> },
  { label: 'Booking', href: '/booking', icon: <CalendarCheck size={24} /> },
  { label: 'News', href: '/news', icon: <Newspaper size={24} /> },
  { label: 'Account', href: '/setting', icon: <User size={24} /> },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 768);
    }

    handleResize(); // check on mount

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <nav className={styles.navbar}>
      <div className={`${styles.desktopNavbar} ${isMobile ? styles.hide : ''}`}>
        <div className={styles.logo}>
          <Image src="/images/logo.png" alt="Laga Jawa Futsal Logo" width={210} height={40} />
        </div>
        <div className={styles.menu}>
          {menuItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.menuItem} ${pathname === item.href ? styles.active : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      <div className={`${styles.mobileNavbar} ${isMobile ? styles.show : ''}`}>
        {menuItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={`${styles.mobileItem} ${pathname === item.href ? styles.active : ''}`}
          >
            {item.icon}
            <span className={styles.mobileLabel}>{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
