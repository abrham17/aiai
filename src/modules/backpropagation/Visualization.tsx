'use client';

import React, { useState, useEffect } from 'react';

interface BackpropVisualizationProps {
  mode?: string;
  nodes?: string[];
  edges?: { from: string; to: string }[];
  values?: { x: number; w: number; b: number; target: number };
  learningRate?: number;
  interactive?: boolean;
}

export default function BackpropVisualization(props: BackpropVisualizationProps) {
  const {
    mode = 'forward',
    nodes = ['x', 'w', 'mult', 'b', 'add', 'relu', 'loss'],
    values: initialValues = { x: 2, w: 3, b: -4, target: 5 },
    learningRate: initialLr = 0.1,
  } = props;

  const [x, setX] = useState(initialValues.x);
  const [w, setW] = useState(initialValues.w);
  const [b, setB] = useState(initialValues.b);
  const [target, setTarget] = useState(initialValues.target);
  const [lr, setLr] = useState(initialLr);

  useEffect(() => {
    if (props.values) {
      const frame = requestAnimationFrame(() => {
        setX(props.values!.x ?? x);
        setW(props.values!.w ?? w);
        setB(props.values!.b ?? b);
        setTarget(props.values!.target ?? target);
      });
      return () => cancelAnimationFrame(frame);
    }
  }, [props.values, x, w, b, target]);

  useEffect(() => {
    if (props.learningRate !== undefined) {
      const frame = requestAnimationFrame(() => setLr(props.learningRate!));
      return () => cancelAnimationFrame(frame);
    }
  }, [props.learningRate]);

  // Forward Pass Calculations
  const multOut = w * x;
  const addOut = multOut + b;
  const reluOut = Math.max(0, addOut);
  // Using MSE for simplicity in the graph, but dividing by 2 to make derivative cleaner: L = 1/2(y - t)^2
  const loss = 0.5 * Math.pow(reluOut - target, 2);

  // Backward Pass Calculations (Gradients)
  // dL/d(reluOut) = (reluOut - target)
  const dL_dRelu = reluOut - target;
  
  // d(reluOut)/d(addOut) = 1 if addOut > 0 else 0
  const dRelu_dAdd = addOut > 0 ? 1 : 0;
  
  // dL/d(addOut) = dL_dRelu * dRelu_dAdd
  const dL_dAdd = dL_dRelu * dRelu_dAdd;

  // d(addOut)/d(multOut) = 1, d(addOut)/d(b) = 1
  const dL_dMult = dL_dAdd * 1;
  const dL_dB = dL_dAdd * 1;

  // d(multOut)/d(w) = x, d(multOut)/d(x) = w
  const dL_dW = dL_dMult * x;
  const dL_dX = dL_dMult * w;

  // Step function
  const handleStep = () => {
     setW(prev => prev - lr * dL_dW);
     setB(prev => prev - lr * dL_dB);
  };

  const showGradients = mode === 'backward' || mode === 'update' || mode === 'local-gradients' || mode === 'challenge';

  return (
    <div className="w-full flex flex-col md:flex-row gap-6 items-center justify-center p-4 bg-slate-900 rounded-xl overflow-hidden font-mono text-sm">
      
      {/* Computation Graph Canvas */}
      <div className="relative w-full max-w-2xl h-[400px] bg-slate-800 rounded-lg overflow-hidden border border-slate-700 p-6 flex items-center justify-between">
         
         <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
            {/* W -> Mult */}
            <path d="M 60 120 C 120 120, 100 200, 160 200" fill="none" stroke="#475569" strokeWidth="3" />
            {/* X -> Mult */}
            <path d="M 60 280 C 120 280, 100 200, 160 200" fill="none" stroke="#475569" strokeWidth="3" />
            {/* Mult -> Add */}
            <path d="M 220 200 L 280 200" fill="none" stroke="#475569" strokeWidth="3" />
            {/* B -> Add */}
            <path d="M 180 80 C 240 80, 240 180, 280 200" fill="none" stroke="#475569" strokeWidth="3" />
            {/* Add -> ReLU */}
            <path d="M 340 200 L 400 200" fill="none" stroke="#475569" strokeWidth="3" />
            
            {nodes.includes('loss') && (
               <>
                  <path d="M 460 200 L 520 200" fill="none" stroke="#475569" strokeWidth="3" />
                  <path d="M 460 300 C 500 300, 480 220, 520 200" fill="none" stroke="#475569" strokeWidth="3" strokeDasharray="5,5" />
               </>
            )}

            {/* Gradient Paths (Backward) */}
            {showGradients && (
               <g opacity="0.6">
                  {/* Loss -> ReLU */}
                  {nodes.includes('loss') && <path d="M 520 220 L 460 220" fill="none" stroke="#fb7185" strokeWidth="3" strokeDasharray="4,4" />}
                  {/* ReLU -> Add */}
                  <path d="M 400 220 L 340 220" fill="none" stroke="#fb7185" strokeWidth="3" strokeDasharray="4,4" />
                  {/* Add -> B */}
                  <path d="M 290 220 C 240 220, 260 100, 180 100" fill="none" stroke="#fb7185" strokeWidth="3" strokeDasharray="4,4" />
                  {/* Add -> Mult */}
                  <path d="M 280 220 L 220 220" fill="none" stroke="#fb7185" strokeWidth="3" strokeDasharray="4,4" />
                  {/* Mult -> W */}
                  <path d="M 150 220 C 100 220, 130 140, 60 140" fill="none" stroke="#fb7185" strokeWidth="3" strokeDasharray="4,4" />
                  {/* Mult -> X */}
                  <path d="M 150 220 C 100 220, 130 300, 60 300" fill="none" stroke="#fb7185" strokeWidth="3" strokeDasharray="4,4" />
               </g>
            )}
         </svg>

         {/* Nodes Layer */}
         <div className="absolute inset-0 w-full h-full pointer-events-auto" style={{ zIndex: 10 }}>
            {/* Input W */}
            <div className="absolute top-[100px] left-[20px] bg-blue-900/80 border-2 border-blue-400 p-2 rounded text-center w-[80px]">
               <div className="font-bold text-blue-300">w</div>
               <div>{w.toFixed(2)}</div>
               {showGradients && <div className="text-[10px] text-rose-400 mt-1 font-bold tooltip" title="Gradient of Loss wrt w (dL/dw)">dL: {dL_dW.toFixed(2)}</div>}
            </div>

            {/* Input X */}
            <div className="absolute top-[260px] left-[20px] bg-emerald-900/80 border-2 border-emerald-400 p-2 rounded text-center w-[80px]">
               <div className="font-bold text-emerald-300">x</div>
               <div>{x.toFixed(2)}</div>
               {showGradients && <div className="text-[10px] text-rose-400 mt-1 font-bold tooltip" title="Gradient of Loss wrt x (dL/dx)">dL: {dL_dX.toFixed(2)}</div>}
            </div>

            {/* Input B */}
            <div className="absolute top-[60px] left-[140px] bg-blue-900/80 border-2 border-blue-400 p-2 rounded text-center w-[80px]">
               <div className="font-bold text-blue-300">b</div>
               <div>{b.toFixed(2)}</div>
               {showGradients && <div className="text-[10px] text-rose-400 mt-1 font-bold tooltip" title="Gradient of Loss wrt b (dL/db)">dL: {dL_dB.toFixed(2)}</div>}
            </div>

            {/* Mult Operation */}
            <div className="absolute top-[175px] left-[160px] bg-slate-700 border-2 border-slate-400 rounded-full w-[60px] h-[60px] flex flex-col items-center justify-center">
               <div className="font-bold text-lg">×</div>
               <div className="text-xs text-slate-300">{multOut.toFixed(2)}</div>
               {mode === 'local-gradients' && <div className="absolute -bottom-10 bg-slate-800 p-1 rounded text-[10px] whitespace-nowrap border border-slate-600 z-50">Local Gradients:<br/>dx = w, dw = x</div>}
            </div>

            {/* Add Operation */}
            <div className="absolute top-[175px] left-[280px] bg-slate-700 border-2 border-slate-400 rounded-full w-[60px] h-[60px] flex flex-col items-center justify-center">
               <div className="font-bold text-lg">+</div>
               <div className="text-xs text-slate-300">{addOut.toFixed(2)}</div>
               {mode === 'local-gradients' && <div className="absolute -bottom-10 bg-slate-800 p-1 rounded text-[10px] whitespace-nowrap border border-slate-600 z-50">Local Gradients:<br/>d_in1 = 1, d_in2 = 1</div>}
            </div>

            {/* ReLU */}
            <div className="absolute top-[175px] left-[400px] bg-purple-900/80 border-2 border-purple-400 rounded w-[60px] h-[60px] flex flex-col items-center justify-center">
               <div className="font-bold text-xs text-purple-200">ReLU</div>
               <div className="text-xs text-slate-300">{reluOut.toFixed(2)}</div>
               {mode === 'local-gradients' && <div className="absolute -bottom-10 bg-slate-800 p-1 rounded text-[10px] whitespace-nowrap border border-slate-600 z-50">Local Gradient:<br/>1 if in&gt;0 else 0</div>}
            </div>

            {/* Loss */}
            {nodes.includes('loss') && (
               <div className="absolute top-[175px] left-[520px] bg-orange-900/80 border-2 border-orange-400 rounded w-[80px] h-[60px] flex flex-col items-center justify-center">
                  <div className="font-bold text-xs text-orange-200">LOSS</div>
                  <div className="text-xs text-slate-300">{loss.toFixed(3)}</div>
                  {mode === 'local-gradients' && <div className="absolute top-16 bg-slate-800 p-1 rounded text-[10px] whitespace-nowrap border border-slate-600 z-50">Local Gradients:<br/>d_pred = (pred - targ)</div>}
               </div>
            )}

            {/* Target */}
            {nodes.includes('loss') && (
               <div className="absolute top-[280px] left-[400px] bg-slate-800 border-2 border-slate-500 rounded p-2 text-center w-[80px]">
                  <div className="font-bold text-slate-400">target</div>
                  <div>{target.toFixed(2)}</div>
               </div>
            )}
         </div>
      </div>

      {/* Control Panel (for standalone modes) */}
      {(mode === 'backward' || mode === 'update' || mode === 'challenge') && (
         <div className="flex flex-col gap-4 w-full max-w-xs shrink-0 bg-slate-800 p-4 rounded border border-slate-700">
            <h3 className="text-blue-400 font-bold uppercase tracking-wider text-xs border-b border-slate-700 pb-2">Training Controls</h3>
            
            <div className="flex justify-between items-center text-sm">
               <span>Learning Rate:</span>
               <span className="font-bold">{lr.toFixed(3)}</span>
            </div>
            
            <div className="flex justify-between items-center text-sm">
               <span>Loss:</span>
               <span className="font-bold text-orange-400">{loss.toFixed(4)}</span>
            </div>

            <button 
               onClick={handleStep}
               className="mt-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-4 rounded transition-colors"
            >
               Step (Backprop + Update)
            </button>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
               Clicking Step calculates the gradients and updates <span className="text-blue-300">w</span> and <span className="text-blue-300">b</span>. Watch the loss drop!
            </p>
         </div>
      )}
    </div>
  );
}
