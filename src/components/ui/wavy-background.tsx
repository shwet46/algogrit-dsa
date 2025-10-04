'use client';
import { cn } from '@/lib/utils';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createNoise3D } from 'simplex-noise';

export const WavyBackground = ({
  children,
  className,
  containerClassName,
  colors,
  waveWidth,
  backgroundFill,
  blur = 10,
  speed = 'fast',
  waveOpacity = 0.5,
  ...props
}: {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  colors?: string[];
  waveWidth?: number;
  backgroundFill?: string;
  blur?: number;
  speed?: 'slow' | 'fast';
  waveOpacity?: number;
  [key: string]: unknown;
}) => {
  const noiseRef = useRef(createNoise3D());
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationIdRef = useRef<number | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const [isSafari, setIsSafari] = useState(false);

  const waveColors = colors ?? [
    '#7c8bd2',
    '#5d6bb7',
    '#3f4b9c',
    '#232946',
    '#1a2238',
    '#0f172a',
  ];

  const getSpeed = useCallback(() => {
    switch (speed) {
      case 'slow':
        return 0.001;
      case 'fast':
        return 0.002;
      default:
        return 0.001;
    }
  }, [speed]);

  useEffect(() => {
    setIsSafari(
      typeof window !== 'undefined' &&
        navigator.userAgent.includes('Safari') &&
        !navigator.userAgent.includes('Chrome')
    );
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = window.innerWidth;
    let h = window.innerHeight;
    let nt = 0;

    canvas.width = w;
    canvas.height = h;
    ctx.filter = `blur(${blur}px)`;

    const handleResize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
      ctx.filter = `blur(${blur}px)`;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    const drawWave = (n: number) => {
      nt += getSpeed();
      
      // Different widths and amplitudes for each wave
      const waveWidths = [60, 45, 70, 35, 55];
      const waveAmplitudes = [150, 100, 130, 80, 110];
      const waveFrequencies = [0.25, 0.35, 0.20, 0.40, 0.30];
      
      for (let i = 0; i < n; i++) {
        ctx.beginPath();
        ctx.lineWidth = waveWidth || waveWidths[i];
        ctx.strokeStyle = waveColors[i % waveColors.length];
        
        for (let x = 0; x < w; x += 5) {
          // Distance from mouse to current point
          const dx = x - mouseRef.current.x;
          const dy = h * 0.5 - mouseRef.current.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const maxDistance = 300;
          const influence = Math.max(0, 1 - distance / maxDistance);
          
          // Mouse effect pushes waves away
          const mouseEffect = influence * 80 * Math.exp(-distance / 150);
          
          const amplitude = waveAmplitudes[i];
          const frequency = waveFrequencies[i];
          
          const y = 
            noiseRef.current(x / 800, frequency * i, nt) * amplitude +
            Math.sin(x / 200 + nt * 2 + i * 0.5) * (30 + i * 5) +
            Math.cos(x / 300 - nt + i * 0.3) * (20 + i * 3) +
            mouseEffect;
          
          ctx.lineTo(x, y + h * 0.5);
        }
        
        ctx.stroke();
        ctx.closePath();
      }
    };

    const render = () => {
      ctx.fillStyle = backgroundFill || 'black';
      ctx.globalAlpha = waveOpacity || 0.5;
      ctx.fillRect(0, 0, w, h);
      ctx.globalAlpha = 1;
      drawWave(5);
      animationIdRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [blur, backgroundFill, waveOpacity, waveWidth, speed]);

  return (
    <div
      className={cn(
        'h-screen flex flex-col items-center justify-center',
        containerClassName
      )}
    >
      <canvas
        className="absolute inset-0 z-0"
        ref={canvasRef}
        id="canvas"
        style={{
          ...(isSafari ? { filter: `blur(${blur}px)` } : {}),
        }}
      />
      <div className={cn('relative z-10', className)} {...props}>
        {children}
      </div>
    </div>
  );
};