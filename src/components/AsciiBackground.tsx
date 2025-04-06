"use client";

import React, { useRef, useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { SandGrid, createEmptySandGrid, updateSand, addLetterToGrid } from "@/lib/animations/sandGame";
import { GOLGrid, createGOLGrid, updateGOL } from "@/lib/animations/gameOfLife";
import { 
  initAsciiEngine, AsciiGrid, renderFrame, updateMousePosition, 
  handleResize, AsciiEngineConfig 
} from "@/lib/asciiEngine/engine";
import { 
  noiseGenerator, waveGenerator, rippleGenerator, 
  cursorHeatGenerator 
} from "@/lib/asciiEngine/generators";
import { 
  centerWord, startWordTransition, 
  updateWordTransition, WordTransition 
} from "@/lib/asciiEngine/textRenderer";

type AsciiBackgroundProps = {
  userWord?: string;
  mode?: "default" | "sand" | "gol";
};

const AsciiBackground = ({ userWord, mode = "default" }: AsciiBackgroundProps) => {
  const { resolvedTheme } = useTheme();
  const isDarkTheme = resolvedTheme === "dark";
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gridRef = useRef<AsciiGrid | null>(null);
  const configRef = useRef<AsciiEngineConfig | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number>(0);

  // Legacy states for sand and GOL modes
  const [sandGrid, setSandGrid] = useState<SandGrid | null>(null);
  const [golGrid, setGolGrid] = useState<GOLGrid | null>(null);
  const [currentSandLetterIndex, setCurrentSandLetterIndex] = useState(0);
  
  // Engine states
  const [currentTransition, setCurrentTransition] = useState<WordTransition | null>(null);
  const defaultWords = ["HELLO", "WORLD", "ASCII"];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const frameCountRef = useRef(0);
  const [backgroundEffects, setBackgroundEffects] = useState({
    rippleRadius: 0,
    rippleActive: false,
  });

  // Character dimensions - needed for sand/GOL modes
  const [charDimensions, setCharDimensions] = useState({ width: 9, height: 16 });

  // Handle click for sand game (legacy mode)
  const handleClick = (e: React.MouseEvent) => {
    // Handle legacy sand game mode
    if (mode === "sand" && sandGrid && containerRef.current) {
      // Get click position relative to the container
      const rect = containerRef.current.getBoundingClientRect();
      const relativeX = e.clientX - rect.left;
      const relativeY = e.clientY - rect.top;
      
      // Convert to grid coordinates
      const gridX = Math.floor(relativeX / charDimensions.width);
      const gridY = Math.floor(relativeY / charDimensions.height);
      
      // Get the letter to add
      const activeWord = userWord || defaultWords[currentWordIndex];
      const letter = activeWord[currentSandLetterIndex];
      
      // Update sand grid with new letter
      const newGrid = addLetterToGrid(sandGrid, gridX, gridY, letter);
      setSandGrid(newGrid);
      
      // Increment letter index
      setCurrentSandLetterIndex((prevIndex) => (prevIndex + 1) % activeWord.length);
    }
    
    // For default mode, create a new ripple effect
    if (mode === "default" && gridRef.current && configRef.current) {
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        const relativeX = e.clientX - rect.left;
        const relativeY = e.clientY - rect.top;
        
        // Convert to grid coordinates
        const gridX = Math.floor(relativeX / (configRef.current.cellWidth || 10));
        const gridY = Math.floor(relativeY / (configRef.current.cellHeight || 16));
        
        setBackgroundEffects({
          rippleRadius: 0,
          rippleActive: true,
        });
      }
    }
  };

  // Initialize ASCII engine and animation
  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;
    
    // Initialize ASCII engine
    const { grid, config } = initAsciiEngine(containerRef.current, canvasRef.current, {
      backgroundColor: isDarkTheme ? '#000000' : '#ffffff',
      textColor: isDarkTheme ? '#00ff00' : '#333333',
      cellWidth: 10,
      cellHeight: 16,
      fontFamily: 'monospace'
    });
    
    gridRef.current = grid;
    configRef.current = config;
    
    // For legacy sand/GOL modes, also initialize those grids
    if (mode === "sand" || mode === "gol") {
      const cols = Math.floor(containerRef.current.offsetWidth / config.cellWidth);
      const rows = Math.floor(containerRef.current.offsetHeight / config.cellHeight);
      
      if (mode === "sand") {
        setSandGrid(createEmptySandGrid(cols, rows));
      } else if (mode === "gol") {
        setGolGrid(createGOLGrid(cols, rows, 0.3));
      }
      
      setCharDimensions({ width: config.cellWidth, height: config.cellHeight });
    }
    
    // Start with initial word
    if (mode === "default" && gridRef.current) {
      const centerY = Math.floor(gridRef.current.length / 2);
      const initialWord = userWord || defaultWords[currentWordIndex];
      centerWord(grid, initialWord, centerY);
    }
    
    // Handle mouse movement
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current || !gridRef.current || !configRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      updateMousePosition(mouseX, mouseY, gridRef.current, configRef.current);
    };
    
    // Handle window resize
    const onResize = () => {
      if (!containerRef.current || !canvasRef.current || !gridRef.current || !configRef.current) return;
      handleResize(containerRef.current, canvasRef.current, gridRef.current, configRef.current);
      
      // Also resize legacy grids if needed
      if (mode === "sand" || mode === "gol") {
        const cols = Math.floor(containerRef.current.offsetWidth / configRef.current.cellWidth);
        const rows = Math.floor(containerRef.current.offsetHeight / configRef.current.cellHeight);
        
        if (mode === "sand") {
          setSandGrid(createEmptySandGrid(cols, rows));
        } else if (mode === "gol") {
          setGolGrid(createGOLGrid(cols, rows, 0.3));
        }
      }
    };
    
    containerRef.current.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', onResize);
    
    // Animation loop
    const animate = (timestamp: number) => {
      if (!gridRef.current || !configRef.current) return;
      
      // Control to ~30 FPS
      const elapsed = timestamp - lastTimestampRef.current;
      if (elapsed < 33) { // ~30 FPS
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }
      
      lastTimestampRef.current = timestamp;
      frameCountRef.current++;
      
      // Clear the grid (background cells only)
      for (let y = 0; y < gridRef.current.length; y++) {
        for (let x = 0; x < gridRef.current[0].length; x++) {
          const cell = gridRef.current[y][x];
          if (cell.type === 'background') {
            cell.char = ' ';
            cell.intensity = 0;
          }
        }
      }
      
      // Handle different modes
      if (mode === "default") {
        // Generate background patterns
        noiseGenerator(gridRef.current, { intensity: 0.2, speed: 0.5 });
        waveGenerator(gridRef.current, { 
          amplitude: 0.3, 
          frequency: 0.07, 
          speed: 0.3 
        });
        
        // Handle word display and transitions
        const activeWord = userWord || defaultWords[currentWordIndex];
        const centerY = Math.floor(gridRef.current.length / 2);
        
        // Check if we should start a new transition
        if (frameCountRef.current % 300 === 0 && !currentTransition && !userWord) {
          const nextIndex = (currentWordIndex + 1) % defaultWords.length;
          const nextWord = defaultWords[nextIndex];
          
          const transition = startWordTransition(
            gridRef.current,
            activeWord,
            nextWord,
            'dissolve',
            Math.floor((gridRef.current[0].length - nextWord.length) / 2),
            centerY
          );
          
          setCurrentTransition(transition);
        }
        
        // Update transition if active
        if (currentTransition) {
          const isComplete = updateWordTransition(
            gridRef.current,
            currentTransition,
            0.05 // Control transition speed
          );
          
          if (isComplete) {
            setCurrentWordIndex((prevIndex) => (prevIndex + 1) % defaultWords.length);
            setCurrentTransition(null);
          }
        } else if (!userWord) {
          // If no transition active and not using userWord, display current word
          centerWord(
            gridRef.current, 
            activeWord, 
            centerY
          );
        } else {
          // If using userWord, always display it
          centerWord(
            gridRef.current, 
            userWord, 
            centerY
          );
        }
        
        // Handle ripple effect when clicked
        if (backgroundEffects.rippleActive) {
          rippleGenerator(gridRef.current, {
            centerX: Math.floor(gridRef.current[0].length / 2),
            centerY: Math.floor(gridRef.current.length / 2),
            radius: backgroundEffects.rippleRadius,
            maxRadius: Math.max(gridRef.current.length, gridRef.current[0].length),
            intensity: 0.7
          });
          
          // Increase ripple radius
          setBackgroundEffects(prev => ({
            ...prev,
            rippleRadius: prev.rippleRadius + 1,
          }));
          
          // Deactivate after max radius
          if (backgroundEffects.rippleRadius > Math.max(gridRef.current.length, gridRef.current[0].length)) {
            setBackgroundEffects({
              rippleRadius: 0,
              rippleActive: false
            });
          }
        }
        
        // Add cursor heat effect
        if (configRef.current.mousePosition) {
          cursorHeatGenerator(gridRef.current, {
            mouseX: configRef.current.mousePosition.x,
            mouseY: configRef.current.mousePosition.y,
            radius: 8,
            intensity: 0.7
          });
        }
      } 
      // Legacy modes
      else if (mode === "sand" && sandGrid) {
        // Update sand simulation every few frames
        if (frameCountRef.current % 5 === 0) {
          setSandGrid(updateSand(sandGrid));
        }
        
        // Draw sand grid to ASCII grid
        for (let y = 0; y < sandGrid.length && y < gridRef.current.length; y++) {
          for (let x = 0; x < sandGrid[0].length && x < gridRef.current[0].length; x++) {
            if (sandGrid[y][x] !== ' ') {
              gridRef.current[y][x].char = sandGrid[y][x];
              gridRef.current[y][x].intensity = 1;
            }
          }
        }
      } 
      else if (mode === "gol" && golGrid) {
        // Update Game of Life every 10 frames
        if (frameCountRef.current % 10 === 0) {
          setGolGrid(updateGOL(golGrid));
        }
        
        // Draw GOL grid to ASCII grid
        for (let y = 0; y < golGrid.length && y < gridRef.current.length; y++) {
          for (let x = 0; x < golGrid[0].length && x < gridRef.current[0].length; x++) {
            if (golGrid[y][x]) {
              gridRef.current[y][x].char = isDarkTheme ? '#' : '@';
              gridRef.current[y][x].intensity = 1;
            }
          }
        }
      }
      
      // Render the frame
      if (canvasRef.current && gridRef.current && configRef.current) {
        renderFrame(canvasRef.current, gridRef.current, configRef.current);
      }
      
      // Continue animation
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    // Start animation
    animationFrameRef.current = requestAnimationFrame(animate);
    
    // Cleanup function
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      if (containerRef.current) {
        containerRef.current.removeEventListener('mousemove', handleMouseMove);
      }
      
      window.removeEventListener('resize', onResize);
    };
  }, [userWord, mode, isDarkTheme, currentWordIndex, backgroundEffects]);

  return (
    <div 
      className="absolute top-0 left-0 w-full h-full select-none"
      ref={containerRef}
      onClick={handleClick}
      style={{ 
        overflow: "hidden", 
        zIndex: 1,
        pointerEvents: "none"
      }}
    >
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        aria-hidden="true"
      />
    </div>
  );
};

export default AsciiBackground; 