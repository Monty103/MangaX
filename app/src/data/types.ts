export type SeriesStatus = 'Ongoing' | 'Completed' | 'Hiatus' | 'Cancelled';
export type Demographic = 'Shounen' | 'Seinen' | 'Shoujo' | 'Josei';

export interface Series {
  id: number;
  title: string;
  author: string;
  tags: string[];
  chapters: number;
  rating: number;
  ratings: number;
  status: SeriesStatus;
  year: number;
  demo: Demographic;
  coverFile?: string | null;
}

export interface Chapter {
  id: string;
  seriesId: number;
  number: number;
  title?: string;
  publishedAt: string; // ISO date
  pageCount: number;
}
