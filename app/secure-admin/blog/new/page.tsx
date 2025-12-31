"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaSave, FaEye, FaArrowLeft } from 'react-icons/fa';
import Link from 'next/link';
import FileUpload from '@/components/FileUpload';

export default function NewBlogPost() {
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    category: 'Behind the Scenes',
    content: '',
    thumbnail: '',
    status: 'draft'
  });

  const [uploadedFiles, setUploadedFiles] = useState<{
    images: string[];
    videos: string[];
    downloads: string[];
  }>({
    images: [],
    videos: [],
    downloads: []
  });

  const categories = [
    'Behind the Scenes',
    'Techniques', 
    'Tips & Tricks',
    'Insights'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would save the blog post
    console.log('Saving blog post:', formData);
    alert('Blog post saved! (In real implementation, this would save to your database)');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = (fileType: 'images' | 'videos' | 'downloads') => (files: File[]) => {
    // In real implementation, you would upload these files to your server
    // and get back the URLs
    const urls = files.map(file => `/uploads/blog/${Date.now()}_${file.name}`);
    
    setUploadedFiles(prev => ({
      ...prev,
      [fileType]: [...prev[fileType], ...urls]
    }));
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
          <h1 className="text-4xl font-bold text-text-primary">Create New Blog Post</h1>
          <p className="text-text-primary/70 mt-2">Write and publish your latest blog post</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <div className="bg-dark-lighter/50 backdrop-blur-md border border-text-primary/10 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-text-primary mb-6">Post Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-text-primary font-medium mb-2">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-dark border border-text-primary/20 rounded-lg text-text-primary focus:border-primary focus:outline-none transition-colors"
                  placeholder="Enter blog post title..."
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
            </div>

            <div className="mt-6">
              <label className="block text-text-primary font-medium mb-2">Excerpt *</label>
              <textarea
                name="excerpt"
                value={formData.excerpt}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 bg-dark border border-text-primary/20 rounded-lg text-text-primary focus:border-primary focus:outline-none transition-colors resize-none"
                placeholder="Brief description of your blog post..."
                required
              />
            </div>

            <div className="mt-6">
              <label className="block text-text-primary font-medium mb-2">Thumbnail URL</label>
              <input
                type="url"
                name="thumbnail"
                value={formData.thumbnail}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-dark border border-text-primary/20 rounded-lg text-text-primary focus:border-primary focus:outline-none transition-colors"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          {/* Content */}
          <div className="bg-dark-lighter/50 backdrop-blur-md border border-text-primary/10 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-text-primary mb-6">Content</h2>
            <div>
              <label className="block text-text-primary font-medium mb-2">Post Content *</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                rows={15}
                className="w-full px-4 py-3 bg-dark border border-text-primary/20 rounded-lg text-text-primary focus:border-primary focus:outline-none transition-colors resize-none"
                placeholder="Write your blog post content here..."
                required
              />
              <p className="text-text-primary/50 text-sm mt-2">
                You can use HTML tags for formatting, or we can add a rich text editor later.
              </p>
            </div>
          </div>

          {/* Media Uploads */}
          <div className="bg-dark-lighter/50 backdrop-blur-md border border-text-primary/10 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-text-primary mb-6">Media & Downloads</h2>
            
            {/* Images */}
            <FileUpload
              label="Post Images"
              accept="image/*"
              maxSize={10}
              multiple={true}
              onFilesSelected={handleFileUpload('images')}
              uploadedFiles={uploadedFiles.images}
              fileType="image"
              className="mb-6"
            />

            {/* Videos */}
            <FileUpload
              label="Post Videos"
              accept="video/*"
              maxSize={100}
              multiple={true}
              onFilesSelected={handleFileUpload('videos')}
              uploadedFiles={uploadedFiles.videos}
              fileType="video"
              className="mb-6"
            />

            {/* Downloadable Files */}
            <FileUpload
              label="Downloadable Files"
              accept=".pdf,.zip,.rar,.7z,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.mp4,.mov,.avi"
              maxSize={200}
              multiple={true}
              onFilesSelected={handleFileUpload('downloads')}
              uploadedFiles={uploadedFiles.downloads}
              fileType="archive"
            />
          </div>

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
              Save Post
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
    </div>
  );
}
