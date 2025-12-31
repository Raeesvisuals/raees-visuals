"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import ProfileCard from "./ProfileCard";
import LiquidEther from "./LiquidEther";
import { FaEdit, FaPalette, FaVideo, FaMagic, FaCogs } from "react-icons/fa";
import { sanityClient, urlFor } from "@/lib/sanity";

type HomeAboutProfile = {
  name?: string;
  title?: string;
  handle?: string;
  status?: string;
  avatar?: any;
};

type HomeAboutSoftware = {
  name?: string;
  category?: string;
};

type HomeAboutService = {
  title?: string;
  icon?: string;
};

type HomeAboutTeamMember = {
  name?: string;
  role?: string;
  image?: any;
};

type AboutData = {
  title?: string;
  subtitle?: string;
  description?: string;
  description2?: string;
  profile?: HomeAboutProfile;
  software?: HomeAboutSoftware[];
  services?: HomeAboutService[];
  team?: HomeAboutTeamMember[];
};

const iconMap = {
  FaEdit,
  FaPalette,
  FaMagic,
  FaVideo,
} as const;

const AboutSection: React.FC = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchAbout() {
      setIsLoading(true);
      try {
        const result = await sanityClient.fetch<AboutData>(`
          coalesce(
            *[_type == "about" && _id == "about"][0],
            *[_type == "about"][0]
          ){
            title,
            subtitle,
            "description": coalesce(description, shortDescription),
            description2,
            profile{
              name,
              title,
              handle,
              status,
              avatar{
                asset,
                hotspot,
                crop
              }
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
          }
        `);

        setAboutData(result || null);
      } catch (error) {
        console.error("❌ Error fetching About data:", error);
        setAboutData(null);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAbout();
  }, []);

  const handleContactClick = () => {
    window.open("https://instagram.com/raeesvisuals", "_blank");
  };

  if (isLoading) {
    return (
      <section ref={sectionRef} id="about" className="py-20 text-center">
        Loading About content...
      </section>
    );
  }

  if (!aboutData) {
    return (
      <section ref={sectionRef} id="about" className="py-20 text-center">
        No About content found in Sanity.
      </section>
    );
  }

  const {
    title,
    subtitle,
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
    <section
      ref={sectionRef}
      id="about"
      className="relative py-20 px-4 overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none">
        <LiquidEther
          colors={["#7df9ff", "#ff6b9d", "#4ecdc4"]}
          mouseForce={15}
          cursorSize={100}
          isViscous
          viscous={20}
          resolution={0.3}
          autoDemo
          autoSpeed={0.2}
          autoIntensity={1}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* PROFILE CARD */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <ProfileCard
            name={profile?.name || "Raees Visuals"}
            title={profile?.title || "Video Editor & Motion Designer"}
            handle={profile?.handle || "raeesvisuals"}
            status={profile?.status || "Available for Projects"}
            contactText="Contact"
            avatarUrl={avatarUrl}
            innerGradient="linear-gradient(145deg,#60496e8c 0%,#71C4FF44 100%)"
            behindGlowColor="rgba(125, 190, 255, 0.67)"
            behindGlowSize="50%"
            miniAvatarUrl={avatarUrl}
            showUserInfo
            enableTilt
            enableMobileTilt={false}
            onContactClick={handleContactClick}
          />
        </motion.div>

        {/* ABOUT CONTENT */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {(title || subtitle) && (
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              {title}{" "}
              <span className="text-primary glow-text">{subtitle}</span>
            </h2>
          )}

          <div className="space-y-6 text-text-primary/80">
            {description && <p>{description}</p>}
            {description2 && <p>{description2}</p>}

            {software.length > 0 && (
              <div>
                <h3 className="flex items-center gap-2 text-xl font-semibold mb-4">
                  <FaCogs className="text-primary" />
                  Software & Tools
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {software.map((tool, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-lg bg-dark-lighter/30"
                    >
                      <div className="font-semibold">{tool.name}</div>
                      <div className="text-sm opacity-60">{tool.category}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {services.length > 0 && (
              <ul className="space-y-2">
                {services.map((service, i) => {
                  const Icon =
                    iconMap[
                      (service.icon || "FaEdit") as keyof typeof iconMap
                    ] || FaEdit;

                  return (
                    <li key={i} className="flex gap-2 items-start">
                      <Icon className="text-primary mt-1" />
                      <span>{service.title}</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </motion.div>
      </div>

      {/* TEAM */}
      {team.length > 0 && (
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {team.map((member, i) => {
            const imageUrl = member.image
              ? urlFor(member.image).width(200).height(200).fit("crop").url()
              : undefined;

            return (
              <div
                key={i}
                className="text-center p-6 rounded-2xl bg-dark-lighter/30"
              >
                {imageUrl && (
                  <Image
                    src={imageUrl}
                    alt={member.name || ""}
                    width={80}
                    height={80}
                    className="rounded-full mx-auto mb-4"
                  />
                )}
                <h4 className="font-semibold">{member.name}</h4>
                <p className="text-sm opacity-60">{member.role}</p>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default AboutSection;
