'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { useRef, useState, ReactNode } from 'react';

// ── Hand-drawn SVG Doodles ──

const Squiggle = ({ width = 120, style = {} }) => (
  <svg viewBox={`0 0 ${width} 12`} width={width} height={12} style={style} aria-hidden>
    <path
      d={`M2,6 Q${width * 0.1},2 ${width * 0.2},6 Q${width * 0.3},10 ${width * 0.4},6 Q${width * 0.5},2 ${width * 0.6},6 Q${width * 0.7},10 ${width * 0.8},6 Q${width * 0.9},2 ${width - 2},6`}
      fill="none"
      stroke="#15803d"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </svg>
);

const HandDrawnUnderline = ({ width = 160, style = {} }) => (
  <svg viewBox={`0 0 ${width} 14`} width={width} height={14} style={style} aria-hidden>
    <path
      d={`M3,8 C${width * 0.15},4 ${width * 0.35},11 ${width * 0.5},7 C${width * 0.65},3 ${width * 0.8},10 ${width - 3},7`}
      fill="none"
      stroke="#15803d"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <path
      d={`M6,11 C${width * 0.2},9 ${width * 0.5},13 ${width * 0.75},10 C${width * 0.85},9 ${width * 0.95},11 ${width - 5},10`}
      fill="none"
      stroke="rgba(21,128,61,0.3)"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const StarDoodle = ({ size = 20, rotate = 0, style = {} }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} style={{ transform: `rotate(${rotate}deg)`, ...style }} aria-hidden>
    <path
      d="M12,2.5 L13.8,8.8 L20.5,8.8 L15.1,12.7 L17.0,19.0 L12,15.1 L7.0,19.0 L8.9,12.7 L3.5,8.8 L10.2,8.8 Z"
      fill="#15803d"
      stroke="#0f5f2d"
      strokeWidth="0.5"
      strokeLinejoin="round"
    />
  </svg>
);

const PaperPlane = ({ size = 32, style = {} }) => (
  <svg viewBox="0 0 32 32" width={size} height={size} style={style} aria-hidden>
    <path d="M2,16 L30,4 L22,28 L16,18 Z" fill="none" stroke="#15803d" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M16,18 L22,12" fill="none" stroke="#15803d" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const CircleScribble = ({ size = 60, style = {} }) => (
  <svg viewBox="0 0 60 60" width={size} height={size} style={style} aria-hidden>
    <path
      d="M30,4 C46,4 56,14 56,30 C56,46 46,56 30,56 C14,56 4,46 4,30 C4,14 14,4 30,4"
      fill="none"
      stroke="rgba(21,128,61,0.25)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeDasharray="5,3"
    />
    <path
      d="M30,8 C44,7 52,17 53,30 C54,44 44,52 30,52 C17,53 8,43 7,30"
      fill="none"
      stroke="rgba(21,128,61,0.12)"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const ArrowDoodle = ({ style = {} }) => (
  <svg viewBox="0 0 48 24" width={48} height={24} style={style} aria-hidden>
    <path d="M2,12 C10,8 20,10 36,12" fill="none" stroke="#15803d" strokeWidth="2" strokeLinecap="round" />
    <path d="M30,6 L36,12 L30,18" fill="none" stroke="#15803d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CrossHatch = ({ size = 40, style = {} }) => (
  <svg viewBox="0 0 40 40" width={size} height={size} style={style} aria-hidden>
    {[0, 8, 16, 24, 32].map(y => (
      <line key={y} x1="0" y1={y} x2="40" y2={y} stroke="rgba(21,128,61,0.15)" strokeWidth="1" />
    ))}
    {[0, 8, 16, 24, 32].map(x => (
      <line key={x} x1={x} y1="0" x2={x} y2="40" stroke="rgba(21,128,61,0.15)" strokeWidth="1" />
    ))}
  </svg>
);

const QuoteOpen = ({ size = 40, style = {} }) => (
  <svg viewBox="0 0 40 32" width={size} height={size * 0.8} style={style} aria-hidden>
    <path
      d="M4,20 C3,10 8,4 16,3 C17,3 18,4 18,5 C12,7 9,11 10,16 L16,16 C18,16 18,18 18,20 L18,28 C18,30 16,30 14,30 L6,30 C4,30 4,28 4,26 Z"
      fill="rgba(21,128,61,0.1)"
      stroke="#15803d"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      d="M24,20 C23,10 28,4 36,3 C37,3 38,4 38,5 C32,7 29,11 30,16 L36,16 C38,16 38,18 38,20 L38,28 C38,30 36,30 34,30 L26,30 C24,30 24,28 24,26 Z"
      fill="rgba(21,128,61,0.1)"
      stroke="#15803d"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
);

const ScratchCircle = ({ style = {} }) => (
  <svg viewBox="0 0 80 80" width={80} height={80} style={style} aria-hidden>
    <path
      d="M40,6 C58,5 74,20 74,40 C74,60 59,74 40,74 C21,74 6,59 6,40 C6,21 20,6 40,6 Z"
      fill="rgba(21,128,61,0.06)"
      stroke="rgba(21,128,61,0.2)"
      strokeWidth="1.5"
      strokeDasharray="6,3"
    />
  </svg>
);

const WavyLine = ({ width = 200, style = {} }) => (
  <svg viewBox={`0 0 ${width} 16`} width={width} height={16} style={style} aria-hidden>
    <path
      d={`M0,8 Q${width * 0.125},2 ${width * 0.25},8 Q${width * 0.375},14 ${width * 0.5},8 Q${width * 0.625},2 ${width * 0.75},8 Q${width * 0.875},14 ${width},8`}
      fill="none"
      stroke="rgba(21,128,61,0.3)"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

// ── Data ──

const DOCTORS = [
  {
    id: 1,
    name: 'Dr. Rajesh Sharma',
    title: 'Chief Nutritionist',
    specialization: 'Clinical Nutrition & Sports Medicine',
    image: 'https://images.unsplash.com/photo-1612349317150-e88e6ff1fcc1?w=400&q=80',
    review: 'PlainFuel is formulated with precision that matches Indian dietary patterns. The micronutrient profile is exactly what most people are missing. I recommend it to all my patients.',
    rating: 5,
    certifications: ['ACSM', 'ISSN', 'Indian Medical Association'],
    accent: '#dcfce7',
    tilt: '-1.5deg',
  },
  {
    id: 2,
    name: 'Dr. Priya Mehta',
    title: 'MD, Internal Medicine',
    specialization: 'Preventive Medicine & Wellness',
    image: 'https://images.unsplash.com/photo-1594824476967-48c687c083d7?w=400&q=80',
    review: 'As a doctor, I am always cautious about supplements. PlainFuel impressed me with its transparency, third-party testing, and evidence-based formulation. Science-first approach.',
    rating: 5,
    certifications: ['NMC', 'IAMS', 'Harvard Health'],
    accent: '#f0fdf4',
    tilt: '1deg',
  },
  {
    id: 3,
    name: 'Dr. Arjun Kapoor',
    title: 'Sports Physician',
    specialization: 'Athletic Performance & Recovery',
    image: 'https://images.unsplash.com/photo-1622496131514-635ec0ddcd58?w=400&q=80',
    review: 'Perfect for athletes and active individuals. The creatine and B-complex formulation supports energy metabolism. Plus, no artificial fillers — exactly what we need.',
    rating: 5,
    certifications: ['ACSM-CEP', 'GIPS', 'Sports Medicine Board'],
    accent: '#ecfdf5',
    tilt: '-0.8deg',
  },
  {
    id: 4,
    name: 'Dr. Neha Gupta',
    title: 'Registered Dietitian',
    specialization: "Therapeutic Nutrition & Women's Health",
    image: 'https://images.unsplash.com/photo-1559839734945-3b1f3f4ea78e?w=400&q=80',
    review: "The precision dosage in PlainFuel is brilliant. It targets the micronutrient gap in Indian meals without megadoses. My female clients have seen improved energy and focus.",
    rating: 5,
    certifications: ['ICMR', 'ISDP', 'Nutrition Society India'],
    accent: '#dcfce7',
    tilt: '1.2deg',
  },
  {
    id: 5,
    name: 'Dr. Vikram Singh',
    title: 'PhD, Biochemist',
    specialization: 'Micronutrient Science & Research',
    image: 'https://images.unsplash.com/photo-1631217314831-c6227db76b6e?w=400&q=80',
    review: 'From a biochemistry standpoint, the synergy of nutrients in PlainFuel is well-calculated. Bioavailability is optimized for Indian demographics. Scientifically sound product.',
    rating: 5,
    certifications: ['IIT-D', 'CSIR', 'Nature Journal Author'],
    accent: '#f0fdf4',
    tilt: '-1deg',
  },
  {
    id: 6,
    name: 'Dr. Deepa Desai',
    title: 'Preventive Medicine Specialist',
    specialization: 'Lifestyle Medicine & Immunology',
    image: 'https://images.unsplash.com/photo-1611717159916-972b0ff90db5?w=400&q=80',
    review: 'PlainFuel bridges the gap that diet alone cannot. The FSSAI certification and quality assurance give me confidence to recommend it to my entire patient base.',
    rating: 5,
    certifications: ['AAFP', 'IMA', 'WHO Wellness Expert'],
    accent: '#ecfdf5',
    tilt: '0.8deg',
  },
];

// ── Rating Stars ──
function RatingStars({ rating }: { rating: number }) {
  return (
    <div style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
      {Array.from({ length: rating }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0, rotate: -30 }}
          whileInView={{ scale: 1, rotate: i * 15 - 30 }}
          transition={{ delay: i * 0.08, type: 'spring', stiffness: 300 }}
          viewport={{ once: true }}
        >
          <StarDoodle size={15} />
        </motion.div>
      ))}
      <span style={{
        fontSize: 11,
        color: '#15803d',
        marginLeft: 8,
        fontFamily: "'Caveat', cursive",
        fontWeight: 700,
        letterSpacing: '0.03em',
      }}>
        {rating}.0 / 5.0
      </span>
    </div>
  );
}

// ── Doctor Card ──
function DoctorCard({ doctor, index }: { doctor: typeof DOCTORS[0]; index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 32, rotate: parseFloat(doctor.tilt) * 0.5 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: index * 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{
        background: '#fffef5',
        border: '2px solid',
        borderColor: hovered ? '#15803d' : 'rgba(21,128,61,0.22)',
        borderRadius: 20,
        overflow: 'hidden',
        boxShadow: hovered
          ? '7px 10px 0 rgba(21,128,61,0.22), 0 0 0 4px rgba(21,128,61,0.06)'
          : '5px 7px 0 rgba(21,128,61,0.13)',
        transition: 'all 0.35s cubic-bezier(0.22,1,0.36,1)',
        transform: hovered ? 'translateY(-6px)' : 'none',
        position: 'relative',
      }}
    >
      {/* Corner accent scribble */}
      <div style={{ position: 'absolute', top: -10, right: -10, opacity: 0.4, zIndex: 0 }}>
        <ScratchCircle />
      </div>

      {/* Crosshatch texture top-right */}
      <div style={{ position: 'absolute', top: 8, right: 8, opacity: 0.5, zIndex: 0 }}>
        <CrossHatch size={32} />
      </div>

      {/* Image + badge row */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: 0,
        background: `linear-gradient(135deg, ${doctor.accent} 0%, rgba(255,254,245,0.6) 100%)`,
        padding: '24px 24px 0 24px',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Avatar with hand-drawn ring */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <div style={{
            width: 88,
            height: 88,
            borderRadius: '50%',
            overflow: 'hidden',
            border: '3px solid #15803d',
            boxShadow: '3px 4px 0 rgba(21,128,61,0.2)',
            position: 'relative',
          }}>
            <Image
              src={doctor.image}
              alt={doctor.name}
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>
          {/* Doodle ring around avatar */}
          <CircleScribble size={104} style={{
            position: 'absolute',
            top: -8,
            left: -8,
            pointerEvents: 'none',
          }} />
        </div>

        {/* Name / title beside avatar */}
        <div style={{ paddingLeft: 16, paddingBottom: 16, flex: 1 }}>
          <h3 style={{
            fontSize: 17,
            fontWeight: 700,
            color: '#111',
            margin: '0 0 3px 0',
            fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
          }}>
            {doctor.name}
          </h3>
          <p style={{
            fontSize: 13,
            fontWeight: 700,
            color: '#15803d',
            margin: '0 0 4px 0',
            fontFamily: "'Caveat', cursive",
            letterSpacing: '0.04em',
          }}>
            ✦ {doctor.title}
          </p>
          <p style={{
            fontSize: 11.5,
            color: 'rgba(0,0,0,0.52)',
            margin: 0,
            fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
            lineHeight: 1.4,
          }}>
            {doctor.specialization}
          </p>
        </div>
      </div>

      {/* Squiggle divider */}
      <div style={{ padding: '0 24px', position: 'relative', zIndex: 1 }}>
        <Squiggle width={280} style={{ display: 'block', margin: '12px 0' }} />
      </div>

      {/* Body content */}
      <div style={{ padding: '0 24px 24px', position: 'relative', zIndex: 1 }}>
        {/* Rating */}
        <div style={{ marginBottom: 14 }}>
          <RatingStars rating={doctor.rating} />
        </div>

        {/* Quote block */}
        <div style={{
          background: `linear-gradient(135deg, ${doctor.accent}, rgba(255,254,245,0.4))`,
          border: '1.5px dashed rgba(21,128,61,0.28)',
          borderRadius: 14,
          padding: '14px 16px 14px 14px',
          marginBottom: 16,
          position: 'relative',
        }}>
          <QuoteOpen size={28} style={{ position: 'absolute', top: -14, left: 10 }} />
          <p style={{
            fontSize: 14.5,
            lineHeight: 1.65,
            color: 'rgba(0,0,0,0.72)',
            margin: 0,
            fontFamily: "'Caveat', cursive",
            fontWeight: 600,
            paddingTop: 4,
          }}>
            {doctor.review}
          </p>
        </div>

        {/* Certifications */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 6,
        }}>
          {doctor.certifications.map((cert: string, i: number) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 + i * 0.06 }}
              viewport={{ once: true }}
              style={{
                fontSize: 11,
                background: 'rgba(21,128,61,0.08)',
                border: '1.5px solid rgba(21,128,61,0.25)',
                borderRadius: 8,
                padding: '4px 10px',
                color: '#15803d',
                fontFamily: "'Caveat', cursive",
                fontWeight: 700,
                letterSpacing: '0.02em',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <span style={{ fontSize: 9 }}>✦</span> {cert}
            </motion.span>
          ))}
        </div>
      </div>

      {/* Bottom doodle accent bar */}
      <div style={{
        height: 5,
        background: hovered
          ? 'repeating-linear-gradient(90deg, #15803d 0px, #15803d 12px, transparent 12px, transparent 18px)'
          : 'repeating-linear-gradient(90deg, rgba(21,128,61,0.3) 0px, rgba(21,128,61,0.3) 12px, transparent 12px, transparent 18px)',
        transition: 'background 0.3s',
      }} />
    </motion.div>
  );
}

// ── Trust Badge ──
function TrustBadge({ icon, label, sublabel, index }: { icon: ReactNode; label: string; sublabel?: string; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.2 + index * 0.1 }}
      whileHover={{ y: -5, boxShadow: '5px 7px 0 rgba(21,128,61,0.2)' }}
      style={{
        background: '#fffef5',
        border: '2px solid rgba(21,128,61,0.22)',
        borderRadius: 16,
        padding: '22px 18px',
        textAlign: 'center',
        boxShadow: '3px 4px 0 rgba(21,128,61,0.12)',
        cursor: 'default',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.22,1,0.36,1)',
      }}
    >
      <div style={{
        width: 52,
        height: 52,
        background: 'rgba(21,128,61,0.1)',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 12px',
        fontSize: 26,
        border: '2px dashed rgba(21,128,61,0.3)',
      }}>
        {icon}
      </div>
      <p style={{
        fontSize: 15,
        fontWeight: 700,
        color: '#111',
        margin: '0 0 3px 0',
        fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
        letterSpacing: '-0.01em',
      }}>
        {label}
      </p>
      {sublabel && (
        <p style={{
          fontSize: 12,
          color: '#15803d',
          margin: 0,
          fontFamily: "'Caveat', cursive",
          fontWeight: 700,
        }}>
          {sublabel}
        </p>
      )}
      {/* Corner star */}
      <StarDoodle size={14} style={{ position: 'absolute', top: 10, right: 10, opacity: 0.3 }} />
    </motion.div>
  );
}

// ── Main Component ──
export default function DoctorsReview() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const floatY = useTransform(scrollYProgress, [0, 1], [-20, 20]);
  const floatY2 = useTransform(scrollYProgress, [0, 1], [20, -20]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700;900&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,700;1,9..40,400&display=swap');

        .dr-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        @media (max-width: 1100px) {
          .dr-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 680px) {
          .dr-grid { grid-template-columns: 1fr; }
        }
        .trust-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }
        @media (max-width: 900px) {
          .trust-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 480px) {
          .trust-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>

      <section
        ref={sectionRef}
        style={{
          position: 'relative',
          overflow: 'hidden',
          background: '#fafff6',
          paddingBottom: 100,
        }}
      >
        {/* ── Scattered background doodles ── */}
        <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
          <motion.div style={{ position: 'absolute', top: '6%', left: '2%', y: floatY }}>
            <StarDoodle size={52} style={{ opacity: 0.12, transform: 'rotate(22deg)' }} />
          </motion.div>
          <motion.div style={{ position: 'absolute', top: '12%', right: '4%', y: floatY2 }}>
            <StarDoodle size={38} style={{ opacity: 0.18, transform: 'rotate(-15deg)' }} />
          </motion.div>
          <motion.div style={{ position: 'absolute', top: '35%', left: '1%', y: floatY }}>
            <CircleScribble size={80} style={{ opacity: 0.6 }} />
          </motion.div>
          <motion.div style={{ position: 'absolute', bottom: '25%', right: '2%', y: floatY2 }}>
            <CircleScribble size={100} style={{ opacity: 0.5 }} />
          </motion.div>
          <motion.div style={{ position: 'absolute', bottom: '10%', left: '4%', y: floatY }}>
            <StarDoodle size={44} style={{ opacity: 0.14, transform: 'rotate(40deg)' }} />
          </motion.div>
          <motion.div style={{ position: 'absolute', top: '55%', right: '1.5%', y: floatY2 }}>
            <PaperPlane size={40} style={{ opacity: 0.2 }} />
          </motion.div>
          {/* Background grid dots */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(circle, rgba(21,128,61,0.08) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }} />
        </div>

        {/* ── Content ── */}
        <div style={{ maxWidth: 1180, margin: '0 auto', padding: '90px 24px 0', position: 'relative', zIndex: 1 }}>

          {/* Eyebrow tag */}
          <motion.div
            initial={{ opacity: 0, y: 16, rotate: -2 }}
            whileInView={{ opacity: 1, y: 0, rotate: -1.5 }}
            viewport={{ once: true }}
            style={{ display: 'flex', justifyContent: 'center', marginBottom: 36 }}
          >
            <div style={{
              background: 'rgba(21,128,61,0.09)',
              border: '2px dashed #15803d',
              borderRadius: 10,
              padding: '8px 22px',
              transform: 'rotate(-1.5deg)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              <StarDoodle size={14} />
              <span style={{
                fontFamily: "'Caveat', cursive",
                fontSize: 15,
                color: '#15803d',
                fontWeight: 700,
                letterSpacing: '0.05em',
              }}>
                Trusted by Experts
              </span>
              <StarDoodle size={14} />
            </div>
          </motion.div>

          {/* Main Heading — clean sans-serif */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: 14 }}
          >
            <h2 style={{
              fontSize: 'clamp(2rem, 5.5vw, 3.6rem)',
              fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
              fontWeight: 700,
              lineHeight: 1.1,
              color: '#111',
              margin: '0 0 4px 0',
              letterSpacing: '-0.03em',
            }}>
              Endorsed by{' '}
              <span style={{ color: '#15803d', position: 'relative', display: 'inline-block' }}>
                Medical Experts
                {/* Hand-drawn underline under "Medical Experts" */}
                <HandDrawnUnderline
                  width={320}
                  style={{
                    position: 'absolute',
                    bottom: -8,
                    left: '50%',
                    transform: 'translateX(-50%)',
                  }}
                />
              </span>
            </h2>
          </motion.div>

          {/* Doodle accent below heading */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
            style={{ display: 'flex', justifyContent: 'center', marginTop: 24, marginBottom: 20 }}
          >
            <WavyLine width={200} />
          </motion.div>

          {/* Description — clean sans-serif */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            style={{
              fontSize: 'clamp(15px, 2vw, 17px)',
              fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
              fontWeight: 400,
              color: 'rgba(0,0,0,0.58)',
              textAlign: 'center',
              maxWidth: 580,
              margin: '0 auto 60px auto',
              lineHeight: 1.7,
              letterSpacing: '-0.005em',
            }}
          >
            Leading doctors, nutritionists, and scientists recommend PlainFuel for its precision, transparency, and evidence-based formulation.
          </motion.p>

          {/* Arrow doodle pointing to grid */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}
          >
            <ArrowDoodle style={{ transform: 'rotate(90deg)', opacity: 0.5 }} />
          </motion.div>

          {/* ── Doctors Grid ── */}
          <div className="dr-grid">
            {DOCTORS.map((doctor, i) => (
              <DoctorCard key={doctor.id} doctor={doctor} index={i} />
            ))}
          </div>

          {/* ── Stats row ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            style={{
              marginTop: 64,
              background: '#fffef5',
              border: '2px solid rgba(21,128,61,0.22)',
              borderRadius: 20,
              padding: '36px 40px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: 24,
              textAlign: 'center',
              boxShadow: '5px 7px 0 rgba(21,128,61,0.1)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Doodle corners */}
            <StarDoodle size={40} style={{ position: 'absolute', top: 12, right: 16, opacity: 0.15, transform: 'rotate(20deg)' }} />
            <StarDoodle size={28} style={{ position: 'absolute', bottom: 12, left: 16, opacity: 0.12, transform: 'rotate(-10deg)' }} />

            {[
              { num: '6+', label: 'Medical Experts', sub: 'and counting' },
              { num: '100%', label: 'Third-Party Tested', sub: 'every batch' },
              { num: '5.0', label: 'Expert Rating', sub: 'out of 5.0' },
              { num: 'FSSAI', label: 'Certified', sub: 'India-approved' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.1 }}
              >
                <div style={{
                  fontSize: 'clamp(26px, 4vw, 38px)',
                  fontFamily: "'Caveat', cursive",
                  fontWeight: 900,
                  color: '#15803d',
                  lineHeight: 1,
                  marginBottom: 4,
                }}>
                  {stat.num}
                </div>
                <div style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: '#111',
                  fontFamily: "'DM Sans', sans-serif",
                  letterSpacing: '-0.01em',
                }}>
                  {stat.label}
                </div>
                <div style={{
                  fontSize: 12,
                  color: 'rgba(0,0,0,0.45)',
                  fontFamily: "'Caveat', cursive",
                  fontWeight: 600,
                  marginTop: 2,
                }}>
                  {stat.sub}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* ── Trust Badges ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            style={{ marginTop: 28 }}
          >
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