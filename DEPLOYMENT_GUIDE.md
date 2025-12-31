# 🚀 Vercel Deployment Guide for www.raeesvisuals.com

Complete step-by-step guide to deploy your Next.js website to Vercel with your custom domain.

---

## 📋 Prerequisites Checklist

Before starting, make sure you have:
- ✅ Vercel account (free tier works)
- ✅ Domain `raeesvisuals.com` (or access to DNS settings)
- ✅ All environment variables ready (see below)
- ✅ Git repository (GitHub, GitLab, or Bitbucket)

---

## Step 1: Prepare Your Project

### 1.1 Ensure Your Code is Ready
```bash
# Navigate to your project
cd Portfolio/web

# Test the build locally
npm run build

# If build succeeds, you're ready!
```

### 1.2 Commit Your Code to Git
```bash
# Make sure all changes are committed
git add .
git commit -m "Ready for production deployment"
git push
```

---

## Step 2: Connect Project to Vercel

### Option A: Using Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Sign in or create an account

2. **Import Your Project**
   - Click **"Add New..."** → **"Project"**
   - Click **"Import Git Repository"**
   - Select your repository (GitHub/GitLab/Bitbucket)
   - If not connected, authorize Vercel to access your Git provider

3. **Configure Project**
   - **Framework Preset**: Next.js (should auto-detect)
   - **Root Directory**: `Portfolio/web` (IMPORTANT!)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm ci` (default)

4. **Click "Deploy"** (we'll add environment variables next)

### Option B: Using Vercel CLI

```bash
# Install Vercel CLI globally
npm i -g vercel

# Navigate to your project
cd Portfolio/web

# Login to Vercel
vercel login

# Deploy (follow prompts)
vercel

# For production deployment
vercel --prod
```

---

## Step 3: Configure Environment Variables

**CRITICAL**: Your site won't work without these environment variables!

### 3.1 In Vercel Dashboard:

1. Go to your project → **Settings** → **Environment Variables**

2. Add each variable below (click "Add" for each):

#### Required Sanity Variables:
```
NEXT_PUBLIC_SANITY_PROJECT_ID = st67411b
NEXT_PUBLIC_SANITY_DATASET = production
SANITY_API_TOKEN = [Your Sanity API Token from https://www.sanity.io/manage]
```

#### Required Cloudflare R2 Variables:
```
R2_ACCOUNT_ID = [Your Cloudflare Account ID]
R2_ENDPOINT = https://[YOUR_ACCOUNT_ID].r2.cloudflarestorage.com
R2_ACCESS_KEY_ID = [Your R2 Access Key ID]
R2_SECRET_ACCESS_KEY = [Your R2 Secret Access Key]
R2_BUCKET_NAME = raees-assets
```

#### Optional but Recommended:
```
NEXT_PUBLIC_APP_URL = https://www.raeesvisuals.com
NODE_ENV = production
```

3. **Set Environment**: Select **"Production"** (and optionally "Preview" and "Development")

4. **Save** all variables

### 3.2 Where to Find Your Values:

- **Sanity API Token**: 
  - Go to https://www.sanity.io/manage
  - Select your project → **API** → **Tokens**
  - Create new token with **Editor** permissions

- **Cloudflare R2 Credentials**:
  - Go to Cloudflare Dashboard → **R2**
  - Your bucket → **Settings** → **API Tokens**
  - Create API token with read permissions

---

## Step 4: Configure Custom Domain

### 4.1 Add Domain in Vercel

1. Go to your project → **Settings** → **Domains**

2. **Add Domain**:
   - Enter: `www.raeesvisuals.com`
   - Click **"Add"**

3. Vercel will show you DNS records to configure

### 4.2 Configure DNS (At Your Domain Registrar)

You need to add DNS records at your domain registrar (GoDaddy, Namecheap, etc.)

#### Option A: Using CNAME (Recommended for www)

Add this CNAME record:
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: Auto (or 3600)
```

#### Option B: Using A Record (If CNAME not supported)

Add this A record:
```
Type: A
Name: www
Value: 76.76.21.21
TTL: Auto (or 3600)
```

### 4.3 Optional: Add Root Domain (raeesvisuals.com)

If you want `raeesvisuals.com` (without www) to work:

1. In Vercel: Add domain `raeesvisuals.com`
2. Add DNS record:
   ```
   Type: A
   Name: @ (or leave blank)
   Value: 76.76.21.21
   TTL: Auto
   ```

### 4.4 Wait for DNS Propagation

- DNS changes can take **5 minutes to 48 hours**
- Vercel will show status: "Valid Configuration" when ready
- Check status in Vercel dashboard

---

## Step 5: Redeploy After Adding Environment Variables

After adding environment variables, you **must redeploy**:

1. Go to **Deployments** tab
2. Click **"..."** on latest deployment → **"Redeploy"**
3. Or push a new commit to trigger automatic deployment

---

## Step 6: Verify Deployment

### 6.1 Check Build Logs

1. Go to **Deployments** tab
2. Click on latest deployment
3. Check **"Build Logs"** for any errors

### 6.2 Test Your Site

Visit your deployment URL:
- Production: `https://your-project.vercel.app`
- Custom domain: `https://www.raeesvisuals.com` (after DNS propagates)

### 6.3 Test Key Features

- ✅ Homepage loads
- ✅ Blog posts display (Sanity connection)
- ✅ Shop products display
- ✅ Download functionality works (R2 connection)
- ✅ Images load correctly

---

## 🔧 Troubleshooting

### Build Fails

**Error**: "Module not found"
- **Fix**: Make sure **Root Directory** is set to `Portfolio/web` in Vercel settings

**Error**: "Environment variable not set"
- **Fix**: Double-check all environment variables are added in Vercel dashboard

**Error**: "ESLint warnings"
- **Fix**: Already handled! `next.config.js` has `ignoreDuringBuilds: true`

### Site Works But Features Don't

**Sanity not loading**:
- Check `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET`
- Verify Sanity API token has correct permissions

**Downloads not working**:
- Check all R2 environment variables are set
- Verify R2 bucket name matches
- Check R2 API token has read permissions

**Domain not working**:
- Wait 24-48 hours for DNS propagation
- Verify DNS records are correct
- Check domain status in Vercel dashboard

### SSL Certificate Issues

- Vercel automatically provisions SSL certificates
- Wait 5-10 minutes after domain configuration
- If issues persist, contact Vercel support

---

## 📝 Quick Reference: Environment Variables Checklist

Copy-paste this list and check off as you add:

```
☐ NEXT_PUBLIC_SANITY_PROJECT_ID = st67411b
☐ NEXT_PUBLIC_SANITY_DATASET = production
☐ SANITY_API_TOKEN = [Your token]
☐ R2_ACCOUNT_ID = [Your account ID]
☐ R2_ENDPOINT = https://[ACCOUNT_ID].r2.cloudflarestorage.com
☐ R2_ACCESS_KEY_ID = [Your access key]
☐ R2_SECRET_ACCESS_KEY = [Your secret key]
☐ R2_BUCKET_NAME = raees-assets
☐ NEXT_PUBLIC_APP_URL = https://www.raeesvisuals.com
☐ NODE_ENV = production
```

---

## 🎉 Success!

Once deployed, your site will be live at:
- **Production URL**: `https://www.raeesvisuals.com`
- **Vercel URL**: `https://your-project.vercel.app` (also works)

### Next Steps:

1. **Monitor**: Check Vercel dashboard for analytics
2. **Update**: Push code changes → automatic deployments
3. **Backup**: Keep your `.env.local` file safe locally
4. **Optimize**: Enable Vercel Analytics and Speed Insights

---

## 💡 Pro Tips

- **Automatic Deployments**: Every push to `main` branch auto-deploys
- **Preview Deployments**: Every PR gets a preview URL
- **Rollback**: Click "..." on any deployment → "Promote to Production"
- **Environment Variables**: Can be different for Production/Preview/Development

---

## 🆘 Need Help?

- **Vercel Docs**: https://vercel.com/docs
- **Vercel Support**: https://vercel.com/support
- **Next.js Deployment**: https://nextjs.org/docs/deployment

---

**Good luck with your deployment! 🚀**

