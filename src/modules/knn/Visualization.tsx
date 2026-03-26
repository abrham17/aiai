'use client';

import React, { useState, useEffect, useRef } from 'react';

interface Point {
  x: number;
  y: number;
  class?: number;
}

interface KNNVisualizationProps {
  mode?: string;
  points?: Point[];
  testPoint?: Point;
  k?: number;
  metric?: string;
  interactive?: boolean;
}

export default function KNNVisualization(props: KNNVisualizationProps) {
  const {
    mode = 'intro',
    points: initialPoints = [
      { x: 2, y: 7, class: 0 }, { x: 3, y: 8, class: 0 }, { x: 8, y: 2, class: 1 }
    ],
    testPoint: initialTestPoint = { x: 5, y: 5 },
    k = 1,
    metric = 'euclidean',
    interactive = false,
  } = props;

  const [points, setPoints] = useState<Point[]>(initialPoints);
  const [testPoint, setTestPoint] = useState<Point>(initialTestPoint);
  
  const svgRef = useRef<SVGSVGElement | null>(null);
  const isDragging = useRef<boolean>(false);

  // Colors
  const classColors = ['#ef4444', '#3b82f6']; // 0=Red, 1=Blue

  useEffect(() => {
    if (props.points) {
      const frame = requestAnimationFrame(() => setPoints(props.points!));
      return () => cancelAnimationFrame(frame);
    }
  }, [props.points]);

  useEffect(() => {
    if (props.testPoint && !isDragging.current) {
      const frame = requestAnimationFrame(() => setTestPoint(props.testPoint!));
      return () => cancelAnimationFrame(frame);
    }
  }, [props.testPoint]);

  // KNN Logic
  const getDist = (p1: Point, p2: Point) => {
    if (metric === 'manhattan') {
       return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);
    }
    // Euclidean
    return Math.sqrt((p1.x - p2.x)**2 + (p1.y - p2.y)**2);
  };

  const sortedPoints = [...points].sort((a, b) => getDist(testPoint, a) - getDist(testPoint, b));
  const neighbors = sortedPoints.slice(0, k);

  const votes: Record<number, number> = { 0: 0, 1: 0 };
  neighbors.forEach(n => {
     if (n.class !== undefined) {
         votes[n.class] = (votes[n.class] || 0) + 1;
     }
  });
  
  // Resolve classification (simple tie breaking towards class 0)
  const predictedClass = votes[1] > votes[0] ? 1 : 0;

  // Handle Dragging
  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    (e.target as SVGElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    
    // Map bounding box to 0-10 Cartesian
    const x = ((e.clientX - rect.left) / rect.width) * 10;
    const y = 10 - ((e.clientY - rect.top) / rect.height) * 10;

    setTestPoint({ x: Math.max(0, Math.min(10, x)), y: Math.max(0, Math.min(10, y)) });
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  if (mode === 'curse') {
    return (
      <div className="w-full flex items-center justify-center p-6 bg-slate-900 rounded-xl">
         <div className="text-center">
            <h3 className="text-xl text-amber-400 font-bold mb-4">Volume Explosion</h3>
            <p className="text-slate-300 max-w-md">
               In 1D, to cover 10% of the range, you need 10% of the data.<br/><br/>
               In 2D, to cover 10% of the area, you need to span <span className="text-white font-bold">~31.6%</span> of the range in each dimension ($0.316^2 = 0.1$).<br/><br/>
               In 10D, you need to span <span className="text-white font-bold">~80%</span> of each dimension ($0.794^{10} = 0.1$) just to capture 10% of the data space!<br/><br/>
               Therefore, your &quot;nearest&quot; neighbor is actually very far away across most features.
            </p>
         </div>
      </div>
    );
  }

  // Radius for Euclidean visualization
  const maxNeighborDist = neighbors.length > 0 ? getDist(testPoint, neighbors[neighbors.length - 1]) : 0;

  return (
    <div className="w-full flex flex-col md:flex-row gap-6 items-center justify-center p-6 bg-slate-900 rounded-xl max-w-4xl mx-auto">
      
      {/* Visualization Canvas */}
      <div className="relative w-full max-w-[400px] aspect-square shrink-0 bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
        <svg
          ref={svgRef}
          viewBox="0 0 100 100" // 0-10 domain mapped to 0-100 svg units
          className="w-full h-full"
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          {/* Background Grid */}
          <g opacity="0.1">
            {[2,4,6,8].map(i => (
              <React.Fragment key={i}>
                <line x1={i*10} y1="0" x2={i*10} y2="100" stroke="#fff" />
                <line x1="0" y1={i*10} x2="100" y2={i*10} stroke="#fff" />
              </React.Fragment>
            ))}
          </g>

          {/* Visualization of "Nearest" Search Area */}
          {metric === 'euclidean' && maxNeighborDist > 0 && (
             <circle 
                cx={testPoint.x * 10} cy={100 - testPoint.y * 10} 
                r={maxNeighborDist * 10} 
                fill={classColors[predictedClass]} opacity="0.1" 
                stroke={classColors[predictedClass]} strokeDasharray="2,2"
             />
          )}

          {metric === 'manhattan' && maxNeighborDist > 0 && (
             <polygon
                points={`
                    ${testPoint.x*10},${100 - (testPoint.y + maxNeighborDist)*10}
                    ${(testPoint.x + maxNeighborDist)*10},${100 - testPoint.y*10}
                    ${testPoint.x*10},${100 - (testPoint.y - maxNeighborDist)*10}
                    ${(testPoint.x - maxNeighborDist)*10},${100 - testPoint.y*10}
                `}
                fill={classColors[predictedClass]} opacity="0.1" 
                stroke={classColors[predictedClass]} strokeDasharray="2,2"
             />
          )}

          {/* Lines indicating nearest neighbors */}
          {neighbors.map((n, i) => {
             return (
               <line 
                 key={`neighbor-${i}`}
                 x1={testPoint.x * 10} y1={100 - testPoint.y * 10}
                 x2={n.x * 10} y2={100 - n.y * 10}
                 stroke="#fff"
                 strokeWidth="1"
                 opacity="0.5"
               />
             );
          })}

          {/* Points */}
          {points.map((p, i) => {
             const color = p.class !== undefined ? classColors[p.class] : '#94a3b8';
             const isNeighbor = neighbors.includes(p);
             return (
               <circle 
                 key={`pt-${i}`}
                 cx={p.x * 10} cy={100 - p.y * 10} 
                 r={isNeighbor ? "2.5" : "1.5"} 
                 fill={color} 
                 stroke={isNeighbor ? "#fff" : "transparent"} strokeWidth="0.5"
                 opacity={isNeighbor ? 1 : 0.6}
               />
             );
          })}

          {/* Test Point (Draggable) */}
          <g 
            transform={`translate(${testPoint.x * 10}, ${100 - testPoint.y * 10})`}
            className="cursor-move text-[8px]"
            onPointerDown={handlePointerDown}
          >
             <circle cx="0" cy="0" r="6" fill="transparent" /> {/* hit box */}
             <circle cx="0" cy="0" r="3" fill="#cbd5e1" stroke="#334155" strokeWidth="1" />
             <text x="-3" y="1" fill="#1e293b" fontSize="4" fontWeight="bold">?</text>
          </g>
        </svg>
      </div>

      {/* Info Panel */}
      <div className="flex flex-col gap-4 w-full max-w-sm font-mono text-slate-300">
        <div className="p-4 bg-slate-800 rounded border border-slate-700 flex flex-col gap-4">
           
           <h3 className="text-blue-400 font-bold uppercase tracking-wider text-xs border-b border-slate-700 pb-2">KNN Prediction</h3>
           
           <div className="flex justify-between items-center text-sm">
             <span>K (Neighbors):</span> <span className="text-white font-bold">{k}</span>
           </div>
           
           <div className="flex justify-between items-center text-sm">
             <span className="text-rose-400">Class 0 (Red) Votes:</span> 
             <span className="text-white font-bold">{votes[0]}</span>
           </div>

           <div className="flex justify-between items-center text-sm">
             <span className="text-blue-400">Class 1 (Blue) Votes:</span> 
             <span className="text-white font-bold">{votes[1]}</span>
           </div>

           <div className="mt-4 flex justify-between items-center text-lg bg-slate-900 border border-slate-700 p-3 rounded">
              <span className="text-slate-400 text-xs uppercase tracking-wider">Prediction</span> 
              <span className="font-bold uppercase" style={{ color: classColors[predictedClass] }}>
                Class {predictedClass}
              </span>
           </div>
        </div>
      </div>
    </div>
  );
}
