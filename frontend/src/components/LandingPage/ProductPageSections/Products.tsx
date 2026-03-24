'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimationFrame } from 'framer-motion';
import Image from 'next/image';
import { ShoppingCart, Check, Star, Truck, RotateCcw, ChevronLeft, ChevronRight, Zap, BarChart3 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import AuthModal from '@/components/AuthModal';
import { productAPI, Product, ProductNutrient } from '@/lib/api';
import { useCart, CartItem } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';
import ProductFAQ from './ProductFAQ';
import ReviewsSection from './ReviewsSection';

/* ── theme ── */
const FD = "'Caveat', 'Playfair Display', Georgia, serif";
const FS = "'Nunito', 'DM Sans', 'Helvetica Neue', sans-serif";
const G = '#15803d';
const BG = '#fefdf7';

/* ─────────────────────────────────────────────
   ANIMATED DOODLE CANVAS BACKGROUND
───────────────────────────────────────────── */
const DoodleCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const t = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight * 3;
    };
    resize();
    window.addEventListener('resize', resize);

    // Doodle elements config
    const elements = [
      // Floating stars
      ...Array.from({ length: 18 }, (_, i) => ({
        type: 'star', x: Math.random() * 100, y: Math.random() * 100,
        size: 12 + Math.random() * 20, speed: 0.15 + Math.random() * 0.3,
        phase: Math.random() * Math.PI * 2, opacity: 0.06 + Math.random() * 0.1,
      })),
      // Wavy lines
      ...Array.from({ length: 8 }, (_, i) => ({
        type: 'wave', y: 8 + i * 12, speed: 0.08 + i * 0.02,
        amplitude: 4 + Math.random() * 8, phase: Math.random() * Math.PI * 2,
        opacity: 0.04 + Math.random() * 0.05,
      })),
      // Circles
      ...Array.from({ length: 14 }, (_, i) => ({
        type: 'circle', x: Math.random() * 100, y: Math.random() * 100,
        size: 20 + Math.random() * 60, speed: 0.1 + Math.random() * 0.2,
        phase: Math.random() * Math.PI * 2, opacity: 0.03 + Math.random() * 0.06,
      })),
      // Leaf shapes
      ...Array.from({ length: 10 }, (_, i) => ({
        type: 'leaf', x: Math.random() * 100, y: Math.random() * 100,
        size: 18 + Math.random() * 28, speed: 0.12 + Math.random() * 0.25,
        phase: Math.random() * Math.PI * 2, opacity: 0.05 + Math.random() * 0.07,
        rotation: Math.random() * Math.PI * 2,
      })),
      // Dots
      ...Array.from({ length: 30 }, (_, i) => ({
        type: 'dot', x: Math.random() * 100, y: Math.random() * 100,
        size: 2 + Math.random() * 5, speed: 0.05 + Math.random() * 0.15,
        phase: Math.random() * Math.PI * 2, opacity: 0.06 + Math.random() * 0.08,
      })),
      // Arrows
      ...Array.from({ length: 6 }, (_, i) => ({
        type: 'arrow', x: Math.random() * 100, y: Math.random() * 100,
        size: 16 + Math.random() * 20, speed: 0.1 + Math.random() * 0.2,
        phase: Math.random() * Math.PI * 2, opacity: 0.05 + Math.random() * 0.06,
        rotation: Math.random() * Math.PI * 2,
      })),
    ];

    const drawStar = (ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number) => {
      const pts = 5;
      ctx.beginPath();
      for (let i = 0; i < pts * 2; i++) {
        const angle = (i * Math.PI) / pts - Math.PI / 2;
        const r = i % 2 === 0 ? size : size * 0.4;
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.closePath();
    };

    const drawLeaf = (ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, rot: number) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rot);
      ctx.beginPath();
      ctx.moveTo(0, -size);
      ctx.bezierCurveTo(size * 0.7, -size * 0.5, size * 0.7, size * 0.5, 0, size);
      ctx.bezierCurveTo(-size * 0.7, size * 0.5, -size * 0.7, -size * 0.5, 0, -size);
      ctx.restore();
    };

    const drawArrow = (ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, rot: number) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rot);
      ctx.beginPath();
      ctx.moveTo(-size, 0);
      ctx.lineTo(size * 0.4, 0);
      ctx.moveTo(size * 0.4, 0);
      ctx.lineTo(size * 0.1, -size * 0.35);
      ctx.moveTo(size * 0.4, 0);
      ctx.lineTo(size * 0.1, size * 0.35);
      ctx.restore();
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t.current += 0.008;
      const W = canvas.width;
      const H = canvas.height;

      ctx.strokeStyle = G;
      ctx.fillStyle = G;
      ctx.lineWidth = 1.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      elements.forEach((el: any) => {
        const floatY = Math.sin(t.current * el.speed + el.phase) * 12;
        const floatX = Math.cos(t.current * el.speed * 0.7 + el.phase) * 8;
        const cx = (el.x / 100) * W + floatX;
        const cy = (el.y / 100) * H + floatY;

        ctx.globalAlpha = el.opacity * (0.7 + 0.3 * Math.sin(t.current * el.speed * 2 + el.phase));

        if (el.type === 'star') {
          ctx.lineWidth = 1.5;
          drawStar(ctx, cx, cy, el.size);
          ctx.stroke();
        } else if (el.type === 'wave') {
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          for (let x = 0; x <= W; x += 4) {
            const waveY = (el.y / 100) * H + Math.sin((x / W) * Math.PI * 6 + t.current * el.speed + el.phase) * el.amplitude;
            x === 0 ? ctx.moveTo(x, waveY) : ctx.lineTo(x, waveY);
          }
          ctx.stroke();
        } else if (el.type === 'circle') {
          ctx.lineWidth = 1.5;
          ctx.setLineDash([4, 6]);
          ctx.beginPath();
          ctx.arc(cx, cy, el.size, 0, Math.PI * 2);
          ctx.stroke();
          ctx.setLineDash([]);
        } else if (el.type === 'leaf') {
          ctx.lineWidth = 1.5;
          const rot = el.rotation + t.current * el.speed * 0.5;
          drawLeaf(ctx, cx, cy, el.size, rot);
          ctx.stroke();
        } else if (el.type === 'dot') {
          ctx.beginPath();
          ctx.arc(cx, cy, el.size, 0, Math.PI * 2);
          ctx.fill();
        } else if (el.type === 'arrow') {
          ctx.lineWidth = 2;
          const rot = el.rotation + Math.sin(t.current * el.speed + el.phase) * 0.3;
          drawArrow(ctx, cx, cy, el.size, rot);
          ctx.stroke();
        }
      });

      ctx.globalAlpha = 1;
      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: 0, opacity: 1,
      }}
    />
  );
};

/* ─────────────────────────────────────────────
   WOBBLY SVG CARD BORDER
───────────────────────────────────────────── */
const WobblyBorder = ({ color = G, opacity = 0.25 }: { color?: string; opacity?: number }) => (
  <svg
    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none"
  >
    <rect
      x="2" y="2" width="calc(100% - 4)" height="calc(100% - 4)"
      rx="14" ry="14"
      fill="none"
      stroke={color}
      strokeWidth="2.5"
      strokeDasharray="8 4"
      opacity={opacity}
      pathLength="100"
    />
  </svg>
);

/* ─────────────────────────────────────────────
   HAND-DRAWN UNDERLINE
───────────────────────────────────────────── */
const HandUnderline = ({ color = G, width = 160 }: { color?: string; width?: number }) => (
  <svg viewBox={`0 0 ${width} 10`} width={width} height={10} style={{ display: 'block', marginTop: -4 }}>
    <path
      d={`M4,6 Q${width * 0.25},2 ${width * 0.5},6 Q${width * 0.75},10 ${width - 4},5`}
      fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" opacity={0.5}
    />
  </svg>
);

/* ─────────────────────────────────────────────
   SKETCH FILTER SVG
───────────────────────────────────────────── */
const SketchFilter = () => (
  <svg width="0" height="0" style={{ position: 'absolute' }}>
    <defs>
      <filter id="skProducts">
        <feTurbulence type="turbulence" baseFrequency="0.015" numOctaves="3" seed="2" />
        <feDisplacementMap in="SourceGraphic" scale="2.2" />
      </filter>
      <filter id="skWobble">
        <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" seed="5" />
        <feDisplacementMap in="SourceGraphic" scale="3" />
      </filter>
    </defs>
  </svg>
);

/* ─────────────────────────────────────────────
   DOODLE TAPE STRIP
───────────────────────────────────────────── */
const DoodleTape = ({ rotate = -2, color = 'rgba(21,128,61,0.12)' }: { rotate?: number; color?: string }) => (
  <div style={{
    position: 'absolute', top: -10, left: '50%',
    transform: `translateX(-50%) rotate(${rotate}deg)`,
    width: 80, height: 22,
    background: color,
    borderRadius: 3,
    zIndex: 2,
    backdropFilter: 'blur(2px)',
    border: '1px dashed rgba(21,128,61,0.25)',
  }} />
);

/* ─────────────────────────────────────────────
   NOTEBOOK LINES
───────────────────────────────────────────── */
const NotebookLines = () => (
  <>
    {Array.from({ length: 40 }, (_, i) => (
      <div key={i} style={{
        position: 'fixed', left: 0, right: 0, top: 56 + i * 36,
        height: 1, background: 'rgba(21,128,61,0.05)', pointerEvents: 'none', zIndex: 0,
      }} />
    ))}
    {/* Red margin line */}
    <div style={{
      position: 'fixed', left: 52, top: 0, bottom: 0,
      width: 1.5, background: 'rgba(220,38,38,0.07)', pointerEvents: 'none', zIndex: 0,
    }} />
  </>
);

/* ─────────────────────────────────────────────
   SCRIBBLE BADGE
───────────────────────────────────────────── */
const ScribbleBadge = ({ children, bg = '#fffde6', border = G }: { children: React.ReactNode; bg?: string; border?: string }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', gap: 4,
    padding: '4px 12px 4px 10px',
    background: bg, border: `2px solid ${border}30`,
    borderRadius: '50px',
    fontFamily: FD, fontSize: 13, color: border,
    filter: 'url(#skWobble)',
    boxShadow: `2px 2px 0 ${border}18`,
  }}>
    {children}
  </span>
);

/* ─────────────────────────────────────────────
   PENCIL BUTTON
───────────────────────────────────────────── */
const PencilButton = ({
  children, onClick, style = {}, variant = 'primary'
}: { children: React.ReactNode; onClick?: () => void; style?: React.CSSProperties; variant?: 'primary' | 'ghost' }) => (
  <motion.button
    onClick={onClick}
    whileHover={{ scale: 1.04 }}
    whileTap={{ scale: 0.96 }}
    style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      padding: '10px 20px', borderRadius: 12, cursor: 'pointer',
      fontFamily: FD, fontSize: 16, fontWeight: 700, letterSpacing: 0.3,
      border: variant === 'primary' ? 'none' : `2px solid ${G}`,
      background: variant === 'primary'
        ? `linear-gradient(135deg, ${G} 0%, #1a7a36 50%, #22a349 100%)`
        : 'transparent',
      color: variant === 'primary' ? '#fff' : G,
      filter: 'url(#skWobble)',
      boxShadow: variant === 'primary'
        ? `4px 4px 0px rgba(21,128,61,0.35), inset 0 1px 0 rgba(255,255,255,0.15)`
        : `2px 2px 0px rgba(21,128,61,0.2)`,
      transition: 'all 0.2s',
      ...style,
    }}
  >
    {children}
  </motion.button>
);

/* ─────────────────────────────────────────────
   DOODLE CARD
───────────────────────────────────────────── */
const DoodleCard = ({
  children, style = {}, hover = true, tapeColor
}: { children: React.ReactNode; style?: React.CSSProperties; hover?: boolean; tapeColor?: string }) => (
  <motion.div
    whileHover={hover ? { y: -6, rotate: 0.3 } : {}}
    style={{
      background: '#fff',
      border: `2.5px solid rgba(21,128,61,0.18)`,
      borderRadius: 18,
      position: 'relative',
      overflow: 'visible',
      boxShadow: '4px 6px 0px rgba(21,128,61,0.12), 0 2px 12px rgba(0,0,0,0.06)',
      ...style,
    }}
  >
    {tapeColor && <DoodleTape color={tapeColor} />}
    <div style={{ overflow: 'hidden', borderRadius: 16 }}>
      {children}
    </div>
  </motion.div>
);

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function Products() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedPackage, setSelectedPackage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [thumbnailScrollPos, setThumbnailScrollPos] = useState(0);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const fetchedProducts = await productAPI.getAll();
        const productsWithData = (Array.isArray(fetchedProducts) ? fetchedProducts : []).map((product: Product) => ({
          ...product,
          rating: product.rating || 0,
          reviews: product.reviews || 0,
        }));
        setProducts(productsWithData);
        setError('');
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError('Failed to load products from backend.');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleProductChange = (product: Product) => {
    setSelectedProduct(product);
    setSelectedPackage(0);
    setQuantity(1);
    setCurrentImageIndex(0);
    setThumbnailScrollPos(0);
  };

  const handleBackToGrid = () => {
    setSelectedProduct(null);
    setQuantity(1);
    setCurrentImageIndex(0);
    setThumbnailScrollPos(0);
  };

  const handlePrevImage = () => {
    const pkgImages = (packageData?.images as string[]) || [];
    if (pkgImages.length > 0) {
      const totalImages = Math.min(5, pkgImages.length);
      setCurrentImageIndex((prev) => (prev === 0 ? totalImages - 1 : prev - 1));
    }
  };

  const handleNextImage = () => {
    const pkgImages = (packageData?.images as string[]) || [];
    if (pkgImages.length > 0) {
      const totalImages = Math.min(5, pkgImages.length);
      setCurrentImageIndex((prev) => (prev === totalImages - 1 ? 0 : prev + 1));
    }
  };

  const handleAddToCart = async () => {
    if (!selectedProduct || !packageData) return;
    if (!user) { setShowLoginModal(true); return; }

    const cartItem: CartItem = {
      id: `${selectedProduct.id}-${packageData.id}`,
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      packageId: packageData.id,
      packageName: `${packageData.duration} · ${packageData.pouches} pouches`,
      price: packageData.price,
      origPrice: packageData.origPrice,
      quantity,
      image: packageData.images?.[0] || '/images/Products/brownpack.png',
      duration: packageData.duration,
      pouches: packageData.pouches,
    };

    try {
      await addToCart(cartItem);
      setToastMessage(`✓ Added ${quantity} ${packageData.duration} package(s) to cart!`);
      setShowToast(true);
      setQuantity(1);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      console.error('Error adding to cart:', err);
      setToastMessage('Failed to add item to cart. Please try again.');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const packageData = selectedProduct?.packages?.[selectedPackage];
  const price = packageData?.price || 0;

  /* ── Loading ── */
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: BG, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FS }}>
        <DoodleCanvas />
        <SketchFilter />
        <motion.div
          animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.02, 0.98, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          style={{ textAlign: 'center', zIndex: 1 }}
        >
          <p style={{ fontFamily: FD, fontSize: 22, color: G, filter: 'url(#skProducts)' }}>
            ✏️ Loading products...
          </p>
        </motion.div>
      </div>
    );
  }

  /* ── Error ── */
  if (error || products.length === 0) {
    return (
      <div style={{ minHeight: '100vh', background: BG, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FS }}>
        <DoodleCanvas />
        <SketchFilter />
        <div style={{ textAlign: 'center', zIndex: 1 }}>
          <p style={{ fontFamily: FD, fontSize: 20, color: '#d32f2f' }}>{error || 'No products available'}</p>
          <p style={{ fontFamily: FS, fontSize: 14, color: '#999', marginTop: 8 }}>Check AdminProducts to add products.</p>
        </div>
      </div>
    );
  }

  /* ════════════════════════════════════════════
     PRODUCT GRID VIEW
  ════════════════════════════════════════════ */
  if (!selectedProduct) {
    return (
      <div style={{ minHeight: '100vh', background: BG, fontFamily: FS, position: 'relative' }}>
        <DoodleCanvas />
        <SketchFilter />
        <NotebookLines />
        <Navbar />

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px', paddingTop: 120, position: 'relative', zIndex: 1 }}>

          {/* ── Page Header ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: 'center', marginBottom: 60 }}
          >
            {/* Doodle arrow pointing down */}
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
              style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}
            >
              <svg width="40" height="32" viewBox="0 0 40 32">
                <path d="M20,2 Q28,8 22,16 Q18,22 20,30" fill="none" stroke={G} strokeWidth="2.5" strokeLinecap="round" opacity={0.5} />
                <path d="M20,30 L14,22 M20,30 L26,22" fill="none" stroke={G} strokeWidth="2.5" strokeLinecap="round" opacity={0.5} />
              </svg>
            </motion.div>

            <h1 style={{
              fontFamily: FD, fontSize: 'clamp(36px, 6vw, 56px)', fontWeight: 900,
              color: '#1a1a1a', margin: 0, letterSpacing: -1,
              filter: 'url(#skProducts)',
            }}>
              Our Products
            </h1>
            <HandUnderline width={200} />
            <p style={{
              fontFamily: FS, fontSize: 16, color: '#777', marginTop: 16,
              maxWidth: 440, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.7,
            }}>
              Handpicked with love 🌿 — tap any card to explore!
            </p>
          </motion.div>

          {/* ── Grid ── */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
            gap: 28,
          }}>
            {products.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30, rotate: idx % 2 === 0 ? -1 : 1 }}
                whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, type: 'spring', stiffness: 100 }}
                onClick={() => handleProductChange(product)}
                style={{ cursor: 'pointer' }}
              >
                <DoodleCard
                  tapeColor={['rgba(21,128,61,0.15)', 'rgba(255,200,50,0.2)', 'rgba(99,102,241,0.12)'][idx % 3]}
                  style={{ overflow: 'hidden' }}
                >
                  {/* Product Image */}
                  <div style={{
                    width: '100%', height: 240,
                    background: `linear-gradient(135deg, rgba(21,128,61,0.05) 0%, rgba(21,128,61,0.02) 100%)`,
                    position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    borderBottom: '2px dashed rgba(21,128,61,0.12)',
                  }}>
                    {/* Corner doodle */}
                    <svg style={{ position: 'absolute', top: 8, right: 8, opacity: 0.2 }} width="32" height="32" viewBox="0 0 32 32">
                      <path d="M4,4 Q16,2 28,4 Q30,16 28,28 Q16,30 4,28 Q2,16 4,4" fill="none" stroke={G} strokeWidth="1.5" strokeDasharray="3 3" />
                    </svg>
                    <motion.div
                      whileHover={{ scale: 1.08, rotate: 3 }}
                      transition={{ type: 'spring', stiffness: 250 }}
                    >
                      <Image
                        src={product.packages?.[0]?.images?.[0] || '/images/Products/brownpack.png'}
                        alt={product.name}
                        width={200} height={200}
                        style={{ objectFit: 'contain', filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.10))' }}
                      />
                    </motion.div>

                    {/* Discount badge if exists */}
                    {product.packages?.[0]?.savePct && (
                      <motion.div
                        animate={{ rotate: [-3, 3, -3] }}
                        transition={{ repeat: Infinity, duration: 3 }}
                        style={{
                          position: 'absolute', top: 14, left: 14,
                          background: '#dc2626', color: '#fff',
                          fontFamily: FD, fontSize: 13, fontWeight: 700,
                          padding: '4px 10px', borderRadius: 8,
                          filter: 'url(#skWobble)',
                          boxShadow: '2px 2px 0 rgba(220,38,38,0.3)',
                        }}
                      >
                        {product.packages?.[0]?.savePct}
                      </motion.div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div style={{ padding: '20px 22px 24px' }}>
                    <h3 style={{
                      fontFamily: FD, fontSize: 22, fontWeight: 800, color: '#1a1a1a',
                      margin: '0 0 6px', letterSpacing: 0.2,
                    }}>
                      {product.name}
                    </h3>
                    <p style={{
                      fontFamily: FS, fontSize: 13.5, color: '#777', lineHeight: 1.55,
                      margin: '0 0 14px', minHeight: 40,
                    }}>
                      {product.description.substring(0, 65)}...
                    </p>

                    {/* Rating */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
                      <div style={{ display: 'flex', gap: 2 }}>
                        {[1, 2, 3, 4, 5].map(s => (
                          <Star key={s} size={13} fill={s <= Math.round(product.rating ?? 0) ? '#facc15' : 'none'} color="#facc15" />
                        ))}
                      </div>
                      <span style={{ fontFamily: FS, fontSize: 12, color: '#888' }}>
                        {product.rating ?? 0} ({(product.reviews ?? 0).toLocaleString()})
                      </span>
                    </div>

                    {/* Price Row */}
                    <div style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '12px 14px',
                      background: 'rgba(21,128,61,0.05)',
                      border: '2px dashed rgba(21,128,61,0.2)',
                      borderRadius: 12,
                      marginBottom: 16,
                    }}>
                      <div>
                        <p style={{ fontFamily: FS, fontSize: 11, color: '#999', margin: 0, textTransform: 'uppercase', letterSpacing: 0.5 }}>From</p>
                        <p style={{ fontFamily: FD, fontSize: 24, fontWeight: 800, color: G, margin: 0 }}>
                          ₹{(product.packages?.[0]?.price ?? 0).toLocaleString()}
                        </p>
                      </div>
                      <svg width="28" height="28" viewBox="0 0 28 28" style={{ opacity: 0.2 }}>
                        <circle cx="14" cy="14" r="12" fill="none" stroke={G} strokeWidth="2" strokeDasharray="5 3" />
                        <path d="M10,14 L18,14 M18,14 L14,10 M18,14 L14,18" stroke={G} strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </div>

                    {/* View Details */}
                    <PencilButton style={{ width: '100%' }}>
                      ✏️ View Details →
                    </PencilButton>
                  </div>
                </DoodleCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ── No package data guard ── */
  if (!packageData) {
    return (
      <div style={{ minHeight: '100vh', background: BG, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ fontFamily: FD, fontSize: 20, color: '#666' }}>Failed to load product details</p>
      </div>
    );
  }

  const images = packageData.images || [];

  /* ════════════════════════════════════════════
     PRODUCT DETAIL VIEW
  ════════════════════════════════════════════ */
  return (
    <div style={{ minHeight: '100vh', background: BG, fontFamily: FS, position: 'relative' }}>
      <DoodleCanvas />
      <SketchFilter />
      <NotebookLines />
      <Navbar />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px', paddingTop: 120, position: 'relative', zIndex: 1 }}>

        {/* ── Back + Title ── */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}
        >
          <PencilButton variant="ghost" onClick={handleBackToGrid} style={{ padding: '8px 16px', fontSize: 14 }}>
            ← All Products
          </PencilButton>
          <div>
            <h1 style={{
              fontFamily: FD, fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 900,
              color: '#1a1a1a', margin: 0, filter: 'url(#skProducts)',
            }}>
              {selectedProduct.name}
            </h1>
            <HandUnderline width={Math.min(300, selectedProduct.name.length * 14)} />
          </div>
        </motion.div>

        {/* ── Main Detail Card ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedProduct.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.4, type: 'spring', stiffness: 80 }}
          >
            <DoodleCard hover={false} tapeColor="rgba(21,128,61,0.15)" style={{ marginBottom: 36 }}>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'clamp(280px, 44%, 500px) 1fr',
              }}>

                {/* ── LEFT: Image gallery ── */}
                <div style={{
                  padding: 'clamp(24px, 4vw, 48px)',
                  background: 'linear-gradient(135deg, rgba(21,128,61,0.04) 0%, rgba(21,128,61,0.02) 100%)',
                  borderRight: '2px dashed rgba(21,128,61,0.15)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  position: 'relative',
                }}>

                  {/* Package tag */}
                  <ScribbleBadge>
                    📦 {packageData.duration} · {packageData.pouches} pouches
                  </ScribbleBadge>

                  {/* Main image carousel */}
                  <div style={{ width: '100%', maxWidth: 360, marginTop: 24, marginBottom: 12 }}>
                    <div style={{ width: '100%', aspectRatio: '1', position: 'relative' }}>
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={`${selectedProduct.id}-${currentImageIndex}`}
                          initial={{ opacity: 0, scale: 0.9, rotate: -3 }}
                          animate={{ opacity: 1, scale: 1, rotate: 0 }}
                          exit={{ opacity: 0, scale: 0.9, rotate: 3 }}
                          transition={{ duration: 0.35, type: 'spring', stiffness: 120 }}
                          style={{ width: '100%', height: '100%', position: 'relative' }}
                        >
                          <Image
                            src={images[currentImageIndex] || '/images/Products/brownpack.png'}
                            alt={`${selectedProduct.name} - Image ${currentImageIndex + 1}`}
                            fill
                            style={{ objectFit: 'contain', filter: 'drop-shadow(0 12px 32px rgba(0,0,0,0.12))' }}
                            sizes="360px"
                          />
                        </motion.div>
                      </AnimatePresence>

                      {/* Navigation arrows */}
                      {images.length > 1 && (
                        <>
                          <motion.button
                            whileHover={{ scale: 1.18 }}
                            whileTap={{ scale: 0.88 }}
                            onClick={handlePrevImage}
                            style={{
                              position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)',
                              width: 40, height: 40, borderRadius: '50%',
                              border: `2.5px solid ${G}`, background: '#fff',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              cursor: 'pointer', zIndex: 10, color: G,
                              boxShadow: `3px 3px 0 rgba(21,128,61,0.2)`,
                              filter: 'url(#skWobble)',
                            }}
                          >
                            <ChevronLeft size={22} strokeWidth={2.5} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.18 }}
                            whileTap={{ scale: 0.88 }}
                            onClick={handleNextImage}
                            style={{
                              position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
                              width: 40, height: 40, borderRadius: '50%',
                              border: `2.5px solid ${G}`, background: '#fff',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              cursor: 'pointer', zIndex: 10, color: G,
                              boxShadow: `3px 3px 0 rgba(21,128,61,0.2)`,
                              filter: 'url(#skWobble)',
                            }}
                          >
                            <ChevronRight size={22} strokeWidth={2.5} />
                          </motion.button>
                        </>
                      )}
                    </div>

                    {/* Thumbnails */}
                    {images.length > 1 && (
                      <div style={{ display: 'flex', gap: 8, overflowX: 'hidden', marginTop: 12, alignItems: 'center' }}>
                        {thumbnailScrollPos > 0 && (
                          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                            onClick={() => setThumbnailScrollPos(Math.max(0, thumbnailScrollPos - 80))}
                            style={{ width: 32, height: 32, borderRadius: 6, border: `2px solid ${G}`, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: G, flexShrink: 0 }}>
                            <ChevronLeft size={18} />
                          </motion.button>
                        )}
                        <div style={{ display: 'flex', gap: 8, overflowX: 'hidden', flex: 1 }}>
                          {images.slice(0, 5).map((img: string, idx: number) => (
                            <motion.div
                              key={idx}
                              whileHover={{ scale: 1.08, rotate: 2 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setCurrentImageIndex(idx)}
                              style={{
                                flexShrink: 0, width: 68, height: 68, borderRadius: 10,
                                border: currentImageIndex === idx ? `3px solid ${G}` : '2px dashed rgba(21,128,61,0.25)',
                                background: currentImageIndex === idx ? 'rgba(21,128,61,0.08)' : '#fff',
                                cursor: 'pointer', position: 'relative', overflow: 'hidden',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: currentImageIndex === idx ? `3px 3px 0 rgba(21,128,61,0.2)` : 'none',
                                transition: 'all 0.2s',
                              }}
                            >
                              <Image src={img} alt={`Thumb ${idx + 1}`} width={68} height={68} style={{ objectFit: 'contain' }} />
                            </motion.div>
                          ))}
                        </div>
                        {images.length > 4 && thumbnailScrollPos < ((images.length - 4) * 80) && (
                          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                            onClick={() => setThumbnailScrollPos(Math.min(((images.length - 4) * 80), thumbnailScrollPos + 80))}
                            style={{ width: 32, height: 32, borderRadius: 6, border: `2px solid ${G}`, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: G, flexShrink: 0 }}>
                            <ChevronRight size={18} />
                          </motion.button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Package selector */}
                  <div style={{ display: 'flex', gap: 10, marginTop: 20, width: '100%' }}>
                    {(selectedProduct.packages || []).map((pkg, i) => (
                      <motion.div
                        key={pkg.id}
                        whileHover={{ scale: 1.04, rotate: selectedPackage === i ? 0 : 1 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => { setSelectedPackage(i); setCurrentImageIndex(0); }}
                        style={{
                          flex: 1, borderRadius: 12, padding: '12px 8px',
                          border: selectedPackage === i ? `3px solid ${G}` : '2.5px dashed rgba(21,128,61,0.25)',
                          background: selectedPackage === i ? 'rgba(21,128,61,0.08)' : '#fafafa',
                          cursor: 'pointer', textAlign: 'center',
                          boxShadow: selectedPackage === i ? `3px 3px 0 rgba(21,128,61,0.2)` : 'none',
                          transition: 'all 0.3s',
                          filter: selectedPackage === i ? 'url(#skWobble)' : 'none',
                        }}
                      >
                        {pkg.tag && (
                          <div style={{ fontFamily: FD, fontSize: 11, fontWeight: 700, color: G, letterSpacing: 0.5, marginBottom: 2 }}>
                            {pkg.tag}
                          </div>
                        )}
                        <div style={{ fontFamily: FD, fontSize: 16, fontWeight: 700, color: selectedPackage === i ? G : '#444' }}>
                          {pkg.duration}
                        </div>
                        <div style={{ fontFamily: FS, fontSize: 11, color: '#888', marginTop: 2 }}>{pkg.pouches} pouches</div>
                        {pkg.savePct && (
                          <div style={{ fontFamily: FS, fontSize: 10, fontWeight: 700, color: '#dc2626', marginTop: 4 }}>
                            {pkg.savePct}
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* ── RIGHT: Product info ── */}
                <div style={{ padding: 'clamp(24px, 4vw, 48px)' }}>

                  {/* Reviews */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                    <div style={{ display: 'flex', gap: 3 }}>
                      {[1, 2, 3, 4, 5].map(s => (
                        <Star key={s} size={15} fill={s <= Math.round(selectedProduct.rating ?? 0) ? '#facc15' : 'none'} color="#facc15" />
                      ))}
                    </div>
                    <span style={{ fontFamily: FD, fontSize: 14, color: '#666' }}>
                      {selectedProduct.rating ?? 0} · {(selectedProduct.reviews ?? 0).toLocaleString()} Reviews
                    </span>
                  </div>

                  {/* Title */}
                  <h2 style={{ fontFamily: FD, fontSize: 'clamp(22px, 3.5vw, 34px)', fontWeight: 900, color: '#1a1a1a', margin: '0 0 6px', filter: 'url(#skProducts)' }}>
                    {selectedProduct.name}
                  </h2>
                  <HandUnderline width={180} />
                  <p style={{ fontFamily: FS, fontSize: 15, color: '#555', lineHeight: 1.65, margin: '14px 0 22px' }}>
                    {selectedProduct.description}
                  </p>

                  {/* Price block */}
                  <div style={{
                    padding: '18px 20px',
                    background: 'linear-gradient(135deg, rgba(21,128,61,0.06), rgba(21,128,61,0.02))',
                    border: '2.5px dashed rgba(21,128,61,0.25)',
                    borderRadius: 14,
                    marginBottom: 18,
                    position: 'relative',
                    overflow: 'hidden',
                  }}>
                    {/* Doodle price tag corner */}
                    <svg style={{ position: 'absolute', top: -6, right: -6, opacity: 0.08 }} width="60" height="60" viewBox="0 0 60 60">
                      <circle cx="30" cy="30" r="28" fill={G} />
                    </svg>

                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
                      <span style={{ fontFamily: FD, fontSize: 40, fontWeight: 900, color: G, lineHeight: 1 }}>
                        ₹{price.toLocaleString()}
                      </span>
                      {packageData?.origPrice && packageData.price < packageData.origPrice && (
                        <span style={{ fontFamily: FD, fontSize: 20, color: '#bbb', textDecoration: 'line-through' }}>
                          ₹{packageData.origPrice.toLocaleString()}
                        </span>
                      )}
                      {packageData?.savePct && (
                        <motion.span
                          animate={{ rotate: [-2, 2, -2] }}
                          transition={{ repeat: Infinity, duration: 2.5 }}
                          style={{
                            fontFamily: FD, fontSize: 14, fontWeight: 700, color: '#fff',
                            background: '#dc2626', padding: '4px 10px', borderRadius: 8,
                            filter: 'url(#skWobble)',
                            boxShadow: '2px 2px 0 rgba(220,38,38,0.35)',
                          }}
                        >
                          {packageData.savePct}
                        </motion.span>
                      )}
                    </div>
                    <p style={{ fontFamily: FS, fontSize: 12, color: '#999', margin: '4px 0 0' }}>
                      per {packageData?.duration}
                    </p>
                  </div>

                  {/* Quantity + Add to cart */}
                  <div style={{ display: 'flex', gap: 12, marginBottom: 22 }}>
                    {/* Qty */}
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      border: `2.5px dashed ${G}`, borderRadius: 12, padding: '8px 14px',
                      background: 'rgba(21,128,61,0.04)',
                      filter: 'url(#skWobble)',
                    }}>
                      <motion.button
                        whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.85 }}
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        style={{
                          width: 30, height: 30, border: 'none',
                          background: 'rgba(21,128,61,0.1)', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: G, borderRadius: 6, fontFamily: FD, fontSize: 20, fontWeight: 700,
                        }}
                      >−</motion.button>
                      <span style={{ fontFamily: FD, fontSize: 22, fontWeight: 800, color: '#1a1a1a', minWidth: 28, textAlign: 'center' }}>
                        {quantity}
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.85 }}
                        onClick={() => setQuantity(quantity + 1)}
                        style={{
                          width: 30, height: 30, border: 'none',
                          background: G, cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: '#fff', borderRadius: 6, fontFamily: FD, fontSize: 20, fontWeight: 700,
                        }}
                      >+</motion.button>
                    </div>

                    {/* Add to cart */}
                    <motion.button
                      onClick={handleAddToCart}
                      whileHover={{ scale: 1.03, y: -2 }}
                      whileTap={{ scale: 0.97 }}
                      style={{
                        flex: 1, height: 52, borderRadius: 14,
                        background: `linear-gradient(135deg, ${G}, #1a7a36 60%, #22a349)`,
                        border: 'none', color: '#fff',
                        fontFamily: FD, fontSize: 18, fontWeight: 800,
                        cursor: 'pointer', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', gap: 10,
                        boxShadow: `4px 4px 0px rgba(21,128,61,0.35), 0 8px 20px rgba(21,128,61,0.2)`,
                        filter: 'url(#skWobble)',
                        transition: 'all 0.25s',
                      }}
                    >
                      <ShoppingCart size={20} strokeWidth={2.5} />
                      Add to Cart · ₹{(price * quantity).toLocaleString()}
                    </motion.button>
                  </div>

                  {/* Trust badges */}
                  <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                    {[
                      { icon: <RotateCcw size={14} />, label: 'No Questions Asked Refund' },
                      { icon: <Truck size={14} />, label: 'Free Shipping on All Orders' },
                    ].map(({ icon, label }) => (
                      <div key={label} style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        padding: '6px 12px', borderRadius: 20,
                        border: '1.5px dashed rgba(21,128,61,0.25)',
                        background: 'rgba(21,128,61,0.03)',
                      }}>
                        <span style={{ color: G }}>{icon}</span>
                        <span style={{ fontFamily: FS, fontSize: 12, color: '#666' }}>{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── Bottom: Benefits + Nutrients ── */}
              <div style={{
                borderTop: '2px dashed rgba(21,128,61,0.18)',
                padding: 'clamp(28px, 5vw, 48px)',
                display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48,
                background: 'rgba(21,128,61,0.01)',
              }}>

                {/* Benefits */}
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                    <div style={{
                      background: 'rgba(21,128,61,0.1)', padding: '8px 10px', borderRadius: 10,
                      filter: 'url(#skWobble)',
                    }}>
                      <Zap size={20} color={G} />
                    </div>
                    <h3 style={{ fontFamily: FD, fontSize: 22, fontWeight: 800, color: '#1a1a1a', margin: 0 }}>
                      What makes it different
                    </h3>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {(packageData?.benefits || []).map((b: string, idx: number) => (
                      <motion.div
                        key={b}
                        initial={{ opacity: 0, x: -18 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.08 }}
                        viewport={{ once: true }}
                        whileHover={{ x: 6 }}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 12,
                          padding: '12px 16px', borderRadius: 12,
                          border: '2px dashed rgba(21,128,61,0.2)',
                          background: 'rgba(21,128,61,0.04)',
                          transition: 'all 0.25s',
                          cursor: 'default',
                        }}
                      >
                        <div style={{
                          width: 26, height: 26, borderRadius: '50%',
                          background: `linear-gradient(135deg, ${G}, #22c55e)`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          flexShrink: 0, filter: 'url(#skWobble)',
                          boxShadow: '2px 2px 0 rgba(21,128,61,0.25)',
                        }}>
                          <Check size={15} color="#fff" strokeWidth={3} />
                        </div>
                        <span style={{ fontFamily: FS, fontSize: 14, color: '#333', fontWeight: 500 }}>{b}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Nutrients */}
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                    <div style={{
                      background: 'rgba(21,128,61,0.1)', padding: '8px 10px', borderRadius: 10,
                      filter: 'url(#skWobble)',
                    }}>
                      <BarChart3 size={20} color={G} />
                    </div>
                    <h3 style={{ fontFamily: FD, fontSize: 22, fontWeight: 800, color: '#1a1a1a', margin: 0 }}>
                      Key Nutrients
                    </h3>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    {(packageData?.nutrients || []).map((n: ProductNutrient, idx: number) => (
                      <motion.div
                        key={n.label}
                        initial={{ opacity: 0, scale: 0.85 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.07, type: 'spring', stiffness: 120 }}
                        viewport={{ once: true }}
                        whileHover={{ y: -5, rotate: 1 }}
                        style={{
                          padding: '16px 14px', borderRadius: 14,
                          background: 'linear-gradient(135deg, #fffde6 0%, #fef9c3 100%)',
                          border: '2.5px dashed rgba(21,128,61,0.22)',
                          position: 'relative', overflow: 'hidden',
                          boxShadow: '3px 3px 0 rgba(21,128,61,0.12)',
                          transition: 'all 0.25s',
                        }}
                      >
                        <div style={{ position: 'absolute', top: 4, right: 8, fontSize: 28, opacity: 0.12 }}>
                          {n.emoji}
                        </div>
                        <p style={{ fontFamily: FS, fontSize: 11, fontWeight: 700, color: '#888', margin: 0, textTransform: 'uppercase', letterSpacing: 0.6 }}>
                          {n.label}
                        </p>
                        <p style={{ fontFamily: FD, fontSize: 26, fontWeight: 900, color: G, margin: '4px 0 0', lineHeight: 1 }}>
                          {n.amount}
                        </p>
                        <p style={{ fontFamily: FS, fontSize: 11.5, color: '#777', margin: '6px 0 0', fontStyle: 'italic' }}>
                          {n.friendly}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </DoodleCard>
          </motion.div>
        </AnimatePresence>

        {/* ── FAQs ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ marginBottom: 40 }}>
          <ProductFAQ productId={selectedProduct.id} />
        </motion.div>

        {/* ── Reviews ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <ReviewsSection productId={selectedProduct.id} />
        </motion.div>
      </div>

      {/* ── Responsive overrides ── */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700;800&family=Nunito:wght@400;500;600;700;800&display=swap');

        @media (max-width: 768px) {
          .products-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 900px) {
          [style*="gridTemplateColumns: clamp"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      {/* ── Toast ── */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 24, x: -16, rotate: -3 }}
            animate={{ opacity: 1, y: 0, x: 0, rotate: 0 }}
            exit={{ opacity: 0, y: -24, x: -16 }}
            transition={{ type: 'spring', stiffness: 200, damping: 18 }}
            style={{
              position: 'fixed', bottom: 28, left: 28,
              background: `linear-gradient(135deg, ${G}, #1a7a36)`,
              color: '#fff', padding: '14px 22px', borderRadius: 14,
              fontFamily: FD, fontSize: 16, fontWeight: 700,
              boxShadow: `4px 4px 0 rgba(21,128,61,0.4), 0 8px 24px rgba(21,128,61,0.25)`,
              zIndex: 1000, maxWidth: 300,
              filter: 'url(#skWobble)',
              border: '2px solid rgba(255,255,255,0.2)',
            }}
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Auth Modal ── */}
      <AuthModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </div>
  );
}