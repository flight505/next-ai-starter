/**
 * ASCII Engine - UI Rendering System
 * Renders HTML elements into the ASCII grid and handles interactivity
 */

import { AsciiGrid, AsciiCell } from './engine';

/**
 * Configuration for UI rendering
 */
export interface UIRenderConfig {
  startX: number;
  startY: number;
  width?: number;      // Column width (if using multi-column layout)
  rightAlign?: boolean; // Align text to right side
  interactive?: boolean; // Whether elements should have hover effects
}

/**
 * Maps HTML element types to handler functions
 */
const elementHandlers: Record<string, (
  element: HTMLElement,
  grid: AsciiGrid,
  x: number,
  y: number,
  config: UIRenderConfig
) => { x: number; y: number }> = {
  // Add handlers for specific element types
};

/**
 * Render a DOM element tree into the ASCII grid
 */
export function renderUIFromDOM(
  grid: AsciiGrid,
  htmlElement: HTMLElement,
  config: UIRenderConfig
): void {
  walkElement(htmlElement, config.startX, config.startY, config);
}

/**
 * Process an element and its children, rendering to the grid
 */
function walkElement(
  element: HTMLElement,
  x: number, 
  y: number,
  config: UIRenderConfig
): { x: number; y: number } {
  // Skip invisible elements
  if (element.style.display === 'none' || element.style.visibility === 'hidden') {
    return { x, y };
  }
  
  // Get element tag name in lowercase
  const tagName = element.tagName.toLowerCase();
  
  // Special handling for different element types
  switch (tagName) {
    case 'h1':
    case 'h2':
    case 'h3':
    case 'h4':
    case 'h5':
    case 'h6':
      return renderHeading(element, grid, x, y, config);
      
    case 'p':
      return renderParagraph(element, grid, x, y, config);
      
    case 'a':
      return renderLink(element, grid, x, y, config);
      
    case 'ul':
    case 'ol':
      return renderList(element, grid, x, y, config);
      
    case 'div':
      return renderDiv(element, grid, x, y, config);
      
    default:
      // Process children for unknown elements
      return processChildren(element, x, y, config);
  }
}

/**
 * Process all children of an element
 */
function processChildren(
  element: HTMLElement,
  x: number,
  y: number,
  config: UIRenderConfig
): { x: number; y: number } {
  let currentX = x;
  let currentY = y;
  
  for (const child of Array.from(element.children)) {
    const result = walkElement(child as HTMLElement, currentX, currentY, config);
    currentX = result.x;
    currentY = result.y;
  }
  
  // Process text nodes directly in this element (if any)
  if (element.childNodes.length > 0 && 
      element.childNodes[0].nodeType === Node.TEXT_NODE && 
      element.childNodes[0].textContent) {
    const text = element.childNodes[0].textContent.trim();
    if (text) {
      renderText(grid, text, currentX, currentY, 'ui');
      currentX += text.length;
    }
  }
  
  return { x: currentX, y: currentY };
}

/**
 * Render a heading element
 */
function renderHeading(
  element: HTMLElement,
  grid: AsciiGrid,
  x: number,
  y: number,
  config: UIRenderConfig
): { x: number; y: number } {
  const text = element.textContent || '';
  if (!text.trim()) return { x, y };
  
  // Render the heading text
  renderText(grid, text, x, y, 'ui');
  
  // Move to next line and add spacing
  const headingLevel = parseInt(element.tagName.charAt(1));
  const spacing = Math.max(1, 3 - headingLevel);  // More spacing for h1 than h6
  
  return { x, y: y + 1 + spacing };
}

/**
 * Render a paragraph element
 */
function renderParagraph(
  element: HTMLElement,
  grid: AsciiGrid,
  x: number,
  y: number,
  config: UIRenderConfig
): { x: number; y: number } {
  const text = element.textContent || '';
  if (!text.trim()) return { x, y };
  
  // Simple word wrapping based on config width
  const maxWidth = config.width || (grid[0] ? grid[0].length - x : 80);
  const lines = wordWrap(text, maxWidth);
  
  // Render each line
  for (let i = 0; i < lines.length; i++) {
    renderText(grid, lines[i], x, y + i, 'ui');
  }
  
  // Move to after the paragraph with spacing
  return { x, y: y + lines.length + 1 };
}

/**
 * Render a link element
 */
function renderLink(
  element: HTMLElement,
  grid: AsciiGrid,
  x: number,
  y: number,
  config: UIRenderConfig
): { x: number; y: number } {
  const text = element.textContent || '';
  if (!text.trim()) return { x, y };
  
  const href = (element as HTMLAnchorElement).getAttribute('href') || '';
  
  // Make links interactive or not based on config
  const cellType = config.interactive ? 'interactive' : 'ui';
  
  // Render the link text
  for (let i = 0; i < text.length; i++) {
    if (y >= 0 && y < grid.length && x + i >= 0 && x + i < grid[0].length) {
      grid[y][x + i].char = text[i];
      grid[y][x + i].type = cellType;
      
      // For interactive links, store metadata
      if (cellType === 'interactive') {
        if (!grid[y][x + i].interactive) {
          grid[y][x + i].interactive = {
            baseChar: text[i],
            isHovered: false,
            linkTarget: href
          };
        } else {
          grid[y][x + i].interactive.baseChar = text[i];
          grid[y][x + i].interactive.linkTarget = href;
        }
      }
    }
  }
  
  // Move past this link
  return { x: x + text.length, y };
}

/**
 * Render a list element
 */
function renderList(
  element: HTMLElement,
  grid: AsciiGrid,
  x: number,
  y: number,
  config: UIRenderConfig
): { x: number; y: number } {
  let currentY = y;
  const isOrdered = element.tagName.toLowerCase() === 'ol';
  let itemCount = 0;
  
  // Process each list item
  for (const child of Array.from(element.children)) {
    if (child.tagName.toLowerCase() === 'li') {
      itemCount++;
      
      // Create bullet or number
      const prefix = isOrdered ? `${itemCount}. ` : '- ';
      renderText(grid, prefix, x, currentY, 'ui');
      
      // Process the list item content with indentation
      const itemConfig = { ...config, startX: x + prefix.length };
      const result = walkElement(child as HTMLElement, x + prefix.length, currentY, itemConfig);
      
      // Move to next line
      currentY = result.y + 1;
    }
  }
  
  return { x, y: currentY };
}

/**
 * Render a div element (for layout)
 */
function renderDiv(
  element: HTMLElement,
  grid: AsciiGrid,
  x: number,
  y: number,
  config: UIRenderConfig
): { x: number; y: number } {
  // Check if this div represents a column or section break
  const isColumn = element.classList.contains('column') || 
                  element.classList.contains('col') ||
                  element.hasAttribute('data-ascii-column');
  
  if (isColumn && config.width) {
    // Start a new column
    return processChildren(element, x + config.width, y, config);
  } else {
    // Process as regular container
    return processChildren(element, x, y, config);
  }
}

/**
 * Helper: Word wrap text to fit width
 */
function wordWrap(text: string, maxWidth: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';
  
  for (const word of words) {
    if (currentLine.length + word.length + 1 <= maxWidth) {
      currentLine += (currentLine ? ' ' : '') + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  
  if (currentLine) {
    lines.push(currentLine);
  }
  
  return lines;
}

/**
 * Helper: Render text directly to grid
 */
function renderText(
  grid: AsciiGrid,
  text: string,
  x: number,
  y: number,
  type: 'ui' | 'background' | 'interactive'
): void {
  // Skip if y is out of bounds
  if (y < 0 || y >= grid.length) return;
  
  for (let i = 0; i < text.length; i++) {
    const posX = x + i;
    
    // Skip if x is out of bounds
    if (posX < 0 || posX >= grid[0].length) continue;
    
    grid[y][posX].char = text[i];
    grid[y][posX].type = type;
    
    // For interactive elements, store the original character
    if (type === 'interactive' && !grid[y][posX].interactive) {
      grid[y][posX].interactive = {
        baseChar: text[i],
        isHovered: false
      };
    }
  }
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
  const hoverChars = ['+', '*', '#', '@', '&', '%', '$', '#', '*', '+'];
  
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const cell = grid[y][x];
      
      // Skip non-interactive cells
      if (cell.type !== 'interactive' || !cell.interactive) continue;
      
      // Check if mouse is hovering over this cell or adjacent cells
      const isHovered = Math.abs(x - mouseX) <= 2 && Math.abs(y - mouseY) <= 1;
      
      // Update hover state
      if (isHovered !== cell.interactive.isHovered) {
        cell.interactive.isHovered = isHovered;
      }
      
      // Apply hover effect - cycle characters
      if (isHovered) {
        const cycleIndex = Math.floor(time * 10) % hoverChars.length;
        cell.char = hoverChars[cycleIndex];
      } else {
        // Reset to base character when not hovered
        cell.char = cell.interactive.baseChar;
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