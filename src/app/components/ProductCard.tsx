"use client";

import React from "react";
import Image from "next/image";

type CardProps = {
  title: string;
  description?: string;
  imageUrl: string;
};

const ProductCard = ({ title, description, imageUrl }: CardProps) => {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer max-w-sm group">
      <div className="relative w-full h-48 overflow-hidden">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, 33vw"
          priority
        />
      </div>
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-2 group-hover:text-emerald-900">{title}</h2>
        {description && (
          <p className="text-gray-600 text-sm">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
