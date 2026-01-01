"use client";

import React, { useState } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import dynamic from "next/dynamic";
import { shouldDisableHeavyEffects } from "@/lib/utils";

// Lazy load LiquidEther - only load on desktop
const LiquidEther = dynamic(() => import("./LiquidEther"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-dark to-dark" />
});

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

const ContactForm: React.FC = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log("Form submitted:", formData);

    setIsSubmitting(false);
    setSubmitSuccess(true);

    // Reset form
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });

    // Reset success message after 3 seconds
    setTimeout(() => setSubmitSuccess(false), 3000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <section
      ref={sectionRef}
      id="contact-form"
      className="relative py-20 px-4 overflow-hidden"
    >
      {/* Liquid Ether Background */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        {!shouldDisableHeavyEffects() ? (
          <LiquidEther
            colors={["#5227FF", "#00FFFF", "#FF9FFC"]}
            mouseForce={20}
            cursorSize={100}
            isViscous={true}
            viscous={25}
            resolution={0.4}
            autoDemo={true}
            autoSpeed={0.35}
            autoIntensity={2.0}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-dark to-dark" />
        )}
      </div>
      
      {/* Background Effects */}
      <motion.div
        className="absolute top-20 left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <div className="relative z-10 max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-4">
            Let&apos;s Work <span className="text-primary glow-text">Together</span>
          </h2>
          <p className="text-lg text-text-primary/70">
            Ready to bring your vision to life? Drop us a message.
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          className="bg-dark-lighter/30 backdrop-blur-md border border-primary/20 rounded-3xl p-6 md:p-8"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-text-primary mb-2"
              >
                Name
              </label>
              <motion.input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-dark/50 border rounded-lg text-text-primary placeholder-text-primary/40 focus:outline-none focus:border-primary transition-colors ${
                  errors.name ? "border-red-500" : "border-text-primary/20"
                }`}
                placeholder="Your name"
                whileFocus={{ scale: 1.01 }}
              />
              {errors.name && (
                <motion.p
                  className="text-red-500 text-sm mt-1"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {errors.name}
                </motion.p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-text-primary mb-2"
              >
                Email
              </label>
              <motion.input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-dark/50 border rounded-lg text-text-primary placeholder-text-primary/40 focus:outline-none focus:border-primary transition-colors ${
                  errors.email ? "border-red-500" : "border-text-primary/20"
                }`}
                placeholder="your@email.com"
                whileFocus={{ scale: 1.01 }}
              />
              {errors.email && (
                <motion.p
                  className="text-red-500 text-sm mt-1"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {errors.email}
                </motion.p>
              )}
            </div>

            {/* Subject */}
            <div>
              <label
                htmlFor="subject"
                className="block text-sm font-medium text-text-primary mb-2"
              >
                Subject
              </label>
              <motion.input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-dark/50 border rounded-lg text-text-primary placeholder-text-primary/40 focus:outline-none focus:border-primary transition-colors ${
                  errors.subject ? "border-red-500" : "border-text-primary/20"
                }`}
                placeholder="What's this about?"
                whileFocus={{ scale: 1.01 }}
              />
              {errors.subject && (
                <motion.p
                  className="text-red-500 text-sm mt-1"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {errors.subject}
                </motion.p>
              )}
            </div>

            {/* Message */}
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-text-primary mb-2"
              >
                Message
              </label>
              <motion.textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={6}
                className={`w-full px-4 py-3 bg-dark/50 border rounded-lg text-text-primary placeholder-text-primary/40 focus:outline-none focus:border-primary transition-colors resize-none ${
                  errors.message ? "border-red-500" : "border-text-primary/20"
                }`}
                placeholder="Tell us about your project..."
                whileFocus={{ scale: 1.01 }}
              />
              {errors.message && (
                <motion.p
                  className="text-red-500 text-sm mt-1"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {errors.message}
                </motion.p>
              )}
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full px-8 py-4 bg-primary/10 backdrop-blur-md border border-primary/50 rounded-lg overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              animate={
                isSubmitting
                  ? {
                      boxShadow: [
                        "0 0 20px rgba(0, 255, 255, 0.3)",
                        "0 0 40px rgba(0, 255, 255, 0.6)",
                        "0 0 20px rgba(0, 255, 255, 0.3)",
                      ],
                    }
                  : {}
              }
              transition={{ duration: 1, repeat: isSubmitting ? Infinity : 0 }}
            >
              <span className="relative z-10 text-primary font-semibold text-lg">
                {isSubmitting ? "Sending..." : "Send Message"}
              </span>
              <motion.div
                className="absolute inset-0 bg-primary/20"
                initial={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>

            {/* Success Message */}
            {submitSuccess && (
              <motion.div
                className="text-center p-4 bg-primary/20 border border-primary/50 rounded-lg"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <p className="text-primary font-semibold">
                  ✓ Message sent successfully!
                </p>
                <p className="text-text-primary/70 text-sm mt-1">
                  We&apos;ll get back to you within 24 hours.
                </p>
              </motion.div>
            )}
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactForm;

