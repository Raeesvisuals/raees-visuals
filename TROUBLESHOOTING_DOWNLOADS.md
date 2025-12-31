# Troubleshooting "File not found" Download Errors

## Common Causes

The "File not found" error occurs when the file path in Sanity doesn't match the actual file location in your Cloudflare R2 bucket.

## Step-by-Step Fix

### 1. Check Your Server Console Logs

When you click download, check your terminal (where `npm run dev` is running). You should see logs like:

```
Download request received for productId: text-animation-for-after-effects
Product found: {
  _id: '...',
  title: 'text animation for After Effects',
  slug: 'text-animation-for-after-effects',
  hasDownloadFile: true,
  filePath: 'color grading/luts pro professional color grading pack with 500.zip'
}
Generating signed URL for file: color grading/luts pro professional color grading pack with 500.zip
R2 error: {
  message: 'File not found: color grading/luts pro professional color grading pack with 500.zip',
  ...
}
```

**Note the `filePath` value** - this is what Sanity thinks the file path is.

### 2. Check Your R2 Bucket

1. Go to **Cloudflare Dashboard** → **R2** → **raees-assets** bucket
2. Look at the actual file paths/names in your bucket
3. Compare them to the `filePath` in your Sanity product

### 3. Common Issues

#### Issue 1: Path Mismatch
- **Sanity says**: `color grading/luts pro professional color grading pack with 500.zip`
- **R2 has**: `color-grading/luts-pro.zip`
- **Fix**: Update the `filePath` in Sanity to match exactly what's in R2

#### Issue 2: File Not Uploaded
- **Sanity says**: `products/my-file.zip`
- **R2 has**: File doesn't exist
- **Fix**: Upload the file to R2 first, then use that exact path in Sanity

#### Issue 3: Case Sensitivity
- **Sanity says**: `Products/MyFile.zip`
- **R2 has**: `products/myfile.zip`
- **Fix**: R2 paths are case-sensitive. Match the exact case.

#### Issue 4: Extra Spaces or Special Characters
- **Sanity says**: `color grading/luts pro.zip` (with spaces)
- **R2 has**: `color-grading/luts-pro.zip` (with hyphens)
- **Fix**: Match the exact path, including spaces and special characters

### 4. How to Fix in Sanity Studio

1. Open **Sanity Studio**
2. Go to your product (e.g., "text animation for After Effects")
3. Scroll to **"Download File"** section
4. Check **"File Path in R2"** field
5. Compare it to the actual file path in your R2 bucket
6. Update it to match **exactly** (including folder structure, case, spaces)
7. **Publish** the product

### 5. Example: Correct Setup

**In R2 Bucket:**
```
raees-assets/
  ├── products/
  │   ├── text-animation.zip
  │   └── luts-pro.zip
  └── templates/
      └── wedding-template.aep
```

**In Sanity (for "text animation" product):**
- **File Path in R2**: `products/text-animation.zip`
- **File Name**: `Text Animation Pack.zip` (optional, for display)
- **File Size**: `16600` (bytes)
- **File Format**: `.zip`

### 6. Quick Checklist

- [ ] File exists in R2 bucket
- [ ] File path in Sanity matches R2 path exactly
- [ ] Case matches (uppercase/lowercase)
- [ ] Spaces and special characters match
- [ ] Folder structure matches
- [ ] Product is published in Sanity

### 7. Still Not Working?

Check your server console for the exact error message. It will tell you:
- What file path Sanity is looking for
- What error R2 returned

Share the console output and we can help debug further!

