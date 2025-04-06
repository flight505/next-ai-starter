/**
 * ASCII Engine - Procedural Generation Systems
 * Functions for generating different patterns and effects on the ASCII grid
 */

import { AsciiGrid } from './engine';

// Noise Generator Options
interface NoiseGeneratorOptions {
  intensity?: number;   // Overall intensity of noise (0-1)
  speed?: number;       // Speed of animation (0-1)
}

/**
 * Generate Perlin-like noise on the grid
 */
export function noiseGenerator(
  grid: AsciiGrid,
  options: NoiseGeneratorOptions = {}
): void {
  const intensity = options.intensity ?? 0.5;
  const speed = options.speed ?? 1;
  const time = Date.now() * 0.001 * speed;
  
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      // Skip non-background cells
      if (grid[y][x].type !== 'background') continue;
      
      // Generate noise value - using a simple algorithm here for performance
      const noiseValue = 
        Math.sin(x * 0.1 + time) * 
        Math.cos(y * 0.1 + time) * 
        Math.sin((x + y) * 0.1 + time);
      
      // Map to 0-1 range
      const normalizedValue = (noiseValue + 1) * 0.5;
      
      // Apply intensity
      grid[y][x].intensity = normalizedValue * intensity;
    }
  }
}

// Wave Generator Options
interface WaveGeneratorOptions {
  amplitude?: number;    // Height of waves (0-1)
  frequency?: number;    // Frequency of waves
  speed?: number;        // Speed of animation
  verticalShift?: number; // Vertical offset
}

/**
 * Generate wave patterns on the grid
 */
export function waveGenerator(
  grid: AsciiGrid,
  options: WaveGeneratorOptions = {}
): void {
  const amplitude = options.amplitude ?? 0.5;
  const frequency = options.frequency ?? 0.1;
  const speed = options.speed ?? 1;
  const verticalShift = options.verticalShift ?? 0;
  
  const time = Date.now() * 0.001 * speed;
  
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      // Skip non-background cells
      if (grid[y][x].type !== 'background') continue;
      
      // Calculate wave value
      const waveValue = 
        Math.sin(x * frequency + time) * 
        Math.cos((y + verticalShift) * frequency + time * 0.5) * 
        amplitude;
      
      // Add to existing intensity (allowing blending with other generators)
      grid[y][x].intensity = Math.min(1, (grid[y][x].intensity || 0) + Math.abs(waveValue));
    }
  }
}

// Static Generator Options
interface StaticGeneratorOptions {
  density?: number;      // Density of static (0-1)
  intensity?: number;    // Intensity of static (0-1)
}

/**
 * Generate static/noise pattern
 */
export function staticGenerator(
  grid: AsciiGrid,
  options: StaticGeneratorOptions = {}
): void {
  const density = options.density ?? 0.3;
  const intensity = options.intensity ?? 0.5;
  
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      // Skip non-background cells
      if (grid[y][x].type !== 'background') continue;
      
      // Random static with density control
      if (Math.random() < density) {
        grid[y][x].intensity = Math.min(1, (grid[y][x].intensity || 0) + Math.random() * intensity);
      }
    }
  }
}

// Rain Generator Options
interface RainGeneratorOptions {
  density?: number;      // Density of raindrops (0-1)
  speed?: number;        // Speed of rain (0-1)
}

/**
 * Generate rain effect
 */
export function rainGenerator(
  grid: AsciiGrid,
  options: RainGeneratorOptions = {}
): void {
  const density = options.density ?? 0.05;
  const speed = options.speed ?? 1;
  
  // Randomly add raindrops to the top row
  for (let x = 0; x < grid[0].length; x++) {
    if (Math.random() < density) {
      if (grid[0][x].type === 'background') {
        grid[0][x].intensity = 1;
        grid[0][x].char = '|';
      }
    }
  }
  
  // Move existing raindrops down
  for (let y = grid.length - 1; y > 0; y--) {
    for (let x = 0; x < grid[0].length; x++) {
      if (grid[y-1][x].char === '|' && grid[y][x].type === 'background') {
        // Move drop down
        grid[y][x].char = '|';
        grid[y][x].intensity = grid[y-1][x].intensity * 0.95; // Fade out
        
        // Clear previous position
        grid[y-1][x].char = ' ';
        grid[y-1][x].intensity = 0;
      }
    }
  }
}

// Ripple Generator Options
interface RippleGeneratorOptions {
  centerX?: number;      // Center X position
  centerY?: number;      // Center Y position
  radius?: number;       // Current radius
  maxRadius?: number;    // Maximum radius
  intensity?: number;    // Intensity of ripple (0-1)
}

/**
 * Generate expanding ripple effect
 */
export function rippleGenerator(
  grid: AsciiGrid,
  options: RippleGeneratorOptions = {}
): void {
  const centerX = options.centerX ?? Math.floor(grid[0].length / 2);
  const centerY = options.centerY ?? Math.floor(grid.length / 2);
  const radius = options.radius ?? 0;
  const maxRadius = options.maxRadius ?? Math.max(grid.length, grid[0].length);
  const intensity = options.intensity ?? 0.7;
  
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      // Skip non-background cells
      if (grid[y][x].type !== 'background') continue;
      
      // Calculate distance from center
      const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
      
      // Create ripple effect (ring)
      const rippleWidth = 3; // Width of the ripple
      if (Math.abs(distance - radius) < rippleWidth) {
        // Calculate fade based on distance from exact radius
        const fade = 1 - (Math.abs(distance - radius) / rippleWidth);
        grid[y][x].intensity = Math.min(1, (grid[y][x].intensity || 0) + fade * intensity);
      }
    }
  }
}

// Cursor Heat Options
interface CursorHeatOptions {
  mouseX: number;        // Mouse X position
  mouseY: number;        // Mouse Y position
  radius?: number;       // Radius of effect
  intensity?: number;    // Max intensity
}

/**
 * Generate a heat effect around the cursor
 */
export function cursorHeatGenerator(
  grid: AsciiGrid,
  options: CursorHeatOptions
): void {
  const { mouseX, mouseY } = options;
  const radius = options.radius ?? 10;
  const intensity = options.intensity ?? 1;
  
  // Ensure mouseX and mouseY are valid
  if (mouseX < 0 || mouseY < 0) return;
  
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      // Skip non-background cells
      if (grid[y][x].type !== 'background') continue;
      
      // Calculate distance from cursor
      const distance = Math.sqrt(Math.pow(x - mouseX, 2) + Math.pow(y - mouseY, 2));
      
      // Apply heat based on distance
      if (distance < radius) {
        const heatValue = intensity * (1 - distance / radius);
        grid[y][x].intensity = Math.min(1, (grid[y][x].intensity || 0) + heatValue);
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