# Raees Visuals — Creative Video Editing Portfolio

A modern, cinematic portfolio website for **Raees Visuals**, built with Next.js, TailwindCSS, and Framer Motion. Features stunning animations, interactive components, and a high-end creative agency aesthetic.

---

## 🚀 Features

- **Hero Section** with animated liquid ether background and parallax effects
- **Services Section** featuring glassmorphic icons with electric borders
- **Intro Video Modal** for introducing yourself to visitors
- **Portfolio Grid** with filterable categories and modal video player
- **Testimonials Section** to showcase client feedback
- **About Section** with interactive profile card
- **Contact Form** with validation and smooth animations
- **Fully Responsive** design optimized for mobile, tablet, and desktop
- **Performance Optimized** with lazy loading and smooth transitions
- **Accessibility** features including keyboard navigation and screen reader support

---

## 📦 Tech Stack

- **Next.js 14+** (App Directory)
- **React 18**
- **TypeScript**
- **TailwindCSS** (styling and responsive design)
- **Framer Motion** (animations and transitions)
- **React Three Fiber (@react-three/fiber)** (3D graphics)
- **React Parallax Tilt** (3D tilt effects)
- **React Icons** (icon library)
- **React Fluid Sim** (liquid ether background)

---

## 🛠️ Installation

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Steps

1. **Clone or download the project**

```bash
cd your-project-folder
```

2. **Install dependencies**

```bash
npm install
```

3. **Run development server**

```bash
npm run dev
```

4. **Open in browser**

Navigate to the port shown in terminal (usually `http://localhost:3000`)

---

## 📝 Customization Guide

### 1. Replace Placeholder Text

#### Hero Section (`components/Hero.tsx`)

- Update headline and subtext
- Modify CTA button text and links

#### About Section (`components/AboutSection.tsx`)

- Update your name, title, and handle
- Edit the "About" content paragraphs
- Modify the "What I Offer" list

#### Footer (`components/Footer.tsx`)

- Update copyright year
- Change social media links (Instagram, YouTube, Fiverr)

### 2. Replace Placeholder Images

Create a `public/placeholders/` folder and add your images:

```
public/
  ├── placeholders/
  │   ├── avatar.jpg          (Your profile photo)
  │   ├── fitness1.jpg        (Portfolio thumbnails)
  │   ├── fitness1.mp4        (Portfolio videos)
  │   ├── blog1.jpg           (Blog post images)
  │   └── intro-video.mp4     (Your intro video)
```

**Portfolio Images/Videos** (`data/portfolio.ts`):
- Replace `video` and `thumbnail` paths with your actual files

**Profile Avatar** (`components/AboutSection.tsx`):
- Replace `avatarUrl="/placeholders/avatar.jpg"` with your photo

**Intro Video** (`components/IntroVideoModal.tsx`):
- Uncomment the `<video>` tag
- Replace `src="/placeholders/intro-video.mp4"` with your intro video

### 3. Update Portfolio Data

Edit `data/portfolio.ts`:

```typescript
export const portfolioData = [
  {
    id: 1,
    title: "Your Project Title",
    category: "Animation", // or "Short Form", "Long Form", etc.
    type: "Short Form",
    video: "/placeholders/your-video.mp4",
    thumbnail: "/placeholders/your-thumbnail.jpg",
  },
  // Add more projects...
];
```

### 4. Update Services

Edit `components/ServicesSection.tsx`:

```typescript
const services = [
  { icon: <FiVideo />, color: 'cyan', label: 'Your Service' },
  // Modify services as needed
];
```

### 5. Update Testimonials

Edit `components/TestimonialsSection.tsx`:

```typescript
const testimonials = [
  {
    id: 1,
    name: 'Client Name',
    role: 'Client Role',
    content: 'Testimonial text here...',
    rating: 5,
  },
  // Add more testimonials...
];
```

### 6. Update Contact Information

Edit `components/ContactSection.tsx`:
- Update social media links
- Modify contact text and descriptions

### 7. Configure Colors

Edit `tailwind.config.ts` to change the color scheme:

```typescript
colors: {
  dark: "#0A0A0A",         // Main background
  "dark-lighter": "#1a1a1a", // Secondary background
  primary: "#00FFFF",       // Accent color (cyan)
  secondary: "#FF9FFC",     // Secondary accent
  "text-primary": "#E5E5E5", // Text color
}
```

### 8. Adjust Liquid Ether Backgrounds

Each section has customizable LiquidEther parameters:

```tsx
<LiquidEther
  colors={['#00FFFF', '#5227FF', '#00CCCC']} // Color palette
  mouseForce={25}           // Mouse interaction strength
  cursorSize={120}          // Cursor influence size
  autoSpeed={0.3}           // Animation speed
  autoIntensity={1.5}       // Animation intensity
/>
```

---

## 🎨 Components Overview

### Core Components

- **`Hero.tsx`** — Hero section with animated background
- **`ServicesSection.tsx`** — Services with glass icons
- **`IntroVideoModal.tsx`** — Popup video modal
- **`Portfolio.tsx`** — Filterable portfolio grid
- **`TestimonialsSection.tsx`** — Client testimonials
- **`AboutSection.tsx`** — About section with profile card
- **`ContactForm.tsx`** — Contact form with validation
- **`ContactSection.tsx`** — Contact info and social links

### UI Components

- **`GlassIcons.tsx`** — Glassmorphic icon cards
- **`ElectricBorder.tsx`** — Animated electric border effect
- **`ProfileCard.tsx`** — Interactive profile card with tilt
- **`LiquidEther.tsx`** — Fluid simulation background
- **`VideoModal.tsx`** — Video player modal
- **`CursorTrail.tsx`** — Rainbow cursor trail
- **`PageTransition.tsx`** — Smooth page transitions

### Layout Components

- **`Navbar.tsx`** — Sticky navigation bar
- **`Footer.tsx`** — Minimal footer
- **`Layout.tsx`** — Main layout wrapper

---

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy Options

- **Vercel** (recommended for Next.js)
- **Netlify**
- **AWS Amplify**
- **DigitalOcean App Platform**

---

## 📄 Folder Structure

```
├── app/                    # Next.js app directory
│   ├── page.tsx           # Homepage
│   ├── layout.tsx         # Root layout
│   ├── globals.css        # Global styles
│   ├── about/             # About page
│   ├── portfolio/         # Portfolio page
│   ├── blog/              # Blog pages
│   └── contact/           # Contact page
├── components/            # React components
├── data/                  # Data files (portfolio, blog)
├── public/                # Static assets
└── README.md             # This file
```

---

## 🐛 Troubleshooting

### Module Not Found Errors

If you encounter module errors during development:

```bash
# Delete cache and reinstall
rm -rf .next node_modules package-lock.json
npm install
npm run dev
```

### Port Already in Use

If port 3000 is in use, Next.js will automatically try the next available port (3001, 3002, etc.). Check the terminal output for the correct URL.

### Video Not Playing

- Ensure video files are in the `public/` folder
- Use supported formats: MP4, WebM
- Check file paths are correct

---

## 📞 Support

For questions or issues:
- Check the [Next.js Documentation](https://nextjs.org/docs)
- Review [Framer Motion Docs](https://www.framer.com/motion/)
- Contact: your-email@example.com

---

## 📜 License

This project is private and proprietary. All rights reserved © Raees Visuals 2025.

---

## 🎉 Credits

Built with modern web technologies and designed for maximum visual impact and performance.

**Raees Visuals** — We Make Stories Move.
