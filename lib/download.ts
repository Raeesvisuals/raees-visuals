/**
 * Frontend Download Handler
 * 
 * Handles product downloads on the client side.
 * 
 * Flow:
 * 1. User clicks download button
 * 2. Frontend calls API to get signed URL
 * 3. Frontend opens/downloads file from signed URL
 * 4. Shows download progress and handles errors
 * 
 * Future: Add download tracking, progress indicators, retry logic
 */

/**
 * Download a product file
 * 
 * @param productId - Product slug from Sanity
 * @param fileName - Optional: Custom filename for download (will be fetched from API if not provided)
 * @returns Promise<void>
 * 
 * SECURITY: Only sends productId to API. File path is fetched server-side from Sanity.
 * 
 * Future: Add progress callback, retry logic, download tracking
 */
export async function downloadProduct(
  productId: string,
  fileName?: string
): Promise<void> {
  try {
    // Request signed URL from API (only send productId, never filePath)
    const response = await fetch("/api/download", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId,
      }),
    });

    if (!response.ok) {
      // Try to parse error as JSON, but handle HTML error pages
      let errorMessage = "Failed to generate download URL";
      try {
        const contentType = response.headers.get("content-type");
        if (contentType?.includes("application/json")) {
          const error = await response.json();
          errorMessage = error.error || errorMessage;
        } else {
          // If it's HTML (error page), get status text
          errorMessage = `${response.status}: ${response.statusText}`;
        }
      } catch (e) {
        errorMessage = `${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    const { downloadUrl, expiresIn, fileName: apiFileName } = await response.json();

    // Instead of fetching the signed URL directly (which causes CORS issues),
    // we'll create a temporary link and let the browser handle the download
    // This works because the browser treats it as a navigation, not a fetch request
    
    // Create a temporary anchor element and trigger download
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = fileName || apiFileName || "download";
    link.target = "_blank"; // Open in new tab as fallback
    link.rel = "noopener noreferrer"; // Security best practice
    
    // Append to body, click, then remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Note: For very large files, you might want to show a loading indicator
    // The browser will handle the download automatically

    // Future: Track successful download
    // await trackDownload(productId, filePath);
  } catch (error: any) {
    console.error("Download error:", error);
    throw error;
  }
}

/**
 * Download with progress tracking
 * 
 * @param productId - Product slug from Sanity
 * @param onProgress - Callback for download progress (0-100)
 * @param fileName - Optional: Custom filename (will be fetched from API if not provided)
 * 
 * SECURITY: Only sends productId to API. File path is fetched server-side.
 * 
 * Future: Implement progress tracking for large files
 */
export async function downloadProductWithProgress(
  productId: string,
  onProgress?: (progress: number) => void,
  fileName?: string
): Promise<void> {
  try {
    // Get signed URL (only send productId, never filePath)
    const response = await fetch("/api/download", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId,
      }),
    });

    if (!response.ok) {
      // Try to parse error as JSON, but handle HTML error pages
      let errorMessage = "Failed to generate download URL";
      let errorDetails = null;
      try {
        const contentType = response.headers.get("content-type");
        if (contentType?.includes("application/json")) {
          const error = await response.json();
          errorMessage = error.error || errorMessage;
          errorDetails = error.details || null;
        } else {
          // If it's HTML (error page), get status text
          errorMessage = `${response.status}: ${response.statusText}`;
        }
      } catch (e) {
        errorMessage = `${response.status}: ${response.statusText}`;
      }
      
      const downloadError: any = new Error(errorMessage);
      if (errorDetails) {
        downloadError.details = errorDetails;
      }
      throw downloadError;
    }

    const { downloadUrl, fileName: apiFileName } = await response.json();

    // For progress tracking with direct download, we use the same approach
    // The browser's native download manager will show progress
    // Note: We can't track progress when using direct link download,
    // but it avoids CORS issues and works for large files
    
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = fileName || apiFileName || "download";
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // If progress callback is provided, we can simulate it
    // (actual progress is handled by browser's download manager)
    if (onProgress) {
      // Simulate progress since we can't track it directly
      onProgress(10);
      setTimeout(() => onProgress(50), 100);
      setTimeout(() => onProgress(100), 500);
    }
  } catch (error: any) {
    console.error("Download error:", error);
    throw error;
  }
}

