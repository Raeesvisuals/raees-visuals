"use client";

import dynamic from "next/dynamic";
import Hero from "@/components/Hero";
import ServicesSection from "@/components/ServicesSection";

// Lazy load heavy components - only load when user scrolls to them
const IntroSection = dynamic(() => import("@/components/IntroVideoModel"), {
  ssr: false,
});

const Portfolio = dynamic(() => import("@/components/Portfolio"), {
  ssr: false,
});

const CTASection = dynamic(() => import("@/components/CTASection"), {
  ssr: false,
});

const TestimonialsSection = dynamic(() => import("@/components/TestimonialsSection"), {
  ssr: false,
});

const AboutSection = dynamic(() => import("@/components/AboutSection"), {
  ssr: false,
});

const ContactForm = dynamic(() => import("@/components/ContactForm"), {
  ssr: false,
});

const ContactSection = dynamic(() => import("@/components/ContactSection"), {
  ssr: false,
});

export default function Home() {
  return (
    <>
      <Hero />
      <ServicesSection />
      <IntroSection />
      <Portfolio isHomepage />
      <CTASection />
      <TestimonialsSection />
      <AboutSection />
      <ContactForm />
      <ContactSection />
    </>
  );
}
