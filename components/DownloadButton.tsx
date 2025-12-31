/**
 * Download Button Component
 * 
 * Handles product downloads with loading states and error handling.
 * Uses the secure R2 download flow.
 */

"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaDownload, FaSpinner } from "react-icons/fa";
import { downloadProduct } from "@/lib/download";

interface DownloadButtonProps {
  productId: string;
  fileName?: string;
  className?: string;
  disabled?: boolean;
  onDownloadStart?: () => void;
  onDownloadComplete?: () => void;
  onDownloadError?: (error: Error) => void;
}

export default function DownloadButton({
  productId,
  fileName,
  className = "",
  disabled = false,
  onDownloadStart,
  onDownloadComplete,
  onDownloadError,
}: DownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    if (isDownloading || disabled) return;

    setIsDownloading(true);
    setError(null);
    onDownloadStart?.();

    try {
      // Only send productId - filePath is fetched server-side from Sanity
      await downloadProduct(productId, fileName);
      onDownloadComplete?.();
    } catch (err: any) {
      // Extract error message from response if available
      let errorMessage = err.message || "Failed to download file";
      
      // If error has details, show them
      if (err.details) {
        errorMessage = `${errorMessage}: ${err.details}`;
      }
      
      setError(errorMessage);
      onDownloadError?.(err);
      console.error("Download error:", {
        message: err.message,
        error: err,
        productId,
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="w-full">
      <motion.button
        onClick={handleDownload}
        disabled={isDownloading || disabled}
        className={`w-full py-3 bg-primary/10 backdrop-blur-md border border-primary/50 rounded-lg text-primary font-semibold flex items-center justify-center gap-2 hover:bg-primary/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        whileHover={!isDownloading && !disabled ? { scale: 1.02 } : {}}
        whileTap={!isDownloading && !disabled ? { scale: 0.98 } : {}}
      >
        {isDownloading ? (
          <>
            <FaSpinner className="animate-spin" />
            Preparing Download...
          </>
        ) : (
          <>
            <FaDownload />
            Download Now
          </>
        )}
      </motion.button>
      {error && (
        <p className="mt-2 text-sm text-red-400 text-center">{error}</p>
      )}
    </div>
  );
}

