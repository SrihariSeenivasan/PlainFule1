import { getApiUrl } from './api';

const API_URL = getApiUrl();

export interface BlogTag {
  id: number;
  name: string;
  slug: string;
  color?: string;
}

export interface BlogImage {
  id: number;
  url: string;
  altText?: string;
  caption?: string;
  order: number;
}

export interface BlogCreator {
  id: number;
  firstName?: string;
  lastName?: string;
  email: string;
}

export interface BlogComment {
  id: number;
  content: string;
  createdAt: string;
  user: {
    firstName?: string;
    lastName?: string;
    email: string;
  };
  replies?: BlogComment[];
}

export interface Blog {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  readTime?: number;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'SCHEDULED';
  publishedAt?: string;
  scheduledAt?: string;
  featuredImage?: string;
  tags: BlogTag[];
  images: BlogImage[];
  creator: BlogCreator;
  comments?: BlogComment[];
  relatedBlogs?: Blog[];
  createdAt: string;
  updatedAt: string;
}

export interface BlogListResponse {
  data: Blog[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Public API - Get all blogs with pagination
export const getBlogs = async (
  page: number = 1,
  limit: number = 6,
  tag?: string,
  search?: string
): Promise<BlogListResponse> => {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('limit', limit.toString());
  if (tag) params.append('tag', tag);
  if (search) params.append('search', search);

  const response = await fetch(`${API_URL}/blogs?${params}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch blogs');
  }

  return response.json();
};

// Public API - Get single blog by slug
export const getBlogBySlug = async (slug: string): Promise<Blog> => {
  const response = await fetch(`${API_URL}/blogs/blog/${slug}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Blog not found');
  }

  return response.json();
};

// Public API - Get all tags
export const getBlogTags = async (): Promise<BlogTag[]> => {
  const response = await fetch(`${API_URL}/blogs/tags`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch tags');
  }

  return response.json();
};

// Auth required - Add comment
export const addBlogComment = async (
  blogId: number,
  content: string,
  token: string,
  parentCommentId?: number
): Promise<BlogComment> => {
  const response = await fetch(`${API_URL}/blogs/blogs/${blogId}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ content, parentCommentId }),
  });

  if (!response.ok) {
    throw new Error('Failed to add comment');
  }

  return response.json();
};

// Auth required - Delete comment
export const deleteBlogComment = async (
  commentId: number,
  token: string
): Promise<void> => {
  const response = await fetch(`${API_URL}/blogs/comments/${commentId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete comment');
  }
};

// Admin API - Get admin blogs
export const getAdminBlogs = async (
  token: string,
  page: number = 1,
  limit: number = 10,
  status?: string
): Promise<BlogListResponse> => {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('limit', limit.toString());
  if (status) params.append('status', status);

  const response = await fetch(`${API_URL}/blogs/admin/blogs?${params}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch admin blogs');
  }

  return response.json();
};

// Admin API - Create blog
export const createBlog = async (
  data: {
    title: string;
    excerpt?: string;
    content: string;
    tags?: number[];
    status?: string;
    scheduledAt?: string;
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string;
    featuredImage?: File;
    images?: File[];
  },
  token: string
): Promise<Blog> => {
  const formData = new FormData();
  formData.append('title', data.title);
  if (data.excerpt) formData.append('excerpt', data.excerpt);
  formData.append('content', data.content);
  if (data.tags) formData.append('tags', JSON.stringify(data.tags));
  if (data.status) formData.append('status', data.status);
  if (data.scheduledAt) formData.append('scheduledAt', data.scheduledAt);
  if (data.metaTitle) formData.append('metaTitle', data.metaTitle);
  if (data.metaDescription) formData.append('metaDescription', data.metaDescription);
  if (data.metaKeywords) formData.append('metaKeywords', data.metaKeywords);
  if (data.featuredImage) formData.append('featuredImage', data.featuredImage);
  if (data.images) {
    data.images.forEach((img, idx) => {
      formData.append(`images`, img);
    });
  }

  const response = await fetch(`${API_URL}/blogs`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create blog');
  }

  return response.json();
};

// Admin API - Update blog
export const updateBlog = async (
  id: number,
  data: {
    title?: string;
    excerpt?: string;
    content?: string;
    tags?: number[];
    status?: string;
    scheduledAt?: string;
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string;
    featuredImage?: File;
    images?: File[];
  },
  token: string
): Promise<Blog> => {
  const formData = new FormData();
  if (data.title) formData.append('title', data.title);
  if (data.excerpt) formData.append('excerpt', data.excerpt);
  if (data.content) formData.append('content', data.content);
  if (data.tags) formData.append('tags', JSON.stringify(data.tags));
  if (data.status) formData.append('status', data.status);
  if (data.scheduledAt) formData.append('scheduledAt', data.scheduledAt);
  if (data.metaTitle) formData.append('metaTitle', data.metaTitle);
  if (data.metaDescription) formData.append('metaDescription', data.metaDescription);
  if (data.metaKeywords) formData.append('metaKeywords', data.metaKeywords);
  if (data.featuredImage) formData.append('featuredImage', data.featuredImage);
  if (data.images) {
    data.images.forEach((img) => {
      formData.append(`images`, img);
    });
  }

  const response = await fetch(`${API_URL}/blogs/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to update blog');
  }

  return response.json();
};

// Admin API - Delete blog
export const deleteBlog = async (id: number, token: string): Promise<void> => {
  const response = await fetch(`${API_URL}/blogs/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete blog');
  }
};

// Admin API - Create tag
export const createBlogTag = async (
  data: { name: string; color?: string },
  token: string
): Promise<BlogTag> => {
  const response = await fetch(`${API_URL}/blogs/tags`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to create tag');
  }

  return response.json();
};
