# Auto-Fill Product Metadata Guide

## 🎯 What This Does

When you create a new product in Sanity Studio, you can now **automatically fill in**:
- ✅ **File Size** - Fetched from R2 (no more manual entry!)
- ✅ **File Format** - Auto-derived from file path/name (e.g., `.zip`, `.aep`)
- ✅ **MIME Type** - Auto-derived from extension (e.g., `application/zip`)
- ✅ **Is New** - Auto-calculated based on creation date (14 days)

## 🚀 How to Use

### Method 1: Button in Sanity Studio (Easiest!)

1. **Open Sanity Studio** (usually `http://localhost:3333`)
2. **Create or edit a product**
3. **Fill in the basic info**:
   - Title
   - Description
   - Categories
   - Price
   - **Download File → File Path in R2** (e.g., `products/my-file.zip`)
4. **Click the "Auto-Fill Metadata" button** in the document actions menu (top right)
5. **Wait a few seconds** - metadata will be auto-filled!
6. **Publish** your product

### Method 2: API Call (For Bulk Updates)

You can also call the API directly:

```bash
curl -X POST http://localhost:3000/api/products/auto-fill-metadata \
  -H "Content-Type: application/json" \
  -d '{"productId": "your-product-id-or-slug"}'
```

## 📋 Step-by-Step: Adding a New Product

### Before (Manual - Takes 5+ minutes):
1. Create product
2. Fill title, description, categories
3. **Manually type file size** (e.g., "2.3 MB")
4. **Manually type file format** (e.g., ".zip")
5. **Manually type MIME type** (e.g., "application/zip")
6. Check "Is New" checkbox
7. Publish

### After (Automated - Takes 30 seconds):
1. Create product
2. Fill title, description, categories
3. **Enter file path in R2** (e.g., `products/my-file.zip`)
4. **Click "Auto-Fill Metadata" button** ✨
5. **Done!** All metadata auto-filled
6. Publish

## 🔧 Setup Required

### 1. Sanity API Token

Add to `Portfolio/web/.env.local`:
```env
SANITY_API_TOKEN=your-sanity-api-token-here
```

**How to get token:**
1. Go to https://www.sanity.io/manage
2. Select your project (`st67411b`)
3. Go to **"API"** → **"Tokens"**
4. Click **"Add API token"**
5. Name it: "Auto-Fill Metadata"
6. Permissions: **"Editor"** (needs write access)
7. Copy the token to `.env.local`

### 2. Restart Dev Servers

After adding the token:
```bash
# Stop both servers (Ctrl+C)
# Then restart:

# Terminal 1: Next.js
cd Portfolio/web
npm run dev

# Terminal 2: Sanity Studio
cd Portfolio/sanity
npm run dev
```

## ✅ What Gets Auto-Filled

### File Size
- **Source**: Fetched from R2 (actual file size)
- **Field**: `downloadFile.fileSize` (in bytes)
- **Example**: `2400000` bytes = 2.4 MB

### File Format
- **Source**: Extracted from `filePath` or `fileName`
- **Field**: `downloadFile.fileFormat`
- **Example**: `products/template.zip` → `.zip`

### MIME Type
- **Source**: Derived from file extension (100+ formats supported)
- **Field**: `downloadFile.mimeType`
- **Example**: `.zip` → `application/zip`, `.mp4` → `video/mp4`

### Is New
- **Source**: Calculated from `createdAt` date
- **Field**: `isNew`
- **Logic**: `true` if product created within last 14 days

## 🎨 Supported File Formats

The system automatically recognizes 100+ file formats:

- **Archives**: `.zip`, `.rar`, `.7z`, `.tar`, `.gz`
- **Video**: `.mp4`, `.mov`, `.avi`, `.mkv`, `.webm`
- **Audio**: `.mp3`, `.wav`, `.aac`, `.ogg`, `.flac`
- **Images**: `.jpg`, `.png`, `.gif`, `.webp`, `.svg`
- **Documents**: `.pdf`, `.doc`, `.docx`, `.xls`, `.xlsx`
- **Creative Cloud**: `.aep`, `.prproj`, `.psd`, `.ai`, `.indd`
- **3D/VFX**: `.fbx`, `.obj`, `.dae`, `.blend`, `.max`, `.c4d`
- **Color Grading**: `.cube`, `.3dl`, `.look`
- And many more!

## 🐛 Troubleshooting

### "Auto-Fill Metadata" button not showing?
- ✅ Make sure you're editing a **Product** document (not other types)
- ✅ Check that the plugin is loaded (restart Sanity Studio)
- ✅ Check browser console for errors

### "Failed to auto-fill metadata" error?
- ✅ Check `SANITY_API_TOKEN` is set in `.env.local`
- ✅ Check token has "Editor" permissions
- ✅ Make sure Next.js dev server is running (`npm run dev` in `Portfolio/web`)
- ✅ Check server console for detailed error messages

### File size not updating?
- ✅ Make sure file exists in R2 at the specified path
- ✅ Check file path matches exactly (case-sensitive)
- ✅ Check server console for R2 errors

### Metadata updates but doesn't show in Studio?
- ✅ Click "Auto-Fill Metadata" again (it only updates missing fields)
- ✅ Refresh the page
- ✅ Check that you're looking at the right product

## 💡 Pro Tips

1. **Upload file to R2 first**, then use that exact path in Sanity
2. **Use the button after** entering the file path (it needs the path to work)
3. **Check server console** to see what's being updated
4. **The button is safe** - it only fills missing fields, won't overwrite existing data

## 📊 Example Workflow

```
1. Upload "wedding-template.zip" to R2
   → Path: "products/wedding-template.zip"
   → Size: 2,400,000 bytes

2. Create product in Sanity:
   - Title: "Wedding Template Pack"
   - File Path: "products/wedding-template.zip"
   
3. Click "Auto-Fill Metadata" button
   → fileSize: 2400000 ✅
   → fileFormat: ".zip" ✅
   → mimeType: "application/zip" ✅
   → isNew: true ✅ (if created today)

4. Publish - Done! 🎉
```

## 🎉 Benefits

- ⚡ **10x Faster**: 30 seconds vs 5+ minutes per product
- ✅ **No Errors**: File size always accurate (from R2)
- 🎯 **Consistent**: Format and MIME type always correct
- 🤖 **Automatic**: "Is New" badge auto-calculated
- 📦 **Future-Proof**: Easy to add more automations

Enjoy your streamlined product creation! 🚀

