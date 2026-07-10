import React from 'react';
import {
  AbsoluteFill,
  cancelRender,
  continueRender,
  delayRender,
  interpolate,
  OffthreadVideo,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import '../revios/fonts.css';
import {easeOut, FONT_MONO, FONT_TITLE, panelShadow, textShadow, theme} from '../ghostspectre/theme';
import {
  ChapterCard,
  Chip,
  Highlight,
  Panel,
  ProgressBar,
  StepCard,
  SubNudge,
  useLife,
  Watermark,
} from '../ghostspectre/components';

// Windows 10 Ghost Spectre Superlite SE 2026 — 5:30.26 source (30 fps).
const SRC = 'Windows 10 Ghost Spectre Superlite SE 2026_ The Best Lightweight Windows for Low-End PCs_.mp4';
const s = (sec: number) => Math.round(sec * 30);

// ---------------------------------------------------------------------------
// Local overlays (identical to the GS11 edit, kept here so this composition is
// self-contained and its facts stay Windows-10 specific).
// ---------------------------------------------------------------------------
const Note: React.FC<{
  x: number;
  y: number;
  title: string;
  body?: string;
  icon?: string;
  accent?: string;
  align?: 'left' | 'right';
  durationInFrames: number;
}> = ({x, y, title, body, icon, accent = theme.cyan, align = 'left', durationInFrames}) => {
  const {vis} = useLife(durationInFrames, 12, 10);
  const dy = interpolate(vis, [0, 1], [22, 0]);
  return (
    <div
      style={{
        position: 'absolute',
        left: align === 'left' ? x : undefined,
        right: align === 'right' ? 1920 - x : undefined,
        top: y,
        opacity: vis,
        transform: `translateY(${dy}px)`,
        maxWidth: 620,
      }}
    >
      <Panel accent={accent}>
        <div style={{display: 'flex', gap: 12, alignItems: 'flex-start'}}>
          {icon ? <span style={{fontSize: 30, lineHeight: 1}}>{icon}</span> : null}
          <div>
            <div style={{fontFamily: FONT_TITLE, fontWeight: 800, fontSize: 25, color: theme.text, textShadow}}>
              {title}
            </div>
            {body ? (
              <div style={{fontFamily: FONT_TITLE, fontWeight: 400, fontSize: 18, color: theme.textDim, marginTop: 5, lineHeight: 1.3}}>
                {body}
              </div>
            ) : null}
          </div>
        </div>
      </Panel>
    </div>
  );
};

const StatCard: React.FC<{
  value: string;
  label: string;
  x: number;
  y: number;
  accent?: string;
  durationInFrames: number;
}> = ({value, label, x, y, accent = theme.amber, durationInFrames}) => {
  const frame = useCurrentFrame();
  const {vis, enter} = useLife(durationInFrames, 12, 10);
  const pop = interpolate(enter, [0, 1], [0.7, 1], {easing: easeOut});
  const beat = 1 + Math.max(0, Math.sin(frame / 7)) * 0.03;
  return (
    <div style={{position: 'absolute', left: x, top: y, opacity: vis, transform: `scale(${pop * beat})`, transformOrigin: 'left center'}}>
      <Panel accent={accent} style={{padding: '14px 26px'}}>
        <div style={{fontFamily: FONT_TITLE, fontWeight: 900, fontSize: 60, color: accent, lineHeight: 1}}>{value}</div>
        <div style={{fontFamily: FONT_TITLE, fontWeight: 700, fontSize: 20, color: theme.text, marginTop: 4, letterSpacing: 1}}>{label}</div>
      </Panel>
    </div>
  );
};

const Stamp: React.FC<{text: string; sub?: string; durationInFrames: number}> = ({text, sub, durationInFrames}) => {
  const frame = useCurrentFrame();
  const {vis} = useLife(durationInFrames, 8, 12);
  const sc = interpolate(frame, [0, 10], [1.4, 1], {extrapolateRight: 'clamp', easing: easeOut});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', opacity: vis}}>
      <AbsoluteFill style={{background: 'rgba(6,4,12,0.4)'}} />
      <div style={{textAlign: 'center', transform: `scale(${sc})`}}>
        <div style={{fontFamily: FONT_TITLE, fontWeight: 900, fontSize: 108, color: theme.text, textShadow: '0 8px 40px rgba(0,0,0,0.7)'}}>{text}</div>
        {sub ? <div style={{fontFamily: FONT_TITLE, fontWeight: 800, fontSize: 30, color: theme.red, letterSpacing: 3, marginTop: 8}}>{sub}</div> : null}
      </div>
    </AbsoluteFill>
  );
};

// Brand full-screen cards with Windows-10 specific facts -------------------
const TitleIntro10: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {vis} = useLife(durationInFrames, 14, 16);
  const s1 = spring({frame, fps, config: {damping: 200}});
  const s2 = spring({frame: frame - 8, fps, config: {damping: 200}});
  const s3 = spring({frame: frame - 18, fps, config: {damping: 200}});
  return (
    <AbsoluteFill style={{opacity: vis, background: theme.gradientDark, justifyContent: 'center', alignItems: 'center'}}>
      <AbsoluteFill style={{overflow: 'hidden'}}>
        <div
          style={{
            position: 'absolute',
            left: '50%',
            bottom: -320,
            width: 1500,
            height: 1100,
            transform: 'translateX(-50%)',
            background: theme.gradient,
            clipPath: 'polygon(0 60%, 30% 12%, 52% 42%, 74% 4%, 100% 55%, 100% 100%, 0 100%)',
            opacity: interpolate(s1, [0, 1], [0, 0.9]),
          }}
        />
      </AbsoluteFill>
      <div style={{textAlign: 'center', transform: `translateY(${interpolate(s1, [0, 1], [40, 0])}px)`}}>
        <div style={{fontFamily: FONT_MONO, fontWeight: 700, fontSize: 28, letterSpacing: 8, color: theme.cyan, opacity: s1}}>
          FULL REVIEW · WINDOWS 10 22H2
        </div>
        <div
          style={{
            fontFamily: FONT_TITLE,
            fontWeight: 900,
            fontSize: 108,
            color: theme.text,
            lineHeight: 0.98,
            marginTop: 8,
            transform: `scale(${interpolate(s2, [0, 1], [0.9, 1])})`,
            textShadow: '0 8px 40px rgba(0,0,0,0.6)',
          }}
        >
          GHOST <span style={{color: theme.red}}>SPECTRE</span>
          <br />
          SUPERLIGHT SE
        </div>
        <div style={{display: 'inline-flex', gap: 14, marginTop: 26, opacity: s3, transform: `translateY(${interpolate(s3, [0, 1], [20, 0])}px)`}}>
          {['ONLY 8.19 GB', '29 PROCESSES', 'NO BLOAT'].map((t) => (
            <span
              key={t}
              style={{
                fontFamily: FONT_TITLE,
                fontWeight: 800,
                fontSize: 24,
                color: theme.text,
                border: `2px solid ${theme.red}`,
                padding: '8px 18px',
                borderRadius: 999,
              }}
            >
              ✓ {t}
            </span>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const EndCard10: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {vis} = useLife(durationInFrames, 18, 12);
  const sp = spring({frame, fps, config: {damping: 200}});
  const steps = ['Windows 10 22H2 · Pro base', 'Only 8.19 GB on disk', '29 processes · 1.4 GB RAM idle', 'No bloatware · No Defender'];
  return (
    <AbsoluteFill style={{opacity: vis, background: theme.gradientDark, justifyContent: 'center', alignItems: 'center'}}>
      <AbsoluteFill style={{overflow: 'hidden'}}>
        <div
          style={{
            position: 'absolute',
            left: -200,
            top: -200,
            width: 1000,
            height: 1000,
            background: theme.gradient,
            opacity: 0.85,
            clipPath: 'polygon(0 0, 60% 0, 30% 100%, 0 70%)',
          }}
        />
      </AbsoluteFill>
      <div style={{textAlign: 'center', transform: `translateY(${interpolate(sp, [0, 1], [40, 0])}px)`}}>
        <div style={{fontSize: 74, marginBottom: 6}}>✅</div>
        <div style={{fontFamily: FONT_TITLE, fontWeight: 900, fontSize: 92, color: theme.text}}>
          Ghost Spectre <span style={{color: theme.green}}>SE</span>
        </div>
        <div style={{display: 'flex', gap: 16, justifyContent: 'center', marginTop: 34, flexWrap: 'wrap', maxWidth: 1400}}>
          {steps.map((t, i) => {
            const ap = interpolate(frame, [20 + i * 8, 34 + i * 8], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
              easing: easeOut,
            });
            return (
              <div
                key={t}
                style={{
                  opacity: ap,
                  transform: `translateY(${interpolate(ap, [0, 1], [18, 0])}px)`,
                  fontFamily: FONT_TITLE,
                  fontWeight: 700,
                  fontSize: 22,
                  color: theme.text,
                  background: theme.panel,
                  border: `1px solid ${theme.panelBorder}`,
                  padding: '12px 20px',
                  borderRadius: 12,
                }}
              >
                <span style={{color: theme.green, fontWeight: 900, marginRight: 8}}>✓</span>
                {t}
              </div>
            );
          })}
        </div>
        <div
          style={{
            marginTop: 44,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 16,
            background: theme.gradient,
            padding: '16px 34px',
            borderRadius: 999,
            boxShadow: panelShadow,
          }}
        >
          <span style={{fontSize: 34}}>🔔</span>
          <span style={{fontFamily: FONT_TITLE, fontWeight: 800, fontSize: 30, color: '#fff'}}>
            Ghost Spectre link in the pinned comment · Subscribe
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const FontGate: React.FC = () => {
  const [handle] = React.useState(() => delayRender('brand-fonts'));
  React.useEffect(() => {
    let cleared = false;
    const clear = () => {
      if (!cleared) {
        cleared = true;
        continueRender(handle);
      }
    };
    Promise.all([
      document.fonts.load('900 40px Montserrat'),
      document.fonts.load('800 40px Montserrat'),
      document.fonts.load('700 40px Montserrat'),
      document.fonts.load('400 40px Montserrat'),
      document.fonts.load('700 40px "JetBrains Mono"'),
      document.fonts.load('500 40px "JetBrains Mono"'),
    ])
      .then(() => document.fonts.ready)
      .then(clear)
      .catch((e) => cancelRender(e));
    const t = setTimeout(clear, 6000);
    return () => clearTimeout(t);
  }, [handle]);
  return null;
};

// ---------------------------------------------------------------------------
// Timings anchored to the BUZZ TRANSCRIPT (voice) — text appears when spoken,
// never before. Segment boundaries in comments (mm:ss).
// ---------------------------------------------------------------------------
export const GhostSpectre10Edit: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: theme.bg}}>
      <FontGate />
      <OffthreadVideo src={staticFile(SRC)} />

      {/* INTRO (seg 1-3) */}
      <Sequence from={s(2.9)} durationInFrames={s(3)}>
        <Note x={70} y={780} icon="👻" title="Ghost Spectre · Superlight SE" body="A heavily debloated custom Windows 10 22H2" accent={theme.red} durationInFrames={s(3)} />
      </Sequence>
      <Sequence from={s(6.4)} durationInFrames={s(6)}>
        <Note x={70} y={150} icon="🏆" title="One of the best custom Windows builds" body="Loved in the English-speaking community" accent={theme.cyan} durationInFrames={s(6)} />
      </Sequence>
      <Sequence from={s(13.4)} durationInFrames={s(7)}>
        <Note x={70} y={780} icon="🎬" title="Install · performance · low-end PC test" body="Is it worth running on a weak machine?" accent={theme.cyan} durationInFrames={s(7)} />
      </Sequence>

      {/* PART 1 · INSTALLATION (seg 4-16) */}
      <Sequence from={s(21.5)} durationInFrames={s(6)}>
        <StepCard step={1} total={8} title="The Ghost Spectre boot menu" sub="Restart, utilities, File Explorer or install" x={70} y={720} accent={theme.red} durationInFrames={s(6)} />
      </Sequence>
      <Sequence from={s(28.4)} durationInFrames={s(6)}>
        <Note x={70} y={150} icon="🧰" title="Diagnostics & testing utilities" body="Plus a built-in Windows File Explorer" accent={theme.cyan} durationInFrames={s(6)} />
      </Sequence>
      <Sequence from={s(35.4)} durationInFrames={s(6)}>
        <Chip text="Install → Ghost Spectre Windows 10 Superlight 26" x={70} y={780} accent durationInFrames={s(6)} />
      </Sequence>
      <Sequence from={s(42.4)} durationInFrames={s(5.2)}>
        <Note x={70} y={150} icon="💬" title="Tried Ghost Spectre before?" body="Or thinking of giving it a try? Tell me below 👇" accent={theme.red} durationInFrames={s(5.2)} />
      </Sequence>
      <Sequence from={s(48.3)} durationInFrames={s(3)}>
        <SubNudge durationInFrames={s(3)} />
      </Sequence>
      <Sequence from={s(51.5)} durationInFrames={s(6)}>
        <StepCard step={2} total={8} title="Choose your edition" sub="First installer screen picks the Windows 10 build" x={1100} y={150} accent={theme.red} durationInFrames={s(6)} />
      </Sequence>
      <Sequence from={s(58.4)} durationInFrames={s(5)}>
        <Note x={70} y={780} icon="🧩" title="Compact · Superlight" body="Each available with or without Defender" accent={theme.cyan} durationInFrames={s(5)} />
      </Sequence>
      <Sequence from={s(64.4)} durationInFrames={s(7)}>
        <Note x={70} y={150} icon="⭐" title="Superlight SE = Superlight + StartAllBack" body="Adds the classic Start menu · with or without Defender" accent={theme.amber} durationInFrames={s(7)} />
      </Sequence>
      <Sequence from={s(76.4)} durationInFrames={s(6)}>
        <Chip text="Based on Windows 10 Pro · Home also available" x={70} y={780} durationInFrames={s(6)} />
      </Sequence>
      <Sequence from={s(84.4)} durationInFrames={s(8)}>
        <Note x={70} y={150} icon="✅" title="My pick: Superlight SE" body="No Windows Defender · based on Windows 10 Pro" accent={theme.green} durationInFrames={s(8)} />
      </Sequence>
      <Sequence from={s(94.4)} durationInFrames={s(8)}>
        <ProgressBar label="Copying files · installing SE 26" x={70} y={860} from={5} to={96} accent={theme.red} durationInFrames={s(8)} />
      </Sequence>
      <Sequence from={s(103.4)} durationInFrames={s(7)}>
        <Note x={70} y={150} icon="👻" title="Ghost Spectre Project logo" body="Finalizing setup · preparing for first boot" accent={theme.cyan} durationInFrames={s(7)} />
      </Sequence>

      {/* PART 2 · FIRST BOOT (seg 17-19) */}
      <Sequence from={s(111.5)} durationInFrames={s(4.5)}>
        <StepCard step={3} total={8} title="The Ghost Spectre desktop" sub="Windows 10 Superlight SE 2026" x={70} y={720} accent={theme.red} durationInFrames={s(4.5)} />
      </Sequence>
      <Sequence from={s(116.4)} durationInFrames={s(9)}>
        <Note x={70} y={780} icon="🖥️" title="This PC · Recycle Bin · CPU-Z · Ghost Toolbox" body="The Toolbox utility we'll explore later" accent={theme.cyan} durationInFrames={s(9)} />
      </Sequence>
      <Sequence from={s(126.4)} durationInFrames={s(4.5)}>
        <Note x={70} y={150} icon="📋" title="Classic Start menu (StartAllBack)" accent={theme.cyan} durationInFrames={s(4.5)} />
      </Sequence>

      {/* PART 3 · PERFORMANCE (seg 20-22) */}
      <Sequence from={s(131.5)} durationInFrames={s(6)}>
        <Chip text="winver" x={1560} y={150} accent durationInFrames={s(6)} />
      </Sequence>
      <Sequence from={s(133.2)} durationInFrames={s(4.6)}>
        <StatCard value="22H2" label="WINDOWS 10 BASE" x={70} y={430} accent={theme.cyan} durationInFrames={s(4.6)} />
      </Sequence>
      <Sequence from={s(138.3)} durationInFrames={s(5.5)}>
        <StatCard value="29" label="BACKGROUND PROCESSES" x={70} y={430} accent={theme.amber} durationInFrames={s(5.5)} />
      </Sequence>
      <Sequence from={s(144.3)} durationInFrames={s(4.5)}>
        <StatCard value="2–3%" label="CPU IDLE" x={70} y={430} accent={theme.amber} durationInFrames={s(4.5)} />
      </Sequence>
      <Sequence from={s(149)} durationInFrames={s(4.6)}>
        <StatCard value="1.4 GB" label="RAM · OF 4 GB" x={70} y={430} accent={theme.amber} durationInFrames={s(4.6)} />
      </Sequence>

      {/* PART 4 · STORAGE & APPS (seg 23-27) */}
      <Sequence from={s(154.4)} durationInFrames={s(6)}>
        <StatCard value="8.19 GB" label="TOTAL ON DISK" x={70} y={720} accent={theme.amber} durationInFrames={s(6)} />
      </Sequence>
      <Sequence from={s(155)} durationInFrames={s(5)}>
        <Note x={70} y={150} icon="🪶" title="Tiny for a full Windows 10!" accent={theme.green} durationInFrames={s(5)} />
      </Sequence>
      <Sequence from={s(161.4)} durationInFrames={s(9)}>
        <Note x={70} y={150} icon="📦" title="Installed apps" body="7-Zip, CPU-Z, Visual C++, Paint…" accent={theme.cyan} durationInFrames={s(9)} />
      </Sequence>
      <Sequence from={s(171.4)} durationInFrames={s(4.5)}>
        <Note x={70} y={150} icon="📦" title="…Remote Desktop, Snipping Tool, StartAllBack" accent={theme.cyan} durationInFrames={s(4.5)} />
      </Sequence>
      <Sequence from={s(176.4)} durationInFrames={s(10)}>
        <Note x={70} y={760} icon="🧩" title="Windows features enabled" body=".NET 3.5 & 4.8, multimedia, Print to PDF, print services…" accent={theme.cyan} durationInFrames={s(10)} />
      </Sequence>
      <Sequence from={s(187.4)} durationInFrames={s(5.2)}>
        <Note x={70} y={760} icon="🧩" title="…SMB Direct, remote diff compression, folder clients" accent={theme.cyan} durationInFrames={s(5.2)} />
      </Sequence>

      {/* PART 5 · GHOST MODE (right-click) (seg 28-30) */}
      <Sequence from={s(193.5)} durationInFrames={s(6)}>
        <StepCard step={4} total={8} title="Right-click desktop tools" sub="Power Plan shortcuts and much more" x={1100} y={150} accent={theme.red} durationInFrames={s(6)} />
      </Sequence>
      <Sequence from={s(200.4)} durationInFrames={s(6)}>
        <Note x={70} y={760} icon="⚙️" title="Task Manager · RAM Cleaner · God Mode" body="Admin-mode shortcuts one click away" accent={theme.cyan} durationInFrames={s(6)} />
      </Sequence>
      <Sequence from={s(207.4)} durationInFrames={s(6)}>
        <Note x={70} y={760} icon="🌐" title="DNS quick-switch: Google / Cloudflare" body="Plus a temp-file cleanup that works great" accent={theme.cyan} durationInFrames={s(6)} />
      </Sequence>

      {/* PART 6 · GHOST TOOLBOX (seg 31-34) */}
      <Sequence from={s(214.5)} durationInFrames={s(5.5)}>
        <StepCard step={5} total={8} title="Ghost Toolbox" sub="Enable / disable / install components by number" x={70} y={720} accent={theme.red} durationInFrames={s(5.5)} />
      </Sequence>
      <Sequence from={s(220.4)} durationInFrames={s(3.5)}>
        <Chip text="Option 4 = activate Windows" x={70} y={150} accent durationInFrames={s(3.5)} />
      </Sequence>
      <Sequence from={s(224.4)} durationInFrames={s(5.5)}>
        <Note x={70} y={150} icon="🛍️" title="Option 10 → Microsoft Store" body="Option 51 → install web browsers" accent={theme.cyan} durationInFrames={s(5.5)} />
      </Sequence>
      <Sequence from={s(230.4)} durationInFrames={s(4.4)}>
        <Chip text="Option 3 → install Mozilla Firefox" x={70} y={150} accent durationInFrames={s(4.4)} />
      </Sequence>

      {/* PART 7 · BROWSER & TEST (seg 35-38) */}
      <Sequence from={s(235.4)} durationInFrames={s(7)}>
        <Note x={70} y={150} icon="🚀" title="Testing web-browsing performance" body="On Windows 10 Ghost Spectre SE 2026" accent={theme.cyan} durationInFrames={s(7)} />
      </Sequence>
      <Sequence from={s(243.4)} durationInFrames={s(4.4)}>
        <StatCard value="YouTube" label="LOADS EXTREMELY FAST" x={70} y={720} accent={theme.green} durationInFrames={s(4.4)} />
      </Sequence>
      <Sequence from={s(248.4)} durationInFrames={s(3.4)}>
        <Chip text="Pexels · loads perfectly" x={70} y={780} durationInFrames={s(3.4)} />
      </Sequence>
      <Sequence from={s(252.4)} durationInFrames={s(4.4)}>
        <Chip text="Pixabay · smooth too ✅" x={70} y={780} durationInFrames={s(4.4)} />
      </Sequence>

      {/* PART 8 · SETTINGS & UPDATES (seg 39-47) */}
      <Sequence from={s(257.4)} durationInFrames={s(2.4)}>
        <Chip text="System Settings" x={70} y={150} accent durationInFrames={s(2.4)} />
      </Sequence>
      <Sequence from={s(260.4)} durationInFrames={s(6)}>
        <Note x={70} y={150} icon="🔑" title="Reminder to activate Windows" body="Needed for everything to work correctly" accent={theme.amber} durationInFrames={s(6)} />
      </Sequence>
      <Sequence from={s(267.4)} durationInFrames={s(7)}>
        <Note x={70} y={760} icon="🧹" title="Same apps as the Control Panel" body="Virtually zero bloatware included" accent={theme.green} durationInFrames={s(7)} />
      </Sequence>
      <Sequence from={s(275.4)} durationInFrames={s(4.4)}>
        <Note x={70} y={150} icon="🛡️" title="No Windows Defender in this SE build" accent={theme.warn} durationInFrames={s(4.4)} />
      </Sequence>
      <Sequence from={s(280.4)} durationInFrames={s(3.4)}>
        <Note x={70} y={150} icon="🛡️" title="Want Defender? Pick that option at install" accent={theme.cyan} durationInFrames={s(3.4)} />
      </Sequence>
      <Sequence from={s(284.4)} durationInFrames={s(3.4)}>
        <Note x={70} y={760} icon="🔄" title="Windows Update: you can resume updates" accent={theme.cyan} durationInFrames={s(3.4)} />
      </Sequence>
      <Sequence from={s(288.4)} durationInFrames={s(6.4)}>
        <Note x={70} y={760} icon="⚠️" title="Updating light builds isn't recommended" body="It's a modified, optimized Windows" accent={theme.warn} durationInFrames={s(6.4)} />
      </Sequence>
      <Sequence from={s(295.4)} durationInFrames={s(7)}>
        <Note x={70} y={150} icon="🧨" title="Updates may remove the dev's optimizations" body="You'd lose the best performance tweaks" accent={theme.warn} durationInFrames={s(7)} />
      </Sequence>

      {/* OUTRO (seg 48-50) */}
      <Sequence from={s(303.4)} durationInFrames={s(3.2)}>
        <Stamp text="GHOST SPECTRE" sub="WINDOWS 10 · SE 2026" durationInFrames={s(3.2)} />
      </Sequence>
      <Sequence from={s(307)} durationInFrames={s(4)}>
        <Note x={70} y={780} icon="✨" title="Another excellent Ghost Spectre release" body="Lightweight · optimized · low resource use" accent={theme.red} durationInFrames={s(4)} />
      </Sequence>
      <Sequence from={s(311.4)} durationInFrames={s(6)}>
        <Note x={70} y={150} icon="📺" title="More custom-OS reviews on the playlist" body="Check the screen and I'll see you there!" accent={theme.red} durationInFrames={s(6)} />
      </Sequence>

      {/* Watermark over footage (full-screen cards below paint over it) */}
      <Sequence from={s(3)} durationInFrames={s(319) - s(3)}>
        <Watermark />
      </Sequence>

      {/* ===================== FULL-SCREEN CARDS (on top) ===================== */}
      <Sequence from={0} durationInFrames={s(2.8)}>
        <TitleIntro10 durationInFrames={s(2.8)} />
      </Sequence>
      <Sequence from={s(20.6)} durationInFrames={s(2.1)}>
        <ChapterCard part="Part 1" title="Installation" durationInFrames={s(2.1)} />
      </Sequence>
      <Sequence from={s(110.4)} durationInFrames={s(2)}>
        <ChapterCard part="Part 2" title="First boot" durationInFrames={s(2)} />
      </Sequence>
      <Sequence from={s(130.4)} durationInFrames={s(2)}>
        <ChapterCard part="Part 3" title="Performance" durationInFrames={s(2)} />
      </Sequence>
      <Sequence from={s(153.5)} durationInFrames={s(2)}>
        <ChapterCard part="Part 4" title="Storage & apps" durationInFrames={s(2)} />
      </Sequence>
      <Sequence from={s(192.6)} durationInFrames={s(2)}>
        <ChapterCard part="Part 5" title="Ghost Mode" durationInFrames={s(2)} />
      </Sequence>
      <Sequence from={s(213.5)} durationInFrames={s(2)}>
        <ChapterCard part="Part 6" title="Ghost Toolbox" durationInFrames={s(2)} />
      </Sequence>
      <Sequence from={s(234.4)} durationInFrames={s(2)}>
        <ChapterCard part="Part 7" title="Browser & test" durationInFrames={s(2)} />
      </Sequence>
      <Sequence from={s(256.5)} durationInFrames={s(2)}>
        <ChapterCard part="Part 8" title="Settings & updates" durationInFrames={s(2)} />
      </Sequence>
      <Sequence from={s(319)} durationInFrames={s(11.2)}>
        <EndCard10 durationInFrames={s(11.2)} />
      </Sequence>
    </AbsoluteFill>
  );
};
