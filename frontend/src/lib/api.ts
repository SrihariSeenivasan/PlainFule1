// Dynamically determine API URL based on current hostname
export const getApiUrl = () => {
  if (typeof window === 'undefined') {
    // Server-side: use default
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  }
  
  // Client-side: detect which domain we're on
  const hostname = window.location.hostname;
  
  if (hostname.includes('plainfuel.in')) {
    // Production domain
    return process.env.NEXT_PUBLIC_PRODUCTION_API_URL || 'https://app.plainfuel.in/api';
  }
  
  // Development/localhost
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
};

const API_URL = getApiUrl();

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
  deliveryDate?: string | null;
  items: OrderItem[];
  payment?: {
    id: number;
    amount: number;
    paymentMethod: string;
    status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
    transactionId?: string;
  };
  createdAt: string;
}

export interface OrderItem {
  id: number;
  productId: number;
  packageId?: string;
  quantity: number;
  price: number;
  name: string;
  imageUrl?: string;
  product?: { name: string };
  package?: { id: string; duration: string; pouches: number };
}

export type ReturnStatus = 'REQUESTED' | 'APPROVED' | 'REJECTED' | 'RECEIVED' | 'REFUNDED';

export interface ReturnItem {
  id: number;
  quantity: number;
  orderItemId: number;
  orderItem: OrderItem & { product: { name: string }; package?: { id: string; duration: string; pouches: number } };
}

export interface ReturnRequest {
  id: number;
  status: ReturnStatus;
  reason?: string;
  refundAmount?: number;
  orderId: number;
  userId: number;
  order: { id: number; orderNumber: string; totalAmount: number };
  items: ReturnItem[];
  createdAt: string;
  updatedAt: string;
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

export interface ProductPackage {
  id: string;
  duration: '7 days' | '15 days' | '30 days';
  daysCount: 7 | 15 | 30;
  pouches: number;
  price: number;
  origPrice?: number;
  savePct?: string;
  images?: string[];
  stock?: number;
  // Package-specific display details
  tag?: string;
  subtitle?: string;
  headline?: string;
  accentWord?: string;
  grayWord?: string;
  persuade?: string;
  tagline?: string;
  highlight?: string;
  benefits?: string[];
  badges?: string[];
  variants?: ProductVariant[];
  nutrients?: ProductNutrient[];
  // Database fields from Package model
  productId?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Product {
  id: number;
  // Common product details only
  name: string;
  description: string;
  category: string;
  // All display/pricing/marketing details are in packages
  packages?: ProductPackage[];
  // Auto-calculated from reviews
  rating?: number;
  reviews?: number;
}

export interface FAQ {
  id: number;
  question: string;
  answer: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
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

  forgotPassword: (email: string): Promise<{ message: string }> =>
    apiRequest<{ message: string }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  resetPassword: (token: string, newPassword: string, confirmPassword: string): Promise<{ message: string }> =>
    apiRequest<{ message: string }>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword, confirmPassword }),
    }),
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
    items: Array<{ productId: number; packageId: string; quantity: number }>;
    shippingAddress: string;
  }) =>
    apiRequest<{ message: string; order: Order; payment: Order['payment'] }>('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getOrders: () => apiRequest<Order[]>('/orders'),

  getOrderById: (id: number) => apiRequest<Order>(`/orders/${id}`),

  cancelOrder: (id: number) =>
    apiRequest<{ message: string }>(`/orders/${id}/cancel`, { method: 'POST' }),

  createReturnRequest: (orderId: number, data: {
    reason?: string;
    items: Array<{ orderItemId: number; quantity: number }>;
  }) =>
    apiRequest<{ message: string; returnRequest: ReturnRequest }>(`/orders/${orderId}/return`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getReturnRequests: () => apiRequest<ReturnRequest[]>('/orders/returns'),

  updatePayment: (orderId: number, data: { status: string; transaction_id?: string }) =>
    apiRequest(`/orders/${orderId}/payment`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

// Product APIs (public)
export const productAPI = {
  getAll: () => apiRequest('/products'),
  
  getById: (id: number) => apiRequest(`/products/${id}`),
  
  getByCategory: (category: string) => apiRequest(`/products/category/${category}`),
};

// Admin APIs
export const adminAPI = {
  getDashboard: () => apiRequest('/admin/dashboard'),

  getUsers: () => apiRequest('/admin/users'),

  getOrders: (status?: string) =>
    apiRequest<Order[]>(`/admin/orders${status ? `?status=${status}` : ''}`),

  updateOrderStatus: (id: number, data: { status: string; shippingAddress?: string }) =>
    apiRequest(`/admin/orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  getReturnRequests: (status?: string) =>
    apiRequest<ReturnRequest[]>(`/admin/returns${status ? `?status=${status}` : ''}`),

  updateReturnStatus: (id: number, status: string) =>
    apiRequest(`/admin/returns/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
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

// Cart APIs
export const cartAPI = {
  getCart: () => apiRequest('/cart'),

  addToCart: (data: {
    productId: number;
    packageId: string;
    quantity: number;
    price: number;
  }) =>
    apiRequest('/cart/items', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateCartItem: (itemId: number, quantity: number) =>
    apiRequest(`/cart/items/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    }),

  removeFromCart: (itemId: number) =>
    apiRequest(`/cart/items/${itemId}`, {
      method: 'DELETE',
    }),

  clearCart: () =>
    apiRequest('/cart', {
      method: 'DELETE',
    }),
};

// FAQ APIs
export const faqAPI = {
  getFAQs: () => apiRequest<FAQ[]>('/faqs'),

  getFAQById: (id: number) => apiRequest<FAQ>(`/faqs/${id}`),

  createFAQ: (data: { question: string; answer: string; category?: string }) =>
    apiRequest<FAQ>('/faqs', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateFAQ: (id: number, data: { question?: string; answer?: string; category?: string }) =>
    apiRequest<FAQ>(`/faqs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteFAQ: (id: number) =>
    apiRequest<{ message: string }>(`/faqs/${id}`, {
      method: 'DELETE',
    }),
};
