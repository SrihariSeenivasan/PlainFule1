'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth-context';
import { getApiUrl } from '@/lib/api';
import AuthModal from '@/components/AuthModal';
import { F_SIZE, BRAND } from '@/lib/typography';
import { Star, MessageSquare, ShieldCheck, User, Send } from 'lucide-react';

/* ── Design Tokens ── */
const C = {
  forest: BRAND.espresso,
  deep: BRAND.espresso,
  mid: BRAND.espresso,
  leaf: BRAND.burgundy,
  ink: BRAND.espresso,
  white: '#ffffff',
  offwhite: BRAND.cream,
  silver: '#64748b',
  mist: BRAND.stone,
  gold: BRAND.burgundy,
  glass: 'rgba(255, 255, 255, 0.92)',
};

const FONTS = {
  main: "'Montserrat', sans-serif",
  accent: "'Caveat', cursive",
};

interface Review {
  id: number;
  rating: number;
  text: string;
  user: { id: number; firstName?: string; lastName?: string };
  createdAt: string;
}

/* ── Components ── */
function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      fontFamily: FONTS.main,
      fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase',
      color: BRAND.espresso, fontWeight: 800,
      border: `1px solid ${BRAND.espresso}25`,
      borderRadius: 2, padding: '3px 10px',
      backgroundColor: 'rgba(10, 61, 31, 0.03)',
    }}>{children}</span>
  );
}

const StarRating = ({ rating, size = 16, interactive = false, onRate }: { rating: number; size?: number; interactive?: boolean; onRate?: (r: number) => void }) => (
  <div style={{ display: 'flex', gap: 4, cursor: interactive ? 'pointer' : 'default' }}>
    {[1, 2, 3, 4, 5].map((star) => (
      <div 
        key={star} 
        onClick={() => interactive && onRate?.(star)}
        style={{ color: star <= rating ? C.gold : `${C.silver}33`, transition: '0.2s' }}
      >
        <Star size={size} fill={star <= rating ? C.gold : 'none'} strokeWidth={2.5} />
      </div>
    ))}
  </div>
);

const ReviewCard = ({ review, index }: { review: Review; index: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.98 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.05, duration: 0.4 }}
    style={{
      background: C.white,
      border: `1px solid rgba(0,0,0,0.06)`,
      borderRadius: 12,
      padding: '32px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
      display: 'flex', flexDirection: 'column', gap: 16
    }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
         <div style={{ width: 32, height: 32, borderRadius: '50%', background: C.mist, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
           <User size={16} color={BRAND.espresso} />
         </div>
         <div>
            <div style={{ fontWeight: 800, fontSize: F_SIZE.sm, color: C.ink, lineHeight: 1 }}>
              {review.user.firstName} {review.user.lastName}
            </div>
            <div style={{ fontSize: 10, color: C.silver, fontWeight: 700, marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {new Date(review.createdAt).toLocaleDateString()}
            </div>
         </div>
      </div>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
         <ShieldCheck size={14} color={BRAND.burgundy} />
         <span style={{ fontSize: 9, fontWeight: 800, color: BRAND.burgundy, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Verified User</span>
      </div>
    </div>

    <StarRating rating={review.rating} size={14} />

    <p style={{ 
      fontSize: F_SIZE.sm, color: '#3c4a3e', lineHeight: 1.7, margin: 0, fontWeight: 500,
      fontStyle: 'italic', position: 'relative', paddingLeft: 18
    }}>
      <span style={{ position: 'absolute', left: 0, top: 0, color: C.gold, fontSize: 18, fontWeight: 900 }}>"</span>
      {review.text}
    </p>
  </motion.div>
);

export default function ReviewsSection({ productId = 1 }: { productId?: number }) {
  const { isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState({ averageRating: 0, totalReviews: 0 });
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    rating: 5,
    text: '',
  });

  const loadReviews = useCallback(async () => {
    try {
      setLoading(true);
      const apiUrl = getApiUrl();
      const [reviewsRes, statsRes] = await Promise.all([
        fetch(`${apiUrl}/reviews/product/${productId}`),
        fetch(`${apiUrl}/reviews/stats/${productId}`),
      ]);

      if (reviewsRes.ok) {
        const data = await reviewsRes.json();
        setReviews(data.data || []);
      }

      if (statsRes.ok) {
        const data = await statsRes.json();
        setStats(data.data);
      }
    } catch (err) {
      console.error('Failed to load reviews:', err);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    if (formData.text.trim().length < 10) {
      setError('Review must be at least 10 characters decoded.');
      return;
    }

    try {
      setSubmitting(true);
      const apiUrl = getApiUrl();
      const token = localStorage.getItem('token');

      const response = await fetch(`${apiUrl}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId,
          rating: formData.rating,
          text: formData.text,
        }),
      });

      if (response.ok) {
        setSuccess('Transmission Successful. Thank you.');
        setFormData({ rating: 5, text: '' });
        await loadReviews();
      } else {
        const data = await response.json();
        setError(data.message || 'Transmission Failed.');
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      setError('Transmission Failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ fontFamily: FONTS.main }}>
      {/* ─── Header & Stats ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 40, alignItems: 'end', marginBottom: 56 }}>
        <div>
           <Chip>Community Feedback</Chip>
           <h3 style={{ fontSize: F_SIZE.lg, fontWeight: 900, color: C.ink, margin: '20px 0 0', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
             Customer <span style={{ fontWeight: 300, color: BRAND.espresso }}>Reviews</span>
           </h3>
           <div style={{ height: 1, width: 60, background: C.gold, marginTop: 16 }} />
        </div>
        
        <div style={{ 
          display: 'flex', alignItems: 'center', gap: 40, background: C.white, padding: '24px 32px', 
          borderRadius: 8, border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' 
        }}>
           <div>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: BRAND.espresso, lineHeight: 1 }}>{(stats.averageRating || 0).toFixed(1)}</div>
               <div style={{ fontSize: 10, fontWeight: 800, color: C.silver, textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 4 }}>Product Rating</div>
           </div>
           <StarRating rating={stats.averageRating || 0} size={18} />
           <div style={{ borderLeft: '1px solid rgba(0,0,0,0.08)', paddingLeft: 32 }}>
              <div style={{ fontSize: F_SIZE.md, fontWeight: 900, color: C.ink, lineHeight: 1 }}>{(stats.totalReviews || 0).toLocaleString()}</div>
               <div style={{ fontSize: 10, fontWeight: 800, color: C.silver, textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 4 }}>Verified Reviews</div>
           </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 420px', gap: 48, alignItems: 'start' }}>
        {/* Reviews List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {loading ? (
             <div style={{ padding: '40px 0', textAlign: 'center' }}>
                <p style={{ color: C.silver, fontWeight: 700, textTransform: 'uppercase', fontSize: 11, letterSpacing: '0.15em' }}>Retrieving Reviews...</p>
             </div>
          ) : reviews.length === 0 ? (
             <div style={{ padding: '60px 40px', textAlign: 'center', background: BRAND.cream, borderRadius: 12, border: '1px dashed rgba(0,0,0,0.1)' }}>
                <MessageSquare size={32} color={C.silver} style={{ marginBottom: 16 }} />
                 <p style={{ color: C.silver, fontWeight: 700, fontSize: F_SIZE.sm }}>Be the first to share your experience.</p>
             </div>
          ) : (
            reviews.map((review, i) => (
              <ReviewCard key={review.id} review={review} index={i} />
            ))
          )}
        </div>

        {/* Review Submission Form */}
        <div style={{ position: 'sticky', top: 120 }}>
          <div style={{ 
            background: C.white, padding: 40, borderRadius: 16, border: '1px solid rgba(0,0,0,0.05)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.04), 0 20px 60px rgba(0,0,0,0.06)'
          }}>
             <h3 style={{ fontSize: F_SIZE.md, fontWeight: 900, color: C.ink, marginBottom: 28 }}>Record Your Experience</h3>

            {error && (
              <div style={{ marginBottom: 20, padding: 16, background: '#fee', borderRadius: 6, fontSize: 11, fontWeight: 800, color: '#c33', textTransform: 'uppercase', borderLeft: '3px solid #f33' }}>
                {error}
              </div>
            )}
            {success && (
              <div style={{ marginBottom: 20, padding: 16, background: '#efe', borderRadius: 6, fontSize: 11, fontWeight: 800, color: BRAND.burgundy, textTransform: 'uppercase', borderLeft: '3px solid #3a3' }}>
                {success}
              </div>
            )}

            <form onSubmit={handleSubmitReview} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div>
                 <label style={{ fontSize: 10, fontWeight: 800, color: C.silver, textTransform: 'uppercase', letterSpacing: '0.12em', display: 'block', marginBottom: 12 }}>Rating</label>
                <div style={{ marginTop: 10 }}>
                  <StarRating 
                    rating={formData.rating} size={22} interactive={isAuthenticated} 
                    onRate={(r) => setFormData({ ...formData, rating: r })} 
                  />
                </div>
              </div>

              <div>
                 <label style={{ fontSize: 10, fontWeight: 800, color: C.silver, textTransform: 'uppercase', letterSpacing: '0.12em', display: 'block', marginBottom: 10 }}>Your Review</label>
                <textarea
                  value={formData.text}
                  onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                   placeholder={isAuthenticated ? "Write your review..." : "Sign in to write a review."}
                  disabled={!isAuthenticated}
                  rows={4}
                  style={{
                    width: '100%', padding: '20px', fontFamily: FONTS.main, fontSize: F_SIZE.sm, fontWeight: 600,
                    border: '1.5px solid rgba(0,0,0,0.08)', borderRadius: 6, outline: 'none', background: BRAND.cream, resize: 'none'
                  }}
                />
              </div>

              {isAuthenticated ? (
                <motion.button
                  whileHover={{ scale: 1.01, backgroundColor: BRAND.espresso, color: C.white }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  disabled={submitting}
                  style={{
                    padding: '16px', background: BRAND.espresso, color: C.white, border: 'none', borderRadius: 6,
                    fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.22em', cursor: 'pointer',
                    boxShadow: '0 8px 32px rgba(10,61,31,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12
                  }}
                >
                   {submitting ? 'Submitting...' : <>Submit Review <Send size={14} /></>}
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.01, backgroundColor: BRAND.espresso }}
                  whileTap={{ scale: 0.99 }}
                  type="button"
                  onClick={() => setShowAuthModal(true)}
                  style={{
                    padding: '16px', background: BRAND.espresso, color: C.white, border: 'none', borderRadius: 6,
                    fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.22em', cursor: 'pointer'
                  }}
                >
                  Authorized Sign-in Required
                </motion.button>
              )}
            </form>
          </div>
        </div>
      </div>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
}



