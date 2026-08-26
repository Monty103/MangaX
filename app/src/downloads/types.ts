export type DownloadState = 'queued' | 'downloading' | 'paused' | 'done' | 'error';

export interface DownloadEntry {
  /** `${seriesId}-${chapterNumber}` — matches the reader's route param. */
  id: string;
  seriesId: number;
  seriesTitle: string;
  chapterNumber: number;
  state: DownloadState;
  /** 0..1 */
  progress: number;
  /** Bytes actually written to disk so far. */
  bytes: number;
  pageCount: number;
  pagesDone: number;
  error?: string;
  updatedAt: number;
}

export interface StorageUsage {
  /** Bytes used by downloaded chapter files. */
  chapters: number;
  /** User-set ceiling in bytes; downloads stop when it is reached. */
  budget: number;
}

export interface DownloadRules {
  wifiOnly: boolean;
  autoDownload: boolean;
  budgetBytes: number;
}

export const DEFAULT_RULES: DownloadRules = {
  wifiOnly: true,
  autoDownload: false,
  budgetBytes: 4 * 1024 * 1024 * 1024, // 4 GB, matching the design's meter
};

export function formatBytes(n: number): string {
  if (n <= 0) return '0 MB';
  const mb = n / (1024 * 1024);
  if (mb < 1) return `${Math.max(1, Math.round(n / 1024))} KB`;
  if (mb < 1024) return `${mb < 10 ? mb.toFixed(1) : Math.round(mb)} MB`;
  return `${(mb / 1024).toFixed(2)} GB`;
}
