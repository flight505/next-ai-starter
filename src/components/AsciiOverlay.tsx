"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

// Shuffle array utility function
const shuffle = (array: string[]) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const AsciiOverlay = () => {
  const [emailSubject, setEmailSubject] = useState('Hello');
  const [subjects, setSubjects] = useState([
    'Hello',
    'Hi there',
    'Project inquiry',
    'Just saying hello',
    'Let\'s collaborate',
    'Interesting project',
    'Question about your work',
    'Potential opportunity'
  ]);

  useEffect(() => {
    // Shuffle subjects once on component mount
    setSubjects(shuffle(subjects));
    
    let currentIndex = 0;
    
    const swapSubject = () => {
      setEmailSubject(subjects[currentIndex]);
      currentIndex = (currentIndex + 1) % subjects.length;
    };
    
    // Set initial subject
    swapSubject();
    
    // Set interval for changing subject
    const intervalId = setInterval(swapSubject, 9000);
    
    // Cleanup on unmount
    return () => clearInterval(intervalId);
  }, [subjects]);

  return (
    <div className="overlay font-mono text-green-400 fixed top-0 left-0 w-64 h-full overflow-auto border-r border-green-800 p-4">
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-green-300">Navigation</h2>
        <ul className="space-y-2">
          <li><Link href="/">[Home]</Link></li>
          <li><Link href="/about">[About]</Link></li>
          <li><Link href="/blog">[Blog]</Link></li>
          <li><Link href="/contact">[Contact]</Link></li>
        </ul>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-green-300">External</h2>
        <ul className="space-y-2">
          <li><a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer">[GitHub]</a></li>
          <li><a href="https://linkedin.com/in/yourusername" target="_blank" rel="noopener noreferrer">[LinkedIn]</a></li>
          <li><a href="https://twitter.com/yourusername" target="_blank" rel="noopener noreferrer">[Twitter]</a></li>
        </ul>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-green-300">About Me</h2>
        <p className="mb-4">
          I'm a developer passionate about creating unique digital experiences.
          My expertise spans front-end development, creative coding,
          and interactive design. Welcome to my ASCII-themed portfolio!
        </p>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-green-300">Contact</h2>
        <p className="mb-2">
          Get in touch:
        </p>
        <p>
          <a 
            href={`mailto:your.email@example.com?subject=${encodeURIComponent(emailSubject)}`}
            className="email-link"
          >
            [your.email@example.com]
          </a>
        </p>
        <p className="text-sm mt-1 text-green-600">
          Subject: {emailSubject}
        </p>
      </div>
    </div>
  );
};

export default AsciiOverlay; 