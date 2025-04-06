'use client';

import { useEffect, useRef, useState } from 'react';
import { useTheme } from 'next-themes';
import { 
  initAsciiEngine, AsciiGrid, AsciiCell, AsciiEngineConfig, 
  updateMousePosition, handleResize, renderFrame 
} from '@/lib/asciiEngine/engine';
import { noiseGenerator, waveGenerator, staticGenerator, rainGenerator, rippleGenerator, cursorHeatGenerator } from '@/lib/asciiEngine/generators';
import { startWordTransition, updateWordTransition, WordTransition, TransitionType, getRandomWord } from '@/lib/asciiEngine/textRenderer';
import { renderUIFromDOM, updateInteractiveElements } from '@/lib/asciiEngine/uiRenderer';

interface AsciiEngineDemoProps {
  renderUI?: boolean;
  transitionType?: TransitionType;
  wordCategories?: string[];
}

export default function AsciiEngineDemo({ 
  renderUI = true, 
  transitionType = 'dissolve',
  wordCategories = ['tech']
}: AsciiEngineDemoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gridRef = useRef<AsciiGrid | null>(null);
  const engineConfigRef = useRef<AsciiEngineConfig | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [currentTransition, setCurrentTransition] = useState<WordTransition | null>(null);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const lastFrameTimeRef = useRef<number>(performance.now());
  const deltaTimeRef = useRef<number>(0);

  // Initialize the ASCII engine
  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const { grid, config } = initAsciiEngine(containerRef.current, canvasRef.current, {
      backgroundColor: isDark ? '#000000' : '#f5f5f5',
      textColor: isDark ? '#50C878' : '#1a5336',
      cellWidth: 10,
      cellHeight: 16,
      fontFamily: 'monospace'
    });

    gridRef.current = grid;
    engineConfigRef.current = config;

    // Listen for mouse movement
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current || !gridRef.current || !engineConfigRef.current) return;
      
      // Get the relative position within the container
      const rect = containerRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      updateMousePosition(
        mouseX,
        mouseY,
        gridRef.current, 
        engineConfigRef.current
      );
    };
    
    // Listen for window resize
    const onResize = () => {
      if (!containerRef.current || !canvasRef.current || !gridRef.current || !engineConfigRef.current) return;
      handleResize(containerRef.current, canvasRef.current, gridRef.current, engineConfigRef.current);
    };

    containerRef.current.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', onResize);

    // Start with initial word transition
    if (gridRef.current) {
      const centerY = Math.floor(gridRef.current.length / 2);
      const initialWord = getRandomWord(wordCategories[0] as any);
      const transition = startWordTransition(
        gridRef.current,
        '', // Start with empty string
        initialWord,
        transitionType,
        // Center horizontally
        Math.floor((gridRef.current[0].length - initialWord.length) / 2),
        centerY
      );
      setCurrentTransition(transition);
    }

    // Animation loop
    const animate = (timestamp: number) => {
      if (!gridRef.current || !engineConfigRef.current) return;
      
      // Calculate delta time (time since last frame)
      deltaTimeRef.current = (timestamp - lastFrameTimeRef.current) / 1000; // in seconds
      lastFrameTimeRef.current = timestamp;
      
      // Clear the grid (reset to spaces but keep cell metadata)
      for (let y = 0; y < gridRef.current.length; y++) {
        for (let x = 0; x < gridRef.current[0].length; x++) {
          const cell = gridRef.current[y][x];
          if (cell.type === 'background') {
            cell.char = ' ';
            cell.intensity = 0;
          }
        }
      }
      
      // Generate background patterns
      noiseGenerator(gridRef.current, { intensity: 0.3, speed: 1 });
      
      // Overlay a wave pattern
      waveGenerator(gridRef.current, { 
        amplitude: 0.4, 
        frequency: 0.05, 
        speed: 0.5,
        verticalShift: timestamp / 5000
      });
      
      // Add some cursor heat effect
      if (engineConfigRef.current.mousePosition) {
        cursorHeatGenerator(gridRef.current, {
          mouseX: engineConfigRef.current.mousePosition.x,
          mouseY: engineConfigRef.current.mousePosition.y,
          radius: 15,
          intensity: 1
        });
      }
      
      // Handle word transitions
      if (currentTransition) {
        const isComplete = updateWordTransition(
          gridRef.current,
          currentTransition,
          deltaTimeRef.current * 0.8 // Control transition speed
        );
        
        if (isComplete) {
          // Start a new transition after a delay
          setTimeout(() => {
            if (!gridRef.current) return;
            
            const centerY = Math.floor(gridRef.current.length / 2);
            const currentWord = currentTransition.toWord;
            // Get a random word from the selected categories
            const category = wordCategories[Math.floor(Math.random() * wordCategories.length)] as any;
            const newWord = getRandomWord(category);
            
            const transition = startWordTransition(
              gridRef.current,
              currentWord,
              newWord,
              transitionType,
              // Center horizontally
              Math.floor((gridRef.current[0].length - newWord.length) / 2),
              centerY
            );
            
            setCurrentTransition(transition);
          }, 2000);
        }
      }
      
      // Render UI elements if enabled
      if (renderUI && containerRef.current) {
        renderUIFromDOM(containerRef.current, gridRef.current, {
          startX: 2,
          startY: 2,
          maxWidth: gridRef.current[0].length - 4,
          maxHeight: gridRef.current.length - 4
        });
      }
      
      // Update interactive elements (if any)
      if (engineConfigRef.current.mousePosition) {
        updateInteractiveElements(
          gridRef.current,
          engineConfigRef.current.mousePosition.x,
          engineConfigRef.current.mousePosition.y,
          timestamp * 0.001
        );
      }
      
      // Render the frame
      if (canvasRef.current) {
        renderFrame(canvasRef.current, gridRef.current, engineConfigRef.current);
      }
      
      // Continue animation loop
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    // Start animation
    animationFrameRef.current = requestAnimationFrame(animate);
    
    // Cleanup function
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      const currentContainer = containerRef.current;
      if (currentContainer) {
        currentContainer.removeEventListener('mousemove', handleMouseMove);
      }
      
      window.removeEventListener('resize', onResize);
    };
  }, [transitionType, wordCategories, isDark, renderUI]);
  
  return (
    <div className="relative h-full min-h-[500px] w-full" ref={containerRef}>
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full"
      ></canvas>
    </div>
  );
} 