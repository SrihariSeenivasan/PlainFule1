"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";


/* ─── Palette ─────────────────────────────────────────────── */
const C = {
    green: "#1F5C3A",
    greenSoft: "#CFE8D6",
    mint: "#EAF5EE",
    bg: "#F4F1E8",
    pageBg: "#FDFAF2",
    grid: "#E2DDD2",
    text: "#2A2A2A",
    muted: "#7A7266",
    red: "#D64545",
    redSoft: "#F3D6D6",
    check: "#3FA66B",
    checkSoft: "#CDE7D4",
    yellow: "#F2C94C",
    orange: "#F2994A",
    blue: "#5DADE2",
    purple: "#BB6BD9",
    ruleLine: "#D8D3C8",
    marginLine: "#E8A0A0",
    tape: "#FFF6C2",
    tapeStroke: "#E8D87A",
    shadow: "rgba(30,40,20,0.14)",
};

interface Item { icon: string; title: string; desc: string; accent: string; bg: string }
interface Pill { label: string; color: string; bg: string }
interface Slide {
    id: string; tag: string; headline: string; body?: string;
    items?: Item[]; pills?: Pill[]; note: string; noteColor: string; stickerBg: string;
    image?: string;
}


const SLIDES: Slide[] = [
    {
        id: "what", tag: "01", headline: "What does \nPlainFuel do?",
        body: "PlainFuel simplifies this entire process. Instead of managing multiple supplements, you take one scoop daily. It can replace your regular protein scoop, while also providing essential vitamins, minerals, fiber, and digestive support. No extra planning. No extra tracking. Just a simple daily habit.",
        pills: [
            { label: "Protein", color: C.green, bg: C.greenSoft },
            { label: "Fiber", color: C.check, bg: C.checkSoft },
            { label: "Vitamins", color: C.orange, bg: "#FDE8CC" },
            { label: "Minerals", color: C.blue, bg: "#D6EEFA" },
            { label: "Enzymes", color: C.purple, bg: "#F0DCFB" },
        ],
        note: "No extra planning. No extra tracking. Just a simple daily habit.", noteColor: C.green, stickerBg: C.greenSoft,
        image: "/images/FiveInOne/1.png",
    },
    {
        id: "contains", tag: "02", headline: "Balanced.\nNot overloaded.",
        items: [
            { icon: "💪", title: "25g Protein", desc: "Whey protein with a complete amino acid profile", accent: C.green, bg: C.mint },
            { icon: "🌿", title: "6g Fiber", desc: "To support digestion", accent: C.check, bg: C.checkSoft },
            { icon: "☀️", title: "Vitamins", desc: "B-complex, Vitamin D3, and Vitamin C", accent: C.orange, bg: "#FDE8CC" },
            { icon: "⚡", title: "Minerals", desc: "Calcium, Magnesium, Zinc, and Selenium", accent: C.blue, bg: "#D6EEFA" },
            { icon: "🔬", title: "Digestive Enzymes", desc: "To improve absorption and reduce digestive issues", accent: C.purple, bg: "#F0DCFB" },
        ],
        note: "Consistent and balanced nutrition — not overloading the body.", noteColor: C.check, stickerBg: C.mint,
        image: "/images/FiveInOne/2.png",
    },
    {
        id: "helps", tag: "03", headline: "Your body.\nEvery day.",
        items: [
            { icon: "⚡", title: "Energy & Focus", desc: "B vitamins and magnesium help your body produce and use energy", accent: C.yellow, bg: "#FEF5D4" },
            { icon: "🌙", title: "Recovery & Sleep", desc: "Protein supports muscle recovery; magnesium helps with relaxation", accent: C.blue, bg: "#D6EEFA" },
            { icon: "🦴", title: "Bone & Structural Health", desc: "Calcium and Vitamin D3 support bone strength", accent: C.orange, bg: "#FDE8CC" },
            { icon: "🔄", title: "Daily Functioning", desc: "Zinc and other micronutrients support normal body processes", accent: C.check, bg: C.checkSoft },
        ],
        note: "Not about instant results — supporting your body every day.", noteColor: C.green, stickerBg: "#EFE7D6",
        image: "/images/FiveInOne/3.png",
    },
    {
        id: "fits", tag: "04", headline: "No perfection\nrequired.",
        items: [
            { icon: "☕", title: "One scoop daily", desc: "Take one scoop daily — simple as that", accent: C.green, bg: C.mint },
            { icon: "🔁", title: "Replace your protein", desc: "Replace your regular protein — no extra tubs", accent: C.check, bg: C.checkSoft },
            { icon: "🚫", title: "No multiple supplements", desc: "No need for multiple supplements", accent: C.red, bg: C.redSoft },
            { icon: "🥗", title: "Works with any diet", desc: "Fits with any diet you already follow", accent: C.blue, bg: "#D6EEFA" },
        ],
        note: "The focus is not perfection. The focus is consistency.", noteColor: C.orange, stickerBg: "#FDE8CC",
        image: "/images/FiveInOne/4.png",
    },
    {
        id: "final", tag: "05", headline: "Prevention.\nNot correction.",
        body: "Most health problems related to nutrition don't happen suddenly. They build over time. Prevention is easier than correction. Instead of fixing deficiencies after they appear, it is better to consistently meet your daily nutritional needs. PlainFuel is built around that idea. A simple habit. Done daily. Making nutrition easier to manage.",
        note: "A simple habit. Done daily.", noteColor: C.green, stickerBg: C.greenSoft,
        image: "/images/FiveInOne/5.png",
    },
];


/* ─── SVG Stickers ─────────────────────────────────────────── */
function StickerWhat() {
    return (
        <svg viewBox="0 0 300 360" fill="none" style={{ width: "100%", height: "100%" }}>
            <ellipse cx="150" cy="185" rx="105" ry="115" fill={C.greenSoft} stroke={C.green} strokeWidth="2.5" strokeDasharray="7 4" />
            <path d="M68 210 Q150 260 232 210 L245 110 Q150 72 55 110 Z" fill="#fff" fillOpacity="0.55" stroke={C.green} strokeWidth="2.2" strokeLinecap="round" />
            <path d="M55 110 Q150 148 245 110" stroke={C.green} strokeWidth="2.2" strokeLinecap="round" />
            <path d="M235 140 Q278 100 290 68" stroke={C.green} strokeWidth="3" strokeLinecap="round" />
            <circle cx="290" cy="62" r="7" fill={C.green} />
            <circle cx="290" cy="62" r="3.5" fill="white" />
            <ellipse cx="150" cy="100" rx="55" ry="19" fill={C.greenSoft} stroke={C.green} strokeWidth="1.8" strokeDasharray="5 3" />
            {([["VIT D3", C.yellow, "#FEF5D4", 22, 42], ["Zinc", C.blue, "#D6EEFA", 214, 38], ["Mg", C.purple, "#F0DCFB", 16, 240], ["Protein", C.check, C.checkSoft, 204, 258], ["Fiber", C.orange, "#FDE8CC", 30, 308]] as [string, string, string, number, number][]).map(([label, stroke, bg, x, y], i) => (
                <g key={i} transform={`rotate(${[-12, 8, -6, 10, -8][i]} ${x} ${y})`}>
                    <rect x={x} y={y} width="68" height="24" rx="12" fill={bg} stroke={stroke} strokeWidth="1.8" />
                    <text x={x + 12} y={y + 16} fontSize="11" fill={stroke} fontFamily="cursive" fontWeight="bold">{label}</text>
                </g>
            ))}
            <text x="106" y="195" fontSize="13" fill={C.green} fontFamily="cursive" opacity="0.65" fontWeight="bold">= everything ✓</text>
            <text x="242" y="130" fontSize="22" fill={C.green} opacity="0.3">✦</text>
            <text x="28" y="138" fontSize="16" fill={C.check} opacity="0.4">✦</text>
        </svg>
    );
}

function StickerContains() {
    const items: [string, string, string, string][] = [
        ["💪", "Protein", C.check, C.checkSoft], ["🌿", "Fiber", C.green, C.mint],
        ["☀️", "Vitamins", C.orange, "#FDE8CC"], ["⚡", "Minerals", C.blue, "#D6EEFA"], ["🔬", "Enzymes", C.purple, "#F0DCFB"],
    ];
    return (
        <svg viewBox="0 0 300 360" fill="none" style={{ width: "100%", height: "100%" }}>
            <circle cx="150" cy="185" r="135" stroke={C.green} strokeWidth="1.5" strokeDasharray="7 5" opacity="0.18" />
            <circle cx="150" cy="185" r="100" stroke={C.green} strokeWidth="1.2" strokeDasharray="5 4" opacity="0.22" />
            <circle cx="150" cy="185" r="62" stroke={C.green} strokeWidth="1" strokeDasharray="4 3" opacity="0.28" />
            <circle cx="150" cy="185" r="42" fill={C.greenSoft} stroke={C.green} strokeWidth="2.2" />
            <text x="128" y="180" fontSize="13" fill={C.green} fontFamily="cursive" fontWeight="bold">daily</text>
            <text x="124" y="196" fontSize="13" fill={C.green} fontFamily="cursive" fontWeight="bold">scoop</text>
            <text x="140" y="210" fontSize="12" fill={C.check}>✓</text>
            {items.map(([ico, label, stroke, ibg], i) => {
                const rad = (i / 5) * Math.PI * 2 - Math.PI / 2;
                const cx = 150 + 108 * Math.cos(rad), cy = 185 + 108 * Math.sin(rad);
                return (
                    <g key={i}>
                        <line x1={150} y1={185} x2={cx} y2={cy} stroke={stroke} strokeWidth="1.3" strokeDasharray="4 3" opacity="0.5" />
                        <circle cx={cx} cy={cy} r="26" fill={ibg} stroke={stroke} strokeWidth="1.8" />
                        <text x={cx - 8} y={cy - 3} fontSize="15">{ico}</text>
                        <text x={cx - (label.length * 3.2)} y={cy + 14} fontSize="9" fill={stroke} fontFamily="cursive" fontWeight="bold">{label}</text>
                    </g>
                );
            })}
            <text x="16" y="32" fontSize="11" fill={C.green} fontFamily="cursive" transform="rotate(-5,16,32)">all in one scoop!</text>
            <text x="26" y="210" fontSize="16" fill={C.yellow} opacity="0.5">✦</text>
            <text x="262" y="148" fontSize="13" fill={C.orange} opacity="0.45">✦</text>
        </svg>
    );
}

function StickerHelps() {
    return (
        <svg viewBox="0 0 300 360" fill="none" style={{ width: "100%", height: "100%" }}>
            <ellipse cx="150" cy="78" rx="36" ry="40" stroke={C.green} strokeWidth="2.2" fill={C.greenSoft} fillOpacity="0.5" />
            <path d="M125 115 Q104 152 115 225" stroke={C.green} strokeWidth="2.2" strokeLinecap="round" />
            <path d="M175 115 Q196 152 185 225" stroke={C.green} strokeWidth="2.2" strokeLinecap="round" />
            <path d="M125 115 L175 115" stroke={C.green} strokeWidth="2.2" strokeLinecap="round" />
            <path d="M125 132 Q94 160 82 194" stroke={C.green} strokeWidth="2" strokeLinecap="round" />
            <path d="M175 132 Q206 160 218 194" stroke={C.green} strokeWidth="2" strokeLinecap="round" />
            <path d="M120 224 L108 300 L94 345" stroke={C.green} strokeWidth="2.2" strokeLinecap="round" />
            <path d="M180 224 L192 300 L206 345" stroke={C.green} strokeWidth="2.2" strokeLinecap="round" />
            {[0, 36, 72, 108, 144, 180, 216, 252, 288, 324].map((deg, i) => {
                const r = (deg * Math.PI) / 180;
                return <line key={i} x1={150 + 38 * Math.cos(r)} y1={78 + 38 * Math.sin(r)} x2={150 + 52 * Math.cos(r)} y2={78 + 52 * Math.sin(r)} stroke={C.yellow} strokeWidth="1.8" strokeLinecap="round" opacity="0.85" />;
            })}
            {([[38, 108, "⚡", "Energy", "& Focus", C.yellow, "#FEF5D4"], [222, 108, "🌙", "Recovery", "& Sleep", C.blue, "#D6EEFA"], [38, 268, "🦴", "Bone", "Health", C.orange, "#FDE8CC"], [222, 268, "🔄", "Daily", "Functions", C.check, C.checkSoft]] as [number, number, string, string, string, string, string][]).map(([cx, cy, ico, l1, l2, stroke, bg]) => (
                <g key={`${cx}-${cy}`}>
                    <circle cx={cx} cy={cy} r="32" fill={bg} stroke={stroke} strokeWidth="1.8" />
                    <text x={cx - 10} y={cy - 6} fontSize="15">{ico}</text>
                    <text x={cx - (l1.length * 3.5)} y={cy + 9} fontSize="9" fill={C.text} fontFamily="cursive" fontWeight="bold">{l1}</text>
                    <text x={cx - (l2.length * 3.5)} y={cy + 20} fontSize="9" fill={C.text} fontFamily="cursive" fontWeight="bold">{l2}</text>
                </g>
            ))}
            <text x="118" y="352" fontSize="11" fill={C.green} fontFamily="cursive" opacity="0.7">every single day ✓</text>
        </svg>
    );
}

function StickerFits() {
    return (
        <svg viewBox="0 0 300 360" fill="none" style={{ width: "100%", height: "100%" }}>
            <rect x="30" y="48" width="240" height="220" rx="18" stroke={C.green} strokeWidth="2.2" fill={C.bg} fillOpacity="0.5" />
            <rect x="30" y="48" width="240" height="48" rx="18" stroke={C.green} strokeWidth="2.2" fill={C.greenSoft} />
            <text x="88" y="78" fontSize="16" fill={C.green} fontFamily="cursive" fontWeight="bold">Daily PlainFuel</text>
            <text x="244" y="78" fontSize="18">📅</text>
            {[0, 1, 2].map(row => [0, 1, 2, 3, 4, 5, 6].map(col => {
                const filled = row === 0 ? col < 6 : row === 1 ? col < 4 : col < 2;
                return (
                    <g key={`${row}-${col}`}>
                        <rect x={42 + col * 32} y={112 + row * 48} width="24" height="24" rx="6"
                            stroke={C.green} strokeWidth="1.3"
                            fill={filled ? C.greenSoft : "transparent"} strokeOpacity={filled ? 1 : 0.25} />
                        {filled && <text x={47 + col * 32} y={128 + row * 48} fontSize="11" fill={C.check}>✓</text>}
                    </g>
                );
            }))}
            <text x="196" y="322" fontSize="52">🔥</text>
            <text x="186" y="355" fontSize="12" fill={C.orange} fontFamily="cursive" fontWeight="bold">12-day streak!</text>
            <path d="M42 288 L68 326 L132 252" stroke={C.check} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            <text x="14" y="42" fontSize="18" fill={C.yellow} opacity="0.5">✦</text>
        </svg>
    );
}

function StickerFinal() {
    return (
        <svg viewBox="0 0 300 360" fill="none" style={{ width: "100%", height: "100%" }}>
            <circle cx="150" cy="185" r="135" fill={C.green} opacity="0.04" />
            <line x1="150" y1="340" x2="150" y2="38" stroke={C.green} strokeWidth="2" strokeDasharray="7 4" />
            <path d="M138 46 L150 24 L162 46" stroke={C.green} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <text x="158" y="30" fontSize="10" fill={C.green} fontFamily="cursive">results</text>
            {([318, 254, 192, 130, 68] as number[]).map((y, i) => {
                const r = 9 + i * 3;
                return (
                    <g key={i}>
                        <circle cx={150} cy={y} r={r} stroke={C.green} strokeWidth="1.8" fill={i === 4 ? C.greenSoft : C.bg} />
                        {i === 4 && <circle cx={150} cy={y} r={5} fill={C.green} />}
                    </g>
                );
            })}
            {([["start today", C.muted, 318], ["week 2 →", C.muted, 254], ["month 1 →", C.muted, 192], ["consistent ✓", C.green, 130], ["thriving ✦", C.green, 68]] as [string, string, number][]).map(([label, color, y], i) => (
                <text key={i} x="168" y={y + 4} fontSize="10" fill={color} fontFamily="cursive" fontWeight={i >= 3 ? "bold" : "normal"}>{label}</text>
            ))}
            <path d="M32 188 Q32 118 64 96 Q96 74 96 132 Q96 188 32 188 Z" stroke={C.green} strokeWidth="2" fill={C.greenSoft} fillOpacity="0.5" />
            <text x="44" y="148" fontSize="26">🛡️</text>
            <text x="22" y="198" fontSize="9" fill={C.green} fontFamily="cursive" fontWeight="bold">prevention</text>
            <text x="26" y="210" fontSize="8" fill={C.muted} fontFamily="cursive">not correction</text>
            <text x="38" y="354" fontSize="11" fill={C.green} fontFamily="cursive" opacity="0.65">a simple habit. done daily.</text>
            <text x="234" y="56" fontSize="18" fill={C.yellow} opacity="0.5">✦</text>
        </svg>
    );
}

function Sticker({ id }: { id: string }) {
    if (id === "what") return <StickerWhat />;
    if (id === "contains") return <StickerContains />;
    if (id === "helps") return <StickerHelps />;
    if (id === "fits") return <StickerFits />;
    return <StickerFinal />;
}

/* ─── Tape strip ───────────────────────────────────────────── */
function Tape({ rotate = -3, style: extraStyle = {} }: { rotate?: number; style?: React.CSSProperties }) {
    return (
        <div style={{
            width: 70, height: 20,
            backgroundColor: C.tape,
            border: `1px solid ${C.tapeStroke}`,
            borderRadius: 3,
            opacity: 0.88,
            transform: `rotate(${rotate}deg)`,
            boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
            position: "absolute",
            zIndex: 10,
            ...extraStyle,
        }} />
    );
}

/* ─── Notebook ruled lines ─────────────────────────────────── */
function RuledLines() {
    return (
        <>
            {Array.from({ length: 28 }).map((_, i) => (
                <div key={i} style={{
                    position: "absolute", left: 0, right: 0,
                    top: `${3.5 + i * 3.5}%`, height: 1,
                    backgroundColor: C.ruleLine, opacity: 0.65,
                    pointerEvents: "none",
                }} />
            ))}
            <div style={{
                position: "absolute", top: 0, bottom: 0, left: 58, width: 1.5,
                backgroundColor: C.marginLine, opacity: 0.6, pointerEvents: "none",
            }} />
            <div style={{
                position: "absolute", top: 0, bottom: 0, left: 0, width: 54,
                display: "flex", flexDirection: "column", justifyContent: "space-around",
                alignItems: "center", padding: "36px 0", pointerEvents: "none",
            }}>
                {[0, 1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} style={{
                        width: 14, height: 14, borderRadius: "50%",
                        border: `1.5px solid ${C.grid}`,
                        backgroundColor: C.bg,
                        boxShadow: "inset 0 1px 3px rgba(0,0,0,0.07)",
                    }} />
                ))}
            </div>
        </>
    );
}

/* ─── Main ─────────────────────────────────────────────────── */
interface Props { imageSrc?: string }

export default function PlainFuelCarousel({ imageSrc }: Props) {
    const [cur, setCur] = useState(0);
    const [flipping, setFlipping] = useState(false);
    const [flipDir, setFlipDir] = useState<"next" | "prev">("next");
    const [shown, setShown] = useState(0);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const goTo = useCallback((idx: number, dir: "next" | "prev") => {
        if (flipping || idx === cur) return;
        if (timerRef.current) clearInterval(timerRef.current);
        setFlipDir(dir);
        setFlipping(true);
        setTimeout(() => { setCur(idx); setShown(idx); }, 290);
        setTimeout(() => setFlipping(false), 580);
    }, [cur, flipping]);

    const next = useCallback(() => goTo((cur + 1) % SLIDES.length, "next"), [cur, goTo]);
    const prev = useCallback(() => goTo((cur - 1 + SLIDES.length) % SLIDES.length, "prev"), [cur, goTo]);

    useEffect(() => {
        timerRef.current = setInterval(next, 7000);
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, [next]);

    const s = SLIDES[shown];

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&family=Playfair+Display:ital,wght@0,700;1,600&display=swap');

        .pfbook { perspective: 1600px; }

        .pfbook-inner {
          transform-style: preserve-3d;
        }
        .pfbook-inner.fnext {
          animation: bookFlipNext 0.58s cubic-bezier(0.4,0,0.2,1) forwards;
        }
        .pfbook-inner.fprev {
          animation: bookFlipPrev 0.58s cubic-bezier(0.4,0,0.2,1) forwards;
        }
        @keyframes bookFlipNext {
          0%   { transform: rotateY(0deg)   translateY(0px); box-shadow: 0 24px 64px rgba(30,40,20,0.14); }
          30%  { transform: rotateY(-5deg)  translateY(-8px); box-shadow: 0 36px 80px rgba(30,40,20,0.22); }
          55%  { transform: rotateY(1.5deg) translateY(-2px); }
          100% { transform: rotateY(0deg)   translateY(0px); }
        }
        @keyframes bookFlipPrev {
          0%   { transform: rotateY(0deg)  translateY(0px); }
          30%  { transform: rotateY(5deg)  translateY(-8px); box-shadow: 0 36px 80px rgba(30,40,20,0.22); }
          55%  { transform: rotateY(-1.5deg) translateY(-2px); }
          100% { transform: rotateY(0deg)  translateY(0px); }
        }

        /* Right page peels */
        .pf-rpage { transform-origin: left center; transform-style: preserve-3d; }
        .pfbook-inner.fnext .pf-rpage {
          animation: pageNext 0.58s cubic-bezier(0.4,0,0.2,1) forwards;
        }
        .pfbook-inner.fprev .pf-rpage {
          animation: pagePrev 0.58s cubic-bezier(0.4,0,0.2,1) forwards;
        }
        @keyframes pageNext {
          0%   { transform: rotateY(0deg);   opacity:1; }
          35%  { transform: rotateY(-22deg); opacity:0.65; }
          60%  { transform: rotateY(5deg);   opacity:1; }
          100% { transform: rotateY(0deg);   opacity:1; }
        }
        @keyframes pagePrev {
          0%   { transform: rotateY(0deg);  opacity:1; }
          35%  { transform: rotateY(22deg); opacity:0.65; }
          60%  { transform: rotateY(-5deg); opacity:1; }
          100% { transform: rotateY(0deg);  opacity:1; }
        }

        /* Sticker bobs */
        .pf-stk {
          animation: stkFloat 4.2s ease-in-out infinite;
        }
        @keyframes stkFloat {
          0%,100% { transform: rotate(-2deg) translateY(0px); }
          50%      { transform: rotate(-2deg) translateY(-6px); }
        }
        .pfbook-inner.fnext .pf-stk,
        .pfbook-inner.fprev .pf-stk {
          animation: stkBob 0.58s ease forwards;
        }
        @keyframes stkBob {
          0%   { transform: rotate(-2deg) scale(1); }
          28%  { transform: rotate(3deg)  scale(1.06); }
          58%  { transform: rotate(-3deg) scale(0.97); }
          100% { transform: rotate(-2deg) scale(1); }
        }

        /* Content crossfade */
        .pf-content { }
        .pfbook-inner.fnext .pf-content {
          animation: cfNext 0.58s ease forwards;
        }
        .pfbook-inner.fprev .pf-content {
          animation: cfPrev 0.58s ease forwards;
        }
        @keyframes cfNext {
          0%   { opacity:1; transform:translateX(0); }
          28%  { opacity:0; transform:translateX(-20px); }
          58%  { opacity:0; transform:translateX(16px); }
          100% { opacity:1; transform:translateX(0); }
        }
        @keyframes cfPrev {
          0%   { opacity:1; transform:translateX(0); }
          28%  { opacity:0; transform:translateX(20px); }
          58%  { opacity:0; transform:translateX(-16px); }
          100% { opacity:1; transform:translateX(0); }
        }

        .pf-navbtn {
          transition: transform 0.12s ease, box-shadow 0.12s ease;
          cursor: pointer;
        }
        .pf-navbtn:hover  { transform: scale(1.09); }
        .pf-navbtn:active { transform: scale(0.91); }
        .pf-dot { transition: all 0.3s; cursor: pointer; border: none; }
      `}</style>

            <section style={{
                width: "100%",
                backgroundColor: C.bg,
                backgroundImage: `radial-gradient(${C.grid} 1.2px, transparent 1.2px)`,
                backgroundSize: "22px 22px",
                padding: "52px 24px 42px",
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}>
                {/* Eyebrow */}
                <div style={{ marginBottom: 28, display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 28, height: 1.5, background: C.green, opacity: 0.45 }} />
                    <span style={{ fontFamily: "'Caveat',cursive", fontSize: 18, fontWeight: 700, color: C.green, letterSpacing: "0.12em", textTransform: "uppercase", opacity: 0.7 }}>
                        Why PlainFuel?
                    </span>
                    <div style={{ width: 28, height: 1.5, background: C.green, opacity: 0.45 }} />
                </div>

                {/* ── Book ── */}
                <div className="pfbook" style={{ width: "100%", maxWidth: 920 }}>
                    <div
                        className={`pfbook-inner${flipping ? ` f${flipDir}` : ""}`}
                        style={{
                            display: "flex",
                            width: "100%",
                            borderRadius: 6,
                            boxShadow: `0 28px 72px ${C.shadow}, 0 6px 22px rgba(0,0,0,0.09)`,
                            transformOrigin: "center center",
                        }}
                    >
                        {/* ══ LEFT PAGE — sticker ══ */}
                        <div style={{
                            width: "38%", flexShrink: 0,
                            minHeight: 500,
                            backgroundColor: s.stickerBg,
                            borderRadius: "6px 0 0 6px",
                            position: "relative",
                            overflow: "hidden",
                            borderRight: `2px solid rgba(30,40,20,0.07)`,
                            backgroundImage: `linear-gradient(135deg,rgba(255,255,255,0.3) 0%,transparent 55%)`,
                        }}>
                            {/* Dot texture */}
                            <div style={{
                                position: "absolute", inset: 0,
                                backgroundImage: `radial-gradient(rgba(30,60,30,0.06) 1px, transparent 1px)`,
                                backgroundSize: "16px 16px", pointerEvents: "none",
                            }} />

                            {/* Top tape */}
                            <Tape rotate={-3} style={{ top: 10, left: "50%", transform: "translateX(-50%) rotate(-3deg)" }} />
                            {/* Bottom tape */}
                            <Tape rotate={4} style={{ bottom: 12, left: "50%", transform: "translateX(-50%) rotate(4deg)" }} />

                            {/* Slide tag badge */}
                            <div style={{
                                position: "absolute", top: 38, left: "50%",
                                transform: "translateX(-50%)",
                                zIndex: 11,
                                backgroundColor: "rgba(255,255,255,0.65)",
                                border: `1.5px solid ${C.green}40`,
                                borderRadius: 999,
                                padding: "2px 14px",
                                fontFamily: "'Caveat',cursive", fontSize: 12, fontWeight: 700,
                                color: C.green, backdropFilter: "blur(4px)",
                                whiteSpace: "nowrap",
                            }}>{s.tag} · {s.headline.replace("\n", " ")}</div>

                            {/* Page number */}
                            <div style={{
                                position: "absolute", bottom: 36, left: "50%",
                                transform: "translateX(-50%)",
                                fontFamily: "'Caveat',cursive", fontSize: 18, color: C.green, opacity: 0.45, zIndex: 11,
                            }}>✦ plainfuel ✦</div>

                            {/* Corner fold */}
                            <div style={{
                                position: "absolute", bottom: 0, right: 0, width: 0, height: 0,
                                borderStyle: "solid", borderWidth: "0 0 28px 28px",
                                borderColor: `transparent transparent rgba(0,0,0,0.05) transparent`,
                            }} />

                            {/* THE STICKER or IMAGE */}
                            <div className="pf-stk" style={{
                                position: "absolute",
                                top: 60, left: 14, right: 14, bottom: 48,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                filter: `drop-shadow(3px 8px 14px rgba(30,60,30,0.2))`,
                            }}>
                                {s.image ? (
                                    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                                        <Image
                                            src={s.image}
                                            alt={s.headline}
                                            fill
                                            style={{ objectFit: 'contain' }}
                                            priority={shown === cur}
                                        />
                                    </div>
                                ) : (
                                    <Sticker id={s.id} />
                                )}
                            </div>

                        </div>

                        {/* ══ RIGHT PAGE — notebook content ══ */}
                        <div
                            className="pf-rpage"
                            style={{
                                flex: 1,
                                backgroundColor: C.pageBg,
                                borderRadius: "0 6px 6px 0",
                                position: "relative",
                                overflow: "hidden",
                                display: "flex", flexDirection: "column",
                            }}
                        >
                            <RuledLines />

                            {/* Binding shadow */}
                            <div style={{
                                position: "absolute", top: 0, bottom: 0, left: 0, width: 20,
                                background: "linear-gradient(to right, rgba(0,0,0,0.055), transparent)",
                                pointerEvents: "none", zIndex: 1,
                            }} />

                            {/* Page corner fold top-right */}
                            <div style={{
                                position: "absolute", top: 0, right: 0, width: 0, height: 0,
                                borderStyle: "solid", borderWidth: "0 26px 26px 0",
                                borderColor: `transparent ${C.bg} transparent transparent`,
                                zIndex: 5,
                            }} />

                            {/* Content */}
                            <div className="pf-content" style={{
                                position: "relative", zIndex: 5, flex: 1,
                                display: "flex", flexDirection: "column",
                                padding: "28px 30px 18px 78px",
                            }}>
                                {/* Headline */}
                                <div>
                                    <h2 style={{
                                        fontFamily: "'Playfair Display',serif",
                                        fontSize: "clamp(2rem,2.7vw,3rem)",
                                        lineHeight: 1.08, color: C.text, margin: 0,
                                    }}>
                                        {s.headline.split("\n").map((l, i) => (
                                            <span key={i} style={{ display: "block" }}>{l}</span>
                                        ))}
                                    </h2>
                                    <svg viewBox="0 0 200 10" fill="none" style={{ width: 155, marginTop: 4 }}>
                                        <path d="M0 7 Q25 1 50 7 Q75 12 100 5 Q125 0 150 6 Q175 11 200 7"
                                            stroke={s.noteColor} strokeWidth="2.5" strokeLinecap="round" />
                                    </svg>
                                </div>

                                {/* Body */}
                                {s.body && (
                                    <p style={{
                                        fontSize: 20, lineHeight: 1.65, color: C.muted,
                                        marginTop: 14, marginBottom: 0,
                                        fontFamily: "'Caveat',cursive", maxWidth: 460,
                                    }}>{s.body}</p>
                                )}

                                {/* Pills */}
                                {s.pills && (
                                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 14 }}>
                                        {s.pills.map((p, i) => (
                                            <span key={i} style={{
                                                fontSize: 16, fontWeight: 700,
                                                color: p.color, backgroundColor: p.bg,
                                                border: `1.5px solid ${p.color}44`,
                                                padding: "4px 16px", borderRadius: 999,
                                                fontFamily: "'Caveat',cursive",
                                            }}>{p.label}</span>
                                        ))}
                                    </div>
                                )}

                                {/* Items */}
                                {s.items && (
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9, marginTop: 14 }}>
                                        {s.items.map((item, i) => (
                                            <div key={i} style={{
                                                display: "flex", alignItems: "flex-start", gap: 10,
                                                padding: "10px 13px", borderRadius: 12,
                                                backgroundColor: item.bg, border: `1.5px solid ${item.accent}30`,
                                            }}>
                                                <span style={{ fontSize: 22, lineHeight: 1, marginTop: 1 }}>{item.icon}</span>
                                                <div>
                                                    <p style={{ fontFamily: "'Caveat',cursive", fontWeight: 700, fontSize: 17, color: item.accent, margin: 0 }}>{item.title}</p>
                                                    <p style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.35, margin: 0 }}>{item.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Note */}
                                <div style={{ marginTop: 16, flex: 1, display: "flex", alignItems: "flex-end" }}>
                                    <span style={{
                                        display: "inline-flex", alignItems: "center", gap: 7,
                                        fontFamily: "'Caveat',cursive", fontSize: 18, fontWeight: 700,
                                        color: s.noteColor,
                                        backgroundColor: s.noteColor + "13",
                                        border: `1.5px solid ${s.noteColor}50`,
                                        padding: "6px 18px", borderRadius: 18,
                                    }}>✏️ {s.note}</span>
                                </div>
                            </div>

                            {/* ── Nav bar ── */}
                            <div style={{
                                position: "relative", zIndex: 10,
                                display: "flex", alignItems: "center", justifyContent: "space-between",
                                borderTop: `1.5px solid ${C.ruleLine}`,
                                padding: "11px 28px 13px 78px",
                                backgroundColor: C.pageBg,
                            }}>
                                {/* Dots */}
                                <div style={{ display: "flex", gap: 7, alignItems: "center" }}>
                                    {SLIDES.map((_, i) => (
                                        <button
                                            key={i}
                                            className="pf-dot"
                                            onClick={() => goTo(i, i > cur ? "next" : "prev")}
                                            style={{
                                                height: 9, width: i === cur ? 26 : 9, borderRadius: 999, padding: 0,
                                                backgroundColor: i === cur ? C.green : C.grid,
                                                cursor: "pointer",
                                            }}
                                        />
                                    ))}
                                </div>

                                {/* Flip buttons */}
                                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                                    <button
                                        className="pf-navbtn"
                                        onClick={prev}
                                        disabled={flipping}
                                        style={{
                                            width: 44, height: 44, borderRadius: "50%",
                                            border: `2px solid ${C.green}`, color: C.green,
                                            backgroundColor: "transparent", fontSize: 20,
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            boxShadow: `0 2px 8px ${C.green}1A`,
                                            fontFamily: "Georgia,serif",
                                        }}
                                    >‹</button>

                                    <div style={{
                                        fontFamily: "'Caveat',cursive", fontSize: 13, fontWeight: 700,
                                        color: C.green, opacity: 0.65,
                                        padding: "0 10px", border: `1.5px solid ${C.green}30`,
                                        borderRadius: 999, backgroundColor: C.green + "0B",
                                        minWidth: 52, height: 36,
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                    }}>
                                        {cur + 1} / {SLIDES.length}
                                    </div>

                                    <button
                                        className="pf-navbtn"
                                        onClick={next}
                                        disabled={flipping}
                                        style={{
                                            width: 44, height: 44, borderRadius: "50%",
                                            border: "none", backgroundColor: C.green, color: "#fff",
                                            fontSize: 20,
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            boxShadow: `0 4px 16px ${C.green}44`,
                                            fontFamily: "Georgia,serif",
                                        }}
                                    >›</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Hint */}
                <p style={{
                    marginTop: 18, fontSize: 13, color: C.muted,
                    fontFamily: "'Caveat',cursive", opacity: 0.6,
                }}>flip the pages to learn more ↑</p>
            </section>
        </>
    );
}