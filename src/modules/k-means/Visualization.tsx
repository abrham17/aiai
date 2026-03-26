'use client';

import React, { useState, useEffect, useRef } from 'react';

interface Point {
  x: number;
  y: number;
}

interface KMeansVisualizationProps {
  mode?: string;
  points?: Point[];
  centroids?: Point[];
  k?: number;
  draggableCentroids?: boolean;
  showAssignments?: boolean;
  showVoronoi?: boolean;
  showUpdateAnimation?: boolean;
  onCentroidsChange?: (centroids: Point[]) => void;
  interactive?: boolean; // For playground clicking to add points
}

export default function KMeansVisualization(props: KMeansVisualizationProps) {
  const {
    mode = 'scatter-only',
    points: initialPoints = [{ x: 5, y: 5 }, { x: 6, y: 6 }],
    centroids: initialCentroids = [{ x: 4, y: 4 }, { x: 7, y: 7 }],
    k = 2,
    draggableCentroids = false,
    showAssignments = false,
    showUpdateAnimation = false,
    onCentroidsChange,
    interactive = false,
  } = props;

  const [points, setPoints] = useState<Point[]>(initialPoints);
  const [centroids, setCentroids] = useState<Point[]>(initialCentroids);
  const [assignments, setAssignments] = useState<number[]>([]);
  
  const svgRef = useRef<SVGSVGElement | null>(null);
  const draggingCentroid = useRef<number | null>(null);

  // Colors for up to 5 clusters
  const clusterColors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

  useEffect(() => {
    if (props.points) {
      const frame = requestAnimationFrame(() => setPoints(props.points!));
      return () => cancelAnimationFrame(frame);
    }
  }, [props.points]);

  useEffect(() => {
    if (props.centroids && !draggingCentroid.current) {
      const frame = requestAnimationFrame(() => setCentroids(props.centroids!));
      return () => cancelAnimationFrame(frame);
    }
  }, [props.centroids]);

  // Compute Assignments
  useEffect(() => {
    if (!showAssignments && mode !== 'challenge') {
      requestAnimationFrame(() => setAssignments(points.map(() => -1)));
      return;
    }
    
    // Find closest centroid for each point
    const newAssignments = points.map(p => {
      let minDist = Infinity;
      let minIdx = -1;
      centroids.forEach((c, i) => {
        const distSq = (p.x - c.x) ** 2 + (p.y - c.y) ** 2;
        if (distSq < minDist) {
          minDist = distSq;
          minIdx = i;
        }
      });
      return minIdx;
    });
    
    requestAnimationFrame(() => setAssignments(newAssignments));
  }, [points, centroids, showAssignments, mode]);

  // Handle Dragging Centroids
  const handlePointerDown = (e: React.PointerEvent, idx: number) => {
    if (!draggableCentroids) return;
    draggingCentroid.current = idx;
    (e.target as SVGElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (draggingCentroid.current === null || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    
    // Map bounding box to 0-10 Cartesian
    const x = ((e.clientX - rect.left) / rect.width) * 10;
    const y = 10 - ((e.clientY - rect.top) / rect.height) * 10;

    const newCentroids = [...centroids];
    newCentroids[draggingCentroid.current] = { x: Math.max(0, Math.min(10, x)), y: Math.max(0, Math.min(10, y)) };
    
    setCentroids(newCentroids);
    if (onCentroidsChange) onCentroidsChange(newCentroids);
  };

  const handlePointerUp = () => {
    draggingCentroid.current = null;
  };
  
  // Calculate total inertia (variance)
  let inertia = 0;
  if (assignments.length === points.length && centroids.length > 0) {
     points.forEach((p, i) => {
        const cIdx = assignments[i];
        if (cIdx >= 0 && centroids[cIdx]) {
           inertia += (p.x - centroids[cIdx].x)**2 + (p.y - centroids[cIdx].y)**2;
        }
     });
  }

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

          {/* Lines indicating assignments */}
          {showAssignments && points.map((p, i) => {
             const cIdx = assignments[i];
             if (cIdx < 0 || !centroids[cIdx]) return null;
             return (
               <line 
                 key={`assign-${i}`}
                 x1={p.x * 10} y1={100 - p.y * 10}
                 x2={centroids[cIdx].x * 10} y2={100 - centroids[cIdx].y * 10}
                 stroke={clusterColors[cIdx % clusterColors.length]}
                 strokeWidth="0.5"
                 strokeDasharray="1,1"
                 opacity="0.5"
               />
             );
          })}

          {/* Points */}
          {points.map((p, i) => {
             const cIdx = assignments[i];
             const color = cIdx >= 0 ? clusterColors[cIdx % clusterColors.length] : '#94a3b8';
             return (
               <circle 
                 key={`pt-${i}`}
                 cx={p.x * 10} cy={100 - p.y * 10} r="1.5" 
                 fill={color} 
                 stroke="#fff" strokeWidth="0.3"
               />
             );
          })}

          {/* Centroids */}
          {(mode !== 'scatter-only') && centroids.map((c, i) => {
             const cx = c.x * 10;
             const cy = 100 - c.y * 10;
             const color = clusterColors[i % clusterColors.length];
             return (
               <g 
                 key={`centroid-${i}`} 
                 transform={`translate(${cx}, ${cy})`}
                 className={draggableCentroids ? 'cursor-move' : ''}
                 onPointerDown={(e) => handlePointerDown(e, i)}
               >
                 {/* Invisible hit box for easier dragging */}
                 {draggableCentroids && <circle cx="0" cy="0" r="8" fill="transparent" />}
                 {/* Star shape for centroid */}
                 <polygon 
                   points="0,-4 1,-1 4,-1 1.5,1 2.5,4 0,2 -2.5,4 -1.5,1 -4,-1 -1,-1" 
                   fill={color} stroke="#fff" strokeWidth="0.5" 
                 />
               </g>
             );
          })}
        </svg>
      </div>

      {/* Info Panel */}
      <div className="flex flex-col gap-4 w-full max-w-sm font-mono text-slate-300">
        <div className="p-4 bg-slate-800 rounded border border-slate-700 flex flex-col gap-4">
           
           <h3 className="text-blue-400 font-bold uppercase tracking-wider text-xs border-b border-slate-700 pb-2">Clustering Metrics</h3>
           
           <div className="flex justify-between items-center text-sm">
             <span>Number of Clusters (K):</span> <span className="text-white font-bold">{k}</span>
           </div>
           
           <div className="flex justify-between items-center text-sm">
             <span>Data Points:</span> <span className="text-white font-bold">{points.length}</span>
           </div>

           {(showAssignments || mode === 'challenge') && (
               <div className="mt-4 flex justify-between items-center text-lg bg-slate-900 border border-slate-700 p-3 rounded">
                  <span className="text-slate-400 text-xs uppercase tracking-wider tooltip" title="Sum of squared distances from points to their closest centroid (Inertia)">Total Variance</span> 
                  <span className="text-amber-400 font-bold">
                    {inertia.toFixed(2)}
                  </span>
               </div>
           )}
        </div>
      </div>
    </div>
  );
}
