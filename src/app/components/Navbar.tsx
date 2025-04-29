"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const currentPath = usePathname();
  const [activeMobile, setActiveMobile] = useState<number | null>(null);
  const [positionX, setPositionX] = useState(0);

  const isActive = (path: string) => currentPath === path;

  const handleMobileClick = (index: number) => {
    setActiveMobile(index);
    setPositionX(index * 100); // Asumsikan setiap item memiliki lebar 100px
  };

  useEffect(() => {
    // Set posisi awal jika ada item aktif
    if (activeMobile !== null) {
      setPositionX(activeMobile * 100);
    }
  }, [activeMobile]);

  return (
    <nav className="bg-emerald-800 text-white p-4 fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center md:space-x-8">
        {/* Logo */}
        <div className="text-2xl font-bold">
          <Link href="/">Laga Jawa Futsal</Link>
        </div>

        {/* Menu for desktop */}
        <div className="hidden md:flex space-x-8">
          {[
            { href: "/", label: "Home" },
            { href: "/about", label: "About" },
            { href: "/services", label: "Services" },
            { href: "/contact", label: "Contact" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`relative hover:text-emerald-400 ${isActive(href) ? "text-emerald-400" : ""}`}
            >
              <div
                className={`absolute bottom-0 left-0 w-full h-1 bg-emerald-400 transition-all duration-300 ${
                  isActive(href) ? "scale-x-100" : "scale-x-0"
                }`}
              />
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* Menu for mobile */}
      <div className={`md:hidden ${styles.mobileNavbar}`}>
        <ul>
          {[
            { icon: "fa-house", label: "Home" },
            { icon: "fa-user", label: "Profile" },
            { icon: "fa-bag-shopping", label: "Shop" },
            { icon: "fa-images", label: "Gallery" },
            { icon: "fa-gear", label: "Settings" },
          ].map(({ icon, label }, index) => (
            <li
              key={index}
              className={activeMobile === index ? "active" : ""}
              onClick={() => handleMobileClick(index)}
            >
              <i className={`fa-solid ${icon}`}></i>
              <span>{label}</span>
            </li>
          ))}
        </ul>
        <div
          className={styles.effect}
          style={{
            left: `${positionX}px`, // Gerakkan efek berdasarkan status aktif
          }}
        >
          <div className={styles.circle}></div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
