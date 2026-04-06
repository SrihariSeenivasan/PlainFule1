'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { ShieldCheck, RefreshCw, HelpCircle, Star, Play, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { F_SIZE, BRAND, FONTS } from '@/lib/typography';
import { buildApiUrl } from '@/lib/api-config';

/* ── TYPES ── */
interface TextReview {
  category: string;
  name: string;
  location: string;
  quote: string;
  rating: number;
  img: string;
  avatar: string;
}

interface VideoReview {
  name: string;
  role: string;
  quote: string;
  rating: number;
  img: string;
  videoUrl?: string;
}

/* ── FALLBACK DATA (for SSR/errors) ── */
const FALLBACK_TEXT_REVIEWS: TextReview[] = [
  {
    category: 'Physical Demand',
    name: 'Rajan Mehta',
    location: 'Marathon Runner · Pune',
    quote: 'My recovery time dropped by almost half. After 12 years of training Ive never felt this consistent — not even close.',
    rating: 5,
    img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&q=80',
    avatar: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=80&q=80',
  },
];

const FALLBACK_VIDEO_REVIEWS: VideoReview[] = [
  {
    name: 'Steven Bartlett',
    role: 'Award Winning Podcaster\nbehind The Diary of a CEO',
    quote: '&quot;Huel is an ally on my busiest days&quot;',
    rating: 5,
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&q=80',
  },
];

const RATING_BARS = [
  { label: '5★', pct: 78 },
  { label: '4★', pct: 14 },
  { label: '3★', pct: 5 },
  { label: '2★', pct: 2 },
  { label: '1★', pct: 1 },
];

const TRUST = [
  { icon: <ShieldCheck size={16} color={BRAND.primaryDark} />, text: 'All reviews verified by purchase' },
  { icon: <HelpCircle size={16} color={BRAND.primaryDark} />, text: 'No filtered or paid reviews' },
  { icon: <RefreshCw size={16} color={BRAND.primaryDark} />, text: 'Updated weekly · 52,841 reviews' },
];

/* ── HOOK: responsive cards per view ── */
function useCardsPerView() {
  const [width, setWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );
  
  useEffect(() => {
    const handle = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handle);
    return () => window.removeEventListener('resize', handle);
  }, []);
  
  if (width < 640) return 1;
  if (width < 900) return 2;
  if (width < 1100) return 3;
  return 4;
}

/* ── VIDEO MODAL ── */
function VideoModal({ videoUrl, onClose }: { videoUrl: string; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
        padding: '20px',
      }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '900px',
          aspectRatio: '16 / 9',
          backgroundColor: '#000',
          borderRadius: '12px',
          overflow: 'hidden',
        }}
      >
        <video
          src={videoUrl}
          controls
          autoPlay
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
          }}
        />
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            zIndex: 10,
          }}
        >
          ✕
        </button>
      </motion.div>
    </motion.div>
  );
}


function StarRow({ rating, size = 12 }: { rating: number; size?: number }) {
  return (
    <div style={{ display: 'flex', gap: 3 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          fill={i <= rating ? BRAND.primaryDark : BRAND.tertiary}
          stroke="none"
        />
      ))}
    </div>
  );
}

/* ── TEXT REVIEW CARD ── */
function TextReviewCard({ review, index }: { review: TextReview; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.07, ease: [0.22, 0.68, 0, 1.2] }}
      whileHover={{ y: -7, boxShadow: '0 28px 64px rgba(50,45,41,0.13)' }}
      style={{
        background: BRAND.white,
        borderRadius: 24,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        height: 530,
        transition: 'box-shadow 0.3s ease',
      }}
    >
      {/* Image Zone */}
      <div
        style={{
          background: BRAND.light,
          borderRadius: 16,
          margin: '12px 12px 0',
          width: 'calc(100% - 24px)',
          height: 200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          position: 'relative',
          flexShrink: 0,
        }}
      >
        <Image
          src={review.img}
          alt={review.name}
          fill
          style={{ objectFit: 'cover', borderRadius: 14 }}
          unoptimized
        />

        {/* Verified Check */}
        <div
          style={{
            position: 'absolute', top: 12, right: 12,
            width: 32, height: 32, borderRadius: '50%',
            background: BRAND.white,
            border: `1.5px solid ${BRAND.quaternary}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(50,45,41,0.08)',
          }}
        >
          <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke={BRAND.primary} strokeWidth={2.5}>
            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* Card Body */}
      <div style={{ padding: '16px 18px 18px', flex: 1, display: 'flex', flexDirection: 'column', gap: 7, overflow: 'hidden' }}>

        {/* Category Tag */}
        <span
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            padding: '3px 10px', borderRadius: 100,
            background: `rgba(114,56,61,0.08)`,
            fontSize: '0.66rem', fontWeight: 700, color: BRAND.primaryDark,
            textTransform: 'uppercase', letterSpacing: '0.07em', width: 'fit-content',
            flexShrink: 0,
          }}
        >
          {review.category}
        </span>

        <div style={{ fontSize: F_SIZE.md, fontWeight: 900, color: BRAND.primary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flexShrink: 0 }}>
          {review.name}
        </div>

        <p style={{ fontSize: '0.855rem', color: BRAND.secondary, lineHeight: 1.65, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', textOverflow: 'ellipsis', margin: 0, flex: 1 }}>
          &quot;{review.quote}&quot;
        </p>

        {/* Reviewer Row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 'auto', paddingTop: 12, borderTop: `1px solid ${BRAND.light}` }}>
          <div style={{ position: 'relative', width: 28, height: 28, borderRadius: '50%', overflow: 'hidden', border: `1.5px solid ${BRAND.tertiary}`, flexShrink: 0 }}>
            <Image src={review.avatar} alt={review.name} fill style={{ objectFit: 'cover' }} unoptimized />
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: '0.76rem', fontWeight: 700, color: BRAND.primary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{review.name}</div>
            <div style={{ fontSize: '0.7rem', color: BRAND.secondary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{review.location}</div>
          </div>
        </div>

        {/* Footer - Rating */}
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            marginTop: 10, paddingTop: 10,
            borderTop: `1px solid ${BRAND.light}`,
            flexShrink: 0,
          }}
        >
          <StarRow rating={review.rating} size={11} />
          <span style={{ fontSize: '0.73rem', color: BRAND.secondary, fontWeight: 500 }}>
            {review.rating}.0
          </span>
        </div>
      </div>
    </motion.div>
  );
}

/* ── VIDEO REVIEW CARD ── */
function VideoReviewCard({ review, index }: { review: VideoReview; index: number }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: false, amount: 0.5 });

  // Auto-play when card comes into view
  useEffect(() => {
    if (isInView && review.videoUrl) {
      setIsPlaying(true);
    }
  }, [isInView, review.videoUrl]);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.07, ease: [0.22, 0.68, 0, 1.2] }}
      whileHover={{ y: -7 }}
      style={{
        background: BRAND.primary,
        borderRadius: 24,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        height: 440,
        transition: 'transform 0.3s ease',
      }}
    >
      {/* Image/Video Zone */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: 270,
          background: BRAND.light,
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        {!isPlaying ? (
          <>
            {/* Thumbnail Image */}
            <Image
              src={review.img}
              alt={review.name}
              fill
              style={{ objectFit: 'cover' }}
              unoptimized
            />

            {/* Gradient Overlay */}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(50,45,41,0.75) 0%, transparent 55%)' }} />

            {/* Play Button */}
            <motion.button
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => review.videoUrl && setIsPlaying(true)}
              disabled={!review.videoUrl}
              style={{
                position: 'absolute', top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 52, height: 52, borderRadius: '50%',
                background: review.videoUrl ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.08)',
                border: '1.5px solid rgba(255,255,255,0.35)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: review.videoUrl ? 'pointer' : 'not-allowed',
                opacity: review.videoUrl ? 1 : 0.5,
                zIndex: 5,
              }}
            >
              <Play size={16} fill={BRAND.white} stroke="none" />
            </motion.button>

            {/* Name + Role Overlay */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px 18px', zIndex: 10 }}>
              <div style={{ fontSize: F_SIZE.md, fontWeight: 900, color: BRAND.white, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {review.name}
              </div>
              <div style={{ fontSize: '0.76rem', color: 'rgba(239,233,225,0.75)', lineHeight: 1.45 }}>
                {review.role}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Video Player */}
            <video
              src={review.videoUrl}
              controls
              autoPlay
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                backgroundColor: '#000',
              }}
              onEnded={() => setIsPlaying(false)}
            />
            
            {/* Close Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsPlaying(false)}
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                zIndex: 20,
              }}
            >
              ✕
            </motion.button>
          </>
        )}
      </div>

      {/* Card Body */}
      <div style={{ padding: '16px 18px 18px', flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <p style={{ fontSize: '0.835rem', color: 'rgba(239,233,225,0.8)', lineHeight: 1.6, margin: 0, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', textOverflow: 'ellipsis', flex: 1 }}>
          {review.quote}
        </p>

        {/* Footer - Rating */}
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: 7,
            paddingTop: 12, marginTop: 'auto',
            borderTop: `1px solid rgba(255,255,255,0.12)`,
            flexShrink: 0,
          }}
        >
          <StarRow rating={review.rating} size={11} />
          <span style={{ fontSize: '0.73rem', color: 'rgba(239,233,225,0.7)', fontWeight: 500, marginLeft: 4 }}>
            {review.rating}.0
          </span>
        </div>
      </div>
    </motion.div>
  );
}

/* ── CAROUSEL HOOK ── */
function useResponsiveCarousel(total: number) {
  const [width, setWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  // Update on resize
  useEffect(() => {
    const handle = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handle);
    return () => window.removeEventListener('resize', handle);
  }, []);

  const perView = width < 640 ? 1 : width < 900 ? 2 : width < 1100 ? 3 : 4;
  const maxSlide = Math.max(0, total - perView);
  return { perView, maxSlide };
}

/* ── MAIN EXPORT ── */
export default function ReviewsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [currentTextSlide, setCurrentTextSlide] = useState(0);
  const [currentVideoSlide, setCurrentVideoSlide] = useState(0);
  const [textReviews, setTextReviews] = useState<TextReview[]>(FALLBACK_TEXT_REVIEWS);
  const [videoReviews, setVideoReviews] = useState<VideoReview[]>(FALLBACK_VIDEO_REVIEWS);
  const [loading, setLoading] = useState(true);

  // Fetch reviews from backend on mount
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        
        // Fetch customer reviews
        const customerRes = await fetch(buildApiUrl('/testimonials/customer-reviews'));
        if (customerRes.ok) {
          const customerData = await customerRes.json();
          const formattedCustomer: TextReview[] = customerData.map((review: any) => ({
            category: review.category || 'Customer Feedback',
            name: review.name,
            location: review.location || '',
            quote: review.quote,
            rating: review.rating,
            img: review.mainImage || 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&q=80',
            avatar: review.avatarImage || 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=80&q=80',
          }));
          if (formattedCustomer.length > 0) {
            setTextReviews(formattedCustomer);
          }
        }

        // Fetch video reviews
        const videoRes = await fetch(buildApiUrl('/testimonials/video-reviews'));
        if (videoRes.ok) {
          const videoData = await videoRes.json();
          const formattedVideo: VideoReview[] = videoData.map((review: any) => ({
            name: review.name,
            role: review.role || '',
            quote: review.quote,
            rating: review.rating,
            img: review.thumbnailImage || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&q=80',
            videoUrl: review.videoUrl || undefined,
          }));
          if (formattedVideo.length > 0) {
            setVideoReviews(formattedVideo);
          }
        }
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
        // Keep fallback data on error
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const { perView: textCardsPerView, maxSlide: maxTextSlide } = useResponsiveCarousel(textReviews.length);
  const { perView: videoCardsPerView, maxSlide: maxVideoSlide } = useResponsiveCarousel(videoReviews.length);

  // Clamp slides when perView changes
  const safeTextSlide = Math.min(currentTextSlide, maxTextSlide);
  const safeVideoSlide = Math.min(currentVideoSlide, maxVideoSlide);

  const handleTextNext = () => setCurrentTextSlide((prev) => (prev >= maxTextSlide ? 0 : prev + 1));
  const handleTextPrev = () => setCurrentTextSlide((prev) => (prev <= 0 ? maxTextSlide : prev - 1));
  const handleVideoNext = () => setCurrentVideoSlide((prev) => (prev >= maxVideoSlide ? 0 : prev + 1));
  const handleVideoPrev = () => setCurrentVideoSlide((prev) => (prev <= 0 ? maxVideoSlide : prev - 1));

  const textItemWidth = `calc(${100 / textCardsPerView}% - ${(textCardsPerView - 1) * 18 / textCardsPerView}px)`;
  const videoItemWidth = `calc(${100 / videoCardsPerView}% - ${(videoCardsPerView - 1) * 18 / videoCardsPerView}px)`;

  return (
    <section ref={ref} style={{ background: BRAND.white, padding: 'clamp(40px, 8vw, 80px) 20px' }}>
      <div style={{ maxWidth: 1140, margin: '0 auto' }}>

        {/* ── HEADER ── */}
        <div style={{ textAlign: 'center', marginBottom: 0 }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              padding: '5px 14px', borderRadius: 100,
              background: `rgba(114,56,61,0.08)`,
              border: `1px solid rgba(114,56,61,0.14)`,
              fontSize: '0.69rem', fontWeight: 800, color: BRAND.primaryDark,
              textTransform: 'uppercase', letterSpacing: '0.12em',
              marginBottom: 18,
            }}
          >
            <Star size={13} fill={BRAND.primaryDark} stroke="none" />
            Verified Purchases Only
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.55 }}
            style={{ fontSize: F_SIZE.xl, fontWeight: 900, color: BRAND.primary, lineHeight: 1.18, marginBottom: 12 }}
          >
            Over <span style={{ color: BRAND.primaryDark }}>50,000</span> Happy Customers
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2, duration: 0.5 }}
            style={{ fontSize: F_SIZE.md, color: BRAND.secondary, lineHeight: 1.7, maxWidth: 480, margin: '0 auto' }}
          >
            Every review is from a verified purchase — unfiltered and unedited.
          </motion.p>
        </div>

        {/* ── RATING SUMMARY ── */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'clamp(20px, 5vw, 40px)',
          margin: 'clamp(24px, 5vw, 44px) 0 clamp(30px, 6vw, 60px)',
          flexWrap: 'wrap',
        }}>

          {/* Big Score */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <div style={{ fontSize: 'clamp(2.5rem, 8vw, 4rem)', fontWeight: 900, color: BRAND.primary, lineHeight: 1, letterSpacing: '-0.03em' }}>4.8</div>
            <StarRow rating={5} size={20} />
            <div style={{ fontSize: '0.8rem', color: BRAND.secondary, fontWeight: 500 }}>Based on 52,841 reviews</div>
          </div>

          {/* Divider — hidden on mobile */}
          <div style={{ width: 1, height: 80, background: BRAND.tertiary, display: 'var(--divider-display, block)' }} />

          {/* Rating Bars */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9, minWidth: 'min(220px, 100%)' }}>
            {RATING_BARS.map((b) => (
              <div key={b.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: '0.78rem', color: BRAND.secondary, width: 28, textAlign: 'right', fontWeight: 600, flexShrink: 0 }}>{b.label}</span>
                <div style={{ flex: 1, height: 6, borderRadius: 100, background: BRAND.tertiary, overflow: 'hidden' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={inView ? { width: `${b.pct}%` } : {}}
                    transition={{ duration: 1, delay: 0.3, ease: [0.22, 0.68, 0, 1.2] }}
                    style={{ height: '100%', borderRadius: 100, background: BRAND.primaryDark }}
                  />
                </div>
                <span style={{ fontSize: '0.76rem', color: BRAND.secondary, width: 32, fontWeight: 500, flexShrink: 0 }}>{b.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── TEXT REVIEWS ── */}
        <div style={{ marginBottom: 'clamp(36px, 8vw, 72px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'clamp(16px, 4vw, 28px)', gap: 12, flexWrap: 'wrap' }}>
            <motion.h3
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              style={{ fontSize: F_SIZE.lg, fontWeight: 900, color: BRAND.primary }}
            >
              Customer Reviews
            </motion.h3>

            {/* Dots (top) */}
            <div style={{ display: 'flex', gap: 6 }}>
              {Array.from({ length: maxTextSlide + 1 }).map((_, i) => (
                <motion.button
                  key={i}
                  onClick={() => setCurrentTextSlide(i)}
                  whileHover={{ scale: 1.15 }}
                  style={{
                    width: i === safeTextSlide ? 24 : 8,
                    height: 8, borderRadius: 100,
                    background: i === safeTextSlide ? BRAND.primaryDark : BRAND.tertiary,
                    border: 'none', cursor: 'pointer', padding: 0,
                    transition: 'all 0.35s cubic-bezier(.22,.68,0,1.2)',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Carousel */}
          <div style={{ overflow: 'hidden', borderRadius: 20 }}>
            <motion.div
              style={{ display: 'flex', gap: 18 }}
              animate={{ x: `-${safeTextSlide * (100 / textCardsPerView)}%` }}
              transition={{ duration: 0.55, ease: [0.22, 0.68, 0, 1.2] }}
            >
              {textReviews.map((review, i) => (
                <div key={`${review.name}-${i}`} style={{ flex: `0 0 ${textItemWidth}`, minWidth: 0 }}>
                  <TextReviewCard review={review} index={i} />
                </div>
              ))}
            </motion.div>
          </div>

          {/* Nav */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: 'clamp(16px, 4vw, 28px)' }}>
            <motion.button
              whileHover={{ scale: 1.08, background: BRAND.primary, color: BRAND.white }}
              whileTap={{ scale: 0.95 }}
              onClick={handleTextPrev}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: 44, height: 44, borderRadius: '50%',
                background: BRAND.white, border: `2px solid ${BRAND.primary}`,
                color: BRAND.primary, cursor: 'pointer', transition: 'all 0.22s ease',
              }}
            >
              <ChevronLeft size={18} />
            </motion.button>

            <div style={{ display: 'flex', gap: 6 }}>
              {Array.from({ length: maxTextSlide + 1 }).map((_, i) => (
                <motion.button
                  key={i}
                  onClick={() => setCurrentTextSlide(i)}
                  whileHover={{ scale: 1.15 }}
                  style={{
                    width: i === safeTextSlide ? 24 : 8,
                    height: 8, borderRadius: 100,
                    background: i === safeTextSlide ? BRAND.primaryDark : BRAND.tertiary,
                    border: 'none', cursor: 'pointer', padding: 0,
                    transition: 'all 0.35s cubic-bezier(.22,.68,0,1.2)',
                  }}
                />
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.08, background: BRAND.primary, color: BRAND.white }}
              whileTap={{ scale: 0.95 }}
              onClick={handleTextNext}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: 44, height: 44, borderRadius: '50%',
                background: BRAND.white, border: `2px solid ${BRAND.primary}`,
                color: BRAND.primary, cursor: 'pointer', transition: 'all 0.22s ease',
              }}
            >
              <ChevronRight size={18} />
            </motion.button>
          </div>
        </div>

        {/* ── DIVIDER ── */}
        <div style={{ height: 1, background: BRAND.tertiary, margin: '0 0 64px' }} />

        {/* ── VIDEO REVIEWS ── */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, gap: 12, flexWrap: 'wrap' }}>
            <motion.h3
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              style={{ fontSize: F_SIZE.lg, fontWeight: 900, color: BRAND.primary }}
            >
              Real Peoples Real Results
            </motion.h3>

            <div style={{ display: 'flex', gap: 6 }}>
              {Array.from({ length: maxVideoSlide + 1 }).map((_, i) => (
                <motion.button
                  key={i}
                  onClick={() => setCurrentVideoSlide(i)}
                  whileHover={{ scale: 1.15 }}
                  style={{
                    width: i === safeVideoSlide ? 24 : 8,
                    height: 8, borderRadius: 100,
                    background: i === safeVideoSlide ? BRAND.primaryDark : BRAND.tertiary,
                    border: 'none', cursor: 'pointer', padding: 0,
                    transition: 'all 0.35s cubic-bezier(.22,.68,0,1.2)',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Carousel */}
          <div style={{ overflow: 'hidden', borderRadius: 20 }}>
            <motion.div
              style={{ display: 'flex', gap: 18 }}
              animate={{ x: `-${safeVideoSlide * (100 / videoCardsPerView)}%` }}
              transition={{ duration: 0.55, ease: [0.22, 0.68, 0, 1.2] }}
            >
              {videoReviews.map((review, i) => (
                <div key={`${review.name}-${i}`} style={{ flex: `0 0 ${videoItemWidth}`, minWidth: 0 }}>
                  <VideoReviewCard 
                    review={review} 
                    index={i}
                  />
                </div>
              ))}
            </motion.div>
          </div>

          {/* Nav */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: 28 }}>
            <motion.button
              whileHover={{ scale: 1.08, background: BRAND.primary, color: BRAND.white }}
              whileTap={{ scale: 0.95 }}
              onClick={handleVideoPrev}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: 44, height: 44, borderRadius: '50%',
                background: BRAND.white, border: `2px solid ${BRAND.primary}`,
                color: BRAND.primary, cursor: 'pointer', transition: 'all 0.22s ease',
              }}
            >
              <ChevronLeft size={18} />
            </motion.button>

            <div style={{ display: 'flex', gap: 6 }}>
              {Array.from({ length: maxVideoSlide + 1 }).map((_, i) => (
                <motion.button
                  key={i}
                  onClick={() => setCurrentVideoSlide(i)}
                  whileHover={{ scale: 1.15 }}
                  style={{
                    width: i === safeVideoSlide ? 24 : 8,
                    height: 8, borderRadius: 100,
                    background: i === safeVideoSlide ? BRAND.primaryDark : BRAND.tertiary,
                    border: 'none', cursor: 'pointer', padding: 0,
                    transition: 'all 0.35s cubic-bezier(.22,.68,0,1.2)',
                  }}
                />
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.08, background: BRAND.primary, color: BRAND.white }}
              whileTap={{ scale: 0.95 }}
              onClick={handleVideoNext}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: 44, height: 44, borderRadius: '50%',
                background: BRAND.white, border: `2px solid ${BRAND.primary}`,
                color: BRAND.primary, cursor: 'pointer', transition: 'all 0.22s ease',
              }}
            >
              <ChevronRight size={18} />
            </motion.button>
          </div>
        </div>

        {/* ── TRUST STRIP ── */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 'clamp(16px, 4vw, 36px)', marginTop: 56, paddingTop: 32,
          borderTop: `1px solid ${BRAND.tertiary}`, flexWrap: 'wrap',
        }}>
          {TRUST.map((t, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.84rem', color: BRAND.secondary, fontWeight: 500 }}>
              {t.icon}
              {t.text}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}