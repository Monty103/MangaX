import type { IconName } from '@/components/ui/Icon';

export interface NavItem {
  key: string;
  href: '/' | '/browse' | '/library' | '/profile';
  label: string;
  icon: IconName;
}

// Matches project/mobile-frames.jsx `MobileTabBar` exactly (Home / Browse /
// Library / "You"). Search isn't a tab in the design — it's reached via the
// search icon in the top bar (desktop) or a dedicated screen (mobile) — so
// it's a pushed route (src/app/search.tsx), not part of this tab set.
export const NAV_ITEMS: NavItem[] = [
  { key: 'home', href: '/', label: 'Home', icon: 'home' },
  { key: 'browse', href: '/browse', label: 'Browse', icon: 'grid' },
  { key: 'library', href: '/library', label: 'Library', icon: 'book' },
  { key: 'profile', href: '/profile', label: 'You', icon: 'user' },
];
