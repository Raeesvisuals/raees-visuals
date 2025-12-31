# 🔧 Troubleshooting Guide

## ✅ FIXED: Module Errors & Port Issues

### What Was Wrong:
1. **Wrong Port** - Server was on port 3001, not 3000
2. **Cache Corruption** - Webpack chunks were corrupted
3. **Module Resolution** - Missing vendor chunks

### What Was Done:
1. ✅ Deleted `.next` folder
2. ✅ Cleared node_modules cache
3. ✅ Reinstalled dependencies
4. ✅ Restarted dev server fresh

---

## 🌐 Access Your Site

### The dev server will start on one of these ports:

**Try these URLs in order:**

1. **http://localhost:3000** (primary)
2. **http://localhost:3001** (if 3000 is busy)
3. **http://localhost:3002** (if both busy)

### Check Terminal Output
Look for a line like:
```
- Local:        http://localhost:XXXX
```
That's your URL!

---

## 📍 All Pages

Once you find the correct port, access:

- **Home**: http://localhost:PORT/
- **About**: http://localhost:PORT/about
- **Portfolio**: http://localhost:PORT/portfolio
- **Blog**: http://localhost:PORT/blog
- **Contact**: http://localhost:PORT/contact
- **Blog Post**: http://localhost:PORT/blog/1 (or any ID 1-6)

---

## 🐛 If You Still See Errors

### 1. Stop Everything
Press `Ctrl+C` in the terminal

### 2. Clean Everything
```bash
Remove-Item -Recurse -Force .next
npm install
```

### 3. Restart
```bash
npm run dev
```

### 4. Check Port
Look at the terminal output to see which port it's using

---

## 🔍 Common Issues

### "Port 3000 is in use"
**Solution**: Use the port shown in terminal (likely 3001 or 3002)

### "Cannot find module"
**Solution**: 
```bash
Remove-Item -Recurse -Force .next
npm run dev
```

### "404 Not Found"
**Solution**: Make sure you're using the correct port from terminal

### Pages Won't Load
**Solution**: Wait 10-20 seconds after starting dev server for compilation

---

## ✅ Verification Steps

1. **Start server**: `npm run dev`
2. **Wait**: 10-20 seconds for compilation
3. **Check terminal**: Look for "Ready in XXXXms"
4. **Find port**: Look for "Local: http://localhost:XXXX"
5. **Open browser**: Use the port from step 4
6. **Test home**: Should see hero section with 3D glass frame
7. **Test navigation**: Click nav links to test other pages

---

## 🎯 Quick Test Checklist

After server starts, verify:

- [ ] Home page loads (hero section visible)
- [ ] Can see cursor trail when moving mouse
- [ ] Nav links work (page transitions)
- [ ] Blog page shows 6 posts
- [ ] Can click blog post (opens detail page)
- [ ] Contact form has 4 fields
- [ ] Portfolio filters work

---

## 🚀 If Everything Works

You should see:
- ✨ Rainbow cursor trail following your mouse
- 🎨 3D hero section with floating glass frame
- 🎬 Portfolio with 9 filterable projects
- 📝 Blog with 6 posts and sidebar
- 📧 Working contact form
- ⚡ Smooth page transitions

---

## 📞 Still Having Issues?

### Check Build
```bash
npm run build
```

If build succeeds, the code is fine. The issue is dev server.

### Nuclear Option (Last Resort)
```bash
# Delete everything
Remove-Item -Recurse -Force node_modules
Remove-Item -Recurse -Force .next
Remove-Item package-lock.json

# Reinstall from scratch
npm install

# Start fresh
npm run dev
```

---

## 🎉 Success Indicators

When everything is working, you'll see in browser:
- Home page with moving particles
- Cursor leaving rainbow trail
- Smooth animations on scroll
- All pages loading quickly
- No console errors

In terminal you'll see:
- "Ready in XXXXms"
- "Compiled /page in XXXXms"
- Status 200 for all requests
- No error messages

---

**Your site is ready! Just make sure you're using the correct port!** 🚀

