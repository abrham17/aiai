'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useProgress } from '@/hooks/useProgress';
import { useModuleData } from '@/hooks/useModuleData';
import PyodidePlayground from '@/components/PyodidePlayground';
import type { VisualizationProps } from '@/core/types';

const GRAPH_PRESETS = [
  { id: 'single', label: '(3x+2)^4', description: 'Single chain' },
  { id: 'double', label: 'sin(e^(x^2))', description: 'Two levels deep' },
  { id: 'mini-net', label: 'L=(wx-y)^2', description: 'Mini neural net' },
  { id: 'multipath', label: 'x^2+sin(x)', description: 'Fan-out paths' },
  { id: 'deep', label: 'Deep chain', description: '10 operations' },
];

const NORMS_DISTANCE_VISIBLE_PARAMS: Record<string, string[]> = {
  norm: ['mode', 'metric', 'showUnitBall', 'vectorX', 'vectorY'],
  distance: ['mode', 'metric', 'showNeighborhood', 'neighborhoodRadius'],
  nearest: ['mode', 'metric', 'preset', 'compareMetrics', 'showNeighborhood', 'queryX', 'queryY'],
  cosine: ['mode', 'showProjection', 'vectorX', 'vectorY', 'otherVectorX', 'otherVectorY'],
};

type ParamValue = number | boolean | string;
type ParamMap = Record<string, ParamValue>;

export default function PlaygroundPage() {
  const params = useParams();
  const router = useRouter();
  const tierId = Number(params.tierId);
  const moduleId = params.moduleId as string;
  const { updateModule } = useProgress();
  const { moduleData, isLoading } = useModuleData(moduleId);

  const [paramState, setParamState] = useState<{
    moduleId: string | null;
    values: ParamMap;
  }>({ moduleId: null, values: {} });
  const [graphState, setGraphState] = useState<{
    moduleId: string | null;
    graphId: string;
  }>({ moduleId: null, graphId: 'single' });

  const defaultParamValues = useMemo(() => {
    if (!moduleData) return {};

    const defaults: ParamMap = {};
    moduleData.playground.parameters.forEach((param) => {
      defaults[param.id] = param.default;
    });

    return defaults;
  }, [moduleData]);

  const paramValues = paramState.moduleId === moduleId ? paramState.values : defaultParamValues;
  const selectedGraph = graphState.moduleId === moduleId ? graphState.graphId : 'single';
  const selectedMode = String(paramValues.mode ?? defaultParamValues.mode ?? 'norm');

  const visibleParameters = useMemo(() => {
    if (!moduleData) return [];
    if (moduleId !== 'norms-distance') return moduleData.playground.parameters;

    const visibleIds = NORMS_DISTANCE_VISIBLE_PARAMS[selectedMode] ?? NORMS_DISTANCE_VISIBLE_PARAMS.norm;
    return moduleData.playground.parameters.filter((param) => visibleIds.includes(param.id));
  }, [moduleData, moduleId, selectedMode]);

  useEffect(() => {
    if (!moduleData) return;
    updateModule(tierId, moduleId, (moduleProgress) => ({
      ...moduleProgress,
      playgroundVisited: true,
    }));
  }, [moduleData, moduleId, tierId, updateModule]);

  const setParam = useCallback((id: string, value: ParamValue) => {
    setParamState((prev) => ({
      moduleId,
      values: {
        ...(prev.moduleId === moduleId ? prev.values : defaultParamValues),
        [id]: value,
      },
    }));
  }, [defaultParamValues, moduleId]);

  const selectGraph = useCallback((graphId: string) => {
    setGraphState({ moduleId, graphId });
  }, [moduleId]);

  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: 'calc(100vh - var(--topnav-height))',
          background: 'var(--bg-base)',
          color: 'var(--text-muted)',
          flexDirection: 'column',
          gap: '0.75rem',
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            border: '2px solid rgba(99,102,241,0.3)',
            borderTopColor: '#6366f1',
            borderRadius: '50%',
            animation: 'spin 0.7s linear infinite',
          }}
        />
        Loading playground...
      </div>
    );
  }

  if (!moduleData) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: 'calc(100vh - var(--topnav-height))',
          background: 'var(--bg-base)',
          color: 'var(--text-muted)',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
          <p>Module &quot;{moduleId}&quot; not found.</p>
          <button
            className="btn btn--primary btn--sm"
            style={{ marginTop: '1rem' }}
            onClick={() => router.push('/')}
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const isChainRule = moduleId === 'chain-rule';
  const vizProps: VisualizationProps = isChainRule
    ? {
        ...paramValues,
        presentation: 'playground',
        component: 'ComputationGraph',
        graphId: selectedGraph,
        showForward: true,
        showBackward: true,
        showEdgeDerivatives: paramValues.showEdgeDerivatives ?? true,
        showGradientValues: paramValues.showGradientValues ?? true,
        showPaths: paramValues.showPaths ?? false,
        animateForward: paramValues.animateForward ?? true,
        animateBackward: paramValues.animateBackward ?? true,
        interactive: true,
      }
    : { ...paramValues, presentation: 'playground', interactive: true };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - var(--topnav-height))',
        background: 'var(--bg-base)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.6rem 1.25rem',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'var(--bg-surface)',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={() => router.push(`/tier/${tierId}/${moduleId}`)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              fontSize: '0.875rem',
            }}
          >
            ← {moduleData.title}
          </button>
          <span style={{ color: 'var(--border-default)' }}>/</span>
          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--accent)' }}>
            🧪 Playground
          </span>
        </div>
        <div
          style={{
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            maxWidth: 400,
            lineHeight: 1.4,
            textAlign: 'right',
            fontStyle: 'italic',
          }}
        >
          {moduleData.playground.description}
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'stretch', position: 'relative' }}>
          <div style={{ width: '100%', height: '100%', position: 'relative', padding: '1rem' }}>
            {moduleId === 'python-basics' ? (
              <PyodidePlayground defaultCode={String(paramValues.code_editor || '')} />
            ) : moduleData.Visualization ? (
              <moduleData.Visualization {...vizProps} />
            ) : (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  color: 'var(--text-muted)',
                  gap: '1rem',
                }}
              >
                <div style={{ fontSize: '4rem' }}>🧪</div>
                <p>This module does not have a playground visualization yet.</p>
              </div>
            )}
          </div>
        </div>

        <div
          style={{
            width: '290px',
            background: 'var(--bg-surface)',
            borderLeft: '1px solid var(--border-subtle)',
            padding: '1rem',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            flexShrink: 0,
          }}
        >
          {isChainRule && (
            <div>
              <div
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  marginBottom: 8,
                }}
              >
                Graph Preset
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {GRAPH_PRESETS.map((graph) => (
                  <button
                    key={graph.id}
                    onClick={() => selectGraph(graph.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.625rem',
                      padding: '0.5rem 0.75rem',
                      borderRadius: 7,
                      border: `1px solid ${selectedGraph === graph.id ? 'rgba(99,102,241,0.6)' : 'var(--border-subtle)'}`,
                      background: selectedGraph === graph.id ? 'rgba(99,102,241,0.12)' : 'transparent',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.12s',
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontFamily: 'monospace',
                          fontSize: '0.8rem',
                          color: selectedGraph === graph.id ? '#a5b4fc' : 'var(--text-primary)',
                          fontWeight: selectedGraph === graph.id ? 700 : 400,
                        }}
                      >
                        {graph.label}
                      </div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                        {graph.description}
                      </div>
                    </div>
                    {selectedGraph === graph.id && (
                      <span style={{ color: '#6366f1', fontSize: '0.8rem' }}>✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <div
              style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: 8,
              }}
            >
              Parameters
            </div>
            {moduleId === 'norms-distance' && (
              <div
                style={{
                  fontSize: '0.72rem',
                  color: 'var(--text-muted)',
                  lineHeight: 1.45,
                  marginBottom: 8,
                }}
              >
                Controls change with the current mode so the sidebar only shows the inputs that matter right now.
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {visibleParameters.map((param) => (
                <div
                  key={param.id}
                  style={{
                    padding: '0.625rem 0.75rem',
                    borderRadius: 8,
                    background: 'var(--bg-base)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: param.type === 'slider' || param.type === 'stepper' ? '0.4rem' : 0,
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.8125rem',
                        color: 'var(--text-secondary)',
                        fontWeight: 500,
                      }}
                    >
                      {param.label}
                    </span>

                    {param.type === 'toggle' && (
                      <button
                        onClick={() => setParam(param.id, !paramValues[param.id])}
                        style={{
                          width: 36,
                          height: 20,
                          borderRadius: 10,
                          border: 'none',
                          cursor: 'pointer',
                          position: 'relative',
                          background: paramValues[param.id] ? 'var(--accent)' : 'rgba(255,255,255,0.1)',
                          transition: 'background 0.2s',
                        }}
                      >
                        <div
                          style={{
                            width: 16,
                            height: 16,
                            borderRadius: '50%',
                            background: 'white',
                            position: 'absolute',
                            top: 2,
                            left: paramValues[param.id] ? 18 : 2,
                            transition: 'left 0.2s',
                          }}
                        />
                      </button>
                    )}

                    {param.type === 'slider' && (
                      <span
                        style={{
                          fontFamily: 'monospace',
                          fontSize: '0.8125rem',
                          color: 'var(--accent)',
                          fontWeight: 600,
                        }}
                      >
                        {Number(paramValues[param.id] ?? param.default).toFixed(2)}
                      </span>
                    )}

                    {param.type === 'stepper' && (
                      <span
                        style={{
                          fontFamily: 'monospace',
                          fontSize: '0.8125rem',
                          color: 'var(--accent)',
                          fontWeight: 600,
                        }}
                      >
                        {String(paramValues[param.id] ?? param.default)}
                      </span>
                    )}
                  </div>

                  {param.type === 'slider' && (
                    <input
                      type="range"
                      min={param.min ?? 0}
                      max={param.max ?? 1}
                      step={param.step ?? 0.01}
                      value={Number(paramValues[param.id] ?? param.default)}
                      onChange={(event) => setParam(param.id, parseFloat(event.target.value))}
                      style={{ width: '100%', accentColor: 'var(--accent)' }}
                    />
                  )}

                  {param.type === 'stepper' && (
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button
                        onClick={() =>
                          setParam(
                            param.id,
                            Math.max(
                              param.min ?? 1,
                              Number(paramValues[param.id] ?? param.default) - (param.step ?? 1),
                            ),
                          )}
                        style={{
                          flex: 1,
                          padding: '0.25rem',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: 5,
                          background: 'var(--bg-hover)',
                          color: 'var(--text-secondary)',
                          cursor: 'pointer',
                          fontSize: '0.825rem',
                        }}
                      >
                        -
                      </button>
                      <button
                        onClick={() =>
                          setParam(
                            param.id,
                            Math.min(
                              param.max ?? 100,
                              Number(paramValues[param.id] ?? param.default) + (param.step ?? 1),
                            ),
                          )}
                        style={{
                          flex: 1,
                          padding: '0.25rem',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: 5,
                          background: 'var(--bg-hover)',
                          color: 'var(--text-secondary)',
                          cursor: 'pointer',
                          fontSize: '0.825rem',
                        }}
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {moduleData.playground.tryThis && moduleData.playground.tryThis.length > 0 && (
            <div>
              <div
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  marginBottom: 8,
                }}
              >
                💡 Try This
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {moduleData.playground.tryThis.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      padding: '0.5rem 0.75rem',
                      borderRadius: 7,
                      background: 'rgba(99,102,241,0.06)',
                      border: '1px solid rgba(99,102,241,0.15)',
                      borderLeft: '3px solid rgba(99,102,241,0.5)',
                      fontSize: '0.8rem',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.55,
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
