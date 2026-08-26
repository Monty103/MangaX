// Mobile frames for MangaX — 390 wide, iPhone-class
// Single column. Bottom tab bar. Uses the same shared primitives.

// ── Mobile status bar ─────────────────────────────────────────────
function MobileStatus() {
  return (
    <div style={{
      height: 47, padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      font: '600 15px/1 var(--mx-display)', color: 'var(--mx-text)',
      flexShrink: 0,
    }}>
      <span style={{ fontVariantNumeric: 'tabular-nums' }}>9:41</span>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <Icon name="cellular" size={15} strokeWidth={1.4}/>
        <Icon name="wifi" size={15} strokeWidth={1.4}/>
        <span style={{ font: '600 11px/1 var(--mx-display)' }}>87</span>
        <div style={{ width: 24, height: 12, border: '1px solid var(--mx-text-2)', borderRadius: 3, padding: 1, position: 'relative' }}>
          <div style={{ width: '80%', height: '100%', background: 'var(--mx-text)', borderRadius: 1 }}/>
          <div style={{ position: 'absolute', right: -3, top: 3, width: 2, height: 4, background: 'var(--mx-text-2)', borderRadius: 1 }}/>
        </div>
      </div>
    </div>
  );
}

// ── Mobile top bar ────────────────────────────────────────────────
function MobileTopBar({ title, leftIcon, rightIcons = [], compact = false, transparent = false }) {
  return (
    <div style={{
      height: compact ? 44 : 52, padding: '0 16px',
      display: 'flex', alignItems: 'center', gap: 12,
      background: transparent ? 'transparent' : 'rgba(10,10,12,.92)',
      backdropFilter: 'blur(18px)',
      borderBottom: transparent ? 'none' : '1px solid var(--mx-border)',
      position: 'sticky', top: 47, zIndex: 50,
    }}>
      {leftIcon && <button style={{ background: 'transparent', border: 'none', color: 'var(--mx-text)', padding: 0, cursor: 'pointer' }}><Icon name={leftIcon} size={22}/></button>}
      <div style={{ flex: 1, font: `700 ${compact ? 16 : 18}px/1 var(--mx-display)`, letterSpacing: '-.02em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</div>
      <div style={{ display: 'flex', gap: 16, color: 'var(--mx-text)' }}>
        {rightIcons.map((i, idx) => <Icon key={idx} name={i} size={20}/>)}
      </div>
    </div>
  );
}

// ── Bottom tab bar ────────────────────────────────────────────────
function MobileTabBar({ active = 'home' }) {
  const tabs = [
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'browse', label: 'Browse', icon: 'grid' },
    { id: 'library', label: 'Library', icon: 'book' },
    { id: 'profile', label: 'You', icon: 'user' },
  ];
  return (
    <div style={{
      position: 'sticky', bottom: 0,
      height: 82, paddingBottom: 24, paddingTop: 6,
      display: 'flex', alignItems: 'flex-start', justifyContent: 'space-around',
      background: 'rgba(10,10,12,.94)', backdropFilter: 'blur(20px)',
      borderTop: '1px solid var(--mx-border)',
    }}>
      {tabs.map(t => (
        <button key={t.id} style={{
          background: 'transparent', border: 'none', cursor: 'pointer',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
          color: active === t.id ? 'var(--mx-accent)' : 'var(--mx-text-3)',
          padding: '6px 4px',
        }}>
          <Icon name={t.icon} size={22} strokeWidth={active === t.id ? 2 : 1.6}/>
          <span style={{ font: `${active === t.id ? 600 : 500} 10.5px/1 var(--mx-body)` }}>{t.label}</span>
        </button>
      ))}
    </div>
  );
}

// ── Phone shell ───────────────────────────────────────────────────
// `height` must match the artboard height so the inner flex:1 child gets a
// resolved scrollport. Without it the shell grows to content and nothing scrolls.
function Phone({ children, dark = true, height = 844 }) {
  return (
    <div className="mx-phone" style={{
      width: '100%', height, display: 'flex', flexDirection: 'column',
      background: dark ? 'var(--mx-bg)' : '#fff',
      color: 'var(--mx-text)', fontFamily: 'var(--mx-body)',
      overflow: 'hidden',
    }}>
      <style>{'.mx-phone>*{min-height:0}'}</style>
      <MobileStatus/>
      {children}
    </div>
  );
}

// ── Frame: Home ───────────────────────────────────────────────────
function HomeMobile({ tweaks }) {
  const trending = [SERIES[0], SERIES[4], SERIES[6], SERIES[2]];
  return (
    <div style={themeVars(tweaks)}>
      <Phone>
        <div style={{ height: 52, padding: '0 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, font: '700 20px/1 var(--mx-display)', letterSpacing: '-.02em' }}>
            <div style={{ width: 22, height: 22, background: 'var(--mx-accent)', borderRadius: 4, position: 'relative' }}>
              <div style={{ position: 'absolute', inset: '4px 4px 4px 9px', background: '#0a0a0c', borderRadius: 1 }}/>
            </div>
            MangaX
          </div>
          <div style={{ display: 'flex', gap: 18, color: 'var(--mx-text)' }}>
            <Icon name="search" size={20}/>
            <Icon name="bell" size={20}/>
          </div>
        </div>

        <div style={{ overflowY: 'auto', flex: 1 }}>
          {/* Hero card */}
          <div style={{ padding: '8px 16px 24px' }}>
            <div style={{ position: 'relative', borderRadius: 14, overflow: 'hidden', height: 360 }}>
              <CoverPlaceholder title={SERIES[0].title} label="hero_phone.jpg" style={{ height: '100%', aspectRatio: 'auto', borderRadius: 0 }}/>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 30%, rgba(10,10,12,.95))' }}/>
              <div style={{ position: 'absolute', left: 16, right: 16, bottom: 16 }}>
                <div style={{ font: '600 9px/1 var(--mx-display)', letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--mx-accent)', marginBottom: 8 }}>New chapter · Featured</div>
                <div style={{ font: '700 26px/1.05 var(--mx-display)', letterSpacing: '-.025em', marginBottom: 6 }}>Iron Lantern</div>
                <div style={{ font: '500 11px/1 var(--mx-body)', color: 'var(--mx-text-2)' }}>K. Mori · Ch. 142 · 4.7 ★</div>
                <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                  <button style={{ flex: 1, padding: '11px 14px', font: '600 13px/1 var(--mx-display)', background: 'var(--mx-accent)', color: '#fff', border: 'none', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                    <Icon name="play" size={12}/> Read 142
                  </button>
                  <button style={{ width: 44, padding: 11, background: 'rgba(255,255,255,.1)', border: '1px solid var(--mx-border-strong)', borderRadius: 8, color: 'var(--mx-text)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name="bookmark" size={14}/>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Continue reading */}
          <MobileSection title="Continue reading" caption="Pick up where you left off">
            <HScroll>
              {SERIES.slice(0, 5).map((s, i) => (
                <div key={s.id} style={{ width: 130, flexShrink: 0 }}>
                  <CoverPlaceholder title={s.title} style={{ width: 130, height: 184 }}/>
                  <div style={{ font: '600 12px/1.25 var(--mx-display)', marginTop: 6, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical' }}>{s.title}</div>
                  <div style={{ font: '500 10px/1 ui-monospace,monospace', color: 'var(--mx-text-3)', marginTop: 4 }}>Ch. {s.chapters - i - 1}/{s.chapters}</div>
                  <div style={{ height: 2, background: 'var(--mx-surface-3)', borderRadius: 1, marginTop: 6, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${[60, 88, 42, 72, 30][i]}%`, background: 'var(--mx-accent)' }}/>
                  </div>
                </div>
              ))}
            </HScroll>
          </MobileSection>

          {/* Top this week */}
          <MobileSection title="Top this week">
            <HScroll>
              {trending.map((s, i) => (
                <div key={s.id} style={{ width: 156, flexShrink: 0, position: 'relative' }}>
                  <CoverPlaceholder title={s.title} style={{ width: 156, height: 220 }} badge={i === 0 ? 'Hot' : null}/>
                  <div style={{ position: 'absolute', top: -6, left: -6, width: 28, height: 28, borderRadius: '50%', background: 'var(--mx-bg)', border: '2px solid var(--mx-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', font: '700 13px/1 var(--mx-display)', color: 'var(--mx-accent)' }}>{i + 1}</div>
                  <div style={{ font: '600 13px/1.25 var(--mx-display)', marginTop: 8, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{s.title}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4, font: '500 11px/1 var(--mx-body)', color: 'var(--mx-text-3)' }}>
                    <Stars value={s.rating} size={10}/>
                    <span style={{ width: 3, height: 3, background: 'var(--mx-text-4)', borderRadius: 2 }}/>
                    <span>{s.tags[0]}</span>
                  </div>
                </div>
              ))}
            </HScroll>
          </MobileSection>

          {/* Latest updated */}
          <MobileSection title="Latest updated" caption="Newest chapters first">
            <HScroll>
              {[
                { s: SERIES[0],  ago: '2 min',   ch: 142, isNew: true },
                { s: SERIES[3],  ago: '14 min',  ch: 38,  isNew: true },
                { s: SERIES[6],  ago: '48 min',  ch: 67,  isNew: true },
                { s: SERIES[8],  ago: '2 h',     ch: 91 },
                { s: SERIES[2],  ago: '4 h',     ch: 64 },
                { s: SERIES[10], ago: '6 h',     ch: 23 },
                { s: SERIES[5],  ago: '9 h',     ch: 119 },
                { s: SERIES[1],  ago: 'Yest.',   ch: 87 },
              ].map((u, i) => (
                <div key={u.s.id + '-' + i} style={{ width: 130, flexShrink: 0 }}>
                  <div style={{ position: 'relative' }}>
                    <CoverPlaceholder title={u.s.title} style={{ width: 130, height: 184 }}/>
                    {u.isNew && (
                      <div style={{
                        position: 'absolute', top: 6, left: 6,
                        padding: '3px 6px', borderRadius: 3,
                        background: 'var(--mx-accent)', color: '#fff',
                        font: '700 9px/1 var(--mx-display)', letterSpacing: '.08em', textTransform: 'uppercase',
                      }}>New</div>
                    )}
                    <div style={{
                      position: 'absolute', left: 0, right: 0, bottom: 0,
                      padding: '14px 8px 6px',
                      background: 'linear-gradient(180deg, transparent, rgba(10,10,12,.9))',
                      font: '500 10px/1 ui-monospace, monospace',
                      color: u.isNew ? 'var(--mx-accent)' : 'rgba(255,255,255,.8)',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    }}>
                      <span>Ch. {u.ch}</span>
                      <span>{u.ago}</span>
                    </div>
                  </div>
                  <div style={{ font: '600 12px/1.25 var(--mx-display)', marginTop: 6, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{u.s.title}</div>
                  <div style={{ font: '500 10px/1 var(--mx-body)', color: 'var(--mx-text-3)', marginTop: 4 }}>{u.s.tags[0]}</div>
                </div>
              ))}
            </HScroll>
          </MobileSection>

          {/* Recommended */}
          <MobileSection title="Because you read Saltwater Atlas">
            <div style={{ padding: '0 16px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              {[SERIES[2], SERIES[5], SERIES[7], SERIES[9], SERIES[11], SERIES[3]].map(s => (
                <div key={s.id}>
                  <CoverPlaceholder title={s.title}/>
                  <div style={{ font: '600 11px/1.25 var(--mx-display)', marginTop: 6, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{s.title}</div>
                  <Stars value={s.rating} size={9}/>
                </div>
              ))}
            </div>
          </MobileSection>

          <div style={{ height: 16 }}/>
        </div>

        <MobileTabBar active="home"/>
      </Phone>
    </div>
  );
}

function MobileSection({ title, caption, children }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ padding: '0 16px', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
        <div>
          <div style={{ font: '700 16px/1 var(--mx-display)', letterSpacing: '-.02em' }}>{title}</div>
          {caption && <div style={{ font: '400 11.5px/1 var(--mx-body)', color: 'var(--mx-text-3)', marginTop: 4 }}>{caption}</div>}
        </div>
        <a style={{ font: '500 11.5px/1 var(--mx-body)', color: 'var(--mx-text-2)' }}>All</a>
      </div>
      {children}
    </div>
  );
}

function HScroll({ children }) {
  return (
    <div style={{ display: 'flex', gap: 12, padding: '0 16px', overflowX: 'auto' }}>
      {children}
    </div>
  );
}

// ── Frame: Browse with filter sheet ───────────────────────────────
function BrowseMobile({ tweaks }) {
  return (
    <div style={themeVars(tweaks)}>
      <Phone>
        <MobileTopBar title="Browse" rightIcons={['search', 'sort']}/>
        {/* Active filter chips */}
        <div style={{ padding: '12px 0', display: 'flex', gap: 6, overflowX: 'auto', borderBottom: '1px solid var(--mx-border)' }}>
          <div style={{ display: 'flex', gap: 6, padding: '0 16px' }}>
            <button style={{
              padding: '6px 10px', borderRadius: 999, font: '600 11.5px/1 var(--mx-body)',
              background: 'var(--mx-accent)', color: '#fff', border: 'none', display: 'inline-flex', alignItems: 'center', gap: 5,
            }}><Icon name="filter" size={11}/> 5 filters</button>
            <Tag active>Action ×</Tag>
            <Tag active>Sci-Fi ×</Tag>
            <Tag active>Seinen ×</Tag>
            <Tag active>Ongoing ×</Tag>
          </div>
        </div>
        <div style={{ padding: '12px 16px 8px', font: '500 11.5px/1 var(--mx-body)', color: 'var(--mx-text-3)', display: 'flex', justifyContent: 'space-between' }}>
          <span>4,238 results · sorted by Most popular</span>
          <span style={{ color: 'var(--mx-text-2)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>3 cols <Icon name="grid" size={11}/></span>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 16px 12px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
            {[...SERIES, ...SERIES.slice(0, 9)].map((s, i) => (
              <div key={i}>
                <CoverPlaceholder title={s.title}/>
                <div style={{ font: '600 11px/1.2 var(--mx-display)', marginTop: 5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{s.title}</div>
                <Stars value={s.rating} size={9}/>
              </div>
            ))}
          </div>
        </div>
        <MobileTabBar active="browse"/>
      </Phone>
    </div>
  );
}

// Browse with filter sheet expanded (overlay)
function BrowseFiltersMobile({ tweaks }) {
  return (
    <div style={{ ...themeVars(tweaks), position: 'relative' }}>
      <Phone>
        <MobileTopBar title="Browse" rightIcons={['search', 'sort']}/>
        <div style={{ flex: 1, opacity: .25 }}>
          <div style={{ padding: '12px 16px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
            {SERIES.slice(0, 6).map(s => (
              <div key={s.id}>
                <CoverPlaceholder title={s.title}/>
              </div>
            ))}
          </div>
        </div>
        {/* Bottom sheet */}
        <div style={{
          position: 'absolute', left: 0, right: 0, bottom: 0,
          background: 'var(--mx-bg)', borderRadius: '20px 20px 0 0',
          border: '1px solid var(--mx-border)', borderBottom: 'none',
          maxHeight: '85%', display: 'flex', flexDirection: 'column',
          boxShadow: '0 -10px 40px rgba(0,0,0,.5)',
        }}>
          <div style={{ padding: 8, display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: 36, height: 4, background: 'var(--mx-surface-3)', borderRadius: 2 }}/>
          </div>
          <div style={{ padding: '4px 20px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--mx-border)' }}>
            <div style={{ font: '700 18px/1 var(--mx-display)', letterSpacing: '-.02em' }}>Filters</div>
            <a style={{ font: '500 12px/1 var(--mx-body)', color: 'var(--mx-text-2)' }}>Reset all</a>
          </div>
          <div style={{ overflowY: 'auto', padding: '18px 20px 20px', display: 'flex', flexDirection: 'column', gap: 22 }}>
            <FGroup title="Sort by">
              {['Most popular', 'Highest rated', 'Recently updated', 'Newest', 'Most chapters'].map((o, i) => (
                <RadioRow key={o} label={o} active={i === 0}/>
              ))}
            </FGroup>
            <FGroup title="Genre" badge="3 selected">
              {GENRES.slice(0, 12).map((g, i) => <Tag key={g} active={[0, 4, 9].includes(i)}>{g}</Tag>)}
            </FGroup>
            <FGroup title="Demographic">
              {DEMOS.map((d, i) => <Tag key={d} active={i === 1}>{d}</Tag>)}
            </FGroup>
            <FGroup title="Status">
              {STATUSES.map((s, i) => <Tag key={s} active={i === 0}>{s}</Tag>)}
            </FGroup>
            <FGroup title="Year">
              <RangeSlider min={2000} max={2026} from={2018} to={2026}/>
            </FGroup>
          </div>
          <div style={{ padding: '12px 16px', borderTop: '1px solid var(--mx-border)', display: 'flex', gap: 10, paddingBottom: 28 }}>
            <button style={{ flex: 1, padding: 14, font: '500 13px/1 var(--mx-display)', background: 'var(--mx-surface)', border: '1px solid var(--mx-border)', color: 'var(--mx-text)', borderRadius: 10 }}>Cancel</button>
            <button style={{ flex: 2, padding: 14, font: '600 13px/1 var(--mx-display)', background: 'var(--mx-accent)', border: 'none', color: '#fff', borderRadius: 10 }}>Show 4,238 results</button>
          </div>
        </div>
      </Phone>
    </div>
  );
}

function FGroup({ title, badge, children }) {
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

function RadioRow({ label, active }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', font: '500 13.5px/1 var(--mx-body)', color: 'var(--mx-text)', borderBottom: '1px solid var(--mx-border)', width: '100%' }}>
      <span style={{ width: 16, height: 16, borderRadius: '50%', border: '1.5px solid ' + (active ? 'var(--mx-accent)' : 'var(--mx-border-strong)'), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {active && <span style={{ width: 7, height: 7, background: 'var(--mx-accent)', borderRadius: '50%' }}/>}
      </span>
      {label}
    </label>
  );
}

// ── Frame: Series detail ──────────────────────────────────────────
function SeriesMobile({ tweaks }) {
  const s = SERIES[0];
  return (
    <div style={themeVars(tweaks)}>
      <Phone height={1400}>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {/* Banner */}
          <div style={{ position: 'relative', height: 320 }}>
            <CoverPlaceholder title={s.title} label="banner_phone.jpg" style={{ height: '100%', aspectRatio: 'auto', borderRadius: 0 }} dim/>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(10,10,12,.5) 0%, rgba(10,10,12,.4) 50%, var(--mx-bg))' }}/>
            <div style={{ position: 'absolute', top: 8, left: 8, right: 8, display: 'flex', justifyContent: 'space-between', color: '#fff' }}>
              <button style={{ background: 'rgba(0,0,0,.5)', border: 'none', borderRadius: 18, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}><Icon name="chevronL" size={18}/></button>
              <div style={{ display: 'flex', gap: 8 }}>
                <button style={{ background: 'rgba(0,0,0,.5)', border: 'none', borderRadius: 18, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}><Icon name="share" size={16}/></button>
                <button style={{ background: 'rgba(0,0,0,.5)', border: 'none', borderRadius: 18, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}><Icon name="bars" size={18}/></button>
              </div>
            </div>
            <div style={{ position: 'absolute', left: 16, right: 16, bottom: 16, display: 'flex', gap: 14, alignItems: 'flex-end' }}>
              <CoverPlaceholder title={s.title} label="cover.jpg" style={{ width: 110, height: 156, flexShrink: 0, boxShadow: '0 8px 24px rgba(0,0,0,.5)' }}/>
              <div style={{ minWidth: 0, paddingBottom: 4 }}>
                <div style={{ font: '500 10px/1 var(--mx-display)', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--mx-accent)', marginBottom: 8 }}>{s.demo} · {s.status}</div>
                <div style={{ font: '700 22px/1.1 var(--mx-display)', letterSpacing: '-.02em' }}>{s.title}</div>
                <div style={{ font: '500 11.5px/1 var(--mx-body)', color: 'var(--mx-text-2)', marginTop: 6 }}>K. Mori · 2021</div>
                <div style={{ marginTop: 8 }}><Stars value={s.rating} count={s.ratings} size={11}/></div>
              </div>
            </div>
          </div>

          {/* Action row */}
          <div style={{ display: 'flex', gap: 8, padding: '14px 16px' }}>
            <button style={{ flex: 1, padding: '12px', font: '600 13px/1 var(--mx-display)', background: 'var(--mx-accent)', border: 'none', color: '#fff', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <Icon name="play" size={13}/> Continue Ch. 96
            </button>
            <button style={{ width: 44, padding: 12, background: 'var(--mx-surface)', border: '1px solid var(--mx-border)', borderRadius: 10, color: 'var(--mx-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="bookmark" size={16}/>
            </button>
            <button style={{ width: 44, padding: 12, background: 'var(--mx-surface)', border: '1px solid var(--mx-border)', borderRadius: 10, color: 'var(--mx-text)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="download" size={16}/>
            </button>
          </div>

          {/* Tags */}
          <div style={{ padding: '0 16px 16px', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {[...s.tags, 'Magic', 'Steampunk', 'Female lead', 'Slow burn'].map(t => <Tag key={t} size="sm">{t}</Tag>)}
          </div>

          {/* Synopsis */}
          <div style={{ padding: '0 16px 20px' }}>
            <p style={{ font: '400 13px/1.6 var(--mx-body)', color: 'var(--mx-text-2)', margin: 0 }}>
              In a city built atop the bones of an older one, the lanterns lit at dusk are not for travelers — they are for the dead. Hana, daughter of the last guild blacksmith, inherits both the forge and a debt: a lantern that summons souls who've wronged her…
              <a style={{ color: 'var(--mx-accent)', font: '500 12px/1 var(--mx-body)', marginLeft: 4 }}>more</a>
            </p>
          </div>

          {/* Stat row */}
          <div style={{ margin: '0 16px 24px', padding: '14px 16px', background: 'var(--mx-surface)', border: '1px solid var(--mx-border)', borderRadius: 10, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <SmallStat label="Reads" value="2.4M"/>
            <SmallStat label="Library" value="184k"/>
            <SmallStat label="Comments" value="9.1k"/>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 18, padding: '0 16px', borderBottom: '1px solid var(--mx-border)', marginBottom: 4 }}>
            {['Chapters', 'About', 'Reviews', 'Similar'].map((t, i) => (
              <a key={t} style={{
                padding: '12px 0', font: '600 13px/1 var(--mx-display)',
                color: i === 0 ? 'var(--mx-text)' : 'var(--mx-text-3)',
                borderBottom: '2px solid ' + (i === 0 ? 'var(--mx-accent)' : 'transparent'),
                marginBottom: -1,
              }}>{t}</a>
            ))}
          </div>

          {/* Chapter list condensed */}
          <div style={{ padding: '14px 16px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ font: '500 12px/1 var(--mx-body)', color: 'var(--mx-text-3)' }}>142 chapters · 9 unread</div>
            <a style={{ font: '500 12px/1 var(--mx-body)', color: 'var(--mx-text-2)', display: 'inline-flex', alignItems: 'center', gap: 4 }}><Icon name="sort" size={12}/> Newest</a>
          </div>
          <div style={{ padding: '0 16px' }}>
            {Array.from({ length: 8 }).map((_, i) => {
              const num = 142 - i;
              const titles = ['The Lantern Speaks', 'A Debt Collected', 'Brass and Salt', 'The Ninth Court', 'Forge Smoke', 'Hana, Alone', 'Old Apologies', 'A Wound that Hums'];
              const date = ['2d', '9d', '18d', '27d', '1mo', '1mo', '2mo', '2mo'][i];
              const read = i > 2;
              const cur = i === 2;
              return (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 0', borderBottom: '1px solid var(--mx-border)',
                  background: cur ? 'var(--mx-accent-soft)' : 'transparent',
                  marginLeft: cur ? -16 : 0, marginRight: cur ? -16 : 0, paddingLeft: cur ? 16 : 0, paddingRight: cur ? 16 : 0,
                  opacity: read ? 0.55 : 1,
                }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ font: '600 13.5px/1.25 var(--mx-display)' }}>Ch. {num} · {titles[i]}</div>
                    <div style={{ font: '500 11px/1 var(--mx-body)', color: 'var(--mx-text-3)', marginTop: 5, display: 'flex', gap: 8 }}>
                      <span>{date}</span>
                      <span>·</span>
                      <span>{[38, 42, 36, 40, 38, 44, 36, 40][i]} pages</span>
                      {cur && <><span>·</span><span style={{ color: 'var(--mx-accent)', fontWeight: 600 }}>● Reading 67%</span></>}
                    </div>
                  </div>
                  <Icon name={read ? 'check' : 'download'} size={16}/>
                </div>
              );
            })}
          </div>
          <div style={{ padding: 16 }}>
            <button style={{ width: '100%', padding: 12, font: '500 13px/1 var(--mx-display)', background: 'var(--mx-surface)', border: '1px solid var(--mx-border)', color: 'var(--mx-text)', borderRadius: 10 }}>Show all 142 chapters</button>
          </div>
        </div>
        <MobileTabBar active=""/>
      </Phone>
    </div>
  );
}

function SmallStat({ label, value }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ font: '700 17px/1 var(--mx-display)' }}>{value}</div>
      <div style={{ font: '500 10.5px/1 var(--mx-body)', color: 'var(--mx-text-3)', marginTop: 5 }}>{label}</div>
    </div>
  );
}

// ── Frame: Reader (immersive, chrome visible) ─────────────────────
function ReaderMobile({ tweaks, chromeVisible = true }) {
  const CURRENT_CH = 96;
  const TOTAL_CH = 142;
  const [visible, setVisible] = React.useState(chromeVisible);
  const [chapterOpen, setChapterOpen] = React.useState(false);
  const [chapter, setChapter] = React.useState(CURRENT_CH);
  const scrollRef = React.useRef(null);
  const lastScroll = React.useRef(0);

  // Sync with prop changes (so design-canvas artboard variations still work)
  React.useEffect(() => { setVisible(chromeVisible); }, [chromeVisible]);

  const onScroll = (e) => {
    const y = e.currentTarget.scrollTop;
    // Hide overlay on scroll-down past a small threshold
    if (y - lastScroll.current > 6 && visible) {
      setVisible(false);
      setChapterOpen(false);
    }
    lastScroll.current = y;
  };

  const onPagesClick = (e) => {
    // Tap on pages toggles overlay; ignore clicks on chrome (handled by stopPropagation)
    setVisible(v => !v);
    setChapterOpen(false);
  };

  const stop = (e) => e.stopPropagation();

  // Build chapter list for dropdown
  const chapters = Array.from({ length: 12 }, (_, i) => CURRENT_CH + 2 - i)
    .filter(n => n >= 1 && n <= TOTAL_CH);

  const titlesByCh = {
    97: 'The Bell at Dusk',
    96: 'A Wound that Hums',
    95: 'Coals in the Grate',
    94: 'Underglow',
    93: 'Two Lanterns',
    92: 'Fox-Light',
    91: 'River of Ash',
    90: 'Quiet Iron',
  };

  return (
    <div style={themeVars(tweaks)}>
      <Phone>
        <div
          ref={scrollRef}
          onScroll={onScroll}
          style={{ flex: 1, overflowY: 'auto', position: 'relative', background: '#000' }}
        >
          {/* Top chrome */}
          <div
            onClick={stop}
            style={{
              position: 'absolute', left: 0, right: 0, top: 0, zIndex: 5,
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(-6px)',
              pointerEvents: visible ? 'auto' : 'none',
              transition: 'opacity .18s, transform .18s',
              padding: '14px 16px 12px',
              background: 'linear-gradient(180deg, rgba(10,10,12,.95), transparent)',
              display: 'flex', alignItems: 'center', gap: 12,
            }}
          >
            <Icon name="chevronL" size={22}/>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ font: '600 13px/1.1 var(--mx-display)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Iron Lantern · Ch. {chapter}</div>
              <div style={{ font: '500 10.5px/1 var(--mx-body)', color: 'var(--mx-text-3)', marginTop: 3 }}>{titlesByCh[chapter] || 'Untitled'} · pg 12 of 38</div>
            </div>
            <Icon name="bookmark" size={20}/>
            <Icon name="settings" size={20}/>
          </div>

          {/* Pages (tap area toggles overlay) */}
          <div onClick={onPagesClick} style={{ paddingTop: 0, cursor: 'pointer' }}>
            {[1, 2, 3].map(p => (
              <CoverPlaceholder key={p} title={`Page ${p + 11}`} label={`pg_${String(p + 11).padStart(3, '0')}.webp`} ratio="auto" style={{ borderRadius: 0, height: 540, aspectRatio: 'auto' }}/>
            ))}
          </div>

          {/* Chapter picker sheet (anchored above bottom chrome) */}
          <div
            onClick={stop}
            style={{
              position: 'absolute', left: 12, right: 12, bottom: 92, zIndex: 6,
              background: 'rgba(20,20,22,.98)', border: '1px solid var(--mx-border)',
              borderRadius: 12, overflow: 'hidden',
              boxShadow: '0 20px 40px -10px rgba(0,0,0,.6)',
              opacity: visible && chapterOpen ? 1 : 0,
              transform: visible && chapterOpen ? 'translateY(0)' : 'translateY(8px)',
              pointerEvents: visible && chapterOpen ? 'auto' : 'none',
              transition: 'opacity .18s, transform .18s',
              maxHeight: 280,
            }}
          >
            <div style={{
              padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              borderBottom: '1px solid var(--mx-border)',
            }}>
              <span style={{ font: '600 12px/1 var(--mx-display)', color: 'var(--mx-text)' }}>Jump to chapter</span>
              <span style={{ font: '500 10.5px/1 ui-monospace,monospace', color: 'var(--mx-text-3)' }}>{TOTAL_CH} total</span>
            </div>
            <div style={{ maxHeight: 232, overflowY: 'auto' }}>
              {chapters.map(n => {
                const isCurrent = n === chapter;
                return (
                  <div
                    key={n}
                    onClick={() => { setChapter(n); setChapterOpen(false); }}
                    style={{
                      display: 'flex', alignItems: 'baseline', gap: 12,
                      padding: '10px 14px',
                      borderBottom: '1px solid rgba(255,255,255,.04)',
                      background: isCurrent ? 'var(--mx-accent-soft)' : 'transparent',
                      cursor: 'pointer',
                    }}
                  >
                    <span style={{
                      font: '600 12px/1 ui-monospace,monospace',
                      color: isCurrent ? 'var(--mx-accent)' : 'var(--mx-text-2)',
                      width: 34,
                    }}>Ch.{n}</span>
                    <span style={{
                      font: '500 12px/1.2 var(--mx-body)',
                      color: isCurrent ? 'var(--mx-text)' : 'var(--mx-text-2)',
                      flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>{titlesByCh[n] || `Chapter ${n}`}</span>
                    {isCurrent && (
                      <span style={{ font: '600 9px/1 ui-monospace,monospace', color: 'var(--mx-accent)', letterSpacing: .4 }}>READING</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom chrome — chapter navigation */}
          <div
            onClick={stop}
            style={{
              position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 5,
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(6px)',
              pointerEvents: visible ? 'auto' : 'none',
              transition: 'opacity .18s, transform .18s',
              padding: '14px 12px 16px',
              background: 'linear-gradient(0deg, rgba(10,10,12,.95) 40%, transparent)',
            }}
          >
            {/* Page progress */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 4px', marginBottom: 12 }}>
              <span style={{ font: '600 10.5px/1 ui-monospace,monospace', color: 'var(--mx-text-3)' }}>12</span>
              <div style={{ flex: 1, height: 3, background: 'rgba(255,255,255,.14)', borderRadius: 2, position: 'relative' }}>
                <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: '32%', background: 'var(--mx-accent)', borderRadius: 2 }}/>
              </div>
              <span style={{ font: '600 10.5px/1 ui-monospace,monospace', color: 'var(--mx-text-3)' }}>38</span>
            </div>

            {/* Chapter nav row */}
            <div style={{ display: 'flex', alignItems: 'stretch', gap: 8 }}>
              <button
                onClick={() => { if (chapter > 1) setChapter(chapter - 1); }}
                disabled={chapter <= 1}
                style={{
                  flex: '0 0 auto', padding: '10px 12px',
                  background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.08)',
                  color: chapter <= 1 ? 'var(--mx-text-3)' : 'var(--mx-text)',
                  borderRadius: 10,
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  font: '600 11.5px/1 var(--mx-display)',
                  opacity: chapter <= 1 ? .45 : 1,
                }}
              >
                <Icon name="chevronL" size={13}/>
                <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 3 }}>
                  <span style={{ font: '500 9px/1 ui-monospace,monospace', color: 'var(--mx-text-3)', letterSpacing: .4 }}>PREV</span>
                  <span>Ch. {Math.max(1, chapter - 1)}</span>
                </span>
              </button>

              <button
                onClick={() => setChapterOpen(o => !o)}
                style={{
                  flex: 1, padding: '8px 12px',
                  background: chapterOpen ? 'var(--mx-accent-soft)' : 'rgba(255,255,255,.06)',
                  border: '1px solid ' + (chapterOpen ? 'var(--mx-accent)' : 'rgba(255,255,255,.08)'),
                  color: 'var(--mx-text)',
                  borderRadius: 10,
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                  <span style={{ font: '500 9px/1 ui-monospace,monospace', color: 'var(--mx-text-3)', letterSpacing: .5 }}>CHAPTER</span>
                  <span style={{ font: '700 14px/1 var(--mx-display)' }}>
                    {chapter} <span style={{ color: 'var(--mx-text-3)', font: '500 11px/1 ui-monospace,monospace' }}>/ {TOTAL_CH}</span>
                  </span>
                </div>
                <Icon name="chevronD" size={13}/>
              </button>

              <button
                onClick={() => { if (chapter < TOTAL_CH) setChapter(chapter + 1); }}
                disabled={chapter >= TOTAL_CH}
                style={{
                  flex: '0 0 auto', padding: '10px 12px',
                  background: chapter >= TOTAL_CH ? 'rgba(255,255,255,.06)' : 'var(--mx-accent)',
                  border: '1px solid ' + (chapter >= TOTAL_CH ? 'rgba(255,255,255,.08)' : 'var(--mx-accent)'),
                  color: chapter >= TOTAL_CH ? 'var(--mx-text-3)' : '#fff',
                  borderRadius: 10,
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  font: '600 11.5px/1 var(--mx-display)',
                  opacity: chapter >= TOTAL_CH ? .55 : 1,
                }}
              >
                <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3 }}>
                  <span style={{ font: '500 9px/1 ui-monospace,monospace', color: chapter >= TOTAL_CH ? 'var(--mx-text-3)' : 'rgba(255,255,255,.7)', letterSpacing: .4 }}>NEXT</span>
                  <span>Ch. {Math.min(TOTAL_CH, chapter + 1)}</span>
                </span>
                <Icon name="chevronR" size={13}/>
              </button>
            </div>
          </div>
        </div>
      </Phone>
    </div>
  );
}

// ── Frame: Library (mobile) ──────────────────────────────────────
function LibraryMobile({ tweaks }) {
  return (
    <div style={themeVars(tweaks)}>
      <Phone>
        <MobileTopBar title="Library" rightIcons={['search', 'download']}/>
        <div style={{ display: 'flex', gap: 6, padding: '14px 16px 6px', overflowX: 'auto' }}>
          {['Reading 12', 'Plan 47', 'Done 28', 'Hold 5', 'Drop 3'].map((t, i) => (
            <button key={t} style={{
              padding: '7px 12px', borderRadius: 999, font: `${i === 0 ? 600 : 500} 12px/1 var(--mx-body)`,
              border: '1px solid ' + (i === 0 ? 'var(--mx-accent)' : 'var(--mx-border)'),
              background: i === 0 ? 'var(--mx-accent-soft)' : 'transparent',
              color: i === 0 ? 'var(--mx-accent)' : 'var(--mx-text-2)',
              whiteSpace: 'nowrap',
            }}>{t}</button>
          ))}
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 16px 12px' }}>
          {SERIES.slice(0, 6).map((s, i) => (
            <div key={s.id} style={{
              display: 'flex', gap: 12, padding: '12px 0',
              borderBottom: '1px solid var(--mx-border)',
            }}>
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <CoverPlaceholder title={s.title} style={{ width: 64, height: 90 }}/>
                {[1, 2].includes(i) && (
                  <div style={{ position: 'absolute', bottom: 4, right: 4, background: 'var(--mx-accent)', color: '#fff', font: '700 9px/1 ui-monospace,monospace', padding: '2px 4px', borderRadius: 3 }}>↓</div>
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                  <div style={{ font: '600 14px/1.25 var(--mx-display)', flex: 1, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical' }}>{s.title}</div>
                  {i === 0 && <div style={{ font: '600 10px/1 ui-monospace,monospace', color: 'var(--mx-accent)' }}>● NEW</div>}
                </div>
                <div style={{ font: '500 11px/1 var(--mx-body)', color: 'var(--mx-text-3)', marginTop: 5 }}>{s.author} · last read {['just now', '9d', '18d', '1mo', '1mo', '2mo'][i]}</div>
                <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ flex: 1, height: 3, background: 'var(--mx-surface-3)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${(s.chapters - i - 2) / s.chapters * 100}%`, background: 'var(--mx-accent)' }}/>
                  </div>
                  <div style={{ font: '500 10px/1 ui-monospace,monospace', color: 'var(--mx-text-3)', whiteSpace: 'nowrap' }}>{s.chapters - i - 2}/{s.chapters}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <MobileTabBar active="library"/>
      </Phone>
    </div>
  );
}

Object.assign(window, {
  Phone, MobileStatus, MobileTopBar, MobileTabBar, MobileSection, HScroll,
  HomeMobile, BrowseMobile, BrowseFiltersMobile, SeriesMobile, ReaderMobile, LibraryMobile,
  SmallStat, FGroup, RadioRow,
});
