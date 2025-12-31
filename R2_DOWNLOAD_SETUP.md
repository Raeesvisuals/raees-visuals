# Cloudflare R2 Download System Setup

## Overview

This system enables secure downloads of large digital files (up to 500MB+) stored in Cloudflare R2. Files are stored privately and accessed via temporary signed URLs that expire after 10 minutes.

## Architecture

```
User clicks Download
    ↓
Frontend calls /api/download
    ↓
API generates signed URL from R2
    ↓
Frontend downloads file from signed URL
    ↓
File downloads directly from R2
```

## Components

### 1. R2 Client (`lib/r2.ts`)
- Handles all R2 interactions
- Generates signed URLs
- Validates file existence
- Future: Upload, delete, metadata management

### 2. Download API Route (`app/api/download/route.ts`)
- Generates temporary signed URLs
- Validates requests
- Future: Authentication, payment checks, download limits

### 3. Frontend Download Handler (`lib/download.ts`)
- Handles download flow on client
- Shows progress for large files
- Future: Retry logic, download tracking

### 4. Download Button Component (`components/DownloadButton.tsx`)
- Reusable download button with loading states
- Error handling
- Progress indicators

## Setup Instructions

### Step 1: Create Cloudflare R2 Bucket

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **R2** → **Create Bucket**
3. Name your bucket (e.g., `raees-products`)
4. Set bucket to **Private** (no public access)

### Step 2: Create R2 API Token

1. In Cloudflare Dashboard, go to **R2** → **Manage R2 API Tokens**
2. Click **Create API Token**
3. Set permissions:
   - **Object Read & Write** (for downloads and future uploads)
4. Copy the **Access Key ID** and **Secret Access Key**

### Step 3: Get R2 Endpoint

Your R2 endpoint will be:
```
https://<account-id>.r2.cloudflarestorage.com
```

Find your account ID in the Cloudflare Dashboard URL or R2 settings.

### Step 4: Configure Environment Variables

Add these to your `.env.local` file:

```env
# Cloudflare R2 Configuration
R2_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=your-access-key-id
R2_SECRET_ACCESS_KEY=your-secret-access-key
R2_BUCKET_NAME=your-bucket-name
R2_PUBLIC_URL=https://your-custom-domain.com  # Optional: Custom domain
```

### Step 5: Upload Files to R2

**Option A: Using Cloudflare Dashboard**
1. Go to your R2 bucket in Cloudflare Dashboard
2. Click **Upload**
3. Upload your files
4. Note the file path (e.g., `products/wedding-template.zip`)

**Option B: Using R2 API (Future)**
- We can add an upload API route later if needed

### Step 6: Update Product in Sanity

When creating/editing a product in Sanity Studio:

1. Fill in the **Download File** section:
   - **File Path in R2**: `products/wedding-template.zip` (the path in your bucket)
   - **File Name**: `Wedding Template Pack.zip` (display name)
   - **File Size (bytes)**: `15728640` (file size in bytes)
   - **File Format**: `.zip` (file extension)
   - **MIME Type**: `application/zip` (MIME type)

2. Set **Price** to `0` for free products

## File Path Structure

Recommended structure in R2:
```
products/
  ├── wedding-template.zip
  ├── cinematic-lut-pack.cube
  ├── motion-graphics.aep
  └── sound-fx-library/
      ├── sound1.wav
      └── sound2.wav
```

## Usage Examples

### In Product Detail Page

```tsx
import DownloadButton from "@/components/DownloadButton";

<DownloadButton
  productId={product.slug.current}
  filePath={product.downloadFile.filePath}
  fileName={product.downloadFile.fileName}
/>
```

### Programmatic Download

```tsx
import { downloadProduct } from "@/lib/download";

await downloadProduct(
  "product-slug",
  "products/wedding-template.zip",
  "Wedding Template Pack.zip"
);
```

## Security Features

✅ **Private Bucket**: No public access to files
✅ **Signed URLs**: Temporary URLs expire after 10 minutes
✅ **Server-Side Generation**: URLs only generated via API
✅ **File Validation**: Checks file exists before generating URL
✅ **Future-Ready**: Architecture supports authentication and payment checks

## Future Enhancements

The code is structured to easily add:

1. **Authentication**: Check if user is logged in
2. **Payment Verification**: Verify user purchased the product
3. **Download Limits**: Limit downloads per user/product
4. **Download Tracking**: Log all downloads
5. **Progress Tracking**: Show download progress for large files
6. **Retry Logic**: Automatic retry on failed downloads
7. **Upload API**: Allow uploading files via API

## Testing

1. Create a test product in Sanity with a file path
2. Upload a test file to R2
3. Click download on the product page
4. Verify file downloads correctly

## Troubleshooting

**Error: "File not found"**
- Check file path in Sanity matches R2 path exactly
- Verify file exists in R2 bucket
- Check file path doesn't have leading/trailing slashes

**Error: "Failed to generate download URL"**
- Verify R2 credentials are correct
- Check R2 endpoint URL is correct
- Ensure bucket name matches

**Error: "Missing R2 environment variables"**
- Add all required env vars to `.env.local`
- Restart Next.js dev server after adding env vars

## File Size Limits

- R2 supports files up to 5GB
- Current setup handles 500MB+ files
- Large files use streaming download with progress tracking

