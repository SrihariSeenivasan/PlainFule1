'use client';

import {
    useEffect,
    useRef,
    useState,
    useCallback,
} from 'react';
import {
    motion,
    AnimatePresence,
    useSpring,
    useMotionValue,
    useTransform,
    MotionValue,
} from 'framer-motion';
import { ShoppingCart, ArrowRight, Zap, Shield, Star, type LucideIcon } from 'lucide-react';

/* ─────────────────────────────────────
   TYPES
───────────────────────────────────── */
interface Product {
    id: number;
    name: string;
    headline: string;
    sub: string;
    tag: string;
    duration: string;
    price: string;
    image: string;
    accent: string;
    accentDim: string;
    accentGlow: string;
    accentSoft: string;
    desc: string;
    badges: string[];
    icon: LucideIcon;
}

/* ─────────────────────────────────────
   DATA
───────────────────────────────────── */
const PRODUCTS: Product[] = [
    {
        id: 0,
        name: 'Starter Pack',
        headline: 'Begin.',
        sub: 'Delta',
        tag: 'Trial · 7 Pouches',
        duration: '7 Days',
        price: '₹1,500',
        image: '/images/product.png',
        accent: '#22c55e',
        accentDim: '#15803d',
        accentGlow: 'rgba(34,197,94,0.2)',
        accentSoft: 'rgba(34,197,94,0.07)',
        desc: 'The cleanest entry into peak performance. Seven precise pouches calibrated for first-cycle adaptation.',
        badges: ['7-Day Trial', 'Starter Formula', 'Free Delivery'],
        icon: Zap,
    },
    {
        id: 1,
        name: 'Balanced',
        headline: 'Sustain.',
        sub: 'Delta',
        tag: 'Subscription · 15 Pouches',
        duration: '15 Days',
        price: '₹2,500',
        image: '/images/product_premium.png',
        accent: '#22c55e',
        accentDim: '#15803d',
        accentGlow: 'rgba(34,197,94,0.2)',
        accentSoft: 'rgba(34,197,94,0.07)',
        desc: 'The sweet spot between performance and economics. Fifteen days of sustained cognitive fuel.',
        badges: ['15-Day Cycle', 'Balanced Formula', 'Priority Shipping'],
        icon: Shield,
    },
    {
        id: 2,
        name: 'Monthly',
        headline: 'Dominate.',
        sub: 'Delta',
        tag: 'Full Cycle · 30 Pouches',
        duration: '30 Days',
        price: '₹4,500',
        image: '/images/product_premium.png',
        accent: '#22c55e',
        accentDim: '#15803d',
        accentGlow: 'rgba(34,197,94,0.2)',
        accentSoft: 'rgba(34,197,94,0.07)',
        desc: 'Full commitment. Maximum transformation. The complete monthly protocol for serious operators.',
        badges: ['30-Day Protocol', 'Premium Formula', 'Exclusive Access'],
        icon: Star,
    },
];

/* ─────────────────────────────────────
   STABLE PARTICLES (generated once)
───────────────────────────────────── */
const PARTICLES = Array.from({ length: 22 }, (_, i) => ({
    id: i,
    x: (i * 37.3 + 11) % 100,
    y: (i * 53.7 + 7) % 100,
    size: (i % 3) + 1.5,
    duration: 6 + (i % 5) * 1.5,
    delay: (i % 7) * 0.8,
    opacity: 0.12 + (i % 4) * 0.08,
    driftX: ((i % 5) - 2) * 8,
}));

/* ─────────────────────────────────────
   PARTICLE FIELD
───────────────────────────────────── */
function ParticleField({ accent }: { accent: string }) {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {PARTICLES.map((p) => (
                <motion.div
                    key={p.id}
                    className="absolute rounded-full"
                    style={{
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                        width: p.size,
                        height: p.size,
                        backgroundColor: accent,
                    }}
                    animate={{
                        y: [0, -45, 0],
                        x: [0, p.driftX, 0],
                        opacity: [p.opacity, p.opacity * 2.5, p.opacity],
                        scale: [1, 1.9, 1],
                    }}
                    transition={{
                        duration: p.duration,
                        delay: p.delay,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />
            ))}
        </div>
    );
}

/* ─────────────────────────────────────
   HEXAGONAL GRID BACKDROP
   Replaces OrbitalRings — a living hex
   grid that pulses outward from center
───────────────────────────────────── */
const HEX_CELLS = Array.from({ length: 19 }, (_, i) => {
    // Arrange in a rough 4×5 offset grid
    const col = i % 4;
    const row = Math.floor(i / 4);
    const offsetX = (row % 2) * 28;
    return {
        id: i,
        cx: col * 56 + offsetX - 84,
        cy: row * 48 - 96,
        delay: (col + row) * 0.14,
        ring: col + row,
    };
});

function HexGrid({ accent }: { accent: string }) {
    return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
            <svg
                width="380"
                height="380"
                viewBox="-190 -190 380 380"
                style={{ opacity: 0.18 }}
            >
                {HEX_CELLS.map((cell) => (
                    <motion.polygon
                        key={cell.id}
                        points="0,-22 19,-11 19,11 0,22 -19,11 -19,-11"
                        fill="none"
                        stroke={accent}
                        strokeWidth="0.8"
                        transform={`translate(${cell.cx}, ${cell.cy})`}
                        animate={{
                            strokeOpacity: [0.2, 0.9, 0.2],
                            scale: [0.92, 1.06, 0.92],
                        }}
                        transition={{
                            duration: 3.2 + (cell.ring % 3) * 0.5,
                            delay: cell.delay,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                        style={{ transformOrigin: `${cell.cx}px ${cell.cy}px` }}
                    />
                ))}
            </svg>
        </div>
    );
}

/* ─────────────────────────────────────
   LIQUID MORPH BLOB
   A slow-morphing SVG blob that sits
   behind the product as a glow puddle
───────────────────────────────────── */
function LiquidBlob({ accent }: { accent: string }) {
    const paths = [
        'M60,-70C72,-55,72,-33,68,-12C64,9,56,28,42,47C28,66,8,85,-14,87C-36,89,-60,74,-74,53C-88,32,-92,5,-82,-18C-72,-41,-48,-60,-24,-72C0,-84,48,-85,60,-70Z',
        'M54,-64C68,-51,76,-30,74,-10C72,10,60,29,45,48C30,67,12,86,-10,88C-32,90,-58,75,-72,53C-86,31,-88,2,-78,-22C-68,-46,-46,-65,-23,-76C0,-87,40,-77,54,-64Z',
        'M58,-68C70,-53,70,-32,66,-12C62,8,54,27,40,46C26,65,6,84,-16,86C-38,88,-62,73,-74,51C-86,29,-86,0,-76,-25C-66,-50,-46,-71,-24,-80C-2,-89,46,-83,58,-68Z',
    ];
    return (
        <motion.div
            className="absolute pointer-events-none"
            style={{ width: 320, height: 320 }}
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        >
            <svg viewBox="-110 -110 220 220" width="100%" height="100%">
                <defs>
                    <radialGradient id="blobGrad" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor={accent} stopOpacity="0.22" />
                        <stop offset="100%" stopColor={accent} stopOpacity="0" />
                    </radialGradient>
                </defs>
                <motion.path
                    fill="url(#blobGrad)"
                    animate={{ d: [...paths, paths[0]] }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                />
            </svg>
        </motion.div>
    );
}

/* ─────────────────────────────────────
   SCAN LINES (cinematic TV-static feel)
───────────────────────────────────── */
function ScanLines({ accent }: { accent: string }) {
    return (
        <div
            className="absolute pointer-events-none rounded-full overflow-hidden"
            style={{ width: 260, height: 320, opacity: 0.5 }}
        >
            {/* Vertical sweep */}
            <motion.div
                className="absolute inset-0"
                style={{
                    background: `linear-gradient(180deg, transparent 0%, ${accent}18 50%, transparent 100%)`,
                    height: '30%',
                    top: 0,
                }}
                animate={{ top: ['-30%', '130%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear', repeatDelay: 1.8 }}
            />
        </div>
    );
}

/* ─────────────────────────────────────
   CORNER BRACKETS (tech targeting UI)
───────────────────────────────────── */
function TargetBrackets({ accent }: { accent: string }) {
    const corners = [
        { top: 0, left: 0, rotate: '0deg' },
        { top: 0, right: 0, rotate: '90deg' },
        { bottom: 0, right: 0, rotate: '180deg' },
        { bottom: 0, left: 0, rotate: '270deg' },
    ];
    return (
        <div className="absolute pointer-events-none" style={{ width: 200, height: 260 }}>
            {corners.map((c, i) => (
                <motion.div
                    key={i}
                    className="absolute"
                    style={{ ...c, width: 22, height: 22 }}
                    animate={{ opacity: [0.3, 0.9, 0.3] }}
                    transition={{ duration: 2.2, delay: i * 0.3, repeat: Infinity }}
                >
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                        <path
                            d="M1 12 L1 1 L12 1"
                            stroke={accent}
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            transform={`rotate(${c.rotate === undefined ? 0 : parseInt(c.rotate)}, 11, 11)`}
                        />
                    </svg>
                </motion.div>
            ))}
        </div>
    );
}

/* ─────────────────────────────────────
   DATA READOUT TICKS (floating HUD)
───────────────────────────────────── */
function HUDTicks({ accent, activeIdx }: { accent: string; activeIdx: number }) {
    const labels = [
        { label: 'PURITY', val: '99.2%', angle: -40, radius: 175 },
        { label: 'POTENCY', val: '4.8×', angle: 40, radius: 170 },
        { label: 'CYCLE', val: PRODUCTS[activeIdx].duration, angle: 0, radius: 195 },
    ];
    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={activeIdx}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
            >
                {labels.map((tick, i) => {
                    const rad = (tick.angle * Math.PI) / 180;
                    const x = Math.sin(rad) * tick.radius;
                    const y = -Math.cos(rad) * tick.radius * 0.6;
                    return (
                        <motion.div
                            key={tick.label}
                            className="absolute flex flex-col items-center"
                            style={{ transform: `translate(${x}px, ${y}px)` }}
                            initial={{ opacity: 0, scale: 0.6 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.12 + 0.2 }}
                        >
                            <motion.div
                                className="text-[8px] font-black tracking-[0.28em] mb-0.5"
                                style={{ color: accent, opacity: 0.6 }}
                            >
                                {tick.label}
                            </motion.div>
                            <motion.div
                                className="text-[13px] font-black"
                                style={{ color: accent }}
                                animate={{ opacity: [0.7, 1, 0.7] }}
                                transition={{ duration: 2.5, delay: i * 0.4, repeat: Infinity }}
                            >
                                {tick.val}
                            </motion.div>
                            {/* connector line */}
                            <motion.div
                                className="mt-1 rounded-full"
                                style={{ width: 1, height: 16, backgroundColor: accent, opacity: 0.3 }}
                            />
                        </motion.div>
                    );
                })}
            </motion.div>
        </AnimatePresence>
    );
}

/* ─────────────────────────────────────
   PRODUCT STAGE  ← FULLY REDESIGNED
───────────────────────────────────── */
function ProductStage({
    activeIdx,
    mouseX,
    mouseY,
}: {
    activeIdx: number;
    mouseX: MotionValue<number>;
    mouseY: MotionValue<number>;
}) {
    const product = PRODUCTS[activeIdx];
    const rotateX = useTransform(mouseY, [-0.5, 0.5], [10, -10]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], [-14, 14]);
    const springRX = useSpring(rotateX, { stiffness: 70, damping: 18 });
    const springRY = useSpring(rotateY, { stiffness: 70, damping: 18 });

    return (
        <div
            className="relative flex items-center justify-center"
            style={{ width: 400, height: 480 }}
        >
            {/* ── Layer 1: liquid blob background ── */}
            <LiquidBlob accent={product.accent} />

            {/* ── Layer 2: hex grid ── */}
            <HexGrid accent={product.accent} />

            {/* ── Layer 3: HUD data ticks ── */}
            <HUDTicks accent={product.accent} activeIdx={activeIdx} />

            {/* ── Layer 4: target brackets ── */}
            <div className="absolute flex items-center justify-center" style={{ zIndex: 8 }}>
                <TargetBrackets accent={product.accent} />
            </div>

            {/* ── Layer 5: scan line ── */}
            <div className="absolute flex items-center justify-center" style={{ zIndex: 9 }}>
                <ScanLines accent={product.accent} />
            </div>

            {/* ── Layer 6: ground shadow ── */}
            <motion.div
                className="absolute rounded-full blur-2xl"
                animate={{
                    backgroundColor: product.accent,
                    scaleX: [1, 1.2, 1],
                    opacity: [0.2, 0.3, 0.2],
                }}
                transition={{
                    backgroundColor: { duration: 0.7 },
                    scaleX: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
                    opacity: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
                }}
                style={{ width: 160, height: 20, bottom: 22 }}
            />

            {/* ── Layer 7: the product itself ── */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={`img-${activeIdx}`}
                    initial={{ opacity: 0, scale: 0.3, y: 60, rotateY: -45, filter: 'blur(12px)' }}
                    animate={{ opacity: 1, scale: 1, y: 0, rotateY: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, scale: 0.4, y: -50, rotateY: 45, filter: 'blur(8px)' }}
                    transition={{ duration: 0.65, type: 'spring', bounce: 0.22 }}
                    style={{
                        rotateX: springRX,
                        rotateY: springRY,
                        transformStyle: 'preserve-3d',
                        position: 'relative',
                        zIndex: 10,
                        // Multi-layer drop shadow for a "lit from below" neon feel
                        filter: [
                            `drop-shadow(0 40px 50px ${product.accentGlow})`,
                            `drop-shadow(0 0 18px ${product.accentGlow})`,
                            `drop-shadow(0 -6px 24px ${product.accentGlow})`,
                        ].join(' '),
                    }}
                >
                    {/* Slow breathe float */}
                    <motion.div
                        animate={{ y: [0, -22, 0], rotateZ: [-1, 1, -1] }}
                        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                    >
                        {/* Glint highlight that sweeps across product */}
                        <div style={{ position: 'relative' }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={product.image}
                                alt={product.name}
                                style={{ width: 220, height: 280, objectFit: 'contain', display: 'block' }}
                            />
                            {/* Glint sweep overlay */}
                            <motion.div
                                style={{
                                    position: 'absolute',
                                    inset: 0,
                                    background: `linear-gradient(115deg, transparent 20%, rgba(255,255,255,0.18) 50%, transparent 80%)`,
                                    borderRadius: 8,
                                    pointerEvents: 'none',
                                }}
                                animate={{ x: ['-120%', '180%'] }}
                                transition={{
                                    duration: 2.2,
                                    repeat: Infinity,
                                    ease: 'easeInOut',
                                    repeatDelay: 3.5,
                                }}
                            />
                        </div>
                    </motion.div>
                </motion.div>
            </AnimatePresence>

            {/* ── Layer 8: accent ring pulse (replaces orbital rings) ── */}
            {[1, 2, 3].map((ring) => (
                <motion.div
                    key={ring}
                    className="absolute rounded-full border pointer-events-none"
                    style={{ borderColor: product.accent }}
                    animate={{
                        width: [60, 360],
                        height: [60, 360],
                        opacity: [0.4, 0],
                    }}
                    transition={{
                        duration: 3.5,
                        delay: ring * 1.15,
                        repeat: Infinity,
                        ease: 'easeOut',
                    }}
                />
            ))}
        </div>
    );
}

/* ─────────────────────────────────────
   PRICE TICKER
───────────────────────────────────── */
function PriceTicker({ price }: { price: string }) {
    return (
        <AnimatePresence mode="wait">
            <motion.span
                key={price}
                initial={{ y: 34, opacity: 0, filter: 'blur(10px)' }}
                animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                exit={{ y: -34, opacity: 0, filter: 'blur(10px)' }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="inline-block"
            >
                {price}
            </motion.span>
        </AnimatePresence>
    );
}

/* ─────────────────────────────────────
   MAIN EXPORT
───────────────────────────────────── */
export default function ProductSection() {
    const wrapRef = useRef<HTMLDivElement>(null);
    const stageRef = useRef<HTMLDivElement>(null);
    const [activeIdx, setActiveIdx] = useState(0);
    const rawProgress = useMotionValue(0);
    const smoothProgress = useSpring(rawProgress, { stiffness: 50, damping: 18 });

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    useEffect(() => {
        const SECTION_HEIGHT = window.innerHeight * 3;

        function onScroll() {
            const wrap = wrapRef.current;
            if (!wrap) return;
            const top = wrap.getBoundingClientRect().top + window.scrollY;
            const scrolled = window.scrollY - top;
            const progress = Math.min(1, Math.max(0, scrolled / (SECTION_HEIGHT - window.innerHeight)));
            rawProgress.set(progress);
            if (progress < 1 / 3) setActiveIdx(0);
            else if (progress < 2 / 3) setActiveIdx(1);
            else setActiveIdx(2);
        }

        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
        return () => window.removeEventListener('scroll', onScroll);
    }, [rawProgress]);

    const bandStart = activeIdx / 3;
    const bandEnd = (activeIdx + 1) / 3;
    const fillProgress = useTransform(smoothProgress, [bandStart, bandEnd], [0, 1]);
    const fillWidth = useTransform(fillProgress, (v: number) =>
        `${Math.round(Math.min(100, Math.max(0, v * 100)))}%`
    );

    const handleMouseMove = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            const el = stageRef.current;
            if (!el) return;
            const r = el.getBoundingClientRect();
            mouseX.set((e.clientX - r.left) / r.width - 0.5);
            mouseY.set((e.clientY - r.top) / r.height - 0.5);
        },
        [mouseX, mouseY]
    );
    const handleMouseLeave = useCallback(() => {
        mouseX.set(0);
        mouseY.set(0);
    }, [mouseX, mouseY]);

    const product = PRODUCTS[activeIdx];
    const Icon = product.icon;

    return (
        <div ref={wrapRef} style={{ height: '300vh', position: 'relative' }}>
            <div
                style={{
                    position: 'sticky',
                    top: 0,
                    height: '100vh',
                    width: '100%',
                    overflow: 'hidden',
                    background: '#F5F5F5',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                {/* ── BACKGROUNDS ── */}
                <motion.div
                    className="absolute inset-0 pointer-events-none"
                    animate={{
                        background: `radial-gradient(ellipse 65% 65% at 62% 52%, ${product.accentGlow} 0%, transparent 65%)`,
                    }}
                    transition={{ duration: 0.9 }}
                />
                <motion.div
                    className="absolute inset-0 pointer-events-none"
                    animate={{
                        background: `radial-gradient(ellipse 38% 40% at 12% 78%, ${product.accentSoft} 0%, transparent 70%)`,
                    }}
                    transition={{ duration: 0.9 }}
                />
                <ParticleField accent={product.accent} />
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        opacity: 0.03,
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                    }}
                />

                {/* ── HEADER ── */}
                <div
                    style={{ flexShrink: 0 }}
                    className="relative z-20 flex items-start justify-between px-8 md:px-16 pt-8"
                >
                    <div>
                        <motion.div
                            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.35em] px-4 py-2 rounded-full border mb-3"
                            animate={{
                                borderColor: product.accent + '55',
                                color: product.accent,
                                backgroundColor: product.accentSoft,
                            }}
                            transition={{ duration: 0.6 }}
                        >
                            <motion.div
                                className="w-1.5 h-1.5 rounded-full"
                                animate={{ backgroundColor: product.accent, scale: [1, 1.6, 1] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            />
                            The Shop
                        </motion.div>
                        <div style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                            <div
                                className="text-black/40 font-sans font-light mb-1"
                                style={{ letterSpacing: '0.38em', fontSize: '0.75rem' }}
                            >
                                SELECT YOUR
                            </div>
                            <motion.div
                                className="text-5xl md:text-6xl font-black leading-none"
                                animate={{ color: product.accent }}
                                transition={{ duration: 0.6 }}
                            >
                                Fuel Cycle.
                            </motion.div>
                        </div>
                    </div>

                    {/* Step nav */}
                    <div className="hidden md:flex flex-col items-end gap-2">
                        <div className="flex items-center gap-2">
                            {PRODUCTS.map((p, i) => (
                                <motion.button
                                    key={i}
                                    whileHover={{ scale: 1.1 }}
                                    className="relative"
                                    onClick={() => {
                                        const wrap = wrapRef.current;
                                        if (!wrap) return;
                                        const top = wrap.getBoundingClientRect().top + window.scrollY;
                                        const sectionScroll = window.innerHeight * 2;
                                        window.scrollTo({ top: top + (i / 3) * sectionScroll, behavior: 'smooth' });
                                    }}
                                >
                                    <motion.div
                                        className="w-10 h-10 rounded-full border-2 flex items-center justify-center text-xs font-black"
                                        animate={{
                                            borderColor: i === activeIdx ? p.accent : 'rgba(0,0,0,0.1)',
                                            backgroundColor: i === activeIdx ? p.accent + '22' : 'transparent',
                                            color: i === activeIdx ? p.accent : 'rgba(0,0,0,0.25)',
                                        }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {String(i + 1).padStart(2, '0')}
                                    </motion.div>
                                    {i === activeIdx && (
                                        <motion.div
                                            layoutId="ring"
                                            className="absolute -inset-1 rounded-full border"
                                            style={{ borderColor: product.accent + '44' }}
                                        />
                                    )}
                                </motion.button>
                            ))}
                        </div>
                        <span className="text-black/40 text-[9px] tracking-widest">SCROLL TO EXPLORE</span>
                    </div>
                </div>

                {/* ── BODY ── */}
                <div
                    className="relative z-10 flex px-6 md:px-14 gap-4"
                    style={{ flex: 1, minHeight: 0, alignItems: 'center' }}
                >
                    {/* LEFT copy */}
                    <div className="flex flex-col justify-center" style={{ flex: 1, maxWidth: 420 }}>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={`tag-${activeIdx}`}
                                initial={{ opacity: 0, x: -24 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 24 }}
                                transition={{ duration: 0.36 }}
                                className="flex items-center gap-2 mb-3"
                            >
                                <motion.div
                                    className="p-1.5 rounded-lg"
                                    animate={{ backgroundColor: product.accentSoft }}
                                >
                                    <Icon style={{ color: product.accent }} className="w-4 h-4" />
                                </motion.div>
                                <span
                                    className="text-[10px] font-black tracking-[0.26em] uppercase"
                                    style={{ color: product.accent }}
                                >
                                    {product.tag}
                                </span>
                            </motion.div>
                        </AnimatePresence>

                        <div style={{ overflow: 'hidden', marginBottom: 4 }}>
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={`hl-${activeIdx}`}
                                    initial={{ y: '110%', opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: '-110%', opacity: 0 }}
                                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                    style={{
                                        fontFamily: "'Playfair Display', Georgia, serif",
                                        fontSize: 'clamp(3.2rem, 9vw, 6rem)',
                                        fontWeight: 900,
                                        lineHeight: 1,
                                        color: product.accent,
                                        textShadow: `0 0 60px ${product.accentGlow}`,
                                    }}
                                >
                                    {product.headline}
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={`sub-${activeIdx}`}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.36, delay: 0.06 }}
                                className="text-black/55 text-sm font-light tracking-[0.22em] uppercase mb-4"
                            >
                                {product.sub} {product.name}
                            </motion.div>
                        </AnimatePresence>

                        <AnimatePresence mode="wait">
                            <motion.p
                                key={`desc-${activeIdx}`}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.42, delay: 0.1 }}
                                className="text-black/50 text-sm leading-relaxed mb-5"
                                style={{ maxWidth: 300 }}
                            >
                                {product.desc}
                            </motion.p>
                        </AnimatePresence>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={`bdg-${activeIdx}`}
                                className="flex flex-wrap gap-2 mb-7"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.32 }}
                            >
                                {product.badges.map((badge, i) => (
                                    <motion.span
                                        key={badge}
                                        initial={{ opacity: 0, scale: 0.72 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: i * 0.07 + 0.1 }}
                                        className="px-3 py-1 rounded-full text-[10px] font-bold tracking-wider border"
                                        style={{
                                            borderColor: product.accent + '30',
                                            color: product.accent,
                                            backgroundColor: product.accentSoft,
                                        }}
                                    >
                                        {badge}
                                    </motion.span>
                                ))}
                            </motion.div>
                        </AnimatePresence>

                        <div className="flex items-center gap-5">
                            <div>
                                <div className="text-black/40 text-[9px] uppercase tracking-widest mb-1">Price</div>
                                <div
                                    className="font-black text-4xl md:text-5xl text-black"
                                    style={{
                                        fontFamily: "'Playfair Display', Georgia, serif",
                                        overflow: 'hidden',
                                        lineHeight: 1.1,
                                    }}
                                >
                                    <PriceTicker price={product.price} />
                                </div>
                                <div className="text-black/40 text-xs mt-1 tracking-wider">
                                    {product.duration} supply
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <AnimatePresence mode="wait">
                                    <motion.button
                                        key={`cta-${activeIdx}`}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        whileHover={{
                                            scale: 1.06,
                                            boxShadow: `0 0 40px ${product.accentGlow}`,
                                        }}
                                        whileTap={{ scale: 0.96 }}
                                        transition={{ duration: 0.26 }}
                                        className="flex items-center gap-2 px-6 py-3.5 rounded-2xl font-black text-sm tracking-widest text-black"
                                        style={{ backgroundColor: product.accent }}
                                    >
                                        <ShoppingCart className="w-4 h-4" />
                                        ORDER NOW
                                    </motion.button>
                                </AnimatePresence>

                                <motion.button
                                    whileHover={{ x: 5 }}
                                    transition={{ type: 'spring', stiffness: 300 }}
                                    className="flex items-center gap-1 text-black/40 text-xs tracking-widest hover:text-black/60 transition-colors"
                                >
                                    Details <ArrowRight className="w-3 h-3" />
                                </motion.button>
                            </div>
                        </div>
                    </div>

                    {/* CENTER product stage */}
                    <div
                        ref={stageRef}
                        style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', perspective: '1200px' }}
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                    >
                        <ProductStage activeIdx={activeIdx} mouseX={mouseX} mouseY={mouseY} />
                    </div>

                    {/* RIGHT rail */}
                    <div
                        className="hidden lg:flex flex-col items-center justify-center"
                        style={{ width: 68 }}
                    >
                        <div className="relative flex flex-col items-center">
                            <div
                                className="absolute top-0 bottom-0 w-px left-1/2 -translate-x-1/2"
                                style={{ backgroundColor: 'rgba(0,0,0,0.06)' }}
                            />
                            {PRODUCTS.map((p, i) => (
                                <button
                                    key={i}
                                    onClick={() => {
                                        const wrap = wrapRef.current;
                                        if (!wrap) return;
                                        const top = wrap.getBoundingClientRect().top + window.scrollY;
                                        const sectionScroll = window.innerHeight * 2;
                                        window.scrollTo({ top: top + (i / 3) * sectionScroll, behavior: 'smooth' });
                                    }}
                                    className="relative z-10 flex flex-col items-center gap-2 py-6"
                                >
                                    <motion.div
                                        className="rounded-full border-2"
                                        style={{ width: 12, height: 12 }}
                                        animate={{
                                            scale: i === activeIdx ? 1.5 : 1,
                                            borderColor: i === activeIdx ? p.accent : 'rgba(0,0,0,0.15)',
                                            backgroundColor: i === activeIdx ? p.accent : 'transparent',
                                            boxShadow: i === activeIdx ? `0 0 14px ${p.accent}` : 'none',
                                        }}
                                        transition={{ duration: 0.3 }}
                                    />
                                    <motion.span
                                        animate={{
                                            opacity: i === activeIdx ? 1 : 0.2,
                                            color: i === activeIdx ? p.accent : '#000000',
                                        }}
                                        transition={{ duration: 0.3 }}
                                        className="text-[8px] font-black uppercase"
                                        style={{ writingMode: 'vertical-rl', letterSpacing: '0.18em' }}
                                    >
                                        {p.name}
                                    </motion.span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── BOTTOM PROGRESS BAR ── */}
                <div
                    style={{ flexShrink: 0 }}
                    className="relative z-20 px-8 md:px-16 pb-6"
                >
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-black/35 text-[9px] tracking-widest uppercase font-mono">
                            {String(activeIdx + 1).padStart(2, '0')} / 03
                        </span>
                        <motion.span
                            className="text-[9px] font-bold tracking-widest uppercase"
                            animate={{ color: product.accent }}
                            transition={{ duration: 0.4 }}
                        >
                            {product.name}
                        </motion.span>
                    </div>
                    <div
                        style={{
                            height: 1,
                            width: '100%',
                            borderRadius: 999,
                            overflow: 'hidden',
                            backgroundColor: 'rgba(0,0,0,0.07)',
                        }}
                    >
                        <motion.div
                            style={{
                                height: '100%',
                                borderRadius: 999,
                                width: fillWidth,
                                backgroundColor: product.accent,
                                boxShadow: `0 0 8px ${product.accent}`,
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}