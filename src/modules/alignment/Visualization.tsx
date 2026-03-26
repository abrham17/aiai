'use client';

import React, { useState, useEffect } from 'react';

interface Position {
  x: number;
  y: number;
}

interface AlignmentVisualizationProps {
  mode?: string;
  agentPos?: Position;
  goalPos?: Position;
  proxyRewardPos?: Position;
  interactive?: boolean;
  isPlaying?: boolean;
}

export default function AlignmentVisualization(props: AlignmentVisualizationProps) {
  const {
    agentPos: initialAgentPos = { x: 0, y: 0 },
    goalPos = { x: 3, y: 0 },
    proxyRewardPos = { x: 1, y: 1 },
    interactive = false,
  } = props;

  const gridSize = 4;
  const [agentPos, setAgentPos] = useState<Position>(initialAgentPos);
  const [hasStarted, setHasStarted] = useState(false);
  const [rewardAmount, setRewardAmount] = useState(0);

  useEffect(() => {
    if (props.agentPos !== undefined) {
      const frame = requestAnimationFrame(() => setAgentPos(props.agentPos!));
      return () => cancelAnimationFrame(frame);
    }
  }, [props.agentPos]);

  // Simulate agent logic based on rewards
  useEffect(() => {
    if (!hasStarted) return;
    
    // In 'gaming' mode, the agent just goes to the proxy and stays there.
    const timer = setInterval(() => {
      setAgentPos(pos => {
        const dx = proxyRewardPos.x - pos.x;
        const dy = proxyRewardPos.y - pos.y;
        
        let newX = pos.x;
        let newY = pos.y;
        if (Math.abs(dx) > 0) newX += Math.sign(dx);
        else if (Math.abs(dy) > 0) newY += Math.sign(dy);
        
        // Give reward if on proxy
        if (newX === proxyRewardPos.x && newY === proxyRewardPos.y) {
          setRewardAmount(r => r + 10);
        } else {
           setRewardAmount(r => r - 1); // step penalty
        }

        return { x: newX, y: newY };
      });
    }, 600);

    return () => clearInterval(timer);
  }, [hasStarted, proxyRewardPos.x, proxyRewardPos.y]);

  const handleCellClick = (x: number, y: number) => {
    if (!interactive) return;
    setAgentPos({ x, y });
  };

  const isProxy = (x: number, y: number) => proxyRewardPos.x === x && proxyRewardPos.y === y;
  const isGoal = (x: number, y: number) => goalPos.x === x && goalPos.y === y;
  const isAgent = (x: number, y: number) => agentPos.x === x && agentPos.y === y;

  const renderGrid = () => {
    const cells = [];
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        let bgColor = 'bg-slate-800';
        let content = null;

        if (isProxy(x, y)) {
          bgColor = 'bg-amber-900/40 border-amber-500/50';
          content = <div className="text-amber-400 font-bold text-xs">Proxy Reward</div>;
        } else if (isGoal(x, y)) {
          bgColor = 'bg-emerald-900/40 border-emerald-700/50';
          content = <div className="text-emerald-400 font-bold text-2xl">★ True Goal</div>;
        }

        if (isAgent(x, y)) {
          content = (
            <div className="absolute inset-0 m-auto w-3/4 h-3/4 rounded-md bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] flex items-center justify-center z-10 transition-all duration-300">
               <span className="text-xl">🤖</span>
            </div>
          );
        }

        cells.push(
          <div 
            key={`${x},${y}`} 
            className={`w-full aspect-square border border-slate-700 rounded flex flex-col items-center justify-center relative overflow-hidden text-center p-2 ${bgColor} ${interactive ? 'cursor-pointer hover:border-slate-500' : ''}`}
            onClick={() => handleCellClick(x, y)}
          >
            {content}
          </div>
        );
      }
    }
    return cells;
  };

  return (
    <div className="w-full flex flex-col md:flex-row gap-6 items-center justify-center p-6 bg-slate-900 rounded-xl max-w-4xl mx-auto">
      
      {/* Grid World */}
      <div 
        className="w-full max-w-[400px] gap-2 grid relative"
        style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}
      >
         {renderGrid()}
         
         {!interactive && !hasStarted && (
           <div className="absolute inset-0 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm z-20 rounded-xl">
             <button 
                onClick={() => setHasStarted(true)}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-full transition-colors"
              >
                Start Simulation
              </button>
           </div>
         )}
      </div>

      {/* Info Panel */}
      <div className="flex flex-col gap-4 w-full max-w-sm font-mono text-slate-300">
        <div className="p-4 bg-slate-800 rounded border border-slate-700 flex flex-col gap-4">
           <h3 className="text-blue-400 font-bold uppercase tracking-wider text-xs">Agent Diagnostics</h3>
           
           <div className="flex justify-between items-center text-xl border-b border-slate-700 pb-2">
             <span>Accumulated Reward:</span> 
             <span className={rewardAmount > 0 ? "text-emerald-400" : "text-rose-400 font-bold"}>{rewardAmount}</span>
           </div>
           
           <div className="flex justify-between items-center text-sm text-amber-500 bg-amber-900/20 p-2 rounded">
             <span>Proxy Tile Loop Detected?</span> 
             <span className="font-bold uppercase">{agentPos.x === proxyRewardPos.x && agentPos.y === proxyRewardPos.y && rewardAmount > 20 ? 'TRUE' : 'FALSE'}</span>
           </div>
        </div>
      </div>
      
    </div>
  );
}
