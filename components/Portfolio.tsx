"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Tilt from "react-parallax-tilt";
import Image from "next/image";
import { FaPlay } from "react-icons/fa";
import VideoModal from "./VideoModal";
import { getPortfolioItems } from "@/lib/portfolio";
import { urlFor } from "@/lib/sanity";
import Aurora from "./Aurora";

interface PortfolioProps {
  isHomepage?: boolean;
}

/* =========================
   YOUTUBE ID
========================= */
const getYouTubeId = (url: string): string | null => {
  try {
    if (url.includes("youtu.be/")) return url.split("youtu.be/")[1].split("?")[0];
    if (url.includes("shorts/")) return url.split("shorts/")[1].split("?")[0];
    if (url.includes("embed/")) return url.split("embed/")[1].split("?")[0];
    return new URL(url).searchParams.get("v");
  } catch {
    return null;
  }
};

export default function Portfolio({ isHomepage = false }: PortfolioProps) {
  // ✅ ALWAYS ARRAY — NEVER UNDEFINED
  const [items, setItems] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");

  const [selectedVideo, setSelectedVideo] = useState<{
    url: string;
    format: "short" | "horizontal";
  } | null>(null);

  const sectionRef = useRef<HTMLDivElement | null>(null);

  /* =========================
     FETCH DATA
  ========================= */
  useEffect(() => {
    getPortfolioItems()
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch(() => setItems([]));
  }, []);

  /* =========================
     CATEGORIES (SAFE)
  ========================= */
  const categories = [
    "All",
    ...Array.from(
      new Set(
        items
          .map((i) => i?.category)
          .filter(Boolean)
      )
    ),
  ];

  const filtered =
    activeCategory === "All"
      ? items
      : items.filter((i) => i.category === activeCategory);

  const displayed = isHomepage ? filtered.slice(0, 8) : filtered;

  /* =========================
     VIDEO URL
  ========================= */
  const getVideoUrl = (item: any): string | null => {
    if (item.videoType === "youtube" && item.youtubeUrl) return item.youtubeUrl;
    if (item.videoFile?.asset?.url) return item.videoFile.asset.url;
    return null;
  };

  /* =========================
     CHECK IF YOUTUBE
  ========================= */
  const isYouTubeUrl = (url: string): boolean => {
    return url.includes("youtube.com") || url.includes("youtu.be");
  };

  /* =========================
     THUMBNAIL
  ========================= */
  const getThumbnail = (item: any): string => {
    if (item.videoType === "youtube" && item.youtubeUrl) {
      const id = getYouTubeId(item.youtubeUrl);
      if (id) return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
    }

    if (item.thumbnail) return urlFor(item.thumbnail).width(800).url();
    return "/placeholders/video-placeholder.jpg";
  };

  return (
    <section ref={sectionRef} id="portfolio" className="relative py-20 px-4">
      <div className="absolute inset-0 pointer-events-none" style={{ width: '100%', height: '100%', position: 'relative' }}>
        <Aurora
          colorStops={["#39209d", "#2f1499", "#261371"]}
          amplitude={0.3}
          blend={1}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-6xl font-bold">
            Our <span className="text-primary">Work</span>
          </h2>
          <p className="text-text-primary/70">Every Frame, A Story</p>
        </div>

        {/* CATEGORIES */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full border ${
                activeCategory === cat
                  ? "bg-primary/20 border-primary text-primary"
                  : "border-white/20 text-white/70"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* GRID - Responsive layout with proper short sizing */}
        <AnimatePresence>
          <motion.div
            layout
            className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6 auto-rows-max"
          >
            {displayed.map((item) => {
              const videoUrl = getVideoUrl(item);
              if (!videoUrl) return null;

              const isShort = item.format === "short";

              return (
                <motion.div
                  key={item._id}
                  layout
                  className={`${isShort ? "col-span-1 max-w-[160px] sm:max-w-[200px] md:max-w-[240px] mx-auto lg:max-w-[280px]" : "col-span-2 sm:col-span-1 lg:col-span-1"}`}
                >
                  <Tilt scale={1.02}>
                    <div className="group relative rounded-2xl overflow-hidden h-full flex flex-col">
                      {/* Image Container - Fixed aspect ratio */}
                      <div
                        className="relative w-full bg-black flex-shrink-0"
                        style={{
                          aspectRatio: isShort ? "9 / 16" : "16 / 9",
                        }}
                      >
                        <Image
                          src={getThumbnail(item)}
                          alt={item.title}
                          fill
                          className="object-cover"
                          sizes={isShort ? "(max-width: 640px) 50vw, (max-width: 1024px) 200px, 280px" : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"}
                        />

                        <button
                          onClick={() =>
                            setSelectedVideo({
                              url: videoUrl,
                              format: isShort ? "short" : "horizontal",
                            })
                          }
                          className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <FaPlay className="text-white text-2xl sm:text-3xl" />
                        </button>
                      </div>

                      {/* Text Container - Fixed height to maintain alignment */}
                      <div className="p-3 sm:p-4 bg-dark-lighter/50 backdrop-blur-sm border border-text-primary/10 rounded-b-2xl flex-shrink-0 h-[80px] sm:h-[90px] md:h-[100px] flex flex-col justify-between">
                        <h3 className="font-semibold text-text-primary text-xs sm:text-sm md:text-base line-clamp-2 mb-1 leading-tight">
                          {item.title}
                        </h3>
                        <p className="text-xs text-text-primary/60 truncate">
                          {item.category}
                        </p>
                      </div>
                    </div>
                  </Tilt>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* HOME CTA */}
        {isHomepage && items.length > 8 && (
          <div className="text-center mt-10">
            <a
              href="/portfolio"
              className="inline-block px-8 py-3 border border-primary text-primary rounded-lg"
            >
              View All Projects
            </a>
          </div>
        )}
      </div>

      {/* MODAL */}
      {selectedVideo && (
        <VideoModal
          isOpen={!!selectedVideo}
          onClose={() => setSelectedVideo(null)}
          videoSrc={selectedVideo.url}
          format={selectedVideo.format}
          isYouTube={isYouTubeUrl(selectedVideo.url)}
          youtubeId={isYouTubeUrl(selectedVideo.url) ? getYouTubeId(selectedVideo.url) || undefined : undefined}
        />
      )}
    </section>
  );
}
