'use client';

import React, { useState } from 'react';

/* ═══════════════════════════════════════════════════════════════════
   NumPy Foundations Visualization — Interactive Broadcasting Lab
   ═══════════════════════════════════════════════════════════════════ */

interface NumPyVizProps {
  mode?: string;
}

export default function NumPyVisualization({ mode = 'array-structure' }: NumPyVizProps) {
  const [broadcastingShape, setBroadcastingShape] = useState<[number, number]>([3, 1]);

  const renderBroadcasting = () => {
    const mainGrid = Array.from({ length: 3 * 3 });
    const broadcastGrid = Array.from({ length: 3 * 3 });

    return (
      <div className="flex flex-col items-center gap-8 w-full p-4">
        <div className="flex items-center gap-12">
            {/* Main Array (3x3) */}
            <div className="flex flex-col items-center gap-2">
                <span className="text-xs text-slate-400 uppercase tracking-widest">Main Array (3x3)</span>
                <div className="grid grid-cols-3 gap-1 p-2 bg-slate-900 rounded-lg border border-slate-700">
                    {mainGrid.map((_, i) => (
                        <div key={i} className="w-10 h-10 bg-blue-500/20 border border-blue-500 rounded flex items-center justify-center text-xs text-blue-200">
                            A
                        </div>
                    ))}
                </div>
            </div>

            <span className="text-2xl text-slate-500 font-bold">+</span>

            {/* Sub Array (Broadcasting) */}
            <div className="flex flex-col items-center gap-2">
                <span className="text-xs text-slate-400 uppercase tracking-widest">Sub Array ({broadcastingShape[0]}x{broadcastingShape[1]})</span>
                <div className="grid grid-cols-3 gap-1 p-2 bg-slate-900 rounded-lg border border-slate-700">
                    {broadcastGrid.map((_, i) => {
                        const row = Math.floor(i / 3);
                        const col = i % 3;
                        const isOriginal = row < broadcastingShape[0] && col < broadcastingShape[1];
                        const isBroadcast = (row >= broadcastingShape[0] || col >= broadcastingShape[1]) && 
                                            (broadcastingShape[0] === 1 || row < broadcastingShape[0]) &&
                                            (broadcastingShape[1] === 1 || col < broadcastingShape[1]);

                        return (
                            <div key={i} className={`w-10 h-10 rounded flex items-center justify-center text-xs transition-all duration-500 
                                ${isOriginal ? 'bg-yellow-500/50 border border-yellow-500 text-yellow-100 scale-100' : 
                                  isBroadcast ? 'bg-yellow-500/10 border border-yellow-500/30 text-yellow-100/30 scale-95 animate-pulse' : 
                                  'bg-slate-800 opacity-20 scale-90'}`}>
                                B
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>

        <div className="flex gap-4">
            <button onClick={() => setBroadcastingShape([3, 1])} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${broadcastingShape[0] === 3 && broadcastingShape[1] === 1 ? 'bg-blue-600' : 'bg-slate-800 hover:bg-slate-700'}`}>3 x 1</button>
            <button onClick={() => setBroadcastingShape([1, 3])} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${broadcastingShape[0] === 1 && broadcastingShape[1] === 3 ? 'bg-blue-600' : 'bg-slate-800 hover:bg-slate-700'}`}>1 x 3</button>
            <button onClick={() => setBroadcastingShape([1, 1])} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${broadcastingShape[0] === 1 && broadcastingShape[1] === 1 ? 'bg-blue-600' : 'bg-slate-800 hover:bg-slate-700'}`}>1 x 1</button>
        </div>

        <div className="text-sm text-slate-400 max-w-md text-center">
            {broadcastingShape[0] === 3 && broadcastingShape[1] === 1 ? "Column vector (3x1) is stretched across all columns." : 
             broadcastingShape[0] === 1 && broadcastingShape[1] === 3 ? "Row vector (1x3) is stretched across all rows." :
             "Scalar (1x1) is stretched in both directions."}
        </div>
      </div>
    );
  };

  const renderArrayStructure = () => (
    <div className="flex flex-col items-center gap-8">
        <div className="relative group">
            <div className="flex gap-1 p-2 bg-slate-900 rounded-lg border-2 border-slate-700 overflow-hidden shadow-2xl">
                {Array.from({length: 8}).map((_, i) => (
                    <div key={i} className="w-12 h-16 bg-blue-600/30 border border-blue-400 rounded flex flex-col items-center justify-center gap-1 group-hover:scale-105 transition-transform duration-500">
                        <span className="text-[10px] text-blue-200">0x{i.toString(16)}</span>
                        <span className="font-bold text-white">42</span>
                    </div>
                ))}
            </div>
            <div className="absolute -bottom-10 left-0 w-full text-center text-blue-400 font-mono text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                CONTIGUOUS MEMORY BLOCK
            </div>
        </div>
        <p className="text-slate-400 text-sm max-w-xs text-center">
            N-dimensional arrays are essentially flat pointers in memory with metadata about steps (strides) to reach adjacent elements.
        </p>
    </div>
  );

  return (
    <div className="w-full h-full bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex flex-col items-center justify-center p-8">
      {mode === 'broadcasting-viz' && renderBroadcasting()}
      {mode === 'array-structure' && renderArrayStructure()}
      {mode !== 'broadcasting-viz' && mode !== 'array-structure' && (
        <div className="text-center">
            <div className="w-24 h-24 mb-6 mx-auto rounded-3xl bg-blue-500/20 flex items-center justify-center border border-blue-500 animate-pulse">
                <span className="text-4xl font-bold text-blue-400">NP</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">NumPy Foundations</h3>
            <p className="text-slate-400 max-w-sm">
                Master the numerical engine. Select a step to explore memory layouts and broadcasting.
            </p>
        </div>
      )}
    </div>
  );
}
