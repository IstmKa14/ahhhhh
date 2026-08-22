'use client';

// Hook: reads and writes the Garden quality level preference.
// Persists to localStorage so the choice survives page reloads without auth.

import { useState, useCallback, useEffect } from 'react';
import type { QualityLevel, QualityProfile } from '../types/garden.types';
import { getQualityProfiles } from './qualityProfiles';
import { QUALITY_STORAGE_KEY, DEFAULT_QUALITY } from '../constants/garden.constants';

interface UseQualityLevelReturn {
  quality: QualityLevel;
  profile: QualityProfile;
  setQuality: (level: QualityLevel) => void;
}

export function useQualityLevel(): UseQualityLevelReturn {
  const [quality, setQualityState] = useState<QualityLevel>(DEFAULT_QUALITY);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(QUALITY_STORAGE_KEY);
      if (stored === 'low' || stored === 'medium' || stored === 'high') {
        setQualityState(stored);
      }
    } catch {
      // Ignore storage access errors
    }
  }, []);

  const setQuality = useCallback((level: QualityLevel) => {
    setQualityState(level);
    try {
      window.localStorage.setItem(QUALITY_STORAGE_KEY, level);
    } catch {
      // Ignore storage access errors
    }
  }, []);

  const profiles = getQualityProfiles();
  const profile = profiles[quality];

  return { quality, profile, setQuality };
}

