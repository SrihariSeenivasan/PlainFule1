'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Edit2, Trash2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { buildApiUrl } from '@/lib/api-config';
import CustomerReviewForm from './CustomerReviewForm';

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
  createdAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export default function CustomerReviewManager() {
  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingReview, setEditingReview] = useState<CustomerReview | null>(null);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Fetch reviews
  const fetchReviews = useCallback(async (page = 1, status = '') => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', '10');
      if (status) params.append('status', status);

      const response = await fetch(buildApiUrl('/testimonials/admin/customer-reviews?') + params, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch reviews');

      const data = await response.json();
      setReviews(data.data);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews(pagination.page, filterStatus);
  }, [pagination.page, filterStatus, fetchReviews]);

  // Handle create/update
  const handleSave = async () => {
    fetchReviews(pagination.page, filterStatus);
    setShowForm(false);
    setEditingReview(null);
  };

  // Handle delete
  const handleDelete = async (id: number, name: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;

    try {
      const response = await fetch(buildApiUrl(`/testimonials/admin/customer-reviews/${id}`), {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) throw new Error('Failed to delete review');

      setSuccessMsg(`Review "${name}" deleted successfully`);
      setTimeout(() => setSuccessMsg(''), 3000);
      fetchReviews(pagination.page, filterStatus);
    } catch (error) {
      console.error('Error deleting review:', error);
      setError('Failed to delete review');
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div style={{
      fontFamily: "'Segoe UI', 'Roboto', sans-serif",
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
      }}>
        <select
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value);
            fetchReviews(1, e.target.value);
          }}
          style={{
            padding: '10px 12px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '8px',
            backgroundColor: '#111827',
            color: '#e5e7eb',
            fontSize: '14px',
            cursor: 'pointer',
            outline: 'none',
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
        >
          <option value="">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="PENDING">Pending</option>
          <option value="INACTIVE">Inactive</option>
        </select>

        <button
          onClick={() => {
            setEditingReview(null);
            setShowForm(true);
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#4ade80',
            color: '#0a0f1a',
            padding: '10px 16px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 600,
            transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#22c55e';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#4ade80';
          }}
        >
          <Plus size={16} /> Add Customer Review
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <CustomerReviewForm
          review={editingReview}
          onClose={() => {
            setShowForm(false);
            setEditingReview(null);
          }}
          onSave={handleSave}
        />
      )}

      {/* Error Toast */}
      {error && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 16px',
          backgroundColor: 'rgba(248, 113, 113, 0.1)',
          border: '1px solid rgba(248, 113, 113, 0.3)',
          borderRadius: '8px',
          color: '#f87171',
          fontSize: '14px',
        }}>
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {/* Success Toast */}
      {successMsg && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 16px',
          backgroundColor: 'rgba(74, 222, 128, 0.1)',
          border: '1px solid rgba(74, 222, 128, 0.3)',
          borderRadius: '8px',
          color: '#4ade80',
          fontSize: '14px',
        }}>
          <CheckCircle2 size={16} />
          {successMsg}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{
          padding: '48px 24px',
          textAlign: 'center',
          backgroundColor: '#111827',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.07)',
        }}>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>Loading reviews...</p>
        </div>
      )}

      {/* Reviews Table */}
      {!loading && reviews.length > 0 && (
        <div style={{
          overflowX: 'auto',
          backgroundColor: '#111827',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.07)',
        }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontFamily: 'inherit',
          }}>
            <thead>
              <tr style={{
                backgroundColor: '#0a0f1a',
                borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
              }}>
                <th style={{
                  padding: '16px',
                  textAlign: 'left',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#e5e7eb',
                  borderRight: '1px solid rgba(255, 255, 255, 0.07)',
                }}>Name</th>
                <th style={{
                  padding: '16px',
                  textAlign: 'left',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#e5e7eb',
                  borderRight: '1px solid rgba(255, 255, 255, 0.07)',
                }}>Category</th>
                <th style={{
                  padding: '16px',
                  textAlign: 'left',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#e5e7eb',
                  borderRight: '1px solid rgba(255, 255, 255, 0.07)',
                }}>Rating</th>
                <th style={{
                  padding: '16px',
                  textAlign: 'left',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#e5e7eb',
                  borderRight: '1px solid rgba(255, 255, 255, 0.07)',
                }}>Status</th>
                <th style={{
                  padding: '16px',
                  textAlign: 'left',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#e5e7eb',
                  borderRight: '1px solid rgba(255, 255, 255, 0.07)',
                }}>Order</th>
                <th style={{
                  padding: '16px',
                  textAlign: 'right',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#e5e7eb',
                }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review, idx) => (
                <tr key={review.id} style={{
                  borderBottom: idx !== reviews.length - 1 ? '1px solid rgba(255, 255, 255, 0.07)' : 'none',
                  transition: 'all 0.15s',
                }}>
                  <td style={{
                    padding: '16px',
                    fontSize: '14px',
                    color: '#e5e7eb',
                    fontWeight: 500,
                    borderRight: '1px solid rgba(255, 255, 255, 0.07)',
                  }}>{review.name}</td>
                  <td style={{
                    padding: '16px',
                    fontSize: '14px',
                    color: '#9ca3af',
                    borderRight: '1px solid rgba(255, 255, 255, 0.07)',
                  }}>{review.category}</td>
                  <td style={{
                    padding: '16px',
                    fontSize: '14px',
                    color: '#e5e7eb',
                    borderRight: '1px solid rgba(255, 255, 255, 0.07)',
                  }}>⭐ {review.rating}/5</td>
                  <td style={{
                    padding: '16px',
                    fontSize: '13px',
                    fontWeight: 600,
                    borderRight: '1px solid rgba(255, 255, 255, 0.07)',
                  }}>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      display: 'inline-block',
                      backgroundColor: review.status === 'ACTIVE'
                        ? 'rgba(74, 222, 128, 0.15)'
                        : review.status === 'PENDING'
                        ? 'rgba(251, 146, 60, 0.15)'
                        : 'rgba(107, 114, 128, 0.15)',
                      color: review.status === 'ACTIVE'
                        ? '#4ade80'
                        : review.status === 'PENDING'
                        ? '#fb923c'
                        : '#9ca3af',
                    }}>
                      {review.status}
                    </span>
                  </td>
                  <td style={{
                    padding: '16px',
                    fontSize: '14px',
                    color: '#9ca3af',
                    borderRight: '1px solid rgba(255, 255, 255, 0.07)',
                  }}>#{review.displayOrder}</td>
                  <td style={{
                    padding: '16px',
                    fontSize: '14px',
                    textAlign: 'right',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                      <button
                        onClick={() => {
                          setEditingReview(review);
                          setShowForm(true);
                        }}
                        style={{
                          padding: '8px',
                          backgroundColor: 'transparent',
                          border: 'none',
                          borderRadius: '6px',
                          color: '#4ade80',
                          cursor: 'pointer',
                          transition: 'all 0.15s',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(74, 222, 128, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(review.id, review.name)}
                        style={{
                          padding: '8px',
                          backgroundColor: 'transparent',
                          border: 'none',
                          borderRadius: '6px',
                          color: '#f87171',
                          cursor: 'pointer',
                          transition: 'all 0.15s',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(248, 113, 113, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Empty State */}
      {!loading && reviews.length === 0 && (
        <div style={{
          padding: '48px 24px',
          textAlign: 'center',
          backgroundColor: '#111827',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.07)',
        }}>
          <p style={{ fontSize: '16px', color: '#e5e7eb', margin: '0 0 4px 0' }}>No customer reviews found</p>
          <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>Create your first customer review by clicking the &quot;Add Customer Review&quot; button</p>
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '12px',
          padding: '16px 0',
          flexWrap: 'wrap',
        }}>
          <button
            onClick={() => fetchReviews(Math.max(1, pagination.page - 1), filterStatus)}
            disabled={pagination.page === 1}
            style={{
              padding: '8px 12px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '6px',
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              color: '#9ca3af',
              fontSize: '13px',
              fontWeight: 600,
              cursor: pagination.page === 1 ? 'not-allowed' : 'pointer',
              opacity: pagination.page === 1 ? 0.4 : 1,
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              if (pagination.page !== 1) {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)';
            }}
          >
            Previous
          </button>
          <span style={{
            padding: '8px 12px',
            color: '#9ca3af',
            fontSize: '13px',
          }}>
            Page {pagination.page} of {pagination.pages}
          </span>
          <button
            onClick={() => fetchReviews(Math.min(pagination.pages, pagination.page + 1), filterStatus)}
            disabled={pagination.page === pagination.pages}
            style={{
              padding: '8px 12px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '6px',
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              color: '#9ca3af',
              fontSize: '13px',
              fontWeight: 600,
              cursor: pagination.page === pagination.pages ? 'not-allowed' : 'pointer',
              opacity: pagination.page === pagination.pages ? 0.4 : 1,
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              if (pagination.page !== pagination.pages) {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)';
            }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
