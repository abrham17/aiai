'use client';

import { useParams, useRouter } from 'next/navigation';
import { getTierSummary } from '@/core/curriculum';
import { useProgress } from '@/hooks/useProgress';

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: 'var(--color-success)',
  intermediate: 'var(--color-info)',
  advanced: 'var(--color-warning)',
  research: 'var(--color-error)',
};

export default function TierOverviewPage() {
  const params = useParams();
  const router = useRouter();
  const tierId = Number(params.tierId);

  const { progress, isLoaded, getModuleProgress } = useProgress();
  const tierInfo = getTierSummary(tierId, isLoaded ? progress : undefined);
  const modules = tierInfo?.modules ?? [];

  if (!tierInfo) {
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
          <div style={{ fontSize: '2.25rem', marginBottom: '1rem', fontWeight: 700 }}>404</div>
          <p>Tier {tierId} not found.</p>
          <button
            className="btn btn--primary btn--sm"
            style={{ marginTop: '1rem' }}
            onClick={() => router.push('/')}
          >
            &larr; Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const tierColor = `var(--tier-${tierId})`;
  const moduleTitleById = new Map(modules.map((moduleMeta) => [moduleMeta.id, moduleMeta.title]));

  return (
    <div
      className="page-wrapper bg-mesh"
      style={{
        minHeight: '100vh',
        background: 'var(--bg-base)',
        padding: '2rem',
      }}
    >
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <button
          onClick={() => router.push('/')}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            fontSize: '0.875rem',
            padding: '0.25rem 0',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.375rem',
          }}
        >
          &larr; Dashboard
        </button>

        <div
          style={{
            marginBottom: '2rem',
            paddingBottom: '1.5rem',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '2rem' }}>{tierInfo.emoji}</span>
            <div>
              <div
                style={{
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: tierColor,
                }}
              >
                Tier {tierId}
              </div>
              <h1
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '2rem',
                  fontWeight: 800,
                  color: 'var(--text-primary)',
                  margin: 0,
                  letterSpacing: '-0.02em',
                }}
              >
                {tierInfo.title}
              </h1>
            </div>
          </div>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', margin: 0, maxWidth: '600px' }}>
            {tierInfo.description}
          </p>
        </div>

        {modules.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '3rem 2rem',
              color: 'var(--text-muted)',
            }}
          >
            <div style={{ fontSize: '1.5rem', marginBottom: '0.75rem', fontWeight: 700 }}>Soon</div>
            <p style={{ fontSize: '0.9375rem', margin: 0 }}>Modules for this tier are coming soon.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {modules.map((mod, i) => {
              const modProgress = getModuleProgress(tierId, mod.id);
              const stepsCompleted = modProgress.stepsCompleted.length;
              const isStarted = modProgress.status === 'in-progress' || modProgress.status === 'completed';
              const isCompleted = modProgress.status === 'completed';
              const prerequisitesMet = mod.prerequisites.every((prereq) => {
                const prerequisiteProgress = getModuleProgress(tierId, prereq);
                return prerequisiteProgress.status === 'completed';
              });
              const prerequisiteTitles = mod.prerequisites.map(
                (prerequisiteId) => moduleTitleById.get(prerequisiteId) ?? prerequisiteId,
              );
              const recommendation =
                isCompleted
                  ? 'Completed'
                  : isStarted
                    ? 'Continue where you left off'
                    : mod.prerequisites.length === 0
                      ? i === 0
                        ? 'Recommended start'
                        : null
                      : prerequisitesMet
                        ? 'Recommended next'
                        : `Best after ${prerequisiteTitles.join(', ')}`;
              const borderColor =
                isCompleted
                  ? 'var(--success)'
                  : recommendation === 'Recommended next' || recommendation === 'Recommended start'
                    ? 'var(--accent)'
                    : 'var(--border-subtle)';

              return (
                <div
                  key={mod.id}
                  onClick={() => router.push(`/tier/${tierId}/${mod.id}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      router.push(`/tier/${tierId}/${mod.id}`);
                    }
                  }}
                  className="animate-fade-in"
                  style={{
                    animationDelay: `${i * 0.06}s`,
                    padding: '1.25rem 1.5rem',
                    borderRadius: 'var(--radius-lg)',
                    background: 'var(--bg-surface)',
                    border: `1px solid ${borderColor}`,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.25rem',
                    transition: 'all var(--transition-normal)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor =
                      borderColor === 'var(--border-subtle)' ? 'var(--border-default)' : borderColor;
                    e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = borderColor;
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.transform = 'none';
                  }}
                >
                  <span
                    style={{
                      width: '2.5rem',
                      height: '2.5rem',
                      borderRadius: 'var(--radius-md)',
                      background: isCompleted
                        ? 'var(--success)'
                        : isStarted
                          ? 'var(--accent-soft)'
                          : 'var(--bg-hover)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: isCompleted ? '1rem' : '0.875rem',
                      fontWeight: 700,
                      color: isCompleted
                        ? 'white'
                        : isStarted
                          ? 'var(--accent)'
                          : 'var(--text-muted)',
                      flexShrink: 0,
                    }}
                  >
                    {isCompleted ? 'Done' : i + 1}
                  </span>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <h3
                        style={{
                          fontFamily: 'var(--font-heading)',
                          fontSize: '1rem',
                          fontWeight: 700,
                          color: 'var(--text-primary)',
                          margin: 0,
                        }}
                      >
                        {mod.title}
                      </h3>
                    </div>
                    <p
                      style={{
                        fontSize: '0.8125rem',
                        color: 'var(--text-secondary)',
                        margin: 0,
                        lineHeight: 1.5,
                      }}
                    >
                      {mod.description}
                    </p>
                    <div
                      style={{
                        display: 'flex',
                        gap: '0.375rem',
                        marginTop: '0.5rem',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                      }}
                    >
                      <span
                        style={{
                          padding: '0.125rem 0.375rem',
                          borderRadius: '4px',
                          fontSize: '0.625rem',
                          fontWeight: 600,
                          color: DIFFICULTY_COLORS[mod.difficulty] ?? 'var(--text-muted)',
                          background: 'var(--bg-hover)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                        }}
                      >
                        {mod.difficulty}
                      </span>
                      {recommendation && (
                        <span
                          style={{
                            fontSize: '0.6875rem',
                            fontWeight: 600,
                            color:
                              recommendation === 'Completed'
                                ? 'var(--success)'
                                : recommendation === 'Recommended next' || recommendation === 'Recommended start'
                                  ? 'var(--accent)'
                                  : 'var(--text-muted)',
                          }}
                        >
                          {recommendation}
                        </span>
                      )}
                      <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                        ~{mod.estimatedMinutes} min
                      </span>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    {isStarted && !isCompleted && (
                      <div
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          color: 'var(--accent)',
                          marginBottom: '0.25rem',
                        }}
                      >
                        {stepsCompleted} steps done
                      </div>
                    )}
                    <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>&rarr;</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
