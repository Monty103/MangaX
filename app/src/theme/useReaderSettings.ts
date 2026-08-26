import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { DEFAULT_READER_SETTINGS, ReaderSettingsState } from './readerSettings';

const KEY = 'mangax.reader-settings.v1';

// Local-first, same pattern as ThemeProvider — global reader defaults
// persisted on-device. "Apply to: this series" isn't modeled yet (would
// need a per-series override map keyed by series id); everything currently
// applies globally, matching the "all series" scope default.
export function useReaderSettings() {
  const [settings, setSettings] = useState<ReaderSettingsState>(DEFAULT_READER_SETTINGS);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    AsyncStorage.getItem(KEY).then((raw) => {
      if (cancelled) return;
      if (raw) {
        try {
          setSettings({ ...DEFAULT_READER_SETTINGS, ...JSON.parse(raw) });
        } catch {
          // ignore corrupt value
        }
      }
      setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const update = useCallback((patch: Partial<ReaderSettingsState>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      AsyncStorage.setItem(KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  return { settings, update, ready };
}
