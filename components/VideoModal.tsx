"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoSrc: string;
  format?: "short" | "horizontal";
  isYouTube?: boolean;
  youtubeId?: string;
}

const VideoModal: React.FC<VideoModalProps> = ({ isOpen, onClose, videoSrc, format = "horizontal", isYouTube, youtubeId }) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-dark/95 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(0,255,255,0.05) 0%, rgba(10,10,10,0.95) 100%)",
            }}
          />

          {/* Modal Content */}
          <motion.div
            className="relative z-10 w-full max-w-6xl"
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 300,
            }}
          >
            {/* Close Button */}
            <motion.button
              onClick={onClose}
              className="absolute -top-12 right-0 w-10 h-10 flex items-center justify-center bg-primary/10 backdrop-blur-md border border-primary/50 rounded-full text-primary hover:bg-primary/20 transition-colors"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaTimes className="text-xl" />
            </motion.button>

            {/* Video Container */}
            <motion.div
              className={`relative bg-dark-lighter rounded-2xl overflow-hidden border border-primary/30 shadow-2xl ${
                format === "short" 
                  ? "aspect-[9/16] max-w-[360px] mx-auto" 
                  : "aspect-video w-full"
              }`}
              initial={{ boxShadow: "0 0 0 rgba(0,255,255,0)" }}
              animate={{
                boxShadow: [
                  "0 0 20px rgba(0,255,255,0.3)",
                  "0 0 40px rgba(0,255,255,0.5)",
                  "0 0 20px rgba(0,255,255,0.3)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {/* YouTube Embed */}
              {isYouTube && youtubeId ? (
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : videoSrc && !videoSrc.includes('placeholder') ? (
                /* Local Video */
                <video
                  className="w-full h-full object-contain"
                  controls
                  autoPlay
                  playsInline
                  src={videoSrc}
                >
                  Your browser does not support the video tag.
                </video>
              ) : (
                /* Placeholder */
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 via-dark-lighter to-primary/5">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/20 backdrop-blur-md border border-primary flex items-center justify-center">
                      <svg
                        className="w-10 h-10 text-primary"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                      </svg>
                    </div>
                    <p className="text-text-primary/70">Video Player</p>
                    <p className="text-text-primary/50 text-sm mt-2">
                      {videoSrc}
                    </p>
                    <p className="text-text-primary/40 text-xs mt-4">
                      (Placeholder - Add video file to display)
                    </p>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Glass reflection effect */}
            <motion.div
              className="absolute inset-0 rounded-2xl pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%)",
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VideoModal;

