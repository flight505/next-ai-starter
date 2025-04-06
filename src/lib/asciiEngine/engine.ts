/**
 * ASCII Engine - Core Module
 * Central engine for managing the ASCII grid system and rendering
 */

// Type definitions for the ASCII grid system
export interface AsciiCell {
  char: string;                 // The ASCII character to display
  type: 'background' | 'ui' | 'interactive'; // Cell type for rendering rules
  intensity: number;            // Value from 0-1 for color intensity
  // Optional interactive properties
  interactive?: {
    baseChar: string;           // Original character
    isHovered: boolean;         // Mouse hover state
    linkTarget?: string;        // Optional URL for links
  };
}

export type AsciiGrid = AsciiCell[][];

// Configuration for the ASCII engine
export interface AsciiEngineConfig {
  cellWidth: number;            // Width of each character cell
  cellHeight: number;           // Height of each character cell
  backgroundColor: string;      // Background color
  textColor: string;            // Text color
  fontFamily: string;           // Font family for rendering
  mousePosition?: {
    x: number;                  // Mouse X position in pixels
    y: number;                  // Mouse Y position in cells
  };
}

/**
 * Initialize the ASCII engine with a grid and configuration
 */
export function initAsciiEngine(
  container: HTMLElement,
  canvas: HTMLCanvasElement,
  config: Partial<AsciiEngineConfig> = {}
): { grid: AsciiGrid; config: AsciiEngineConfig } {
  // Calculate grid dimensions based on container size
  const { width, height } = container.getBoundingClientRect();
  const cellWidth = config.cellWidth || 8;
  const cellHeight = config.cellHeight || 16;
  const cols = Math.floor(width / cellWidth);
  const rows = Math.floor(height / cellHeight);
  
  // Create initial configuration
  const engineConfig: AsciiEngineConfig = {
    cellWidth: cellWidth,
    cellHeight: cellHeight,
    backgroundColor: config.backgroundColor || '#000000',
    textColor: config.textColor || '#50C878',
    fontFamily: config.fontFamily || 'monospace'
  };
  
  // Initialize canvas
  canvas.width = width;
  canvas.height = height;
  
  // Initialize the grid with empty cells
  const grid: AsciiGrid = [];
  for (let y = 0; y < rows; y++) {
    const row: AsciiCell[] = [];
    for (let x = 0; x < cols; x++) {
      row.push({
        char: ' ',
        type: 'background',
        intensity: 0
      });
    }
    grid.push(row);
  }
  
  return { grid, config: engineConfig };
}

/**
 * Handle resize events
 */
export function handleResize(
  container: HTMLElement,
  canvas: HTMLCanvasElement,
  grid: AsciiGrid,
  config: AsciiEngineConfig
): void {
  // Get the new dimensions
  const { width, height } = container.getBoundingClientRect();
  const newCols = Math.floor(width / config.cellWidth);
  const newRows = Math.floor(height / config.cellHeight);
  
  // Resize the canvas
  canvas.width = width;
  canvas.height = height;
  
  // Resize the grid, preserving existing data where possible
  while (grid.length < newRows) {
    // Add new rows
    const newRow: AsciiCell[] = [];
    for (let x = 0; x < newCols; x++) {
      newRow.push({
        char: ' ',
        type: 'background',
        intensity: 0
      });
    }
    grid.push(newRow);
  }
  
  // Truncate if grid is now smaller
  if (grid.length > newRows) {
    grid.length = newRows;
  }
  
  // Adjust row widths
  for (let y = 0; y < grid.length; y++) {
    const row = grid[y];
    
    // Add new columns if needed
    while (row.length < newCols) {
      row.push({
        char: ' ',
        type: 'background',
        intensity: 0
      });
    }
    
    // Truncate if row is now smaller
    if (row.length > newCols) {
      row.length = newCols;
    }
  }
}

/**
 * Update mouse position for interactivity
 */
export function updateMousePosition(
  x: number,
  y: number,
  grid: AsciiGrid,
  config: AsciiEngineConfig
): void {
  // Convert pixel coordinates to grid coordinates
  const gridX = Math.floor(x / config.cellWidth);
  const gridY = Math.floor(y / config.cellHeight);
  
  config.mousePosition = {
    x: gridX,
    y: gridY
  };
}

/**
 * Render the current state of the grid to canvas
 */
export function renderFrame(
  canvas: HTMLCanvasElement,
  grid: AsciiGrid,
  config: AsciiEngineConfig
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  // Clear canvas with background color
  ctx.fillStyle = config.backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Set up text rendering
  ctx.font = `${config.cellHeight - 2}px ${config.fontFamily}`;
  ctx.textBaseline = 'top';
  
  // Render each cell
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      const cell = grid[y][x];
      
      // Skip empty spaces
      if (cell.char === ' ' && cell.type === 'background') continue;
      
      // Determine color based on cell type and intensity
      let color: string;
      
      switch (cell.type) {
        case 'background':
          // Use main color with variable intensity
          color = adjustColorIntensity(config.textColor, cell.intensity);
          break;
          
        case 'ui':
          // UI elements use full intensity
          color = config.textColor;
          break;
          
        case 'interactive':
          // Interactive elements can have hover effects
          color = cell.interactive?.isHovered 
            ? adjustColorIntensity(config.textColor, 1.5)
            : adjustColorIntensity(config.textColor, cell.intensity || 1);
          break;
          
        default:
          color = config.textColor;
      }
      
      // Set the color
      ctx.fillStyle = color;
      
      // Draw the character
      ctx.fillText(
        cell.char,
        x * config.cellWidth,
        y * config.cellHeight
      );
    }
  }
}

/**
 * Helper to adjust color intensity
 */
function adjustColorIntensity(color: string, intensity: number): string {
  // Parse the color
  let r = 0, g = 0, b = 0;
  
  // Handle hex format (#RRGGBB)
  const hexMatch = color.match(/#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/i);
  if (hexMatch) {
    r = parseInt(hexMatch[1], 16);
    g = parseInt(hexMatch[2], 16);
    b = parseInt(hexMatch[3], 16);
  } 
  // Handle rgb format
  else {
    const rgbMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/i);
    if (rgbMatch) {
      r = parseInt(rgbMatch[1]);
      g = parseInt(rgbMatch[2]);
      b = parseInt(rgbMatch[3]);
    }
  }
  
  // Adjust intensity (capped at 255)
  r = Math.min(255, Math.round(r * intensity));
  g = Math.min(255, Math.round(g * intensity));
  b = Math.min(255, Math.round(b * intensity));
  
  // Return the new color
  return `rgb(${r}, ${g}, ${b})`;
} 