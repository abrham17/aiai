'use client';

import React, { useState, useEffect } from 'react';

/* ═══════════════════════════════════════════════════════════════════
   LLMTraining Redesign — High-Fidelity Visualizer
   Bespoke modes for Tokenization, SFT, and LoRA.
   ═══════════════════════════════════════════════════════════════════ */

interface LLMVizProps {
  mode?: string;
  intensity?: number;
}

export default function LLMTrainingVisualization({ mode = 'tokenizer-interactive', intensity = 1 }: LLMVizProps) {
  const [inputText, setInputText] = useState('Deep learning is powerful');
  
  // ── Mode: Tokenizer ──
  const renderTokenizer = () => {
    // Fake sub-word tokenization
    const tokens = inputText.match(/.{1,4}/g) || [];
    const colors = ['bg-indigo-500/20', 'bg-purple-500/20', 'bg-amber-500/20', 'bg-emerald-500/20'];

    return (
      <div className="flex flex-col gap-6 w-full max-w-lg">
        <div className="flex flex-col gap-2">
            <span className="text-[10px] uppercase font-bold text-slate-500">Try Input:</span>
            <input 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="bg-slate-800 border border-slate-700 p-3 rounded-lg text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Type something..."
            />
        </div>

        <div className="flex flex-wrap gap-2 p-6 bg-slate-800/50 rounded-xl border border-dashed border-slate-700 min-h-[100px] items-center justify-center">
            {tokens.map((t, i) => (
                <div key={i} className={`px-3 py-1.5 rounded border border-white/10 ${colors[i % colors.length]} flex flex-col items-center animate-in fade-in zoom-in duration-300`}>
                    <span className="text-white font-bold font-mono text-lg">{t}</span>
                    <span className="text-[8px] text-slate-400 font-mono">ID: {Math.floor(Math.random() * 50000)}</span>
                </div>
            ))}
        </div>
      </div>
    );
  };

  const renderLoRA = () => {
     const rank = Math.max(2, Math.floor(intensity * 10));
     return (
        <div className="flex flex-col items-center gap-8 w-full max-w-lg">
            <div className="flex items-center gap-4">
               <div className="w-32 h-32 bg-slate-800 border-2 border-slate-600 rounded flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 opacity-20 bg-[grid:10px_10px]" />
                  <span className="text-[10px] font-bold text-slate-400 rotate-[-45deg]">FROZEN W</span>
               </div>
               <span className="text-2xl text-slate-600 font-black">+</span>
               <div className="flex flex-col gap-2 items-center">
                  <div className="w-32 h-10 bg-indigo-500/30 border border-indigo-400 rounded flex items-center justify-center">
                     <span className="text-[10px] font-bold text-indigo-300">MATRIX A (r={rank})</span>
                  </div>
                  <div className="w-10 h-32 bg-indigo-500/30 border border-indigo-400 rounded flex items-center justify-center">
                     <span className="text-[10px] font-bold text-indigo-400 -rotate-90">MATRIX B</span>
                  </div>
               </div>
            </div>
            <div className="text-center bg-slate-800/50 p-4 rounded-lg border border-slate-700">
               <span className="text-xs text-slate-400">Total Trainable Parameters: <span className="text-indigo-400 font-bold">{rank * 256}</span></span>
               <div className="w-full h-1 bg-slate-900 mt-2 rounded">
                  <div className="h-full bg-indigo-500" style={{ width: `${(rank / 10) * 100}%` }} />
               </div>
            </div>
        </div>
     );
  };

  const renderSFT = () => {
    return (
      <div className="flex flex-col gap-6 w-full max-w-lg items-center">
        <div className="flex gap-4">
            <div className="w-16 h-16 bg-slate-800 rounded border border-slate-700 flex items-center justify-center font-bold text-slate-400">GPT</div>
            <div className="flex flex-col justify-center">
                <span className="text-sm font-bold text-white">Instruction Tuning (SFT)</span>
                <span className="text-xs text-slate-500">Learning to be a helpful assistant</span>
            </div>
        </div>
        <div className="w-full bg-slate-800/50 p-4 rounded border border-dashed border-indigo-500/50">
            <p className="text-xs text-indigo-300 font-mono italic">User: &quot;Explain quantum physics to a 5-year-old&quot;</p>
            <p className="text-xs text-emerald-400 font-mono mt-2">Assistant: &quot;Imagine everything is made of tiny magic balls...&quot;</p>
        </div>
      </div>
    );
  };

  const renderRLHF = () => {
    return (
        <div className="flex flex-col items-center gap-6 w-full max-w-lg">
            <div className="relative w-48 h-48 rounded-full border-2 border-slate-800 flex items-center justify-center">
                <div className="absolute inset-0 animate-spin-slow">
                    <div className="absolute top-0 left-1/2 -ml-4 w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-[10px] text-white font-bold">LLM</div>
                    <div className="absolute bottom-0 left-1/2 -ml-4 w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-[10px] text-white font-bold">RW</div>
                </div>
                <div className="text-center">
                    <span className="text-2xl">⚖️</span>
                    <p className="text-[10px] font-bold text-slate-400 mt-2">RLHF LOOP</p>
                </div>
            </div>
            <div className="flex gap-4">
                <div className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded text-[10px]">Response A (👍)</div>
                <div className="px-3 py-1 bg-red-500/20 text-red-400 rounded text-[10px]">Response B (👎)</div>
            </div>
        </div>
    );
  };

  const renderCLM = () => (
    <div className="flex flex-col gap-4 items-center">
        <div className="flex gap-2 font-mono text-lg">
            <span className="text-slate-500">The</span>
            <span className="text-slate-500">cat</span>
            <span className="text-slate-500">sat</span>
            <span className="text-slate-500">on</span>
            <span className="text-indigo-400 font-bold underline animate-pulse">the</span>
            <span className="text-slate-700">???</span>
        </div>
        <div className="flex gap-2">
            <div className="px-2 py-1 bg-indigo-500/10 border border-indigo-500/30 rounded text-xs text-indigo-300">mat (85%)</div>
            <div className="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-xs text-slate-500">floor (10%)</div>
        </div>
    </div>
  );

  return (
    <div className="w-full min-h-[400px] flex flex-col items-center justify-center p-8 bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl relative overflow-hidden group">
      {mode === 'tokenizer-interactive' && renderTokenizer()}
      {mode === 'lo-ra-viz' && renderLoRA()}
      {mode === 'sft-viz' && renderSFT()}
      {mode === 'rlhf-loop-viz' && renderRLHF()}
      {mode === 'clm-viz' && renderCLM()}
      
      {!['tokenizer-interactive', 'lo-ra-viz', 'sft-viz', 'rlhf-loop-viz', 'clm-viz'].includes(mode) && (
          <div className="text-slate-500 font-mono text-sm uppercase tracking-widest">
             {mode.replace(/-/g, ' ')}
          </div>
      )}
    </div>
  );
}
