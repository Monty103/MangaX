// Ad frequency rules, stated in-product by the design and enforced here so
// no screen can accidentally violate them:
//
//   - inline reader slots sit a minimum of 4 pages apart
//   - at most one ad per 90 seconds
//   - no ads in a new reader's first chapter
//   - never in downloaded (offline) chapters
//   - never over page art, and never blocking a scroll or tap gesture
//     (that last pair is a layout property — see InlineReaderAd, which is a
//     bounded block in the flow rather than an overlay or interstitial)

export const MIN_PAGES_BETWEEN_ADS = 4;
export const MIN_MS_BETWEEN_ADS = 90_000;

export interface AdCadenceInput {
  /** 0-based page index within the chapter. */
  pageIndex: number;
  premium: boolean;
  /** Chapters this reader has finished overall. */
  chaptersRead: number;
  /** True when reading from local storage. */
  isDownloaded: boolean;
  /** Timestamp of the last ad shown this session, or 0. */
  lastAdAt: number;
  now?: number;
}

/** Whether an inline ad slot belongs after the given page. */
export function shouldShowInlineAd({
  pageIndex,
  premium,
  chaptersRead,
  isDownloaded,
  lastAdAt,
  now = Date.now(),
}: AdCadenceInput): boolean {
  if (premium) return false;
  if (isDownloaded) return false;
  // A brand-new reader's first chapter is ad-free: first-session ad load is
  // the single biggest driver of day-one churn.
  if (chaptersRead < 1) return false;

  const page = pageIndex + 1;
  if (page < MIN_PAGES_BETWEEN_ADS) return false;
  if (page % MIN_PAGES_BETWEEN_ADS !== 0) return false;

  if (lastAdAt > 0 && now - lastAdAt < MIN_MS_BETWEEN_ADS) return false;

  return true;
}

/** Chapter-break slot: the highest-value placement, at a natural pause. */
export function shouldShowChapterBreakAd({
  premium,
  chaptersRead,
  isDownloaded,
}: Pick<AdCadenceInput, 'premium' | 'chaptersRead' | 'isDownloaded'>): boolean {
  if (premium) return false;
  if (isDownloaded) return false;
  if (chaptersRead < 1) return false;
  return true;
}
