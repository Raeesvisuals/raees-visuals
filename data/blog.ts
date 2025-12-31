export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  thumbnail: string;
  date: string;
  category: string;
  content?: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "How We Edited a Cinematic Fitness Video",
    excerpt: "Step inside our process for creating high-impact fitness edits that capture raw energy and transformation.",
    thumbnail: "/placeholders/blog1.jpg",
    date: "2025-10-18",
    category: "Behind the Scenes",
    content: "Full blog post content will go here...",
  },
  {
    id: 2,
    title: "The Art of Color Grading for Brand Films",
    excerpt: "Discover how color grading transforms ordinary footage into cinematic masterpieces that tell compelling brand stories.",
    thumbnail: "/placeholders/blog2.jpg",
    date: "2025-10-15",
    category: "Techniques",
    content: "Full blog post content will go here...",
  },
  {
    id: 3,
    title: "5 Transition Effects That Elevate Your Edits",
    excerpt: "Learn the transition techniques we use to create seamless, professional video edits that keep viewers engaged.",
    thumbnail: "/placeholders/blog3.jpg",
    date: "2025-10-12",
    category: "Tips & Tricks",
    content: "Full blog post content will go here...",
  },
  {
    id: 4,
    title: "Behind Our Documentary Storytelling Process",
    excerpt: "From concept to final cut - explore how we craft authentic documentary narratives that resonate with audiences.",
    thumbnail: "/placeholders/blog4.jpg",
    date: "2025-10-10",
    category: "Behind the Scenes",
    content: "Full blog post content will go here...",
  },
  {
    id: 5,
    title: "Sound Design: The Unsung Hero of Video Editing",
    excerpt: "Why audio matters just as much as visuals, and how we use sound design to create immersive experiences.",
    thumbnail: "/placeholders/blog5.jpg",
    date: "2025-10-08",
    category: "Insights",
    content: "Full blog post content will go here...",
  },
  {
    id: 6,
    title: "Creating Motion Graphics That Pop",
    excerpt: "A deep dive into our motion graphics workflow and the tools we use to create eye-catching animations.",
    thumbnail: "/placeholders/blog6.jpg",
    date: "2025-10-05",
    category: "Techniques",
    content: "Full blog post content will go here...",
  },
];

export const blogCategories = [
  "All",
  "Behind the Scenes",
  "Techniques",
  "Tips & Tricks",
  "Insights",
];

