"use client";

import React from 'react';
import AsciiBackground from '@/components/AsciiBackground';
import NavBar from '@/components/NavBar';

export default function ProjectsPage() {
  return (
    <div className="relative min-h-screen">
      <AsciiBackground userWord="PROJECTS" />
      <NavBar />
      
      <main className="container mx-auto p-4 pt-20">
        <div className="bg-black/80 p-6 border border-green-500 max-w-3xl mx-auto">
          <h1 className="text-3xl font-mono text-green-500 mb-6">PROJECTS</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Project 1 */}
            <div className="border border-green-500 p-4 hover:bg-green-900/20 transition-colors">
              <h2 className="text-xl font-mono text-green-400 mb-2">ASCII PORTFOLIO</h2>
              <p className="font-mono text-sm mb-4">
                An interactive portfolio website featuring ASCII art animations and physics simulations.
              </p>
              <div className="flex justify-between items-center">
                <span className="font-mono text-xs text-green-300">Next.js / TypeScript</span>
                <a href="#" className="font-mono text-green-400 hover:text-green-300">[DETAILS]</a>
              </div>
            </div>
            
            {/* Project 2 */}
            <div className="border border-green-500 p-4 hover:bg-green-900/20 transition-colors">
              <h2 className="text-xl font-mono text-green-400 mb-2">SAND PHYSICS</h2>
              <p className="font-mono text-sm mb-4">
                A complex cellular automaton simulating sand-like particles with interactive elements.
              </p>
              <div className="flex justify-between items-center">
                <span className="font-mono text-xs text-green-300">JavaScript / Canvas</span>
                <a href="#" className="font-mono text-green-400 hover:text-green-300">[DETAILS]</a>
              </div>
            </div>
            
            {/* Project 3 */}
            <div className="border border-green-500 p-4 hover:bg-green-900/20 transition-colors">
              <h2 className="text-xl font-mono text-green-400 mb-2">GAME OF LIFE</h2>
              <p className="font-mono text-sm mb-4">
                An implementation of Conway's Game of Life with custom visualization options.
              </p>
              <div className="flex justify-between items-center">
                <span className="font-mono text-xs text-green-300">React / TypeScript</span>
                <a href="#" className="font-mono text-green-400 hover:text-green-300">[DETAILS]</a>
              </div>
            </div>
            
            {/* Project 4 */}
            <div className="border border-green-500 p-4 hover:bg-green-900/20 transition-colors">
              <h2 className="text-xl font-mono text-green-400 mb-2">API DASHBOARD</h2>
              <p className="font-mono text-sm mb-4">
                A real-time data visualization dashboard for monitoring API performance.
              </p>
              <div className="flex justify-between items-center">
                <span className="font-mono text-xs text-green-300">React / Node.js</span>
                <a href="#" className="font-mono text-green-400 hover:text-green-300">[DETAILS]</a>
              </div>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <p className="font-mono text-green-300 mb-4">MORE PROJECTS COMING SOON</p>
            <a 
              href="https://github.com/yourusername" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block border border-green-500 px-4 py-2 font-mono text-green-400 hover:bg-green-500 hover:text-black transition-colors"
            >
              VIEW GITHUB PROFILE
            </a>
          </div>
        </div>
      </main>
    </div>
  );
} 