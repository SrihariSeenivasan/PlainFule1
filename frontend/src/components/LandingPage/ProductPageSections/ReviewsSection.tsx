'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth-context';
import { getApiUrl } from '@/lib/api';
import AuthModal from '@/components/AuthModal';
import { F_SIZE, BRAND, FONTS } from '@/lib/typography';
import { Star, MessageSquare, ShieldCheck, User, Send } from 'lucide-react';
import { Review } from '@/types/review';

/* ── Responsive Styles injected once ── */
const responsiveCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&family=Caveat:ital,wght@1,400;1,600&display=swap');

  .reviews-root *, .reviews-root *::before, .reviews-root *::after {
    box-sizing: border-box;
  }

  .reviews-root {
    font-family: 'Poppins', sans-serif;
    width: 100%;
  }

  /* ── Header grid ── */
  .reviews-header {
    display: grid;
    grid-template-columns: 1fr;
    gap: 24px;
    align-items: end;
    margin-bottom: 40px;
  }
  @media (min-width: 640px) {
    .reviews-header {
      grid-template-columns: 1fr 1fr;
      gap: 32px;
      margin-bottom: 48px;
    }
  }
  @media (min-width: 900px) {
    .reviews-header {
      grid-template-columns: 1fr auto;
      gap: 40px;
    }
  }

  /* ── Stats card ── */
  .reviews-stats-card {
    display: flex;
    align-items: center;
    gap: 20px;
    flex-wrap: wrap;
    background: #fff;
    padding: 20px 24px;
    border-radius: 12px;
    border: 1px solid rgba(0,0,0,0.06);
    box-shadow: 0 4px 12px rgba(0,0,0,0.03);
    width: 100%;
  }
  @media (min-width: 640px) {
    .reviews-stats-card {
      flex-wrap: nowrap;
      gap: 28px;
      width: auto;
      min-width: 340px;
    }
  }

  .reviews-stats-divider {
    display: none;
  }
  @media (min-width: 640px) {
    .reviews-stats-divider {
      display: block;
      width: 1px;
      height: 40px;
      background: rgba(0,0,0,0.08);
      flex-shrink: 0;
    }
  }

  /* ── Body grid ── */
  .reviews-body {
    display: grid;
    grid-template-columns: 1fr;
    gap: 32px;
    align-items: start;
  }
  @media (min-width: 900px) {
    .reviews-body {
      grid-template-columns: 1fr 380px;
      gap: 40px;
    }
  }
  @media (min-width: 1200px) {
    .reviews-body {
      grid-template-columns: 1fr 420px;
      gap: 48px;
    }
  }

  /* ── Form sticky only on desktop ── */
  .reviews-form-sticky {
    position: static;
  }
  @media (min-width: 900px) {
    .reviews-form-sticky {
      position: sticky;
      top: 120px;
    }
  }

  /* ── Reviews list ── */
  .reviews-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  /* ── Review card ── */
  .review-card-inner {
    display: flex;
    flex-direction: column;
    gap: 14px;
    background: #fff;
    border: 1px solid rgba(0,0,0,0.06);
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.04);
  }
  @media (min-width: 480px) {
    .review-card-inner {
      padding: 24px;
      gap: 16px;
    }
  }
  @media (min-width: 768px) {
    .review-card-inner {
      padding: 28px 32px;
    }
  }

  .review-card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 12px;
    flex-wrap: wrap;
  }

  .review-card-verified {
    display: flex;
    gap: 6px;
    align-items: center;
    flex-shrink: 0;
  }

  /* ── Form card ── */
  .reviews-form-card {
    background: #fff;
    padding: 24px;
    border-radius: 16px;
    border: 1px solid rgba(0,0,0,0.05);
    box-shadow: 0 4px 20px rgba(0,0,0,0.04), 0 20px 60px rgba(0,0,0,0.06);
  }
  @media (min-width: 480px) {
    .reviews-form-card {
      padding: 32px;
    }
  }
  @media (min-width: 768px) {
    .reviews-form-card {
      padding: 40px;
    }
  }

  /* ── Order: form first on mobile ── */
  .reviews-form-col {
    order: -1;
  }
  @media (min-width: 900px) {
    .reviews-form-col {
      order: 0;
    }
  }

  /* ── Textarea ── */
  .reviews-textarea {
    width: 100%;
    padding: 16px;
    font-family: 'Poppins', sans-serif;
    font-size: 0.875rem;
    font-weight: 600;
    border: 1.5px solid rgba(0,0,0,0.08);
    border-radius: 6px;
    outline: none;
    background: #fff;
    resize: none;
    transition: border-color 0.2s;
    color: #322D29;
  }
  .reviews-textarea:focus {
    border-color: #72383D;
  }
  @media (min-width: 480px) {
    .reviews-textarea {
      padding: 18px 20px;
    }
  }

  /* ── Submit button ── */
  .reviews-submit-btn {
    width: 100%;
    padding: 14px 16px;
    background: #322D29;
    color: #fff;
    border: none;
    border-radius: 6px;
    font-size: 11px;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.22em;
    cursor: pointer;
    box-shadow: 0 8px 32px rgba(50,45,41,0.12);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    transition: background 0.2s, transform 0.1s;
    font-family: 'Poppins', sans-serif;
  }
  .reviews-submit-btn:hover {
    background: #72383D;
  }
  .reviews-submit-btn:active {
    transform: scale(0.99);
  }

  /* ── Empty state ── */
  .reviews-empty {
    padding: 48px 32px;
    text-align: center;
    background: #fff;
    border-radius: 12px;
    border: 1px dashed rgba(0,0,0,0.1);
  }

  /* ── Chip ── */
  .reviews-chip {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-family: 'Poppins', sans-serif;
    font-size: 10px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #322D29;
    font-weight: 800;
    border: 1px solid rgba(50,45,41,0.15);
    border-radius: 2px;
    padding: 3px 10px;
    background: rgba(50,45,41,0.03);
  }

  /* ── Divider line ── */
  .reviews-divider {
    height: 1px;
    width: 60px;
    background: #72383D;
    margin-top: 16px;
  }

  /* ── Alert boxes ── */
  .reviews-alert-error {
    margin-bottom: 20px;
    padding: 14px 16px;
    background: #fee;
    border-radius: 6px;
    font-size: 11px;
    font-weight: 800;
    color: #c33;
    text-transform: uppercase;
    border-left: 3px solid #f33;
    font-family: 'Poppins', sans-serif;
  }
  .reviews-alert-success {
    margin-bottom: 20px;
    padding: 14px 16px;
    background: #efe;
    border-radius: 6px;
    font-size: 11px;
    font-weight: 800;
    color: #72383D;
    text-transform: uppercase;
    border-left: 3px solid #3a3;
    font-family: 'Poppins', sans-serif;
  }

  /* ── Label ── */
  .reviews-label {
    font-size: 10px;
    font-weight: 800;
    color: #AC9C8D;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    display: block;
    margin-bottom: 10px;
    font-family: 'Poppins', sans-serif;
  }

  /* ── Form gap ── */
  .reviews-form-fields {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  @media (min-width: 480px) {
    .reviews-form-fields {
      gap: 24px;
    }
  }
`;

/* ── Style injector ── */
function InjectStyles() {
  useEffect(() => {
    const id = 'reviews-responsive-css';
    if (!document.getElementById(id)) {
      const style = document.createElement('style');
      style.id = id;
      style.textContent = responsiveCSS;
      document.head.appendChild(style);
    }
    return () => { /* keep alive across mounts */ };
  }, []);
  return null;
}

/* ── Components ── */
function Chip({ children }: { children: React.ReactNode }) {
  return <span className="reviews-chip">{children}</span>;
}

const StarRating = ({
  rating,
  size = 16,
  interactive = false,
  onRate,
}: {
  rating: number;
  size?: number;
  interactive?: boolean;
  onRate?: (r: number) => void;
}) => (
  <div style={{ display: 'flex', gap: 4, cursor: interactive ? 'pointer' : 'default' }}>
    {[1, 2, 3, 4, 5].map((star) => (
      <div
        key={star}
        onClick={() => interactive && onRate?.(star)}
        style={{
          color: star <= rating ? BRAND.primaryDark : `${BRAND.tertiary}`,
          transition: 'color 0.2s, transform 0.15s',
        }}
      >
        <Star
          size={size}
          fill={star <= rating ? BRAND.primaryDark : 'none'}
          strokeWidth={2.5}
        />
      </div>
    ))}
  </div>
);

const ReviewCard = ({ review, index }: { review: Review; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.05, duration: 0.4 }}
  >
    <div className="review-card-inner">
      <div className="review-card-header">
        {/* Author */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: BRAND.light,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              border: `1.5px solid ${BRAND.tertiary}`,
            }}
          >
            <User size={16} color={BRAND.primary} />
          </div>
          <div>
            <div
              style={{
                fontWeight: 800,
                fontSize: F_SIZE.sm,
                color: BRAND.primaryDark,
                lineHeight: 1.2,
                fontFamily: FONTS.main,
              }}
            >
              {review.user.firstName} {review.user.lastName}
            </div>
            <div
              style={{
                fontSize: 10,
                color: BRAND.secondary,
                fontWeight: 700,
                marginTop: 3,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                fontFamily: FONTS.main,
              }}
            >
              {new Date(review.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Verified badge */}
        <div className="review-card-verified">
          <ShieldCheck size={13} color={BRAND.primaryDark} />
          <span
            style={{
              fontSize: 9,
              fontWeight: 800,
              color: BRAND.primaryDark,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              fontFamily: FONTS.main,
            }}
          >
            Verified
          </span>
        </div>
      </div>

      <StarRating rating={review.rating} size={13} />

      <p
        style={{
          fontSize: F_SIZE.sm,
          color: BRAND.primary,
          lineHeight: 1.75,
          margin: 0,
          fontWeight: 500,
          fontStyle: 'italic',
          position: 'relative',
          paddingLeft: 18,
          fontFamily: FONTS.main,
        }}
      >
        <span
          style={{
            position: 'absolute',
            left: 0,
            top: -2,
            color: BRAND.primaryDark,
            fontSize: 20,
            fontWeight: 900,
            lineHeight: 1,
          }}
        >
          &quot;
        </span>
        {review.text}
      </p>
    </div>
  </motion.div>
);

/* ── Main Export ── */
export default function ReviewsSection({ productId = 1 }: { productId?: number }) {
  const { isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState({ averageRating: 0, totalReviews: 0 });
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({ rating: 5, text: '' });

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

  useEffect(() => { loadReviews(); }, [loadReviews]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!isAuthenticated) { setShowAuthModal(true); return; }
    if (formData.text.trim().length < 10) {
      setError('Review must be at least 10 characters.');
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
        body: JSON.stringify({ productId, rating: formData.rating, text: formData.text }),
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
    <>
      <InjectStyles />
      <div className="reviews-root">

        {/* ─── Header & Stats ─── */}
        <div className="reviews-header">
          <div>
            <Chip>Community Feedback</Chip>
            <h3
              style={{
                fontSize: F_SIZE.lg,
                fontWeight: 900,
                color: BRAND.primaryDark,
                margin: '18px 0 0',
                letterSpacing: '-0.02em',
                lineHeight: 1.15,
                fontFamily: FONTS.main,
              }}
            >
              Customer{' '}
              <span style={{ fontWeight: 300, color: BRAND.primary }}>Reviews</span>
            </h3>
            <div className="reviews-divider" />
          </div>

          <div className="reviews-stats-card">
            <div>
              <div
                style={{
                  fontSize: '2rem',
                  fontWeight: 900,
                  color: BRAND.primary,
                  lineHeight: 1,
                  fontFamily: FONTS.main,
                }}
              >
                {(stats.averageRating || 0).toFixed(1)}
              </div>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  color: BRAND.secondary,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginTop: 5,
                  fontFamily: FONTS.main,
                }}
              >
                Rating
              </div>
            </div>

            <StarRating rating={stats.averageRating || 0} size={18} />

            <div className="reviews-stats-divider" />

            <div>
              <div
                style={{
                  fontSize: F_SIZE.md,
                  fontWeight: 900,
                  color: BRAND.primaryDark,
                  lineHeight: 1,
                  fontFamily: FONTS.main,
                }}
              >
                {(stats.totalReviews || 0).toLocaleString()}
              </div>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  color: BRAND.secondary,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginTop: 5,
                  fontFamily: FONTS.main,
                }}
              >
                Verified Reviews
              </div>
            </div>
          </div>
        </div>

        {/* ─── Body: list + form ─── */}
        <div className="reviews-body">

          {/* Reviews List */}
          <div className="reviews-list">
            {loading ? (
              <div style={{ padding: '48px 0', textAlign: 'center' }}>
                <p
                  style={{
                    color: BRAND.secondary,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    fontSize: 11,
                    letterSpacing: '0.15em',
                    fontFamily: FONTS.main,
                  }}
                >
                  Retrieving Reviews...
                </p>
              </div>
            ) : reviews.length === 0 ? (
              <div className="reviews-empty">
                <MessageSquare size={32} color={BRAND.tertiary} style={{ marginBottom: 16 }} />
                <p
                  style={{
                    color: BRAND.secondary,
                    fontWeight: 700,
                    fontSize: F_SIZE.sm,
                    fontFamily: FONTS.main,
                    margin: 0,
                  }}
                >
                  Be the first to share your experience.
                </p>
              </div>
            ) : (
              reviews.map((review, i) => (
                <ReviewCard key={review.id} review={review} index={i} />
              ))
            )}
          </div>

          {/* Review Form — on mobile it renders above the list via CSS order */}
          <div className="reviews-form-col reviews-form-sticky">
            <div className="reviews-form-card">
              <h3
                style={{
                  fontSize: F_SIZE.md,
                  fontWeight: 900,
                  color: BRAND.primaryDark,
                  marginBottom: 24,
                  marginTop: 0,
                  fontFamily: FONTS.main,
                }}
              >
                Record Your Experience
              </h3>

              {error && <div className="reviews-alert-error">{error}</div>}
              {success && <div className="reviews-alert-success">{success}</div>}

              <form onSubmit={handleSubmitReview}>
                <div className="reviews-form-fields">
                  {/* Rating */}
                  <div>
                    <label className="reviews-label">Rating</label>
                    <div style={{ marginTop: 8 }}>
                      <StarRating
                        rating={formData.rating}
                        size={22}
                        interactive={isAuthenticated}
                        onRate={(r) => setFormData({ ...formData, rating: r })}
                      />
                    </div>
                  </div>

                  {/* Text */}
                  <div>
                    <label className="reviews-label">Your Review</label>
                    <textarea
                      className="reviews-textarea"
                      value={formData.text}
                      onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                      placeholder={
                        isAuthenticated ? 'Write your review...' : 'Sign in to write a review.'
                      }
                      disabled={!isAuthenticated}
                      rows={4}
                    />
                  </div>

                  {/* Button */}
                  {isAuthenticated ? (
                    <button
                      type="submit"
                      disabled={submitting}
                      className="reviews-submit-btn"
                      style={{ opacity: submitting ? 0.7 : 1 }}
                    >
                      {submitting ? (
                        'Submitting...'
                      ) : (
                        <>
                          Submit Review <Send size={13} />
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowAuthModal(true)}
                      className="reviews-submit-btn"
                    >
                      Sign In to Review
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>

        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </div>
    </>
  );
}