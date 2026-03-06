import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const MAX_FILES = 5;
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'products');

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll('images') as File[];

    if (!files.length) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }
    if (files.length > MAX_FILES) {
      return NextResponse.json({ error: `Maximum ${MAX_FILES} images allowed` }, { status: 400 });
    }

    await mkdir(UPLOAD_DIR, { recursive: true });

    const urls: string[] = [];

    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: `File "${file.name}" exceeds the 10 MB limit` },
          { status: 400 }
        );
      }

      const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
      if (!['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext)) {
        return NextResponse.json(
          { error: `File type ".${ext}" is not allowed` },
          { status: 400 }
        );
      }

      const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const dest = path.join(UPLOAD_DIR, filename);

      const buffer = Buffer.from(await file.arrayBuffer());
      await writeFile(dest, buffer);

      urls.push(`/uploads/products/${filename}`);
    }

    return NextResponse.json({ urls });
  } catch (err) {
    console.error('Upload error:', err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
