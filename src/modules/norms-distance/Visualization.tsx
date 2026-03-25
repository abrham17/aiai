'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

type Metric = 'l1' | 'l2' | 'linf';
type Mode = 'norm' | 'distance' | 'nearest' | 'cosine';

interface Vec2 {
  x: number;
  y: number;
}

interface DataPoint extends Vec2 {
  id: string;
  label: string;
  color: string;
}

export interface NormDistanceSceneState {
  vector: Vec2;
  otherVector: Vec2;
  pointA: Vec2;
  pointB: Vec2;
  query: Vec2;
  metric: Metric;
  nearestId: string | null;
}

interface NormDistanceVisualizationProps {
  mode?: Mode;
  metric?: Metric | string;
  interactive?: boolean;
  compareMetrics?: boolean;
  showUnitBall?: boolean;
  showNeighborhood?: boolean;
  showNearest?: boolean;
  showProjection?: boolean;
  neighborhoodRadius?: number;
  vector?: Vec2;
  otherVector?: Vec2;
  pointA?: Vec2;
  pointB?: Vec2;
  query?: Vec2;
  vectorX?: number;
  vectorY?: number;
  otherVectorX?: number;
  otherVectorY?: number;
  queryX?: number;
  queryY?: number;
  preset?: 'clusters' | 'metric-flip' | string;
  targetNorm?: number;
  targetId?: string;
  onStateChange?: (state: NormDistanceSceneState) => void;
}

interface SceneProps {
  mode: Mode;
  selectedMetric: Metric;
  compareMetrics: boolean;
  showUnitBall: boolean;
  showNeighborhood: boolean;
  showNearest: boolean;
  showProjection: boolean;
  neighborhoodRadius: number;
  interactive: boolean;
  points: DataPoint[];
  targetNorm?: number;
  targetId?: string;
  onStateChange?: (state: NormDistanceSceneState) => void;
  initialVector: Vec2;
  initialOtherVector: Vec2;
  initialPointA: Vec2;
  initialPointB: Vec2;
  initialQuery: Vec2;
}

type DragKind = 'vector' | 'otherVector' | 'pointA' | 'pointB' | 'query' | null;

const CANVAS_SIZE = 520;
const RANGE = 6;
const SCALE = CANVAS_SIZE / (RANGE * 2);
const CENTER = CANVAS_SIZE / 2;

const PRESETS: Record<'clusters' | 'metric-flip', DataPoint[]> = {
  clusters: [
    { id: 'a1', label: 'A1', x: -2.7, y: 2.1, color: '#60a5fa' },
    { id: 'a2', label: 'A2', x: -2.1, y: 1.0, color: '#60a5fa' },
    { id: 'a3', label: 'A3', x: -2.8, y: 0.2, color: '#60a5fa' },
    { id: 'b1', label: 'B1', x: 2.1, y: 2.4, color: '#34d399' },
    { id: 'b2', label: 'B2', x: 2.9, y: 1.3, color: '#34d399' },
    { id: 'b3', label: 'B3', x: 1.9, y: 0.1, color: '#34d399' },
    { id: 'o1', label: 'O1', x: 0.2, y: -2.7, color: '#f59e0b' },
  ],
  'metric-flip': [
    { id: 'red', label: 'R', x: 2.0, y: 0.6, color: '#f87171' },
    { id: 'blue', label: 'B', x: 1.2, y: 1.6, color: '#60a5fa' },
    { id: 'gold', label: 'G', x: -2.5, y: -1.5, color: '#fbbf24' },
  ],
};

function isVec2(value: unknown): value is Vec2 {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Partial<Vec2>;
  return typeof candidate.x === 'number' && typeof candidate.y === 'number';
}

function toMetric(metric: string | undefined): Metric {
  if (metric === 'l1' || metric === 'linf') return metric;
  return 'l2';
}

function clamp(value: number): number {
  return Math.max(-RANGE + 0.2, Math.min(RANGE - 0.2, value));
}

function resolveVector(
  explicit: unknown,
  x: unknown,
  y: unknown,
  fallback: Vec2,
): Vec2 {
  if (isVec2(explicit)) return explicit;
  if (typeof x === 'number' && typeof y === 'number') {
    return { x, y };
  }
  return fallback;
}

function toScreen(point: Vec2): { x: number; y: number } {
  return {
    x: CENTER + point.x * SCALE,
    y: CENTER - point.y * SCALE,
  };
}

function vectorNorm(vector: Vec2, metric: Metric): number {
  if (metric === 'l1') return Math.abs(vector.x) + Math.abs(vector.y);
  if (metric === 'linf') return Math.max(Math.abs(vector.x), Math.abs(vector.y));
  return Math.hypot(vector.x, vector.y);
}

function distance(a: Vec2, b: Vec2, metric: Metric): number {
  return vectorNorm({ x: a.x - b.x, y: a.y - b.y }, metric);
}

function dot(a: Vec2, b: Vec2): number {
  return a.x * b.x + a.y * b.y;
}

function magnitude(vector: Vec2): number {
  return Math.hypot(vector.x, vector.y);
}

function cosineSimilarity(a: Vec2, b: Vec2): number {
  const denom = magnitude(a) * magnitude(b);
  if (denom < 1e-6) return 0;
  return dot(a, b) / denom;
}

function project(a: Vec2, b: Vec2): Vec2 {
  const denom = dot(b, b);
  if (denom < 1e-6) return { x: 0, y: 0 };
  const scale = dot(a, b) / denom;
  return { x: b.x * scale, y: b.y * scale };
}

function angleDegrees(a: Vec2, b: Vec2): number {
  const cosine = Math.max(-1, Math.min(1, cosineSimilarity(a, b)));
  return (Math.acos(cosine) * 180) / Math.PI;
}

function nearestPoint(query: Vec2, points: DataPoint[], metric: Metric): DataPoint | null {
  if (points.length === 0) return null;
  let best = points[0];
  let bestDistance = distance(query, best, metric);

  for (const point of points.slice(1)) {
    const pointDistance = distance(query, point, metric);
    if (pointDistance < bestDistance) {
      best = point;
      bestDistance = pointDistance;
    }
  }

  return best;
}

function MetricShape({
  center,
  radius,
  metric,
  stroke,
  fill,
  opacity = 1,
  dashed = false,
}: {
  center: Vec2;
  radius: number;
  metric: Metric;
  stroke: string;
  fill: string;
  opacity?: number;
  dashed?: boolean;
}) {
  const screen = toScreen(center);
  const size = radius * SCALE;

  if (metric === 'l2') {
    return (
      <circle
        cx={screen.x}
        cy={screen.y}
        r={size}
        stroke={stroke}
        fill={fill}
        fillOpacity={0.12}
        opacity={opacity}
        strokeDasharray={dashed ? '6 4' : undefined}
      />
    );
  }

  if (metric === 'l1') {
    const top = toScreen({ x: center.x, y: center.y + radius });
    const right = toScreen({ x: center.x + radius, y: center.y });
    const bottom = toScreen({ x: center.x, y: center.y - radius });
    const left = toScreen({ x: center.x - radius, y: center.y });
    return (
      <polygon
        points={`${top.x},${top.y} ${right.x},${right.y} ${bottom.x},${bottom.y} ${left.x},${left.y}`}
        stroke={stroke}
        fill={fill}
        fillOpacity={0.12}
        opacity={opacity}
        strokeDasharray={dashed ? '6 4' : undefined}
      />
    );
  }

  return (
    <rect
      x={screen.x - size}
      y={screen.y - size}
      width={size * 2}
      height={size * 2}
      stroke={stroke}
      fill={fill}
      fillOpacity={0.12}
      opacity={opacity}
      strokeDasharray={dashed ? '6 4' : undefined}
    />
  );
}

function Arrow({
  to,
  color,
  width = 3,
  opacity = 1,
}: {
  to: Vec2;
  color: string;
  width?: number;
  opacity?: number;
}) {
  const end = toScreen(to);
  return (
    <line
      x1={CENTER}
      y1={CENTER}
      x2={end.x}
      y2={end.y}
      stroke={color}
      strokeWidth={width}
      strokeLinecap="round"
      opacity={opacity}
      markerEnd="url(#nd-arrow)"
    />
  );
}

function DragHandle({
  point,
  color,
  label,
  active = false,
  onPointerDown,
}: {
  point: Vec2;
  color: string;
  label?: string;
  active?: boolean;
  onPointerDown?: () => void;
}) {
  const screen = toScreen(point);
  return (
    <g onPointerDown={onPointerDown} style={{ cursor: onPointerDown ? 'grab' : 'default' }}>
      <circle cx={screen.x} cy={screen.y} r={active ? 9 : 7} fill={color} stroke="white" strokeWidth={2} />
      {label && (
        <text x={screen.x + 10} y={screen.y - 10} fill={color} fontSize={12} fontWeight={700}>
          {label}
        </text>
      )}
    </g>
  );
}

function Grid() {
  const lines = [];
  for (let i = -RANGE; i <= RANGE; i += 1) {
    const vertical = toScreen({ x: i, y: 0 }).x;
    const horizontal = toScreen({ x: 0, y: i }).y;
    lines.push(
      <line
        key={`v-${i}`}
        x1={vertical}
        y1={0}
        x2={vertical}
        y2={CANVAS_SIZE}
        stroke={i === 0 ? 'var(--viz-grid-major)' : 'var(--viz-grid-minor)'}
        strokeWidth={i === 0 ? 1.5 : 1}
      />,
    );
    lines.push(
      <line
        key={`h-${i}`}
        x1={0}
        y1={horizontal}
        x2={CANVAS_SIZE}
        y2={horizontal}
        stroke={i === 0 ? 'var(--viz-grid-major)' : 'var(--viz-grid-minor)'}
        strokeWidth={i === 0 ? 1.5 : 1}
      />,
    );
  }
  return <g>{lines}</g>;
}

function Hud({
  title,
  rows,
}: {
  title: string;
  rows: Array<{ label: string; value: string; color?: string }>;
}) {
  return (
    <div
      style={{
        position: 'absolute',
        top: 12,
        right: 12,
        width: 200,
        padding: '0.8rem 0.9rem',
        borderRadius: 12,
        background: 'rgba(15, 17, 23, 0.84)',
        border: '1px solid var(--viz-panel-border)',
        backdropFilter: 'blur(10px)',
        boxShadow: 'var(--shadow-md)',
      }}
    >
      <div
        style={{
          fontSize: '0.7rem',
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
          marginBottom: '0.6rem',
        }}
      >
        {title}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
        {rows.map((row) => (
          <div
            key={row.label}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}
          >
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{row.label}</span>
            <span
              style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                color: row.color ?? 'var(--text-primary)',
                fontFamily: 'monospace',
              }}
            >
              {row.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function VisualizationScene({
  mode,
  selectedMetric,
  compareMetrics,
  showUnitBall,
  showNeighborhood,
  showNearest,
  showProjection,
  neighborhoodRadius,
  interactive,
  points,
  targetNorm,
  targetId,
  onStateChange,
  initialVector,
  initialOtherVector,
  initialPointA,
  initialPointB,
  initialQuery,
}: SceneProps) {
  const [vector, setVector] = useState<Vec2>(initialVector);
  const [otherVector, setOtherVector] = useState<Vec2>(initialOtherVector);
  const [pointA, setPointA] = useState<Vec2>(initialPointA);
  const [pointB, setPointB] = useState<Vec2>(initialPointB);
  const [query, setQuery] = useState<Vec2>(initialQuery);
  const [dragging, setDragging] = useState<DragKind>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const nearestByMetric = useMemo(
    () => ({
      l1: nearestPoint(query, points, 'l1'),
      l2: nearestPoint(query, points, 'l2'),
      linf: nearestPoint(query, points, 'linf'),
    }),
    [points, query],
  );

  const activeNearest = nearestByMetric[selectedMetric];

  useEffect(() => {
    if (!onStateChange) return;

    onStateChange({
      vector,
      otherVector,
      pointA,
      pointB,
      query,
      metric: selectedMetric,
      nearestId: activeNearest?.id ?? null,
    });
  }, [activeNearest?.id, onStateChange, otherVector, pointA, pointB, query, selectedMetric, vector]);

  useEffect(() => {
    if (!dragging) return;

    const handlePointerMove = (event: PointerEvent) => {
      if (!svgRef.current) return;
      const rect = svgRef.current.getBoundingClientRect();
      const next = {
        x: clamp((event.clientX - rect.left - CENTER) / SCALE),
        y: clamp((CENTER - (event.clientY - rect.top)) / SCALE),
      };

      if (dragging === 'vector') setVector(next);
      if (dragging === 'otherVector') setOtherVector(next);
      if (dragging === 'pointA') setPointA(next);
      if (dragging === 'pointB') setPointB(next);
      if (dragging === 'query') setQuery(next);
    };

    const handlePointerUp = () => setDragging(null);

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [dragging]);

  const normRows = useMemo(() => [
    { label: 'L1', value: vectorNorm(vector, 'l1').toFixed(2), color: '#f59e0b' },
    { label: 'L2', value: vectorNorm(vector, 'l2').toFixed(2), color: '#6366f1' },
    { label: 'L_inf', value: vectorNorm(vector, 'linf').toFixed(2), color: '#34d399' },
  ], [vector]);

  const distanceRows = useMemo(() => [
    { label: 'L1 distance', value: distance(pointA, pointB, 'l1').toFixed(2), color: '#f59e0b' },
    { label: 'L2 distance', value: distance(pointA, pointB, 'l2').toFixed(2), color: '#6366f1' },
    { label: 'L_inf distance', value: distance(pointA, pointB, 'linf').toFixed(2), color: '#34d399' },
  ], [pointA, pointB]);

  const cosineRows = useMemo(() => [
    { label: 'cosine', value: cosineSimilarity(vector, otherVector).toFixed(3), color: '#6366f1' },
    { label: 'angle', value: `${angleDegrees(vector, otherVector).toFixed(1)} deg`, color: '#f59e0b' },
    { label: '|a|', value: magnitude(vector).toFixed(2) },
    { label: '|b|', value: magnitude(otherVector).toFixed(2) },
  ], [otherVector, vector]);

  const nearestRows = useMemo(() => {
    const selectedDistance = activeNearest ? distance(query, activeNearest, selectedMetric).toFixed(2) : '-';
    const rows = [
      { label: `${selectedMetric} nearest`, value: activeNearest?.label ?? '-', color: activeNearest?.color },
      { label: `${selectedMetric} distance`, value: selectedDistance },
    ];

    if (compareMetrics) {
      rows.push(
        { label: 'L1 winner', value: nearestByMetric.l1?.label ?? '-', color: nearestByMetric.l1?.color },
        { label: 'L2 winner', value: nearestByMetric.l2?.label ?? '-', color: nearestByMetric.l2?.color },
        { label: 'L_inf winner', value: nearestByMetric.linf?.label ?? '-', color: nearestByMetric.linf?.color },
      );
    }

    return rows;
  }, [activeNearest, compareMetrics, nearestByMetric, query, selectedMetric]);

  const projected = project(vector, otherVector);
  const metricRadius =
    mode === 'norm'
      ? vectorNorm(vector, selectedMetric)
      : mode === 'distance'
        ? neighborhoodRadius
        : mode === 'nearest' && activeNearest
          ? distance(query, activeNearest, selectedMetric)
          : neighborhoodRadius;

  const angleArc = useMemo(() => {
    if (mode !== 'cosine') return null;

    const angleA = Math.atan2(vector.y, vector.x);
    const angleB = Math.atan2(otherVector.y, otherVector.x);
    const radius = 1.2;
    const start = toScreen({ x: Math.cos(angleA) * radius, y: Math.sin(angleA) * radius });
    const end = toScreen({ x: Math.cos(angleB) * radius, y: Math.sin(angleB) * radius });
    const cross = vector.x * otherVector.y - vector.y * otherVector.x;
    const sweep = cross >= 0 ? 0 : 1;
    return `M ${start.x} ${start.y} A ${radius * SCALE} ${radius * SCALE} 0 0 ${sweep} ${end.x} ${end.y}`;
  }, [mode, otherVector.x, otherVector.y, vector.x, vector.y]);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        background: 'var(--viz-bg-gradient)',
      }}
    >
      <div
        className="viz-container"
        style={{
          width: 'min(100%, 760px)',
          aspectRatio: '1 / 1',
          position: 'relative',
          background: 'linear-gradient(180deg, rgba(99,102,241,0.04), transparent)',
        }}
      >
        <svg
          ref={svgRef}
          viewBox={`0 0 ${CANVAS_SIZE} ${CANVAS_SIZE}`}
          style={{ width: '100%', height: '100%', display: 'block' }}
        >
          <defs>
            <marker id="nd-arrow" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
              <path d="M0,0 L10,5 L0,10 z" fill="currentColor" />
            </marker>
          </defs>

          <rect x={0} y={0} width={CANVAS_SIZE} height={CANVAS_SIZE} fill="transparent" />
          <Grid />

          {mode === 'norm' && showUnitBall && (
            <>
              <MetricShape center={{ x: 0, y: 0 }} radius={1} metric="l1" stroke="#f59e0b" fill="#f59e0b" opacity={0.8} />
              <MetricShape center={{ x: 0, y: 0 }} radius={1} metric="l2" stroke="#6366f1" fill="#6366f1" opacity={0.8} />
              <MetricShape center={{ x: 0, y: 0 }} radius={1} metric="linf" stroke="#34d399" fill="#34d399" opacity={0.8} />
            </>
          )}

          {mode === 'norm' && targetNorm && (
            <MetricShape
              center={{ x: 0, y: 0 }}
              radius={targetNorm}
              metric={selectedMetric}
              stroke="rgba(248,113,113,0.9)"
              fill="rgba(248,113,113,0.2)"
              dashed
            />
          )}

          {mode === 'distance' && showNeighborhood && (
            <MetricShape
              center={pointA}
              radius={neighborhoodRadius}
              metric={selectedMetric}
              stroke="rgba(99,102,241,0.9)"
              fill="rgba(99,102,241,0.35)"
            />
          )}

          {mode === 'nearest' && showNeighborhood && activeNearest && (
            <MetricShape
              center={query}
              radius={metricRadius}
              metric={selectedMetric}
              stroke="rgba(99,102,241,0.9)"
              fill="rgba(99,102,241,0.28)"
            />
          )}

          {mode === 'norm' && (
            <>
              <MetricShape
                center={{ x: 0, y: 0 }}
                radius={metricRadius}
                metric={selectedMetric}
                stroke="rgba(99,102,241,0.7)"
                fill="rgba(99,102,241,0.2)"
                dashed
              />
              <Arrow to={vector} color="var(--accent)" />
              <DragHandle
                point={vector}
                color="var(--accent)"
                label={`v (${vector.x.toFixed(1)}, ${vector.y.toFixed(1)})`}
                active={dragging === 'vector'}
                onPointerDown={interactive ? () => setDragging('vector') : undefined}
              />
            </>
          )}

          {mode === 'distance' && (
            <>
              <line
                x1={toScreen(pointA).x}
                y1={toScreen(pointA).y}
                x2={toScreen(pointB).x}
                y2={toScreen(pointB).y}
                stroke="rgba(99,102,241,0.8)"
                strokeWidth={2.5}
              />
              <polyline
                points={`${toScreen(pointA).x},${toScreen(pointA).y} ${toScreen({ x: pointB.x, y: pointA.y }).x},${toScreen({ x: pointB.x, y: pointA.y }).y} ${toScreen(pointB).x},${toScreen(pointB).y}`}
                fill="none"
                stroke="rgba(245,158,11,0.9)"
                strokeWidth={2}
                strokeDasharray="8 6"
              />
              <DragHandle point={pointA} color="#6366f1" label="A" active={dragging === 'pointA'} onPointerDown={interactive ? () => setDragging('pointA') : undefined} />
              <DragHandle point={pointB} color="#f59e0b" label="B" active={dragging === 'pointB'} onPointerDown={interactive ? () => setDragging('pointB') : undefined} />
            </>
          )}

          {mode === 'nearest' && points.map((point) => {
            const isNearest = activeNearest?.id === point.id;
            const isTarget = targetId === point.id;
            const screen = toScreen(point);
            return (
              <g key={point.id}>
                <circle cx={screen.x} cy={screen.y} r={isNearest ? 10 : 7} fill={point.color} stroke={isTarget ? '#f87171' : 'white'} strokeWidth={isTarget ? 3 : 2} />
                <text x={screen.x + 10} y={screen.y - 10} fill={point.color} fontSize={12} fontWeight={700}>
                  {point.label}
                </text>
              </g>
            );
          })}

          {mode === 'nearest' && activeNearest && showNearest && (
            <line
              x1={toScreen(query).x}
              y1={toScreen(query).y}
              x2={toScreen(activeNearest).x}
              y2={toScreen(activeNearest).y}
              stroke={activeNearest.color}
              strokeWidth={2.5}
              strokeDasharray="6 4"
            />
          )}

          {mode === 'nearest' && (
            <DragHandle point={query} color="var(--accent)" label="Q" active={dragging === 'query'} onPointerDown={interactive ? () => setDragging('query') : undefined} />
          )}

          {mode === 'cosine' && (
            <>
              <Arrow to={vector} color="#6366f1" />
              <Arrow to={otherVector} color="#34d399" />
              {showProjection && (
                <>
                  <line x1={toScreen(vector).x} y1={toScreen(vector).y} x2={toScreen(projected).x} y2={toScreen(projected).y} stroke="#fbbf24" strokeWidth={2} strokeDasharray="6 4" />
                  <Arrow to={projected} color="#fbbf24" width={2.5} opacity={0.9} />
                </>
              )}
              {angleArc && <path d={angleArc} fill="none" stroke="#f59e0b" strokeWidth={2} />}
              <DragHandle point={vector} color="#6366f1" label="a" active={dragging === 'vector'} onPointerDown={interactive ? () => setDragging('vector') : undefined} />
              <DragHandle point={otherVector} color="#34d399" label="b" active={dragging === 'otherVector'} onPointerDown={interactive ? () => setDragging('otherVector') : undefined} />
            </>
          )}
        </svg>

        {mode === 'norm' && <Hud title="Norms" rows={normRows} />}
        {mode === 'distance' && <Hud title="Distances" rows={distanceRows} />}
        {mode === 'nearest' && <Hud title="Nearest Neighbor" rows={nearestRows} />}
        {mode === 'cosine' && <Hud title="Cosine Similarity" rows={cosineRows} />}

        <div
          style={{
            position: 'absolute',
            left: 12,
            bottom: 12,
            padding: '0.7rem 0.85rem',
            borderRadius: 12,
            background: 'rgba(15, 17, 23, 0.82)',
            border: '1px solid var(--viz-panel-border)',
            color: 'var(--text-secondary)',
            fontSize: '0.78rem',
            lineHeight: 1.5,
            maxWidth: 280,
          }}
        >
          {mode === 'norm' && 'Norms choose what "length" means. Compare the circle, diamond, and square geometry.'}
          {mode === 'distance' && 'Distance is the norm of a difference vector. The dashed path hints at taxicab motion.'}
          {mode === 'nearest' && 'Metric choice changes who wins the neighborhood race. Watch the highlighted neighbor.'}
          {mode === 'cosine' && 'Cosine focuses on angle. Scale a vector up and down and see how little the cosine changes.'}
        </div>
      </div>
    </div>
  );
}

export default function NormsDistanceVisualization(props: NormDistanceVisualizationProps) {
  const mode = props.mode ?? 'norm';
  const selectedMetric = toMetric(typeof props.metric === 'string' ? props.metric : undefined);
  const compareMetrics = props.compareMetrics ?? false;
  const showUnitBall = props.showUnitBall ?? false;
  const showNeighborhood = props.showNeighborhood ?? false;
  const showNearest = props.showNearest ?? false;
  const showProjection = props.showProjection ?? false;
  const neighborhoodRadius = props.neighborhoodRadius ?? 2;
  const interactive = props.interactive ?? false;
  const preset = props.preset ?? 'clusters';
  const points = useMemo(
    () => PRESETS[preset === 'metric-flip' ? 'metric-flip' : 'clusters'],
    [preset],
  );

  const initialVector = resolveVector(props.vector, props.vectorX, props.vectorY, { x: 3, y: 2 });
  const initialOtherVector = resolveVector(
    props.otherVector,
    props.otherVectorX,
    props.otherVectorY,
    mode === 'cosine' ? { x: 1.6, y: 2.8 } : { x: 1.5, y: 1.2 },
  );
  const initialPointA = resolveVector(props.pointA, undefined, undefined, { x: -2.5, y: -1.2 });
  const initialPointB = resolveVector(props.pointB, undefined, undefined, { x: 2.1, y: 1.8 });
  const initialQuery = resolveVector(props.query, props.queryX, props.queryY, { x: 0.2, y: 0.1 });

  const resetKey = [
    mode,
    selectedMetric,
    compareMetrics,
    showUnitBall,
    showNeighborhood,
    showNearest,
    showProjection,
    neighborhoodRadius,
    preset,
    props.targetNorm ?? '',
    props.targetId ?? '',
    initialVector.x,
    initialVector.y,
    initialOtherVector.x,
    initialOtherVector.y,
    initialPointA.x,
    initialPointA.y,
    initialPointB.x,
    initialPointB.y,
    initialQuery.x,
    initialQuery.y,
  ].join('|');

  return (
    <VisualizationScene
      key={resetKey}
      mode={mode}
      selectedMetric={selectedMetric}
      compareMetrics={compareMetrics}
      showUnitBall={showUnitBall}
      showNeighborhood={showNeighborhood}
      showNearest={showNearest}
      showProjection={showProjection}
      neighborhoodRadius={neighborhoodRadius}
      interactive={interactive}
      points={points}
      targetNorm={props.targetNorm}
      targetId={props.targetId}
      onStateChange={props.onStateChange}
      initialVector={initialVector}
      initialOtherVector={initialOtherVector}
      initialPointA={initialPointA}
      initialPointB={initialPointB}
      initialQuery={initialQuery}
    />
  );
}
