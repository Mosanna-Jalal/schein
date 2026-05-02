'use client';
import Image from 'next/image';
import { useState, useEffect } from 'react';

const ALL_IMAGES = [
  '/fabrics/andrej-lisakov-O0j9EivTKfI-unsplash.jpg',
  '/fabrics/aviv-rachmadian-7F7kEHj72MQ-unsplash.jpg',
  '/fabrics/cat-han-W_5Eakb1598-unsplash.jpg',
  '/fabrics/chuttersnap-RvzOH38nxoQ-unsplash.jpg',
  '/fabrics/tim-mossholder-nkdnMv-lRa0-unsplash.jpg',
  '/fabrics/towel-studio-s9K5Td7Dgsc-unsplash.jpg',
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const INTERVAL_MS = 2500;

export default function HeroCarousel() {
  const [images, setImages] = useState(ALL_IMAGES);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    setImages(shuffle(ALL_IMAGES));
  }, []);

  useEffect(() => {
    const id = setInterval(
      () => setCurrent((prev) => (prev + 1) % images.length),
      INTERVAL_MS
    );
    return () => clearInterval(id);
  }, [images.length]);

  return (
    <div className="absolute inset-0" style={{ zIndex: 0 }}>
      {images.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt=""
          fill
          sizes="100vw"
          priority={i === 0}
          aria-hidden="true"
          className="object-cover"
          style={{
            opacity: i === current ? 0.55 : 0,
            filter: 'brightness(75%) blur(1px)',
            transition: 'opacity 1s ease-in-out',
          }}
        />
      ))}
    </div>
  );
}
