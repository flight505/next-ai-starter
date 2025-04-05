"use client";

import { useRef, useEffect, useState } from "react";

type AsciiBackgroundProps = {
  userWord?: string;
};

const AsciiBackground = ({ userWord }: AsciiBackgroundProps) => {
  const preRef = useRef<HTMLPreElement>(null);
  const defaultWords = ["HELLO", "WORLD", "ASCII"];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [frameCount, setFrameCount] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionProgress, setTransitionProgress] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let frameId: number;
    let lastTimestamp = 0;
    let cols = 0;
    let rows = 0;

    // Function to handle window resize
    const handleResize = () => {
      if (!preRef.current) return;
      
      // Estimate character dimensions (this is approximate)
      const charWidth = 9; // pixels, monospace font
      const charHeight = 16; // pixels, monospace font
      
      cols = Math.floor(preRef.current.offsetWidth / charWidth);
      rows = Math.floor(preRef.current.offsetHeight / charHeight);
    };

    // Call once initially
    handleResize();

    // Animation loop
    const animate = (timestamp: number) => {
      const elapsedTime = timestamp - lastTimestamp;
      
      // Cap at ~30 FPS
      if (elapsedTime > 33) {
        lastTimestamp = timestamp;
        
        if (!preRef.current) {
          frameId = requestAnimationFrame(animate);
          return;
        }
        
        // Increment frame count
        setFrameCount(prevCount => {
          // Check if we should change the word
          if (prevCount % 300 === 0 && !isTransitioning) {
            setIsTransitioning(true);
            setTransitionProgress(0);
          }
          return prevCount + 1;
        });
        
        // If transitioning, update progress
        if (isTransitioning) {
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
                  const chars = ".:-=+*#%@";
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
              
              const waveVal = Math.sin(distance * 0.3 - frameCount * 0.1);
              const chars = " .:+*#@";
              const charIndex = Math.floor(
                ((waveVal + 1) / 2) * (chars.length - 1)
              );
              fullFrameString += chars[charIndex];
            }
          }
          fullFrameString += "\n";
        }
        
        // Update the DOM with the full frame string
        preRef.current.textContent = fullFrameString;
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
  }, [currentWordIndex, defaultWords, frameCount, isTransitioning, transitionProgress, userWord]);

  return (
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
        pointerEvents: 'none',
        userSelect: 'none',
        backgroundColor: '#000',
        color: '#0f0'
      }}
    ></pre>
  );
};

export default AsciiBackground; 