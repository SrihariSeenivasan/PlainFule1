'use client';

import { useEffect, useRef, useState } from 'react';

// ── Types ─────────────────────────────────────────────────────────────────────
interface Pill {
    label: string;
    bgFrom: string;
    bgTo: string;
    border: string;
    text: string;
    rotate: string;
    translate: string;
    delay: string;
}

interface TimelineStep {
    day: string;
    label: string;
    color: string;
    bgColor: string;
    emoji: string;
    emojiLabel: string;
    left: string;
}

// ── Data ─────────────────────────────────────────────────────────────────────
const PILLS: Pill[] = [
    { label: 'Ω3', bgFrom: '#fef3c7', bgTo: '#fde68a', border: '#d97706', text: '#92400e', rotate: '-18deg', translate: 'translate(-110px,-8px)', delay: '0s' },
    { label: 'Vit C', bgFrom: '#fee2e2', bgTo: '#fca5a5', border: '#ef4444', text: '#991b1b', rotate: '8deg', translate: 'translate(-20px,-18px)', delay: '0.15s' },
    { label: 'Vit D', bgFrom: '#fffbeb', bgTo: '#fef08a', border: '#ca8a04', text: '#713f12', rotate: '-5deg', translate: 'translate(75px,-10px)', delay: '0.3s' },
    { label: 'Iron', bgFrom: '#f0fdf4', bgTo: '#86efac', border: '#16a34a', text: '#14532d', rotate: '14deg', translate: 'translate(-65px,18px)', delay: '0.45s' },
    { label: 'Ca', bgFrom: '#eff6ff', bgTo: '#93c5fd', border: '#3b82f6', text: '#1e3a8a', rotate: '-10deg', translate: 'translate(28px,20px)', delay: '0.6s' },
    { label: 'Magnesium', bgFrom: '#fdf4ff', bgTo: '#e879f9', border: '#a855f7', text: '#4a044e', rotate: '6deg', translate: 'translate(-28px,50px)', delay: '0.75s' },
];

const TIMELINE_STEPS: TimelineStep[] = [
    { day: '1', label: 'Day 1', color: '#15803d', bgColor: '#15803d', emoji: '🔥', emojiLabel: 'Excited!', left: '4.5%' },
    { day: '3', label: 'Day 3', color: '#15803d', bgColor: '#15803d', emoji: '💪', emojiLabel: 'Going well', left: '23%' },
    { day: '7', label: 'Day 7', color: '#ca8a04', bgColor: '#ca8a04', emoji: '😓', emojiLabel: 'Getting hard', left: '50%' },
    { day: '14', label: 'Day 14', color: '#dc2626', bgColor: '#dc2626', emoji: '😴', emojiLabel: 'Forgot again', left: '73%' },
];

// ── SVG Illustrations ─────────────────────────────────────────────────────────

function PillStackIllustration() {
    const pillRows = [
        { y: 10, w: 52, x: 8, color: '#fde68a', border: '#d97706', label: 'Ω3' },
        { y: 28, w: 44, x: 12, color: '#fca5a5', border: '#ef4444', label: 'Vit C' },
        { y: 46, w: 56, x: 6, color: '#86efac', border: '#16a34a', label: 'Iron' },
        { y: 64, w: 40, x: 16, color: '#93c5fd', border: '#3b82f6', label: 'Vit D' },
        { y: 82, w: 36, x: 20, color: '#e879f9', border: '#a855f7', label: 'Mg', opacity: 0.6 },
    ];
    return (
        <svg viewBox="0 0 100 115" width={90} height={105}>
            {pillRows.map((p, i) => (
                <g key={i}>
                    <rect x={p.x} y={p.y} width={p.w} height={16} rx={8} fill={p.color} stroke={p.border} strokeWidth={1.5} opacity={p.opacity ?? 1} />
                    <text x={p.x + p.w / 2} y={p.y + 11} textAnchor="middle" fontFamily="'Caveat',cursive" fontSize={8} fontWeight={700} fill={p.border}>{p.label}</text>
                </g>
            ))}
            <circle cx={82} cy={48} r={14} fill="#dc2626" />
            <text x={82} y={53} textAnchor="middle" fontFamily="'Fraunces',serif" fontSize={13} fontWeight={900} fill="white">6+</text>
        </svg>
    );
}

function ClockIllustration() {
    return (
        <svg viewBox="0 0 100 90" width={90} height={85}>
            <circle cx={50} cy={48} r={36} fill="#ffedd5" stroke="#ea580c" strokeWidth={2} />
            <circle cx={50} cy={48} r={30} fill="white" stroke="#ea580c" strokeWidth={1} opacity={0.5} />
            <line x1={50} y1={18} x2={50} y2={24} stroke="#ea580c" strokeWidth={2} strokeLinecap="round" />
            <line x1={50} y1={72} x2={50} y2={78} stroke="#ea580c" strokeWidth={2} strokeLinecap="round" />
            <line x1={20} y1={48} x2={26} y2={48} stroke="#ea580c" strokeWidth={2} strokeLinecap="round" />
            <line x1={74} y1={48} x2={80} y2={48} stroke="#ea580c" strokeWidth={2} strokeLinecap="round" />
            <line x1={50} y1={48} x2={40} y2={30} stroke="#ea580c" strokeWidth={2.5} strokeLinecap="round" />
            <line x1={50} y1={48} x2={65} y2={40} stroke="#111" strokeWidth={2} strokeLinecap="round" />
            <circle cx={50} cy={48} r={3} fill="#ea580c" />
            <text x={50} y={14} textAnchor="middle" fontFamily="'Caveat',cursive" fontSize={9} fill="#ea580c" fontWeight={700}>When?</text>
        </svg>
    );
}

function ChecklistIllustration() {
    const rows = [
        { checked: true, x: false },
        { checked: false, x: false },
        { checked: false, x: true },
        { checked: false, x: true },
    ];
    return (
        <svg viewBox="0 0 120 96" width={110} height={90}>
            {rows.map((row, i) => (
                <g key={i} transform={`translate(0,${i * 23})`}>
                    <rect x={0} y={0} width={110} height={19} rx={5} fill="white" stroke={row.checked ? '#0ea5e9' : '#e2e8f0'} strokeWidth={1.2} />
                    <rect x={3} y={3} width={13} height={13} rx={3} fill={row.checked ? '#bae6fd' : 'white'} stroke={row.checked ? '#0ea5e9' : '#cbd5e1'} strokeWidth={1} />
                    {row.checked && <path d="M5,9 L9,13 L15,6" fill="none" stroke="#0ea5e9" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />}
                    {row.x && (
                        <>
                            <line x1={5} y1={3} x2={15} y2={16} stroke="#ef4444" strokeWidth={1.5} strokeLinecap="round" />
                            <line x1={15} y1={3} x2={5} y2={16} stroke="#ef4444" strokeWidth={1.5} strokeLinecap="round" />
                        </>
                    )}
                    <line x1={20} y1={9.5} x2={90} y2={9.5} stroke="#94a3b8" strokeWidth={1.5} strokeLinecap="round" />
                </g>
            ))}
            <text x={112} y={54} fontSize={16}>😵</text>
        </svg>
    );
}

function TangledLinesIllustration() {
    return (
        <svg viewBox="0 0 120 70" width={110} height={65}>
            <path d="M12,5 Q52,22 92,5 Q72,40 32,30 Q72,50 112,30 Q92,60 52,50 Q82,68 102,56" fill="none" stroke="#15803d" strokeWidth={2} strokeLinecap="round" opacity={0.7} />
            <circle cx={12} cy={5} r={4} fill="#15803d" />
            <circle cx={102} cy={56} r={4} fill="#dc2626" />
        </svg>
    );
}

function StickFigureIllustration() {
    return (
        <svg viewBox="0 0 80 80" width={70} height={70}>
            <circle cx={32} cy={10} r={9} fill="none" stroke="#991b1b" strokeWidth={1.8} />
            <line x1={32} y1={19} x2={32} y2={44} stroke="#991b1b" strokeWidth={1.8} strokeLinecap="round" />
            <line x1={32} y1={28} x2={18} y2={38} stroke="#991b1b" strokeWidth={1.8} strokeLinecap="round" />
            <line x1={32} y1={28} x2={44} y2={22} stroke="#991b1b" strokeWidth={1.8} strokeLinecap="round" />
            <line x1={32} y1={44} x2={20} y2={58} stroke="#991b1b" strokeWidth={1.8} strokeLinecap="round" />
            <line x1={32} y1={44} x2={44} y2={58} stroke="#991b1b" strokeWidth={1.8} strokeLinecap="round" />
            <rect x={44} y={16} width={28} height={10} rx={3} fill="#fca5a5" stroke="#ef4444" strokeWidth={1} />
            <text x={58} y={24} textAnchor="middle" fontFamily="'Caveat',cursive" fontSize={8} fill="#991b1b" fontWeight={700}>6 pills</text>
            <text x={32} y={74} textAnchor="middle" fontFamily="'Caveat',cursive" fontSize={11} fill="#991b1b" fontWeight={700}>Tries hard.</text>
        </svg>
    );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function FloatingPill({ pill }: { pill: Pill }) {
    return (
        <div className="absolute" style={{ transform: `${pill.translate} rotate(${pill.rotate})`, animation: `pillBob 3s ease-in-out infinite`, animationDelay: pill.delay }}>
            <div className="flex items-center overflow-hidden rounded-full border-2 px-3 py-1" style={{ background: `linear-gradient(135deg, ${pill.bgFrom}, ${pill.bgTo})`, borderColor: pill.border, minWidth: '58px' }}>
                <div className="rounded-full mr-2 flex-shrink-0" style={{ width: 22, height: 22, background: pill.bgTo, border: `1px solid ${pill.border}` }} />
                <span className="font-bold text-xs whitespace-nowrap" style={{ fontFamily: "'Caveat',cursive", fontSize: 12, color: pill.text }}>{pill.label}</span>
            </div>
        </div>
    );
}

function DashedArrow({ vertical = true }: { vertical?: boolean }) {
    if (vertical) {
        return (
            <div className="flex justify-center my-1">
                <svg viewBox="0 0 2 32" width={2} height={32}>
                    <line x1={1} y1={0} x2={1} y2={27} stroke="#15803d" strokeWidth={2} strokeDasharray="4 3" strokeLinecap="round" />
                    <path d="M-3,22 L1,32 L5,22" fill="none" stroke="#15803d" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
        );
    }
    return (
        <div className="flex items-center justify-center w-8">
            <svg viewBox="0 0 32 2" width={32} height={2}>
                <line x1={0} y1={1} x2={27} y2={1} stroke="#15803d" strokeWidth={2} strokeDasharray="4 3" strokeLinecap="round" />
                <path d="M22,-3 L32,1 L22,5" fill="none" stroke="#15803d" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </div>
    );
}

function SpinningStarDoodle({ size = 60 }: { size?: number }) {
    return (
        <svg viewBox="0 0 80 80" width={size} height={size} style={{ animation: 'spinSlow 18s linear infinite', transformOrigin: 'center' }}>
            <polygon points="40,4 43,28 55,14 47,36 65,30 49,44 65,58 43,52 40,76 37,52 15,58 31,44 15,30 33,36 25,14 37,28" fill="none" stroke="#22c55e" strokeWidth={2} />
        </svg>
    );
}

// ── Root Component ────────────────────────────────────────────────────────────

export default function WhatDoWeDoToday() {
    const [animated, setAnimated] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const obs = new IntersectionObserver(
            entries => { if (entries[0].isIntersecting) { setAnimated(true); obs.disconnect(); } },
            { threshold: 0.08 }
        );
        if (sectionRef.current) obs.observe(sectionRef.current);
        return () => obs.disconnect();
    }, []);

    const fadeUp = (delay: string) => ({
        opacity: animated ? 1 : 0,
        transform: animated ? 'translateY(0)' : 'translateY(16px)',
        transition: `opacity 0.6s ease ${delay}, transform 0.6s ease ${delay}`,
    });

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,700;0,9..144,900;1,9..144,700&family=DM+Sans:wght@400;600;700&family=Caveat:wght@400;600;700&display=swap');

        @keyframes pillBob {
          0%, 100% { margin-top: 0; }
          50% { margin-top: -6px; }
        }
        @keyframes spinSlow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulseScale { 0%, 100% { transform: scale(1) rotate(-0.5deg); } 50% { transform: scale(1.025) rotate(-0.5deg); } }
        @keyframes pulseDot { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(0.6); opacity: 0.5; } }

        .notepad-pulse { animation: pulseScale 2.5s ease-in-out infinite; }
        .dot-pulse { animation: pulseDot 2s ease-in-out infinite; }
        .section-grid-bg {
          background-image: linear-gradient(rgba(21,128,61,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(21,128,61,0.04) 1px, transparent 1px);
          background-size: 44px 44px;
        }
      `}</style>

            <section
                ref={sectionRef}
                className="relative overflow-hidden bg-[#fafaf7] section-grid-bg py-12 px-6 md:px-10 lg:px-16"
            >
                {/* Background doodle dots */}
                <div className="pointer-events-none absolute inset-0 opacity-[0.06]">
                    {[[40, 80], [200, 40], [490, 60], [600, 30], [30, 340], [680, 300]].map(([x, y], i) => (
                        <div key={i} className="absolute w-1.5 h-1.5 rounded-full bg-[#0f4a23]" style={{ left: x, top: y }} />
                    ))}
                </div>
                <div className="absolute top-5 left-5 opacity-20 pointer-events-none"><SpinningStarDoodle size={44} /></div>
                <div className="absolute top-5 right-5 pointer-events-none">
                    <svg viewBox="0 0 60 60" width={44} height={44}>
                        <polygon points="30,3 34,21 52,18 40,30 48,47 30,40 12,47 20,30 8,18 26,21" fill="#dcfce7" stroke="#15803d" strokeWidth={1.5} />
                        <text x={30} y={34} textAnchor="middle" fontFamily="'Caveat',cursive" fontSize={10} fill="#0f4a23" fontWeight={700}>NEW</text>
                    </svg>
                </div>

                <div className="max-w-6xl mx-auto">

                    {/* ══════════ HEADER ══════════ */}
                    <div className="text-center mb-8" style={fadeUp('0s')}>
                        <div className="inline-flex items-center gap-2 mb-4">
                            <div className="w-2 h-2 rounded-full bg-[#22c55e] dot-pulse" />
                            <span className="text-[#15803d] tracking-[0.18em] uppercase font-semibold" style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11 }}>
                                What do we do today?
                            </span>
                        </div>
                        <h2 className="text-[#111410] leading-[1.08] tracking-tight mb-2" style={{ fontFamily: "'Fraunces',serif", fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 900 }}>
                            Turn to{' '}
                            <span className="relative text-[#15803d] italic inline-block">
                                supplements.
                                <svg viewBox="0 0 300 14" preserveAspectRatio="none" height={9} className="absolute bottom-[-3px] left-0 w-full pointer-events-none">
                                    <path d="M4,9 Q75,3 150,7 Q225,11 296,5" fill="none" stroke="#22c55e" strokeWidth={4} strokeLinecap="round" />
                                </svg>
                            </span>
                        </h2>
                        <p className="text-[#4b5563] mt-3" style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15 }}>
                            Most people fill the nutrition gap this way — but this creates <strong className="text-[#dc2626]">another problem.</strong>
                        </p>
                    </div>

                    {/* ══════════ MAIN TWO-COLUMN LAYOUT ══════════ */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

                        {/* ── LEFT COLUMN ── */}
                        <div className="flex flex-col gap-4">

                            {/* Floating Pills + 3 Problem Cards */}
                            <div className="rounded-2xl border-2 border-[#0f4a23] overflow-hidden p-5" style={{ background: '#fefce8', boxShadow: '4px 5px 0 #0f4a23', ...fadeUp('0.1s') }}>
                                <p className="text-[#6b7a6e] uppercase tracking-[0.15em] font-semibold mb-3" style={{ fontFamily: "'DM Mono',monospace", fontSize: 10 }}>The supplement problem</p>

                                {/* Pills cluster */}
                                <div className="relative h-44 flex items-center justify-center mb-3">
                                    <div className="relative w-36 h-36">
                                        {PILLS.map((pill, i) => <FloatingPill key={i} pill={pill} />)}
                                    </div>
                                </div>

                                {/* 3 mini problem cards in a row */}
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { title: 'Multiple\nsupplements', bg: '#fefce8', uc: '#ca8a04', rotate: '-1.5deg', illustration: <PillStackIllustration /> },
                                        { title: 'Different\ntimings', bg: '#fff7ed', uc: '#ea580c', rotate: '0.8deg', illustration: <ClockIllustration /> },
                                        { title: 'Difficult\nto track', bg: '#f0f9ff', uc: '#0ea5e9', rotate: '-1deg', illustration: <ChecklistIllustration /> },
                                    ].map((card, i) => (
                                        <div
                                            key={i}
                                            className="rounded-xl border-2 border-[#0f4a23] p-3 flex flex-col items-center gap-1"
                                            style={{ background: card.bg, transform: `rotate(${card.rotate})`, boxShadow: '3px 4px 0 #0f4a23' }}
                                        >
                                            <div className="flex items-center justify-center">{card.illustration}</div>
                                            <p className="text-center" style={{ fontFamily: "'Caveat',cursive", fontSize: 14, fontWeight: 700, color: '#0f4a23', whiteSpace: 'pre-line' }}>{card.title}</p>
                                            <svg viewBox="0 0 100 6" width={70}>
                                                <path d="M4,4 Q50,1 96,4" fill="none" stroke={card.uc} strokeWidth={2.5} strokeLinecap="round" />
                                            </svg>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Busy Life Notepad */}
                            <div style={fadeUp('0.2s')}>
                                <div className="relative rounded-xl border-2 border-[#0f4a23] overflow-hidden" style={{ background: '#fffef0', boxShadow: '4px 5px 0 #0f4a23', transform: 'rotate(-0.4deg)' }}>
                                    <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(transparent, transparent 27px, rgba(21,128,61,0.08) 27px, rgba(21,128,61,0.08) 28px)', backgroundPositionY: 28 }} />
                                    <div className="absolute left-[20px] top-0 bottom-0 w-[2px] bg-red-300 opacity-30" />
                                    <div className="relative z-10 p-4 pl-8">
                                        <p className="text-[#6b7a6e] uppercase tracking-[0.15em] font-semibold mb-2" style={{ fontFamily: "'DM Mono',monospace", fontSize: 10 }}>In daily life →</p>
                                        <p className="text-[#0f4a23] leading-[1.7]" style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14 }}>
                                            In a <strong>busy daily life,</strong> maintaining this routine becomes hard.<br />
                                            Most people start with <strong>good intent</strong> but stop within days or weeks.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Timeline */}
                            <div className="rounded-2xl border-2 border-[#0f4a23] p-4" style={{ background: '#f0fdf4', boxShadow: '4px 5px 0 #0f4a23', ...fadeUp('0.25s') }}>
                                <p className="text-[#6b7a6e] uppercase tracking-[0.15em] font-semibold mb-3" style={{ fontFamily: "'DM Mono',monospace", fontSize: 10 }}>How it usually goes</p>

                                {/* Day labels */}
                                <div className="relative h-5 mb-1">
                                    {TIMELINE_STEPS.map((step, i) => (
                                        <span key={i} className="absolute -translate-x-1/2 font-bold" style={{ fontFamily: "'Caveat',cursive", left: step.left, color: step.color, fontSize: 12 }}>{step.label}</span>
                                    ))}
                                    <span className="absolute -translate-x-1/2 font-bold text-[#dc2626]" style={{ fontFamily: "'Caveat',cursive", left: '90%', fontSize: 13 }}>Stop.</span>
                                </div>

                                {/* Track */}
                                <div className="relative h-3 rounded-full bg-slate-100 mx-1">
                                    <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: animated ? '75%' : '0%', background: 'linear-gradient(90deg, #15803d 0%, #15803d 60%, rgba(21,128,61,0) 100%)', transition: 'width 1.2s cubic-bezier(0.22,1,0.36,1)' }} />
                                    {TIMELINE_STEPS.map((step, i) => (
                                        <div key={i} className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full flex items-center justify-center text-white shadow-sm" style={{ left: step.left, background: step.bgColor, fontSize: 9, fontFamily: "'Fraunces',serif", fontWeight: 900 }}>{step.day}</div>
                                    ))}
                                    <div className="absolute top-[-5px] bottom-[-5px] border-r-2 border-dashed border-[#dc2626] opacity-60" style={{ left: '90%' }} />
                                </div>

                                {/* Emojis */}
                                <div className="relative h-10 mt-1">
                                    {TIMELINE_STEPS.map((step, i) => (
                                        <div key={i} className="absolute -translate-x-1/2 flex flex-col items-center" style={{ left: step.left }}>
                                            <span style={{ fontSize: 13 }}>{step.emoji}</span>
                                            <span style={{ fontFamily: "'Caveat',cursive", fontSize: 10, color: step.color }}>{step.emojiLabel}</span>
                                        </div>
                                    ))}
                                    <div className="absolute -translate-x-1/2 flex flex-col items-center" style={{ left: '90%' }}>
                                        <span style={{ fontSize: 13 }}>😴</span>
                                        <span style={{ fontFamily: "'Caveat',cursive", fontSize: 10, color: '#dc2626' }}>Forgot again</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── RIGHT COLUMN ── */}
                        <div className="flex flex-col gap-4">

                            {/* NOT effort / Complexity split */}
                            <div className="grid grid-cols-2 gap-4" style={fadeUp('0.15s')}>
                                {/* Not effort */}
                                <div className="rounded-xl border-[1.5px] border-[#ef4444] p-4" style={{ background: '#fee2e2' }}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-7 h-7 rounded-full bg-[#fca5a5] border border-[#ef4444] flex items-center justify-center flex-shrink-0">
                                            <svg viewBox="0 0 16 16" width={12} height={12}>
                                                <line x1={4} y1={4} x2={12} y2={12} stroke="#ef4444" strokeWidth={2} strokeLinecap="round" />
                                                <line x1={12} y1={4} x2={4} y2={12} stroke="#ef4444" strokeWidth={2} strokeLinecap="round" />
                                            </svg>
                                        </div>
                                        <p className="font-black text-[#991b1b]" style={{ fontFamily: "'Fraunces',serif", fontSize: 17 }}>Not effort.</p>
                                    </div>
                                    <div className="flex justify-center py-1"><StickFigureIllustration /></div>
                                    <p className="text-center text-[#b91c1c] text-xs mt-1" style={{ fontFamily: "'DM Sans',sans-serif" }}>People try hard — and still quit.</p>
                                </div>

                                {/* It IS complexity */}
                                <div className="rounded-xl border-[1.5px] border-[#16a34a] p-4" style={{ background: '#dcfce7' }}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-7 h-7 rounded-full bg-[#86efac] border border-[#16a34a] flex items-center justify-center flex-shrink-0">
                                            <svg viewBox="0 0 16 16" width={12} height={12}>
                                                <path d="M3,9 L7,13 L13,5" fill="none" stroke="#15803d" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="font-black text-[#15803d] leading-tight" style={{ fontFamily: "'Fraunces',serif", fontSize: 17 }}>The system<br />is complex.</p>
                                        </div>
                                    </div>
                                    <div className="flex justify-center py-1"><TangledLinesIllustration /></div>
                                    <p className="text-center text-[#15803d] text-xs mt-1" style={{ fontFamily: "'DM Sans',sans-serif" }}>Simplify → stay consistent.</p>
                                </div>
                            </div>

                            {/* Real Insight Notepad */}
                            <div style={fadeUp('0.3s')}>
                                <div className="notepad-pulse relative rounded-xl border-2 border-[#0f4a23] overflow-hidden" style={{ background: '#fffef0', boxShadow: '5px 6px 0 #0f4a23', transform: 'rotate(-0.5deg)' }}>
                                    <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(transparent, transparent 27px, rgba(21,128,61,0.08) 27px, rgba(21,128,61,0.08) 28px)', backgroundPositionY: 28 }} />
                                    <div className="absolute left-[20px] top-0 bottom-0 w-[2px] bg-red-300 opacity-30" />
                                    <div className="relative z-10 p-5 pl-8">
                                        <p className="text-[#15803d] uppercase tracking-[0.15em] font-semibold mb-2" style={{ fontFamily: "'DM Mono',monospace", fontSize: 10 }}>The real insight</p>
                                        <p className="text-[#0f4a23] leading-[1.75]" style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15 }}>
                                            The real issue is not effort.<br />
                                            The issue is that the system is{' '}
                                            <span className="bg-[#fee2e2] text-[#991b1b] font-bold px-2 py-0.5 rounded">too complex.</span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* PlainFuel CTA card */}
                            <div className="rounded-2xl border-2 border-[#0f4a23] p-5 flex flex-col items-center justify-center gap-3" style={{ background: '#dcfce7', boxShadow: '4px 5px 0 #0f4a23', ...fadeUp('0.4s') }}>
                                <div className="flex items-center gap-3">
                                    <svg viewBox="0 0 80 40" width={40} className="opacity-50">
                                        <path d="M4,20 Q30,8 60,20" fill="none" stroke="#15803d" strokeWidth={3.5} strokeLinecap="round" />
                                        <path d="M52,10 L64,20 L52,30" fill="none" stroke="#15803d" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <span className="text-[#15803d] uppercase tracking-[0.14em] font-semibold" style={{ fontFamily: "'DM Mono',monospace", fontSize: 11 }}>PlainFuel bridges this gap</span>
                                    <svg viewBox="0 0 80 40" width={40} className="opacity-50 scale-x-[-1]">
                                        <path d="M4,20 Q30,8 60,20" fill="none" stroke="#15803d" strokeWidth={3.5} strokeLinecap="round" />
                                        <path d="M52,10 L64,20 L52,30" fill="none" stroke="#15803d" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <p className="text-[#0f4a23] text-center text-sm leading-relaxed" style={{ fontFamily: "'DM Sans',sans-serif" }}>
                                    One simple daily routine. Everything you need.<br />
                                    <strong>Nothing you don't.</strong>
                                </p>
                                <div className="mt-1">
                                    <svg viewBox="0 0 300 12" width="200">
                                        <path d="M10,8 Q75,3 150,7 Q225,11 290,5" fill="none" stroke="#22c55e" strokeWidth={3} strokeLinecap="round" opacity={0.5} />
                                    </svg>
                                </div>
                            </div>

                            {/* Decorative squiggle */}
                            <div className="pointer-events-none">
                                <svg viewBox="0 0 500 16" width="100%" height={14}>
                                    <path d="M10,8 Q80,3 160,8 Q240,13 320,6 Q400,2 490,10" fill="none" stroke="#22c55e" strokeWidth={2} strokeLinecap="round" opacity={0.25} />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}