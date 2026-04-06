'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { X, Plus, Trash2, ChevronDown } from 'lucide-react';
import { createBlog, updateBlog, getBlogTags, BlogTag, Blog } from '@/lib/blogApi';
import { useAuth } from '@/lib/auth-context';

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

const inp = {
  width: '100%' as const,
  padding: '8px 11px' as const,
  borderRadius: 8,
  border: `1px solid ${ADMIN_THEME.border}`,
  background: ADMIN_THEME.bg,
  color: ADMIN_THEME.text,
  fontSize: 13,
  outline: 'none' as const,
  boxSizing: 'border-box' as const,
  fontFamily: "'DM Sans', sans-serif",
};

const lbl = {
  display: 'block' as const,
  fontSize: 11,
  fontWeight: 700,
  color: ADMIN_THEME.textMuted,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.06em',
  marginBottom: 5,
};

interface BlogEditorProps {
  blog?: Blog | null;
  onSave: (blog: Blog) => void;
  onCancel: () => void;
}

export default function BlogEditor({ blog, onSave, onCancel }: BlogEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  
  const [formData, setFormData] = useState({
    title: blog?.title || '',
    excerpt: blog?.excerpt || '',
    content: blog?.content || '',
    metaTitle: blog?.metaTitle || '',
    metaDescription: blog?.metaDescription || '',
    metaKeywords: blog?.metaKeywords || '',
    status: blog?.status || 'DRAFT',
    scheduledAt: blog?.scheduledAt ? new Date(blog.scheduledAt).toISOString().slice(0, 16) : '',
    tags: blog?.tags?.map(t => t.id) || [],
  });

  const [selectedTags, setSelectedTags] = useState<BlogTag[]>(blog?.tags || []);
  const [availableTags, setAvailableTags] = useState<BlogTag[]>([]);
  const [showTagDropdown, setShowTagDropdown] = useState(false);
  
  const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  const [featuredImagePreview, setFeaturedImagePreview] = useState(blog?.featuredImage || '');
  
  const [carouselImages, setCarouselImages] = useState<File[]>([]);
  const [carouselPreviews, setCarouselPreviews] = useState<string[]>(blog?.images?.map(img => img.url) || []);
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fontSize, setFontSize] = useState(16); // Default font size
  const [selectedColor, setSelectedColor] = useState(ADMIN_THEME.primary); // Selected color for text
  
  const { token: authToken } = useAuth();

  // Initialize editor content
  useEffect(() => {
    if (editorRef.current && formData.content) {
      editorRef.current.innerHTML = formData.content;
    }
  }, []);

  // Fetch available tags
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const tags = await getBlogTags();
        setAvailableTags(tags);
      } catch (err) {
        console.error('Failed to fetch tags:', err);
      }
    };
    fetchTags();
  }, []);


  // Handle featured image upload
  const handleFeaturedImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFeaturedImage(file);
      const reader = new FileReader();
      reader.onload = (ev) => {
        setFeaturedImagePreview(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle carousel images upload
  const handleCarouselImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setCarouselImages([...carouselImages, ...newFiles]);
      
      // Create previews for new files
      newFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = (ev) => {
          setCarouselPreviews(prev => [...prev, ev.target?.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  // Remove carousel image
  const removeCarouselImage = (index: number) => {
    setCarouselImages(carouselImages.filter((_, i) => i !== index));
    setCarouselPreviews(carouselPreviews.filter((_, i) => i !== index));
  };

  // Add tag
  const addTag = (tag: BlogTag) => {
    if (!selectedTags.find(t => t.id === tag.id)) {
      setSelectedTags([...selectedTags, tag]);
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag.id]
      }));
    }
    setShowTagDropdown(false);
  };

  // Remove tag
  const removeTag = (tagId: number) => {
    setSelectedTags(selectedTags.filter(t => t.id !== tagId));
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(id => id !== tagId)
    }));
  };

  // Apply text formatting
  const applyTextStyle = (command: string, value?: string) => {
    document.execCommand(command, false, value);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authToken) return;

    if (!formData.title || !editorRef.current?.innerHTML) {
      setError('Title and content are required');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const data = {
        title: formData.title,
        excerpt: formData.excerpt,
        content: editorRef.current.innerHTML,
        metaTitle: formData.metaTitle,
        metaDescription: formData.metaDescription,
        metaKeywords: formData.metaKeywords,
        status: formData.status as 'DRAFT' | 'PUBLISHED' | 'SCHEDULED',
        tags: formData.tags,
        scheduledAt: formData.scheduledAt,
        ...(featuredImage ? { featuredImage } : {}),
        ...(carouselImages.length > 0 ? { images: carouselImages } : {}),
      };

      let result: Blog;
      if (blog?.id) {
        result = await updateBlog(blog.id, data, authToken);
      } else {
        result = await createBlog(data, authToken);
      }

      onSave(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save blog');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: 20, background: ADMIN_THEME.bg, minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }}>
        <h2 style={{ fontSize: 24, fontWeight: 900, color: ADMIN_THEME.text, margin: 0 }}>
          {blog ? 'Edit Blog' : 'Create New Blog'}
        </h2>
        <button
          onClick={onCancel}
          style={{
            background: 'none',
            border: 'none',
            fontSize: 24,
            cursor: 'pointer',
            color: ADMIN_THEME.textMuted,
          }}
        >
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24, marginBottom: 24 }}>
          {/* Main Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Title */}
            <div>
              <label style={lbl}>Blog Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                style={inp}
                placeholder="Enter blog title"
              />
            </div>

            {/* Excerpt */}
            <div>
              <label style={lbl}>Excerpt (Summary)</label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                style={{
                  ...inp,
                  minHeight: 80,
                  resize: 'vertical' as const,
                }}
                placeholder="Enter a brief excerpt"
              />
            </div>

            {/* Rich Text Editor Toolbar */}
            <div>
              <label style={lbl}>Blog Content (Rich Text) *</label>

              {/* Toolbar */}
              <div style={{
                display: 'flex',
                gap: 12,
                padding: 12,
                background: ADMIN_THEME.bgLight,
                borderRadius: '8px 8px 0 0',
                borderBottom: `1px solid ${ADMIN_THEME.border}`,
                flexWrap: 'wrap',
                alignItems: 'center',
              }}>
                {/* Font Size */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <label style={{ ...lbl, marginBottom: 0 }}>Size:</label>
                  <select
                    value={fontSize}
                    onChange={(e) => {
                      setFontSize(Number(e.target.value));
                      applyTextStyle('fontSize', e.target.value);
                    }}
                    style={{
                      ...inp,
                      width: 80,
                      padding: '6px 10px',
                    }}
                  >
                    {[12, 14, 16, 18, 20, 24, 28, 32].map(size => (
                      <option key={size} value={size}>{size}px</option>
                    ))}
                  </select>
                </div>

                {/* Color Picker */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <label style={{ ...lbl, marginBottom: 0 }}>Color:</label>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    {['#ffffff', '#3b82f6', '#22c55e', '#f97316', '#d4a5a5', '#9ca3af', '#6366f1'].map(color => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => {
                          setSelectedColor(color);
                          applyTextStyle('foreColor', color);
                        }}
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: 4,
                          background: color,
                          border: selectedColor === color ? `2px solid ${ADMIN_THEME.primary}` : `1px solid ${ADMIN_THEME.border}`,
                          cursor: 'pointer',
                        }}
                        title={`Color: ${color}`}
                      />
                    ))}
                    {/* Custom Color Picker */}
                    <input
                      type="color"
                      value={selectedColor}
                      onChange={(e) => {
                        setSelectedColor(e.target.value);
                        applyTextStyle('foreColor', e.target.value);
                      }}
                      style={{
                        width: 30,
                        height: 24,
                        borderRadius: 4,
                        border: `1px solid ${ADMIN_THEME.border}`,
                        cursor: 'pointer',
                        padding: 2,
                      }}
                      title="Pick any custom color"
                    />
                  </div>
                </div>

                {/* Formatting buttons */}
                <div style={{ display: 'flex', gap: 6 }}>
                  <button
                    type="button"
                    onClick={() => applyTextStyle('bold')}
                    style={{
                      padding: '6px 10px',
                      background: ADMIN_THEME.bgLight,
                      border: `1px solid ${ADMIN_THEME.border}`,
                      borderRadius: 4,
                      cursor: 'pointer',
                      fontWeight: 900,
                      color: ADMIN_THEME.text,
                    }}
                    title="Bold"
                  >
                    B
                  </button>
                  <button
                    type="button"
                    onClick={() => applyTextStyle('italic')}
                    style={{
                      padding: '6px 10px',
                      background: ADMIN_THEME.bgLight,
                      border: `1px solid ${ADMIN_THEME.border}`,
                      borderRadius: 4,
                      cursor: 'pointer',
                      fontStyle: 'italic',
                      color: ADMIN_THEME.text,
                    }}
                    title="Italic"
                  >
                    I
                  </button>
                  <button
                    type="button"
                    onClick={() => applyTextStyle('underline')}
                    style={{
                      padding: '6px 10px',
                      background: ADMIN_THEME.bgLight,
                      border: `1px solid ${ADMIN_THEME.border}`,
                      borderRadius: 4,
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      color: ADMIN_THEME.text,
                    }}
                    title="Underline"
                  >
                    U
                  </button>
                  <button
                    type="button"
                    onClick={() => applyTextStyle('insertUnorderedList')}
                    style={{
                      padding: '6px 10px',
                      background: ADMIN_THEME.bgLight,
                      border: `1px solid ${ADMIN_THEME.border}`,
                      borderRadius: 4,
                      cursor: 'pointer',
                      color: ADMIN_THEME.text,
                    }}
                    title="Bullet List"
                  >
                    • List
                  </button>
                  <button
                    type="button"
                    onClick={() => applyTextStyle('createLink', prompt('Enter URL:') || 'https://')}
                    style={{
                      padding: '6px 10px',
                      background: ADMIN_THEME.bgLight,
                      border: `1px solid ${ADMIN_THEME.border}`,
                      borderRadius: 4,
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      color: ADMIN_THEME.primary,
                    }}
                    title="Link"
                  >
                    🔗 Link
                  </button>
                </div>
              </div>

              {/* Content Editor */}
              <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                onInput={(e) => {
                  const html = (e.currentTarget as HTMLDivElement).innerHTML;
                  setFormData(prev => ({ ...prev, content: html }));
                }}
                style={{
                  width: '100%',
                  minHeight: 400,
                  padding: 16,
                  border: `1px solid ${ADMIN_THEME.border}`,
                  borderRadius: '0 0 8px 8px',
                  fontSize: 14,
                  lineHeight: 1.6,
                  outline: 'none',
                  background: ADMIN_THEME.bg,
                  color: ADMIN_THEME.text,
                }}
              />
            </div>

            {/* Featured Image */}
            <div>
              <label style={lbl}>Featured Image</label>
              <div style={{
                borderRadius: 8,
                border: `2px dashed ${ADMIN_THEME.border}`,
                padding: 20,
                textAlign: 'center',
                cursor: 'pointer',
                background: ADMIN_THEME.bgLight,
              }}>
                {featuredImagePreview ? (
                  <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', borderRadius: 8, overflow: 'hidden', marginBottom: 12 }}>
                    <Image src={featuredImagePreview} alt="Featured" fill style={{ objectFit: 'cover' }} />
                  </div>
                ) : null}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFeaturedImageUpload}
                  style={{ display: 'none' }}
                  id="featured-image"
                />
                <label htmlFor="featured-image" style={{ cursor: 'pointer' }}>
                  <p style={{ color: ADMIN_THEME.text, fontWeight: 700, margin: '0 0 8px' }}>Click to upload featured image</p>
                  <p style={{ color: ADMIN_THEME.textMuted, fontSize: 12, margin: 0 }}>PNG, JPG, WEBP up to 10MB</p>
                </label>
              </div>
            </div>

            {/* Carousel Images */}
            <div>
              <label style={lbl}>Carousel Images (Multiple)</label>
              <div style={{
                borderRadius: 8,
                border: `2px dashed ${ADMIN_THEME.border}`,
                padding: 20,
                textAlign: 'center',
                marginBottom: 12,
                background: ADMIN_THEME.bgLight,
              }}>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleCarouselImagesUpload}
                  style={{ display: 'none' }}
                  id="carousel-images"
                />
                <label htmlFor="carousel-images" style={{ cursor: 'pointer' }}>
                  <p style={{ color: ADMIN_THEME.text, fontWeight: 700, margin: '0 0 8px' }}>Click to upload gallery images</p>
                  <p style={{ color: ADMIN_THEME.textMuted, fontSize: 12, margin: 0 }}>Up to 5 images</p>
                </label>
              </div>
              {carouselPreviews.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 12 }}>
                  {carouselPreviews.map((preview, idx) => (
                    <div key={idx} style={{ position: 'relative', aspectRatio: '1', borderRadius: 8, overflow: 'hidden' }}>
                      <Image src={preview} alt={`Preview ${idx}`} fill style={{ objectFit: 'cover' }} />
                      <button
                        type="button"
                        onClick={() => removeCarouselImage(idx)}
                        style={{
                          position: 'absolute',
                          top: 4,
                          right: 4,
                          background: 'rgba(0,0,0,0.6)',
                          color: 'white',
                          border: 'none',
                          borderRadius: 4,
                          width: 24,
                          height: 24,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* SEO Fields */}
            <div style={{ padding: 16, background: ADMIN_THEME.bgLight, borderRadius: 8 }}>
              <h4 style={{ fontSize: 14, fontWeight: 900, color: ADMIN_THEME.text, marginTop: 0 }}>SEO Settings</h4>
              
              <div style={{ marginBottom: 12 }}>
                <label style={{ ...lbl }}>Meta Title</label>
                <input
                  type="text"
                  value={formData.metaTitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, metaTitle: e.target.value }))}
                  style={inp}
                  placeholder="Page title for search engines"
                />
              </div>

              <div style={{ marginBottom: 12 }}>
                <label style={{ ...lbl }}>Meta Description</label>
                <textarea
                  value={formData.metaDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, metaDescription: e.target.value }))}
                  style={{
                    ...inp,
                    minHeight: 80,
                  }}
                  placeholder="Page description for search engines"
                />
              </div>

              <div>
                <label style={{ ...lbl }}>Keywords</label>
                <input
                  type="text"
                  value={formData.metaKeywords}
                  onChange={(e) => setFormData(prev => ({ ...prev, metaKeywords: e.target.value }))}
                  style={inp}
                  placeholder="Comma-separated keywords"
                />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Status */}
            <div>
              <label style={lbl}>Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'DRAFT' | 'PUBLISHED' | 'SCHEDULED' }))}
                style={inp}
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
                <option value="SCHEDULED">Scheduled</option>
              </select>
            </div>

            {/* Scheduled Date */}
            {formData.status === 'SCHEDULED' && (
              <div>
                <label style={lbl}>Schedule Date & Time</label>
                <input
                  type="datetime-local"
                  value={formData.scheduledAt}
                  onChange={(e) => setFormData(prev => ({ ...prev, scheduledAt: e.target.value }))}
                  style={inp}
                />
              </div>
            )}

            {/* Tags */}
            <div>
              <label style={lbl}>Tags/Categories</label>

              {/* Selected Tags */}
              <div style={{ marginBottom: 12, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {selectedTags.map(tag => (
                  <motion.div
                    key={tag.id}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '6px 12px',
                      background: `${tag.color || ADMIN_THEME.primary}33`,
                      color: tag.color || ADMIN_THEME.primary,
                      borderRadius: 20,
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    {tag.name}
                    <button
                      type="button"
                      onClick={() => removeTag(tag.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'inherit',
                      }}
                    >
                      <X size={14} />
                    </button>
                  </motion.div>
                ))}
              </div>

              {/* Tag Dropdown */}
              <div style={{ position: 'relative' }}>
                <button
                  type="button"
                  onClick={() => setShowTagDropdown(!showTagDropdown)}
                  style={{
                    ...inp,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  Add Tag
                  <ChevronDown size={16} />
                </button>

                {showTagDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      background: ADMIN_THEME.bg,
                      border: `1px solid ${ADMIN_THEME.border}`,
                      borderRadius: 6,
                      marginTop: 4,
                      maxHeight: 200,
                      overflowY: 'auto',
                      zIndex: 10,
                    }}
                  >
                    {availableTags
                      .filter(tag => !selectedTags.find(t => t.id === tag.id))
                      .map(tag => (
                        <button
                          key={tag.id}
                          type="button"
                          onClick={() => addTag(tag)}
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            border: 'none',
                            background: 'none',
                            textAlign: 'left' as const,
                            cursor: 'pointer',
                            fontSize: 12,
                            borderBottom: `1px solid ${ADMIN_THEME.border}`,
                            color: ADMIN_THEME.text,
                            transition: 'background 0.2s',
                          }}
                          onMouseEnter={(e) => {
                            (e.target as HTMLElement).style.background = ADMIN_THEME.bgLight;
                          }}
                          onMouseLeave={(e) => {
                            (e.target as HTMLElement).style.background = 'none';
                          }}
                        >
                          {tag.name}
                        </button>
                      ))}
                  </motion.div>
                )}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div style={{
                padding: 12,
                background: `${ADMIN_THEME.danger}22`,
                border: `1px solid ${ADMIN_THEME.danger}44`,
                borderRadius: 6,
                color: '#fca5a5',
                fontSize: 12,
              }}>
                {error}
              </div>
            )}

            {/* Submit Buttons */}
            <div style={{ display: 'flex', gap: 12, marginTop: 'auto' }}>
              <motion.button
                type="submit"
                disabled={submitting}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  flex: 1,
                  padding: 12,
                  background: ADMIN_THEME.primary,
                  color: 'white',
                  border: 'none',
                  borderRadius: 6,
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  fontWeight: 900,
                  fontSize: 13,
                  opacity: submitting ? 0.7 : 1,
                }}
              >
                {submitting ? 'Saving...' : 'Save Blog'}
              </motion.button>
              <button
                type="button"
                onClick={onCancel}
                style={{
                  flex: 1,
                  padding: 12,
                  background: ADMIN_THEME.bgLight,
                  color: ADMIN_THEME.text,
                  border: `1px solid ${ADMIN_THEME.border}`,
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: 13,
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
