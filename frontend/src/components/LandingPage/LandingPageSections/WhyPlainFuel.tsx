'use client';

import { useEffect, useRef, useState } from 'react';

// ── Data ──────────────────────────────────────────────────────────────────────
const BAR_DATA = [8, 13, 18, 24, 32, 40, 48, 58, 68, 80, 90, 100];
const BAR_COLORS = [
    '#bbf7d0', '#bbf7d0', '#bbf7d0', '#bbf7d0',
    '#fde68a', '#fde68a', '#fde68a', '#fde68a',
    '#fca5a5', '#fca5a5', '#fca5a5', '#fca5a5',
];
const BAR_BORDERS = [
    '#22c55e', '#22c55e', '#22c55e', '#22c55e',
    '#d97706', '#d97706', '#d97706', '#d97706',
    '#ef4444', '#ef4444', '#ef4444', '#ef4444',
];

const NUTRIENTS = [
    { sym: 'B12', name: 'Vitamin B12', role: 'Nerve health & energy', color: '#7c3aed', pct: 30 },
    { sym: 'D3', name: 'Vitamin D3', role: 'Immunity & bone strength', color: '#d97706', pct: 38 },
    { sym: 'Mg', name: 'Magnesium', role: 'Muscle & sleep quality', color: '#16a34a', pct: 44 },
    { sym: 'Ca', name: 'Calcium', role: 'Bone density & teeth', color: '#0284c7', pct: 52 },
    { sym: 'Fe', name: 'Iron', role: 'Oxygen transport & focus', color: '#dc2626', pct: 36 },
];

// ── SVG helpers ───────────────────────────────────────────────────────────────
function WavyLine({ color = '#16a34a', w = 220 }: { color?: string; w?: number }) {
    return (
        <svg viewBox={`0 0 ${w} 12`} width={w} height={12} style={{ display: 'block', pointerEvents: 'none' }}>
            <path d={`M2,8 Q${w * 0.18},2 ${w * 0.36},8 Q${w * 0.54},14 ${w * 0.72},8 Q${w * 0.9},2 ${w - 2},8`}
                fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" opacity={0.55} />
        </svg>
    );
}

function DoodleArrow({ color = '#16a34a', style = {} }: { color?: string; style?: React.CSSProperties }) {
    return (
        <svg viewBox="0 0 80 48" width={64} height={40} style={{ display: 'block', ...style }}>
            <path d="M8,36 Q16,12 50,18 Q62,22 66,14" fill="none" stroke={color} strokeWidth="2.8"
                strokeLinecap="round" strokeDasharray="6 3.5" opacity={0.7} />
            <path d="M58,8 L68,18 L56,24" fill="none" stroke={color} strokeWidth="2.8"
                strokeLinecap="round" strokeLinejoin="round" opacity={0.7} />
        </svg>
    );
}

function CheckBox({ color = '#16a34a' }: { color?: string }) {
    return (
        <svg viewBox="0 0 26 26" width={24} height={24} fill="none" style={{ flexShrink: 0 }}>
            <rect x="2" y="2" width="22" height="22" rx="6"
                stroke={color} strokeWidth="2.2" strokeDasharray="6 3" fill={`${color}18`} />
            <path d="M6,13 L11,18 L20,8" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function CrossBox({ color = '#ef4444' }: { color?: string }) {
    return (
        <svg viewBox="0 0 26 26" width={24} height={24} fill="none" style={{ flexShrink: 0 }}>
            <rect x="2" y="2" width="22" height="22" rx="6"
                stroke={color} strokeWidth="2.2" strokeDasharray="6 3" fill="#fef2f2" />
            <path d="M8,8 L18,18 M18,8 L8,18" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
        </svg>
    );
}

// ── Product image in a doodle ring ────────────────────────────────────────────
function DoodleImgCircle({ src, size = 200, color = '#16a34a', rotate = '0deg', style = {} }:
    { src: string; size?: number; color?: string; rotate?: string; style?: React.CSSProperties }) {
    return (
        <div style={{
            position: 'relative', width: size, height: size, flexShrink: 0,
            transform: `rotate(${rotate})`, ...style
        }}>
            <svg viewBox="0 0 100 100" width={size} height={size}
                style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                <ellipse cx="50" cy="50" rx="47" ry="47" fill="none"
                    stroke={color} strokeWidth="2.6" strokeDasharray="9 5" strokeLinecap="round" opacity={0.65} />
                <ellipse cx="52" cy="48" rx="41" ry="41" fill="none"
                    stroke={color} strokeWidth="1.2" strokeDasharray="4 12" opacity={0.3} />
            </svg>
            <img src={src} alt="PlainFuel"
                style={{
                    position: 'absolute', inset: '8%', width: '84%', height: '84%',
                    borderRadius: '50%', objectFit: 'cover',
                    boxShadow: '0 8px 28px rgba(0,0,0,0.13)', border: '4px solid #fff',
                }}
            />
        </div>
    );
}

// ── Doodle decoration packs ───────────────────────────────────────────────────

/** Hook: question marks, pill capsules, leaf, drop, sparkle */
function HookDoodles() {
    return (
        <svg aria-hidden style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'visible', zIndex: 1 }}>
            {/* large leaf top-right */}
            <g transform="translate(870,50) rotate(20)">
                <path d="M0,0 Q22,-36 44,0 Q22,14 0,0Z" fill="none" stroke="#16a34a" strokeWidth="2" strokeDasharray="5 3" opacity={0.3} />
                <line x1="22" y1="0" x2="22" y2="-34" stroke="#16a34a" strokeWidth="1.3" strokeDasharray="3 3" opacity={0.25} />
            </g>
            {/* small leaf mid-right */}
            <g transform="translate(940,340) rotate(-18)">
                <path d="M0,0 Q13,-22 26,0 Q13,9 0,0Z" fill="none" stroke="#22c55e" strokeWidth="1.6" strokeDasharray="4 3" opacity={0.28} />
            </g>
            {/* pill capsule top-left */}
            <g transform="translate(55,170) rotate(-30)">
                <rect x="-10" y="-26" width="20" height="52" rx="10" fill="none" stroke="#d97706" strokeWidth="2" strokeDasharray="5 3" opacity={0.28} />
                <line x1="-10" y1="0" x2="10" y2="0" stroke="#d97706" strokeWidth="1.5" opacity={0.22} />
            </g>
            {/* water drop top-center */}
            <g transform="translate(500,32)">
                <path d="M0,-24 Q16,0 0,19 Q-16,0 0,-24Z" fill="none" stroke="#0284c7" strokeWidth="1.8" strokeDasharray="4 3" opacity={0.28} />
            </g>
            {/* sparkle bottom-left */}
            <g transform="translate(80,520)">
                <line x1="-14" y1="0" x2="14" y2="0" stroke="#d97706" strokeWidth="2.2" strokeLinecap="round" opacity={0.32} />
                <line x1="0" y1="-14" x2="0" y2="14" stroke="#d97706" strokeWidth="2.2" strokeLinecap="round" opacity={0.32} />
                <line x1="-10" y1="-10" x2="10" y2="10" stroke="#d97706" strokeWidth="1.4" strokeLinecap="round" opacity={0.2} />
                <line x1="10" y1="-10" x2="-10" y2="10" stroke="#d97706" strokeWidth="1.4" strokeLinecap="round" opacity={0.2} />
            </g>
            {/* wavy squiggle bottom-right */}
            <path d="M780,580 Q820,560 860,580 Q900,600 940,575" fill="none" stroke="#16a34a" strokeWidth="2.2" strokeLinecap="round" strokeDasharray="5 3" opacity={0.28} />
            {/* dots */}
            <circle cx="960" cy="180" r="5" fill="#16a34a" opacity={0.18} />
            <circle cx="30" cy="400" r="4" fill="#d97706" opacity={0.22} />
            <circle cx="900" cy="520" r="6" fill="#bbf7d0" stroke="#16a34a" strokeWidth="1.5" opacity={0.32} />
            {/* small star outline */}
            <polygon points="140,540 143,550 153,550 145,556 148,566 140,560 132,566 135,556 127,550 137,550"
                fill="none" stroke="#d97706" strokeWidth="1.5" strokeLinejoin="round" opacity={0.28} />
        </svg>
    );
}

/** Section 01: clock, leaf, pill, dot accents */
function SlowDoodles() {
    return (
        <svg aria-hidden style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'visible', zIndex: 1 }}>
            {/* clock top-right */}
            <g transform="translate(950,65)">
                <circle cx="0" cy="0" r="26" fill="none" stroke="#16a34a" strokeWidth="2" strokeDasharray="6 3" opacity={0.28} />
                <line x1="0" y1="0" x2="0" y2="-16" stroke="#16a34a" strokeWidth="2.2" strokeLinecap="round" opacity={0.3} />
                <line x1="0" y1="0" x2="12" y2="5" stroke="#16a34a" strokeWidth="2.2" strokeLinecap="round" opacity={0.3} />
            </g>
            {/* leaf top-left */}
            <g transform="translate(38,80) rotate(-10)">
                <path d="M0,0 Q22,-36 44,0 Q22,15 0,0Z" fill="none" stroke="#16a34a" strokeWidth="1.8" strokeDasharray="5 3" opacity={0.3} />
                <line x1="22" y1="0" x2="22" y2="-34" stroke="#16a34a" strokeWidth="1.2" strokeDasharray="3 3" opacity={0.25} />
            </g>
            {/* small leaf bottom-right */}
            <g transform="translate(940,560) rotate(25)">
                <path d="M0,0 Q11,-19 22,0 Q11,8 0,0Z" fill="none" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="4 3" opacity={0.28} />
            </g>
            {/* sparkle left-mid */}
            <g transform="translate(28,400)">
                <line x1="-12" y1="0" x2="12" y2="0" stroke="#d97706" strokeWidth="2" strokeLinecap="round" opacity={0.28} />
                <line x1="0" y1="-12" x2="0" y2="12" stroke="#d97706" strokeWidth="2" strokeLinecap="round" opacity={0.28} />
            </g>
            {/* pill bottom-left */}
            <g transform="translate(60,570) rotate(20)">
                <rect x="-8" y="-20" width="16" height="40" rx="8" fill="none" stroke="#d97706" strokeWidth="1.8" strokeDasharray="4 3" opacity={0.25} />
                <line x1="-8" y1="0" x2="8" y2="0" stroke="#d97706" strokeWidth="1.2" opacity={0.2} />
            </g>
            {/* dots */}
            <circle cx="970" cy="460" r="5" fill="#bbf7d0" stroke="#16a34a" strokeWidth="1.5" opacity={0.32} />
            <circle cx="18" cy="260" r="3" fill="#16a34a" opacity={0.18} />
        </svg>
    );
}

/** Section 02 (diet): wheat stalks, bowl / dal, leaf, sparkle */
function DietDoodles() {
    return (
        <svg aria-hidden style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'visible', zIndex: 1 }}>
            {/* wheat stalk far left (below product img) */}
            <g transform="translate(38,260)">
                <line x1="0" y1="80" x2="0" y2="0" stroke="#d97706" strokeWidth="2" strokeLinecap="round" opacity={0.32} />
                {[-1, 0, 1].map((x, i) => (
                    <ellipse key={i} cx={x * 11} cy={12 + i * 14} rx="7" ry="4"
                        fill="none" stroke="#d97706" strokeWidth="1.5" strokeDasharray="3 2" opacity={0.28}
                        transform={`rotate(${x * 30} ${x * 11} ${12 + i * 14})`} />
                ))}
            </g>
            {/* wheat stalk far right (below product img) */}
            <g transform="translate(962,250) scale(-1,1)">
                <line x1="0" y1="80" x2="0" y2="0" stroke="#d97706" strokeWidth="2" strokeLinecap="round" opacity={0.28} />
                {[-1, 0, 1].map((x, i) => (
                    <ellipse key={i} cx={x * 11} cy={12 + i * 14} rx="7" ry="4"
                        fill="none" stroke="#d97706" strokeWidth="1.5" strokeDasharray="3 2" opacity={0.22}
                        transform={`rotate(${x * 30} ${x * 11} ${12 + i * 14})`} />
                ))}
            </g>
            {/* bowl bottom-left */}
            <g transform="translate(50,580)">
                <path d="M-30,0 Q-30,30 0,30 Q30,30 30,0 Z" fill="none" stroke="#d97706" strokeWidth="2" strokeDasharray="5 3" opacity={0.28} />
                <line x1="-30" y1="0" x2="30" y2="0" stroke="#d97706" strokeWidth="1.5" strokeDasharray="4 3" opacity={0.22} />
                <path d="M-8,-8 Q-5,-16 -8,-24" fill="none" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round" opacity={0.2} />
                <path d="M0,-8  Q3,-18 0,-26" fill="none" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round" opacity={0.2} />
                <path d="M8,-8  Q5,-16 8,-24" fill="none" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round" opacity={0.2} />
            </g>
            {/* leaf right-mid */}
            <g transform="translate(960,430) rotate(15)">
                <path d="M0,0 Q20,-32 40,0 Q20,13 0,0Z" fill="none" stroke="#16a34a" strokeWidth="1.8" strokeDasharray="5 3" opacity={0.28} />
                <line x1="20" y1="0" x2="20" y2="-30" stroke="#16a34a" strokeWidth="1.2" strokeDasharray="3 3" opacity={0.22} />
            </g>
            {/* sparkle top-center */}
            <g transform="translate(500,28)">
                <line x1="-11" y1="0" x2="11" y2="0" stroke="#d97706" strokeWidth="2" strokeLinecap="round" opacity={0.28} />
                <line x1="0" y1="-11" x2="0" y2="11" stroke="#d97706" strokeWidth="2" strokeLinecap="round" opacity={0.28} />
                <line x1="-8" y1="-8" x2="8" y2="8" stroke="#d97706" strokeWidth="1.2" strokeLinecap="round" opacity={0.18} />
                <line x1="8" y1="-8" x2="-8" y2="8" stroke="#d97706" strokeWidth="1.2" strokeLinecap="round" opacity={0.18} />
            </g>
            {/* dots */}
            <circle cx="960" cy="220" r="5" fill="#fde68a" stroke="#d97706" strokeWidth="1.5" opacity={0.38} />
            <circle cx="22" cy="460" r="3" fill="#d97706" opacity={0.2} />
        </svg>
    );
}

/** Section 03 (blood): blood drops, DNA helix, medical cross, leaf */
function BloodDoodles() {
    return (
        <svg aria-hidden style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'visible', zIndex: 1 }}>
            {/* blood drop top-left */}
            <g transform="translate(42,80)">
                <path d="M0,-30 Q20,0 0,24 Q-20,0 0,-30Z" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="5 3" opacity={0.3} />
            </g>
            {/* blood drop top-right */}
            <g transform="translate(950,50)">
                <path d="M0,-22 Q14,0 0,18 Q-14,0 0,-22Z" fill="none" stroke="#ef4444" strokeWidth="1.8" strokeDasharray="4 3" opacity={0.28} />
            </g>
            {/* DNA helix left */}
            <g transform="translate(26,320)">
                {[0, 1, 2, 3, 4].map(i => (
                    <g key={i}>
                        <path d={`M-14,${i * 22 - 44} Q0,${i * 22 - 33} 14,${i * 22 - 44}`} fill="none" stroke="#7c3aed" strokeWidth="1.5" strokeDasharray="3 2" opacity={0.25} />
                        <path d={`M-14,${i * 22 - 33} Q0,${i * 22 - 44} 14,${i * 22 - 33}`} fill="none" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3 2" opacity={0.2} />
                    </g>
                ))}
            </g>
            {/* medical cross right */}
            <g transform="translate(956,400)">
                <rect x="-5" y="-18" width="10" height="36" rx="4" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="4 2" opacity={0.28} />
                <rect x="-18" y="-5" width="36" height="10" rx="4" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="4 2" opacity={0.28} />
            </g>
            {/* sparkle bottom-right */}
            <g transform="translate(940,580)">
                <line x1="-13" y1="0" x2="13" y2="0" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" opacity={0.28} />
                <line x1="0" y1="-13" x2="0" y2="13" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" opacity={0.28} />
            </g>
            {/* leaf bottom-left */}
            <g transform="translate(42,570) rotate(-20)">
                <path d="M0,0 Q18,-28 36,0 Q18,12 0,0Z" fill="none" stroke="#16a34a" strokeWidth="1.5" strokeDasharray="4 3" opacity={0.25} />
            </g>
            {/* dots */}
            <circle cx="960" cy="580" r="5" fill="#fca5a5" stroke="#ef4444" strokeWidth="1.5" opacity={0.32} />
            <circle cx="500" cy="22" r="3" fill="#ef4444" opacity={0.18} />
        </svg>
    );
}

/** Payoff: sun rays, leaves, sparkle, pill, drop, star */
function PayoffDoodles() {
    return (
        <svg aria-hidden style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'visible', zIndex: 1 }}>
            {/* sun rays top-right */}
            <g transform="translate(930,70)">
                {[0, 45, 90, 135, 180, 225, 270, 315].map(a => (
                    <line key={a}
                        x1={Math.cos(a * Math.PI / 180) * 20} y1={Math.sin(a * Math.PI / 180) * 20}
                        x2={Math.cos(a * Math.PI / 180) * 36} y2={Math.sin(a * Math.PI / 180) * 36}
                        stroke="#d97706" strokeWidth="2" strokeLinecap="round" opacity={0.28} />
                ))}
                <circle cx="0" cy="0" r="15" fill="none" stroke="#d97706" strokeWidth="2" strokeDasharray="5 3" opacity={0.32} />
            </g>
            {/* big leaf top-left */}
            <g transform="translate(46,80) rotate(-15)">
                <path d="M0,0 Q22,-36 44,0 Q22,15 0,0Z" fill="none" stroke="#16a34a" strokeWidth="2" strokeDasharray="5 3" opacity={0.32} />
                <line x1="22" y1="0" x2="22" y2="-34" stroke="#16a34a" strokeWidth="1.3" strokeDasharray="3 3" opacity={0.26} />
            </g>
            {/* small leaf mid-left */}
            <g transform="translate(28,430) rotate(10)">
                <path d="M0,0 Q13,-21 26,0 Q13,9 0,0Z" fill="none" stroke="#16a34a" strokeWidth="1.5" strokeDasharray="4 3" opacity={0.26} />
            </g>
            {/* pill bottom-left */}
            <g transform="translate(60,560) rotate(-25)">
                <rect x="-9" y="-22" width="18" height="44" rx="9" fill="none" stroke="#16a34a" strokeWidth="1.8" strokeDasharray="4 3" opacity={0.25} />
                <line x1="-9" y1="0" x2="9" y2="0" stroke="#16a34a" strokeWidth="1.2" opacity={0.2} />
            </g>
            {/* sparkle bottom-right */}
            <g transform="translate(950,560)">
                <line x1="-14" y1="0" x2="14" y2="0" stroke="#16a34a" strokeWidth="2.2" strokeLinecap="round" opacity={0.32} />
                <line x1="0" y1="-14" x2="0" y2="14" stroke="#16a34a" strokeWidth="2.2" strokeLinecap="round" opacity={0.32} />
                <line x1="-10" y1="-10" x2="10" y2="10" stroke="#16a34a" strokeWidth="1.4" strokeLinecap="round" opacity={0.2} />
                <line x1="10" y1="-10" x2="-10" y2="10" stroke="#16a34a" strokeWidth="1.4" strokeLinecap="round" opacity={0.2} />
            </g>
            {/* water drop mid-right */}
            <g transform="translate(966,350)">
                <path d="M0,-20 Q14,0 0,16 Q-14,0 0,-20Z" fill="none" stroke="#0284c7" strokeWidth="1.8" strokeDasharray="4 3" opacity={0.25} />
            </g>
            {/* star bottom-center */}
            <g transform="translate(500,600)">
                <polygon points="0,-15 3.9,-4.9 14,-4.9 6.4,1.6 9.7,12.4 0,6 -9.7,12.4 -6.4,1.6 -14,-4.9 -3.9,-4.9"
                    fill="none" stroke="#d97706" strokeWidth="1.5" strokeLinejoin="round" opacity={0.28} />
            </g>
            {/* dots */}
            <circle cx="80" cy="360" r="5" fill="#bbf7d0" stroke="#16a34a" strokeWidth="1.5" opacity={0.38} />
            <circle cx="960" cy="180" r="3" fill="#16a34a" opacity={0.18} />
            <circle cx="500" cy="28" r="3" fill="#d97706" opacity={0.2} />
        </svg>
    );
}

// Intersection Observer hook
function useInView(threshold = 0.18) {
    const ref = useRef<HTMLDivElement>(null);
    const [inView, setInView] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
        obs.observe(el);
        return () => obs.disconnect();
    }, [threshold]);
    return { ref, inView };
}

// ── SECTION 1 — Hero Hook ─────────────────────────────────────────────────────
function SectionHook() {
    const { ref, inView } = useInView(0.1);
    return (
        <section ref={ref} className={`pf-section pf-hook${inView ? ' pf-in' : ''}`}>
            <div className="pf-blob pf-blob-1" />
            <div className="pf-blob pf-blob-2" />
            <HookDoodles />

            <div className="pf-hook-inner">
                <div className="pf-tag pf-tag-green">
                    <span className="pf-tag-dot pf-dot-green" />
                    <span>The Real Problem</span>
                </div>
                <h1 className="pf-h1">
                    Why is<br />
                    <span className="pf-squiggle-wrap pf-green-text">
                        PlainFuel
                        <WavyLine color="#16a34a" w={220} />
                    </span>{' '}
                    needed?
                </h1>
                <p className="pf-lead">
                    Most people assume deficiencies happen <em>suddenly, but that’s not true.</em>.
                    <br />
                    <strong>That's the biggest myth in nutrition.</strong>
                </p>
                <div className="pf-hook-pills">
                    {[
                        { icon: '🩸', label: '70% Indians are B12 deficient' },
                        { icon: '☀️', label: '80% have low Vitamin D' },
                        { icon: '🦴', label: '50% lack enough Calcium' },
                    ].map(p => (
                        <div key={p.label} className="pf-pill">
                            <span>{p.icon}</span><span>{p.label}</span>
                        </div>
                    ))}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8 }}>
                    <DoodleArrow color="#16a34a" />
                    <span className="pf-caveat" style={{ fontSize: 22, color: '#4a6741' }}>scroll to find out why →</span>
                </div>
            </div>

            {/* Product image */}
            <div className="pf-hook-img-wrap">
                <DoodleImgCircle src="/images/DoodleImages/hero1.png" size={320} color="#16a34a" />
            </div>
        </section>
    );
}

// ── SECTION 2 — Deficiencies build slowly ────────────────────────────────────
function SectionSlow() {
    const { ref, inView } = useInView();
    const [chartAnim, setChartAnim] = useState(false);
    useEffect(() => { if (inView) setTimeout(() => setChartAnim(true), 300); }, [inView]);

    return (
        <section ref={ref} className={`pf-section pf-slow${inView ? ' pf-in' : ''}`}>
            <div className="pf-blob pf-blob-3" />
            <SlowDoodles />

            <div className="pf-two-col">
                {/* LEFT */}
                <div className="pf-col-text">
                    <div className="pf-step-badge pf-step-green">01</div>
                    <h2 className="pf-h2">
                        Deficiencies<br />
                        <span className="pf-squiggle-wrap pf-green-text">
                            build slowly
                            <WavyLine color="#16a34a" w={190} />
                        </span>
                    </h2>
                    <p className="pf-body">
                        They are the result of missing  {' '}
                        <mark className="pf-mark-green">small amounts</mark> of nutrients every day for months.
                    </p>

                    <p className="pf-body">
                        Your body runs on <strong>daily input</strong>. Just like missing homework every day leads to problems later, missing nutrients daily creates long-term gaps.
                        <div className="pf-cards-col">
                            {[
                                { icon: '📅', title: 'Month 1–3', desc: 'No noticeable symptoms. Stores deplete silently.', color: '#16a34a' },
                                { icon: '⚠️', title: 'Month 4–8', desc: 'Fatigue sets in. Focus drops. Mood shifts.', color: '#d97706' },
                                { icon: '🚨', title: 'Month 9+', desc: 'Critical deficiency. Blood tests finally flag it.', color: '#ef4444' },
                            ].map((c, i) => (
                                <div key={i} className="pf-timeline-card" style={{ borderColor: `${c.color}44` }}>
                                    <span style={{ fontSize: 24 }}>{c.icon}</span>
                                    <div>
                                        <div style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 16, color: '#1a2e1a' }}>{c.title}</div>
                                        <div style={{ fontFamily: "'Nunito',sans-serif", fontSize: 14, color: '#6b7280', marginTop: 3 }}>{c.desc}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </p>
                    <p className="pf-body">
                        Today, many of us have started paying attention to  {' '}
                        <mark className="pf-mark-green">protein.</mark> But nutrition is not just about protein.

                    </p>
                </div>

                {/* RIGHT: chart + product image below */}
                <div className="pf-col-visual">
                    <div className="pf-sticky-note pf-sticky-green pf-rotate-1" style={{ marginBottom: 32 }}>
                        <div className="pf-sticky-tape" />
                        <div className="pf-caveat" style={{ fontSize: 17, color: '#4a6741', marginBottom: 14 }}>
                            📊 Deficiency gap — 12 months
                        </div>
                        <div style={{ position: 'relative', paddingBottom: 4 }}>
                            {[35, 70, 105, 140].map(px => (
                                <div key={px} style={{
                                    position: 'absolute', left: 0, right: 0, bottom: px, height: 1,
                                    borderTop: '1px dashed rgba(22,163,74,0.15)', pointerEvents: 'none'
                                }} />
                            ))}
                            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 148 }}>
                                {BAR_DATA.map((h, i) => (
                                    <div key={i} style={{
                                        flex: 1, borderRadius: '4px 4px 0 0',
                                        background: BAR_COLORS[i], border: `2px solid ${BAR_BORDERS[i]}`,
                                        height: chartAnim ? `${(h / 100) * 148}px` : 0,
                                        transition: `height 0.7s cubic-bezier(0.22,1,0.36,1) ${i * 55}ms`,
                                    }} />
                                ))}
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                            {['Jan', 'Jun', 'Dec'].map(m => (
                                <span key={m} className="pf-caveat" style={{ fontSize: 15, color: '#4a6741' }}>{m}</span>
                            ))}
                        </div>
                        <div style={{ display: 'flex', gap: 14, marginTop: 14, flexWrap: 'wrap' }}>
                            {[['Normal', '#bbf7d0', '#22c55e'], ['Warning', '#fde68a', '#d97706'], ['Critical', '#fca5a5', '#ef4444']].map(([lbl, bg, bdr]) => (
                                <div key={lbl} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <div style={{ width: 12, height: 12, borderRadius: 3, background: bg as string, border: `2px solid ${bdr}` }} />
                                    <span className="pf-caveat" style={{ fontSize: 15, color: '#4a6741' }}>{lbl as string}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Product image below chart */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                        <span className="pf-caveat" style={{ fontSize: 28, color: '#16a34a' }}>closes the gap ↓</span>
                        <DoodleImgCircle src="/images/product.png" size={272} color="#22c55e" rotate="-3deg" />
                    </div>
                </div>
            </div>
        </section>
    );
}

// ── SECTION 3 — Indian diet reality ──────────────────────────────────────────
function SectionDiet() {
    const { ref, inView } = useInView();

    return (
        <section ref={ref} className={`pf-section pf-diet${inView ? ' pf-in' : ''}`}>
            <div className="pf-blob pf-blob-4" />
            <DietDoodles />



            <div className="pf-section-header">
                <div className="pf-step-badge pf-step-amber">02</div>
                <h2 className="pf-h2" style={{ textAlign: 'center' }}>The Indian Diet Reality</h2>
                <p className="pf-lead" style={{ textAlign: 'center', maxWidth: 560 }}>
                    Our daily diet, especially in India, is heavily focused on:
                </p>
            </div>

            <div className="pf-vs-grid">
                <div className="pf-sticky-note pf-sticky-green pf-rotate-neg1">
                    <div className="pf-sticky-tape" />
                    <div className="pf-vs-label pf-green-text">
                        <span style={{ fontSize: 18 }}>✅</span> Our diet HAS
                    </div>
                    {['Carbohydrates', 'Fats'].map(item => (
                        <div key={item} className="pf-check-row pf-check-green">
                            <CheckBox color="#16a34a" /><span>{item}</span>
                        </div>
                    ))}
                    <div className="pf-mini-callout pf-callout-green">🌾 Mostly rice, wheat & dal-based</div>
                </div>

                <div className="pf-vs-bubble">
                    <svg viewBox="0 0 60 60" width={56} height={56}>
                        <ellipse cx="30" cy="30" rx="26" ry="26" fill="#fff"
                            stroke="rgba(0,0,0,0.14)" strokeWidth="2" strokeDasharray="6 3" />
                        <text x="30" y="36" textAnchor="middle"
                            style={{ fontFamily: "'Caveat',cursive", fontSize: 18, fill: '#888' }}>vs</text>
                    </svg>
                </div>

                <div className="pf-sticky-note pf-sticky-amber pf-rotate-1">
                    <div className="pf-sticky-tape pf-tape-amber" />
                    <div className="pf-vs-label" style={{ color: '#ef4444' }}>
                        <span style={{ fontSize: 18 }}>❌</span> Often LACKS
                    </div>
                    {['Protein', 'Fiber', 'Essential Micronutrients'].map(item => (
                        <div key={item} className="pf-check-row pf-check-red">
                            <CrossBox color="#ef4444" /><span>{item}</span>
                        </div>
                    ))}
                    <div className="pf-mini-callout pf-callout-red">🚨 Micronutrient gaps accumulate daily</div>
                </div>
            </div>


        </section>
    );
}

// ── SECTION 4 — Blood report ──────────────────────────────────────────────────
function SectionBlood() {
    const { ref, inView } = useInView();
    const [barAnim, setBarAnim] = useState(false);
    useEffect(() => { if (inView) setTimeout(() => setBarAnim(true), 250); }, [inView]);

    return (
        <section ref={ref} className={`pf-section pf-blood${inView ? ' pf-in' : ''}`}>
            <div className="pf-blob pf-blob-5" />
            <BloodDoodles />

            <div className="pf-section-header">
                <div className="pf-step-badge pf-step-red">03</div>
                <h2 className="pf-h2" style={{ textAlign: 'center' }}>
                    Blood reports reveal{' '}
                    <span className="pf-squiggle-wrap" style={{ color: '#ef4444' }}>
                        the real gaps
                        <WavyLine color="#ef4444" w={200} />
                    </span>
                </h2>
                <p className="pf-lead" style={{ textAlign: 'center', maxWidth: 520 }}>
                    When we look at <em>blood reports</em> , the most common deficiencies are not protein — they are
                </p>
            </div>

            <div className="pf-two-col pf-two-col-60-40">
                <div className="pf-sticky-note pf-sticky-red pf-rotate-neg05" style={{ flex: '1 1 380px' }}>
                    <div className="pf-sticky-tape pf-tape-red" />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                        <div>
                            <div className="pf-caveat" style={{ fontSize: 26, color: '#af0000ff', fontWeight: 'bold' }}>Blood report — common deficiencies</div>
                            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 700, color: '#1a2e1a' }}>The most common deficiencies</div>
                        </div>
                        <div className="pf-badge-red">⚠ Deficient</div>
                    </div>
                    {NUTRIENTS.map((n, i) => (
                        <div key={n.sym} className="pf-nutrient-row" style={{ borderColor: `${n.color}33` }}>
                            <div className="pf-nutrient-sym" style={{ background: `${n.color}14`, borderColor: `${n.color}` }}>
                                <span className="pf-caveat" style={{ fontSize: 15, color: n.color, fontWeight: 700 }}>{n.sym}</span>
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontFamily: "'Nunito',sans-serif", fontSize: 16, fontWeight: 800, color: '#1a2e1a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{n.name}</div>
                                <div style={{ fontFamily: "'Nunito',sans-serif", fontSize: 14, color: '#000000ff', marginTop: 1 }}>{n.role}</div>
                            </div>
                            <div className="pf-bar-track">
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                                    <span className="Nunito',sans-serif" style={{ fontSize: 15, color: '#000000ff' }}>Level</span>
                                    <span className="Nunito',sans-serif" style={{ fontSize: 15, color: '#ef4444' }}>Low</span>
                                </div>
                                <div style={{ height: 8, background: '#f3f4f6', borderRadius: 99, overflow: 'hidden', border: '1.5px dashed #e5e7eb' }}>
                                    <div style={{
                                        height: '100%', borderRadius: 99, background: n.color,
                                        width: barAnim ? `${n.pct}%` : 0,
                                        transition: `width 0.9s cubic-bezier(0.22,1,0.36,1) ${i * 110}ms`,
                                    }} />
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="pf-info-bar">
                        <span>ℹ️</span>
                        <span>These are <strong>micronutrients</strong>, and they play a critical role in how our body functions.</span>
                    </div>
                </div>

                <div className="pf-col-text" style={{ flex: '1 1 280px' }}>
                    <p className="pf-body">
                        Every Indian who gets a blood test is almost always told the <mark className="pf-mark-red">same things</mark>:
                    </p>
                    {[
                        { label: 'Low B12', note: 'Extreme fatigue, brain fog, nerve issues', color: '#7c3aed' },
                        { label: 'Low Vitamin D', note: 'Weak bones, poor immunity, mood swings', color: '#d97706' },
                        { label: 'Low Iron', note: 'Anaemia, difficulty concentrating, pale skin', color: '#dc2626' },
                    ].map((item, i) => (
                        <div key={i} className="pf-explainer-card" style={{ borderLeft: `4px solid ${item.color}` }}>
                            <div className="pf-caveat" style={{ fontSize: 20, fontWeight: 700, color: item.color }}>{item.label}</div>
                            <div style={{ fontFamily: "'Nunito',sans-serif", fontSize: 15, color: '#6b7280', marginTop: 3 }}>{item.note}</div>
                        </div>
                    ))}
                    <div className="pf-big-callout pf-callout-red" style={{ marginTop: 16 }}>
                        <span style={{ fontSize: 20 }}>🔬</span>
                        <span className="pf-caveat" style={{ fontSize: 19, color: '#991b1b' }}>
                            Protein labs look fine. The real gaps are invisible till tested.
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}

// ── SECTION 5 — Payoff / CTA ──────────────────────────────────────────────────
function SectionPayoff() {
    const { ref, inView } = useInView(0.15);

    return (
        <section ref={ref} className={`pf-section pf-payoff${inView ? ' pf-in' : ''}`}>
            <div className="pf-blob pf-blob-6" />
            <div className="pf-blob pf-blob-7" />
            <PayoffDoodles />

            <div className="pf-payoff-inner">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 28 }}>
                    <div style={{ height: 2, width: 48, background: 'rgba(22,163,74,0.4)', borderRadius: 2 }} />
                    <div className="pf-tag pf-tag-green">
                        <span className="pf-tag-dot pf-dot-green" />
                        <span>The Answer</span>
                    </div>
                    <div style={{ height: 2, width: 48, background: 'rgba(22,163,74,0.4)', borderRadius: 2 }} />
                </div>

                <h2 className="pf-h1" style={{ textAlign: 'center' }}>
                    One scoop.<br />
                    <span className="pf-squiggle-wrap pf-green-text">
                        Everything your body needs.
                        <WavyLine color="#16a34a" w={360} />
                    </span>
                </h2>

                <p className="pf-lead" style={{ textAlign: 'center', maxWidth: 580, margin: '18px auto 36px' }}>
                    PlainFuel closes the gap — combining protein, fiber and essential
                    micronutrients in one daily system, designed for Indian bodies.
                </p>

                <div className="pf-chips">
                    {['✅ Protein', '✅ Fiber', '✅ B12', '✅ D3', '✅ Magnesium', '✅ Calcium', '✅ Iron'].map(c => (
                        <div key={c} className="pf-chip">{c}</div>
                    ))}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, marginTop: 40 }}>
                    <a href="#order" className="pf-cta-btn">
                        Start with PlainFuel
                        <svg viewBox="0 0 18 18" width={17} height={17} fill="none">
                            <path d="M3 9h12M9 3l6 6-6 6" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </a>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <DoodleArrow color="#16a34a" style={{ transform: 'scaleX(-1)' }} />
                        <span className="pf-caveat" style={{ fontSize: 20, color: '#4a6741' }}>no commitment needed</span>
                    </div>
                </div>

                <div className="pf-trust-row">
                    {['🌿 100% Natural', '🔬 Lab Tested', '📦 Free Delivery', '⭐ 4.8/5 Rating'].map(t => (
                        <div key={t} className="pf-trust-pill">{t}</div>
                    ))}
                </div>
            </div>

            {/* product image right */}
            <div className="pf-payoff-img-wrap">
                <DoodleImgCircle src="/images/product.png" size={320} color="#16a34a" rotate="4deg" />
            </div>
        </section>
    );
}

// ── ROOT ──────────────────────────────────────────────────────────────────────
export default function WhyPlainFuel() {
    return (
        <div className="why-plain-fuel-scope">
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&family=Nunito:wght@400;600;700;800&family=Caveat:wght@500;600;700&display=swap');

        .why-plain-fuel-scope *, .why-plain-fuel-scope *::before, .why-plain-fuel-scope *::after { box-sizing:border-box; margin:0; padding:0; }

        @keyframes pf-fadeUp {
          from { opacity:0; transform:translateY(28px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes pf-floatBlob {
          0%,100% { transform:translate(0,0) scale(1); }
          50%      { transform:translate(12px,-16px) scale(1.04); }
        }

        .pf-section {
          position:relative; width:100%; overflow:hidden;
          padding:clamp(40px,5vw,60px) clamp(20px,4vw,40px);
        }
        .pf-section::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image: url('/images/DoodleImages/doodle-bg.png');
          background-repeat: repeat;
          opacity: 0.04;
          pointer-events: none;
          z-index: 0;
        }

        /* entrance */
        .pf-section > * { opacity:0; transform:translateY(24px); }
        .pf-section.pf-in > * { animation:pf-fadeUp 0.68s cubic-bezier(0.16,1,0.3,1) forwards; }
        .pf-section.pf-in > *:nth-child(1){ animation-delay:0.04s; }
        .pf-section.pf-in > *:nth-child(2){ animation-delay:0.10s; }
        .pf-section.pf-in > *:nth-child(3){ animation-delay:0.16s; }
        .pf-section.pf-in > *:nth-child(4){ animation-delay:0.22s; }
        .pf-section.pf-in > *:nth-child(5){ animation-delay:0.28s; }
        .pf-section.pf-in > *:nth-child(6){ animation-delay:0.34s; }
        .pf-section.pf-in > *:nth-child(7){ animation-delay:0.40s; }

        /* SVG overlays + blobs + absolute-positioned product frames bypass entrance */
        .pf-section > svg,
        .pf-section > div.pf-blob {
          opacity:1 !important; transform:none !important; animation:none !important;
        }

        /* blobs */
        .pf-blob {
          position:absolute; border-radius:50%; filter:blur(60px);
          pointer-events:none; z-index:0; animation:pf-floatBlob 9s ease-in-out infinite;
        }
        .pf-blob-1{ width:340px;height:280px;top:-80px;right:-60px;background:rgba(187,247,208,0.45); }
        .pf-blob-2{ width:220px;height:200px;bottom:-40px;left:-40px;background:rgba(254,243,199,0.5);animation-delay:3s; }
        .pf-blob-3{ width:280px;height:240px;bottom:-60px;right:-40px;background:rgba(187,247,208,0.35);animation-delay:2s; }
        .pf-blob-4{ width:260px;height:220px;top:-50px;left:-50px;background:rgba(254,243,199,0.4);animation-delay:4s; }
        .pf-blob-5{ width:300px;height:260px;bottom:-60px;left:-60px;background:rgba(254,226,226,0.4);animation-delay:1s; }
        .pf-blob-6{ width:380px;height:300px;top:-80px;right:-80px;background:rgba(187,247,208,0.4);animation-delay:2.5s; }
        .pf-blob-7{ width:240px;height:200px;bottom:-40px;left:-30px;background:rgba(254,243,199,0.4);animation-delay:5s; }

        /* section backgrounds */
        .pf-hook  { background:#f0fdf4; }
        .pf-slow  { background:#f8faff; }
        .pf-diet  { background:#fffbeb; }
        .pf-blood { background:#fff5f5; }
        .pf-payoff{ background:#f0fdf4; }

        /* typography */
        .pf-h1 {
          font-family:'Playfair Display',serif;
          font-size:clamp(2.8rem,5.5vw,4.4rem);
          font-weight:900; color:#1a2e1a;
          line-height:1.1; letter-spacing:-0.025em; margin-bottom:20px;
        }
        .pf-h2 {
          font-family:'Playfair Display',serif;
          font-size:clamp(2.2rem,3.8vw,3.2rem);
          font-weight:900; color:#1a2e1a;
          line-height:1.12; letter-spacing:-0.02em; margin-bottom:18px;
        }
        .pf-lead {
          font-family:'Nunito',sans-serif;
          font-size:clamp(18px,2.1vw,22px);
          color:#4a6741; line-height:1.8; margin-bottom:14px;
        }
        .pf-body {
          font-family:'Nunito',sans-serif;
          font-size:clamp(16px,1.8vw,19px);
          color:#4a6741; line-height:1.9; margin-bottom:16px;
        }
        .pf-caveat{ font-family:'Caveat',cursive; }
        .pf-green-text{ color:#16a34a; }

        .pf-squiggle-wrap{ position:relative; display:inline-block; font-style:italic; }
        .pf-squiggle-wrap svg{ position:absolute; bottom:-8px; left:0; }

        .pf-tag {
          display:inline-flex; align-items:center; gap:7px;
          border-radius:99px; padding:6px 16px;
          font-family:'Nunito',sans-serif; font-size:12px;
          font-weight:800; letter-spacing:0.18em; text-transform:uppercase;
          margin-bottom:22px;
        }
        .pf-tag-green{ background:#dcfce7; border:2px dashed #16a34a; color:#14532d; }
        .pf-tag-dot{ width:8px; height:8px; border-radius:50%; }
        .pf-dot-green{ background:#16a34a; }

        .pf-step-badge {
          width:38px; height:38px; border-radius:50%;
          display:flex; align-items:center; justify-content:center;
          font-family:'Caveat',cursive; font-size:17px; font-weight:700;
          margin-bottom:16px; flex-shrink:0;
        }
        .pf-step-green{ border:2.5px dashed #16a34a; background:#dcfce7; color:#16a34a; }
        .pf-step-amber{ border:2.5px dashed #d97706; background:#fef3c7; color:#d97706; }
        .pf-step-red  { border:2.5px dashed #ef4444; background:#fee2e2; color:#ef4444; }

        .pf-mark-green{ background:#bbf7d0; color:#14532d; padding:2px 8px; border-radius:3px; font-style:italic; }
        .pf-mark-red  { background:#fca5a5; color:#7f1d1d; padding:2px 8px; border-radius:3px; font-style:italic; }

        /* layouts */
        .pf-two-col {
          display:flex; flex-wrap:wrap;
          gap:clamp(24px,4vw,56px); align-items:flex-start;
          position:relative; z-index:1;
          width:100%; max-width:1100px; margin:0 auto;
        }
        .pf-two-col-60-40>*:first-child{ flex:1 1 380px; }
        .pf-two-col-60-40>*:last-child { flex:1 1 260px; }
        .pf-col-text  { flex:1 1 320px; }
        .pf-col-visual{ flex:1 1 320px; }

        .pf-section-header {
          display:flex; flex-direction:column; align-items:center;
          gap:6px; margin-bottom:36px; position:relative; z-index:1;
        }

        /* sticky notes */
        .pf-sticky-note {
          border-radius:4px; padding:24px 22px; position:relative;
          box-shadow:3px 5px 14px rgba(0,0,0,0.1),1px 1px 0 rgba(0,0,0,0.05);
        }
        .pf-sticky-green{ background:#f0fdf4; }
        .pf-sticky-amber{ background:#fffbeb; }
        .pf-sticky-red  { background:#fff5f5; }
        .pf-rotate-1    { transform:rotate(1deg); }
        .pf-rotate-neg1 { transform:rotate(-1deg); }
        .pf-rotate-neg05{ transform:rotate(-0.5deg); }

        .pf-sticky-tape{
          position:absolute; top:0; left:50%; transform:translateX(-50%);
          width:44px; height:9px; border-radius:0 0 4px 4px; background:rgba(0,0,0,0.1);
        }
        .pf-tape-amber{ background:rgba(217,119,6,0.22); }
        .pf-tape-red  { background:rgba(239,68,68,0.2); }

        /* timeline */
        .pf-cards-col{ display:flex; flex-direction:column; gap:10px; margin-top:20px; }
        .pf-timeline-card{
          display:flex; align-items:center; gap:14px;
          background:#fff; border-radius:10px; border:2px dashed; padding:12px 16px;
        }

        /* VS grid */
        .pf-vs-grid {
          display:grid; grid-template-columns:1fr auto 1fr;
          gap:16px; align-items:start;
          position:relative; z-index:1;
          width:100%; max-width:860px; margin:0 auto;
        }
        .pf-vs-bubble{ display:flex; align-items:center; justify-content:center; padding-top:48px; }
        .pf-vs-label{
          font-family:'Caveat',cursive; font-size:21px; font-weight:700;
          display:flex; align-items:center; gap:8px; margin-bottom:16px;
        }
        .pf-check-row{
          display:flex; align-items:center; gap:12px;
          border-radius:8px; padding:13px 16px; margin-bottom:10px;
          font-family:'Nunito',sans-serif; font-size:17px; font-weight:700;
        }
        .pf-check-green{ background:#dcfce7; border:2px dashed #22c55e; color:#14532d; }
        .pf-check-red  { background:#fff7ed; border:2px dashed #ef4444; color:#7f1d1d; }
        .pf-mini-callout{
          border-radius:8px; padding:10px 16px; margin-top:8px;
          font-family:'Caveat',cursive; font-size:17px;
        }
        .pf-callout-green{ background:#dcfce7; color:#166534; border:1.5px dashed #22c55e; }
        .pf-callout-red  { background:#fee2e2; color:#991b1b; border:1.5px dashed #ef4444; }
        .pf-callout-amber{ background:#fef3c7; color:#92400e; border:1.5px dashed #d97706; }

        .pf-big-callout{
          display:inline-flex; align-items:center; gap:14px;
          border-radius:12px; padding:16px 24px; transform:rotate(-0.4deg);
          box-shadow:3px 4px 10px rgba(0,0,0,0.07);
          width:100%; max-width:680px; margin:0 auto;
        }

        /* nutrient rows */
        .pf-nutrient-row{
          display:flex; align-items:center; gap:12px;
          padding:11px 13px; border-radius:10px; margin-bottom:8px;
          background:#fff; border:2px dashed;
        }
        .pf-nutrient-sym{
          width:42px; height:42px; border-radius:9px; border:2px dashed;
          display:flex; align-items:center; justify-content:center; flex-shrink:0;
        }
        .pf-bar-track{ width:96px; flex-shrink:0; }
        .pf-badge-red{
          background:#fee2e2; border:2px dashed #ef4444;
          border-radius:8px; padding:6px 14px;
          font-family:'Caveat',cursive; font-size:16px; color:#dc2626; font-weight:700; white-space:nowrap;
        }
        .pf-info-bar{
          margin-top:14px; padding:13px 16px;
          background:#f0fdf4; border-radius:9px; border:2px dashed #22c55e;
          display:flex; align-items:flex-start; gap:10px;
          font-family:'Nunito',sans-serif; font-size:15px; color:#166534;
        }
        .pf-explainer-card{
          background:#fff; border-radius:0 10px 10px 0;
          padding:13px 16px; margin-bottom:12px;
          box-shadow:2px 3px 8px rgba(0,0,0,0.06);
        }

        /* hook layout */
        .pf-hook {
          display:grid; grid-template-columns:1fr auto;
          gap:clamp(24px,4vw,40px); align-items:center;
        }
        .pf-hook-inner{ position:relative; z-index:1; }
        .pf-hook-pills{ display:flex; flex-wrap:wrap; gap:10px; margin-bottom:20px; }
        .pf-pill{
          display:flex; align-items:center; gap:8px;
          background:#fff; border:2px dashed #16a34a; border-radius:99px; padding:7px 14px;
          font-family:'Nunito',sans-serif; font-size:15px; font-weight:700; color:#14532d;
          box-shadow:2px 2px 0 #bbf7d0;
        }
        .pf-hook-img-wrap{ position:relative; z-index:1; flex-shrink:0; }

        /* payoff layout */
        .pf-payoff {
          display:grid; grid-template-columns:1fr auto;
          gap:clamp(24px,4vw,40px); align-items:center;
        }
        .pf-payoff-inner{ position:relative; z-index:1; }
        .pf-payoff-img-wrap{ position:relative; z-index:1; flex-shrink:0; }

        /* chips */
        .pf-chips{ display:flex; flex-wrap:wrap; gap:10px; justify-content:center; margin-bottom:8px; }
        .pf-chip{
          background:#fff; border:2px dashed #16a34a; border-radius:99px; padding:8px 16px;
          font-family:'Nunito',sans-serif; font-size:14px; font-weight:700; color:#14532d;
          box-shadow:2px 2px 0 #bbf7d0;
        }

        /* CTA */
        .pf-cta-btn{
          display:inline-flex; align-items:center; gap:14px;
          background:linear-gradient(135deg,#22c55e,#16a34a); color:#fff;
          font-family:'Nunito',sans-serif; font-size:16px; font-weight:800;
          letter-spacing:0.06em; text-transform:uppercase;
          padding:17px 44px; border-radius:14px; text-decoration:none;
          box-shadow:4px 6px 0 #14532d,0 0 0 3px #16a34a;
          border:2.5px solid #14532d; transition:all 0.18s;
        }
        .pf-cta-btn:hover{ transform:translate(-2px,-2px); box-shadow:6px 8px 0 #14532d,0 0 0 3px #16a34a; }

        .pf-trust-row{ display:flex; flex-wrap:wrap; gap:10px; justify-content:center; margin-top:32px; }
        .pf-trust-pill{
          background:rgba(255,255,255,0.85); border:1.5px dashed rgba(22,163,74,0.45);
          border-radius:99px; padding:7px 16px;
          font-family:'Nunito',sans-serif; font-size:13px; font-weight:700; color:#166534;
        }

        .pf-divider{
          height:3px; width:100%;
          background:repeating-linear-gradient(90deg,transparent,transparent 8px,rgba(22,163,74,0.2) 8px,rgba(22,163,74,0.2) 16px);
        }

        /* responsive */
        @media (max-width:860px) {
          .pf-hook  { grid-template-columns:1fr; }
          .pf-payoff{ grid-template-columns:1fr; }
          .pf-hook-img-wrap  { display:none; }
          .pf-payoff-img-wrap{ display:none; }
          .pf-vs-grid{ grid-template-columns:1fr; }
          .pf-vs-bubble{ display:none; }
          .pf-bar-track{ display:none; }
        }
        @media (max-width:560px) {
          .pf-two-col{ gap:20px; }
          .pf-chips{ gap:8px; }
          .pf-hook-pills{ gap:8px; }
        }
      `}</style>

            <SectionHook />
            <div className="pf-divider" aria-hidden />
            <SectionSlow />
            <div className="pf-divider" aria-hidden />
            <SectionDiet />
            <div className="pf-divider" aria-hidden />
            <SectionBlood />
            <div className="pf-divider" aria-hidden />
            <SectionPayoff />
        </div>
    );
}