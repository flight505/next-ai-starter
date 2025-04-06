"use client";

import React, { useRef, useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { GOLGrid, createGOLGrid, updateGOL } from "@/lib/animations/gameOfLife";
import { 
  initAsciiEngine, AsciiGrid, renderFrame, updateMousePosition, 
  handleResize, AsciiEngineConfig 
} from "@/lib/asciiEngine/engine";
import { 
  noiseGenerator, waveGenerator, rippleGenerator, 
  cursorHeatGenerator, staticGenerator, rainGenerator
} from "@/lib/asciiEngine/generators";
import { 
  centerWord, startWordTransition, 
  updateWordTransition, WordTransition,
  wordLibrary
} from "@/lib/asciiEngine/textRenderer";

type AsciiBackgroundProps = {
  userWord?: string;
  mode?: "default" | "gol";
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
  const lastMouseX = useRef<number>(0);
  const lastMouseY = useRef<number>(0);
  const mouseVelocity = useRef<number>(0);
  const velocitySmoothing = 0.8; // Smooth out velocity changes
  
  // Legacy states for GOL mode
  const [golGrid, setGolGrid] = useState<GOLGrid | null>(null);
  
  // Engine states
  const [currentTransition, setCurrentTransition] = useState<WordTransition | null>(null);
  // Large graffiti-style phrases inspired by ertdfgcvb.xyz
  const defaultWords = [
    "TERMINAL AESTHETIC",
    "DIGITAL POETRY",
    "TEXT BECOMES ART",
    "ASCII GRAFFITI",
    "CODE AS CANVAS",
    "PROCEDURAL TEXT",
    "DIGITAL CONCRETE",
    "HELLO WORLD",
    "TYPEWRITER DREAMS",
    "GILGAMESH IS MY FATHER",
    "TIME FOR A NEW HAIRCUT",
    "I LOVE MY CAT"
  ];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const frameCountRef = useRef(0);
  const [backgroundEffects, setBackgroundEffects] = useState({
    rippleRadius: 0,
    rippleActive: false,
  });

  // Character dimensions - needed for GOL mode
  const [charDimensions, setCharDimensions] = useState({ width: 9, height: 16 });

  // Handle click for background effects
  const handleClick = (e: React.MouseEvent) => {
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
    
    // For legacy GOL mode, also initialize that grid
    if (mode === "gol") {
      const cols = Math.floor(containerRef.current.offsetWidth / config.cellWidth);
      const rows = Math.floor(containerRef.current.offsetHeight / config.cellHeight);
      
      if (mode === "gol") {
        setGolGrid(createGOLGrid(cols, rows, 0.3));
      }
      
      setCharDimensions({ width: config.cellWidth, height: config.cellHeight });
    }
    
    // Start with initial word
    if (mode === "default" && gridRef.current) {
      // Place word in a more visible position
      const centerY = Math.floor(gridRef.current.length / 3);
      const initialWord = userWord || defaultWords[currentWordIndex];
      // Make the word more prominent using larger style
      placeMultilineWord(grid, initialWord, centerY);
    }
    
    // Handle mouse movement
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current || !gridRef.current || !configRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      // Calculate mouse velocity
      const deltaX = mouseX - lastMouseX.current;
      const deltaY = mouseY - lastMouseY.current;
      const instantVelocity = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      mouseVelocity.current = mouseVelocity.current * velocitySmoothing + 
                              instantVelocity * (1 - velocitySmoothing); // Simple smoothing
      
      lastMouseX.current = mouseX;
      lastMouseY.current = mouseY;
      
      updateMousePosition(mouseX, mouseY, gridRef.current, configRef.current);
    };
    
    // Handle window resize
    const onResize = () => {
      if (!containerRef.current || !canvasRef.current || !gridRef.current || !configRef.current) return;
      handleResize(containerRef.current, canvasRef.current, gridRef.current, configRef.current);
      
      // Also resize legacy GOL grid if needed
      if (mode === "gol") {
        const cols = Math.floor(containerRef.current.offsetWidth / configRef.current.cellWidth);
        const rows = Math.floor(containerRef.current.offsetHeight / configRef.current.cellHeight);
        
        if (mode === "gol") {
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
            
            // Apply heat decay
            if (cell.heat) {
              cell.heat = cell.heat * 0.95;
            }
          }
        }
      }
      
      // Handle different modes
      if (mode === "default") {
        // Generate background patterns with reduced intensity to make words more visible
        noiseGenerator(gridRef.current, { intensity: 0.1, speed: 0.5 });
        waveGenerator(gridRef.current, { 
          amplitude: 0.2, 
          frequency: 0.07, 
          speed: 0.3 
        });
        
        // Handle word display and transitions
        const activeWord = userWord || defaultWords[currentWordIndex];
        // Position words at 1/3 down the screen instead of center for better visibility
        const centerY = Math.floor(gridRef.current.length / 3);
        
        // Check if we should start a new transition
        if (frameCountRef.current % 240 === 0 && !currentTransition && !userWord) {
          const nextIndex = (currentWordIndex + 1) % defaultWords.length;
          const nextWord = defaultWords[nextIndex];
          
          // Use a more visible transition effect
          const transition = startWordTransition(
            gridRef.current,
            activeWord,
            nextWord,
            'dissolve', // Could also try 'wipe-center' for variety
            Math.floor((gridRef.current[0].length - nextWord.length) / 2),
            centerY
          );
          
          setCurrentTransition(transition);
        }
        
        // Apply mouse velocity-based heat effect
        const velocityThreshold = 5; // Pixels per frame to trigger color
        const heatGain = 0.2; // How much heat velocity adds
        const heatRadius = 15; // How far the heat spreads (in grid cells)
        const redColor = '#ff0000'; // For heat-affected cells
        
        if (mouseVelocity.current > velocityThreshold && configRef.current.mousePosition) {
          const mouseGridX = configRef.current.mousePosition.x;
          const mouseGridY = configRef.current.mousePosition.y;
          
          for (let y = 0; y < gridRef.current.length; y++) {
            for (let x = 0; x < gridRef.current[0].length; x++) {
              const distX = x - mouseGridX;
              const distY = y - mouseGridY;
              const dist = Math.sqrt(distX * distX + distY * distY);
              
              if (dist < heatRadius) {
                // Apply more heat closer to cursor and based on velocity
                const heatToAdd = (mouseVelocity.current - velocityThreshold) * 
                                 heatGain * Math.max(0, 1 - dist / heatRadius);
                
                // Initialize heat if not exist
                if (!gridRef.current[y][x].heat) {
                  gridRef.current[y][x].heat = 0;
                }
                
                gridRef.current[y][x].heat = Math.min(1.0, gridRef.current[y][x].heat as number + heatToAdd);
                
                // Apply color based on heat
                if (gridRef.current[y][x].heat && gridRef.current[y][x].heat > 0.3) {
                  // Set to red for higher heat values
                  gridRef.current[y][x].color = redColor;
                }
              }
            }
          }
        }
        
        // Update transition if active
        if (currentTransition) {
          const isComplete = updateWordTransition(
            gridRef.current,
            currentTransition,
            0.03 // Slower transition for better visibility
          );
          
          if (isComplete) {
            setCurrentWordIndex((prevIndex) => (prevIndex + 1) % defaultWords.length);
            setCurrentTransition(null);
          }
        } else if (!userWord) {
          // If no transition active and not using userWord, display current word
          // Use a function to make words more prominent
          placeASCIIGraffiti(
            gridRef.current, 
            activeWord, 
            centerY
          );
        } else {
          // If using userWord, always display it
          placeASCIIGraffiti(
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
      // Legacy mode
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
        zIndex: 1
      }}
    >
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full"
        aria-hidden="true"
      />
    </div>
  );
};

// Function to place a word in a large, multi-line format
function placeMultilineWord(grid: AsciiGrid, word: string, centerY: number) {
  // Only proceed if grid exists
  if (!grid || grid.length === 0) return;
  
  const cols = grid[0].length;
  
  // Create an enlarged version of the word using ASCII art technique
  const wordLines: string[] = createLargeText(word);
  
  // Calculate positioning to center the word
  const lineLength = wordLines[0]?.length || 0;
  const x = Math.floor((cols - lineLength) / 2);
  
  // Place each line of the enlarged word
  for (let i = 0; i < wordLines.length; i++) {
    const y = centerY + i - Math.floor(wordLines.length / 2);
    
    // Skip if out of bounds
    if (y < 0 || y >= grid.length) continue;
    
    // Place this line of the word
    for (let j = 0; j < wordLines[i].length; j++) {
      const posX = x + j;
      
      // Skip if out of bounds
      if (posX < 0 || posX >= cols) continue;
      
      // Only place non-space characters
      const char = wordLines[i][j];
      if (char !== ' ') {
        grid[y][posX].char = char;
        grid[y][posX].type = 'background';
        grid[y][posX].intensity = 1.0; // Full intensity for visibility
      }
    }
  }
}

// Create a much larger ASCII graffiti-style word
function placeASCIIGraffiti(grid: AsciiGrid, word: string, centerY: number) {
  // Only proceed if grid exists
  if (!grid || grid.length === 0) return;
  
  const cols = grid[0].length;
  
  // Create a much larger ASCII art representation
  const wordLines: string[] = createGraffitiText(word);
  
  // Calculate positioning to center the word
  const lineLength = wordLines[0]?.length || 0;
  const x = Math.floor((cols - lineLength) / 2);
  
  // Place each line of the enlarged word
  for (let i = 0; i < wordLines.length; i++) {
    const y = centerY + i - Math.floor(wordLines.length / 2);
    
    // Skip if out of bounds
    if (y < 0 || y >= grid.length) continue;
    
    // Place this line of the word
    for (let j = 0; j < wordLines[i].length; j++) {
      const posX = x + j;
      
      // Skip if out of bounds
      if (posX < 0 || posX >= cols) continue;
      
      // Only place non-space characters
      const char = wordLines[i][j];
      if (char !== ' ') {
        grid[y][posX].char = char;
        grid[y][posX].type = 'background';
        grid[y][posX].intensity = 1.0; // Full intensity for visibility
      }
    }
  }
}

// Function to create a large text representation of a word
function createLargeText(word: string): string[] {
  // Simple ASCII art large letters (3 lines high)
  const result: string[] = ['', '', ''];
  
  // Convert to uppercase for consistency
  word = word.toUpperCase();
  
  for (let i = 0; i < word.length; i++) {
    const char = word[i];
    
    if (char === ' ') {
      // Add space
      result[0] += '  ';
      result[1] += '  ';
      result[2] += '  ';
    } else {
      // Add a visible character representation (simple but larger)
      result[0] += char + ' ';
      result[1] += char + ' ';
      result[2] += char + ' ';
    }
  }
  
  return result;
}

// Function to create graffiti-style text (much larger)
function createGraffitiText(word: string): string[] {
  // ASCII art style with 5 lines height
  const result: string[] = ['', '', '', '', ''];
  
  // Convert to uppercase for consistency
  word = word.toUpperCase();
  
  // Character maps for graffiti-style letters (simplified)
  const charMap: {[key: string]: string[]} = {
    'A': [
      '  █  ',
      ' ███ ',
      '█   █',
      '█████',
      '█   █'
    ],
    'B': [
      '████ ',
      '█   █',
      '████ ',
      '█   █',
      '████ '
    ],
    'C': [
      ' ████',
      '█    ',
      '█    ',
      '█    ',
      ' ████'
    ],
    'D': [
      '████ ',
      '█   █',
      '█   █',
      '█   █',
      '████ '
    ],
    'E': [
      '█████',
      '█    ',
      '████ ',
      '█    ',
      '█████'
    ],
    'F': [
      '█████',
      '█    ',
      '████ ',
      '█    ',
      '█    '
    ],
    'G': [
      ' ████',
      '█    ',
      '█  ██',
      '█   █',
      ' ████'
    ],
    'H': [
      '█   █',
      '█   █',
      '█████',
      '█   █',
      '█   █'
    ],
    'I': [
      '█████',
      '  █  ',
      '  █  ',
      '  █  ',
      '█████'
    ],
    'J': [
      '    █',
      '    █',
      '    █',
      '█   █',
      ' ███ '
    ],
    'K': [
      '█   █',
      '█  █ ',
      '███  ',
      '█  █ ',
      '█   █'
    ],
    'L': [
      '█    ',
      '█    ',
      '█    ',
      '█    ',
      '█████'
    ],
    'M': [
      '█   █',
      '██ ██',
      '█ █ █',
      '█   █',
      '█   █'
    ],
    'N': [
      '█   █',
      '██  █',
      '█ █ █',
      '█  ██',
      '█   █'
    ],
    'O': [
      ' ███ ',
      '█   █',
      '█   █',
      '█   █',
      ' ███ '
    ],
    'P': [
      '████ ',
      '█   █',
      '████ ',
      '█    ',
      '█    '
    ],
    'Q': [
      ' ███ ',
      '█   █',
      '█   █',
      '█  ██',
      ' ████'
    ],
    'R': [
      '████ ',
      '█   █',
      '████ ',
      '█  █ ',
      '█   █'
    ],
    'S': [
      ' ████',
      '█    ',
      ' ███ ',
      '    █',
      '████ '
    ],
    'T': [
      '█████',
      '  █  ',
      '  █  ',
      '  █  ',
      '  █  '
    ],
    'U': [
      '█   █',
      '█   █',
      '█   █',
      '█   █',
      ' ███ '
    ],
    'V': [
      '█   █',
      '█   █',
      '█   █',
      ' █ █ ',
      '  █  '
    ],
    'W': [
      '█   █',
      '█   █',
      '█ █ █',
      '██ ██',
      '█   █'
    ],
    'X': [
      '█   █',
      ' █ █ ',
      '  █  ',
      ' █ █ ',
      '█   █'
    ],
    'Y': [
      '█   █',
      ' █ █ ',
      '  █  ',
      '  █  ',
      '  █  '
    ],
    'Z': [
      '█████',
      '   █ ',
      '  █  ',
      ' █   ',
      '█████'
    ],
    ' ': [
      '     ',
      '     ',
      '     ',
      '     ',
      '     '
    ]
  };
  
  // Add default for characters not in our map
  const defaultChar = [
    '█████',
    '█████',
    '█████',
    '█████',
    '█████'
  ];
  
  // Combine characters to form the word
  for (let i = 0; i < word.length; i++) {
    const char = word[i];
    const charTemplate = charMap[char] || defaultChar;
    
    // Add each line of the character to the result
    for (let line = 0; line < 5; line++) {
      result[line] += charTemplate[line] + ' ';
    }
  }
  
  return result;
}

export default AsciiBackground; 