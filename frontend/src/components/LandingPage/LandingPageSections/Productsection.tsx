'use client';

/*
 * FONTS — add to global CSS / _app.tsx:
 * @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&family=DM+Sans:wght@400;500;600;700&family=Caveat:wght@400;600;700&display=swap');
 */

import {
  useEffect, useRef, useState, useCallback, type ReactNode,
} from 'react';
import {
  motion, AnimatePresence,
  useSpring, useMotionValue, useTransform,
  type MotionValue,
} from 'framer-motion';
import { ShoppingCart, ArrowRight, Zap, Shield, Star, type LucideIcon } from 'lucide-react';

/* ── theme ── */
const FD = "'Playfair Display', Georgia, serif";
const FS = "'DM Sans', 'Helvetica Neue', sans-serif";
const FH = "'Caveat', cursive";
const G  = '#15803d';
const GG = 'rgba(21,128,61,0.24)';
const GS = 'rgba(21,128,61,0.09)';

/* ─────────────────────── TYPES ─────────────────────────── */
interface Nutrient { label: string; friendly: string; emoji: string; }
interface Product {
  id: number; name: string;
  headline: string; accentWord: string; grayWord: string;
  tag: string; duration: string; price: string; origPrice: string;
  image: string; persuade: string; desc: string; badges: string[];
  icon: LucideIcon; nutrients: Nutrient[];
  tagline: string; highlight: string; savePct: string;
}

/* ─────────────────────── DATA ──────────────────────────── */
const PRODUCTS: Product[] = [
  {
    id: 0, name: 'Starter Pack',
    headline: 'The Beginning.', accentWord: 'Just Start.', grayWord: 'Stay consistent.',
    tag: 'Trial · 7 Pouches', duration: '7 Days', price: '₹1,500', origPrice: '₹2,000',
    image: '/images/product.png',
    persuade: 'Have it anywhere.',
    desc: 'One pouch. Bag, desk, gym locker. No mixing. No measuring. Just your body getting what it actually needs.',
    badges: ['7-Day Trial', 'Starter Formula', 'Free Delivery'],
    icon: Zap, tagline: 'Drop it in your bag. Done.', savePct: 'Save 25%',
    highlight: 'Most people feel it in 3 days.',
    nutrients: [
      { label: 'Protein',   friendly: 'Builds & repairs', emoji: '🥩' },
      { label: 'Vitamin C', friendly: 'Immunity shield',  emoji: '🍊' },
      { label: 'Zinc',      friendly: 'Energy spark',     emoji: '⚡' },
      { label: 'Vitamin B', friendly: 'Brain clarity',    emoji: '🧠' },
    ],
  },
  {
    id: 1, name: 'Balanced',
    headline: 'The Balance.', accentWord: 'Truly Yours.', grayWord: 'Sustained.',
    tag: 'Subscription · 15 Pouches', duration: '15 Days', price: '₹2,500', origPrice: '₹3,200',
    image: '/images/Pack1.png',
    persuade: 'Fits your lifestyle.',
    desc: 'Morning commute, late nights, post-gym? Your nutrition doesn\'t care about your schedule — but ours does.',
    badges: ['15-Day Cycle', 'Balanced Formula', 'Priority Shipping'],
    icon: Shield, tagline: 'Your body. Balanced.', savePct: 'Save 22%',
    highlight: 'Bioidentical nutrients. Matched to you.',
    nutrients: [
      { label: 'Protein',   friendly: 'Muscle support',  emoji: '💪' },
      { label: 'Omega-3',   friendly: 'Brain fuel',      emoji: '🐟' },
      { label: 'Magnesium', friendly: 'Deep recovery',   emoji: '🦴' },
      { label: 'Vitamin D', friendly: 'Daily essential', emoji: '☀️' },
    ],
  },
  {
    id: 2, name: 'Monthly',
    headline: 'The Protocol.', accentWord: 'Fully Committed.', grayWord: 'Dominate.',
    tag: 'Full Cycle · 30 Pouches', duration: '30 Days', price: '₹4,500', origPrice: '₹6,000',
    image: '/images/Pack2.png',
    persuade: 'One month. Total shift.',
    desc: 'Real change needs commitment. 30 days of precision nutrition — gut, cells, performance. All of it.',
    badges: ['30-Day Protocol', 'Premium Formula', 'Exclusive Access'],
    icon: Star, tagline: 'No shortcuts. Real results.', savePct: 'Save 25%',
    highlight: 'The full protocol. Nothing missing.',
    nutrients: [
      { label: 'Protein', friendly: 'Peak performance', emoji: '🥩' },
      { label: 'Calcium', friendly: 'Bone strength',    emoji: '💪' },
      { label: 'Iron',    friendly: 'Endurance++',      emoji: '🔋' },
      { label: 'Fiber',   friendly: 'Gut health',       emoji: '🌿' },
    ],
  },
];

/* ─────────────────── SVG FILTERS ──────────────────── */
function Filters() {
  return (
    <svg width="0" height="0" style={{ position:'absolute', pointerEvents:'none' }}>
      <defs>
        <filter id="sk">
          <feTurbulence type="turbulence" baseFrequency="0.042" numOctaves="3" seed="9" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2.2" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="stkShadow">
          <feDropShadow dx="1" dy="3" stdDeviation="4" floodColor="rgba(0,0,0,0.13)" />
        </filter>
      </defs>
    </svg>
  );
}

/* ─────────────────── NOTEBOOK BG ──────────────────── */
function NotebookBg() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex:0 }}>
      <div className="absolute inset-0" style={{ background:'#fdfaf3' }} />
      <div className="absolute inset-0" style={{
        opacity: 0.035,
        backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize:'256px',
      }} />
      <svg className="absolute inset-0 w-full h-full" style={{ opacity:0.11 }}>
        {Array.from({ length:60 }, (_,i) => (
          <line key={i} x1="0" y1={`${(i+1)*32}px`} x2="100%" y2={`${(i+1)*32}px`} stroke="#9ab0c8" strokeWidth="0.7" />
        ))}
      </svg>
      <div className="absolute top-0 bottom-0" style={{ left:46, width:1.5, background:'rgba(239,68,68,0.28)' }} />
      <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-around items-center" style={{ width:20 }}>
        {Array.from({ length:26 }, (_,i) => (
          <div key={i} style={{ width:12, height:12, borderRadius:'50%', background:'#dfd5c4', border:'2px solid #c4b8a4', boxShadow:'inset 0 1px 2px rgba(0,0,0,0.12)', flexShrink:0 }} />
        ))}
      </div>
      <div className="absolute top-0 left-0 right-0" style={{ height:52, background:`linear-gradient(135deg,${G}14,${G}05)`, borderBottom:`1.5px solid ${G}20` }} />
      <motion.div className="absolute inset-0"
        animate={{ background:`radial-gradient(ellipse 56% 50% at 62% 50%,${GG} 0%,transparent 68%)` }}
        transition={{ duration:0.85 }} />
      <svg className="absolute bottom-0 right-0" width="52" height="52">
        <path d="M52 52 L52 16 Q32 32 16 52 Z" fill="#ede8d8" />
        <path d="M52 16 L16 52" stroke="#d0c9b6" strokeWidth="0.9" />
      </svg>
    </div>
  );
}

/* ─────────────────── PERSUADE TAG ──────────────────── */
function PersuadeTag({ text }: { text: string }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div key={text}
        initial={{ opacity:0, x:-12 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0 }}
        transition={{ duration:0.3 }}
        className="inline-flex items-center gap-3 px-6 py-3 rounded-full mb-6"
        style={{ background:`${G}12`, border:`1.5px dashed ${G}50` }}
      >
        <motion.span style={{ width:11, height:11, borderRadius:'50%', background:G, display:'inline-block', flexShrink:0 }}
          animate={{ scale:[1,1.8,1] }} transition={{ duration:1.4, repeat:Infinity }} />
        <span style={{ fontFamily:FH, fontSize:24, fontWeight:700, color:G }}>{text}</span>
      </motion.div>
    </AnimatePresence>
  );
}

/* ─────────────────── HAND UNDERLINE ──────────────────── */
function HandUnderline({ width=280 }: { width?: number }) {
  return (
    <svg width={width} height="16" viewBox={`0 0 ${width} 16`} fill="none" style={{ display:'block' }}>
      <motion.path d={`M2 9 Q${width*.25} 2 ${width*.5} 9 Q${width*.75} 14 ${width-2} 7`}
        stroke={G} strokeWidth="3.5" strokeLinecap="round" fill="none" filter="url(#sk)"
        initial={{ pathLength:0 }} animate={{ pathLength:1 }} transition={{ duration:0.7 }} />
    </svg>
  );
}

/* ─────────────────── BADGE ──────────────────── */
function NBadge({ label }: { label: string }) {
  return (
    <div style={{ background:'#fffde6', border:`1.5px solid ${G}50`, borderRadius:10, padding:'7px 18px', position:'relative', boxShadow:'1px 2px 6px rgba(0,0,0,0.07)' }}>
      <div style={{ position:'absolute', top:-8, left:'50%', transform:'translateX(-50%)', width:30, height:12, background:`${G}25`, borderRadius:2, border:`1px solid ${G}28` }} />
      <span style={{ fontFamily:FH, fontSize:19, fontWeight:700, color:G }}>{label}</span>
    </div>
  );
}

/* ─────────────────── SKETCH BUTTON ──────────────────── */
function SketchBtn({ children }: { children: ReactNode }) {
  return (
    <motion.button className="relative overflow-hidden" style={{ padding:'18px 44px' }}
      whileHover={{ scale:1.04, boxShadow:`0 8px 32px ${GG}` }}
      whileTap={{ scale:0.96 }}
      transition={{ type:'spring', stiffness:340, damping:22 }}
    >
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" style={{ overflow:'visible' }}>
        <motion.rect x="1" y="1" width="98%" height="94%" rx="14" ry="14" fill={G} filter="url(#sk)" stroke="rgba(0,0,0,0.1)" strokeWidth="1" />
        <motion.rect x="4" y="4" width="92%" height="86%" rx="10" ry="10" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="1" strokeDasharray="8 5" filter="url(#sk)"
          animate={{ strokeDashoffset:[0,-42] }} transition={{ duration:3.2, repeat:Infinity, ease:'linear' }} />
      </svg>
      <motion.div className="absolute inset-0 pointer-events-none"
        style={{ background:'linear-gradient(110deg,transparent 22%,rgba(255,255,255,0.18) 50%,transparent 78%)' }}
        animate={{ x:['-140%','200%'] }} transition={{ duration:2.4, repeat:Infinity, repeatDelay:2.2, ease:'easeInOut' }} />
      <span className="relative z-10 flex items-center gap-3"
        style={{ fontFamily:FS, fontSize:20, fontWeight:700, color:'#fff' }}>
        {children}
      </span>
    </motion.button>
  );
}

/* ─────────────────── NAV DOT ──────────────────── */
function NavDot({ index, isActive, onClick }: { index:number; isActive:boolean; onClick:()=>void }) {
  return (
    <motion.button onClick={onClick} className="relative flex items-center justify-center" style={{ width:48, height:48 }}
      whileHover={{ scale:1.15 }} whileTap={{ scale:0.9 }}>
      <svg className="absolute inset-0" width="48" height="48" viewBox="0 0 48 48" fill="none">
        <motion.circle cx="24" cy="24" r="19"
          fill={isActive ? G+'22' : 'rgba(255,255,255,0.6)'}
          stroke={isActive ? G : 'rgba(0,0,0,0.18)'}
          strokeWidth="1.8" strokeDasharray={isActive ? '0' : '5 3'}
          filter="url(#sk)" />
        {isActive && (
          <motion.circle cx="24" cy="24" r="21" fill="none" stroke={G} strokeWidth="1" strokeDasharray="4 4" opacity={0.45}
            animate={{ strokeDashoffset:[0,-28] }} transition={{ duration:2.8, repeat:Infinity, ease:'linear' }} />
        )}
      </svg>
      <span className="relative z-10" style={{ fontFamily:FH, fontSize:19, fontWeight:700, color:isActive?G:'rgba(0,0,0,0.35)' }}>
        {index+1}
      </span>
    </motion.button>
  );
}

/* ─────────────────── PRICE ──────────────────── */
function Price({ price, orig, save }: { price:string; orig:string; save:string }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div key={price} initial={{ y:18, opacity:0 }} animate={{ y:0, opacity:1 }} exit={{ y:-18, opacity:0 }} transition={{ duration:0.32 }}>
        <div className="flex items-baseline gap-4">
          <span style={{ fontFamily:FD, fontSize:'clamp(3rem,5.5vw,4.8rem)', fontWeight:900, color:'#1a1a1a', lineHeight:1 }}>{price}</span>
          <span style={{ fontFamily:FS, fontSize:20, fontWeight:500, color:'rgba(0,0,0,0.36)', textDecoration:'line-through' }}>{orig}</span>
          <span style={{ fontFamily:FH, fontSize:20, fontWeight:700, color:G, background:GS, border:`1px solid ${G}40`, borderRadius:20, padding:'4px 16px' }}>{save}</span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ─────────────────── NUTRIENT GRID ──────────────────── */
function NutrientGrid({ product }: { product: Product }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div key={`ng-${product.id}`} className="grid grid-cols-2 gap-4"
        initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }} transition={{ duration:0.32 }}>
        {product.nutrients.map((n,i) => (
          <motion.div key={n.label} initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*.08+.08 }}
            className="flex items-center gap-4 rounded-2xl px-5 py-4"
            style={{ background:`${G}0b`, border:`1px solid ${G}2a` }}>
            <span style={{ fontSize:30, lineHeight:1, flexShrink:0 }}>{n.emoji}</span>
            <div>
              <div style={{ fontFamily:FS, fontSize:13, fontWeight:700, color:'rgba(0,0,0,0.55)', letterSpacing:'0.1em', textTransform:'uppercase', lineHeight:1 }}>{n.label}</div>
              <div style={{ fontFamily:FH, fontSize:18, fontWeight:700, color:G, lineHeight:1.3 }}>{n.friendly}</div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </AnimatePresence>
  );
}

/* ─────────────────── PROOF BOX ──────────────────── */
function ProofBox({ product }: { product: Product }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div key={`pb-${product.id}`} initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }} transition={{ delay:0.35 }}
        className="mt-6 p-6 rounded-2xl" style={{ background:`${G}09`, border:`1.5px dashed ${G}30` }}>
        <p style={{ fontFamily:FH, fontSize:20, fontWeight:700, color:G, lineHeight:1.55, marginBottom:12 }}>
          {product.tagline}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {'★★★★★'.split('').map((s,i) => (
              <span key={i} style={{ fontSize:20, color:'#f59e0b' }}>{s}</span>
            ))}
            <span style={{ fontFamily:FS, fontSize:15, color:'rgba(0,0,0,0.45)', fontWeight:500, marginLeft:8 }}>50k+ users</span>
          </div>
          <motion.span
            style={{ fontFamily:FH, fontSize:17, fontWeight:700, color:G, background:GS, border:`1px solid ${G}35`, borderRadius:20, padding:'4px 14px' }}
            animate={{ scale:[1,1.05,1] }} transition={{ duration:2.5, repeat:Infinity }}
          >
            {product.savePct}
          </motion.span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ─────────────────── PRODUCT IMAGE ──────────────────── */
function ProductImg({ product, mouseX, mouseY }: {
  product: Product; mouseX: MotionValue<number>; mouseY: MotionValue<number>;
}) {
  const rX = useSpring(useTransform(mouseY, [-0.5,0.5],[6,-6]), { stiffness:55, damping:14 });
  const rY = useSpring(useTransform(mouseX, [-0.5,0.5],[-8,8]), { stiffness:55, damping:14 });

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <motion.div className="absolute rounded-full blur-3xl pointer-events-none"
        animate={{ background:`radial-gradient(circle,${G}42 0%,transparent 70%)`, scale:[1,1.1,1] }}
        transition={{ scale:{ duration:4.2, repeat:Infinity, ease:'easeInOut' } }}
        style={{ width:'72%', height:'72%', top:'14%', left:'14%' }} />
      {[90,70].map((sz,i) => (
        <motion.div key={i} className="absolute rounded-full pointer-events-none"
          style={{ width:`${sz}%`, height:`${sz}%`, top:`${(100-sz)/2}%`, left:`${(100-sz)/2}%`,
            border:`1px dashed ${G}${i===0?'22':'14'}` }}
          animate={{ rotate:i%2===0?360:-360 }}
          transition={{ duration:i===0?28:20, repeat:Infinity, ease:'linear' }} />
      ))}
      <motion.div className="absolute rounded-full blur-xl pointer-events-none"
        animate={{ scaleX:[1,1.14,1], opacity:[0.18,0.28,0.18] }}
        transition={{ duration:4.2, repeat:Infinity, ease:'easeInOut' }}
        style={{ width:'52%', height:20, bottom:'4%', left:'24%', background:G }} />

      <AnimatePresence mode="wait">
        <motion.div key={product.id}
          initial={{ opacity:0, scale:0.5, y:40, filter:'blur(16px)' }}
          animate={{ opacity:1, scale:1, y:0, filter:'blur(0px)' }}
          exit={{ opacity:0, scale:0.5, y:-36, filter:'blur(14px)' }}
          transition={{ duration:0.65, type:'spring', bounce:0.18 }}
          style={{
            rotateX:rX, rotateY:rY, transformStyle:'preserve-3d',
            position:'relative', zIndex:12,
            filter:`drop-shadow(0 36px 56px ${GG}) drop-shadow(0 10px 22px ${GG})`,
          }}
        >
          <motion.div animate={{ y:[0,-20,0], rotateZ:[-0.5,0.5,-0.5] }} transition={{ duration:5.2, repeat:Infinity, ease:'easeInOut' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={product.image} alt={product.name}
              style={{
                /* Significantly larger image */
                width:'clamp(260px,38vw,500px)',
                height:'clamp(340px,52vw,660px)',
                objectFit:'contain', display:'block',
              }} />
            <motion.div style={{ position:'absolute', inset:0, borderRadius:12, pointerEvents:'none',
              background:'linear-gradient(115deg,transparent 24%,rgba(255,255,255,0.18) 50%,transparent 76%)' }}
              animate={{ x:['-130%','190%'] }} transition={{ duration:2.8, repeat:Infinity, ease:'easeInOut', repeatDelay:4 }} />
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {[{x:'10%',y:'12%',d:0},{x:'85%',y:'10%',d:.85},{x:'88%',y:'76%',d:1.7},{x:'7%',y:'80%',d:2.4}].map((dot,i)=>(
        <motion.div key={i} className="absolute pointer-events-none rounded-full"
          style={{ left:dot.x, top:dot.y, width:10, height:10, background:G, zIndex:20 }}
          animate={{ scale:[0,1.6,0], opacity:[0,.75,0] }}
          transition={{ duration:2.8, delay:dot.d, repeat:Infinity, ease:'easeInOut' }} />
      ))}
      {[{x:'16%',y:'7%',d:.3},{x:'78%',y:'82%',d:1.2}].map((s,i)=>(
        <motion.span key={i} className="absolute pointer-events-none"
          style={{ left:s.x, top:s.y, color:G, fontSize:28, fontFamily:FH, opacity:.55, zIndex:20 }}
          animate={{ rotate:[0,22,0], scale:[1,1.35,1] }} transition={{ duration:3.2+i, delay:s.d, repeat:Infinity }}>✦</motion.span>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN
═══════════════════════════════════════════════════════════════ */
export default function ProductSection() {
  const wrapRef  = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const rawProg    = useMotionValue(0);
  const smoothProg = useSpring(rawProg, { stiffness:50, damping:18 });
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    function onScroll() {
      const wrap = wrapRef.current;
      if (!wrap) return;
      const top = wrap.getBoundingClientRect().top + window.scrollY;
      const p   = Math.min(1, Math.max(0, (window.scrollY - top) / (window.innerHeight * 2)));
      rawProg.set(p);
      setActiveIdx(p < 1/3 ? 0 : p < 2/3 ? 1 : 2);
    }
    window.addEventListener('scroll', onScroll, { passive:true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [rawProg]);

  const fillProg = useTransform(
    useSpring(useTransform(smoothProg, [activeIdx/3,(activeIdx+1)/3],[0,1]), { stiffness:50, damping:18 }),
    (v:number) => `${Math.round(Math.min(100,Math.max(0,v*100)))}%`
  );

  const scrollTo = useCallback((i:number) => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    window.scrollTo({ top: wrap.getBoundingClientRect().top+window.scrollY+(i/3)*window.innerHeight*2, behavior:'smooth' });
  }, []);

  const product = PRODUCTS[activeIdx];
  const Icon    = product.icon;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&family=DM+Sans:wght@400;500;600;700&family=Caveat:wght@400;600;700&display=swap');
      `}</style>
      <Filters />

      <div ref={wrapRef} style={{ height:'300vh', position:'relative' }}>

        <div style={{
          position:'sticky', top:0,
          height:'100vh', width:'100%',
          overflow:'hidden',
          display:'grid',
          gridTemplateRows:'auto 1fr auto',
        }}>
          <NotebookBg />

          {/* ══════ ROW 1: HEADER ══════ */}
          <header className="relative flex items-center justify-between gap-4"
            style={{
              zIndex:20, flexShrink:0,
              paddingLeft:'clamp(60px,7vw,96px)',
              paddingRight:'clamp(20px,4vw,56px)',
              paddingTop:'clamp(14px,2vh,28px)',
              paddingBottom:'clamp(10px,1.4vh,22px)',
            }}>

            <div>
              <div className="flex items-baseline gap-2 flex-wrap">
                <span style={{ fontFamily:FD, fontSize:'clamp(2.8rem,5.5vw,5.2rem)', fontWeight:900, color:'#1a1a1a', letterSpacing:'-0.022em', lineHeight:1 }}>
                  Fuel{' '}
                </span>
                <AnimatePresence mode="wait">
                  <motion.span key={`fc-${activeIdx}`}
                    initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-6 }}
                    style={{ fontFamily:FD, fontSize:'clamp(2.9rem,5.8vw,5.4rem)', fontWeight:700, color:G, fontStyle:'italic', lineHeight:1 }}>
                    Cycle.
                  </motion.span>
                </AnimatePresence>
              </div>
              <HandUnderline width={300} />
            </div>

            <div className="flex flex-col items-end gap-3">
              <div className="flex items-center gap-2">
                {PRODUCTS.map((_,i) => <NavDot key={i} index={i} isActive={i===activeIdx} onClick={()=>scrollTo(i)} />)}
              </div>
              <div className="flex items-center gap-2">
                <motion.span style={{ fontFamily:FH, fontSize:18, color:'rgba(0,0,0,0.38)', fontWeight:700 }}
                  animate={{ y:[0,3,0] }} transition={{ duration:1.4, repeat:Infinity }}>↓</motion.span>
                <span style={{ fontFamily:FH, fontSize:18, color:'rgba(0,0,0,0.38)', fontWeight:700 }}>scroll</span>
              </div>
            </div>
          </header>

          {/* ══════ ROW 2: BODY ══════ */}
          <main
            className="relative flex flex-col lg:flex-row items-stretch"
            style={{
              zIndex:10, overflow:'hidden',
              paddingLeft:'clamp(60px,7vw,96px)',
              paddingRight:'clamp(20px,4vw,56px)',
              gap:'clamp(16px,3vw,48px)',
            }}
          >
            {/* ── LEFT: COPY ── */}
            <div className="flex flex-col justify-center order-1 w-full lg:flex-shrink-0"
              style={{ maxWidth:520 }}>

              <PersuadeTag text={product.persuade} />

              {/* tag line with icon */}
              <AnimatePresence mode="wait">
                <motion.div key={`tag-${activeIdx}`}
                  initial={{ opacity:0, x:-14 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0 }}
                  transition={{ duration:0.28 }}
                  className="flex items-center gap-4 mb-5">
                  <div className="relative flex items-center justify-center flex-shrink-0" style={{ width:40, height:40 }}>
                    <svg className="absolute inset-0" width="40" height="40" viewBox="0 0 40 40" fill="none">
                      <motion.rect x="2" y="2" width="36" height="36" rx="10" fill={`${G}12`} stroke={G} strokeWidth="1.5"
                        strokeDasharray="4 2.5" filter="url(#sk)"
                        animate={{ strokeDashoffset:[0,-22] }} transition={{ duration:4, repeat:Infinity, ease:'linear' }} />
                    </svg>
                    <Icon style={{ color:G, width:19, height:19, position:'relative', zIndex:1 }} />
                  </div>
                  <span style={{ fontFamily:FS, fontSize:16, fontWeight:600, color:G, letterSpacing:'0.12em', textTransform:'uppercase' }}>
                    {product.tag}
                  </span>
                </motion.div>
              </AnimatePresence>

              {/* Headline */}
              <div style={{ overflow:'hidden', marginBottom:16 }}>
                <AnimatePresence mode="wait">
                  <motion.div key={`hl-${activeIdx}`}
                    initial={{ y:'105%', opacity:0 }} animate={{ y:0, opacity:1 }} exit={{ y:'-105%', opacity:0 }}
                    transition={{ duration:0.52, ease:[0.22,1,0.36,1] }}>
                    <div style={{ fontFamily:FD, fontSize:'clamp(2.8rem,5.5vw,5rem)', fontWeight:900, color:'#1a1a1a', lineHeight:1.04, letterSpacing:'-0.022em' }}>
                      {product.headline}
                    </div>
                    <div style={{ fontFamily:FD, fontSize:'clamp(2.8rem,5.8vw,5rem)', fontWeight:700, color:G, fontStyle:'italic', lineHeight:1.04 }}>
                      {product.accentWord}
                    </div>
                    <div style={{ fontFamily:FH, fontSize:'clamp(1.4rem,2.5vw,2rem)', fontWeight:600, color:'rgba(0,0,0,0.36)', lineHeight:1.2, marginTop:6 }}>
                      {product.grayWord}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Highlight */}
              <AnimatePresence mode="wait">
                <motion.div key={`hi-${activeIdx}`}
                  initial={{ opacity:0, scale:.94 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0 }}
                  transition={{ duration:0.28 }}
                  className="inline-flex items-center gap-3 px-6 py-3.5 rounded-xl mb-5"
                  style={{ background:`${G}10`, border:`1.5px solid ${G}28`, alignSelf:'flex-start' }}>
                  <span style={{ fontSize:24 }}>✨</span>
                  <span style={{ fontFamily:FH, fontSize:22, fontWeight:700, color:G }}>{product.highlight}</span>
                </motion.div>
              </AnimatePresence>

              {/* Description */}
              <AnimatePresence mode="wait">
                <motion.div key={`d-${activeIdx}`}
                  initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                  transition={{ delay:.06, duration:0.32 }}
                  className="relative mb-7" style={{ maxWidth:460 }}>
                  <svg className="absolute" style={{ left:0, top:0, height:'100%' }} width="5" viewBox="0 0 4 100" preserveAspectRatio="none">
                    <motion.path d="M2 0 Q3 25 2 50 Q1 75 2 100" stroke={G} strokeWidth="2.5" strokeLinecap="round" fill="none" filter="url(#sk)"
                      initial={{ pathLength:0 }} animate={{ pathLength:1 }} transition={{ duration:0.5 }} />
                  </svg>
                  <p className="pl-6" style={{ fontFamily:FS, fontSize:'clamp(15px,1.6vw,18px)', fontWeight:400, color:'rgba(0,0,0,0.52)', lineHeight:1.8 }}>
                    {product.desc}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Badges */}
              <AnimatePresence mode="wait">
                <motion.div key={`bdg-${activeIdx}`} className="flex flex-wrap gap-3 mb-7"
                  initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}>
                  {product.badges.map(b => <NBadge key={b} label={b} />)}
                </motion.div>
              </AnimatePresence>

              {/* Nutrients — MOBILE only */}
              <div className="block lg:hidden mb-7">
                <span style={{ fontFamily:FH, fontSize:22, fontWeight:700, color:G, display:'block', marginBottom:14 }}>
                  whats inside →
                </span>
                <NutrientGrid product={product} />
              </div>

              {/* Price + CTA */}
              <div className="flex flex-wrap items-end gap-7">
                <div>
                  <span style={{ fontFamily:FH, fontSize:17, fontWeight:700, color:'rgba(0,0,0,0.42)', display:'block', marginBottom:5 }}>
                    price ↓
                  </span>
                  <Price price={product.price} orig={product.origPrice} save={product.savePct} />
                  <span style={{ fontFamily:FS, fontSize:17, color:'rgba(0,0,0,0.42)', display:'block', marginTop:5 }}>
                    {product.duration} supply
                  </span>
                </div>
                <div className="flex items-center gap-6">
                  <AnimatePresence mode="wait">
                    <motion.div key={`cta-${activeIdx}`}
                      initial={{ opacity:0, scale:.84 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0 }}
                      transition={{ duration:0.22 }}>
                      <SketchBtn>
                        <ShoppingCart className="w-6 h-6" /> Order Now
                      </SketchBtn>
                    </motion.div>
                  </AnimatePresence>
                  <motion.button className="flex items-center gap-2"
                    style={{ fontFamily:FS, fontSize:18, fontWeight:500, color:'rgba(0,0,0,0.42)' }}
                    whileHover={{ x:5 }} transition={{ type:'spring', stiffness:300 }}>
                    Details <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </div>

            {/* ── CENTER: PRODUCT IMAGE ── */}
            <div
              ref={stageRef}
              className="flex items-center justify-center order-2 flex-1"
              style={{
                minHeight:'clamp(280px,50vh,680px)',
                perspective:'1200px',
                position:'relative', zIndex:15,
              }}
              onMouseMove={e => {
                const r = stageRef.current?.getBoundingClientRect();
                if (!r) return;
                mouseX.set((e.clientX-r.left)/r.width-.5);
                mouseY.set((e.clientY-r.top)/r.height-.5);
              }}
              onMouseLeave={() => { mouseX.set(0); mouseY.set(0); }}
            >
              <ProductImg product={product} mouseX={mouseX} mouseY={mouseY} />
            </div>

            {/* ── RIGHT: NUTRIENTS + PROOF (desktop) ── */}
            <div className="hidden lg:flex flex-col justify-center order-3 flex-shrink-0"
              style={{ width:'clamp(260px,26vw,360px)' }}>
              <div className="flex items-center gap-3 mb-5">
                <svg width="24" height="12" viewBox="0 0 24 12" fill="none">
                  <path d="M1 6 Q12 2 23 6" stroke={G} strokeWidth="2" strokeLinecap="round" opacity={0.5} filter="url(#sk)" />
                </svg>
                <span style={{ fontFamily:FH, fontSize:26, fontWeight:700, color:G }}>whats inside</span>
              </div>
              <NutrientGrid product={product} />
              <ProofBox product={product} />
            </div>

            {/* ── FAR RIGHT: vertical nav rail (xl+) ── */}
            <div className="hidden xl:flex flex-col items-center justify-center flex-shrink-0 order-4" style={{ width:60 }}>
              <div className="relative flex flex-col items-center h-full justify-center">
                <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2"
                  style={{ width:1, backgroundImage:`repeating-linear-gradient(to bottom,${G}28 0,${G}28 4px,transparent 4px,transparent 10px)` }} />
                {PRODUCTS.map((p,i) => (
                  <button key={i} onClick={()=>scrollTo(i)} className="relative z-10 flex flex-col items-center gap-2 py-8">
                    <motion.div animate={{ scale:i===activeIdx?1.5:1 }} transition={{ duration:0.3 }}>
                      <svg width="15" height="15" viewBox="0 0 15 15">
                        <motion.circle cx="7.5" cy="7.5" r="5.5"
                          fill={i===activeIdx?G:'transparent'}
                          stroke={i===activeIdx?G:'rgba(0,0,0,0.22)'}
                          strokeWidth="1.4" strokeDasharray={i===activeIdx?'0':'3 2'}
                          filter="url(#sk)" />
                      </svg>
                    </motion.div>
                    <motion.span animate={{ opacity:i===activeIdx?1:0.28, color:i===activeIdx?G:'#000' }} transition={{ duration:0.3 }}
                      style={{ writingMode:'vertical-rl', letterSpacing:'0.15em', fontFamily:FH, fontSize:14, fontWeight:700, textTransform:'uppercase' }}>
                      {p.name}
                    </motion.span>
                  </button>
                ))}
              </div>
            </div>
          </main>

          {/* ══════ ROW 3: PROGRESS BAR ══════ */}
          <footer className="relative"
            style={{
              zIndex:20, flexShrink:0,
              paddingLeft:'clamp(60px,7vw,96px)',
              paddingRight:'clamp(20px,4vw,56px)',
              paddingBottom:'clamp(14px,2vh,28px)',
              paddingTop:12,
            }}>
            <div className="flex items-center justify-between mb-3">
              <span style={{ fontFamily:FH, fontSize:20, fontWeight:700, color:'rgba(0,0,0,0.38)' }}>
                {String(activeIdx+1).padStart(2,'0')} / 03
              </span>
              <motion.span style={{ fontFamily:FD, fontSize:20, fontWeight:700, fontStyle:'italic' }}
                animate={{ color:G }} transition={{ duration:0.4 }}>
                {product.name}
              </motion.span>
            </div>
            <div className="relative" style={{ height:13 }}>
              <div className="absolute inset-0 rounded-full"
                style={{ background:'rgba(0,0,0,0.07)', border:'1px solid rgba(0,0,0,0.07)' }} />
              <motion.div style={{
                position:'absolute', top:0, left:0, height:'100%', borderRadius:99,
                width:fillProg,
                background:`linear-gradient(90deg,${G}80,${G})`,
                boxShadow:`0 0 16px ${GG}`,
              }} />
              {[1,2].map(t=>(
                <div key={t} className="absolute top-0 bottom-0"
                  style={{ left:`${t*33.33}%`, width:1, background:'rgba(0,0,0,0.10)' }} />
              ))}
            </div>
          </footer>

        </div>
      </div>
    </>
  );
}