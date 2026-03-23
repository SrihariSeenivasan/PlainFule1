import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll('images') as File[];

    if (!files.length) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    // Determine backend URL based on environment
    let backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    
    // In production, use PRODUCTION_API_URL if available
    if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_PRODUCTION_API_URL) {
      backendUrl = process.env.NEXT_PUBLIC_PRODUCTION_API_URL;
    }
    
    // Forward the request to the backend
    const backendFormData = new FormData();
    for (const file of files) {
      backendFormData.append('images', file);
    }

    const response = await fetch(`${backendUrl}/upload`, {
      method: 'POST',
      body: backendFormData,
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || 'Upload failed' },
        { status: response.status }
      );
    }

    return NextResponse.json({ urls: data.urls });
  } catch (err) {
    console.error('Upload proxy error:', err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
