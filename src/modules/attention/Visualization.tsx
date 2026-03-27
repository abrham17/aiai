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
  ariaLabel?: string;
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

  // Keyboard support for draggable query
  const handleKeyDown = (e: React.KeyboardEvent<SVGSVGElement>) => {
    if (!draggableQuery) return;
    
    const step = 0.1;
    const newQuery = [...query];
    
    switch (e.key) {
      case 'ArrowUp':
        newQuery[1] = Math.min(1, query[1] + step);
        e.preventDefault();
        break;
      case 'ArrowDown':
        newQuery[1] = Math.max(-1, query[1] - step);
        e.preventDefault();
        break;
      case 'ArrowLeft':
        newQuery[0] = Math.max(-1, query[0] - step);
        e.preventDefault();
        break;
      case 'ArrowRight':
        newQuery[0] = Math.min(1, query[0] + step);
        e.preventDefault();
        break;
      default:
        return;
    }
    
    setQuery(newQuery);
    if (onQueryChange) onQueryChange(newQuery);
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
      <g key={label} role="img" aria-label={`${label} vector at (${v[0]?.toFixed(2) || 0}, ${v[1]?.toFixed(2) || 0})`}>
        <line x1="0" y1="0" x2={x} y2={y} stroke={color} strokeWidth="3" markerEnd={`url(#head-${label})`} style={{ willChange: 'transform' }} />
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

  // ── Mode: Softmax Visualization ──
  const renderSoftmax = () => (
    <div className="flex flex-col gap-6 w-full p-6">
      <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
        <p className="text-blue-400 font-bold mb-4">Raw Scores (Q·K)</p>
        <div className="space-y-2 mb-6">
          {scores.map((score, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-slate-400 text-sm w-12">K{i}:</span>
              <div className="flex-1 h-8 bg-slate-900 rounded overflow-hidden flex items-center px-2">
                <div 
                  className={`h-6 rounded transition-all duration-300 ${score > 0 ? 'bg-blue-500' : 'bg-red-500'}`}
                  style={{ width: `${Math.min(100, Math.abs(score) * 20)}%` }}
                />
              </div>
              <span className="text-amber-400 font-mono text-sm w-16 text-right">{score.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
        <p className="text-emerald-400 font-bold mb-4">Softmax Distribution (Probabilities)</p>
        <div className="space-y-2">
          {softmax.map((weight, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-slate-400 text-sm w-12">α{i}:</span>
              <div className="flex-1 h-8 bg-slate-900 rounded overflow-hidden flex items-center px-2">
                <div 
                  className="h-6 bg-emerald-500 rounded transition-all duration-300"
                  style={{ width: `${weight * 100}%` }}
                />
              </div>
              <span className="text-emerald-400 font-mono text-sm font-bold w-16 text-right">{(weight * 100).toFixed(1)}%</span>
            </div>
          ))}
        </div>
        <p className="text-slate-400 text-xs mt-4 font-mono">Formula: α_i = e^(score_i) / Σ e^(score_j)</p>
      </div>
    </div>
  );

  // ── Mode: Values Output ──
  const renderValues = () => (
    <div className="flex flex-col gap-6 w-full p-6">
      {isNumericValues && (
        <>
          <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
            <p className="text-purple-400 font-bold mb-4">Values (V)</p>
            <div className="space-y-2 mb-6">
              {(values as (number[] | string)[]).map((v, i) => (
                <div key={i} className="px-3 py-2 bg-slate-900 rounded border border-slate-700 text-purple-300 font-mono text-sm">
                  V{i}: {Array.isArray(v) ? `[${v.map(x => x.toFixed(2)).join(', ')}]` : v}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-purple-900/30 p-4 rounded-lg border border-purple-500/50">
            <p className="text-purple-300 font-bold mb-4">Weighted Output</p>
            <div className="space-y-3">
              {(values as number[][]).map((v, i) => {
                const contribution = softmax[i];
                return (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-slate-400 text-sm w-16">{(contribution * 100).toFixed(1)}% × V{i}</span>
                    <div className="flex-1 h-6 bg-slate-900 rounded overflow-hidden flex items-center px-2">
                      <div 
                        className="h-4 bg-purple-500 rounded transition-all duration-300"
                        style={{ width: `${contribution * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-slate-800 p-4 rounded-lg border-2 border-purple-500">
            <p className="text-slate-400 text-xs mb-2 uppercase tracking-wider">Final Output</p>
            <p className="text-2xl font-bold text-purple-300">
              [{outX.toFixed(2)}, {outY.toFixed(2)}]
            </p>
            <p className="text-xs text-purple-200 mt-2 font-mono">Σ (α_i × V_i)</p>
          </div>
        </>
      )}
    </div>
  );

  // ── Mode: Multi-Head Attention ──
  const renderMultihead = () => (
    <div className="flex flex-col gap-4 p-6 w-full">
      <p className="text-slate-400 text-sm mb-2">8 Independent Attention Heads (Each Learning Different Patterns)</p>
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 8 }).map((_, headIdx) => {
          const headScores = keys.map(k => {
            const qx = query[0] || 0;
            const qy = query[1] || 0;
            const kx = k[0] || 0;
            const ky = k[1] || 0;
            // Vary each head slightly
            return (qx * kx + qy * ky) * (0.8 + headIdx * 0.05);
          });
          const maxScore = Math.max(...headScores);
          const exps = headScores.map(s => Math.exp(s - maxScore));
          const sumExps = exps.reduce((a, b) => a + b, 0);
          const headSoftmax = exps.map(e => e / sumExps);

          return (
            <div key={headIdx} className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
              <p className="text-xs text-blue-400 font-bold mb-2">Head {headIdx + 1}</p>
              <div className="space-y-1">
                {headSoftmax.map((w, i) => (
                  <div key={i} className="flex items-center gap-2 h-4">
                    <span className="text-xs text-slate-500 w-6">K{i}</span>
                    <div className="flex-1 h-3 bg-slate-900 rounded overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded transition-all duration-300"
                        style={{ width: `${w * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-xs text-slate-500 mt-4 font-mono">Each head learns to focus on different aspects. Combined, they give richer representations.</p>
    </div>
  );

  // ── Mode: Scaling Factor ──
  const renderScaling = () => (
    <div className="flex flex-col gap-6 p-6 w-full">
      <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
        <p className="text-blue-400 font-bold mb-4">Effect of Scaling by √d_k</p>
        <p className="text-slate-300 text-sm mb-4">As embedding dimension grows, dot products grow larger. Without scaling, softmax becomes "too sharp".</p>
        
        <div className="space-y-4">
          {[1, 8, 64].map((dim) => {
            const scaledScores = scores.map(s => s / Math.sqrt(dim));
            const maxScore = Math.max(...scaledScores);
            const exps = scaledScores.map(s => Math.exp(s - maxScore));
            const sumExps = exps.reduce((a, b) => a + b, 0);
            const scaledSoftmax = exps.map(e => e / sumExps);
            const entropy = -scaledSoftmax.reduce((sum, p) => sum + p * Math.log(p), 0);

            return (
              <div key={dim} className="bg-slate-900/50 p-3 rounded border border-slate-700">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-400 font-mono text-sm">d_k = {dim}</span>
                  <span className={`text-xs font-bold ${entropy > 0.8 ? 'text-green-400' : 'text-red-400'}`}>
                    Entropy: {entropy.toFixed(2)}
                  </span>
                </div>
                <div className="flex gap-2">
                  {scaledSoftmax.map((w, i) => (
                    <div
                      key={i}
                      className="flex-1 h-8 bg-blue-500/50 rounded flex items-end justify-center text-xs text-white font-bold transition-all"
                      style={{ height: `${8 + w * 40}px` }}
                    >
                      {(w * 100).toFixed(0)}%
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-slate-500 mt-4 font-mono">Higher entropy = softer distribution = better gradients for learning</p>
      </div>
    </div>
  );

  // ── Mode: Masked Attention ──
  const renderMasking = () => (
    <div className="flex flex-col gap-6 p-6 w-full">
      <p className="text-slate-400 text-sm">Causal Masking: Future words are hidden (-∞ scores)</p>
      <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
        <div className="flex gap-2 items-center mb-4">
          {['cat', 'sat', 'here'].map((word, i) => (
            <div key={i} className="flex-1">
              <p className="text-xs text-slate-500 text-center mb-2">{word}</p>
              <div className="flex flex-col gap-1">
                {['cat', 'sat', 'here'].map((w2, j) => (
                  <div
                    key={j}
                    className={`h-8 rounded flex items-center justify-center text-xs font-bold ${
                      j <= i
                        ? 'bg-emerald-500/60 text-white border border-emerald-400'
                        : 'bg-slate-900 text-slate-600 border border-slate-700'
                    }`}
                  >
                    {j <= i ? '✓' : '✗'}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-400 font-mono">During prediction, a word can only attend to itself and previous words.</p>
      </div>
    </div>
  );

  // ── Mode: Cross-Attention ──
  const renderCrossAttention = () => (
    <div className="flex flex-col gap-6 p-6 w-full">
      <div className="flex gap-6 items-stretch">
        <div className="flex-1 bg-slate-800/50 p-4 rounded-lg border border-slate-700">
          <p className="text-blue-400 font-bold mb-3">Encoder (Source)</p>
          <div className="space-y-2">
            {['I', 'like', 'cats'].map((word, i) => (
              <div key={i} className="px-3 py-2 bg-slate-900 rounded border border-blue-500/50 text-blue-300 font-mono text-sm">
                {word}
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-2">Keys & Values</p>
        </div>

        <div className="flex items-center justify-center">
          <div className="text-slate-500 font-bold">→</div>
        </div>

        <div className="flex-1 bg-slate-800/50 p-4 rounded-lg border border-slate-700">
          <p className="text-purple-400 font-bold mb-3">Decoder (Target)</p>
          <div className="space-y-2">
            {['J\'aime', 'les', 'chats'].map((word, i) => (
              <div key={i} className="px-3 py-2 bg-slate-900 rounded border border-purple-500/50 text-purple-300 font-mono text-sm">
                {word}
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-2">Queries</p>
        </div>
      </div>

      <div className="bg-slate-900/50 p-4 rounded border border-slate-700">
        <p className="text-slate-400 text-xs font-mono">Cross-Attention: Decoder queries the Encoder to decide what to generate next</p>
      </div>
    </div>
  );

  if (mode === 'database') return <div className="p-8 bg-slate-900 rounded-xl border border-slate-800 flex justify-center">{renderDatabase()}</div>;
  if (mode === 'self-attention') return <div className="p-8 bg-slate-900 rounded-xl border border-slate-800 flex justify-center">{renderSelfAttention()}</div>;
  if (mode === 'softmax') return <div className="p-8 bg-slate-900 rounded-xl border border-slate-800 w-full max-w-2xl mx-auto">{renderSoftmax()}</div>;
  if (mode === 'values') return <div className="p-8 bg-slate-900 rounded-xl border border-slate-800 w-full max-w-2xl mx-auto">{renderValues()}</div>;
  if (mode === 'multihead-viz') return <div className="p-8 bg-slate-900 rounded-xl border border-slate-800 w-full max-w-4xl mx-auto">{renderMultihead()}</div>;
  if (mode === 'scaling-viz') return <div className="p-8 bg-slate-900 rounded-xl border border-slate-800 w-full max-w-2xl mx-auto">{renderScaling()}</div>;
  if (mode === 'masking-viz') return <div className="p-8 bg-slate-900 rounded-xl border border-slate-800 w-full max-w-2xl mx-auto">{renderMasking()}</div>;
  if (mode === 'cross-attention-viz') return <div className="p-8 bg-slate-900 rounded-xl border border-slate-800 w-full max-w-3xl mx-auto">{renderCrossAttention()}</div>;

  return (
    <div className="w-full flex flex-col md:flex-row gap-6 items-center justify-center p-6 bg-slate-900 rounded-xl max-w-4xl mx-auto border border-slate-800 shadow-xl">
      
      {/* Visual Vector Field */}
      <div className="relative w-64 h-64 shrink-0 bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
        <svg
          ref={svgRef}
          viewBox="-150 -150 300 300"
          className="w-full h-full focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onKeyDown={handleKeyDown}
          tabIndex={draggableQuery ? 0 : -1}
          role="img"
          aria-label={`Attention visualization showing query vector at [${query[0]?.toFixed(2) || 0}, ${query[1]?.toFixed(2) || 0}]. ${draggableQuery ? 'Use arrow keys or drag to adjust.' : ''}`}
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
