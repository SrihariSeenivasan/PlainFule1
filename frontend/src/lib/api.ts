const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: 'USER' | 'ADMIN';
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface Order {
  id: number;
  orderNumber: string;
  totalAmount: number;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  shippingAddress: string;
  items: OrderItem[];
  createdAt: string;
}

export interface OrderItem {
  id: number;
  productId: number;
  quantity: number;
  price: number;
  name: string;
  imageUrl: string;
}

export interface ProductNutrient {
  label: string;
  friendly?: string;
  emoji?: string;
  amount?: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  color: string;
  image: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  // Pricing
  subscribePrice?: number;
  origPrice?: number;
  // Display info
  tag?: string;
  duration?: string;
  subtitle?: string;
  rating?: number;
  reviews?: number;
  // Marketing copy
  headline?: string;
  accentWord?: string;
  grayWord?: string;
  persuade?: string;
  tagline?: string;
  highlight?: string;
  savePct?: string;
  // JSON arrays
  benefits?: string[];
  badges?: string[];
  variants?: ProductVariant[];
  nutrients?: ProductNutrient[];
  images?: string[];
}

export interface AuthResponse {
  message: string;
  token: string;
  user: Omit<User, 'password'>;
}

// Helper function for API requests
async function apiRequest<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (typeof options.headers === 'object' && options.headers !== null) {
    Object.assign(headers, options.headers);
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'API request failed');
  }

  return response.json();
}

// Auth APIs
export const authAPI = {
  register: (data: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    phone: string;
  }): Promise<AuthResponse> => apiRequest<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  login: (email: string, password: string): Promise<AuthResponse> =>
    apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  googleAuth: (token: string, email: string, name: string, picture?: string): Promise<AuthResponse> =>
    apiRequest<AuthResponse>('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ token, email, name, picture }),
    }),

  getCurrentUser: (): Promise<User> => apiRequest<User>('/auth/me'),
};

// User APIs
export const userAPI = {
  getProfile: () => apiRequest('/user/profile'),

  updateProfile: (data: Partial<User>) =>
    apiRequest('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  getOrders: () => apiRequest('/user/orders'),

  getOrderById: (id: number) => apiRequest(`/user/orders/${id}`),
};

// Order APIs
export const orderAPI = {
  createOrder: (data: {
    items: Array<{ product_id: number; quantity: number; price: number }>;
    shipping_address: string;
  }) =>
    apiRequest('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getOrders: () => apiRequest('/orders'),

  getOrderById: (id: number) => apiRequest(`/orders/${id}`),

  updatePayment: (orderId: number, data: { status: string; transaction_id?: string }) =>
    apiRequest(`/orders/${orderId}/payment`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

// Admin APIs
export const adminAPI = {
  getDashboard: () => apiRequest('/admin/dashboard'),

  getUsers: () => apiRequest('/admin/users'),

  getOrders: (status?: string) =>
    apiRequest(`/admin/orders${status ? `?status=${status}` : ''}`),

  updateOrderStatus: (id: number, data: { status: string; shipping_address?: string }) =>
    apiRequest(`/admin/orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  getProducts: () => apiRequest('/admin/products'),

  createProduct: (data: Partial<Product>) =>
    apiRequest('/admin/products', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateProduct: (id: number, data: Partial<Product>) =>
    apiRequest(`/admin/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteProduct: (id: number) =>
    apiRequest(`/admin/products/${id}`, {
      method: 'DELETE',
    }),
};
