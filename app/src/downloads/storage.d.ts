// Type contract for the platform-split storage layer.
//
// Metro resolves `./storage` to `storage.native.ts` on iOS/Android and
// `storage.web.ts` in the browser. TypeScript does not understand those
// platform extensions, so this declaration file supplies the shared shape
// both implementations satisfy. There is deliberately no `storage.ts`
// runtime file — adding one would let the wrong platform's code be bundled.
import type { DownloadEntry } from './types';

export declare const isSupported: boolean;
export declare function listEntries(): Promise<DownloadEntry[]>;
export declare function upsertEntry(e: DownloadEntry): Promise<void>;
export declare function deleteEntry(id: string): Promise<void>;
export declare function diskUsage(): Promise<number>;
export declare function downloadPage(id: string, pageIndex: number, url: string): Promise<number>;
