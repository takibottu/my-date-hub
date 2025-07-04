'use client';

import { useState, useEffect } from 'react';

interface ViewPageProps {
  params: {
    filename: string;
  };
}

export default function ViewPage({ params }: ViewPageProps) {
  const { filename } = params;
  const [fileType, setFileType] = useState<string | null>(null);

  useEffect(() => {
    if (filename) {
      const extension = filename.split('.').pop()?.toLowerCase();
      if (extension === 'png' || extension === 'jpg' || extension === 'jpeg' || extension === 'gif') {
        setFileType('image');
      } else if (extension === 'mp4' || extension === 'webm' || extension === 'ogg') {
        setFileType('video');
      } else if (extension === 'mp3' || extension === 'wav') {
        setFileType('audio');
      } else if (extension === 'pdf') {
        setFileType('pdf');
      } else {
        setFileType('text');
      }
    }
  }, [filename]);

  const mediaUrl = `/media/${filename}`;

  return (
    <div className="w-full h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-4 rounded-lg shadow-lg max-w-4xl w-full max-h-full overflow-auto">
        {fileType === 'image' && <img src={mediaUrl} alt={filename} className="w-full h-auto" />}
        {fileType === 'video' && <video src={mediaUrl} controls autoPlay className="w-full" />}
        {fileType === 'audio' && <audio src={mediaUrl} controls autoPlay />}
        {fileType === 'pdf' && <iframe src={mediaUrl} className="w-full h-screen" />}
        {fileType === 'text' && <iframe src={mediaUrl} className="w-full h-screen" />}
      </div>
    </div>
  );
}
