export interface GoogleAuthResponse {
  token: string;
  email: string;
  name: string;
  picture?: string;
}

export const handleGoogleCallback = async (
  credentialResponse: { credential: string }
): Promise<GoogleAuthResponse> => {
  // For now, decode and use the JWT. In production, verify on backend.
  const token = credentialResponse.credential;
  
  // Parse JWT (without full verification for demo)
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('Invalid token format');
  
  try {
    const payload = JSON.parse(
      atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'))
    );
    
    return {
      token,
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
    };
  } catch {
    throw new Error('Failed to parse Google token');
  }
};

export const loadGoogleSDK = () => {
  if (typeof window === 'undefined') return;
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((window as any).google) return; // Already loaded
  
  const script = document.createElement('script');
  script.src = 'https://accounts.google.com/gsi/client';
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
};
