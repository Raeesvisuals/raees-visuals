"use client";

import React from "react";
import { motion } from "framer-motion";
import { FaEnvelope, FaInstagram, FaLinkedin, FaTelegram } from "react-icons/fa";

const ContactSection: React.FC = () => {
  return (
    <section id="contact" className="relative py-20 px-4 overflow-hidden">
      {/* Background Effects */}
      <motion.div
        className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-4">
            Let&apos;s <span className="text-primary glow-text">Connect</span>
          </h2>
          <p className="text-lg text-text-primary/70 max-w-2xl mx-auto">
            Ready to bring your vision to life? Reach out and let&apos;s create something
            extraordinary together.
          </p>
        </motion.div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Email Card */}
          <motion.div
            className="group relative p-8 bg-dark-lighter/50 backdrop-blur-md border border-text-primary/10 rounded-2xl overflow-hidden"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            whileHover={{ borderColor: "rgba(0, 255, 255, 0.5)" }}
          >
            <div className="relative z-10">
              <div className="w-14 h-14 mb-4 rounded-full bg-primary/10 border border-primary/50 flex items-center justify-center">
                <FaEnvelope className="text-primary text-2xl" />
              </div>
              <h3 className="text-2xl font-semibold text-text-primary mb-2">
                Email Us
              </h3>
              <a
                href="mailto:contact@raeesstudio.com"
                className="text-text-primary/70 hover:text-primary transition-colors"
              >
                contact@raeesstudio.com
              </a>
            </div>
            <motion.div
              className="absolute inset-0 bg-primary/5"
              initial={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              style={{ originX: 0, originY: 0 }}
            />
          </motion.div>

          {/* Social Card */}
          <motion.div
            className="group relative p-8 bg-dark-lighter/50 backdrop-blur-md border border-text-primary/10 rounded-2xl overflow-hidden"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            whileHover={{ borderColor: "rgba(0, 255, 255, 0.5)" }}
          >
            <div className="relative z-10">
              <h3 className="text-2xl font-semibold text-text-primary mb-4">
                Follow Us
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <motion.a
                  href="https://www.instagram.com/raeesvisuals/?hl=en"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative p-4 rounded-xl bg-gradient-to-br from-pink-500/20 to-purple-600/20 border border-pink-500/30 flex items-center justify-center hover:border-pink-400/50 transition-all"
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaInstagram className="text-2xl text-pink-400 group-hover:text-pink-300 transition-colors" />
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-purple-600/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute -inset-0.5 bg-gradient-to-br from-pink-500/20 to-purple-600/20 rounded-xl blur opacity-0 group-hover:opacity-50 transition-opacity" />
                </motion.a>

                <motion.a
                  href="https://x.com/Raees_visuals"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative p-4 rounded-xl bg-gradient-to-br from-gray-800/20 to-gray-900/20 border border-gray-600/30 flex items-center justify-center hover:border-gray-500/50 transition-all"
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="text-2xl text-gray-300 group-hover:text-white transition-colors w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-700/10 to-gray-800/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute -inset-0.5 bg-gradient-to-br from-gray-600/20 to-gray-700/20 rounded-xl blur opacity-0 group-hover:opacity-50 transition-opacity" />
                </motion.a>

                <motion.a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative p-4 rounded-xl bg-gradient-to-br from-blue-600/20 to-blue-800/20 border border-blue-600/30 flex items-center justify-center hover:border-blue-500/50 transition-all"
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaLinkedin className="text-2xl text-blue-400 group-hover:text-blue-300 transition-colors" />
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-blue-800/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute -inset-0.5 bg-gradient-to-br from-blue-600/20 to-blue-800/20 rounded-xl blur opacity-0 group-hover:opacity-50 transition-opacity" />
                </motion.a>

                <motion.a
                  href="https://t.me/raeesvisuals"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative p-4 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-600/20 border border-blue-500/30 flex items-center justify-center hover:border-blue-400/50 transition-all"
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaTelegram className="text-2xl text-blue-400 group-hover:text-blue-300 transition-colors" />
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-600/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute -inset-0.5 bg-gradient-to-br from-blue-500/20 to-cyan-600/20 rounded-xl blur opacity-0 group-hover:opacity-50 transition-opacity" />
                </motion.a>
              </div>
            </div>
            <motion.div
              className="absolute inset-0 bg-primary/5"
              initial={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              style={{ originX: 1, originY: 0 }}
            />
          </motion.div>
        </div>

        {/* Quick Info */}
        <motion.div
          className="text-center p-8 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 backdrop-blur-md border border-primary/20 rounded-2xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <p className="text-text-primary/80 text-lg">
            📍 Available worldwide for remote projects
          </p>
          <p className="text-text-primary/60 mt-2">
            Response time: Within 24 hours
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;

