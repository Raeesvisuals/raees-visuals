"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { sanityClient } from "@/lib/sanity";

type HomeHero = {
  heroTitle?: string;
  heroTagline?: string;
  heroDescription?: string;
};

export default function Hero() {
  const [data, setData] = useState<HomeHero | null>(null);

  useEffect(() => {
    async function fetchHeroData() {
      try {
        console.log("🔍 Hero: Fetching data from Sanity...");
        console.log("📋 Sanity config:", {
          projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
          dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
        });
        
        const result = await sanityClient.fetch<HomeHero>(
          `*[_type == "home"][0]{
            heroTitle,
            heroTagline,
            heroDescription
          }`
        );
        
        console.log("✅ Hero: Data fetched:", result);
        setData(result || null);
        
        if (!result) {
          console.warn("⚠️ Hero: No data found in Sanity. Make sure you have a 'home' document in your Sanity Studio.");
        }
      } catch (error) {
        console.error("❌ Hero: Error fetching data:", error);
        setData(null);
      }
    }

    fetchHeroData();
  }, []);

  // Fallback values - only used if Sanity data is empty
  const heroTitle = data?.heroTitle || "";
  const heroTagline = data?.heroTagline || "";
  const heroDescription = data?.heroDescription || "";

  return (
    <section className="relative h-[50vh] min-h-[420px] bg-[#060010] flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-black to-black" />

      <div className="relative w-[86%] h-[60%] border-2 border-primary rounded-2xl flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center max-w-3xl"
        >
          {(heroTitle || heroTagline) && (
            <h1 className="font-bold mb-6">
              {heroTitle && (
                <span className="block text-4xl md:text-6xl text-primary">
                  {heroTitle}
                </span>
              )}
              {heroTagline && (
                <span className="block text-4xl md:text-6xl mt-2">
                  — {heroTagline}
                </span>
              )}
            </h1>
          )}
          {heroDescription && (
            <p className="text-lg text-text-primary/70">
              {heroDescription}
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
