'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { ShieldCheck, RefreshCw, HelpCircle, Star, Play, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { F_SIZE, BRAND, FONTS } from '@/lib/typography';

/* ── DATA ── */
const TEXT_REVIEWS = [
  {
    category: 'Physical Demand',
    name: 'Rajan Mehta',
    location: 'Marathon Runner · Pune',
    quote: 'My recovery time dropped by almost half. After 12 years of training Ive never felt this consistent — not even close.',
    rating: 5,
    img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&q=80',
    avatar: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=80&q=80',
  },
  {
    category: 'Mental Performance',
    name: 'Priya Nair',
    location: 'Product Lead · Bengaluru',
    quote: 'Three months in — my afternoon brain fog is completely gone. My whole team noticed I was sharper in meetings before I told anyone.',
    rating: 5,
    img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&q=80',
  },
  {
    category: 'Family Growth',
    name: 'Ananya & Dev',
    location: 'Parents · Chennai',
    quote: 'As new parents we needed something we could fully trust. The clean label sold us — 60 days later both of us are on it every morning.',
    rating: 4,
    img: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&q=80',
    avatar: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=80&q=80',
  },
  {
    category: 'Longevity',
    name: 'Padma Iyer',
    location: 'Retired · Coimbatore',
    quote: 'My joints feel noticeably better after 45 days. My doctor even asked what I changed. Highly recommend for anyone over 55.',
    rating: 5,
    img: 'https://images.unsplash.com/photo-1515377553641-5b868e6584c6?w=400&q=80',
    avatar: 'https://images.unsplash.com/photo-1515377553641-5b868e6584c6?w=80&q=80',
  },
];

const VIDEO_REVIEWS = [
  {
    name: 'Steven Bartlett',
    role: 'Award Winning Podcaster\nbehind The Diary of a CEO',
    quote: '&quot;Huel is an ally on my busiest days&quot;',
    rating: 5,
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&q=80',
  },
  {
    name: 'Kristen Holmes',
    role: 'Head of Performance + Nutrition\nExpert',
    quote: '&quot;What you put into your body really matters. When life gets busy, having products I trust to fill the gaps gives me peace of mind&quot;',
    rating: 5,
    img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&q=80',
  },
  {
    name: 'Alex Rodriguez',
    role: 'Former Elite Athlete + World\nSeries Champion',
    quote: '&quot;I travel a lot, Huel makes it easy to stay fueled. It\'s one of my go to drinks.&quot;',
    rating: 5,
    img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&q=80',
  },
  {
    name: 'Idris Elba',
    role: 'Actor, Producer + Entrepreneur',
    quote: '&quot;I\'ve been a Hueligan for several years now&quot;',
    rating: 5,
    img: 'https://images.unsplash.com/photo-1519085360771-9852ef158dba?w=500&q=80',
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

/* ── STAR ROW ── */
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
function TextReviewCard({ review, index }: { review: typeof TEXT_REVIEWS[0]; index: number }) {
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
function VideoReviewCard({ review, index }: { review: typeof VIDEO_REVIEWS[0]; index: number }) {
  return (
    <motion.div
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
      {/* Image Zone */}
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
        <div
          style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 52, height: 52, borderRadius: '50%',
            background: 'rgba(255,255,255,0.18)',
            border: '1.5px solid rgba(255,255,255,0.35)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <Play size={16} fill={BRAND.white} stroke="none" />
        </div>

        {/* Name + Role Overlay */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px 18px', zIndex: 10 }}>
          <div style={{ fontSize: F_SIZE.md, fontWeight: 900, color: BRAND.white, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {review.name}
          </div>
          <div style={{ fontSize: '0.76rem', color: 'rgba(239,233,225,0.75)', lineHeight: 1.45 }}>
            {review.role}
          </div>
        </div>
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

  const { perView: textCardsPerView, maxSlide: maxTextSlide } = useResponsiveCarousel(TEXT_REVIEWS.length);
  const { perView: videoCardsPerView, maxSlide: maxVideoSlide } = useResponsiveCarousel(VIDEO_REVIEWS.length);

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
              {TEXT_REVIEWS.map((review, i) => (
                <div key={review.name} style={{ flex: `0 0 ${textItemWidth}`, minWidth: 0 }}>
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
              {VIDEO_REVIEWS.map((review, i) => (
                <div key={review.name} style={{ flex: `0 0 ${videoItemWidth}`, minWidth: 0 }}>
                  <VideoReviewCard review={review} index={i} />
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