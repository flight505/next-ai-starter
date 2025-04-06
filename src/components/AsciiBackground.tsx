"use client";

import { useRef, useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { SandGrid, createEmptySandGrid, updateSand, addLetterToGrid } from "@/lib/animations/sandGame";
import { GOLGrid, createGOLGrid, updateGOL } from "@/lib/animations/gameOfLife";

type AsciiBackgroundProps = {
  userWord?: string;
  mode?: "default" | "sand" | "gol";
};

const AsciiBackground = ({ userWord, mode = "default" }: AsciiBackgroundProps) => {
  const { resolvedTheme } = useTheme();
  const isDarkTheme = resolvedTheme === "dark";
  const preRef = useRef<HTMLPreElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const defaultWords = ["HELLO", "WORLD", "ASCII"];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [frameCount, setFrameCount] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionProgress, setTransitionProgress] = useState(0);
  const [sandGrid, setSandGrid] = useState<SandGrid | null>(null);
  const [golGrid, setGolGrid] = useState<GOLGrid | null>(null);
  const [currentSandLetterIndex, setCurrentSandLetterIndex] = useState(0);
  const [charDimensions, setCharDimensions] = useState({ width: 9, height: 16 });
  const dimensionsInitialized = useRef(false);

  // Function to get theme-specific colors
  const getThemeColors = () => {
    return {
      background: isDarkTheme ? '#000' : '#fff',
      foreground: isDarkTheme ? '#0f0' : '#333',
      accent: isDarkTheme ? '#00ff00' : '#006600',
    };
  };

  // Handle click for sand game
  const handleClick = (e: React.MouseEvent) => {
    if (mode !== "sand" || !sandGrid || !preRef.current) return;
    
    // Get click position relative to the pre element
    const rect = preRef.current.getBoundingClientRect();
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
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    let frameId: number;
    let lastTimestamp = 0;
    let cols = 0;
    let rows = 0;
    let localFrameCount = frameCount;

    // Function to handle window resize
    const handleResize = () => {
      if (!preRef.current) return;
      
      // Estimate character dimensions (this is approximate)
      const charWidth = 9; // pixels, monospace font
      const charHeight = 16; // pixels, monospace font
      
      // Only update dimensions on first load or if they've actually changed
      if (!dimensionsInitialized.current || 
         (charDimensions.width !== charWidth || charDimensions.height !== charHeight)) {
        setCharDimensions({ width: charWidth, height: charHeight });
        dimensionsInitialized.current = true;
      }
      
      cols = Math.floor(preRef.current.offsetWidth / charWidth);
      rows = Math.floor(preRef.current.offsetHeight / charHeight);
      
      // Initialize sand grid if in sand mode
      if (mode === "sand") {
        setSandGrid(createEmptySandGrid(cols, rows));
      }
      
      // Initialize Game of Life grid if in gol mode
      if (mode === "gol") {
        setGolGrid(createGOLGrid(cols, rows, 0.3));
      }
    };

    // Call once initially
    handleResize();

    // Animation loop
    const animate = (timestamp: number) => {
      const elapsedTime = timestamp - lastTimestamp;
      const colors = getThemeColors();
      
      // Cap at ~30 FPS
      if (elapsedTime > 33) {
        lastTimestamp = timestamp;
        
        if (!preRef.current) {
          frameId = requestAnimationFrame(animate);
          return;
        }
        
        // Increment frame count locally instead of using setState
        localFrameCount++;
        
        // Only update the state occasionally to prevent too many rerenders
        if (localFrameCount % 30 === 0) {
          setFrameCount(localFrameCount);
        }
        
        // Check if we should change the word (only in default mode)
        const shouldTransition = mode === "default" && localFrameCount % 300 === 0 && !isTransitioning;
        if (shouldTransition) {
          setIsTransitioning(true);
          setTransitionProgress(0);
        }
        
        // Update sand grid if in sand mode
        if (mode === "sand" && sandGrid && localFrameCount % 5 === 0) {
          setSandGrid(updateSand(sandGrid));
        }
        
        // Update Game of Life grid if in gol mode
        if (mode === "gol" && golGrid && localFrameCount % 10 === 0) {
          setGolGrid(updateGOL(golGrid));
        }
        
        // If transitioning, update progress
        if (mode === "default" && isTransitioning) {
          setTransitionProgress(prev => {
            const newProgress = prev + 0.05;
            if (newProgress >= 1) {
              setIsTransitioning(false);
              // Change the word when transition completes
              setCurrentWordIndex(prevIndex => (prevIndex + 1) % defaultWords.length);
              return 0;
            }
            return newProgress;
          });
        }
        
        // Get the current word to display
        const currentWord = userWord || defaultWords[currentWordIndex];
        
        // Generate a grid of ASCII characters
        let fullFrameString = "";
        
        if (mode === "sand" && sandGrid) {
          // Render the sand grid
          for (let y = 0; y < sandGrid.length; y++) {
            for (let x = 0; x < sandGrid[0].length; x++) {
              fullFrameString += sandGrid[y][x];
            }
            fullFrameString += "\n";
          }
        } else if (mode === "gol" && golGrid) {
          // Render the Game of Life grid
          for (let y = 0; y < golGrid.length; y++) {
            for (let x = 0; x < golGrid[0].length; x++) {
              fullFrameString += golGrid[y][x] ? isDarkTheme ? "#" : "@" : " ";
            }
            fullFrameString += "\n";
          }
        } else {
          // Default mode - render the word in center with ripple effect
          for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
              // Calculate distance from center
              const centerX = Math.floor(cols / 2);
              const centerY = Math.floor(rows / 2);
              
              // Check if this position is part of the word display
              if (
                y === centerY && 
                x >= centerX - Math.floor(currentWord.length / 2) && 
                x < centerX - Math.floor(currentWord.length / 2) + currentWord.length
              ) {
                // Display the word in the center
                const charIndex = x - (centerX - Math.floor(currentWord.length / 2));
                
                if (isTransitioning) {
                  // During transition, randomly show different characters
                  const rand = Math.random();
                  if (rand < transitionProgress) {
                    fullFrameString += currentWord[charIndex];
                  } else {
                    const chars = isDarkTheme ? ".:-=+*#%@" : "@%#*+=:-. ";
                    fullFrameString += chars[Math.floor(Math.random() * chars.length)];
                  }
                } else {
                  fullFrameString += currentWord[charIndex];
                }
              } else {
                // Generate a ripple-like pattern for background
                const distance = Math.sqrt(
                  Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)
                );
                
                const waveVal = Math.sin(distance * 0.3 - localFrameCount * 0.1);
                const chars = isDarkTheme ? " .:+*#@" : "@#*+:. ";
                const charIndex = Math.floor(
                  ((waveVal + 1) / 2) * (chars.length - 1)
                );
                fullFrameString += chars[charIndex];
              }
            }
            fullFrameString += "\n";
          }
        }
        
        // Update the DOM with the full frame string
        if (preRef.current) {
          preRef.current.textContent = fullFrameString;
          
          // Update background and text colors based on theme
          preRef.current.style.backgroundColor = colors.background;
          preRef.current.style.color = colors.foreground;
        }
      }
      
      // Continue the animation loop
      frameId = requestAnimationFrame(animate);
    };

    // Start the animation
    frameId = requestAnimationFrame(animate);
    
    // Add resize listener
    window.addEventListener("resize", handleResize);

    // Cleanup function
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [currentWordIndex, defaultWords, isTransitioning, mode, sandGrid, golGrid, transitionProgress, userWord, resolvedTheme]);

  return (
    <div 
      ref={containerRef} 
      onClick={handleClick}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 1,
        pointerEvents: mode === 'sand' ? 'auto' : 'none',
      }}
    >
      <pre 
        ref={preRef} 
        id="ascii-canvas" 
        aria-hidden="true" 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 1,
          whiteSpace: 'pre',
          fontFamily: 'monospace',
          margin: 0,
          padding: 0,
          overflow: 'hidden',
          userSelect: 'none',
          // Colors will be set dynamically in the effect
          backgroundColor: getThemeColors().background,
          color: getThemeColors().foreground
        }}
      ></pre>
    </div>
  );
};

export default AsciiBackground; 