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
        <div className="bg-black/80 p-6 border border-green-500 max-w-3xl mx-auto">
          <h1 className="text-3xl font-mono text-green-500 mb-6">SAND GAME</h1>
          
          <p className="font-mono mb-6">
            This is a custom ASCII sand simulation. Click anywhere on the screen to drop letters
            that will interact with each other like falling sand. The letters come from the word
            displayed below.
          </p>
          
          <div className="mb-8 p-4 border border-green-500 bg-black/50">
            <h2 className="text-xl font-mono text-green-400 mb-4">CURRENT WORD: {userWord}</h2>
            
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter new word (max 10 chars)"
                maxLength={10}
                className="bg-black border border-green-500 text-green-500 font-mono p-2 flex-grow focus:outline-none focus:border-green-400"
              />
              <button
                type="submit"
                className="bg-green-500 text-black font-mono px-4 py-2 hover:bg-green-400 focus:outline-none"
              >
                SET WORD
              </button>
            </form>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-green-500 p-4">
              <h3 className="font-mono text-green-400 mb-2">HOW IT WORKS</h3>
              <p className="font-mono text-sm">
                This simulation uses a simple cellular automaton model. Each letter falls downward 
                if the space below is empty. If blocked, it tries to slide diagonally. The 
                algorithm runs on each frame update, creating a realistic sand-like behavior.
              </p>
            </div>
            
            <div className="border border-green-500 p-4">
              <h3 className="font-mono text-green-400 mb-2">TIPS</h3>
              <ul className="font-mono text-sm list-disc list-inside">
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