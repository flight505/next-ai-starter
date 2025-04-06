"use client";

import React from 'react';
import Link from "next/link";
import AsciiBackground from '@/components/AsciiBackground';
import NavBar from '@/components/NavBar';

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <AsciiBackground userWord="ASCII" />
      <NavBar />
      
      <main className="container mx-auto p-4 pt-20">
        <div className="bg-background/80 dark:bg-background/80 p-6 border border-accent max-w-3xl mx-auto">
          <h1 className="text-3xl font-mono text-foreground mb-6">WELCOME TO MY ASCII PORTFOLIO</h1>
          
          <section className="mb-12">
            <h2 className="text-xl font-mono text-accent mb-4">ABOUT ME</h2>
            <p className="font-mono mb-4">
              I'm a developer who loves ASCII art and retro aesthetics.
              This site showcases my work and experiments with ASCII animations.
            </p>
            <p>
              <Link href="/about" className="font-mono text-accent hover:text-accent-hover hover:bg-accent/10">
                LEARN MORE ABOUT ME →
              </Link>
            </p>
          </section>
          
          <section className="mb-12">
            <h2 className="text-xl font-mono text-accent mb-4">FEATURED PROJECTS</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-accent p-4 hover:bg-accent/20 transition-colors">
                <h3 className="font-mono text-accent mb-2">ASCII ANIMATIONS</h3>
                <p className="font-mono text-sm mb-2">Creative coding experiments with text-based graphics.</p>
                <p className="font-mono text-xs text-accent-foreground">[ JavaScript, Canvas, React ]</p>
              </div>
              <div className="border border-accent p-4 hover:bg-accent/20 transition-colors">
                <h3 className="font-mono text-accent mb-2">INTERACTIVE ART</h3>
                <p className="font-mono text-sm mb-2">User-responsive digital art installations.</p>
                <p className="font-mono text-xs text-accent-foreground">[ TypeScript, Three.js, WebGL ]</p>
              </div>
            </div>
            
            <div className="mt-6 text-center">
              <Link 
                href="/projects" 
                className="inline-block border border-accent px-4 py-2 font-mono text-accent hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                VIEW ALL PROJECTS
              </Link>
            </div>
          </section>
          
          <section>
            <h2 className="text-xl font-mono text-accent mb-4">INTERACTIVE DEMOS</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link href="/sand">
                <div className="border border-accent p-4 hover:bg-accent/20 transition-colors h-full">
                  <h3 className="font-mono text-accent mb-2">SAND GAME</h3>
                  <p className="font-mono text-sm">
                    Click and interact with a physics-based ASCII sand simulation.
                  </p>
                </div>
              </Link>
              <Link href="/contact">
                <div className="border border-accent p-4 hover:bg-accent/20 transition-colors h-full">
                  <h3 className="font-mono text-accent mb-2">GAME OF LIFE</h3>
                  <p className="font-mono text-sm">
                    See Conway's Game of Life implemented with ASCII characters.
                  </p>
                </div>
              </Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
