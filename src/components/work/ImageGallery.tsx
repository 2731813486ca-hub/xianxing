"use client";

import { useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface GalleryImage {
  url: string;
  alt: string;
}

export function ImageGallery({ images }: { images: GalleryImage[] }) {
  const [current, setCurrent] = useState(0);

  if (images.length === 0) return null;

  return (
    <div className="relative overflow-hidden rounded-xl bg-card-hover">
      <div className="flex max-h-[70vh] items-center justify-center">
        <img
          src={images[current].url}
          alt={images[current].alt}
          className="max-h-[70vh] w-full object-contain"
        />
      </div>

      {images.length > 1 && (
        <>
          <button
            onClick={() => setCurrent((i) => (i === 0 ? images.length - 1 : i - 1))}
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/70 p-2 text-foreground backdrop-blur-sm transition-colors hover:bg-white/90 dark:bg-black/50 dark:text-white dark:hover:bg-black/70"
            aria-label="上一张"
          >
            <FiChevronLeft size={20} />
          </button>
          <button
            onClick={() => setCurrent((i) => (i === images.length - 1 ? 0 : i + 1))}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/70 p-2 text-foreground backdrop-blur-sm transition-colors hover:bg-white/90 dark:bg-black/50 dark:text-white dark:hover:bg-black/70"
            aria-label="下一张"
          >
            <FiChevronRight size={20} />
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2 w-2 rounded-full transition-all ${
                  i === current ? "bg-gold w-4" : "bg-black/30 hover:bg-black/50 dark:bg-white/40 dark:hover:bg-white/60"
                }`}
                aria-label={`第 ${i + 1} 张图片`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
