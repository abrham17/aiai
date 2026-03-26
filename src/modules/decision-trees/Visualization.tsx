'use client';

import React, { useState, useEffect, useMemo } from 'react';

interface DecisionTreeVisualizationProps {
  mode?: string;
  dataset?: string;
  initialP?: number;
  splitX?: number;
  maxDepth?: number;
  interactive?: boolean;
}

const generatePoints = (type: string) => {
  const pts: { x: number; y: number; cls: number }[] = [];
  if (type === 'simple-split' || type === 'boxes' || type === 'challenge-dist') {
    for (let i = 0; i < 40; i++) {
      const x = Math.random() * 10;
      const y = Math.random() * 10;
      // Simple vertical split at x=5
      const splitVal = type === 'challenge-dist' ? 6.5 : 5;
      const noise = (Math.random() - 0.5) * 1.5;
      const cls = x + noise > splitVal ? 1 : 0;
      pts.push({ x, y, cls });
    }
  } else if (type === 'overlapping') {
    for (let i = 0; i < 50; i++) {
      pts.push({ x: Math.random() * 7, y: Math.random() * 10, cls: 0 });
      pts.push({ x: 3 + Math.random() * 7, y: Math.random() * 10, cls: 1 });
    }
  }
  return pts;
};

const calculateEntropy = (pts: { cls: number }[]) => {
  if (pts.length === 0) return 0;
  const count0 = pts.filter(p => p.cls === 0).length;
  const count1 = pts.length - count0;
  const p0 = count0 / pts.length;
  const p1 = count1 / pts.length;
  if (p0 === 0 || p1 === 0) return 0;
  return -(p0 * Math.log2(p0) + p1 * Math.log2(p1));
};

export default function DecisionTreeVisualization(props: DecisionTreeVisualizationProps) {
  const {
    mode = 'partition',
    dataset = 'simple-split',
    initialP = 0.5,
    splitX: initialSplitX = 5,
    maxDepth = 3,
    interactive = false,
  } = props;

  const [p, setP] = useState(initialP);
  const [splitX, setSplitX] = useState(initialSplitX);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  useEffect(() => {
    if (props.initialP !== undefined) {
      requestAnimationFrame(() => setP(props.initialP!));
    }
  }, [props.initialP]);

  useEffect(() => {
    if (props.splitX !== undefined) {
      requestAnimationFrame(() => setSplitX(props.splitX!));
    }
  }, [props.splitX]);

  const points = useMemo(() => generatePoints(dataset), [dataset]);

  // Entropy Mode
  if (mode === 'entropy-viz') {
    const entropy = p === 0 || p === 1 ? 0 : -(p * Math.log2(p) + (1 - p) * Math.log2(1 - p));
    
    // Generate entropy curve path
    const curvePoints = [];
    for (let i = 0; i <= 100; i++) {
        const px = i / 100;
        const h = px === 0 || px === 1 ? 0 : -(px * Math.log2(px) + (1 - px) * Math.log2(1 - px));
        curvePoints.push(`${px * 200},${150 - h * 100}`);
    }

    return (
      <div className="w-full flex flex-col gap-6 items-center justify-center p-6 bg-slate-900 rounded-xl max-w-4xl mx-auto font-mono">
        <div className="relative w-full max-w-sm h-[200px] bg-slate-800 rounded border border-slate-700 p-4">
           <svg viewBox="0 0 200 150" className="w-full h-full overflow-visible">
              <path d={`M ${curvePoints.join(' L ')}`} fill="none" stroke="#60a5fa" strokeWidth="2" />
              <line x1={p * 200} y1="0" x2={p * 200} y2="150" stroke="rgba(255,255,255,0.2)" strokeDasharray="4,4" />
              <circle cx={p * 200} cy={150 - entropy * 100} r="5" fill="#f59e0b" />
           </svg>
           <div className="absolute top-2 left-2 text-[10px] text-slate-400">Entropy Curve H(p)</div>
        </div>

        <div className="w-full max-w-sm flex flex-col gap-4 p-4 bg-slate-800 rounded border border-slate-700">
           <div className="flex justify-between items-center">
              <span className="text-slate-400 text-xs">P(Class 1):</span>
              <span className="text-blue-400 font-bold">{(p * 100).toFixed(1)}%</span>
           </div>
           <input type="range" min="0" max="1" step="0.01" value={p} onChange={(e) => setP(parseFloat(e.target.value))} className="w-full" />
           <div className="pt-2 border-t border-slate-700 flex justify-between items-center">
              <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Entropy</span>
              <span className="text-xl text-amber-400 font-bold">{entropy.toFixed(3)}</span>
           </div>
        </div>
      </div>
    );
  }

  // Info Gain Mode
  if (mode === 'infogain-viz' || mode === 'partition' || mode === 'overfit-viz') {
    const leftPts = points.filter(p => p.x < splitX);
    const rightPts = points.filter(p => p.x >= splitX);
    
    const hParent = calculateEntropy(points);
    const hLeft = calculateEntropy(leftPts);
    const hRight = calculateEntropy(rightPts);
    
    const infoGain = hParent - ((leftPts.length / points.length) * hLeft + (rightPts.length / points.length) * hRight);

    return (
      <div className="w-full flex flex-col md:flex-row gap-6 items-center justify-center p-6 bg-slate-900 rounded-xl max-w-5xl mx-auto font-mono">
        {/* Data Plot */}
        <div className="relative w-full max-w-[400px] aspect-square bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
          <svg viewBox="0 0 100 100" className="w-full h-full" onMouseMove={(e) => {
            if (!interactive) return;
            const rect = e.currentTarget.getBoundingClientRect();
            setSplitX(((e.clientX - rect.left) / rect.width) * 10);
          }}>
            <line x1={splitX * 10} y1="0" x2={splitX * 10} y2="100" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4,2" />
            <rect x="0" y="0" width={splitX * 10} height="100" fill="rgba(245, 158, 11, 0.05)" />
            
            {points.map((pt, i) => (
              <circle key={i} cx={pt.x * 10} cy={100 - pt.y * 10} r="2" fill={pt.cls === 0 ? '#ef4444' : '#3b82f6'} stroke="#fff" strokeWidth="0.3" opacity={0.8} />
            ))}
          </svg>
          <div className="absolute bottom-2 right-2 text-[10px] text-slate-500">Feature X1</div>
        </div>

        {/* Math/Tree Panel */}
        <div className="flex flex-col gap-4 w-full max-w-xs shrink-0 bg-slate-800 p-4 rounded border border-slate-700 text-xs">
          <h3 className="text-blue-400 font-bold uppercase tracking-wider border-b border-slate-700 pb-2 mb-2">Split Analysis</h3>
          
          <div className="p-2 bg-slate-900 rounded border border-slate-700 space-y-1">
             <div className="text-slate-400">Parent Entropy: <span className="text-white">{hParent.toFixed(3)}</span></div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-2">
             <div className="p-2 bg-slate-900/50 rounded border border-amber-500/30">
                <div className="text-amber-500 font-bold">Left Child</div>
                <div className="text-[10px]">n={leftPts.length}</div>
                <div className="mt-1">H: {hLeft.toFixed(3)}</div>
             </div>
             <div className="p-2 bg-slate-900/50 rounded border border-amber-500/30">
                <div className="text-amber-500 font-bold">Right Child</div>
                <div className="text-[10px]">n={rightPts.length}</div>
                <div className="mt-1">H: {hRight.toFixed(3)}</div>
             </div>
          </div>

          <div className="mt-4 p-3 bg-emerald-900/30 border border-emerald-500/50 rounded flex flex-col items-center">
             <span className="text-emerald-400 font-bold uppercase tracking-tighter text-[10px]">Information Gain</span>
             <span className="text-2xl text-white font-bold infogain-val">{infoGain.toFixed(3)}</span>
             <span className="text-[9px] text-emerald-200/50 mt-1">H(P) - ∑ |Ci|/|P| * H(Ci)</span>
          </div>

          {interactive && (
            <div className="mt-2 text-center text-slate-500 italic">
               Drag mouse over plot to find best split
            </div>
          )}
        </div>
      </div>
    );
  }

  return <div>Decision Tree visualization placeholder for mode: {mode}</div>;
}
