/**
 * ASCII Engine - Procedural Generation Systems
 * Collection of algorithms for generating dynamic ASCII patterns
 */

import { AsciiGrid } from './engine';

/**
 * Simple 2D Perlin-like noise function
 * Generates values between 0-1
 */
export function noise(x: number, y: number, time: number, scale = 0.05): number {
  // This is a simple, naive noise implementation for demonstration
  // A proper implementation would use Perlin or Simplex noise
  const nx = x * scale;
  const ny = y * scale;
  const t = time * 0.2;
  
  return (
    Math.sin(nx + t) * Math.cos(ny + t * 0.3) * 0.25 +
    Math.sin((nx * 0.3 + ny * 0.7) * 2 + t * 0.7) * 0.25 +
    Math.sin((nx * 0.9 - ny * 0.3) * 3 + t * 0.4) * 0.25 +
    0.5
  );
}

/**
 * Generates a flowing wave pattern across the grid
 */
export function generateWave(
  grid: AsciiGrid, 
  time: number, 
  amplitude = 1.0, 
  scale = 0.05
): void {
  const rows = grid.length;
  const cols = grid[0].length;
  
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      // Skip UI cells
      if (grid[y][x].type !== 'background') continue;
      
      // Calculate noise value with wave-like characteristics
      const value = noise(x, y, time, scale) * amplitude;
      
      // Store intensity for later character mapping
      grid[y][x].intensity = value;
    }
  }
}

/**
 * Generates static noise (like TV static) across the grid
 */
export function generateStatic(
  grid: AsciiGrid, 
  density = 0.5
): void {
  const rows = grid.length;
  const cols = grid[0].length;
  
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      // Skip UI cells
      if (grid[y][x].type !== 'background') continue;
      
      // Generate random value
      const value = Math.random() * density;
      
      // Store intensity for later character mapping
      grid[y][x].intensity = value;
    }
  }
}

/**
 * Generates a Matrix-like rain effect
 */
export function generateMatrixRain(
  grid: AsciiGrid,
  time: number,
  density = 0.3,
  speed = 1.0
): void {
  const rows = grid.length;
  const cols = grid[0].length;
  
  // Reset intensities
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (grid[y][x].type !== 'background') continue;
      
      // Shift existing values down
      if (y > 0 && grid[y-1][x].intensity > 0.3) {
        grid[y][x].intensity = Math.max(0, grid[y-1][x].intensity - 0.1);
      } else {
        grid[y][x].intensity *= 0.95; // Fade out
      }
    }
  }
  
  // Generate new drops at the top
  for (let x = 0; x < cols; x++) {
    if (grid[0][x].type !== 'background') continue;
    
    // Randomly start new drops
    if (Math.random() < density * speed * 0.1) {
      grid[0][x].intensity = 0.7 + Math.random() * 0.3;
    }
  }
}

/**
 * Generates a ripple effect from a point
 */
export function generateRipple(
  grid: AsciiGrid,
  centerX: number,
  centerY: number,
  time: number,
  radius = 15,
  strength = 0.7
): void {
  const rows = grid.length;
  const cols = grid[0].length;
  
  // Calculate ripple parameters
  const rippleSpeed = 5;  // How fast the ripple moves
  const rippleWidth = 3;  // Width of the ripple wave
  
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      // Skip UI cells
      if (grid[y][x].type !== 'background') continue;
      
      // Calculate distance from ripple center
      const dx = x - centerX;
      const dy = y - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Only affect cells within the ripple radius
      if (distance <= radius) {
        // Calculate ripple effect
        const rippleFactor = Math.sin((distance - time * rippleSpeed) * (Math.PI / rippleWidth));
        const intensity = Math.max(0, Math.min(1, 
          grid[y][x].intensity + (rippleFactor * strength * (1 - distance / radius))
        ));
        
        grid[y][x].intensity = intensity;
      }
    }
  }
}

/**
 * Applies cursor "heat" effect around the mouse position
 */
export function generateCursorHeat(
  grid: AsciiGrid,
  mouseX: number, 
  mouseY: number,
  radius = 10,
  intensity = 0.7
): void {
  // Skip if mouse is outside grid
  if (mouseX < 0 || mouseY < 0 || mouseY >= grid.length || 
      (grid[0] && mouseX >= grid[0].length)) {
    return;
  }
  
  const rows = grid.length;
  const cols = grid[0].length;
  
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      // Skip UI cells
      if (grid[y][x].type !== 'background') continue;
      
      // Calculate distance from cursor
      const dx = x - mouseX;
      const dy = y - mouseY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Apply heat effect if within radius
      if (distance <= radius) {
        const heatFactor = intensity * (1 - distance / radius);
        grid[y][x].intensity = Math.min(1, grid[y][x].intensity + heatFactor);
      }
    }
  }
}

/**
 * Blends multiple generators with configurable weights
 */
export interface Generator {
  fn: (grid: AsciiGrid, ...args: any[]) => void;
  args: any[];
  weight: number;
}

export function blendGenerators(
  grid: AsciiGrid,
  generators: Generator[]
): void {
  // Create a temporary grid for each generator
  const rows = grid.length;
  const cols = grid[0].length;
  const tempGrids: Array<{ intensity: number }[][]> = [];
  
  // Run each generator on its own temporary grid
  for (const generator of generators) {
    // Create temp grid
    const tempGrid = Array(rows).fill(0).map(() => 
      Array(cols).fill(0).map(() => ({ intensity: 0 }))
    );
    
    // Copy only background cells to temp grid
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        if (grid[y][x].type === 'background') {
          tempGrid[y][x].intensity = grid[y][x].intensity;
        }
      }
    }
    
    // Apply the generator to temp grid
    generator.fn(tempGrid as any, ...generator.args);
    
    // Store the result
    tempGrids.push(tempGrid);
  }
  
  // Calculate total weight
  const totalWeight = generators.reduce((sum, gen) => sum + gen.weight, 0);
  
  // Blend the results back to the main grid
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (grid[y][x].type !== 'background') continue;
      
      // Reset intensity
      grid[y][x].intensity = 0;
      
      // Blend each generator's result according to weight
      for (let i = 0; i < generators.length; i++) {
        const weight = generators[i].weight / totalWeight;
        grid[y][x].intensity += tempGrids[i][y][x].intensity * weight;
      }
    }
  }
} 