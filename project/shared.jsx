// Shared building blocks for MangaX prototype
// Theme-agnostic primitives: cover placeholders, tag chips, ratings,
// scrollbars, page chrome. Use CSS variables (set on each frame root)
// so accent / font / density tweaks cascade into both desktop & mobile.

// ── theme helpers ─────────────────────────────────────────────────
const ACCENTS = {
  crimson: { hex: '#ff2e4d', soft: 'rgba(255,46,77,.15)', name: 'Crimson' },
  amber:   { hex: '#ff9e2c', soft: 'rgba(255,158,44,.15)', name: 'Amber' },
  iris:    { hex: '#7c5cff', soft: 'rgba(124,92,255,.15)', name: 'Iris' },
};

const FONTS = {
  grotesk: { display: '"Space Grotesk", ui-sans-serif, system-ui', body: '"Inter", ui-sans-serif, system-ui', name: 'Grotesk + Inter' },
  serif:   { display: '"Fraunces", ui-serif, Georgia', body: '"Inter", ui-sans-serif, system-ui', name: 'Editorial Serif' },
  mono:    { display: '"JetBrains Mono", ui-monospace, monospace', body: '"Inter", ui-sans-serif, system-ui', name: 'Mono Display' },
};

// CSS variable bag for a frame root. Each frame applies these so
// tweaks cascade to all instances.
function themeVars(t) {
  const a = ACCENTS[t.accent] || ACCENTS.crimson;
  const f = FONTS[t.font] || FONTS.grotesk;
  return {
    '--mx-bg': '#0a0a0c',
    '--mx-surface': '#131318',
    '--mx-surface-2': '#1c1c24',
    '--mx-surface-3': '#26262f',
    '--mx-border': 'rgba(255,255,255,0.08)',
    '--mx-border-strong': 'rgba(255,255,255,0.14)',
    '--mx-text': '#f4f4f6',
    '--mx-text-2': 'rgba(244,244,246,0.72)',
    '--mx-text-3': 'rgba(244,244,246,0.48)',
    '--mx-text-4': 'rgba(244,244,246,0.30)',
    '--mx-accent': a.hex,
    '--mx-accent-soft': a.soft,
    '--mx-display': f.display,
    '--mx-body': f.body,
    color: '#f4f4f6',
    background: '#0a0a0c',
    fontFamily: f.body,
  };
}

// ── Cover placeholder ─────────────────────────────────────────────
// Diagonal-stripe SVG with a monospace "drop_cover.jpg" tag, colored by
// the title's hash so a list looks varied without real images.
function hashHue(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) & 0xffff;
  return h % 360;
}
function CoverPlaceholder({ title, label = 'cover.jpg', ratio = 2/3, style = {}, badge, dim = false }) {
  const hue = hashHue(title || label);
  const bg = `hsl(${hue} 45% 14%)`;
  const stripe = `hsl(${hue} 35% 22%)`;
  return (
    <div style={{
      position: 'relative', overflow: 'hidden', background: bg,
      backgroundImage: `repeating-linear-gradient(135deg, ${stripe} 0 1px, transparent 1px 14px)`,
      aspectRatio: ratio === 'square' ? '1 / 1' : `${ratio}`,
      borderRadius: 6, ...style,
    }}>
      {/* faux composition lines */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 60%, rgba(0,0,0,.7))' }} />
      {dim && <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.45)' }} />}
      <div style={{
        position: 'absolute', left: 8, top: 8,
        font: '500 9px/1.1 ui-monospace, monospace',
        color: 'rgba(255,255,255,.55)', letterSpacing: '.04em',
        background: 'rgba(0,0,0,.35)', padding: '2px 5px', borderRadius: 3,
      }}>{label}</div>
      <div style={{
        position: 'absolute', left: 10, right: 10, bottom: 8,
        font: '700 11px/1.15 var(--mx-display)', color: 'rgba(255,255,255,.85)',
        letterSpacing: '-.01em', textWrap: 'balance',
      }}>{title}</div>
      {badge && (
        <div style={{
          position: 'absolute', top: 8, right: 8,
          font: '600 10px/1 var(--mx-display)', letterSpacing: '.04em',
          background: 'var(--mx-accent)', color: '#fff',
          padding: '4px 6px', borderRadius: 3, textTransform: 'uppercase',
        }}>{badge}</div>
      )}
    </div>
  );
}

// ── Tag chip ──────────────────────────────────────────────────────
function Tag({ children, active = false, accent = false, size = 'md', onClick, count }) {
  const padX = size === 'sm' ? 7 : 10;
  const padY = size === 'sm' ? 3 : 5;
  const fs = size === 'sm' ? 10.5 : 12;
  return (
    <button
      onClick={onClick}
      style={{
        appearance: 'none', cursor: 'pointer', font: `500 ${fs}px/1 var(--mx-body)`,
        letterSpacing: '.01em',
        padding: `${padY}px ${padX}px`,
        borderRadius: 999,
        border: '1px solid ' + (active ? 'var(--mx-accent)' : 'var(--mx-border)'),
        background: active ? 'var(--mx-accent-soft)' : (accent ? 'var(--mx-accent)' : 'transparent'),
        color: active ? 'var(--mx-accent)' : (accent ? '#fff' : 'var(--mx-text-2)'),
        display: 'inline-flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap',
      }}>
      {children}
      {count != null && <span style={{ opacity: .55, fontVariantNumeric: 'tabular-nums' }}>{count}</span>}
    </button>
  );
}

// ── Star rating ───────────────────────────────────────────────────
function Stars({ value = 4.6, size = 12, showValue = true, count }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, font: `600 ${size}px/1 var(--mx-display)` }}>
      <svg width={size + 2} height={size + 2} viewBox="0 0 14 14" fill="var(--mx-accent)">
        <path d="M7 1.2l1.7 3.7 4 .5-3 2.8.8 4L7 10.3 3.5 12.2l.8-4L1.3 5.4l4-.5z"/>
      </svg>
      {showValue && <span>{value.toFixed(1)}</span>}
      {count != null && <span style={{ color: 'var(--mx-text-3)', fontWeight: 400 }}>({count})</span>}
    </div>
  );
}

// ── Generic icon set (stroke icons, currentColor) ────────────────
const Icon = ({ name, size = 18, strokeWidth = 1.6 }) => {
  const d = {
    home: 'M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1z',
    grid: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
    book: 'M4 4h6a3 3 0 0 1 3 3v13a3 3 0 0 0-3-3H4zM20 4h-6a3 3 0 0 0-3 3v13a3 3 0 0 1 3-3h6z',
    search: 'M11 4a7 7 0 1 1 0 14 7 7 0 0 1 0-14zM16 16l5 5',
    bell: 'M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15zM10 21h4',
    user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0',
    bookmark: 'M6 3h12v18l-6-4-6 4z',
    bookmarkF: 'M6 3h12v18l-6-4-6 4z',
    download: 'M12 3v12M6 11l6 6 6-6M4 21h16',
    heart: 'M12 21S4 14.5 4 9a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 5.5-8 12-8 12z',
    settings: 'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM19 12a7 7 0 0 0-.1-1.2l2-1.6-2-3.4-2.4 1A7 7 0 0 0 14.4 5l-.4-2.5h-4l-.4 2.5a7 7 0 0 0-2.1 1.2l-2.4-1-2 3.4 2 1.6A7 7 0 0 0 5 12c0 .4 0 .8.1 1.2l-2 1.6 2 3.4 2.4-1c.6.5 1.4.9 2.1 1.2l.4 2.5h4l.4-2.5c.7-.3 1.5-.7 2.1-1.2l2.4 1 2-3.4-2-1.6c.1-.4.1-.8.1-1.2z',
    chevronR: 'M9 5l7 7-7 7',
    chevronL: 'M15 5l-7 7 7 7',
    chevronD: 'M5 9l7 7 7-7',
    chevronU: 'M5 15l7-7 7 7',
    plus: 'M12 5v14M5 12h14',
    x: 'M6 6l12 12M6 18L18 6',
    filter: 'M3 5h18M6 12h12M10 19h4',
    sort: 'M7 4v16M3 8l4-4 4 4M17 20V4M13 16l4 4 4-4',
    eye: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z',
    comment: 'M4 5h16v11H8l-4 4z',
    share: 'M4 12a4 4 0 1 0 0 .01zM20 5a4 4 0 1 0 0 .01zM20 19a4 4 0 1 0 0 .01zM7 10l10-5M7 14l10 5',
    play: 'M6 4l14 8-14 8z',
    flame: 'M12 2s5 5 5 10a5 5 0 0 1-10 0c0-2 1-3 1-5s4-3 4-5zM12 22a3 3 0 0 0 3-3c0-2-3-4-3-4s-3 2-3 4a3 3 0 0 0 3 3z',
    star: 'M12 2l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z',
    bars: 'M4 6h16M4 12h16M4 18h16',
    arrowR: 'M5 12h14M13 5l7 7-7 7',
    arrowL: 'M19 12H5M11 5l-7 7 7 7',
    check: 'M5 12l5 5 9-11',
    wifi: 'M5 12.5a10 10 0 0 1 14 0M8 16a6 6 0 0 1 8 0M12 19.5h.01',
    cellular: 'M2 19h2v3H2zM7 16h2v6H7zM12 13h2v9h-2zM17 9h2v13h-2z',
    battery: 'M3 8h16v8H3zM21 11v2',
    cloud: 'M7 18a4 4 0 1 1 .9-7.9A5 5 0 0 1 18 12a3 3 0 0 1-1 6z',
    history: 'M3 12a9 9 0 1 0 3-6.7M3 4v5h5M12 7v5l3 2',
    crown: 'M3 8l4 3 5-6 5 6 4-3-2 11H5z',
    sparkle: 'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM18.5 15.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z',
    lock: 'M5 11h14v10H5zM8 11V7a4 4 0 0 1 8 0v4',
    upload: 'M12 20V8M6 12l6-6 6 6M4 4h16',
    trophy: 'M7 4h10v5a5 5 0 0 1-10 0zM7 6H4v2a3 3 0 0 0 3 3M17 6h3v2a3 3 0 0 1-3 3M9 20h6M12 14v6',
    camera: 'M4 8h3l1.5-2h7L17 8h3v12H4zM12 11a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z',
    info: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 8h.01M11.5 11.5h1V17h-1z',
  }[name];
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
    </svg>
  );
};

// ── Avatar pill ───────────────────────────────────────────────────
function Avatar({ name = 'KX', size = 28, color }) {
  const hue = hashHue(name);
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: color || `hsl(${hue} 45% 30%)`,
      color: '#fff', font: `600 ${size * 0.42}px/1 var(--mx-display)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>{name.slice(0, 2).toUpperCase()}</div>
  );
}

// ── Mock data ─────────────────────────────────────────────────────
// Hand-picked names that don't reference real series.
const SERIES = [
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

const GENRES = ['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Mystery', 'Romance', 'Sci-Fi', 'Slice of Life', 'Sports', 'Supernatural', 'Thriller', 'Psychological', 'School', 'Historical'];
const DEMOS = ['Shounen', 'Seinen', 'Shoujo', 'Josei'];
const STATUSES = ['Ongoing', 'Completed', 'Hiatus', 'Cancelled'];

Object.assign(window, {
  ACCENTS, FONTS, themeVars,
  CoverPlaceholder, Tag, Stars, Icon, Avatar,
  SERIES, GENRES, DEMOS, STATUSES, hashHue,
});
