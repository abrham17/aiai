'use client';

import React, { useState, useEffect, useRef, useMemo, memo } from 'react';

/* ═══════════════════════════════════════════════════════════════════
   TransformerBlock Redesign — High-Fidelity SVG Visualizer
   Bespoke modes for Block Flow, Residuals, and Positional Waves.
   ═══════════════════════════════════════════════════════════════════ */

interface TransformerVizProps {
  mode?: string;
  intensity?: number;
  interactive?: boolean;
}

// ── Shared Constants ──
const VIZ_WIDTH = 600;
const VIZ_HEIGHT = 450;

// ── Components ──

/**
 * Animated Particle for Flow Visualizations - Using simple opacity animation
 */
const Particle = memo(({ delay, duration, path, index }: { delay: number; duration: number; path: string; index: number }) => {
  // Extract start point from path
  const match = path.match(/M\s*(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)/);
  const startX = match ? parseFloat(match[1]) : 0;
  const startY = match ? parseFloat(match[2]) : 0;

  return (
    <g style={{ '--delay': `${delay}s` } as any}>
      <style>{`
        @keyframes particle-pulse-${index} {
          0% { opacity: 0; }
          10% { opacity: 0.8; }
          90% { opacity: 0.8; }
          100% { opacity: 0; }
        }
        .particle-${index} {
          animation: particle-pulse-${index} ${duration}s linear ${delay}s infinite;
          transform: translateZ(0);
          will-change: opacity;
        }
      `}</style>
      <circle
        r="3"
        cx={startX}
        cy={startY}
        fill="currentColor"
        className={`text-blue-400 particle-${index}`}
      />
    </g>
  );
}, (prevProps, nextProps) => 
  prevProps.path === nextProps.path && prevProps.delay === nextProps.delay && prevProps.duration === nextProps.duration
);

/**
 * Block Flow Mode: Data packets through the block
 */
const BlockFlow = () => {
  const midX = VIZ_WIDTH / 2;
  // Define the path through the block
  const pathInput = `M ${midX} 420 L ${midX} 380`;
  const pathAttn = `M ${midX} 380 L ${midX} 280`;
  const pathFFN = `M ${midX} 240 L ${midX} 140`;
  const pathOutput = `M ${midX} 100 L ${midX} 30`;
  
  // Skip connections
  const pathSkip1 = `M ${midX} 380 Q ${midX - 100} 330 ${midX} 280`;
  const pathSkip2 = `M ${midX} 240 Q ${midX + 100} 190 ${midX} 140`;

  return (
    <g>
      <defs>
        <linearGradient id="block-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.2" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.05" />
        </linearGradient>
      </defs>

      {/* Main Spine */}
      <line x1={midX} y1="420" x2={midX} y2="30" stroke="var(--slate-700)" strokeWidth="4" strokeDasharray="8,8" />

      {/* Layer Blocks */}
      <rect x={midX - 80} y="280" width="160" height="60" rx="8" fill="url(#block-grad)" stroke="var(--accent)" strokeWidth="2" />
      <text x={midX} y="315" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" letterSpacing="1">MULTI-HEAD ATTENTION</text>

      <rect x={midX - 80} y="140" width="160" height="60" rx="8" fill="url(#block-grad)" stroke="#a78bfa" strokeWidth="2" />
      <text x={midX} y="175" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" letterSpacing="1">FEED FORWARD (FFN)</text>

      {/* Norm Layers */}
      <rect x={midX - 40} y="240" width="80" height="30" rx="4" fill="var(--slate-800)" stroke="var(--slate-600)" />
      <text x={midX} y="260" textAnchor="middle" fill="var(--slate-400)" fontSize="10" fontWeight="bold">ADD & NORM</text>

      <rect x={midX - 40} y="100" width="80" height="30" rx="4" fill="var(--slate-800)" stroke="var(--slate-600)" />
      <text x={midX} y="120" textAnchor="middle" fill="var(--slate-400)" fontSize="10" fontWeight="bold">ADD & NORM</text>

      {/* Residual Bridges */}
      <path d={pathSkip1} fill="none" stroke="var(--amber-400)" strokeWidth="2" strokeDasharray="5,5" opacity="0.4" />
      <path d={pathSkip2} fill="none" stroke="var(--amber-400)" strokeWidth="2" strokeDasharray="5,5" opacity="0.4" />

      {/* Flow Particles */}
      {[0, 0.5, 1, 1.5].map((d, i) => <Particle key={`p1-${d}`} index={i} delay={d} duration={3} path={pathInput} />)}
      {[0, 1].map((d, i) => <Particle key={`pa-${d}`} index={10 + i} delay={d} duration={3} path={pathAttn} />)}
      {[0.5, 1.5].map((d, i) => <Particle key={`ps1-${d}`} index={20 + i} delay={d} duration={3} path={pathSkip1} />)}
      {[0, 1].map((d, i) => <Particle key={`pf-${d}`} index={30 + i} delay={d} duration={3} path={pathFFN} />)}
      {[0.5, 1.5].map((d, i) => <Particle key={`ps2-${d}`} index={40 + i} delay={d} duration={3} path={pathSkip2} />)}
      {[0, 0.5, 1, 1.5].map((d, i) => <Particle key={`pout-${d}`} index={50 + i} delay={d} duration={3} path={pathOutput} />)}
    </g>
  );
};

/**
 * Positional Waves: Visualization of Sinusoidal Encodings
 */
const PositionalWaves = ({ intensity = 1 }: { intensity?: number }) => {
  const points = 200;
  const padding = 40;
  const w = VIZ_WIDTH - padding * 2;
  const h = VIZ_HEIGHT - padding * 2;

  const generatePath = (freq: number, offset: number) => {
    let d = `M ${padding} ${VIZ_HEIGHT / 2}`;
    for (let i = 0; i <= points; i++) {
        const x = padding + (i / points) * w;
        const y = VIZ_HEIGHT / 2 + Math.sin(i * freq * intensity + offset) * (h / 4);
        d += ` L ${x} ${y}`;
    }
    return d;
  };

  return (
    <g>
      <text x={padding} y="60" fill="var(--slate-400)" fontSize="12" fontWeight="bold">SINE & COSINE FREQUENCIES (PE)</text>
      {/* Background Grid */}
      <line x1={padding} y1={VIZ_HEIGHT / 2} x2={padding + w} y2={VIZ_HEIGHT / 2} stroke="var(--slate-800)" strokeWidth="1" />
      
      {/* Wave Layers */}
      <style>{`
        @keyframes wave-dash {
          to { stroke-dashoffset: 100; }
        }
        .wave-animate { animation: wave-dash 5s linear infinite; }
      `}</style>
      <path d={generatePath(0.05, 0)} fill="none" stroke="var(--accent)" strokeWidth="3" opacity="0.8" strokeDasharray="10,10" className="wave-animate" style={{ willChange: 'stroke-dashoffset' }} />
      <path d={generatePath(0.1, Math.PI / 2)} fill="none" stroke="#a78bfa" strokeWidth="2" opacity="0.6" />
      <path d={generatePath(0.25, Math.PI)} fill="none" stroke="#fbbf24" strokeWidth="1" opacity="0.4" />
      
      {/* Position Markers */}
      {[0, 0.25, 0.5, 0.75, 1].map(p => (
        <g key={p}>
          <line x1={padding + p * w} y1={padding} x2={padding + p * w} y2={VIZ_HEIGHT - padding} stroke="var(--slate-800)" strokeWidth="1" strokeDasharray="4,4" />
          <text x={padding + p * w} y={VIZ_HEIGHT - 20} textAnchor="middle" fill="var(--slate-500)" fontSize="10">POS {Math.floor(p * 10)}</text>
        </g>
      ))}
    </g>
  );
};

/**
 * LayerNorm Visualizer: Squashing points
 */
const LayerNormViz = ({ intensity = 1 }: { intensity?: number }) => {
  const points = useMemo(() => Array.from({ length: 40 }, (_, i) => ({
    x: Math.sin(i * 123.456) * 100,
    y: Math.cos(i * 456.789) * 50,
    id: i
  })), []);

    const midX = VIZ_WIDTH / 2;
    const midY = VIZ_HEIGHT / 2;

    return (
        <g>
            <text x={midX} y="60" textAnchor="middle" fill="var(--slate-400)" fontSize="12" fontWeight="bold">VARIANCE SQUASHING</text>
            
            {/* Norm Bounds */}
            <rect x={midX - 120} y={midY - 60} width="240" height="120" rx="10" fill="none" stroke="var(--accent)" strokeWidth="2" strokeDasharray="5,5" opacity="0.3" />
            
            {/* The Points */}
            {points.map((p, i) => {
                // Apply "Norm" logic based on intensity (simulated)
                const normX = p.x / (1 + intensity * 2);
                const normY = p.y / (1 + intensity * 2);

                return (
                    <circle 
                        key={p.id}
                        cx={midX + normX}
                        cy={midY + normY}
                        r="4"
                        fill="var(--accent)"
                        opacity={0.6}
                    >
                        <animate attributeName="opacity" values="0.6;1;0.6" dur={`${2 + i % 3}s`} repeatCount="indefinite" />
                    </circle>
                );
            })}

            {/* Gaussian Bell Curve Overlay */}
            <path 
                d={`M ${midX - 150} ${midY + 140} Q ${midX} ${midY + 40 - intensity * 40} ${midX + 150} ${midY + 140}`}
                fill="none"
                stroke="var(--amber-400)"
                strokeWidth="3"
                opacity="0.6"
            />
            <text x={midX} y={midY + 160} textAnchor="middle" fill="var(--amber-400)" fontSize="12">DISTRIBUTION STABILIZATION</text>
        </g>
    );
};

// ── Main Component ──

export default function TransformerVisualization({ mode = 'block-overview', intensity = 1 }: TransformerVizProps) {
  return (
    <div className="w-full flex flex-col items-center justify-center p-8 bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden relative group">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.05),transparent_70%)] pointer-events-none" />
      
      <svg
        viewBox={`0 0 ${VIZ_WIDTH} ${VIZ_HEIGHT}`}
        className="w-full h-auto max-w-2xl drop-shadow-[0_0_15px_rgba(99,102,241,0.1)]"
      >
        <defs>
          <filter id="glow-heavy" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {mode === 'block-overview' && <BlockFlow />}
        {mode === 'position-viz' && <PositionalWaves intensity={intensity} />}
        {mode === 'layernorm-viz' && <LayerNormViz intensity={intensity} />}
        
        {/* FFN Mode */}
        {mode === 'ffn-viz' && (
          <g>
            <rect x="150" y="100" width="300" height="60" rx="8" fill="var(--slate-800)" stroke="#a78bfa" strokeWidth="2" />
            <text x="300" y="135" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">LOCAL MLP (FFN)</text>
            <path d="M 100 250 L 250 160 M 500 250 L 350 160" stroke="#a78bfa" strokeWidth="2" opacity="0.4" strokeDasharray="4,4" />
            <circle cx="300" cy="300" r="40" fill="var(--accent)" opacity="0.1" stroke="var(--accent)" strokeWidth="1" />
            <text x="300" y="305" textAnchor="middle" fill="var(--accent)" fontSize="10">KNOWLEDGE BANK</text>
          </g>
        )}

        {/* Residual Mode */}
        {mode === 'residual-viz' && (
          <g>
            <path d="M 100 350 L 100 100 Q 300 50 500 100 L 500 350" fill="none" stroke="var(--amber-400)" strokeWidth="4" strokeDasharray="10,5" />
            <rect x="250" y="200" width="100" height="50" rx="4" fill="var(--slate-800)" stroke="var(--slate-700)" />
            <text x="300" y="230" textAnchor="middle" fill="white" fontSize="12">COMPLEX LAYER</text>
            <circle cx="300" cy="100" r="20" fill="var(--amber-400)" opacity="0.2" />
            <text x="300" y="105" textAnchor="middle" fill="var(--amber-400)" fontWeight="bold">+</text>
            <text x="300" y="40" textAnchor="middle" fill="var(--amber-400)" fontSize="14" fontWeight="bold">RESIDUAL HIGHWAY</text>
          </g>
        )}

        {/* Embedding Mode */}
        {mode === 'embedding-viz' && (
          <g>
            <circle cx="300" cy="225" r="100" fill="none" stroke="var(--slate-800)" strokeWidth="1" />
            <circle cx="250" cy="200" r="6" fill="var(--accent)" />
            <text x="240" y="190" fill="var(--accent)" fontSize="10" textAnchor="middle">KING</text>
            <circle cx="350" cy="250" r="6" fill="var(--accent)" />
            <text x="360" y="265" fill="var(--accent)" fontSize="10" textAnchor="middle">QUEEN</text>
            <line x1="250" y1="200" x2="350" y2="250" stroke="var(--amber-400)" strokeWidth="1" strokeDasharray="4,2" />
            <text x="300" y="220" fill="var(--amber-400)" fontSize="8" textAnchor="middle" transform="rotate(26, 300, 220)">SEMANTIC VECTOR</text>
          </g>
        )}

        {/* Softmax Mode */}
        {mode === 'softmax-output-viz' && (
          <g>
            {[0, 1, 2, 3, 4].map(i => {
                const h = 20 + Math.sin(i + intensity) * 80 + 80;
                return (
                    <rect key={i} x={150 + i * 60} y={350 - h} width="40" height={h} fill={i === 2 ? 'var(--accent)' : 'var(--slate-800)'} rx="4" />
                );
            })}
            <text x="300" y="380" textAnchor="middle" fill="var(--slate-400)" fontSize="12">VOCABULARY PROBABILITIES</text>
          </g>
        )}
        
        {mode === 'tokens-viz' && (
            <g>
                {['Trans', 'form', 'er'].map((t, i) => (
                    <g key={i} transform={`translate(${150 + i*100}, 200)`}>
                        <rect width="80" height="40" fill="var(--slate-800)" stroke="var(--accent)" rx="4" />
                        <text x="40" y="25" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">{t}</text>
                    </g>
                ))}
                <text x="300" y="280" textAnchor="middle" fill="var(--slate-500)" fontSize="10">Sub-word Tokenization (BPE)</text>
            </g>
        )}
        {mode === 'temperature-viz' && (
            <g>
                <path d={`M 100 300 Q 300 ${300 - 200/intensity} 500 300`} fill="none" stroke="var(--amber-400)" strokeWidth="3" />
                <text x="300" y="340" textAnchor="middle" fill="var(--slate-500)" fontSize="12">Logits Peak (T={intensity})</text>
            </g>
        )}
        {mode === 'scaling-laws-viz' && (
            <g>
                <path d="M 100 300 L 500 100" stroke="var(--emerald-500)" strokeWidth="2" markerEnd="url(#glow-heavy)" />
                <text x="300" y="340" textAnchor="middle" fill="var(--slate-500)" fontSize="10">Log Loss vs Compute (Power Law)</text>
            </g>
        )}
        
        {mode === 'enc-dec-viz' && (
            <g>
                <rect x="100" y="100" width="150" height="200" fill="var(--indigo-500)" opacity="0.1" stroke="var(--indigo-400)" rx="8" />
                <text x="175" y="210" textAnchor="middle" fill="white" fontSize="12">ENCODER</text>
                <path d="M 250 200 L 350 200" stroke="var(--slate-600)" strokeWidth="2" strokeDasharray="4,4" markerEnd="url(#glow-heavy)" />
                <rect x="350" y="100" width="150" height="200" fill="var(--accent)" opacity="0.1" stroke="var(--accent)" rx="8" />
                <text x="425" y="210" textAnchor="middle" fill="white" fontSize="12">DECODER</text>
            </g>
        )}
        {mode === 'weight-tying-viz' && (
            <g>
                <rect x="100" y="100" width="120" height="40" fill="var(--slate-800)" stroke="var(--amber-400)" rx="4" />
                <text x="160" y="125" textAnchor="middle" fill="white" fontSize="10">INPUT EMBED</text>
                <path d="M 160 140 Q 300 225 440 140" stroke="var(--amber-400)" strokeWidth="2" fill="none" markerEnd="url(#glow-heavy)" />
                <rect x="380" y="100" width="120" height="40" fill="var(--slate-800)" stroke="var(--amber-400)" rx="4" />
                <text x="440" y="125" textAnchor="middle" fill="white" fontSize="10">OUTPUT PROJ</text>
                <text x="300" y="240" textAnchor="middle" fill="var(--amber-400)" fontSize="10">SHARED WEIGHTS (W)</text>
            </g>
        )}
        
        {/* Fallback for unhandled modes */}
        {!['block-overview', 'position-viz', 'layernorm-viz', 'ffn-viz', 'residual-viz', 'embedding-viz', 'softmax-output-viz', 'tokens-viz', 'temperature-viz', 'weight-tying-viz', 'scaling-laws-viz', 'enc-dec-viz'].includes(mode) && (
            <g>
                <circle cx={VIZ_WIDTH / 2} cy={VIZ_HEIGHT / 2} r="50" fill="var(--slate-800)" />
                <text x={VIZ_WIDTH / 2} y={VIZ_HEIGHT / 2 + 5} textAnchor="middle" fill="var(--slate-500)">VISUALIZING: {mode.toUpperCase()}</text>
            </g>
        )}
      </svg>

      {/* Interactive Overlay Info */}
      <div className="mt-6 flex gap-4 text-[10px] uppercase tracking-widest font-bold text-slate-500 border-t border-slate-800 pt-4 w-full justify-center">
        <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-indigo-500" /> Computation</span>
        <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-400" /> Residual Path</span>
        <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-slate-400" /> Layer Norm</span>
      </div>
    </div>
  );
}
