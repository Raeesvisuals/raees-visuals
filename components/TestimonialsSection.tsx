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
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

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
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
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

  const paginate = (direction: number) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (direction === 1) {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    } else {
      setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    }
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
            <div className="relative h-[600px] md:h-[500px] flex items-center justify-center overflow-visible">
              <div className="relative w-full max-w-7xl mx-auto" style={{ perspective: '1000px' }}>
                {displayedTestimonials.map((testimonial, position) => {
                  if (!testimonial) return null;

                  const imageUrl = testimonial.image
                    ? urlFor(testimonial.image)
                        .width(150)
                        .height(150)
                        .fit("crop")
                        .url()
                    : null;

                  // Position: 0 = left, 1 = center, 2 = right
                  const isCenter = position === 1;
                  const isLeft = position === 0;
                  const isRight = position === 2;

                  // Calculate pixel positions for proper alignment
                  // Center card at 0, left at -400px, right at +400px (adjust based on card width)
                  const getXPosition = () => {
                    if (isLeft) return -400; // Left side
                    if (isCenter) return 0; // Center
                    return 400; // Right side
                  };

                  const getInitialX = () => {
                    if (isLeft) return -800; // Start further left
                    if (isCenter) return 0; // Start at center
                    return 800; // Start further right
                  };

                  return (
                    <motion.div
                      key={`${testimonial._id}-${currentIndex}-${position}`}
                      initial={{
                        x: getInitialX(),
                        scale: isCenter ? 1 : 0.75,
                        opacity: isCenter ? 1 : 0.4,
                      }}
                      animate={{
                        x: getXPosition(),
                        scale: isCenter ? 1 : 0.75,
                        opacity: isCenter ? 1 : 0.6,
                        zIndex: isCenter ? 10 : isLeft ? 5 : 5,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 280,
                        damping: 28,
                        mass: 0.6
                      }}
                      className={`absolute ${
                        isCenter 
                          ? 'w-full max-w-4xl' 
                          : 'w-full max-w-3xl'
                      }`}
                      style={{
                        left: '50%',
                        transform: 'translateX(-50%)',
                      }}
                    >
                      <div className={`
                        bg-dark-lighter/50 backdrop-blur-md border rounded-2xl p-6 md:p-8
                        transition-all duration-300
                        ${isCenter 
                          ? 'border-primary/30 shadow-lg shadow-primary/10' 
                          : 'border-text-primary/10 hover:border-text-primary/20'
                        }
                      `}>
                        {/* Stars */}
                        <div className="flex gap-1 mb-4 justify-center">
                          {[...Array(testimonial.rating || 5)].map((_, i) => (
                            <FiStar 
                              key={i} 
                              className={`text-yellow-400 fill-yellow-400 ${
                                isCenter ? 'w-6 h-6' : 'w-4 h-4'
                              }`} 
                            />
                          ))}
                        </div>

                        {/* Content */}
                        <p className={`
                          text-text-primary/90 mb-6 leading-relaxed text-center italic
                          ${isCenter ? 'text-base md:text-lg' : 'text-sm md:text-base'}
                        `}>
                          &quot;{testimonial.quote}&quot;
                        </p>

                        {/* Author */}
                        <div className="flex items-center gap-4 justify-center">
                          {imageUrl && (
                            <div className={`
                              rounded-full overflow-hidden border-2 border-primary/30 flex-shrink-0
                              ${isCenter ? 'w-16 h-16' : 'w-12 h-12'}
                            `}>
                              <Image
                                src={imageUrl}
                                alt={testimonial.name}
                                width={isCenter ? 64 : 48}
                                height={isCenter ? 64 : 48}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div className="text-center">
                            <div className={`
                              font-semibold text-text-primary mb-1
                              ${isCenter ? 'text-lg' : 'text-base'}
                            `}>
                              {testimonial.name}
                            </div>
                            {testimonial.role && (
                              <div className={`
                                text-text-primary/60 mb-1
                                ${isCenter ? 'text-sm' : 'text-xs'}
                              `}>
                                {testimonial.role}
                              </div>
                            )}
                            {testimonial.niche && (
                              <div className={`
                                text-primary font-medium
                                ${isCenter ? 'text-xs' : 'text-xs opacity-80'}
                              `}>
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

