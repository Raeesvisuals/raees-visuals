"use client";

import React, { useRef, useEffect } from 'react';

interface ElectricBorderProps {
  children: React.ReactNode;
  color?: string;
  speed?: number;
  chaos?: number;
  thickness?: number;
  style?: React.CSSProperties;
  className?: string;
}

const ElectricBorder: React.FC<ElectricBorderProps> = ({
  children,
  color = '#7df9ff',
  speed = 1,
  chaos = 0.5,
  thickness = 2,
  style = {},
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const updateSize = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    updateSize();
    window.addEventListener('resize', updateSize);

    let time = 0;

    const animate = () => {
      if (!canvas || !ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      time += speed * 0.02;

      // Create electric border effect
      const segments = 50;
      const perimeter = 2 * (canvas.width + canvas.height);
      const segmentLength = perimeter / segments;

      ctx.strokeStyle = color;
      ctx.lineWidth = thickness;
      ctx.shadowBlur = 10;
      ctx.shadowColor = color;

      for (let i = 0; i < segments; i++) {
        const t = (i / segments + time) % 1;
        const nextT = ((i + 1) / segments + time) % 1;

        const pos1 = getPositionOnBorder(t, canvas.width, canvas.height);
        const pos2 = getPositionOnBorder(nextT, canvas.width, canvas.height);

        // Add chaos/wobble
        const wobble1 = Math.sin(t * 10 + time * 2) * chaos * 3;
        const wobble2 = Math.cos(nextT * 10 + time * 2) * chaos * 3;

        ctx.beginPath();
        ctx.moveTo(pos1.x + wobble1, pos1.y + wobble1);
        ctx.lineTo(pos2.x + wobble2, pos2.y + wobble2);

        // Vary opacity for electric effect
        ctx.globalAlpha = 0.5 + Math.sin(t * 20 + time * 5) * 0.5;
        ctx.stroke();
      }

      ctx.globalAlpha = 1;
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', updateSize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [color, speed, chaos, thickness]);

  const getPositionOnBorder = (t: number, width: number, height: number) => {
    const perimeter = 2 * (width + height);
    const distance = t * perimeter;

    if (distance < width) {
      return { x: distance, y: 0 };
    } else if (distance < width + height) {
      return { x: width, y: distance - width };
    } else if (distance < 2 * width + height) {
      return { x: width - (distance - width - height), y: height };
    } else {
      return { x: 0, y: height - (distance - 2 * width - height) };
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      style={style}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ borderRadius: style.borderRadius }}
      />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default ElectricBorder;

