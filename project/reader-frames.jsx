// Reader deep-dive frames for MangaX
// Reader settings sheet · end-of-chapter / seamless continue · offline downloads
// Vertical (webtoon) is the DEFAULT reading mode everywhere.

// ── Small controls ────────────────────────────────────────────────
function SheetSection({ label, hint, children }) {
  return (
    <div style={{ padding: '16px 16px 18px', borderBottom: '1px solid var(--mx-border)' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 10, marginBottom: 11 }}>
        <span style={{ font: '600 11px/1 var(--mx-display)', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--mx-text-3)' }}>{label}</span>
        {hint && <span style={{ font: '500 10.5px/1 var(--mx-body)', color: 'var(--mx-text-4)' }}>{hint}</span>}
      </div>
      {children}
    </div>
  );
}

// Segmented control that can wrap into a 2-col grid
function Seg({ options, value, onChange, cols }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: cols ? `repeat(${cols},1fr)` : `repeat(${options.length},1fr)`, gap: 6 }}>
      {options.map(o => {
        const on = o.value === value;
        return (
          <button key={o.value} onClick={() => onChange(o.value)} style={{
            appearance: 'none', cursor: 'pointer', padding: '9px 6px',
            borderRadius: 9, textAlign: 'center',
            border: '1px solid ' + (on ? 'var(--mx-accent)' : 'var(--mx-border)'),
            background: on ? 'var(--mx-accent-soft)' : 'var(--mx-surface-2)',
            color: on ? 'var(--mx-accent)' : 'var(--mx-text-2)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
          }}>
            {o.glyph && <ModeGlyph kind={o.glyph} on={on}/>}
            <span style={{ font: `${on ? 600 : 500} 11.5px/1 var(--mx-body)` }}>{o.label}</span>
            {o.sub && <span style={{ font: '500 9px/1 ui-monospace,monospace', color: 'var(--mx-text-4)', letterSpacing: '.03em' }}>{o.sub}</span>}
          </button>
        );
      })}
    </div>
  );
}

// Tiny diagrams so reading direction reads at a glance
function ModeGlyph({ kind, on }) {
  const c = on ? 'var(--mx-accent)' : 'var(--mx-text-3)';
  const box = { fill: 'none', stroke: c, strokeWidth: 1.4, rx: 1.5 };
  if (kind === 'vertical') return (
    <svg width="28" height="20" viewBox="0 0 28 20"><rect x="9" y="1" width="10" height="7" {...box}/><rect x="9" y="10" width="10" height="7" {...box}/><path d="M14 8.4v1.2" stroke={c} strokeWidth="1.4"/><path d="M23 5v9M20.8 11.8L23 14.4l2.2-2.6" stroke={c} strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
  );
  if (kind === 'ltr') return (
    <svg width="28" height="20" viewBox="0 0 28 20"><rect x="2" y="4" width="10" height="12" {...box}/><rect x="14" y="4" width="10" height="12" {...box}/><path d="M9 20h8M14.4 17.8L17 20l-2.6 2.2" stroke={c} strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" transform="translate(0,-3)"/></svg>
  );
  if (kind === 'rtl') return (
    <svg width="28" height="20" viewBox="0 0 28 20"><rect x="2" y="4" width="10" height="12" {...box}/><rect x="14" y="4" width="10" height="12" {...box}/><path d="M17 17h-8M11.6 14.8L9 17l2.6 2.2" stroke={c} strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
  );
  return (
    <svg width="28" height="20" viewBox="0 0 28 20"><rect x="9" y="3" width="10" height="14" {...box}/></svg>
  );
}

function SwitchRow({ label, sub, on, onToggle, disabled }) {
  return (
    <div onClick={() => !disabled && onToggle(!on)} style={{
      display: 'flex', alignItems: 'center', gap: 12, padding: '9px 0', cursor: disabled ? 'default' : 'pointer',
      opacity: disabled ? .4 : 1,
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ font: '500 13px/1.25 var(--mx-body)', color: 'var(--mx-text)' }}>{label}</div>
        {sub && <div style={{ font: '400 11px/1.3 var(--mx-body)', color: 'var(--mx-text-3)', marginTop: 3 }}>{sub}</div>}
      </div>
      <div style={{
        width: 42, height: 25, borderRadius: 999, flexShrink: 0, padding: 2,
        background: on ? 'var(--mx-accent)' : 'var(--mx-surface-3)',
        transition: 'background .16s',
      }}>
        <div style={{
          width: 21, height: 21, borderRadius: '50%', background: '#fff',
          transform: on ? 'translateX(17px)' : 'translateX(0)', transition: 'transform .16s',
        }}/>
      </div>
    </div>
  );
}

function SliderRow({ label, value, onChange, min = 0, max = 100, unit = '%' }) {
  const pct = (value - min) / (max - min) * 100;
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 9 }}>
        <span style={{ font: '500 13px/1 var(--mx-body)', color: 'var(--mx-text)' }}>{label}</span>
        <span style={{ font: '600 11.5px/1 ui-monospace,monospace', color: 'var(--mx-text-3)' }}>{value}{unit}</span>
      </div>
      <div style={{ position: 'relative', height: 22, display: 'flex', alignItems: 'center' }}>
        <div style={{ height: 4, width: '100%', borderRadius: 2, background: 'var(--mx-surface-3)' }}/>
        <div style={{ position: 'absolute', left: 0, height: 4, width: `${pct}%`, borderRadius: 2, background: 'var(--mx-accent)' }}/>
        <div style={{ position: 'absolute', left: `calc(${pct}% - 9px)`, width: 18, height: 18, borderRadius: '50%', background: '#fff', boxShadow: '0 2px 6px rgba(0,0,0,.5)' }}/>
        <input type="range" min={min} max={max} value={value} onChange={e => onChange(+e.target.value)}
          style={{ position: 'absolute', inset: 0, width: '100%', opacity: 0, cursor: 'pointer', margin: 0 }}/>
      </div>
    </div>
  );
}

// ── Frame: Reader settings sheet (mobile) ─────────────────────────
function ReaderSettingsMobile({ tweaks }) {
  const [mode, setMode] = React.useState('vertical');
  const [fit, setFit] = React.useState('width');
  const [gap, setGap] = React.useState('none');
  const [bright, setBright] = React.useState(100);
  const [seamless, setSeamless] = React.useState(true);
  const [tapZones, setTapZones] = React.useState(true);
  const [awake, setAwake] = React.useState(true);
  const [scope, setScope] = React.useState('all');
  const isVertical = mode === 'vertical';

  return (
    <div style={themeVars(tweaks)}>
      <Phone>
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden', background: '#000' }}>
          {/* dimmed reader behind */}
          <div style={{ position: 'absolute', inset: 0 }}>
            <CoverPlaceholder title="Page 12" label="pg_012.webp" ratio="auto" style={{ borderRadius: 0, height: '100%', aspectRatio: 'auto' }}/>
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.65)' }}/>
          </div>

          {/* sheet */}
          <div style={{
            position: 'absolute', left: 0, right: 0, bottom: 0, maxHeight: '86%',
            background: 'var(--mx-surface)', borderTop: '1px solid var(--mx-border-strong)',
            borderRadius: '18px 18px 0 0', display: 'flex', flexDirection: 'column',
            boxShadow: '0 -20px 50px rgba(0,0,0,.6)',
          }}>
            <div style={{ padding: '10px 0 2px', display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
              <div style={{ width: 38, height: 4, borderRadius: 2, background: 'var(--mx-surface-3)' }}/>
            </div>
            <div style={{ padding: '8px 16px 14px', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
              <div style={{ flex: 1 }}>
                <div style={{ font: '700 17px/1 var(--mx-display)', letterSpacing: '-.02em' }}>Reader settings</div>
                <div style={{ font: '500 11px/1 var(--mx-body)', color: 'var(--mx-text-3)', marginTop: 5 }}>Iron Lantern · Ch. {96}</div>
              </div>
              <button style={{ background: 'var(--mx-surface-2)', border: 'none', color: 'var(--mx-text-2)', width: 30, height: 30, borderRadius: 999, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <Icon name="x" size={15}/>
              </button>
            </div>

            <div style={{ overflowY: 'auto', flex: 1, borderTop: '1px solid var(--mx-border)' }}>
              <SheetSection label="Reading mode" hint="Vertical is the default">
                <Seg cols={2} value={mode} onChange={setMode} options={[
                  { value: 'vertical', label: 'Vertical', sub: 'WEBTOON', glyph: 'vertical' },
                  { value: 'rtl', label: 'Right → Left', sub: 'MANGA', glyph: 'rtl' },
                  { value: 'ltr', label: 'Left → Right', sub: 'COMIC', glyph: 'ltr' },
                  { value: 'single', label: 'Single page', sub: 'TAP', glyph: 'single' },
                ]}/>
                {isVertical && (
                  <div style={{ marginTop: 10, display: 'flex', gap: 8, alignItems: 'flex-start', padding: '9px 10px', background: 'var(--mx-accent-soft)', border: '1px solid var(--mx-accent)', borderRadius: 8 }}>
                    <span style={{ color: 'var(--mx-accent)', flexShrink: 0, marginTop: 1 }}><Icon name="check" size={13} strokeWidth={2.2}/></span>
                    <span style={{ font: '500 11px/1.4 var(--mx-body)', color: 'var(--mx-text-2)' }}>Continuous scroll — pages and chapters flow into each other with no page turns.</span>
                  </div>
                )}
              </SheetSection>

              <SheetSection label="Page fit">
                <Seg value={fit} onChange={setFit} options={[
                  { value: 'width', label: 'Fit width' },
                  { value: 'height', label: 'Fit height' },
                  { value: 'original', label: 'Original' },
                ]}/>
              </SheetSection>

              <SheetSection label="Page gap" hint={isVertical ? null : 'Vertical only'}>
                <div style={{ opacity: isVertical ? 1 : .4, pointerEvents: isVertical ? 'auto' : 'none' }}>
                  <Seg value={gap} onChange={setGap} options={[
                    { value: 'none', label: 'None' },
                    { value: 'sm', label: 'Small' },
                    { value: 'md', label: 'Medium' },
                  ]}/>
                </div>
              </SheetSection>

              <SheetSection label="Display">
                <SliderRow label="Brightness" value={bright} onChange={setBright} min={20} max={100}/>
                <div style={{ height: 6 }}/>
                <SwitchRow label="Keep screen awake" sub="While the reader is open" on={awake} onToggle={setAwake}/>
                <SwitchRow label="Show tap zones" sub="Overlay guide on first tap" on={tapZones} onToggle={setTapZones}/>
              </SheetSection>

              <SheetSection label="Chapter flow">
                <SwitchRow
                  label="Seamless next chapter"
                  sub={isVertical ? 'Keep scrolling past the last page to roll into the next chapter' : 'Requires vertical reading mode'}
                  on={isVertical && seamless} onToggle={setSeamless} disabled={!isVertical}/>
              </SheetSection>

              <SheetSection label="Apply to">
                <Seg value={scope} onChange={setScope} options={[
                  { value: 'series', label: 'This series' },
                  { value: 'all', label: 'All series' },
                ]}/>
              </SheetSection>

              <div style={{ padding: '16px 16px 26px' }}>
                <button style={{
                  width: '100%', padding: '13px', background: 'var(--mx-accent)', border: 'none',
                  color: '#fff', borderRadius: 10, font: '600 14px/1 var(--mx-display)', cursor: 'pointer',
                }}>Done</button>
              </div>
            </div>
          </div>
        </div>
      </Phone>
    </div>
  );
}

// ── Frame: End of chapter (mobile, vertical seamless) ─────────────
// Scroll to the bottom: the pull-to-continue meter fills, then the next
// chapter's first page is already stitched in below the seam.
function ReaderEndChapterMobile({ tweaks, startAtEnd = false }) {
  const CUR = 96, NEXT = 97, TOTAL = 142;
  const scrollRef = React.useRef(null);
  const seamRef = React.useRef(null);
  const lastY = React.useRef(0);
  const [pull, setPull] = React.useState(0);       // 0..1 progress through the seam
  const [crossed, setCrossed] = React.useState(false);
  const [visible, setVisible] = React.useState(true);

  // Park the frame on the seam once images have contributed their height.
  React.useEffect(() => {
    if (!startAtEnd) return;
    const el = scrollRef.current, seam = seamRef.current;
    if (!el || !seam) return;
    const park = () => {
      // frame the seam block: top of seam sits just under the status/top chrome
      el.scrollTop = Math.max(0, seam.offsetTop - 84);
      lastY.current = el.scrollTop;
      measure();
    };
    const r1 = requestAnimationFrame(() => requestAnimationFrame(park));
    const ro = new ResizeObserver(park);
    ro.observe(el);
    const t = setTimeout(park, 400);
    return () => { cancelAnimationFrame(r1); clearTimeout(t); ro.disconnect(); };
  }, [startAtEnd]);

  // pull = how far the seam has travelled up through the viewport
  const measure = () => {
    const el = scrollRef.current, seam = seamRef.current;
    if (!el || !seam) return;
    const start = seam.offsetTop - el.clientHeight + 300;  // seam well into view
    const end = seam.offsetTop + seam.offsetHeight - el.clientHeight * 0.55;
    const p = Math.max(0, Math.min(1, (el.scrollTop - start) / Math.max(1, end - start)));
    setPull(p);
    if (p >= 1) setCrossed(true);
  };

  const onScroll = (e) => {
    const y = e.currentTarget.scrollTop;
    if (y - lastY.current > 6 && visible) setVisible(false);
    lastY.current = y;
    measure();
  };

  const stop = e => e.stopPropagation();

  return (
    <div style={themeVars(tweaks)}>
      <Phone>
        <div ref={scrollRef} onScroll={onScroll} onClick={() => setVisible(v => !v)}
          style={{ flex: 1, overflowY: 'auto', position: 'relative', background: '#000' }}>

          {/* Top chrome — title flips to the next chapter once the seam is crossed */}
          <div onClick={stop} style={{
            position: 'absolute', left: 0, right: 0, top: 0, zIndex: 6,
            opacity: visible ? 1 : 0, pointerEvents: visible ? 'auto' : 'none',
            transform: visible ? 'translateY(0)' : 'translateY(-6px)', transition: 'opacity .18s, transform .18s',
            padding: '14px 16px 12px', display: 'flex', alignItems: 'center', gap: 12,
            background: 'linear-gradient(180deg, rgba(10,10,12,.95), transparent)',
          }}>
            <Icon name="chevronL" size={22}/>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ font: '600 13px/1.1 var(--mx-display)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Iron Lantern · Ch. {crossed ? NEXT : CUR}</div>
              <div style={{ font: '500 10.5px/1 var(--mx-body)', color: 'var(--mx-text-3)', marginTop: 3 }}>{crossed ? 'The Bell at Dusk · pg 1 of 41' : 'A Wound that Hums · pg 38 of 38'}</div>
            </div>
            <Icon name="bookmark" size={20}/>
            <Icon name="settings" size={20}/>
          </div>

          {/* last pages of current chapter */}
          {[36, 37, 38].map(p => (
            <CoverPlaceholder key={p} title={`Page ${p}`} label={`pg_${String(p).padStart(3, '0')}.webp`} ratio="auto"
              style={{ borderRadius: 0, height: 520, aspectRatio: 'auto' }}/>
          ))}

          {/* ── the seam ─────────────────────────────────────────── */}
          <div ref={seamRef} style={{ background: 'var(--mx-bg)', padding: '30px 18px 34px', textAlign: 'center' }}>
            <div style={{ font: '600 10px/1 ui-monospace,monospace', letterSpacing: '.16em', color: 'var(--mx-text-4)' }}>END OF CHAPTER {CUR}</div>
            <div style={{ font: '700 21px/1.2 var(--mx-display)', letterSpacing: '-.02em', marginTop: 10, textWrap: 'balance' }}>A Wound that Hums</div>

            {/* quick actions */}
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 20 }}>
              {[{ i: 'star', l: 'Rate' }, { i: 'comment', l: '412' }, { i: 'bookmark', l: 'Save' }, { i: 'share', l: 'Share' }].map(a => (
                <button key={a.l} style={{
                  padding: '9px 13px', background: 'var(--mx-surface-2)', border: '1px solid var(--mx-border)',
                  color: 'var(--mx-text-2)', borderRadius: 9, cursor: 'pointer',
                  display: 'inline-flex', alignItems: 'center', gap: 6, font: '500 11.5px/1 var(--mx-body)',
                }}><Icon name={a.i} size={13}/>{a.l}</button>
              ))}
            </div>

            {/* pull-to-continue meter */}
            <div style={{ marginTop: 30, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <div style={{ position: 'relative', width: 58, height: 58 }}>
                <svg width="58" height="58" viewBox="0 0 58 58" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="29" cy="29" r="25" fill="none" stroke="var(--mx-surface-3)" strokeWidth="3"/>
                  <circle cx="29" cy="29" r="25" fill="none" stroke="var(--mx-accent)" strokeWidth="3"
                    strokeLinecap="round" strokeDasharray={157} strokeDashoffset={157 * (1 - pull)}
                    style={{ transition: 'stroke-dashoffset .1s linear' }}/>
                </svg>
                <div style={{
                  position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: pull >= 1 ? 'var(--mx-accent)' : 'var(--mx-text-3)',
                  transform: `translateY(${pull * 3}px)`,
                }}>
                  <Icon name={pull >= 1 ? 'check' : 'chevronD'} size={20} strokeWidth={2.2}/>
                </div>
              </div>
              <div style={{ font: '600 12px/1.3 var(--mx-body)', color: pull >= 1 ? 'var(--mx-accent)' : 'var(--mx-text-2)' }}>
                {pull >= 1 ? `Loading Chapter ${NEXT}…` : 'Keep scrolling for the next chapter'}
              </div>
            </div>

            {/* explicit nav — always available for readers who prefer buttons */}
            <div style={{ display: 'flex', gap: 8, marginTop: 26 }}>
              <button style={{
                flex: '0 0 auto', padding: '11px 13px', background: 'var(--mx-surface-2)',
                border: '1px solid var(--mx-border)', color: 'var(--mx-text-2)', borderRadius: 10, cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: 6, font: '600 11.5px/1 var(--mx-display)',
              }}><Icon name="chevronL" size={13}/>Ch. {CUR - 1}</button>
              <button style={{
                flex: 1, padding: '11px 13px', background: 'var(--mx-accent)', border: 'none', color: '#fff',
                borderRadius: 10, cursor: 'pointer', display: 'inline-flex', alignItems: 'center',
                justifyContent: 'center', gap: 7, font: '600 13px/1 var(--mx-display)',
              }}>Next chapter · {NEXT}<Icon name="chevronR" size={14}/></button>
            </div>
            <div style={{ font: '500 10px/1 ui-monospace,monospace', color: 'var(--mx-text-4)', marginTop: 14, letterSpacing: '.06em' }}>
              {CUR} OF {TOTAL} · 46 UNREAD
            </div>
          </div>

          {/* stitched first page of the next chapter */}
          <div style={{ position: 'relative' }}>
            <div style={{
              padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10,
              background: 'var(--mx-surface)', borderTop: '1px solid var(--mx-border-strong)',
              borderBottom: '1px solid var(--mx-border)',
            }}>
              <span style={{ font: '700 11px/1 ui-monospace,monospace', color: 'var(--mx-accent)', letterSpacing: '.08em' }}>CH.{NEXT}</span>
              <span style={{ font: '600 12px/1 var(--mx-display)', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>The Bell at Dusk</span>
              <span style={{ font: '500 10px/1 ui-monospace,monospace', color: 'var(--mx-text-3)' }}>41 pg</span>
            </div>
            <CoverPlaceholder title="Page 1" label="pg_001.webp" ratio="auto" style={{ borderRadius: 0, height: 520, aspectRatio: 'auto' }}/>
          </div>
        </div>
      </Phone>
    </div>
  );
}

// ── Frame: Downloads / offline (mobile) ───────────────────────────
function DownloadsMobile({ tweaks }) {
  const queue = [
    { s: 'Iron Lantern', ch: 'Ch. 97–102', state: 'downloading', pct: 62, size: '48 MB' },
    { s: 'Iron Lantern', ch: 'Ch. 103–110', state: 'queued', pct: 0, size: '64 MB' },
    { s: 'Threadbare', ch: 'Ch. 24', state: 'queued', pct: 0, size: '9 MB' },
  ];
  const saved = [
    { s: 'Saltwater Atlas', n: 12, size: '96 MB', exp: 'Kept' },
    { s: 'Paper Daughters', n: 6, size: '41 MB', exp: 'Kept' },
    { s: 'Dewline', n: 52, size: '380 MB', exp: 'Expires in 21d' },
  ];
  return (
    <div style={themeVars(tweaks)}>
      <Phone>
        <MobileTopBar title="Downloads" leftIcon="chevronL" rightIcons={['settings']}/>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {/* storage meter */}
          <div style={{ padding: '16px 16px 18px', borderBottom: '1px solid var(--mx-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
              <span style={{ font: '600 13px/1 var(--mx-display)' }}>0.63 GB of 4 GB</span>
              <button style={{ background: 'none', border: 'none', color: 'var(--mx-accent)', font: '600 11.5px/1 var(--mx-body)', cursor: 'pointer', padding: 0 }}>Manage</button>
            </div>
            <div style={{ display: 'flex', height: 7, borderRadius: 4, overflow: 'hidden', background: 'var(--mx-surface-3)', gap: 1 }}>
              <div style={{ width: '9%', background: 'var(--mx-accent)' }}/>
              <div style={{ width: '4%', background: 'var(--mx-accent)', opacity: .55 }}/>
              <div style={{ width: '3%', background: 'var(--mx-text-4)' }}/>
            </div>
            <div style={{ display: 'flex', gap: 14, marginTop: 10, font: '500 10.5px/1 var(--mx-body)', color: 'var(--mx-text-3)' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><i style={{ width: 7, height: 7, borderRadius: 2, background: 'var(--mx-accent)' }}/>Chapters 517 MB</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><i style={{ width: 7, height: 7, borderRadius: 2, background: 'var(--mx-text-4)' }}/>Cache 118 MB</span>
            </div>
          </div>

          {/* wifi-only rule */}
          <div style={{ padding: '4px 16px 6px', borderBottom: '1px solid var(--mx-border)' }}>
            <SwitchRow label="Download on Wi-Fi only" sub="Pauses the queue on cellular" on={true} onToggle={() => {}}/>
            <SwitchRow label="Auto-download new chapters" sub="For series in your Reading shelf" on={true} onToggle={() => {}}/>
          </div>

          {/* active queue */}
          <div style={{ padding: '16px 16px 4px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ font: '600 11px/1 var(--mx-display)', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--mx-text-3)' }}>In progress</span>
            <button style={{ background: 'none', border: 'none', color: 'var(--mx-text-3)', font: '500 11px/1 var(--mx-body)', cursor: 'pointer', padding: 0 }}>Pause all</button>
          </div>
          {queue.map((q, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, padding: '12px 16px', borderBottom: '1px solid var(--mx-border)', alignItems: 'center' }}>
              <CoverPlaceholder title={q.s} label="" style={{ width: 42, height: 60, flexShrink: 0 }}/>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ font: '600 13px/1.2 var(--mx-display)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{q.s}</div>
                <div style={{ font: '500 11px/1 var(--mx-body)', color: 'var(--mx-text-3)', marginTop: 5 }}>{q.ch} · {q.size}</div>
                <div style={{ marginTop: 9, display: 'flex', alignItems: 'center', gap: 9 }}>
                  <div style={{ flex: 1, height: 3, background: 'var(--mx-surface-3)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${q.pct}%`, background: q.state === 'downloading' ? 'var(--mx-accent)' : 'var(--mx-text-4)' }}/>
                  </div>
                  <span style={{ font: '500 10px/1 ui-monospace,monospace', color: q.state === 'downloading' ? 'var(--mx-accent)' : 'var(--mx-text-4)', letterSpacing: '.04em' }}>
                    {q.state === 'downloading' ? `${q.pct}%` : 'QUEUED'}
                  </span>
                </div>
              </div>
              <button style={{ background: 'var(--mx-surface-2)', border: 'none', color: 'var(--mx-text-3)', width: 28, height: 28, borderRadius: 999, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: 'pointer' }}>
                <Icon name="x" size={13}/>
              </button>
            </div>
          ))}

          {/* saved offline */}
          <div style={{ padding: '18px 16px 4px' }}>
            <span style={{ font: '600 11px/1 var(--mx-display)', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--mx-text-3)' }}>Saved offline</span>
          </div>
          {saved.map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, padding: '12px 16px', borderBottom: '1px solid var(--mx-border)', alignItems: 'center' }}>
              <CoverPlaceholder title={s.s} label="" style={{ width: 42, height: 60, flexShrink: 0 }}/>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ font: '600 13px/1.2 var(--mx-display)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.s}</div>
                <div style={{ font: '500 11px/1 var(--mx-body)', color: 'var(--mx-text-3)', marginTop: 5 }}>{s.n} chapters · {s.size}</div>
                <div style={{ font: '500 10px/1 ui-monospace,monospace', color: s.exp === 'Kept' ? 'var(--mx-text-4)' : 'var(--mx-accent)', marginTop: 6, letterSpacing: '.04em' }}>{s.exp.toUpperCase()}</div>
              </div>
              <span style={{ color: 'var(--mx-text-4)', flexShrink: 0 }}><Icon name="chevronR" size={15}/></span>
            </div>
          ))}
          <div style={{ height: 20 }}/>
        </div>
        <MobileTabBar active="library"/>
      </Phone>
    </div>
  );
}

Object.assign(window, {
  SheetSection, Seg, ModeGlyph, SwitchRow, SliderRow,
  ReaderSettingsMobile, ReaderEndChapterMobile, DownloadsMobile,
});
