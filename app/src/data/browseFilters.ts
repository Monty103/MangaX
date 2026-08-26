import type { Series } from './types';

export type SortKey = 'popular' | 'rating' | 'newest' | 'chapters';

export const SORT_LABELS: Record<SortKey, string> = {
  popular: 'Most popular',
  rating: 'Highest rated',
  newest: 'Newest',
  chapters: 'Most chapters',
};

export interface BrowseFilterState {
  genres: Set<string>;
  demo: string | null;
  status: string | null;
  sort: SortKey;
}

export function defaultFilterState(): BrowseFilterState {
  return { genres: new Set(), demo: null, status: null, sort: 'popular' };
}

export function applyFilters(all: Series[], f: BrowseFilterState): Series[] {
  let out = all.filter((s) => {
    if (f.genres.size > 0 && !s.tags.some((t) => f.genres.has(t))) return false;
    if (f.demo && s.demo !== f.demo) return false;
    if (f.status && s.status !== f.status) return false;
    return true;
  });

  switch (f.sort) {
    case 'rating':
      out = out.slice().sort((a, b) => b.rating - a.rating);
      break;
    case 'newest':
      out = out.slice().sort((a, b) => b.year - a.year);
      break;
    case 'chapters':
      out = out.slice().sort((a, b) => b.chapters - a.chapters);
      break;
    case 'popular':
    default:
      out = out.slice().sort((a, b) => b.ratings - a.ratings);
  }
  return out;
}
