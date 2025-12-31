# 🔍 Sanity Data Not Showing - Troubleshooting Guide

If your Sanity data is not appearing on your website, follow these steps:

## Step 1: Check Browser Console

1. Open your website in the browser
2. Open Developer Tools (F12)
3. Go to the **Console** tab
4. Look for messages starting with:
   - `🔍 Hero: Fetching data from Sanity...`
   - `📋 Sanity config:`
   - `✅ Hero: Data fetched:`
   - `❌ Hero: Error fetching data:`

**What to look for:**
- If you see `projectId: undefined` or `dataset: undefined` → Environment variables are missing
- If you see errors → Check the error message
- If you see `No data found` → Data doesn't exist in Sanity yet

---

## Step 2: Verify Environment Variables in Vercel

1. Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**

2. **Verify these variables exist:**
   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID = st67411b
   NEXT_PUBLIC_SANITY_DATASET = production
   SANITY_API_TOKEN = [Your token]
   ```

3. **Important:** 
   - Variables must have **NEXT_PUBLIC_** prefix to work in the browser
   - Make sure they're set for **Production** environment
   - After adding/changing variables, **Redeploy** your site

4. **To Redeploy:**
   - Go to **Deployments** tab
   - Click **"..."** on latest deployment
   - Click **"Redeploy"**

---

## Step 3: Check if Data Exists in Sanity

Your website is looking for a document with `_type == "home"`. 

1. **Open Sanity Studio:**
   - Go to: https://st67411b.api.sanity.io/v2024-01-01/data/query/production
   - Or open your Sanity Studio locally

2. **Check for "Home" document:**
   - In Sanity Studio, look for a document type called **"Home"**
   - If it doesn't exist, you need to create it
   - If it exists but is empty, add content to it

3. **Required fields for Home document:**
   - `heroTitle` (optional)
   - `heroTagline` (optional)
   - `heroDescription` (optional)
   - `servicesTitle` (optional)
   - `services` (array, optional)
   - etc.

---

## Step 4: Test Sanity Connection

You can test if Sanity is accessible by running this in your browser console:

```javascript
fetch('https://st67411b.api.sanity.io/v2024-01-01/data/query/production?query=*[_type == "home"][0]')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);
```

**Expected result:**
- If successful: You'll see JSON data
- If failed: You'll see an error (CORS, network, etc.)

---

## Step 5: Common Issues & Solutions

### Issue: "projectId: undefined" in console
**Solution:** 
- Add `NEXT_PUBLIC_SANITY_PROJECT_ID` in Vercel
- Redeploy after adding

### Issue: "No data found" but data exists in Sanity
**Solution:**
- Check dataset name matches (`production`)
- Check document type matches (`home`)
- Make sure document is **published** (not draft)

### Issue: CORS errors
**Solution:**
- Sanity CDN should handle CORS automatically
- If errors persist, check Sanity project settings

### Issue: Data shows locally but not on Vercel
**Solution:**
- Environment variables are different between local and Vercel
- Make sure all `NEXT_PUBLIC_*` variables are set in Vercel
- Redeploy after adding variables

---

## Step 6: Quick Fix Checklist

- [ ] Environment variables added in Vercel (with NEXT_PUBLIC_ prefix)
- [ ] Site redeployed after adding variables
- [ ] "Home" document exists in Sanity Studio
- [ ] "Home" document is published (not draft)
- [ ] Browser console shows no errors
- [ ] Network tab shows successful requests to Sanity API

---

## Still Not Working?

If you've checked everything above and data still isn't showing:

1. **Share the browser console output** - Look for any error messages
2. **Check Vercel build logs** - See if there are any errors during build
3. **Verify Sanity project ID** - Make sure `st67411b` is correct
4. **Check Sanity dataset** - Make sure `production` is correct

---

## Need Help?

Check the browser console first - the debugging logs will tell you exactly what's wrong!

