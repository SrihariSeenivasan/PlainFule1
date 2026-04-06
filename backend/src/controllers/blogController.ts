import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

// Initialize S3 client (same as uploadController)
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'ap-south-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

const BUCKET_NAME = process.env.AWS_BUCKET_NAME || '';
const S3_BASE_URL = process.env.AWS_S3_BASE_URL || `https://${BUCKET_NAME}.s3.amazonaws.com`;

// ── HELPER FUNCTIONS ──

// Calculate read time based on word count (average 200 words per minute)
const calculateReadTime = (content: string): number => {
  const wordCount = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / 200));
};

// Generate slug from title
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

// Upload image to S3
const uploadToS3 = async (file: Express.Multer.File, folder: string = 'blogs'): Promise<string> => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).slice(2);
  const ext = file.originalname.split('.').pop()?.toLowerCase() || 'jpg';
  const filename = `${folder}/${timestamp}-${random}.${ext}`;

  await s3Client.send(
    new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: filename,
      Body: file.buffer,
      ContentType: file.mimetype || 'application/octet-stream',
      CacheControl: 'max-age=31536000',
    })
  );

  return `${S3_BASE_URL}/${filename}`;
};

// Delete file from S3
const deleteFromS3 = async (url: string): Promise<void> => {
  try {
    const key = url.replace(S3_BASE_URL + '/', '');
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
      })
    );
  } catch (err) {
    console.error('Error deleting from S3:', err);
  }
};

// ── PUBLIC API ENDPOINTS ──

// Get all published blogs with pagination
export const getBlogs = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 6;
    const tag = req.query.tag as string;
    const search = req.query.search as string;

    const skip = (page - 1) * limit;

    // Build filter
    const where: Prisma.BlogWhereInput = { status: 'PUBLISHED', publishedAt: { lte: new Date() } };

    if (tag) {
      where.tags = { some: { slug: tag } };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [blogs, total] = await Promise.all([
      prisma.blog.findMany({
        where,
        include: {
          tags: true,
          creator: { select: { id: true, firstName: true, lastName: true, email: true } },
          images: { orderBy: { order: 'asc' } },
        },
        orderBy: { publishedAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.blog.count({ where }),
    ]);

    res.json({
      data: blogs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch {
    throw new AppError(500, 'Failed to fetch blogs');
  }
};

// Get single blog by slug (for detail page)
export const getBlogBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const blog = await prisma.blog.findUnique({
      where: { slug },
      include: {
        tags: true,
        creator: { select: { id: true, firstName: true, lastName: true, email: true } },
        images: { orderBy: { order: 'asc' } },
        comments: {
          where: { isApproved: true, parentCommentId: null },
          include: {
            user: { select: { id: true, firstName: true, lastName: true, email: true } },
            replies: {
              where: { isApproved: true },
              include: { user: { select: { id: true, firstName: true, lastName: true, email: true } } },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        relatedBlogs: {
          take: 3,
          include: {
            tags: true,
            creator: { select: { firstName: true, lastName: true } },
          },
        },
      },
    });

    if (!blog || blog.status !== 'PUBLISHED') {
      throw new AppError(404, 'Blog not found');
    }

    res.json(blog);
  } catch (err) {
    if (err instanceof AppError) throw err;
    throw new AppError(500, 'Failed to fetch blog');
  }
};

// ── ADMIN API ENDPOINTS ──

// Create new blog
export const createBlog = async (req: Request, res: Response) => {
  try {
    const { title, excerpt, content, tags, scheduledAt, status, metaTitle, metaDescription, metaKeywords } = req.body;
    const userId = (req as unknown as { user?: { id: number } }).user?.id;

    if (!userId) {
      throw new AppError(401, 'Unauthorized');
    }

    if (!title || !content) {
      throw new AppError(400, 'Title and content are required');
    }

    // Parse tags if it's a JSON string
    let parsedTags: number[] = [];
    if (tags) {
      try {
        parsedTags = typeof tags === 'string' ? JSON.parse(tags) : tags;
      } catch {
        parsedTags = [];
      }
    }

    let slug = generateSlug(title);
    
    // Check if slug exists
    const existingCount = await prisma.blog.count({ where: { slug } });
    if (existingCount > 0) {
      slug = `${slug}-${Date.now()}`;
    }

    const readTime = calculateReadTime(content);
    let featuredImage = '';

    // Upload featured image if provided
    if (req.files && 'featuredImage' in req.files && req.files.featuredImage) {
      const files = Array.isArray(req.files.featuredImage)
        ? req.files.featuredImage
        : [req.files.featuredImage];
      featuredImage = await uploadToS3(files[0], 'blogs/featured');
    }

    const blog = await prisma.blog.create({
      data: {
        title,
        slug,
        excerpt: excerpt || content.substring(0, 150),
        content,
        readTime,
        featuredImage,
        metaTitle: metaTitle || title,
        metaDescription: metaDescription || excerpt || content.substring(0, 150),
        metaKeywords: metaKeywords || '',
        createdBy: userId,
        status: status || 'DRAFT',
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        publishedAt: status === 'PUBLISHED' ? new Date() : null,
        tags: {
          connect: parsedTags.map((tagId: number) => ({ id: tagId })) || [],
        },
      },
      include: { tags: true, creator: true, images: true },
    });

    // Upload and add carousel images if provided
    if (req.files && 'images' in req.files && req.files.images) {
      const imageFiles = Array.isArray(req.files.images)
        ? req.files.images
        : [req.files.images];

      for (let i = 0; i < imageFiles.length; i++) {
        const imageUrl = await uploadToS3(imageFiles[i], 'blogs/carousel');
        await prisma.blogImage.create({
          data: {
            url: imageUrl,
            altText: `Blog image ${i + 1}`,
            caption: imageFiles[i].originalname,
            order: i,
            blogId: blog.id,
          },
        });
      }
    }

    res.status(201).json(blog);
  } catch (err) {
    if (err instanceof AppError) throw err;
    console.error('Blog creation error:', err);
    throw new AppError(500, `Failed to create blog: ${err instanceof Error ? err.message : 'Unknown error'}`);
  }
};

// Update blog
export const updateBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, excerpt, content, tags, status, scheduledAt, metaTitle, metaDescription, metaKeywords } = req.body;
    const userId = (req as unknown as { user?: { id: number } }).user?.id;

    const blog = await prisma.blog.findUnique({ where: { id: parseInt(id) } });

    if (!blog) {
      throw new AppError(404, 'Blog not found');
    }

    if (blog.createdBy !== userId) {
      throw new AppError(403, 'Not authorized to update this blog');
    }

    // Parse tags if it's a JSON string
    let parsedTags: number[] | undefined;
    if (tags) {
      try {
        parsedTags = typeof tags === 'string' ? JSON.parse(tags) : tags;
      } catch {
        parsedTags = [];
      }
    }

    let slug = blog.slug;
    if (title && title !== blog.title) {
      slug = generateSlug(title);
      const existingCount = await prisma.blog.count({
        where: { slug, id: { not: blog.id } },
      });
      if (existingCount > 0) {
        slug = `${slug}-${Date.now()}`;
      }
    }

    let readTime = blog.readTime;
    if (content) {
      readTime = calculateReadTime(content);
    }

    let featuredImage = blog.featuredImage;
    if (req.files && 'featuredImage' in req.files && req.files.featuredImage) {
      if (blog.featuredImage) {
        await deleteFromS3(blog.featuredImage);
      }
      const files = Array.isArray(req.files.featuredImage)
        ? req.files.featuredImage
        : [req.files.featuredImage];
      featuredImage = await uploadToS3(files[0], 'blogs/featured');
    }

    const updatedBlog = await prisma.blog.update({
      where: { id: parseInt(id) },
      data: {
        title: title || blog.title,
        slug,
        excerpt: excerpt !== undefined ? excerpt : blog.excerpt,
        content: content || blog.content,
        readTime,
        featuredImage,
        metaTitle: metaTitle || blog.metaTitle,
        metaDescription: metaDescription || blog.metaDescription,
        metaKeywords: metaKeywords || blog.metaKeywords,
        status: status || blog.status,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : blog.scheduledAt,
        publishedAt:
          status === 'PUBLISHED' && !blog.publishedAt
            ? new Date()
            : blog.publishedAt,
        tags: parsedTags
          ? {
              set: [],
              connect: parsedTags.map((tagId) => ({ id: tagId })),
            }
          : undefined,
      },
      include: { tags: true, creator: true, images: true },
    });

    // Update carousel images if provided
    if (req.files && 'images' in req.files && req.files.images) {
      // Delete old images
      const oldImages = await prisma.blogImage.findMany({
        where: { blogId: parseInt(id) },
      });

      for (const oldImage of oldImages) {
        await deleteFromS3(oldImage.url);
      }

      await prisma.blogImage.deleteMany({ where: { blogId: parseInt(id) } });

      // Upload new images
      const imageFiles = Array.isArray(req.files.images)
        ? req.files.images
        : [req.files.images];

      for (let i = 0; i < imageFiles.length; i++) {
        const imageUrl = await uploadToS3(imageFiles[i], 'blogs/carousel');
        await prisma.blogImage.create({
          data: {
            url: imageUrl,
            altText: `Blog image ${i + 1}`,
            caption: imageFiles[i].originalname,
            order: i,
            blogId: parseInt(id),
          },
        });
      }
    }

    res.json(updatedBlog);
  } catch (err) {
    if (err instanceof AppError) throw err;
    console.error('Blog update error:', err);
    throw new AppError(500, `Failed to update blog: ${err instanceof Error ? err.message : 'Unknown error'}`);
  }
};

// Delete blog
export const deleteBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as unknown as { user?: { id: number } }).user?.id;

    const blog = await prisma.blog.findUnique({
      where: { id: parseInt(id) },
      include: { images: true },
    });

    if (!blog) {
      throw new AppError(404, 'Blog not found');
    }

    if (blog.createdBy !== userId) {
      throw new AppError(403, 'Not authorized to delete this blog');
    }

    // Delete images from S3
    if (blog.featuredImage) {
      await deleteFromS3(blog.featuredImage);
    }

    for (const image of blog.images) {
      await deleteFromS3(image.url);
    }

    await prisma.blog.delete({ where: { id: parseInt(id) } });

    res.json({ message: 'Blog deleted successfully' });
  } catch (_) {
    if (_ instanceof AppError) throw _;
    throw new AppError(500, 'Failed to delete blog');
  }
};

// Get admin blogs (draft + published)
export const getAdminBlogs = async (req: Request, res: Response) => {
  try {
    const userId = (req as unknown as { user?: { id: number } }).user?.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as string;

    const skip = (page - 1) * limit;

    const where: Prisma.BlogWhereInput = { createdBy: userId };
    if (status) {
      where.status = status as unknown as Prisma.BlogWhereUniqueInput['status'];
    }

    const [blogs, total] = await Promise.all([
      prisma.blog.findMany({
        where,
        include: {
          tags: true,
          creator: { select: { id: true, firstName: true, lastName: true, email: true } },
          comments: {
            include: {
              user: { select: { id: true, firstName: true, lastName: true, email: true } },
              replies: {
                include: { user: { select: { id: true, firstName: true, lastName: true, email: true } } },
              },
            },
            orderBy: { createdAt: 'desc' },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.blog.count({ where }),
    ]);

    res.json({
      data: blogs,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch {
    throw new AppError(500, 'Failed to fetch blogs');
  }
};

// ── TAGS MANAGEMENT ──

// Get all tags
export const getTags = async (req: Request, res: Response) => {
  try {
    const tags = await prisma.blogTag.findMany({
      include: { _count: { select: { blogs: true } } },
    });
    res.json(tags);
  } catch {
    throw new AppError(500, 'Failed to fetch tags');
  }
};

// Create tag
export const createTag = async (req: Request, res: Response) => {
  try {
    const { name, color } = req.body;

    if (!name) {
      throw new AppError(400, 'Tag name is required');
    }

    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');

    const tag = await prisma.blogTag.create({
      data: { name, slug, color },
    });

    res.status(201).json(tag);
  } catch (err: unknown) {
    if (err instanceof AppError) throw err;
    throw new AppError(500, 'Failed to create tag');
  }
};

// ── COMMENTS ENDPOINTS ──

// Add comment to blog
export const addBlogComment = async (req: Request, res: Response) => {
  try {
    const { blogId } = req.params;
    const { content, parentCommentId } = req.body;
    const userId = (req as unknown as { user?: { id: number } }).user?.id;

    console.log('Add comment request:', {
      blogId,
      content,
      userId,
      user: (req as unknown as { user?: { id: number; firstName?: string; lastName?: string; email?: string } }).user,
      parentCommentId,
    });

    if (!userId) {
      throw new AppError(401, 'Unauthorized');
    }

    if (!content || !content.trim()) {
      throw new AppError(400, 'Comment content cannot be empty');
    }

    // Verify blog exists
    const blog = await prisma.blog.findUnique({ where: { id: parseInt(blogId) } });
    if (!blog) {
      throw new AppError(404, 'Blog not found');
    }

    const comment = await prisma.blogComment.create({
      data: {
        content,
        blogId: parseInt(blogId),
        userId,
        parentCommentId: parentCommentId ? parseInt(parentCommentId) : null,
      },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
    });

    res.status(201).json(comment);
  } catch (err) {
    if (err instanceof AppError) throw err;
    console.error('Add comment error:', {
      message: err instanceof Error ? err.message : 'Unknown error',
      code: (err as unknown as { code?: string }).code,
      stack: err instanceof Error ? err.stack : undefined,
      fullError: err
    });
    throw new AppError(500, `Failed to add comment: ${err instanceof Error ? err.message : 'Unknown error'}`);
  }
};

// Delete comment (by owner or admin)
export const deleteBlogComment = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;
    const userId = (req as unknown as { user?: { id: number } }).user?.id;

    const comment = await prisma.blogComment.findUnique({
      where: { id: parseInt(commentId) },
    });

    if (!comment) {
      throw new AppError(404, 'Comment not found');
    }

    if (comment.userId !== userId) {
      throw new AppError(403, 'Not authorized to delete this comment');
    }

    await prisma.blogComment.delete({ where: { id: parseInt(commentId) } });

    res.json({ message: 'Comment deleted' });
  } catch (err) {
    if (err instanceof AppError) throw err;
    console.error('Delete comment error:', {
      message: err instanceof Error ? err.message : 'Unknown error',
      code: (err as unknown as { code?: string }).code,
      stack: err instanceof Error ? err.stack : undefined,
    });
    throw new AppError(500, 'Failed to delete comment');
  }
};
