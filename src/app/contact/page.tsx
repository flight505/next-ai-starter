"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import GameOfLifeAnimation from '@/components/GameOfLifeAnimation';

export default function ContactPage() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <main className="relative w-full min-h-screen flex items-center justify-center px-4 py-16">
      <div className="absolute top-0 left-0 right-0 bottom-0 z-0">
        <GameOfLifeAnimation />
      </div>
      
      <div className="relative z-10 w-full max-w-2xl mx-auto p-6 bg-background/80 dark:bg-background/80 backdrop-blur-sm rounded border border-accent">
        <h1 className="text-2xl md:text-3xl font-mono mb-6 text-foreground">Contact Me</h1>
        
        <div className="grid gap-6">
          <div className="space-y-2">
            <h2 className="text-xl font-mono text-accent">Get In Touch</h2>
            <p className="font-mono">
              Feel free to reach out for collaboration opportunities, project inquiries,
              or just to say hello!
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-2">
              <span className="font-mono text-accent">Email:</span>
              <a href="mailto:your.email@example.com" className="font-mono text-foreground hover:text-accent">
                your.email@example.com
              </a>
            </div>
            
            <div className="flex items-start space-x-2">
              <span className="font-mono text-accent">GitHub:</span>
              <a 
                href="https://github.com/yourusername" 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-mono text-foreground hover:text-accent"
              >
                github.com/yourusername
              </a>
            </div>
            
            <div className="flex items-start space-x-2">
              <span className="font-mono text-accent">LinkedIn:</span>
              <a 
                href="https://linkedin.com/in/yourusername" 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-mono text-foreground hover:text-accent"
              >
                linkedin.com/in/yourusername
              </a>
            </div>
          </div>
          
          <div className="mt-6">
            <Link href="/" className="font-mono text-accent hover:underline">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
} 