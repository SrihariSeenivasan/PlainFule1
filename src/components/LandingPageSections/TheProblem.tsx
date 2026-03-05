"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const carouselImages = [
  {
    src: "/images/DoodleImages/hero1.png",
    alt: "Healthy nutrition concept",
  },
  {
    src: "/images/DoodleImages/hero2.png",
    alt: "Vitamin and minerals",
  },
  {
    src: "/images/DoodleImages/hero3.png",
    alt: "Daily health routine",
  },
  {
    src: "/images/DoodleImages/hero4.png",
    alt: "Wellness and vitality",
  },
  {
    src: "/images/DoodleImages/hero5.png",
    alt: "Complete nutrition solution",
  },
];

const cards = [
  {
    icon: "🧠",
    title: "B-Vitamins Missing",
    body: "B6, B9, B12 — crucial for energy, brain function and hormone balance. Most people run low daily.",
    color: "#15803d",
  },
  {
    icon: "🦴",
    title: "Calcium + Magnesium Gap",
    body: "Bone strength, better sleep, stress control. Daily diet rarely provides optimal magnesium.",
    color: "#15803d",
  },
  {
    icon: "🛡️",
    title: "Low Zinc & Selenium",
    body: "Immunity, skin repair, thyroid support. Soil depletion means your food is depleted too.",
    color: "#15803d",
  },
  {
    icon: "🍊",
    title: "Vitamin C Lost in Cooking",
    body: "50mg daily — but heat destroys Vitamin C in regular meals before it ever reaches you.",
    color: "#15803d",
  },
];

export default function ProblemSection() {
  const [activeSlide, setActiveSlide] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startAutoplay = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % carouselImages.length);
    }, 3000);
  };

  useEffect(() => {
    startAutoplay();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <section
      className="problem-section"
      style={{
        background: "#f5f5ee",
        padding: "48px 24px",
        fontFamily: "'DM Sans', sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Permanent+Marker&family=Kalam:wght@400;700&family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');

        .problem-section::before {
          content: '';
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(21,128,61,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(21,128,61,0.05) 1px, transparent 1px);
          background-size: 40px 40px;
          pointer-events: none; z-index: 0;
        }
        .problem-section > * { position: relative; z-index: 1; }

        /* ── Image carousel ── */
        .image-carousel {
          position: relative;
          width: 75%;
          aspect-ratio: 4/3;
          border-radius: 12px;
          overflow: hidden;
          border: 4px solid #1a1a1a;
          box-shadow: 8px 8px 0 #1a1a1a;
          background: #1a1a1a;
        }

        .carousel-slide {
          position: absolute;
          inset: 0;
          opacity: 0;
          transition: opacity 0.8s ease-in-out;
          will-change: opacity;
        }

        .carousel-slide.active {
          opacity: 1;
        }

        .carousel-slide img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        /* subtle overlay gradient at bottom */
        .carousel-slide::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 40%;
          background: linear-gradient(to top, rgba(0,0,0,0.35), transparent);
          pointer-events: none;
        }

        /* progress bar strip at the top */
        .carousel-progress {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 4px;
          background: rgba(255,255,255,0.2);
          z-index: 2;
          display: flex;
          gap: 3px;
        }

        .carousel-progress-segment {
          flex: 1;
          background: rgba(255,255,255,0.25);
          border-radius: 2px;
          overflow: hidden;
          position: relative;
        }

        .carousel-progress-segment .fill {
          height: 100%;
          background: #fff;
          width: 0%;
          border-radius: 2px;
        }

        .carousel-progress-segment.done .fill {
          width: 100%;
        }

        .carousel-progress-segment.active .fill {
          animation: segmentFill 3s linear forwards;
        }

        @keyframes segmentFill {
          from { width: 0% }
          to   { width: 100% }
        }

        /* existing card styles */
        .card-item {
          background: #fffef0 !important;
          border: 3.5px solid #15803d !important;
          border-radius: 8px !important;
          box-shadow: 5px 5px 0 #15803d !important;
          transform: rotate(-0.5deg) !important;
          position: relative; overflow: hidden;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .card-item:hover {
          transform: rotate(-0.5deg) translateY(-3px) !important;
          box-shadow: 7px 7px 0 #15803d !important;
        }
        .card-item::before {
          content: '';
          position: absolute; left: 0; right: 0; top: 0; bottom: 0;
          background-image: repeating-linear-gradient(
            to bottom,
            transparent 0px, transparent 27px,
            rgba(21,128,61,0.1) 28px, rgba(21,128,61,0.1) 29px
          );
          pointer-events: none; z-index: 0;
        }
        .card-item::after {
          content: '';
          position: absolute; left: 28px; top: 0; bottom: 0; width: 2px;
          background: rgba(21,128,61,0.3);
          pointer-events: none; z-index: 0;
        }
        .card-content { position: relative; z-index: 1; padding: 20px 20px 20px 36px; }
        .card-icon { font-size: 32px; margin-bottom: 14px; display: block; }
        .card-title {
          font-family: 'Playfair Display', serif;
          font-size: 18px; font-weight: 700; color: #15803d;
          margin: 0 0 10px 0; line-height: 1.2;
        }
        .card-body {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; color: #15803d; line-height: 1.6; margin: 0; font-weight: 400;
        }

        .underline-sketch { position: relative; display: inline-block; }
        .underline-sketch::after {
          content: '';
          position: absolute; left: -2px; right: -2px; bottom: -4px;
          height: 4px; background: #e11d48; border-radius: 2px; opacity: 0.8;
        }
        .fade-in { animation: fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) both; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%" }}>
        {/* Top row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 64,
            alignItems: "start",
            marginBottom: 56,
          }}
          className="fade-in"
        >
          {/* Left: Heading */}
          <div style={{ maxWidth: 480 }}>
            <span style={{
              display: "block", fontSize: 11, fontWeight: 600,
              letterSpacing: "0.15em", textTransform: "uppercase",
              color: "#e11d48", marginBottom: 14, fontFamily: "'DM Sans', sans-serif",
            }}>
              The Problem
            </span>
            <h2 style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "clamp(1.9rem, 3.5vw, 3rem)",
              fontWeight: 400, lineHeight: 1.15,
              letterSpacing: "-0.02em", color: "#111827",
              margin: "0 0 18px 0",
            }}>
              Why Are We Still{" "}
              <span className="underline-sketch" style={{ color: "#111827" }}>Tired</span>
              <br />
              <em style={{ color: "#6b7280" }}>Despite Eating Every Day?</em>
            </h2>
            <p style={{ fontSize: 15, color: "#9ca3af", lineHeight: 1.75, maxWidth: 400, margin: 0 }}>
              Modern meals fill the stomach. They don&apos;t always nourish the body.
              Something vital is missing every single day.
            </p>
          </div>

          {/* Right: Image Carousel */}
          <div className="image-carousel">
            {/* Segmented progress bar */}
            <div className="carousel-progress">
              {carouselImages.map((_, i) => (
                <div
                  key={i}
                  className={`carousel-progress-segment${
                    i === activeSlide ? " active" : i < activeSlide ? " done" : ""
                  }`}
                >
                  <div className="fill" />
                </div>
              ))}
            </div>

            {/* Slides */}
            {carouselImages.map((img, i) => (
              <div
                key={i}
                className={`carousel-slide${i === activeSlide ? " active" : ""}`}
              >
                <Image 
                  src={img.src} 
                  alt={img.alt} 
                  fill
                  sizes="(max-width: 768px) 100vw, 75vw"
                  style={{ objectFit: "cover" }}
                  priority={i === 0}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Bottom: 4-column cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
          {cards.map((card, i) => (
            <div key={i} className="card-item">
              <div className="card-content">
                <div className="card-icon">{card.icon}</div>
                <div className="card-title">{card.title}</div>
                <p className="card-body">{card.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}