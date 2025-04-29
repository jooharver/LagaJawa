'use client'
import Link from "next/link";
import React, { ReactNode } from "react";
import clsx from "clsx";

type ButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
  variant?: "primary" | "secondary" | "outline"; // Variants yang bisa dipilih
  href?: string; // Menambahkan properti href untuk penggunaan link
};

const Button = ({
  children,
  onClick,
  type = "button",
  className = "",
  variant = "primary", // default ke primary
  href,
}: ButtonProps) => {
  if (href) {
    return (
      <Link href={href} className={clsx(
        "px-6 py-3 rounded-xl font-semibold transition-all duration-300",
        {
          "bg-emerald-800 text-white hover:bg-emerald-600 hover:scale-105":
            variant === "primary", // primary button
          "bg-yellow-500 text-white hover:bg-yellow-400 hover:scale-105":
            variant === "secondary", // secondary button
          "border-2 border-white text-white hover:bg-gray-200 hover:text-black hover:scale-105":
            variant === "outline", // outline button
        },
        className // custom class yang diteruskan
      )}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={clsx(
        "px-6 py-3 rounded-xl font-semibold transition-all duration-300",
        {
          "bg-emerald-700 text-white hover:bg-emerald-600 hover:scale-105":
            variant === "primary", // primary button
          "bg-yellow-500 text-white hover:bg-yellow-400 hover:scale-105":
            variant === "secondary", // secondary button
          "border-2 border-white text-white hover:bg-gray-200 hover:text-black hover:scale-105":
            variant === "outline", // outline button
        },
        className // custom class yang diteruskan
      )}
    >
      {children}
    </button>
  );
};

export default Button;
