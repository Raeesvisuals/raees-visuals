"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaSave, FaEye, FaArrowLeft, FaImage, FaVideo, FaYoutube } from 'react-icons/fa';
import Link from 'next/link';
import FileUpload from '@/components/FileUpload';
import VideoThumbnailSelector from '@/components/VideoThumbnailSelector';

export default function NewPortfolioItem() {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Fitness',
    type: 'Short Form',
    video: '',
    thumbnail: '',
    youtubeId: '',
    isYouTube: false,
    status: 'draft'
  });

  const [uploadedVideo, setUploadedVideo] = useState<string>('');
  const [showThumbnailSelector, setShowThumbnailSelector] = useState(false);
  const [selectedThumbnail, setSelectedThumbnail] = useState<string>('');
  const [youtubeUrl, setYoutubeUrl] = useState<string>('');

  const categories = ['Fitness', 'SaaS', 'Explainer', 'Commercial', 'Documentary', 'Animation'];
  const types = ['Short Form', 'Long Form', 'Animation'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Saving portfolio item:', formData);
    alert('Portfolio item saved! (In real implementation, this would save to your database)');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleVideoUpload = async (files: File[]) => {
    if (files.length > 0) {
      const formData = new FormData();
      formData.append('file', files[0]);

      try {
        const response = await fetch('/api/upload-video', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();
        if (data.success) {
          setUploadedVideo(data.file.url);
          setFormData(prev => ({
            ...prev,
            video: data.file.url
          }));
        } else {
          alert('Video upload failed: ' + data.error);
        }
      } catch (error) {
        console.error('Video upload error:', error);
        alert('Video upload failed');
      }
    }
  };

  const handleThumbnailSelect = (thumbnailUrl: string, thumbnailType: 'video' | 'youtube' | 'upload') => {
    setSelectedThumbnail(thumbnailUrl);
    setFormData(prev => ({
      ...prev,
      thumbnail: thumbnailUrl
    }));
    setShowThumbnailSelector(false);
  };

  const openThumbnailSelector = () => {
    setShowThumbnailSelector(true);
  };

  return (
    <div className="min-h-screen bg-dark">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/admin" className="flex items-center gap-2 text-primary hover:text-primary/70 transition-colors mb-4">
            <FaArrowLeft />
            Back to Admin Panel
          </Link>
          <h1 className="text-4xl font-bold text-text-primary">Add New Portfolio Item</h1>
          <p className="text-text-primary/70 mt-2">Add a new video to your portfolio</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <div className="bg-dark-lighter/50 backdrop-blur-md border border-text-primary/10 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-text-primary mb-6">Video Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-text-primary font-medium mb-2">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-dark border border-text-primary/20 rounded-lg text-text-primary focus:border-primary focus:outline-none transition-colors"
                  placeholder="Enter video title..."
                  required
                />
              </div>

              <div>
                <label className="block text-text-primary font-medium mb-2">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-dark border border-text-primary/20 rounded-lg text-text-primary focus:border-primary focus:outline-none transition-colors"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-text-primary font-medium mb-2">Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-dark border border-text-primary/20 rounded-lg text-text-primary focus:border-primary focus:outline-none transition-colors"
                >
                  {types.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Video Source */}
          <div className="bg-dark-lighter/50 backdrop-blur-md border border-text-primary/10 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-text-primary mb-6">Video Source</h2>
            
            <div className="mb-6">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="isYouTube"
                  checked={formData.isYouTube}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-primary bg-dark border-text-primary/20 rounded focus:ring-primary focus:ring-2"
                />
                <span className="text-text-primary">This is a YouTube video</span>
              </label>
            </div>

            {formData.isYouTube ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-text-primary font-medium mb-2">YouTube URL *</label>
                  <input
                    type="url"
                    name="youtubeUrl"
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    className="w-full px-4 py-3 bg-dark border border-text-primary/20 rounded-lg text-text-primary focus:border-primary focus:outline-none transition-colors"
                    placeholder="https://youtube.com/watch?v=..."
                    required={formData.isYouTube}
                  />
                    <p className="text-text-primary/50 text-sm mt-2">
                      Paste the full YouTube URL. We&apos;ll extract the video ID and thumbnails automatically.
                    </p>
                </div>

                {youtubeUrl && (
                  <div className="flex items-center gap-4">
                    <button
                      onClick={openThumbnailSelector}
                      className="flex items-center gap-2 px-4 py-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-colors"
                    >
                      <FaImage />
                      Select Thumbnail
                    </button>
                    <span className="text-text-primary/60 text-sm">
                      Choose from auto-generated thumbnails
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {/* Self-hosted Video Upload */}
                <div>
                  <h3 className="text-lg font-medium text-text-primary mb-4">Upload Self-hosted Video</h3>
                  <FileUpload
                    label="Video File"
                    accept="video/*"
                    maxSize={500}
                    multiple={false}
                    onFilesSelected={handleVideoUpload}
                    uploadedFiles={uploadedVideo ? [uploadedVideo] : []}
                    fileType="video"
                  />
                  
                  {uploadedVideo && (
                    <div className="mt-4 flex items-center gap-4">
                      <button
                        onClick={openThumbnailSelector}
                        className="flex items-center gap-2 px-4 py-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-colors"
                      >
                        <FaVideo />
                        Select Frame as Thumbnail
                      </button>
                      <span className="text-text-primary/60 text-sm">
                        Choose a frame from your video
                      </span>
                    </div>
                  )}
                </div>

                {/* OR Video URL */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-text-primary/20"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-dark text-text-primary/50">OR</span>
                  </div>
                </div>

                <div>
                  <label className="block text-text-primary font-medium mb-2">Video URL (Alternative)</label>
                  <input
                    type="url"
                    name="video"
                    value={formData.video}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-dark border border-text-primary/20 rounded-lg text-text-primary focus:border-primary focus:outline-none transition-colors"
                    placeholder="https://example.com/video.mp4"
                  />
                  <p className="text-text-primary/50 text-sm mt-2">
                    Use this if you want to provide a direct URL instead of uploading
                  </p>
                </div>
              </div>
            )}

            {/* Thumbnail Preview and Manual Upload */}
            <div className="mt-6">
              <label className="block text-text-primary font-medium mb-2">Thumbnail</label>
              
              {selectedThumbnail ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={selectedThumbnail}
                      alt="Selected thumbnail"
                      className="w-32 h-20 object-cover rounded-lg border border-text-primary/20"
                    />
                    <div>
                      <p className="text-text-primary/80 text-sm">Selected thumbnail</p>
                      <button
                        onClick={() => {
                          setSelectedThumbnail('');
                          setFormData(prev => ({ ...prev, thumbnail: '' }));
                        }}
                        className="text-red-400 hover:text-red-300 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={openThumbnailSelector}
                      className="flex items-center gap-2 px-4 py-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-colors"
                    >
                      <FaImage />
                      Choose Thumbnail
                    </button>
                    <span className="text-text-primary/60 text-sm">
                      {formData.isYouTube ? 'Select from YouTube thumbnails' : 'Select from video frame or upload custom'}
                    </span>
                  </div>
                  
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-text-primary/20"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-dark text-text-primary/50">OR</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-text-primary/80 text-sm font-medium mb-2">
                      Manual Thumbnail URL
                    </label>
                    <input
                      type="url"
                      name="thumbnail"
                      value={formData.thumbnail}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-dark border border-text-primary/20 rounded-lg text-text-primary focus:border-primary focus:outline-none transition-colors"
                      placeholder="https://example.com/thumbnail.jpg"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Preview */}
          {formData.youtubeId && formData.isYouTube && (
            <div className="bg-dark-lighter/50 backdrop-blur-md border border-text-primary/10 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-text-primary mb-6">Preview</h2>
              <div className="aspect-video bg-dark rounded-lg overflow-hidden">
                <img 
                  src={`https://img.youtube.com/vi/${formData.youtubeId}/maxresdefault.jpg`}
                  alt="YouTube thumbnail"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          {/* Status */}
          <div className="bg-dark-lighter/50 backdrop-blur-md border border-text-primary/10 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-text-primary mb-6">Publish Settings</h2>
            <div>
              <label className="block text-text-primary font-medium mb-2">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-dark border border-text-primary/20 rounded-lg text-text-primary focus:border-primary focus:outline-none transition-colors"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <motion.button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 bg-primary/10 border border-primary/50 rounded-lg text-primary hover:bg-primary/20 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaSave />
              Save Portfolio Item
            </motion.button>

            <motion.button
              type="button"
              className="flex items-center gap-2 px-6 py-3 bg-dark-lighter/50 border border-text-primary/20 rounded-lg text-text-primary hover:bg-dark-lighter/70 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaEye />
              Preview
            </motion.button>
          </div>
        </form>
      </div>

      {/* Video Thumbnail Selector Modal */}
      {showThumbnailSelector && (
        <VideoThumbnailSelector
          onThumbnailSelect={handleThumbnailSelect}
          onClose={() => setShowThumbnailSelector(false)}
          videoUrl={uploadedVideo}
          youtubeUrl={youtubeUrl}
        />
      )}
    </div>
  );
}
