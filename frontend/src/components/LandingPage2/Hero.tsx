"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

// ── Doodle SVG: floating bolt ─────────────────────────────────────────────────
const BoltIcon = () => (
  <svg viewBox="0 0 40 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <path d="M24 4 L8 26 L18 26 L16 46 L32 22 L22 22 Z"
      stroke="#633806" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" fill="#FAC775" />
  </svg>
);

// ── Doodle SVG: leaf ───────────────────────────────────────────────────────────
const LeafIcon = () => (
  <svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <path d="M22 38 Q8 28 8 16 Q8 6 22 6 Q36 6 36 16 Q36 28 22 38 Z"
      stroke="#27500A" strokeWidth="2.5" strokeLinejoin="round" fill="#C0DD97" />
    <path d="M22 38 Q22 22 22 6" stroke="#27500A" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    <path d="M22 22 Q30 16 36 14" stroke="#27500A" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    <path d="M22 28 Q14 22 8 20" stroke="#27500A" strokeWidth="1.5" strokeLinecap="round" fill="none" />
  </svg>
);

// ── Doodle SVG: sun / vitamin D ───────────────────────────────────────────────
const SunIcon = () => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <circle cx="24" cy="24" r="10" stroke="#854F0B" strokeWidth="2.5" fill="#FAC775" />
    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
      const rad = (angle * Math.PI) / 180;
      const x1 = 24 + 14 * Math.cos(rad);
      const y1 = 24 + 14 * Math.sin(rad);
      const x2 = 24 + 20 * Math.cos(rad);
      const y2 = 24 + 20 * Math.sin(rad);
      return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#854F0B" strokeWidth="2.5" strokeLinecap="round" />;
    })}
  </svg>
);

// ── Doodle SVG: bone ──────────────────────────────────────────────────────────
const BoneIcon = () => (
  <svg viewBox="0 0 52 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <path d="M14 18 L38 18" stroke="#185FA5" strokeWidth="3" strokeLinecap="round" />
    <circle cx="12" cy="14" r="5" stroke="#185FA5" strokeWidth="2.5" fill="#B5D4F4" />
    <circle cx="12" cy="22" r="5" stroke="#185FA5" strokeWidth="2.5" fill="#B5D4F4" />
    <circle cx="40" cy="14" r="5" stroke="#185FA5" strokeWidth="2.5" fill="#B5D4F4" />
    <circle cx="40" cy="22" r="5" stroke="#185FA5" strokeWidth="2.5" fill="#B5D4F4" />
  </svg>
);

// ── Doodle SVG: heart pulse ───────────────────────────────────────────────────
const HeartIcon = () => (
  <svg viewBox="0 0 48 44" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <path d="M24 38 Q6 26 6 14 Q6 6 14 6 Q20 6 24 12 Q28 6 34 6 Q42 6 42 14 Q42 26 24 38 Z"
      stroke="#993556" strokeWidth="2.5" strokeLinejoin="round" fill="#F4C0D1" />
    <path d="M10 20 L15 14 L19 22 L23 10 L27 26 L31 18 L36 22" stroke="#993556" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

// ── Doodle SVG: pill capsule ──────────────────────────────────────────────────
const PillIcon = () => (
  <svg viewBox="0 0 60 30" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <rect x="3" y="3" width="54" height="24" rx="12" stroke="#534AB7" strokeWidth="2.5" fill="#CECBF6" />
    <line x1="30" y1="3" x2="30" y2="27" stroke="#534AB7" strokeWidth="2" strokeLinecap="round" />
    <rect x="3" y="3" width="27" height="24" rx="12" fill="#AFA9EC" />
  </svg>
);

// ── Background doodle texture ─────────────────────────────────────────────────
const DoodleBg = () => (
  <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 900 700" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
    <g stroke="#2a2a2a" fill="none" opacity="0.06" strokeLinecap="round">
      {/* scattered stars */}
      {[[60, 60], [820, 80], [50, 580], [860, 500], [450, 40], [200, 650], [720, 630]].map(([x, y], i) => (
        <g key={i}>
          <path d={`M${x} ${y - 10} L${x + 3} ${y - 3} L${x + 10} ${y} L${x + 3} ${y + 3} L${x} ${y + 10} L${x - 3} ${y + 3} L${x - 10} ${y} L${x - 3} ${y - 3} Z`} strokeWidth="1.5" />
        </g>
      ))}
      {/* wavy lines */}
      <path d="M0 180 Q150 160 300 180 Q450 200 600 180 Q750 160 900 180" strokeWidth="1.2" />
      <path d="M0 520 Q200 500 400 520 Q600 540 900 520" strokeWidth="1.2" />
      {/* small circles */}
      {[[140, 300], [760, 200], [80, 430], [840, 370], [400, 650]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="5" strokeWidth="1.5" />
      ))}
      {/* x marks */}
      {[[700, 130], [160, 490], [550, 580]].map(([x, y], i) => (
        <g key={i}>
          <line x1={x - 8} y1={y - 8} x2={x + 8} y2={y + 8} strokeWidth="2" />
          <line x1={x + 8} y1={y - 8} x2={x - 8} y2={y + 8} strokeWidth="2" />
        </g>
      ))}
      {/* squiggles */}
      <path d="M30 350 Q50 340 70 350 Q90 360 110 350 Q130 340 150 350" strokeWidth="1.5" />
      <path d="M750 420 Q770 410 790 420 Q810 430 830 420 Q850 410 870 420" strokeWidth="1.5" />
      {/* dots grid loose */}
      {[1, 2, 3, 4].map(row => [1, 2, 3].map(col => (
        <circle key={`${row}-${col}`} cx={col * 60 + 580} cy={row * 55 + 100} r="2.5" fill="#2a2a2a" strokeWidth="0" />
      )))}
      {/* spiral hint */}
      <path d="M450 650 Q460 640 470 650 Q480 660 460 665 Q440 668 438 648 Q436 628 460 625 Q490 622 492 655" strokeWidth="1.2" />
    </g>
  </svg>
);

// ── Animated underline SVG ────────────────────────────────────────────────────
const WobblyUnderline = ({ color = "#1D9E75" }: { color?: string }) => (
  <svg viewBox="0 0 400 16" className="absolute -bottom-2 left-0 w-full" preserveAspectRatio="none" style={{ height: 14 }}>
    <path
      d="M4 10 Q50 4 100 10 Q150 16 200 10 Q250 4 300 10 Q350 16 396 8"
      stroke={color} strokeWidth="3.5" fill="none" strokeLinecap="round"
      style={{ strokeDasharray: 500, strokeDashoffset: 500, animation: "drawPath 0.9s ease forwards 1.0s" }}
    />
  </svg>
);

// ── Chip ingredient ───────────────────────────────────────────────────────────
interface ChipProps {
  label: string;
  color: string;
  bg: string;
  border: string;
  delay: number;
  icon: React.ReactNode;
}

const IngredientChip = ({ label, color, bg, border, delay, icon }: ChipProps) => (
  <div
    className="flex items-center gap-2 px-4 py-2 rounded-full border-2 font-medium text-lg"
    style={{
      fontFamily: "'Caveat', cursive",
      fontSize: 20,
      background: bg,
      borderColor: border,
      color,
      opacity: 0,
      animation: `popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards ${delay}s`,
    }}
  >
    <span className="w-6 h-6 flex-shrink-0">{icon}</span>
    {label}
  </div>
);

// ── Main Hero Section ─────────────────────────────────────────────────────────
export default function PlainFuelHero() {
  const [mounted, setMounted] = useState(false);
  const scoopRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const chips = [
    { label: "25g protein", color: "#085041", bg: "#D4F1E4", border: "#1D9E75", icon: <HeartIcon />, delay: 2.2 },
    { label: "6g fiber", color: "#27500A", bg: "#EAF3DE", border: "#639922", icon: <LeafIcon />, delay: 2.4 },
    { label: "Vitamins B12 · D3 · C", color: "#633806", bg: "#FAEEDA", border: "#EF9F27", icon: <SunIcon />, delay: 2.6 },
    { label: "Calcium · Magnesium · Zinc", color: "#0C447C", bg: "#E6F1FB", border: "#85B7EB", icon: <BoneIcon />, delay: 2.8 },
    { label: "Digestive enzymes", color: "#3C3489", bg: "#EEEDFE", border: "#AFA9EC", icon: <PillIcon />, delay: 3.0 },
    { label: "Daily energy & focus", color: "#412402", bg: "#FAEEDA", border: "#BA7517", icon: <BoltIcon />, delay: 3.2 },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&family=Fraunces:ital,wght@0,400;0,700;1,400&display=swap');

        @keyframes drawPath {
          to { stroke-dashoffset: 0; }
        }
        @keyframes fadeIn {
          to { opacity: 1; }
        }
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.5) rotate(-6deg); }
          to   { opacity: 1; transform: scale(1) rotate(0deg); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes floatBob {
          0%,100% { transform: translateY(0px) rotate(-2deg); }
          50%      { transform: translateY(-14px) rotate(2deg); }
        }
        @keyframes spinSlow {
          to { transform: rotate(360deg); }
        }
        @keyframes wiggle {
          0%,100% { transform: rotate(-3deg); }
          50%      { transform: rotate(3deg); }
        }
        @keyframes pulseDash {
          0%,100% { opacity: 0.6; }
          50%      { opacity: 1; }
        }

        .float-scoop {
          animation: floatBob 5s ease-in-out 3.6s infinite;
        }
        .spin-ring {
          animation: spinSlow 10s linear infinite;
        }
        .wiggle-tag {
          animation: wiggle 3s ease-in-out infinite;
        }
        .pulse-dash {
          animation: pulseDash 2s ease-in-out infinite;
        }
      `}</style>

      <section
        className="relative w-full overflow-hidden"
        style={{
          background: "#FAFAF5",
          minHeight: "100vh",
          fontFamily: "'Caveat', cursive",
        }}
      >
        {/* Paper texture lines */}
        <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.04 }}>
          {Array.from({ length: 28 }).map((_, i) => (
            <div key={i} className="absolute w-full border-b border-black" style={{ top: i * 36 }} />
          ))}
        </div>

        {/* Background doodle texture */}
        <DoodleBg />

        {/* TOP BADGE */}
        <div className="relative flex justify-center pt-12 pb-2"
          style={{ opacity: 0, animation: "slideUp 0.5s ease forwards 0.1s" }}>
          <div
            className="wiggle-tag inline-flex items-center gap-2 px-5 py-2 rounded-full border-2 text-xl"
            style={{ background: "#EAF3DE", borderColor: "#639922", color: "#27500A", borderStyle: "dashed" }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M9 2 L10.2 6.8 L15 8 L10.2 9.2 L9 14 L7.8 9.2 L3 8 L7.8 6.8 Z" stroke="#27500A" strokeWidth="1.5" fill="#9FE1CB" strokeLinejoin="round" />
            </svg>
            daily nutrition, simplified
          </div>
        </div>

        {/* MAIN CONTENT GRID */}
        <div className="relative max-w-6xl mx-auto px-6 pt-6 pb-16 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

          {/* LEFT: Text content */}
          <div className="flex flex-col gap-6">

            {/* headline */}
            <div style={{ opacity: 0, animation: "slideUp 0.65s ease forwards 0.35s" }}>
              <h1 style={{
                fontFamily: "'Fraunces', serif",
                fontSize: "clamp(52px, 7vw, 88px)",
                fontWeight: 700,
                lineHeight: 1.05,
                color: "#1a1a1a",
                letterSpacing: "-0.02em",
              }}>
                One scoop.
                <br />
                <span className="relative inline-block" style={{ color: "#1D9E75" }}>
                  Everything
                  <WobblyUnderline color="#1D9E75" />
                </span>
                <br />
                your body
                <br />
                needs.
              </h1>
            </div>

            {/* sub */}
            <p
              className="text-2xl leading-relaxed max-w-md"
              style={{
                fontFamily: "'Caveat', cursive",
                fontSize: 26,
                color: "#555",
                opacity: 0,
                animation: "slideUp 0.55s ease forwards 0.75s",
              }}
            >
              Not just protein — a complete daily nutrition system.<br />
              One habit. No overthinking.
            </p>

            {/* hand-drawn arrow pointing to scoop on mobile */}
            <svg className="block lg:hidden w-20 h-12" viewBox="0 0 80 50" fill="none"
              style={{ opacity: 0, animation: "fadeIn 0.4s ease forwards 1.5s" }}>
              <path d="M10 10 Q40 8 65 35" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" fill="none"
                style={{ strokeDasharray: 120, strokeDashoffset: 120, animation: "drawPath 0.8s ease forwards 1.6s" }} />
              <path d="M60 28 L65 35 L56 36" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"
                style={{ strokeDasharray: 30, strokeDashoffset: 30, animation: "drawPath 0.4s ease forwards 2.2s" }} />
            </svg>

            {/* CTA */}
            <div className="flex flex-wrap items-center gap-4"
              style={{ opacity: 0, animation: "slideUp 0.5s ease forwards 1.3s" }}>
              <button
                className="relative text-white text-2xl font-bold px-8 py-4 rounded-full transition-transform hover:scale-105 active:scale-95"
                style={{
                  fontFamily: "'Caveat', cursive",
                  fontSize: 24,
                  background: "#1a1a1a",
                  border: "3px solid #1a1a1a",
                  cursor: "pointer",
                }}
              >
                {/* dashed outer ring */}
                <svg className="pulse-dash absolute inset-0 w-full h-full" style={{ overflow: "visible" }} viewBox="0 0 200 60">
                  <rect x="-4" y="-4" width="208" height="68" rx="38" fill="none" stroke="#1D9E75" strokeWidth="2.5" strokeDasharray="8 5" />
                </svg>
                Start your daily habit →
              </button>
              <span style={{ fontFamily: "'Caveat', cursive", fontSize: 20, color: "#888", textDecoration: "underline", textDecorationStyle: "wavy", textDecorationColor: "#ccc" }}>
                works with any diet
              </span>
            </div>

            {/* tiny reassurance note */}
            <div className="flex items-center gap-2"
              style={{ opacity: 0, animation: "slideUp 0.4s ease forwards 1.6s" }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M4 10 L8 14 L16 6" stroke="#1D9E75" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="10" cy="10" r="9" stroke="#1D9E75" strokeWidth="1.5" />
              </svg>
              <span style={{ fontFamily: "'Caveat', cursive", fontSize: 18, color: "#666" }}>
                Replaces your regular protein + 4 other supplements
              </span>
            </div>
          </div>

          {/* RIGHT: Scoop illustration */}
          <div className="relative flex justify-center items-center" style={{ minHeight: 420 }}>

            {/* big circle behind */}
            <div className="absolute rounded-full border-4 border-dashed"
              style={{
                width: 360, height: 360,
                borderColor: "#D3D1C7",
                top: "50%", left: "50%",
                transform: "translate(-50%, -50%)",
                opacity: 0,
                animation: "fadeIn 0.6s ease forwards 0.8s",
              }}
            />

            {/* rotating ring */}
            <svg className="spin-ring absolute" style={{ width: 400, height: 400, top: "50%", left: "50%", transform: "translate(-50%, -50%)", opacity: 0, animation: "fadeIn 0.6s ease forwards 1.2s" }}
              viewBox="0 0 400 400">
              <circle cx="200" cy="200" r="180" fill="none" stroke="#1D9E75" strokeWidth="1.5" strokeDasharray="6 10" opacity="0.4" />
            </svg>

            {/* floating scoop product image */}
            <div ref={scoopRef} className="float-scoop relative z-10" style={{ width: 360, height: 360 }}>
              <Image
                src="/images/Products/product_premium.png"
                alt="PlainFuel Premium Product"
                width={360}
                height={360}
                priority
                style={{ objectFit: "contain" }}
              />
            </div>

            {/* floating badges around the scoop */}
            {[
              { label: "25g protein", x: -20, y: 30, rotate: -8, bg: "#D4F1E4", border: "#1D9E75", color: "#085041", delay: "2.4s" },
              { label: "Vitamin D3", x: "calc(100% - 120px)", y: 20, rotate: 6, bg: "#FAEEDA", border: "#EF9F27", color: "#633806", delay: "2.7s" },
              { label: "No tracking", x: -30, y: "calc(100% - 80px)", rotate: 5, bg: "#EEEDFE", border: "#AFA9EC", color: "#3C3489", delay: "3.0s" },
              { label: "6g fiber", x: "calc(100% - 100px)", y: "calc(100% - 70px)", rotate: -6, bg: "#EAF3DE", border: "#97C459", color: "#27500A", delay: "3.2s" },
            ].map((b, i) => (
              <div
                key={i}
                className="absolute rounded-xl border-2 px-3 py-1 text-lg font-bold"
                style={{
                  fontFamily: "'Caveat', cursive",
                  fontSize: 18,
                  left: b.x,
                  top: b.y,
                  background: b.bg,
                  borderColor: b.border,
                  color: b.color,
                  transform: `rotate(${b.rotate}deg)`,
                  opacity: 0,
                  animation: `popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards ${b.delay}`,
                  zIndex: 20,
                  whiteSpace: "nowrap",
                }}
              >
                {b.label}
              </div>
            ))}

            {/* hand-drawn arrow from label to jar (desktop) */}
            <svg className="absolute hidden lg:block" style={{ top: 60, left: -60, width: 80, height: 60, opacity: 0, animation: "fadeIn 0.5s ease forwards 3.4s" }} viewBox="0 0 80 60" fill="none">
              <path d="M10 10 Q45 5 70 40" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round"
                style={{ strokeDasharray: 100, strokeDashoffset: 100, animation: "drawPath 0.7s ease forwards 3.4s" }} />
              <path d="M66 34 L70 40 L62 40" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"
                style={{ strokeDasharray: 25, strokeDashoffset: 25, animation: "drawPath 0.3s ease forwards 4.0s" }} />
            </svg>
          </div>
        </div>

        {/* INGREDIENT CHIPS STRIP */}
        <div className="relative max-w-6xl mx-auto px-6 pb-16">
          <p
            className="text-center mb-5"
            style={{ fontFamily: "'Caveat', cursive", fontSize: 22, color: "#888", opacity: 0, animation: "slideUp 0.4s ease forwards 2.0s" }}
          >
            — everything inside one scoop —
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {chips.map((chip, i) => (
              <IngredientChip key={i} {...chip} />
            ))}
          </div>
        </div>

        {/* SCROLL NUDGE */}
        <div className="flex flex-col items-center pb-10 gap-2"
          style={{ opacity: 0, animation: "slideUp 0.4s ease forwards 3.5s" }}>
          <span style={{ fontFamily: "'Caveat', cursive", fontSize: 18, color: "#aaa" }}>scroll to see why</span>
          <svg width="24" height="36" viewBox="0 0 24 36" fill="none">
            <rect x="2" y="2" width="20" height="32" rx="10" stroke="#ccc" strokeWidth="2" />
            <circle cx="12" cy="10" r="3" fill="#1D9E75" style={{ animation: "floatBob 1.5s ease-in-out infinite" }} />
          </svg>
        </div>

        {/* BOTTOM TORN PAPER EDGE */}
        <svg className="w-full block" style={{ marginTop: -2, display: "block" }} viewBox="0 0 1200 40" preserveAspectRatio="none">
          <path d="M0 0 Q60 30 120 10 Q180 0 240 25 Q300 40 360 15 Q420 0 480 28 Q540 40 600 12 Q660 0 720 22 Q780 40 840 8 Q900 0 960 30 Q1020 40 1080 12 Q1140 0 1200 20 L1200 40 L0 40 Z"
            fill="#F0EFE8" />
        </svg>
      </section>
    </>
  );
}