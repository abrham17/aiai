'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';

interface OptimizersVisualizationProps {
  mode?: string;
  surface?: string;
  optimizers?: string[];
  lr?: number;
  beta?: number;
  interactive?: boolean;
}

// Surface functions
const surfaces: Record<string, (x: number, y: number) => number> = {
  bowl: (x, y) => (x * x + y * y) * 0.1,
  ravine: (x, y) => (x * x * 0.01 + y * y) * 0.1,
  saddle: (x, y) => (x * x - y * y) * 0.1 + 5,
  'local-minima': (x, y) => (Math.sin(x) + Math.cos(y)) * 0.5 + (x * x + y * y) * 0.05 + 2,
};

// Gradients
const getGradients = (surface: string, x: number, y: number) => {
  const h = 0.001;
  const f = surfaces[surface];
  const gx = (f(x + h, y) - f(x - h, y)) / (2 * h);
  const gy = (f(x, y + h) - f(x, y - h)) / (2 * h);
  return { gx, gy };
};

export default function OptimizersVisualization(props: OptimizersVisualizationProps) {
  const {
    mode = 'landscape-viz',
    surface = 'bowl',
    optimizers = ['sgd', 'momentum', 'adam'],
    lr = 0.1,
    beta = 0.9,
    interactive = false,
  } = props;

  const [agents, setAgents] = useState<{ id: string, x: number, y: number, vx: number, vy: number, mx: number, my: number, vx2: number, vy2: number, path: [number, number][] }[]>([]);
  const frameRef = useRef<number>(0);

  // Initialize agents
  useEffect(() => {
    const initialAgents = optimizers.map(id => ({
      id,
      x: -8 + Math.random() * 4,
      y: 8 - Math.random() * 4,
      vx: 0, vy: 0,
      mx: 0, my: 0,
      vx2: 0, vy2: 0,
      path: [] as [number, number][]
    }));
    requestAnimationFrame(() => setAgents(initialAgents));
  }, [surface, optimizers.join(',')]);

  useEffect(() => {
    const step = () => {
      setAgents(prev => prev.map(a => {
        const { gx, gy } = getGradients(surface, a.x, a.y);
        let nx = a.x, ny = a.y, nvx = a.vx, nvy = a.vy, nmx = a.mx, nmy = a.my, nvx2 = a.vx2, nvy2 = a.vy2;

        if (a.id === 'sgd') {
           nx -= lr * gx;
           ny -= lr * gy;
        } else if (a.id === 'momentum') {
           nvx = beta * a.vx + (1 - beta) * gx;
           nvy = beta * a.vy + (1 - beta) * gy;
           nx -= lr * nvx * 5; // scaled for visibility
           ny -= lr * nvy * 5;
        } else if (a.id === 'adam') {
           const beta1 = 0.9, beta2 = 0.999, eps = 1e-8;
           nmx = beta1 * a.mx + (1 - beta1) * gx;
           nmy = beta1 * a.my + (1 - beta1) * gy;
           nvx2 = beta2 * a.vx2 + (1 - beta2) * (gx * gx);
           nvy2 = beta2 * a.vy2 + (1 - beta2) * (gy * gy);
           
           // Bias correction simplified for viz
           nx -= (lr * nmx) / (Math.sqrt(nvx2) + eps);
           ny -= (lr * nmy) / (Math.sqrt(nvy2) + eps);
        }

        const newPath = [...a.path, [nx, ny]] as [number, number][];
        if (newPath.length > 50) newPath.shift();

        return { ...a, x: nx, y: ny, vx: nvx, vy: nvy, mx: nmx, my: nmy, vx2: nvx2, vy2: nvy2, path: newPath };
      }));
      frameRef.current = requestAnimationFrame(step);
    };

    frameRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameRef.current);
  }, [surface, lr, beta]);

  const dropAgent = (ex: number, ey: number) => {
     if (!interactive) return;
     const nx = (ex / 400) * 20 - 10;
     const ny = 10 - (ey / 400) * 20;
     setAgents(prev => prev.map(a => ({ ...a, x: nx, y: ny, path: [] })));
  };

  const currentMinLoss = Math.min(...agents.map(a => surfaces[surface](a.x, a.y)));

  return (
    <div className="w-full flex flex-col md:flex-row gap-6 items-center justify-center p-6 bg-slate-900 rounded-xl max-w-5xl mx-auto font-mono">
      {/* 2D Contour Map (Representing 3D surface) */}
      <div className="relative w-full max-w-[400px] aspect-square bg-slate-800 rounded-lg overflow-hidden border border-slate-700 cursor-copy">
        <svg viewBox="0 0 400 400" className="w-full h-full" onClick={(e) => {
           const rect = e.currentTarget.getBoundingClientRect();
           dropAgent(e.clientX - rect.left, e.clientY - rect.top);
        }}>
           {/* Simple static contours */}
           {[1, 2, 3, 4, 5, 8, 12].map(lvl => (
              <circle key={lvl} cx="200" cy="200" r={lvl * 20} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
           ))}
           
           {/* Agents and Paths */}
           {agents.map(a => (
              <g key={a.id}>
                 <polyline 
                    points={a.path.map(p => `${(p[0] + 10) * 20},${400 - (p[1] + 10) * 20}`).join(' ')}
                    fill="none" stroke={a.id === 'sgd' ? '#ef4444' : a.id === 'momentum' ? '#3b82f6' : '#10b981'}
                    strokeWidth="2" opacity="0.3"
                 />
                 <circle 
                    cx={(a.x + 10) * 20} 
                    cy={400 - (a.y + 10) * 20} 
                    r="5" 
                    fill={a.id === 'sgd' ? '#ef4444' : a.id === 'momentum' ? '#3b82f6' : '#10b981'}
                    stroke="white" strokeWidth="1"
                 />
              </g>
           ))}
        </svg>
        <div className="absolute top-2 left-2 text-[10px] text-slate-500 uppercase">Loss Contour Map</div>
        <div className="hidden min-loss-val">{currentMinLoss.toFixed(4)}</div>
      </div>

      {/* Stats/Legend */}
      <div className="flex flex-col gap-4 w-full max-w-xs shrink-0 bg-slate-800 p-4 rounded border border-slate-700 text-xs">
         <h3 className="text-blue-400 font-bold uppercase tracking-wider border-b border-slate-700 pb-2">Optimizer Race</h3>
         
         <div className="space-y-3">
            {agents.map(a => (
               <div key={a.id} className="flex flex-col gap-1">
                  <div className="flex justify-between items-center">
                     <span className="font-bold flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ background: a.id === 'sgd' ? '#ef4444' : a.id === 'momentum' ? '#3b82f6' : '#10b981' }} />
                        {a.id.toUpperCase()}
                     </span>
                     <span className="text-white">Loss: {surfaces[surface](a.x, a.y).toFixed(4)}</span>
                  </div>
                  <div className="w-full bg-slate-900 h-1 rounded overflow-hidden">
                     <div className="h-full bg-slate-600" style={{ width: `${Math.max(0, 100 - surfaces[surface](a.x, a.y) * 10)}%` }} />
                  </div>
               </div>
            ))}
         </div>

         <div className="mt-4 pt-4 border-t border-slate-700 space-y-2">
            <div className="flex justify-between">
               <span className="text-slate-500 text-[10px]">Learning Rate:</span>
               <span className="text-white font-bold">{lr}</span>
            </div>
            <div className="flex justify-between">
               <span className="text-slate-500 text-[10px]">Momentum β:</span>
               <span className="text-white font-bold">{beta}</span>
            </div>
         </div>

         {interactive && (
            <div className="mt-2 text-[10px] text-slate-400 italic text-center">
               Click anywhere on the map to restart the race from that point!
            </div>
         )}
      </div>
    </div>
  );
}
