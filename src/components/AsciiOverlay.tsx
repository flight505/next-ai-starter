"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';

type AsciiOverlayProps = {
  children?: React.ReactNode;
};

export default function AsciiOverlay({ children }: AsciiOverlayProps) {
  const [emailSubject, setEmailSubject] = useState('Hello');
  const subjects = ['Hi', 'Question', 'Project Inquiry', 'Just saying hello', 'Collaboration', 'Job Opportunity'];
  
  // Function to shuffle an array
  const shuffle = (array: string[]) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };
  
  useEffect(() => {
    const shuffledSubjects = shuffle(subjects);
    let currentIndex = 0;
    
    const swapSubject = () => {
      setEmailSubject(shuffledSubjects[currentIndex]);
      currentIndex = (currentIndex + 1) % shuffledSubjects.length;
    };
    
    // Initial call
    swapSubject();
    
    // Set interval for changing subjects
    const intervalId = setInterval(swapSubject, 9000);
    
    // Cleanup
    return () => clearInterval(intervalId);
  }, []);
  
  return (
    <div className="overlay">
      <h1 className="text-2xl font-mono mb-6">ASCII PORTFOLIO</h1>
      
      <p className="text-base font-mono mb-8">
        Welcome to my ASCII-themed portfolio website. I am a developer passionate about
        clean code, creative interfaces, and the beauty of simplicity.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-mono mb-4">NAVIGATION</h2>
          <ul className="space-y-2">
            <li><Link href="/">[HOME]</Link></li>
            <li><Link href="/about">[ABOUT]</Link></li>
            <li><Link href="/projects">[PROJECTS]</Link></li>
            <li><Link href="/sand">[SAND]</Link></li>
            <li><Link href="/contact">[CONTACT]</Link></li>
          </ul>
        </div>
        
        <div>
          <h2 className="text-xl font-mono mb-4">EXTERNAL</h2>
          <ul className="space-y-2">
            <li>
              <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer">
                [GITHUB]
              </a>
            </li>
            <li>
              <a href="https://linkedin.com/in/yourusername" target="_blank" rel="noopener noreferrer">
                [LINKEDIN]
              </a>
            </li>
            <li>
              <a 
                href={`mailto:your.email@example.com?subject=${encodeURIComponent(emailSubject)}`}
                className="email-link"
              >
                [EMAIL]
              </a>
            </li>
          </ul>
        </div>
      </div>
      
      {children}
    </div>
  );
} 