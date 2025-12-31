"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface GlassIconItem {
  icon: React.ReactNode;
  color: string;
  label: string;
}

interface GlassIconsProps {
  items: GlassIconItem[];
  className?: string;
}

const GlassIcons: React.FC<GlassIconsProps> = ({ items, className = '' }) => {
  const colorMap: { [key: string]: string } = {
    blue: '#3b82f6',
    purple: '#a855f7',
    red: '#ef4444',
    indigo: '#6366f1',
    orange: '#f97316',
    green: '#10b981',
    cyan: '#00FFFF',
  };

  return (
    <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 ${className}`}>
      {items.map((item, index) => (
        <motion.div
          key={index}
          className="relative group cursor-pointer"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          whileHover={{ scale: 1.05, y: -5 }}
          whileTap={{ scale: 0.95 }}
        >
          <div
            className="relative bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 overflow-hidden"
            style={{
              boxShadow: `0 8px 32px ${colorMap[item.color]}20`,
            }}
          >
            {/* Glow effect */}
            <motion.div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: `radial-gradient(circle at center, ${colorMap[item.color]}30 0%, transparent 70%)`,
              }}
            />

            {/* Icon */}
            <div
              className="relative text-5xl mb-4 flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
              style={{ color: colorMap[item.color] }}
            >
              {item.icon}
            </div>

            {/* Label */}
            <div className="relative text-center text-sm font-medium text-white/90">
              {item.label}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default GlassIcons;

