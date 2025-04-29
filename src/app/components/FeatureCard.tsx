import React, { ReactNode } from "react";
import Image from "next/image";

type FeatureCardProps = {
  title: string;
  description: string;
  imageUrl: string;
  buttonText?: string;
  buttonComponent?: ReactNode; // Menerima komponen Button sebagai prop
};

const FeatureCard = ({
  title,
  description,
  imageUrl,
  buttonComponent,
}: FeatureCardProps) => {
  return (
    <div className="bg-white rounded-xl p-4 shadow-lg flex flex-col items-center text-center max-w-sm hover:shadow-2xl duration-300 group">
      {/* Container untuk gambar */}
      <div className="bg-white rounded-lg overflow-hidden w-full mb-4 group">
        <div className="relative w-full h-48 overflow-hidden">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105" // Efek hover pada gambar
            sizes="(max-width: 640px) 100vw, 33vw"
            priority
          />
        </div>
      </div>

      {/* Title dan description */}
      <h2 className="text-gray-900 text-lg font-semibold mb-2">{title}</h2>
      <p className="text-gray-600 text-sm mb-4">{description}</p>

      {/* Menampilkan komponen Button yang diterima sebagai prop */}
      {buttonComponent}
    </div>
  );
};

export default FeatureCard;
