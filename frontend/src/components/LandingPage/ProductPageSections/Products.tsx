'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

/* ─── main component ─── */
// Products come directly from backend with packages

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

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const fetchedProducts = await productAPI.getAll();
        
        // Use products directly from backend (they already have packages)
        const productsWithData = (Array.isArray(fetchedProducts) ? fetchedProducts : []).map((product: Product) => ({
          ...product,
          // Ensure rating and reviews are available
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

    // Check if user is logged in
    if (!user) {
      setShowLoginModal(true);
      return;
    }

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
      setQuantity(1); // Reset quantity to 1 after adding to cart

      // Hide toast after 3 seconds
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
        <Navbar />
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
                    src={product.packages?.[0]?.images?.[0] || '/images/Products/brownpack.png'}
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
                      ₹{(product.packages?.[0]?.price ?? 0).toLocaleString()}
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
      <Navbar />
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
                            src={selectedProduct.packages?.[selectedPackage]?.images?.[currentImageIndex] || '/images/Products/brownpack.png'}
                            alt={`${selectedProduct.name} - Image ${currentImageIndex + 1}`}
                            fill
                            style={{ objectFit: 'contain' }}
                            sizes="360px"
                          />
                        </motion.div>
                      </AnimatePresence>

                      {/* Main image navigation arrows - show only if there are multiple images */}
                      {Array.isArray(selectedProduct.packages?.[selectedPackage]?.images) && selectedProduct.packages[selectedPackage].images.length > 1 && (
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
                    {Array.isArray(selectedProduct.packages?.[selectedPackage]?.images) && selectedProduct.packages[selectedPackage].images.length > 1 && (
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
                          {Array.isArray(selectedProduct.packages?.[selectedPackage]?.images) && selectedProduct.packages[selectedPackage].images.slice(0, 5).map((img: string, idx: number) => (
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
                        {Array.isArray(selectedProduct.packages?.[selectedPackage]?.images) && (selectedProduct.packages?.[selectedPackage]?.images?.length || 0) > 4 && thumbnailScrollPos < ((selectedProduct.packages?.[selectedPackage]?.images?.length || 0) - 4) * 80 && (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setThumbnailScrollPos(Math.min(((selectedProduct.packages?.[selectedPackage]?.images?.length || 0) - 4) * 80, thumbnailScrollPos + 80))}
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

                  {/* Package selector - Enhanced UI */}
                  <div style={{ display: 'flex', gap: 8, marginTop: 16, marginBottom: 20 }}>
                    {(selectedProduct.packages || []).map((pkg, i) => (
                      <motion.div
                        key={pkg.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedPackage(i)}
                        style={{
                          flex: 1, borderRadius: 12,
                          border: selectedPackage === i ? `2.5px solid ${G}` : '2px solid rgba(0,0,0,0.08)',
                          background: selectedPackage === i ? '#f0fdf4' : '#fff',
                          cursor: 'pointer', fontFamily: FS, fontWeight: 600,
                          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4,
                          padding: '12px 8px', position: 'relative',
                          transition: 'all 0.3s ease',
                          boxShadow: selectedPackage === i ? '0 4px 12px rgba(21,128,61,0.15)' : 'none',
                        }}
                      >
                        {pkg.tag && (
                          <div style={{ fontSize: 10, fontWeight: 700, color: G, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                            {pkg.tag}
                          </div>
                        )}
                        <div style={{ fontSize: 14, color: selectedPackage === i ? G : '#1a1a1a' }}>{pkg.duration}</div>
                        <div style={{ fontSize: 11, opacity: 0.6 }}>{pkg.pouches} pouches</div>
                        {pkg.savePct && (
                          <div style={{ fontSize: 10, fontWeight: 700, color: '#dc2626', marginTop: 2 }}>
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

                  {/* Price & Add to cart - Enhanced */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 12, marginBottom: 24 }}>
                    {/* Price Display - Enhanced */}
                    <div style={{
                      padding: '16px', background: 'linear-gradient(135deg, rgba(21,128,61,0.06) 0%, rgba(21,128,61,0.03) 100%)',
                      border: '2px solid rgba(21,128,61,0.2)', borderRadius: 12,
                      textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center'
                    }}>
                      <p style={{ fontFamily: FS, fontSize: 11, color: '#666', margin: '0 0 6px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5 }}>Price</p>
                      {packageData?.origPrice && packageData.price < packageData.origPrice && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center', marginBottom: 4 }}>
                          <span style={{ fontFamily: FD, fontSize: 14, color: '#999', textDecoration: 'line-through', fontWeight: 500 }}>
                            ₹{(packageData.origPrice).toLocaleString()}
                          </span>
                          {packageData?.savePct && (
                            <span style={{ fontFamily: FS, fontSize: 10, fontWeight: 700, color: '#fff', background: '#dc2626', padding: '2px 6px', borderRadius: 4 }}>
                              {packageData.savePct}
                            </span>
                          )}
                        </div>
                      )}
                      <span style={{ fontFamily: FD, fontSize: 32, fontWeight: 800, color: G }}>
                        ₹{price.toLocaleString()}
                      </span>
                      <p style={{ fontFamily: FS, fontSize: 10, color: '#999', margin: '4px 0 0' }}>per {packageData?.duration}</p>
                    </div>

                    {/* Quantity + Add to Cart Button */}
                    <div style={{ display: 'flex', gap: 12, alignItems: 'stretch', gridColumn: '1 / -1' }}>
                      {/* Quantity Selector - Enhanced */}
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        border: `2px solid ${G}`, borderRadius: 10, padding: '6px 12px',
                        background: 'rgba(21,128,61,0.04)',
                      }}>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          style={{
                            width: 28, height: 28, border: 'none',
                            background: 'rgba(21,128,61,0.1)', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: G, borderRadius: 6, fontWeight: 700,
                          }}
                        >
                          −
                        </motion.button>
                        <span style={{
                          width: 32, textAlign: 'center', fontFamily: FS,
                          fontSize: 16, fontWeight: 700, color: '#1a1a1a',
                        }}>
                          {quantity}
                        </span>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setQuantity(quantity + 1)}
                          style={{
                            width: 28, height: 28, border: 'none',
                            background: G, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#fff', borderRadius: 6, fontWeight: 700, fontSize: 14,
                          }}
                        >
                          +
                        </motion.button>
                      </div>

                      {/* Add to cart - Enhanced */}
                      <motion.button
                        onClick={handleAddToCart}
                        whileHover={{ scale: 1.02, boxShadow: '0 12px 24px rgba(21,128,61,0.3)' }}
                        whileTap={{ scale: 0.98 }}
                        style={{
                          flex: 1, height: 48, borderRadius: 12,
                          background: `linear-gradient(135deg, ${G} 0%, #1d7e34 100%)`, border: 'none',
                          color: '#fff', fontFamily: FS, fontSize: 15, fontWeight: 700,
                          cursor: 'pointer', display: 'flex', alignItems: 'center',
                          justifyContent: 'center', gap: 8, boxShadow: '0 4px 12px rgba(21,128,61,0.2)',
                          transition: 'all 0.3s ease',
                        }}
                      >
                        <ShoppingCart size={20} />
                        <span>Add to Cart · ₹{(price * quantity).toLocaleString()}</span>
                      </motion.button>
                    </div>
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

              {/* ── Bottom section: Benefits + Nutrients ── Enhanced */}
              <div style={{
                borderTop: '2px dashed rgba(21,128,61,0.15)',
                padding: 'clamp(32px, 5vw, 48px)',
                display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48,
              }}>
                {/* Benefits - Enhanced */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <h3 style={{ fontFamily: FD, fontSize: 20, fontWeight: 800, color: '#1a1a1a', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ background: 'rgba(21,128,61,0.1)', padding: '8px 10px', borderRadius: 8 }}>
                      <Zap size={20} color={G} />
                    </div>
                    What makes it different
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {(packageData?.benefits || []).map((b: string, idx: number) => (
                      <motion.div
                        key={b}
                        initial={{ opacity: 0, x: -15 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        viewport={{ once: true }}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 12,
                          padding: '14px 16px', borderRadius: 12,
                          background: 'linear-gradient(135deg, rgba(21,128,61,0.08) 0%, rgba(21,128,61,0.02) 100%)',
                          border: '1.5px solid rgba(21,128,61,0.15)',
                          transition: 'all 0.3s ease',
                          cursor: 'default',
                        }}
                        whileHover={{ paddingLeft: '20px', borderColor: 'rgba(21,128,61,0.3)', background: 'rgba(21,128,61,0.1)' }}
                      >
                        <Check size={20} color={G} strokeWidth={3} style={{ flexShrink: 0 }} />
                        <span style={{ fontFamily: FS, fontSize: 14, color: '#333', fontWeight: 500 }}>{b}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Key nutrients - Enhanced */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                >
                  <h3 style={{ fontFamily: FD, fontSize: 20, fontWeight: 800, color: '#1a1a1a', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ background: 'rgba(21,128,61,0.1)', padding: '8px 10px', borderRadius: 8 }}>
                      <BarChart3 size={20} color={G} />
                    </div>
                    Key Nutrients
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    {(packageData?.nutrients || []).map((n: ProductNutrient, idx: number) => (
                      <motion.div
                        key={n.label}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.08 }}
                        viewport={{ once: true }}
                        whileHover={{ translateY: -4 }}
                        style={{
                          padding: '16px 14px', borderRadius: 12,
                          background: 'linear-gradient(135deg, #fffde6 0%, #fefce8 100%)',
                          border: '2px solid rgba(21,128,61,0.15)',
                          position: 'relative',
                          overflow: 'hidden',
                          transition: 'all 0.3s ease',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                        }}
                      >
                        {/* Decorative background */}
                        <div style={{ position: 'absolute', top: 0, right: 0, fontSize: 32, opacity: 0.08 }}>
                          {n.emoji}
                        </div>
                        <p style={{ fontFamily: FS, fontSize: 12, fontWeight: 600, color: '#666', margin: 0, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                          {n.label}
                        </p>
                        <p style={{ fontFamily: FD, fontSize: 24, fontWeight: 800, color: G, margin: '4px 0 0', position: 'relative', zIndex: 1 }}>
                          {n.amount}
                        </p>
                        <p style={{ fontFamily: FS, fontSize: 12, color: '#666', margin: '6px 0 0', fontStyle: 'italic', position: 'relative', zIndex: 1 }}>
                          {n.friendly}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
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

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 20, x: -20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -20, x: -20 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'fixed',
              bottom: 24,
              left: 24,
              background: G,
              color: '#fff',
              padding: '16px 24px',
              borderRadius: 12,
              fontFamily: FS,
              fontSize: 14,
              fontWeight: 600,
              boxShadow: '0 8px 24px rgba(21,128,61,0.3)',
              zIndex: 1000,
              maxWidth: 300,
            }}
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auth Modal */}
      <AuthModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </div>
  );
}
