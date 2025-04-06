'use client';

import { useEffect, useRef, useState } from 'react';
import { useTheme } from 'next-themes';
import { createGOLGrid, updateGOL, golToAscii } from '@/lib/animations/gameOfLife';

export default function GameOfLifeAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [grid, setGrid] = useState(() => createGOLGrid(40, 20, 0.3));
  const animationRef = useRef<number | null>(null);
  const { resolvedTheme } = useTheme();
  
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    // Get theme colors
    const isDarkTheme = resolvedTheme === 'dark';
    const bgColor = isDarkTheme ? 'var(--background)' : 'var(--background)';
    const textColor = isDarkTheme ? 'var(--accent)' : 'var(--accent)';
    
    container.style.backgroundColor = bgColor;
    container.style.color = textColor;
    
    const animate = () => {
      setGrid(prevGrid => updateGOL(prevGrid));
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    // Handle resize
    const handleResize = () => {
      if (!container) return;
      
      const width = container.clientWidth;
      const height = container.clientHeight;
      
      // Calculate character dimensions based on available space
      // Assuming monospace font with approx 0.6 width-to-height ratio
      const charWidth = width / 40;
      const rows = Math.floor(height / (charWidth * 1.66));
      const cols = Math.floor(width / charWidth);
      
      setGrid(createGOLGrid(cols, rows, 0.3));
    };
    
    // Initial sizing
    handleResize();
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [resolvedTheme]);
  
  return (
    <div ref={containerRef} className="w-full h-full overflow-hidden font-mono">
      <pre className="whitespace-pre-wrap leading-none text-[0.5rem] md:text-[0.6rem] lg:text-[0.7rem]">
        {golToAscii(grid)}
      </pre>
    </div>
  );
} 