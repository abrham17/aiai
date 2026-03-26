'use client';

import React, { useState, useEffect, useMemo } from 'react';

interface CNNVisualizationProps {
  mode?: string;
  kernelType?: string;
  stride?: number;
  padding?: number;
  interactive?: boolean;
}

const KERNELS: Record<string, number[][]> = {
  identity: [[0, 0, 0], [0, 1, 0], [0, 0, 0]],
  'sobel-v': [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]],
  'sobel-h': [[-1, -2, -1], [0, 0, 0], [1, 2, 1]],
  blur: [[1/9, 1/9, 1/9], [1/9, 1/9, 1/9], [1/9, 1/9, 1/9]],
  sharpen: [[0, -1, 0], [-1, 5, -1], [0, -1, 0]],
  edge: [[-1, -1, -1], [-1, 8, -1], [-1, -1, -1]],
  custom: [[0, 0, 0], [0, 1, 0], [0, 0, 0]],
};

const INPUT_SIZE = 8;
const generateInput = () => {
   const grid = Array(INPUT_SIZE).fill(0).map(() => Array(INPUT_SIZE).fill(0));
   // Draw a vertical line
   for(let y=1; y<7; y++) {
      grid[y][3] = 1;
      grid[y][4] = 1;
   }
   return grid;
};

export default function CNNVisualization(props: CNNVisualizationProps) {
  const {
    mode = 'conv-interactive',
    kernelType = 'identity',
    stride = 1,
    padding = 0,
    interactive = false,
  } = props;

  const [kernel, setKernel] = useState(KERNELS[kernelType] || KERNELS.identity);
  const [cursor, setCursor] = useState({ r: 0, c: 0 });

  useEffect(() => {
    if (kernelType !== 'custom') {
      requestAnimationFrame(() => setKernel(KERNELS[kernelType!] || KERNELS.identity));
    }
  }, [kernelType]);

  const inputGrid = useMemo(() => generateInput(), []);
  
  // Calculate full output grid for display
  const outputGrid = useMemo(() => {
     const outSize = Math.floor((INPUT_SIZE - 3 + 2 * padding) / stride) + 1;
     const out = Array(outSize).fill(0).map(() => Array(outSize).fill(0));
     
     for (let r = 0; r < outSize; r++) {
        for (let c = 0; c < outSize; c++) {
           let val = 0;
           for (let kr = 0; kr < 3; kr++) {
              for (let kc = 0; kc < 3; kc++) {
                 const ir = r * stride + kr - padding;
                 const ic = c * stride + kc - padding;
                 if (ir >= 0 && ir < INPUT_SIZE && ic >= 0 && ic < INPUT_SIZE) {
                    val += inputGrid[ir][ic] * kernel[kr][kc];
                 }
              }
           }
           out[r][c] = val;
        }
     }
     return out;
  }, [inputGrid, kernel, stride, padding]);

  // Derived metrics for challenge
  const edgeScore = useMemo(() => {
      // Very simple metric for "vertical edge detection accuracy"
      // Looking for correctly identifying the 3->4 transition
      if (kernelType === 'identity') return 0;
      const vEdge = [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]];
      let match = 0;
      for (let r=0; r<3; r++) for (let c=0; c<3; c++) if (Math.sign(kernel[r][c]) === Math.sign(vEdge[r][c])) match++;
      return match / 9;
  }, [kernel, kernelType]);

  return (
    <div className="w-full flex flex-col items-center justify-center p-6 bg-slate-900 rounded-xl max-w-5xl mx-auto font-mono">
      <div className="flex flex-col md:flex-row gap-12 items-start justify-center w-full">
         
         {/* Input Grid */}
         <div className="flex flex-col items-center gap-4">
            <span className="text-blue-400 font-bold text-xs uppercase tracking-widest">Input Image (8x8)</span>
            <div className={`relative grid grid-cols-8 gap-1 p-2 bg-slate-800 rounded border border-slate-700`}>
                {inputGrid.map((row, r) => row.map((val, c) => {
                   const inWindow = r >= cursor.r - padding && r < cursor.r - padding + 3 && c >= cursor.c - padding && c < cursor.c - padding + 3;
                   return (
                      <div 
                         key={`${r}-${c}`}
                         onMouseEnter={() => setCursor({ r: Math.floor(r/stride)*stride, c: Math.floor(c/stride)*stride })}
                         className={`w-8 h-8 rounded-sm transition-colors duration-200 flex items-center justify-center text-[10px] ${inWindow ? 'bg-amber-500/40 border border-amber-400' : val > 0 ? 'bg-slate-400' : 'bg-slate-900 text-slate-700'}`}
                      >
                         {val}
                      </div>
                   );
                }))}
            </div>
         </div>

         {/* Kernel */}
         <div className="flex flex-col items-center gap-4">
            <span className="text-amber-400 font-bold text-xs uppercase tracking-widest">3x3 Kernel</span>
            <div className="grid grid-cols-3 gap-2 p-3 bg-slate-800 rounded-lg border-2 border-amber-500/50">
               {kernel.map((row, r) => row.map((val, c) => (
                  <div key={`${r}-${c}`} className="flex flex-col items-center">
                     {kernelType === 'custom' ? (
                        <input 
                           type="number" step="1" value={val} 
                           onChange={(e) => {
                              const newK = [...kernel.map(r => [...r])];
                              newK[r][c] = parseFloat(e.target.value) || 0;
                              setKernel(newK);
                           }}
                           className="w-10 h-10 bg-slate-900 border border-slate-600 rounded text-center text-xs text-amber-200"
                        />
                     ) : (
                        <div className="w-10 h-10 bg-slate-900 flex items-center justify-center rounded border border-slate-700 text-xs text-amber-200 font-bold">
                           {val.toFixed(val % 1 === 0 ? 0 : 2)}
                        </div>
                     )}
                  </div>
               )))}
            </div>
            {kernelType === 'custom' && (
               <div className="text-[10px] text-slate-500 italic mt-2">Edit weights to detect features</div>
            )}
         </div>

         {/* Feature Map (Output) */}
         <div className="flex flex-col items-center gap-4">
            <span className="text-emerald-400 font-bold text-xs uppercase tracking-widest">Feature Map</span>
            <div 
               className="grid gap-1 p-2 bg-slate-800 rounded border border-slate-700"
               style={{ gridTemplateColumns: `repeat(${outputGrid.length}, minmax(0, 1fr))` }}
            >
                {outputGrid.map((row, r) => row.map((val, c) => {
                   const isCurrent = r === Math.floor(cursor.r/stride) && c === Math.floor(cursor.c/stride);
                   const opacity = Math.min(1, Math.abs(val));
                   return (
                      <div 
                         key={`${r}-${c}`}
                         className={`w-8 h-8 rounded-sm transition-all duration-300 flex items-center justify-center text-[10px] ${isCurrent ? 'ring-2 ring-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]' : ''}`}
                         style={{ 
                            background: val > 0 ? `rgba(16, 185, 129, ${opacity})` : val < 0 ? `rgba(239, 68, 68, ${opacity})` : '#0f172a',
                            color: Math.abs(val) > 0.5 ? '#fff' : '#475569'
                         }}
                      >
                         {val.toFixed(1)}
                      </div>
                   );
                }))}
            </div>
         </div>
      </div>

      {/* Logic display */}
      <div className="w-full max-w-2xl mt-8 p-4 bg-slate-800 rounded border border-slate-700 font-mono text-xs flex flex-col md:flex-row gap-4 items-center">
         <div className="flex-1">
            <div className="text-blue-400 font-bold mb-1">Local Calculation:</div>
            <div className="text-slate-300 bg-slate-900 p-2 rounded whitespace-nowrap overflow-x-auto">
               Output[{Math.floor(cursor.r/stride)}, {Math.floor(cursor.c/stride)}] = Σ (Window × Kernel) = <span className="text-emerald-400 font-bold">{outputGrid[Math.floor(cursor.r/stride)]?.[Math.floor(cursor.c/stride)]?.toFixed(2) || 0}</span>
            </div>
         </div>
         <div className="flex-1 flex flex-col gap-2">
            <div className="flex justify-between items-center">
               <span className="text-slate-500">Params:</span>
               <span className="text-white">Stride: {stride}, Padding: {padding}</span>
            </div>
            <div className="flex justify-between items-center">
               <span className="text-slate-500">Output Size:</span>
               <span className="text-white bg-emerald-900/50 px-2 rounded">{outputGrid.length}x{outputGrid.length}</span>
            </div>
         </div>
      </div>
      
      <div className="hidden edge-score-val">{edgeScore.toFixed(4)}</div>
    </div>
  );
}
