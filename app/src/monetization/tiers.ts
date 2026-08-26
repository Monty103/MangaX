// ════════════════════════════════════════════════════════════════════
//  CONFIG — edit these two tables to change tiers and avatar art.
//  Ported verbatim from project/monetization-frames.jsx, which called
//  them out as the two tables meant to be edited later. Change these and
//  every screen follows.
// ════════════════════════════════════════════════════════════════════

export type RingType = 'none' | 'solid' | 'double' | 'conic' | 'animated';

export interface Tier {
  lv: number;
  name: string;
  ring: { type: RingType; colors: string[] };
}

/** A new tier every 10 levels. `ring` drives the avatar border. */
export const TIERS: Tier[] = [
  { lv: 1, name: 'Page Turner', ring: { type: 'solid', colors: ['#6b7280'] } },
  { lv: 10, name: 'Nightreader', ring: { type: 'solid', colors: ['#5b8dc9'] } },
  { lv: 20, name: 'Lanternbearer', ring: { type: 'solid', colors: ['#d99a3c'] } },
  { lv: 30, name: 'Inkbound', ring: { type: 'double', colors: ['#8b6fd4'] } },
  { lv: 40, name: 'Tidewalker', ring: { type: 'double', colors: ['#3fa89b'] } },
  { lv: 50, name: 'Ashen Blade', ring: { type: 'conic', colors: ['#c0392b', '#f0a08a', '#c0392b'] } },
  { lv: 60, name: 'Vermilion Oath', ring: { type: 'conic', colors: ['#e0362c', '#ffb199', '#7d1a14', '#e0362c'] } },
  { lv: 70, name: 'Ninefold Sage', ring: { type: 'conic', colors: ['#c9a227', '#f7e79b', '#a2761c', '#c9a227'] } },
  { lv: 80, name: 'Duskwarden', ring: { type: 'animated', colors: ['#1c1c22', '#c9a227', '#1c1c22', '#8b6fd4', '#1c1c22'] } },
  { lv: 90, name: 'Eclipse Herald', ring: { type: 'animated', colors: ['#e0362c', '#c9a227', '#8b6fd4', '#3fa89b', '#e0362c'] } },
  { lv: 100, name: 'Astral Bibliophile', ring: { type: 'animated', colors: ['#8b6fd4', '#3fa89b', '#f7e79b', '#e0362c', '#8b6fd4'] } },
];

export interface AvatarItem {
  id: string;
  file: string;
  label: string;
}
export interface AvatarPack {
  id: string;
  name: string;
  note: string;
  locked?: boolean;
  items: AvatarItem[];
}

/**
 * Avatar art. Add packs or swap `file` values — the picker renders
 * whatever is here. `file` is the asset path the app will load; until real
 * art ships, a keyed placeholder is drawn from the filename.
 */
export const AVATAR_PACKS: AvatarPack[] = [
  {
    id: 'starter',
    name: 'Starter',
    note: 'Free for everyone',
    items: [
      { id: 's1', file: 'av_ronin.webp', label: 'Ronin' },
      { id: 's2', file: 'av_kitsune.webp', label: 'Kitsune' },
      { id: 's3', file: 'av_lantern.webp', label: 'Lantern' },
      { id: 's4', file: 'av_crane.webp', label: 'Crane' },
      { id: 's5', file: 'av_oni.webp', label: 'Oni' },
      { id: 's6', file: 'av_koi.webp', label: 'Koi' },
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    note: 'Unlocked with Premium',
    locked: false,
    items: [
      { id: 'p1', file: 'av_shrine.webp', label: 'Shrine' },
      { id: 'p2', file: 'av_tengu.webp', label: 'Tengu' },
      { id: 'p3', file: 'av_sakura.webp', label: 'Sakura' },
      { id: 'p4', file: 'av_dragon.webp', label: 'Dragon' },
    ],
  },
  {
    id: 'tier',
    name: 'Tier rewards',
    note: 'Earned at Lv 50+',
    locked: true,
    items: [
      { id: 't1', file: 'av_eclipse.webp', label: 'Eclipse' },
      { id: 't2', file: 'av_astral.webp', label: 'Astral' },
    ],
  },
];

/** XP awarded per chapter finished — the design's progression rate. */
export const XP_PER_CHAPTER = 12;

export function tierFor(lv: number): Tier {
  let t = TIERS[0];
  for (const x of TIERS) if (lv >= x.lv) t = x;
  return t;
}

export function nextTier(lv: number): Tier | null {
  return TIERS.find((x) => x.lv > lv) ?? null;
}

/** Levels use a gently increasing curve so early levels come quickly. */
export function xpForLevel(lv: number): number {
  return Math.round(60 * lv + 1.5 * lv * lv);
}

export function levelFromXp(xp: number): { level: number; into: number; need: number } {
  let level = 1;
  while (level < 100 && xp >= xpForLevel(level + 1)) level++;
  const base = xpForLevel(level);
  const next = level >= 100 ? base : xpForLevel(level + 1);
  return { level, into: xp - base, need: Math.max(1, next - base) };
}
