/**
 * File Metadata Utilities
 * 
 * Auto-derives file metadata from file paths and extensions.
 * Used to populate product downloadFile fields automatically.
 */

/**
 * Derive file format (extension) from file path or name
 * 
 * @param filePath - Full file path (e.g., "products/template.zip")
 * @param fileName - Optional file name (e.g., "Template Pack.zip")
 * @returns File format with dot (e.g., ".zip") or undefined
 */
export function deriveFileFormat(filePath?: string, fileName?: string): string | undefined {
  // Try fileName first, then filePath
  const source = fileName || filePath;
  if (!source) return undefined;

  // Match file extension (case insensitive)
  const match = source.match(/\.([a-z0-9]+)$/i);
  if (match) {
    return `.${match[1].toLowerCase()}`;
  }

  return undefined;
}

/**
 * Derive MIME type from file extension
 * 
 * @param fileFormat - File format with dot (e.g., ".zip")
 * @returns MIME type string or undefined
 */
export function deriveMimeType(fileFormat?: string): string | undefined {
  if (!fileFormat) return undefined;

  const extension = fileFormat.toLowerCase().replace(/^\./, "");

  // Common MIME type mappings
  const mimeTypes: Record<string, string> = {
    // Archives
    zip: "application/zip",
    rar: "application/x-rar-compressed",
    "7z": "application/x-7z-compressed",
    tar: "application/x-tar",
    gz: "application/gzip",

    // Video
    mp4: "video/mp4",
    mov: "video/quicktime",
    avi: "video/x-msvideo",
    mkv: "video/x-matroska",
    webm: "video/webm",
    m4v: "video/x-m4v",

    // Audio
    mp3: "audio/mpeg",
    wav: "audio/wav",
    aac: "audio/aac",
    ogg: "audio/ogg",
    flac: "audio/flac",
    m4a: "audio/mp4",

    // Images
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    webp: "image/webp",
    svg: "image/svg+xml",
    bmp: "image/bmp",

    // Documents
    pdf: "application/pdf",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    xls: "application/vnd.ms-excel",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ppt: "application/vnd.ms-powerpoint",
    pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",

    // After Effects / Creative Cloud
    aep: "application/x-after-effects",
    aepx: "application/x-after-effects",
    prproj: "application/x-premiere-pro",
    fcp: "application/x-final-cut-pro",
    fcpxml: "application/xml",
    psd: "image/vnd.adobe.photoshop",
    ai: "application/postscript",
    indd: "application/x-indesign",

    // 3D / VFX
    fbx: "application/octet-stream",
    obj: "application/octet-stream",
    dae: "application/xml",
    blend: "application/x-blender",
    max: "application/x-3ds-max",
    c4d: "application/x-cinema-4d",

    // Color Grading
    cube: "application/octet-stream",
    "3dl": "application/octet-stream",
    look: "application/octet-stream",

    // Text
    txt: "text/plain",
    json: "application/json",
    xml: "application/xml",
    csv: "text/csv",
    html: "text/html",
    css: "text/css",
    js: "application/javascript",
    ts: "application/typescript",
  };

  return mimeTypes[extension] || "application/octet-stream";
}

/**
 * Calculate if product is "new" based on createdAt date
 * 
 * @param createdAt - ISO date string
 * @param daysThreshold - Number of days to consider "new" (default: 14)
 * @returns boolean
 */
export function calculateIsNew(createdAt?: string, daysThreshold: number = 14): boolean {
  if (!createdAt) return false;

  const createdDate = new Date(createdAt);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - createdDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays <= daysThreshold;
}

