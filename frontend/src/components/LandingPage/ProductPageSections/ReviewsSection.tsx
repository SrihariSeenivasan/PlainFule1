'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth-context';
import AuthModal from '@/components/AuthModal';

// ── Theme Constants ──
const FD = "'Playfair Display', Georgia, serif";
const FS = "'DM Sans', 'Helvetica Neue', sans-serif";
const G = '#15803d';

interface Review {
  id: number;
  rating: number;
  text: string;
  user: { id: number; firstName?: string; lastName?: string };
  createdAt: string;
}

// ── Review Star Component ──
const StarRating = ({ rating, size = 16, interactive = false, onRate }: { rating: number; size?: number; interactive?: boolean; onRate?: (r: number) => void }) => (
  <svg viewBox="0 0 100 20" width={size * 5} height={size} style={{ pointerEvents: interactive ? 'auto' : 'none', cursor: interactive ? 'pointer' : 'default' }}>
    {[...Array(5)].map((_, i) => (
      <g
        key={i}
        onClick={() => interactive && onRate?.(i + 1)}
        style={{ cursor: interactive ? 'pointer' : 'default' }}
      >
        <path
          d={`M${i * 20 + 10},2 L${i * 20 + 12.4},9.6 L${i * 20 + 20},9.6 L${i * 20 + 14.6},14.4 L${i * 20 + 17},21 L${i * 20 + 10},16.2 L${i * 20 + 3},21 L${i * 20 + 5.4},14.4 L0,9.6`}
          fill={i < Math.round(rating) ? G : 'rgba(21,128,61,0.2)'}
          stroke="none"
        />
      </g>
    ))}
  </svg>
);

// ── Review Card Component ──
const ReviewCard = ({ review, index }: { review: Review; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1 }}
    style={{
      background: '#fff',
      border: `2px solid rgba(21,128,61,0.15)`,
      borderRadius: 12,
      padding: '20px',
      position: 'relative',
    }}
  >
    {/* Corner dog-ear */}
    <div style={{
      position: 'absolute', bottom: 0, right: 0, width: 20, height: 20,
      background: 'linear-gradient(135deg, transparent 50%, rgba(0,0,0,0.04) 50%)',
      borderRadius: '0 0 10px 0',
    }} />

    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
      <div>
        <p style={{ fontFamily: FS, fontWeight: 700, fontSize: 14, color: '#1a1a1a', margin: 0 }}>
          {review.user.firstName} {review.user.lastName}
        </p>
        <p style={{ fontFamily: FS, fontSize: 12, color: '#999', margin: '4px 0 0' }}>
          {new Date(review.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>

    <div style={{ marginBottom: 12 }}>
      <StarRating rating={review.rating} size={14} />
    </div>

    <p style={{ fontFamily: FS, fontSize: 14, color: '#555', lineHeight: 1.6, margin: 0 }}>
      {review.text}
    </p>
  </motion.div>
);

// ── Reviews Section Component ──
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
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
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

  // Load reviews on mount
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
      setError('Review must be at least 10 characters long');
      return;
    }

    try {
      setSubmitting(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
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
        setSuccess('Thank you for your review!');
        setFormData({ rating: 5, text: '' });
        await loadReviews();
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to submit review');
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      setError('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section style={{ padding: '72px 0', background: '#fdfaf3', position: 'relative', overflow: 'hidden' }}>
      {/* Background pattern */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.04) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }} />

      <div style={{
        maxWidth: 1200, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1,
      }}>
        {/* ─── Header ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: 48 }}
        >
          <h2 style={{ fontFamily: FD, fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 800, color: '#1a1a1a', margin: 0 }}>
            What People Are Saying
          </h2>
          <p style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif", fontSize: 'clamp(14px, 2vw, 16px)', color: '#666', marginTop: 12 }}>
            Join {(stats.totalReviews || 324).toLocaleString()} satisfied customers
          </p>
        </motion.div>

        {/* ─── Rating Summary ─── */}
        <div style={{
          background: '#fff', borderRadius: 16, padding: '32px', border: '2px solid rgba(21,128,61,0.15)',
          marginBottom: 48, textAlign: 'center', boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
        }}>
          <p style={{ fontFamily: FS, fontSize: 14, color: '#999', margin: 0, marginBottom: 12, textTransform: 'uppercase' }}>
            Average Rating
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <StarRating rating={stats.averageRating || 0} size={18} />
              <span style={{ fontFamily: FD, fontSize: 32, fontWeight: 800, color: '#1a1a1a' }}>
                {(stats.averageRating || 0).toFixed(1)}
              </span>
            </div>
          </div>
          <p style={{ fontFamily: FS, fontSize: 14, color: '#666', margin: 0 }}>
            Based on {stats.totalReviews || 324} verified reviews
          </p>
        </div>

        {/* ─── Review Form ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            background: '#fff', borderRadius: 16, padding: '32px', border: '2px solid rgba(21,128,61,0.15)',
            marginBottom: 48, boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
          }}
        >
          <h3 style={{ fontFamily: FD, fontSize: 24, color: '#1a1a1a', margin: '0 0 24px', fontWeight: 800 }}>
            {isAuthenticated ? 'Share Your Experience' : 'Share Your Review'}
          </h3>

          {!isAuthenticated && (
            <div style={{
              background: 'rgba(21, 128, 61, 0.1)', padding: 16, borderRadius: 8, marginBottom: 24, border: `2px solid ${G}`,
            }}>
              <p style={{ fontFamily: FS, fontSize: 14, color: '#333', margin: 0 }}>
                👤 <strong>Please log in to post a review</strong>
              </p>
            </div>
          )}

          {error && (
            <div style={{
              background: '#fee', padding: 16, borderRadius: 8, marginBottom: 16, borderLeft: `4px solid #f33`,
            }}>
              <p style={{ fontFamily: FS, fontSize: 14, color: '#c33', margin: 0 }}>{error}</p>
            </div>
          )}

          {success && (
            <div style={{
              background: '#efe', padding: 16, borderRadius: 8, marginBottom: 16, borderLeft: `4px solid #3a3`,
            }}>
              <p style={{ fontFamily: FS, fontSize: 14, color: '#3a3', margin: 0 }}>{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmitReview} style={{ display: 'grid', gap: 20 }}>
            <div>
              <label style={{ fontFamily: FS, fontSize: 14, fontWeight: 600, color: '#333', display: 'block', marginBottom: 12 }}>
                Rating *
              </label>
              <div style={{ cursor: isAuthenticated ? 'pointer' : 'default' }}>
                <StarRating
                  rating={formData.rating}
                  size={20}
                  interactive={isAuthenticated}
                  onRate={(r) => isAuthenticated && setFormData({ ...formData, rating: r })}
                />
              </div>
            </div>

            <div>
              <label style={{ fontFamily: FS, fontSize: 14, fontWeight: 600, color: '#333', display: 'block', marginBottom: 8 }}>
                Your Review *
              </label>
              <textarea
                value={formData.text}
                onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                placeholder="Share your experience with this product (min 10 characters)"
                disabled={!isAuthenticated}
                rows={5}
                style={{
                  width: '100%', padding: '12px', fontFamily: FS, fontSize: 14, border: '1.5px solid #ddd',
                  borderRadius: 8, boxSizing: 'border-box', resize: 'vertical', opacity: isAuthenticated ? 1 : 0.6,
                }}
              />
              <p style={{ fontFamily: FS, fontSize: 12, color: '#999', margin: '8px 0 0' }}>
                {formData.text.length} characters
              </p>
            </div>

            {!isAuthenticated ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                type="button"
                onClick={() => setShowAuthModal(true)}
                style={{
                  padding: '12px 24px', background: G, color: '#fff', fontFamily: FS, fontWeight: 600,
                  border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 16,
                }}
              >
                Login to Review
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                type="submit"
                disabled={submitting}
                style={{
                  padding: '12px 24px', background: submitting ? '#ccc' : G, color: '#fff', fontFamily: FS, fontWeight: 600,
                  border: 'none', borderRadius: 8, cursor: submitting ? 'not-allowed' : 'pointer', fontSize: 16,
                }}
              >
                {submitting ? 'Posting...' : 'Post Review'}
              </motion.button>
            )}
          </form>
        </motion.div>

        {/* ─── Reviews Grid ─── */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <p style={{ fontFamily: FS, color: '#999' }}>Loading reviews...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <p style={{ fontFamily: FS, color: '#999', fontSize: 16 }}>No reviews yet. Be the first to review!</p>
          </div>
        ) : (
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24,
          }}>
            {reviews.map((review, i) => (
              <ReviewCard key={review.id} review={review} index={i} />
            ))}
          </div>
        )}
      </div>

      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </section>
  );
}
