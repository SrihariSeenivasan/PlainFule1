"use client";

import { useState, useRef } from "react";
import Image from "next/image";

/* ─── Animated Star ──────────────────────────────────────────────────── */
const Star = ({ delay }: { delay: number }) => (
  <svg
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    style={{
      width: "18px",
      height: "18px",
      fill: "#22c55e",
      filter: "drop-shadow(0 0 5px rgba(34,197,94,0.6))",
      animation: `starBob 2.4s ease-in-out ${delay}s infinite`,
      flexShrink: 0,
    }}
  >
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

/* ─── Stat Pill ──────────────────────────────────────────────────────── */
const StatPill = ({
  label,
  value,
  delay,
}: {
  label: string;
  value: string;
  delay: string;
}) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "10px 20px",
      borderRadius: "14px",
      background: "rgba(34,197,94,0.08)",
      border: "1px solid rgba(34,197,94,0.2)",
      backdropFilter: "blur(8px)",
      animation: `fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) ${delay} both`,
    }}
  >
    <span
      style={{
        fontSize: "22px",
        fontWeight: 900,
        color: "#22c55e",
        fontFamily: "'Syne', sans-serif",
        lineHeight: 1,
      }}
    >
      {value}
    </span>
    <span
      style={{
        fontSize: "11px",
        color: "rgba(0,0,0,0.45)",
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        marginTop: "3px",
      }}
    >
      {label}
    </span>
  </div>
);

/* ─── Main Component ─────────────────────────────────────────────────── */
export default function InsiderBundleSection() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [btnHover, setBtnHover] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMouse({
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 22,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * 12,
    });
  };

  return (
    <>
      {/* ── Global Keyframes ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=Manrope:wght@400;500;600&display=swap');

        @keyframes starBob {
          0%,100% { transform: translateY(0) scale(1); }
          50%      { transform: translateY(-3px) scale(1.18); }
        }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(20px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes fadeLeft {
          from { opacity:0; transform:translateX(-30px); }
          to   { opacity:1; transform:translateX(0); }
        }
        @keyframes fadeRight {
          from { opacity:0; transform:translateX(30px); }
          to   { opacity:1; transform:translateX(0); }
        }
        @keyframes rotateSlow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes pulseGlow {
          0%,100% { opacity:0.35; transform:scale(1); }
          50%      { opacity:0.65; transform:scale(1.06); }
        }
        @keyframes shimmerMove {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes floatChip {
          0%,100% { transform:translateY(0px) rotate(-2deg); }
          50%      { transform:translateY(-8px) rotate(2deg); }
        }
        @keyframes floatChip2 {
          0%,100% { transform:translateY(0px) rotate(3deg); }
          50%      { transform:translateY(-10px) rotate(-2deg); }
        }
        @keyframes dotPulse {
          0%,100% { opacity:0.2; transform:scale(0.8); }
          50%      { opacity:1;   transform:scale(1.4); }
        }
        @keyframes ringExpand {
          0%   { transform:translate(-50%,-50%) scale(0.85); opacity:0.5; }
          100% { transform:translate(-50%,-50%) scale(1.25); opacity:0; }
        }

        .insider-btn {
          position:relative; overflow:hidden; cursor:pointer;
          font-family:'Syne',sans-serif;
        }
        .insider-btn::after {
          content:'';
          position:absolute; inset:0;
          background: linear-gradient(105deg,transparent 35%,rgba(34,197,94,0.15) 50%,transparent 65%);
          background-size:200% 100%;
          opacity:0;
          transition:opacity 0.3s;
        }
        .insider-btn:hover::after {
          opacity:1;
          animation: shimmerMove 0.7s linear;
        }
      `}</style>

      <section
        ref={sectionRef}
        onMouseMove={handleMouseMove}
        style={{
          position: "relative",
          width: "100%",
          background: "#F5F5F5",
          overflow: "hidden",
          fontFamily: "'Manrope', sans-serif",
        }}
      >
        {/* ── Background noise grain ── */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.02'/%3E%3C/svg%3E")`,
            backgroundSize: "200px 200px",
            opacity: 0.6,
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        {/* ── Radial green spotlights ── */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            right: "-5%",
            width: "680px",
            height: "680px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(34,197,94,0.08) 0%, transparent 68%)",
            transform: "translateY(-50%)",
            pointerEvents: "none",
            animation: "pulseGlow 5s ease-in-out infinite",
            zIndex: 0,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-20%",
            left: "-10%",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(34,197,94,0.05) 0%, transparent 65%)",
            pointerEvents: "none",
            animation: "pulseGlow 7s ease-in-out 1.5s infinite",
            zIndex: 0,
          }}
        />

        {/* ── Rotating rings ── */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            right: "2%",
            width: "520px",
            height: "520px",
            borderRadius: "50%",
            border: "1px dashed rgba(34,197,94,0.08)",
            animation: "rotateSlow 30s linear infinite",
            pointerEvents: "none",
            zIndex: 0,
            transform: "translateY(-50%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "50%",
            right: "8%",
            width: "360px",
            height: "360px",
            borderRadius: "50%",
            border: "1px solid rgba(34,197,94,0.05)",
            animation: "rotateSlow 20s linear infinite reverse",
            pointerEvents: "none",
            zIndex: 0,
            transform: "translateY(-50%)",
          }}
        />

        {/* ── Scanlines ── */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, transparent 49%, rgba(34,197,94,0.012) 50%, transparent 51%)",
            backgroundSize: "100% 6px",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        {/* ═════════════ CONTENT GRID ═════════════ */}
        <div
          style={{
            position: "relative",
            zIndex: 10,
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "clamp(40px, 6vw, 80px) clamp(20px, 5vw, 80px)",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "40px",
            alignItems: "center",
          }}
        >
          {/* ──────── LEFT ──────── */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "24px",
              animation: "fadeLeft 0.8s cubic-bezier(0.22,1,0.36,1) both",
            }}
          >
            {/* Badge + Stars */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "7px",
                  background: "rgba(34,197,94,0.12)",
                  border: "1px solid rgba(34,197,94,0.25)",
                  borderRadius: "999px",
                  padding: "5px 14px",
                }}
              >
                <span
                  style={{
                    width: "7px",
                    height: "7px",
                    borderRadius: "50%",
                    background: "#22c55e",
                    boxShadow: "0 0 8px rgba(34,197,94,0.6)",
                    animation: "dotPulse 1.8s ease-in-out infinite",
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: 700,
                    color: "#22c55e",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    fontFamily: "'Syne', sans-serif",
                  }}
                >
                  Best Value
                </span>
              </div>

              <div style={{ display: "flex", gap: "3px", alignItems: "center" }}>
                {[0, 0.15, 0.3, 0.45, 0.6].map((d, i) => (
                  <Star key={i} delay={d} />
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <h1
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: "clamp(52px, 7.5vw, 90px)",
                  fontWeight: 900,
                  lineHeight: 0.9,
                  margin: 0,
                  color: "#000",
                  letterSpacing: "-0.03em",
                }}
              >
                INSIDER
              </h1>
              <h1
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: "clamp(52px, 7.5vw, 90px)",
                  fontWeight: 900,
                  lineHeight: 0.9,
                  margin: 0,
                  letterSpacing: "-0.03em",
                  background: "linear-gradient(90deg, #22c55e 0%, #16a34a 55%, #22c55e 100%)",
                  backgroundSize: "200% auto",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  animation: "shimmerMove 4s linear infinite",
                }}
              >
                Bundle
              </h1>
            </div>

            {/* Accent line */}
            <div
              style={{
                width: "56px",
                height: "3px",
                borderRadius: "99px",
                background: "linear-gradient(90deg, #22c55e, transparent)",
              }}
            />

            {/* Description */}
            <p
              style={{
                fontSize: "clamp(14px, 1.4vw, 17px)",
                color: "rgba(0,0,0,0.55)",
                lineHeight: 1.75,
                maxWidth: "380px",
                margin: 0,
              }}
            >
              Get your favorite flavors and unlock the best value with the INSIDER
              Bundle.{" "}
              <span style={{ color: "rgba(0,0,0,0.75)", fontWeight: 600 }}>
                It&apos;s the surest way to Stay Salty.
              </span>
            </p>

            {/* Stats */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              <StatPill label="Flavors" value="6+" delay="0.3s" />
              <StatPill label="Reviews" value="2.4k" delay="0.42s" />
              <StatPill label="You Save" value="30%" delay="0.54s" />
            </div>

            {/* CTA */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                flexWrap: "wrap",
                animation: "fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) 0.55s both",
              }}
            >
              <button
                className="insider-btn"
                onMouseEnter={() => setBtnHover(true)}
                onMouseLeave={() => setBtnHover(false)}
                style={{
                  padding: "14px 32px",
                  borderRadius: "999px",
                  border: "none",
                  background: btnHover
                    ? "linear-gradient(135deg, #16a34a, #22c55e)"
                    : "linear-gradient(135deg, #22c55e, #16a34a)",
                  color: "#051a0b",
                  fontSize: "15px",
                  fontWeight: 800,
                  letterSpacing: "0.02em",
                  transition: "all 0.3s cubic-bezier(0.22,1,0.36,1)",
                  transform: btnHover ? "scale(1.06) translateY(-2px)" : "scale(1)",
                  boxShadow: btnHover
                    ? "0 0 0 4px rgba(34,197,94,0.15), 0 16px 40px rgba(34,197,94,0.3)"
                    : "0 4px 20px rgba(34,197,94,0.2)",
                }}
              >
                Get Yours →
              </button>
              <span style={{ fontSize: "13px", color: "rgba(0,0,0,0.4)", fontWeight: 500 }}>
                Free shipping · No commitment
              </span>
            </div>
          </div>

          {/* ──────── RIGHT: Image ──────── */}
          <div
            style={{
              position: "relative",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              animation: "fadeRight 0.9s cubic-bezier(0.22,1,0.36,1) 0.1s both",
            }}
          >
            {/* Ping rings */}
            <>
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  width: "340px",
                  height: "340px",
                  borderRadius: "50%",
                  border: "1px solid rgba(34,197,94,0.12)",
                  animation: "ringExpand 3s ease-out infinite",
                  pointerEvents: "none",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  width: "340px",
                  height: "340px",
                  borderRadius: "50%",
                  border: "1px solid rgba(34,197,94,0.08)",
                  animation: "ringExpand 3s ease-out 1.1s infinite",
                  pointerEvents: "none",
                }}
              />
            </>

            {/* Glow blob */}
            <div
              style={{
                position: "absolute",
                width: "65%",
                height: "65%",
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(34,197,94,0.15) 0%, transparent 70%)",
                filter: "blur(30px)",
                animation: "pulseGlow 4s ease-in-out infinite",
                pointerEvents: "none",
              }}
            />

            {/* 3D tilt container */}
            <div
              style={{
                position: "relative",
                width: "100%",
                maxWidth: "480px",
                transition: "transform 0.12s ease-out",
                transform: `perspective(1000px) rotateY(${-5 + mouse.x * 0.28}deg) rotateX(${2 + mouse.y * -0.2}deg)`,
              }}
            >
              {/* Image card */}
              <div
                style={{
                  borderRadius: "24px",
                  overflow: "hidden",
                  border: "1px solid rgba(34,197,94,0.15)",
                  boxShadow:
                    "0 0 0 1px rgba(34,197,94,0.08), 0 32px 64px rgba(0,0,0,0.1), 0 8px 24px rgba(0,0,0,0.05)",
                  background: "#FFFFFF",
                  position: "relative",
                }}
              >
                <Image
                  src="/images/insidebundle.png"
                  alt="PlainFuel INSIDER Bundle"
                  width={600}
                  height={600}
                  priority
                  style={{ display: "block", width: "100%", height: "auto", objectFit: "cover" }}
                />
                {/* Shimmer sweep */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(135deg, transparent 30%, rgba(34,197,94,0.06) 50%, transparent 70%)",
                    backgroundSize: "200% 100%",
                    animation: "shimmerMove 6s linear infinite",
                    borderRadius: "24px",
                    pointerEvents: "none",
                  }}
                />
              </div>

              {/* Floating chip: top-right */}
              <div
                style={{
                  position: "absolute",
                  top: "-16px",
                  right: "-16px",
                  background: "#22c55e",
                  color: "#051a0b",
                  borderRadius: "16px",
                  padding: "10px 16px",
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 900,
                  fontSize: "13px",
                  boxShadow: "0 8px 24px rgba(34,197,94,0.4)",
                  animation: "floatChip 3.2s ease-in-out infinite",
                  zIndex: 20,
                  whiteSpace: "nowrap",
                }}
              >
                SAVE 30%
              </div>

              {/* Floating chip: bottom-left */}
              <div
                style={{
                  position: "absolute",
                  bottom: "-16px",
                  left: "-16px",
                  background: "rgba(34,197,94,0.1)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(34,197,94,0.15)",
                  color: "#000",
                  borderRadius: "16px",
                  padding: "10px 16px",
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 700,
                  fontSize: "13px",
                  animation: "floatChip2 3.8s ease-in-out infinite",
                  zIndex: 20,
                  display: "flex",
                  flexDirection: "column",
                  gap: "2px",
                  whiteSpace: "nowrap",
                }}
              >
                <span
                  style={{
                    color: "#22c55e",
                    fontSize: "11px",
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  🔥 Trending
                </span>
                <span style={{ fontSize: "12px", color: "rgba(0,0,0,0.55)" }}>
                  847 sold this week
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}