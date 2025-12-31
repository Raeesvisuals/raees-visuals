# 🚀 Raees Studio - Quick Start Guide

## ⚡ Getting Started in 30 Seconds

### 1. Install Dependencies (if not done)
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

### 3. Open in Browser
```
http://localhost:3000
```

---

## 🎯 What You'll See

### Home Page (/)
- **Hero Section** with 3D floating glass frame
- **Portfolio Grid** with 9 sample projects
- **Contact Section** with email and social links

### Other Pages
- **/about** - Studio information
- **/portfolio** - Dedicated portfolio page
- **/blog** - Blog listing
- **/contact** - Detailed contact page

---

## 🎨 Quick Navigation

### Scroll Interactions
- Click **"View Work"** button → Scrolls to Portfolio
- Click **"Contact"** button → Scrolls to Contact
- Click **"Get a Quote"** → Scrolls to Contact
- Use scroll indicator at bottom of hero

### Portfolio Filters
- Click any category tab to filter projects
- Categories: All, Animation, Short Form, Long Form, Fitness, SaaS, Explainer, Commercial, Documentary

### Video Modal
- Click any portfolio card to open video modal
- Press **ESC** or click outside to close

---

## 🛠️ Quick Customization

### Change Colors
Edit `tailwind.config.ts`:
```ts
colors: {
  primary: "#00FFFF",  // Change accent color
  dark: "#0A0A0A",     // Change background
}
```

### Add Portfolio Items
Edit `data/portfolio.ts`:
```ts
{
  id: 10,
  title: "Your Project",
  category: "Animation",
  type: "Short Form",
  video: "/placeholders/your-video.mp4",
  thumbnail: "/placeholders/your-thumb.jpg",
}
```

### Modify Text
- **Hero headline:** `components/Hero.tsx` (line ~95)
- **Portfolio title:** `components/Portfolio.tsx` (line ~35)
- **Contact info:** `components/ContactSection.tsx`

---

## 📂 Project Structure

```
raees-studio/
│
├── app/                      # Next.js 14 App Router
│   ├── page.tsx             # Home page (Hero + Portfolio + Contact)
│   ├── about/page.tsx       # About page
│   ├── portfolio/page.tsx   # Portfolio page
│   ├── blog/page.tsx        # Blog page
│   ├── contact/page.tsx     # Contact page
│   ├── layout.tsx           # Root layout
│   └── globals.css          # Global styles
│
├── components/               # React Components
│   ├── Layout.tsx           # Page wrapper
│   ├── Navbar.tsx           # Navigation bar
│   ├── Footer.tsx           # Footer
│   ├── Hero.tsx             # 3D hero section
│   ├── Portfolio.tsx        # Portfolio grid
│   ├── VideoModal.tsx       # Video player modal
│   └── ContactSection.tsx   # Contact cards
│
├── data/                     # Data files
│   └── portfolio.ts         # Portfolio projects
│
├── public/                   # Static assets
│   └── placeholders/        # Placeholder images/videos
│
└── Configuration files
    ├── package.json
    ├── tsconfig.json
    ├── tailwind.config.ts
    └── next.config.js
```

---

## 🎬 Key Components Explained

### Hero.tsx
- 3D canvas with React Three Fiber
- Parallax mouse tracking
- Floating glass frame
- Animated particles
- Responsive CTA buttons

### Portfolio.tsx
- Filter tabs (9 categories)
- Grid layout (1 → 2 → 3 columns)
- 3D tilt cards (react-parallax-tilt)
- AnimatePresence transitions
- Video modal trigger

### VideoModal.tsx
- Full-screen overlay
- Blurred backdrop
- ESC key support
- Spring animations
- Click-outside to close

### ContactSection.tsx
- Email card
- Social links card
- Hover animations
- Glass effects

---

## 🎨 Design Tokens

### Colors
```
Primary:      #00FFFF  (Cyan)
Dark:         #0A0A0A  (Near Black)
Dark Lighter: #1A1A1A  (Lighter Black)
Text:         #F5F5F5  (Soft White)
```

### Spacing Scale (Tailwind)
```
4  = 1rem   (16px)
6  = 1.5rem (24px)
8  = 2rem   (32px)
12 = 3rem   (48px)
16 = 4rem   (64px)
20 = 5rem   (80px)
```

### Typography
```
Font:   Inter (Google Fonts)
Sizes:  text-sm (14px)
        text-base (16px)
        text-lg (18px)
        text-xl (20px)
        text-2xl (24px)
        text-4xl (36px)
        text-6xl (60px)
```

---

## 🔍 Debugging Tips

### If dev server won't start:
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
npm run dev
```

### If hot reload isn't working:
- Save the file again
- Check terminal for errors
- Restart dev server (Ctrl+C, then npm run dev)

### If 3D elements don't show:
- Check browser console for Three.js errors
- Ensure WebGL is supported in your browser
- Try Chrome/Firefox/Edge (latest versions)

---

## 📚 Additional Resources

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- [TailwindCSS](https://tailwindcss.com/docs)

### Helpful Files
- `FEATURES.md` - Complete feature list
- `PART2_README.md` - Part 2 details
- `SETUP.md` - Initial setup guide
- `README.md` - Project overview

---

## 🎉 You're All Set!

Your Raees Studio website is ready to:
- ✅ Showcase projects
- ✅ Impress clients
- ✅ Tell your story
- ✅ Generate leads

**Next steps:**
1. Replace placeholder content with real projects
2. Add your social media links
3. Customize colors/fonts
4. Add real videos and images
5. Deploy to production

---

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Build for Production
```bash
npm run build
npm start
```

---

**Need help?** Check the documentation files or the code comments!

**Happy coding!** 🎬✨

