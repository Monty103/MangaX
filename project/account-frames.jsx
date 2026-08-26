// Auth + Account/Settings frames

// ── Sign in (desktop) ─────────────────────────────────────────────
function SignInDesktop({ tweaks, mode = 'signin' }) {
  const isUp = mode === 'signup';
  return (
    <div style={{ ...themeVars(tweaks), minHeight: 1080, display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
      {/* Left art panel */}
      <div style={{ position: 'relative', overflow: 'hidden', borderRight: '1px solid var(--mx-border)' }}>
        <CoverPlaceholder title="Iron Lantern" label="auth_art.jpg" ratio="auto" style={{ height: '100%', aspectRatio: 'auto', borderRadius: 0 }}/>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(10,10,12,.55), rgba(10,10,12,.85))' }}/>
        <div style={{ position: 'absolute', inset: 0, padding: 56, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, font: '700 22px/1 var(--mx-display)', letterSpacing: '-.02em' }}>
            <div style={{ width: 26, height: 26, background: 'var(--mx-accent)', borderRadius: 5, position: 'relative' }}>
              <div style={{ position: 'absolute', inset: '5px 5px 5px 11px', background: '#0a0a0c', borderRadius: 1 }}/>
            </div>
            MangaX
          </div>
          <div>
            <div style={{ font: '500 11px/1 var(--mx-display)', letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--mx-accent)', marginBottom: 14 }}>Built for long sessions</div>
            <div style={{ font: '700 38px/1.1 var(--mx-display)', letterSpacing: '-.025em', maxWidth: 480 }}>
              Your library, your reading position, on every device — at the speed your night demands.
            </div>
            <div style={{ display: 'flex', gap: 24, marginTop: 28 }}>
              <Stat icon="book" label="Titles" value="38k+"/>
              <Stat icon="flame" label="Updated daily" value="2.1k"/>
              <Stat icon="user" label="Readers" value="1.4M"/>
            </div>
          </div>
          <div style={{ font: '400 12px/1.5 var(--mx-body)', color: 'var(--mx-text-3)', maxWidth: 460 }}>
            "Iron Lantern" art by H. Inoue · used as MangaX banner placeholder.
          </div>
        </div>
      </div>

      {/* Right form */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px 80px', maxWidth: 540, width: '100%', margin: '0 auto' }}>
        <div style={{ font: '700 32px/1.1 var(--mx-display)', letterSpacing: '-.025em', marginBottom: 8 }}>
          {isUp ? 'Create your account' : 'Welcome back'}
        </div>
        <div style={{ font: '400 14px/1.5 var(--mx-body)', color: 'var(--mx-text-3)', marginBottom: 32 }}>
          {isUp
            ? 'A reader account syncs your progress, library, downloads, and the design tweaks you make.'
            : 'Sign in to pick up where you left off across devices.'}
        </div>

        {/* SSO row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 24 }}>
          <SSOBtn label="Google" glyph="G"/>
          <SSOBtn label="Apple" glyph=""/>
          <SSOBtn label="Discord" glyph="D"/>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'var(--mx-text-4)', font: '500 11px/1 var(--mx-body)', letterSpacing: '.1em', textTransform: 'uppercase', margin: '8px 0 22px' }}>
          <div style={{ flex: 1, height: 1, background: 'var(--mx-border)' }}/>
          or with email
          <div style={{ flex: 1, height: 1, background: 'var(--mx-border)' }}/>
        </div>

        {isUp && (
          <Field label="Display name" value="" placeholder="silverfen"/>
        )}
        <Field label="Email" value={isUp ? '' : 'reader@yokai.cafe'} placeholder="you@example.com" type="email"/>
        <Field label={isUp ? 'Create password' : 'Password'} value="" placeholder="••••••••••" type="password" hint={isUp ? 'At least 10 characters' : null} forgot={!isUp}/>

        {!isUp && (
          <label style={{ display: 'flex', alignItems: 'center', gap: 9, font: '500 12.5px/1 var(--mx-body)', color: 'var(--mx-text-2)', marginTop: 6 }}>
            <span style={{ width: 16, height: 16, borderRadius: 4, border: '1px solid var(--mx-accent)', background: 'var(--mx-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}><Icon name="check" size={11} strokeWidth={2.4}/></span>
            Keep me signed in for 30 days
          </label>
        )}
        {isUp && (
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: 9, font: '500 12.5px/1.5 var(--mx-body)', color: 'var(--mx-text-2)', marginTop: 6 }}>
            <span style={{ width: 16, height: 16, marginTop: 1, borderRadius: 4, border: '1px solid var(--mx-border-strong)', flexShrink: 0 }}/>
            I'm 16+ and I've read the <a style={{ color: 'var(--mx-accent)' }}>Terms</a> and <a style={{ color: 'var(--mx-accent)' }}>Privacy Notice</a>.
          </label>
        )}

        <button style={{
          marginTop: 24, padding: '14px 18px', font: '600 14px/1 var(--mx-display)',
          background: 'var(--mx-accent)', color: '#fff', border: 'none', borderRadius: 9, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>{isUp ? 'Create account' : 'Sign in'} <Icon name="arrowR" size={14}/></button>

        <div style={{ marginTop: 22, font: '500 13px/1 var(--mx-body)', color: 'var(--mx-text-3)' }}>
          {isUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <a style={{ color: 'var(--mx-accent)', fontWeight: 600 }}>{isUp ? 'Sign in' : 'Create one'}</a>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, placeholder, type = 'text', hint, forgot }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
        <label style={{ font: '500 12px/1 var(--mx-display)', letterSpacing: '.04em', color: 'var(--mx-text-2)' }}>{label}</label>
        {forgot && <a style={{ font: '500 11.5px/1 var(--mx-body)', color: 'var(--mx-accent)' }}>Forgot password?</a>}
      </div>
      <div style={{
        height: 44, padding: '0 14px', borderRadius: 9,
        background: 'var(--mx-surface)', border: '1px solid var(--mx-border)',
        display: 'flex', alignItems: 'center',
        font: `400 14px/1 var(--mx-body)`,
        color: value ? 'var(--mx-text)' : 'var(--mx-text-4)',
      }}>{value || placeholder}{type === 'password' && value && <span style={{ marginLeft: 'auto', color: 'var(--mx-text-3)' }}><Icon name="eye" size={14}/></span>}</div>
      {hint && <div style={{ font: '400 11.5px/1 var(--mx-body)', color: 'var(--mx-text-3)', marginTop: 6 }}>{hint}</div>}
    </div>
  );
}

function SSOBtn({ label, glyph }) {
  return (
    <button style={{
      height: 42, padding: '0 12px', font: '500 13px/1 var(--mx-display)',
      background: 'var(--mx-surface)', color: 'var(--mx-text)',
      border: '1px solid var(--mx-border)', borderRadius: 9, cursor: 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    }}>
      <span style={{ font: '700 15px/1 var(--mx-display)', width: 18, textAlign: 'center' }}>{glyph}</span>
      {label}
    </button>
  );
}

// ── Sign in (mobile) ──────────────────────────────────────────────
function SignInMobile({ tweaks }) {
  return (
    <div style={themeVars(tweaks)}>
      <Phone>
        <div style={{ flex: 1, padding: '0 24px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ paddingTop: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, font: '700 18px/1 var(--mx-display)', letterSpacing: '-.02em' }}>
              <div style={{ width: 22, height: 22, background: 'var(--mx-accent)', borderRadius: 4, position: 'relative' }}>
                <div style={{ position: 'absolute', inset: '4px 4px 4px 9px', background: '#0a0a0c', borderRadius: 1 }}/>
              </div>
              MangaX
            </div>
            <a style={{ font: '500 12px/1 var(--mx-body)', color: 'var(--mx-text-2)' }}>Skip</a>
          </div>

          <div style={{ marginTop: 56 }}>
            <div style={{ font: '700 28px/1.15 var(--mx-display)', letterSpacing: '-.025em' }}>Welcome back</div>
            <div style={{ font: '400 13.5px/1.5 var(--mx-body)', color: 'var(--mx-text-3)', marginTop: 10 }}>Sign in to pick up where you left off.</div>
          </div>

          <div style={{ marginTop: 28 }}>
            <Field label="Email" value="reader@yokai.cafe" placeholder="you@example.com"/>
            <Field label="Password" value="" placeholder="••••••••••" type="password" forgot/>
            <button style={{
              width: '100%', marginTop: 10, padding: '14px', font: '600 14px/1 var(--mx-display)',
              background: 'var(--mx-accent)', color: '#fff', border: 'none', borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}>Sign in <Icon name="arrowR" size={14}/></button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'var(--mx-text-4)', font: '500 10.5px/1 var(--mx-body)', letterSpacing: '.1em', textTransform: 'uppercase', margin: '28px 0 18px' }}>
            <div style={{ flex: 1, height: 1, background: 'var(--mx-border)' }}/> OR <div style={{ flex: 1, height: 1, background: 'var(--mx-border)' }}/>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <SSOBtn label="Continue with Apple" glyph=""/>
            <SSOBtn label="Continue with Google" glyph="G"/>
            <SSOBtn label="Continue with Discord" glyph="D"/>
          </div>

          <div style={{ flex: 1 }}/>
          <div style={{ padding: '24px 0 32px', textAlign: 'center', font: '500 13px/1 var(--mx-body)', color: 'var(--mx-text-3)' }}>
            New here?{' '}<a style={{ color: 'var(--mx-accent)', fontWeight: 600 }}>Create an account</a>
          </div>
        </div>
      </Phone>
    </div>
  );
}

// ── Settings shell ────────────────────────────────────────────────
const SETTINGS_TABS = [
  { id: 'account', label: 'Account', icon: 'user' },
  { id: 'design', label: 'Design', icon: 'settings' },
  { id: 'reading', label: 'Reading', icon: 'book' },
  { id: 'notifications', label: 'Notifications', icon: 'bell' },
  { id: 'downloads', label: 'Downloads', icon: 'download' },
  { id: 'privacy', label: 'Privacy & data', icon: 'eye' },
];

function SettingsShell({ tweaks, active = 'design', children }) {
  return (
    <div style={{ ...themeVars(tweaks), minHeight: 1080 }}>
      <DesktopNav active=""/>
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 40, padding: '32px 32px 60px', maxWidth: 1280, margin: '0 auto' }}>
        <aside>
          <div style={{ font: '700 24px/1 var(--mx-display)', letterSpacing: '-.025em', marginBottom: 18 }}>Settings</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {SETTINGS_TABS.map(t => (
              <a key={t.id} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 12px', borderRadius: 8, cursor: 'pointer',
                font: '500 13.5px/1 var(--mx-body)',
                background: active === t.id ? 'var(--mx-surface-2)' : 'transparent',
                color: active === t.id ? 'var(--mx-text)' : 'var(--mx-text-2)',
                borderLeft: '2px solid ' + (active === t.id ? 'var(--mx-accent)' : 'transparent'),
                paddingLeft: active === t.id ? 14 : 14,
              }}>
                <Icon name={t.icon} size={16}/>
                {t.label}
              </a>
            ))}
          </div>
          <div style={{ marginTop: 28, padding: 14, background: 'var(--mx-surface)', border: '1px solid var(--mx-border)', borderRadius: 10 }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <Avatar name="Hana M" size={36}/>
              <div style={{ minWidth: 0 }}>
                <div style={{ font: '600 13px/1.2 var(--mx-display)' }}>silverfen</div>
                <div style={{ font: '500 11px/1 var(--mx-body)', color: 'var(--mx-text-3)', marginTop: 4 }}>Pro · since Apr 2024</div>
              </div>
            </div>
            <button style={{ marginTop: 12, width: '100%', padding: '8px', font: '500 12px/1 var(--mx-display)', background: 'transparent', border: '1px solid var(--mx-border)', color: 'var(--mx-text-2)', borderRadius: 7, cursor: 'pointer' }}>Sign out</button>
          </div>
        </aside>
        <main>{children}</main>
      </div>
    </div>
  );
}

// ── Design tab content ────────────────────────────────────────────
const ACCENT_PRESETS = [
  { id: 'crimson', hex: '#ff2e4d', name: 'Crimson' },
  { id: 'amber',   hex: '#ff9e2c', name: 'Amber' },
  { id: 'iris',    hex: '#7c5cff', name: 'Iris' },
  { id: 'mint',    hex: '#34d399', name: 'Mint' },
  { id: 'rose',    hex: '#fb7185', name: 'Rose' },
  { id: 'azure',   hex: '#38bdf8', name: 'Azure' },
  { id: 'ember',   hex: '#fb923c', name: 'Ember' },
  { id: 'sage',    hex: '#a3e635', name: 'Sage' },
];

const THEME_PRESETS = [
  { id: 'midnight', name: 'Midnight', bg: '#0a0a0c', surface: '#131318' },
  { id: 'graphite', name: 'Graphite', bg: '#16181d', surface: '#22252c' },
  { id: 'paper',    name: 'Paper', bg: '#f4f1ea', surface: '#fff' },
  { id: 'sepia',    name: 'Sepia', bg: '#1c1812', surface: '#2a2419' },
  { id: 'oled',     name: 'OLED black', bg: '#000', surface: '#0c0c0f' },
];

function DesignTabDesktop({ tweaks }) {
  const accent = ACCENTS[tweaks.accent] || ACCENTS.crimson;
  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <div style={{ font: '700 28px/1 var(--mx-display)', letterSpacing: '-.025em' }}>Design</div>
        <div style={{ font: '400 13px/1.5 var(--mx-body)', color: 'var(--mx-text-3)', marginTop: 8 }}>
          Make MangaX feel like yours. Changes here sync across all your devices.
        </div>
      </div>

      {/* Live preview card */}
      <div style={{ marginBottom: 32, padding: 20, background: 'var(--mx-surface)', border: '1px solid var(--mx-border)', borderRadius: 12 }}>
        <div style={{ font: '600 11px/1 var(--mx-display)', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--mx-text-3)', marginBottom: 14 }}>Live preview</div>
        <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 18, alignItems: 'center' }}>
          <CoverPlaceholder title="Iron Lantern" label="" style={{ width: 120, height: 168 }} badge="Hot"/>
          <div>
            <div style={{ font: '700 22px/1.15 var(--mx-display)', letterSpacing: '-.02em' }}>Iron Lantern</div>
            <div style={{ display: 'flex', gap: 10, marginTop: 8, alignItems: 'center', font: '500 12px/1 var(--mx-body)', color: 'var(--mx-text-3)' }}>
              <Stars value={4.7} count={12840}/> · K. Mori · Ch. 142
            </div>
            <div style={{ display: 'flex', gap: 6, marginTop: 14, flexWrap: 'wrap' }}>
              <Tag active>Action</Tag><Tag active>Supernatural</Tag><Tag>Magic</Tag><Tag>Female lead</Tag>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <button style={{ padding: '10px 14px', font: '600 12.5px/1 var(--mx-display)', background: 'var(--mx-accent)', color: '#fff', border: 'none', borderRadius: 7, display: 'flex', alignItems: 'center', gap: 6 }}><Icon name="play" size={12}/> Continue</button>
              <button style={{ padding: '10px 12px', font: '500 12.5px/1 var(--mx-display)', background: 'var(--mx-surface-2)', color: 'var(--mx-text)', border: '1px solid var(--mx-border)', borderRadius: 7, display: 'flex', alignItems: 'center', gap: 6 }}><Icon name="bookmark" size={12}/> Library</button>
            </div>
          </div>
        </div>
      </div>

      {/* Accent */}
      <SettingsBlock title="Accent color" caption="Used for buttons, highlights, the active reader chapter, and your ratings.">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 10 }}>
          {ACCENT_PRESETS.map((p, i) => (
            <button key={p.id} style={{
              position: 'relative', height: 76, borderRadius: 10, padding: 0, cursor: 'pointer',
              background: p.hex, border: 'none',
              boxShadow: i === 0 ? '0 0 0 2px var(--mx-bg), 0 0 0 4px ' + p.hex : '0 0 0 1px var(--mx-border)',
            }}>
              {i === 0 && <span style={{ position: 'absolute', top: 8, right: 8, width: 18, height: 18, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: p.hex }}><Icon name="check" size={12} strokeWidth={2.6}/></span>}
              <span style={{ position: 'absolute', bottom: 8, left: 10, font: '600 11px/1 var(--mx-display)', color: '#fff', textShadow: '0 1px 2px rgba(0,0,0,.4)' }}>{p.name}</span>
            </button>
          ))}
        </div>
        {/* Custom HSL */}
        <div style={{ marginTop: 18, padding: 16, background: 'var(--mx-surface-2)', border: '1px solid var(--mx-border)', borderRadius: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ font: '600 13px/1 var(--mx-display)' }}>Custom color</div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: accent.hex, border: '2px solid var(--mx-border-strong)' }}/>
              <span style={{ font: '500 12px/1 ui-monospace,monospace', color: 'var(--mx-text-2)' }}>{accent.hex}</span>
            </div>
          </div>
          <HueSlider label="Hue" pct={2} unit="°" value={350}/>
          <HueSlider label="Saturation" pct={92} unit="%" value={92}/>
          <HueSlider label="Lightness" pct={59} unit="%" value={59}/>
        </div>
      </SettingsBlock>

      <SettingsBlock title="Theme" caption="Sets the base canvas. We strongly recommend a dark theme for long sessions.">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
          {THEME_PRESETS.map((p, i) => (
            <ThemeChip key={p.id} preset={p} active={i === 0}/>
          ))}
        </div>
        <div style={{ marginTop: 14, padding: '10px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--mx-surface-2)', borderRadius: 8 }}>
          <div>
            <div style={{ font: '500 13px/1 var(--mx-display)' }}>Match system</div>
            <div style={{ font: '500 11px/1.4 var(--mx-body)', color: 'var(--mx-text-3)', marginTop: 4 }}>Use Midnight when your OS is dark, Paper when it's light.</div>
          </div>
          <Toggle on={false}/>
        </div>
      </SettingsBlock>

      <SettingsBlock title="Typography" caption="The display face is used for titles and chapter headings; body for synopses and comments.">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          <FontChip name="Grotesk + Inter" display="Space Grotesk" body="Inter" sample="Iron Lantern" active/>
          <FontChip name="Editorial Serif" display="Fraunces" body="Inter" sample="Iron Lantern"/>
          <FontChip name="Mono Display" display="JetBrains Mono" body="Inter" sample="Iron Lantern"/>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 14 }}>
          <SettingRow title="Body size" caption="Affects synopsis, comments, and chapter list">
            <SegToggle options={['S', 'M', 'L']} active="M"/>
          </SettingRow>
          <SettingRow title="Letter spacing" caption="Tighten display text in titles">
            <SegToggle options={['Tight', 'Normal', 'Wide']} active="Tight"/>
          </SettingRow>
        </div>
      </SettingsBlock>

      <SettingsBlock title="Layout density" caption="How tightly browse and library grids pack.">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {['Compact', 'Regular', 'Comfy'].map((d, i) => (
            <DensityChip key={d} name={d} active={i === 1}/>
          ))}
        </div>
      </SettingsBlock>

      <SettingsBlock title="Reader" caption="Defaults for the chapter reader. Per-series overrides live on each title page.">
        <SettingRow title="Layout" caption="Vertical works best for webtoons; double for traditional manga">
          <SegToggle options={['Vertical scroll', 'Single page', 'Double page']} active="Vertical scroll"/>
        </SettingRow>
        <SettingRow title="Page width" caption="Limits the reading column on wide screens">
          <SegToggle options={['Narrow', 'Medium', 'Wide', 'Full']} active="Medium"/>
        </SettingRow>
        <SettingRow title="Reader background" caption="What sits behind the page art">
          <SegToggle options={['Pure black', 'Match theme', 'Sepia']} active="Pure black"/>
        </SettingRow>
        <SettingRow title="Auto-hide chrome" caption="Hide top/bottom bars while you scroll">
          <Toggle on/>
        </SettingRow>
        <SettingRow title="Tap zones" caption="Tap edges of the page to navigate (single/double page only)">
          <Toggle on={false}/>
        </SettingRow>
      </SettingsBlock>

      <SettingsBlock title="Reset" caption="Roll back to MangaX defaults — you can re-customize at any time.">
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={{ padding: '10px 14px', font: '500 13px/1 var(--mx-display)', background: 'transparent', border: '1px solid var(--mx-border)', color: 'var(--mx-text-2)', borderRadius: 8, cursor: 'pointer' }}>Reset design</button>
          <button style={{ padding: '10px 14px', font: '500 13px/1 var(--mx-display)', background: 'transparent', border: '1px solid var(--mx-border)', color: 'var(--mx-text-2)', borderRadius: 8, cursor: 'pointer' }}>Export theme JSON</button>
        </div>
      </SettingsBlock>
    </div>
  );
}

function SettingsBlock({ title, caption, children }) {
  return (
    <section style={{ marginBottom: 36, paddingBottom: 32, borderBottom: '1px solid var(--mx-border)' }}>
      <div style={{ font: '700 17px/1 var(--mx-display)', letterSpacing: '-.015em' }}>{title}</div>
      {caption && <div style={{ font: '400 12.5px/1.5 var(--mx-body)', color: 'var(--mx-text-3)', marginTop: 6, marginBottom: 18, maxWidth: 580 }}>{caption}</div>}
      {children}
    </section>
  );
}

function SettingRow({ title, caption, children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '14px 0', borderBottom: '1px solid var(--mx-border)' }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ font: '500 13.5px/1 var(--mx-display)' }}>{title}</div>
        {caption && <div style={{ font: '400 11.5px/1.4 var(--mx-body)', color: 'var(--mx-text-3)', marginTop: 5 }}>{caption}</div>}
      </div>
      {children}
    </div>
  );
}

function Toggle({ on }) {
  return (
    <span style={{
      width: 36, height: 20, borderRadius: 10, padding: 2,
      background: on ? 'var(--mx-accent)' : 'var(--mx-surface-3)',
      display: 'inline-flex', flexShrink: 0,
    }}>
      <span style={{ display: 'block', width: 16, height: 16, borderRadius: '50%', background: '#fff', marginLeft: on ? 16 : 0, transition: 'margin-left .15s' }}/>
    </span>
  );
}

function HueSlider({ label, pct, value, unit }) {
  const trackBg = label === 'Hue'
    ? 'linear-gradient(90deg, hsl(0 80% 60%), hsl(60 80% 60%), hsl(120 80% 60%), hsl(180 80% 60%), hsl(240 80% 60%), hsl(300 80% 60%), hsl(360 80% 60%))'
    : label === 'Saturation' ? 'linear-gradient(90deg, hsl(0 0% 60%), hsl(0 100% 60%))'
    : 'linear-gradient(90deg, #000, var(--mx-accent), #fff)';
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', font: '500 11.5px/1 var(--mx-body)', color: 'var(--mx-text-3)', marginBottom: 6 }}>
        <span>{label}</span>
        <span style={{ fontFamily: 'ui-monospace, monospace', color: 'var(--mx-text-2)' }}>{value}{unit}</span>
      </div>
      <div style={{ position: 'relative', height: 14, borderRadius: 7, background: trackBg }}>
        <div style={{ position: 'absolute', top: -2, left: `calc(${pct}% - 9px)`, width: 18, height: 18, borderRadius: '50%', background: '#fff', border: '2px solid var(--mx-border-strong)', boxShadow: '0 2px 4px rgba(0,0,0,.4)' }}/>
      </div>
    </div>
  );
}

function ThemeChip({ preset, active }) {
  return (
    <button style={{
      position: 'relative', padding: 0, cursor: 'pointer',
      background: 'transparent', border: 'none',
    }}>
      <div style={{
        position: 'relative', height: 90, borderRadius: 10, overflow: 'hidden',
        background: preset.bg,
        border: '2px solid ' + (active ? 'var(--mx-accent)' : 'var(--mx-border)'),
      }}>
        {/* mock chrome */}
        <div style={{ position: 'absolute', left: 8, top: 8, right: 8, height: 8, background: preset.surface, borderRadius: 2 }}/>
        <div style={{ position: 'absolute', left: 8, top: 24, width: 22, height: 30, background: preset.surface, borderRadius: 2 }}/>
        <div style={{ position: 'absolute', left: 36, top: 26, width: 50, height: 4, background: preset.surface, borderRadius: 2 }}/>
        <div style={{ position: 'absolute', left: 36, top: 36, width: 38, height: 3, background: preset.surface, borderRadius: 2, opacity: .6 }}/>
        <div style={{ position: 'absolute', left: 36, top: 46, width: 18, height: 6, background: 'var(--mx-accent)', borderRadius: 2 }}/>
        {active && (
          <div style={{ position: 'absolute', top: 6, right: 6, width: 18, height: 18, borderRadius: '50%', background: 'var(--mx-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
            <Icon name="check" size={11} strokeWidth={2.6}/>
          </div>
        )}
      </div>
      <div style={{ font: '600 12px/1 var(--mx-display)', marginTop: 8, textAlign: 'left', color: active ? 'var(--mx-text)' : 'var(--mx-text-2)' }}>{preset.name}</div>
    </button>
  );
}

function FontChip({ name, display, body, sample, active }) {
  return (
    <button style={{
      padding: '16px 14px', cursor: 'pointer', textAlign: 'left',
      background: active ? 'var(--mx-accent-soft)' : 'var(--mx-surface)',
      border: '1px solid ' + (active ? 'var(--mx-accent)' : 'var(--mx-border)'),
      borderRadius: 10,
    }}>
      <div style={{ font: `700 22px/1.1 ${display}`, color: 'var(--mx-text)', letterSpacing: '-.02em', marginBottom: 8 }}>{sample}</div>
      <div style={{ font: `400 11.5px/1.4 ${body}`, color: 'var(--mx-text-3)', marginBottom: 12 }}>The lantern hummed, low and patient.</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', font: '500 11px/1 var(--mx-body)' }}>
        <span style={{ color: active ? 'var(--mx-accent)' : 'var(--mx-text-3)', fontWeight: 600 }}>{name}</span>
        {active && <Icon name="check" size={12}/>}
      </div>
    </button>
  );
}

function DensityChip({ name, active }) {
  const cols = name === 'Compact' ? 6 : name === 'Comfy' ? 3 : 4;
  return (
    <button style={{
      padding: 14, cursor: 'pointer', textAlign: 'left',
      background: active ? 'var(--mx-accent-soft)' : 'var(--mx-surface)',
      border: '1px solid ' + (active ? 'var(--mx-accent)' : 'var(--mx-border)'),
      borderRadius: 10,
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 4, height: 60, marginBottom: 10 }}>
        {Array.from({ length: cols * 2 }).map((_, i) => (
          <div key={i} style={{ background: active ? 'var(--mx-accent)' : 'var(--mx-surface-3)', borderRadius: 2, opacity: active ? 0.45 : 1 }}/>
        ))}
      </div>
      <div style={{ font: '600 13px/1 var(--mx-display)', color: active ? 'var(--mx-accent)' : 'var(--mx-text)' }}>{name}</div>
    </button>
  );
}

// ── Account tab ───────────────────────────────────────────────────
function AccountTabDesktop({ tweaks }) {
  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <div style={{ font: '700 28px/1 var(--mx-display)', letterSpacing: '-.025em' }}>Account</div>
        <div style={{ font: '400 13px/1.5 var(--mx-body)', color: 'var(--mx-text-3)', marginTop: 8 }}>
          Your profile, sign-in, and how MangaX recognizes you.
        </div>
      </div>

      <SettingsBlock title="Profile" caption="What other readers see on comments and reviews.">
        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
          <div style={{ position: 'relative' }}>
            <Avatar name="Hana M" size={96}/>
            <button style={{ position: 'absolute', bottom: -4, right: -4, width: 32, height: 32, borderRadius: '50%', background: 'var(--mx-accent)', border: '3px solid var(--mx-bg)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <Icon name="plus" size={14}/>
            </button>
          </div>
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <Field label="Display name" value="silverfen"/>
            <Field label="Pronouns" value="she/they"/>
            <Field label="Bio" value="Long-form sci-fi pile, slow-burn romance, anything Mori." />
            <Field label="Reading region" value="Asia · Tokyo (UTC+9)"/>
          </div>
        </div>
      </SettingsBlock>

      <SettingsBlock title="Sign in & security">
        <SettingRow title="Email" caption="reader@yokai.cafe · verified">
          <button style={{ padding: '7px 12px', font: '500 12px/1 var(--mx-display)', background: 'var(--mx-surface)', border: '1px solid var(--mx-border)', color: 'var(--mx-text)', borderRadius: 7, cursor: 'pointer' }}>Change</button>
        </SettingRow>
        <SettingRow title="Password" caption="Last changed 3 months ago">
          <button style={{ padding: '7px 12px', font: '500 12px/1 var(--mx-display)', background: 'var(--mx-surface)', border: '1px solid var(--mx-border)', color: 'var(--mx-text)', borderRadius: 7, cursor: 'pointer' }}>Change</button>
        </SettingRow>
        <SettingRow title="Two-factor authentication" caption="Authenticator app · enabled">
          <Toggle on/>
        </SettingRow>
        <SettingRow title="Connected accounts" caption="Apple · Discord">
          <button style={{ padding: '7px 12px', font: '500 12px/1 var(--mx-display)', background: 'var(--mx-surface)', border: '1px solid var(--mx-border)', color: 'var(--mx-text)', borderRadius: 7, cursor: 'pointer' }}>Manage</button>
        </SettingRow>
        <SettingRow title="Active sessions" caption="3 devices · MacBook (you), iPhone, iPad">
          <button style={{ padding: '7px 12px', font: '500 12px/1 var(--mx-display)', background: 'var(--mx-surface)', border: '1px solid var(--mx-border)', color: 'var(--mx-text)', borderRadius: 7, cursor: 'pointer' }}>View</button>
        </SettingRow>
      </SettingsBlock>

      <SettingsBlock title="Subscription" caption="Pro removes ads, unlocks unlimited offline downloads, and grants early access to new chapter releases.">
        <div style={{ padding: 18, background: 'var(--mx-surface)', border: '1px solid var(--mx-border)', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 18 }}>
          <div style={{ width: 48, height: 48, borderRadius: 10, background: 'var(--mx-accent-soft)', color: 'var(--mx-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="flame" size={24}/>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ font: '600 14px/1 var(--mx-display)' }}>MangaX Pro · ¥780/mo</div>
            <div style={{ font: '500 12px/1 var(--mx-body)', color: 'var(--mx-text-3)', marginTop: 5 }}>Renews May 24, 2026 · Apple subscription</div>
          </div>
          <button style={{ padding: '8px 14px', font: '500 12.5px/1 var(--mx-display)', background: 'transparent', border: '1px solid var(--mx-border)', color: 'var(--mx-text-2)', borderRadius: 7, cursor: 'pointer' }}>Manage plan</button>
        </div>
      </SettingsBlock>

      <SettingsBlock title="Danger zone">
        <SettingRow title="Export your data" caption="Library, comments, ratings, and reading history as a JSON archive">
          <button style={{ padding: '7px 12px', font: '500 12px/1 var(--mx-display)', background: 'var(--mx-surface)', border: '1px solid var(--mx-border)', color: 'var(--mx-text)', borderRadius: 7, cursor: 'pointer' }}>Request export</button>
        </SettingRow>
        <SettingRow title="Delete account" caption="Permanently removes your library, comments, and progress. Cannot be undone.">
          <button style={{ padding: '7px 12px', font: '500 12px/1 var(--mx-display)', background: 'transparent', border: '1px solid #ff4d6c', color: '#ff4d6c', borderRadius: 7, cursor: 'pointer' }}>Delete</button>
        </SettingRow>
      </SettingsBlock>
    </div>
  );
}

// ── Avatar dropdown (overlay frame) ───────────────────────────────
function AvatarMenuDesktop({ tweaks }) {
  return (
    <div style={{ ...themeVars(tweaks), height: 540 }}>
      <DesktopNav active="home"/>
      {/* Faded background context */}
      <div style={{ position: 'relative', height: 480 }}>
        <div style={{ padding: 32, opacity: .25 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 16 }}>
            {SERIES.slice(0, 12).map(s => <CoverPlaceholder key={s.id} title={s.title}/>)}
          </div>
        </div>
        {/* Dropdown */}
        <div style={{
          position: 'absolute', top: 12, right: 32,
          width: 280, padding: 6,
          background: 'rgba(20,20,26,.96)', backdropFilter: 'blur(20px)',
          border: '1px solid var(--mx-border)', borderRadius: 12,
          boxShadow: '0 16px 50px rgba(0,0,0,.5)',
        }}>
          <div style={{ padding: '12px 12px 14px', display: 'flex', gap: 12, alignItems: 'center' }}>
            <Avatar name="Hana M" size={42}/>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ font: '600 14px/1.2 var(--mx-display)' }}>silverfen</div>
              <div style={{ font: '500 11.5px/1 var(--mx-body)', color: 'var(--mx-text-3)', marginTop: 5 }}>reader@yokai.cafe</div>
            </div>
            <div style={{ font: '600 9px/1 var(--mx-display)', letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--mx-accent)', padding: '4px 6px', borderRadius: 4, background: 'var(--mx-accent-soft)' }}>Pro</div>
          </div>
          <div style={{ height: 1, background: 'var(--mx-border)', margin: '0 -6px 4px' }}/>
          {[
            { i: 'user', l: 'Profile', r: '→' },
            { i: 'book', l: 'My library', r: '95' },
            { i: 'history', l: 'Reading history' },
            { i: 'bookmark', l: 'Saved comments' },
          ].map(m => <MenuRow key={m.l} {...m}/>)}
          <div style={{ height: 1, background: 'var(--mx-border)', margin: '4px -6px' }}/>
          {[
            { i: 'settings', l: 'Settings · Design', highlight: true, r: 'New' },
            { i: 'download', l: 'Downloads', r: '14' },
            { i: 'bell', l: 'Notifications', r: '3' },
          ].map(m => <MenuRow key={m.l} {...m}/>)}
          <div style={{ height: 1, background: 'var(--mx-border)', margin: '4px -6px' }}/>
          <MenuRow i="settings" l="Help & feedback"/>
          <MenuRow i="x" l="Sign out" danger/>
          <div style={{ padding: '10px 12px 8px', font: '500 10.5px/1 var(--mx-body)', color: 'var(--mx-text-4)', display: 'flex', justifyContent: 'space-between' }}>
            <span>v 4.18.2</span>
            <span>Last sync · 2 min ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function MenuRow({ i, l, r, highlight, danger }) {
  return (
    <a style={{
      display: 'flex', alignItems: 'center', gap: 12, padding: '8px 10px',
      borderRadius: 8, cursor: 'pointer',
      font: '500 13px/1 var(--mx-body)',
      color: danger ? '#ff4d6c' : 'var(--mx-text)',
      background: highlight ? 'var(--mx-accent-soft)' : 'transparent',
    }}>
      <span style={{ color: danger ? '#ff4d6c' : highlight ? 'var(--mx-accent)' : 'var(--mx-text-3)' }}>
        <Icon name={i} size={15}/>
      </span>
      <span style={{ flex: 1 }}>{l}</span>
      {r && <span style={{
        font: '500 10.5px/1 ui-monospace,monospace',
        color: highlight ? 'var(--mx-accent)' : 'var(--mx-text-4)',
        background: highlight ? 'transparent' : 'var(--mx-surface-2)',
        padding: highlight ? 0 : '3px 6px', borderRadius: 4,
      }}>{r}</span>}
    </a>
  );
}

// ── Settings mobile (Design) ──────────────────────────────────────
function DesignTabMobile({ tweaks }) {
  return (
    <div style={themeVars(tweaks)}>
      <Phone>
        <MobileTopBar title="Design" leftIcon="chevronL"/>
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 16px' }}>
          {/* Live preview */}
          <div style={{ padding: 14, background: 'var(--mx-surface)', border: '1px solid var(--mx-border)', borderRadius: 12, marginBottom: 22 }}>
            <div style={{ font: '600 10px/1 var(--mx-display)', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--mx-text-3)', marginBottom: 10 }}>Preview</div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <CoverPlaceholder title="Iron Lantern" style={{ width: 70, height: 98, flexShrink: 0 }}/>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ font: '700 15px/1.2 var(--mx-display)' }}>Iron Lantern</div>
                <Stars value={4.7} size={11}/>
                <button style={{ marginTop: 8, padding: '8px 12px', font: '600 11.5px/1 var(--mx-display)', background: 'var(--mx-accent)', color: '#fff', border: 'none', borderRadius: 6 }}>Continue Ch. 96</button>
              </div>
            </div>
          </div>

          <MSettingsBlock title="Accent">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
              {ACCENT_PRESETS.slice(0, 8).map((p, i) => (
                <button key={p.id} style={{
                  position: 'relative', height: 56, borderRadius: 10, padding: 0,
                  background: p.hex, border: 'none',
                  boxShadow: i === 0 ? '0 0 0 2px var(--mx-bg), 0 0 0 4px ' + p.hex : '0 0 0 1px var(--mx-border)',
                }}>
                  {i === 0 && <span style={{ position: 'absolute', top: 6, right: 6, width: 16, height: 16, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: p.hex }}><Icon name="check" size={10} strokeWidth={2.6}/></span>}
                </button>
              ))}
            </div>
            <a style={{ display: 'block', marginTop: 12, font: '500 12px/1 var(--mx-body)', color: 'var(--mx-accent)' }}>Custom color →</a>
          </MSettingsBlock>

          <MSettingsBlock title="Theme">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              {THEME_PRESETS.slice(0, 3).map((p, i) => <ThemeChip key={p.id} preset={p} active={i === 0}/>)}
            </div>
            <MRow label="Match system" caption="Auto-switch with OS">
              <Toggle on={false}/>
            </MRow>
          </MSettingsBlock>

          <MSettingsBlock title="Reader">
            <MRow label="Auto-hide chrome">
              <Toggle on/>
            </MRow>
            <MRow label="Reader background" caption="Pure black">
              <Icon name="chevronR" size={14}/>
            </MRow>
            <MRow label="Body text size" caption="Medium">
              <Icon name="chevronR" size={14}/>
            </MRow>
          </MSettingsBlock>

          <MSettingsBlock title="Density">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              {['Compact', 'Regular', 'Comfy'].map((d, i) => <DensityChip key={d} name={d} active={i === 1}/>)}
            </div>
          </MSettingsBlock>
        </div>
      </Phone>
    </div>
  );
}

function MSettingsBlock({ title, children }) {
  return (
    <section style={{ marginBottom: 22 }}>
      <div style={{ font: '600 11px/1 var(--mx-display)', letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--mx-text-3)', marginBottom: 12 }}>{title}</div>
      {children}
    </section>
  );
}

function MRow({ label, caption, children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', borderBottom: '1px solid var(--mx-border)' }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ font: '500 13px/1 var(--mx-display)' }}>{label}</div>
        {caption && <div style={{ font: '500 11px/1 var(--mx-body)', color: 'var(--mx-text-3)', marginTop: 5 }}>{caption}</div>}
      </div>
      {children}
    </div>
  );
}

// ── You / Profile (mobile) ───────────────────────────────────────
function ProfileMobile({ tweaks }) {
  return (
    <div style={themeVars(tweaks)}>
      <Phone>
        <MobileTopBar title="You" rightIcons={['settings']}/>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {/* Profile header */}
          <div style={{ padding: '20px 16px 24px', display: 'flex', gap: 14, alignItems: 'center' }}>
            <Avatar name="Hana M" size={64}/>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ font: '700 18px/1.1 var(--mx-display)' }}>silverfen</div>
                <span style={{ font: '600 9px/1 var(--mx-display)', letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--mx-accent)', padding: '3px 5px', borderRadius: 3, background: 'var(--mx-accent-soft)' }}>Pro</span>
              </div>
              <div style={{ font: '500 11.5px/1 var(--mx-body)', color: 'var(--mx-text-3)', marginTop: 6 }}>Member since Apr 2024</div>
              <button style={{ marginTop: 10, padding: '7px 12px', font: '500 12px/1 var(--mx-display)', background: 'var(--mx-surface)', border: '1px solid var(--mx-border)', color: 'var(--mx-text)', borderRadius: 7 }}>Edit profile</button>
            </div>
          </div>
          {/* Stats grid */}
          <div style={{ margin: '0 16px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8 }}>
            {[
              { v: '95', l: 'Library' }, { v: '1.4k', l: 'Read' },
              { v: '4d 12h', l: 'Time' }, { v: '328', l: 'Comments' },
            ].map(s => (
              <div key={s.l} style={{ padding: '12px 8px', textAlign: 'center', background: 'var(--mx-surface)', border: '1px solid var(--mx-border)', borderRadius: 10 }}>
                <div style={{ font: '700 16px/1 var(--mx-display)' }}>{s.v}</div>
                <div style={{ font: '500 10px/1 var(--mx-body)', color: 'var(--mx-text-3)', marginTop: 5 }}>{s.l}</div>
              </div>
            ))}
          </div>
          {/* Menu */}
          <div style={{ padding: '0 16px' }}>
            {[
              { i: 'settings', l: 'Design', sub: 'Accent · theme · reader', badge: 'New', highlight: true },
              { i: 'book', l: 'Reading preferences' },
              { i: 'download', l: 'Downloads', sub: '14 chapters · 248 MB' },
              { i: 'bell', l: 'Notifications', badge: '3' },
              { i: 'eye', l: 'Privacy & data' },
              { i: 'flame', l: 'MangaX Pro', sub: 'Renews May 24' },
              { i: 'user', l: 'Account & security' },
              { i: 'comment', l: 'Help & feedback' },
            ].map(m => (
              <a key={m.l} style={{
                display: 'flex', alignItems: 'center', gap: 14, padding: '14px 14px',
                borderRadius: 10, marginBottom: 4,
                background: m.highlight ? 'var(--mx-accent-soft)' : 'var(--mx-surface)',
                border: '1px solid ' + (m.highlight ? 'var(--mx-accent)' : 'var(--mx-border)'),
              }}>
                <span style={{ color: m.highlight ? 'var(--mx-accent)' : 'var(--mx-text-2)' }}><Icon name={m.i} size={18}/></span>
                <div style={{ flex: 1 }}>
                  <div style={{ font: '600 13.5px/1 var(--mx-display)' }}>{m.l}</div>
                  {m.sub && <div style={{ font: '500 11px/1 var(--mx-body)', color: 'var(--mx-text-3)', marginTop: 5 }}>{m.sub}</div>}
                </div>
                {m.badge && <span style={{ font: '600 10px/1 ui-monospace,monospace', color: m.highlight ? 'var(--mx-accent)' : 'var(--mx-text-3)', padding: '3px 6px', borderRadius: 4, background: m.highlight ? 'transparent' : 'var(--mx-surface-2)' }}>{m.badge}</span>}
                <Icon name="chevronR" size={14}/>
              </a>
            ))}
            <button style={{ marginTop: 14, width: '100%', padding: '12px', font: '500 13px/1 var(--mx-display)', background: 'transparent', border: '1px solid var(--mx-border)', color: '#ff4d6c', borderRadius: 10 }}>Sign out</button>
          </div>
          <div style={{ height: 16 }}/>
        </div>
        <MobileTabBar active="profile"/>
      </Phone>
    </div>
  );
}

Object.assign(window, {
  SignInDesktop, SignInMobile,
  SettingsShell, DesignTabDesktop, AccountTabDesktop,
  AvatarMenuDesktop, DesignTabMobile, ProfileMobile,
  ACCENT_PRESETS, THEME_PRESETS,
});
