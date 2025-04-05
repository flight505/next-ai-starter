"use client";

import React from 'react';
import AsciiBackground from '@/components/AsciiBackground';
import NavBar from '@/components/NavBar';

export default function AboutPage() {
  return (
    <div className="relative min-h-screen">
      <AsciiBackground mode="sand" />
      <NavBar />
      
      <main className="container mx-auto p-4 pt-20">
        <div className="bg-black/80 p-6 border border-green-500 max-w-3xl mx-auto">
          <h1 className="text-3xl font-mono text-green-500 mb-6">ABOUT ME</h1>
          
          <section className="mb-8">
            <h2 className="text-xl font-mono text-green-400 mb-4">BACKGROUND</h2>
            <p className="font-mono mb-4">
              I am a passionate developer with experience in building web applications
              and interactive digital experiences. My journey in programming started
              with a fascination for how things work under the hood, which has evolved
              into creating elegant solutions for complex problems.
            </p>
            <p className="font-mono">
              With a background in computer science and a keen interest in creative coding,
              I bring both technical expertise and artistic sensibility to my projects.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-mono text-green-400 mb-4">SKILLS</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-mono text-green-300 mb-2">LANGUAGES</h3>
                <ul className="list-disc list-inside font-mono">
                  <li>JavaScript/TypeScript</li>
                  <li>HTML/CSS</li>
                  <li>Python</li>
                  <li>C#</li>
                </ul>
              </div>
              <div>
                <h3 className="font-mono text-green-300 mb-2">FRAMEWORKS</h3>
                <ul className="list-disc list-inside font-mono">
                  <li>React</li>
                  <li>Next.js</li>
                  <li>Node.js</li>
                  <li>TailwindCSS</li>
                </ul>
              </div>
            </div>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-mono text-green-400 mb-4">INTERESTS</h2>
            <p className="font-mono">
              When I'm not coding, you can find me exploring new technologies, 
              contributing to open-source projects, or experimenting with creative
              coding and generative art. I believe in continuous learning and sharing
              knowledge with the community.
            </p>
          </section>
          
          <div className="mt-8 text-center font-mono text-green-300">
            <p>Click anywhere on the screen to drop sand letters and watch them fall!</p>
          </div>
        </div>
      </main>
    </div>
  );
} 