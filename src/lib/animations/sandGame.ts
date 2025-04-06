/**
 * Sand game logic for ASCII animations
 * Simulates falling sand/letters with gravity and collision
 */

// Sand game grid uses a 2D array of strings
export type SandGrid = string[][];

/**
 * Create an empty sand grid with specified dimensions
 */
export function createEmptySandGrid(cols: number, rows: number): SandGrid {
  const grid: SandGrid = [];
  for (let y = 0; y < rows; y++) {
    grid[y] = [];
    for (let x = 0; x < cols; x++) {
      grid[y][x] = ' ';
    }
  }
  return grid;
}

/**
 * Add a letter to the sand grid at specified coordinates
 */
export function addLetterToGrid(
  grid: SandGrid, 
  x: number, 
  y: number, 
  letter: string
): SandGrid {
  if (x < 0 || y < 0 || y >= grid.length || x >= grid[0].length) {
    return grid; // Out of bounds
  }
  
  // Create a copy of the grid to avoid direct mutation
  const newGrid = grid.map(row => [...row]);
  
  // Only add letter if space is empty
  if (newGrid[y][x] === ' ') {
    newGrid[y][x] = letter;
  }
  
  return newGrid;
}

/**
 * Check if a grid cell is empty
 */
function isEmpty(grid: SandGrid, x: number, y: number): boolean {
  if (x < 0 || y < 0 || y >= grid.length || x >= grid[0].length) {
    return false; // Treat out of bounds as not empty (collision)
  }
  return grid[y][x] === ' ';
}

/**
 * Update the sand grid for one tick of the simulation
 * Iterate bottom-up and right-to-left to avoid multiple movements in a single tick
 */
export function updateSand(grid: SandGrid): SandGrid {
  // Create a copy of the grid to avoid direct mutation during updates
  const newGrid = grid.map(row => [...row]);
  
  // Start from the bottom row (excluding the very last row to avoid out-of-bounds)
  for (let y = grid.length - 2; y >= 0; y--) {
    // Process right to left (arbitrary choice, could be left to right)
    for (let x = grid[0].length - 1; x >= 0; x--) {
      const currentChar = grid[y][x];
      
      // Skip empty cells
      if (currentChar === ' ') continue;
      
      // Check cell below
      if (isEmpty(grid, x, y + 1)) {
        // Move down
        newGrid[y][x] = ' ';
        newGrid[y + 1][x] = currentChar;
      } 
      // If cannot move down, try to move diagonally
      else {
        const canMoveLeft = isEmpty(grid, x - 1, y + 1);
        const canMoveRight = isEmpty(grid, x + 1, y + 1);
        
        if (canMoveLeft && canMoveRight) {
          // Randomly choose left or right
          const moveLeft = Math.random() > 0.5;
          if (moveLeft) {
            newGrid[y][x] = ' ';
            newGrid[y + 1][x - 1] = currentChar;
          } else {
            newGrid[y][x] = ' ';
            newGrid[y + 1][x + 1] = currentChar;
          }
        } else if (canMoveLeft) {
          // Move diagonally left
          newGrid[y][x] = ' ';
          newGrid[y + 1][x - 1] = currentChar;
        } else if (canMoveRight) {
          // Move diagonally right
          newGrid[y][x] = ' ';
          newGrid[y + 1][x + 1] = currentChar;
        }
        // If cannot move in any direction, the character stays put
      }
    }
  }
  
  return newGrid;
}

/**
 * Create a sand grid with specified dimensions
 */
export function createSandGrid(cols: number, rows: number): SandGrid {
  return createEmptySandGrid(cols, rows);
}

/**
 * Add a letter formed by sand particles at specified coordinates
 */
export function addSandLetter(
  grid: SandGrid, 
  x: number, 
  y: number, 
  letter: string
): void {
  // Add a cluster of the same letter to create a bigger impact
  // The pattern depends on the letter size we want
  for (let offsetY = 0; offsetY < 3; offsetY++) {
    for (let offsetX = 0; offsetX < 3; offsetX++) {
      // Skip some positions to create a more interesting pattern
      if (Math.random() < 0.7) {
        const targetX = x + offsetX - 1;
        const targetY = y + offsetY - 1;
        
        if (targetX >= 0 && targetY >= 0 && 
            targetY < grid.length && targetX < grid[0].length && 
            grid[targetY][targetX] === ' ') {
          grid[targetY][targetX] = letter;
        }
      }
    }
  }
}

/**
 * Convert a sand grid to an ASCII representation
 */
export function sandToAscii(grid: SandGrid, characters: string = '█▓▒░ '): string {
  const rows = grid.length;
  const cols = grid[0].length;
  let result = '';
  
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      // If it's a letter/character, keep it as is
      // If it's empty, use the space character
      result += grid[y][x] === ' ' ? characters[characters.length - 1] : grid[y][x];
    }
    result += '\n';
  }
  
  return result;
} 