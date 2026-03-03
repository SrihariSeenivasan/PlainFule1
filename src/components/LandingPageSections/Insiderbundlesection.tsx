"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { WiggleLine, Sparkle, CircleDoodle as DoodleCircle } from "@/components/Elements/SvgDoodles";

/* ── Local SVG Helper ── */
function DoodleStar({ color = "#15803d", className = "" }: { color?: string; className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
            <path d="M12 3 L13.5 8.5 L19 8.5 L14.8 11.8 L16.2 17.5 L12 14.2 L7.8 17.5 L9.2 11.8 L5 8.5 L10.5 8.5 Z"
                stroke={color} strokeWidth="1.5" strokeLinejoin="round" fill={color} />
        </svg>
    );
}

function DoodleArrow({ color = "#15803d", className = "" }: { color?: string; className?: string }) {
    return (
        <svg viewBox="0 0 40 24" fill="none" className={className} aria-hidden="true">
            <path d="M2 12 C12 4,26 4,36 11" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" />
            <path d="M28 5 L37 12 L28 18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
    );
}

/* Caveat wrapper */
function H({ children, className = "", style = {} }: {
    children: React.ReactNode; className?: string; style?: React.CSSProperties;
}) {
    return (
        <span style={{ fontFamily: "'Caveat', cursive", ...style }} className={className}>
            {children}
        </span>
    );
}

function StickyNote({ text, rotate = "rotate-2", bg = "#fef08a", textColor = "#713f12" }: {
    text: string; rotate?: string; bg?: string; textColor?: string;
}) {
    return (
        <span
            style={{ fontFamily: "'Caveat', cursive", background: bg, color: textColor }}
            className={`inline-block text-xs font-bold px-3 py-1 rounded shadow-md ${rotate} select-none whitespace-nowrap border border-yellow-300/40`}
        >
            {text}
        </span>
    );
}

/* Stat pill — doodle style */
function StatPill({ label, value, accent }: { label: string; value: string; accent: string }) {
    return (
        <div
            className="flex flex-col items-center px-5 py-3 rounded-2xl border border-dashed transition-all hover:-translate-y-1"
            style={{ background: `${accent}10`, borderColor: `${accent}40` }}
        >
            <H className="text-2xl font-bold leading-none" style={{ color: accent }}>{value}</H>
            <H className="text-[10px] font-bold mt-0.5 uppercase tracking-wider" style={{ color: "#777" }}>{label}</H>
        </div>
    );
}

/* Animated doodle star (for rating row) */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function StarIcon({ delay }: { delay: number }) {
    return (
        <DoodleStar
            color="#15803d"
            className="w-5 h-5"
            // inline animation via style trick
        />
    );
}

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
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&display=swap');

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
                    from { transform: translateY(-50%) rotate(0deg); }
                    to   { transform: translateY(-50%) rotate(360deg); }
                }
                @keyframes rotateSlow2 {
                    from { transform: translateY(-50%) rotate(0deg); }
                    to   { transform: translateY(-50%) rotate(-360deg); }
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
                    0%,100% { opacity:0.3; transform:scale(0.8); }
                    50%      { opacity:1; transform:scale(1.4); }
                }
                @keyframes ringExpand {
                    0%   { transform:translate(-50%,-50%) scale(0.85); opacity:0.5; }
                    100% { transform:translate(-50%,-50%) scale(1.35); opacity:0; }
                }
                @keyframes wiggleDraw {
                    0%   { stroke-dashoffset: 400; }
                    100% { stroke-dashoffset: 0; }
                }
                @keyframes stickyBob {
                    0%,100% { transform: rotate(-2deg) translateY(0); }
                    50%      { transform: rotate(2deg) translateY(-4px); }
                }
                @keyframes stickyBob2 {
                    0%,100% { transform: rotate(3deg) translateY(0); }
                    50%      { transform: rotate(-1deg) translateY(-6px); }
                }

                .insider-btn { position:relative; overflow:hidden; cursor:pointer; }
                .insider-btn::after {
                    content:'';
                    position:absolute; inset:0;
                    background: linear-gradient(105deg,transparent 35%,rgba(21,128,61,0.15) 50%,transparent 65%);
                    background-size:200% 100%;
                    opacity:0; transition:opacity 0.3s;
                }
                .insider-btn:hover::after { opacity:1; animation: shimmerMove 0.7s linear; }

                .doodle-underline {
                    stroke-dasharray: 400;
                    stroke-dashoffset: 400;
                    animation: wiggleDraw 1.2s cubic-bezier(0.22,1,0.36,1) 0.4s forwards;
                }
            `}</style>

            <section
                ref={sectionRef}
                onMouseMove={handleMouseMove}
                className="relative w-full overflow-hidden bg-[var(--background)]"
            >
                {/* dot grid texture */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.03] z-0" aria-hidden="true">
                    <defs>
                        <pattern id="dotgrid2" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
                            <circle cx="2" cy="2" r="1.5" fill="#15803d" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#dotgrid2)" />
                </svg>

                {/* radial glow blobs */}
                <div className="absolute pointer-events-none z-0" style={{
                    top: '50%', right: '-5%', width: '600px', height: '600px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(21,128,61,0.07) 0%, transparent 68%)',
                    transform: 'translateY(-50%)',
                    animation: 'pulseGlow 5s ease-in-out infinite',
                }} />
                <div className="absolute pointer-events-none z-0" style={{
                    bottom: '-20%', left: '-10%', width: '450px', height: '450px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(21,128,61,0.05) 0%, transparent 65%)',
                    animation: 'pulseGlow 7s ease-in-out 1.5s infinite',
                }} />

                {/* rotating doodle rings */}
                <div className="absolute pointer-events-none z-0" style={{
                    top: '50%', right: '2%', width: '480px', height: '480px',
                    borderRadius: '50%', border: '1.5px dashed rgba(21,128,61,0.1)',
                    animation: 'rotateSlow 30s linear infinite',
                }} />
                <div className="absolute pointer-events-none z-0" style={{
                    top: '50%', right: '8%', width: '320px', height: '320px',
                    borderRadius: '50%', border: '1px dashed rgba(21,128,61,0.07)',
                    animation: 'rotateSlow2 20s linear infinite',
                }} />

                {/* ambient sparkles */}
                <Sparkle color="#15803d" className="absolute top-10 left-[3%] w-6 h-6 opacity-20 rotate-12 pointer-events-none z-0" />
                <DoodleCircle color="#f59e0b" className="absolute bottom-10 left-[8%] w-8 h-8 opacity-15 pointer-events-none z-0" />
                <Sparkle color="#8b5cf6" className="absolute top-1/3 left-[1%] w-4 h-4 opacity-10 pointer-events-none z-0" />
                <Sparkle color="#ec4899" className="absolute bottom-1/4 right-[5%] w-5 h-5 opacity-10 pointer-events-none z-0" />

                {/* ═══ CONTENT ═══ */}
                <div
                    className="relative z-10 max-w-screen-xl mx-auto px-6 md:px-12 lg:px-16"
                    style={{
                        padding: 'clamp(48px,6vw,88px) clamp(24px,5vw,80px)',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '48px',
                        alignItems: 'center',
                    }}
                >

                    {/* ── LEFT ── */}
                    <div className="flex flex-col gap-6" style={{ animation: 'fadeLeft 0.8s cubic-bezier(0.22,1,0.36,1) both' }}>

                        {/* badge row */}
                        <div className="flex items-center gap-3 flex-wrap">
                            {/* doodle pill badge */}
                            <div className="relative inline-flex items-center gap-2 px-4 py-1.5">
                                <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 120 36" fill="none" aria-hidden="true">
                                    <path d="M4 8 C25 2,90 2,116 7 S120 14,118 26 S114 34,90 35 S22 36,4 32 S0 25,1 18 S2 12,4 8Z"
                                        stroke="rgba(21,128,61,0.5)" strokeWidth="1.5" fill="rgba(21,128,61,0.08)" strokeLinecap="round" />
                                </svg>
                                <span style={{
                                    width: 7, height: 7, borderRadius: '50%',
                                    background: '#15803d',
                                    boxShadow: '0 0 8px rgba(21,128,61,0.6)',
                                    animation: 'dotPulse 1.8s ease-in-out infinite',
                                    flexShrink: 0, display: 'inline-block',
                                }} />
                                <H className="text-xs font-bold uppercase tracking-widest relative z-10" style={{ color: '#15803d' }}>
                                    Best Value
                                </H>
                            </div>

                            {/* doodle stars */}
                            <div className="flex items-center gap-0.5">
                                {[0, 0.15, 0.3, 0.45, 0.6].map((d, i) => (
                                    <div key={i} style={{ animation: `starBob 2.4s ease-in-out ${d}s infinite` }}>
                                        <StarIcon delay={d} />
                                    </div>
                                ))}
                                <H className="text-xs font-bold ml-2" style={{ color: '#888' }}>4.9 · 2.4k reviews</H>
                            </div>
                        </div>

                        {/* TITLE — Caveat, huge */}
                        <div>
                            <H
                                className="block font-bold leading-none"
                                style={{ fontSize: 'clamp(56px, 8vw, 96px)', color: '#1a1a1a', lineHeight: 0.92 }}
                            >
                                INSIDER
                            </H>
                            <div className="relative inline-block">
                                <H
                                    className="block font-bold"
                                    style={{
                                        fontSize: 'clamp(56px, 8vw, 96px)',
                                        lineHeight: 0.92,
                                        background: 'linear-gradient(90deg, #15803d 0%, #15803d 55%, #15803d 100%)',
                                        backgroundSize: '200% auto',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        backgroundClip: 'text',
                                        animation: 'shimmerMove 4s linear infinite',
                                        fontStyle: 'italic',
                                    }}
                                >
                                    Bundle.
                                </H>
                                {/* hand-drawn underline on Bundle */}
                                <svg viewBox="0 0 260 14" fill="none" className="absolute -bottom-2 left-0 w-full" aria-hidden="true">
                                    <path
                                        className="doodle-underline"
                                        d="M3 8 C50 2,150 12,220 7 S250 3,257 8"
                                        stroke="#15803d" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.5"
                                    />
                                </svg>
                            </div>
                        </div>

                        {/* wiggle accent line */}
                        <WiggleLine color="#15803d" className="w-24 h-3 opacity-60" />

                        {/* description — Caveat */}
                        <div className="max-w-sm">
                            <H className="text-xl leading-snug" style={{ color: '#555' }}>
                                Get your favorite flavors and unlock the best value with the INSIDER Bundle.{' '}
                            </H>
                            <H className="text-xl font-bold" style={{ color: '#1a1a1a' }}>
                                It&apos;s the surest way to Stay Salty.
                            </H>
                        </div>

                        {/* stats — doodle style */}
                        <div className="flex flex-wrap gap-3">
                            <StatPill label="Flavors" value="6+" accent="#15803d" />
                            <StatPill label="Reviews" value="2.4k" accent="#f59e0b" />
                            <StatPill label="You Save" value="30%" accent="#ec4899" />
                        </div>

                        {/* perks list */}
                        <div className="flex flex-col gap-2">
                            {[
                                { text: 'Free shipping on all orders', accent: '#15803d' },
                                { text: 'No commitment, cancel anytime', accent: '#f59e0b' },
                                { text: '0 fillers, 100% active ingredients', accent: '#8b5cf6' },
                            ].map((p, i) => (
                                <div key={i} className="flex items-center gap-2.5">
                                    <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4 shrink-0" aria-hidden="true">
                                        <path d="M3 11 L8 16 L17 5" stroke={p.accent} strokeWidth="2.5"
                                            strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                    </svg>
                                    <H className="text-sm" style={{ color: '#555' }}>{p.text}</H>
                                </div>
                            ))}
                        </div>

                        {/* CTA row */}
                        <div className="flex items-center gap-4 flex-wrap" style={{ animation: 'fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) 0.55s both' }}>
                            {/* wobbly button */}
                            <button
                                className="insider-btn relative inline-flex items-center gap-2 px-10 py-4 transition-transform"
                                onMouseEnter={() => setBtnHover(true)}
                                onMouseLeave={() => setBtnHover(false)}
                                style={{ transform: btnHover ? 'scale(1.06) translateY(-2px)' : 'scale(1)' }}
                            >
                                <svg className="absolute inset-0 w-full h-full pointer-events-none"
                                    preserveAspectRatio="none" viewBox="0 0 200 54" fill="none" aria-hidden="true">
                                    <path
                                        d="M6 10 C52 2,148 2,194 9 S200 20,198 40 S192 52,155 53 S44 54,8 51 S1 43,2 27 S4 15,6 10Z"
                                        fill={btnHover ? '#15803d' : '#15803d'}
                                        style={{ transition: 'fill 0.3s' }}
                                    />
                                </svg>
                                <H className="relative z-10 text-xl font-bold" style={{ color: '#051a0b' }}>
                                    Get Yours →
                                </H>
                            </button>

                            {/* sticky note annotation */}
                            <div className="flex items-center gap-2">
                                <StickyNote text="30% off inside! 🎉" rotate="-rotate-1" />
                                <DoodleArrow color="#f59e0b" className="w-8 h-5" />
                            </div>
                        </div>
                    </div>

                    {/* ── RIGHT: image with doodle frame ── */}
                    <div
                        className="relative flex justify-center items-center"
                        style={{ animation: 'fadeRight 0.9s cubic-bezier(0.22,1,0.36,1) 0.1s both' }}
                    >
                        {/* ping rings */}
                        <div className="absolute pointer-events-none" style={{
                            top: '50%', left: '50%', width: '340px', height: '340px',
                            borderRadius: '50%', border: '1px dashed rgba(21,128,61,0.15)',
                            animation: 'ringExpand 3s ease-out infinite',
                        }} />
                        <div className="absolute pointer-events-none" style={{
                            top: '50%', left: '50%', width: '340px', height: '340px',
                            borderRadius: '50%', border: '1px dashed rgba(21,128,61,0.1)',
                            animation: 'ringExpand 3s ease-out 1.1s infinite',
                        }} />

                        {/* glow blob */}
                        <div className="absolute pointer-events-none" style={{
                            width: '60%', height: '60%', borderRadius: '50%',
                            background: 'radial-gradient(circle, rgba(21,128,61,0.14) 0%, transparent 70%)',
                            filter: 'blur(28px)',
                            animation: 'pulseGlow 4s ease-in-out infinite',
                        }} />

                        {/* 3D tilt + doodle border wrapper */}
                        <div
                            className="relative w-full"
                            style={{
                                maxWidth: '480px',
                                transition: 'transform 0.12s ease-out',
                                transform: `perspective(1000px) rotateY(${-5 + mouse.x * 0.28}deg) rotateX(${2 + mouse.y * -0.2}deg)`,
                            }}
                        >
                            {/* outer doodle SVG border */}
                            <svg
                                className="absolute pointer-events-none z-20"
                                style={{ inset: '-10px', width: 'calc(100% + 20px)', height: 'calc(100% + 20px)' }}
                                preserveAspectRatio="none"
                                viewBox="0 0 520 540"
                                fill="none"
                                aria-hidden="true"
                            >
                                <path
                                    d="M10 20 C120 6,380 6,510 16 S524 80,521 440 S510 534,400 536 S100 538,14 530 S2 460,3 270 S5 32,10 20Z"
                                    stroke="rgba(21,128,61,0.35)"
                                    strokeWidth="2.5"
                                    fill="none"
                                    strokeDasharray="8 4"
                                    strokeLinecap="round"
                                />
                            </svg>

                            {/* image card */}
                            <div style={{
                                borderRadius: '20px',
                                overflow: 'hidden',
                                border: '1px solid rgba(21,128,61,0.15)',
                                boxShadow: '0 32px 64px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.04)',
                                background: '#fff',
                                position: 'relative',
                            }}>
                                <Image
                                    src="/images/insidebundle.png"
                                    alt="PlainFuel INSIDER Bundle"
                                    width={600}
                                    height={600}
                                    priority
                                    style={{ display: 'block', width: '100%', height: 'auto', objectFit: 'cover' }}
                                />
                                {/* shimmer */}
                                <div className="absolute inset-0 pointer-events-none rounded-[20px]" style={{
                                    background: 'linear-gradient(135deg, transparent 30%, rgba(21,128,61,0.05) 50%, transparent 70%)',
                                    backgroundSize: '200% 100%',
                                    animation: 'shimmerMove 6s linear infinite',
                                }} />
                            </div>

                            {/* floating chip TOP-RIGHT — doodle sticky style */}
                            <div
                                className="absolute z-30"
                                style={{ top: '-18px', right: '-18px', animation: 'floatChip 3.2s ease-in-out infinite' }}
                            >
                                <div className="relative px-4 py-2.5">
                                    <svg className="absolute inset-0 w-full h-full pointer-events-none"
                                        preserveAspectRatio="none" viewBox="0 0 110 44" fill="none" aria-hidden="true">
                                        <path d="M5 8 C30 2,80 2,105 7 S110 16,108 34 S103 42,76 43 S20 44,5 40 S0 32,1 22 S3 12,5 8Z"
                                            fill="#15803d" />
                                    </svg>
                                    <H className="relative z-10 text-base font-bold block text-center" style={{ color: '#051a0b' }}>
                                        SAVE 30% 🔥
                                    </H>
                                </div>
                            </div>

                            {/* floating chip BOTTOM-LEFT — doodle sticky style */}
                            <div
                                className="absolute z-30"
                                style={{ bottom: '-18px', left: '-18px', animation: 'floatChip2 3.8s ease-in-out infinite' }}
                            >
                                <div
                                    className="px-4 py-2.5 rounded-2xl border"
                                    style={{
                                        background: 'rgba(254,240,138,0.95)',
                                        borderColor: 'rgba(234,179,8,0.4)',
                                        boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                                    }}
                                >
                                    <H className="block text-xs font-bold uppercase tracking-wide" style={{ color: '#92400e' }}>
                                        🔥 Trending
                                    </H>
                                    <H className="block text-sm font-bold mt-0.5" style={{ color: '#1a1a1a' }}>
                                        847 sold this week
                                    </H>
                                </div>
                            </div>

                            {/* doodle annotation on image — mid right */}
                            <div className="absolute z-30" style={{ top: '40%', right: '-72px' }}>
                                <div className="flex items-center gap-1">
                                    <DoodleArrow color="#8b5cf6" className="w-10 h-6 rotate-180 scale-x-[-1]" />
                                    <div style={{ animation: 'stickyBob 3s ease-in-out infinite' }}>
                                        <StickyNote text="bestseller! ✨" rotate="-rotate-2" bg="#ede9fe" textColor="#4c1d95" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* bottom wiggle divider */}
                <div className="relative z-10 px-6 md:px-12 lg:px-16 pb-8 -mt-2">
                    <div className="flex items-center gap-4 max-w-screen-xl mx-auto">
                        <WiggleLine color="rgba(21,128,61,0.2)" className="flex-1 h-3" />
                        <H className="text-xs whitespace-nowrap" style={{ color: '#bbb' }}>✦ fuel smarter every day ✦</H>
                        <WiggleLine color="rgba(21,128,61,0.2)" className="flex-1 h-3" />
                    </div>
                </div>
            </section>
        </>
    );
}
