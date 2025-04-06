'use client';

import { useState, useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import { createGOLGrid, updateGOL, golToAscii } from '@/lib/animations/gameOfLife';

export default function GameOfLifeAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const [cols, setCols] = useState(80);
  const [rows, setRows] = useState(40);
  const [frameString, setFrameString] = useState<string>('');
  const frameRef = useRef<HTMLPreElement>(null);
  const animationRef = useRef<number | null>(null);
  
  // Generate a new Game of Life grid with random cells
  const initGrid = () => {
    return createGOLGrid(cols, rows, 0.3); // 30% density of live cells
  };

  // Get theme-specific colors
  const getThemeColors = () => {
    const isDarkTheme = resolvedTheme === 'dark';
    return {
      background: isDarkTheme ? 'var(--background)' : 'var(--background)',
      foreground: isDarkTheme ? 'var(--foreground)' : 'var(--foreground)',
      accent: isDarkTheme ? 'var(--accent)' : 'var(--accent)'
    };
  };

  // Initialize a new grid
  const [grid, setGrid] = useState(() => initGrid());

  // Calculate appropriate grid size based on container size
  const updateGridSize = () => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    
    // Calculate grid size based on container size
    // Using an estimated character width of 9px and height of 16px for monospace font
    const charWidth = 9;
    const charHeight = 16;
    
    const newCols = Math.floor(containerWidth / charWidth);
    const newRows = Math.floor(containerHeight / charHeight);
    
    if (newCols !== cols || newRows !== rows) {
      setCols(newCols);
      setRows(newRows);
      setGrid(createGOLGrid(newCols, newRows, 0.3));
    }
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      updateGridSize();
    };
    
    handleResize(); // Initial size calculation
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Animation loop
  useEffect(() => {
    const updateFrame = () => {
      setGrid(currentGrid => {
        const newGrid = updateGOL(currentGrid);
        const characters = resolvedTheme === 'dark' ? '█▓▒░ ' : ' ░▒▓█';
        const asciiFrame = golToAscii(newGrid, characters);
        setFrameString(asciiFrame);
        return newGrid;
      });
      
      animationRef.current = requestAnimationFrame(updateFrame);
    };
    
    // Start animation
    animationRef.current = requestAnimationFrame(updateFrame);
    
    // Clean up
    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [resolvedTheme]);

  // Update DOM with full frame string
  useEffect(() => {
    if (frameRef.current && frameString) {
      frameRef.current.textContent = frameString;
      
      const colors = getThemeColors();
      frameRef.current.style.color = colors.foreground;
      frameRef.current.style.backgroundColor = 'transparent';
    }
  }, [frameString]);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full overflow-hidden"
    >
      <pre
        ref={frameRef}
        className="font-mono text-xs leading-none"
        style={{ 
          whiteSpace: 'pre',
          opacity: 0.6
        }}
      />
    </div>
  );
} 