'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import MediaModal from '@/components/MediaModal';

interface MediaFile {
  filename: string;
  mtime: number;
}

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const category = params.category as string;

  const [files, setFiles] = useState<MediaFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  useEffect(() => {
    if (category) {
      const fetchFiles = async () => {
        const res = await fetch('/api/files');
        const data = await res.json();
        setFiles(data[category] || []);
      };

      fetchFiles();
    }
  }, [category]);

  const getFileIcon = (filename: string) => {
    const extension = filename.split('.').pop()?.toLowerCase();
    if (extension === 'url') {
      return '🔗';
    }
    if (['png', 'jpg', 'jpeg', 'gif'].includes(extension || '')) {
      return '🖼️';
    } else if (['mp4', 'webm', 'ogg'].includes(extension || '')) {
      return '🎥';
    } else if (['mp3', 'wav'].includes(extension || '')) {
      return '🎵';
    } else if (extension === 'pdf') {
      return '📄';
    } else {
      return '📝';
    }
  };

  const handleFileClick = async (file: MediaFile) => {
    const filePath = `${category}/${file.filename}`;
    if (file.filename.endsWith('.url')) {
      try {
        const res = await fetch(`/media/${filePath}`);
        const url = await res.text();
        window.open(url, '_blank');
      } catch (error) {
        console.error('Failed to read URL file:', error);
      }
    } else {
      setSelectedFile(filePath);
    }
  };

  const handleShare = (filename: string) => {
    const url = `${window.location.origin}/media/${category}/${filename}`;
    navigator.clipboard.writeText(url);
    alert(`Copied to clipboard: ${url}`);
  };

  return (
    <main className="container mx-auto p-4">
        <button onClick={() => router.back()} className="mb-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
            &larr; Back
        </button>
      <h1 className="text-4xl font-bold mb-8 text-center capitalize">{category}</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {files.map((file) => (
          <div 
            key={file.filename} 
            className="border rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:shadow-lg transition-shadow duration-200"
          >
            <div 
              className="text-5xl mb-2"
              onClick={() => handleFileClick(file)}
            >
              {getFileIcon(file.filename)}
            </div>
            <p 
              className="font-semibold text-center truncate w-full"
              onClick={() => handleFileClick(file)}
            >
              {file.filename}
            </p>
            <button 
              onClick={() => handleShare(file.filename)} 
              className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-xs"
            >
              Share
            </button>
          </div>
        ))}
      </div>
      {selectedFile && <MediaModal filename={selectedFile} onClose={() => setSelectedFile(null)} />}
    </main>
  );
}
