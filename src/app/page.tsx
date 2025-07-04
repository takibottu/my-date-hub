'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const categories = [
  { name: 'documents', icon: '📝' },
  { name: 'images', icon: '🖼️' },
  { name: 'pdfs', icon: '📄' },
  { name: 'videos', icon: '🎥' },
  { name: 'audio', icon: '🎵' },
  { name: 'bookmarks', icon: '🔗' },
];

export default function Home() {
  const [uploading, setUploading] = useState(false);
  const [url, setUrl] = useState('');
  const router = useRouter();

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

      if (!res.ok) {
        console.error('File upload failed');
      }
    } catch (error) {
      console.error('File upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleUrlSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!url) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('url', url);

    try {
      const res = await fetch('/api/files', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        setUrl('');
      } else {
        console.error('URL submission failed');
      }
    } catch (error) {
      console.error('URL submission error:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8 text-center">Personal Media Hub</h1>

      <div className="mb-8 flex flex-col sm:flex-row items-center justify-center gap-4">
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
          {uploading ? 'Uploading File...' : 'Upload File'}
        </label>

        <form onSubmit={handleUrlSubmit} className="flex items-center gap-2">
          <input
            type="url"
            placeholder="Enter URL to bookmark"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="border rounded p-2 w-64"
            disabled={uploading}
          />
          <button 
            type="submit"
            className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={uploading || !url}
          >
            {uploading ? 'Saving...' : 'Save'}
          </button>
        </form>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {categories.map((category) => (
          <div 
            key={category.name} 
            className="border rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:shadow-lg transition-shadow duration-200"
            onClick={() => router.push(`/view/${category.name}`)}
          >
            <div className="text-5xl mb-2">
              {category.icon}
            </div>
            <p className="font-semibold text-center truncate w-full">
              {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
