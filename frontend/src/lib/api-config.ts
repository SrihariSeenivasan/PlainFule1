// API Configuration utility for frontend
export const getApiBaseUrl = (): string => {
  // In browser environment, use the backend URL from env variables
  if (typeof window !== 'undefined') {
    return (
      process.env.NEXT_PUBLIC_API_URL ||
      'http://localhost:5000/api'
    );
  }
  
  // Server-side fallback (shouldn't be used in client components)
  return process.env.API_URL || 'http://localhost:5000/api';
};

export const buildApiUrl = (path: string): string => {
  const baseUrl = getApiBaseUrl();
  // Remove leading slash if present to avoid double slashes
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
};
