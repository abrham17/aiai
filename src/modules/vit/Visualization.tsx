'use client';

import React, { useState } from 'react';

/* ═══════════════════════════════════════════════════════════════════
   VisionTransformer Redesign — High-Fidelity SVG Visualizer
   Bespoke modes for Patch Exploding, Attention Maps, and MAE.
   ═══════════════════════════════════════════════════════════════════ */

interface ViTVizProps {
  mode?: string;
  intensity?: number;
  interactive?: boolean;
}

const VIZ_SIZE = 500;
const GRID_SIZE = 8; // 8x8 patches
const PATCH_SIZE = VIZ_SIZE / GRID_SIZE;

export default function ViTVisualization({ mode = 'patching-viz' }: ViTVizProps) {
  const [selectedPatch, setSelectedPatch] = useState<number | null>(null);
  
  // ── Mode: Patch Explode ──
  const renderPatchExplode = () => {
    const patches = [];
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const i = y * GRID_SIZE + x;
        // Position in grid
        const gx = x * PATCH_SIZE;
        const gy = y * PATCH_SIZE;
        
        // Position in sequence (exploded)
        const sx = i * (VIZ_SIZE / (GRID_SIZE * GRID_SIZE)) + 10;
        const sy = VIZ_SIZE - 60;

        patches.push(
          <g key={i}>
            <rect
              width={PATCH_SIZE - 2}
              height={PATCH_SIZE - 2}
              fill="rgba(99, 102, 241, 0.4)"
              stroke="var(--accent)"
              strokeWidth="1"
              opacity="0.8"
            >
              <animate
                attributeName="x"
                from={gx}
                to={sx}
                dur="2s"
                begin={`${i * 0.02}s`}
                repeatCount="indefinite"
                values={`${gx};${gx};${sx};${sx}`}
                keyTimes="0;0.3;0.7;1"
              />
              <animate
                attributeName="y"
                from={gy}
                to={sy}
                dur="2s"
                begin={`${i * 0.02}s`}
                repeatCount="indefinite"
                values={`${gy};${gy};${sy};${sy}`}
                keyTimes="0;0.3;0.7;1"
              />
              <animate
                attributeName="width"
                from={PATCH_SIZE - 2}
                to={4}
                dur="2s"
                begin={`${i * 0.02}s`}
                repeatCount="indefinite"
                values={`${PATCH_SIZE - 2};${PATCH_SIZE - 2};4;4`}
                keyTimes="0;0.3;0.7;1"
              />
            </rect>
          </g>
        );
      }
    }
    return patches;
  };

  // ── Mode: Attention Heatmap ──
  const renderAttentionMap = () => {
    const patches = [];
    const focal = selectedPatch ?? 28; // default to centerish

    for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
      const x = (i % GRID_SIZE) * PATCH_SIZE;
      const y = Math.floor(i / GRID_SIZE) * PATCH_SIZE;
      
      // Distance-based attention (simulated)
      const dist = Math.sqrt(Math.pow((i % GRID_SIZE) - (focal % GRID_SIZE), 2) + Math.pow(Math.floor(i / GRID_SIZE) - Math.floor(focal / GRID_SIZE), 2));
      const attn = Math.max(0.1, 1 - dist / (GRID_SIZE * 0.8));

      patches.push(
        <g key={i} onPointerEnter={() => setSelectedPatch(i)}>
          <rect
            x={x} y={y} width={PATCH_SIZE - 1} height={PATCH_SIZE - 1}
            fill={i === focal ? 'var(--amber-400)' : 'var(--accent)'}
            opacity={attn * 0.6}
            className="transition-all duration-300"
          />
          {i === focal && (
             <circle cx={x + PATCH_SIZE/2} cy={y + PATCH_SIZE/2} r="15" fill="none" stroke="white" strokeWidth="2">
                <animate attributeName="r" from="15" to="30" dur="1s" repeatCount="indefinite" />
                <animate attributeName="opacity" from="1" to="0" dur="1s" repeatCount="indefinite" />
             </circle>
          )}
        </g>
      );
    }
    return patches;
  };

  // ── Mode: MAE Reconstruction ──
  const renderMAE = () => {
     const patches = [];
     for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
        const x = (i % GRID_SIZE) * PATCH_SIZE;
        const y = Math.floor(i / GRID_SIZE) * PATCH_SIZE;
        const isMasked = (Math.sin(i * 1.5) + Math.cos(i * 0.8)) > 0.5;

        patches.push(
            <rect 
                key={i} x={x} y={y} width={PATCH_SIZE - 1} height={PATCH_SIZE - 1}
                fill={isMasked ? 'var(--slate-900)' : 'var(--accent)'}
                stroke={isMasked ? 'rgba(255,255,255,0.1)' : 'none'}
                opacity={isMasked ? 1 : 0.5}
            />
        );
     }
     return patches;
  }

  return (
    <div className="w-full flex flex-col items-center justify-center p-8 bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl relative overflow-hidden group">
      
      {/* Background Grid Atmosphere */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0)_2px,#0f172a_2px),linear-gradient(90deg,rgba(15,23,42,0)_2px,#0f172a_2px)] bg-[size:40px_40px] opacity-20 pointer-events-none" />

      <svg
        viewBox={`0 0 ${VIZ_SIZE} ${VIZ_SIZE}`}
        className="w-full h-auto max-w-lg drop-shadow-[0_0_20px_rgba(99,102,241,0.15)]"
      >
        {/* The Image Plane (dashed border) */}
        <rect x="0" y="0" width={VIZ_SIZE} height={VIZ_SIZE} fill="none" stroke="var(--slate-800)" strokeWidth="2" strokeDasharray="10,10" />

        {mode === 'patch-viz' && renderPatchExplode()}
        {mode === 'projection-viz' && (
            <g>
                <rect x="50" y="50" width="100" height="100" fill="var(--slate-800)" stroke="var(--accent)" strokeWidth="2" />
                <path d="M 150 100 L 350 100" stroke="var(--slate-600)" strokeWidth="4" markerEnd="url(#arrow-head)" />
                <rect x="350" y="20" width="40" height="160" fill="var(--indigo-500)" opacity="0.4" stroke="var(--indigo-400)" />
                <text x="100" y="170" textAnchor="middle" fill="var(--slate-400)" fontSize="10">8x8 Patch</text>
                <text x="370" y="200" textAnchor="middle" fill="var(--indigo-300)" fontSize="10">Embedding Vector</text>
            </g>
        )}
        {mode === 'cls-token-viz' && (
            <g>
                <circle cx="50" cy="50" r="20" fill="var(--amber-400)" />
                <text x="50" y="85" textAnchor="middle" fill="var(--amber-400)" fontSize="10" fontWeight="bold">[CLS]</text>
                {Array.from({length: 4}).map((_, i) => (
                    <path key={i} d={`M 50 50 L ${150 + i*50} ${150}`} stroke="var(--amber-400)" strokeWidth="2" opacity="0.3" markerEnd="url(#arrow-head)" />
                ))}
                <text x="VIZ_SIZE/2" y="VIZ_SIZE - 20" textAnchor="middle" fill="var(--slate-500)" fontSize="12 italic">Collecting global context...</text>
            </g>
        )}
        {mode === 'heatmaps-viz' && renderAttentionMap()}
        {mode === 'mae-viz' && renderMAE()}
        {mode === 'pos-2d-viz' && (
             <g>
                {Array.from({length: 16}).map((_, i) => (
                    <rect key={i} x={100 + (i%4)*75} y={100 + Math.floor(i/4)*75} width="60" height="60" fill="none" stroke="var(--amber-400)" strokeDasharray="4,2" />
                ))}
                <text x="VIZ_SIZE/2" y="380" textAnchor="middle" fill="var(--amber-400)" fontSize="12">LEARNED SPATIAL GRID (2D PE)</text>
             </g>
        )}
        {mode === 'rf-viz' && (
            <g>
                <circle cx={VIZ_SIZE/2} cy={VIZ_SIZE/2} r="150" fill="var(--accent)" opacity="0.1" stroke="var(--accent)" strokeDasharray="10,5" />
                <text x="VIZ_SIZE/2" y={VIZ_SIZE/2} textAnchor="middle" fill="white" fontSize="14">GLOBAL RECEPTIVE FIELD</text>
                <path d="M 50 50 L 450 450 M 450 50 L 50 450" stroke="var(--accent)" opacity="0.2" />
            </g>
        )}
        {mode === 'bias-viz' && (
            <g>
                <rect x="50" y="100" width="150" height="150" fill="var(--slate-800)" stroke="var(--accent)" strokeWidth="2" rx="8" />
                <text x="125" y="270" textAnchor="middle" fill="var(--accent)" fontSize="10">CNN (High Bias)</text>
                <circle cx="350" cy="175" r="75" fill="var(--slate-800)" stroke="var(--amber-400)" strokeWidth="2" strokeDasharray="4,4" />
                <text x="350" y="270" textAnchor="middle" fill="var(--amber-400)" fontSize="10">ViT (Low Bias)</text>
            </g>
        )}
        {mode === 'variants-viz' && (
            <g>
                {['ViT', 'DeiT', 'Swin', 'MAE'].map((v, i) => (
                    <rect key={v} x={50 + i*110} y="150" width="90" height="100" fill="var(--slate-800)" stroke="var(--accent)" rx="4" opacity={1 - i*0.2} />
                ))}
                <text x="VIZ_SIZE/2" y="300" textAnchor="middle" fill="var(--slate-500)" fontSize="12">Evolution of Vision Models</text>
            </g>
        )}
        {mode === 'cls-depth-viz' && (
            <g>
                {Array.from({length: 4}).map((_, i) => (
                    <rect key={i} x={150} y={50 + i*80} width="200" height="40" fill="var(--slate-800)" stroke="var(--slate-700)" opacity={0.3 + i*0.2} />
                ))}
                <circle cx="250" cy="50" r="10" fill="var(--amber-400)" />
                <path d="M 250 50 L 250 350" stroke="var(--amber-400)" strokeDasharray="5,5" />
                <text x="250" y="380" textAnchor="middle" fill="var(--amber-400)" fontSize="10">CLS Token Information Propagation</text>
            </g>
        )}
        {mode === 'merging-viz' && renderPatchExplode()}

        {!['patch-viz', 'projection-viz', 'cls-token-viz', 'heatmaps-viz', 'mae-viz', 'merging-viz', 'bias-viz', 'variants-viz', 'cls-depth-viz', 'pos-2d-viz', 'rf-viz'].includes(mode) && (
            <text x={VIZ_SIZE/2} y={VIZ_SIZE/2} textAnchor="middle" fill="var(--slate-500)">Mode: {mode}</text>
        )}
      </svg>

      {/* Controller / Legend */}
      <div className="mt-8 flex gap-6 text-[10px] uppercase tracking-[0.2em] font-black text-slate-500 border-t border-slate-800 pt-6 w-full justify-center">
        <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-indigo-500/50 border border-indigo-400" /> Image Patch</span>
        <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-amber-400" /> Focus Token</span>
        <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-slate-900 border border-slate-700" /> Masked area</span>
      </div>

      {mode === 'attention-map' && (
          <div className="absolute top-4 right-4 bg-slate-800/80 backdrop-blur-md border border-slate-700 p-2 rounded text-[10px] text-slate-400 font-mono">
             HOVER TO SEE ATTENTION
          </div>
      )}
    </div>
  );
}
