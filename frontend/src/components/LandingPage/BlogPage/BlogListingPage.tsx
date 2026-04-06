'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Search, ChevronRight, Calendar, Clock, Filter, X } from 'lucide-react';
import { BRAND, F_SIZE, FONTS } from '@/lib/typography';
import { getBlogs, getBlogTags, Blog, BlogTag } from '@/lib/blogApi';

export default function BlogPageComponent() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [tags, setTags] = useState<BlogTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Fetch blogs
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await getBlogs(page, 6, selectedTag || undefined, searchQuery);
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
  }, [page, selectedTag, searchQuery]);

  // Fetch tags
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await getBlogTags();
        setTags(response);
      } catch (err) {
        console.error('Failed to load tags:', err);
      }
    };

    fetchTags();
  }, []);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPage(1);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTag(null);
    setPage(1);
    setShowFilters(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: BRAND.white, paddingTop: 60 }}>
      {/* Hero Section */}
      <section style={{ padding: 'clamp(40px, 10vw, 80px) 20px', textAlign: 'center', background: `linear-gradient(135deg, ${BRAND.light} 0%, ${BRAND.white} 100%)` }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 style={{ fontSize: F_SIZE.xl, fontWeight: 900, color: BRAND.text, margin: '0 0 16px', letterSpacing: '-0.04em' }}>
            Our <span style={{ color: BRAND.primaryDark }}>Research Hub</span>
          </h1>
          <p style={{ fontSize: F_SIZE.md, color: BRAND.textMuted, maxWidth: 600, margin: '0 auto' }}>
            Clinical insights, nutritional science, and wellness research curated for informed health decisions.
          </p>
        </motion.div>
      </section>

      {/* Search & Filter Section */}
      <section style={{ padding: '30px 20px', borderBottom: `1px solid ${BRAND.border}`, position: 'sticky', top: 60, background: BRAND.white, zIndex: 40 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
            <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Search size={20} style={{ position: 'absolute', left: 16, color: BRAND.textMuted, pointerEvents: 'none' }} />
              <input
                type="text"
                placeholder="Search blogs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 48px',
                  border: `1px solid ${BRAND.border}`,
                  borderRadius: 12,
                  fontSize: F_SIZE.sm,
                  outline: 'none',
                  transition: 'all 0.3s',
                }}
              />
            </div>
            <button
              type="submit"
              style={{
                padding: '12px 24px',
                background: BRAND.primary,
                color: BRAND.white,
                border: 'none',
                borderRadius: 12,
                fontWeight: 900,
                cursor: 'pointer',
                fontSize: F_SIZE.sm,
                display: 'none',
              }}
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              style={{
                padding: '12px 16px',
                background: BRAND.light,
                border: `1px solid ${BRAND.border}`,
                borderRadius: 12,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: F_SIZE.sm,
                fontWeight: 700,
              }}
            >
              <Filter size={18} /> Filters
            </button>
          </form>

          {/* Filter Tags */}
          {showFilters && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ duration: 0.3 }}>
              <div style={{ paddingTop: 16, borderTop: `1px solid ${BRAND.border}` }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 12 }}>
                  {tags.map((tag) => (
                    <motion.button
                      key={tag.id}
                      onClick={() => setSelectedTag(selectedTag === tag.slug ? null : tag.slug)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      style={{
                        padding: '8px 16px',
                        borderRadius: 100,
                        border: `2px solid ${tag.color || BRAND.primary}`,
                        background: selectedTag === tag.slug ? (tag.color || BRAND.primary) : BRAND.white,
                        color: selectedTag === tag.slug ? BRAND.white : (tag.color || BRAND.primary),
                        cursor: 'pointer',
                        fontWeight: 700,
                        fontSize: F_SIZE.sm,
                        transition: 'all 0.3s',
                      }}
                    >
                      {tag.name}
                    </motion.button>
                  ))}
                </div>

                {(selectedTag || searchQuery) && (
                  <button
                    onClick={clearFilters}
                    style={{
                      padding: '8px 16px',
                      background: BRAND.light,
                      border: `1px solid ${BRAND.border}`,
                      borderRadius: 100,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      fontSize: F_SIZE.sm,
                      fontWeight: 700,
                    }}
                  >
                    <X size={14} /> Clear Filters
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Blogs Grid */}
      <section style={{ padding: '40px 20px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          {loading && (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{ fontSize: F_SIZE.md, color: BRAND.textMuted }}>Loading blogs...</div>
            </div>
          )}

          {error && (
            <div style={{ padding: '20px', background: '#fee', border: '1px solid #fcc', borderRadius: 12, color: '#c33' }}>
              {error}
            </div>
          )}

          {!loading && blogs.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <p style={{ fontSize: F_SIZE.md, color: BRAND.textMuted }}>No blogs found. Try adjusting your filters.</p>
            </div>
          )}

          {!loading && blogs.length > 0 && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 'clamp(20px, 4vw, 30px)' }}>
                {blogs.map((blog, idx) => (
                  <motion.div
                    key={blog.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                  >
                    <Link href={`/blog/${blog.slug}`}>
                      <motion.div
                        whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}
                        style={{
                          borderRadius: 20,
                          overflow: 'hidden',
                          background: BRAND.white,
                          border: `1px solid ${BRAND.border}`,
                          transition: 'all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)',
                          cursor: 'pointer',
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                        }}
                      >
                        {/* Image */}
                        <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', overflow: 'hidden', background: BRAND.light }}>
                          {blog.featuredImage ? (
                            <Image
                              src={blog.featuredImage}
                              alt={blog.title}
                              fill
                              style={{ objectFit: 'cover' }}
                            />
                          ) : (
                            <div style={{ width: '100%', height: '100%', background: `linear-gradient(135deg, ${BRAND.light}, ${BRAND.tertiary})` }} />
                          )}
                          <div style={{ position: 'absolute', top: 12, left: 12 }}>
                            {blog.tags[0] && (
                              <div style={{
                                background: BRAND.white,
                                padding: '4px 12px',
                                borderRadius: 100,
                                fontSize: F_SIZE.sm,
                                fontWeight: 900,
                                color: BRAND.primary,
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                              }}>
                                {blog.tags[0].name}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Content */}
                        <div style={{ padding: 'clamp(16px, 4vw, 24px)', flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
                          {/* Meta */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: F_SIZE.sm, color: BRAND.textMuted, flexWrap: 'wrap' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <Calendar size={14} />
                              {new Date(blog.publishedAt || blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </div>
                            {blog.readTime && (
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <Clock size={14} />
                                {blog.readTime} min
                              </div>
                            )}
                          </div>

                          {/* Title */}
                          <h3 style={{ fontSize: F_SIZE.md, fontWeight: 900, color: BRAND.text, margin: 0, lineHeight: 1.3 }}>
                            {blog.title}
                          </h3>

                          {/* Excerpt */}
                          <p style={{
                            fontSize: F_SIZE.sm,
                            color: BRAND.textMuted,
                            margin: 0,
                            lineHeight: 1.5,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}>
                            {blog.excerpt}
                          </p>

                          {/* CTA */}
                          <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 8, color: BRAND.primaryDark, fontWeight: 800, fontSize: F_SIZE.sm }}>
                            Read Article <ChevronRight size={16} />
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{ marginTop: '60px', display: 'flex', justifyContent: 'center', gap: 12, alignItems: 'center' }}>
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    style={{
                      padding: '10px 16px',
                      border: `1px solid ${BRAND.border}`,
                      borderRadius: 8,
                      background: page === 1 ? BRAND.light : BRAND.white,
                      cursor: page === 1 ? 'not-allowed' : 'pointer',
                      fontWeight: 700,
                      opacity: page === 1 ? 0.5 : 1,
                    }}
                  >
                    Previous
                  </button>

                  {/* Page numbers */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 8,
                        border: pageNum === page ? 'none' : `1px solid ${BRAND.border}`,
                        background: pageNum === page ? BRAND.primary : BRAND.white,
                        color: pageNum === page ? BRAND.white : BRAND.text,
                        cursor: 'pointer',
                        fontWeight: 900,
                        fontSize: F_SIZE.sm,
                      }}
                    >
                      {pageNum}
                    </button>
                  ))}

                  <button
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    style={{
                      padding: '10px 16px',
                      border: `1px solid ${BRAND.border}`,
                      borderRadius: 8,
                      background: page === totalPages ? BRAND.light : BRAND.white,
                      cursor: page === totalPages ? 'not-allowed' : 'pointer',
                      fontWeight: 700,
                      opacity: page === totalPages ? 0.5 : 1,
                    }}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
