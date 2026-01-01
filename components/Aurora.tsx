"use client";

import React, { useEffect, useRef } from 'react';

interface AuroraProps {
  colorStops?: string[];
  amplitude?: number;
  blend?: number;
  className?: string;
  style?: React.CSSProperties;
}

export default function Aurora({
  colorStops = ["#39209d", "#2f1499", "#261371"],
  amplitude = 0.3,
  blend = 1,
  className = "",
  style = {}
}: AuroraProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const animate = () => {
      timeRef.current += 0.01;
      
      const width = canvas.width;
      const height = canvas.height;
      
      ctx.clearRect(0, 0, width, height);
      
      // Create gradient
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      const numStops = colorStops.length;
      
      colorStops.forEach((color, index) => {
        const offset = index / (numStops - 1);
        // Add wave animation to color stops
        const waveOffset = Math.sin(timeRef.current + offset * Math.PI * 2) * amplitude * 0.1;
        gradient.addColorStop(Math.max(0, Math.min(1, offset + waveOffset)), color);
      });
      
      // Create radial gradient for aurora effect
      const centerX = width / 2 + Math.sin(timeRef.current * 0.5) * width * 0.1;
      const centerY = height / 2 + Math.cos(timeRef.current * 0.3) * height * 0.1;
      const radius = Math.max(width, height) * 0.8;
      
      const radialGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
      
      colorStops.forEach((color, index) => {
        const offset = index / (numStops - 1);
        const alpha = blend * (1 - offset * 0.5);
        // Convert hex to rgba if needed
        let rgbaColor = color;
        if (color.startsWith('#')) {
          const r = parseInt(color.slice(1, 3), 16);
          const g = parseInt(color.slice(3, 5), 16);
          const b = parseInt(color.slice(5, 7), 16);
          rgbaColor = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        } else if (color.startsWith('rgb')) {
          rgbaColor = color.replace('rgb', 'rgba').replace(')', `, ${alpha})`);
        }
        radialGradient.addColorStop(offset, rgbaColor);
      });
      
      // Combine gradients
      ctx.fillStyle = radialGradient;
      ctx.globalCompositeOperation = 'screen';
      ctx.fillRect(0, 0, width, height);
      
      // Add wave effect
      ctx.fillStyle = gradient;
      ctx.globalAlpha = blend * 0.5;
      
      for (let i = 0; i < 3; i++) {
        const waveY = height / 2 + Math.sin(timeRef.current + i * Math.PI / 3) * amplitude * height * 0.3;
        const waveHeight = height * 0.4;
        
        ctx.beginPath();
        ctx.moveTo(0, waveY - waveHeight / 2);
        
        for (let x = 0; x <= width; x += 10) {
          const y = waveY + Math.sin((x / width) * Math.PI * 4 + timeRef.current + i) * amplitude * waveHeight * 0.3;
          ctx.lineTo(x, y);
        }
        
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        ctx.fill();
      }
      
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [colorStops, amplitude, blend]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{
        pointerEvents: 'none',
        ...style
      }}
    />
  );
}

