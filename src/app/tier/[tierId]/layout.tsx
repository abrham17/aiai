import type { Metadata } from 'next';
import { getTierMeta } from '@/core/curriculum';

type Props = {
  params: Promise<{ tierId: string }>;
  children: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tierId } = await params;
  const id = Number(tierId);
  const tier = getTierMeta(id);
  const title = tier?.title ?? `Tier ${id}`;
  const description = tier?.description ?? `Explore Tier ${id} modules on AI Playground.`;

  return {
    title,
    description,
    openGraph: {
      title: `${title} | AI Playground`,
      description,
    },
  };
}

export default function TierLayout({ children }: { children: React.ReactNode }) {
  return children;
}
