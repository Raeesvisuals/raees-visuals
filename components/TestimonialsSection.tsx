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
  const [direction, setDirection] = useState(0);
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
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000); // Change slide every 5 seconds

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [testimonials.length]);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection: number) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setDirection(newDirection);
    if (newDirection === 1) {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    } else {
      setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    }
  };

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
            <div className="relative overflow-hidden rounded-2xl">
              <AnimatePresence initial={false} custom={direction}>
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 }
                  }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={1}
                  onDragEnd={(e, { offset, velocity }) => {
                    const swipe = swipePower(offset.x, velocity.x);

                    if (swipe < -swipeConfidenceThreshold) {
                      paginate(1);
                    } else if (swipe > swipeConfidenceThreshold) {
                      paginate(-1);
                    }
                  }}
                  className="w-full"
                >
                  {(() => {
                    const testimonial = testimonials[currentIndex];
                    const imageUrl = testimonial.image
                      ? urlFor(testimonial.image)
                          .width(150)
                          .height(150)
                          .fit("crop")
                          .url()
                      : null;

                    return (
                      <div className="max-w-4xl mx-auto">
                        <div className="bg-dark-lighter/50 backdrop-blur-md border border-text-primary/10 rounded-2xl p-8 md:p-12 hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/5">
                          {/* Stars */}
                          <div className="flex gap-1 mb-6 justify-center">
                            {[...Array(testimonial.rating || 5)].map((_, i) => (
                              <FiStar key={i} className="text-yellow-400 fill-yellow-400 w-6 h-6" />
                            ))}
                          </div>

                          {/* Content */}
                          <p className="text-text-primary/90 mb-8 leading-relaxed text-lg md:text-xl text-center italic">
                            &quot;{testimonial.quote}&quot;
                          </p>

                          {/* Author */}
                          <div className="flex items-center gap-6 justify-center">
                            {imageUrl && (
                              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary/30 flex-shrink-0">
                                <Image
                                  src={imageUrl}
                                  alt={testimonial.name}
                                  width={80}
                                  height={80}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            <div className="text-center md:text-left">
                              <div className="font-semibold text-text-primary text-xl mb-1">
                                {testimonial.name}
                              </div>
                              {testimonial.role && (
                                <div className="text-base text-text-primary/60 mb-1">
                                  {testimonial.role}
                                </div>
                              )}
                              {testimonial.niche && (
                                <div className="text-sm text-primary font-medium">
                                  {testimonial.niche}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </motion.div>
              </AnimatePresence>

              {/* Navigation Arrows */}
              {testimonials.length > 1 && (
                <>
                  <button
                    onClick={() => paginate(-1)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-dark-lighter/80 backdrop-blur-md border border-text-primary/20 hover:border-primary/50 text-text-primary hover:text-primary transition-all flex items-center justify-center"
                    aria-label="Previous testimonial"
                  >
                    <FaChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => paginate(1)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-dark-lighter/80 backdrop-blur-md border border-text-primary/20 hover:border-primary/50 text-text-primary hover:text-primary transition-all flex items-center justify-center"
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
                      setDirection(index > currentIndex ? 1 : -1);
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

