import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const mediaDir = path.join(process.cwd(), 'public', 'media');

const getFileCategory = (file: File) => {
  const mimeType = file.type;
  if (mimeType.startsWith('image/')) {
    return 'images';
  }
  if (mimeType.startsWith('video/')) {
    return 'videos';
  }
  if (mimeType.startsWith('audio/')) {
    return 'audio';
  }
  if (mimeType === 'application/pdf') {
    return 'pdfs';
  }
  return 'documents';
};

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as File | null;
  const url = formData.get('url') as string | null;

  if (file) {
    const category = getFileCategory(file);
    const categoryDir = path.join(mediaDir, category);

    if (!fs.existsSync(categoryDir)) {
      fs.mkdirSync(categoryDir, { recursive: true });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = path.join(categoryDir, file.name);

    try {
      fs.writeFileSync(filePath, buffer);
      return NextResponse.json({ success: true });
    } catch (error) {
      return NextResponse.json({ error: 'Failed to save file' }, { status: 500 });
    }
  } else if (url) {
    const bookmarksDir = path.join(mediaDir, 'bookmarks');

    if (!fs.existsSync(bookmarksDir)) {
      fs.mkdirSync(bookmarksDir, { recursive: true });
    }

    try {
      const urlObject = new URL(url);
      const filename = `${urlObject.hostname.replace(/\./g, '_')}_${Date.now()}.url`;
      const filePath = path.join(bookmarksDir, filename);
      fs.writeFileSync(filePath, url);
      return NextResponse.json({ success: true });
    } catch (error) {
      return NextResponse.json({ error: 'Invalid URL or failed to save bookmark' }, { status: 500 });
    }
  } else {
    return NextResponse.json({ error: 'No file or URL provided' }, { status: 400 });
  }
}


export async function GET() {
  const mediaDir = path.join(process.cwd(), 'public', 'media');

  try {
    const categories = fs.readdirSync(mediaDir).filter(item => {
        const itemPath = path.join(mediaDir, item);
        // Ensure it's a directory and not a file like .DS_Store
        return fs.statSync(itemPath).isDirectory();
    });

    const filesByCategory = categories.reduce((acc, category) => {
      const categoryPath = path.join(mediaDir, category);
      const files = fs.readdirSync(categoryPath).map(filename => {
        const filePath = path.join(categoryPath, filename);
        const stat = fs.statSync(filePath);
        return { filename, mtime: stat.mtime.getTime() };
      });
      acc[category] = files.sort((a, b) => b.mtime - a.mtime);
      return acc;
    }, {} as Record<string, {filename: string, mtime: number}[]>);

    return NextResponse.json(filesByCategory);
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
        // If the media directory itself doesn't exist, return empty
        return NextResponse.json({});
    }
    return NextResponse.json({ error: 'Failed to read media directory' }, { status: 500 });
  }
}
