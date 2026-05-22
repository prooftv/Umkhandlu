'use client';

import { useCallback, useEffect, useState } from 'react';

type LightboxImage = {
  src: string;
  alt: string;
  caption?: string;
};

type Props = {
  images: LightboxImage[];
  children: (openAt: (index: number) => void) => React.ReactNode;
};

export default function Lightbox({ images, children }: Props) {
  const [index, setIndex] = useState<number | null>(null);

  const close = useCallback(() => setIndex(null), []);
  const prev = useCallback(
    () =>
      setIndex((i) =>
        i !== null ? (i - 1 + images.length) % images.length : null
      ),
    [images.length]
  );
  const next = useCallback(
    () => setIndex((i) => (i !== null ? (i + 1) % images.length : null)),
    [images.length]
  );

  useEffect(() => {
    if (index === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    }
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [index, close, prev, next]);

  const current = index !== null ? images[index] : null;

  return (
    <>
      {children((i) => setIndex(i))}

      {current && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center"
          onClick={close}
          onKeyDown={(e) => e.key === 'Escape' && close()}
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
        >
          <button
            type="button"
            onClick={close}
            className="absolute top-4 right-4 text-white/80 hover:text-white text-3xl z-10"
            aria-label="Close"
          >
            ✕
          </button>

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white text-4xl z-10"
                aria-label="Previous"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white text-4xl z-10"
                aria-label="Next"
              >
                ›
              </button>
            </>
          )}

          <div className="max-w-[90vw] max-h-[85vh] flex flex-col items-center">
            {/* biome-ignore lint/performance/noImgElement: lightbox uses dynamic CDN URLs */}
            <img
              src={current.src}
              alt={current.alt}
              className="max-w-full max-h-[75vh] object-contain rounded-lg"
            />
            {current.caption && (
              <p className="text-white/80 text-sm mt-3 text-center max-w-lg">
                {current.caption}
              </p>
            )}
            {images.length > 1 && (
              <p className="text-white/50 text-xs mt-2">
                {(index ?? 0) + 1} / {images.length}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
