export interface ShopProduct {
  id: number;
  title: string;
  description: string;
  category: string;
  tags: string[];
  price: number;
  originalPrice?: number;
  currency: string;
  thumbnail: string;
  previewVideo?: string;
  downloadUrl: string;
  fileSize: string;
  format: string;
  resolution: string;
  features: string[];
  isNew?: boolean;
  isPopular?: boolean;
  isOnSale?: boolean;
  rating?: number;
  downloads?: number;
  createdAt: string;
}

export const shopProducts: ShopProduct[] = [
  {
    id: 1,
    title: "Cinematic LUT Pack - Vol. 1",
    description: "Professional color grading LUTs for cinematic footage. Perfect for creating that Hollywood look.",
    category: "LUTs",
    tags: ["Cinematic", "Color Grading", "Professional"],
    price: 29.99,
    originalPrice: 49.99,
    currency: "USD",
    thumbnail: "/placeholders/lut-pack-1.jpg",
    previewVideo: "/placeholders/lut-preview-1.mp4",
    downloadUrl: "#",
    fileSize: "2.3 MB",
    format: ".cube",
    resolution: "All Resolutions",
    features: [
      "10 Professional LUTs",
      "Compatible with all major editors",
      "Before/After examples included",
      "Commercial use license"
    ],
    isNew: true,
    isOnSale: true,
    rating: 4.9,
    downloads: 1250,
    createdAt: "2024-01-15"
  },
  {
    id: 2,
    title: "Motion Graphics Template - Tech Startup",
    description: "Modern, clean motion graphics template perfect for tech companies and startups.",
    category: "Templates",
    tags: ["Motion Graphics", "Tech", "Startup", "Modern"],
    price: 45.00,
    currency: "USD",
    thumbnail: "/placeholders/motion-template-1.jpg",
    previewVideo: "/placeholders/motion-preview-1.mp4",
    downloadUrl: "#",
    fileSize: "15.2 MB",
    format: ".aep",
    resolution: "4K",
    features: [
      "After Effects project file",
      "4K resolution",
      "Easy text customization",
      "Modular design"
    ],
    isPopular: true,
    rating: 4.8,
    downloads: 890,
    createdAt: "2024-01-10"
  },
  {
    id: 3,
    title: "Fitness Video Template Pack",
    description: "High-energy fitness video templates with dynamic transitions and effects.",
    category: "Templates",
    tags: ["Fitness", "Dynamic", "Transitions", "Energy"],
    price: 39.99,
    currency: "USD",
    thumbnail: "/placeholders/fitness-template-1.jpg",
    previewVideo: "/placeholders/fitness-preview-1.mp4",
    downloadUrl: "#",
    fileSize: "8.7 MB",
    format: ".aep",
    resolution: "1080p",
    features: [
      "5 Different templates",
      "1080p & 4K versions",
      "Customizable colors",
      "Music included"
    ],
    rating: 4.7,
    downloads: 2100,
    createdAt: "2024-01-05"
  },
  {
    id: 4,
    title: "Corporate Presentation Template",
    description: "Professional corporate presentation template with smooth animations and modern design.",
    category: "Templates",
    tags: ["Corporate", "Professional", "Presentation", "Business"],
    price: 55.00,
    currency: "USD",
    thumbnail: "/placeholders/corporate-template-1.jpg",
    previewVideo: "/placeholders/corporate-preview-1.mp4",
    downloadUrl: "#",
    fileSize: "12.1 MB",
    format: ".aep",
    resolution: "4K",
    features: [
      "20+ slide variations",
      "4K resolution",
      "Brand customization guide",
      "Font files included"
    ],
    rating: 4.9,
    downloads: 650,
    createdAt: "2024-01-01"
  },
  {
    id: 5,
    title: "Social Media LUT Pack - Instagram",
    description: "Optimized LUTs specifically designed for Instagram content. Make your posts stand out.",
    category: "LUTs",
    tags: ["Social Media", "Instagram", "Mobile", "Viral"],
    price: 19.99,
    currency: "USD",
    thumbnail: "/placeholders/instagram-lut-1.jpg",
    previewVideo: "/placeholders/instagram-preview-1.mp4",
    downloadUrl: "#",
    fileSize: "1.8 MB",
    format: ".cube",
    resolution: "All Resolutions",
    features: [
      "15 Instagram-optimized LUTs",
      "Mobile-friendly",
      "Viral content ready",
      "Quick application"
    ],
    isNew: true,
    rating: 4.6,
    downloads: 3200,
    createdAt: "2024-01-20"
  },
  {
    id: 6,
    title: "Wedding Video Template - Romantic",
    description: "Beautiful, romantic wedding video template with elegant transitions and effects.",
    category: "Templates",
    tags: ["Wedding", "Romantic", "Elegant", "Love"],
    price: 65.00,
    currency: "USD",
    thumbnail: "/placeholders/wedding-template-1.jpg",
    previewVideo: "/placeholders/wedding-preview-1.mp4",
    downloadUrl: "#",
    fileSize: "18.5 MB",
    format: ".aep",
    resolution: "4K",
    features: [
      "Romantic color palette",
      "4K resolution",
      "Multiple scene options",
      "Music recommendations"
    ],
    rating: 4.8,
    downloads: 450,
    createdAt: "2023-12-28"
  },
  {
    id: 7,
    title: "Drone Footage LUT Pack",
    description: "Specialized LUTs for aerial and drone footage. Enhance your cinematic shots.",
    category: "LUTs",
    tags: ["Drone", "Aerial", "Cinematic", "Landscape"],
    price: 34.99,
    currency: "USD",
    thumbnail: "/placeholders/drone-lut-1.jpg",
    previewVideo: "/placeholders/drone-preview-1.mp4",
    downloadUrl: "#",
    fileSize: "2.1 MB",
    format: ".cube",
    resolution: "All Resolutions",
    features: [
      "12 Drone-specific LUTs",
      "Landscape optimized",
      "Weather variations",
      "Time-of-day presets"
    ],
    rating: 4.7,
    downloads: 780,
    createdAt: "2023-12-20"
  },
  {
    id: 8,
    title: "YouTube Intro Template - Gaming",
    description: "High-energy gaming intro template with dynamic effects and gaming aesthetics.",
    category: "Templates",
    tags: ["Gaming", "YouTube", "Intro", "Dynamic"],
    price: 25.00,
    currency: "USD",
    thumbnail: "/placeholders/gaming-intro-1.jpg",
    previewVideo: "/placeholders/gaming-preview-1.mp4",
    downloadUrl: "#",
    fileSize: "6.3 MB",
    format: ".aep",
    resolution: "1080p",
    features: [
      "Gaming-themed design",
      "Customizable logo space",
      "Sound effects included",
      "Multiple variations"
    ],
    isPopular: true,
    rating: 4.5,
    downloads: 1800,
    createdAt: "2023-12-15"
  },
  {
    id: 9,
    title: "Free Cinematic LUT - Dark Moody",
    description: "Beautiful dark and moody cinematic LUT perfect for dramatic scenes. Free download!",
    category: "LUTs",
    tags: ["Free", "Cinematic", "Moody", "Dramatic"],
    price: 0.00,
    currency: "USD",
    thumbnail: "/placeholders/free-lut-1.jpg",
    previewVideo: "/placeholders/free-lut-preview-1.mp4",
    downloadUrl: "#",
    fileSize: "0.8 MB",
    format: ".cube",
    resolution: "All Resolutions",
    features: [
      "Professional quality",
      "All major editors supported",
      "Commercial use allowed",
      "No registration required"
    ],
    isNew: true,
    rating: 4.9,
    downloads: 8500,
    createdAt: "2024-01-25"
  },
  {
    id: 10,
    title: "Free Social Media Template Pack",
    description: "Complimentary social media templates for Instagram stories and posts. Perfect for content creators.",
    category: "Templates",
    tags: ["Free", "Social Media", "Instagram", "Content"],
    price: 0.00,
    currency: "USD",
    thumbnail: "/placeholders/free-template-1.jpg",
    previewVideo: "/placeholders/free-template-preview-1.mp4",
    downloadUrl: "#",
    fileSize: "4.2 MB",
    format: ".psd",
    resolution: "1080x1080",
    features: [
      "5 Story templates",
      "3 Post templates",
      "Easy customization",
      "High-resolution PSD"
    ],
    isPopular: true,
    rating: 4.8,
    downloads: 12000,
    createdAt: "2024-01-30"
  }
];

export const shopCategories = [
  "All",
  "LUTs",
  "Templates",
  "Motion Graphics",
  "Social Media",
  "Corporate",
  "Wedding",
  "Gaming"
];

export const shopTags = [
  "Cinematic",
  "Professional",
  "Modern",
  "Dynamic",
  "Romantic",
  "Tech",
  "Fitness",
  "Gaming",
  "Corporate",
  "Social Media",
  "Color Grading",
  "Motion Graphics"
];
