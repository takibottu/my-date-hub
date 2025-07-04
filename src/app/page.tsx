'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface FilesByCategory {
  [key: string]: { filename: string; mtime: number }[];
}

export default function Home() {
  const [filesByCategory, setFilesByCategory] = useState<FilesByCategory>({});
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  const fetchFiles = async () => {
    const res = await fetch('/api/files');
    const data = await res.json();
    setFilesByCategory(data);
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/files', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        // Refresh file list
        fetchFiles();
      } else {
        console.error('File upload failed');
      }
    } catch (error) {
      console.error('File upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'images':
        return '🖼️';
      case 'videos':
        return '🎥';
      case 'audio':
        return '🎵';
      case 'pdfs':
        return '📄';
      case 'documents':
        return '📝';
      default:
        return '📁';
    }
  };

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8 text-center">Personal Media Hub</h1>
      
      <div className="mb-8 text-center">
        <input
          type="file"
          id="file-upload"
          className="hidden"
          onChange={handleFileUpload}
          disabled={uploading}
        />
        <label
          htmlFor="file-upload"
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
          {uploading ? 'Uploading...' : 'Upload File'}
        </label>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {Object.keys(filesByCategory).map((category) => (
          <div 
            key={category} 
            className="border rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:shadow-lg transition-shadow duration-200"
            onClick={() => router.push(`/view/${category}`)}
          >
            <div className="text-5xl mb-2">
              {getCategoryIcon(category)}
            </div>
            <p className="font-semibold text-center truncate w-full">
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
