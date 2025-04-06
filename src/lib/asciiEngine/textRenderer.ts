/**
 * ASCII Engine - Text Rendering System
 * Functions for rendering and transitioning text within the ASCII grid
 */

import { AsciiGrid, AsciiCell } from './engine';

// Word libraries for dynamic text display
export const wordLibrary = {
  greetings: [
    "HELLO", "HI", "WELCOME", "GREETINGS", "HEY THERE"
  ],
  tech: [
    "CODE", "TYPESCRIPT", "REACT", "NEXTJS", "ASCII ART", "ELECTRON"
  ],
  creative: [
    "DESIGN", "CREATE", "IMAGINE", "INSPIRE", "INNOVATE"
  ],
  phrases: [
    "STAY CURIOUS", "KEEP CODING", "MAKE THINGS", "BREAK THINGS", "FIX THINGS"
  ],
  misc: [
    "COFFEE", "SLEEP", "REPEAT", "ITERATE", "EVOLVE" 
  ]
};

/**
 * Get dimensions of a word in grid cells
 */
export function getWordDimensions(word: string): { width: number; height: number } {
  return {
    width: word.length,
    height: 1  // Simple 1-line implementation
  };
}

/**
 * Place a word at a specific position in the grid
 */
export function placeWord(
  grid: AsciiGrid, 
  word: string, 
  x: number, 
  y: number, 
  type: 'ui' | 'background' | 'interactive' = 'background'
): void {
  const rows = grid.length;
  const cols = grid[0].length;
  
  // Skip if position is out of bounds
  if (y < 0 || y >= rows) return;
  
  // Place each character of the word
  for (let i = 0; i < word.length; i++) {
    const posX = x + i;
    
    // Skip characters that would be out of bounds
    if (posX < 0 || posX >= cols) continue;
    
    // Place the character
    grid[y][posX].char = word[i];
    grid[y][posX].type = type;
    
    // For interactive elements, store original character
    if (type === 'interactive') {
      if (!grid[y][posX].interactive) {
        grid[y][posX].interactive = {
          baseChar: word[i],
          isHovered: false
        };
      } else {
        grid[y][posX].interactive.baseChar = word[i];
      }
    }
  }
}

/**
 * Center a word horizontally in the grid
 */
export function centerWord(
  grid: AsciiGrid, 
  word: string, 
  y: number,
  type: 'ui' | 'background' | 'interactive' = 'background'
): void {
  const cols = grid[0].length;
  const x = Math.floor((cols - word.length) / 2);
  placeWord(grid, word, x, y, type);
}

/**
 * Get a random word from a category or categories
 */
export function getRandomWord(categories: (keyof typeof wordLibrary)[] | keyof typeof wordLibrary): string {
  if (typeof categories === 'string') {
    categories = [categories];
  }
  
  // Flatten all requested categories into a single array
  const words: string[] = [];
  for (const category of categories) {
    words.push(...wordLibrary[category]);
  }
  
  // Select a random word
  return words[Math.floor(Math.random() * words.length)];
}

/**
 * Transition types for word animations
 */
export type TransitionType = 'dissolve' | 'reveal' | 'morph' | 'wipe-left' | 'wipe-right' | 'wipe-center';

/**
 * State for word transition
 */
export interface WordTransition {
  fromWord: string;
  toWord: string;
  progress: number;  // 0 to 1
  type: TransitionType;
  startPosition: { x: number, y: number };
  cellStates: number[];
}

/**
 * Initialize a word transition
 */
export function startWordTransition(
  grid: AsciiGrid,
  fromWord: string,
  toWord: string,
  type: TransitionType,
  x: number,
  y: number
): WordTransition {
  const transition: WordTransition = {
    fromWord,
    toWord,
    progress: 0,
    type,
    startPosition: { x, y },
    cellStates: Array(Math.max(fromWord.length, toWord.length)).fill(0)
  };
  
  // Initialize any specific state needed for the transition type
  if (type === 'wipe-center') {
    // For center wipe, we start from the middle
    const midpoint = Math.floor(toWord.length / 2);
    for (let i = 0; i < transition.cellStates.length; i++) {
      transition.cellStates[i] = Math.abs(i - midpoint) / midpoint;
    }
  }
  
  return transition;
}

/**
 * Update a word transition
 */
export function updateWordTransition(
  grid: AsciiGrid,
  transition: WordTransition,
  deltaProgress: number
): boolean {
  // Update overall progress
  transition.progress = Math.min(1, transition.progress + deltaProgress);
  
  // Apply transition based on type
  const { x, y } = transition.startPosition;
  const { fromWord, toWord, type } = transition;
  
  // Get ASCII character palettes for transitions
  const transitionChars = ['.', ':', '+', '*', '#', '@'];
  
  switch (type) {
    case 'dissolve': {
      // Dissolve gradually replaces characters with random transition characters
      for (let i = 0; i < Math.max(fromWord.length, toWord.length); i++) {
        if (i >= grid[0].length || y >= grid.length) continue;
        
        // Skip positions that would be out of bounds
        const posX = x + i;
        if (posX < 0 || posX >= grid[0].length) continue;
        
        // Each character has its own state during dissolve
        const charProgress = Math.min(1, transition.progress * 1.5 - i * 0.05);
        
        if (charProgress <= 0) {
          // Still show original character
          if (i < fromWord.length) {
            grid[y][posX].char = fromWord[i];
          }
        } else if (charProgress >= 1) {
          // Show final character
          if (i < toWord.length) {
            grid[y][posX].char = toWord[i];
          } else {
            // Clear extra characters from longer first word
            grid[y][posX].char = ' ';
          }
        } else {
          // In transition - show a random transition character
          const transIndex = Math.floor(charProgress * transitionChars.length);
          grid[y][posX].char = transitionChars[transIndex];
        }
      }
      break;
    }
      
    case 'reveal': {
      // Reveal progressively reveals the new word from noise
      for (let i = 0; i < toWord.length; i++) {
        // Skip positions that would be out of bounds
        const posX = x + i;
        if (posX < 0 || posX >= grid[0].length || y >= grid.length) continue;
        
        // Each character has a reveal threshold based on position and progress
        const revealThreshold = transition.progress - (i * 0.1);
        
        if (revealThreshold >= 1) {
          // Fully revealed
          grid[y][posX].char = toWord[i];
        } else if (revealThreshold <= 0) {
          // Not revealed yet - show background or space
          grid[y][posX].char = ' ';
          grid[y][posX].type = 'background';
          grid[y][posX].intensity = 0.3 + Math.random() * 0.4; // Noisy background
        } else {
          // Partially revealed
          const noiseIndex = Math.floor(Math.random() * transitionChars.length);
          grid[y][posX].char = Math.random() > revealThreshold * 2 ? 
            transitionChars[noiseIndex] : toWord[i];
        }
      }
      break;
    }
      
    case 'morph': {
      // Morph smoothly transforms between character sets
      for (let i = 0; i < Math.max(fromWord.length, toWord.length); i++) {
        // Skip positions that would be out of bounds
        const posX = x + i;
        if (posX < 0 || posX >= grid[0].length || y >= grid.length) continue;
        
        if (i >= toWord.length) {
          // Handle case where from word is longer
          const fadeProgress = transition.progress * 2;
          if (fadeProgress >= 1) {
            grid[y][posX].char = ' ';
          } else {
            // Fade out this character
            const charCode = fromWord.charCodeAt(i);
            const newCharCode = Math.floor(charCode * (1 - fadeProgress));
            grid[y][posX].char = String.fromCharCode(newCharCode);
          }
        } else if (i >= fromWord.length) {
          // Handle case where to word is longer
          const fadeProgress = transition.progress * 2;
          if (fadeProgress >= 1) {
            grid[y][posX].char = toWord[i];
          } else {
            // Fade in this character
            const charCode = toWord.charCodeAt(i);
            const newCharCode = Math.floor(charCode * fadeProgress);
            grid[y][posX].char = newCharCode > 32 ? 
              String.fromCharCode(newCharCode) : 
              transitionChars[Math.floor(fadeProgress * transitionChars.length)];
          }
        } else {
          // Both words have a character here - morph between them
          const fromCharCode = fromWord.charCodeAt(i);
          const toCharCode = toWord.charCodeAt(i);
          
          // Simple linear interpolation between character codes
          const newCharCode = Math.floor(
            fromCharCode * (1 - transition.progress) + 
            toCharCode * transition.progress
          );
          
          grid[y][posX].char = String.fromCharCode(newCharCode);
        }
      }
      break;
    }
      
    case 'wipe-left': {
      // Wipe from left to right
      for (let i = 0; i < Math.max(fromWord.length, toWord.length); i++) {
        // Skip positions that would be out of bounds
        const posX = x + i;
        if (posX < 0 || posX >= grid[0].length || y >= grid.length) continue;
        
        // Calculate position-based progress for this character
        const wipeProgress = transition.progress * 1.5 - (i * 0.15);
        
        if (wipeProgress >= 1) {
          // This position is fully wiped
          if (i < toWord.length) {
            grid[y][posX].char = toWord[i];
          } else {
            grid[y][posX].char = ' ';
          }
        } else if (wipeProgress <= 0) {
          // Not wiped yet
          if (i < fromWord.length) {
            grid[y][posX].char = fromWord[i];
          } else {
            grid[y][posX].char = ' ';
          }
        } else {
          // In transition
          const transIndex = Math.floor(wipeProgress * transitionChars.length);
          grid[y][posX].char = transitionChars[transIndex];
        }
      }
      break;
    }
      
    case 'wipe-right': {
      // Wipe from right to left
      for (let i = Math.max(fromWord.length, toWord.length) - 1; i >= 0; i--) {
        // Skip positions that would be out of bounds
        const posX = x + i;
        if (posX < 0 || posX >= grid[0].length || y >= grid.length) continue;
        
        // Calculate position-based progress for this character
        const maxIndex = Math.max(fromWord.length, toWord.length) - 1;
        const relativePos = maxIndex - i;
        const wipeProgress = transition.progress * 1.5 - (relativePos * 0.15);
        
        if (wipeProgress >= 1) {
          // This position is fully wiped
          if (i < toWord.length) {
            grid[y][posX].char = toWord[i];
          } else {
            grid[y][posX].char = ' ';
          }
        } else if (wipeProgress <= 0) {
          // Not wiped yet
          if (i < fromWord.length) {
            grid[y][posX].char = fromWord[i];
          } else {
            grid[y][posX].char = ' ';
          }
        } else {
          // In transition
          const transIndex = Math.floor(wipeProgress * transitionChars.length);
          grid[y][posX].char = transitionChars[transIndex];
        }
      }
      break;
    }
      
    case 'wipe-center': {
      // Wipe from center outward
      const midpoint = Math.floor(Math.max(fromWord.length, toWord.length) / 2);
      
      for (let i = 0; i < Math.max(fromWord.length, toWord.length); i++) {
        // Skip positions that would be out of bounds
        const posX = x + i;
        if (posX < 0 || posX >= grid[0].length || y >= grid.length) continue;
        
        // Distance from midpoint (0-1)
        const distFromMid = Math.abs(i - midpoint) / midpoint;
        // Higher progress needed the further we are from center
        const wipeProgress = transition.progress * 1.2 - (distFromMid * 0.8);
        
        if (wipeProgress >= 1) {
          // This position is fully wiped
          if (i < toWord.length) {
            grid[y][posX].char = toWord[i];
          } else {
            grid[y][posX].char = ' ';
          }
        } else if (wipeProgress <= 0) {
          // Not wiped yet
          if (i < fromWord.length) {
            grid[y][posX].char = fromWord[i];
          } else {
            grid[y][posX].char = ' ';
          }
        } else {
          // In transition
          const transIndex = Math.floor(wipeProgress * transitionChars.length);
          grid[y][posX].char = transitionChars[transIndex];
        }
      }
      break;
    }
  }
  
  // Return true if transition is complete
  return transition.progress >= 1;
} 