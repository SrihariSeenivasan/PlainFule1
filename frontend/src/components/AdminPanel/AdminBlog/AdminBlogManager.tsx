'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, Trash2, Plus, Eye, FileText, Clock, MessageCircle, X, User } from 'lucide-react';
import { getAdminBlogs, Blog, deleteBlog, BlogComment } from '@/lib/blogApi';
import { useAuth } from '@/lib/auth-context';
import BlogEditor from './BlogEditor';

/* ─── Admin Dark Theme Styles ─────────────────────────────── */
const ADMIN_THEME = {
  bg: '#0f172a',
  bgLight: '#1e293b',
  border: 'rgba(255,255,255,0.1)',
  text: '#e5e7eb',
  textMuted: '#9ca3af',
  primary: '#3b82f6',
  primaryDark: '#1e40af',
  danger: '#ef4444',
  success: '#22c55e',
  warning: '#f97316',
};

type ViewMode = 'list' | 'editor' | 'comments';
type FilterStatus = 'all' | 'DRAFT' | 'PUBLISHED' | 'SCHEDULED';

export default function AdminBlog() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [commentsLoading, setCommentsLoading] = useState(false);
  const { token: authToken } = useAuth();

  // Fetch blogs
  useEffect(() => {
    if (viewMode !== 'list') return;

    const fetchBlogs = async () => {
      if (!authToken) return;
      try {
        setLoading(true);
        const response = await getAdminBlogs(
          authToken,
          page,
          10,
          filterStatus === 'all' ? undefined : filterStatus
        );
        setBlogs(response.data);
        setTotalPages(response.pagination.pages);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load blogs');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [page, filterStatus, viewMode, authToken]);

  const handleDeleteBlog = async (id: number) => {
    if (!authToken || !confirm('Are you sure you want to delete this blog?')) return;

    try {
      await deleteBlog(id, authToken);
      setBlogs(blogs.filter(b => b.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete blog');
    }
  };

  const handleBlogSaved = (blog: Blog) => {
    if (selectedBlog?.id === blog.id) {
      // Update existing blog
      setBlogs(blogs.map(b => b.id === blog.id ? blog : b));
    } else {
      // Add new blog
      setBlogs([blog, ...blogs]);
    }
    setViewMode('list');
    setSelectedBlog(null);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return <FileText size={16} />;
      case 'PUBLISHED':
        return <Eye size={16} />;
      case 'SCHEDULED':
        return <Clock size={16} />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return ADMIN_THEME.textMuted;
      case 'PUBLISHED':
        return ADMIN_THEME.success;
      case 'SCHEDULED':
        return ADMIN_THEME.warning;
      default:
        return ADMIN_THEME.text;
    }
  };

  return (
    <div style={{ padding: 20, minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }}>
        <h2 style={{ fontSize: 24, fontWeight: 900, color: ADMIN_THEME.text, margin: 0 }}>
          Blog Management
        </h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setSelectedBlog(null);
            setViewMode('editor');
          }}
          style={{
            padding: '10px 20px',
            background: ADMIN_THEME.primary,
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer',
            fontWeight: 900,
            fontSize: 13,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <Plus size={16} /> New Blog
        </motion.button>
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        {(['all', 'DRAFT', 'PUBLISHED', 'SCHEDULED'] as FilterStatus[]).map((status) => (
          <motion.button
            key={status}
            onClick={() => {
              setFilterStatus(status);
              setPage(1);
            }}
            whileHover={{ scale: 1.02 }}
            style={{
              padding: '8px 16px',
              background: filterStatus === status ? ADMIN_THEME.primary : ADMIN_THEME.bgLight,
              color: filterStatus === status ? '#fff' : ADMIN_THEME.text,
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: 13,
            }}
          >
            {status === 'all' ? 'All' : status}
          </motion.button>
        ))}
      </div>

      {/* Blogs List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 40 }}>
          <p style={{ color: ADMIN_THEME.textMuted }}>Loading blogs...</p>
        </div>
      ) : error ? (
        <div style={{ padding: 20, background: 'rgba(239,68,68,0.1)', border: `1px solid ${ADMIN_THEME.danger}`, borderRadius: 12, color: ADMIN_THEME.danger }}>
          {error}
        </div>
      ) : blogs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 40 }}>
          <p style={{ color: ADMIN_THEME.textMuted }}>No blogs yet. Create your first blog!</p>
        </div>
      ) : (
        <>
          <div style={{ borderRadius: 12, border: `1px solid ${ADMIN_THEME.border}`, overflow: 'hidden', background: ADMIN_THEME.bgLight }}>
            {blogs.map((blog, idx) => (
              <motion.div
                key={blog.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                style={{
                  padding: 16,
                  borderBottom: idx < blogs.length - 1 ? `1px solid ${ADMIN_THEME.border}` : 'none',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 16,
                }}
              >
                {/* Blog Info */}
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 900, color: ADMIN_THEME.text, margin: '0 0 8px' }}>
                    {blog.title}
                  </h3>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                    <span
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        fontSize: 13,
                        color: getStatusColor(blog.status),
                        fontWeight: 700,
                      }}
                    >
                      {getStatusIcon(blog.status)} {blog.status}
                    </span>
                    <span style={{ fontSize: 13, color: ADMIN_THEME.textMuted }}>
                      {new Date(blog.publishedAt || blog.createdAt).toLocaleDateString()}
                    </span>
                    {blog.tags.length > 0 && (
                      <span style={{ fontSize: 13, color: ADMIN_THEME.textMuted }}>
                        {blog.tags.map(t => t.name).join(', ')}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 8 }}>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      setSelectedBlog(blog);
                      setViewMode('comments');
                    }}
                    style={{
                      padding: 8,
                      background: 'rgba(34,197,94,0.1)',
                      border: 'none',
                      borderRadius: 6,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: ADMIN_THEME.success,
                    }}
                    title="View Comments"
                  >
                    <MessageCircle size={16} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      setSelectedBlog(blog);
                      setViewMode('editor');
                    }}
                    style={{
                      padding: 8,
                      background: 'rgba(59,130,246,0.1)',
                      border: 'none',
                      borderRadius: 6,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: ADMIN_THEME.primary,
                    }}
                    title="Edit"
                  >
                    <Edit2 size={16} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDeleteBlog(blog.id)}
                    style={{
                      padding: 8,
                      background: 'rgba(239,68,68,0.1)',
                      border: 'none',
                      borderRadius: 6,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: ADMIN_THEME.danger,
                    }}
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 20 }}>
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                style={{
                  padding: '8px 16px',
                  border: `1px solid ${ADMIN_THEME.border}`,
                  borderRadius: 6,
                  background: page === 1 ? ADMIN_THEME.bgLight : ADMIN_THEME.bgLight,
                  color: ADMIN_THEME.text,
                  cursor: page === 1 ? 'not-allowed' : 'pointer',
                }}
              >
                Previous
              </button>
              <span style={{ padding: '8px 16px', color: ADMIN_THEME.textMuted, fontWeight: 700 }}>
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                style={{
                  padding: '8px 16px',
                  border: `1px solid ${ADMIN_THEME.border}`,
                  borderRadius: 6,
                  background: page === totalPages ? ADMIN_THEME.bgLight : ADMIN_THEME.bgLight,
                  color: ADMIN_THEME.text,
                  cursor: page === totalPages ? 'not-allowed' : 'pointer',
                }}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Editor Modal */}
      <AnimatePresence>
        {viewMode === 'editor' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: 20,
              overflowY: 'auto',
            }}
            onClick={() => {
              setViewMode('list');
              setSelectedBlog(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                maxHeight: '90vh',
                overflowY: 'auto',
                width: '100%',
                maxWidth: 1200,
                borderRadius: 12,
                backgroundColor: ADMIN_THEME.bg,
              }}
            >
              <BlogEditor
                blog={selectedBlog}
                onSave={handleBlogSaved}
                onCancel={() => {
                  setViewMode('list');
                  setSelectedBlog(null);
                }}
              />
            </motion.div>
          </motion.div>
        )}

        {/* Comments Modal */}
        {viewMode === 'comments' && selectedBlog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: 20,
              overflowY: 'auto',
            }}
            onClick={() => {
              setViewMode('list');
              setSelectedBlog(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: 700,
                maxHeight: '90vh',
                overflowY: 'auto',
                borderRadius: 12,
                backgroundColor: ADMIN_THEME.bg,
                border: `1px solid ${ADMIN_THEME.border}`,
              }}
            >
              {/* Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 20,
                borderBottom: `1px solid ${ADMIN_THEME.border}`,
              }}>
                <h3 style={{ fontSize: 18, fontWeight: 900, color: ADMIN_THEME.text, margin: 0 }}>
                  Comments on &quot;{selectedBlog.title}&quot;
                  {selectedBlog.comments && selectedBlog.comments.length > 0 && (
                    <span style={{ color: ADMIN_THEME.success, marginLeft: 10 }}>({selectedBlog.comments.length})</span>
                  )}
                </h3>
                <button
                  onClick={() => {
                    setViewMode('list');
                    setSelectedBlog(null);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: 20,
                    cursor: 'pointer',
                    color: ADMIN_THEME.textMuted,
                  }}
                >
                  <X size={24} />
                </button>
              </div>

              {/* Comments List */}
              <div style={{ padding: 20 }}>
                {!selectedBlog.comments || selectedBlog.comments.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: 40 }}>
                    <MessageCircle size={40} style={{ color: ADMIN_THEME.textMuted, marginBottom: 12 }} />
                    <p style={{ color: ADMIN_THEME.textMuted, fontSize: 14 }}>
                      No comments yet
                    </p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {selectedBlog.comments.map((comment) => (
                      <motion.div
                        key={comment.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                          background: ADMIN_THEME.bgLight,
                          borderRadius: 12,
                          padding: 16,
                          borderLeft: `3px solid ${ADMIN_THEME.primary}`,
                        }}
                      >
                        {/* Comment Header */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                          <div style={{
                            width: 36,
                            height: 36,
                            borderRadius: '50%',
                            background: ADMIN_THEME.primary,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: ADMIN_THEME.bg,
                            flexShrink: 0,
                          }}>
                            <User size={18} />
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: 13, color: ADMIN_THEME.text }}>
                              {comment.user.firstName || 'User'} {comment.user.lastName || ''}
                            </div>
                            <div style={{ fontSize: 12, color: ADMIN_THEME.textMuted }}>
                              {comment.user.email}
                            </div>
                          </div>
                          <div style={{ marginLeft: 'auto', fontSize: 12, color: ADMIN_THEME.textMuted }}>
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </div>
                        </div>

                        {/* Comment Content */}
                        <p style={{ fontSize: 13, color: ADMIN_THEME.text, margin: '0 0 12px', lineHeight: 1.6, wordBreak: 'break-word' }}>
                          {comment.content}
                        </p>

                        {/* Replies */}
                        {comment.replies && comment.replies.length > 0 && (
                          <div style={{ marginTop: 12, paddingLeft: 16, borderLeft: `2px solid ${ADMIN_THEME.border}` }}>
                            <p style={{ fontSize: 11, color: ADMIN_THEME.textMuted, fontWeight: 700, marginBottom: 8, textTransform: 'uppercase' }}>
                              {comment.replies.length} Repl{comment.replies.length === 1 ? 'y' : 'ies'}
                            </p>
                            {comment.replies.map((reply) => (
                              <div key={reply.id} style={{ marginBottom: 12 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                                  <div style={{
                                    width: 28,
                                    height: 28,
                                    borderRadius: '50%',
                                    background: ADMIN_THEME.bgLight,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: ADMIN_THEME.text,
                                    fontSize: 12,
                                  }}>
                                    <User size={14} />
                                  </div>
                                  <div>
                                    <div style={{ fontWeight: 700, fontSize: 12, color: ADMIN_THEME.text }}>
                                      {reply.user.firstName || 'User'} {reply.user.lastName || ''}
                                    </div>
                                    <div style={{ fontSize: 11, color: ADMIN_THEME.textMuted }}>
                                      {new Date(reply.createdAt).toLocaleDateString()}
                                    </div>
                                  </div>
                                </div>
                                <p style={{ fontSize: 12, color: ADMIN_THEME.text, margin: 0, marginLeft: 36, lineHeight: 1.5, wordBreak: 'break-word' }}>
                                  {reply.content}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
