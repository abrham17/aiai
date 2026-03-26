'use client';

import React, { useState, useEffect } from 'react';

interface ActivationsVisualizationProps {
  mode?: string;
  activation?: string;
  showDerivative?: boolean;
  layers?: number;
  interactive?: boolean;
}

// Activation functions and their derivatives
const activationFns: Record<string, { fn: (x: number) => number; dfn: (x: number) => number; label: string; color: string }> = {
  sigmoid: {
    fn: (x) => 1 / (1 + Math.exp(-x)),
    dfn: (x) => { const s = 1 / (1 + Math.exp(-x)); return s * (1 - s); },
    label: 'Sigmoid',
    color: '#f59e0b',
  },
  tanh: {
    fn: (x) => Math.tanh(x),
    dfn: (x) => 1 - Math.tanh(x) ** 2,
    label: 'Tanh',
    color: '#8b5cf6',
  },
  relu: {
    fn: (x) => Math.max(0, x),
    dfn: (x) => x > 0 ? 1 : 0,
    label: 'ReLU',
    color: '#10b981',
  },
  'leaky-relu': {
    fn: (x) => x > 0 ? x : 0.01 * x,
    dfn: (x) => x > 0 ? 1 : 0.01,
    label: 'Leaky ReLU',
    color: '#06b6d4',
  },
};

export default function ActivationsVisualization(props: ActivationsVisualizationProps) {
  const {
    mode = 'function-plot',
    activation: initialActivation = 'sigmoid',
    showDerivative = true,
    layers: initialLayers = 10,
    interactive = false,
  } = props;

  const [activation, setActivation] = useState(initialActivation);
  const [layers, setLayers] = useState(initialLayers);
  const [hoverX, setHoverX] = useState<number | null>(null);

  useEffect(() => {
    if (props.activation) {
      const frame = requestAnimationFrame(() => setActivation(props.activation!));
      return () => cancelAnimationFrame(frame);
    }
  }, [props.activation]);

  useEffect(() => {
    if (props.layers !== undefined) {
      const frame = requestAnimationFrame(() => setLayers(props.layers!));
      return () => cancelAnimationFrame(frame);
    }
  }, [props.layers]);

  const act = activationFns[activation] || activationFns.sigmoid;

  // Generate plot path for a function over a range
  const generatePath = (fn: (x: number) => number, xMin: number, xMax: number, yMin: number, yMax: number): string => {
    let d = '';
    const steps = 200;
    for (let i = 0; i <= steps; i++) {
      const x = xMin + (xMax - xMin) * (i / steps);
      const y = fn(x);
      // Map to SVG coordinates: x -> 0-300, y -> 300-0
      const svgX = ((x - xMin) / (xMax - xMin)) * 300;
      const svgY = 250 - ((y - yMin) / (yMax - yMin)) * 200;
      const clampedY = Math.max(0, Math.min(300, svgY));
      if (i === 0) d += `M ${svgX} ${clampedY} `;
      else d += `L ${svgX} ${clampedY} `;
    }
    return d;
  };

  // Gradient Flow Mode
  if (mode === 'gradient-flow' || mode === 'linear-stack') {
    const gradientMagnitudes: number[] = [];
    let grad = 1.0;
    for (let i = 0; i < layers; i++) {
      // For gradient flow simulation, we assume a typical input of ~0.5 per layer
      // The gradient at each layer multiplies by the derivative evaluated at some typical input
      const typicalInput = 0.5;
      const localGrad = act.dfn(typicalInput);
      grad *= localGrad;
      gradientMagnitudes.push(grad);
    }

    const firstLayerGrad = gradientMagnitudes[gradientMagnitudes.length - 1] || 0;

    return (
      <div className="w-full flex flex-col gap-6 items-center justify-center p-6 bg-slate-900 rounded-xl max-w-4xl mx-auto">
        {/* Activation Selector */}
        {interactive && (
          <div className="flex gap-2 flex-wrap">
            {Object.entries(activationFns).map(([key, val]) => (
              <button
                key={key}
                onClick={() => setActivation(key)}
                className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
                  activation === key
                    ? 'bg-white text-slate-900'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {val.label}
              </button>
            ))}
          </div>
        )}

        {/* Gradient Flow Bars */}
        <div className="w-full flex items-end gap-1 h-[200px] bg-slate-800 rounded-lg p-4 border border-slate-700 overflow-x-auto">
          {gradientMagnitudes.map((mag, i) => {
            const height = Math.min(180, Math.max(2, mag * 180));
            const opacity = Math.max(0.1, Math.min(1, mag));
            return (
              <div key={i} className="flex flex-col items-center gap-1 flex-1 min-w-[20px]">
                <div
                  className="w-full rounded-t transition-all duration-300"
                  style={{
                    height: `${height}px`,
                    background: act.color,
                    opacity,
                  }}
                />
                <span className="text-[9px] text-slate-500">L{layers - i}</span>
              </div>
            );
          })}
        </div>

        {/* Info */}
        <div className="flex flex-col md:flex-row gap-4 w-full">
          <div className="flex-1 p-4 bg-slate-800 rounded border border-slate-700 font-mono text-sm">
            <h3 className="text-blue-400 font-bold uppercase tracking-wider text-xs border-b border-slate-700 pb-2 mb-3">Gradient Flow</h3>
            <div className="flex justify-between items-center">
              <span>Activation:</span>
              <span className="font-bold" style={{ color: act.color }}>{act.label}</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span>Layers:</span>
              <span className="text-white font-bold">{layers}</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span>Layer 1 Gradient:</span>
              <span className={`font-bold ${firstLayerGrad > 0.1 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {firstLayerGrad < 0.0001 ? firstLayerGrad.toExponential(2) : firstLayerGrad.toFixed(4)}
              </span>
            </div>
          </div>

          {interactive && (
            <div className="flex-1 p-4 bg-slate-800 rounded border border-slate-700 font-mono text-sm">
              <h3 className="text-blue-400 font-bold uppercase tracking-wider text-xs border-b border-slate-700 pb-2 mb-3">Controls</h3>
              <label className="block text-slate-400 text-xs mb-1">Layers: {layers}</label>
              <input
                type="range" min="1" max="50" value={layers}
                onChange={(e) => setLayers(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  // Function Plot Mode
  const xMin = -6, xMax = 6;
  const yMin = activation === 'relu' || activation === 'leaky-relu' ? -1 : -1.5;
  const yMax = activation === 'relu' || activation === 'leaky-relu' ? 3 : 1.5;

  const fnPath = generatePath(act.fn, xMin, xMax, yMin, yMax);
  const derivPath = showDerivative ? generatePath(act.dfn, xMin, xMax, yMin, yMax) : '';

  // Hover info
  const hoverFnVal = hoverX !== null ? act.fn(hoverX) : null;
  const hoverDfnVal = hoverX !== null ? act.dfn(hoverX) : null;

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const svgX = ((e.clientX - rect.left) / rect.width) * 300;
    const x = xMin + (svgX / 300) * (xMax - xMin);
    setHoverX(x);
  };

  return (
    <div className="w-full flex flex-col md:flex-row gap-6 items-center justify-center p-6 bg-slate-900 rounded-xl max-w-4xl mx-auto">
      
      {/* Plot */}
      <div className="relative w-full max-w-[400px] h-[300px] shrink-0 bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
        <svg
          viewBox="0 0 300 300"
          className="w-full h-full"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoverX(null)}
        >
          {/* Zero Lines */}
          <line
            x1="0" y1={250 - ((0 - yMin) / (yMax - yMin)) * 200}
            x2="300" y2={250 - ((0 - yMin) / (yMax - yMin)) * 200}
            stroke="rgba(255,255,255,0.15)" strokeWidth="1"
          />
          <line
            x1={((0 - xMin) / (xMax - xMin)) * 300} y1="0"
            x2={((0 - xMin) / (xMax - xMin)) * 300} y2="300"
            stroke="rgba(255,255,255,0.15)" strokeWidth="1"
          />

          {/* Function */}
          <path d={fnPath} fill="none" stroke={act.color} strokeWidth="3" />

          {/* Derivative */}
          {showDerivative && (
            <path d={derivPath} fill="none" stroke="#fb7185" strokeWidth="2" strokeDasharray="6,3" />
          )}

          {/* Hover Crosshair */}
          {hoverX !== null && (
            <g>
              <line
                x1={((hoverX - xMin) / (xMax - xMin)) * 300} y1="0"
                x2={((hoverX - xMin) / (xMax - xMin)) * 300} y2="300"
                stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeDasharray="3,3"
              />
              <circle
                cx={((hoverX - xMin) / (xMax - xMin)) * 300}
                cy={250 - ((act.fn(hoverX) - yMin) / (yMax - yMin)) * 200}
                r="4" fill={act.color} stroke="#fff" strokeWidth="1"
              />
              {showDerivative && (
                <circle
                  cx={((hoverX - xMin) / (xMax - xMin)) * 300}
                  cy={Math.max(0, Math.min(300, 250 - ((act.dfn(hoverX) - yMin) / (yMax - yMin)) * 200))}
                  r="4" fill="#fb7185" stroke="#fff" strokeWidth="1"
                />
              )}
            </g>
          )}

          {/* Legend */}
          <g transform="translate(10, 20)">
            <rect x="0" y="0" width="8" height="8" fill={act.color} rx="2" />
            <text x="12" y="8" fill={act.color} fontSize="10" fontWeight="bold">{act.label}(x)</text>
          </g>
          {showDerivative && (
            <g transform="translate(10, 35)">
              <rect x="0" y="0" width="8" height="8" fill="#fb7185" rx="2" />
              <text x="12" y="8" fill="#fb7185" fontSize="10" fontWeight="bold">{act.label}&apos;(x)</text>
            </g>
          )}
        </svg>
      </div>

      {/* Info Panel */}
      <div className="flex flex-col gap-4 w-full max-w-sm font-mono text-slate-300">
        <div className="p-4 bg-slate-800 rounded border border-slate-700 flex flex-col gap-3">
          <h3 className="text-blue-400 font-bold uppercase tracking-wider text-xs border-b border-slate-700 pb-2">{act.label}</h3>

          {hoverX !== null ? (
            <>
              <div className="flex justify-between items-center text-sm">
                <span>Input (x):</span>
                <span className="text-white font-bold">{hoverX.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span style={{ color: act.color }}>f(x):</span>
                <span className="text-white font-bold">{hoverFnVal?.toFixed(4)}</span>
              </div>
              {showDerivative && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-rose-400">f&apos;(x):</span>
                  <span className="text-white font-bold">{hoverDfnVal?.toFixed(4)}</span>
                </div>
              )}
            </>
          ) : (
            <p className="text-slate-500 text-xs">Hover over the plot to see values.</p>
          )}

          {showDerivative && (
            <div className="mt-3 p-3 bg-slate-900 rounded border border-slate-700">
              <span className="text-slate-400 text-xs uppercase tracking-wider">Max Derivative</span>
              <div className="text-lg font-bold mt-1" style={{ color: act.color }}>
                {activation === 'sigmoid' ? '0.25 (at x=0)' :
                 activation === 'tanh' ? '1.0 (at x=0)' :
                 activation === 'relu' ? '1.0 (for x>0)' :
                 '1.0 (for x>0)'}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
