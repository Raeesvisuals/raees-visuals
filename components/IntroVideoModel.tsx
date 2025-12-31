"use client";

import { motion } from "framer-motion";
import { useEffect, useState, useCallback } from "react";
import { FiPlay } from "react-icons/fi";
import Link from "next/link";
import { sanityClient, urlFor } from "@/lib/sanity";

type IntroData = {
  introTitle?: string;
  introText?: string;
  introVideoType?: "youtube" | "upload";
  introYoutubeUrl?: string;
  introVideoFile?: {
    asset?: {
      url?: string;
      mimeType?: string;
    };
  };
  introVideoThumbnail?: any; // Sanity image type
  introPrimaryButton?: string;
  introSecondaryButton?: string;
};

export default function IntroSection() {
  const [data, setData] = useState<IntroData | null>(null);
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  useEffect(() => {
    async function fetchIntroData() {
      try {
        const result = await sanityClient.fetch<IntroData>(
          `coalesce(
            *[_type == "home" && _id == "home"][0],
            *[_type == "home"][0]
          ){
            introTitle,
            introText,
            introVideoType,
            introYoutubeUrl,
            introVideoFile{
              asset->{
                url,
                mimeType
              }
            },
            introVideoThumbnail{
              asset,
              hotspot,
              crop
            },
            introPrimaryButton,
            introSecondaryButton
          }`
        );
        setData(result || null);
      } catch (error) {
        console.error("Error fetching intro data:", error);
        setData(null);
      }
    }

    fetchIntroData();
  }, []);

  // Close video handler
  const handleCloseVideo = useCallback(() => {
    setIsVideoOpen(false);
  }, []);

  // Handle escape key to close modal
  useEffect(() => {
    if (!isVideoOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleCloseVideo();
      }
    };

    document.addEventListener("keydown", handleEscape);
    // Prevent body scroll when modal is open
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isVideoOpen, handleCloseVideo]);

  // Don't render if no data
  if (!data || (!data.introTitle && !data.introText)) {
    return null;
  }

  // Extract YouTube video ID from URL (handles multiple formats)
  const getYouTubeVideoId = (url?: string): string | null => {
    if (!url) return null;
    
    // Handle various YouTube URL formats
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/, // Standard watch URLs
      /youtube\.com\/embed\/([^&\n?#]+)/, // Embed URLs
      /youtube\.com\/shorts\/([^&\n?#]+)/, // Shorts URLs
      /youtube\.com\/v\/([^&\n?#]+)/, // Direct video URLs
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    
    return null;
  };

  // Generate YouTube thumbnail URL
  const getYouTubeThumbnail = (url?: string): string | null => {
    const videoId = getYouTubeVideoId(url);
    if (!videoId) return null;
    // High quality thumbnail
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  };

  // Convert YouTube URL to embed URL or get local video URL
  const getVideoEmbedUrl = (autoplay: boolean = false): string | undefined => {
    if (data?.introVideoType === "youtube" && data?.introYoutubeUrl) {
      const videoId = getYouTubeVideoId(data.introYoutubeUrl);
      if (videoId) {
        const autoplayParam = autoplay ? "?autoplay=1&rel=0" : "?rel=0";
        return `https://www.youtube.com/embed/${videoId}${autoplayParam}`;
      }
    }
    if (data?.introVideoType === "upload" && data?.introVideoFile?.asset?.url) {
      return data.introVideoFile.asset.url;
    }
    return undefined;
  };

  // Get thumbnail URL
  const getThumbnailUrl = (): string | null => {
    // For uploaded videos, use custom thumbnail
    if (data?.introVideoType === "upload" && data?.introVideoThumbnail) {
      return urlFor(data.introVideoThumbnail)
        .width(1280)
        .height(720)
        .auto("format")
        .url();
    }
    // For YouTube, generate thumbnail from URL
    if (data?.introVideoType === "youtube" && data?.introYoutubeUrl) {
      return getYouTubeThumbnail(data.introYoutubeUrl);
    }
    return null;
  };

  const handleWatchStory = () => {
    const hasVideo =
      (data?.introVideoType === "youtube" && data?.introYoutubeUrl) ||
      (data?.introVideoType === "upload" && data?.introVideoFile?.asset?.url);
    if (hasVideo) {
      console.log("🎬 Opening video modal:", {
        videoType: data?.introVideoType,
        youtubeUrl: data?.introYoutubeUrl,
        videoFileUrl: data?.introVideoFile?.asset?.url,
        embedUrl: getVideoEmbedUrl(true),
      });
      setIsVideoOpen(true);
    } else {
      console.warn("⚠️ No video available to play");
    }
  };

  const videoEmbedUrl = getVideoEmbedUrl(false);
  const videoEmbedUrlWithAutoplay = getVideoEmbedUrl(true);
  const thumbnailUrl = getThumbnailUrl();
  const hasVideo = !!videoEmbedUrl;

  return (
    <>
      <section className="relative py-20 px-4 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-dark via-dark-lighter/30 to-dark pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* LEFT: Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              {data.introTitle && (
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-text-primary">
                  {data.introTitle}
                </h2>
              )}

              {data.introText && (
                <p className="text-lg text-text-primary/70 mb-8 leading-relaxed">
                  {data.introText}
                </p>
              )}

              {/* Buttons */}
              <div className="flex flex-wrap gap-4">
                {data.introPrimaryButton && hasVideo && (
                  <button
                    onClick={handleWatchStory}
                    className="px-6 py-3 bg-primary text-black rounded-lg font-semibold hover:bg-primary/90 transition-colors flex items-center gap-2"
                  >
                    <FiPlay className="w-5 h-5" />
                    {data.introPrimaryButton}
                  </button>
                )}

                {data.introSecondaryButton && (
                  <Link
                    href="/about"
                    className="px-6 py-3 border border-text-primary/20 text-text-primary rounded-lg font-semibold hover:border-primary/50 hover:text-primary transition-colors"
                  >
                    {data.introSecondaryButton}
                  </Link>
                )}
              </div>
            </motion.div>

            {/* RIGHT: Video Player */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              {hasVideo && (
                <div
                  onClick={handleWatchStory}
                  className="relative aspect-video rounded-2xl border-2 border-primary/40 bg-black/60 backdrop-blur-sm overflow-hidden cursor-pointer hover:border-primary/60 transition-colors group"
                >
                  {/* Thumbnail Image */}
                  {thumbnailUrl && (
                    <div className="absolute inset-0">
                      <img
                        src={thumbnailUrl}
                        alt="Video thumbnail"
                        className="w-full h-full object-cover"
                        crossOrigin="anonymous"
                        onError={(e) => {
                          // Hide image on error, show fallback
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    </div>
                  )}

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />

                  {/* Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="relative w-20 h-20 rounded-full border-2 border-primary bg-black/40 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                      <FiPlay className="w-8 h-8 text-primary ml-1" />
                    </div>
                  </div>

                  {/* Glow effect */}
                  <div className="absolute inset-0 rounded-2xl bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                </div>
              )}

              {/* Fallback if no video */}
              {!hasVideo && (
                <div className="relative aspect-video rounded-2xl border-2 border-primary/40 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                  <p className="text-text-primary/40 text-sm">No video configured</p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {isVideoOpen && videoEmbedUrlWithAutoplay && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={handleCloseVideo}
          style={{ zIndex: 9999 }}
        >
          <div
            className="relative w-full max-w-5xl mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={handleCloseVideo}
              className="absolute -top-12 right-0 text-text-primary hover:text-primary transition-colors text-2xl font-bold z-10 w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10"
              aria-label="Close video"
              type="button"
            >
              ×
            </button>

            {/* Video Player */}
            <div className="relative aspect-video rounded-lg overflow-hidden border-2 border-primary/30 bg-black">
              {data?.introVideoType === "youtube" ? (
                // YouTube iframe
                <iframe
                  key={videoEmbedUrlWithAutoplay} // Force re-render with new URL
                  src={videoEmbedUrlWithAutoplay}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  title="Intro Video"
                  frameBorder="0"
                />
              ) : (
                // Local video player
                <video
                  key={videoEmbedUrlWithAutoplay} // Force re-render with new URL
                  src={videoEmbedUrlWithAutoplay}
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full"
                >
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
