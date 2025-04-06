/**
 * ASCII Engine - UI Rendering System
 * Functions for rendering DOM-based UI elements to ASCII grid
 */

import { AsciiGrid, AsciiCell } from './engine';

// Configuration for UI rendering
export interface UIRenderConfig {
  startX: number;
  startY: number;
  maxWidth: number;
  maxHeight: number;
}

/**
 * Render UI elements from a DOM container to the ASCII grid
 */
export function renderUIFromDOM(
  container: HTMLElement,
  grid: AsciiGrid,
  config: UIRenderConfig
): void {
  // Find all elements with the data-ui attribute
  const uiElements = container.querySelectorAll('[data-ascii-ui]');
  
  if (uiElements.length === 0) {
    // Use the container itself as the UI element if no specific elements found
    walkElement(container, config.startX, config.startY, config, grid);
  } else {
    // Process each UI element
    uiElements.forEach(element => {
      if (element instanceof HTMLElement) {
        walkElement(element, config.startX, config.startY, config, grid);
      }
    });
  }
}

/**
 * Walk the DOM tree and render elements
 */
function walkElement(
  element: HTMLElement,
  x: number,
  y: number,
  config: UIRenderConfig,
  grid: AsciiGrid
): { x: number; y: number } {
  const tagName = element.tagName.toLowerCase();
  
  // Handle specific element types
  switch (tagName) {
    case 'h1':
    case 'h2':
    case 'h3':
    case 'h4':
    case 'h5':
    case 'h6':
      renderHeading(grid, element.textContent || '', x, y, parseInt(tagName.substring(1)));
      y += 2; // Add space after heading
      break;
      
    case 'p':
      renderParagraph(grid, element.textContent || '', x, y, config.maxWidth);
      y += Math.ceil((element.textContent || '').length / config.maxWidth) + 1;
      break;
      
    case 'ul':
    case 'ol':
      const listResult = renderList(grid, element, x, y, config, grid);
      y = listResult.y;
      break;
      
    case 'div':
      const divResult = renderDiv(grid, element, x, y, config, grid);
      y = divResult.y;
      break;
      
    default:
      // For other elements, just render the text content
      if (element.textContent) {
        const text = element.textContent.trim();
        if (text) {
          for (let i = 0; i < text.length; i++) {
            if (x + i < grid[0].length && y < grid.length) {
              grid[y][x + i].char = text[i];
              grid[y][x + i].type = 'ui';
            }
          }
          y += 1;
        }
      }
  }
  
  // Process children
  if (tagName !== 'ul' && tagName !== 'ol' && tagName !== 'div') {
    const childResult = processChildren(element, x, y, config, grid);
    y = childResult.y;
  }
  
  return { x, y };
}

/**
 * Process children of an element
 */
function processChildren(
  element: HTMLElement,
  x: number,
  y: number,
  config: UIRenderConfig,
  grid: AsciiGrid
): { x: number; y: number } {
  let currentX = x;
  let currentY = y;
  
  Array.from(element.children).forEach(child => {
    if (child instanceof HTMLElement) {
      const result = walkElement(child, currentX, currentY, config, grid);
      currentY = result.y;
    }
  });
  
  return { x: currentX, y: currentY };
}

/**
 * Render a heading
 */
function renderHeading(
  grid: AsciiGrid,
  text: string,
  x: number,
  y: number,
  level: number
): void {
  // Adjust size based on heading level
  const prefix = '#'.repeat(level) + ' ';
  const fullText = prefix + text;
  
  for (let i = 0; i < fullText.length; i++) {
    if (x + i < grid[0].length && y < grid.length) {
      grid[y][x + i].char = fullText[i];
      grid[y][x + i].type = 'ui';
      grid[y][x + i].intensity = 1;
    }
  }
}

/**
 * Render a paragraph with word wrapping
 */
function renderParagraph(
  grid: AsciiGrid,
  text: string,
  x: number,
  y: number,
  maxWidth: number
): void {
  const words = text.split(' ');
  let currentX = x;
  let currentY = y;
  
  for (const word of words) {
    // Check if we need to wrap to the next line
    if (currentX + word.length + 1 > x + maxWidth) {
      currentX = x;
      currentY++;
    }
    
    // Skip if we're out of bounds
    if (currentY >= grid.length) break;
    
    // Render the word
    for (let i = 0; i < word.length; i++) {
      if (currentX + i < grid[0].length) {
        grid[currentY][currentX + i].char = word[i];
        grid[currentY][currentX + i].type = 'ui';
      }
    }
    
    currentX += word.length + 1; // Add space after word
    
    // Add space character
    if (currentX < grid[0].length) {
      grid[currentY][currentX - 1].char = ' ';
    }
  }
}

/**
 * Render a list (ul/ol)
 */
function renderList(
  grid: AsciiGrid,
  element: HTMLElement,
  x: number,
  y: number,
  config: UIRenderConfig,
  _grid2: AsciiGrid
): { x: number; y: number } {
  let currentY = y;
  const isOrdered = element.tagName.toLowerCase() === 'ol';
  let itemNumber = 1;
  
  Array.from(element.children).forEach(child => {
    if (child instanceof HTMLElement && child.tagName.toLowerCase() === 'li') {
      // Render list item marker
      const marker = isOrdered ? `${itemNumber}. ` : '• ';
      
      for (let i = 0; i < marker.length; i++) {
        if (x + i < grid[0].length && currentY < grid.length) {
          grid[currentY][x + i].char = marker[i];
          grid[currentY][x + i].type = 'ui';
        }
      }
      
      // Render list item content
      if (child.textContent) {
        const text = child.textContent.trim();
        for (let i = 0; i < text.length; i++) {
          const posX = x + marker.length + i;
          if (posX < grid[0].length && currentY < grid.length) {
            grid[currentY][posX].char = text[i];
            grid[currentY][posX].type = 'ui';
          }
        }
      }
      
      currentY++;
      if (isOrdered) itemNumber++;
    }
  });
  
  return { x, y: currentY };
}

/**
 * Render a div container
 */
function renderDiv(
  grid: AsciiGrid,
  element: HTMLElement,
  x: number,
  y: number,
  config: UIRenderConfig,
  _grid2: AsciiGrid
): { x: number; y: number } {
  let currentY = y;
  
  // Check for special class-based rendering
  if (element.classList.contains('column')) {
    // Render a vertical column with a border
    currentY++;
  }
  
  // Process all children
  Array.from(element.children).forEach(child => {
    if (child instanceof HTMLElement) {
      const result = walkElement(child, x + 2, currentY, config, grid);
      currentY = result.y;
    }
  });
  
  return { x, y: currentY + 1 }; // Add extra space after div
}

/**
 * Update interactive elements on the grid
 */
export function updateInteractiveElements(
  grid: AsciiGrid,
  mouseX: number,
  mouseY: number,
  time: number
): void {
  const rows = grid.length;
  const cols = grid[0].length;
  
  // Character set to cycle through for hovering
  const hoverChars = ['*', '+', 'o', '#', '@', '&', '%', '$', '#', '*'];
  
  // Convert mouse position to grid coordinates
  const gridMouseX = Math.floor(mouseX);
  const gridMouseY = Math.floor(mouseY);
  
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const cell = grid[y][x];
      
      // Skip non-interactive cells
      if (cell.type !== 'interactive' || !cell.interactive) continue;
      
      // Check if mouse is hovering over this cell or adjacent cells
      // More precise hover detection with adjustable radius
      const hoverRadius = 1; // Reduced radius for more precise hovering
      const isHovered = Math.abs(x - gridMouseX) <= hoverRadius && 
                       Math.abs(y - gridMouseY) <= hoverRadius;
      
      // Update hover state
      if (isHovered !== cell.interactive.isHovered) {
        cell.interactive.isHovered = isHovered;
      }
      
      // Apply hover effect - cycle characters
      if (isHovered) {
        // Create a smoother animation cycle
        const cycleIndex = Math.floor(time * 8) % hoverChars.length;
        cell.char = hoverChars[cycleIndex];
        // Ensure intensity is at maximum when hovered
        cell.intensity = 1;
      } else {
        // Reset to base character when not hovered
        cell.char = cell.interactive.baseChar;
        // Reset intensity to normal
        cell.intensity = 0.8;
      }
    }
  }
}

/**
 * Find interactive element at a specific position
 */
export function findInteractiveElement(
  grid: AsciiGrid,
  x: number,
  y: number
): {
  element: AsciiCell;
  target?: string;
} | null {
  // Check bounds
  if (y < 0 || y >= grid.length || x < 0 || x >= grid[0].length) {
    return null;
  }
  
  const cell = grid[y][x];
  
  // Check if cell is interactive
  if (cell.type === 'interactive' && cell.interactive) {
    return {
      element: cell,
      target: cell.interactive.linkTarget
    };
  }
  
  return null;
} 