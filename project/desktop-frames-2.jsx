// Series detail, Reader, Search frames — desktop

// ── Series Detail ─────────────────────────────────────────────────
function SeriesDesktop({ tweaks }) {
  const s = SERIES[0];
  return (
    <div style={{ ...themeVars(tweaks), minHeight: 1200 }}>
      <DesktopNav active="browse"/>
      {/* Banner */}
      <div style={{ position: 'relative', height: 320, overflow: 'hidden' }}>
        <CoverPlaceholder title={s.title} label="banner_2880x720.jpg" ratio="auto" style={{ height: '100%', aspectRatio: 'auto', borderRadius: 0 }} dim/>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(10,10,12,.4) 0%, rgba(10,10,12,.85) 70%, var(--mx-bg))' }}/>
      </div>

      <div style={{ maxWidth: 1376, margin: '-180px auto 0', padding: '0 32px 60px', position: 'relative' }}>
        {/* Header row */}
        <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr 320px', gap: 32, alignItems: 'flex-end', marginBottom: 36 }}>
          <CoverPlaceholder title={s.title} label="cover_high.jpg" style={{ width: 240, height: 340, borderRadius: 10, boxShadow: '0 20px 50px rgba(0,0,0,.6)' }}/>
          <div style={{ paddingBottom: 6 }}>
            <div style={{ font: '500 11px/1 var(--mx-display)', letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--mx-accent)', marginBottom: 12 }}>{s.demo} · {s.status}</div>
            <h1 style={{ font: '800 44px/1.05 var(--mx-display)', letterSpacing: '-.03em', margin: 0 }}>{s.title}</h1>
            <div style={{ font: '500 14px/1 var(--mx-body)', color: 'var(--mx-text-2)', marginTop: 14 }}>by {s.author} · Art by H. Inoue · {s.year}–present</div>
            <div style={{ display: 'flex', gap: 24, marginTop: 18, alignItems: 'center' }}>
              <Stars value={s.rating} count={s.ratings} size={14}/>
              <Stat icon="eye" label="Reads" value="2.4M"/>
              <Stat icon="bookmark" label="Library" value="184k"/>
              <Stat icon="comment" label="Comments" value="9.1k"/>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 18 }}>
              {s.tags.map(t => <Tag key={t} active>{t}</Tag>)}
              <Tag>Magic</Tag><Tag>Steampunk</Tag><Tag>Female lead</Tag><Tag>Slow burn</Tag>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button style={{
              padding: '14px 18px', font: '600 14px/1 var(--mx-display)',
              background: 'var(--mx-accent)', color: '#fff',
              border: 'none', borderRadius: 8, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}><Icon name="play" size={14}/> Continue Ch. 96</button>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <SecondaryBtn icon="bookmark">In library</SecondaryBtn>
              <SecondaryBtn icon="download">Download</SecondaryBtn>
              <SecondaryBtn icon="bell">Notify</SecondaryBtn>
              <SecondaryBtn icon="share">Share</SecondaryBtn>
            </div>
            <div style={{ marginTop: 4, padding: 12, background: 'var(--mx-surface)', border: '1px solid var(--mx-border)', borderRadius: 8 }}>
              <div style={{ font: '500 11px/1 var(--mx-display)', letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--mx-text-3)' }}>Reading progress</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 8 }}>
                <span style={{ font: '700 22px/1 var(--mx-display)' }}>96<span style={{ color: 'var(--mx-text-3)', fontWeight: 500 }}>/{s.chapters}</span></span>
                <span style={{ font: '500 11px/1 ui-monospace,monospace', color: 'var(--mx-text-3)' }}>67% · 3 ahead</span>
              </div>
              <div style={{ height: 4, background: 'var(--mx-surface-3)', borderRadius: 2, marginTop: 8, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '67%', background: 'var(--mx-accent)' }}/>
              </div>
            </div>
          </div>
        </div>

        {/* Tab bar */}
        <div style={{ display: 'flex', gap: 24, borderBottom: '1px solid var(--mx-border)', marginBottom: 28 }}>
          {['Chapters', 'About', 'Comments', 'Recommended'].map((t, i) => (
            <a key={t} style={{
              padding: '12px 0', font: '600 14px/1 var(--mx-display)', cursor: 'pointer',
              color: i === 0 ? 'var(--mx-text)' : 'var(--mx-text-3)',
              borderBottom: '2px solid ' + (i === 0 ? 'var(--mx-accent)' : 'transparent'),
              marginBottom: -1,
            }}>{t}{i === 2 ? <span style={{ marginLeft: 6, font: '600 10px/1 ui-monospace,monospace', padding: '2px 5px', borderRadius: 4, background: 'var(--mx-surface-2)', color: 'var(--mx-text-3)' }}>9.1k</span> : null}</a>
          ))}
        </div>

        {/* Two col: synopsis + chapter list */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 40 }}>
          <div>
            <SectionHd>Synopsis</SectionHd>
            <p style={{ font: '400 14.5px/1.65 var(--mx-body)', color: 'var(--mx-text-2)', maxWidth: 720, margin: 0 }}>
              In a city built atop the bones of an older one, the lanterns lit at dusk are not for travelers — they are for the dead. Hana, daughter of the last guild blacksmith, inherits both the forge and a debt: a single iron lantern that can summon any soul who has wronged her, with one caveat. She must hear them out.
            </p>
            <p style={{ font: '400 14.5px/1.65 var(--mx-body)', color: 'var(--mx-text-2)', maxWidth: 720, marginTop: 14 }}>
              As the city's clockwork courts close in on what they consider a heretic device, Hana must decide whether justice is something forged, summoned, or earned.
            </p>

            <div style={{ marginTop: 36, display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'space-between' }}>
              <SectionHd noMargin>Chapters <span style={{ color: 'var(--mx-text-3)', fontWeight: 500, fontSize: 14, marginLeft: 8 }}>142 total</span></SectionHd>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <SegToggle options={['Newest', 'Oldest']} active="Newest"/>
                <button style={{ font: '500 12px/1 var(--mx-body)', color: 'var(--mx-text-2)', background: 'var(--mx-surface)', border: '1px solid var(--mx-border)', padding: '6px 10px', borderRadius: 7, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <Icon name="download" size={12}/> Download all
                </button>
              </div>
            </div>
            <ChapterList/>
          </div>

          {/* Right rail */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ background: 'var(--mx-surface)', border: '1px solid var(--mx-border)', borderRadius: 10, padding: 18 }}>
              <SectionHd>Details</SectionHd>
              <DetailRow label="Author" value={s.author}/>
              <DetailRow label="Artist" value="H. Inoue"/>
              <DetailRow label="Status" value={s.status}/>
              <DetailRow label="Year" value={`${s.year}–present`}/>
              <DetailRow label="Demographic" value={s.demo}/>
              <DetailRow label="Magazine" value="Monthly Pulse"/>
              <DetailRow label="Translation" value="Volunteer · EN"/>
              <DetailRow label="Avg. update" value="every 9 days" last/>
            </div>
            <div>
              <SectionHd>You might like</SectionHd>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[SERIES[6], SERIES[3], SERIES[7], SERIES[11]].map(r => (
                  <div key={r.id}>
                    <CoverPlaceholder title={r.title}/>
                    <div style={{ font: '600 12px/1.25 var(--mx-display)', marginTop: 6, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{r.title}</div>
                    <Stars value={r.rating} size={10}/>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function SectionHd({ children, noMargin }) {
  return <div style={{ font: '700 16px/1 var(--mx-display)', letterSpacing: '-.01em', marginBottom: noMargin ? 0 : 14 }}>{children}</div>;
}
function DetailRow({ label, value, last }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: last ? 'none' : '1px solid var(--mx-border)', font: '500 12.5px/1.3 var(--mx-body)' }}>
      <span style={{ color: 'var(--mx-text-3)' }}>{label}</span>
      <span style={{ color: 'var(--mx-text)' }}>{value}</span>
    </div>
  );
}
function Stat({ icon, label, value }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 7, color: 'var(--mx-text-3)', font: '500 12px/1 var(--mx-body)' }}>
      <Icon name={icon} size={14}/>
      <span style={{ color: 'var(--mx-text)', font: '600 13px/1 var(--mx-display)' }}>{value}</span>
      <span>{label}</span>
    </div>
  );
}
function SecondaryBtn({ icon, children }) {
  return (
    <button style={{
      padding: '10px 12px', font: '500 12.5px/1 var(--mx-display)',
      background: 'var(--mx-surface)', color: 'var(--mx-text)',
      border: '1px solid var(--mx-border)', borderRadius: 8, cursor: 'pointer',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
    }}><Icon name={icon} size={13}/>{children}</button>
  );
}

function ChapterList() {
  const ch = Array.from({ length: 12 }, (_, i) => {
    const num = 142 - i;
    const titles = ['The Lantern Speaks', 'A Debt Collected', 'Brass and Salt', 'The Ninth Court', 'Forge Smoke', 'Hana, Alone', 'Old Apologies', 'A Wound that Hums', 'Iron Children', 'Beneath the Carriageway', 'The Bell at Dusk', 'Coin and Quiet'];
    return { num, title: titles[i], date: ['2 days ago','9 days','18 days','27 days','1 mo','1 mo','2 mo','2 mo','3 mo','3 mo','4 mo','4 mo'][i], read: i > 2, current: i === 2, pages: [38, 42, 36, 40, 38, 44, 36, 40, 38, 42, 36, 40][i] };
  });
  return (
    <div style={{ marginTop: 14, border: '1px solid var(--mx-border)', borderRadius: 10, overflow: 'hidden', background: 'var(--mx-surface)' }}>
      {ch.map(c => (
        <div key={c.num} style={{
          display: 'grid', gridTemplateColumns: '60px 1fr 90px 90px 70px',
          padding: '12px 14px', alignItems: 'center', gap: 14,
          borderBottom: '1px solid var(--mx-border)',
          background: c.current ? 'var(--mx-accent-soft)' : 'transparent',
          opacity: c.read ? 0.55 : 1,
        }}>
          <div style={{ font: '700 13px/1 var(--mx-display)', color: c.current ? 'var(--mx-accent)' : 'var(--mx-text)' }}>Ch. {c.num}</div>
          <div style={{ font: '500 13.5px/1.3 var(--mx-body)', color: 'var(--mx-text)' }}>
            {c.title}
            {c.current && <span style={{ marginLeft: 8, font: '600 10px/1 ui-monospace,monospace', color: 'var(--mx-accent)' }}>● READING</span>}
            {c.read && <span style={{ marginLeft: 8, color: 'var(--mx-text-4)' }}><Icon name="check" size={11}/></span>}
          </div>
          <div style={{ font: '500 11.5px/1 ui-monospace,monospace', color: 'var(--mx-text-3)' }}>{c.pages} pages</div>
          <div style={{ font: '500 11.5px/1 var(--mx-body)', color: 'var(--mx-text-3)' }}>{c.date}</div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, color: 'var(--mx-text-3)' }}>
            <Icon name="download" size={14}/>
            <Icon name="bookmark" size={14}/>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Reader ────────────────────────────────────────────────────────
// Vertical scroll, immersive (chrome auto-hides). We show two states:
// "chrome visible" so reviewers see the full UI, and a cleaner immersive mock.
function ReaderDesktop({ tweaks, chromeVisible = true }) {
  return (
    <div style={{ ...themeVars(tweaks), minHeight: 1080, background: '#0a0a0c' }}>
      {/* Top chrome */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 50,
        opacity: chromeVisible ? 1 : 0, transition: 'opacity .2s',
        height: 56, padding: '0 24px', display: 'flex', alignItems: 'center', gap: 18,
        background: 'rgba(10,10,12,.92)', backdropFilter: 'blur(18px)',
        borderBottom: '1px solid var(--mx-border)',
      }}>
        <a style={{ display: 'flex', alignItems: 'center', gap: 8, font: '500 13px/1 var(--mx-body)', color: 'var(--mx-text-2)', cursor: 'pointer' }}>
          <Icon name="chevronL" size={14}/> Back to series
        </a>
        <div style={{ width: 1, height: 22, background: 'var(--mx-border)' }}/>
        <div style={{ minWidth: 0 }}>
          <div style={{ font: '600 13.5px/1.1 var(--mx-display)', letterSpacing: '-.01em' }}>Iron Lantern · Ch. 96 — A Wound that Hums</div>
          <div style={{ font: '500 11px/1 var(--mx-body)', color: 'var(--mx-text-3)', marginTop: 3 }}>by K. Mori · 38 pages · translated by stoa-ttl</div>
        </div>
        <div style={{ flex: 1 }}/>
        <ChromeBtn icon="chevronL" label="Prev"/>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 12px', background: 'var(--mx-surface)', border: '1px solid var(--mx-border)', borderRadius: 7, height: 32 }}>
          <span style={{ font: '600 12px/1 ui-monospace,monospace', color: 'var(--mx-text)' }}>96</span>
          <Icon name="chevronD" size={11}/>
        </div>
        <ChromeBtn icon="chevronR" label="Next"/>
        <div style={{ width: 1, height: 22, background: 'var(--mx-border)' }}/>
        <ChromeBtn icon="comment" label="Comments" badge="2.1k"/>
        <ChromeBtn icon="bookmark"/>
        <ChromeBtn icon="settings"/>
      </div>

      {/* Reading column */}
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 0 80px' }}>
        {[1, 2, 3, 4].map(p => (
          <div key={p} style={{ marginBottom: 8 }}>
            <CoverPlaceholder title={`Page ${p + 5}`} label={`pg_${String(p + 5).padStart(3, '0')}.webp`} ratio={5/7} style={{ borderRadius: 4, aspectRatio: '5/7' }}/>
          </div>
        ))}
        {/* End-of-chapter */}
        <div style={{ marginTop: 32, padding: 28, background: 'var(--mx-surface)', border: '1px solid var(--mx-border)', borderRadius: 12, textAlign: 'center' }}>
          <div style={{ font: '500 11px/1 var(--mx-display)', letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--mx-text-3)' }}>End of chapter 96</div>
          <div style={{ font: '700 24px/1.2 var(--mx-display)', letterSpacing: '-.02em', marginTop: 12 }}>How was it?</div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 14 }}>
            {[1,2,3,4,5].map(i => (
              <button key={i} style={{
                width: 36, height: 36, borderRadius: 8,
                background: i <= 4 ? 'var(--mx-accent-soft)' : 'var(--mx-surface-2)',
                color: i <= 4 ? 'var(--mx-accent)' : 'var(--mx-text-4)',
                border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}><Icon name="star" size={18}/></button>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 22 }}>
            <button style={{ padding: '12px 22px', background: 'var(--mx-accent)', color: '#fff', border: 'none', borderRadius: 8, font: '600 13px/1 var(--mx-display)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
              Next chapter · Ch. 97 <Icon name="chevronR" size={13}/>
            </button>
            <button style={{ padding: '12px 16px', background: 'var(--mx-surface-2)', color: 'var(--mx-text)', border: '1px solid var(--mx-border)', borderRadius: 8, font: '500 13px/1 var(--mx-display)', cursor: 'pointer' }}>
              Back to series
            </button>
          </div>
        </div>
        {/* Comments */}
        <div style={{ marginTop: 36 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 14 }}>
            <div style={{ font: '700 16px/1 var(--mx-display)' }}>Discussion</div>
            <div style={{ font: '500 12px/1 var(--mx-body)', color: 'var(--mx-text-3)' }}>2,108 comments · this chapter only</div>
          </div>
          <CommentBox/>
          {[
            { name: 'silverfen', mins: '12 min ago', stars: 5, body: 'The panel where the lantern hums on the carriageway floor — that\'s the best beat Mori has done all year. Tactile, quiet, and you can almost hear it.', up: 412, replies: 38 },
            { name: 'odessa.k', mins: '47 min ago', stars: 4, body: 'I love this arc but pacing\'s slipping. We\'ve had two chapters of build with the same antagonist staring at the bell. Feels like he\'s waiting for the cliffhanger to find him.', up: 220, replies: 64 },
            { name: 'm_takeshi', mins: '1 h ago', stars: 5, body: 'Hana finally raising her voice in panel 7 — chills. Translation is also notably better this chapter, big shoutout to the stoa-ttl team.', up: 198, replies: 12 },
          ].map((c, i) => <Comment key={i} {...c}/>)}
        </div>
      </div>

      {/* Bottom progress bar (immersive minimal chrome) */}
      <div style={{ position: 'sticky', bottom: 0, height: 6, background: 'var(--mx-surface)', borderTop: '1px solid var(--mx-border)' }}>
        <div style={{ height: '100%', width: '34%', background: 'var(--mx-accent)' }}/>
      </div>
    </div>
  );
}

function ChromeBtn({ icon, label, badge }) {
  return (
    <button style={{
      height: 32, padding: label ? '0 10px' : '0 8px',
      display: 'inline-flex', alignItems: 'center', gap: 6,
      background: 'transparent', border: '1px solid transparent',
      color: 'var(--mx-text-2)', font: '500 12px/1 var(--mx-body)',
      borderRadius: 7, cursor: 'pointer',
    }}>
      <Icon name={icon} size={14}/>
      {label}
      {badge && <span style={{ font: '600 10px/1 ui-monospace,monospace', color: 'var(--mx-accent)' }}>{badge}</span>}
    </button>
  );
}

function CommentBox() {
  return (
    <div style={{ display: 'flex', gap: 12, padding: 14, background: 'var(--mx-surface)', border: '1px solid var(--mx-border)', borderRadius: 10, marginBottom: 18 }}>
      <Avatar name="HM" size={32}/>
      <div style={{ flex: 1, minHeight: 60, font: '400 13px/1.5 var(--mx-body)', color: 'var(--mx-text-4)' }}>
        Share what you thought about this chapter…
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 }}>
          <div style={{ display: 'flex', gap: 12, color: 'var(--mx-text-3)' }}>
            <span style={{ font: '500 11px/1 var(--mx-body)' }}>Markdown supported</span>
            <span style={{ font: '500 11px/1 var(--mx-body)' }}>·</span>
            <span style={{ font: '500 11px/1 var(--mx-body)' }}>Spoiler tags</span>
          </div>
          <button style={{ padding: '7px 14px', font: '500 12px/1 var(--mx-display)', background: 'var(--mx-surface-3)', color: 'var(--mx-text-3)', border: 'none', borderRadius: 6, cursor: 'pointer' }}>Post</button>
        </div>
      </div>
    </div>
  );
}

function Comment({ name, mins, stars, body, up, replies }) {
  return (
    <div style={{ display: 'flex', gap: 12, padding: '14px 0', borderBottom: '1px solid var(--mx-border)' }}>
      <Avatar name={name} size={32}/>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, font: '500 12px/1 var(--mx-body)', color: 'var(--mx-text-3)' }}>
          <span style={{ color: 'var(--mx-text)', fontWeight: 600 }}>{name}</span>
          <Stars value={stars} size={9} showValue={false}/>
          <span>·</span>
          <span>{mins}</span>
        </div>
        <div style={{ font: '400 13.5px/1.55 var(--mx-body)', color: 'var(--mx-text)', marginTop: 8 }}>{body}</div>
        <div style={{ display: 'flex', gap: 16, marginTop: 8, font: '500 12px/1 var(--mx-body)', color: 'var(--mx-text-3)' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><Icon name="chevronU" size={11}/> {up}</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><Icon name="comment" size={11}/> {replies} replies</span>
          <span>Reply</span>
          <span>Share</span>
        </div>
      </div>
    </div>
  );
}

// ── Search ────────────────────────────────────────────────────────
function SearchDesktop({ tweaks }) {
  return (
    <div style={{ ...themeVars(tweaks), minHeight: 900 }}>
      <DesktopNav active="" search="iron"/>
      <div style={{ maxWidth: 880, margin: '0 auto', padding: '40px 32px 60px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 22 }}>
          <div style={{ font: '700 28px/1 var(--mx-display)', letterSpacing: '-.025em' }}>Results for "iron"</div>
          <div style={{ font: '500 12px/1 var(--mx-body)', color: 'var(--mx-text-3)' }}>148 titles · 312 chapters · 26 authors</div>
        </div>
        <div style={{ display: 'flex', gap: 6, marginBottom: 26 }}>
          <Tag active>All</Tag>
          <Tag>Titles <span style={{ opacity: .55 }}>148</span></Tag>
          <Tag>Authors <span style={{ opacity: .55 }}>26</span></Tag>
          <Tag>Chapters <span style={{ opacity: .55 }}>312</span></Tag>
          <Tag>Tags <span style={{ opacity: .55 }}>4</span></Tag>
        </div>

        <Group title="Top match">
          <SearchHit big series={SERIES[0]}/>
        </Group>
        <Group title="Other titles">
          {[SERIES[4], SERIES[6], SERIES[8]].map(s => <SearchHit key={s.id} series={s}/>)}
        </Group>
        <Group title="Authors">
          {['K. Mori', 'I. Iron-Tate', 'D. Iron'].map((a, i) => (
            <div key={a} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '10px 0', borderBottom: '1px solid var(--mx-border)' }}>
              <Avatar name={a} size={40}/>
              <div style={{ flex: 1 }}>
                <div style={{ font: '600 14px/1 var(--mx-display)' }}>{a}</div>
                <div style={{ font: '500 12px/1 var(--mx-body)', color: 'var(--mx-text-3)', marginTop: 5 }}>{[8, 3, 1][i]} series · {[412, 84, 12][i]}k library adds</div>
              </div>
              <button style={{ padding: '7px 12px', font: '500 12px/1 var(--mx-display)', background: 'transparent', border: '1px solid var(--mx-border)', color: 'var(--mx-text)', borderRadius: 7, cursor: 'pointer' }}>Follow</button>
            </div>
          ))}
        </Group>
        <Group title={'Chapters mentioning "iron"'}>
          {[
            { s: 'Iron Lantern', c: 96, t: 'A Wound that Hums', snippet: 'The iron lantern hummed, low and patient, like it had been waiting…' },
            { s: 'Iron Lantern', c: 12, t: 'Brass and Salt', snippet: 'Hana wiped the iron filings into the salt-bath and watched them…' },
            { s: 'Old Gods of the Ginza', c: 41, t: 'The Iron Way', snippet: 'There is a road called the iron way that runs the length of the…' },
          ].map((r, i) => (
            <div key={i} style={{ padding: '12px 0', borderBottom: '1px solid var(--mx-border)' }}>
              <div style={{ font: '500 11.5px/1 var(--mx-body)', color: 'var(--mx-text-3)' }}>{r.s} · Ch. {r.c}</div>
              <div style={{ font: '600 14px/1.3 var(--mx-display)', marginTop: 5 }}>{r.t}</div>
              <div style={{ font: '400 13px/1.5 var(--mx-body)', color: 'var(--mx-text-2)', marginTop: 6 }}>…{r.snippet.split('iron').map((p, j, arr) => <React.Fragment key={j}>{p}{j < arr.length - 1 && <mark style={{ background: 'var(--mx-accent-soft)', color: 'var(--mx-accent)', padding: '1px 3px', borderRadius: 3, fontWeight: 600 }}>iron</mark>}</React.Fragment>)}…</div>
            </div>
          ))}
        </Group>
      </div>
    </div>
  );
}

function Group({ title, children }) {
  return (
    <div style={{ marginBottom: 30 }}>
      <div style={{ font: '600 11px/1 var(--mx-display)', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--mx-text-3)', marginBottom: 12 }}>{title}</div>
      {children}
    </div>
  );
}

function SearchHit({ series, big = false }) {
  return (
    <div style={{ display: 'flex', gap: 16, padding: '12px 0', borderBottom: '1px solid var(--mx-border)' }}>
      <CoverPlaceholder title={series.title} style={{ width: big ? 90 : 60, height: big ? 126 : 84, flexShrink: 0 }}/>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ font: `600 ${big ? 17 : 14}px/1.2 var(--mx-display)`, letterSpacing: '-.01em' }}>{series.title}</div>
        <div style={{ font: '500 12px/1 var(--mx-body)', color: 'var(--mx-text-3)', marginTop: 6 }}>{series.author} · {series.year} · Ch. {series.chapters}</div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginTop: 10 }}>
          <Stars value={series.rating} size={11}/>
          {series.tags.map(t => <Tag key={t} size="sm">{t}</Tag>)}
        </div>
        {big && (
          <div style={{ font: '400 13px/1.5 var(--mx-body)', color: 'var(--mx-text-2)', marginTop: 10, maxWidth: 540 }}>
            A blacksmith's daughter inherits a lantern that summons the dead. Featured in the editor's pick this month.
          </div>
        )}
      </div>
      <button style={{ alignSelf: 'flex-start', padding: '7px 12px', font: '500 12px/1 var(--mx-display)', background: 'var(--mx-surface)', border: '1px solid var(--mx-border)', color: 'var(--mx-text)', borderRadius: 7, cursor: 'pointer' }}>Open</button>
    </div>
  );
}

// ── Library ───────────────────────────────────────────────────────
function LibraryDesktop({ tweaks }) {
  const tabs = ['Reading', 'Plan to read', 'Completed', 'On hold', 'Dropped'];
  const counts = [12, 47, 28, 5, 3];
  return (
    <div style={{ ...themeVars(tweaks), minHeight: 1080 }}>
      <DesktopNav active="library"/>
      <div style={{ maxWidth: 1376, margin: '0 auto', padding: '32px 32px 60px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 22 }}>
          <div>
            <div style={{ font: '700 28px/1 var(--mx-display)', letterSpacing: '-.025em' }}>Library</div>
            <div style={{ font: '500 13px/1 var(--mx-body)', color: 'var(--mx-text-3)', marginTop: 8 }}>95 titles · 1,438 chapters read · 4d 12h estimated</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <SecondaryBtn icon="download">Download for offline</SecondaryBtn>
            <SecondaryBtn icon="settings">Manage shelves</SecondaryBtn>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid var(--mx-border)', marginBottom: 24 }}>
          {tabs.map((t, i) => (
            <a key={t} style={{
              padding: '12px 14px', font: '600 13.5px/1 var(--mx-display)',
              color: i === 0 ? 'var(--mx-text)' : 'var(--mx-text-3)',
              borderBottom: '2px solid ' + (i === 0 ? 'var(--mx-accent)' : 'transparent'),
              marginBottom: -1, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8,
            }}>{t} <span style={{ font: '600 10px/1 ui-monospace,monospace', color: 'var(--mx-text-4)' }}>{counts[i]}</span></a>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 22 }}>
          <Tag active>All shelves</Tag>
          <Tag>Long-form</Tag>
          <Tag>Re-reading</Tag>
          <Tag>Sci-Fi pile</Tag>
          <Tag>+ New shelf</Tag>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            <SegToggle options={['Grid', 'List']} active="List"/>
            <button style={{ font: '500 12px/1 var(--mx-body)', color: 'var(--mx-text-2)', background: 'var(--mx-surface)', border: '1px solid var(--mx-border)', padding: '7px 10px', borderRadius: 7, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              Last read <Icon name="chevronD" size={11}/>
            </button>
          </div>
        </div>
        <div style={{ background: 'var(--mx-surface)', border: '1px solid var(--mx-border)', borderRadius: 10, overflow: 'hidden' }}>
          {SERIES.slice(0, 8).map((s, i) => (
            <div key={s.id} style={{
              display: 'grid', gridTemplateColumns: '60px 1fr 200px 130px 110px 130px',
              padding: '14px 16px', alignItems: 'center', gap: 16,
              borderBottom: i < 7 ? '1px solid var(--mx-border)' : 'none',
            }}>
              <CoverPlaceholder title={s.title} style={{ width: 50, height: 70 }}/>
              <div style={{ minWidth: 0 }}>
                <div style={{ font: '600 14px/1.2 var(--mx-display)' }}>{s.title}</div>
                <div style={{ font: '500 11.5px/1 var(--mx-body)', color: 'var(--mx-text-3)', marginTop: 6 }}>{s.author} · {s.tags.join(' · ')}</div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', font: '500 11px/1 ui-monospace,monospace', color: 'var(--mx-text-3)', marginBottom: 6 }}>
                  <span>Ch. {s.chapters - i - 2}/{s.chapters}</span>
                  <span>{Math.round((s.chapters - i - 2) / s.chapters * 100)}%</span>
                </div>
                <div style={{ height: 3, background: 'var(--mx-surface-3)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${(s.chapters - i - 2) / s.chapters * 100}%`, background: 'var(--mx-accent)' }}/>
                </div>
              </div>
              <div style={{ font: '500 12px/1 var(--mx-body)', color: 'var(--mx-text-3)' }}>
                <div style={{ color: i === 0 ? 'var(--mx-accent)' : 'var(--mx-text-2)', fontWeight: i === 0 ? 600 : 500 }}>{i === 0 ? 'New chapter' : ['9 days', '18 days', '1 mo', '1 mo', '2 mo', '3 mo', '4 mo'][i - 1]}</div>
                <div style={{ marginTop: 4, fontSize: 11 }}>last read</div>
              </div>
              <div style={{ display: 'flex', gap: 4, color: 'var(--mx-text-3)' }}>
                {[1, 2, 3].includes(i) ? <span style={{ color: 'var(--mx-accent)', font: '600 11px/1 ui-monospace,monospace' }}>● Cached</span> : null}
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button style={{ padding: '7px 12px', font: '500 12px/1 var(--mx-display)', background: 'var(--mx-accent)', border: 'none', color: '#fff', borderRadius: 6, cursor: 'pointer' }}>Continue</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { SeriesDesktop, ReaderDesktop, SearchDesktop, LibraryDesktop, ChromeBtn, ChapterList });
