"use client";

import React, { useState } from 'react';
import AsciiBackground from '@/components/AsciiBackground';
import NavBar from '@/components/NavBar';

export default function SandPage() {
  const [userWord, setUserWord] = useState('SAND');
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue && inputValue.length <= 10) {
      setUserWord(inputValue.toUpperCase());
      setInputValue('');
    }
  };

  return (
    <div className="relative min-h-screen">
      <AsciiBackground mode="sand" userWord={userWord} />
      <NavBar />
      
      <main className="container mx-auto p-4 pt-20">
        <div className="bg-background/80 dark:bg-background/80 p-6 border border-accent max-w-3xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-mono text-foreground mb-6">SAND GAME</h1>
          
          <p className="font-mono mb-6">
            This is a custom ASCII sand simulation. Click anywhere on the screen to drop letters
            that will interact with each other like falling sand. The letters come from the word
            displayed below.
          </p>
          
          <div className="mb-8 p-4 border border-accent bg-background/50 dark:bg-background/50">
            <h2 className="text-xl font-mono text-accent mb-4">CURRENT WORD: {userWord}</h2>
            
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter new word (max 10 chars)"
                maxLength={10}
                className="bg-background border border-accent text-foreground font-mono p-2 flex-grow focus:outline-none focus:border-accent-hover"
              />
              <button
                type="submit"
                className="bg-accent text-accent-foreground font-mono px-4 py-2 hover:bg-accent-hover focus:outline-none"
              >
                SET WORD
              </button>
            </form>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-accent p-4">
              <h3 className="font-mono text-accent mb-2">HOW IT WORKS</h3>
              <p className="font-mono text-sm text-foreground">
                This simulation uses a simple cellular automaton model. Each letter falls downward 
                if the space below is empty. If blocked, it tries to slide diagonally. The 
                algorithm runs on each frame update, creating a realistic sand-like behavior.
              </p>
            </div>
            
            <div className="border border-accent p-4">
              <h3 className="font-mono text-accent mb-2">TIPS</h3>
              <ul className="font-mono text-sm text-foreground list-disc list-inside">
                <li>Click near the top for more falling distance</li>
                <li>Create mountains and watch avalanches form</li>
                <li>Try creating walls with one letter, then pour another</li>
                <li>Experiment with different word lengths</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 