'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { BRAND, F_SIZE } from '@/lib/typography';
import { BlogImage } from '@/lib/blogApi';

interface ImageCarouselProps {
  images: BlogImage[];
}

export default function ImageCarousel({ images }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  if (images.length === 0) return null;

  const currentImage = images[currentIndex];

  return (
    <div>
      {/* Main Image */}
      <motion.div
        key={currentIndex}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '16/9',
          borderRadius: 16,
          overflow: 'hidden',
          background: BRAND.light,
          marginBottom: 20,
        }}
      >
        <Image
          src={currentImage.url}
          alt={currentImage.altText || 'Blog image'}
          fill
          style={{ objectFit: 'cover' }}
        />

        {/* Navigation Buttons */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              style={{
                position: 'absolute',
                left: 16,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(255, 255, 255, 0.9)',
                border: 'none',
                borderRadius: '50%',
                width: 44,
                height: 44,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 2,
              }}
              aria-label="Previous image"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              onClick={handleNext}
              style={{
                position: 'absolute',
                right: 16,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(255, 255, 255, 0.9)',
                border: 'none',
                borderRadius: '50%',
                width: 44,
                height: 44,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 2,
              }}
              aria-label="Next image"
            >
              <ChevronRight size={20} />
            </button>

            {/* Image Counter */}
            <div style={{
              position: 'absolute',
              bottom: 12,
              right: 12,
              background: 'rgba(0, 0, 0, 0.6)',
              color: 'white',
              padding: '6px 12px',
              borderRadius: 6,
              fontSize: F_SIZE.sm,
              fontWeight: 700,
            }}>
              {currentIndex + 1} / {images.length}
            </div>
          </>
        )}
      </motion.div>

      {/* Caption */}
      {currentImage.caption && (
        <p style={{ fontSize: F_SIZE.sm, color: BRAND.textMuted, textAlign: 'center', marginBottom: 16 }}>
          {currentImage.caption}
        </p>
      )}

      {/* Thumbnails */}
      {images.length > 1 && (
        <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 12 }}>
          {images.map((image, idx) => (
            <motion.button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                position: 'relative',
                width: 80,
                height: 60,
                borderRadius: 8,
                overflow: 'hidden',
                border: idx === currentIndex ? `2px solid ${BRAND.primary}` : `1px solid ${BRAND.border}`,
                cursor: 'pointer',
                flexShrink: 0,
                background: BRAND.light,
              }}
            >
              <Image
                src={image.url}
                alt={`Thumbnail ${idx + 1}`}
                fill
                style={{ objectFit: 'cover' }}
              />
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}
