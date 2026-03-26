'use client';

import React, { useState, useEffect } from 'react';

/* ═══════════════════════════════════════════════════════════════════
   PyTorch Essentials Visualization — Computation Graph Explorer
   ═══════════════════════════════════════════════════════════════════ */

interface PyTorchVizProps {
  mode?: string;
}

export default function PyTorchVisualization({ mode = 'tensor-viz' }: PyTorchVizProps) {
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setPulse(p => (p + 1) % 100), 50);
    return () => clearInterval(interval);
  }, []);

  const renderComputationGraph = () => (
    <div className="flex justify-center items-center h-[400px]">
      <svg width="500" height="350" viewBox="0 0 500 350">
        <defs>
          <marker id="ptr" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--slate-500)" />
          </marker>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Inputs */}
        <g className="cursor-pointer group">
            <rect x="50" y="150" width="80" height="40" rx="8" fill="var(--slate-800)" stroke="var(--slate-600)" strokeWidth="2" />
            <text x="90" y="175" textAnchor="middle" fill="white" fontSize="14">Input X</text>
        </g>
        <g className="cursor-pointer group">
            <rect x="50" y="50" width="80" height="40" rx="8" fill="var(--yellow-600)" fillOpacity="0.2" stroke="var(--yellow-400)" strokeWidth="2" />
            <text x="90" y="75" textAnchor="middle" fill="var(--yellow-100)" fontSize="14">W (Param)</text>
        </g>

        {/* Ops */}
        <line x1="130" y1="170" x2="210" y2="120" stroke="var(--slate-600)" strokeWidth="2" markerEnd="url(#ptr)" />
        <line x1="130" y1="70" x2="210" y2="110" stroke="var(--slate-600)" strokeWidth="2" markerEnd="url(#ptr)" />

        <circle cx="230" cy="115" r="30" fill="var(--blue-500)" fillOpacity="0.2" stroke="var(--blue-400)" strokeWidth="2" />
        <text x="230" y="120" textAnchor="middle" fill="white" fontWeight="bold">MUL</text>

        <line x1="260" y1="115" x2="340" y2="115" stroke="var(--slate-600)" strokeWidth="2" markerEnd="url(#ptr)" />

        {/* Output */}
        <rect x="350" y="90" width="100" height="50" rx="8" fill="var(--pink-600)" fillOpacity="0.2" stroke="var(--pink-400)" strokeWidth="2" />
        <text x="400" y="122" textAnchor="middle" fill="var(--pink-100)" fontSize="16" fontWeight="bold">LOSS</text>

        {/* Backward Animation (The Miracle of Autograd) */}
        {pulse > 50 && (
            <g opacity={(100 - pulse) / 50}>
                <path d="M 350 115 L 260 115" fill="none" stroke="var(--pink-400)" strokeWidth="4" strokeDasharray="10 5" filter="url(#glow)">
                    <animate attributeName="stroke-dashoffset" from="0" to="100" dur="1s" repeatCount="indefinite" />
                </path>
                <path d="M 200 110 L 130 70" fill="none" stroke="var(--pink-400)" strokeWidth="4" strokeDasharray="10 5" filter="url(#glow)">
                    <animate attributeName="stroke-dashoffset" from="0" to="100" dur="1s" repeatCount="indefinite" />
                </path>
                <text x="260" y="70" fill="var(--pink-300)" fontSize="12" fontWeight="bold">grad_loss / grad_W</text>
            </g>
        )}
      </svg>
    </div>
  );

  const renderTrainingLoop = () => (
      <div className="flex flex-col items-center gap-6">
          <div className="relative w-64 h-64 border-4 border-dashed border-slate-800 rounded-full flex items-center justify-center">
              <div className="absolute w-full h-full animate-[spin_10s_linear_infinite]">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-xs font-bold text-white shadow-lg">FORWARD</div>
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-24 h-12 bg-pink-500 rounded-lg flex items-center justify-center text-xs font-bold text-white shadow-lg">BACKWARD</div>
                  <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-12 bg-orange-500 rounded-lg flex items-center justify-center text-xs font-bold text-white shadow-lg rotate-90">LOSS</div>
                  <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-24 h-12 bg-green-500 rounded-lg flex items-center justify-center text-xs font-bold text-white shadow-lg rotate-90">OPTIMIZE</div>
              </div>
              <div className="text-center">
                  <span className="text-4xl">⚙️</span>
                  <p className="text-slate-400 mt-2 font-mono">Epoch: 42</p>
              </div>
          </div>
          <p className="text-slate-400 text-sm italic">The infinite cycle of error and correction.</p>
      </div>
  );

  return (
    <div className="w-full h-full bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex flex-col items-center justify-center p-8">
      {mode === 'computation-graph' && renderComputationGraph()}
      {mode === 'loop-viz' && renderTrainingLoop()}
      {mode !== 'computation-graph' && mode !== 'loop-viz' && (
        <div className="text-center">
            <div className="w-24 h-24 mb-6 mx-auto rounded-3xl bg-pink-500/20 flex items-center justify-center border border-pink-500 animate-pulse">
                <span className="text-4xl font-bold text-pink-400">🔥</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">PyTorch Essentials</h3>
            <p className="text-slate-400 max-w-sm">
                Master the dynamic framework. Select a step to explore Autograd and model lifecycles.
            </p>
        </div>
      )}
    </div>
  );
}
