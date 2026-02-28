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
        accent: '#4ade80',
        accentDim: '#16a34a',
        accentGlow: 'rgba(74,222,128,0.18)',
        accentSoft: 'rgba(74,222,128,0.06)',
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
        accent: '#86efac',
        accentDim: '#4ade80',
        accentGlow: 'rgba(134,239,172,0.15)',
        accentSoft: 'rgba(134,239,172,0.05)',
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
   ORBITAL RINGS
───────────────────────────────────── */
function OrbitalRings({ accent }: { accent: string }) {
    const rings = [
        { size: 190, speed: 10, dot: 5, rev: false },
        { size: 260, speed: 17, dot: 4, rev: true },
        { size: 330, speed: 25, dot: 6, rev: false },
    ];
    return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {rings.map((r, i) => (
                <motion.div
                    key={i}
                    className="absolute rounded-full border"
                    style={{ width: r.size, height: r.size, borderColor: accent + '20' }}
                    animate={{
                        rotate: r.rev ? -360 : 360,
                        borderColor: [accent + '20', accent + '45', accent + '20'],
                    }}
                    transition={{
                        rotate: { duration: r.speed, repeat: Infinity, ease: 'linear' },
                        borderColor: { duration: 2.5, repeat: Infinity, delay: i * 0.5 },
                    }}
                >
                    <motion.div
                        className="absolute rounded-full"
                        style={{
                            width: r.dot,
                            height: r.dot,
                            backgroundColor: accent,
                            top: -(r.dot / 2),
                            left: '50%',
                            transform: 'translateX(-50%)',
                            boxShadow: `0 0 10px 3px ${accent}88`,
                        }}
                        animate={{ opacity: [0.6, 1, 0.6] }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                    />
                </motion.div>
            ))}
        </div>
    );
}

/* ─────────────────────────────────────
   PRODUCT STAGE
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
    const rotateX = useTransform(mouseY, [-0.5, 0.5], [8, -8]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], [-12, 12]);
    const springRX = useSpring(rotateX, { stiffness: 80, damping: 20 });
    const springRY = useSpring(rotateY, { stiffness: 80, damping: 20 });

    return (
        <div
            className="relative flex items-center justify-center"
            style={{ width: 400, height: 480 }}
        >
            {/* Deep glow */}
            <motion.div
                className="absolute rounded-full blur-3xl"
                animate={{ backgroundColor: product.accent, scale: [1, 1.14, 1] }}
                transition={{
                    backgroundColor: { duration: 0.7 },
                    scale: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
                }}
                style={{ width: 300, height: 300, opacity: 0.13 }}
            />
            {/* Inner glow */}
            <motion.div
                className="absolute rounded-full blur-2xl"
                animate={{ backgroundColor: product.accentDim }}
                transition={{ duration: 0.7 }}
                style={{ width: 200, height: 200, opacity: 0.1 }}
            />

            <OrbitalRings accent={product.accent} />

            {/* Ground reflection */}
            <motion.div
                className="absolute rounded-full blur-xl"
                animate={{ backgroundColor: product.accent }}
                transition={{ duration: 0.7 }}
                style={{ width: 130, height: 18, bottom: 24, opacity: 0.18 }}
            />

            {/* Product */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={`img-${activeIdx}`}
                    initial={{ opacity: 0, scale: 0.5, y: 80, rotateY: -30 }}
                    animate={{ opacity: 1, scale: 1, y: 0, rotateY: 0 }}
                    exit={{ opacity: 0, scale: 0.55, y: -60, rotateY: 30 }}
                    transition={{ duration: 0.6, type: 'spring', bounce: 0.28 }}
                    style={{
                        rotateX: springRX,
                        rotateY: springRY,
                        transformStyle: 'preserve-3d',
                        filter: `drop-shadow(0 30px 60px ${product.accentGlow}) drop-shadow(0 0 28px ${product.accentGlow})`,
                        position: 'relative',
                        zIndex: 10,
                    }}
                >
                    <motion.div
                        animate={{ y: [0, -18, 0] }}
                        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={product.image}
                            alt={product.name}
                            style={{ width: 220, height: 280, objectFit: 'contain' }}
                        />
                    </motion.div>
                </motion.div>
            </AnimatePresence>

            {/* Scan line */}
            <div
                className="absolute pointer-events-none overflow-hidden"
                style={{ width: 220, height: 280, zIndex: 11 }}
            >
                <motion.div
                    className="absolute left-0 right-0 h-px"
                    style={{
                        background: `linear-gradient(90deg, transparent, ${product.accent}99, transparent)`,
                    }}
                    animate={{ top: ['-2%', '102%'] }}
                    transition={{ duration: 2.6, repeat: Infinity, ease: 'linear', repeatDelay: 1.2 }}
                />
            </div>
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
    // rawProgress: 0‒1 across the full 300vh
    const rawProgress = useMotionValue(0);
    const smoothProgress = useSpring(rawProgress, { stiffness: 50, damping: 18 });

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    /* ── CORE SCROLL LOGIC ──
       We manually track window.scrollY relative to the wrapper's
       offsetTop so the sticky panel stays locked until all 3 products
       have been scrolled through.
    */
    useEffect(() => {
        const SECTION_HEIGHT = window.innerHeight * 3; // 300vh

        function onScroll() {
            const wrap = wrapRef.current;
            if (!wrap) return;

            const top = wrap.getBoundingClientRect().top + window.scrollY;
            const scrolled = window.scrollY - top;
            const progress = Math.min(1, Math.max(0, scrolled / (SECTION_HEIGHT - window.innerHeight)));

            rawProgress.set(progress);

            // Switch product at clean thirds
            if (progress < 1 / 3) setActiveIdx(0);
            else if (progress < 2 / 3) setActiveIdx(1);
            else setActiveIdx(2);
        }

        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll(); // run once on mount
        return () => window.removeEventListener('scroll', onScroll);
    }, [rawProgress]);

    // Per-product fill bar 0→1
    const bandStart = activeIdx / 3;
    const bandEnd = (activeIdx + 1) / 3;
    const fillProgress = useTransform(smoothProgress, [bandStart, bandEnd], [0, 1]);
    const fillWidth = useTransform(fillProgress, (v: number) =>
        `${Math.round(Math.min(100, Math.max(0, v * 100)))}%`
    );

    /* Mouse tilt */
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
        /*
          LAYOUT KEY:
          - outer div: exactly 300vh height, relative positioning
          - inner div: sticky top:0, height:100vh, overflow:hidden
          This guarantees the sticky panel remains in view for 3 full
          viewport heights of scroll distance before releasing.
        */
        <div
            ref={wrapRef}
            style={{ height: '300vh', position: 'relative' }}
        >
            <div
                style={{
                    position: 'sticky',
                    top: 0,
                    height: '100vh',
                    width: '100%',
                    overflow: 'hidden',
                    background: '#050a05',
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
                {/* Grain texture */}
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
                                className="text-white/25 font-sans font-light mb-1"
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
                                        // Jump scroll to that product's band
                                        const wrap = wrapRef.current;
                                        if (!wrap) return;
                                        const top = wrap.getBoundingClientRect().top + window.scrollY;
                                        const sectionScroll = window.innerHeight * 2; // 300vh - 100vh
                                        window.scrollTo({ top: top + (i / 3) * sectionScroll, behavior: 'smooth' });
                                    }}
                                >
                                    <motion.div
                                        className="w-10 h-10 rounded-full border-2 flex items-center justify-center text-xs font-black"
                                        animate={{
                                            borderColor: i === activeIdx ? p.accent : 'rgba(255,255,255,0.1)',
                                            backgroundColor: i === activeIdx ? p.accent + '22' : 'transparent',
                                            color: i === activeIdx ? p.accent : 'rgba(255,255,255,0.25)',
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
                        <span className="text-white/20 text-[9px] tracking-widest">SCROLL TO EXPLORE</span>
                    </div>
                </div>

                {/* ── BODY ── */}
                <div
                    className="relative z-10 flex px-6 md:px-14 gap-4"
                    style={{ flex: 1, minHeight: 0, alignItems: 'center' }}
                >
                    {/* LEFT copy */}
                    <div className="flex flex-col justify-center" style={{ flex: 1, maxWidth: 420 }}>
                        {/* Tag */}
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

                        {/* Headline */}
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

                        {/* Sub */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={`sub-${activeIdx}`}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.36, delay: 0.06 }}
                                className="text-white/40 text-sm font-light tracking-[0.22em] uppercase mb-4"
                            >
                                {product.sub} {product.name}
                            </motion.div>
                        </AnimatePresence>

                        {/* Desc */}
                        <AnimatePresence mode="wait">
                            <motion.p
                                key={`desc-${activeIdx}`}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.42, delay: 0.1 }}
                                className="text-white/35 text-sm leading-relaxed mb-5"
                                style={{ maxWidth: 300 }}
                            >
                                {product.desc}
                            </motion.p>
                        </AnimatePresence>

                        {/* Badges */}
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

                        {/* Price + CTA */}
                        <div className="flex items-center gap-5">
                            <div>
                                <div className="text-white/25 text-[9px] uppercase tracking-widest mb-1">Price</div>
                                <div
                                    className="font-black text-4xl md:text-5xl text-white"
                                    style={{
                                        fontFamily: "'Playfair Display', Georgia, serif",
                                        overflow: 'hidden',
                                        lineHeight: 1.1,
                                    }}
                                >
                                    <PriceTicker price={product.price} />
                                </div>
                                <div className="text-white/25 text-xs mt-1 tracking-wider">
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
                                    className="flex items-center gap-1 text-white/25 text-xs tracking-widest hover:text-white/50 transition-colors"
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
                                style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}
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
                                            borderColor: i === activeIdx ? p.accent : 'rgba(255,255,255,0.15)',
                                            backgroundColor: i === activeIdx ? p.accent : 'transparent',
                                            boxShadow: i === activeIdx ? `0 0 14px ${p.accent}` : 'none',
                                        }}
                                        transition={{ duration: 0.3 }}
                                    />
                                    <motion.span
                                        animate={{
                                            opacity: i === activeIdx ? 1 : 0.2,
                                            color: i === activeIdx ? p.accent : '#fff',
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
                        <span className="text-white/20 text-[9px] tracking-widest uppercase font-mono">
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
                            backgroundColor: 'rgba(255,255,255,0.07)',
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