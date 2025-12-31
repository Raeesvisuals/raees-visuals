"use client";

import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import LiquidEther from '@/components/LiquidEther';
import ProfileCard from '@/components/ProfileCard';
import { FaEdit, FaPalette, FaVideo, FaMagic, FaCogs } from 'react-icons/fa';
import { sanityClient, urlFor } from '@/lib/sanity';

type AboutProfile = {
  name?: string;
  title?: string;
  handle?: string;
  status?: string;
  avatar?: any;
};

type AboutSoftware = {
  name?: string;
  category?: string;
};

type AboutService = {
  title?: string;
  icon?: string;
};

type AboutTeamMember = {
  name?: string;
  role?: string;
  image?: any;
};

type AboutData = {
  title?: string;
  subtitle?: string;
  shortDescription?: string;
  description?: string;
  description2?: string;
  profile?: AboutProfile;
  software?: AboutSoftware[];
  services?: AboutService[];
  team?: AboutTeamMember[];
};

const iconMap = {
  FaEdit,
  FaPalette,
  FaMagic,
  FaVideo,
} as const;

export default function About() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchAbout() {
      setIsLoading(true);
      try {
        console.log("🔍 Fetching About page data from Sanity...");
        console.log("📋 Sanity config:", {
          projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
          dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
        });
        const result = await sanityClient.fetch<AboutData>(
          `coalesce(
            *[_type == "about" && _id == "about"][0],
            *[_type == "about"][0]
          ){
            title,
            subtitle,
            shortDescription,
            description,
            description2,
            profile{
              name,
              title,
              handle,
              status,
              avatar
            },
            software[]{
              name,
              category
            },
            services[]{
              title,
              icon
            },
            team[]{
              name,
              role,
              image{
                asset,
                hotspot,
                crop
              }
            }
          }`
        );
        console.log("✅ About page data fetched:", result);
        console.log("📊 About data breakdown:", {
          hasTitle: !!result?.title,
          hasSubtitle: !!result?.subtitle,
          hasShortDescription: !!result?.shortDescription,
          hasDescription: !!result?.description,
          hasDescription2: !!result?.description2,
          hasProfile: !!result?.profile,
          softwareCount: result?.software?.length || 0,
          servicesCount: result?.services?.length || 0,
          teamCount: result?.team?.length || 0,
        });
        setAboutData(result || null);
      } catch (error) {
        console.error("❌ Error fetching about page data:", error);
        setAboutData(null);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAbout();
  }, []);

  const handleContactClick = () => {
    window.open('https://instagram.com/raeesvisuals', '_blank');
  };

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-8rem)]">
        <section className="relative min-h-screen py-20 px-4 overflow-hidden bg-dark">
          <div className="relative z-10 max-w-7xl mx-auto text-center">
            <p className="text-text-primary/60">Loading About content...</p>
          </div>
        </section>
      </div>
    );
  }

  if (!aboutData) {
    console.log("⚠️ About page: No data from Sanity");
    return (
      <div className="min-h-[calc(100vh-8rem)]">
        <section className="relative min-h-screen py-20 px-4 overflow-hidden bg-dark">
          <div className="relative z-10 max-w-7xl mx-auto text-center">
            <p className="text-text-primary/60 mb-4">
              ⚠️ No About content found in Sanity.
            </p>
            <p className="text-text-primary/40 text-sm">
              Please open Sanity Studio and create/edit the "About Page" document (it should have ID: "about").
            </p>
          </div>
        </section>
      </div>
    );
  }

  console.log("✅ About page: Rendering with data", aboutData);

  const {
    title,
    subtitle,
    shortDescription,
    description,
    description2,
    profile,
    software = [],
    services = [],
    team = [],
  } = aboutData;

  // Generate avatar URL - only if avatar exists in Sanity
  let avatarUrl: string | undefined = undefined;
  
  if (profile?.avatar) {
    try {
      // Use simple width/height without fit parameter
      const generatedUrl = urlFor(profile.avatar)
        .width(800)
        .height(1200)
        .auto('format')
        .url();
      
      if (generatedUrl && typeof generatedUrl === 'string' && generatedUrl.length > 0 && !generatedUrl.includes('undefined')) {
        avatarUrl = generatedUrl;
        console.log("✅ Using Sanity avatar URL:", avatarUrl);
      }
    } catch (error) {
      console.error("❌ Error generating avatar URL:", error);
    }
  }

  return (
    <div className="min-h-[calc(100vh-8rem)]">
      <section ref={sectionRef} className="relative min-h-screen py-20 px-4 overflow-hidden bg-dark">
      {/* Liquid Ether Background */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <LiquidEther
          colors={["#7df9ff", "#ff6b9d", "#4ecdc4"]}
          mouseForce={15}
          cursorSize={100}
          isViscous={true}
          viscous={20}
          resolution={0.3}
          autoDemo={true}
          autoSpeed={0.2}
          autoIntensity={1.0}
        />
      </div>
      
      {/* Glassmorphic Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark via-dark-lighter/30 to-dark pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left: Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative">
              <ProfileCard
  name={profile?.name || "Raees Visuals"}
  title={profile?.title || "Video Editor & Motion Graphics Designer"}
  handle={profile?.handle || "raeesvisuals"}
  status={profile?.status || "Available"}
  contactText="Contact"
  avatarUrl={avatarUrl}

  /* REQUIRED PROPS — DO NOT REMOVE */
  miniAvatarUrl={avatarUrl}
  innerGradient="from-neutral-900 to-neutral-800"
  behindGlowColor="#3b82f6"
  behindGlowSize={320}

  showUserInfo
  enableTilt
  enableMobileTilt={false}
  onContactClick={() => {}}
/>

            </div>
          </motion.div>

          {/* Right: About Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="min-h-[400px]"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-text-primary">
              {title || "About"}
              {subtitle && (
                <>
                  {" "}
                  <span className="text-primary glow-text">{subtitle}</span>
                </>
              )}
            </h1>

            <div className="space-y-6 text-text-primary/80 text-lg leading-relaxed">
              {shortDescription && <p className="text-text-primary/80">{shortDescription}</p>}
              {description && <p className="text-text-primary/80">{description}</p>}
              {description2 && <p className="text-text-primary/80">{description2}</p>}
              
              {/* Show message if no content */}
              {!shortDescription && !description && !description2 && (
                <div className="bg-dark-lighter/30 backdrop-blur-md border border-text-primary/20 rounded-lg p-6">
                  <p className="text-text-primary/60 italic mb-2">
                    No description content yet.
                  </p>
                  <p className="text-text-primary/40 text-sm">
                    Add content in Sanity Studio → About Page → Short Description or Description fields
                  </p>
                </div>
              )}

              {/* Software & Tools */}
              {software.length > 0 && (
                <div className="pt-6">
                  <h3 className="text-xl font-semibold text-text-primary mb-4 flex items-center gap-2">
                    <FaCogs className="text-primary" />
                    Software & Tools
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {software.map((tool, index) => (
                      <div
                        key={`${tool.name}-${index}`}
                        className="bg-dark-lighter/30 backdrop-blur-md border border-text-primary/10 rounded-lg p-3"
                      >
                        <div className="text-sm font-semibold text-text-primary">
                          {tool.name}
                        </div>
                        <div className="text-xs text-text-primary/60">
                          {tool.category}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* What I Offer */}
              {services.length > 0 && (
                <div className="pt-4">
                  <h3 className="text-xl font-semibold text-text-primary mb-3">
                    What I Offer:
                  </h3>
                  <ul className="space-y-2 text-text-primary/70">
                    {services.map((service, index) => {
                      const IconComponent =
                        iconMap[
                          (service.icon || "FaEdit") as keyof typeof iconMap
                        ] || FaEdit;
                      return (
                        <li
                          key={`${service.title}-${index}`}
                          className="flex items-start gap-2"
                        >
                          <IconComponent className="text-primary mt-1 text-sm" />
                          <span>{service.title}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Team Members Section */}
        {team.length > 0 && (
          <motion.div
            className="mt-20"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h3 className="text-3xl font-bold text-text-primary text-center mb-12">
              Meet Our <span className="text-primary glow-text">Team</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {team.map((member, index) => {
                const imageUrl = member.image
                  ? urlFor(member.image)
                      .width(200)
                      .height(200)
                      .fit("crop")
                      .url()
                  : undefined;

                return (
                  <motion.div
                    key={`${member.name}-${index}`}
                    className="bg-dark-lighter/30 backdrop-blur-md border border-text-primary/20 rounded-2xl p-6 text-center hover:border-primary/50 transition-colors"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -5 }}
                  >
                    {imageUrl && (
                      <div className="relative mb-4 w-20 h-20 mx-auto">
                        <Image
                          src={imageUrl}
                          alt={member.name || ""}
                          width={80}
                          height={80}
                          className="w-20 h-20 rounded-full object-cover border-2 border-primary/30"
                        />
                        <div className="absolute inset-0 w-20 h-20 rounded-full mx-auto bg-primary/20 animate-pulse" />
                      </div>
                    )}
                    <h4 className="text-lg font-semibold text-text-primary mb-1">
                      {member.name}
                    </h4>
                    <p className="text-text-primary/60 text-sm">{member.role}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
      </section>

    </div>
  );
}

