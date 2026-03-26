'use client';

import React, { useState, useEffect, useRef } from 'react';

interface Position {
  x: number;
  y: number;
}

interface RLAgentsVisualizationProps {
  mode?: string;
  gridSize?: number;
  agentPos?: Position;
  goalPos?: Position;
  obstacles?: Position[];
  epsilon?: number;
  learningRate?: number;
  discountFactor?: number;
  interactive?: boolean;
  showQValues?: boolean;
}

export default function RLAgentsVisualization(props: RLAgentsVisualizationProps) {
  const {
    mode = 'gridworld',
    gridSize: initialGridSize = 4,
    agentPos: initialAgentPos = { x: 0, y: 0 },
    goalPos = { x: 3, y: 3 },
    obstacles = [],
    epsilon = 0.5,
    learningRate = 0.1,
    discountFactor = 0.9,
    interactive = false,
    showQValues = false,
  } = props;

  const [gridSize, setGridSize] = useState(initialGridSize);
  const [agentPos, setAgentPos] = useState<Position>(initialAgentPos);
  
  // Q-values: [gridSize][gridSize][4 (UP, RIGHT, DOWN, LEFT)]
  const [qValues, setQValues] = useState<Record<string, number[]>>({});

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (props.gridSize !== undefined) setGridSize(props.gridSize);
      if (props.agentPos !== undefined) setAgentPos(props.agentPos);
    });
    return () => cancelAnimationFrame(frame);
  }, [props.gridSize, props.agentPos]);

  // Handle interaction click to move
  const handleCellClick = (x: number, y: number) => {
    if (!interactive) return;
    
    // Simple logic mode: teleport to clicked adjacent cell
    const dx = Math.abs(x - agentPos.x);
    const dy = Math.abs(y - agentPos.y);
    if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
        // Is it an obstacle?
        if (!obstacles.find(o => o.x === x && o.y === y)) {
            setAgentPos({ x, y });
        }
    }
  };

  const isObstacle = (x: number, y: number) => obstacles.some(o => o.x === x && o.y === y);
  const isGoal = (x: number, y: number) => goalPos.x === x && goalPos.y === y;
  const isAgent = (x: number, y: number) => agentPos.x === x && agentPos.y === y;

  const renderGrid = () => {
    const cells = [];
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        let bgColor = 'bg-slate-800';
        let content = null;

        if (isObstacle(x, y)) {
          bgColor = 'bg-slate-900 border-slate-700';
          content = <div className="w-full h-full bg-slate-900/50 flex items-center justify-center text-slate-700">✖</div>;
        } else if (isGoal(x, y)) {
          bgColor = 'bg-emerald-900/40 border-emerald-700/50';
          content = <div className="text-emerald-400 font-bold text-2xl">★</div>;
        }

        if (isAgent(x, y)) {
          content = (
            <div className="w-4/5 h-4/5 rounded-md bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] flex items-center justify-center z-10 transition-all duration-200">
               <div className="w-2 h-2 rounded-full bg-white opacity-80" />
            </div>
          );
        }

        cells.push(
          <div 
            key={`${x},${y}`} 
            className={`w-full aspect-square border border-slate-700 rounded flex items-center justify-center relative ${bgColor} ${interactive && !isObstacle(x, y) ? 'cursor-pointer hover:border-slate-500' : ''}`}
            onClick={() => handleCellClick(x, y)}
          >
            {content}
            {showQValues && !isObstacle(x, y) && !isGoal(x, y) && (
              <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 p-1 gap-1 text-[8px] font-mono text-slate-500 opacity-50 pointer-events-none">
                 <div className="flex items-start justify-center">0.0</div>
                 <div className="flex items-center justify-end">0.0</div>
                 <div className="flex items-center justify-start">0.0</div>
                 <div className="flex items-end justify-center">0.0</div>
              </div>
            )}
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
        className="w-full max-w-[400px] gap-2 grid"
        style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}
      >
         {renderGrid()}
      </div>

      {/* Info Panel */}
      <div className="flex flex-col gap-4 w-full max-w-sm font-mono text-slate-300">
        
        <div className="p-4 bg-slate-800 rounded border border-slate-700 flex flex-col gap-2">
           <h3 className="text-blue-400 font-bold uppercase tracking-wider text-xs mb-2">Agent Status</h3>
           <div className="flex justify-between"><span>Position:</span> <span className="text-white">({agentPos.x}, {agentPos.y})</span></div>
           <div className="flex justify-between"><span>Goal:</span>     <span className="text-emerald-400">({goalPos.x}, {goalPos.y})</span></div>
        </div>

        {(mode === 'q-learning' || mode === 'bellman' || mode === 'challenge') && (
          <div className="p-4 bg-slate-800 rounded border border-slate-700 flex flex-col gap-2">
             <h3 className="text-amber-400 font-bold uppercase tracking-wider text-xs mb-2">Hyperparameters</h3>
             <div className="flex justify-between"><span>Epsilon (ε):</span> <span className="text-white">{epsilon.toFixed(2)}</span></div>
             <div className="flex justify-between"><span>Learning Rate (α):</span> <span className="text-white">{learningRate.toFixed(2)}</span></div>
             <div className="flex justify-between"><span>Discount (γ):</span> <span className="text-white">{discountFactor.toFixed(2)}</span></div>
          </div>
        )}
        
      </div>
      
    </div>
  );
}
