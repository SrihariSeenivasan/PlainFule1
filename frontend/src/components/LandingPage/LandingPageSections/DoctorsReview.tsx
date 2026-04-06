'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRef, useState, useCallback, useEffect } from 'react';
import { F_SIZE, BRAND } from '@/lib/typography';
import { Star } from 'lucide-react';
import { buildApiUrl } from '@/lib/api-config';

const StarDoodle = ({ size = 20, rotate = 0, style = {} }: { size?: number; rotate?: number; style?: React.CSSProperties }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} style={{ transform: `rotate(${rotate}deg)`, ...style }} aria-hidden>
    <path d="M12,2.5 L13.8,8.8 L20.5,8.8 L15.1,12.7 L17.0,19.0 L12,15.1 L7.0,19.0 L8.9,12.7 L3.5,8.8 L10.2,8.8 Z"
      fill={BRAND.primary} stroke="#0f5f2d" strokeWidth="0.5" strokeLinejoin="round" />
  </svg>
);

// ── Fallback Data (in case backend fails) ──
const FALLBACK_DOCTORS = [
  {
    id: 1, name: 'Dr. Rajesh Sharma', title: 'Chief Nutritionist',
    image: '/images/Doctors/user1.png',
    review: 'PlainFuel is formulated with precision that matches Indian dietary patterns. The micronutrient profile is exactly what most people are missing. I recommend it to all my patients.',
    rating: 5,
  },
  {
    id: 2, name: 'Dr. Priya Mehta', title: 'MD, Internal Medicine',
    image: '/images/Doctors/user2.png',
    review: 'As a doctor, I am always cautious about supplements. PlainFuel impressed me with its transparency, third-party testing, and evidence-based formulation. Science-first approach.',
    rating: 5,
  },
  {
    id: 3, name: 'Dr. Arjun Kapoor', title: 'Sports Physician',
    image: '/images/Doctors/user3.png',
    review: 'Perfect for athletes and active individuals. The creatine and B-complex formulation supports energy metabolism. Plus, no artificial fillers — exactly what we need.',
    rating: 5,
  },
  {
    id: 4, name: 'Dr. Neha Gupta', title: 'Registered Dietitian',
    image: '/images/Doctors/user4.png',
    review: "The precision dosage in PlainFuel is brilliant. It targets the micronutrient gap in Indian meals without megadoses. My female clients have seen improved energy and focus.",
    rating: 5,
  },
  {
    id: 5, name: 'Dr. Vikram Singh', title: 'PhD, Biochemist',
    image: '/images/Doctors/user2.png',
    review: 'From a biochemistry standpoint, the synergy of nutrients in PlainFuel is well-calculated. Bioavailability is optimized for Indian demographics. Scientifically sound product.',
    rating: 5,
  },
  {
    id: 6, name: 'Dr. Deepa Desai', title: 'Preventive Medicine Specialist',
    image: '/images/Doctors/user4.png',
    review: 'PlainFuel bridges the gap that diet alone cannot. The FSSAI certification and quality assurance give me confidence to recommend it to my entire patient base.',
    rating: 5,
  },
];

// ── Doctor Card with overlay ──
function DoctorCard({ doctor, index }: { doctor: typeof FALLBACK_DOCTORS[0]; index: number }) {
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
        height: 380,
        position: 'relative',
        transition: 'box-shadow 0.3s ease',
      }}
    >
      {/* Image Background */}
      <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
        <Image
          src={doctor.image}
          alt={doctor.name}
          fill
          style={{ objectFit: 'cover' }}
          unoptimized
        />

        {/* Gradient Overlay - Bottom */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(50,45,41,0.95) 0%, rgba(50,45,41,0.6) 40%, transparent 100%)',
            zIndex: 2,
          }}
        />

        {/* Content Overlay - Bottom */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '24px 18px 18px',
            zIndex: 3,
          }}
        >
          {/* Name */}
          <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.07 + 0.2 }}>
            <h4
              style={{
                fontSize: F_SIZE.md,
                fontWeight: 900,
                color: BRAND.white,
                margin: 0,
                letterSpacing: '-0.01em',
                lineHeight: 1.2,
              }}
            >
              {doctor.name}
            </h4>
            <p
              style={{
                fontSize: 13.5,
                color: 'rgba(255, 255, 255, 0.8)',
                margin: '4px 0 0 0',
                fontWeight: 500,
              }}
            >
              {doctor.title}
            </p>
          </motion.div>

          {/* Review Text */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.07 + 0.3 }}
            style={{
              fontSize: 13.5,
              color: 'rgba(255, 255, 255, 0.85)',
              lineHeight: 1.6,
              margin: '12px 0 0 0',
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              textOverflow: 'ellipsis',
            }}
          >
            &quot;{doctor.review}&quot;
          </motion.p>

          {/* Rating */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: index * 0.07 + 0.4 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              marginTop: 10,
              paddingTop: 10,
              borderTop: 'rgba(255, 255, 255, 0.2)',
            }}
          >
            {Array.from({ length: doctor.rating }).map((_, i) => (
              <Star key={i} size={12} fill={BRAND.light} stroke="none" />
            ))}
            <span style={{ fontSize: 12.5, color: 'rgba(255, 255, 255, 0.75)', fontWeight: 500, marginLeft: 2 }}>
              {doctor.rating}.0
            </span>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Ink dot progress indicator ──
const InkDot = ({ active, index, onClick }: { active: boolean; index: number; onClick: () => void }) => (
  <motion.button
    onClick={onClick}
    aria-label={`Go to slide group ${index + 1}`}
    whileHover={{ scale: 1.3 }}
    whileTap={{ scale: 0.85 }}
    style={{
      width: active ? 28 : 10,
      height: 10,
      borderRadius: 99,
      background: active ? BRAND.primaryDark : 'rgba(50,45,41,0.25)',
      border: 'none',
      cursor: 'pointer',
      padding: 0,
      transition: 'width 0.35s cubic-bezier(0.22,1,0.36,1), background 0.25s',
      position: 'relative',
      overflow: 'hidden',
    }}
  >
    {active && (
      <motion.div layoutId="inkFill" style={{ position: 'absolute', inset: 0, background: `linear-gradient(90deg, ${BRAND.primaryDark}, rgba(114,56,61,0.8))`, borderRadius: 99 }} />
    )}
  </motion.button>
);

// ── Navigation Button ──
function NavBtn({ onClick, dir, disabled }: { onClick: () => void; dir: 'prev' | 'next'; disabled: boolean }) {
  const isNext = dir === 'next';
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? {} : { scale: 1.08, y: -2 }}
      whileTap={disabled ? {} : { scale: 0.93 }}
      style={{
        width: 50,
        height: 50,
        borderRadius: '50%',
        background: disabled ? 'rgba(0,0,0,0.05)' : BRAND.white,
        border: `2px solid ${disabled ? 'rgba(0,0,0,0.1)' : BRAND.tertiary}`,
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: disabled ? 'none' : '0 8px 24px rgba(50,45,41,0.12)',
        transition: 'all 0.2s',
        position: 'relative',
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
      {!disabled && (
        <motion.div
          whileHover={{ scale: 2.5, opacity: 0.08 }}
          style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: BRAND.primaryDark, opacity: 0, transition: 'all 0.3s' }}
        />
      )}
      <svg viewBox="0 0 24 24" width={20} height={20} fill="none" style={{ position: 'relative', zIndex: 1 }}>
        <path
          d={isNext ? 'M5,12 C8,10 14,8 19,12 M14,7 L19,12 L14,17' : 'M19,12 C16,10 10,8 5,12 M10,7 L5,12 L10,17'}
          stroke={disabled ? 'rgba(0,0,0,0.25)' : BRAND.primaryDark}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </motion.button>
  );
}

// ── MAIN COMPONENT ──
export default function DoctorsReview() {
  const sectionRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [doctors, setDoctors] = useState(FALLBACK_DOCTORS);
  const [loading, setLoading] = useState(true);

  // Fetch doctor reviews from backend
  useEffect(() => {
    const fetchDoctorReviews = async () => {
      try {
        const response = await fetch(buildApiUrl('/testimonials/doctor-reviews'));
        if (response.ok) {
          const data = await response.json();
          if (data && Array.isArray(data)) {
            // Transform API response to match component format
            const transformedDoctors = data.map((review: {
              id: number;
              name: string;
              title: string;
              image: string;
              quote: string;
              rating: number;
            }) => ({
              id: review.id,
              name: review.name,
              title: review.title,
              image: review.image,
              review: review.quote, // Map 'quote' from API to 'review' for component
              rating: review.rating,
            }));
            setDoctors(transformedDoctors);
          }
        }
      } catch (error) {
        console.error('Failed to fetch doctor reviews:', error);
        // Keep fallback data on error
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorReviews();
  }, []);

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const cardsPerView = isMobile ? 1 : 3;
  const totalSlides = Math.ceil(doctors.length / cardsPerView);

  const navigate = useCallback((direction: 'next' | 'prev') => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 500);

    setCurrentSlide((prev) => {
      if (direction === 'next') {
        return (prev + 1) % totalSlides;
      } else {
        return (prev - 1 + totalSlides) % totalSlides;
      }
    });
  }, [isAnimating, totalSlides]);

  const goToSlide = useCallback((index: number) => {
    if (index === currentSlide || isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 500);
    setCurrentSlide(index);
  }, [currentSlide, isAnimating]);

  // Get visible cards for current slide
  const startIndex = currentSlide * cardsPerView;
  const visibleCards = doctors.slice(startIndex, startIndex + cardsPerView);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&family=Caveat:wght@400;700&display=swap');

        .doctor-carousel-track {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        @media (max-width: 1200px) {
          .doctor-carousel-track {
            grid-template-columns: repeat(3, 1fr);
            gap: 16px;
          }
        }

        @media (max-width: 900px) {
          .doctor-carousel-track {
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
          }
        }

        @media (max-width: 768px) {
          .doctor-carousel-track {
            grid-template-columns: 1fr;
            gap: 16px;
          }
        }
      `}</style>

      <section
        ref={sectionRef}
        style={{ position: 'relative', overflow: 'hidden', background: BRAND.white, paddingTop: 60, paddingBottom: 60 }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>

          {/* Eyebrow */}
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
            <div style={{ background: 'rgba(50,45,41,0.08)', border: `2px dashed ${BRAND.primary}`, borderRadius: 10, padding: '8px 18px', transform: 'rotate(-1.5deg)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <StarDoodle size={13} />
              <span style={{ fontSize: F_SIZE.sm, color: BRAND.primary, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Trusted by Experts</span>
              <StarDoodle size={13} />
            </div>
          </motion.div>

          {/* Heading */}
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: 24 }}>
            <h2 style={{ fontSize: F_SIZE.xl, fontWeight: 900, lineHeight: 1.1, color: BRAND.primary, margin: 0, letterSpacing: '-0.03em' }}>
              Endorsed by Medical Experts
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            style={{ fontSize: F_SIZE.md, fontWeight: 400, color: BRAND.secondary, textAlign: 'center', maxWidth: 540, margin: '0 auto 40px auto', lineHeight: 1.6, letterSpacing: '-0.005em' }}
          >
            Leading doctors, nutritionists, and scientists recommend PlainFuel for its precision, transparency, and evidence-based formulation.
          </motion.p>

          {/* ── CAROUSEL ── */}
          <motion.div initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>

            {/* Counter + navigation info */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, padding: '0 2px', flexWrap: 'wrap', gap: 12 }}>
              <span style={{ fontSize: F_SIZE.sm, color: BRAND.primary, fontWeight: 600 }}>
                ✦ Experts {startIndex + 1}–{Math.min(startIndex + cardsPerView, doctors.length)} of {doctors.length}
              </span>
            </div>

            {/* Cards Grid */}
            <div className="doctor-carousel-track">
              {visibleCards.map((doctor, idx) => (
                <DoctorCard key={doctor.id} doctor={doctor} index={startIndex + idx} />
              ))}
            </div>

            {/* Navigation Controls */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24, marginTop: 32 }}>
              <NavBtn onClick={() => navigate('prev')} dir="prev" disabled={isAnimating} />

              {/* Dot Indicators */}
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                {Array.from({ length: totalSlides }).map((_, i) => (
                  <InkDot key={i} active={i === currentSlide} index={i} onClick={() => goToSlide(i)} />
                ))}
              </div>

              <NavBtn onClick={() => navigate('next')} dir="next" disabled={isAnimating} />
            </div>
          </motion.div>

          {/* Trust Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            style={{ marginTop: 48, background: BRAND.white, border: `1px solid ${BRAND.tertiary}`, borderRadius: 20, padding: '24px', boxShadow: '0 12px 32px rgba(50,45,41,0.08)', position: 'relative', overflow: 'hidden' }}
          >
            <StarDoodle size={40} style={{ position: 'absolute', top: 12, right: 16, opacity: 0.15, transform: 'rotate(20deg)' }} />
            <StarDoodle size={28} style={{ position: 'absolute', bottom: 12, left: 16, opacity: 0.12, transform: 'rotate(-10deg)' }} />

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 16,
                position: 'relative',
                zIndex: 1,
              }}
            >
              {[
                { num: '6+', label: 'Medical Experts' },
                { num: '100%', label: 'Third-Party Tested' },
                { num: '5.0', label: 'Expert Rating' },
                { num: 'FSSAI', label: 'Certified' },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  style={{ textAlign: 'center' }}
                >
                  <div style={{ fontSize: F_SIZE.xl, fontWeight: 800, color: BRAND.primary, lineHeight: 1, marginBottom: 6 }}>
                    {stat.num}
                  </div>
                  <div style={{ fontSize: F_SIZE.sm, fontWeight: 600, color: BRAND.primary, letterSpacing: '-0.01em' }}>
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

        </div>
      </section>
    </>
  );
}





