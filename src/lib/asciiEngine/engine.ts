/**
 * ASCII Engine - Core module
 * A unified rendering system for ASCII-based UI and background animations
 */

// Define the core types
export type AsciiCellType = 'ui' | 'background' | 'interactive';

export interface AsciiCell {
  char: string;           // The current displayed character
  targetChar?: string;    // For transitions
  state: number;          // State value (can be used differently by different renderers)
  type: AsciiCellType;    // What kind of cell this is
  intensity: number;      // Value between 0-1 for mapping to palettes
  interactive?: {
    baseChar: string;     // Original character when not animated
    isHovered: boolean;   // Whether this cell is currently hovered
    linkTarget?: string;  // URL for links
  }
}

export type AsciiGrid = AsciiCell[][];

export interface EngineOptions {
  element: HTMLPreElement;
  cols?: number;
  rows?: number;
  fps?: number;
  theme?: 'dark' | 'light';
  mouseEnabled?: boolean;
}

export interface AsciiEngine {
  grid: AsciiGrid;
  cols: number;
  rows: number;
  fps: number;
  element: HTMLPreElement;
  theme: 'dark' | 'light';
  mouseX: number;
  mouseY: number;
  time: number;
  start: () => void;
  stop: () => void;
  resize: (newCols?: number, newRows?: number) => void;
  update: (deltaTime: number) => void;
  render: () => void;
}

/**
 * Measures the size of a character in the monospace font
 */
function measureCharSize(): { width: number; height: number } {
  const testElement = document.createElement('pre');
  testElement.style.visibility = 'hidden';
  testElement.style.position = 'absolute';
  testElement.style.top = '-9999px';
  testElement.style.fontFamily = 'monospace';
  testElement.textContent = 'X';
  
  document.body.appendChild(testElement);
  const rect = testElement.getBoundingClientRect();
  document.body.removeChild(testElement);
  
  return { 
    width: rect.width, 
    height: rect.height 
  };
}

/**
 * Creates a new ASCII engine instance
 */
export function createEngine(options: EngineOptions): AsciiEngine {
  const {
    element,
    cols = 0,
    rows = 0,
    fps = 30,
    theme = 'dark',
    mouseEnabled = true
  } = options;
  
  // Calculate dimensions if not specified
  const charSize = measureCharSize();
  const calculatedCols = cols || Math.floor(element.offsetWidth / charSize.width);
  const calculatedRows = rows || Math.floor(element.offsetHeight / charSize.height);
  
  // Initialize the grid
  const grid: AsciiGrid = Array(calculatedRows).fill(0).map(() => 
    Array(calculatedCols).fill(0).map(() => ({
      char: ' ',
      state: 0,
      type: 'background',
      intensity: 0
    }))
  );
  
  // Engine state
  let isRunning = false;
  let lastFrameTime = 0;
  let frameId: number | null = null;
  let mouseX = -1;
  let mouseY = -1;
  let currentTime = 0;
  
  // Update mouse position
  function handleMouseMove(e: MouseEvent) {
    if (!mouseEnabled) return;
    
    const rect = element.getBoundingClientRect();
    const relativeX = e.clientX - rect.left;
    const relativeY = e.clientY - rect.top;
    
    mouseX = Math.floor(relativeX / charSize.width);
    mouseY = Math.floor(relativeY / charSize.height);
    
    // Keep within grid bounds
    mouseX = Math.max(0, Math.min(mouseX, calculatedCols - 1));
    mouseY = Math.max(0, Math.min(mouseY, calculatedRows - 1));
  }
  
  // Handle resize
  function handleResize() {
    // Only recalculate if auto-sizing was enabled
    if (cols === 0 || rows === 0) {
      const newCols = Math.floor(element.offsetWidth / charSize.width);
      const newRows = Math.floor(element.offsetHeight / charSize.height);
      resize(newCols, newRows);
    }
  }
  
  // Animation frame handler
  function animate(timestamp: number) {
    const deltaTime = timestamp - lastFrameTime;
    const frameInterval = 1000 / fps;
    
    // Only update if enough time has passed
    if (deltaTime >= frameInterval) {
      lastFrameTime = timestamp - (deltaTime % frameInterval);
      currentTime = timestamp * 0.001; // convert to seconds
      
      // Update and render
      update(deltaTime * 0.001);
      render();
    }
    
    // Request next frame
    if (isRunning) {
      frameId = requestAnimationFrame(animate);
    }
  }
  
  // Update the grid state
  function update(deltaTime: number) {
    // This will be filled by generator systems
    // Left empty for now as generators will be implemented separately
  }
  
  // Render grid to DOM
  function render() {
    // Character palettes for themes
    const darkPalette = [' ', '.', ':', '+', '*', '#', '@'];
    const lightPalette = ['@', '#', '*', '+', ':', '.', ' '];
    const palette = theme === 'dark' ? darkPalette : lightPalette;
    
    // Generate the output string
    let output = '';
    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[y].length; x++) {
        const cell = grid[y][x];
        
        // Add the character (this will be enhanced with interactive features)
        if (cell.type === 'background') {
          // Map intensity to palette
          const index = Math.min(
            palette.length - 1, 
            Math.floor(cell.intensity * palette.length)
          );
          output += palette[index];
        } else {
          // UI and interactive elements
          output += cell.char;
        }
      }
      output += '\n';
    }
    
    // Single DOM update
    element.textContent = output;
  }
  
  // Set up and initialize the engine
  function start() {
    if (isRunning) return;
    
    isRunning = true;
    lastFrameTime = performance.now();
    
    // Set up event listeners
    if (mouseEnabled) {
      element.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('resize', handleResize);
    }
    
    // Start animation loop
    frameId = requestAnimationFrame(animate);
  }
  
  // Stop the engine
  function stop() {
    if (!isRunning) return;
    
    isRunning = false;
    
    // Clean up event listeners
    if (mouseEnabled) {
      element.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    }
    
    // Cancel animation frame
    if (frameId !== null) {
      cancelAnimationFrame(frameId);
      frameId = null;
    }
  }
  
  // Resize the grid
  function resize(newCols?: number, newRows?: number) {
    const targetCols = newCols || calculatedCols;
    const targetRows = newRows || calculatedRows;
    
    // Create a new grid with the new dimensions
    const newGrid: AsciiGrid = Array(targetRows).fill(0).map(() => 
      Array(targetCols).fill(0).map(() => ({
        char: ' ',
        state: 0,
        type: 'background',
        intensity: 0
      }))
    );
    
    // Copy existing cells
    for (let y = 0; y < Math.min(grid.length, targetRows); y++) {
      for (let x = 0; x < Math.min(grid[y].length, targetCols); x++) {
        newGrid[y][x] = grid[y][x];
      }
    }
    
    // Update the grid reference
    Object.assign(grid, newGrid);
  }
  
  // Return the engine interface
  return {
    grid,
    cols: calculatedCols,
    rows: calculatedRows,
    fps,
    element,
    theme,
    mouseX,
    mouseY,
    time: currentTime,
    start,
    stop,
    resize,
    update,
    render
  };
} 