"use client";

import { useState, FormEvent } from 'react';
import { useTheme } from 'next-themes';
import GameOfLifeAnimation from '@/components/GameOfLifeAnimation';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import NavBar from '@/components/NavBar';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { resolvedTheme } = useTheme();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // In a real application, you would send the form data to a server here
    console.log({ name, email, message });
    // Reset form after "submission"
    setTimeout(() => {
      setName('');
      setEmail('');
      setMessage('');
      setSubmitted(false);
    }, 3000);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-8 relative">
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>
      
      <div className="w-full max-w-4xl bg-background/80 dark:bg-background/80 p-6 rounded border border-accent z-10 mt-16">
        <h1 className="text-4xl font-mono mb-8 text-foreground text-center">Contact Me</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="w-full aspect-square border border-accent overflow-hidden">
            <GameOfLifeAnimation />
          </div>
          
          <div className="flex flex-col space-y-4">
            {submitted ? (
              <div className="h-full flex items-center justify-center">
                <p className="text-xl text-accent font-mono">Thank you for your message!</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                <div>
                  <label htmlFor="name" className="block text-foreground font-mono mb-1">Name</label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full p-2 bg-background border border-accent text-foreground font-mono"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-foreground font-mono mb-1">Email</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full p-2 bg-background border border-accent text-foreground font-mono"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-foreground font-mono mb-1">Message</label>
                  <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    rows={6}
                    className="w-full p-2 bg-background border border-accent text-foreground font-mono resize-none"
                  />
                </div>
                
                <button
                  type="submit"
                  className="bg-accent hover:bg-accent/80 text-background font-mono py-2 px-4 mt-4"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
} 