'use client';

import { useState, useCallback, useEffect } from 'react';
import { Edit2, Trash2, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import DoctorReviewForm from './DoctorReviewForm';
import { buildApiUrl } from '@/lib/api-config';

interface DoctorReview {
  id: number;
  name: string;
  title: string;
  quote: string;
  rating: number;
  image: string;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
  displayOrder: number;
}

export default function DoctorReviewManager() {
  const [reviews, setReviews] = useState<DoctorReview[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedReview, setSelectedReview] = useState<DoctorReview | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [toast, setToast] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        ...(statusFilter && { status: statusFilter }),
      });

      const response = await fetch(buildApiUrl(`/testimonials/admin/doctor-reviews?${params}`), {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }

      const data = await response.json();
      setReviews(data.data || []);
      setTotalPages(data.pagination?.pages || 1);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch reviews';
      setError(message);
      console.error('Fetch reviews error:', err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, statusFilter]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      const response = await fetch(buildApiUrl(`/testimonials/admin/doctor-reviews/${id}`), {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete review');
      }

      showToast('success', 'Review deleted successfully');
      fetchReviews();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete review';
      showToast('error', message);
      console.error('Delete error:', err);
    }
  };

  const handleEdit = (review: DoctorReview) => {
    setSelectedReview(review);
    setShowForm(true);
  };

  const handleCreate = () => {
    setSelectedReview(null);
    setShowForm(true);
  };

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setSelectedReview(null);
  };

  const handleFormSave = () => {
    showToast('success', selectedReview ? 'Review updated successfully' : 'Review created successfully');
    handleFormClose();
    setCurrentPage(1);
    fetchReviews();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return { bg: 'rgba(74, 222, 128, 0.1)', border: 'rgba(74, 222, 128, 0.3)', text: '#4ade80' };
      case 'PENDING':
        return { bg: 'rgba(251, 146, 60, 0.1)', border: 'rgba(251, 146, 60, 0.3)', text: '#fb923c' };
      case 'INACTIVE':
        return { bg: 'rgba(156, 163, 175, 0.1)', border: 'rgba(156, 163, 175, 0.3)', text: '#9ca3af' };
      default:
        return { bg: 'transparent', border: 'transparent', text: '#9ca3af' };
    }
  };

  return (
    <div style={{
      backgroundColor: '#0a0f1a',
      borderRadius: '12px',
      border: '1px solid rgba(255, 255, 255, 0.07)',
      overflow: 'hidden',
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
          fontSize: '18px',
          fontWeight: 700,
          color: '#e5e7eb',
          margin: 0,
        }}>
          Doctor Reviews
        </h2>
        <button
          onClick={handleCreate}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            backgroundColor: '#4ade80',
            border: 'none',
            borderRadius: '8px',
            color: '#0a0f1a',
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
          <Plus size={16} />
          Add Review
        </button>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div style={{
          padding: '12px 24px',
          backgroundColor: toast.type === 'success' ? 'rgba(74, 222, 128, 0.1)' : 'rgba(248, 113, 113, 0.1)',
          borderBottom: `1px solid ${toast.type === 'success' ? 'rgba(74, 222, 128, 0.3)' : 'rgba(248, 113, 113, 0.3)'}`,
          color: toast.type === 'success' ? '#4ade80' : '#f87171',
          fontSize: '14px',
        }}>
          {toast.message}
        </div>
      )}

      {/* Filters */}
      <div style={{
        padding: '16px 24px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
        display: 'flex',
        gap: '12px',
        alignItems: 'center',
      }}>
        <label style={{ color: '#9ca3af', fontSize: '14px', fontWeight: 600 }}>Filter by Status:</label>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
          style={{
            padding: '8px 12px',
            backgroundColor: '#111827',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '6px',
            color: '#e5e7eb',
            fontSize: '14px',
            cursor: 'pointer',
          }}
        >
          <option value="">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="PENDING">Pending</option>
          <option value="INACTIVE">Inactive</option>
        </select>
      </div>

      {/* Content */}
      <div style={{ overflow: 'hidden', overflowX: 'auto', maxWidth: '100%' }}>
        {loading ? (
          <div style={{
            padding: '40px 24px',
            textAlign: 'center',
            color: '#9ca3af',
          }}>
            Loading reviews...
          </div>
        ) : error ? (
          <div style={{
            padding: '40px 24px',
            textAlign: 'center',
            color: '#f87171',
          }}>
            {error}
          </div>
        ) : reviews.length === 0 ? (
          <div style={{
            padding: '40px 24px',
            textAlign: 'center',
            color: '#9ca3af',
          }}>
            No doctor reviews found
          </div>
        ) : (
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '14px',
          }}>
            <thead>
              <tr style={{
                backgroundColor: '#111827',
                borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
              }}>
                <th style={{
                  padding: '12px 16px',
                  textAlign: 'left',
                  color: '#e5e7eb',
                  fontWeight: 600,
                }}>
                  Name
                </th>
                <th style={{
                  padding: '12px 16px',
                  textAlign: 'left',
                  color: '#e5e7eb',
                  fontWeight: 600,
                }}>
                  Title
                </th>
                <th style={{
                  padding: '12px 16px',
                  textAlign: 'left',
                  color: '#e5e7eb',
                  fontWeight: 600,
                }}>
                  Quote
                </th>
                <th style={{
                  padding: '12px 16px',
                  textAlign: 'center',
                  color: '#e5e7eb',
                  fontWeight: 600,
                }}>
                  Rating
                </th>
                <th style={{
                  padding: '12px 16px',
                  textAlign: 'center',
                  color: '#e5e7eb',
                  fontWeight: 600,
                }}>
                  Status
                </th>
                <th style={{
                  padding: '12px 16px',
                  textAlign: 'center',
                  color: '#e5e7eb',
                  fontWeight: 600,
                }}>
                  Order
                </th>
                <th style={{
                  padding: '12px 16px',
                  textAlign: 'center',
                  color: '#e5e7eb',
                  fontWeight: 600,
                }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review, index) => {
                const statusColor = getStatusColor(review.status);
                return (
                  <tr
                    key={review.id}
                    style={{
                      backgroundColor: index % 2 === 0 ? 'rgba(255, 255, 255, 0.01)' : 'transparent',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(74, 222, 128, 0.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = index % 2 === 0 ? 'rgba(255, 255, 255, 0.01)' : 'transparent';
                    }}
                  >
                    <td style={{
                      padding: '12px 16px',
                      color: '#e5e7eb',
                    }}>
                      {review.name}
                    </td>
                    <td style={{
                      padding: '12px 16px',
                      color: '#9ca3af',
                    }}>
                      {review.title}
                    </td>
                    <td style={{
                      padding: '12px 16px',
                      color: '#9ca3af',
                      maxWidth: '200px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      {review.quote}
                    </td>
                    <td style={{
                      padding: '12px 16px',
                      textAlign: 'center',
                      color: '#e5e7eb',
                    }}>
                      {'⭐'.repeat(review.rating)}
                    </td>
                    <td style={{
                      padding: '12px 16px',
                      textAlign: 'center',
                    }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '4px 12px',
                        backgroundColor: statusColor.bg,
                        border: `1px solid ${statusColor.border}`,
                        borderRadius: '6px',
                        color: statusColor.text,
                        fontSize: '12px',
                        fontWeight: 600,
                      }}>
                        {review.status}
                      </span>
                    </td>
                    <td style={{
                      padding: '12px 16px',
                      textAlign: 'center',
                      color: '#e5e7eb',
                    }}>
                      {review.displayOrder}
                    </td>
                    <td style={{
                      padding: '12px 16px',
                      textAlign: 'center',
                    }}>
                      <div style={{
                        display: 'flex',
                        gap: '8px',
                        justifyContent: 'center',
                      }}>
                        <button
                          onClick={() => handleEdit(review)}
                          style={{
                            padding: '6px 10px',
                            backgroundColor: 'rgba(74, 222, 128, 0.1)',
                            border: '1px solid rgba(74, 222, 128, 0.3)',
                            borderRadius: '6px',
                            color: '#4ade80',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '12px',
                            transition: 'all 0.15s',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(74, 222, 128, 0.2)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(74, 222, 128, 0.1)';
                          }}
                        >
                          <Edit2 size={14} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(review.id, review.name)}
                          style={{
                            padding: '6px 10px',
                            backgroundColor: 'rgba(248, 113, 113, 0.1)',
                            border: '1px solid rgba(248, 113, 113, 0.3)',
                            borderRadius: '6px',
                            color: '#f87171',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '12px',
                            transition: 'all 0.15s',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(248, 113, 113, 0.2)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(248, 113, 113, 0.1)';
                          }}
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {reviews.length > 0 && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 24px',
          borderTop: '1px solid rgba(255, 255, 255, 0.07)',
          backgroundColor: '#111827',
        }}>
          <div style={{ color: '#9ca3af', fontSize: '14px' }}>
            Page {currentPage} of {totalPages}
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              style={{
                padding: '8px 12px',
                backgroundColor: currentPage === 1 ? 'rgba(255, 255, 255, 0.05)' : 'rgba(74, 222, 128, 0.1)',
                border: `1px solid ${currentPage === 1 ? 'rgba(255, 255, 255, 0.08)' : 'rgba(74, 222, 128, 0.3)'}`,
                borderRadius: '6px',
                color: currentPage === 1 ? '#6b7280' : '#4ade80',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '12px',
                transition: 'all 0.15s',
              }}
            >
              <ChevronLeft size={16} />
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              style={{
                padding: '8px 12px',
                backgroundColor: currentPage === totalPages ? 'rgba(255, 255, 255, 0.05)' : 'rgba(74, 222, 128, 0.1)',
                border: `1px solid ${currentPage === totalPages ? 'rgba(255, 255, 255, 0.08)' : 'rgba(74, 222, 128, 0.3)'}`,
                borderRadius: '6px',
                color: currentPage === totalPages ? '#6b7280' : '#4ade80',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '12px',
                transition: 'all 0.15s',
              }}
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <DoctorReviewForm
          review={selectedReview}
          onClose={handleFormClose}
          onSave={handleFormSave}
        />
      )}
    </div>
  );
}
