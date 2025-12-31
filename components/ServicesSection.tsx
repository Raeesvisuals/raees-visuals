"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import GlassIcons from "./GlassIcons";
import ElectricBorder from "./ElectricBorder";
import { sanityClient } from "@/lib/sanity";

import {
  FiVideo,
  FiFilm,
  FiEdit3,
  FiTrendingUp,
  FiAward,
  FiZap,
} from "react-icons/fi";

/* =========================
   ICON + COLOR MAP (FIX)
========================= */
const ICON_MAP: Record<
  string,
  { icon: JSX.Element; color: string }
> = {
  video: {
    icon: <FiVideo />,
    color: "cyan",
  },
  grading: {
    icon: <FiFilm />,
    color: "purple",
  },
  motion: {
    icon: <FiEdit3 />,
    color: "blue",
  },
  social: {
    icon: <FiTrendingUp />,
    color: "green",
  },
  brand: {
    icon: <FiAward />,
    color: "orange",
  },
  fast: {
    icon: <FiZap />,
    color: "red",
  },
};

type ServicesData = {
  servicesTitle?: string;
  servicesSubtitle?: string;
  services?: {
    title: string;
    icon: string;
  }[];
  premiumServiceTitle?: string;
  premiumServiceDescription?: string;
  premiumServiceBullets?: string[];
};

export default function ServicesSection() {
  const [data, setData] = useState<ServicesData | null>(null);

  useEffect(() => {
    async function fetchServicesData() {
      try {
        const result = await sanityClient.fetch<ServicesData>(
          `*[_type == "home"][0]{
            servicesTitle,
            servicesSubtitle,
            services,
            premiumServiceTitle,
            premiumServiceDescription,
            premiumServiceBullets
          }`
        );
        setData(result || null);
      } catch (error) {
        console.error("Error fetching services data:", error);
        setData(null);
      }
    }

    fetchServicesData();
  }, []);

  // Fallback values - only used if Sanity data is empty
  const title = data?.servicesTitle || "";
  const subtitle = data?.servicesSubtitle || "";
  const services = data?.services || [];
  const premiumTitle = data?.premiumServiceTitle || "";
  const premiumDescription = data?.premiumServiceDescription || "";
  const premiumBullets = data?.premiumServiceBullets || [];
  /* =========================
     BUILD ICON GRID DATA
  ========================= */
  const serviceItems =
    services?.map((s) => {
      const map = ICON_MAP[s.icon];

      return {
        label: s.title,
        icon: map?.icon ?? <FiVideo />,
        color: map?.color ?? "cyan",
      };
    }) ?? [];

  // Don't render if no data
  if (!title && !subtitle && services.length === 0 && !premiumTitle) {
    return null;
  }

  return (
    <section className="relative py-20 px-4 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark via-dark-lighter/30 to-dark pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* HEADER */}
        {(title || subtitle) && (
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {title && (
              <h2 className="text-4xl md:text-6xl font-bold mb-4">
                {title.split(" ").map((w, i) =>
                  i === 1 ? (
                    <span key={i} className="text-primary glow-text">
                      {" "}
                      {w}
                    </span>
                  ) : (
                    <span key={i}> {w}</span>
                  )
                )}
              </h2>
            )}

            {subtitle && (
              <p className="text-lg text-text-primary/70 max-w-3xl mx-auto">
                {subtitle}
              </p>
            )}
          </motion.div>
        )}

        {/* ICON GRID */}
        {services.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <GlassIcons items={serviceItems} className="max-w-6xl mx-auto" />
          </motion.div>
        )}

        {/* PREMIUM CARD */}
        {premiumTitle && (
          <motion.div
            className="mt-16 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <ElectricBorder
              color="#00FFFF"
              speed={1}
              chaos={0.5}
              thickness={2}
              style={{ borderRadius: 16 }}
            >
              <div className="bg-dark-lighter/50 backdrop-blur-md p-8 rounded-2xl">
                <h3 className="text-2xl font-bold mb-4">{premiumTitle}</h3>

                {premiumDescription && (
                  <p className="text-text-primary/70 mb-6">
                    {premiumDescription}
                  </p>
                )}

                {premiumBullets.length > 0 && (
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-text-primary/60">
                    {premiumBullets.map((b, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="text-primary">✓</span>
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </ElectricBorder>
          </motion.div>
        )}
      </div>
    </section>
  );
}
