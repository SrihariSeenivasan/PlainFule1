'use client';

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useRef, useState, ReactNode, useCallback, useEffect } from 'react';

// ── Hand-drawn SVG Doodles ──
const Squiggle = ({ width = 120, style = {} }) => (
  <svg viewBox={`0 0 ${width} 12`} width={width} height={12} style={style} aria-hidden>
    <path
      d={`M2,6 Q${width*0.1},2 ${width*0.2},6 Q${width*0.3},10 ${width*0.4},6 Q${width*0.5},2 ${width*0.6},6 Q${width*0.7},10 ${width*0.8},6 Q${width*0.9},2 ${width-2},6`}
      fill="none" stroke="#15803d" strokeWidth="2.5" strokeLinecap="round"
    />
  </svg>
);

const HandDrawnUnderline = ({ width = 160, style = {} }) => (
  <svg viewBox={`0 0 ${width} 14`} width={width} height={14} style={style} aria-hidden>
    <path d={`M3,8 C${width*0.15},4 ${width*0.35},11 ${width*0.5},7 C${width*0.65},3 ${width*0.8},10 ${width-3},7`}
      fill="none" stroke="#15803d" strokeWidth="3" strokeLinecap="round" />
    <path d={`M6,11 C${width*0.2},9 ${width*0.5},13 ${width*0.75},10 C${width*0.85},9 ${width*0.95},11 ${width-5},10`}
      fill="none" stroke="rgba(21,128,61,0.3)" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const StarDoodle = ({ size = 20, rotate = 0, style = {} }: { size?: number; rotate?: number; style?: React.CSSProperties }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} style={{ transform: `rotate(${rotate}deg)`, ...style }} aria-hidden>
    <path d="M12,2.5 L13.8,8.8 L20.5,8.8 L15.1,12.7 L17.0,19.0 L12,15.1 L7.0,19.0 L8.9,12.7 L3.5,8.8 L10.2,8.8 Z"
      fill="#15803d" stroke="#0f5f2d" strokeWidth="0.5" strokeLinejoin="round" />
  </svg>
);

const CircleScribble = ({ size = 60, style = {} }: { size?: number; style?: React.CSSProperties }) => (
  <svg viewBox="0 0 60 60" width={size} height={size} style={style} aria-hidden>
    <path d="M30,4 C46,4 56,14 56,30 C56,46 46,56 30,56 C14,56 4,46 4,30 C4,14 14,4 30,4"
      fill="none" stroke="rgba(21,128,61,0.25)" strokeWidth="2" strokeLinecap="round" strokeDasharray="5,3" />
    <path d="M30,8 C44,7 52,17 53,30 C54,44 44,52 30,52 C17,53 8,43 7,30"
      fill="none" stroke="rgba(21,128,61,0.12)" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const QuoteOpen = ({ size = 40, style = {} }: { size?: number; style?: React.CSSProperties }) => (
  <svg viewBox="0 0 40 32" width={size} height={size * 0.8} style={style} aria-hidden>
    <path d="M4,20 C3,10 8,4 16,3 C17,3 18,4 18,5 C12,7 9,11 10,16 L16,16 C18,16 18,18 18,20 L18,28 C18,30 16,30 14,30 L6,30 C4,30 4,28 4,26 Z"
      fill="rgba(21,128,61,0.1)" stroke="#15803d" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M24,20 C23,10 28,4 36,3 C37,3 38,4 38,5 C32,7 29,11 30,16 L36,16 C38,16 38,18 38,20 L38,28 C38,30 36,30 34,30 L26,30 C24,30 24,28 24,26 Z"
      fill="rgba(21,128,61,0.1)" stroke="#15803d" strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
);

const WavyLine = ({ width = 200, style = {} }: { width?: number; style?: React.CSSProperties }) => (
  <svg viewBox={`0 0 ${width} 16`} width={width} height={16} style={style} aria-hidden>
    <path
      d={`M0,8 Q${width*0.125},2 ${width*0.25},8 Q${width*0.375},14 ${width*0.5},8 Q${width*0.625},2 ${width*0.75},8 Q${width*0.875},14 ${width},8`}
      fill="none" stroke="rgba(21,128,61,0.3)" strokeWidth="2" strokeLinecap="round" />
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
      background: active ? '#15803d' : 'rgba(21,128,61,0.25)',
      border: 'none', cursor: 'pointer', padding: 0,
      transition: 'width 0.35s cubic-bezier(0.22,1,0.36,1), background 0.25s',
      position: 'relative', overflow: 'hidden',
    }}
  >
    {active && (
      <motion.div layoutId="inkFill" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, #15803d, #22c55e)', borderRadius: 99 }} />
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
    accent: '#dcfce7', accentStrong: '#15803d',
  },
  {
    id: 2, name: 'Dr. Priya Mehta', title: 'MD, Internal Medicine',
    specialization: 'Preventive Medicine & Wellness',
    image: '/images/doctors/user2.png',
    review: 'As a doctor, I am always cautious about supplements. PlainFuel impressed me with its transparency, third-party testing, and evidence-based formulation. Science-first approach.',
    rating: 5, certifications: ['NMC', 'IAMS', 'Harvard Health'],
    accent: '#f0fdf4', accentStrong: '#16a34a',
  },
  {
    id: 3, name: 'Dr. Arjun Kapoor', title: 'Sports Physician',
    specialization: 'Athletic Performance & Recovery',
    image: '/images/doctors/user3.png',
    review: 'Perfect for athletes and active individuals. The creatine and B-complex formulation supports energy metabolism. Plus, no artificial fillers — exactly what we need.',
    rating: 5, certifications: ['ACSM-CEP', 'GIPS', 'Sports Medicine Board'],
    accent: '#ecfdf5', accentStrong: '#15803d',
  },
  {
    id: 4, name: 'Dr. Neha Gupta', title: 'Registered Dietitian',
    specialization: "Therapeutic Nutrition & Women's Health",
    image: '/images/doctors/user4.png',
    review: "The precision dosage in PlainFuel is brilliant. It targets the micronutrient gap in Indian meals without megadoses. My female clients have seen improved energy and focus.",
    rating: 5, certifications: ['ICMR', 'ISDP', 'Nutrition Society India'],
    accent: '#dcfce7', accentStrong: '#166534',
  },
  {
    id: 5, name: 'Dr. Vikram Singh', title: 'PhD, Biochemist',
    specialization: 'Micronutrient Science & Research',
    image: '/images/doctors/user2.png',
    review: 'From a biochemistry standpoint, the synergy of nutrients in PlainFuel is well-calculated. Bioavailability is optimized for Indian demographics. Scientifically sound product.',
    rating: 5, certifications: ['IIT-D', 'CSIR', 'Nature Journal Author'],
    accent: '#f0fdf4', accentStrong: '#15803d',
  },
  {
    id: 6, name: 'Dr. Deepa Desai', title: 'Preventive Medicine Specialist',
    specialization: 'Lifestyle Medicine & Immunology',
    image: '/images/doctors/user4.png',
    review: 'PlainFuel bridges the gap that diet alone cannot. The FSSAI certification and quality assurance give me confidence to recommend it to my entire patient base.',
    rating: 5, certifications: ['AAFP', 'IMA', 'WHO Wellness Expert'],
    accent: '#ecfdf5', accentStrong: '#16a34a',
  },
];

function RatingStars({ rating }: { rating: number }) {
  return (
    <div style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
      {Array.from({ length: rating }).map((_, i) => (
        <motion.div key={i} initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: i * 15 - 30 }} transition={{ delay: i * 0.06, type: 'spring', stiffness: 320 }}>
          <StarDoodle size={16} />
        </motion.div>
      ))}
      <span style={{ fontSize: 12, color: '#15803d', marginLeft: 8, fontFamily: "'DM Sans', sans-serif", fontWeight: 600, letterSpacing: '0.03em' }}>
        {rating}.0 / 5.0
      </span>
    </div>
  );
}

function TrustBadge({ icon, label, sublabel, index }: { icon: ReactNode; label: string; sublabel?: string; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 + index * 0.1 }}
      whileHover={{ y: -5, boxShadow: '5px 7px 0 rgba(21,128,61,0.2)' }}
      style={{ background: '#fffef5', border: '2px solid rgba(21,128,61,0.22)', borderRadius: 16, padding: '22px 18px', textAlign: 'center', boxShadow: '3px 4px 0 rgba(21,128,61,0.12)', cursor: 'default', position: 'relative', overflow: 'hidden', transition: 'all 0.3s cubic-bezier(0.22,1,0.36,1)' }}
    >
      <div style={{ width: 52, height: 52, background: 'rgba(21,128,61,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: 26, border: '2px dashed rgba(21,128,61,0.3)' }}>
        {icon}
      </div>
      <p style={{ fontSize: 15, fontWeight: 700, color: '#111', margin: '0 0 3px 0', fontFamily: "'DM Sans', sans-serif", letterSpacing: '-0.01em' }}>{label}</p>
      {sublabel && <p style={{ fontSize: 12, color: '#15803d', margin: 0, fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>{sublabel}</p>}
      <StarDoodle size={14} style={{ position: 'absolute', top: 10, right: 10, opacity: 0.3 }} />
    </motion.div>
  );
}

type Direction = 1 | -1;

function CarouselSlide({ doctor, direction }: { doctor: typeof DOCTORS[0]; direction: Direction }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const variants: any = {
    enter: (dir: Direction) => ({ x: dir > 0 ? 120 : -120, opacity: 0, rotate: dir > 0 ? 4 : -4, scale: 0.92, filter: 'blur(4px)' }),
    center: { x: 0, opacity: 1, rotate: 0, scale: 1, filter: 'blur(0px)' },
    exit: (dir: Direction) => ({ x: dir > 0 ? -100 : 100, opacity: 0, rotate: dir > 0 ? -3 : 3, scale: 0.94, filter: 'blur(3px)' }),
  };

  return (
    <motion.div
      key={doctor.id} custom={direction} variants={variants} initial="enter" animate="center" exit="exit"
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      style={{ position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, background: '#fffef5', border: '2px solid rgba(21,128,61,0.22)', borderRadius: 24, overflow: 'hidden', boxShadow: '8px 12px 0 rgba(21,128,61,0.15)' }}
    >
      {/* LEFT PANEL */}
      <div style={{ background: `linear-gradient(160deg, ${doctor.accent} 0%, rgba(255,254,245,0.3) 100%)`, borderRight: '2px dashed rgba(21,128,61,0.18)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 32px', gap: 20, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -30, right: -30, width: 160, height: 160, borderRadius: '50%', background: 'rgba(21,128,61,0.05)' }} />
        <div style={{ position: 'absolute', bottom: -20, left: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(21,128,61,0.07)' }} />
        <motion.div initial={{ scale: 0.7, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.5, ease: [0.22, 1, 0.36, 1] }} style={{ position: 'relative', flexShrink: 0, zIndex: 1 }}>
          <div style={{ width: 120, height: 120, borderRadius: '50%', overflow: 'hidden', border: '3px solid #15803d', boxShadow: '4px 5px 0 rgba(21,128,61,0.25)', position: 'relative' }}>
            <Image src={doctor.image} alt={doctor.name} fill style={{ objectFit: 'cover' }} />
          </div>
          <CircleScribble size={144} style={{ position: 'absolute', top: -12, left: -12, pointerEvents: 'none' }} />
          <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 8 }} transition={{ delay: 0.35, type: 'spring', stiffness: 300 }}
            style={{ position: 'absolute', bottom: 4, right: -4, background: '#15803d', borderRadius: '50%', width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, boxShadow: '2px 3px 0 rgba(0,0,0,0.15)', border: '2px solid #fffef5', color: '#fff' }}>
            ✓
          </motion.div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22, duration: 0.45 }} style={{ textAlign: 'center', zIndex: 1 }}>
          <h3 style={{ fontSize: 20, fontWeight: 700, color: '#111', margin: '0 0 5px 0', fontFamily: "'DM Sans', sans-serif", letterSpacing: '-0.02em', lineHeight: 1.2 }}>{doctor.name}</h3>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#15803d', margin: '0 0 6px 0', fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.02em' }}>✦ {doctor.title}</p>
          <p style={{ fontSize: 12, color: 'rgba(0,0,0,0.52)', margin: 0, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.4 }}>{doctor.specialization}</p>
        </motion.div>
        <Squiggle width={160} />
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', zIndex: 1 }}>
          {doctor.certifications.map((cert, i) => (
            <motion.span key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.35 + i * 0.07 }}
              style={{ fontSize: 11, background: 'rgba(21,128,61,0.1)', border: '1.5px solid rgba(21,128,61,0.3)', borderRadius: 8, padding: '4px 10px', color: '#15803d', fontFamily: "'DM Sans', sans-serif", fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ fontSize: 9 }}>✦</span> {cert}
            </motion.span>
          ))}
        </motion.div>
      </div>

      {/* RIGHT PANEL */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '40px 36px', gap: 20, position: 'relative' }}>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.18, duration: 0.4 }}>
          <RatingStars rating={doctor.rating} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.26, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ background: `linear-gradient(135deg, ${doctor.accent}, rgba(255,254,245,0.5))`, border: '1.5px dashed rgba(21,128,61,0.3)', borderRadius: 16, padding: '24px 22px 20px 22px', position: 'relative' }}>
          <QuoteOpen size={30} style={{ position: 'absolute', top: -15, left: 12 }} />
          <p style={{ fontSize: 15, lineHeight: 1.75, color: 'rgba(0,0,0,0.75)', margin: 0, fontFamily: "'DM Sans', sans-serif", fontWeight: 400, paddingTop: 6 }}>
            {doctor.review}
          </p>
          <StarDoodle size={18} style={{ position: 'absolute', bottom: 10, right: 12, opacity: 0.25 }} />
        </motion.div>
        <motion.div initial={{ scaleX: 0, opacity: 0 }} animate={{ scaleX: 1, opacity: 1 }} transition={{ delay: 0.38, duration: 0.5 }} style={{ transformOrigin: 'left' }}>
          <WavyLine width={200} />
        </motion.div>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.44 }}
          style={{ fontSize: 12.5, color: 'rgba(0,0,0,0.42)', margin: 0, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.5, fontStyle: 'italic' }}>
          Verified medical professional · Independently reviewed
        </motion.p>
      </div>

      {/* Bottom accent bar */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 5, background: `repeating-linear-gradient(90deg, ${doctor.accentStrong} 0px, ${doctor.accentStrong} 14px, transparent 14px, transparent 22px)`, opacity: 0.5 }} />
    </motion.div>
  );
}

function PeekCard({ offset, rotate }: { offset: number; rotate: number }) {
  return (
    <div style={{ position: 'absolute', inset: 0, background: '#fffef5', border: '2px solid rgba(21,128,61,0.15)', borderRadius: 24, boxShadow: '4px 6px 0 rgba(21,128,61,0.08)', transform: `translateY(${offset}px) rotate(${rotate}deg) scale(${1 - Math.abs(offset) * 0.003})`, transformOrigin: 'bottom center', zIndex: 0, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 5, background: `repeating-linear-gradient(90deg, rgba(21,128,61,0.2) 0px, rgba(21,128,61,0.2) 14px, transparent 14px, transparent 22px)` }} />
    </div>
  );
}

function NavBtn({ onClick, dir, disabled }: { onClick: () => void; dir: 'prev' | 'next'; disabled: boolean }) {
  const isNext = dir === 'next';
  return (
    <motion.button onClick={onClick} disabled={disabled} whileHover={disabled ? {} : { scale: 1.08, y: -2 }} whileTap={disabled ? {} : { scale: 0.93 }}
      style={{ width: 52, height: 52, borderRadius: '50%', background: disabled ? 'rgba(0,0,0,0.04)' : '#fffef5', border: `2px solid ${disabled ? 'rgba(0,0,0,0.1)' : 'rgba(21,128,61,0.4)'}`, cursor: disabled ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: disabled ? 'none' : '3px 4px 0 rgba(21,128,61,0.18)', transition: 'all 0.2s', position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
      {!disabled && <motion.div whileHover={{ scale: 2.5, opacity: 0.12 }} style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#15803d', opacity: 0, transition: 'all 0.3s' }} />}
      <svg viewBox="0 0 24 24" width={20} height={20} fill="none" style={{ transform: isNext ? 'none' : 'scaleX(-1)' }}>
        <path d={isNext ? 'M5,12 C8,10 14,8 19,12 M14,7 L19,12 L14,17' : 'M19,12 C16,10 10,8 5,12 M10,7 L5,12 L10,17'}
          stroke={disabled ? 'rgba(0,0,0,0.25)' : '#15803d'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);

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

  // ── Auto-advance every 8 seconds ──
  useEffect(() => {
    if (paused) {
      if (autoRef.current) clearInterval(autoRef.current);
      return;
    }
    autoRef.current = setInterval(() => {
      setDirection(1);
      setCurrent((c) => (c + 1) % DOCTORS.length);
    }, 8000);
    return () => {
      if (autoRef.current) clearInterval(autoRef.current);
    };
  }, [paused, current]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap');

        .trust-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
        @media (max-width: 900px) { .trust-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 480px) { .trust-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 680px) { .carousel-slide-inner { grid-template-columns: 1fr !important; } }
      `}</style>

      <section
        ref={sectionRef}
        style={{ position: 'relative', overflow: 'hidden', background: '#fafff6', paddingBottom: 100 }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* BG doodles */}
        <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
          <motion.div style={{ position: 'absolute', top: '6%', left: '2%', y: floatY }}><StarDoodle size={52} style={{ opacity: 0.12, transform: 'rotate(22deg)' }} /></motion.div>
          <motion.div style={{ position: 'absolute', top: '12%', right: '4%', y: floatY2 }}><StarDoodle size={38} style={{ opacity: 0.18, transform: 'rotate(-15deg)' }} /></motion.div>
          <motion.div style={{ position: 'absolute', top: '35%', left: '1%', y: floatY }}><CircleScribble size={80} style={{ opacity: 0.6 }} /></motion.div>
          <motion.div style={{ position: 'absolute', bottom: '25%', right: '2%', y: floatY2 }}><CircleScribble size={100} style={{ opacity: 0.5 }} /></motion.div>
          <motion.div style={{ position: 'absolute', bottom: '10%', left: '4%', y: floatY }}><StarDoodle size={44} style={{ opacity: 0.14, transform: 'rotate(40deg)' }} /></motion.div>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(21,128,61,0.08) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        </div>

        <div style={{ maxWidth: 1000, margin: '0 auto', padding: '90px 24px 0', position: 'relative', zIndex: 1 }}>

          {/* Eyebrow */}
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ display: 'flex', justifyContent: 'center', marginBottom: 36 }}>
            <div style={{ background: 'rgba(21,128,61,0.09)', border: '2px dashed #15803d', borderRadius: 10, padding: '8px 22px', transform: 'rotate(-1.5deg)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <StarDoodle size={14} />
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: '#15803d', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Trusted by Experts</span>
              <StarDoodle size={14} />
            </div>
          </motion.div>

          {/* Heading */}
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: 14 }}>
            <h2 style={{ fontSize: 'clamp(2rem, 5.5vw, 3.6rem)', fontFamily: "'DM Sans', sans-serif", fontWeight: 700, lineHeight: 1.1, color: '#111', margin: '0 0 4px 0', letterSpacing: '-0.03em' }}>
              Endorsed by{' '}
              <span style={{ color: '#15803d', position: 'relative', display: 'inline-block' }}>
                Medical Experts
                <HandDrawnUnderline width={320} style={{ position: 'absolute', bottom: -8, left: '50%', transform: 'translateX(-50%)' }} />
              </span>
            </h2>
          </motion.div>

          <motion.div initial={{ opacity: 0, scaleX: 0 }} whileInView={{ opacity: 1, scaleX: 1 }} viewport={{ once: true }} transition={{ delay: 0.2, duration: 0.8 }} style={{ display: 'flex', justifyContent: 'center', marginTop: 24, marginBottom: 20 }}>
            <WavyLine width={200} />
          </motion.div>

          <motion.p initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }}
            style={{ fontSize: 'clamp(15px, 2vw, 17px)', fontFamily: "'DM Sans', sans-serif", color: 'rgba(0,0,0,0.58)', textAlign: 'center', maxWidth: 580, margin: '0 auto 60px auto', lineHeight: 1.7, letterSpacing: '-0.005em' }}>
            Leading doctors, nutritionists, and scientists recommend PlainFuel for its precision, transparency, and evidence-based formulation.
          </motion.p>

          {/* ── CAROUSEL ── */}
          <motion.div initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>

            {/* Counter + auto-play indicator */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, padding: '0 4px' }}>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: '#15803d', fontWeight: 600 }}>
                ✦ Expert {current + 1} of {DOCTORS.length}
              </span>
              {/* Progress bar showing 8s countdown */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: 'rgba(0,0,0,0.35)', fontWeight: 500, letterSpacing: '0.05em' }}>
                  {paused ? 'PAUSED' : 'AUTO'}
                </span>
                <div style={{ width: 80, height: 4, background: 'rgba(21,128,61,0.15)', borderRadius: 99, overflow: 'hidden' }}>
                  {!paused && (
                    <motion.div
                      key={current}
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 8, ease: 'linear' }}
                      style={{ height: '100%', background: '#15803d', borderRadius: 99 }}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Stacked card frame */}
            <div style={{ position: 'relative', paddingBottom: 18 }}>
              <PeekCard offset={14} rotate={2.5} />
              <PeekCard offset={8} rotate={-1.2} />
              <div style={{ position: 'relative', height: 360, zIndex: 2, borderRadius: 24, overflow: 'visible' }}>
                <AnimatePresence initial={false} custom={direction} mode="popLayout">
                  <CarouselSlide key={DOCTORS[current].id} doctor={DOCTORS[current]} direction={direction} />
                </AnimatePresence>
              </div>
            </div>

            {/* Controls row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, marginTop: 28 }}>
              <NavBtn onClick={prev} dir="prev" disabled={isAnimating} />
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                {DOCTORS.map((_, i) => (
                  <InkDot key={i} active={i === current} index={i} onClick={() => goTo(i)} />
                ))}
              </div>
              <NavBtn onClick={next} dir="next" disabled={isAnimating} />
            </div>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
              style={{ textAlign: 'center', marginTop: 12, fontSize: 12, fontFamily: "'DM Sans', sans-serif", color: 'rgba(0,0,0,0.32)', fontWeight: 500, letterSpacing: '0.04em' }}>
              ← click arrows or dots to explore · hover to pause auto-play →
            </motion.p>
          </motion.div>

          {/* Stats row */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
            style={{ marginTop: 64, background: '#fffef5', border: '2px solid rgba(21,128,61,0.22)', borderRadius: 20, padding: '36px 40px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 24, textAlign: 'center', boxShadow: '5px 7px 0 rgba(21,128,61,0.1)', position: 'relative', overflow: 'hidden' }}>
            <StarDoodle size={40} style={{ position: 'absolute', top: 12, right: 16, opacity: 0.15, transform: 'rotate(20deg)' }} />
            <StarDoodle size={28} style={{ position: 'absolute', bottom: 12, left: 16, opacity: 0.12, transform: 'rotate(-10deg)' }} />
            {[
              { num: '6+', label: 'Medical Experts', sub: 'and counting' },
              { num: '100%', label: 'Third-Party Tested', sub: 'every batch' },
              { num: '5.0', label: 'Expert Rating', sub: 'out of 5.0' },
              { num: 'FSSAI', label: 'Certified', sub: 'India-approved' },
            ].map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 + i * 0.1 }}>
                <div style={{ fontSize: 'clamp(26px,4vw,38px)', fontFamily: "'DM Sans', sans-serif", fontWeight: 800, color: '#15803d', lineHeight: 1, marginBottom: 4 }}>{stat.num}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#111', fontFamily: "'DM Sans', sans-serif", letterSpacing: '-0.01em' }}>{stat.label}</div>
                <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)', fontFamily: "'DM Sans', sans-serif", fontWeight: 400, marginTop: 2 }}>{stat.sub}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Trust badges */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }} style={{ marginTop: 28 }}>
            <div className="trust-grid">
              {[
                { icon: '🔬', label: 'Third-Party Tested', sublabel: 'every single batch' },
                { icon: '✅', label: 'FSSAI Certified', sublabel: 'India approved' },
                { icon: '📋', label: 'Clinically Endorsed', sublabel: 'by 6+ doctors' },
                { icon: '🎯', label: 'Science-Backed', sublabel: 'evidence-based formula' },
              ].map((badge, i) => (
                <TrustBadge key={i} {...badge} index={i} />
              ))}
            </div>
          </motion.div>

        </div>
      </section>
    </>
  );
}