import React, { ReactNode } from "react";
import Image from "next/image";

type FeatureCardBGProps = {
  title: string;
  description: string;
  imageUrl: string;
  backgroundUrl?: string;
  buttonComponent?: ReactNode; // Menerima komponen Button sebagai prop
};

const FeatureCardBG = ({
  title,
  description,
  imageUrl,
  backgroundUrl,
  buttonComponent,
}: FeatureCardBGProps) => {
  return (
    <div
      className="rounded-xl py-5 px-5 shadow-lg flex flex-col items-center text-center max-w-sm bg-cover bg-center relative overflow-hidden group hover:shadow-2xl transition-all duration-300"
      style={{ backgroundImage: `url(${backgroundUrl})` }}
    >
      <div className="bg-white rounded-lg overflow-hidden w-full mb-4 group">
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
      </div>
      <h2 className="text-white text-lg font-semibold mb-2">{title}</h2>
      <p className="text-gray-200 text-sm mb-4">{description}</p>

      {/* Menampilkan komponen Button yang diterima sebagai prop */}
      {buttonComponent}
    </div>
  );
};

export default FeatureCardBG;
