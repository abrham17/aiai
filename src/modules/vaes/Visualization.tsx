'use client';

import React, { useState, useRef } from 'react';

/* ═══════════════════════════════════════════════════════════════════
   VAEs Redesign — High-Fidelity Visualizer
   Bespoke mode for Latent Space Interpolation and the Reparam Trick.
   ═══════════════════════════════════════════════════════════════════ */

interface VAEVizProps {
  mode?: string;
  intensity?: number;
}

const VIZ_WIDTH = 500;
const VIZ_HEIGHT = 400;

export default function VAEVisualization({ mode = 'latent-explorer' }: VAEVizProps) {
  const [activePos, setActivePos] = useState({ x: 250, y: 200 });
  const isDragging = useRef(false);
  
  // ── Mode: Latent Explorer ──
  const renderLatentExplorer = () => {
    // Simulated "Decoded" shape based on position
    const radius = 20 + (activePos.x / VIZ_WIDTH) * 80;
    const corners = 3 + Math.floor((activePos.y / VIZ_HEIGHT) * 8);

    const generateShapePath = () => {
        let d = '';
        const centerX = VIZ_WIDTH * 0.75;
        const centerY = VIZ_HEIGHT / 2;
        for (let i = 0; i <= corners; i++) {
            const angle = (i / corners) * Math.PI * 2 - Math.PI / 2;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            d += (i === 0 ? 'M' : 'L') + ` ${x} ${y}`;
        }
        return d + ' Z';
    };

    return (
      <g 
        onPointerDown={() => isDragging.current = true}
        onPointerUp={() => isDragging.current = false}
        onPointerMove={(e) => {
            if (isDragging.current) {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                if (x < VIZ_WIDTH/2 - 20) {
                    setActivePos({ x: Math.max(20, x), y: Math.max(20, Math.min(y, VIZ_HEIGHT - 20)) });
                }
            }
        }}
      >
        {/* Latent Space (Grid) */}
        <rect x="20" y="20" width={VIZ_WIDTH/2 - 60} height={VIZ_HEIGHT - 40} fill="var(--slate-800)" rx="10" stroke="var(--slate-700)" />
        <text x="75" y="45" textAnchor="middle" fill="var(--slate-500)" fontSize="10" fontWeight="bold">LATENT SPACE (Z)</text>
        
        {/* Scatter Points (simulated) */}
        {Array.from({length: 40}).map((_, i) => (
            <circle key={i} cx={40 + (Math.abs(Math.sin(i * 789)) * (VIZ_WIDTH/2 - 100))} cy={60 + (Math.abs(Math.cos(i * 456)) * (VIZ_HEIGHT - 120))} r="2" fill="var(--accent)" opacity="0.3" />
        ))}

        {/* Drag Handle Crosshair */}
        <line x1={activePos.x - 10} y1={activePos.y} x2={activePos.x + 10} y2={activePos.y} stroke="var(--amber-400)" strokeWidth="2" />
        <line x1={activePos.x} y1={activePos.y - 10} x2={activePos.x} y2={activePos.y + 10} stroke="var(--amber-400)" strokeWidth="2" />
        <circle cx={activePos.x} cy={activePos.y} r="20" fill="var(--amber-400)" opacity="0.1" />

        {/* The "Bottleneck" arrows */}
        <path d={`M ${VIZ_WIDTH/2 - 30} ${VIZ_HEIGHT/2} L ${VIZ_WIDTH/2 + 20} ${VIZ_HEIGHT/2}`} stroke="var(--slate-600)" strokeWidth="3" markerEnd="url(#arrow-head)" strokeDasharray="5,5" />
        <text x={VIZ_WIDTH/2 - 5} y={VIZ_HEIGHT/2 - 10} textAnchor="middle" fill="var(--slate-500)" fontSize="10">DECODE</text>

        {/* Decoded Reconstruction */}
        <rect x={VIZ_WIDTH/2 + 40} y="20" width={VIZ_WIDTH/2 - 60} height={VIZ_HEIGHT - 40} fill="var(--slate-800)" rx="10" stroke="var(--slate-700)" />
        <path d={generateShapePath()} fill="var(--accent)" opacity="0.6" stroke="white" strokeWidth="2" className="transition-all duration-150" />
        
        <text x={VIZ_WIDTH*0.75} y={VIZ_HEIGHT - 40} textAnchor="middle" fill="var(--slate-400)" fontSize="12" fontWeight="bold">RECONSTRUCTION</text>
      </g>
    );
  };

  return (
    <div className="w-full flex flex-col items-center justify-center p-8 bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl relative overflow-hidden group">
      <defs>
         <marker id="arrow-head" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="var(--slate-600)" /></marker>
      </defs>
      <svg viewBox={`0 0 ${VIZ_WIDTH} ${VIZ_HEIGHT}`} className="w-full h-auto max-w-lg cursor-crosshair">
        {mode === 'latent-explorer' && renderLatentExplorer()}
        {mode === 'bottleneck-viz' && (
            <g>
                <rect x="50" y="50" width="100" height="300" fill="var(--slate-800)" rx="10" stroke="var(--slate-700)" />
                <path d="M 150 200 L 220 200" stroke="var(--slate-600)" strokeWidth="2" markerEnd="url(#arrow-head)" />
                <rect x="220" y="150" width="60" height="100" fill="var(--indigo-500)" opacity="0.3" rx="10" stroke="var(--indigo-400)" />
                <path d="M 280 200 L 350 200" stroke="var(--slate-600)" strokeWidth="2" markerEnd="url(#arrow-head)" />
                <rect x="350" y="50" width="100" height="300" fill="var(--slate-800)" rx="10" stroke="var(--slate-700)" />
                <text x="100" y="380" textAnchor="middle" fill="var(--slate-500)" fontSize="12">Encoder</text>
                <text x="250" y="270" textAnchor="middle" fill="var(--indigo-300)" fontSize="10">Bottleneck (Z)</text>
                <text x="400" y="380" textAnchor="middle" fill="var(--slate-500)" fontSize="12">Decoder</text>
            </g>
        )}
        {mode === 'reparam-viz' && (
            <g>
                <circle cx="100" cy="150" r="30" fill="var(--slate-800)" stroke="var(--indigo-400)" />
                <text x="100" y="155" textAnchor="middle" fill="white" fontSize="14">$\mu$</text>
                <circle cx="100" cy="250" r="30" fill="var(--slate-800)" stroke="var(--emerald-400)" />
                <text x="100" y="255" textAnchor="middle" fill="white" fontSize="14">$\sigma$</text>
                
                <path d="M 130 150 L 250 180" stroke="var(--slate-600)" markerEnd="url(#arrow-head)" />
                <path d="M 130 250 L 250 220" stroke="var(--slate-600)" markerEnd="url(#arrow-head)" />
                
                <rect x="250" y="170" width="60" height="60" fill="var(--slate-800)" stroke="var(--amber-400)" rx="4" />
                <text x="280" y="205" textAnchor="middle" fill="white" fontSize="14">+</text>
                
                <circle cx="280" cy="50" r="20" fill="var(--red-500)" opacity="0.4" />
                <text x="280" y="55" textAnchor="middle" fill="white" fontSize="10">$\epsilon$ (Noise)</text>
                <path d="M 280 70 L 280 170" stroke="var(--red-400)" strokeDasharray="4,4" markerEnd="url(#arrow-head)" />
            </g>
        )}
        
        {!['latent-explorer', 'bottleneck-viz', 'reparam-viz'].includes(mode) && (
             <g>
                <circle cx={VIZ_WIDTH/2} cy={VIZ_HEIGHT/2} r="40" fill="var(--slate-800)" />
                <text x={VIZ_WIDTH/2} y={VIZ_HEIGHT/2 + 50} textAnchor="middle" fill="var(--slate-500)">MODE: {mode.toUpperCase()}</text>
             </g>
        )}
      </svg>
      
      <div className="mt-8 flex gap-6 text-[10px] uppercase tracking-[0.2em] font-black text-slate-500 border-t border-slate-800 pt-6 w-full justify-center">
        <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-indigo-500/50" /> Latent Code</span>
        <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-amber-400" /> Latent Mean</span>
        <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full border border-white/20" /> Variance Span</span>
      </div>
    </div>
  );
}
