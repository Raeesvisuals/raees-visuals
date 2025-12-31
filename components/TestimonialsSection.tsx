"use client";

import React, { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { FiStar } from 'react-icons/fi';
import Image from 'next/image';
import { sanityClient, urlFor } from '@/lib/sanity';

type Testimonial = {
  _id: string;
  name: string;
  role?: string;
  niche?: string;
  quote: string;
  rating: number;
  image?: any; // Sanity image type
  order: number;
};

const TestimonialsSection: React.FC = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const result = await sanityClient.fetch<Testimonial[]>(
          `*[_type == "testimonial" && showOnHome == true] | order(order asc) {
            _id,
            name,
            role,
            niche,
            quote,
            rating,
            image {
              asset,
              hotspot,
              crop
            },
            order
          }`
        );
        setTestimonials(result || []);
      } catch (error) {
        console.error('Error fetching testimonials:', error);
        setTestimonials([]);
      }
    }

    fetchTestimonials();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-20 px-4 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark-lighter/30 via-dark to-dark-lighter/30 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-4">
            Client <span className="text-primary glow-text">Testimonials</span>
          </h2>
          <p className="text-lg text-text-primary/70 max-w-3xl mx-auto">
            Don&apos;t just take our word for it — hear from satisfied clients
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        {testimonials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {testimonials.map((testimonial, index) => {
              // Build image URL using Sanity's urlFor helper
              // Use hotspot and crop data to center on the face for circular display
              const imageUrl = testimonial.image
                ? urlFor(testimonial.image)
                    .width(150)
                    .height(150)
                    .fit("crop")
                    .url()
                : null;

              return (
                <motion.div
                  key={testimonial._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="h-full bg-dark-lighter/50 backdrop-blur-md border border-text-primary/10 rounded-2xl p-6 hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/5">
                    {/* Stars */}
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating || 5)].map((_, i) => (
                        <FiStar key={i} className="text-yellow-400 fill-yellow-400 w-5 h-5" />
                      ))}
                    </div>

                    {/* Content */}
                    <p className="text-text-primary/80 mb-6 leading-relaxed text-sm">
                      &quot;{testimonial.quote}&quot;
                    </p>

                    {/* Author */}
                    <div className="flex items-center gap-4">
                      {imageUrl && (
                        <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-primary/30 flex-shrink-0">
                          <Image
                            src={imageUrl}
                            alt={testimonial.name}
                            width={56}
                            height={56}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-grow">
                        <div className="font-semibold text-text-primary text-base">
                          {testimonial.name}
                        </div>
                        {testimonial.role && (
                          <div className="text-sm text-text-primary/60 mb-1">
                            {testimonial.role}
                          </div>
                        )}
                        {testimonial.niche && (
                          <div className="text-xs text-primary font-medium">
                            {testimonial.niche}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 text-text-primary/60">
            No testimonials available yet.
          </div>
        )}

      </div>
    </section>
  );
};

export default TestimonialsSection;

