'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';

/* ═══════════════════════════════════════════════════════════════════
   DiffusionModel Redesign — High-Fidelity Interactive Visualizer
   Bespoke modes for Denoising Simulation, U-Net Flow, and CFG.
   ═══════════════════════════════════════════════════════════════════ */

interface DiffusionVizProps {
  mode?: string;
  intensity?: number;
  interactive?: boolean;
}

const VIZ_WIDTH = 500;
const VIZ_HEIGHT = 400;

export default function DiffusionVisualization({ mode = 'denoising-simulator', intensity = 1 }: DiffusionVizProps) {
  const [step, setStep] = useState(0);
  const [isDenoising, setIsDenoising] = useState(false);
  
  // ── Mode: Denoising Simulator (Pixel Grid) ──
  const pixelGrid = useMemo(() => {
    return Array.from({ length: 16 * 16 }, (_, i) => ({
        target: (Math.sin(i * 0.5) + Math.cos(i * 0.8)) > 0 ? 255 : 50, 
        noise: Math.abs(Math.sin(i * 100) * 255)
    }));
  }, []);

  useEffect(() => {
    if (isDenoising && step < 20) {
      const timer = setTimeout(() => setStep(s => s + 1), 150);
      return () => clearTimeout(timer);
    } else if (isDenoising && step >= 20) {
      const t = setTimeout(() => setIsDenoising(false), 0);
      return () => clearTimeout(t);
    }
  }, [isDenoising, step]);

  const renderDenoisingGrid = () => {
    const progress = step / 20;
    return (
      <g>
        <rect x="100" y="50" width="300" height="300" fill="var(--slate-800)" rx="10" />
        {pixelGrid.map((p, i) => {
          const x = 100 + (i % 16) * (300 / 16);
          const y = 50 + Math.floor(i / 16) * (300 / 16);
          
          // Current color is a blend of noise and target based on step
          const currentNoise = p.noise * (1 - progress);
          const currentTarget = p.target * progress;
          const val = Math.floor(currentNoise + currentTarget);
          
          return (
            <rect
              key={i}
              x={x} y={y}
              width={300/16 - 0.5} height={300/16 - 0.5}
              fill={`rgb(${val}, ${val}, ${Math.min(255, val + 50)})`}
            />
          );
        })}
        
        {/* Step Label */}
        <text x="250" y="380" textAnchor="middle" fill="var(--slate-400)" fontSize="12" fontWeight="bold">
          STEP {step} / 20 — {progress === 1 ? 'RECONSTRUCTION COMPLETE' : 'DENOISING...'}
        </text>

        {/* Start/Reset Button Overlay */}
        {!isDenoising && (
          <g className="cursor-pointer" onClick={() => { setStep(0); setIsDenoising(true); }}>
            <rect x="200" y="175" width="100" height="40" rx="20" fill="var(--accent)" opacity="0.9" />
            <text x="250" y="200" textAnchor="middle" dy=".3em" fill="white" fontSize="12" fontWeight="bold">
              {step === 0 ? 'START' : 'RETRY'}
            </text>
          </g>
        )}
      </g>
    );
  };

  // ── Mode: U-Net Flow ──
  const renderUNetFlow = () => {
    const midX = VIZ_WIDTH / 2;
    return (
      <g>
         <path d={`M 100 100 L 250 300 L 400 100`} fill="none" stroke="var(--slate-700)" strokeWidth="4" />
         
         {/* Encoder Blocks */}
         <rect x="80" y="80" width="40" height="40" fill="var(--accent)" rx="4" />
         <rect x="130" y="150" width="40" height="40" fill="var(--accent)" rx="4" opacity="0.8" />
         <rect x="180" y="220" width="40" height="40" fill="var(--accent)" rx="4" opacity="0.6" />

         {/* Bottleneck */}
         <rect x={midX - 30} y="280" width="60" height="40" fill="#a78bfa" rx="4" />
         <text x={midX} y="340" textAnchor="middle" fill="#a78bfa" fontSize="10" fontWeight="bold">SEMANTIC BOTTLENECK</text>

         {/* Decoder Blocks */}
         <rect x="280" y="220" width="40" height="40" fill="var(--accent)" rx="4" opacity="0.6" />
         <rect x="330" y="150" width="40" height="40" fill="var(--accent)" rx="4" opacity="0.8" />
         <rect x="380" y="80" width="40" height="40" fill="var(--accent)" rx="4" />

         {/* Skip Connections */}
         <path d="M 120 100 L 380 100" fill="none" stroke="var(--amber-400)" strokeWidth="2" strokeDasharray="5,5" />
         <path d="M 170 170 L 330 170" fill="none" stroke="var(--amber-400)" strokeWidth="2" strokeDasharray="5,5" />
         <path d="M 220 240 L 280 240" fill="none" stroke="var(--amber-400)" strokeWidth="2" strokeDasharray="5,5" opacity="0.5" />
         
         <text x={midX} y="60" textAnchor="middle" fill="var(--amber-400)" fontSize="12" fontWeight="bold">SKIP CONNECTIONS (TEXTURE)</text>
         <text x="100" y="350" textAnchor="middle" fill="var(--slate-500)" fontSize="10">ENCODER</text>
         <text x="400" y="350" textAnchor="middle" fill="var(--slate-500)" fontSize="10">DECODER</text>
      </g>
    );
  };

  // ── Mode: CFG Viz ──
  const renderCFG = () => {
    const scale = intensity * 2;
    return (
      <g>
        <line x1="100" y1="300" x2="400" y2="300" stroke="var(--slate-800)" />
        <line x1="250" y1="350" x2="250" y2="50" stroke="var(--slate-800)" />
        
        {/* Unconditioned Vector */}
        <line x1="250" y1="300" x2="300" y2="250" stroke="var(--slate-500)" strokeWidth="2" markerEnd="url(#arrow-gray)" />
        <text x="310" y="240" fill="var(--slate-500)" fontSize="10">UNCONDITIONED</text>

        {/* Prompt Vector */}
        <line x1="250" y1="300" x2="350" y2="150" stroke="var(--accent)" strokeWidth="2" markerEnd="url(#arrow-blue)" />
        <text x="360" y="140" fill="var(--accent)" fontSize="10">PROMPT CONDITIONED</text>

        {/* GUIDED Result */}
        <line x1="250" y1="300" x2={250 + (100 * scale)} y2={300 - (150 * scale)} stroke="var(--amber-400)" strokeWidth="4" markerEnd="url(#arrow-gold)" />
        <text x={260 + (100 * scale)} y={290 - (150 * scale)} fill="var(--amber-400)" fontSize="14" fontWeight="bold">FINAL GUIDED OUTPUT</text>
        
        <text x="250" y="380" textAnchor="middle" fill="var(--slate-500)" fontSize="12">SCALE (w) = {scale.toFixed(1)}</text>
      </g>
    );
  };

  const renderNoiseSchedule = () => {
    const points = Array.from({ length: 20 }, (_, i) => ({
        x: i * 20,
        y: Math.pow(i / 19, 2) * 100
    }));
    
    return (
        <g>
            <text x="50" y="50" fill="var(--slate-400)" fontSize="12" fontWeight="bold">NOISE SCHEDULE (\beta_t)</text>
            <path 
                d={`M 50 300 ${points.map(p => `L ${50 + p.x * 2} ${300 - p.y * 2}`).join(' ')}`}
                fill="none" stroke="var(--accent)" strokeWidth="3"
            />
            {points.map((p, i) => (
                <circle key={i} cx={50 + p.x * 2} cy={300 - p.y * 2} r="3" fill="var(--accent)" opacity={i === Math.floor(intensity * 19) ? 1 : 0.3} />
            ))}
            <text x="250" y="350" textAnchor="middle" fill="var(--slate-500)" fontSize="10">Training steps $\to$ Higher variance at $T$</text>
        </g>
    );
  };

  return (
    <div className="w-full h-[450px] flex flex-col items-center justify-center p-8 bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl relative overflow-hidden group">
      <defs>
        <marker id="arrow-gray" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="var(--slate-500)" /></marker>
        <marker id="arrow-blue" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="var(--accent)" /></marker>
        <marker id="arrow-gold" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="var(--amber-400)" /></marker>
      </defs>

      <svg viewBox={`0 0 ${VIZ_WIDTH} ${VIZ_HEIGHT}`} className="w-full h-auto max-w-lg">
        {mode === 'denoising-simulator' && renderDenoisingGrid()}
        {mode === 'u-net-flow' && renderUNetFlow()}
        {mode === 'cfg-viz' && renderCFG()}
        {mode === 'noise-schedule-viz' && renderNoiseSchedule()}
        {mode === 'diffusion-overview' && (
            <g>
                <rect x="50" y="150" width="80" height="80" fill="var(--accent)" rx="8" />
                <text x="90" y="250" textAnchor="middle" fill="var(--accent)" fontSize="10">x0 (Data)</text>
                <path d="M 130 190 L 370 190" stroke="var(--slate-700)" strokeWidth="2" markerEnd="url(#arrow-blue)" />
                <circle cx="420" cy="190" r="40" fill="var(--slate-800)" stroke="var(--slate-600)" strokeDasharray="4,4" />
                <text x="420" y="250" textAnchor="middle" fill="var(--slate-500)" fontSize="10">xT (Noise)</text>
                <text x="250" y="170" textAnchor="middle" fill="var(--slate-500)" fontSize="12">FORWARD $\to$</text>
                <text x="250" y="220" textAnchor="middle" fill="var(--slate-500)" fontSize="12">$\gets$ REVERSE</text>
            </g>
        )}
        {mode === 'forward-noise-viz' && (
            <g>
                {Array.from({length: 5}).map((_, i) => (
                    <g key={i} transform={`translate(${50 + i*100}, 150)`}>
                        <rect width="60" height="60" fill="var(--accent)" opacity={1 - i/4} rx="4" />
                        <rect width="60" height="60" fill="white" opacity={i/4 * 0.5} rx="4" />
                        <text y="80" x="30" textAnchor="middle" fill="var(--slate-500)" fontSize="10">t={i*250}</text>
                    </g>
                ))}
            </g>
        )}
        {mode === 'predict-noise-viz' && (
            <g>
                <rect x="50" y="150" width="100" height="100" fill="var(--slate-800)" stroke="white" strokeWidth="1" strokeOpacity="0.5" />
                <path d="M 150 200 L 250 200" stroke="var(--accent)" strokeWidth="3" markerEnd="url(#arrow-blue)" />
                <rect x="250" y="150" width="100" height="100" fill="white" opacity="0.4" stroke="var(--accent)" />
                <text x="100" y="270" textAnchor="middle" fill="var(--slate-400)" fontSize="10">NOISY INPUT</text>
                <text x="300" y="270" textAnchor="middle" fill="var(--accent)" fontSize="10">PREDICTED NOISE</text>
            </g>
        )}
        {mode === 'reverse-denoise-viz' && (
            <g>
                {Array.from({length: 5}).map((_, i) => (
                    <g key={i} transform={`translate(${450 - i*100}, 150)`}>
                        <rect width="60" height="60" fill="white" opacity={1 - i/4} rx="4" />
                        <rect width="60" height="60" fill="var(--accent)" opacity={i/4} rx="4" />
                        <text y="80" x="30" textAnchor="middle" fill="var(--slate-500)" fontSize="10">step={i*10}</text>
                    </g>
                ))}
            </g>
        )}
        {mode === 'conditioning-viz' && (
            <g>
                <text x="50" y="50" fill="var(--amber-400)" fontSize="12" fontWeight="bold">PROMPT: &quot;A cyber cat&quot;</text>
                <path d="M 120 60 L 250 150" stroke="var(--amber-400)" strokeDasharray="4,4" markerEnd="url(#arrow-gold)" />
                <rect x="250" y="150" width="100" height="100" fill="var(--slate-800)" stroke="var(--accent)" />
                <circle cx="300" cy="200" r="30" fill="var(--accent)" opacity="0.3" />
                <text x="300" y="270" textAnchor="middle" fill="var(--slate-500)" fontSize="10">Cross-Attention Guidance</text>
            </g>
        )}
        {mode === 'latent-viz' && (
            <g>
                <rect x="50" y="100" width="200" height="200" fill="var(--slate-800)" stroke="var(--slate-600)" />
                <text x="150" y="320" textAnchor="middle" fill="var(--slate-500)">Pixel Space (512x512)</text>
                <path d="M 250 200 L 350 200" stroke="var(--accent)" strokeWidth="4" markerEnd="url(#arrow-blue)" />
                <rect x="350" y="150" width="100" height="100" fill="var(--accent)" opacity="0.2" stroke="var(--accent)" />
                <text x="400" y="270" textAnchor="middle" fill="var(--accent)" fontSize="10">Latent Space (64x64)</text>
            </g>
        )}
        {mode === 'multimodal-viz' && (
            <g>
                <rect x="50" y="100" width="100" height="100" fill="var(--slate-800)" stroke="var(--accent)" />
                <text x="100" y="220" textAnchor="middle" fill="var(--slate-500)" fontSize="10">IMAGE</text>
                <path d="M 150 150 L 250 150" stroke="var(--slate-700)" markerEnd="url(#arrow-blue)" />
                <rect x="250" y="100" width="100" height="100" fill="var(--slate-800)" stroke="#10b981" />
                <path d="M 260 150 L 340 150" stroke="#10b981" strokeWidth="2" opacity="0.5" />
                <text x="300" y="220" textAnchor="middle" fill="#10b981" fontSize="10">AUDIO (Spectrogram)</text>
                <path d="M 350 150 L 450 150" stroke="var(--slate-700)" markerEnd="url(#arrow-blue)" />
                <rect x="450" y="100" width="40" height="100" fill="var(--slate-800)" stroke="#f43f5e" />
                <text x="470" y="220" textAnchor="middle" fill="#f43f5e" fontSize="10">VIDEO</text>
            </g>
        )}
        {mode === 'unet-viz' && renderUNetFlow()}
      </svg>
      
      {!['denoising-simulator', 'u-net-flow', 'cfg-viz', 'noise-schedule-viz', 'diffusion-overview', 'forward-noise-viz', 'predict-noise-viz', 'reverse-denoise-viz', 'conditioning-viz', 'latent-viz', 'multimodal-viz', 'unet-viz'].includes(mode) && (
          <div className="text-slate-500 font-mono text-xs uppercase animate-pulse">
            MODE: {mode.replace(/-/g, ' ')}
          </div>
      )}
      <div className="mt-6 flex gap-4 text-[10px] uppercase tracking-widest font-bold text-slate-500 border-t border-slate-800 pt-4 w-full justify-center">
        <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-indigo-500" /> Signal</span>
        <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-slate-500" /> Noise</span>
        <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-400" /> Guidance</span>
      </div>
    </div>
  );
}
