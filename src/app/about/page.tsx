"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import SandGameAnimation from '@/components/SandGameAnimation';

export default function AboutPage() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <main className="relative w-full min-h-screen flex items-center justify-center px-4 py-16">
      <div className="absolute top-0 left-0 right-0 bottom-0 z-0">
        <SandGameAnimation />
      </div>
      
      <div className="relative z-10 w-full max-w-2xl mx-auto p-6 bg-background/80 dark:bg-background/80 backdrop-blur-sm rounded border border-accent">
        <h1 className="text-2xl md:text-3xl font-mono mb-6 text-foreground">About Me</h1>
        
        <div className="grid gap-6">
          <div className="space-y-2">
            <h2 className="text-xl font-mono text-accent">Who I Am</h2>
            <p className="font-mono">
              I'm a developer passionate about creating unique digital experiences that blend 
              creativity with technology. With a background in both design and programming, 
              I enjoy building interactive projects that push the boundaries of what's possible on the web.
            </p>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-xl font-mono text-accent">Skills & Technologies</h2>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <p className="font-mono text-foreground">• JavaScript/TypeScript</p>
                <p className="font-mono text-foreground">• React & Next.js</p>
                <p className="font-mono text-foreground">• Node.js</p>
                <p className="font-mono text-foreground">• HTML/CSS/Tailwind</p>
              </div>
              <div className="space-y-1">
                <p className="font-mono text-foreground">• Creative Coding</p>
                <p className="font-mono text-foreground">• UI/UX Design</p>
                <p className="font-mono text-foreground">• Responsive Design</p>
                <p className="font-mono text-foreground">• WebGL/Three.js</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-xl font-mono text-accent">Experience</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-mono text-foreground font-bold">Senior Frontend Developer</h3>
                <p className="font-mono text-accent-muted">Creative Tech Agency • 2020-Present</p>
                <p className="font-mono text-foreground mt-1">
                  Lead development of interactive web experiences for clients across various industries.
                </p>
              </div>
              
              <div>
                <h3 className="font-mono text-foreground font-bold">Web Developer</h3>
                <p className="font-mono text-accent-muted">Digital Studio • 2017-2020</p>
                <p className="font-mono text-foreground mt-1">
                  Built responsive websites and web applications with focus on performance and accessibility.
                </p>
              </div>
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