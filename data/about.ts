export interface AboutContent {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  description2: string;
  profileName: string;
  profileTitle: string;
  profileHandle: string;
  profileStatus: string;
  profileAvatarUrl: string;
  software: SoftwareTool[];
  services: Service[];
  teamMembers: TeamMember[];
  lastUpdated: string;
}

export interface SoftwareTool {
  id: string;
  name: string;
  category: string;
}

export interface Service {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
}

// Default about content - in production, this would come from a database
export const defaultAboutContent: AboutContent = {
  id: 'about-main',
  title: 'About',
  subtitle: 'Raees Visuals',
  description: `Welcome to Raees Visuals — where every frame tells a story and every edit
  creates an experience. I'm a passionate video editor specializing in
  cinematic storytelling and high-energy content creation.`,
  description2: `With years of experience in the industry, I've worked with brands,
  influencers, and businesses to create compelling video content that
  captures attention and drives results.`,
  profileName: 'Raees Visuals',
  profileTitle: 'Video Editor & Motion Graphics Designer',
  profileHandle: 'raeesvisuals',
  profileStatus: 'Available for Projects',
  profileAvatarUrl: '/raees-profile.png',
  software: [
    { id: '1', name: "Adobe Premiere Pro", category: "Video Editing" },
    { id: '2', name: "Adobe After Effects", category: "Motion Graphics" },
    { id: '3', name: "DaVinci Resolve", category: "Color Grading" },
    { id: '4', name: "Adobe Photoshop", category: "Graphic Design" },
    { id: '5', name: "Blender", category: "3D Animation" },
    { id: '6', name: "Audacity", category: "Audio Editing" },
  ],
  services: [
    {
      id: '1',
      icon: 'FaEdit',
      title: 'Professional video editing with cinematic quality',
      description: 'Cinematic video editing'
    },
    {
      id: '2',
      icon: 'FaPalette',
      title: 'Color correction and grading for stunning visuals',
      description: 'Color correction and grading'
    },
    {
      id: '3',
      icon: 'FaMagic',
      title: 'Motion graphics and VFX integration',
      description: 'Motion graphics and VFX'
    },
    {
      id: '4',
      icon: 'FaVideo',
      title: 'Fast turnaround without compromising quality',
      description: 'Fast turnaround videos'
    },
  ],
  teamMembers: [
    {
      id: '1',
      name: "Raees VFX",
      role: "Lead Editor",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face"
    },
    {
      id: '2',
      name: "Visual Effects Team",
      role: "VFX Specialists",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face"
    },
    {
      id: '3',
      name: "Motion Graphics",
      role: "Animation Team",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face"
    },
  ],
  lastUpdated: new Date().toISOString(),
};

// In-memory storage for demo purposes
let aboutContent: AboutContent = defaultAboutContent;

export const getAboutContent = (): AboutContent => {
  return aboutContent;
};

export const updateAboutContent = (updates: Partial<AboutContent>): AboutContent => {
  aboutContent = {
    ...aboutContent,
    ...updates,
    lastUpdated: new Date().toISOString(),
  };
  return aboutContent;
};

export const resetAboutContent = (): AboutContent => {
  aboutContent = { ...defaultAboutContent };
  return aboutContent;
};
