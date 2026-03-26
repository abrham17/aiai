'use client';

import React, { useState, useEffect } from 'react';

/* ═══════════════════════════════════════════════════════════════════
   Python Basics Visualization — Premium Interactive Syntax Lab
   ═══════════════════════════════════════════════════════════════════ */

interface PythonVizProps {
  mode?: string;
}

export default function PythonVisualization({ mode = 'code-highlight' }: PythonVizProps) {
  const [listData, setListData] = useState([1, 2, 3, 4, 5]);
  const [transform, setTransform] = useState('x * 2');
  const output = React.useMemo(() => {
    try {
      const fn = new Function('x', `return ${transform}`);
      return listData.map(x => fn(x));
    } catch (e) {
      return [];
    }
  }, [listData, transform]);

  const renderComprehension = () => (
    <div className="flex flex-col gap-6 p-4">
      <div className="bg-slate-900 rounded-lg p-6 font-mono text-sm border border-slate-700 shadow-xl">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-slate-400 ml-2 italic">interactive_python.py</span>
        </div>
        
        <div className="space-y-2">
          <p className="text-blue-400"># Input Data</p>
          <p className="text-pink-400">data = <span className="text-yellow-200">[{listData.join(', ')}]</span></p>
          
          <div className="mt-6 py-4 px-2 border-l-2 border-blue-500 bg-blue-500/5">
            <p className="text-blue-400"># The Comprehension</p>
            <div className="flex items-center gap-2 text-lg">
              <span className="text-slate-200">[</span>
              <input 
                value={transform}
                onChange={(e) => setTransform(e.target.value)}
                className="bg-slate-800 text-yellow-300 border-none focus:ring-1 focus:ring-blue-500 rounded px-2 py-1 w-32 outline-none font-bold"
              />
              <span className="text-pink-400">for</span>
              <span className="text-yellow-200">x</span>
              <span className="text-pink-400">in</span>
              <span className="text-slate-200">data]</span>
            </div>
          </div>

          <div className="mt-6 space-y-1">
            <p className="text-green-400">{">>>"} Output</p>
            <p className="text-yellow-100 text-lg font-bold">
              [{output.join(', ')}]
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 hover:border-blue-500 transition-colors cursor-pointer group"
          onClick={() => setTransform('x**2')}>
          <p className="text-xs text-slate-400 mb-1 group-hover:text-blue-400 transition-colors uppercase tracking-widest">Preset 1</p>
          <code className="text-yellow-200 group-hover:text-white transition-colors">x**2 (Square)</code>
        </div>
        <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 hover:border-blue-500 transition-colors cursor-pointer group"
          onClick={() => setTransform('x + 10')}>
          <p className="text-xs text-slate-400 mb-1 group-hover:text-blue-400 transition-colors uppercase tracking-widest">Preset 2</p>
          <code className="text-yellow-200 group-hover:text-white transition-colors">x + 10 (Add)</code>
        </div>
      </div>
    </div>
  );

  const renderClassDiagram = () => (
    <div className="flex justify-center items-center h-[400px]">
      <svg width="450" height="350" viewBox="0 0 450 350">
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--slate-400)" />
          </marker>
        </defs>

        {/* Base Class */}
        <rect x="150" y="20" width="150" height="80" rx="4" fill="var(--slate-800)" stroke="var(--slate-600)" />
        <text x="225" y="45" textAnchor="middle" fill="white" fontWeight="bold">nn.Module</text>
        <line x1="150" y1="55" x2="300" y2="55" stroke="var(--slate-700)" />
        <text x="160" y="72" fill="var(--slate-400)" fontSize="10">__init__()</text>
        <text x="160" y="88" fill="var(--slate-400)" fontSize="10">forward()</text>

        {/* Inherited Class */}
        <path d="M 225 140 L 225 105" stroke="var(--slate-600)" strokeWidth="2" markerEnd="url(#arrow)" />
        
        <rect x="125" y="150" width="200" height="120" rx="4" fill="var(--blue-500)" fillOpacity="0.1" stroke="var(--blue-500)" />
        <text x="225" y="175" textAnchor="middle" fill="white" fontWeight="bold">TransformerModel</text>
        <line x1="125" y1="185" x2="325" y2="185" stroke="var(--blue-500)" strokeWidth="2" />
        <text x="140" y="205" fill="var(--blue-200)" fontSize="12">def __init__(self):</text>
        <text x="155" y="225" fill="var(--blue-100)" fontSize="12">super().__init__()</text>
        <text x="140" y="250" fill="var(--blue-200)" fontSize="12">def forward(self, x):</text>

        <circle cx="340" cy="160" r="15" fill="var(--yellow-500)" opacity="0.8">
          <animate attributeName="r" values="15;18;15" dur="2s" repeatCount="indefinite" />
        </circle>
        <text x="365" y="165" fill="var(--yellow-200)" fontSize="10">Subclassing Pattern</text>
      </svg>
    </div>
  );

  return (
    <div className="w-full h-full bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex flex-col items-center justify-center p-8">
      {mode === 'interactive-comprehension' && renderComprehension()}
      {mode === 'class-diagram' && renderClassDiagram()}
      {mode !== 'interactive-comprehension' && mode !== 'class-diagram' && (
        <div className="text-center">
            <div className="w-24 h-24 mb-6 mx-auto rounded-3xl bg-blue-500/20 flex items-center justify-center border border-blue-500 animate-pulse">
                <span className="text-4xl text-blue-400">🐍</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Python for AI</h3>
            <p className="text-slate-400 max-w-sm">
                Interactive syntax lab. Select a step to begin exploring advanced Python features.
            </p>
        </div>
      )}
    </div>
  );
}
