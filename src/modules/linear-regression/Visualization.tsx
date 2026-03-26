'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';

// ── Types ──
interface Point {
  x: number;
  y: number;
}

interface LineParams {
  m: number;
  b: number;
}

interface LinearRegressionVisualizationProps {
  mode?: string;
  points?: Point[];
  line?: LineParams;
  draggableLine?: boolean;
  showResiduals?: boolean;
  showSquares?: boolean;
  showMSE?: boolean;
  onLineChange?: (line: LineParams) => void;
}

// ── Constants ──
const CANVAS_SIZE = 500;
const PADDING = 40;
const GRAPH_SIZE = CANVAS_SIZE - PADDING * 2;
// Logic coordinates from x=0 to 10, y=0 to 10
const X_MIN = 0;
const X_MAX = 6;
const Y_MIN = 0;
const Y_MAX = 8;

function toSvg(x: number, y: number): [number, number] {
  const svgX = PADDING + ((x - X_MIN) / (X_MAX - X_MIN)) * GRAPH_SIZE;
  const svgY = CANVAS_SIZE - PADDING - ((y - Y_MIN) / (Y_MAX - Y_MIN)) * GRAPH_SIZE;
  return [svgX, svgY];
}

function fromSvg(svgX: number, svgY: number): [number, number] {
  const x = X_MIN + ((svgX - PADDING) / GRAPH_SIZE) * (X_MAX - X_MIN);
  const y = Y_MIN + ((CANVAS_SIZE - PADDING - svgY) / GRAPH_SIZE) * (Y_MAX - Y_MIN);
  return [x, y];
}

export default function LinearRegressionVisualization(props: LinearRegressionVisualizationProps) {
  const {
    points: initialPoints = [{ x: 1, y: 2 }, { x: 3, y: 4 }, { x: 5, y: 5 }],
    line: initialLine = { m: 1, b: 1 },
    draggableLine = false,
    showResiduals = false,
    showSquares = false,
    showMSE = false,
    onLineChange,
  } = props;

  const [points, setPoints] = useState<Point[]>(initialPoints);
  const [line, setLine] = useState<LineParams>(initialLine);
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (props.points) {
      const frame = requestAnimationFrame(() => setPoints(props.points!));
      return () => cancelAnimationFrame(frame);
    }
  }, [props.points]);

  useEffect(() => {
    if (props.line) {
      const frame = requestAnimationFrame(() => setLine(props.line!));
      return () => cancelAnimationFrame(frame);
    }
  }, [props.line]);

  // Handle Dragging
  const activeHandle = useRef<'left' | 'right' | null>(null);

  const leftX = 0;
  const rightX = 6;
  const leftY = line.m * leftX + line.b;
  const rightY = line.m * rightX + line.b;

  const handlePointerDown = (handle: 'left' | 'right') => (e: React.PointerEvent) => {
    if (!draggableLine) return;
    activeHandle.current = handle;
    (e.target as SVGElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!activeHandle.current || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const svgX = ((e.clientX - rect.left) / rect.width) * CANVAS_SIZE;
    const svgY = ((e.clientY - rect.top) / rect.height) * CANVAS_SIZE;
    const [, dy] = fromSvg(svgX, svgY);
    
    setLine((prev) => {
      let lY = prev.m * leftX + prev.b;
      let rY = prev.m * rightX + prev.b;
      
      if (activeHandle.current === 'left') {
        lY = Math.max(Y_MIN - 2, Math.min(Y_MAX + 2, dy));
      } else {
        rY = Math.max(Y_MIN - 2, Math.min(Y_MAX + 2, dy));
      }
      
      const newM = (rY - lY) / (rightX - leftX);
      const newB = lY - newM * leftX;
      const newLine = { m: newM, b: newB };
      
      if (onLineChange) onLineChange(newLine);
      return newLine;
    });
  };

  const handlePointerUp = () => {
    activeHandle.current = null;
  };

  // derived metrics
  let totalSqError = 0;
  points.forEach(p => {
    const yHat = line.m * p.x + line.b;
    totalSqError += Math.pow(p.y - yHat, 2);
  });
  const mse = totalSqError / points.length;

  const renderGrid = () => {
    const lines = [];
    for (let i = X_MIN; i <= X_MAX; i++) {
      const [x1, y1] = toSvg(i, Y_MIN);
      const [x2, y2] = toSvg(i, Y_MAX);
      lines.push(<line key={`vx${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--viz-grid-minor)" strokeWidth={0.5} />);
      lines.push(<text key={`tx${i}`} x={x1} y={y1 + 15} textAnchor="middle" fontSize={10} fill="var(--viz-axis-label)">{i}</text>);
    }
    for (let j = Y_MIN; j <= Y_MAX; j++) {
      const [x1, y1] = toSvg(X_MIN, j);
      const [x2, y2] = toSvg(X_MAX, j);
      lines.push(<line key={`hy${j}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--viz-grid-minor)" strokeWidth={0.5} />);
      if (j > 0) {
        lines.push(<text key={`ty${j}`} x={x1 - 15} y={y1 + 3} textAnchor="end" fontSize={10} fill="var(--viz-axis-label)">{j}</text>);
      }
    }
    const [ox, oy] = toSvg(X_MIN, Y_MIN);
    const [mx, my] = toSvg(X_MAX, Y_MAX);
    lines.push(<line key="axis-x" x1={ox} y1={oy} x2={mx} y2={oy} stroke="var(--viz-grid-major)" strokeWidth={1.5} />);
    lines.push(<line key="axis-y" x1={ox} y1={oy} x2={ox} y2={my} stroke="var(--viz-grid-major)" strokeWidth={1.5} />);
    return <g>{lines}</g>;
  };

  const [lx1, ly1] = toSvg(leftX, leftY);
  const [lx2, ly2] = toSvg(rightX, rightY);

  return (
    <div className="relative w-full aspect-square max-w-[500px] mx-auto select-none touch-none">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${CANVAS_SIZE} ${CANVAS_SIZE}`}
        className="w-full h-full bg-slate-900 rounded-xl overflow-hidden"
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {renderGrid()}

        {/* Residuals */}
        {showResiduals && points.map((p, i) => {
          const yHat = line.m * p.x + line.b;
          const [px, py] = toSvg(p.x, p.y);
          const [cx, cy] = toSvg(p.x, yHat);
          
          let squareObj = null;
          if (showSquares) {
            const side = Math.abs(cy - py);
            const sqX = p.x > (X_MAX/2) ? px - side : px; // draw left or right
            const sqY = Math.min(py, cy);
            squareObj = (
              <rect x={sqX} y={sqY} width={side} height={side} fill="rgba(248, 113, 113, 0.2)" stroke="#f87171" strokeDasharray="3,3" />
            );
          }

          return (
            <g key={`res${i}`}>
              {squareObj}
              <line x1={px} y1={py} x2={cx} y2={cy} stroke="#f87171" strokeWidth={2} strokeDasharray="4,4" />
            </g>
          );
        })}

        {/* The Line */}
        <line x1={lx1} y1={ly1} x2={lx2} y2={ly2} stroke="var(--accent)" strokeWidth={3} />

        {/* Handles */}
        {draggableLine && (
          <>
            <circle cx={lx1} cy={ly1} r={12} fill="var(--accent)" opacity={0.3} style={{ cursor: 'ns-resize' }} />
            <circle cx={lx1} cy={ly1} r={6} fill="var(--accent)" stroke="white" strokeWidth={2} style={{ cursor: 'ns-resize' }} onPointerDown={handlePointerDown('left')} />
            
            <circle cx={lx2} cy={ly2} r={12} fill="var(--accent)" opacity={0.3} style={{ cursor: 'ns-resize' }} />
            <circle cx={lx2} cy={ly2} r={6} fill="var(--accent)" stroke="white" strokeWidth={2} style={{ cursor: 'ns-resize' }} onPointerDown={handlePointerDown('right')} />
          </>
        )}

        {/* Points */}
        {points.map((p, i) => {
          const [px, py] = toSvg(p.x, p.y);
          return (
            <circle key={`pt${i}`} cx={px} cy={py} r={5} fill="#60a5fa" stroke="white" strokeWidth={1.5} />
          );
        })}

      </svg>
      
      {showMSE && (
        <div className="absolute top-4 left-4 bg-slate-800/80 px-3 py-2 rounded-lg border border-slate-700 backdrop-blur text-sm font-mono flex flex-col items-start gap-1">
          <span className="text-yellow-400">MSE: {mse.toFixed(3)}</span>
          <span className="text-indigo-400">y = {line.m.toFixed(2)}x + {line.b.toFixed(2)}</span>
        </div>
      )}
    </div>
  );
}
