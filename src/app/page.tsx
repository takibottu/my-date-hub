'use client';

import { useState, useEffect } from 'react';
import MediaModal from '@/components/MediaModal';

interface MediaFile {
  filename: string;
  mtime: number;
}

export default function Home() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  useEffect(() => {
    const fetchFiles = async () => {
      const res = await fetch('/api/files');
      const data = await res.json();
      setFiles(data);
    };

    fetchFiles();
  }, []);

  const getFileIcon = (filename: string) => {
    const extension = filename.split('.').pop()?.toLowerCase();
    if (extension === 'png' || extension === 'jpg' || extension === 'jpeg' || extension === 'gif') {
      return '🖼️'; // Image icon
    } else if (extension === 'mp4' || extension === 'webm' || extension === 'ogg') {
      return '🎥'; // Video icon
    } else if (extension === 'mp3' || extension === 'wav') {
      return '🎵'; // Audio icon
    } else if (extension === 'pdf') {
      return '📄'; // PDF icon
    } else {
      return '📝'; // Text icon
    }
  };

  const handleShare = (filename: string) => {
    const url = `${window.location.origin}/view/${filename}`;
    navigator.clipboard.writeText(url);
    alert(`Copied to clipboard: ${url}`);
  };

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8 text-center">Personal Media Hub</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {files.map((file) => (
          <div 
            key={file.filename} 
            className="border rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:shadow-lg transition-shadow duration-200"
          >
            <div 
              className="text-5xl mb-2"
              onClick={() => setSelectedFile(file.filename)}
            >
              {getFileIcon(file.filename)}
            </div>
            <p 
              className="font-semibold text-center truncate w-full"
              onClick={() => setSelectedFile(file.filename)}
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
