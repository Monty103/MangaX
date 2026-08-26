import { useWindowDimensions } from 'react-native';

// The design's own breakpoint: MangaX.html ships literally separate
// 1440-wide desktop frames and 390-wide mobile frames per screen. The real
// app can't ship two designs, so instead every screen is one responsive
// layout that switches at this width — side rail + multi-column grids above
// it, bottom tab bar + single/2-col layouts below.
export const DESKTOP_BREAKPOINT = 900;

export function useBreakpoint() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= DESKTOP_BREAKPOINT;
  return { width, isDesktop };
}
