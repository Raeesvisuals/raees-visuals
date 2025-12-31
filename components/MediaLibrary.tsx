"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUpload, FaImage, FaFile, FaTrash, FaCopy, FaCheck } from 'react-icons/fa';

interface MediaFile {
  name: string;
  url: string;
  size: number;
  uploadedAt: string;
}

interface MediaLibraryProps {
  onSelectFile?: (file: MediaFile) => void;
  showUpload?: boolean;
  title?: string;
}

const MediaLibrary: React.FC<MediaLibraryProps> = ({ 
  onSelectFile, 
  showUpload = true, 
  title = "Media Library" 
}) => {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch media files
  const fetchFiles = async () => {
    try {
      const response = await fetch('/api/media');
      const data = await response.json();
      if (data.success) {
        setFiles(data.files);
      }
    } catch (error) {
      console.error('Error fetching files:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  // Handle file upload
  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        // Add new file to the list
        setFiles(prev => [data.file, ...prev]);
        if (onSelectFile) {
          onSelectFile(data.file);
        }
      } else {
        alert('Upload failed: ' + data.error);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Copy URL to clipboard
  const copyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(url);
      setTimeout(() => setCopied(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Get file icon
  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension || '')) {
      return <FaImage className="text-blue-500" />;
    }
    return <FaFile className="text-gray-500" />;
  };

  return (
    <div className="bg-dark-lighter/30 backdrop-blur-md border border-text-primary/20 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-text-primary">{title}</h3>
        {showUpload && (
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-dark rounded-lg hover:bg-primary/80 transition-colors disabled:opacity-50"
          >
            <FaUpload />
            {uploading ? 'Uploading...' : 'Upload File'}
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        onChange={handleUpload}
        className="hidden"
        accept="image/*,.pdf,.doc,.docx"
      />

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-text-primary/60 mt-2">Loading files...</p>
        </div>
      ) : files.length === 0 ? (
        <div className="text-center py-8">
          <FaFile className="text-4xl text-text-primary/30 mx-auto mb-4" />
            <p className="text-text-primary/60">No files uploaded yet</p>
          {showUpload && (
            <p className="text-text-primary/40 text-sm mt-2">
              Click &quot;Upload File&quot; to get started
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {files.map((file, index) => (
              <motion.div
                key={file.url}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className="bg-dark/50 backdrop-blur-sm border border-text-primary/10 rounded-lg p-4 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    {getFileIcon(file.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-text-primary/60">
                      {formatFileSize(file.size)}
                    </p>
                    <p className="text-xs text-text-primary/40">
                      {new Date(file.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 mt-3">
                  {onSelectFile && (
                    <button
                      onClick={() => onSelectFile(file)}
                      className="flex-1 px-3 py-1 bg-primary/20 text-primary text-xs rounded hover:bg-primary/30 transition-colors"
                    >
                      Select
                    </button>
                  )}
                  <button
                    onClick={() => copyUrl(file.url)}
                    className="px-3 py-1 bg-text-primary/10 text-text-primary text-xs rounded hover:bg-text-primary/20 transition-colors"
                  >
                    {copied === file.url ? <FaCheck /> : <FaCopy />}
                  </button>
                </div>

                {copied === file.url && (
                  <p className="text-xs text-green-400 mt-1">URL copied!</p>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default MediaLibrary;
