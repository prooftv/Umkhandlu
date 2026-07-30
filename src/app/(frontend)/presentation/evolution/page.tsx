import type { Metadata } from 'next';
import EvolutionClient from './EvolutionClient';

export const metadata: Metadata = {
  title: 'The Evolution of Umkhandlu',
  description:
    'A scroll-driven case study: how one community meeting becomes permanent institutional memory, certified infrastructure progress, statutory compliance, and community presence.',
  robots: { index: false },
};

export default function EvolutionPage() {
  return <EvolutionClient />;
}
