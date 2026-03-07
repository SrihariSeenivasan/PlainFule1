'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { ShoppingCart, Check, Star, Minus, Plus, Truck, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { productAPI, Product } from '@/lib/api';
import ProductFAQ from './ProductFAQ';
import ReviewsSection from './ReviewsSection';

/* ── theme ── */
const FD = "'Playfair Display', Georgia, serif";
const FS = "'DM Sans', 'Helvetica Neue', sans-serif";
const G  = '#15803d';
const BG = '#fdfaf3';

/* ─── sketch filter (reused from landing page) ─── */
const SketchFilter = () => (
  <svg width="0" height="0" style={{ position: 'absolute' }}>
    <filter id="skProducts">
      <feTurbulence type="turbulence" baseFrequency="0.015" numOctaves="3" seed="2" />
      <feDisplacementMap in="SourceGraphic" scale="2.5" />
    </filter>
  </svg>
);

/* ─── doodle decorations ─── */
const Squiggle = ({ style = {} }: { style?: React.CSSProperties }) => (
  <svg viewBox="0 0 120 20" width={120} height={20} style={{ position: 'absolute', ...style }} aria-hidden>
    <path d="M2,10 Q15,2 30,10 Q45,18 60,10 Q75,2 90,10 Q105,18 118,10"
      fill="none" stroke={G} strokeWidth="2" strokeLinecap="round" opacity={0.15} />
  </svg>
);

const DoodleCircle = ({ size = 40, style = {} }: { size?: number; style?: React.CSSProperties }) => (
  <svg viewBox="0 0 50 50" width={size} height={size} style={{ position: 'absolute', ...style }} aria-hidden>
    <circle cx="25" cy="25" r="20" fill="none" stroke={G} strokeWidth="1.5" strokeDasharray="4 3" opacity={0.12} />
  </svg>
);

const DoodleStar = ({ size = 24, style = {} }: { size?: number; style?: React.CSSProperties }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} style={{ position: 'absolute', ...style }} aria-hidden>
    <path d="M12,2 L13.2,9 L20,9 L14.6,13.4 L16.6,20 L12,15.8 L7.4,20 L9.4,13.4 L4,9 L10.8,9 Z"
      fill="none" stroke={G} strokeWidth="1.5" strokeLinecap="round" opacity={0.15} />
  </svg>
);

/* ─── product data interface ─── */
interface ExtendedProduct extends Product {
  packages: Package[];
  rating?: number;
  reviews?: number;
  benefits?: string[];
  nutrients?: { label: string; amount: string }[];
}

interface Package {
  id: string;
  duration: '7 days' | '15 days' | '30 days';
  daysCount: 7 | 15 | 30;
  pouches: number;
  oneTimePrice: number;
  subscribePrice: number;
  origPrice: number;
}

/* ─── main component ─── */
export default function Products({ onNavigate }: { onNavigate?: (view: string) => void } = {}) {
  const [products, setProducts] = useState<ExtendedProduct[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ExtendedProduct | null>(null);
  const [selectedPackage, setSelectedPackage] = useState(0);
  const [purchaseType, setPurchaseType] = useState<'onetime' | 'subscribe'>('onetime');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [thumbnailScrollPos, setThumbnailScrollPos] = useState(0);

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const fetchedProducts = await productAPI.getAll();
        
        // Enhance products with packages
        const enhancedProducts = (Array.isArray(fetchedProducts) ? fetchedProducts : []).map((product: Product) => {
          const basePrice = product.price || 1500;
          
          return {
            ...product,
            packages: [
              {
                id: '7days',
                duration: '7 days' as const,
                daysCount: 7,
                pouches: 7,
                oneTimePrice: Math.round(basePrice * 0.5),
                subscribePrice: Math.round(basePrice * 0.5 * 0.85),
                origPrice: Math.round(basePrice * 0.7),
              },
              {
                id: '15days',
                duration: '15 days' as const,
                daysCount: 15,
                pouches: 15,
                oneTimePrice: Math.round(basePrice * 1),
                subscribePrice: Math.round(basePrice * 1 * 0.85),
                origPrice: Math.round(basePrice * 1.3),
              },
              {
                id: '30days',
                duration: '30 days' as const,
                daysCount: 30,
                pouches: 30,
                oneTimePrice: Math.round(basePrice * 1.8),
                subscribePrice: Math.round(basePrice * 1.8 * 0.85),
                origPrice: Math.round(basePrice * 2.4),
              },
            ],
            rating: 4.8,
            reviews: 324,
            benefits: ['Lab tested', 'Premium quality', 'Best value', 'Trusted'],
            nutrients: [
              { label: 'Quality', amount: 'Premium' },
              { label: 'Stock', amount: `${product.stock}` },
              { label: 'Category', amount: product.category },
            ],
          };
        }) as ExtendedProduct[];
        
        setProducts(enhancedProducts);
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

  const handleProductChange = (product: ExtendedProduct) => {
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
    if (Array.isArray(selectedProduct?.images) && selectedProduct.images.length > 0) {
      const totalImages = Math.min(5, selectedProduct.images.length);
      setCurrentImageIndex((prev) => (prev === 0 ? totalImages - 1 : prev - 1));
    }
  };

  const handleNextImage = () => {
    if (Array.isArray(selectedProduct?.images) && selectedProduct.images.length > 0) {
      const totalImages = Math.min(5, selectedProduct.images.length);
      setCurrentImageIndex((prev) => (prev === totalImages - 1 ? 0 : prev + 1));
    }
  };

  const packageData = selectedProduct?.packages?.[selectedPackage];
  const price = packageData && purchaseType === 'subscribe' ? packageData.subscribePrice : packageData?.oneTimePrice || 0;

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: BG, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FS }}>
        <p style={{ fontSize: 18, color: '#666' }}>Loading products from backend...</p>
      </div>
    );
  }

  if (error || products.length === 0) {
    return (
      <div style={{ minHeight: '100vh', background: BG, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FS }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 18, color: '#d32f2f', marginBottom: 12 }}>{error || 'No products available'}</p>
          <p style={{ fontSize: 14, color: '#999' }}>Check AdminProducts to add products.</p>
        </div>
      </div>
    );
  }

  // Show product grid if no product is selected
  if (!selectedProduct) {
    return (
      <div style={{ minHeight: '100vh', background: BG, fontFamily: FS, position: 'relative' }}>
        <Navbar onNavigate={onNavigate} />
        <SketchFilter />

        {/* ── Doodle decorations ── */}
        <Squiggle style={{ top: 40, left: '5%', opacity: 0.12 }} />
        <Squiggle style={{ bottom: 80, right: '3%', opacity: 0.1, transform: 'rotate(180deg)' }} />
        <DoodleCircle size={60} style={{ top: 120, right: '8%', opacity: 0.08 }} />
        <DoodleStar size={28} style={{ top: 200, left: '3%', opacity: 0.12 }} />
        <DoodleCircle size={35} style={{ bottom: 200, left: '6%', opacity: 0.08 }} />
        <DoodleStar size={22} style={{ bottom: 150, right: '5%', opacity: 0.1 }} />

        {/* ── Ruled lines (notebook feel) ── */}
        {Array.from({ length: 30 }, (_, i) => (
          <div key={i} style={{
            position: 'absolute', left: 0, right: 0, top: 60 + i * 40,
            height: 1, background: 'rgba(21,128,61,0.04)', pointerEvents: 'none',
          }} />
        ))}

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px', paddingTop: 120, position: 'relative', zIndex: 1 }}>
          {/* ─── Page header ─── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ textAlign: 'center', marginBottom: 48 }}
          >
            <h1 style={{ fontFamily: FD, fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 800, color: '#1a1a1a', margin: 0 }}>
              Our Products
            </h1>
            <p style={{ fontFamily: FS, fontSize: 'clamp(14px, 2vw, 16px)', color: '#666', marginTop: 8, maxWidth: 500, marginLeft: 'auto', marginRight: 'auto' }}>
              Choose a product to see detailed information, packages, and customer reviews.
            </p>
          </motion.div>

          {/* ─── Product Grid ─── */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 24,
          }}>
            {products.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => handleProductChange(product)}
                style={{
                  background: '#fff',
                  border: '2px solid rgba(21,128,61,0.15)',
                  borderRadius: 16,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                  transition: 'all 0.3s ease',
                }}
                whileHover={{ boxShadow: '0 8px 24px rgba(0,0,0,0.12)', y: -4 }}
              >
                {/* Product Image */}
                <div style={{
                  width: '100%',
                  height: 240,
                  background: 'rgba(21,128,61,0.03)',
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Image
                    src={Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : '/images/Products/brownpack.png'}
                    alt={product.name}
                    width={200}
                    height={200}
                    style={{ objectFit: 'contain' }}
                  />
                </div>

                {/* Product Info */}
                <div style={{ padding: 20 }}>
                  <h3 style={{ fontFamily: FD, fontSize: 18, fontWeight: 800, color: '#1a1a1a', margin: '0 0 8px' }}>
                    {product.name}
                  </h3>
                  <p style={{ fontFamily: FS, fontSize: 14, color: '#666', lineHeight: 1.5, margin: '0 0 16px', minHeight: 42 }}>
                    {product.description.substring(0, 60)}...
                  </p>

                  {/* Rating */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
                    <div style={{ display: 'flex', gap: 2 }}>
                      {[1, 2, 3, 4, 5].map(s => (
                        <Star key={s} size={12} fill={s <= Math.round(product.rating ?? 0) ? '#facc15' : 'none'} color="#facc15" />
                      ))}
                    </div>
                    <span style={{ fontFamily: FS, fontSize: 12, color: '#666' }}>
                      {product.rating ?? 0} ({(product.reviews ?? 0).toLocaleString()})
                    </span>
                  </div>

                  {/* Price Range */}
                  <div style={{ padding: '12px', background: 'rgba(21,128,61,0.04)', borderRadius: 8, textAlign: 'center' }}>
                    <p style={{ fontFamily: FS, fontSize: 12, color: '#999', margin: 0, marginBottom: 4 }}>
                      Starting from
                    </p>
                    <p style={{ fontFamily: FD, fontSize: 20, fontWeight: 800, color: G, margin: 0 }}>
                      ₹{(product.packages?.[0]?.oneTimePrice ?? 0).toLocaleString()}
                    </p>
                  </div>

                  {/* View Details Button */}
                  <motion.div
                    whileHover={{ backgroundColor: '#1a7e34' }}
                    style={{
                      marginTop: 16,
                      padding: '10px',
                      background: G,
                      color: '#fff',
                      fontFamily: FS,
                      fontSize: 14,
                      fontWeight: 600,
                      borderRadius: 8,
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'background-color 0.3s',
                    }}
                  >
                    View Details →
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Show product details view
  if (!packageData) {
    return (
      <div style={{ minHeight: '100vh', background: BG, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FS }}>
        <p style={{ fontSize: 18, color: '#666' }}>Failed to load product details</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: BG, fontFamily: FS, position: 'relative' }}>
      <Navbar onNavigate={onNavigate} />
      <SketchFilter />

      {/* ── Doodle decorations ── */}
      <Squiggle style={{ top: 40, left: '5%', opacity: 0.12 }} />
      <Squiggle style={{ bottom: 80, right: '3%', opacity: 0.1, transform: 'rotate(180deg)' }} />
      <DoodleCircle size={60} style={{ top: 120, right: '8%', opacity: 0.08 }} />
      <DoodleStar size={28} style={{ top: 200, left: '3%', opacity: 0.12 }} />
      <DoodleCircle size={35} style={{ bottom: 200, left: '6%', opacity: 0.08 }} />
      <DoodleStar size={22} style={{ bottom: 150, right: '5%', opacity: 0.1 }} />

      {/* ── Ruled lines (notebook feel) ── */}
      {Array.from({ length: 30 }, (_, i) => (
        <div key={i} style={{
          position: 'absolute', left: 0, right: 0, top: 60 + i * 40,
          height: 1, background: 'rgba(21,128,61,0.04)', pointerEvents: 'none',
        }} />
      ))}

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px', paddingTop: 120, position: 'relative', zIndex: 1 }}>
        {/* ─── Back button + header ─── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBackToGrid}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 12px', borderRadius: 8,
              border: `1.5px solid ${G}`, background: 'transparent',
              color: G, fontFamily: FS, fontSize: 14, fontWeight: 600,
              cursor: 'pointer', transition: 'all 0.2s',
            }}
          >
            ← Back to Products
          </motion.button>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontFamily: FD, fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 800, color: '#1a1a1a', margin: 0 }}>
              {selectedProduct.name}
            </h1>
          </div>
        </div>

        {/* ─── Product detail card ─── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedProduct.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35 }}
          >
            {/* ── Notebook-style card ── */}
            <div style={{
              background: '#fff',
              border: '2px solid rgba(21,128,61,0.15)',
              borderRadius: 16,
              overflow: 'hidden',
              boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
              position: 'relative',
              marginBottom: 40,
            }}>
              {/* Tape decoration */}
              <div style={{
                position: 'absolute', top: -6, left: '50%', transform: 'translateX(-50%) rotate(-1deg)',
                width: 80, height: 24, background: 'rgba(21,128,61,0.08)',
                borderRadius: 4, zIndex: 2,
              }} />

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'clamp(280px, 45%, 520px) 1fr',
                gap: 0,
              }}>
                {/* ── LEFT: Image gallery ── */}
                <div style={{
                  padding: 'clamp(24px, 4vw, 48px)',
                  background: 'rgba(21,128,61,0.03)',
                  borderRight: '1px dashed rgba(21,128,61,0.15)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  position: 'relative',
                }}>
                  {/* Tag badge */}
                  <div style={{
                    position: 'absolute', top: 20, left: 20,
                    background: '#fffde6', border: '1.5px solid rgba(21,128,61,0.2)',
                    borderRadius: 6, padding: '4px 12px',
                    fontFamily: FS, fontSize: 12, fontWeight: 600, color: G,
                  }}>
                    {packageData.duration} · {packageData.pouches} pouches
                  </div>

                  {/* Main image carousel */}
                  <div style={{ width: '100%', maxWidth: 360, display: 'flex', flexDirection: 'column', margin: '24px 0' }}>
                    {/* Main image display */}
                    <div style={{ width: '100%', aspectRatio: '1', position: 'relative', marginBottom: 12 }}>
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={`${selectedProduct.id}-${currentImageIndex}`}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.3 }}
                          style={{ width: '100%', height: '100%', position: 'relative' }}
                        >
                          <Image
                            src={Array.isArray(selectedProduct.images) && selectedProduct.images.length > currentImageIndex ? selectedProduct.images[currentImageIndex] : '/images/Products/brownpack.png'}
                            alt={`${selectedProduct.name} - Image ${currentImageIndex + 1}`}
                            fill
                            style={{ objectFit: 'contain' }}
                            sizes="360px"
                          />
                        </motion.div>
                      </AnimatePresence>

                      {/* Main image navigation arrows - show only if there are multiple images */}
                      {Array.isArray(selectedProduct.images) && selectedProduct.images.length > 1 && (
                        <>
                          {/* Previous image button */}
                          <motion.button
                            whileHover={{ scale: 1.15 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={handlePrevImage}
                            style={{
                              position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                              width: 40, height: 40, borderRadius: '50%',
                              border: `2px solid ${G}`, background: 'rgba(255, 255, 255, 0.95)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              cursor: 'pointer', zIndex: 10,
                              color: G, boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            }}
                          >
                            <ChevronLeft size={24} strokeWidth={3} />
                          </motion.button>

                          {/* Next image button */}
                          <motion.button
                            whileHover={{ scale: 1.15 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={handleNextImage}
                            style={{
                              position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                              width: 40, height: 40, borderRadius: '50%',
                              border: `2px solid ${G}`, background: 'rgba(255, 255, 255, 0.95)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              cursor: 'pointer', zIndex: 10,
                              color: G, boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            }}
                          >
                            <ChevronRight size={24} strokeWidth={3} />
                          </motion.button>
                        </>
                      )}
                    </div>

                    {/* Thumbnail carousel - show only if there are multiple images */}
                    {Array.isArray(selectedProduct.images) && selectedProduct.images.length > 1 && (
                      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 12 }}>
                        {/* Previous thumbnail button */}
                        {thumbnailScrollPos > 0 && (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setThumbnailScrollPos(Math.max(0, thumbnailScrollPos - 80))}
                            style={{
                              width: 32, height: 32, borderRadius: '4px',
                              border: `1.5px solid ${G}`, background: '#fff',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              cursor: 'pointer', zIndex: 10, flexShrink: 0,
                              color: G,
                            }}
                          >
                            <ChevronLeft size={18} />
                          </motion.button>
                        )}

                        {/* Thumbnails container */}
                        <div style={{
                          display: 'flex', gap: 8, overflowX: 'hidden',
                          flex: 1, paddingBottom: 4,
                        }}>
                          {Array.isArray(selectedProduct.images) && selectedProduct.images.slice(0, 5).map((img, idx) => (
                            <motion.div
                              key={idx}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setCurrentImageIndex(idx)}
                              style={{
                                flexShrink: 0,
                                width: 70, height: 70, borderRadius: 10,
                                border: currentImageIndex === idx ? `2.5px solid ${G}` : '2px solid rgba(21,128,61,0.2)',
                                background: currentImageIndex === idx ? 'rgba(21,128,61,0.08)' : '#fff',
                                cursor: 'pointer', position: 'relative',
                                overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
                              }}
                            >
                              <Image
                                src={img}
                                alt={`Thumbnail ${idx + 1}`}
                                width={70}
                                height={70}
                                style={{ objectFit: 'contain' }}
                              />
                            </motion.div>
                          ))}
                        </div>

                        {/* Next thumbnail button */}
                        {Array.isArray(selectedProduct.images) && selectedProduct.images.length > 4 && thumbnailScrollPos < (Array.isArray(selectedProduct.images) ? (selectedProduct.images.length - 4) * 80 : 0) && (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setThumbnailScrollPos(Math.min(Array.isArray(selectedProduct.images) ? (selectedProduct.images.length - 4) * 80 : 0, thumbnailScrollPos + 80))}
                            style={{
                              width: 32, height: 32, borderRadius: '4px',
                              border: `1.5px solid ${G}`, background: '#fff',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              cursor: 'pointer', zIndex: 10, flexShrink: 0,
                              color: G,
                            }}
                          >
                            <ChevronRight size={18} />
                          </motion.button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Package selector */}
                  <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                    {(selectedProduct.packages || []).map((pkg, i) => (
                      <motion.button
                        key={pkg.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedPackage(i)}
                        style={{
                          flex: 1, height: 48, borderRadius: 10,
                          border: selectedPackage === i ? `2.5px solid ${G}` : '2px solid rgba(0,0,0,0.08)',
                          background: selectedPackage === i ? 'rgba(21,128,61,0.08)' : '#fff',
                          cursor: 'pointer', fontFamily: FS, fontWeight: 600, fontSize: 12,
                          color: selectedPackage === i ? G : '#1a1a1a',
                          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2,
                        }}
                      >
                        <div>{pkg.duration}</div>
                        <div style={{ fontSize: 10, opacity: 0.6 }}>{pkg.pouches} pouches</div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* ── RIGHT: Product info ── */}
                <div style={{ padding: 'clamp(24px, 4vw, 48px)' }}>
                  {/* Reviews */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                    <div style={{ display: 'flex', gap: 2 }}>
                      {[1, 2, 3, 4, 5].map(s => (
                        <Star key={s} size={14} fill={s <= Math.round(selectedProduct.rating ?? 0) ? '#facc15' : 'none'} color="#facc15" />
                      ))}
                    </div>
                    <span style={{ fontFamily: FS, fontSize: 13, color: '#666' }}>
                      {selectedProduct.rating ?? 0} · {(selectedProduct.reviews ?? 0).toLocaleString()} Reviews
                    </span>
                  </div>

                  {/* Title */}
                  <h2 style={{ fontFamily: FD, fontSize: 'clamp(22px, 3.5vw, 32px)', fontWeight: 800, color: '#1a1a1a', margin: '0 0 8px' }}>
                    {selectedProduct.name}
                  </h2>
                  <p style={{ fontFamily: FS, fontSize: 15, color: '#555', lineHeight: 1.6, margin: '0 0 20px' }}>
                    {selectedProduct.description}
                  </p>

                  {/* Purchase options */}
                  <div style={{
                    border: '1.5px solid rgba(21,128,61,0.15)', borderRadius: 12,
                    overflow: 'hidden', marginBottom: 20,
                  }}>
                    {/* One-time */}
                    <label style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '14px 16px', cursor: 'pointer',
                      background: purchaseType === 'onetime' ? 'rgba(21,128,61,0.04)' : '#fff',
                      borderBottom: '1px solid rgba(21,128,61,0.1)',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <input
                          type="radio" name="purchase" checked={purchaseType === 'onetime'}
                          onChange={() => setPurchaseType('onetime')}
                          style={{ accentColor: G, width: 16, height: 16 }}
                        />
                        <span style={{ fontFamily: FS, fontSize: 14, fontWeight: 600 }}>One-Time Purchase</span>
                      </div>
                      <span style={{ fontFamily: FD, fontSize: 20, fontWeight: 800, color: '#1a1a1a' }}>
                        ₹{(packageData.oneTimePrice ?? 0).toLocaleString()}
                      </span>
                    </label>

                    {/* Subscribe */}
                    <label style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '14px 16px', cursor: 'pointer',
                      background: purchaseType === 'subscribe' ? 'rgba(21,128,61,0.04)' : '#fff',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <input
                          type="radio" name="purchase" checked={purchaseType === 'subscribe'}
                          onChange={() => setPurchaseType('subscribe')}
                          style={{ accentColor: G, width: 16, height: 16 }}
                        />
                        <div>
                          <span style={{ fontFamily: FS, fontSize: 14, fontWeight: 600 }}>Subscribe & Save</span>
                          <span style={{
                            marginLeft: 8, padding: '2px 8px', borderRadius: 10,
                            background: '#dcfce7', fontFamily: FS, fontSize: 11, fontWeight: 700, color: G,
                          }}>
                            BEST VALUE
                          </span>
                          <p style={{ fontFamily: FS, fontSize: 12, color: '#888', margin: '2px 0 0' }}>
                            Deliver every {packageData.duration}
                          </p>
                        </div>
                      </div>
                      <span style={{ fontFamily: FD, fontSize: 20, fontWeight: 800, color: G }}>
                        ₹{(packageData.subscribePrice ?? 0).toLocaleString()}
                      </span>
                    </label>
                  </div>

                  {/* Quantity + Add to cart */}
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 20 }}>
                    {/* Quantity */}
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 0,
                      border: '1.5px solid rgba(21,128,61,0.2)', borderRadius: 10,
                      overflow: 'hidden',
                    }}>
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        style={{
                          width: 40, height: 40, border: 'none',
                          background: 'transparent', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: '#666',
                        }}
                      >
                        <Minus size={16} />
                      </button>
                      <span style={{
                        width: 40, textAlign: 'center', fontFamily: FS,
                        fontSize: 15, fontWeight: 600, color: '#1a1a1a',
                      }}>
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        style={{
                          width: 40, height: 40, border: 'none',
                          background: 'transparent', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: '#666',
                        }}
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    {/* Add to cart */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      style={{
                        flex: 1, height: 44, borderRadius: 10,
                        background: G, border: 'none',
                        color: '#fff', fontFamily: FS, fontSize: 15, fontWeight: 700,
                        cursor: 'pointer', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', gap: 8,
                      }}
                    >
                      <ShoppingCart size={18} />
                      Add to Cart · ₹{(price * quantity).toLocaleString()}
                    </motion.button>
                  </div>

                  {/* Trust badges */}
                  <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <RotateCcw size={14} color="#666" />
                      <span style={{ fontFamily: FS, fontSize: 12, color: '#666' }}>No Questions Asked Refund</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Truck size={14} color="#666" />
                      <span style={{ fontFamily: FS, fontSize: 12, color: '#666' }}>Free Shipping on All Orders</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Bottom section: Benefits + Nutrients ── */}
              <div style={{
                borderTop: '1px dashed rgba(21,128,61,0.15)',
                padding: 'clamp(24px, 4vw, 40px)',
                display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40,
              }}>
                {/* Benefits */}
                <div>
                  <h3 style={{ fontFamily: FD, fontSize: 18, fontWeight: 800, color: '#1a1a1a', marginBottom: 16 }}>
                    What makes it different
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    {(selectedProduct.benefits || []).map((b) => (
                      <div key={b} style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        padding: '8px 12px', borderRadius: 8,
                        background: 'rgba(21,128,61,0.04)',
                        border: '1px solid rgba(21,128,61,0.08)',
                      }}>
                        <Check size={14} color={G} />
                        <span style={{ fontFamily: FS, fontSize: 13, color: '#333' }}>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key nutrients */}
                <div>
                  <h3 style={{ fontFamily: FD, fontSize: 18, fontWeight: 800, color: '#1a1a1a', marginBottom: 16 }}>
                    Key Nutrients
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    {(selectedProduct.nutrients || []).map((n) => (
                      <div key={n.label} style={{
                        padding: '10px 14px', borderRadius: 8,
                        background: '#fffde6', border: '1.5px solid rgba(21,128,61,0.12)',
                        position: 'relative',
                      }}>
                        <p style={{ fontFamily: FS, fontSize: 13, fontWeight: 600, color: '#1a1a1a', margin: 0 }}>
                          {n.label}
                        </p>
                        <p style={{ fontFamily: FD, fontSize: 18, fontWeight: 800, color: G, margin: '2px 0 0' }}>
                          {n.amount}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* ─── Product FAQs ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ marginBottom: 40 }}
        >
          <ProductFAQ productId={selectedProduct.id} />
        </motion.div>

        {/* ─── Reviews Section ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <ReviewsSection productId={selectedProduct.id} />
        </motion.div>
      </div>

      {/* ── Responsive overrides ── */}
      <style jsx global>{`
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
    </div>
  );
}
