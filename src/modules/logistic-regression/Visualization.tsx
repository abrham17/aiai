'use client';

import React, { useState, useEffect, useRef } from 'react';

interface Point {
  x: number;
  y: number;
  class: number;
}

interface LogisticRegressionVisualizationProps {
  mode?: string;
  points?: Point[];
  line?: { m: number; b: number };
  weights?: { w1: number; w2?: number; b: number };
  interactive?: boolean;
}

export default function LogisticRegressionVisualization(props: LogisticRegressionVisualizationProps) {
  const {
    mode = '1d-linear',
    points: initialPoints = [{ x: 5, y: 1, class: 1 }],
    line: initialLine = { m: 1, b: 0 },
    weights: initialWeights = { w1: 1, w2: 0, b: -5 },
    interactive = false,
  } = props;

  const [points, setPoints] = useState<Point[]>(initialPoints);
  const [line, setLine] = useState(initialLine);
  const [weights, setWeights] = useState(initialWeights);
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (props.points) {
      const frame = requestAnimationFrame(() => setPoints(props.points!));
      return () => cancelAnimationFrame(frame);
    }
  }, [props.points]);

  useEffect(() => {
    if (props.line) {
      const frame = requestAnimationFrame(() => setLine(props.line!));
      return () => cancelAnimationFrame(frame);
    }
  }, [props.line]);

  useEffect(() => {
    if (props.weights) {
      const frame = requestAnimationFrame(() => setWeights(props.weights!));
      return () => cancelAnimationFrame(frame);
    }
  }, [props.weights]);

  // Math Helpers
  const sigmoid = (z: number) => 1 / (1 + Math.exp(-z));
  const calcLogLoss = () => {
    let loss = 0;
    for (const p of points) {
      // If 1D, use w1*x + b. If 2D, use w1*x + w2*y + b
      let z = weights.w1 * p.x + weights.b;
      if (mode.includes('2d')) {
         z += (weights.w2 || 0) * p.y;
      }
      const prob = sigmoid(z);
      // epsilon to prevent log(0)
      const eps = 1e-15;
      loss += - (p.class * Math.log(prob + eps) + (1 - p.class) * Math.log(1 - prob + eps));
    }
    return points.length > 0 ? loss / points.length : 0;
  };

  const getSigmoidPath = () => {
    let d = '';
    // X goes from 0 to 20 visually maybe? Or -5 to +15. Let's use 0 to 20 for SVG mapping
    for (let x = -5; x <= 25; x += 0.5) {
      const z = weights.w1 * x + weights.b;
      const prob = sigmoid(z);
      // Map to SVG coordinates (x: 0->300 = -5->25), y: 300->0 = 0->1
      const svgX = (x + 5) * 10;
      const svgY = 250 - prob * 200; // bottom is 250, top is 50
      if (d === '') d += `M ${svgX} ${svgY} `;
      else d += `L ${svgX} ${svgY} `;
    }
    return d;
  };

  const currentLoss = calcLogLoss();

  return (
    <div className="w-full flex flex-col md:flex-row gap-6 items-center justify-center p-6 bg-slate-900 rounded-xl max-w-4xl mx-auto">
      
      {/* Visualization Canvas */}
      <div className="relative w-full max-w-[400px] h-[300px] shrink-0 bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
        <svg
          ref={svgRef}
          viewBox="0 0 300 300"
          className="w-full h-full"
        >
          {/* Background Grid */}
          <line x1="0" y1="50" x2="300" y2="50" stroke="rgba(255,255,255,0.05)" />
          <line x1="0" y1="250" x2="300" y2="250" stroke="rgba(255,255,255,0.1)" />
          <text x="5" y="45" fill="rgba(255,255,255,0.3)" fontSize="10">Prob = 1 (Class 1)</text>
          <text x="5" y="245" fill="rgba(255,255,255,0.3)" fontSize="10">Prob = 0 (Class 0)</text>

          {mode === '1d-linear' && (
            <line 
                x1="0" y1={300 - (line.m * -5 + line.b) * 200}
                x2="300" y2={300 - (line.m * 25 + line.b) * 200}
                stroke="#60a5fa" strokeWidth="2" strokeDasharray="5,5"
            />
          )}

          {mode.includes('1d-sigmoid') || mode === 'log-loss' ? (
             <path d={getSigmoidPath()} fill="none" stroke="#fbbf24" strokeWidth="3" />
          ) : null}

          {mode.includes('2d') && (
            <g>
              {/* Decision Boundary Line: w1*x + w2*y + b = 0 => y = (-w1*x - b)/w2 */}
              <line 
                x1="0" y1={weights.w2 ? 300 - ((-weights.w1 * 0 - weights.b)/weights.w2) * 30 : 0}
                x2="300" y2={weights.w2 ? 300 - ((-weights.w1 * 10 - weights.b)/weights.w2) * 30 : 300}
                stroke="#ec4899" strokeWidth="3"
              />
              <text x="10" y="20" fill="#ec4899" fontSize="12" fontWeight="bold">Decision Boundary (p=0.5)</text>
              {/* Gradient approximation / side shading */}
              <polygon points="0,0 300,0 300,300 0,300" fill="#ec4899" opacity="0.05" />
            </g>
          )}

          {/* Points */}
          {points.map((p, i) => {
             // Map logic based on mode
             let svgX, svgY;
             if (mode.includes('2d')) {
                svgX = p.x * 30;
                svgY = 300 - p.y * 30; // standard cartesian
             } else {
                svgX = (p.x + 5) * 10;
                svgY = 250 - p.y * 200; // y=0 -> 250, y=1 -> 50
             }

             return (
               <g key={i}>
                {/* Draw residual if in log-loss mode */}
                {mode === 'log-loss' && (
                  <line 
                    x1={svgX} y1={svgY} 
                    x2={svgX} y2={250 - sigmoid(weights.w1 * p.x + weights.b) * 200}
                    stroke="rgba(251, 191, 36, 0.4)" strokeWidth="2" strokeDasharray="4,4"
                  />
                )}
                <circle 
                  cx={svgX} cy={svgY} r="6" 
                  fill={p.class === 1 ? '#ef4444' : '#3b82f6'} 
                  stroke="#fff" strokeWidth="1.5"
                />
               </g>
             );
          })}
        </svg>
      </div>

      {/* Info Panel */}
      <div className="flex flex-col gap-4 w-full max-w-sm font-mono text-slate-300">
        <div className="p-4 bg-slate-800 rounded border border-slate-700 flex flex-col gap-4">
           
           <h3 className="text-blue-400 font-bold uppercase tracking-wider text-xs border-b border-slate-700 pb-2">Model Parameters</h3>
           
           <div className="flex justify-between items-center text-sm">
             <span>Weight (w1):</span> <span className="text-white font-bold">{weights.w1.toFixed(2)}</span>
           </div>
           
           {(mode.includes('2d') || weights.w2 !== undefined) && (
             <div className="flex justify-between items-center text-sm">
               <span>Weight (w2):</span> <span className="text-white font-bold">{(weights.w2 || 0).toFixed(2)}</span>
             </div>
           )}

           <div className="flex justify-between items-center text-sm">
             <span>Bias (b):</span> <span className="text-white font-bold">{weights.b.toFixed(2)}</span>
           </div>

           {(mode.includes('sigmoid') || mode.includes('log-loss') || mode.includes('challenge')) && (
               <div className="mt-4 flex justify-between items-center text-lg bg-slate-900 border border-slate-700 p-3 rounded">
                  <span className="text-slate-400 text-xs uppercase tracking-wider">Log Loss (Cross-Entropy)</span> 
                  <span className={currentLoss < 0.2 ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>
                    {currentLoss.toFixed(4)}
                  </span>
               </div>
           )}
        </div>
      </div>
    </div>
  );
}
