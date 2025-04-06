'use client';

import { useState } from 'react';
import Link from 'next/link';
import AsciiBackground from '@/components/AsciiBackground';

export default function BackgroundDemo() {
  const [mode, setMode] = useState<'default' | 'gol'>('default');
  const [customWord, setCustomWord] = useState('');
  const [activeWord, setActiveWord] = useState('');
  
  const applyCustomWord = () => {
    setActiveWord(customWord.toUpperCase());
  };
  
  const clearCustomWord = () => {
    setCustomWord('');
    setActiveWord('');
  };
  
  return (
    <main className="min-h-screen relative">
      <AsciiBackground 
        mode={mode} 
        userWord={activeWord || undefined}
      />
      
      <div className="control-panel" style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        zIndex: 10,
        background: 'rgba(0,0,0,0.7)',
        padding: '10px',
        borderRadius: '5px',
        color: 'white'
      }}>
        <h3 className="text-accent text-lg mb-4">Background Controls</h3>
        
        <div className="mb-4">
          <label className="block mb-1">Mode:</label>
          <div className="space-x-2">
            <button 
              onClick={() => setMode('default')}
              className={`px-2 py-1 border ${mode === 'default' ? 'border-accent bg-accent/30' : 'border-gray-600'}`}
            >
              Default
            </button>
            <button 
              onClick={() => setMode('gol')}
              className={`px-2 py-1 border ${mode === 'gol' ? 'border-accent bg-accent/30' : 'border-gray-600'}`}
            >
              Game of Life
            </button>
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block mb-1">Custom Word:</label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={customWord}
              onChange={(e) => setCustomWord(e.target.value.toUpperCase())}
              placeholder="Enter word..."
              className="bg-background text-foreground p-1 flex-grow"
              maxLength={20}
            />
            <button 
              onClick={applyCustomWord}
              className="px-2 py-1 bg-accent text-background"
              disabled={!customWord}
            >
              Apply
            </button>
            <button 
              onClick={clearCustomWord}
              className="px-2 py-1 bg-gray-600 text-background"
              disabled={!activeWord}
            >
              Clear
            </button>
          </div>
          {activeWord && (
            <p className="text-sm mt-1">Active word: {activeWord}</p>
          )}
        </div>
        
        <div className="mt-4">
          <p className="text-sm mb-2">Mode Instructions:</p>
          {mode === 'default' && (
            <p className="text-xs">Click anywhere to create a ripple effect.</p>
          )}
          {mode === 'gol' && (
            <p className="text-xs">Watch Conway's Game of Life evolve with ASCII characters.</p>
          )}
        </div>
        
        <div className="mt-4">
          <Link 
            href="/"
            className="inline-block bg-accent text-background px-3 py-1 rounded hover:bg-accent-hover"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
} 