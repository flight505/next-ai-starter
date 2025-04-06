'use client';

import { useState, useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import { createSandGrid, updateSand, sandToAscii, addSandLetter } from '@/lib/animations/sandGame';

export default function SandGameAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const [cols, setCols] = useState(80);
  const [rows, setRows] = useState(40);
  const [frameString, setFrameString] = useState<string>('');
  const frameRef = useRef<HTMLPreElement>(null);
  const animationRef = useRef<number | null>(null);
  const gridRef = useRef(createSandGrid(cols, rows));
  
  // Get theme-specific colors
  const getThemeColors = () => {
    const isDarkTheme = resolvedTheme === 'dark';
    return {
      background: isDarkTheme ? 'var(--background)' : 'var(--background)',
      foreground: isDarkTheme ? 'var(--foreground)' : 'var(--foreground)',
      accent: isDarkTheme ? 'var(--accent)' : 'var(--accent)',
      characters: isDarkTheme ? '█▓▒░ ' : ' ░▒▓█'
    };
  };

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
      gridRef.current = createSandGrid(newCols, newRows);
    }
  };

  // Handle click to add sand letters
  const handleClick = (e: MouseEvent) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const charWidth = rect.width / cols;
    const charHeight = rect.height / rows;
    
    const x = Math.floor((e.clientX - rect.left) / charWidth);
    const y = Math.floor((e.clientY - rect.top) / charHeight);
    
    // Add random letter at click position
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!?*#@&';
    const randomLetter = letters[Math.floor(Math.random() * letters.length)];
    addSandLetter(gridRef.current, x, y, randomLetter);
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

  // Set up click listener
  useEffect(() => {
    const currentContainer = containerRef.current;
    if (!currentContainer) return;
    
    currentContainer.addEventListener('click', handleClick);
    
    return () => {
      currentContainer.removeEventListener('click', handleClick);
    };
  }, [cols, rows]);

  // Animation loop
  useEffect(() => {
    const updateFrame = () => {
      gridRef.current = updateSand(gridRef.current);
      const colors = getThemeColors();
      const asciiFrame = sandToAscii(gridRef.current, colors.characters);
      setFrameString(asciiFrame);
      
      animationRef.current = requestAnimationFrame(updateFrame);
    };
    
    // Start animation
    animationRef.current = requestAnimationFrame(updateFrame);
    
    // Add initial sand drops randomly
    for (let i = 0; i < 10; i++) {
      const x = Math.floor(Math.random() * cols);
      const y = Math.floor(Math.random() * (rows / 4));
      const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!?*#@&';
      const randomLetter = letters[Math.floor(Math.random() * letters.length)];
      addSandLetter(gridRef.current, x, y, randomLetter);
    }
    
    // Clean up
    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [cols, rows, resolvedTheme]);

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
      className="w-full h-full overflow-hidden cursor-pointer"
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