"use client";

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaUpload, FaFile, FaImage, FaVideo, FaFileArchive, FaTimes, FaCheck } from 'react-icons/fa';

interface FileUploadProps {
  label: string;
  accept: string;
  maxSize?: number; // in MB
  multiple?: boolean;
  onFilesSelected: (files: File[]) => void;
  uploadedFiles?: string[];
  fileType?: 'image' | 'video' | 'archive' | 'all';
  className?: string;
}

export default function FileUpload({
  label,
  accept,
  maxSize = 50,
  multiple = false,
  onFilesSelected,
  uploadedFiles = [],
  fileType = 'all',
  className = ''
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedFilesState, setUploadedFilesState] = useState<string[]>(uploadedFiles);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <FaImage className="text-blue-400" />;
    if (file.type.startsWith('video/')) return <FaVideo className="text-green-400" />;
    if (file.type.includes('zip') || file.type.includes('rar') || file.name.endsWith('.zip') || file.name.endsWith('.rar')) {
      return <FaFileArchive className="text-purple-400" />;
    }
    return <FaFile className="text-gray-400" />;
  };

  const validateFile = (file: File): boolean => {
    if (maxSize && file.size > maxSize * 1024 * 1024) {
      alert(`File ${file.name} is too large. Maximum size is ${maxSize}MB.`);
      return false;
    }

    // Check file type based on accept parameter
    const acceptedTypes = accept.split(',').map(type => type.trim());
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    const isAccepted = acceptedTypes.some(type => {
      if (type.includes('/')) {
        return file.type.match(type.replace('*', '.*'));
      }
      return type === fileExtension || type === '*';
    });

    if (!isAccepted) {
      alert(`File type ${file.type} is not allowed.`);
      return false;
    }

    return true;
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files) return;

    const validFiles: File[] = [];
    const filesArray = Array.from(files);

    // Validate all files first
    for (const file of filesArray) {
      if (validateFile(file)) {
        validFiles.push(file);
      }
    }

    if (validFiles.length === 0) return;

    setUploading(true);

    try {
      // In a real implementation, you would upload to your server here
      // For now, we'll simulate the upload and return a URL
      const uploadedUrls = await Promise.all(
        validFiles.map(async (file) => {
          // Simulate upload delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // In real implementation, this would be the actual uploaded file URL
          return `/uploads/${Date.now()}_${file.name}`;
        })
      );

      const newUploadedFiles = [...uploadedFilesState, ...uploadedUrls];
      setUploadedFilesState(newUploadedFiles);
      onFilesSelected(validFiles);

    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const removeFile = (index: number) => {
    const newFiles = uploadedFilesState.filter((_, i) => i !== index);
    setUploadedFilesState(newFiles);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <label className="block text-text-primary font-medium mb-2">{label}</label>
      
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? 'border-primary bg-primary/5'
            : 'border-text-primary/30 hover:border-primary/50'
        } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInputChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <motion.div
          className="flex flex-col items-center justify-center space-y-4"
          animate={uploading ? { scale: 0.95 } : { scale: 1 }}
        >
          <div className="p-4 bg-primary/10 rounded-full">
            <FaUpload className="text-2xl text-primary" />
          </div>
          
          <div>
            <p className="text-text-primary font-medium">
              {dragActive ? 'Drop files here' : 'Click to upload or drag and drop'}
            </p>
            <p className="text-text-primary/60 text-sm mt-1">
              {accept} (max {maxSize}MB)
            </p>
          </div>
        </motion.div>

        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-dark/80 rounded-lg">
            <div className="flex items-center gap-2 text-primary">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              Uploading...
            </div>
          </div>
        )}
      </div>

      {/* Uploaded Files List */}
      {uploadedFilesState.length > 0 && (
        <div className="space-y-2">
          <p className="text-text-primary font-medium text-sm">Uploaded Files:</p>
          {uploadedFilesState.map((fileUrl, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between p-3 bg-dark-lighter/30 rounded-lg border border-text-primary/10"
            >
              <div className="flex items-center gap-3">
                <FaFile className="text-text-primary/60" />
                <div>
                  <p className="text-text-primary text-sm">{fileUrl.split('/').pop()}</p>
                  <p className="text-text-primary/50 text-xs">{fileUrl}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FaCheck className="text-green-400 text-sm" />
                <button
                  onClick={() => removeFile(index)}
                  className="p-1 text-red-400 hover:bg-red-400/10 rounded transition-colors"
                >
                  <FaTimes />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
