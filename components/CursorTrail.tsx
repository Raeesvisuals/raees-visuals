"use client";

import React, { useEffect, useRef, useState } from "react";

interface Particle {
  x: number;
  y: number;
  lifetime: number;
  maxLifetime: number;
  hue: number;
}

const CursorTrail: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number>();
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    // Detect mobile device
    const checkMobile = () => {
      const isMobileDevice = window.innerWidth < 768 || 
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
        ('ontouchstart' in window);
      setIsMobile(isMobileDevice);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Intersection Observer for viewport visibility
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const observer = new IntersectionObserver(
      (entries) => {
        setInView(entries[0]?.isIntersecting ?? false);
      },
      { threshold: 0 }
    );

    observer.observe(canvas);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (prefersReducedMotion || isMobile) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Mouse move handler with throttling for performance
    let lastMouseTime = 0;
    const handleMouseMove = (e: MouseEvent) => {
      const now = performance.now();
      // Throttle mouse events to 60fps max
      if (now - lastMouseTime < 16) return;
      lastMouseTime = now;

      mouseRef.current = { x: e.clientX, y: e.clientY };

      // Reduced particle count for better performance
      const maxParticles = isMobile ? 15 : 40; // Reduced from 30/120 to 15/40
      const particlesPerFrame = isMobile ? 1 : 2; // Reduced from 3 to 2

      if (particlesRef.current.length < maxParticles) {
        for (let i = 0; i < particlesPerFrame; i++) {
          particlesRef.current.push({
            x: e.clientX + (Math.random() - 0.5) * 10,
            y: e.clientY + (Math.random() - 0.5) * 10,
            lifetime: 0,
            maxLifetime: isMobile ? 25 : 45, // Reduced lifetime for better performance
            hue: (Date.now() / 10) % 360, // Rainbow effect
          });
        }
      }
    };

    // Animation loop with performance optimizations
    let lastFrameTime = 0;
    const animate = (currentTime: number) => {
      // Skip frame if not in view or if frame rate too high
      if (!inView || currentTime - lastFrameTime < 16) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }
      lastFrameTime = currentTime;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particlesRef.current = particlesRef.current.filter((particle) => {
        particle.lifetime++;

        if (particle.lifetime >= particle.maxLifetime) {
          return false;
        }

        // Calculate opacity based on lifetime
        const progress = particle.lifetime / particle.maxLifetime;
        const opacity = 1 - progress;
        const size = (isMobile ? 2 : 4) * (1 - progress);

        // Draw particle with rainbow color
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${particle.hue}, 100%, 70%, ${opacity * 0.6})`;
        ctx.fill();

        // Add glow effect (reduced on mobile)
        if (!isMobile) {
          ctx.shadowBlur = 15;
          ctx.shadowColor = `hsla(${particle.hue}, 100%, 70%, ${opacity * 0.4})`;
        }

        return true;
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [prefersReducedMotion, isMobile, inView]);

  // Don't render on mobile or if reduced motion is preferred
  if (prefersReducedMotion || isMobile) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{ mixBlendMode: "screen" }}
    />
  );
};

export default CursorTrail;

