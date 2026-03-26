'use client';

import React, { useState, useEffect, useRef } from 'react';

/* ═══════════════════════════════════════════════════════════════════
   GANs Redesign — High-Fidelity Visualizer
   Bespoke mode for the Generator-Discriminator Duel.
   ═══════════════════════════════════════════════════════════════════ */

interface GANVizProps {
  mode?: string;
  intensity?: number;
}

export default function GANVisualization({ mode = 'duel-viz', intensity = 1 }: GANVizProps) {
  const [equilibrium, setEquilibrium] = useState(0.5); // 0 = Gen wins, 1 = Disc wins
  
  // ── Mode: The Duel ──
  const renderDuel = () => {
    return (
      <div className="flex flex-col items-center gap-12 w-full max-w-xl">
        <div className="flex justify-between w-full items-center relative gap-4">
            {/* The Generator */}
            <div className="flex flex-col items-center gap-3">
                <div className={`w-28 h-28 ${equilibrium < 0.4 ? 'bg-amber-500/40' : 'bg-slate-800'} border-2 border-amber-500 rounded-xl flex items-center justify-center transition-colors duration-500 shadow-[0_0_20px_rgba(245,158,11,0.1)]`}>
                    <div className="flex flex-col items-center">
                        <span className="text-amber-400 font-black text-xs uppercase">Generator</span>
                        <div className="flex gap-1 mt-2">
                           <div className="w-1.5 h-6 bg-amber-400/30 rounded-full animate-pulse" />
                           <div className="w-1.5 h-10 bg-amber-400/60 rounded-full animate-pulse delay-75" />
                           <div className="w-1.5 h-8 bg-amber-400/40 rounded-full animate-pulse delay-150" />
                        </div>
                    </div>
                </div>
                <span className="text-[10px] text-slate-500 font-mono tracking-tighter uppercase">Goal: Fool Disc</span>
            </div>

            {/* The "Adversarial" Tunnel */}
            <div className="flex-1 h-3 bg-slate-800 rounded-full relative overflow-hidden border border-slate-700">
                <div 
                    className="absolute inset-y-0 bg-gradient-to-r from-amber-500 via-indigo-500 to-emerald-500 transition-all duration-700"
                    style={{ left: 0, width: `${equilibrium * 100}%` }}
                />
                {/* Moving Particles */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full blur-[2px] animate-ping" style={{ marginLeft: `${(equilibrium - 0.5) * 80}%` }} />
                </div>
            </div>

            {/* The Discriminator */}
            <div className="flex flex-col items-center gap-3">
                <div className={`w-28 h-28 ${equilibrium > 0.6 ? 'bg-emerald-500/40' : 'bg-slate-800'} border-2 border-emerald-500 rounded-xl flex items-center justify-center transition-colors duration-500 shadow-[0_0_20px_rgba(16,185,129,0.1)]`}>
                    <div className="flex flex-col items-center">
                        <span className="text-emerald-400 font-black text-xs uppercase">Discriminator</span>
                        <div className="relative mt-2">
                           <div className="w-12 h-12 rounded-full border border-emerald-500/30 flex items-center justify-center">
                               <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                           </div>
                        </div>
                    </div>
                </div>
                 <span className="text-[10px] text-slate-500 font-mono tracking-tighter uppercase">Goal: Detect Fake</span>
            </div>
        </div>

        {/* Equilibrium Slider */}
        <div className="w-full bg-slate-800/50 p-6 rounded-2xl border border-slate-700 mt-4 flex flex-col gap-4">
            <div className="flex justify-between text-[10px] font-black tracking-widest text-slate-500">
                <span className={equilibrium < 0.4 ? 'text-amber-400' : ''}>GEN IMPROVING</span>
                <span className={equilibrium > 0.4 && equilibrium < 0.6 ? 'text-white' : ''}>NASH EQUILIBRIUM</span>
                <span className={equilibrium > 0.6 ? 'text-emerald-400' : ''}>DISC DOMINATING</span>
            </div>
            <input 
                type="range" min="0" max="1" step="0.01" value={equilibrium} 
                onChange={(e) => setEquilibrium(parseFloat(e.target.value))}
                className="w-full accent-indigo-500"
            />
            <p className="text-[10px] text-slate-400 leading-relaxed text-center px-8 italic">
                {equilibrium < 0.3 && "The Generator has found a hack! Discriminator is lost."}
                {equilibrium >= 0.3 && equilibrium <= 0.7 && "A perfect balance. The Generator is forced to learn real distribution."}
                {equilibrium > 0.7 && "The Discriminator is too strong. Generator can't learn anything."}
            </p>
        </div>
      </div>
    );
  };

  const renderGenerator = () => (
    <div className="flex flex-col items-center gap-6">
        <div className="w-48 h-48 bg-slate-800 border-2 border-amber-500 rounded-2xl flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent" />
            <div className="flex flex-col items-center gap-2">
                <span className="text-amber-400 font-bold uppercase tracking-widest text-xs">Generator</span>
                <div className="w-12 h-1 bg-amber-400/30 rounded-full" />
                <span className="text-[10px] text-slate-500">Latent $z \to$ Image $x&apos;$</span>
            </div>
        </div>
        <div className="flex gap-2">
            <div className="w-10 h-10 bg-slate-700 rounded animate-pulse" />
            <div className="w-10 h-10 bg-slate-700 rounded animate-pulse delay-75" />
            <div className="w-10 h-10 bg-slate-700 rounded animate-pulse delay-150" />
        </div>
    </div>
  );

  const renderDiscriminator = () => (
    <div className="flex flex-col items-center gap-6">
        <div className="w-48 h-48 bg-slate-800 border-2 border-emerald-500 rounded-2xl flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <span className="text-emerald-400 font-bold uppercase tracking-widest text-xs">Discriminator</span>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-slate-700 border border-emerald-500/30 flex items-center justify-center text-xs">Real?</div>
                    <div className="text-xl">🔍</div>
                </div>
            </div>
        </div>
        <button className="px-4 py-2 bg-emerald-600 rounded-lg text-xs font-bold hover:bg-emerald-500 transition-colors">TEST SAMPLE</button>
    </div>
  );

  const VIZ_WIDTH = 500;
  const VIZ_HEIGHT = 400;

  return (
    <div className="w-full min-h-[400px] flex flex-col items-center justify-center p-8 bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl relative overflow-hidden group">
      <defs>
         <marker id="arrow-head" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="var(--slate-600)" /></marker>
      </defs>

      {mode === 'duel-viz' && renderDuel()}
      {mode === 'generator-viz' && renderGenerator()}
      {mode === 'discriminator-viz' && renderDiscriminator()}
      
      {(mode === 'mode-collapse-viz' || mode === 'style-transfer-viz') && (
        <svg viewBox={`0 0 ${VIZ_WIDTH} ${VIZ_HEIGHT}`} className="w-full h-auto max-w-lg">
            {mode === 'mode-collapse-viz' && (
                <g>
                    <text x={VIZ_WIDTH/2} y="40" textAnchor="middle" fill="var(--red-400)" fontSize="14" fontWeight="bold">MODE COLLAPSE</text>
                    {Array.from({length: 12}).map((_, i) => (
                        <rect key={i} x={100 + (i%4)*80} y={100 + Math.floor(i/4)*80} width="60" height="60" fill="var(--slate-800)" stroke="var(--amber-400)" />
                    ))}
                    {Array.from({length: 12}).map((_, i) => (
                        <text key={`t-${i}`} x={130 + (i%4)*80} y={145 + Math.floor(i/4)*80} textAnchor="middle" fill="var(--amber-400)" fontSize="40" fontWeight="bold">7</text>
                    ))}
                    <text x={VIZ_WIDTH/2} y={VIZ_HEIGHT - 20} textAnchor="middle" fill="var(--slate-500)" fontSize="10">The Generator iterates on a single &quot;safe&quot; output.</text>
                </g>
            )}
            {mode === 'style-transfer-viz' && (
                <g>
                    <rect x="50" y="100" width="120" height="200" fill="var(--slate-800)" stroke="var(--indigo-400)" rx="8" />
                    <text x="110" y="150" textAnchor="middle" fill="white" fontSize="12">CONTENT (Z)</text>
                    <path d="M 170 200 L 300 200" stroke="var(--slate-700)" strokeWidth="4" markerEnd="url(#arrow-head)" />
                    <rect x="230" y="50" width="140" height="40" fill="var(--amber-500)" opacity="0.2" stroke="var(--amber-400)" rx="4" />
                    <text x="300" y="75" textAnchor="middle" fill="var(--amber-400)" fontSize="10">STYLE ADAPTATION (AdaIN)</text>
                    <path d="M 300 90 L 300 180" stroke="var(--amber-400)" strokeDasharray="4,4" markerEnd="url(#arrow-head)" />
                    <circle cx="400" cy="200" r="60" fill="var(--accent)" opacity="0.3" stroke="white" strokeWidth="2" />
                    <text x="400" y="280" textAnchor="middle" fill="var(--slate-400)" fontSize="10">STYLED OUTPUT</text>
                </g>
            )}
        </svg>
      )}
      
      {!['duel-viz', 'generator-viz', 'discriminator-viz', 'mode-collapse-viz', 'style-transfer-viz'].includes(mode) && (
          <div className="text-slate-500 font-mono text-sm uppercase tracking-widest">
             MODE: {mode.replace(/-/g, " ")}
          </div>
      )}
    </div>
  );
}
