'use client';

import { useState, useEffect } from 'react';
import { X, AlertCircle, Upload } from 'lucide-react';
import Image from 'next/image';
import { buildApiUrl } from '@/lib/api-config';

interface CustomerReview {
  id: number;
  category: string;
  name: string;
  location: string;
  quote: string;
  rating: number;
  mainImage: string;
  avatarImage: string;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
  displayOrder: number;
}

interface Props {
  review: CustomerReview | null;
  onClose: () => void;
  onSave: () => void;
}

export default function CustomerReviewForm({ review, onClose, onSave }: Props) {
  const [formData, setFormData] = useState({
    category: '',
    name: '',
    location: '',
    quote: '',
    rating: 5,
    status: 'PENDING',
    displayOrder: 0,
  });

  const [mainImage, setMainImage] = useState<File | null>(null);
  const [avatarImage, setAvatarImage] = useState<File | null>(null);
  const [mainImagePreview, setMainImagePreview] = useState<string>('');
  const [avatarImagePreview, setAvatarImagePreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Initialize form with review data if editing
  useEffect(() => {
    if (review) {
      setFormData({
        category: review.category,
        name: review.name,
        location: review.location,
        quote: review.quote,
        rating: review.rating,
        status: review.status,
        displayOrder: review.displayOrder,
      });
      setMainImagePreview(review.mainImage);
      setAvatarImagePreview(review.avatarImage);
    }
  }, [review]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'main' | 'avatar') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === 'main') {
      setMainImage(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setMainImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setAvatarImage(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setAvatarImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const formDataToSend = new FormData();

      // Add form fields
      formDataToSend.append('category', formData.category);
      formDataToSend.append('name', formData.name);
      formDataToSend.append('location', formData.location);
      formDataToSend.append('quote', formData.quote);
      formDataToSend.append('rating', formData.rating.toString());
      formDataToSend.append('status', formData.status);
      formDataToSend.append('displayOrder', formData.displayOrder.toString());

      // Add images if changed
      if (mainImage) {
        formDataToSend.append('mainImage', mainImage);
      }
      if (avatarImage) {
        formDataToSend.append('avatarImage', avatarImage);
      }

      const url = review
        ? buildApiUrl(`/testimonials/admin/customer-reviews/${review.id}`)
        : buildApiUrl('/testimonials/admin/customer-reviews');

      const method = review ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        body: formDataToSend,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save review');
      }

      onSave();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      zIndex: 50,
      fontFamily: "'Segoe UI', 'Roboto', sans-serif",
    }}>
      <div style={{
        backgroundColor: '#0a0f1a',
        borderRadius: '12px',
        maxWidth: '600px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid rgba(255, 255, 255, 0.07)',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px 24px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: 700,
            color: '#e5e7eb',
            margin: 0,
          }}>
            {review ? 'Edit Customer Review' : 'Add Customer Review'}
          </h2>
          <button
            onClick={onClose}
            style={{
              padding: '6px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              color: '#9ca3af',
              transition: 'all 0.15s',
              display: 'flex',
              alignItems: 'center',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
            }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} style={{
          padding: '24px',
          overflowY: 'auto',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}>
          {error && (
            <div style={{
              padding: '12px 16px',
              backgroundColor: 'rgba(248, 113, 113, 0.1)',
              border: '1px solid rgba(248, 113, 113, 0.3)',
              borderRadius: '8px',
              color: '#f87171',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {/* Category and Name */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 600,
                color: '#e5e7eb',
                marginBottom: '8px',
              }}>
                Category *
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                placeholder="e.g., Physical Demand"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '8px',
                  backgroundColor: '#111827',
                  color: '#e5e7eb',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'all 0.15s',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(74, 222, 128, 0.3)';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(74, 222, 128, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                required
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 600,
                color: '#e5e7eb',
                marginBottom: '8px',
              }}>
                Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Person's name"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '8px',
                  backgroundColor: '#111827',
                  color: '#e5e7eb',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'all 0.15s',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(74, 222, 128, 0.3)';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(74, 222, 128, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                required
              />
            </div>
          </div>

          {/* Location and Rating */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 600,
                color: '#e5e7eb',
                marginBottom: '8px',
              }}>
                Location *
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                placeholder="e.g., Marathon Runner · Pune"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '8px',
                  backgroundColor: '#111827',
                  color: '#e5e7eb',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'all 0.15s',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(74, 222, 128, 0.3)';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(74, 222, 128, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                required
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 600,
                color: '#e5e7eb',
                marginBottom: '8px',
              }}>
                Rating *
              </label>
              <select
                value={formData.rating}
                onChange={(e) =>
                  setFormData({ ...formData, rating: parseInt(e.target.value) })
                }
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '8px',
                  backgroundColor: '#111827',
                  color: '#e5e7eb',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'all 0.15s',
                  cursor: 'pointer',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(74, 222, 128, 0.3)';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(74, 222, 128, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {[5, 4, 3, 2, 1].map((r) => (
                  <option key={r} value={r}>
                    {r} ⭐
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quote */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: 600,
              color: '#e5e7eb',
              marginBottom: '8px',
            }}>
              Quote / Testimonial *
            </label>
            <textarea
              value={formData.quote}
              onChange={(e) =>
                setFormData({ ...formData, quote: e.target.value })
              }
              placeholder="Enter the customer's testimonial..."
              rows={3}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '8px',
                backgroundColor: '#111827',
                color: '#e5e7eb',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box',
                fontFamily: 'inherit',
                transition: 'all 0.15s',
                resize: 'vertical',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'rgba(74, 222, 128, 0.3)';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(74, 222, 128, 0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              required
            />
          </div>

          {/* Main Image */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: 600,
              color: '#e5e7eb',
              marginBottom: '8px',
            }}>
              Main Image (Profile/Review Image) *
            </label>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              {mainImagePreview && (
                <div style={{ position: 'relative', width: '100px', height: '100px' }}>
                  <Image
                    src={mainImagePreview}
                    alt="Main preview"
                    fill
                    style={{ borderRadius: '8px', objectFit: 'cover' }}
                  />
                </div>
              )}
              <label style={{
                flex: 1,
                padding: '10px 12px',
                border: '1px dashed rgba(74, 222, 128, 0.3)',
                borderRadius: '8px',
                backgroundColor: 'rgba(74, 222, 128, 0.05)',
                color: '#6b7280',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.15s',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(74, 222, 128, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(74, 222, 128, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(74, 222, 128, 0.05)';
                e.currentTarget.style.borderColor = 'rgba(74, 222, 128, 0.3)';
              }}
              >
                <Upload size={16} />
                <span>Choose image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, 'main')}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
          </div>

          {/* Avatar Image */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: 600,
              color: '#e5e7eb',
              marginBottom: '8px',
            }}>
              Avatar Image (Thumbnail)
            </label>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              {avatarImagePreview && (
                <div style={{ position: 'relative', width: '80px', height: '80px' }}>
                  <Image
                    src={avatarImagePreview}
                    alt="Avatar preview"
                    fill
                    style={{ borderRadius: '8px', objectFit: 'cover' }}
                  />
                </div>
              )}
              <label style={{
                flex: 1,
                padding: '10px 12px',
                border: '1px dashed rgba(74, 222, 128, 0.3)',
                borderRadius: '8px',
                backgroundColor: 'rgba(74, 222, 128, 0.05)',
                color: '#6b7280',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.15s',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(74, 222, 128, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(74, 222, 128, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(74, 222, 128, 0.05)';
                e.currentTarget.style.borderColor = 'rgba(74, 222, 128, 0.3)';
              }}
              >
                <Upload size={16} />
                <span>Choose image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, 'avatar')}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
          </div>

          {/* Status & Display Order */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 600,
                color: '#e5e7eb',
                marginBottom: '8px',
              }}>
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as 'ACTIVE' | 'INACTIVE' | 'PENDING',
                  })
                }
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '8px',
                  backgroundColor: '#111827',
                  color: '#e5e7eb',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'all 0.15s',
                  cursor: 'pointer',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(74, 222, 128, 0.3)';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(74, 222, 128, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <option value="ACTIVE">Active</option>
                <option value="PENDING">Pending</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 600,
                color: '#e5e7eb',
                marginBottom: '8px',
              }}>
                Display Order
              </label>
              <input
                type="number"
                value={formData.displayOrder}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    displayOrder: parseInt(e.target.value),
                  })
                }
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '8px',
                  backgroundColor: '#111827',
                  color: '#e5e7eb',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'all 0.15s',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(74, 222, 128, 0.3)';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(74, 222, 128, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>
        </form>

        {/* Footer */}
        <div style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'flex-end',
          padding: '16px 24px',
          borderTop: '1px solid rgba(255, 255, 255, 0.07)',
        }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '10px 16px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '8px',
              backgroundColor: 'transparent',
              color: '#9ca3af',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            style={{
              padding: '10px 16px',
              border: 'none',
              borderRadius: '8px',
              backgroundColor: loading ? '#4ade80' : '#4ade80',
              color: loading ? '#0a0f1a' : '#0a0f1a',
              fontSize: '14px',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundColor = '#22c55e';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundColor = '#4ade80';
              }
            }}
          >
            {loading ? 'Saving...' : review ? 'Update Review' : 'Create Review'}
          </button>
        </div>
      </div>
    </div>
  );
}
