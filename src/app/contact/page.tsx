"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AsciiBackground from '@/components/AsciiBackground';
import { toast } from 'react-toastify';

export default function ContactPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Success message
      toast.success('Message sent successfully!');
      
      // Clear form
      setFormData({
        name: '',
        email: '',
        message: ''
      });
      
      // Redirect after short delay
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center p-4">
      <AsciiBackground mode="gol" />
      
      <div className="z-10 bg-black/80 p-6 rounded border border-green-500 w-full max-w-md">
        <h1 className="text-2xl font-mono text-green-500 mb-6 text-center">CONTACT ME</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-green-500 font-mono mb-1">NAME</label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-black border border-green-500 text-green-500 font-mono p-2 focus:outline-none focus:ring-1 focus:ring-green-500"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-green-500 font-mono mb-1">EMAIL</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-black border border-green-500 text-green-500 font-mono p-2 focus:outline-none focus:ring-1 focus:ring-green-500"
            />
          </div>
          
          <div>
            <label htmlFor="message" className="block text-green-500 font-mono mb-1">MESSAGE</label>
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              value={formData.message}
              onChange={handleChange}
              className="w-full bg-black border border-green-500 text-green-500 font-mono p-2 focus:outline-none focus:ring-1 focus:ring-green-500"
            />
          </div>
          
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-green-500 text-black font-mono px-6 py-2 hover:bg-green-400 focus:outline-none disabled:opacity-50"
            >
              {isSubmitting ? 'SENDING...' : 'SEND MESSAGE'}
            </button>
          </div>
        </form>
        
        <div className="mt-6 text-center">
          <button 
            onClick={() => router.push('/')}
            className="text-green-500 font-mono hover:text-green-400 focus:outline-none"
          >
            &lt; BACK TO HOME
          </button>
        </div>
      </div>
    </main>
  );
} 