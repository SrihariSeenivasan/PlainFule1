import { Router } from 'express';
import * as blogController from '../controllers/blogController';
import { authMiddleware } from '../middleware/auth';
import multer from 'multer';

const router = Router();

// Configure multer for image uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files allowed'));
    }
  },
});

// ── PUBLIC ROUTES ──

// Get all blogs (paginated)
router.get('/', blogController.getBlogs);

// Get single blog by slug
router.get('/blog/:slug', blogController.getBlogBySlug);

// Get all tags
router.get('/tags', blogController.getTags);

// Add comment (requires auth)
router.post('/blogs/:blogId/comments', authMiddleware, blogController.addBlogComment);

// Delete comment (requires auth)
router.delete('/comments/:commentId', authMiddleware, blogController.deleteBlogComment);

// ── ADMIN ROUTES ──

// Create blog (admin only)
router.post(
  '/',
  authMiddleware,
  upload.fields([
    { name: 'featuredImage', maxCount: 1 },
    { name: 'images', maxCount: 5 },
  ]),
  blogController.createBlog
);

// Get admin blogs
router.get('/admin/blogs', authMiddleware, blogController.getAdminBlogs);

// Update blog (admin only)
router.put(
  '/:id',
  authMiddleware,
  upload.fields([
    { name: 'featuredImage', maxCount: 1 },
    { name: 'images', maxCount: 5 },
  ]),
  blogController.updateBlog
);

// Delete blog (admin only)
router.delete('/:id', authMiddleware, blogController.deleteBlog);

// Create tag (admin only)
router.post('/tags', authMiddleware, blogController.createTag);

export default router;
