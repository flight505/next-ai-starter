'use client';

import { useEffect, useRef, useState } from 'react';
import { useTheme } from 'next-themes';
import { createEngine } from '@/lib/asciiEngine/engine';
import { generateWave, generateCursorHeat, blendGenerators } from '@/lib/asciiEngine/generators';
import { centerWord, getRandomWord, startWordTransition, updateWordTransition, TransitionType } from '@/lib/asciiEngine/textRenderer';
import { renderUIFromDOM, updateInteractiveElements } from '@/lib/asciiEngine/uiRenderer';

interface AsciiEngineDemoProps {
  renderUI?: boolean;
  wordCategories?: ('greetings' | 'tech' | 'creative' | 'phrases' | 'misc')[];
  transitionType?: TransitionType;
}

export default function AsciiEngineDemo({
  renderUI = false,
  wordCategories = ['tech', 'creative'],
  transitionType = 'dissolve'
}: AsciiEngineDemoProps) {
  const preRef = useRef<HTMLPreElement>(null);
  const uiContainerRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const [message, setMessage] = useState<string>('');
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!preRef.current) return;
    
    // Initialize the engine
    const engine = createEngine({
      element: preRef.current,
      fps: 30,
      theme: (resolvedTheme as 'dark' | 'light') || 'dark',
      mouseEnabled: true
    });
    
    // State for word transitions
    let activeTransition: ReturnType<typeof startWordTransition> | null = null;
    let currentWord = getRandomWord(wordCategories);
    let nextWordTime = performance.now() + 5000;
    
    // Custom update function
    engine.update = (deltaTime) => {
      // Update time
      engine.time += deltaTime;
      
      // Generate background wave effect
      generateWave(engine.grid, engine.time, 1.0, 0.05);
      
      // Add cursor heat effect
      if (engine.mouseX >= 0 && engine.mouseY >= 0) {
        generateCursorHeat(engine.grid, engine.mouseX, engine.mouseY, 10, 0.5);
      }
      
      // Handle word transitions
      const now = performance.now();
      if (!activeTransition && now > nextWordTime) {
        // Time for a new word
        const newWord = getRandomWord(wordCategories);
        const y = Math.floor(engine.rows / 2);
        
        // Start the transition
        activeTransition = startWordTransition(
          engine.grid,
          currentWord,
          newWord,
          transitionType,
          Math.floor((engine.cols - newWord.length) / 2),
          y
        );
        
        currentWord = newWord;
        setMessage(`Transitioning to: ${newWord}`);
      }
      
      // Update transition if active
      if (activeTransition) {
        const isComplete = updateWordTransition(
          engine.grid,
          activeTransition,
          deltaTime * 0.5 // Adjust speed
        );
        
        if (isComplete) {
          activeTransition = null;
          nextWordTime = now + 5000; // Schedule next transition
        }
      } else {
        // While not transitioning, display current word
        centerWord(
          engine.grid,
          currentWord,
          Math.floor(engine.rows / 2),
          'background'
        );
      }
      
      // If UI mode is enabled, render and update UI
      if (renderUI && uiContainerRef.current) {
        renderUIFromDOM(engine.grid, uiContainerRef.current, {
          startX: 5,
          startY: 5,
          width: 25,
          interactive: true
        });
        
        updateInteractiveElements(engine.grid, engine.mouseX, engine.mouseY, engine.time);
      }
    };
    
    // Start the engine
    engine.start();
    
    // Cleanup
    return () => {
      engine.stop();
    };
  }, [resolvedTheme, renderUI, wordCategories, transitionType]);
  
  return (
    <div className="ascii-engine-demo">
      <pre
        ref={preRef}
        className="ascii-canvas"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          margin: 0,
          padding: 0,
          overflow: 'hidden',
          pointerEvents: 'none',
          fontFamily: 'monospace',
          whiteSpace: 'pre',
          zIndex: 1
        }}
      ></pre>
      
      {renderUI && (
        <div 
          ref={uiContainerRef} 
          className="hidden"
          style={{ display: 'none' }}
        >
          <h1>ASCII Engine Demo</h1>
          <p>This is a demonstration of the ASCII engine.</p>
          <div className="column">
            <h2>Features</h2>
            <ul>
              <li>Procedural generation</li>
              <li>Word transitions</li>
              <li>Interactive UI</li>
              <li>Mouse effects</li>
            </ul>
          </div>
          <div className="column">
            <h2>Links</h2>
            <ul>
              <li><a href="/about">About</a></li>
              <li><a href="/contact">Contact</a></li>
              <li><a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a></li>
            </ul>
          </div>
        </div>
      )}
      
      <div className="overlay" style={{ position: 'relative', zIndex: 2 }}>
        {message && (
          <div className="transition-message" style={{ opacity: 0.7 }}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
} 