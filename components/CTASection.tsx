"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { sanityClient } from "@/lib/sanity";

type CTAData = {
  ctaTitle?: string;
  ctaDescription?: string;
  ctaPrimaryButton?: string;
  ctaSecondaryButton?: string;
  ctaTwitterUrl?: string;
};

export default function CTASection() {
  const [data, setData] = useState<CTAData | null>(null);

  useEffect(() => {
    async function fetchCTAData() {
      try {
        const result = await sanityClient.fetch<CTAData>(
          `coalesce(
            *[_type == "home" && _id == "home"][0],
            *[_type == "home"][0]
          ){
            ctaTitle,
            ctaDescription,
            ctaPrimaryButton,
            ctaSecondaryButton,
            ctaTwitterUrl
          }`
        );
        setData(result || null);
      } catch (error) {
        console.error("Error fetching CTA data:", error);
        setData(null);
      }
    }

    fetchCTAData();
  }, []);

  // Don't render if no data
  if (!data || (!data.ctaTitle && !data.ctaDescription)) {
    return null;
  }

  const handleGetQuote = () => {
    const contactForm = document.getElementById("contact-form");
    if (contactForm) {
      contactForm.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleTwitterClick = () => {
    if (data.ctaTwitterUrl) {
      window.open(data.ctaTwitterUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <section className="relative py-20 px-4 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark via-dark-lighter/30 to-dark pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto">
        <motion.div
          className="bg-dark-lighter/30 backdrop-blur-md border-2 border-primary/40 rounded-2xl p-8 md:p-12 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Title */}
          {data.ctaTitle && (
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-text-primary">
              {data.ctaTitle}
            </h2>
          )}

          {/* Description */}
          {data.ctaDescription && (
            <p className="text-lg text-text-primary/70 mb-8 leading-relaxed max-w-2xl mx-auto">
              {data.ctaDescription}
            </p>
          )}

          {/* Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            {data.ctaPrimaryButton && (
              <button
                onClick={handleGetQuote}
                className="px-8 py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary hover:text-black transition-colors"
              >
                {data.ctaPrimaryButton}
              </button>
            )}

            {data.ctaSecondaryButton && data.ctaTwitterUrl && (
              <button
                onClick={handleTwitterClick}
                className="px-8 py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary hover:text-black transition-colors"
              >
                {data.ctaSecondaryButton}
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}


