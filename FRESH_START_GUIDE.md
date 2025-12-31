# 🆕 Fresh Start Guide - Clean Git & Vercel Setup

Complete guide to delete everything and start fresh with a clean deployment.

---

## ⚠️ WARNING: This will DELETE existing data

**What will be deleted:**
- ✅ All Git history (local and remote)
- ✅ All Vercel deployments
- ✅ All Vercel project settings

**What will be KEPT:**
- ✅ Your local code files (we'll create a new repo)
- ✅ Your environment variables (you'll need to re-add them)

---

## Step 1: Delete Vercel Project

### Option A: Via Vercel Dashboard

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Find your project (likely named `raees-visuals-portfolio` or similar)

2. **Delete Project**
   - Click on your project
   - Go to **Settings** → Scroll to bottom
   - Click **"Delete Project"**
   - Type project name to confirm
   - Click **"Delete"**

### Option B: Via Vercel CLI

```powershell
# If you have Vercel CLI installed
cd I:\portfolio\website\Portfolio\web
vercel remove [project-name]
```

---

## Step 2: Delete Git Repository

### 2.1 Delete Remote Repository (GitHub/GitLab/Bitbucket)

**If using GitHub:**
1. Go to: https://github.com/Raeesvisuals/raees-visuals-portfolio
2. Click **Settings** (top right)
3. Scroll to **"Danger Zone"**
4. Click **"Delete this repository"**
5. Type repository name to confirm
6. Click **"I understand the consequences, delete this repository"**

**If using GitLab/Bitbucket:**
- Similar process: Settings → Delete Repository

### 2.2 Delete Local Git Repository

```powershell
# Navigate to your project
cd I:\portfolio\website\Portfolio\web

# Remove Git tracking (keeps your files)
Remove-Item -Recurse -Force .git

# Verify it's gone
git status
# Should say: "fatal: not a git repository"
```

---

## Step 3: Clean Up Local Files (Optional)

If you want to remove any build artifacts:

```powershell
cd I:\portfolio\website\Portfolio\web

# Remove build folders
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force .vercel -ErrorAction SilentlyContinue

# Remove lock file (optional - we'll regenerate)
Remove-Item package-lock.json -ErrorAction SilentlyContinue
```

---

## Step 4: Fresh Git Setup

### 4.1 Initialize New Git Repository

```powershell
cd I:\portfolio\website\Portfolio\web

# Initialize fresh Git repo
git init

# Create .gitignore if it doesn't exist (it should already exist)
# Verify it includes .env files
```

### 4.2 Create Initial Commit

```powershell
# Add all files
git add .

# Create initial commit
git commit -m "Initial commit - Fresh start"

# Verify
git log
```

### 4.3 Create New Remote Repository

**Option A: GitHub (Recommended)**

1. **Create New Repository on GitHub**
   - Go to: https://github.com/new
   - Repository name: `raees-visuals-portfolio` (or any name you prefer)
   - Description: "Raees Visuals Portfolio Website"
   - Choose: **Private** (recommended) or **Public**
   - **DO NOT** initialize with README, .gitignore, or license
   - Click **"Create repository"**

2. **Connect Local to Remote**
   ```powershell
   cd I:\portfolio\website\Portfolio\web
   
   # Add remote (replace YOUR_USERNAME with your GitHub username)
   git remote add origin https://github.com/YOUR_USERNAME/raees-visuals-portfolio.git
   
   # Or if you want to use the same name:
   git remote add origin https://github.com/Raeesvisuals/raees-visuals-portfolio.git
   
   # Rename branch to main (if needed)
   git branch -M main
   
   # Push to remote
   git push -u origin main
   ```

**Option B: GitLab or Bitbucket**
- Similar process: Create repo → Add remote → Push

---

## Step 5: Fresh Vercel Deployment

### 5.1 Install Vercel CLI (If Not Installed)

```powershell
npm install -g vercel
```

### 5.2 Deploy to Vercel

```powershell
cd I:\portfolio\website\Portfolio\web

# Login to Vercel
vercel login

# Deploy (follow prompts)
vercel

# When prompted:
# - Set up and deploy? **Yes**
# - Which scope? **Your account**
# - Link to existing project? **No** (fresh start)
# - Project name? **raees-visuals-portfolio** (or your choice)
# - Directory? **./** (current directory)
# - Override settings? **No**

# For production deployment
vercel --prod
```

### 5.3 Alternative: Deploy via Dashboard

1. Go to: https://vercel.com/dashboard
2. Click **"Add New..."** → **"Project"**
3. Click **"Import Git Repository"**
4. Select your **new** repository
5. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `Portfolio/web` (IMPORTANT!)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
6. Click **"Deploy"**

---

## Step 6: Configure Environment Variables

**CRITICAL**: Add all environment variables in Vercel!

1. Go to Vercel Dashboard → Your Project → **Settings** → **Environment Variables**

2. Add each variable:

```
NEXT_PUBLIC_SANITY_PROJECT_ID = st67411b
NEXT_PUBLIC_SANITY_DATASET = production
SANITY_API_TOKEN = [Your Sanity API Token]
R2_ACCOUNT_ID = [Your Cloudflare Account ID]
R2_ENDPOINT = https://[ACCOUNT_ID].r2.cloudflarestorage.com
R2_ACCESS_KEY_ID = [Your R2 Access Key]
R2_SECRET_ACCESS_KEY = [Your R2 Secret Key]
R2_BUCKET_NAME = raees-assets
NEXT_PUBLIC_APP_URL = https://www.raeesvisuals.com
NODE_ENV = production
```

3. Set environment to **Production** (and Preview/Development if needed)

4. **Redeploy** after adding variables!

---

## Step 7: Configure Custom Domain

1. Go to Vercel → Your Project → **Settings** → **Domains**
2. Add: `www.raeesvisuals.com`
3. Add DNS record at your domain registrar:
   - Type: `CNAME`
   - Name: `www`
   - Value: `cname.vercel-dns.com`
4. Wait for DNS propagation

---

## Step 8: Verify Everything Works

- [ ] Site loads at Vercel URL
- [ ] Site loads at custom domain (after DNS)
- [ ] Blog posts load (Sanity)
- [ ] Shop products load (Sanity)
- [ ] Downloads work (R2)
- [ ] No console errors

---

## 🎉 Success!

You now have a completely fresh Git repository and Vercel deployment!

### Quick Commands Reference

```powershell
# Daily workflow
cd I:\portfolio\website\Portfolio\web
git add .
git commit -m "Your commit message"
git push

# Vercel will auto-deploy on push to main branch
```

---

## 🆘 Troubleshooting

**"Root Directory not found"**
- Make sure Root Directory is set to `Portfolio/web` in Vercel settings

**"Environment variables not working"**
- Verify all variables are added in Vercel dashboard
- Redeploy after adding variables

**"Git push rejected"**
- If remote repo exists, you may need to force push (careful!):
  ```powershell
  git push -u origin main --force
  ```

---

**Ready for a fresh start? Follow the steps above! 🚀**

