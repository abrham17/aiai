'use client';

import type { Module, Step } from '@/core/types';
import { GoDeeper } from '@/components/lesson/GoDeeper';
import { AuthorNote } from '@/components/lesson/AuthorNote';
import { QuizBlock } from '@/components/lesson/QuizBlock';

interface StepViewerProps {
  step: Step;
  Visualization: Module['Visualization'];
  direction: 'next' | 'back';
  stepIndex: number;
  totalSteps: number;
  isCompleted: boolean;
  quizAnswer?: number;
  onComplete: () => void;
  onNext: () => void;
  onBack: () => void;
  onQuizAnswer: (answerIndex: number) => void;
  canGoNext: boolean;
  canGoBack: boolean;
  isLastStep: boolean;
  onFinishModule?: () => void;
}

export function StepViewer({
  step,
  Visualization,
  direction,
  stepIndex,
  totalSteps,
  isCompleted,
  quizAnswer,
  onComplete,
  onNext,
  onBack,
  onQuizAnswer,
  canGoNext,
  canGoBack,
  isLastStep,
  onFinishModule,
}: StepViewerProps) {
  const slideClass = direction === 'next' ? 'step-slide-next' : 'step-slide-back';

  function handleContinue() {
    onComplete();
    if (isLastStep && onFinishModule) {
      onFinishModule();
    } else if (canGoNext) {
      onNext();
    }
  }

  function renderVisualization() {
    if (!Visualization) return null;
    return <Visualization presentation="guided" {...step.visualizationProps} />;
  }

  return (
    <div
      key={`step-${stepIndex}`}
      className={slideClass}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: 0,
      }}
    >
      <div
        style={{
          flex: '0 0 55%',
          minHeight: '300px',
          background: 'var(--bg-base)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {renderVisualization()}

        {step.interactionHint && (
          <div
            style={{
              position: 'absolute',
              bottom: '0.5rem',
              left: '0.5rem',
              padding: '0.35rem 0.65rem',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(10,14,39,0.82)',
              border: '1px solid rgba(99,102,241,0.2)',
              fontSize: '0.68rem',
              color: 'var(--text-muted)',
              maxWidth: '260px',
              lineHeight: 1.45,
              zIndex: 4,
              pointerEvents: 'none',
              backdropFilter: 'blur(6px)',
            }}
          >
            💡 {step.interactionHint}
          </div>
        )}
      </div>

      <div
        style={{
          flex: '1 1 auto',
          overflowY: 'auto',
          padding: '1.25rem 0',
          minHeight: 0,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '0.5rem',
          }}
        >
          <span
            style={{
              fontSize: '0.6875rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'var(--accent)',
            }}
          >
            Step {stepIndex + 1} of {totalSteps}
          </span>
          {isCompleted && (
            <span style={{ fontSize: '0.75rem', color: 'var(--success)' }}>✅</span>
          )}
        </div>

        <h2
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.25rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            margin: '0 0 0.75rem 0',
            letterSpacing: '-0.01em',
          }}
        >
          {step.title}
        </h2>

        <p
          style={{
            fontSize: '0.9375rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.75,
            margin: 0,
          }}
        >
          {step.content.text}
        </p>

        {step.content.goDeeper && (
          <GoDeeper data={step.content.goDeeper} />
        )}

        {step.content.authorNote && (
          <AuthorNote content={step.content.authorNote} />
        )}

        {step.quiz && (
          <QuizBlock
            quiz={step.quiz}
            existingAnswer={quizAnswer}
            onAnswer={onQuizAnswer}
          />
        )}

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '1.5rem',
            paddingTop: '1rem',
            borderTop: '1px solid var(--border-subtle)',
          }}
        >
          <button
            onClick={onBack}
            disabled={!canGoBack}
            className="btn btn--ghost btn--sm"
            style={{
              opacity: canGoBack ? 1 : 0.3,
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem',
            }}
          >
            ← Back
          </button>

          <button
            onClick={handleContinue}
            className="btn btn--primary btn--md"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem',
            }}
          >
            {isLastStep ? '🎉 Finish Module' : 'Continue →'}
          </button>
        </div>
      </div>
    </div>
  );
}
