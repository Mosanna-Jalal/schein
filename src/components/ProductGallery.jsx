'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function ProductGallery({ images = [], name = '' }) {
  const [selected, setSelected] = useState(0);
  const [fading, setFading] = useState(false);

  const handleSelect = (i) => {
    if (i === selected) return;
    setFading(true);
    setTimeout(() => {
      setSelected(i);
      setFading(false);
    }, 150);
  };

  const safeImages = images.length ? images : ['/window.svg'];

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div className="relative aspect-[3/4] bg-zinc-50 overflow-hidden">
        <Image
          src={safeImages[selected]}
          alt={name}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className={`object-cover transition-opacity duration-150 ${fading ? 'opacity-0' : 'opacity-100'}`}
        />
      </div>

      {/* Thumbnail strip — only when more than 1 image */}
      {safeImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {safeImages.map((img, i) => (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              className={`relative shrink-0 w-16 h-20 bg-zinc-50 overflow-hidden border-2 transition-all duration-200 ${
                i === selected
                  ? 'border-black'
                  : 'border-transparent hover:border-zinc-300'
              }`}
              aria-label={`View image ${i + 1}`}
            >
              <Image
                src={img}
                alt={`${name} view ${i + 1}`}
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
