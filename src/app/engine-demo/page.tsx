'use client';

import { useState } from 'react';
import AsciiEngineDemo from '@/components/AsciiEngineDemo';
import { TransitionType } from '@/lib/asciiEngine/textRenderer';
import Link from 'next/link';

export default function EngineDemo() {
  const [renderUI, setRenderUI] = useState(false);
  const [transitionType, setTransitionType] = useState<TransitionType>('dissolve');
  const [wordCategories, setWordCategories] = useState<string[]>(['tech', 'creative']);
  
  return (
    <main>
      <div className="control-panel" style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        zIndex: 10,
        background: 'rgba(0,0,0,0.7)',
        padding: '10px',
        borderRadius: '5px',
        color: 'white'
      }}>
        <h3 className="text-accent text-lg">Engine Controls</h3>
        
        <div className="mb-2">
          <label className="block">
            <input 
              type="checkbox" 
              checked={renderUI} 
              onChange={(e) => setRenderUI(e.target.checked)}
              className="mr-2"
            />
            Show UI Elements
          </label>
        </div>
        
        <div className="mb-2">
          <label className="block mb-1">Transition Type:</label>
          <select 
            value={transitionType}
            onChange={(e) => setTransitionType(e.target.value as TransitionType)}
            className="bg-background text-foreground p-1 w-full"
          >
            <option value="dissolve">Dissolve</option>
            <option value="reveal">Reveal</option>
            <option value="morph">Morph</option>
            <option value="wipe-left">Wipe Left→Right</option>
            <option value="wipe-right">Wipe Right→Left</option>
            <option value="wipe-center">Wipe from Center</option>
          </select>
        </div>
        
        <div className="mb-2">
          <label className="block mb-1">Word Categories:</label>
          <div className="space-y-1">
            {['greetings', 'tech', 'creative', 'phrases', 'misc'].map(category => (
              <label key={category} className="block">
                <input 
                  type="checkbox"
                  checked={wordCategories.includes(category)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setWordCategories([...wordCategories, category]);
                    } else {
                      setWordCategories(wordCategories.filter(c => c !== category));
                    }
                  }}
                  className="mr-2"
                />
                {category}
              </label>
            ))}
          </div>
        </div>
        
        <div className="mt-4">
          <Link 
            href="/"
            className="inline-block bg-accent text-background px-3 py-1 rounded hover:bg-accent-hover"
          >
            Back to Home
          </Link>
        </div>
      </div>
      
      <AsciiEngineDemo 
        renderUI={renderUI}
        transitionType={transitionType}
        wordCategories={wordCategories as any}
      />
    </main>
  );
} 