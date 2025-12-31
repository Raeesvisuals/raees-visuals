# ✅ Vercel Deployment Checklist

Quick checklist to ensure everything is ready for deployment.

## Pre-Deployment

- [ ] Code is committed and pushed to Git
- [ ] Local build succeeds: `npm run build`
- [ ] All environment variables are documented

## Vercel Setup

- [ ] Vercel account created/logged in
- [ ] Project imported from Git repository
- [ ] **Root Directory** set to: `Portfolio/web`
- [ ] Framework preset: Next.js (auto-detected)

## Environment Variables (Add in Vercel Dashboard)

### Sanity
- [ ] `NEXT_PUBLIC_SANITY_PROJECT_ID` = `st67411b`
- [ ] `NEXT_PUBLIC_SANITY_DATASET` = `production`
- [ ] `SANITY_API_TOKEN` = [Your token from Sanity dashboard]

### Cloudflare R2
- [ ] `R2_ACCOUNT_ID` = [Your Cloudflare Account ID]
- [ ] `R2_ENDPOINT` = `https://[ACCOUNT_ID].r2.cloudflarestorage.com`
- [ ] `R2_ACCESS_KEY_ID` = [Your R2 Access Key]
- [ ] `R2_SECRET_ACCESS_KEY` = [Your R2 Secret Key]
- [ ] `R2_BUCKET_NAME` = `raees-assets`

### Optional
- [ ] `NEXT_PUBLIC_APP_URL` = `https://www.raeesvisuals.com`
- [ ] `NODE_ENV` = `production`

## Domain Configuration

- [ ] Domain `www.raeesvisuals.com` added in Vercel
- [ ] CNAME record added at domain registrar:
  - Type: `CNAME`
  - Name: `www`
  - Value: `cname.vercel-dns.com`
- [ ] DNS propagation verified (check in Vercel dashboard)

## Post-Deployment

- [ ] Site loads at Vercel URL
- [ ] Site loads at custom domain (after DNS propagates)
- [ ] Homepage displays correctly
- [ ] Blog posts load from Sanity
- [ ] Shop products load from Sanity
- [ ] Download functionality works
- [ ] Images load correctly
- [ ] No console errors in browser

## Troubleshooting

If something doesn't work:
- [ ] Check Vercel build logs for errors
- [ ] Verify all environment variables are set
- [ ] Check DNS records are correct
- [ ] Wait for DNS propagation (up to 48 hours)
- [ ] Redeploy after adding environment variables

---

**Ready to deploy?** Follow the full guide in `DEPLOYMENT_GUIDE.md`

