'use client';

import { useState, useEffect } from 'react';
import { X, AlertCircle, CheckCircle2, Upload } from 'lucide-react';
import Image from 'next/image';
import { api, VideoReview, getApiUrl } from '@/lib/api';

interface Props {
  review: VideoReview | null;
  onClose: () => void;
  onSave: () => void;
}

export default function VideoReviewForm({ review, onClose, onSave }: Props) {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    quote: '',
    rating: 5,
    videoUrl: '',
    status: 'PENDING',
    displayOrder: 0,
  });

  const [thumbnailImage, setThumbnailImage] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoFileName, setVideoFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [error, setError] = useState('');

  // Initialize form with review data if editing
  useEffect(() => {
    if (review) {
      setFormData({
        name: review.name,
        role: review.role,
        quote: review.quote,
        rating: review.rating,
        videoUrl: review.videoUrl || '',
        status: review.status,
        displayOrder: review.displayOrder,
      });
      setThumbnailPreview(review.thumbnailImage);
      if (review.videoUrl) {
        setVideoFileName(review.videoUrl.split('/').pop() || 'video');
      }
    }
  }, [review]);

  const uploadToS3 = async (file: File): Promise<string> => {
    const formDataToSend = new FormData();
    formDataToSend.append('images', file);

    const url = `${getApiUrl()}/uploads/images`;
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    const response = await fetch(url, {
      method: 'POST',
      body: formDataToSend,
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Upload failed');
    }

    const data = await response.json();
    return data.urls[0];
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB for images)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB');
      return;
    }

    setThumbnailImage(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      setThumbnailPreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (100MB for videos)
    if (file.size > 100 * 1024 * 1024) {
      setError('Video must be less than 100MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('video/')) {
      setError('Please select a valid video file');
      return;
    }

    setVideoFile(file);
    setVideoFileName(file.name);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let videoUrl = formData.videoUrl;

      // Upload video file to S3 if provided
      if (videoFile) {
        setUploadingVideo(true);
        try {
          videoUrl = await uploadToS3(videoFile);
        } catch (err) {
          throw new Error(err instanceof Error ? err.message : 'Failed to upload video');
        } finally {
          setUploadingVideo(false);
        }
      }

      const formDataToSend = new FormData();

      // Add form fields
      formDataToSend.append('name', formData.name);
      formDataToSend.append('role', formData.role);
      formDataToSend.append('quote', formData.quote);
      formDataToSend.append('rating', formData.rating.toString());
      if (videoUrl) {
        formDataToSend.append('videoUrl', videoUrl);
      }
      formDataToSend.append('status', formData.status);
      formDataToSend.append('displayOrder', formData.displayOrder.toString());

      // Add thumbnail image if changed
      if (thumbnailImage) {
        formDataToSend.append('thumbnailImage', thumbnailImage);
      }

      if (review) {
        await api.testimonials.updateVideoReview(review.id, formDataToSend);
      } else {
        await api.testimonials.createVideoReview(formDataToSend);
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
            {review ? 'Edit Video Review' : 'Add Video Review'}
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

          {/* Name */}
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

          {/* Role */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: 600,
              color: '#e5e7eb',
              marginBottom: '8px',
            }}>
              Role / Title *
            </label>
            <textarea
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              placeholder="e.g., Award Winning Podcaster&#10;behind The Diary of a CEO"
              rows={2}
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
            <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '6px', margin: '6px 0 0 0' }}>Use line breaks for multi-line text</p>
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
              Quote *
            </label>
            <textarea
              value={formData.quote}
              onChange={(e) =>
                setFormData({ ...formData, quote: e.target.value })
              }
              placeholder="Enter the testimonial quote..."
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

          {/* Rating */}
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

          {/* Thumbnail Image */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: 600,
              color: '#e5e7eb',
              marginBottom: '8px',
            }}>
              Thumbnail Image *
            </label>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              {thumbnailPreview && (
                <div style={{ position: 'relative', width: '100px', height: '100px' }}>
                  <Image
                    src={thumbnailPreview}
                    alt="Thumbnail preview"
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
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
          </div>

          {/* Video Upload */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: 600,
              color: '#e5e7eb',
              marginBottom: '8px',
            }}>
              Video File (Optional)
            </label>
            <div style={{
              padding: '16px',
              border: '1px dashed rgba(74, 222, 128, 0.3)',
              borderRadius: '8px',
              backgroundColor: 'rgba(74, 222, 128, 0.05)',
              textAlign: 'center',
              transition: 'all 0.15s',
            }}>
              {videoFileName ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', color: '#4ade80' }}>
                  <CheckCircle2 size={16} />
                  <span style={{ fontSize: '14px', fontWeight: 500 }}>{videoFileName}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setVideoFile(null);
                      setVideoFileName('');
                    }}
                    style={{
                      marginLeft: '8px',
                      padding: '4px 8px',
                      backgroundColor: 'rgba(248, 113, 113, 0.1)',
                      border: '1px solid rgba(248, 113, 113, 0.3)',
                      borderRadius: '4px',
                      color: '#f87171',
                      fontSize: '12px',
                      cursor: 'pointer',
                      fontWeight: 600,
                    }}
                  >
                    Clear
                  </button>
                </div>
              ) : (
                <label style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  color: '#6b7280',
                }}>
                  <Upload size={24} style={{ color: '#4ade80' }} />
                  <span style={{ fontSize: '14px', fontWeight: 500 }}>Click to upload video</span>
                  <span style={{ fontSize: '12px', color: '#6b7280' }}>MP4, WebM, or other video formats (max 100MB)</span>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoChange}
                    disabled={uploadingVideo}
                    style={{ display: 'none' }}
                  />
                </label>
              )}
            </div>
            {uploadingVideo && (
              <p style={{ fontSize: '12px', color: '#4ade80', marginTop: '8px' }}>Uploading video...</p>
            )}
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
            disabled={loading || uploadingVideo}
            style={{
              padding: '10px 16px',
              border: 'none',
              borderRadius: '8px',
              backgroundColor: loading || uploadingVideo ? '#4ade80' : '#4ade80',
              color: loading || uploadingVideo ? '#0a0f1a' : '#0a0f1a',
              fontSize: '14px',
              fontWeight: 600,
              cursor: loading || uploadingVideo ? 'not-allowed' : 'pointer',
              opacity: loading || uploadingVideo ? 0.6 : 1,
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              if (!loading && !uploadingVideo) {
                e.currentTarget.style.backgroundColor = '#22c55e';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading && !uploadingVideo) {
                e.currentTarget.style.backgroundColor = '#4ade80';
              }
            }}
          >
            {loading ? 'Saving...' : uploadingVideo ? 'Uploading Video...' : review ? 'Update Review' : 'Create Review'}
          </button>
        </div>
      </div>
    </div>
  );
}
