'use client';

// Hook: reads and writes the Garden quality level preference.
// Persists to localStorage so the choice survives page reloads without auth.

import { useState, useCallback } from 'react';
import type { QualityLevel, QualityProfile } from '../types/garden.types';
import { getQualityProfiles } from './qualityProfiles';
import { QUALITY_STORAGE_KEY, DEFAULT_QUALITY } from '../constants/garden.constants';

function readStoredQuality(): QualityLevel {
  if (typeof window === 'undefined') return DEFAULT_QUALITY;
  const stored = window.localStorage.getItem(QUALITY_STORAGE_KEY);
  if (stored === 'low' || stored === 'medium' || stored === 'high') {
    return stored;
  }
  return DEFAULT_QUALITY;
}

interface UseQualityLevelReturn {
  quality: QualityLevel;
  profile: QualityProfile;
  setQuality: (level: QualityLevel) => void;
}

export function useQualityLevel(): UseQualityLevelReturn {
  const [quality, setQualityState] = useState<QualityLevel>(readStoredQuality);

  const setQuality = useCallback((level: QualityLevel) => {
    setQualityState(level);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(QUALITY_STORAGE_KEY, level);
    }
  }, []);

  const profiles = getQualityProfiles();
  const profile = profiles[quality];

  return { quality, profile, setQuality };
}
