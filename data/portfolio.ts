export interface PortfolioItem {
  id: number;
  title: string;
  category: string;
  type: string;
  video: string;
  thumbnail: string;
  isYouTube?: boolean; // Set to true for YouTube videos
  youtubeId?: string;  // YouTube video ID (e.g., "dQw4w9WgXcQ")
}

export const portfolioData: PortfolioItem[] = [
  {
    id: 1,
    title: "Cinematic Fitness Edit",
    category: "Fitness",
    type: "Short Form",
    video: "/placeholders/fitness1.mp4",
    thumbnail: "/placeholders/fitness1.jpg",
  },
  {
    id: 2,
    title: "Motion Graphics Explainer",
    category: "Explainer",
    type: "Animation",
    video: "/placeholders/explainer1.mp4",
    thumbnail: "/placeholders/explainer1.jpg",
  },
  {
    id: 3,
    title: "SaaS Product Demo",
    category: "SaaS",
    type: "Short Form",
    video: "/placeholders/saas1.mp4",
    thumbnail: "/placeholders/saas1.jpg",
  },
  {
    id: 4,
    title: "Brand Commercial",
    category: "Commercial",
    type: "Long Form",
    video: "/placeholders/commercial1.mp4",
    thumbnail: "/placeholders/commercial1.jpg",
  },
  {
    id: 5,
    title: "Documentary Story",
    category: "Documentary",
    type: "Long Form",
    video: "/placeholders/doc1.mp4",
    thumbnail: "/placeholders/doc1.jpg",
  },
  {
    id: 6,
    title: "3D Logo Animation",
    category: "Animation",
    type: "Short Form",
    video: "/placeholders/animation1.mp4",
    thumbnail: "/placeholders/animation1.jpg",
  },
  {
    id: 7,
    title: "Fitness Transformation",
    category: "Fitness",
    type: "Long Form",
    video: "/placeholders/fitness2.mp4",
    thumbnail: "/placeholders/fitness2.jpg",
  },
  {
    id: 8,
    title: "Product Launch Video",
    category: "Commercial",
    type: "Short Form",
    video: "/placeholders/commercial2.mp4",
    thumbnail: "/placeholders/commercial2.jpg",
  },
  {
    id: 9,
    title: "Tech Explainer Series",
    category: "Explainer",
    type: "Short Form",
    video: "/placeholders/explainer2.mp4",
    thumbnail: "/placeholders/explainer2.jpg",
  },

  // ============================================================
  // LEO FANNER FITNESS VIDEOS - Long Form
  // ============================================================
  // Instructions to add videos:
  // 1. Go to https://www.youtube.com/@leofanner/videos
  // 2. Click on a long-form video
  // 3. Copy the video URL (e.g., https://www.youtube.com/watch?v=ABC123XYZ)
  // 4. Extract the video ID (the part after "v=", e.g., "ABC123XYZ")
  // 5. For thumbnail: https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg
  // 6. Fill in the template below for each video:
  
  {
    id: 100,
    title: "Leo Fanner - Video Title 1", // Replace with actual video title
    category: "Fitness",
    type: "Long Form",
    video: "", // Not needed for YouTube videos
    thumbnail: "https://img.youtube.com/vi/VIDEO_ID_HERE/maxresdefault.jpg", // Replace VIDEO_ID_HERE
    isYouTube: true,
    youtubeId: "VIDEO_ID_HERE", // Replace with actual YouTube video ID
  },
  {
    id: 101,
    title: "Leo Fanner - Video Title 2", // Replace with actual video title
    category: "Fitness",
    type: "Long Form",
    video: "",
    thumbnail: "https://img.youtube.com/vi/VIDEO_ID_HERE/maxresdefault.jpg",
    isYouTube: true,
    youtubeId: "VIDEO_ID_HERE",
  },
  {
    id: 102,
    title: "Leo Fanner - Video Title 3", // Replace with actual video title
    category: "Fitness",
    type: "Long Form",
    video: "",
    thumbnail: "https://img.youtube.com/vi/VIDEO_ID_HERE/maxresdefault.jpg",
    isYouTube: true,
    youtubeId: "VIDEO_ID_HERE",
  },
  // Add more videos following the same pattern...
  // Just copy-paste this template and update the id, title, and youtubeId
];

export const categories = [
  "All",
  "Animation",
  "Short Form",
  "Long Form",
  "Fitness",
  "SaaS",
  "Explainer",
  "Commercial",
  "Documentary",
];

