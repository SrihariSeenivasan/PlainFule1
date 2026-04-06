'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Trash2, User } from 'lucide-react';
import { BRAND, F_SIZE } from '@/lib/typography';
import { BlogComment, addBlogComment, deleteBlogComment } from '@/lib/blogApi';
import { useAuth } from '@/lib/auth-context';

interface CommentsSectionProps {
  blogId: number;
  comments: BlogComment[];
}

export default function CommentsSection({ blogId, comments: initialComments }: CommentsSectionProps) {
  const [comments, setComments] = useState<BlogComment[]>(initialComments);
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const { token: authToken, user } = useAuth();

  const handleSubmitComment = async () => {
    if (!authToken) {
      setError('Please log in to comment');
      return;
    }

    if (!commentText.trim()) {
      setError('Comment cannot be empty');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const newComment = await addBlogComment(
        blogId,
        commentText,
        authToken,
        replyingTo || undefined
      );

      if (replyingTo) {
        // Add reply to parent comment
        setComments(comments.map(c => 
          c.id === replyingTo 
            ? { ...c, replies: [...(c.replies || []), newComment] }
            : c
        ));
      } else {
        // Add as top-level comment
        setComments([newComment, ...comments]);
      }

      setCommentText('');
      setReplyingTo(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to post comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!authToken) return;

    try {
      await deleteBlogComment(commentId, authToken);
      setComments(comments.filter(c => c.id !== commentId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete comment');
    }
  };

  const CommentItem = ({ comment, isReply }: { comment: BlogComment; isReply?: boolean }) => {
    const isAuthor = user?.email === comment.user.email;

    return (
      <motion.div
        key={comment.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        style={{
          marginBottom: 16,
          paddingLeft: isReply ? 40 : 0,
        }}
      >
        <div style={{
          background: BRAND.light,
          borderRadius: 12,
          padding: 16,
          borderLeft: `3px solid ${BRAND.primary}`,
        }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: BRAND.secondary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: BRAND.white,
              }}>
                <User size={18} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: F_SIZE.sm, color: BRAND.text }}>
                  {comment.user.firstName} {comment.user.lastName}
                </div>
                <div style={{ fontSize: F_SIZE.sm, color: BRAND.textMuted }}>
                  {new Date(comment.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>

            {isAuthor && (
              <button
                onClick={() => handleDeleteComment(comment.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: BRAND.textMuted,
                  padding: 4,
                }}
                title="Delete comment"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>

          {/* Content */}
          <p style={{ fontSize: F_SIZE.sm, color: BRAND.text, margin: 0, lineHeight: 1.6 }}>
            {comment.content}
          </p>

          {/* Reply Button */}
          {!isReply && authToken && (
            <button
              onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
              style={{
                marginTop: 12,
                background: 'none',
                border: 'none',
                color: BRAND.primary,
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: F_SIZE.sm,
              }}
            >
              {replyingTo === comment.id ? 'Cancel' : 'Reply'}
            </button>
          )}
        </div>

        {/* Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div style={{ marginTop: 12 }}>
            {comment.replies.map(reply => (
              <CommentItem key={reply.id} comment={reply} isReply />
            ))}
          </div>
        )}

        {/* Reply Form */}
        {replyingTo === comment.id && authToken && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ marginTop: 12, paddingLeft: 40 }}
          >
            <div style={{ display: 'flex', gap: 12 }}>
              <input
                type="text"
                placeholder="Write a reply..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  border: `1px solid ${BRAND.border}`,
                  borderRadius: 8,
                  fontSize: F_SIZE.sm,
                  outline: 'none',
                }}
              />
              <button
                onClick={handleSubmitComment}
                disabled={isSubmitting}
                style={{
                  padding: '10px 14px',
                  background: BRAND.primary,
                  color: BRAND.white,
                  border: 'none',
                  borderRadius: 8,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  fontWeight: 700,
                  opacity: isSubmitting ? 0.7 : 1,
                }}
              >
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    );
  };

  return (
    <section style={{
      maxWidth: 900,
      margin: '0 auto',
      padding: 'clamp(30px, 8vw, 60px) 20px',
      borderTop: `1px solid ${BRAND.border}`,
    }}>
      <h2 style={{ fontSize: F_SIZE.lg, fontWeight: 900, color: BRAND.text, marginBottom: 24 }}>
        Comments ({comments.length})
      </h2>

      {/* Comment Form */}
      {authToken ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginBottom: 32 }}>
          <div style={{ background: BRAND.light, padding: 20, borderRadius: 16 }}>
            <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
              <div style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: BRAND.secondary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: BRAND.white,
                flexShrink: 0,
              }}>
                <User size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: F_SIZE.sm, color: BRAND.text }}>
                  {user?.firstName} {user?.lastName}
                </div>
              </div>
            </div>

            <textarea
              placeholder="Share your thoughts..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              style={{
                width: '100%',
                minHeight: 100,
                padding: 12,
                border: `1px solid ${BRAND.border}`,
                borderRadius: 8,
                fontSize: F_SIZE.sm,
                fontFamily: 'inherit',
                resize: 'vertical',
                outline: 'none',
              }}
            />

            {error && (
              <div style={{ color: '#c33', fontSize: F_SIZE.sm, margin: '10px 0' }}>
                {error}
              </div>
            )}

            <button
              onClick={handleSubmitComment}
              disabled={isSubmitting || !commentText.trim()}
              style={{
                marginTop: 12,
                padding: '10px 20px',
                background: BRAND.primary,
                color: BRAND.white,
                border: 'none',
                borderRadius: 8,
                cursor: isSubmitting || !commentText.trim() ? 'not-allowed' : 'pointer',
                fontWeight: 700,
                fontSize: F_SIZE.sm,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                opacity: isSubmitting || !commentText.trim() ? 0.7 : 1,
              }}
            >
              <Send size={16} /> Post Comment
            </button>
          </div>
        </motion.div>
      ) : (
        <div style={{
          background: BRAND.light,
          padding: 20,
          borderRadius: 16,
          textAlign: 'center',
          marginBottom: 32,
        }}>
          <p style={{ fontSize: F_SIZE.sm, color: BRAND.textMuted }}>
            Please log in to leave a comment
          </p>
        </div>
      )}

      {/* Comments List */}
      {comments.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <p style={{ fontSize: F_SIZE.md, color: BRAND.textMuted }}>
            No comments yet. Be the first to share!
          </p>
        </div>
      ) : (
        <div>
          {comments.map(comment => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>
      )}
    </section>
  );
}
