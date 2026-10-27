import type { DownloadEntry, LocalPage, LocalPageInfo } from './types';

// Offline chapter downloads are a native capability: they need a real
// filesystem (expo-file-system) and a local SQLite index. The browser
// equivalent would be a service worker plus the Cache API, which is a
// separate implementation with different eviction semantics — so rather
// than half-working here, the web build reports the feature as
// unsupported and the Downloads screen says so plainly.

export const isSupported = false;

export async function listEntries(): Promise<DownloadEntry[]> {
  return [];
}

export async function upsertEntry(_e: DownloadEntry): Promise<void> {}

export async function deleteEntry(_id: string): Promise<void> {}

export async function diskUsage(): Promise<number> {
  return 0;
}

export async function downloadPage(_id: string, _pageIndex: number, _url: string): Promise<number> {
  throw new Error('Downloads are not available on the web build.');
}

export async function writeManifest(_id: string, _pages: LocalPageInfo[]): Promise<void> {}

export async function localPages(_id: string): Promise<LocalPage[] | null> {
  return null;
}
