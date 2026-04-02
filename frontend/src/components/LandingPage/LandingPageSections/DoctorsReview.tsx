'use client';

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useRef, useState, ReactNode, useCallback, useEffect } from 'react';
import { F_SIZE, FONTS, BRAND } from '@/lib/typography';
import { Star } from 'lucide-react';

// ── Hand-drawn SVG Doodles ──
const Squiggle = ({ width = 120, style = {} }) => (
  <svg viewBox={`0 0 ${width} 12`} width={width} height={12} style={style} aria-hidden>
    <path
      d={`M2,6 Q${width * 0.1},2 ${width * 0.2},6 Q${width * 0.3},10 ${width * 0.4},6 Q${width * 0.5},2 ${width * 0.6},6 Q${width * 0.7},10 ${width * 0.8},6 Q${width * 0.9},2 ${width - 2},6`}
      fill="none" stroke={BRAND.primary} strokeWidth="2.5" strokeLinecap="round"
    />
  </svg>
);

const HandDrawnUnderline = ({ width = 160, style = {} }) => (
  <svg viewBox={`0 0 ${width} 14`} width={width} height={14} style={style} aria-hidden>
    <path d={`M3,8 C${width * 0.15},4 ${width * 0.35},11 ${width * 0.5},7 C${width * 0.65},3 ${width * 0.8},10 ${width - 3},7`}
      fill="none" stroke={BRAND.primary} strokeWidth="3" strokeLinecap="round" />
    <path d={`M6,11 C${width * 0.2},9 ${width * 0.5},13 ${width * 0.75},10 C${width * 0.85},9 ${width * 0.95},11 ${width - 5},10`}
      fill="none" stroke="${BRAND.primaryDark}0.3" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const StarDoodle = ({ size = 20, rotate = 0, style = {} }: { size?: number; rotate?: number; style?: React.CSSProperties }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} style={{ transform: `rotate(${rotate}deg)`, ...style }} aria-hidden>
    <path d="M12,2.5 L13.8,8.8 L20.5,8.8 L15.1,12.7 L17.0,19.0 L12,15.1 L7.0,19.0 L8.9,12.7 L3.5,8.8 L10.2,8.8 Z"
      fill={BRAND.primary} stroke="#0f5f2d" strokeWidth="0.5" strokeLinejoin="round" />
  </svg>
);

const CircleScribble = ({ size = 60, style = {} }: { size?: number; style?: React.CSSProperties }) => (
  <svg viewBox="0 0 60 60" width={size} height={size} style={style} aria-hidden>
    <path d="M30,4 C46,4 56,14 56,30 C56,46 46,56 30,56 C14,56 4,46 4,30 C4,14 14,4 30,4"
      fill="none" stroke="${BRAND.primaryDark}0.25" strokeWidth="2" strokeLinecap="round" strokeDasharray="5,3" />
    <path d="M30,8 C44,7 52,17 53,30 C54,44 44,52 30,52 C17,53 8,43 7,30"
      fill="none" stroke="${BRAND.primaryDark}0.12" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const QuoteOpen = ({ size = 40, style = {} }: { size?: number; style?: React.CSSProperties }) => (
  <svg viewBox="0 0 40 32" width={size} height={size * 0.8} style={style} aria-hidden>
    <path d="M4,20 C3,10 8,4 16,3 C17,3 18,4 18,5 C12,7 9,11 10,16 L16,16 C18,16 18,18 18,20 L18,28 C18,30 16,30 14,30 L6,30 C4,30 4,28 4,26 Z"
      fill="${BRAND.primaryDark}0.1" stroke={BRAND.primary} strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M24,20 C23,10 28,4 36,3 C37,3 38,4 38,5 C32,7 29,11 30,16 L36,16 C38,16 38,18 38,20 L38,28 C38,30 36,30 34,30 L26,30 C24,30 24,28 24,26 Z"
      fill="${BRAND.primaryDark}0.1" stroke={BRAND.primary} strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
);

const WavyLine = ({ width = 200, style = {} }: { width?: number; style?: React.CSSProperties }) => (
  <svg viewBox={`0 0 ${width} 16`} width={width} height={16} style={style} aria-hidden>
    <path
      d={`M0,8 Q${width * 0.125},2 ${width * 0.25},8 Q${width * 0.375},14 ${width * 0.5},8 Q${width * 0.625},2 ${width * 0.75},8 Q${width * 0.875},14 ${width},8`}
      fill="none" stroke="${BRAND.primaryDark}0.3" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// ── Ink dot progress indicator ──
const InkDot = ({ active, index, onClick }: { active: boolean; index: number; onClick: () => void }) => (
  <motion.button
    onClick={onClick}
    aria-label={`Go to slide ${index + 1}`}
    whileHover={{ scale: 1.3 }}
    whileTap={{ scale: 0.85 }}
    style={{
      width: active ? 28 : 10, height: 10, borderRadius: 99,
      background: active ? BRAND.primaryDark : 'rgba(50,45,41,0.25)',
      border: 'none', cursor: 'pointer', padding: 0,
      transition: 'width 0.35s cubic-bezier(0.22,1,0.36,1), background 0.25s',
      position: 'relative', overflow: 'hidden',
    }}
  >
    {active && (
      <motion.div layoutId="inkFill" style={{ position: 'absolute', inset: 0, background: `linear-gradient(90deg, ${BRAND.primaryDark}, rgba(114,56,61,0.8))`, borderRadius: 99 }} />
    )}
  </motion.button>
);

// ── Data ──
const DOCTORS = [
  {
    id: 1, name: 'Dr. Rajesh Sharma', title: 'Chief Nutritionist',
    specialization: 'Clinical Nutrition & Sports Medicine',
    image: '/images/doctors/user1.png',
    review: 'PlainFuel is formulated with precision that matches Indian dietary patterns. The micronutrient profile is exactly what most people are missing. I recommend it to all my patients.',
    rating: 5, certifications: ['ACSM', 'ISSN', 'Indian Medical Association'],
    accent: BRAND.white, accentStrong: BRAND.primary,
  },
  {
    id: 2, name: 'Dr. Priya Mehta', title: 'MD, Internal Medicine',
    specialization: 'Preventive Medicine & Wellness',
    image: '/images/doctors/user2.png',
    review: 'As a doctor, I am always cautious about supplements. PlainFuel impressed me with its transparency, third-party testing, and evidence-based formulation. Science-first approach.',
    rating: 5, certifications: ['NMC', 'IAMS', 'Harvard Health'],
    accent: BRAND.white, accentStrong: '#72383D',
  },
  {
    id: 3, name: 'Dr. Arjun Kapoor', title: 'Sports Physician',
    specialization: 'Athletic Performance & Recovery',
    image: '/images/doctors/user3.png',
    review: 'Perfect for athletes and active individuals. The creatine and B-complex formulation supports energy metabolism. Plus, no artificial fillers — exactly what we need.',
    rating: 5, certifications: ['ACSM-CEP', 'GIPS', 'Sports Medicine Board'],
    accent: BRAND.white, accentStrong: BRAND.primary,
  },
  {
    id: 4, name: 'Dr. Neha Gupta', title: 'Registered Dietitian',
    specialization: "Therapeutic Nutrition & Women's Health",
    image: '/images/doctors/user4.png',
    review: "The precision dosage in PlainFuel is brilliant. It targets the micronutrient gap in Indian meals without megadoses. My female clients have seen improved energy and focus.",
    rating: 5, certifications: ['ICMR', 'ISDP', 'Nutrition Society India'],
    accent: BRAND.white, accentStrong: BRAND.primaryDark,
  },
  {
    id: 5, name: 'Dr. Vikram Singh', title: 'PhD, Biochemist',
    specialization: 'Micronutrient Science & Research',
    image: '/images/doctors/user2.png',
    review: 'From a biochemistry standpoint, the synergy of nutrients in PlainFuel is well-calculated. Bioavailability is optimized for Indian demographics. Scientifically sound product.',
    rating: 5, certifications: ['IIT-D', 'CSIR', 'Nature Journal Author'],
    accent: BRAND.white, accentStrong: BRAND.primary,
  },
  {
    id: 6, name: 'Dr. Deepa Desai', title: 'Preventive Medicine Specialist',
    specialization: 'Lifestyle Medicine & Immunology',
    image: '/images/doctors/user4.png',
    review: 'PlainFuel bridges the gap that diet alone cannot. The FSSAI certification and quality assurance give me confidence to recommend it to my entire patient base.',
    rating: 5, certifications: ['AAFP', 'IMA', 'WHO Wellness Expert'],
    accent: BRAND.white, accentStrong: '#72383D',
  },
];

function RatingStars({ rating }: { rating: number }) {
  return (
    <div style={{ display: 'flex', gap: 3, alignItems: 'center', flexWrap: 'wrap' }}>
      {Array.from({ length: rating }).map((_, i) => (
        <motion.div key={i} initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: i * 15 - 30 }} transition={{ delay: i * 0.06, type: 'spring', stiffness: 320 }}>
          <StarDoodle size={16} />
        </motion.div>
      ))}
      <span style={{ fontSize: F_SIZE.sm, color: BRAND.primary, marginLeft: 8, fontWeight: 600, letterSpacing: '0.03em' }}>
        {rating}.0 / 5.0
      </span>
    </div>
  );
}

function TrustBadge({ icon, label, sublabel, index }: { icon: ReactNode; label: string; sublabel?: string; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 + index * 0.1 }}
      whileHover={{ y: -5, boxShadow: '0 12px 28px rgba(50,45,41,0.12)' }}
      style={{ background: BRAND.white, border: `1px solid ${BRAND.tertiary}`, borderRadius: 16, padding: '18px 14px', textAlign: 'center', boxShadow: '0 4px 12px rgba(50,45,41,0.04)', cursor: 'default', position: 'relative', overflow: 'hidden', transition: 'all 0.3s cubic-bezier(0.22,1,0.36,1)' }}
    >
      <div style={{ width: 46, height: 46, background: `${BRAND.primaryDark}08`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', fontSize: 22, border: `1.5px solid ${BRAND.primaryDark}15` }}>
        {icon}
      </div>
      <p style={{ fontSize: F_SIZE.sm, fontWeight: 700, color: BRAND.primary, margin: '0 0 3px 0', letterSpacing: '-0.01em' }}>{label}</p>
      {sublabel && <p style={{ fontSize: F_SIZE.sm, color: BRAND.secondary, margin: 0, fontWeight: 500 }}>{sublabel}</p>}
      <StarDoodle size={14} style={{ position: 'absolute', top: 10, right: 10, opacity: 0.15 }} />
    </motion.div>
  );
}

type Direction = 1 | -1;

// ── Mobile card layout (stacked vertically) ──
function CarouselSlideMobile({ doctor }: { doctor: typeof DOCTORS[0] }) {
  return null; // No longer used
}

function CarouselSlide({ doctor, direction, isMobile }: { doctor: typeof DOCTORS[0]; direction: Direction; isMobile: boolean }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const variants: any = {
    enter: (dir: Direction) => ({ x: dir > 0 ? 200 : -200, opacity: 0, filter: 'blur(8px)' }),
    center: { x: 0, opacity: 1, filter: 'blur(0px)' },
    exit: (dir: Direction) => ({ x: dir > 0 ? -200 : 200, opacity: 0, filter: 'blur(8px)' }),
  };

  return (
    <motion.div
      key={doctor.id}
      custom={direction}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: 'absolute',
        inset: 0,
        background: BRAND.white,
        borderRadius: isMobile ? 20 : 32,
        overflow: 'hidden',
        boxShadow: '0 24px 64px rgba(50,45,41,0.15)',
        border: `1px solid ${BRAND.tertiary}`,
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
      }}
    >
      {/* LEFT PANEL - IMAGE */}
      <div
        style={{
          flex: isMobile ? 'none' : 1,
          width: isMobile ? '100%' : 'auto',
          height: isMobile ? 300 : '100%',
          background: `linear-gradient(135deg, ${BRAND.primaryDark}15 0%, ${BRAND.primary}08 100%)`,
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRight: isMobile ? 'none' : `2px solid ${BRAND.light}`,
          borderBottom: isMobile ? `2px solid ${BRAND.light}` : 'none',
        }}
      >
        {/* Image fills entire left panel */}
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            zIndex: 1,
          }}
        >
          <Image 
            src={doctor.image} 
            alt={doctor.name} 
            fill 
            style={{ objectFit: 'cover' }} 
            unoptimized
          />
        </motion.div>

        {/* Overlay gradient */}
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(114,56,61,0.1) 0%, rgba(50,45,41,0.05) 100%)',
            zIndex: 2,
          }}
        />

        {/* Verified badge */}
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.35, type: 'spring', stiffness: 300 }}
          style={{
            position: 'absolute',
            bottom: isMobile ? 16 : 32,
            right: isMobile ? 16 : 32,
            width: isMobile ? 48 : 60,
            height: isMobile ? 48 : 60,
            borderRadius: '50%',
            background: BRAND.primaryDark,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: BRAND.white,
            fontSize: isMobile ? 24 : 28,
            boxShadow: `0 12px 32px rgba(114,56,61,0.4)`,
            border: `4px solid ${BRAND.white}`,
            zIndex: 3,
          }}
        >
          ✓
        </motion.div>
      </div>

      {/* RIGHT PANEL - CONTENT */}
      <div
        style={{
          flex: isMobile ? 'none' : 1,
          width: isMobile ? '100%' : 'auto',
          padding: isMobile ? '20px 16px 24px' : '40px 44px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: 0,
          overflow: isMobile ? 'auto' : 'hidden',
          maxHeight: isMobile ? 'none' : '100%',
        }}
      >
        {/* Header Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginBottom: isMobile ? 16 : 20 }}>
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.4 }}
          >
            <h3 style={{
              fontSize: isMobile ? 22 : 28,
              fontWeight: 900,
              color: BRAND.primary,
              margin: 0,
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
            }}>
              {doctor.name}
            </h3>
          </motion.div>

          {/* Title & Specialization */}
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.22, duration: 0.4 }}
          >
            <p style={{
              fontSize: isMobile ? 13.5 : 15,
              fontWeight: 700,
              color: BRAND.primaryDark,
              margin: '4px 0 0 0',
              letterSpacing: '0.02em',
            }}>
              ✦ {doctor.title}
            </p>
            <p style={{
              fontSize: isMobile ? 12 : 13.5,
              color: BRAND.secondary,
              margin: '3px 0 0 0',
              lineHeight: 1.4,
              fontWeight: 500,
            }}>
              {doctor.specialization}
            </p>
          </motion.div>

          {/* Certifications */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28, duration: 0.4 }}
            style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}
          >
            {doctor.certifications.map((cert, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.32 + i * 0.06 }}
                style={{
                  fontSize: isMobile ? 11 : 12.5,
                  background: `${BRAND.primaryDark}12`,
                  border: `1.5px solid ${BRAND.primaryDark}30`,
                  borderRadius: 8,
                  padding: isMobile ? '4px 10px' : '5px 12px',
                  color: BRAND.primaryDark,
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  letterSpacing: '0.01em',
                  whiteSpace: 'nowrap',
                }}
              >
                <span style={{ fontSize: 9 }}>◆</span> {cert}
              </motion.span>
            ))}
          </motion.div>
        </div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          style={{
            height: 2,
            background: `linear-gradient(to right, ${BRAND.primaryDark}, ${BRAND.primaryDark}40, transparent)`,
            margin: isMobile ? '20px 0 12px 0' : '24px 0 16px 0',
            transformOrigin: 'left',
          }}
        />

        {/* Review Section */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 12, minHeight: isMobile ? 'auto' : 0 }}>
          {/* Rating */}
          <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.4 }}>
            <div style={{ display: 'flex', gap: 3, alignItems: 'center', flexWrap: 'wrap' }}>
              {Array.from({ length: doctor.rating }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.24 + i * 0.05, type: 'spring', stiffness: 320 }}
                >
                  <Star size={isMobile ? 13 : 15} fill={BRAND.primaryDark} stroke={BRAND.primaryDark} strokeWidth={0.5} />
                </motion.div>
              ))}
              <span style={{ fontSize: isMobile ? 12 : 13.5, color: BRAND.primary, fontWeight: 700, marginLeft: 6, letterSpacing: '0.02em' }}>
                {doctor.rating}.0 / 5.0
              </span>
            </div>
          </motion.div>

          {/* Quote */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28, duration: 0.5 }}
            style={{
              background: `linear-gradient(135deg, ${BRAND.primaryDark}08 0%, ${BRAND.primary}04 100%)`,
              border: `1.5px solid ${BRAND.primaryDark}20`,
              borderRadius: 12,
              padding: isMobile ? '12px 12px' : '18px 16px',
              position: 'relative',
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              minHeight: isMobile ? 120 : 'auto',
            }}
          >
            <QuoteOpen size={isMobile ? 20 : 24} style={{ position: 'absolute', top: -2, left: 6, opacity: 0.12 }} />
            <p style={{
              fontSize: isMobile ? 13 : 14.5,
              lineHeight: 1.65,
              color: BRAND.primary,
              margin: 0,
              fontWeight: 400,
              position: 'relative',
              zIndex: 1,
            }}>
              {doctor.review}
            </p>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.42 }}
          style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginTop: isMobile ? 12 : 16, 
            paddingTop: isMobile ? 12 : 16, 
            borderTop: `1px solid ${BRAND.light}`,
            gap: 8,
            flexWrap: isMobile ? 'wrap' : 'nowrap',
          }}
        >
          <p style={{ fontSize: isMobile ? 11 : 12.5, color: BRAND.secondary, margin: 0, fontWeight: 500, fontStyle: 'italic' }}>
            ✓ Verified medical professional
          </p>
          <div style={{ display: 'flex', gap: 2, fontSize: isMobile ? 11 : 12.5, color: BRAND.secondary, whiteSpace: 'nowrap' }}>
            • Independently reviewed
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function PeekCard({ offset, rotate }: { offset: number; rotate: number }) {
  return (
    <div style={{ position: 'absolute', inset: 0, background: BRAND.white, border: `1px solid ${BRAND.tertiary}`, borderRadius: 32, boxShadow: '0 12px 32px rgba(50,45,41,0.08)', transform: `translateY(${offset}px) rotate(${rotate}deg) scale(${1 - Math.abs(offset) * 0.003})`, transformOrigin: 'bottom center', zIndex: 0, overflow: 'hidden' }} />
  );
}

function NavBtn({ onClick, dir, disabled }: { onClick: () => void; dir: 'prev' | 'next'; disabled: boolean }) {
  const isNext = dir === 'next';
  return (
    <motion.button onClick={onClick} disabled={disabled} whileHover={disabled ? {} : { scale: 1.08, y: -2 }} whileTap={disabled ? {} : { scale: 0.93 }}
      style={{ width: 50, height: 50, borderRadius: '50%', background: disabled ? 'rgba(0,0,0,0.05)' : BRAND.white, border: `2px solid ${disabled ? 'rgba(0,0,0,0.1)' : BRAND.tertiary}`, cursor: disabled ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: disabled ? 'none' : '0 8px 24px rgba(50,45,41,0.12)', transition: 'all 0.2s', position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
      {!disabled && <motion.div whileHover={{ scale: 2.5, opacity: 0.08 }} style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: BRAND.primaryDark, opacity: 0, transition: 'all 0.3s' }} />}
      <svg viewBox="0 0 24 24" width={20} height={20} fill="none" style={{ position: 'relative', zIndex: 1 }}>
        <path d={isNext ? 'M5,12 C8,10 14,8 19,12 M14,7 L19,12 L14,17' : 'M19,12 C16,10 10,8 5,12 M10,7 L5,12 L10,17'}
          stroke={disabled ? 'rgba(0,0,0,0.25)' : BRAND.primaryDark} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </motion.button>
  );
}

// ── MAIN COMPONENT ──
export default function DoctorsReview() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const floatY = useTransform(scrollYProgress, [0, 1], [-20, 20]);
  const floatY2 = useTransform(scrollYProgress, [0, 1], [20, -20]);

  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState<Direction>(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [paused, setPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const navigate = useCallback((idx: number, dir: Direction) => {
    if (isAnimating) return;
    setDirection(dir);
    setCurrent(idx);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 600);
  }, [isAnimating]);

  const goTo = useCallback((idx: number) => {
    if (idx === current) return;
    navigate(idx, idx > current ? 1 : -1);
  }, [current, navigate]);

  const prev = useCallback(() => {
    navigate((current - 1 + DOCTORS.length) % DOCTORS.length, -1);
  }, [current, navigate]);

  const next = useCallback(() => {
    navigate((current + 1) % DOCTORS.length, 1);
  }, [current, navigate]);

  // Touch swipe support
  const touchStartX = useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) { if (diff > 0) next(); else prev(); }
    touchStartX.current = null;
  };

  // Auto-advance every 8 seconds
  useEffect(() => {
    if (paused) {
      if (autoRef.current) clearInterval(autoRef.current);
      return;
    }
    autoRef.current = setInterval(() => {
      setDirection(1);
      setCurrent((c) => (c + 1) % DOCTORS.length);
    }, 8000);
    return () => { if (autoRef.current) clearInterval(autoRef.current); };
  }, [paused, current]);

  // Dynamic carousel height - responsive based on screen size
  const carouselHeight = isMobile ? 'auto' : 420;
  const minCarouselHeight = isMobile ? 600 : 420;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&family=Caveat:wght@400;700&display=swap');

        .trust-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }
        .hint-text { display: block; }

        @media (max-width: 1024px) {
          .trust-grid { grid-template-columns: repeat(3, 1fr); gap: 12px; }
          .stats-grid { grid-template-columns: repeat(3, 1fr); gap: 16px; }
        }
        @media (max-width: 768px) {
          .trust-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
          .stats-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
        }
        @media (max-width: 639px) {
          .trust-grid { grid-template-columns: repeat(2, 1fr); gap: 8px; }
          .stats-grid { grid-template-columns: repeat(1, 1fr); gap: 10px; }
          .hint-text { display: none; }
        }
      `}</style>

      <section
        ref={sectionRef}
        style={{ position: 'relative', overflow: 'hidden', background: BRAND.white, paddingBottom: isMobile ? 40 : 60, paddingTop: isMobile ? 40 : 60 }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* BG doodles */}
        <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', opacity: 0.08 }}>
          <motion.div style={{ position: 'absolute', top: '6%', left: '2%', y: floatY }}><StarDoodle size={isMobile ? 32 : 52} style={{ opacity: 0.12, transform: 'rotate(22deg)' }} /></motion.div>
          <motion.div style={{ position: 'absolute', top: '12%', right: '4%', y: floatY2 }}><StarDoodle size={isMobile ? 24 : 38} style={{ opacity: 0.18, transform: 'rotate(-15deg)' }} /></motion.div>
          <motion.div style={{ position: 'absolute', top: '35%', left: '1%', y: floatY }}><CircleScribble size={isMobile ? 50 : 80} style={{ opacity: 0.6 }} /></motion.div>
          <motion.div style={{ position: 'absolute', bottom: '25%', right: '2%', y: floatY2 }}><CircleScribble size={isMobile ? 60 : 100} style={{ opacity: 0.5 }} /></motion.div>
          <motion.div style={{ position: 'absolute', bottom: '10%', left: '4%', y: floatY }}><StarDoodle size={isMobile ? 28 : 44} style={{ opacity: 0.14, transform: 'rotate(40deg)' }} /></motion.div>
        </div>

        <div style={{ maxWidth: 1100, margin: '0 auto', padding: isMobile ? '0 12px' : '0 32px', position: 'relative', zIndex: 1 }}>

          {/* Eyebrow */}
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ display: 'flex', justifyContent: 'center', marginBottom: isMobile ? 16 : 20 }}>
            <div style={{ background: `rgba(50,45,41,0.08)`, border: `2px dashed ${BRAND.primary}`, borderRadius: 10, padding: '7px 18px', transform: 'rotate(-1.5deg)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <StarDoodle size={13} />
              <span style={{ fontSize: F_SIZE.sm, color: BRAND.primary, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Trusted by Experts</span>
              <StarDoodle size={13} />
            </div>
          </motion.div>

          {/* Heading */}
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: isMobile ? 12 : 24, padding: '0 8px' }}>
            <h2 style={{ fontSize: isMobile ? 28 : F_SIZE.xl, fontWeight: 900, lineHeight: 1.1, color: BRAND.primary, margin: 0, letterSpacing: '-0.03em' }}>
              Endorsed by Medical Experts
            </h2>
          </motion.div>

          <motion.p initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }}
            style={{ fontSize: isMobile ? 13.5 : F_SIZE.md, fontWeight: 400, color: BRAND.secondary, textAlign: 'center', maxWidth: 540, margin: `0 auto ${isMobile ? 24 : 32}px auto`, lineHeight: 1.6, letterSpacing: '-0.005em', padding: '0 8px' }}>
            Leading doctors, nutritionists, and scientists recommend PlainFuel for its precision, transparency, and evidence-based formulation.
          </motion.p>

          {/* ── CAROUSEL ── */}
          <motion.div initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>

            {/* Counter + auto-play indicator */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, padding: '0 2px' }}>
              <span style={{ fontSize: F_SIZE.sm, color: BRAND.primary, fontWeight: 600 }}>
                ✦ Expert {current + 1} of {DOCTORS.length}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>

                <div style={{ width: isMobile ? 56 : 80, height: 4, background: 'rgba(10,61,31,0.15)', borderRadius: 99, overflow: 'hidden' }}>
                  {!paused && (
                    <motion.div
                      key={current}
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 8, ease: 'linear' }}
                      style={{ height: '100%', background: BRAND.primary, borderRadius: 99 }}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Stacked card frame with side controls */}
            <div
              style={{
                position: 'relative',
                paddingBottom: isMobile ? 24 : 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: isMobile ? 12 : 28,
              }}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {/* Left Arrow */}
              {!isMobile && <NavBtn onClick={prev} dir="prev" disabled={isAnimating} />}

              {/* Carousel Container - Clean Single Card */}
              <div style={{ flex: 1, position: 'relative' }}>
                <div style={{ position: 'relative', height: carouselHeight, minHeight: minCarouselHeight, zIndex: 2, borderRadius: isMobile ? 20 : 32, overflow: 'hidden' }}>
                  <AnimatePresence initial={false} custom={direction} mode="popLayout">
                    <CarouselSlide
                      key={DOCTORS[current].id}
                      doctor={DOCTORS[current]}
                      direction={direction}
                      isMobile={isMobile}
                    />
                  </AnimatePresence>
                </div>
              </div>

              {/* Right Arrow */}
              {!isMobile && <NavBtn onClick={next} dir="next" disabled={isAnimating} />}
            </div>

            {/* Dot Indicators - Below Carousel */}
            <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center', marginTop: isMobile ? 20 : 24 }}>
              {DOCTORS.map((_, i) => (
                <InkDot key={i} active={i === current} index={i} onClick={() => goTo(i)} />
              ))}
            </div>

            {/* Mobile Controls */}
            {isMobile && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginTop: 16 }}>
                <NavBtn onClick={prev} dir="prev" disabled={isAnimating} />
                <NavBtn onClick={next} dir="next" disabled={isAnimating} />
              </div>
            )}

            {isMobile && (
              <p style={{ textAlign: 'center', marginTop: 12, fontSize: 11, color: BRAND.secondary, fontWeight: 500, letterSpacing: '0.03em' }}>
                swipe left or right to explore
              </p>
            )}
          </motion.div>

          {/* Stats row */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
            style={{ marginTop: isMobile ? 24 : 32, background: BRAND.white, border: `1px solid ${BRAND.tertiary}`, borderRadius: isMobile ? 16 : 20, padding: isMobile ? '16px 12px' : '20px 24px', boxShadow: '0 12px 32px rgba(50,45,41,0.08)', position: 'relative', overflow: 'hidden' }}>
            <StarDoodle size={isMobile ? 28 : 40} style={{ position: 'absolute', top: 12, right: 16, opacity: 0.15, transform: 'rotate(20deg)' }} />
            <StarDoodle size={isMobile ? 20 : 28} style={{ position: 'absolute', bottom: 12, left: 16, opacity: 0.12, transform: 'rotate(-10deg)' }} />
            <div className="stats-grid">
              {[
                { num: '6+', label: 'Medical Experts', sub: 'and counting' },
                { num: '100%', label: 'Third-Party Tested', sub: 'every batch' },
                { num: '5.0', label: 'Expert Rating', sub: 'out of 5.0' },
                { num: 'FSSAI', label: 'Certified', sub: 'India-approved' },
              ].map((stat, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 + i * 0.1 }} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: F_SIZE.xl, fontWeight: 800, color: BRAND.primary, lineHeight: 1, marginBottom: 4 }}>{stat.num}</div>
                  <div style={{ fontSize: F_SIZE.sm, fontWeight: 600, color: '#111', letterSpacing: '-0.01em' }}>{stat.label}</div>
                  <div style={{ fontSize: F_SIZE.sm, color: 'rgb(0, 0, 0)', fontWeight: 400, marginTop: 2 }}>{stat.sub}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          

        </div>
      </section>
    </>
  );
}





