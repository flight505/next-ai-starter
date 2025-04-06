/**
 * Conway's Game of Life implementation for ASCII animations
 */

export type GOLGrid = boolean[][];

/**
 * Create an empty Game of Life grid with random cells
 * @param cols Number of columns 
 * @param rows Number of rows
 * @param density Percentage (0-1) of initially live cells
 */
export function createGOLGrid(cols: number, rows: number, density = 0.3): GOLGrid {
  const grid: GOLGrid = [];
  for (let y = 0; y < rows; y++) {
    grid[y] = [];
    for (let x = 0; x < cols; x++) {
      grid[y][x] = Math.random() < density;
    }
  }
  return grid;
}

/**
 * Count the number of live neighbors for a cell
 */
function countNeighbors(grid: GOLGrid, x: number, y: number): number {
  const rows = grid.length;
  const cols = grid[0].length;
  let count = 0;
  
  // Check all 8 neighboring cells
  for (let yOffset = -1; yOffset <= 1; yOffset++) {
    for (let xOffset = -1; xOffset <= 1; xOffset++) {
      // Skip the cell itself
      if (xOffset === 0 && yOffset === 0) continue;
      
      // Use modulo to wrap around edges (toroidal grid)
      const xPos = (x + xOffset + cols) % cols;
      const yPos = (y + yOffset + rows) % rows;
      
      if (grid[yPos][xPos]) {
        count++;
      }
    }
  }
  
  return count;
}

/**
 * Update the Game of Life grid for one generation
 * Rules:
 * 1. Any live cell with fewer than two live neighbors dies (underpopulation)
 * 2. Any live cell with two or three live neighbors lives (survival)
 * 3. Any live cell with more than three live neighbors dies (overpopulation)
 * 4. Any dead cell with exactly three live neighbors becomes alive (reproduction)
 */
export function updateGOL(grid: GOLGrid): GOLGrid {
  const rows = grid.length;
  const cols = grid[0].length;
  const newGrid: GOLGrid = [];
  
  for (let y = 0; y < rows; y++) {
    newGrid[y] = [];
    for (let x = 0; x < cols; x++) {
      const neighbors = countNeighbors(grid, x, y);
      const isAlive = grid[y][x];
      
      if (isAlive) {
        // Rules 1-3: Live cell survival
        newGrid[y][x] = neighbors === 2 || neighbors === 3;
      } else {
        // Rule 4: Dead cell reproduction
        newGrid[y][x] = neighbors === 3;
      }
    }
  }
  
  return newGrid;
}

/**
 * Convert a Game of Life grid to an ASCII representation
 */
export function golToAscii(grid: GOLGrid, characters: string = '█▓▒░ '): string {
  const rows = grid.length;
  const cols = grid[0].length;
  let result = '';
  
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      // Use the provided characters (first char for alive cells, last for dead)
      result += grid[y][x] ? characters[0] : characters[characters.length - 1];
    }
    result += '\n';
  }
  
  return result;
} 