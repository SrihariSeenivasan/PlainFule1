'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth-context';
import { adminAPI, Product } from '@/lib/api';

// ── Theme Constants ──
const FS = "'DM Sans', 'Helvetica Neue', sans-serif";
const FD = "'Playfair Display', Georgia, serif";
const G = '#15803d';

interface FAQ {
  id: number;
  question: string;
  answer: string;
  type: 'PRODUCT' | 'COMMON';
  productId?: number;
  createdAt: string;
}

// Helper function to construct API URLs
const getApiUrl = (endpoint: string): string => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  // Ensure proper endpoint format
  return `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
};

export default function AdminFAQ() {
  const { token } = useAuth();
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    type: 'PRODUCT' as 'PRODUCT' | 'COMMON',
    productId: '' as string,
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<'all' | 'PRODUCT' | 'COMMON'>('all');
  const [error, setError] = useState<string>('');

  const loadFAQs = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(getApiUrl('/faqs'));
      if (response.ok) {
        const result = await response.json();
        setFaqs(result.data || []);
      } else {
        setError('Failed to load FAQs');
      }
    } catch (err) {
      console.error('Failed to load FAQs:', err);
      setError('Failed to load FAQs');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadProducts = useCallback(async () => {
    try {
      const fetchedProducts = await adminAPI.getProducts();
      setProducts(Array.isArray(fetchedProducts) ? fetchedProducts : []);
    } catch (err) {
      console.error('Failed to load products:', err);
    }
  }, []);

  // Load FAQs and Products from API
  useEffect(() => {
    loadFAQs();
    loadProducts();
  }, [loadFAQs, loadProducts]);

  const handleAddFAQ = async () => {
    if (!formData.question.trim() || !formData.answer.trim()) {
      setError('Please fill in both question and answer');
      return;
    }

    // Validate that if type is PRODUCT, a product must be selected
    if (formData.type === 'PRODUCT' && !formData.productId) {
      setError('Please select a product for this FAQ');
      return;
    }

    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId
        ? getApiUrl(`/faqs/${editingId}`)
        : getApiUrl('/faqs');

      const body: {
        question: string;
        answer: string;
        type: 'PRODUCT' | 'COMMON';
        productId?: number;
      } = {
        question: formData.question,
        answer: formData.answer,
        type: formData.type,
      };

      if (formData.productId) {
        body.productId = parseInt(formData.productId);
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        setError('');
        setFormData({ question: '', answer: '', type: 'PRODUCT', productId: '' });
        setEditingId(null);
        await loadFAQs();
      } else {
        setError('Failed to save FAQ');
      }
    } catch (err) {
      console.error('Error saving FAQ:', err);
      setError('Failed to save FAQ');
    }
  };

  const handleEditFAQ = (faq: FAQ) => {
    setFormData({
      question: faq.question,
      answer: faq.answer,
      type: faq.type,
      productId: faq.productId?.toString() || '',
    });
    setEditingId(faq.id);
    setError('');
  };

  const handleDeleteFAQ = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this FAQ?')) return;

    try {
      const response = await fetch(
        getApiUrl(`/faqs/${id}`),
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        await loadFAQs();
      } else {
        setError('Failed to delete FAQ');
      }
    } catch (err) {
      console.error('Error deleting FAQ:', err);
      setError('Failed to delete FAQ');
    }
  };

  const filteredFAQs = filterType === 'all' ? faqs : faqs.filter(f => f.type === filterType);
  const getProductName = (productId?: number) => {
    if (!productId) return 'All Products';
    return products.find(p => p.id === productId)?.name || 'Unknown Product';
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <p style={{ fontFamily: FS, color: '#999' }}>Loading FAQs...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: 1200, margin: '0 auto' }}>
      <h1 style={{ fontFamily: FD, fontSize: 32, color: '#1a1a1a', marginBottom: 32 }}>
        Manage FAQs
      </h1>

      {/* ─── Error Message ─── */}
      {error && (
        <div style={{
          background: '#fee', borderLeft: `4px solid #f33`, padding: 16, borderRadius: 8, marginBottom: 24,
        }}>
          <p style={{ fontFamily: FS, color: '#c33', margin: 0 }}>{error}</p>
        </div>
      )}

      {/* ─── Form Section ─── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: '#fff', border: `2px solid ${G}`, borderRadius: 12, padding: 24, marginBottom: 40,
        }}
      >
        <h2 style={{ fontFamily: FD, fontSize: 24, color: '#1a1a1a', marginTop: 0, marginBottom: 20 }}>
          {editingId ? 'Edit FAQ' : 'Add New FAQ'}
        </h2>

        <div style={{ marginBottom: 16 }}>
          <label style={{ fontFamily: FS, fontSize: 14, fontWeight: 600, color: '#333', display: 'block', marginBottom: 8 }}>
            Type *
          </label>
          <div style={{ display: 'flex', gap: 12 }}>
            {['PRODUCT', 'COMMON'].map(type => (
              <motion.button
                key={type}
                onClick={() => setFormData({ ...formData, type: type as 'PRODUCT' | 'COMMON', productId: type === 'COMMON' ? '' : formData.productId })}
                style={{
                  padding: '8px 16px', borderRadius: 8,
                  border: `2px solid ${formData.type === type ? G : '#ddd'}`,
                  background: formData.type === type ? G : 'transparent',
                  color: formData.type === type ? '#fff' : '#333',
                  fontFamily: FS, fontWeight: 600, fontSize: 14,
                  cursor: 'pointer', transition: 'all 0.2s',
                }}
              >
                {type === 'PRODUCT' ? 'Product FAQ' : 'Common FAQ'}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Product selector - only for PRODUCT type */}
        {formData.type === 'PRODUCT' && (
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontFamily: FS, fontSize: 14, fontWeight: 600, color: '#333', display: 'block', marginBottom: 8 }}>
              Select Product *
            </label>
            <select
              value={formData.productId}
              onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
              style={{
                width: '100%', padding: '10px 12px', fontFamily: FS, fontSize: 14,
                border: '1.5px solid #ddd', borderRadius: 8, boxSizing: 'border-box',
              }}
            >
              <option value="">-- Select a product --</option>
              {products.map(product => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div style={{ marginBottom: 16 }}>
          <label style={{ fontFamily: FS, fontSize: 14, fontWeight: 600, color: '#333', display: 'block', marginBottom: 8 }}>
            Question *
          </label>
          <input
            type="text"
            value={formData.question}
            onChange={(e) => setFormData({ ...formData, question: e.target.value })}
            placeholder="Enter the FAQ question"
            style={{
              width: '100%', padding: '10px 12px', fontFamily: FS, fontSize: 14,
              border: '1.5px solid #ddd', borderRadius: 8, boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ fontFamily: FS, fontSize: 14, fontWeight: 600, color: '#333', display: 'block', marginBottom: 8 }}>
            Answer *
          </label>
          <textarea
            value={formData.answer}
            onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
            placeholder="Enter the FAQ answer"
            rows={5}
            style={{
              width: '100%', padding: '10px 12px', fontFamily: FS, fontSize: 14,
              border: '1.5px solid #ddd', borderRadius: 8, boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={handleAddFAQ}
            style={{
              padding: '10px 24px', background: G, color: '#fff',
              fontFamily: FS, fontWeight: 600, border: 'none', borderRadius: 8,
              cursor: 'pointer', fontSize: 14,
            }}
          >
            {editingId ? 'Update FAQ' : 'Add FAQ'}
          </motion.button>
          {editingId && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={() => {
                setEditingId(null);
                setFormData({ question: '', answer: '', type: 'PRODUCT', productId: '' });
                setError('');
              }}
              style={{
                padding: '10px 24px', background: '#999', color: '#fff',
                fontFamily: FS, fontWeight: 600, border: 'none', borderRadius: 8,
                cursor: 'pointer', fontSize: 14,
              }}
            >
              Cancel
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* ─── Filter Section ─── */}
      <div style={{ marginBottom: 24, display: 'flex', gap: 12 }}>
        {['all', 'PRODUCT', 'COMMON'].map(type => (
          <motion.button
            key={type}
            onClick={() => setFilterType(type as 'all' | 'PRODUCT' | 'COMMON')}
            style={{
              padding: '8px 16px', borderRadius: 8,
              border: `2px solid ${filterType === type ? G : '#ddd'}`,
              background: filterType === type ? G : 'transparent',
              color: filterType === type ? '#fff' : '#333',
              fontFamily: FS, fontWeight: 600, fontSize: 14,
              cursor: 'pointer', transition: 'all 0.2s',
            }}
          >
            {type === 'all' ? 'All FAQs' : type === 'PRODUCT' ? 'Product FAQs' : 'Common FAQs'}
          </motion.button>
        ))}
      </div>

      {/* ─── FAQs List ─── */}
      <div>
        <h2 style={{ fontFamily: FD, fontSize: 24, color: '#1a1a1a', marginBottom: 20 }}>
          {filterType === 'all' ? 'All FAQs' : filterType === 'PRODUCT' ? 'Product FAQs' : 'Common FAQs'} ({filteredFAQs.length})
        </h2>

        {filteredFAQs.length === 0 ? (
          <div style={{
            background: '#f5f5f5', borderRadius: 12, padding: 32, textAlign: 'center',
          }}>
            <p style={{ fontFamily: FS, color: '#999', fontSize: 14 }}>
              No FAQs found. Create one to get started!
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 16 }}>
            {filteredFAQs.map((faq, idx) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                style={{
                  background: '#fff', border: '1.5px solid #ddd', borderRadius: 12, padding: 20,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                      <div style={{
                        display: 'inline-block', background: faq.type === 'PRODUCT' ? 'rgba(21, 128, 61, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                        padding: '4px 12px', borderRadius: 6,
                      }}>
                        <span style={{
                          fontFamily: FS, fontSize: 12, fontWeight: 600,
                          color: faq.type === 'PRODUCT' ? G : '#3b82f6', textTransform: 'uppercase',
                        }}>
                          {faq.type === 'PRODUCT' ? 'Product FAQ' : 'Common FAQ'}
                        </span>
                      </div>
                      {faq.productId && (
                        <div style={{
                          display: 'inline-block', background: 'rgba(168, 85, 247, 0.1)',
                          padding: '4px 12px', borderRadius: 6,
                        }}>
                          <span style={{
                            fontFamily: FS, fontSize: 12, fontWeight: 600,
                            color: '#a855f7',
                          }}>
                            {getProductName(faq.productId)}
                          </span>
                        </div>
                      )}
                    </div>
                    <p style={{ fontFamily: FS, fontWeight: 600, fontSize: 16, color: '#1a1a1a', margin: '0 0 8px', lineHeight: 1.5 }}>
                      {faq.question}
                    </p>
                    <p style={{ fontFamily: FS, fontSize: 14, color: '#666', margin: 0, lineHeight: 1.6 }}>
                      {faq.answer}
                    </p>
                    <p style={{ fontFamily: FS, fontSize: 12, color: '#999', margin: '12px 0 0' }}>
                      Created: {new Date(faq.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={() => handleEditFAQ(faq)}
                      style={{
                        padding: '6px 12px', background: '#3b82f6', color: '#fff',
                        fontFamily: FS, fontWeight: 600, border: 'none', borderRadius: 6,
                        cursor: 'pointer', fontSize: 12,
                      }}
                    >
                      Edit
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={() => handleDeleteFAQ(faq.id)}
                      style={{
                        padding: '6px 12px', background: '#ef4444', color: '#fff',
                        fontFamily: FS, fontWeight: 600, border: 'none', borderRadius: 6,
                        cursor: 'pointer', fontSize: 12,
                      }}
                    >
                      Delete
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
