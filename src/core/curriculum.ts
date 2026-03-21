import type { ProgressState } from '@/types/progress';
import { MODULE_META, type ModuleMeta } from './registry';

export interface TierMeta {
  id: number;
  title: string;
  emoji: string;
  description: string;
  unlockThreshold: number;
}

export interface TierSummary extends TierMeta {
  modules: ModuleMeta[];
  moduleCount: number;
  completedModules: number;
  completionRatio: number;
  isUnlocked: boolean;
  unlockRequirement?: string;
}

export const TIER_META: TierMeta[] = [
  {
    id: 0,
    title: 'Mathematical Foundations',
    emoji: '\uD83D\uDFE2',
    description:
      'Vectors, matrices, calculus, probability - the building blocks of everything in AI.',
    unlockThreshold: 0,
  },
  {
    id: 1,
    title: 'ML Fundamentals',
    emoji: '\uD83D\uDD35',
    description:
      'Linear regression, gradient descent, classification - your first machine learning systems.',
    unlockThreshold: 0.7,
  },
  {
    id: 2,
    title: 'Deep Learning Core',
    emoji: '\uD83D\uDFE3',
    description:
      'Neural networks, backpropagation, and representation learning - the deep learning core.',
    unlockThreshold: 0.7,
  },
  {
    id: 3,
    title: 'Advanced Architectures',
    emoji: '\uD83D\uDFE1',
    description:
      'Transformers, attention, and generative systems - modern model architecture intuition.',
    unlockThreshold: 0.7,
  },
  {
    id: 4,
    title: 'Frontiers & Applications',
    emoji: '\uD83D\uDD34',
    description:
      'Reinforcement learning, multimodal systems, and real-world AI applications at the frontier.',
    unlockThreshold: 0.7,
  },
  {
    id: 5,
    title: 'Research & Open Problems',
    emoji: '\uD83D\uDFE4',
    description:
      'Alignment, scaling laws, and open research questions - where the field is still being written.',
    unlockThreshold: 0.7,
  },
];

const TIER_META_BY_ID = new Map(TIER_META.map((tier) => [tier.id, tier]));

function countCompletedModules(
  tierId: number,
  modules: ModuleMeta[],
  progress?: ProgressState,
): number {
  if (!progress) return 0;

  return modules.reduce((count, moduleMeta) => {
    const status = progress.tiers[tierId]?.modules[moduleMeta.id]?.status;
    return status === 'completed' ? count + 1 : count;
  }, 0);
}

export function getTierMeta(tierId: number): TierMeta | null {
  return TIER_META_BY_ID.get(tierId) ?? null;
}

export function getTierModuleMeta(tierId: number): ModuleMeta[] {
  return MODULE_META.filter((moduleMeta) => moduleMeta.tierId === tierId);
}

export function getTierUnlockRequirement(tierId: number): string | undefined {
  const tier = getTierMeta(tierId);
  if (!tier || tierId === 0) return undefined;

  const thresholdPercent = Math.round(tier.unlockThreshold * 100);
  return `Complete ${thresholdPercent}% of Tier ${tierId - 1} to unlock`;
}

export function isTierUnlocked(tierId: number, progress?: ProgressState): boolean {
  if (tierId === 0) return true;
  if (!progress) return false;

  const storedUnlocked = progress.tiers[tierId]?.unlocked;
  if (storedUnlocked) return true;

  const tier = getTierMeta(tierId);
  if (!tier) return false;

  const previousTierId = tierId - 1;
  const previousTierModules = getTierModuleMeta(previousTierId);

  if (previousTierModules.length === 0) return false;

  const completedPreviousTierModules = countCompletedModules(
    previousTierId,
    previousTierModules,
    progress,
  );

  return completedPreviousTierModules / previousTierModules.length >= tier.unlockThreshold;
}

export function getTierSummary(
  tierId: number,
  progress?: ProgressState,
): TierSummary | null {
  const tier = getTierMeta(tierId);
  if (!tier) return null;

  const modules = getTierModuleMeta(tierId);
  const completedModules = countCompletedModules(tierId, modules, progress);
  const moduleCount = modules.length;

  return {
    ...tier,
    modules,
    moduleCount,
    completedModules,
    completionRatio: moduleCount > 0 ? completedModules / moduleCount : 0,
    isUnlocked: isTierUnlocked(tierId, progress),
    unlockRequirement: getTierUnlockRequirement(tierId),
  };
}

export function getTierSummaries(progress?: ProgressState): TierSummary[] {
  return TIER_META.map((tier) => getTierSummary(tier.id, progress)).filter(
    (tier): tier is TierSummary => tier !== null,
  );
}
