"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaSave, FaEye, FaArrowLeft, FaPlus, FaTrash } from 'react-icons/fa';
import Link from 'next/link';
import FileUpload from '@/components/FileUpload';

export default function NewShopItem() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'LUTs',
    tags: [''],
    price: 0,
    originalPrice: 0,
    currency: 'USD',
    thumbnail: '',
    previewVideo: '',
    downloadUrl: '#',
    fileSize: '',
    format: '',
    resolution: '',
    features: [''],
    isNew: false,
    isPopular: false,
    isOnSale: false,
    rating: 0,
    downloads: 0,
    createdAt: new Date().toISOString().split('T')[0],
    status: 'draft'
  });

  const [uploadedFiles, setUploadedFiles] = useState<{
    downloadable: string;
    previewVideo: string;
    thumbnail: string;
  }>({
    downloadable: '',
    previewVideo: '',
    thumbnail: ''
  });

  const categories = ['LUTs', 'Templates', 'Motion Graphics', 'Social Media', 'Corporate', 'Wedding', 'Gaming'];
  const formats = ['.cube', '.aep', '.psd', '.prproj', '.zip'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Saving shop item:', formData);
    alert('Shop item saved! (In real implementation, this would save to your database)');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handleFileUpload = (fileType: 'downloadable' | 'previewVideo' | 'thumbnail') => (files: File[]) => {
    if (files.length > 0) {
      const fileUrl = `/uploads/shop/${Date.now()}_${files[0].name}`;
      
      setUploadedFiles(prev => ({
        ...prev,
        [fileType]: fileUrl
      }));

      // Update form data based on file type
      if (fileType === 'downloadable') {
        setFormData(prev => ({
          ...prev,
          downloadUrl: fileUrl,
          fileSize: formatFileSize(files[0].size)
        }));
      } else if (fileType === 'previewVideo') {
        setFormData(prev => ({
          ...prev,
          previewVideo: fileUrl
        }));
      } else if (fileType === 'thumbnail') {
        setFormData(prev => ({
          ...prev,
          thumbnail: fileUrl
        }));
      }
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const addTag = () => {
    setFormData(prev => ({
      ...prev,
      tags: [...prev.tags, '']
    }));
  };

  const updateTag = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.map((tag, i) => i === index ? value : tag)
    }));
  };

  const removeTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const updateFeature = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.map((feature, i) => i === index ? value : feature)
    }));
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
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
          <h1 className="text-4xl font-bold text-text-primary">Add New Shop Item</h1>
          <p className="text-text-primary/70 mt-2">Add a new product to your shop</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <div className="bg-dark-lighter/50 backdrop-blur-md border border-text-primary/10 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-text-primary mb-6">Product Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-text-primary font-medium mb-2">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-dark border border-text-primary/20 rounded-lg text-text-primary focus:border-primary focus:outline-none transition-colors"
                  placeholder="Enter product title..."
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
              <label className="block text-text-primary font-medium mb-2">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 bg-dark border border-text-primary/20 rounded-lg text-text-primary focus:border-primary focus:outline-none transition-colors resize-none"
                placeholder="Describe your product..."
                required
              />
            </div>

            {/* Tags */}
            <div className="mt-6">
              <label className="block text-text-primary font-medium mb-2">Tags</label>
              <div className="space-y-2">
                {formData.tags.map((tag, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={tag}
                      onChange={(e) => updateTag(index, e.target.value)}
                      className="flex-1 px-4 py-3 bg-dark border border-text-primary/20 rounded-lg text-text-primary focus:border-primary focus:outline-none transition-colors"
                      placeholder="Enter tag..."
                    />
                    <button
                      type="button"
                      onClick={() => removeTag(index)}
                      className="px-3 py-3 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addTag}
                  className="flex items-center gap-2 px-4 py-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                >
                  <FaPlus />
                  Add Tag
                </button>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-dark-lighter/50 backdrop-blur-md border border-text-primary/10 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-text-primary mb-6">Pricing</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-text-primary font-medium mb-2">Price *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-3 bg-dark border border-text-primary/20 rounded-lg text-text-primary focus:border-primary focus:outline-none transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-text-primary font-medium mb-2">Original Price</label>
                <input
                  type="number"
                  name="originalPrice"
                  value={formData.originalPrice}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-3 bg-dark border border-text-primary/20 rounded-lg text-text-primary focus:border-primary focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-text-primary font-medium mb-2">Currency</label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-dark border border-text-primary/20 rounded-lg text-text-primary focus:border-primary focus:outline-none transition-colors"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>
            </div>

            {/* Badges */}
            <div className="mt-6">
              <label className="block text-text-primary font-medium mb-3">Product Badges</label>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="isNew"
                    checked={formData.isNew}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-primary bg-dark border-text-primary/20 rounded focus:ring-primary focus:ring-2"
                  />
                  <span className="text-text-primary">New</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="isPopular"
                    checked={formData.isPopular}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-primary bg-dark border-text-primary/20 rounded focus:ring-primary focus:ring-2"
                  />
                  <span className="text-text-primary">Popular</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="isOnSale"
                    checked={formData.isOnSale}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-primary bg-dark border-text-primary/20 rounded focus:ring-primary focus:ring-2"
                  />
                  <span className="text-text-primary">On Sale</span>
                </label>
              </div>
            </div>
          </div>

          {/* Media & Downloads */}
          <div className="bg-dark-lighter/50 backdrop-blur-md border border-text-primary/10 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-text-primary mb-6">Media & Downloads</h2>
            
            {/* File Uploads */}
            <div className="space-y-8">
              {/* Thumbnail Upload */}
              <FileUpload
                label="Product Thumbnail"
                accept="image/*"
                maxSize={10}
                multiple={false}
                onFilesSelected={handleFileUpload('thumbnail')}
                uploadedFiles={uploadedFiles.thumbnail ? [uploadedFiles.thumbnail] : []}
                fileType="image"
              />

              {/* Preview Video Upload */}
              <FileUpload
                label="Preview Video"
                accept="video/*"
                maxSize={100}
                multiple={false}
                onFilesSelected={handleFileUpload('previewVideo')}
                uploadedFiles={uploadedFiles.previewVideo ? [uploadedFiles.previewVideo] : []}
                fileType="video"
              />

              {/* Downloadable Product Files */}
              <FileUpload
                label="Product Files (WinRAR, ZIP, etc.)"
                accept=".zip,.rar,.7z,.tar,.gz,.cube,.aep,.psd,.prproj,.fcp,.xml,.mp4,.mov,.avi"
                maxSize={500}
                multiple={false}
                onFilesSelected={handleFileUpload('downloadable')}
                uploadedFiles={uploadedFiles.downloadable ? [uploadedFiles.downloadable] : []}
                fileType="archive"
              />
            </div>

            {/* Alternative URLs */}
            <div className="mt-8 pt-6 border-t border-text-primary/10">
              <h3 className="text-lg font-medium text-text-primary mb-4">Alternative URLs (Optional)</h3>
              <p className="text-text-primary/60 text-sm mb-6">
                Use these fields if you prefer to provide direct URLs instead of uploading files
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-text-primary font-medium mb-2">Thumbnail URL</label>
                  <input
                    type="url"
                    name="thumbnail"
                    value={formData.thumbnail}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-dark border border-text-primary/20 rounded-lg text-text-primary focus:border-primary focus:outline-none transition-colors"
                    placeholder="https://example.com/thumbnail.jpg"
                  />
                </div>

                <div>
                  <label className="block text-text-primary font-medium mb-2">Preview Video URL</label>
                  <input
                    type="url"
                    name="previewVideo"
                    value={formData.previewVideo}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-dark border border-text-primary/20 rounded-lg text-text-primary focus:border-primary focus:outline-none transition-colors"
                    placeholder="https://example.com/preview.mp4"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-text-primary font-medium mb-2">Download URL</label>
                <input
                  type="url"
                  name="downloadUrl"
                  value={formData.downloadUrl}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-dark border border-text-primary/20 rounded-lg text-text-primary focus:border-primary focus:outline-none transition-colors"
                  placeholder="https://example.com/download.zip"
                />
              </div>
            </div>
          </div>

          {/* Technical Details */}
          <div className="bg-dark-lighter/50 backdrop-blur-md border border-text-primary/10 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-text-primary mb-6">Technical Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-text-primary font-medium mb-2">File Size</label>
                <input
                  type="text"
                  name="fileSize"
                  value={formData.fileSize}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-dark border border-text-primary/20 rounded-lg text-text-primary focus:border-primary focus:outline-none transition-colors"
                  placeholder="e.g., 2.3 MB"
                />
              </div>

              <div>
                <label className="block text-text-primary font-medium mb-2">Format</label>
                <select
                  name="format"
                  value={formData.format}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-dark border border-text-primary/20 rounded-lg text-text-primary focus:border-primary focus:outline-none transition-colors"
                >
                  <option value="">Select format</option>
                  {formats.map(format => (
                    <option key={format} value={format}>{format}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-text-primary font-medium mb-2">Resolution</label>
                <input
                  type="text"
                  name="resolution"
                  value={formData.resolution}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-dark border border-text-primary/20 rounded-lg text-text-primary focus:border-primary focus:outline-none transition-colors"
                  placeholder="e.g., 4K, 1080p"
                />
              </div>
            </div>

            {/* Features */}
            <div className="mt-6">
              <label className="block text-text-primary font-medium mb-2">Features</label>
              <div className="space-y-2">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => updateFeature(index, e.target.value)}
                      className="flex-1 px-4 py-3 bg-dark border border-text-primary/20 rounded-lg text-text-primary focus:border-primary focus:outline-none transition-colors"
                      placeholder="Enter feature..."
                    />
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="px-3 py-3 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addFeature}
                  className="flex items-center gap-2 px-4 py-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                >
                  <FaPlus />
                  Add Feature
                </button>
              </div>
            </div>
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
              Save Product
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
