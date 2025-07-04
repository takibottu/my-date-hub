'use client';

import { useState, useEffect } from 'react';

interface MediaModalProps {
  filename: string | null;
  onClose: () => void;
}

export default function MediaModal({ filename, onClose }: MediaModalProps) {
  const [fileType, setFileType] = useState<string | null>(null);

  useEffect(() => {
    if (filename) {
      const extension = filename.split('.').pop()?.toLowerCase();
      if (['png', 'jpg', 'jpeg', 'gif'].includes(extension || '')) {
        setFileType('image');
      } else if (['mp4', 'webm', 'ogg'].includes(extension || '')) {
        setFileType('video');
      } else if (['mp3', 'wav'].includes(extension || '')) {
        setFileType('audio');
      } else if (extension === 'pdf') {
        setFileType('pdf');
      } else {
        setFileType('text');
      }
    }
  }, [filename]);

  if (!filename) return null;

  const mediaUrl = `/media/${filename}`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white p-4 rounded-lg max-w-4xl w-full max-h-full overflow-auto" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-2 right-2 text-white text-2xl">&times;</button>
        {fileType === 'image' && <img src={mediaUrl} alt={filename} className="w-full h-auto" />}
        {fileType === 'video' && <video src={mediaUrl} controls autoPlay className="w-full" />}
        {fileType === 'audio' && <audio src={mediaUrl} controls autoPlay />}
        {fileType === 'pdf' && <iframe src={mediaUrl} className="w-full h-screen" />}
        {fileType === 'text' && <iframe src={mediaUrl} className="w-full h-screen" />}
      </div>
    </div>
  );
}
