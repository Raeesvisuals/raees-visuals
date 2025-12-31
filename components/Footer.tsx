"use client";

import React from "react";
import { motion } from "framer-motion";
import { FaInstagram, FaYoutube } from "react-icons/fa";
import { SiFiverr } from "react-icons/si";

const Footer: React.FC = () => {
  const socialLinks = [
    {
      name: "Instagram",
      icon: <FaInstagram className="w-5 h-5" />,
      url: "https://instagram.com",
    },
    {
      name: "YouTube",
      icon: <FaYoutube className="w-5 h-5" />,
      url: "https://youtube.com",
    },
    {
      name: "Fiverr",
      icon: <SiFiverr className="w-5 h-5" />,
      url: "https://fiverr.com",
    },
  ];

  return (
    <footer className="border-t border-dark-lighter bg-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Copyright */}
          <div className="text-sm text-text-primary/70">
            Copyright © Raees Visuals 2025
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-6">
            {socialLinks.map((social) => (
              <motion.a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-primary/70 hover:text-primary transition-colors"
                whileHover={{ scale: 1.2, y: -2 }}
                whileTap={{ scale: 0.95 }}
                aria-label={social.name}
              >
                {social.icon}
              </motion.a>
            ))}
          </div>
        </div>

        {/* Glow Line */}
        <motion.div
          className="mt-6 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          style={{
            boxShadow: "0 0 10px rgba(0, 255, 255, 0.3)",
          }}
        />
      </div>
    </footer>
  );
};

export default Footer;

