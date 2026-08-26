// Monetization + progression frames for MangaX
// Ad placement, premium paywall, level/tier system, avatar picker.
//
// ════════════════════════════════════════════════════════════════════
//  CONFIG — edit these two tables to change tiers and avatar art.
// ════════════════════════════════════════════════════════════════════

// Level tiers: a new tier every 10 levels. `ring` drives the avatar border.
// ring.type: 'none' | 'solid' | 'double' | 'conic' | 'animated'
const TIERS = [
  { lv: 1,   name: 'Page Turner',       ring: { type: 'solid',    colors: ['#6b7280'] } },
  { lv: 10,  name: 'Nightreader',       ring: { type: 'solid',    colors: ['#5b8dc9'] } },
  { lv: 20,  name: 'Lanternbearer',     ring: { type: 'solid',    colors: ['#d99a3c'] } },
  { lv: 30,  name: 'Inkbound',          ring: { type: 'double',   colors: ['#8b6fd4'] } },
  { lv: 40,  name: 'Tidewalker',        ring: { type: 'double',   colors: ['#3fa89b'] } },
  { lv: 50,  name: 'Ashen Blade',       ring: { type: 'conic',    colors: ['#c0392b', '#f0a08a', '#c0392b'] } },
  { lv: 60,  name: 'Vermilion Oath',    ring: { type: 'conic',    colors: ['#e0362c', '#ffb199', '#7d1a14', '#e0362c'] } },
  { lv: 70,  name: 'Ninefold Sage',     ring: { type: 'conic',    colors: ['#c9a227', '#f7e79b', '#a2761c', '#c9a227'] } },
  { lv: 80,  name: 'Duskwarden',        ring: { type: 'animated', colors: ['#1c1c22', '#c9a227', '#1c1c22', '#8b6fd4', '#1c1c22'] } },
  { lv: 90,  name: 'Eclipse Herald',    ring: { type: 'animated', colors: ['#e0362c', '#c9a227', '#8b6fd4', '#3fa89b', '#e0362c'] } },
  { lv: 100, name: 'Astral Bibliophile',ring: { type: 'animated', colors: ['#8b6fd4', '#3fa89b', '#f7e79b', '#e0362c', '#8b6fd4'] } },
];

// Avatar art. Add packs or swap `file` values — the picker renders whatever is here.
// `file` is the asset path the app will load; the prototype shows a keyed placeholder.
const AVATAR_PACKS = [
  { id: 'starter', name: 'Starter', note: 'Free for everyone', items: [
    { id: 's1', file: 'av_ronin.webp',    label: 'Ronin' },
    { id: 's2', file: 'av_kitsune.webp',  label: 'Kitsune' },
    { id: 's3', file: 'av_lantern.webp',  label: 'Lantern' },
    { id: 's4', file: 'av_crane.webp',    label: 'Crane' },
    { id: 's5', file: 'av_oni.webp',      label: 'Oni' },
    { id: 's6', file: 'av_koi.webp',      label: 'Koi' },
  ]},
  { id: 'premium', name: 'Premium', note: 'Unlocked with Premium', locked: false, items: [
    { id: 'p1', file: 'av_shrine.webp',   label: 'Shrine' },
    { id: 'p2', file: 'av_tengu.webp',    label: 'Tengu' },
    { id: 'p3', file: 'av_sakura.webp',   label: 'Sakura' },
    { id: 'p4', file: 'av_dragon.webp',   label: 'Dragon' },
  ]},
  { id: 'tier', name: 'Tier rewards', note: 'Earned at Lv 50+', locked: true, items: [
    { id: 't1', file: 'av_eclipse.webp',  label: 'Eclipse' },
    { id: 't2', file: 'av_astral.webp',   label: 'Astral' },
  ]},
];

function tierFor(lv) {
  let t = TIERS[0];
  for (const x of TIERS) if (lv >= x.lv) t = x;
  return t;
}
function nextTier(lv) { return TIERS.find(x => x.lv > lv) || null; }

// ── Avatar with tier ring ─────────────────────────────────────────
// Free accounts get ring={type:'none'} — that lone difference is the
// premium tell, per spec: no separate premium badge shouting at people.
function RingKeyframes() {
  return <style>{'@keyframes mxSpin{to{transform:rotate(360deg)}}'}</style>;
}

function Avatar({ size = 56, label = 'HM', file, tier, premium = true, lv }) {
  const ring = premium && tier ? tier.ring : { type: 'none', colors: [] };
  const pad = ring.type === 'none' ? 0 : ring.type === 'double' ? 5 : 3;
  const c = ring.colors;
  let ringStyle = {};
  if (ring.type === 'solid') ringStyle = { background: c[0] };
  else if (ring.type === 'double') ringStyle = { background: c[0], boxShadow: `inset 0 0 0 2px var(--mx-bg)` };
  else if (ring.type === 'conic' || ring.type === 'animated') ringStyle = { background: `conic-gradient(${c.join(',')})` };

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <div style={{
        position: 'absolute', inset: 0, borderRadius: '50%', padding: pad,
        ...ringStyle,
        ...(ring.type === 'animated' ? { animation: 'mxSpin 6s linear infinite' } : {}),
        ...(ring.type === 'none' ? { boxShadow: 'inset 0 0 0 1px var(--mx-border-strong)' } : {}),
      }}/>
      <div style={{
        position: 'absolute', inset: pad, borderRadius: '50%', overflow: 'hidden',
        background: 'var(--mx-surface-3)', border: pad ? '2px solid var(--mx-bg)' : 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {file
          ? <CoverPlaceholder title={file} label="" style={{ width: '100%', height: '100%', borderRadius: 0 }}/>
          : <span style={{ font: `700 ${Math.round(size * .3)}px/1 var(--mx-display)`, color: 'var(--mx-text-2)' }}>{label}</span>}
      </div>
      {premium && lv != null && (
        <div style={{
          position: 'absolute', bottom: -3, right: -3, minWidth: 20, height: 20, padding: '0 5px',
          borderRadius: 999, background: 'var(--mx-bg)', border: '1.5px solid ' + (c[0] || 'var(--mx-border-strong)'),
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          font: '700 10px/1 ui-monospace,monospace', color: c[0] || 'var(--mx-text-2)',
        }}>{lv}</div>
      )}
    </div>
  );
}

// ── Ad slot primitives ────────────────────────────────────────────
// Every ad carries the same three affordances: an AD label, a size that
// is bounded and predictable, and a one-tap route out (Remove ads).
function AdLabel({ children = 'Advertisement' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
      <span style={{
        font: '700 8.5px/1 ui-monospace,monospace', letterSpacing: '.14em',
        color: 'var(--mx-text-4)', border: '1px solid var(--mx-border-strong)',
        padding: '3px 4px', borderRadius: 3,
      }}>AD</span>
      <span style={{ font: '500 9.5px/1 var(--mx-body)', color: 'var(--mx-text-4)', letterSpacing: '.04em' }}>{children}</span>
    </div>
  );
}

function RemoveAdsLink({ compact }) {
  return (
    <button style={{
      background: 'none', border: 'none', cursor: 'pointer',
      padding: '13px 8px', margin: '-13px -8px', minHeight: 44,
      color: 'var(--mx-accent)', font: `600 ${compact ? 11.5 : 12.5}px/1 var(--mx-body)`,
      display: 'inline-flex', alignItems: 'center', gap: 4,
    }}>Remove ads<Icon name="chevronR" size={compact ? 12 : 13}/></button>
  );
}

// Inline reader ad: bounded height, scrolls past like any page. Never
// overlays art, never intercepts the tap-to-toggle or scroll gesture.
function InlineReaderAd({ height = 250, note }) {
  return (
    <div style={{ background: 'var(--mx-bg)', padding: '12px 14px 14px', borderTop: '1px solid var(--mx-border)', borderBottom: '1px solid var(--mx-border)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 9 }}>
        <AdLabel>{note || 'Between pages'}</AdLabel>
        <RemoveAdsLink compact/>
      </div>
      <div style={{
        height, borderRadius: 8, border: '1px dashed var(--mx-border-strong)',
        background: 'var(--mx-surface)', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 7,
      }}>
        <span style={{ font: '600 11px/1 ui-monospace,monospace', color: 'var(--mx-text-3)', letterSpacing: '.06em' }}>300 × {height}</span>
        <span style={{ font: '500 10px/1 var(--mx-body)', color: 'var(--mx-text-4)' }}>MREC · house or network fill</span>
      </div>
    </div>
  );
}

// ── Frame: Reader with ad cadence (mobile) ────────────────────────
function ReaderAdCadenceMobile({ tweaks }) {
  const [visible, setVisible] = React.useState(true);
  const lastY = React.useRef(0);
  const onScroll = e => {
    const y = e.currentTarget.scrollTop;
    if (y - lastY.current > 6 && visible) setVisible(false);
    lastY.current = y;
  };
  const stop = e => e.stopPropagation();
  // Tail of pages 11-12; the ad lands after page 12 (every 4th page).
  // Heights are trimmed so the ad slot — the subject of this frame — sits
  // inside the artboard without needing a scroll applied.
  const pages = [11, 12];

  return (
    <div style={themeVars(tweaks)}>
      <Phone>
        <div onScroll={onScroll} onClick={() => setVisible(v => !v)}
          style={{ flex: 1, overflowY: 'auto', position: 'relative', background: '#000' }}>

          <div onClick={stop} style={{
            position: 'absolute', left: 0, right: 0, top: 0, zIndex: 6,
            opacity: visible ? 1 : 0, pointerEvents: visible ? 'auto' : 'none',
            transition: 'opacity .18s', padding: '14px 16px 12px',
            display: 'flex', alignItems: 'center', gap: 12,
            background: 'linear-gradient(180deg, rgba(10,10,12,.95), transparent)',
          }}>
            <Icon name="chevronL" size={22}/>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ font: '600 13px/1.1 var(--mx-display)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Iron Lantern · Ch. 96</div>
              <div style={{ font: '500 10.5px/1 var(--mx-body)', color: 'var(--mx-text-3)', marginTop: 3 }}>A Wound that Hums · pg 12 of 38</div>
            </div>
            <Icon name="bookmark" size={20}/>
            <Icon name="settings" size={20}/>
          </div>

          {pages.map(p => (
            <CoverPlaceholder key={p} title={`Page ${p}`} label={`pg_${String(p).padStart(3, '0')}.webp`} ratio="auto"
              style={{ borderRadius: 0, height: 160, aspectRatio: 'auto' }}/>
          ))}

          <InlineReaderAd note="After page 12 · every 4th page"/>

          <CoverPlaceholder title="Page 13" label="pg_013.webp" ratio="auto" style={{ borderRadius: 0, height: 300, aspectRatio: 'auto' }}/>

          {/* Bottom chrome keeps the chapter nav; ad entitlement sits above it */}
          <div onClick={stop} style={{
            position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 6,
            opacity: visible ? 1 : 0, pointerEvents: visible ? 'auto' : 'none',
            transition: 'opacity .18s', padding: '10px 12px 16px',
            background: 'linear-gradient(0deg, rgba(10,10,12,.96) 40%, transparent)',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10,
              padding: '8px 10px', background: 'rgba(255,255,255,.05)',
              border: '1px solid var(--mx-border)', borderRadius: 9,
            }}>
              <span style={{ color: 'var(--mx-accent)', flexShrink: 0 }}><Icon name="play" size={12}/></span>
              <span style={{ flex: 1, font: '500 10.5px/1.3 var(--mx-body)', color: 'var(--mx-text-2)' }}>Watch 30s → <strong style={{ color: 'var(--mx-text)' }}>2 hours ad-free</strong></span>
              <RemoveAdsLink compact/>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button style={{ flex: '0 0 auto', padding: '10px 12px', background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.08)', color: 'var(--mx-text)', borderRadius: 10, font: '600 11.5px/1 var(--mx-display)', display: 'inline-flex', alignItems: 'center', gap: 5 }}><Icon name="chevronL" size={13}/>95</button>
              <button style={{ flex: 1, padding: '8px 12px', background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.08)', color: 'var(--mx-text)', borderRadius: 10, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                  <span style={{ font: '500 9px/1 ui-monospace,monospace', color: 'var(--mx-text-3)', letterSpacing: '.05em' }}>CHAPTER</span>
                  <span style={{ font: '700 14px/1 var(--mx-display)' }}>96 <span style={{ color: 'var(--mx-text-3)', font: '500 11px/1 ui-monospace,monospace' }}>/ 142</span></span>
                </div>
                <Icon name="chevronD" size={13}/>
              </button>
              <button style={{ flex: '0 0 auto', padding: '10px 12px', background: 'var(--mx-accent)', border: 'none', color: '#fff', borderRadius: 10, font: '600 11.5px/1 var(--mx-display)', display: 'inline-flex', alignItems: 'center', gap: 5 }}>97<Icon name="chevronR" size={13}/></button>
            </div>
          </div>
        </div>
      </Phone>
    </div>
  );
}

// ── Frame: End of chapter with sponsored slot + rewarded offer ────
// The seam stays scrollable, so seamless-continue survives. The ad is a
// bounded card inside it, not an interstitial across it.
function ReaderEndAdMobile({ tweaks }) {
  // Authored so the seam is visible on load — no programmatic scroll needed.
  return (
    <div style={themeVars(tweaks)}>
      <Phone>
        <div style={{ flex: 1, overflowY: 'auto', background: '#000' }}>
          <CoverPlaceholder title="Page 38" label="pg_038.webp" ratio="auto" style={{ borderRadius: 0, height: 150, aspectRatio: 'auto' }}/>

          <div style={{ background: 'var(--mx-bg)', padding: '22px 16px 26px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ font: '600 10px/1 ui-monospace,monospace', letterSpacing: '.16em', color: 'var(--mx-text-4)' }}>END OF CHAPTER 96</div>
              <div style={{ font: '700 20px/1.2 var(--mx-display)', letterSpacing: '-.02em', marginTop: 9 }}>A Wound that Hums</div>
            </div>

            {/* rewarded video — opt-in, the best-paying slot and the least resented */}
            <div style={{
              marginTop: 16, padding: 12, borderRadius: 11,
              background: 'var(--mx-accent-soft)', border: '1px solid var(--mx-accent)',
              display: 'flex', alignItems: 'center', gap: 11,
            }}>
              <div style={{ width: 34, height: 34, borderRadius: 999, background: 'var(--mx-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#fff' }}>
                <Icon name="play" size={14}/>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ font: '600 12.5px/1.25 var(--mx-display)' }}>Read Ch. 97 early</div>
                <div style={{ font: '500 10.5px/1.3 var(--mx-body)', color: 'var(--mx-text-2)', marginTop: 3 }}>Watch a 30s ad · or free for Premium</div>
              </div>
              <Icon name="chevronR" size={15}/>
            </div>

            {/* sponsored card — natural break, bounded, scroll-past */}
            <div style={{ marginTop: 15 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <AdLabel>At chapter break</AdLabel>
                <RemoveAdsLink compact/>
              </div>
              <div style={{
                borderRadius: 10, border: '1px dashed var(--mx-border-strong)', background: 'var(--mx-surface)',
                height: 150, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 7,
              }}>
                <span style={{ font: '600 11px/1 ui-monospace,monospace', color: 'var(--mx-text-3)', letterSpacing: '.06em' }}>300 × 250</span>
                <span style={{ font: '500 10px/1 var(--mx-body)', color: 'var(--mx-text-4)' }}>highest-value slot · attention is free here</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, marginTop: 20 }}>
              <div style={{ width: 52, height: 52, borderRadius: 999, border: '3px solid var(--mx-surface-3)', borderTopColor: 'var(--mx-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--mx-text-3)' }}>
                <Icon name="chevronD" size={18} strokeWidth={2.2}/>
              </div>
              <div style={{ font: '600 12px/1 var(--mx-body)', color: 'var(--mx-text-2)' }}>Keep scrolling for Chapter 97</div>
            </div>
          </div>

          <div style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10, background: 'var(--mx-surface)', borderTop: '1px solid var(--mx-border-strong)', borderBottom: '1px solid var(--mx-border)' }}>
            <span style={{ font: '700 11px/1 ui-monospace,monospace', color: 'var(--mx-accent)', letterSpacing: '.08em' }}>CH.97</span>
            <span style={{ font: '600 12px/1 var(--mx-display)', flex: 1 }}>The Bell at Dusk</span>
            <span style={{ font: '500 10px/1 ui-monospace,monospace', color: 'var(--mx-text-3)' }}>41 pg</span>
          </div>
          <CoverPlaceholder title="Page 1" label="pg_001.webp" ratio="auto" style={{ borderRadius: 0, height: 300, aspectRatio: 'auto' }}/>
        </div>
      </Phone>
    </div>
  );
}

// ── Frame: Premium paywall (mobile) ──────────────────────────────
function PremiumPaywallMobile({ tweaks }) {
  const [plan, setPlan] = React.useState('lifetime');
  const perks = [
    { i: 'x',        t: 'No ads anywhere',        s: 'Reader, browse, chapter breaks' },
    { i: 'trophy',   t: 'Levels & tier rings',    s: 'Earn XP for every chapter you read' },
    { i: 'user',     t: 'Avatar packs',           s: 'Premium art, or upload your own' },
    { i: 'download', t: 'Unlimited downloads',    s: '4 GB → unlimited offline storage' },
    { i: 'sparkle',  t: 'Early chapters',         s: 'No ad-watching required' },
  ];
  return (
    <div style={themeVars(tweaks)}>
      <Phone>
        <RingKeyframes/>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <div style={{ padding: '16px 16px 0', display: 'flex', justifyContent: 'flex-end' }}>
            <button style={{ background: 'var(--mx-surface-2)', border: 'none', color: 'var(--mx-text-3)', width: 30, height: 30, borderRadius: 999, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Icon name="x" size={15}/></button>
          </div>

          <div style={{ padding: '10px 20px 22px', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
              <Avatar size={70} label="HM" tier={tierFor(47)} lv={47}/>
            </div>
            <div style={{ font: '700 24px/1.15 var(--mx-display)', letterSpacing: '-.03em', textWrap: 'balance' }}>MangaX Premium</div>
            <div style={{ font: '500 12.5px/1.5 var(--mx-body)', color: 'var(--mx-text-2)', marginTop: 9 }}>Drop the ads. Start earning levels.</div>
          </div>

          <div style={{ padding: '0 16px' }}>
            {[
              { id: 'lifetime', price: '$15', unit: 'once', title: 'Lifetime', note: 'Pay once, yours forever', tag: 'BEST VALUE' },
              { id: 'monthly',  price: '$1',  unit: '/mo',  title: 'Monthly',  note: 'Cancel anytime' },
            ].map(p => {
              const on = plan === p.id;
              return (
                <div key={p.id} onClick={() => setPlan(p.id)} style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '14px 14px', marginBottom: 9,
                  borderRadius: 12, cursor: 'pointer',
                  border: '1.5px solid ' + (on ? 'var(--mx-accent)' : 'var(--mx-border)'),
                  background: on ? 'var(--mx-accent-soft)' : 'var(--mx-surface)',
                }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: 999, flexShrink: 0,
                    border: '2px solid ' + (on ? 'var(--mx-accent)' : 'var(--mx-border-strong)'),
                    background: on ? 'var(--mx-accent)' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
                  }}>{on && <Icon name="check" size={11} strokeWidth={3}/>}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                      <span style={{ font: '600 14px/1 var(--mx-display)' }}>{p.title}</span>
                      {p.tag && <span style={{ font: '700 8.5px/1 ui-monospace,monospace', letterSpacing: '.1em', color: 'var(--mx-accent)', border: '1px solid var(--mx-accent)', padding: '3px 4px', borderRadius: 3 }}>{p.tag}</span>}
                    </div>
                    <div style={{ font: '500 11px/1 var(--mx-body)', color: 'var(--mx-text-3)', marginTop: 5 }}>{p.note}</div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <span style={{ font: '700 19px/1 var(--mx-display)', letterSpacing: '-.02em' }}>{p.price}</span>
                    <span style={{ font: '500 11px/1 var(--mx-body)', color: 'var(--mx-text-3)', marginLeft: 2 }}>{p.unit}</span>
                  </div>
                </div>
              );
            })}
            <div style={{ font: '500 10.5px/1.4 var(--mx-body)', color: 'var(--mx-text-4)', textAlign: 'center', padding: '4px 10px 0' }}>
              Lifetime pays for itself in 15 months.
            </div>
          </div>

          <div style={{ padding: '20px 16px 6px' }}>
            {perks.map(p => (
              <div key={p.t} style={{ display: 'flex', gap: 11, padding: '10px 0', alignItems: 'flex-start' }}>
                <span style={{ color: 'var(--mx-accent)', flexShrink: 0, marginTop: 1 }}><Icon name={p.i} size={15}/></span>
                <div>
                  <div style={{ font: '600 13px/1.25 var(--mx-body)' }}>{p.t}</div>
                  <div style={{ font: '400 11px/1.35 var(--mx-body)', color: 'var(--mx-text-3)', marginTop: 3 }}>{p.s}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ padding: '10px 16px 26px' }}>
            <button style={{ width: '100%', padding: '14px', background: 'var(--mx-accent)', border: 'none', color: '#fff', borderRadius: 11, font: '700 15px/1 var(--mx-display)', cursor: 'pointer' }}>
              {plan === 'lifetime' ? 'Buy Lifetime · $15' : 'Subscribe · $1/mo'}
            </button>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 4 }}>
              {['Restore purchase', 'Terms'].map(x => (
                <button key={x} style={{
                  background: 'none', border: 'none', color: 'var(--mx-text-3)',
                  font: '500 12px/1 var(--mx-body)', cursor: 'pointer',
                  padding: '13px 12px', minHeight: 44,
                }}>{x}</button>
              ))}
            </div>
          </div>
        </div>
      </Phone>
    </div>
  );
}

// ── Frame: Profile — free vs premium ─────────────────────────────
function ProfilePremiumMobile({ tweaks, premium = true }) {
  const lv = 47, xp = 6240, need = 7020;
  const tier = tierFor(lv), next = nextTier(lv);
  const pct = Math.round(xp / need * 100);

  return (
    <div style={themeVars(tweaks)}>
      <Phone>
        <RingKeyframes/>
        <MobileTopBar title="Profile" rightIcons={['settings']}/>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {/* identity */}
          <div style={{ padding: '20px 16px 18px', display: 'flex', gap: 14, alignItems: 'center', borderBottom: '1px solid var(--mx-border)' }}>
            <div style={{ position: 'relative' }}>
              <Avatar size={68} label="HM" tier={tier} premium={premium} lv={premium ? lv : null}/>
              <button style={{
                position: 'absolute', bottom: -2, left: -2, width: 22, height: 22, borderRadius: 999,
                background: 'var(--mx-surface-2)', border: '1.5px solid var(--mx-bg)', color: 'var(--mx-text-2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0,
              }}><Icon name="camera" size={11}/></button>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ font: '700 18px/1.1 var(--mx-display)', letterSpacing: '-.02em' }}>Hana Mori</div>
              {premium ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
                  <span style={{ color: tier.ring.colors[0] }}><Icon name="crown" size={12}/></span>
                  <span style={{ font: '600 11.5px/1 var(--mx-body)', color: tier.ring.colors[0] }}>{tier.name}</span>
                  <span style={{ font: '500 11px/1 ui-monospace,monospace', color: 'var(--mx-text-4)' }}>· Lv {lv}</span>
                </div>
              ) : (
                <div style={{ font: '500 11.5px/1 var(--mx-body)', color: 'var(--mx-text-3)', marginTop: 6 }}>Free account</div>
              )}
            </div>
          </div>

          {/* XP / level — the premium-only progression */}
          {premium ? (
            <div style={{ padding: '16px 16px 18px', borderBottom: '1px solid var(--mx-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
                <span style={{ font: '600 11px/1 var(--mx-display)', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--mx-text-3)' }}>Level {lv}</span>
                <span style={{ font: '600 11px/1 ui-monospace,monospace', color: 'var(--mx-text-3)' }}>{xp.toLocaleString()} / {need.toLocaleString()} XP</span>
              </div>
              <div style={{ height: 7, borderRadius: 4, background: 'var(--mx-surface-3)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${pct}%`, background: 'var(--mx-accent)', borderRadius: 4 }}/>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 9, font: '500 10.5px/1 var(--mx-body)', color: 'var(--mx-text-4)' }}>
                <span>+12 XP per chapter</span>
                <span>65 chapters to Lv 50</span>
              </div>
              {next && (
                <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 11, padding: '11px 12px', background: 'var(--mx-surface)', border: '1px solid var(--mx-border)', borderRadius: 10 }}>
                  <Avatar size={38} label="HM" tier={next}/>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ font: '500 10px/1 ui-monospace,monospace', letterSpacing: '.08em', color: 'var(--mx-text-4)' }}>NEXT AT LV {next.lv}</div>
                    <div style={{ font: '600 13px/1.2 var(--mx-display)', marginTop: 4, color: next.ring.colors[0] }}>{next.name}</div>
                  </div>
                  <Icon name="chevronR" size={15}/>
                </div>
              )}
            </div>
          ) : (
            <div style={{ padding: '16px 16px 18px', borderBottom: '1px solid var(--mx-border)' }}>
              <div style={{ padding: 14, borderRadius: 11, border: '1px solid var(--mx-accent)', background: 'var(--mx-accent-soft)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                  <span style={{ color: 'var(--mx-accent)' }}><Icon name="lock" size={14}/></span>
                  <span style={{ font: '600 13px/1 var(--mx-display)', flex: 1 }}>Levels are Premium</span>
                </div>
                <div style={{ font: '400 11.5px/1.5 var(--mx-body)', color: 'var(--mx-text-2)', marginTop: 9 }}>
                  You've read <strong style={{ color: 'var(--mx-text)' }}>520 chapters</strong> — that's Lv 47 waiting for you. Go Premium to claim it, drop the ads, and unlock tier rings.
                </div>
                <button style={{ width: '100%', marginTop: 13, padding: '11px', background: 'var(--mx-accent)', border: 'none', color: '#fff', borderRadius: 9, font: '600 13px/1 var(--mx-display)', cursor: 'pointer' }}>Go Premium · from $1/mo</button>
              </div>
            </div>
          )}

          {/* stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', padding: '18px 16px', borderBottom: '1px solid var(--mx-border)' }}>
            {[['520', 'Chapters'], ['38', 'Series'], ['61', 'Day streak']].map(([v, l]) => (
              <div key={l} style={{ textAlign: 'center' }}>
                <div style={{ font: '700 19px/1 var(--mx-display)' }}>{v}</div>
                <div style={{ font: '500 10.5px/1 var(--mx-body)', color: 'var(--mx-text-3)', marginTop: 6 }}>{l}</div>
              </div>
            ))}
          </div>

          {/* rows */}
          {[
            { i: 'user', l: 'Change avatar', s: premium ? 'All packs unlocked' : 'Starter pack only' },
            { i: 'trophy', l: 'Level ladder', s: `${TIERS.length} tiers · Lv 1 to 100` },
            { i: 'download', l: 'Downloads', s: premium ? 'Unlimited' : '0.63 of 4 GB' },
            premium
              ? { i: 'crown', l: 'Premium · Lifetime', s: 'Purchased Mar 2026', accent: true }
              : { i: 'x', l: 'Remove ads', s: '$15 once or $1/mo', accent: true },
          ].map(r => (
            <div key={r.l} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderBottom: '1px solid var(--mx-border)', cursor: 'pointer' }}>
              <span style={{ color: r.accent ? 'var(--mx-accent)' : 'var(--mx-text-3)', flexShrink: 0 }}><Icon name={r.i} size={16}/></span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ font: '500 13.5px/1.2 var(--mx-body)', color: r.accent ? 'var(--mx-accent)' : 'var(--mx-text)' }}>{r.l}</div>
                <div style={{ font: '400 11px/1 var(--mx-body)', color: 'var(--mx-text-3)', marginTop: 4 }}>{r.s}</div>
              </div>
              <span style={{ color: 'var(--mx-text-4)' }}><Icon name="chevronR" size={15}/></span>
            </div>
          ))}
          <div style={{ height: 16 }}/>
        </div>
        <MobileTabBar active="library"/>
      </Phone>
    </div>
  );
}

// ── Frame: Avatar picker (mobile) ────────────────────────────────
function AvatarPickerMobile({ tweaks }) {
  const [sel, setSel] = React.useState('s2');
  const tier = tierFor(47);
  const all = AVATAR_PACKS.flatMap(p => p.items);
  const selected = all.find(a => a.id === sel);

  return (
    <div style={themeVars(tweaks)}>
      <Phone>
        <RingKeyframes/>
        <MobileTopBar title="Choose avatar" leftIcon="chevronL"/>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {/* live preview with the earned ring */}
          <div style={{ padding: '20px 16px 18px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 11, borderBottom: '1px solid var(--mx-border)' }}>
            <Avatar size={84} file={selected?.file} tier={tier} lv={47}/>
            <div style={{ textAlign: 'center' }}>
              <div style={{ font: '600 13px/1 var(--mx-display)' }}>{selected?.label}</div>
              <div style={{ font: '500 10.5px/1 var(--mx-body)', color: tier.ring.colors[0], marginTop: 6 }}>{tier.name} ring · Lv 47</div>
            </div>
          </div>

          {/* upload own */}
          <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--mx-border)' }}>
            <button style={{
              width: '100%', padding: '13px', borderRadius: 10, cursor: 'pointer',
              border: '1px dashed var(--mx-border-strong)', background: 'var(--mx-surface)',
              color: 'var(--mx-text-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              font: '600 12.5px/1 var(--mx-body)',
            }}><Icon name="upload" size={14}/>Upload your own</button>
            <div style={{ font: '400 10px/1.4 var(--mx-body)', color: 'var(--mx-text-4)', textAlign: 'center', marginTop: 8 }}>
              Square, min 256px · JPG, PNG or WebP · Premium only
            </div>
          </div>

          {AVATAR_PACKS.map(pack => (
            <div key={pack.id} style={{ padding: '16px 16px 18px', borderBottom: '1px solid var(--mx-border)' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 10, marginBottom: 12 }}>
                <span style={{ font: '600 11px/1 var(--mx-display)', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--mx-text-3)' }}>{pack.name}</span>
                <span style={{ font: '500 10px/1 var(--mx-body)', color: pack.locked ? 'var(--mx-accent)' : 'var(--mx-text-4)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  {pack.locked && <Icon name="lock" size={10}/>}{pack.note}
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
                {pack.items.map(a => {
                  const on = a.id === sel;
                  return (
                    <button key={a.id} onClick={() => !pack.locked && setSel(a.id)} style={{
                      background: 'none', border: 'none', padding: 0, cursor: pack.locked ? 'default' : 'pointer',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                      opacity: pack.locked ? .4 : 1,
                    }}>
                      <div style={{
                        position: 'relative', width: '100%', aspectRatio: '1', borderRadius: '50%', overflow: 'hidden',
                        boxShadow: on ? '0 0 0 2px var(--mx-accent)' : 'inset 0 0 0 1px var(--mx-border)',
                      }}>
                        <CoverPlaceholder title={a.file} label="" style={{ width: '100%', height: '100%', borderRadius: 0 }}/>
                        {pack.locked && (
                          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--mx-text-2)' }}>
                            <Icon name="lock" size={13}/>
                          </div>
                        )}
                        {on && (
                          <div style={{ position: 'absolute', bottom: 0, right: 0, width: 18, height: 18, borderRadius: 999, background: 'var(--mx-accent)', border: '1.5px solid var(--mx-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                            <Icon name="check" size={9} strokeWidth={3}/>
                          </div>
                        )}
                      </div>
                      <span style={{ font: `${on ? 600 : 500} 9.5px/1 var(--mx-body)`, color: on ? 'var(--mx-accent)' : 'var(--mx-text-3)' }}>{a.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
          <div style={{ padding: '16px 16px 26px' }}>
            <button style={{ width: '100%', padding: '13px', background: 'var(--mx-accent)', border: 'none', color: '#fff', borderRadius: 10, font: '600 14px/1 var(--mx-display)', cursor: 'pointer' }}>Save avatar</button>
          </div>
        </div>
      </Phone>
    </div>
  );
}

// ── Frame: Level ladder (mobile) ─────────────────────────────────
function LevelLadderMobile({ tweaks }) {
  const lv = 47;
  return (
    <div style={themeVars(tweaks)}>
      <Phone>
        <RingKeyframes/>
        <MobileTopBar title="Level ladder" leftIcon="chevronL"/>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <div style={{ padding: '14px 16px 16px', borderBottom: '1px solid var(--mx-border)' }}>
            <div style={{ font: '500 11.5px/1.5 var(--mx-body)', color: 'var(--mx-text-2)' }}>
              A new tier every 10 levels — each one changes your ring and your title. XP comes from chapters read, +12 each.
            </div>
          </div>
          {TIERS.map(t => {
            const reached = lv >= t.lv;
            const current = tierFor(lv).lv === t.lv;
            return (
              <div key={t.lv} style={{
                display: 'flex', alignItems: 'center', gap: 13, padding: '13px 16px',
                borderBottom: '1px solid var(--mx-border)',
                background: current ? 'var(--mx-accent-soft)' : 'transparent',
                opacity: reached ? 1 : .5,
              }}>
                <Avatar size={44} label="" tier={t}/>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <span style={{ font: '600 13.5px/1.2 var(--mx-display)', color: reached ? t.ring.colors[0] : 'var(--mx-text-2)' }}>{t.name}</span>
                    {current && <span style={{ font: '700 8.5px/1 ui-monospace,monospace', letterSpacing: '.1em', color: 'var(--mx-accent)' }}>CURRENT</span>}
                  </div>
                  <div style={{ font: '500 10.5px/1 ui-monospace,monospace', color: 'var(--mx-text-4)', marginTop: 5, letterSpacing: '.04em' }}>
                    LV {t.lv}–{t.lv === 100 ? '∞' : t.lv + 9} · {(t.lv * 150).toLocaleString()} XP
                  </div>
                </div>
                <span style={{ color: reached ? 'var(--mx-accent)' : 'var(--mx-text-4)', flexShrink: 0 }}>
                  <Icon name={reached ? 'check' : 'lock'} size={14}/>
                </span>
              </div>
            );
          })}
          <div style={{ height: 20 }}/>
        </div>
      </Phone>
    </div>
  );
}

Object.assign(window, {
  TIERS, AVATAR_PACKS, tierFor, nextTier, RingKeyframes, Avatar,
  AdLabel, RemoveAdsLink, InlineReaderAd,
  ReaderAdCadenceMobile, ReaderEndAdMobile, PremiumPaywallMobile,
  ProfilePremiumMobile, AvatarPickerMobile, LevelLadderMobile,
});
