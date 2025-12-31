# Download Metadata Automation Summary

## Overview
Automated metadata handling for downloadable products to eliminate manual data entry and make R2 the source of truth.

## Automations Implemented

### 1. **Fetch File Size from R2** ✅
- **Location**: `app/api/download/route.ts`
- **Method**: Uses `getFileMetadataSafe()` to fetch `ContentLength` from R2
- **Behavior**: Non-blocking - downloads work even if metadata fetch fails
- **Updates**: Automatically updates `downloadFile.fileSize` in Sanity if missing or different

### 2. **Auto-Derive File Format** ✅
- **Location**: `lib/fileMetadata.ts` - `deriveFileFormat()`
- **Method**: Extracts extension from `filePath` or `fileName`
- **Example**: `"products/template.zip"` → `".zip"`
- **Updates**: Automatically sets `downloadFile.fileFormat` if missing

### 3. **Auto-Derive MIME Type** ✅
- **Location**: `lib/fileMetadata.ts` - `deriveMimeType()`
- **Method**: Maps file extension to MIME type (100+ formats supported)
- **Example**: `".zip"` → `"application/zip"`, `".mp4"` → `"video/mp4"`
- **Updates**: Automatically sets `downloadFile.mimeType` if missing
- **Fallback**: Uses R2's `ContentType` if available, otherwise derived MIME type

### 4. **Increment Download Count** ✅
- **Location**: `app/api/download/route.ts`
- **Method**: Uses `setImmediate()` to update asynchronously (non-blocking)
- **Updates**: Increments `downloads` field in Sanity after successful download
- **Behavior**: Download completes even if count update fails

### 5. **Auto-Calculate "isNew"** ✅
- **Location**: `lib/fileMetadata.ts` - `calculateIsNew()`
- **Method**: Compares `createdAt` date to current date
- **Threshold**: 14 days (configurable)
- **Frontend**: `Shop.tsx` uses `calculateIsNew()` to show "NEW" badge
- **Behavior**: Works with both manual `isNew` flag and auto-calculated value

## Automation Flow

```
User clicks "Download"
    ↓
API receives productId
    ↓
Fetch product from Sanity
    ↓
Get filePath from product.downloadFile
    ↓
[PARALLEL - Non-blocking]
    ├─→ Fetch file metadata from R2 (size, contentType)
    ├─→ Derive fileFormat from filePath/fileName
    ├─→ Derive mimeType from extension
    └─→ Generate signed download URL
    ↓
Return signed URL to client
    ↓
[ASYNC - After download starts]
    ├─→ Update Sanity: fileSize, fileFormat, mimeType (if missing)
    └─→ Increment download count
```

## Safety Rules

✅ **Never blocks downloads**: All metadata operations are non-blocking
- Uses `setImmediate()` for async updates
- Catches and logs errors without throwing
- Downloads work even if metadata update fails

✅ **Never trusts client input**: 
- File path always fetched from Sanity (server-side)
- No client-provided paths accepted

✅ **No R2 config changes**: 
- Only reads metadata, never modifies bucket
- Uses existing R2 client configuration

✅ **Backward compatible**:
- Works with existing products (missing metadata)
- Gracefully handles legacy fields
- No breaking changes to API or frontend

## Required Environment Variable

Add to `.env.local`:
```env
SANITY_API_TOKEN=your-sanity-api-token-here
```

**How to get token:**
1. Go to https://www.sanity.io/manage
2. Select your project
3. Go to "API" → "Tokens"
4. Create new token with "Editor" permissions
5. Copy token to `.env.local`

**Note**: Token is only needed for write operations (updating metadata). Reads work without it.

## Supported File Formats

The MIME type derivation supports 100+ formats including:
- **Archives**: zip, rar, 7z, tar, gz
- **Video**: mp4, mov, avi, mkv, webm
- **Audio**: mp3, wav, aac, ogg, flac
- **Images**: jpg, png, gif, webp, svg
- **Documents**: pdf, doc, docx, xls, xlsx
- **Creative Cloud**: aep, prproj, psd, ai, indd
- **3D/VFX**: fbx, obj, dae, blend, max, c4d
- **Color Grading**: cube, 3dl, look
- And many more...

## Benefits

1. **Zero Manual Entry**: File size, format, and MIME type auto-populated
2. **R2 as Source of Truth**: File metadata fetched directly from R2
3. **Accurate Download Counts**: Automatically tracked
4. **Smart "NEW" Badges**: Auto-calculated based on creation date
5. **Error Resilient**: Downloads never fail due to metadata issues
6. **Future-Proof**: Easy to add more automations later

## Testing

After adding `SANITY_API_TOKEN` to `.env.local`:

1. **Test download**: Click download on a product
2. **Check server logs**: Should see "Product metadata updated automatically"
3. **Check Sanity Studio**: Product should have updated `fileSize`, `fileFormat`, `mimeType`
4. **Check download count**: Should increment after each download
5. **Check "NEW" badge**: Should appear for products created within 14 days

## Troubleshooting

**Metadata not updating?**
- Check `SANITY_API_TOKEN` is set in `.env.local`
- Check token has "Editor" permissions
- Check server console for error messages
- Downloads still work even if metadata update fails

**Download count not incrementing?**
- Check `SANITY_API_TOKEN` is set
- Check server console for errors
- Count updates asynchronously (may take a moment)

**"NEW" badge not showing?**
- Check product has `createdAt` field
- Default threshold is 14 days (can be changed in `calculateIsNew()`)

