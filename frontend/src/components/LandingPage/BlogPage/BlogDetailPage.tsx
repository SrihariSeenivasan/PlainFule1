'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, Share2, ChevronLeft, ChevronRight, MessageCircle, User, Trash2 } from 'lucide-react';
import { BRAND, F_SIZE, FONTS } from '@/lib/typography';
import { Blog, getBlogBySlug, addBlogComment, deleteBlogComment } from '@/lib/blogApi';
import { useAuth } from '@/lib/auth-context';
import ImageCarousel from './ImageCarousel';
import CommentsSection from './CommentsSection';

interface BlogDetailPageProps {
  slug: string;
}

export default function BlogDetailPage({ slug }: BlogDetailPageProps) {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token: authToken, user } = useAuth();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const data = await getBlogBySlug(slug);
        setBlog(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load blog');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  const handleShare = () => {
    const url = `${window.location.origin}/blog/${slug}`;
    const title = blog?.title || 'Check out this article';

    if (navigator.share) {
      navigator.share({ title, url, text: blog?.excerpt });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(url);
      alert('Blog link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: F_SIZE.md, color: BRAND.textMuted }}>Loading...</div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <h1 style={{ fontSize: F_SIZE.lg, color: BRAND.text, marginBottom: 12 }}>Blog Not Found</h1>
        <p style={{ color: BRAND.textMuted, marginBottom: 24 }}>{error || 'The blog you are looking for does not exist.'}</p>
        <Link href="/blog">
          <button style={{
            padding: '12px 24px',
            background: BRAND.primary,
            color: BRAND.white,
            border: 'none',
            borderRadius: 12,
            fontWeight: 900,
            cursor: 'pointer',
          }}>
            Back to Blogs
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div style={{ background: BRAND.white }}>
      {/* Hero Image */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        style={{ position: 'relative', width: '100%', aspectRatio: '16/9', overflow: 'hidden', maxHeight: '60vh' }}
      >
        {blog.featuredImage ? (
          <Image src={blog.featuredImage} alt={blog.title} fill style={{ objectFit: 'cover' }} priority />
        ) : (
          <div style={{ width: '100%', height: '100%', background: `linear-gradient(135deg, ${BRAND.light}, ${BRAND.tertiary})` }} />
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 80%)' }} />
      </motion.div>

      {/* Content */}
      <article style={{ maxWidth: 900, margin: '0 auto', padding: 'clamp(30px, 8vw, 60px) 20px' }}>
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
          {/* Tags */}
          {blog.tags.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
              {blog.tags.map((tag) => (
                <Link key={tag.id} href={`/blog?tag=${tag.slug}`}>
                  <span style={{
                    display: 'inline-block',
                    padding: '6px 14px',
                    background: tag.color ? `${tag.color}15` : BRAND.light,
                    color: tag.color || BRAND.primary,
                    borderRadius: 100,
                    fontSize: F_SIZE.sm,
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    cursor: 'pointer',
                  }}>
                    {tag.name}
                  </span>
                </Link>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 style={{
            fontSize: F_SIZE.xl,
            fontWeight: 900,
            color: BRAND.text,
            lineHeight: 1.1,
            letterSpacing: '-0.04em',
            margin: '0 0 12px',
          }}>
            {blog.title}
          </h1>

          {/* Meta */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 20, paddingBottom: 20, borderBottom: `1px solid ${BRAND.border}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: BRAND.light,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <span style={{ fontSize: '20px' }}>👨‍⚕️</span>
              </div>
              <div>
                <div style={{ fontWeight: 900, fontSize: F_SIZE.sm, color: BRAND.text }}>
                  {blog.creator.firstName} {blog.creator.lastName}
                </div>
                <div style={{ fontSize: F_SIZE.sm, color: BRAND.textMuted }}>Author</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: F_SIZE.sm, color: BRAND.textMuted }}>
              <Calendar size={16} />
              {new Date(blog.publishedAt || blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </div>

            {blog.readTime && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: F_SIZE.sm, color: BRAND.textMuted }}>
                <Clock size={16} />
                {blog.readTime} min read
              </div>
            )}

            <button
              onClick={handleShare}
              style={{
                marginLeft: 'auto',
                padding: '8px 16px',
                background: BRAND.primary,
                color: BRAND.white,
                border: 'none',
                borderRadius: 8,
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: F_SIZE.sm,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <Share2 size={16} /> Share
            </button>
          </div>
        </motion.div>

        {/* Excerpt */}
        {blog.excerpt && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{
              fontSize: F_SIZE.md,
              color: BRAND.textMuted,
              lineHeight: 1.6,
              margin: '24px 0',
              fontStyle: 'italic',
              padding: '16px 0',
              borderLeft: `3px solid ${BRAND.primary}`,
              paddingLeft: 20,
            }}
          >
            {blog.excerpt}
          </motion.p>
        )}

        {/* Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          style={{
            fontSize: F_SIZE.md,
            lineHeight: 1.8,
            color: BRAND.text,
            marginTop: 32,
          }}
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        {/* Image Gallery / Carousel */}
        {blog.images && blog.images.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ marginTop: 48, marginBottom: 48 }}
          >
            <h3 style={{ fontSize: F_SIZE.md, fontWeight: 900, color: BRAND.text, marginBottom: 20 }}>
              Gallery
            </h3>
            <ImageCarousel images={blog.images} />
          </motion.div>
        )}

        {/* Related Blogs */}
        {blog.relatedBlogs && blog.relatedBlogs.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ marginTop: 48, paddingTop: 48, borderTop: `1px solid ${BRAND.border}` }}
          >
            <h3 style={{ fontSize: F_SIZE.md, fontWeight: 900, color: BRAND.text, marginBottom: 24 }}>
              Related Articles
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20 }}>
              {blog.relatedBlogs.map((relatedBlog) => (
                <Link key={relatedBlog.id} href={`/blog/${relatedBlog.slug}`}>
                  <motion.div
                    whileHover={{ y: -4 }}
                    style={{
                      borderRadius: 16,
                      overflow: 'hidden',
                      border: `1px solid ${BRAND.border}`,
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', overflow: 'hidden' }}>
                      {relatedBlog.featuredImage ? (
                        <Image
                          src={relatedBlog.featuredImage}
                          alt={relatedBlog.title}
                          fill
                          style={{ objectFit: 'cover' }}
                        />
                      ) : (
                        <div style={{ width: '100%', height: '100%', background: BRAND.light }} />
                      )}
                    </div>
                    <div style={{ padding: 16 }}>
                      <h4 style={{ fontSize: F_SIZE.sm, fontWeight: 900, color: BRAND.text, margin: 0 }}>
                        {relatedBlog.title}
                      </h4>
                      <p style={{ fontSize: F_SIZE.sm, color: BRAND.textMuted, margin: '8px 0 0', lineHeight: 1.4 }}>
                        {relatedBlog.excerpt}
                      </p>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.section>
        )}
      </article>

      {/* Comments Section */}
      <CommentsSection blogId={blog.id} comments={blog.comments || []} />
    </div>
  );
}
