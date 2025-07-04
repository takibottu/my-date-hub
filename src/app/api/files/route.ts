import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const mediaDir = path.join(process.cwd(), 'public', 'media');
  
  try {
    const filenames = fs.readdirSync(mediaDir);
    const files = filenames.map(filename => {
      const filePath = path.join(mediaDir, filename);
      const stat = fs.statSync(filePath);
      return { filename, mtime: stat.mtime.getTime() };
    });

    const sortedFiles = files.sort((a, b) => b.mtime - a.mtime);

    return NextResponse.json(sortedFiles);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read media directory' }, { status: 500 });
  }
}
