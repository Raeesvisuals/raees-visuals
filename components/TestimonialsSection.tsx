"use client";

import React, { useRef, useEffect, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { FiStar } from 'react-icons/fi';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const prevIndexRef = useRef(0);

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

  // Auto-slide functionality
  useEffect(() => {
    if (testimonials.length <= 1) return;

    intervalRef.current = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => {
        prevIndexRef.current = prev;
        return (prev + 1) % testimonials.length;
      });
    }, 5000); // Change slide every 5 seconds

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [testimonials.length]);

  const getTestimonialIndex = (offset: number) => {
    const index = (currentIndex + offset + testimonials.length) % testimonials.length;
    return index;
  };

  const paginate = (dir: number) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setDirection(dir);
    setCurrentIndex((prev) => {
      prevIndexRef.current = prev;
      if (dir === 1) {
        return (prev + 1) % testimonials.length;
      } else {
        return (prev - 1 + testimonials.length) % testimonials.length;
      }
    });
  };

  // Get the three testimonials to display
  const getDisplayedTestimonials = () => {
    if (testimonials.length === 0) return [];
    if (testimonials.length === 1) return [testimonials[0], null, null];
    if (testimonials.length === 2) return [testimonials[getTestimonialIndex(-1)], testimonials[currentIndex], testimonials[currentIndex]];
    return [
      testimonials[getTestimonialIndex(-1)], // Left (previous)
      testimonials[currentIndex], // Center (current)
      testimonials[getTestimonialIndex(1)] // Right (next)
    ];
  };

  const displayedTestimonials = getDisplayedTestimonials();

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

        {/* Testimonials Slider */}
        {testimonials.length > 0 ? (
          <div className="relative">
            {/* Slider Container */}
            <div className="relative overflow-hidden">
              <motion.div
                className="flex gap-6"
                animate={{
                  x: currentIndex === 0 ? 0 : `-${(currentIndex * 100) / 3}%`
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                  mass: 0.8
                }}
                drag="x"
                dragConstraints={{ 
                  left: 0,
                  right: 0
                }}
                dragElastic={0.2}
                onDragEnd={(e, { offset, velocity }) => {
                  const swipe = Math.abs(offset.x) * Math.sign(offset.x);
                  const swipeThreshold = 50;
                  
                  if (Math.abs(swipe) > swipeThreshold || Math.abs(velocity.x) > 500) {
                    if (swipe > 0 && currentIndex > 0) {
                      paginate(-1);
                    } else if (swipe < 0 && currentIndex < Math.max(0, testimonials.length - 3)) {
                      paginate(1);
                    }
                  }
                }}
              >
                {testimonials.map((testimonial, index) => {
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
                      className="flex-shrink-0 w-full md:w-1/3"
                      style={{ width: 'calc(33.333% - 1rem)' }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <div className="bg-dark-lighter/50 backdrop-blur-md border border-text-primary/10 rounded-2xl p-6 md:p-8 h-full hover:border-primary/30 transition-all duration-300">
                        {/* Stars */}
                        <div className="flex gap-1 mb-4">
                          {[...Array(testimonial.rating || 5)].map((_, i) => (
                            <FiStar 
                              key={i} 
                              className="text-yellow-400 fill-yellow-400 w-5 h-5" 
                            />
                          ))}
                        </div>

                        {/* Content */}
                        <p className="text-text-primary/90 mb-6 leading-relaxed text-sm md:text-base">
                          &quot;{testimonial.quote}&quot;
                        </p>

                        {/* Author */}
                        <div className="flex items-center gap-4">
                          {imageUrl && (
                            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary/30 flex-shrink-0">
                              <Image
                                src={imageUrl}
                                alt={testimonial.name}
                                width={48}
                                height={48}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div>
                            <div className="font-semibold text-text-primary text-base">
                              {testimonial.name}
                            </div>
                            {testimonial.role && (
                              <div className="text-sm text-text-primary/60">
                                {testimonial.role}
                              </div>
                            )}
                            {testimonial.niche && (
                              <div className="text-xs text-primary font-medium mt-1">
                                {testimonial.niche}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>

              {/* Navigation Arrows */}
              {testimonials.length > 1 && (
                <>
                  <button
                    onClick={() => paginate(-1)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-dark-lighter/80 backdrop-blur-md border border-text-primary/20 hover:border-primary/50 text-text-primary hover:text-primary transition-all flex items-center justify-center"
                    aria-label="Previous testimonial"
                  >
                    <FaChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => paginate(1)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-dark-lighter/80 backdrop-blur-md border border-text-primary/20 hover:border-primary/50 text-text-primary hover:text-primary transition-all flex items-center justify-center"
                    aria-label="Next testimonial"
                  >
                    <FaChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Dots Indicator */}
            {testimonials.length > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      if (intervalRef.current) {
                        clearInterval(intervalRef.current);
                      }
                      setCurrentIndex(index);
                    }}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentIndex
                        ? 'bg-primary w-8'
                        : 'bg-text-primary/30 hover:bg-text-primary/50'
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
            )}
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

