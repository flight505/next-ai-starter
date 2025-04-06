"use client";

import { aboutPageData } from '@/lib/data/about-data';
import Image from 'next/image';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';

export default function AboutPage() {
  const [mounted, setMounted] = useState(false);
  
  // Ensure hydration matching by mounting only on the client side
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    return null;
  }
  
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-end mb-4">
        <ThemeToggle />
      </div>
      
      <div className="bg-background/80 dark:bg-background/80 border border-accent p-6 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-6 text-foreground">About Me</h1>
        
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3">
            <div className="relative w-full aspect-square rounded-lg overflow-hidden border-2 border-accent">
              <Image 
                src={aboutPageData.profileImage}
                alt="Profile"
                fill
                className="object-cover"
              />
            </div>
          </div>
          
          <div className="md:w-2/3">
            <h2 className="text-2xl font-bold mb-4 text-accent">
              {aboutPageData.name}
            </h2>
            
            <p className="mb-4 text-foreground">
              {aboutPageData.bio}
            </p>
            
            <h3 className="text-xl font-bold mb-2 text-accent">Skills</h3>
            <ul className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-6">
              {aboutPageData.skills.map((skill, index) => (
                <li key={index} className="flex items-center">
                  <span className="text-accent mr-2">❯</span>
                  <span className="text-foreground">{skill}</span>
                </li>
              ))}
            </ul>
            
            <h3 className="text-xl font-bold mb-2 text-accent">Experience</h3>
            <div className="space-y-4">
              {aboutPageData.experience.map((exp, index) => (
                <div key={index} className="border-l-2 border-accent pl-4">
                  <h4 className="font-bold text-foreground">{exp.position}</h4>
                  <p className="text-accent-muted">{exp.company} | {exp.period}</p>
                  <p className="text-foreground">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 