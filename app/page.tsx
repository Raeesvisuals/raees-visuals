"use client";

import Hero from "@/components/Hero";
import ServicesSection from "@/components/ServicesSection";
import IntroSection from "@/components/IntroVideoModel";
import Portfolio from "@/components/Portfolio";
import CTASection from "@/components/CTASection";
import TestimonialsSection from "@/components/TestimonialsSection";
import AboutSection from "@/components/AboutSection";
import ContactForm from "@/components/ContactForm";
import ContactSection from "@/components/ContactSection";

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
