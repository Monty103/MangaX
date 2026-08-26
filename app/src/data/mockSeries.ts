import { Series } from './types';

// Ported 1:1 from project/shared.jsx `SERIES` — placeholder catalog used
// until Supabase queries (task: Supabase client + DB schema) replace it.
// Names are original, chosen to not reference any real series.
export const SERIES: Series[] = [
  { id: 1, title: 'Iron Lantern', author: 'K. Mori', tags: ['Action', 'Supernatural'], chapters: 142, rating: 4.7, ratings: 12840, status: 'Ongoing', year: 2021, demo: 'Shounen' },
  { id: 2, title: 'Saltwater Atlas', author: 'R. Aoyama', tags: ['Adventure', 'Drama'], chapters: 87, rating: 4.5, ratings: 6521, status: 'Ongoing', year: 2022, demo: 'Seinen' },
  { id: 3, title: 'Paper Daughters', author: 'M. Tanaka', tags: ['Slice of Life', 'Romance'], chapters: 64, rating: 4.8, ratings: 9203, status: 'Ongoing', year: 2020, demo: 'Josei' },
  { id: 4, title: 'Veil of the Hollow', author: 'S. Kuroda', tags: ['Horror', 'Mystery'], chapters: 38, rating: 4.6, ratings: 4112, status: 'Hiatus', year: 2023, demo: 'Seinen' },
  { id: 5, title: 'Boys at Eight Sigma', author: 'Y. Hibiki', tags: ['Sci-Fi', 'Action'], chapters: 211, rating: 4.4, ratings: 18921, status: 'Ongoing', year: 2018, demo: 'Shounen' },
  { id: 6, title: 'Dewline', author: 'A. Saeki', tags: ['Romance', 'School'], chapters: 52, rating: 4.9, ratings: 22100, status: 'Completed', year: 2019, demo: 'Shoujo' },
  { id: 7, title: 'Old Gods of the Ginza', author: 'T. Hayami', tags: ['Fantasy', 'Action'], chapters: 96, rating: 4.3, ratings: 5610, status: 'Ongoing', year: 2022, demo: 'Seinen' },
  { id: 8, title: 'Threadbare', author: 'H. Imai', tags: ['Drama', 'Psychological'], chapters: 24, rating: 4.7, ratings: 2304, status: 'Ongoing', year: 2024, demo: 'Seinen' },
  { id: 9, title: 'Mockingbird Protocol', author: 'L. Ozaki', tags: ['Sci-Fi', 'Thriller'], chapters: 119, rating: 4.5, ratings: 7820, status: 'Ongoing', year: 2021, demo: 'Seinen' },
  { id: 10, title: 'Sundial', author: 'K. Wakatsuki', tags: ['Slice of Life'], chapters: 41, rating: 4.6, ratings: 3104, status: 'Ongoing', year: 2023, demo: 'Seinen' },
  { id: 11, title: 'Cherry Carbide', author: 'N. Sora', tags: ['Action', 'Comedy'], chapters: 78, rating: 4.2, ratings: 4500, status: 'Ongoing', year: 2020, demo: 'Shounen' },
  { id: 12, title: 'Pale Horizon', author: 'I. Fujimaki', tags: ['Drama', 'Historical'], chapters: 33, rating: 4.8, ratings: 1980, status: 'Ongoing', year: 2024, demo: 'Seinen' },
];

export const GENRES = [
  'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Mystery', 'Romance',
  'Sci-Fi', 'Slice of Life', 'Sports', 'Supernatural', 'Thriller', 'Psychological', 'School', 'Historical',
];
export const DEMOS = ['Shounen', 'Seinen', 'Shoujo', 'Josei'] as const;
export const STATUSES = ['Ongoing', 'Completed', 'Hiatus', 'Cancelled'] as const;

export function seriesById(id: number): Series | undefined {
  return SERIES.find((s) => s.id === id);
}
