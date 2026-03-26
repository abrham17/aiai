'use client';

import React, { useState, useEffect, useMemo } from 'react';

interface MLPVisualizationProps {
  mode?: string;
  dataset?: string;
  hiddenNeurons?: number;
  showBoundaries?: boolean;
  interactive?: boolean;
  activation?: string;
  targetFunction?: string;
}

// Generate datasets
function generateDataset(name: string): { x: number; y: number; cls: number }[] {
  const pts: { x: number; y: number; cls: number }[] = [];
  switch (name) {
    case 'xor':
      pts.push({ x: 1, y: 1, cls: 0 }, { x: 1, y: 9, cls: 1 }, { x: 9, y: 1, cls: 1 }, { x: 9, y: 9, cls: 0 });
      // Add noise points
      pts.push({ x: 2, y: 2, cls: 0 }, { x: 2, y: 8, cls: 1 }, { x: 8, y: 2, cls: 1 }, { x: 8, y: 8, cls: 0 });
      break;
    case 'circles':
      for (let i = 0; i < 30; i++) {
        const angle = (i / 30) * Math.PI * 2;
        pts.push({ x: 5 + Math.cos(angle) * 1.5, y: 5 + Math.sin(angle) * 1.5, cls: 0 });
        pts.push({ x: 5 + Math.cos(angle) * 3.5, y: 5 + Math.sin(angle) * 3.5, cls: 1 });
      }
      break;
    case 'spiral':
      for (let i = 0; i < 40; i++) {
        const t = (i / 40) * 3 * Math.PI;
        const r1 = 0.5 + t * 0.4;
        pts.push({ x: 5 + Math.cos(t) * r1, y: 5 + Math.sin(t) * r1, cls: 0 });
        pts.push({ x: 5 + Math.cos(t + Math.PI) * r1, y: 5 + Math.sin(t + Math.PI) * r1, cls: 1 });
      }
      break;
    case 'moons':
      for (let i = 0; i < 30; i++) {
        const angle = (i / 30) * Math.PI;
        pts.push({ x: 3 + Math.cos(angle) * 3, y: 5 + Math.sin(angle) * 2, cls: 0 });
        pts.push({ x: 7 - Math.cos(angle) * 3, y: 5 - Math.sin(angle) * 2 + 1, cls: 1 });
      }
      break;
    default:
      pts.push({ x: 1, y: 1, cls: 0 }, { x: 9, y: 9, cls: 1 });
  }
  return pts;
}

export default function MLPVisualization(props: MLPVisualizationProps) {
  const {
    mode = 'playground',
    dataset: initialDataset = 'xor',
    hiddenNeurons: initialNeurons = 4,
    showBoundaries = true,
    interactive = false,
    activation = 'relu',
    targetFunction = 'sine',
  } = props;

  const [dataset, setDataset] = useState(initialDataset);
  const [hiddenNeurons, setHiddenNeurons] = useState(initialNeurons);

  useEffect(() => {
    if (props.dataset) {
      const frame = requestAnimationFrame(() => setDataset(props.dataset!));
      return () => cancelAnimationFrame(frame);
    }
  }, [props.dataset]);

  useEffect(() => {
    if (props.hiddenNeurons !== undefined) {
      const frame = requestAnimationFrame(() => setHiddenNeurons(props.hiddenNeurons!));
      return () => cancelAnimationFrame(frame);
    }
  }, [props.hiddenNeurons]);

  const points = useMemo(() => generateDataset(dataset), [dataset]);

  // Simple "pseudo-boundary" visualization:
  // We show a decision boundary approximation based on number of hidden neurons
  // More neurons = more complex boundary = better classification
  const boundaryComplexity = Math.min(hiddenNeurons, 16);

  // Network diagram for the 'network-diagram' mode
  if (mode === 'network-diagram' || mode === 'xor-problem') {
    const inputNodes = 2;
    const outputNodes = 1;
    const hidden = mode === 'xor-problem' ? 0 : hiddenNeurons;

    return (
      <div className="w-full flex flex-col md:flex-row gap-6 items-center justify-center p-6 bg-slate-900 rounded-xl max-w-4xl mx-auto">
        <div className="relative w-full max-w-[400px] h-[300px] shrink-0 bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
          <svg viewBox="0 0 300 300" className="w-full h-full">
            {/* Input Layer */}
            {Array.from({ length: inputNodes }).map((_, i) => {
              const y = 100 + i * 100;
              return (
                <g key={`in-${i}`}>
                  <circle cx="50" cy={y} r="18" fill="#1e40af" stroke="#60a5fa" strokeWidth="2" />
                  <text x="50" y={y + 4} fill="#fff" fontSize="10" textAnchor="middle">x{i + 1}</text>
                </g>
              );
            })}

            {/* Hidden Layer */}
            {hidden > 0 && Array.from({ length: Math.min(hidden, 6) }).map((_, i) => {
              const y = 50 + (i / (Math.min(hidden, 6) - 1 || 1)) * 200;
              return (
                <g key={`h-${i}`}>
                  {/* Connections from inputs */}
                  {Array.from({ length: inputNodes }).map((_, j) => (
                    <line key={`conn-in-${j}-h-${i}`} x1="68" y1={100 + j * 100} x2="132" y2={y}
                      stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                  ))}
                  <circle cx="150" cy={y} r="15" fill="#7c3aed" stroke="#a78bfa" strokeWidth="2" />
                  <text x="150" y={y + 4} fill="#fff" fontSize="8" textAnchor="middle">h{i + 1}</text>
                </g>
              );
            })}
            {hidden > 6 && (
              <text x="150" y="280" fill="#a78bfa" fontSize="10" textAnchor="middle">+{hidden - 6} more</text>
            )}

            {/* Output */}
            <g>
              {hidden > 0 ? (
                Array.from({ length: Math.min(hidden, 6) }).map((_, i) => {
                  const y = 50 + (i / (Math.min(hidden, 6) - 1 || 1)) * 200;
                  return <line key={`conn-h-${i}-out`} x1="165" y1={y} x2="232" y2="150"
                    stroke="rgba(255,255,255,0.15)" strokeWidth="1" />;
                })
              ) : (
                Array.from({ length: inputNodes }).map((_, j) => (
                  <line key={`conn-in-${j}-out`} x1="68" y1={100 + j * 100} x2="232" y2="150"
                    stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                ))
              )}
              <circle cx="250" cy="150" r="18" fill="#b45309" stroke="#fbbf24" strokeWidth="2" />
              <text x="250" y="154" fill="#fff" fontSize="10" textAnchor="middle">out</text>
            </g>
          </svg>
        </div>

        <div className="flex flex-col gap-4 w-full max-w-sm font-mono text-slate-300">
          <div className="p-4 bg-slate-800 rounded border border-slate-700 flex flex-col gap-3">
            <h3 className="text-blue-400 font-bold uppercase tracking-wider text-xs border-b border-slate-700 pb-2">Network Architecture</h3>
            <div className="flex justify-between text-sm"><span>Input Neurons:</span><span className="text-white font-bold">{inputNodes}</span></div>
            <div className="flex justify-between text-sm"><span>Hidden Neurons:</span><span className="text-purple-400 font-bold">{hidden}</span></div>
            <div className="flex justify-between text-sm"><span>Output Neurons:</span><span className="text-white font-bold">{outputNodes}</span></div>
            <div className="flex justify-between text-sm"><span>Total Parameters:</span><span className="text-amber-400 font-bold">{hidden > 0 ? inputNodes * hidden + hidden + hidden * outputNodes + outputNodes : inputNodes * outputNodes + outputNodes}</span></div>
            {hidden === 0 && (
              <div className="mt-2 p-2 bg-rose-900/30 border border-rose-500/30 rounded text-xs text-rose-300">
                No hidden layer! This is just a linear classifier. It cannot solve XOR.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Approximation mode
  if (mode === 'approximation' || mode === 'depth-comparison') {
    return (
      <div className="w-full flex flex-col gap-6 items-center justify-center p-6 bg-slate-900 rounded-xl max-w-4xl mx-auto">
        <div className="relative w-full max-w-[500px] h-[250px] bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
          <svg viewBox="0 0 300 200" className="w-full h-full">
            {/* Target function (sine) */}
            <path
              d={Array.from({ length: 100 }, (_, i) => {
                const x = (i / 100) * 300;
                const t = (i / 100) * Math.PI * 2;
                const y = 100 - Math.sin(t) * 60;
                return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
              }).join(' ')}
              fill="none" stroke="#475569" strokeWidth="2" strokeDasharray="4,4"
            />
            <text x="10" y="15" fill="#64748b" fontSize="10">Target: sin(x)</text>

            {/* Approximation (more neurons = closer fit) */}
            <path
              d={Array.from({ length: 100 }, (_, i) => {
                const x = (i / 100) * 300;
                const t = (i / 100) * Math.PI * 2;
                // Approximation that improves with more neurons
                const segments = Math.max(1, boundaryComplexity);
                const segWidth = (Math.PI * 2) / segments;
                const segIdx = Math.floor(t / segWidth);
                const segCenter = (segIdx + 0.5) * segWidth;
                const approx = Math.sin(segCenter); // piecewise constant
                const blend = Math.min(1, boundaryComplexity / 8);
                const y = 100 - (approx * (1 - blend) + Math.sin(t) * blend) * 60;
                return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
              }).join(' ')}
              fill="none" stroke="#10b981" strokeWidth="3"
            />
            <text x="10" y="30" fill="#10b981" fontSize="10">Approx ({hiddenNeurons} neurons)</text>
          </svg>
        </div>

        {interactive && (
          <div className="w-full max-w-sm p-4 bg-slate-800 rounded border border-slate-700 font-mono text-sm">
            <label className="block text-slate-400 text-xs mb-1">Hidden Neurons: {hiddenNeurons}</label>
            <input
              type="range" min="1" max="16" value={hiddenNeurons}
              onChange={(e) => setHiddenNeurons(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
        )}
      </div>
    );
  }

  // Playground Mode (default) — 2D scatter with decision boundary approximation
  return (
    <div className="w-full flex flex-col md:flex-row gap-6 items-center justify-center p-6 bg-slate-900 rounded-xl max-w-4xl mx-auto">
      
      {/* 2D Scatter Plot */}
      <div className="relative w-full max-w-[400px] aspect-square shrink-0 bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Grid */}
          <g opacity="0.08">
            {[2,4,6,8].map(i => (
              <React.Fragment key={i}>
                <line x1={i*10} y1="0" x2={i*10} y2="100" stroke="#fff" />
                <line x1="0" y1={i*10} x2="100" y2={i*10} stroke="#fff" />
              </React.Fragment>
            ))}
          </g>

          {/* Approximate boundary region (conceptual shading) */}
          {showBoundaries && hiddenNeurons > 0 && (
            <g opacity="0.15">
              {/* Draw boundary lines based on number of hidden neurons */}
              {Array.from({ length: Math.min(boundaryComplexity, 8) }).map((_, i) => {
                const angle = (i / Math.min(boundaryComplexity, 8)) * Math.PI;
                const cx = 50, cy = 50, len = 70;
                return (
                  <line
                    key={`boundary-${i}`}
                    x1={cx - Math.cos(angle) * len}
                    y1={cy - Math.sin(angle) * len}
                    x2={cx + Math.cos(angle) * len}
                    y2={cy + Math.sin(angle) * len}
                    stroke="#a78bfa" strokeWidth="0.5"
                  />
                );
              })}
            </g>
          )}

          {/* Data Points */}
          {points.map((p, i) => (
            <circle
              key={i}
              cx={p.x * 10} cy={100 - p.y * 10} r="1.8"
              fill={p.cls === 0 ? '#ef4444' : '#3b82f6'}
              stroke="#fff" strokeWidth="0.3"
            />
          ))}
        </svg>
      </div>

      {/* Info Panel */}
      <div className="flex flex-col gap-4 w-full max-w-sm font-mono text-slate-300">
        <div className="p-4 bg-slate-800 rounded border border-slate-700 flex flex-col gap-3">
          <h3 className="text-blue-400 font-bold uppercase tracking-wider text-xs border-b border-slate-700 pb-2">MLP Playground</h3>

          {interactive && (
            <>
              <div>
                <label className="block text-slate-400 text-xs mb-1">Dataset</label>
                <div className="flex gap-1 flex-wrap">
                  {['xor', 'circles', 'spiral', 'moons'].map(d => (
                    <button
                      key={d}
                      onClick={() => setDataset(d)}
                      className={`px-2 py-1 rounded text-xs font-bold transition-colors ${
                        dataset === d ? 'bg-white text-slate-900' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >{d}</button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-400 text-xs mb-1">Hidden Neurons: {hiddenNeurons}</label>
                <input
                  type="range" min="0" max="16" value={hiddenNeurons}
                  onChange={(e) => setHiddenNeurons(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            </>
          )}

          <div className="flex justify-between text-sm"><span>Dataset:</span><span className="text-white font-bold capitalize">{dataset}</span></div>
          <div className="flex justify-between text-sm"><span>Hidden Neurons:</span><span className="text-purple-400 font-bold">{hiddenNeurons}</span></div>
          <div className="flex justify-between text-sm"><span>Data Points:</span><span className="text-white font-bold">{points.length}</span></div>
          <div className="flex justify-between text-sm"><span>Boundary Lines:</span><span className="text-amber-400 font-bold">{boundaryComplexity}</span></div>

          {hiddenNeurons === 0 && (
            <div className="p-2 bg-rose-900/30 border border-rose-500/30 rounded text-xs text-rose-300">
              0 hidden neurons = linear classifier. Cannot solve non-linear datasets!
            </div>
          )}
          {hiddenNeurons >= 8 && (
            <div className="p-2 bg-emerald-900/30 border border-emerald-500/30 rounded text-xs text-emerald-300">
              With {hiddenNeurons} neurons, the network can approximate very complex boundaries.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
