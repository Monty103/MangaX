// Desktop frames for MangaX — 1440 wide
// Top nav + left rail + content. Designed as static screens
// (visual prototype, not a running SPA). Each frame is exported and
// rendered inside a DCArtboard.

// ── Top nav ───────────────────────────────────────────────────────
function DesktopNav({ active = 'home', search = '' }) {
  const items = [
    { id: 'home', label: 'Home' },
    { id: 'browse', label: 'Browse' },
    { id: 'library', label: 'Library' },
    { id: 'updates', label: 'Updates' },
  ];
  return (
    <div style={{
      height: 60, padding: '0 32px', display: 'flex', alignItems: 'center',
      gap: 32, borderBottom: '1px solid var(--mx-border)',
      background: 'rgba(10,10,12,.85)', backdropFilter: 'blur(20px)',
      position: 'sticky', top: 0, zIndex: 50,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, font: '700 19px/1 var(--mx-display)', letterSpacing: '-.02em' }}>
        <div style={{ width: 22, height: 22, background: 'var(--mx-accent)', borderRadius: 4, position: 'relative' }}>
          <div style={{ position: 'absolute', inset: '4px 4px 4px 9px', background: '#0a0a0c', borderRadius: 1 }}/>
        </div>
        MangaX
      </div>
      <nav style={{ display: 'flex', gap: 4 }}>
        {items.map(i => (
          <a key={i.id} style={{
            padding: '8px 14px', borderRadius: 8, font: '500 13.5px/1 var(--mx-body)',
            color: active === i.id ? 'var(--mx-text)' : 'var(--mx-text-3)',
            background: active === i.id ? 'var(--mx-surface-2)' : 'transparent',
            cursor: 'pointer',
          }}>{i.label}</a>
        ))}
      </nav>
      <div style={{ flex: 1, maxWidth: 480, position: 'relative' }}>
        <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--mx-text-4)' }}>
          <Icon name="search" size={15}/>
        </div>
        <div style={{
          height: 36, padding: '0 56px 0 36px', borderRadius: 8,
          background: 'var(--mx-surface)', border: '1px solid var(--mx-border)',
          display: 'flex', alignItems: 'center',
          font: '400 13px/1 var(--mx-body)', color: search ? 'var(--mx-text)' : 'var(--mx-text-4)',
        }}>{search || 'Search titles, authors, tags…'}</div>
        <div style={{
          position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
          font: '500 10px/1 ui-monospace, monospace', color: 'var(--mx-text-4)',
          padding: '3px 6px', border: '1px solid var(--mx-border)', borderRadius: 4,
        }}>⌘K</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, color: 'var(--mx-text-3)' }}>
        <Icon name="bell" size={18}/>
        <Icon name="bookmark" size={18}/>
        <Avatar name="HM" size={30}/>
      </div>
    </div>
  );
}

// ── Hero (home) ───────────────────────────────────────────────────
function Hero() {
  const s = SERIES[0];
  return (
    <div style={{ position: 'relative', height: 320, borderRadius: 14, overflow: 'hidden', marginBottom: 28 }}>
      <CoverPlaceholder title={s.title} label="hero_art_2400x900.jpg" ratio="3.4 / 1" style={{ borderRadius: 0, height: '100%', aspectRatio: 'auto' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(10,10,12,.95) 0%, rgba(10,10,12,.6) 45%, transparent 75%)' }}/>
      <div style={{ position: 'absolute', left: 36, top: 36, bottom: 36, maxWidth: 460, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: 14 }}>
        <div style={{ font: '600 10px/1 var(--mx-display)', letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--mx-accent)' }}>Featured · New chapter</div>
        <div style={{ font: '700 38px/1 var(--mx-display)', letterSpacing: '-.025em' }}>{s.title}</div>
        <div style={{ display: 'flex', gap: 14, alignItems: 'center', color: 'var(--mx-text-2)', font: '500 12px/1 var(--mx-body)' }}>
          <span>{s.author}</span>
          <span style={{ width: 3, height: 3, background: 'var(--mx-text-4)', borderRadius: 2 }}/>
          <Stars value={s.rating} count={s.ratings}/>
          <span style={{ width: 3, height: 3, background: 'var(--mx-text-4)', borderRadius: 2 }}/>
          <span>Ch. {s.chapters}</span>
        </div>
        <div style={{ font: '400 13.5px/1.55 var(--mx-body)', color: 'var(--mx-text-2)', maxWidth: 440 }}>
          A blacksmith's daughter in a city of clockwork courts inherits a lantern that summons the dead — and the debts that come with them.
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
          <button style={{
            padding: '11px 18px', font: '600 13px/1 var(--mx-display)',
            background: 'var(--mx-accent)', color: '#fff',
            border: 'none', borderRadius: 8, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 8,
          }}><Icon name="play" size={13}/> Read Chapter 142</button>
          <button style={{
            padding: '11px 14px', font: '500 13px/1 var(--mx-display)',
            background: 'rgba(255,255,255,.08)', color: 'var(--mx-text)',
            border: '1px solid var(--mx-border)', borderRadius: 8, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 8,
          }}><Icon name="bookmark" size={13}/> Add to library</button>
        </div>
      </div>
    </div>
  );
}

// ── Continue reading row ──────────────────────────────────────────
function ContinueRow() {
  const items = SERIES.slice(0, 5).map((s, i) => ({ ...s, progress: [0.3, 0.7, 0.5, 0.9, 0.1][i], lastChapter: [142, 86, 64, 38, 211][i] - [1, 2, 1, 1, 3][i] }));
  return (
    <Section title="Continue reading" caption="Picks up where you left off">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16 }}>
        {items.map(s => (
          <div key={s.id} style={{ background: 'var(--mx-surface)', borderRadius: 10, overflow: 'hidden', border: '1px solid var(--mx-border)' }}>
            <div style={{ display: 'flex', gap: 12, padding: 12 }}>
              <CoverPlaceholder title={s.title} label="" style={{ width: 60, height: 84, flexShrink: 0 }}/>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ font: '600 13px/1.25 var(--mx-display)', letterSpacing: '-.01em', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', textOverflow: 'ellipsis' }}>{s.title}</div>
                <div style={{ font: '500 11px/1 var(--mx-body)', color: 'var(--mx-text-3)', marginTop: 4 }}>Ch. {s.lastChapter} of {s.chapters}</div>
                <div style={{ height: 3, background: 'var(--mx-surface-3)', borderRadius: 2, marginTop: 12, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${s.progress * 100}%`, background: 'var(--mx-accent)' }}/>
                </div>
                <div style={{ font: '500 10px/1 ui-monospace,monospace', color: 'var(--mx-text-4)', marginTop: 6 }}>{Math.round(s.progress * 100)}%</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

function Section({ title, caption, action, children }) {
  return (
    <section style={{ marginBottom: 36 }}>
      <header style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
        <div>
          <div style={{ font: '700 20px/1 var(--mx-display)', letterSpacing: '-.02em' }}>{title}</div>
          {caption && <div style={{ font: '400 12.5px/1 var(--mx-body)', color: 'var(--mx-text-3)', marginTop: 6 }}>{caption}</div>}
        </div>
        <a style={{ font: '500 12px/1 var(--mx-body)', color: 'var(--mx-text-2)', display: 'inline-flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
          {action || 'View all'} <Icon name="chevronR" size={12}/>
        </a>
      </header>
      {children}
    </section>
  );
}

// ── Cover grid ────────────────────────────────────────────────────
function CoverGrid({ items, cols = 6, density = 'regular', showRank = false }) {
  const gap = density === 'compact' ? 12 : density === 'comfy' ? 22 : 16;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap }}>
      {items.map((s, i) => (
        <div key={`${s.id}-${i}`} style={{ minWidth: 0 }}>
          <div style={{ position: 'relative' }}>
            <CoverPlaceholder title={s.title} label="" badge={s.badge}/>
            {showRank && (
              <div style={{
                position: 'absolute', left: -6, top: -6, width: 30, height: 30, borderRadius: '50%',
                background: 'var(--mx-bg)', border: '2px solid var(--mx-accent)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                font: '700 13px/1 var(--mx-display)', color: 'var(--mx-accent)',
              }}>{i + 1}</div>
            )}
          </div>
          <div style={{ font: '600 13px/1.3 var(--mx-display)', letterSpacing: '-.01em', marginTop: 8, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{s.title}</div>
          <div style={{ display: 'flex', gap: 8, marginTop: 4, font: '500 11px/1 var(--mx-body)', color: 'var(--mx-text-3)' }}>
            <Stars value={s.rating} size={10} showValue={true}/>
            <span style={{ width: 3, height: 3, background: 'var(--mx-text-4)', borderRadius: 2, alignSelf: 'center' }}/>
            <span>{s.tags[0]}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Frame: Home ───────────────────────────────────────────────────
function HomeDesktop({ tweaks }) {
  const trending = [
    { ...SERIES[4], badge: 'Hot' }, SERIES[6], { ...SERIES[2], badge: 'New' },
    SERIES[8], SERIES[1], SERIES[10],
  ];
  return (
    <div style={{ ...themeVars(tweaks), minHeight: 1080 }}>
      <DesktopNav active="home"/>
      <div style={{ padding: '28px 32px 60px', maxWidth: 1376, margin: '0 auto' }}>
        <Hero/>
        <ContinueRow/>
        <Section title="Top this week" caption="Most read across all readers" action="See chart">
          <CoverGrid items={trending.map((s,i) => ({ ...s, badge: i === 0 ? 'Hot' : i === 2 ? 'New' : null }))} cols={6} showRank/>
        </Section>
        <LatestUpdatedSection/>
        <Section title="Because you read Saltwater Atlas" caption="Slow-burn drama, salt-wind aesthetic">
          <CoverGrid items={[SERIES[2], SERIES[5], SERIES[7], SERIES[9], SERIES[11], SERIES[3]]} cols={6}/>
        </Section>
      </div>
    </div>
  );
}

// ── Frame: Browse ─────────────────────────────────────────────────
function BrowseDesktop({ tweaks }) {
  const density = tweaks.density;
  const cols = density === 'compact' ? 8 : density === 'comfy' ? 5 : 6;
  return (
    <div style={{ ...themeVars(tweaks), minHeight: 1080 }}>
      <DesktopNav active="browse"/>
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 32, padding: '28px 32px 60px', maxWidth: 1376, margin: '0 auto' }}>
        {/* filter sidebar */}
        <aside style={{ position: 'sticky', top: 88, alignSelf: 'start', display: 'flex', flexDirection: 'column', gap: 22 }}>
          <FilterGroup title="Genre" badge="3 selected">
            {GENRES.slice(0, 14).map((g, i) => (
              <Tag key={g} active={[0, 4, 9].includes(i)} count={[1820, 1240, 980, 760, 1500, 410, 620, 1130, 880, 1340, 230, 540, 470, 360][i]}>{g}</Tag>
            ))}
            <a style={{ font: '500 11.5px/1 var(--mx-body)', color: 'var(--mx-text-3)', cursor: 'pointer' }}>+ 12 more</a>
          </FilterGroup>
          <FilterGroup title="Demographic">
            {DEMOS.map((d, i) => <Tag key={d} active={i === 1}>{d}</Tag>)}
          </FilterGroup>
          <FilterGroup title="Status">
            {STATUSES.map((s, i) => <Tag key={s} active={i === 0}>{s}</Tag>)}
          </FilterGroup>
          <FilterGroup title="Year">
            <RangeSlider min={2000} max={2026} from={2018} to={2026}/>
          </FilterGroup>
          <FilterGroup title="Min rating">
            <RangeSlider min={0} max={5} from={4.2} to={5} step={.1} unit="★"/>
          </FilterGroup>
          <FilterGroup title="Length">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { l: 'Short (≤ 30 ch.)', a: false },
                { l: 'Medium (31–100)', a: true },
                { l: 'Long (101+)', a: false },
              ].map((o, i) => (
                <label key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, font: '500 12.5px/1 var(--mx-body)', color: 'var(--mx-text-2)' }}>
                  <span style={{
                    width: 16, height: 16, borderRadius: 4, border: '1px solid ' + (o.a ? 'var(--mx-accent)' : 'var(--mx-border-strong)'),
                    background: o.a ? 'var(--mx-accent)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
                  }}>{o.a && <Icon name="check" size={11} strokeWidth={2.4}/>}</span>
                  {o.l}
                </label>
              ))}
            </div>
          </FilterGroup>
          <FilterGroup title="Mature content">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', font: '500 12.5px/1 var(--mx-body)', color: 'var(--mx-text-2)' }}>
              Show 18+
              <span style={{ width: 30, height: 18, background: 'var(--mx-surface-3)', borderRadius: 9, padding: 2 }}>
                <span style={{ display: 'block', width: 14, height: 14, background: '#fff', borderRadius: '50%' }}/>
              </span>
            </div>
          </FilterGroup>
        </aside>

        {/* results */}
        <main style={{ minWidth: 0 }}>
          <div style={{ marginBottom: 18 }}>
            <div style={{ font: '700 28px/1 var(--mx-display)', letterSpacing: '-.025em' }}>Browse</div>
            <div style={{ font: '400 13px/1 var(--mx-body)', color: 'var(--mx-text-3)', marginTop: 8 }}>4,238 results · Action, Sci-Fi, Fantasy · Seinen · Ongoing</div>
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 18, alignItems: 'center' }}>
            <Tag active>Action ✕</Tag>
            <Tag active>Sci-Fi ✕</Tag>
            <Tag active>Fantasy ✕</Tag>
            <Tag active>Seinen ✕</Tag>
            <Tag active>Ongoing ✕</Tag>
            <a style={{ font: '500 11.5px/1 var(--mx-body)', color: 'var(--mx-text-3)', cursor: 'pointer', marginLeft: 6 }}>Clear all</a>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ font: '500 11.5px/1 var(--mx-body)', color: 'var(--mx-text-3)' }}>Sort</span>
              <button style={{
                font: '500 12px/1 var(--mx-body)', color: 'var(--mx-text)',
                background: 'var(--mx-surface)', border: '1px solid var(--mx-border)',
                padding: '7px 10px', borderRadius: 7, display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer',
              }}>Most popular <Icon name="chevronD" size={11}/></button>
              <span style={{ width: 1, height: 18, background: 'var(--mx-border)', margin: '0 4px' }}/>
              <SegToggle options={['Grid', 'List']} active="Grid"/>
              <SegToggle options={['Compact', 'Regular', 'Comfy']} active={density === 'compact' ? 'Compact' : density === 'comfy' ? 'Comfy' : 'Regular'}/>
            </div>
          </div>
          <CoverGrid items={[...SERIES, ...SERIES.slice(0, 6)]} cols={cols} density={density}/>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 28 }}>
            <button style={{
              padding: '11px 22px', font: '500 13px/1 var(--mx-display)',
              background: 'var(--mx-surface)', color: 'var(--mx-text)',
              border: '1px solid var(--mx-border)', borderRadius: 8, cursor: 'pointer',
            }}>Load 24 more</button>
          </div>
        </main>
      </div>
    </div>
  );
}

function FilterGroup({ title, badge, children }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ font: '600 11px/1 var(--mx-display)', letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--mx-text-3)' }}>{title}</div>
        {badge && <div style={{ font: '500 10px/1 var(--mx-body)', color: 'var(--mx-accent)' }}>{badge}</div>}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>{children}</div>
    </div>
  );
}

function RangeSlider({ min, max, from, to, step = 1, unit = '' }) {
  const pctA = ((from - min) / (max - min)) * 100;
  const pctB = ((to - min) / (max - min)) * 100;
  return (
    <div style={{ width: '100%' }}>
      <div style={{ position: 'relative', height: 18 }}>
        <div style={{ position: 'absolute', top: 8, left: 0, right: 0, height: 3, background: 'var(--mx-surface-3)', borderRadius: 2 }}/>
        <div style={{ position: 'absolute', top: 8, left: `${pctA}%`, width: `${pctB - pctA}%`, height: 3, background: 'var(--mx-accent)', borderRadius: 2 }}/>
        <div style={{ position: 'absolute', top: 4, left: `calc(${pctA}% - 6px)`, width: 12, height: 12, borderRadius: '50%', background: '#fff', border: '2px solid var(--mx-accent)' }}/>
        <div style={{ position: 'absolute', top: 4, left: `calc(${pctB}% - 6px)`, width: 12, height: 12, borderRadius: '50%', background: '#fff', border: '2px solid var(--mx-accent)' }}/>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', font: '500 11px/1 ui-monospace,monospace', color: 'var(--mx-text-3)', marginTop: 4 }}>
        <span>{from}{unit}</span>
        <span>{to}{unit}</span>
      </div>
    </div>
  );
}

function SegToggle({ options, active }) {
  return (
    <div style={{ display: 'inline-flex', background: 'var(--mx-surface)', border: '1px solid var(--mx-border)', borderRadius: 7, padding: 2 }}>
      {options.map(o => (
        <button key={o} style={{
          padding: '5px 9px', font: '500 11.5px/1 var(--mx-body)',
          background: o === active ? 'var(--mx-surface-3)' : 'transparent',
          color: o === active ? 'var(--mx-text)' : 'var(--mx-text-3)',
          border: 'none', borderRadius: 5, cursor: 'pointer',
        }}>{o}</button>
      ))}
    </div>
  );
}

// ── Latest updated row (newest chapters drop first) ───────────────
function LatestUpdatedSection() {
  // Newest first. Mock recency labels + chapter numbers.
  const updates = [
    { s: SERIES[0],  ago: '2 min ago',  ch: 142, fresh: true,  isNew: true },
    { s: SERIES[3],  ago: '14 min ago', ch: 38,  fresh: true,  isNew: true },
    { s: SERIES[6],  ago: '48 min ago', ch: 67,  fresh: true },
    { s: SERIES[8],  ago: '2 h ago',    ch: 91,  fresh: false },
    { s: SERIES[2],  ago: '4 h ago',    ch: 64,  fresh: false },
    { s: SERIES[10], ago: '6 h ago',    ch: 23,  fresh: false },
    { s: SERIES[5],  ago: '9 h ago',    ch: 119, fresh: false },
    { s: SERIES[1],  ago: 'Yesterday',  ch: 87,  fresh: false },
    { s: SERIES[7],  ago: 'Yesterday',  ch: 44,  fresh: false },
    { s: SERIES[11], ago: '2 d ago',    ch: 12,  fresh: false },
    { s: SERIES[4],  ago: '2 d ago',    ch: 211, fresh: false },
    { s: SERIES[9],  ago: '3 d ago',    ch: 76,  fresh: false },
  ];
  return (
    <Section title="Latest updated" caption="Newest chapter drops, freshest first" action="See all updates">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 16 }}>
        {updates.map((u, i) => (
          <div key={u.s.id + '-' + i} style={{ minWidth: 0 }}>
            <div style={{ position: 'relative' }}>
              <CoverPlaceholder title={u.s.title} label=""/>
              {u.isNew && (
                <div style={{
                  position: 'absolute', top: 8, left: 8,
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  padding: '4px 7px', borderRadius: 4,
                  background: 'var(--mx-accent)', color: '#fff',
                  font: '700 9.5px/1 var(--mx-display)', letterSpacing: '.08em', textTransform: 'uppercase',
                }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#fff', boxShadow: '0 0 0 2px rgba(255,255,255,.35)' }}/>
                  New
                </div>
              )}
              <div style={{
                position: 'absolute', left: 0, right: 0, bottom: 0,
                padding: '18px 10px 8px',
                background: 'linear-gradient(180deg, transparent, rgba(10,10,12,.92))',
                font: '500 10.5px/1 ui-monospace, monospace',
                color: u.fresh ? 'var(--mx-accent)' : 'rgba(255,255,255,.85)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <span>Ch. {u.ch}</span>
                <span style={{ color: u.fresh ? 'var(--mx-accent)' : 'rgba(255,255,255,.6)' }}>{u.ago}</span>
              </div>
            </div>
            <div style={{ font: '600 13px/1.3 var(--mx-display)', letterSpacing: '-.01em', marginTop: 8, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.s.title}</div>
            <div style={{ display: 'flex', gap: 6, marginTop: 4, font: '500 11px/1 var(--mx-body)', color: 'var(--mx-text-3)', alignItems: 'center' }}>
              <span>{u.s.author}</span>
              <span style={{ width: 3, height: 3, background: 'var(--mx-text-4)', borderRadius: 2 }}/>
              <span>{u.s.tags[0]}</span>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

Object.assign(window, { DesktopNav, Hero, ContinueRow, Section, CoverGrid, HomeDesktop, BrowseDesktop, FilterGroup, RangeSlider, SegToggle, LatestUpdatedSection });
