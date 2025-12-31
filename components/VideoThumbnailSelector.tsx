"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlay, FaPause, FaUpload, FaImage, FaYoutube, FaCheck, FaTimes } from 'react-icons/fa';

interface VideoThumbnailSelectorProps {
  onThumbnailSelect: (thumbnailUrl: string, thumbnailType: 'video' | 'youtube' | 'upload') => void;
  onClose: () => void;
  videoUrl?: string;
  youtubeUrl?: string;
}

const VideoThumbnailSelector: React.FC<VideoThumbnailSelectorProps> = ({
  onThumbnailSelect,
  onClose,
  videoUrl,
  youtubeUrl
}) => {
  const [activeTab, setActiveTab] = useState<'video' | 'youtube' | 'upload'>('video');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [selectedTime, setSelectedTime] = useState(0);
  const [youtubeThumbnails, setYoutubeThumbnails] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [uploadedThumbnail, setUploadedThumbnail] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle video time updates
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [videoUrl]);

  // Extract YouTube thumbnails
  const extractYouTubeThumbnails = async (url: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/youtube-thumbnail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      
      const data = await response.json();
      if (data.success) {
        setYoutubeThumbnails(data);
      } else {
        alert('Failed to extract YouTube thumbnails: ' + data.error);
      }
    } catch (error) {
      console.error('Error extracting YouTube thumbnails:', error);
      alert('Failed to extract YouTube thumbnails');
    } finally {
      setLoading(false);
    }
  };

  // Capture frame from video
  const captureFrame = (time: number) => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (!video || !canvas) return null;

    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Set canvas size
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Seek to specific time
    video.currentTime = time;
    
    // Wait for seek to complete, then draw frame
    const drawFrame = () => {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL('image/jpeg', 0.8);
    };

    return new Promise<string>((resolve) => {
      const handleSeeked = () => {
        video.removeEventListener('seeked', handleSeeked);
        const frameData = drawFrame();
        resolve(frameData);
      };
      
      video.addEventListener('seeked', handleSeeked);
    });
  };

  // Handle video frame selection
  const handleVideoFrameSelect = async () => {
    if (!videoRef.current) return;
    
    const frameData = await captureFrame(selectedTime);
    if (frameData) {
      onThumbnailSelect(frameData, 'video');
    }
  };

  // Handle YouTube thumbnail selection
  const handleYouTubeThumbnailSelect = (thumbnailUrl: string) => {
    onThumbnailSelect(thumbnailUrl, 'youtube');
  };

  // Handle manual thumbnail upload
  const handleThumbnailUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setUploadedThumbnail(result);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadedThumbnailSelect = () => {
    if (uploadedThumbnail) {
      onThumbnailSelect(uploadedThumbnail, 'upload');
    }
  };

  // Handle timeline scrubbing
  const handleTimelineClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * duration;
    
    setSelectedTime(newTime);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-dark-lighter/90 backdrop-blur-md border border-text-primary/20 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-text-primary">Select Video Thumbnail</h3>
            <button
              onClick={onClose}
              className="text-text-primary/60 hover:text-text-primary transition-colors"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveTab('video')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'video' 
                  ? 'bg-primary text-dark' 
                  : 'bg-dark/50 text-text-primary/70 hover:bg-dark/70'
              }`}
            >
              <FaPlay className="inline mr-2" />
              Video Frame
            </button>
            <button
              onClick={() => setActiveTab('youtube')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'youtube' 
                  ? 'bg-primary text-dark' 
                  : 'bg-dark/50 text-text-primary/70 hover:bg-dark/70'
              }`}
            >
              <FaYoutube className="inline mr-2" />
              YouTube
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'upload' 
                  ? 'bg-primary text-dark' 
                  : 'bg-dark/50 text-text-primary/70 hover:bg-dark/70'
              }`}
            >
              <FaUpload className="inline mr-2" />
              Upload
            </button>
          </div>

          {/* Video Frame Selection */}
          {activeTab === 'video' && videoUrl && (
            <div className="space-y-4">
              <div className="bg-dark/50 rounded-lg p-4">
                <video
                  ref={videoRef}
                  src={videoUrl}
                  className="w-full max-h-64 rounded-lg"
                  controls
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-text-primary/80 text-sm font-medium">
                  Timeline (click to scrub)
                </label>
                <div
                  className="relative h-2 bg-dark/50 rounded-full cursor-pointer"
                  onClick={handleTimelineClick}
                >
                  <div
                    className="absolute top-0 left-0 h-full bg-primary rounded-full"
                    style={{ width: `${(selectedTime / duration) * 100}%` }}
                  />
                  <div
                    className="absolute top-1/2 transform -translate-y-1/2 w-4 h-4 bg-primary rounded-full border-2 border-dark"
                    style={{ left: `${(selectedTime / duration) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-text-primary/60">
                  <span>{Math.floor(selectedTime / 60)}:{(selectedTime % 60).toFixed(0).padStart(2, '0')}</span>
                  <span>{Math.floor(duration / 60)}:{(duration % 60).toFixed(0).padStart(2, '0')}</span>
                </div>
              </div>

              <button
                onClick={handleVideoFrameSelect}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-dark rounded-lg hover:bg-primary/80 transition-colors"
              >
                <FaImage />
                Use This Frame as Thumbnail
              </button>
            </div>
          )}

          {/* YouTube Thumbnail Selection */}
          {activeTab === 'youtube' && (
            <div className="space-y-4">
              {!youtubeThumbnails ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-text-primary/80 text-sm font-medium mb-2">
                      YouTube URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://youtube.com/watch?v=..."
                      className="w-full bg-dark/50 border border-text-primary/20 rounded-lg px-4 py-3 text-text-primary focus:border-primary focus:outline-none"
                      onBlur={(e) => {
                        if (e.target.value) {
                          extractYouTubeThumbnails(e.target.value);
                        }
                      }}
                    />
                  </div>
                  {loading && (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                      <p className="text-text-primary/60 mt-2">Extracting thumbnails...</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-semibold text-text-primary">Available Thumbnails</h4>
                    <button
                      onClick={() => setYoutubeThumbnails(null)}
                      className="text-text-primary/60 hover:text-text-primary transition-colors"
                    >
                      Change URL
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries(youtubeThumbnails.thumbnails).map(([quality, url]) => (
                      <div
                        key={quality}
                        className="relative group cursor-pointer"
                        onClick={() => handleYouTubeThumbnailSelect(url as string)}
                      >
                        <img
                          src={url as string}
                          alt={`${quality} thumbnail`}
                          className="w-full h-24 object-cover rounded-lg border border-text-primary/20"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                          <FaCheck className="text-primary text-xl" />
                        </div>
                        <p className="text-xs text-text-primary/60 mt-1 capitalize">{quality}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Manual Upload */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              <div>
                <label className="block text-text-primary/80 text-sm font-medium mb-2">
                  Upload Thumbnail Image
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-dark/50 border border-text-primary/20 rounded-lg hover:bg-dark/70 transition-colors"
                >
                  <FaUpload />
                  Choose Image File
                </button>
              </div>

              {uploadedThumbnail && (
                <div className="space-y-4">
                  <div className="text-center">
                    <img
                      src={uploadedThumbnail}
                      alt="Uploaded thumbnail"
                      className="max-w-full max-h-48 mx-auto rounded-lg border border-text-primary/20"
                    />
                  </div>
                  <button
                    onClick={handleUploadedThumbnailSelect}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-dark rounded-lg hover:bg-primary/80 transition-colors"
                  >
                    <FaCheck />
                    Use This Image as Thumbnail
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Hidden canvas for frame capture */}
          <canvas ref={canvasRef} className="hidden" />
        </div>
      </div>
    </div>
  );
};

export default VideoThumbnailSelector;
