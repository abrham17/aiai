'use client';

import React, { useState, useEffect, useMemo } from 'react';

interface SVMVisualizationProps {
  mode?: string;
  dataset?: string;
  showMargin?: boolean;
  highlightVectors?: boolean;
  cValue?: number;
  interactive?: boolean;
}

const generateSVMPoints = (type: string) => {
  const pts: { x: number; y: number; cls: number }[] = [];
  if (type === 'linearly-separable' || type === 'separable' || type === 'challenge-sep') {
      const gap = type === 'challenge-sep' ? 2 : 1.5;
      for (let i = 0; i < 15; i++) {
        pts.push({ x: 2 + Math.random() * 3, y: 2 + Math.random() * 6, cls: 0 });
        pts.push({ x: 2 + gap + 3 + Math.random() * 3, y: 2 + Math.random() * 6, cls: 1 });
      }
  } else if (type === 'noisy') {
      for (let i = 0; i < 20; i++) {
        pts.push({ x: 2 + Math.random() * 4, y: 2 + Math.random() * 6, cls: 0 });
        pts.push({ x: 6 + Math.random() * 4, y: 2 + Math.random() * 6, cls: 1 });
      }
      // Add a couple of outliers
      pts.push({ x: 7, y: 5, cls: 0 });
      pts.push({ x: 3, y: 3, cls: 1 });
  } else if (type === 'circles') {
      for (let i = 0; i < 40; i++) {
        const r = 2 + Math.random() * 1.5;
        const a = Math.random() * Math.PI * 2;
        pts.push({ x: 5 + r * Math.cos(a), y: 5 + r * Math.sin(a), cls: 0 });
        
        const r2 = 4.5 + Math.random() * 1.5;
        pts.push({ x: 5 + r2 * Math.cos(a), y: 5 + r2 * Math.sin(a), cls: 1 });
      }
  }
  return pts;
};

export default function SVMVisualization(props: SVMVisualizationProps) {
  const {
    mode = 'margin-viz',
    dataset = 'linearly-separable',
    showMargin = true,
    highlightVectors = false,
    cValue: initialC = 1.0,
    interactive = false,
  } = props;

  const [c, setC] = useState(initialC);
  const [angle, setAngle] = useState(0); // in degrees
  const [offset, setOffset] = useState(5.5);
  const [is3D, setIs3D] = useState(false);

  useEffect(() => {
    if (props.cValue !== undefined) {
      requestAnimationFrame(() => setC(props.cValue!));
    }
  }, [props.cValue]);

  const points = useMemo(() => generateSVMPoints(dataset), [dataset]);

  // Calculations for the separator line
  const rad = (angle * Math.PI) / 180;
  const normal = { x: Math.cos(rad), y: Math.sin(rad) };
  
  // Calculate margin width based on proximity of points to the line
  const dists = points.map(p => {
      // distance to line: |ax + by - d| / sqrt(a^2 + b^2)
      // where a = cos(rad), b = sin(rad), d = offset
      return (normal.x * p.x + normal.y * p.y - offset) * (p.cls === 0 ? -1 : 1);
  });
  
  const minMargin = Math.min(...dists);
  const marginWidth = Math.max(0, minMargin);
  const supportVectors = points.filter((_, i) => Math.abs(dists[i] - minMargin) < 0.2);

  // Kernel 3D Lift View
  if (mode === 'kernel-3d-viz') {
     return (
        <div className="w-full flex flex-col items-center justify-center p-6 bg-slate-900 rounded-xl max-w-4xl mx-auto font-mono">
           <div className={`relative w-full max-w-[500px] h-[400px] bg-slate-800 rounded-lg border border-slate-700 transition-all duration-1000 overflow-hidden ${is3D ? '[perspective:1000px]' : ''}`}>
              <div 
                 className={`w-full h-full relative transition-transform duration-1000 preserve-3d ${is3D ? '[transform:rotateX(60deg)_rotateZ(30deg)]' : ''}`}
                 style={{ transformStyle: 'preserve-3d' }}
              >
                  {/* Plane */}
                  <div className="absolute inset-x-10 inset-y-10 bg-slate-700/30 border border-slate-600 rounded" />
                  
                  {is3D && (
                     <div 
                        className="absolute inset-x-0 inset-y-0 border-2 border-emerald-500/50 bg-emerald-500/5 transition-opacity duration-1000"
                        style={{ transform: 'translateZ(30px)', opacity: is3D ? 1 : 0 }}
                     >
                        <div className="absolute top-2 left-2 text-emerald-400 text-[10px] font-bold">3D SEPARATING HYPERPLANE</div>
                     </div>
                  )}

                  {points.map((pt, i) => {
                     const z = is3D ? (Math.pow(pt.x - 5, 2) + Math.pow(pt.y - 5, 2)) * 3 : 0;
                     return (
                        <div 
                           key={i}
                           className={`absolute w-3 h-3 rounded-full border-2 border-white transition-all duration-700 ${pt.cls === 0 ? 'bg-red-500' : 'bg-blue-500'}`}
                           style={{ 
                              left: `${pt.x * 10}%`, 
                              top: `${pt.y * 10}%`,
                              transform: `translate(-50%, -50%) translateZ(${z}px)`,
                              transformStyle: 'preserve-3d'
                           }}
                        />
                     );
                  })}
              </div>
              
              <div className="absolute bottom-4 left-4 flex gap-2">
                 <button 
                    onClick={() => setIs3D(!is3D)}
                    className={`px-4 py-2 rounded font-bold text-xs transition-colors ${is3D ? 'bg-white text-slate-900' : 'bg-slate-700 text-slate-100'}`}
                 >
                    {is3D ? 'Reset to 2D' : 'Lift to 3D Space'}
                 </button>
              </div>
           </div>
           
           <div className="w-full max-w-[500px] p-4 bg-slate-800/50 rounded-b border-x border-b border-slate-700 text-xs text-slate-400 leading-relaxed italic">
              {is3D ? "In 3D space, a flat plane can easily slice between the inner and outer circles. This is the magic of kernels." : "These circular points are NOT linearly separable in 2D. No straight line works."}
           </div>
        </div>
     );
  }

  // Margin Boundary View
  return (
    <div className="w-full flex flex-col md:flex-row gap-6 items-center justify-center p-6 bg-slate-900 rounded-xl max-w-5xl mx-auto font-mono">
      {/* Data Plot */}
      <div className="relative w-full max-w-[400px] aspect-square bg-slate-800 rounded-lg overflow-hidden border border-slate-700 cursor-crosshair">
        <svg viewBox="0 0 100 100" className="w-full h-full" onMouseMove={(e) => {
          if (!interactive) return;
          const rect = e.currentTarget.getBoundingClientRect();
          const mx = ((e.clientX - rect.left) / rect.width) * 10;
          setOffset(mx);
        }}>
          {/* Margin Gutter */}
          {showMargin && marginWidth > 0 && (
             <g>
                <path 
                   d={`M ${ (offset - marginWidth) * Math.cos(rad) * 10 + 100 * Math.sin(rad) } ${ 100 - ( (offset - marginWidth) * Math.sin(rad) * 10 - 100 * Math.cos(rad) ) } 
                      L ${ (offset - marginWidth) * Math.cos(rad) * 10 - 100 * Math.sin(rad) } ${ 100 - ( (offset - marginWidth) * Math.sin(rad) * 10 + 100 * Math.cos(rad) ) }`}
                   stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" strokeDasharray="2,1"
                />
                
                {/* Simplified rectangle for margin - just for visual effect */}
                <rect 
                   x={(offset - marginWidth) * 10} y="0" width={marginWidth * 20} height="100"
                   fill="rgba(59, 130, 246, 0.1)"
                   transform={`rotate(${angle}, ${offset*10}, 50)`}
                />
             </g>
          )}

          {/* Separating Line */}
          <line 
             x1={offset * 10 - Math.sin(rad) * 100} y1={50 + Math.cos(rad) * 100} 
             x2={offset * 10 + Math.sin(rad) * 100} y2={50 - Math.cos(rad) * 100} 
             stroke="#fff" strokeWidth="1" 
          />
          
          {points.map((pt, i) => {
             const isSupport = highlightVectors && supportVectors.includes(pt);
             return (
              <circle key={i} cx={pt.x * 10} cy={100 - pt.y * 10} r={isSupport ? 3 : 2} 
                 fill={pt.cls === 0 ? '#ef4444' : '#3b82f6'} 
                 stroke={isSupport ? '#fff' : 'none'} 
                 strokeWidth="1" 
                 opacity={0.8} 
              />
             );
          })}
        </svg>
      </div>

      {/* Control Panel */}
      <div className="flex flex-col gap-4 w-full max-w-xs shrink-0 bg-slate-800 p-4 rounded border border-slate-700 text-xs">
          <h3 className="text-blue-400 font-bold uppercase tracking-wider border-b border-slate-700 pb-2">SVM Dynamics</h3>
          
          <div className="space-y-4">
             <div>
                <div className="flex justify-between mb-1">
                   <span>Rotation:</span>
                   <span className="text-white">{angle}°</span>
                </div>
                <input type="range" min="-45" max="45" value={angle} onChange={(e) => setAngle(parseInt(e.target.value))} className="w-full" />
             </div>
             
             <div>
                <div className="flex justify-between mb-1">
                   <span>Offset:</span>
                   <span className="text-white">{offset.toFixed(1)}</span>
                </div>
                <input type="range" min="0" max="10" step="0.1" value={offset} onChange={(e) => setOffset(parseFloat(e.target.value))} className="w-full" />
             </div>
          </div>

          <div className="mt-4 p-4 bg-emerald-900/30 border border-emerald-500/50 rounded flex flex-col items-center">
             <span className="text-emerald-400 font-bold uppercase tracking-tighter text-[10px]">Margin Width</span>
             <span className="text-3xl text-white font-bold margin-val">{marginWidth.toFixed(3)}</span>
          </div>
          
          <div className="text-[10px] text-slate-500 leading-relaxed mt-2">
             SVM maximizes the distance to the nearest points of any class. 
             {highlightVectors && " Support vectors are highlighted."}
          </div>
      </div>
    </div>
  );
}
