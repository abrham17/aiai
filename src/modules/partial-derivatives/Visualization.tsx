'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

type Mode = 'surface' | 'slice-x' | 'slice-y' | 'gradient' | 'stationary';
type SurfaceId = 'bowl' | 'saddle' | 'ripples';
type Presentation = 'guided' | 'playground';

interface Vec2 {
  x: number;
  y: number;
}

interface PartialDerivativesVisualizationProps {
  mode?: Mode;
  surface?: SurfaceId | string;
  showContours?: boolean;
  showGradient?: boolean;
  showField?: boolean;
  showSlices?: boolean;
  showTangent?: boolean;
  interactive?: boolean;
  point?: Vec2;
  pointX?: number;
  pointY?: number;
  presentation?: Presentation | string;
  onStateChange?: (state: PartialDerivativesSceneState) => void;
}

export interface PartialDerivativesSceneState {
  point: Vec2;
  surface: SurfaceId;
  z: number;
  partialX: number;
  partialY: number;
  gradientMagnitude: number;
}

interface SurfaceModel {
  label: string;
  range: number;
  z: (x: number, y: number) => number;
  dx: (x: number, y: number) => number;
  dy: (x: number, y: number) => number;
}

interface SceneProps {
  mode: Mode;
  surfaceId: SurfaceId;
  presentation: Presentation;
  showContours: boolean;
  showGradient: boolean;
  showField: boolean;
  showSlices: boolean;
  showTangent: boolean;
  interactive: boolean;
  initialPoint: Vec2;
  onStateChange?: (state: PartialDerivativesSceneState) => void;
}

const VIEW_SIZE = 420;

const SURFACES: Record<SurfaceId, SurfaceModel> = {
  bowl: {
    label: 'Bowl',
    range: 3,
    z: (x, y) => 0.4 * x * x + 0.8 * y * y,
    dx: (x) => 0.8 * x,
    dy: (_, y) => 1.6 * y,
  },
  saddle: {
    label: 'Saddle',
    range: 3,
    z: (x, y) => 0.6 * x * x - 0.8 * y * y,
    dx: (x) => 1.2 * x,
    dy: (_, y) => -1.6 * y,
  },
  ripples: {
    label: 'Ripples',
    range: 3,
    z: (x, y) => Math.sin(1.2 * x) * Math.cos(1.1 * y) + 0.12 * (x * x + y * y),
    dx: (x, y) => 1.2 * Math.cos(1.2 * x) * Math.cos(1.1 * y) + 0.24 * x,
    dy: (x, y) => -1.1 * Math.sin(1.2 * x) * Math.sin(1.1 * y) + 0.24 * y,
  },
};

function toSurfaceId(value: string | undefined): SurfaceId {
  if (value === 'saddle' || value === 'ripples') return value;
  return 'bowl';
}

function toPresentation(value: string | undefined): Presentation {
  if (value === 'playground') return 'playground';
  return 'guided';
}

function clamp(value: number, range: number): number {
  return Math.max(-range, Math.min(range, value));
}

function isVec2(value: unknown): value is Vec2 {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Partial<Vec2>;
  return typeof candidate.x === 'number' && typeof candidate.y === 'number';
}

function resolvePoint(explicit: unknown, pointX: unknown, pointY: unknown, range: number): Vec2 {
  if (isVec2(explicit)) {
    return { x: clamp(explicit.x, range), y: clamp(explicit.y, range) };
  }
  if (typeof pointX === 'number' && typeof pointY === 'number') {
    return { x: clamp(pointX, range), y: clamp(pointY, range) };
  }
  return { x: clamp(1.2, range), y: clamp(0.8, range) };
}

function toScreen(point: Vec2, range: number): Vec2 {
  const scale = VIEW_SIZE / (range * 2);
  return {
    x: VIEW_SIZE / 2 + point.x * scale,
    y: VIEW_SIZE / 2 - point.y * scale,
  };
}

function gradientMagnitude(surface: SurfaceModel, point: Vec2): number {
  const dx = surface.dx(point.x, point.y);
  const dy = surface.dy(point.x, point.y);
  return Math.hypot(dx, dy);
}

function gradientTip(surface: SurfaceModel, point: Vec2): Vec2 {
  const dx = surface.dx(point.x, point.y);
  const dy = surface.dy(point.x, point.y);
  const magnitude = Math.hypot(dx, dy);
  if (magnitude < 1e-6) return point;

  const scale = Math.min(0.9, 1.35 / magnitude);
  return {
    x: point.x + dx * scale,
    y: point.y + dy * scale,
  };
}

function surfaceExtrema(surface: SurfaceModel) {
  let min = Number.POSITIVE_INFINITY;
  let max = Number.NEGATIVE_INFINITY;
  const samples = 50;
  const step = (surface.range * 2) / samples;

  for (let yi = 0; yi <= samples; yi += 1) {
    for (let xi = 0; xi <= samples; xi += 1) {
      const x = -surface.range + xi * step;
      const y = -surface.range + yi * step;
      const z = surface.z(x, y);
      min = Math.min(min, z);
      max = Math.max(max, z);
    }
  }

  return { min, max };
}

function colorForValue(value: number, min: number, max: number): string {
  const t = max - min < 1e-6 ? 0.5 : (value - min) / (max - min);
  const hue = 220 - 190 * t;
  const light = 22 + 46 * t;
  return `hsl(${hue} 72% ${light}%)`;
}

function buildContourSegments(surface: SurfaceModel, levels: number[]) {
  const resolution = 24;
  const step = (surface.range * 2) / resolution;
  const grid: number[][] = [];

  for (let yi = 0; yi <= resolution; yi += 1) {
    const row: number[] = [];
    for (let xi = 0; xi <= resolution; xi += 1) {
      const x = -surface.range + xi * step;
      const y = -surface.range + yi * step;
      row.push(surface.z(x, y));
    }
    grid.push(row);
  }

  const segments: Array<{ a: Vec2; b: Vec2 }> = [];

  function interpolate(pointA: Vec2, valueA: number, pointB: Vec2, valueB: number, level: number): Vec2 {
    const denom = valueB - valueA;
    const t = Math.abs(denom) < 1e-6 ? 0.5 : (level - valueA) / denom;
    return {
      x: pointA.x + (pointB.x - pointA.x) * t,
      y: pointA.y + (pointB.y - pointA.y) * t,
    };
  }

  for (const level of levels) {
    for (let yi = 0; yi < resolution; yi += 1) {
      for (let xi = 0; xi < resolution; xi += 1) {
        const bl = { x: -surface.range + xi * step, y: -surface.range + yi * step };
        const br = { x: bl.x + step, y: bl.y };
        const tr = { x: br.x, y: bl.y + step };
        const tl = { x: bl.x, y: bl.y + step };

        const vBl = grid[yi][xi];
        const vBr = grid[yi][xi + 1];
        const vTr = grid[yi + 1][xi + 1];
        const vTl = grid[yi + 1][xi];
        const intersections: Vec2[] = [];

        const edges: Array<[Vec2, number, Vec2, number]> = [
          [bl, vBl, br, vBr],
          [br, vBr, tr, vTr],
          [tr, vTr, tl, vTl],
          [tl, vTl, bl, vBl],
        ];

        edges.forEach(([pointA, valueA, pointB, valueB]) => {
          const crosses = (valueA < level && valueB > level) || (valueA > level && valueB < level);
          if (crosses) {
            intersections.push(interpolate(pointA, valueA, pointB, valueB, level));
          }
        });

        if (intersections.length === 2) {
          segments.push({ a: intersections[0], b: intersections[1] });
        } else if (intersections.length === 4) {
          segments.push({ a: intersections[0], b: intersections[1] });
          segments.push({ a: intersections[2], b: intersections[3] });
        }
      }
    }
  }

  return segments;
}

function Heatmap({ surface }: { surface: SurfaceModel }) {
  const { min, max } = useMemo(() => surfaceExtrema(surface), [surface]);
  const cells = useMemo(() => {
    const resolution = 26;
    const step = (surface.range * 2) / resolution;
    const nextCells = [];

    for (let yi = 0; yi < resolution; yi += 1) {
      for (let xi = 0; xi < resolution; xi += 1) {
        const x = -surface.range + (xi + 0.5) * step;
        const y = -surface.range + (yi + 0.5) * step;
        const z = surface.z(x, y);
        const center = toScreen({ x, y }, surface.range);
        const size = VIEW_SIZE / resolution;
        nextCells.push(
          <rect
            key={`${xi}-${yi}`}
            x={center.x - size / 2}
            y={center.y - size / 2}
            width={size + 0.5}
            height={size + 0.5}
            fill={colorForValue(z, min, max)}
            opacity={0.92}
          />,
        );
      }
    }

    return nextCells;
  }, [max, min, surface]);

  return <g>{cells}</g>;
}

function Contours({ surface }: { surface: SurfaceModel }) {
  const { min, max } = useMemo(() => surfaceExtrema(surface), [surface]);
  const levels = useMemo(() => {
    const nextLevels = [];
    for (let i = 1; i <= 8; i += 1) {
      nextLevels.push(min + ((max - min) * i) / 9);
    }
    return nextLevels;
  }, [max, min]);
  const segments = useMemo(() => buildContourSegments(surface, levels), [levels, surface]);

  return (
    <g>
      {segments.map((segment, index) => {
        const from = toScreen(segment.a, surface.range);
        const to = toScreen(segment.b, surface.range);
        return (
          <line
            key={index}
            x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
            stroke="rgba(255,255,255,0.22)"
            strokeWidth={1.1}
          />
        );
      })}
    </g>
  );
}

function GradientField({ surface }: { surface: SurfaceModel }) {
  const arrows = [];
  for (let y = -surface.range + 0.45; y <= surface.range - 0.45; y += 1.0) {
    for (let x = -surface.range + 0.45; x <= surface.range - 0.45; x += 1.0) {
      const dx = surface.dx(x, y);
      const dy = surface.dy(x, y);
      const magnitude = Math.hypot(dx, dy);
      const scale = magnitude < 1e-6 ? 0 : 0.32 / magnitude;
      const from = toScreen({ x, y }, surface.range);
      const to = toScreen({ x: x + dx * scale, y: y + dy * scale }, surface.range);
      arrows.push(
        <line
          key={`${x}-${y}`}
          x1={from.x}
          y1={from.y}
          x2={to.x}
          y2={to.y}
          stroke="rgba(248,113,113,0.55)"
          strokeWidth={1.2}
          markerEnd="url(#pd-arrow)"
        />,
      );
    }
  }
  return <g>{arrows}</g>;
}

function SliceChart({
  axis,
  point,
  surface,
  showTangent,
  highlighted,
  compact,
}: {
  axis: 'x' | 'y';
  point: Vec2;
  surface: SurfaceModel;
  showTangent: boolean;
  highlighted: boolean;
  compact: boolean;
}) {
  const width = compact ? 240 : 260;
  const height = compact ? 124 : 150;
  const paddingX = compact ? 16 : 18;
  const paddingY = compact ? 14 : 16;
  const samples = 90;
  const values = [];

  for (let i = 0; i <= samples; i += 1) {
    const t = -surface.range + (i / samples) * surface.range * 2;
    const value = axis === 'x' ? surface.z(t, point.y) : surface.z(point.x, t);
    values.push({ t, value });
  }

  const min = Math.min(...values.map((item) => item.value));
  const max = Math.max(...values.map((item) => item.value));

  function chartPoint(t: number, value: number): Vec2 {
    const x = paddingX + ((t + surface.range) / (surface.range * 2)) * (width - paddingX * 2);
    const y = height - paddingY - ((value - min) / Math.max(1e-6, max - min)) * (height - paddingY * 2);
    return { x, y };
  }

  const linePoints = values
    .map((item) => {
      const p = chartPoint(item.t, item.value);
      return `${p.x},${p.y}`;
    })
    .join(' ');

  const coordinate = axis === 'x' ? point.x : point.y;
  const valueAtPoint = surface.z(point.x, point.y);
  const slope = axis === 'x' ? surface.dx(point.x, point.y) : surface.dy(point.x, point.y);
  const center = chartPoint(coordinate, valueAtPoint);
  const tangentLeft = chartPoint(coordinate - 1.2, valueAtPoint - slope * 1.2);
  const tangentRight = chartPoint(coordinate + 1.2, valueAtPoint + slope * 1.2);

  return (
    <div
      style={{
        borderRadius: compact ? 14 : 16,
        border: `1px solid ${highlighted ? 'rgba(99,102,241,0.45)' : 'var(--border-subtle)'}`,
        background: 'var(--bg-surface)',
        padding: compact ? '0.7rem' : '0.8rem',
      }}
    >
      <div style={{ marginBottom: compact ? '0.45rem' : '0.55rem' }}>
        <div style={{ fontSize: compact ? '0.72rem' : '0.75rem', fontWeight: 700, color: highlighted ? 'var(--accent)' : 'var(--text-primary)' }}>
          {axis === 'x' ? 'x-slice' : 'y-slice'}
        </div>
        <div style={{ fontSize: compact ? '0.69rem' : '0.72rem', color: 'var(--text-muted)' }}>
          {axis === 'x' ? 'hold y fixed, move along x' : 'hold x fixed, move along y'}
        </div>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
        <line x1={paddingX} y1={height - paddingY} x2={width - paddingX} y2={height - paddingY} stroke="rgba(255,255,255,0.12)" />
        <line x1={paddingX} y1={paddingY} x2={paddingX} y2={height - paddingY} stroke="rgba(255,255,255,0.12)" />
        <polyline points={linePoints} fill="none" stroke="#a5b4fc" strokeWidth={3} />
        {showTangent && (
          <line
            x1={tangentLeft.x}
            y1={tangentLeft.y}
            x2={tangentRight.x}
            y2={tangentRight.y}
            stroke="#f59e0b"
            strokeWidth={2}
            strokeDasharray="6 4"
          />
        )}
        <circle cx={center.x} cy={center.y} r={5} fill="#34d399" stroke="white" strokeWidth={2} />
      </svg>
      <div style={{ marginTop: compact ? '0.45rem' : '0.55rem', fontSize: compact ? '0.73rem' : '0.76rem', color: 'var(--text-secondary)' }}>
        slope = <span style={{ color: 'var(--accent)', fontFamily: 'monospace', fontWeight: 700 }}>{slope.toFixed(3)}</span>
      </div>
    </div>
  );
}

function visibleSliceAxes(
  mode: Mode,
  showSlices: boolean,
  presentation: Presentation,
): Array<'x' | 'y'> {
  if (!showSlices) return [];
  if (presentation === 'playground') return ['x', 'y'];
  if (mode === 'slice-x') return ['x'];
  if (mode === 'slice-y') return ['y'];
  return ['x', 'y'];
}

function getModeSummary(mode: Mode): string {
  if (mode === 'surface') {
    return 'Drag the point and notice that one position can carry two different local slopes.';
  }
  if (mode === 'slice-x') {
    return 'Freeze y, move only along x, and read the slope from that one slice.';
  }
  if (mode === 'slice-y') {
    return 'Freeze x, move only along y, and read the slope from the y-slice.';
  }
  if (mode === 'gradient') {
    return 'The red arrow collects the x and y partials into one uphill direction.';
  }
  return 'A zero partial in one direction is not enough to classify the point.';
}

function Scene({
  mode,
  surfaceId,
  presentation,
  showContours,
  showGradient,
  showField,
  showSlices,
  showTangent,
  interactive,
  initialPoint,
  onStateChange,
}: SceneProps) {
  const surface = SURFACES[surfaceId];
  const isGuided = presentation === 'guided';
  const [point, setPoint] = useState(initialPoint);
  const [dragging, setDragging] = useState(false);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const z = surface.z(point.x, point.y);
  const partialX = surface.dx(point.x, point.y);
  const partialY = surface.dy(point.x, point.y);
  const gradMag = Math.hypot(partialX, partialY);
  const tip = gradientTip(surface, point);

  useEffect(() => {
    if (!onStateChange) return;
    onStateChange({
      point,
      surface: surfaceId,
      z,
      partialX,
      partialY,
      gradientMagnitude: gradMag,
    });
  }, [gradMag, onStateChange, partialX, partialY, point, surfaceId, z]);

  useEffect(() => {
    if (!dragging) return;

    const handlePointerMove = (event: PointerEvent) => {
      if (!svgRef.current) return;
      const rect = svgRef.current.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * VIEW_SIZE;
      const y = ((event.clientY - rect.top) / rect.height) * VIEW_SIZE;
      const mathX = ((x - VIEW_SIZE / 2) / VIEW_SIZE) * surface.range * 2;
      const mathY = ((VIEW_SIZE / 2 - y) / VIEW_SIZE) * surface.range * 2;
      setPoint({
        x: clamp(mathX, surface.range),
        y: clamp(mathY, surface.range),
      });
    };

    const handlePointerUp = () => setDragging(false);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [dragging, surface.range]);

  const screenPoint = toScreen(point, surface.range);
  const screenTip = toScreen(tip, surface.range);
  const xGuide = toScreen({ x: 0, y: point.y }, surface.range);
  const yGuide = toScreen({ x: point.x, y: 0 }, surface.range);
  const sliceAxes = visibleSliceAxes(mode, showSlices, presentation);
  const rows = [
    ...(isGuided ? [] : [{ label: 'surface', value: SURFACES[surfaceId].label }]),
    { label: 'x', value: point.x.toFixed(2) },
    { label: 'y', value: point.y.toFixed(2) },
    ...(isGuided ? [] : [{ label: 'z', value: z.toFixed(3) }]),
    { label: 'partial / partial x', value: partialX.toFixed(3), color: '#6366f1' },
    { label: 'partial / partial y', value: partialY.toFixed(3), color: '#34d399' },
    ...(showGradient || mode === 'gradient' || mode === 'stationary'
      ? [{ label: '|gradient|', value: gradMag.toFixed(3), color: '#f87171' }]
      : []),
  ];
  const summary = getModeSummary(mode);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        padding: isGuided ? '0.75rem' : '1rem',
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'center',
        background: 'var(--viz-bg-gradient)',
      }}
    >
      <div
        style={{
          width: `min(100%, ${isGuided ? 920 : 980}px)`,
          display: 'flex',
          gap: isGuided ? '0.85rem' : '1rem',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          className="viz-container"
          style={{
            flex: isGuided ? '0 1 400px' : '1 1 420px',
            width: isGuided ? 'min(100%, 400px)' : undefined,
            minWidth: isGuided ? 280 : 320,
            position: 'relative',
            background: 'linear-gradient(180deg, rgba(99,102,241,0.05), transparent)',
            overflow: 'hidden',
          }}
        >
          <svg
            ref={svgRef}
            viewBox={`0 0 ${VIEW_SIZE} ${VIEW_SIZE}`}
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
              aspectRatio: '1 / 1',
              maxHeight: isGuided ? 400 : undefined,
            }}
          >
            <defs>
              <marker id="pd-arrow" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
                <path d="M0,0 L10,5 L0,10 z" fill="#f87171" />
              </marker>
            </defs>
            <Heatmap surface={surface} />
            {showContours && <Contours surface={surface} />}
            {showField && <GradientField surface={surface} />}

            {mode === 'stationary' && (
              <>
                <line x1={VIEW_SIZE / 2} y1={0} x2={VIEW_SIZE / 2} y2={VIEW_SIZE} stroke="rgba(251,191,36,0.55)" strokeDasharray="8 5" />
                <line x1={0} y1={VIEW_SIZE / 2} x2={VIEW_SIZE} y2={VIEW_SIZE / 2} stroke="rgba(52,211,153,0.55)" strokeDasharray="8 5" />
              </>
            )}

            <line x1={0} y1={screenPoint.y} x2={VIEW_SIZE} y2={screenPoint.y} stroke="rgba(255,255,255,0.18)" strokeDasharray="6 4" />
            <line x1={screenPoint.x} y1={0} x2={screenPoint.x} y2={VIEW_SIZE} stroke="rgba(255,255,255,0.18)" strokeDasharray="6 4" />

            {showGradient && (
              <line
                x1={screenPoint.x}
                y1={screenPoint.y}
                x2={screenTip.x}
                y2={screenTip.y}
                stroke="#f87171"
                strokeWidth={3}
                markerEnd="url(#pd-arrow)"
              />
            )}

            <line x1={screenPoint.x} y1={screenPoint.y} x2={yGuide.x} y2={yGuide.y} stroke="rgba(99,102,241,0.3)" />
            <line x1={screenPoint.x} y1={screenPoint.y} x2={xGuide.x} y2={xGuide.y} stroke="rgba(52,211,153,0.3)" />

            <circle
              cx={screenPoint.x}
              cy={screenPoint.y}
              r={9}
              fill="#f8fafc"
              stroke="var(--accent)"
              strokeWidth={3}
              onPointerDown={interactive ? () => setDragging(true) : undefined}
              style={{ cursor: interactive ? 'grab' : 'default' }}
            />
            {interactive && (
              <circle
                cx={screenPoint.x}
                cy={screenPoint.y}
                r={14}
                fill="none"
                stroke="rgba(255,255,255,0.38)"
                strokeWidth={1.5}
                strokeDasharray="5 4"
              />
            )}
          </svg>

          <div
            style={{
              position: 'absolute',
              top: 12,
              left: 12,
              right: isGuided ? 160 : 'auto',
              maxWidth: isGuided ? 220 : 240,
              padding: isGuided ? '0.65rem 0.75rem' : '0.75rem 0.85rem',
              borderRadius: isGuided ? 12 : 14,
              background: 'rgba(15, 17, 23, 0.84)',
              border: '1px solid var(--viz-panel-border)',
              backdropFilter: 'blur(10px)',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            <div
              style={{
                fontSize: isGuided ? '0.66rem' : '0.7rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--text-muted)',
                marginBottom: '0.35rem',
              }}
            >
              {interactive ? 'Drag The Point' : 'Visual Focus'}
            </div>
            <div
              style={{
                fontSize: isGuided ? '0.72rem' : '0.76rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.45,
              }}
            >
              {summary}
            </div>
          </div>

          <div
            style={{
              position: 'absolute',
              top: 12,
              right: 12,
              width: isGuided ? 152 : 220,
              padding: isGuided ? '0.7rem 0.75rem' : '0.85rem 0.9rem',
              borderRadius: isGuided ? 12 : 14,
              background: 'rgba(15, 17, 23, 0.82)',
              border: '1px solid var(--viz-panel-border)',
              backdropFilter: 'blur(10px)',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            <div
              style={{
                fontSize: isGuided ? '0.66rem' : '0.7rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--text-muted)',
                marginBottom: '0.55rem',
              }}
            >
              Live Readout
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: isGuided ? '0.35rem' : '0.45rem' }}>
              {rows.map((row) => (
                <div
                  key={row.label}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}
                >
                  <span style={{ fontSize: isGuided ? '0.72rem' : '0.76rem', color: 'var(--text-secondary)' }}>{row.label}</span>
                  <span style={{ fontSize: isGuided ? '0.76rem' : '0.8rem', fontFamily: 'monospace', fontWeight: 700, color: row.color ?? 'var(--text-primary)' }}>
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {!isGuided && (
            <div
              style={{
                position: 'absolute',
                left: 12,
                bottom: 12,
                maxWidth: 300,
                padding: '0.75rem 0.85rem',
                borderRadius: 12,
                background: 'rgba(15, 17, 23, 0.82)',
                border: '1px solid var(--viz-panel-border)',
                color: 'var(--text-secondary)',
                fontSize: '0.77rem',
                lineHeight: 1.5,
              }}
            >
              {summary}
            </div>
          )}
        </div>

        {sliceAxes.length > 0 && (
          <div
            style={{
              flex: isGuided ? '0 1 250px' : '0 1 300px',
              minWidth: isGuided ? 220 : 260,
              display: 'flex',
              flexDirection: 'column',
              gap: isGuided ? '0.75rem' : '1rem',
            }}
          >
            {sliceAxes.includes('x') && (
              <SliceChart
                axis="x"
                point={point}
                surface={surface}
                showTangent={showTangent}
                highlighted={mode === 'slice-x'}
                compact={isGuided}
              />
            )}
            {sliceAxes.includes('y') && (
              <SliceChart
                axis="y"
                point={point}
                surface={surface}
                showTangent={showTangent}
                highlighted={mode === 'slice-y'}
                compact={isGuided}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function PartialDerivativesVisualization(props: PartialDerivativesVisualizationProps) {
  const mode = props.mode ?? 'gradient';
  const surfaceId = toSurfaceId(typeof props.surface === 'string' ? props.surface : undefined);
  const presentation = toPresentation(typeof props.presentation === 'string' ? props.presentation : undefined);
  const surface = SURFACES[surfaceId];
  const initialPoint = resolvePoint(props.point, props.pointX, props.pointY, surface.range);
  const resetKey = [
    mode,
    surfaceId,
    presentation,
    props.showContours ?? true,
    props.showGradient ?? true,
    props.showField ?? false,
    props.showSlices ?? true,
    props.showTangent ?? true,
    props.interactive ?? false,
    initialPoint.x,
    initialPoint.y,
  ].join('|');

  return (
    <Scene
      key={resetKey}
      mode={mode}
      surfaceId={surfaceId}
      presentation={presentation}
      showContours={props.showContours ?? true}
      showGradient={props.showGradient ?? true}
      showField={props.showField ?? false}
      showSlices={props.showSlices ?? true}
      showTangent={props.showTangent ?? true}
      interactive={props.interactive ?? false}
      initialPoint={initialPoint}
      onStateChange={props.onStateChange}
    />
  );
}
