'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';

interface AttentionVisualizationProps {
  mode?: string;
  query?: number[];
  keys?: number[][];
  values?: (number[] | string)[];
  draggableQuery?: boolean;
  showScores?: boolean;
  showSoftmax?: boolean;
  showOutput?: boolean;
  onQueryChange?: (query: number[]) => void;
}

export default function AttentionVisualization(props: AttentionVisualizationProps) {
  const {
    mode = 'interactive',
    query: initialQuery = [1, 0],
    keys = [[1, 0], [0, 1]],
    values = ['A', 'B'],
    draggableQuery = false,
    showScores = false,
    showSoftmax = false,
    showOutput = false,
    onQueryChange,
  } = props;

  const [query, setQuery] = useState<number[]>(initialQuery);
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (props.query) {
      const frame = requestAnimationFrame(() => setQuery(props.query!));
      return () => cancelAnimationFrame(frame);
    }
  }, [props.query]);

  // Handle Dragging
  const activeHandle = useRef<boolean>(false);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!draggableQuery) return;
    activeHandle.current = true;
    (e.target as SVGElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!activeHandle.current || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    // Center point is 50%, 50%
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    
    // Convert to relative coordinates (-1 to 1 range roughly based on radius)
    const radius = Math.min(rect.width, rect.height) * 0.4;
    
    let x = (e.clientX - rect.left - cx) / radius;
    let y = -(e.clientY - rect.top - cy) / radius; // y is inverted in SVG/DOM vs Math
    
    // Normalize to length 1 (optional, but good for attention Q/K vectors)
    const mag = Math.sqrt(x*x + y*y);
    if (mag > 0) {
      x /= mag;
      y /= mag;
    } else {
      x = 1; y = 0;
    }

    const newQuery = [x, y];
    setQuery(newQuery);
    if (onQueryChange) onQueryChange(newQuery);
  };

  const handlePointerUp = () => {
    activeHandle.current = false;
  };

  // Calculations
  const scores = keys.map((k) => {
    const qx = query[0] || 0;
    const qy = query[1] || 0;
    const kx = k[0] || 0;
    const ky = k[1] || 0;
    return qx * kx + qy * ky; // Dot product
  });
  
  // Softmax safely
  const maxScore = Math.max(...scores);
  const exps = scores.map(s => Math.exp(s - maxScore)); // numerical stability
  const sumExps = exps.reduce((a, b) => a + b, 0);
  const softmax = exps.map(e => e / sumExps);
  
  // Output Value sum (if numeric values)
  let outX = 0;
  let outY = 0;
  let isNumericValues = false;
  
  if (values && values.length > 0 && Array.isArray(values[0])) {
    isNumericValues = true;
    for (let i = 0; i < values.length; i++) {
        outX += softmax[i] * ((values[i] as number[])[0] || 0);
        outY += softmax[i] * ((values[i] as number[])[1] || 0);
    }
  }

  // Draw Helpers
  const renderVector = (v: number[], color: string, label: string) => {
    const x = v[0] * 120;
    const y = -v[1] * 120;
    return (
      <g key={label}>
        <line x1="0" y1="0" x2={x} y2={y} stroke={color} strokeWidth="3" markerEnd={`url(#head-${label})`} />
        <text x={x + 10} y={y - 10} fill={color} fontSize="14" fontWeight="bold">{label}</text>
      </g>
    );
  };

  // ── Mode: Database Analogy ──
  const renderDatabase = () => (
    <div className="flex flex-col items-center gap-6 w-full">
        <div className="flex gap-8 items-end">
            <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center text-xl shadow-lg ring-4 ring-orange-500/20">🔍</div>
                <span className="text-[10px] mt-2 font-bold text-orange-400">QUERY</span>
            </div>
            <div className="h-1 w-12 bg-slate-800 rounded-full mb-6" />
            <div className="flex flex-col gap-2">
                {['K1: Apple', 'K2: Banana', 'K3: Cherry'].map((item, i) => (
                    <div key={i} className="px-3 py-1 bg-slate-800 border border-slate-700 rounded text-xs text-slate-300 flex justify-between gap-4">
                        <span>{item}</span>
                        <span className="text-blue-400 font-bold opacity-50">K{i+1}</span>
                    </div>
                ))}
                <span className="text-[10px] text-center font-bold text-blue-400">KEYS & VALUES</span>
            </div>
        </div>
    </div>
  );

  // ── Mode: Self-Attention ──
  const renderSelfAttention = () => (
    <div className="flex flex-col items-center gap-8 w-full p-4">
        <div className="flex gap-4">
            {['The', 'cat', 'sat'].map((word, i) => (
                <div key={i} className="relative group">
                    <div className="px-4 py-2 bg-slate-800 rounded border border-slate-700 text-white font-bold">{word}</div>
                    <div className="absolute inset-x-0 -bottom-8 flex justify-center opacity-40 group-hover:opacity-100 transition-opacity">
                        <div className="w-0.5 h-6 bg-indigo-500" />
                    </div>
                </div>
            ))}
        </div>
        <div className="text-[10px] text-slate-500 font-mono italic">Each word attends to every other word</div>
    </div>
  );

  if (mode === 'database') return <div className="p-8 bg-slate-900 rounded-xl border border-slate-800 flex justify-center">{renderDatabase()}</div>;
  if (mode === 'self-attention') return <div className="p-8 bg-slate-900 rounded-xl border border-slate-800 flex justify-center">{renderSelfAttention()}</div>;

  return (
    <div className="w-full flex flex-col md:flex-row gap-6 items-center justify-center p-6 bg-slate-900 rounded-xl max-w-4xl mx-auto border border-slate-800 shadow-xl">
      
      {/* Visual Vector Field */}
      <div className="relative w-64 h-64 shrink-0 bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
        <svg
          ref={svgRef}
          viewBox="-150 -150 300 300"
          className="w-full h-full"
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <defs>
            <marker id="head-Q" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#fb923c" />
            </marker>
            {keys.map((_, i) => (
              <marker key={`head-K${i}`} id={`head-K${i}`} markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#60a5fa" />
              </marker>
            ))}
          </defs>

          {/* Grid lines */}
          <line x1="-150" y1="0" x2="150" y2="0" stroke="rgba(255,255,255,0.1)" />
          <line x1="0" y1="-150" x2="0" y2="150" stroke="rgba(255,255,255,0.1)" />
          <circle cx="0" cy="0" r="120" fill="none" stroke="rgba(255,255,255,0.05)" />

          {/* Keys */}
          {keys.map((k, i) => renderVector(k as number[], '#60a5fa', `K${i}`))}
          
          {/* Query */}
          {renderVector(query, '#fb923c', 'Q')}

          {/* Draggable handle for Query */}
          {draggableQuery && (
            <circle 
              cx={query[0] * 120} cy={-query[1] * 120} r="15" 
              fill="rgba(251, 146, 60, 0.4)" stroke="#fb923c" strokeWidth="2"
              className="cursor-pointer"
              onPointerDown={handlePointerDown}
            />
          )}
        </svg>
      </div>

      {/* Math Panel */}
      <div className="flex flex-col gap-4 w-full max-w-sm text-sm font-mono text-slate-300">
        {keys.map((k, i) => (
          <div key={`k${i}`} className="flex flex-col gap-1 p-3 bg-slate-800 rounded border border-slate-700">
            <div className="flex justify-between items-center text-blue-400">
              <span className="font-bold">Key {i}</span>
              <span>[{k[0]?.toFixed(2) || 0}, {k[1]?.toFixed(2) || 0}]</span>
            </div>
            
            {(showScores || showSoftmax) && (
              <div className="flex justify-between items-center text-slate-400 border-t border-slate-700 pt-1 mt-1">
                <span>Score (Q·K)</span>
                <span className={scores[i] > 0 ? "text-amber-400" : ""}>{scores[i].toFixed(2)}</span>
              </div>
            )}
            
            {showSoftmax && (
              <div className="flex justify-between items-center text-emerald-400 border-t border-slate-700 pt-1 mt-1">
                <span>Weight (Softmax)</span>
                <span className="font-bold">{(softmax[i] * 100).toFixed(1)}%</span>
              </div>
            )}

            {showSoftmax && values[i] !== undefined && (
              <div className="flex justify-between items-center text-purple-400 border-t border-slate-700 pt-1 mt-1">
                <span>Value</span>
                <span>{Array.isArray(values[i]) ? `[${values[i].join(', ')}]` : values[i]}</span>
              </div>
            )}
            
            {/* Visual bar graph of weight */}
            {showSoftmax && (
               <div className="w-full h-1 bg-slate-900 mt-2 rounded overflow-hidden">
                  <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${softmax[i] * 100}%` }}></div>
               </div>
            )}
          </div>
        ))}

        {showOutput && isNumericValues && (
          <div className="mt-4 p-4 bg-purple-900/40 rounded border border-purple-500/50 flex flex-col gap-2">
            <span className="text-purple-300 font-bold uppercase text-xs tracking-wider">Final Output</span>
            <span className="text-xl text-white font-bold">
              [{outX.toFixed(2)}, {outY.toFixed(2)}]
            </span>
            <span className="text-xs text-purple-200/60">∑ (Weight_i × Value_i)</span>
          </div>
        )}
      </div>
      
    </div>
  );
}
