'use client';

import { ProgressBar } from '@/components/ui/ProgressBar';
import { Badge } from '@/components/ui/Badge';

const TIER_COLORS: Record<number, string> = {
  0: 'var(--tier-0)',
  1: 'var(--tier-1)',
  2: 'var(--tier-2)',
  3: 'var(--tier-3)',
  4: 'var(--tier-4)',
  5: 'var(--tier-5)',
};

interface TierCardProps {
  id: number;
  title: string;
  emoji: string;
  description: string;
  moduleCount: number;
  completedModules: number;
  recommendation?: string;
  onClick?: () => void;
}

export function TierCard({
  id,
  title,
  emoji,
  description,
  moduleCount,
  completedModules,
  recommendation,
  onClick,
}: TierCardProps) {
  const hasModules = moduleCount > 0;
  const progress = hasModules ? completedModules / moduleCount : 0;
  const tierColor = TIER_COLORS[id] ?? 'var(--accent)';
  const isCompleted = hasModules && progress >= 1;
  const progressLabel = hasModules ? `${completedModules}/${moduleCount} modules` : 'Coming soon';

  return (
    <div
      className="tier-card"
      style={{
        ['--tier-color' as string]: tierColor,
        padding: '1.5rem',
        cursor: onClick ? 'pointer' : 'default',
        position: 'relative',
        overflow: 'hidden',
      }}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '80px',
          background: `linear-gradient(180deg, ${tierColor}08 0%, transparent 100%)`,
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '0.75rem',
          position: 'relative',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <span style={{ fontSize: '1.75rem' }}>{emoji}</span>
          <div>
            <div
              style={{
                fontSize: '0.6875rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: tierColor,
                marginBottom: '0.125rem',
              }}
            >
              Tier {id}
            </div>
            <h3
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.125rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                margin: 0,
              }}
            >
              {title}
            </h3>
          </div>
        </div>

        {isCompleted && <Badge variant="success">Complete</Badge>}
      </div>

      <p
        style={{
          fontSize: '0.875rem',
          color: 'var(--text-secondary)',
          margin: '0 0 1rem 0',
          lineHeight: 1.5,
        }}
      >
        {description}
      </p>

      {recommendation && (
        <div
          style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            color: tierColor,
            marginBottom: '1rem',
          }}
        >
          {recommendation}
        </div>
      )}

      <div>
        <ProgressBar
          value={progress}
          showPercentage={hasModules}
          size="sm"
          gradient={[tierColor, tierColor]}
          label={progressLabel}
        />
      </div>
    </div>
  );
}
