import * as SQLite from 'expo-sqlite';
import { Directory, File, Paths } from 'expo-file-system';

import type { DownloadEntry, DownloadState } from './types';

// Per chats/chat2.md: downloaded chapter images live on the device as files
// with a local SQLite index of what's downloaded. They deliberately do NOT
// sync to Postgres — downloads are per-device by nature.

const DB_NAME = 'mangax-downloads.db';
let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

async function db() {
  if (!dbPromise) {
    dbPromise = SQLite.openDatabaseAsync(DB_NAME).then(async (d) => {
      await d.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS downloads (
          id TEXT PRIMARY KEY NOT NULL,
          series_id INTEGER NOT NULL,
          series_title TEXT NOT NULL,
          chapter_number REAL NOT NULL,
          state TEXT NOT NULL,
          progress REAL NOT NULL DEFAULT 0,
          bytes INTEGER NOT NULL DEFAULT 0,
          page_count INTEGER NOT NULL DEFAULT 0,
          pages_done INTEGER NOT NULL DEFAULT 0,
          error TEXT,
          updated_at INTEGER NOT NULL
        );
      `);
      return d;
    });
  }
  return dbPromise;
}

function chaptersRoot(): Directory {
  const dir = new Directory(Paths.document, 'chapters');
  if (!dir.exists) dir.create({ intermediates: true });
  return dir;
}

export function chapterDir(id: string): Directory {
  const dir = new Directory(chaptersRoot(), id);
  if (!dir.exists) dir.create({ intermediates: true });
  return dir;
}

interface Row {
  id: string;
  series_id: number;
  series_title: string;
  chapter_number: number;
  state: string;
  progress: number;
  bytes: number;
  page_count: number;
  pages_done: number;
  error: string | null;
  updated_at: number;
}

const toEntry = (r: Row): DownloadEntry => ({
  id: r.id,
  seriesId: r.series_id,
  seriesTitle: r.series_title,
  chapterNumber: r.chapter_number,
  state: r.state as DownloadState,
  progress: r.progress,
  bytes: r.bytes,
  pageCount: r.page_count,
  pagesDone: r.pages_done,
  error: r.error ?? undefined,
  updatedAt: r.updated_at,
});

export async function listEntries(): Promise<DownloadEntry[]> {
  const d = await db();
  const rows = await d.getAllAsync<Row>('SELECT * FROM downloads ORDER BY updated_at DESC');
  return rows.map(toEntry);
}

export async function upsertEntry(e: DownloadEntry): Promise<void> {
  const d = await db();
  await d.runAsync(
    `INSERT INTO downloads (id, series_id, series_title, chapter_number, state, progress, bytes, page_count, pages_done, error, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       state=excluded.state, progress=excluded.progress, bytes=excluded.bytes,
       page_count=excluded.page_count, pages_done=excluded.pages_done,
       error=excluded.error, updated_at=excluded.updated_at`,
    [e.id, e.seriesId, e.seriesTitle, e.chapterNumber, e.state, e.progress, e.bytes, e.pageCount, e.pagesDone, e.error ?? null, e.updatedAt]
  );
}

export async function deleteEntry(id: string): Promise<void> {
  const d = await db();
  await d.runAsync('DELETE FROM downloads WHERE id = ?', [id]);
  try {
    const dir = new Directory(chaptersRoot(), id);
    if (dir.exists) dir.delete();
  } catch {
    // Index row is gone either way; a stale directory is reclaimed by the
    // next full storage sweep.
  }
}

/** Sums real on-disk size rather than trusting the index. */
export async function diskUsage(): Promise<number> {
  try {
    const root = chaptersRoot();
    let total = 0;
    for (const child of root.list()) {
      if (child instanceof File) {
        total += child.size ?? 0;
      } else {
        for (const f of child.list()) if (f instanceof File) total += f.size ?? 0;
      }
    }
    return total;
  } catch {
    return 0;
  }
}

/** Downloads one page image into the chapter's directory. */
export async function downloadPage(id: string, pageIndex: number, url: string): Promise<number> {
  const dir = chapterDir(id);
  const name = `pg_${String(pageIndex + 1).padStart(3, '0')}`;
  const file = await File.downloadFileAsync(url, new File(dir, name));
  return file.size ?? 0;
}

export const isSupported = true;
