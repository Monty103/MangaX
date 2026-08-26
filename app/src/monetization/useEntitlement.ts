import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { levelFromXp, tierFor, nextTier, XP_PER_CHAPTER } from './tiers';

const KEY = 'mangax.entitlement.v1';

interface Stored {
  premium: boolean;
  xp: number;
  /** Chapters finished, used for the "level you'd already have" prompt. */
  chaptersRead: number;
}

const DEFAULTS: Stored = { premium: false, xp: 0, chaptersRead: 0 };

/**
 * Premium entitlement and reading progression.
 *
 * Device-local for now. The authoritative source once billing is wired up
 * is the `profiles.premium` / `profiles.xp` columns (see
 * supabase/schema.sql), reconciled against the store receipt — never trust
 * a client flag for real entitlement.
 */
export function useEntitlement() {
  const [state, setState] = useState<Stored>(DEFAULTS);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((raw) => {
        if (raw) {
          try {
            setState({ ...DEFAULTS, ...JSON.parse(raw) });
          } catch {
            // keep defaults
          }
        }
      })
      .finally(() => setReady(true));
  }, []);

  const persist = useCallback((next: Stored) => {
    setState(next);
    AsyncStorage.setItem(KEY, JSON.stringify(next)).catch(() => {});
  }, []);

  const recordChapterRead = useCallback(() => {
    setState((prev) => {
      const next = { ...prev, chaptersRead: prev.chaptersRead + 1, xp: prev.xp + XP_PER_CHAPTER };
      AsyncStorage.setItem(KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  /** Development-only toggle; real entitlement comes from the store receipt. */
  const setPremium = useCallback(
    (premium: boolean) => {
      persist({ ...state, premium });
    },
    [persist, state]
  );

  const { level, into, need } = levelFromXp(state.xp);

  return {
    ready,
    premium: state.premium,
    xp: state.xp,
    chaptersRead: state.chaptersRead,
    level,
    xpIntoLevel: into,
    xpForNextLevel: need,
    tier: tierFor(level),
    nextTier: nextTier(level),
    /** Ads show only to non-premium readers. */
    showAds: !state.premium,
    recordChapterRead,
    setPremium,
  };
}
