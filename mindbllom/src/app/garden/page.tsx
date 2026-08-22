// Garden page: thin routing layer only.
// All logic and UI composition live in GardenExperience.

import { GardenExperience } from '@/features/garden';

export const metadata = {
  title: 'Garden · MindBloom',
  description: "Explore Bloom's Garden.",
};

export default function GardenPage() {
  return <GardenExperience />;
}
