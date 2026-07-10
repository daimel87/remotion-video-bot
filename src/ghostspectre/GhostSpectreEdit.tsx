import React from 'react';
import {
  AbsoluteFill,
  cancelRender,
  continueRender,
  delayRender,
  interpolate,
  OffthreadVideo,
  Sequence,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import '../revios/fonts.css';
import {easeOut, FONT_TITLE, textShadow, theme} from './theme';
import {
  ChapterCard,
  Chip,
  EndCard,
  Highlight,
  Panel,
  ProgressBar,
  StepCard,
  SubNudge,
  TitleIntro,
  useLife,
  Watermark,
} from './components';

const SRC = 'Ghost Spectre Windows 11_ Pure Performance, No Bloat!.mp4';
const s = (sec: number) => Math.round(sec * 30);

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
        maxWidth: 580,
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
// Timings anchored to the BUZZ TRANSCRIPT (voice) — text appears when spoken.
// ---------------------------------------------------------------------------
export const GhostSpectreEdit: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: theme.bg}}>
      <FontGate />
      <OffthreadVideo src={staticFile(SRC)} />

      {/* INTRO (seg 1-12) */}
      <Sequence from={s(1.6)} durationInFrames={s(6)}>
        <Note x={70} y={780} icon="👻" title="Ghost Spectre · Superlight SE" body="A heavily debloated custom Windows 11 25H2" accent={theme.red} durationInFrames={s(6)} />
      </Sequence>
      <Sequence from={s(11.4)} durationInFrames={s(5.5)}>
        <Note x={70} y={150} icon="🏆" title="One of the most popular Windows mods" body="Years of updates by the Ghost Spectre team" accent={theme.cyan} durationInFrames={s(5.5)} />
      </Sequence>
      <Sequence from={s(18.9)} durationInFrames={s(6)}>
        <Note x={70} y={780} icon="⚡" title="Browsing, working & gaming" body="A faster, lighter Windows for any user" accent={theme.cyan} durationInFrames={s(6)} />
      </Sequence>
      <Sequence from={s(30)} durationInFrames={s(6.8)}>
        <Chip text="25H2 · Updated May 22, 2026" x={70} y={150} accent durationInFrames={s(6.8)} />
      </Sequence>
      <Sequence from={s(40.3)} durationInFrames={s(6)}>
        <Note x={70} y={780} icon="🎬" title="Install · performance · apps & more" accent={theme.cyan} durationInFrames={s(6)} />
      </Sequence>
      <Sequence from={s(49)} durationInFrames={s(5)}>
        <SubNudge durationInFrames={s(5)} />
      </Sequence>

      {/* PART 1 · INSTALLATION */}
      <Sequence from={s(58.8)} durationInFrames={s(6)}>
        <StepCard step={1} total={7} title="Ghost Spectre's custom installer" sub="Its own install interface with handy options" x={70} y={720} accent={theme.red} durationInFrames={s(6)} />
      </Sequence>
      <Sequence from={s(65.4)} durationInFrames={s(6)}>
        <Note x={70} y={150} icon="🧰" title="Install apps, open Explorer, modern or classic setup" accent={theme.cyan} durationInFrames={s(6)} />
      </Sequence>
      <Sequence from={s(80.6)} durationInFrames={s(4.5)}>
        <Note x={70} y={150} icon="🖥️" title="Using the classic installer" accent={theme.cyan} durationInFrames={s(4.5)} />
      </Sequence>
      <Sequence from={s(86.4)} durationInFrames={s(4)}>
        <Chip text="Language: English (US)" x={70} y={780} durationInFrames={s(4)} />
      </Sequence>
      {/* edition selection (seg 22-27) */}
      <Sequence from={s(97.5)} durationInFrames={s(9)}>
        <StepCard step={2} total={7} title="Choose your edition" sub="Compact / Superlight · with or without Defender" x={1120} y={150} accent={theme.red} durationInFrames={s(9)} />
      </Sequence>
      <Sequence from={s(110.5)} durationInFrames={s(6.5)}>
        <Highlight x={464} y={445} w={1000} h={38} color={theme.amber} label="Superlight SE — no Defender" labelPos="bottom" durationInFrames={s(6.5)} />
      </Sequence>
      <Sequence from={s(122.9)} durationInFrames={s(5)}>
        <Note x={70} y={150} icon="📝" title="Accept license → custom install → pick drive" accent={theme.cyan} durationInFrames={s(5)} />
      </Sequence>
      <Sequence from={s(127.6)} durationInFrames={s(6.5)}>
        <ProgressBar label="Installing Ghost Spectre SE" x={70} y={860} from={8} to={95} accent={theme.red} durationInFrames={s(6.5)} />
      </Sequence>
      <Sequence from={s(134.6)} durationInFrames={s(5)}>
        <Note x={70} y={150} icon="👤" title="Auto-creates an Administrator account" accent={theme.green} durationInFrames={s(5)} />
      </Sequence>
      <Sequence from={s(140.8)} durationInFrames={s(5)}>
        <Note x={70} y={780} icon="🔁" title="Restart to apply all customizations" accent={theme.cyan} durationInFrames={s(5)} />
      </Sequence>

      {/* PART 2 · FIRST BOOT */}
      <Sequence from={s(152.1)} durationInFrames={s(7)}>
        <StepCard step={3} total={7} title="The Ghost Spectre desktop" sub="This PC, Recycle Bin, CPU-Z, Ghost Toolbox + ghost logo" x={70} y={720} accent={theme.red} durationInFrames={s(7)} />
      </Sequence>
      <Sequence from={s(163.8)} durationInFrames={s(5)}>
        <Note x={70} y={150} icon="📋" title="Classic Start menu (StartAllBack)" accent={theme.cyan} durationInFrames={s(5)} />
      </Sequence>
      <Sequence from={s(170.3)} durationInFrames={s(11)}>
        <Chip text="winver" x={1500} y={150} accent durationInFrames={s(11)} />
      </Sequence>
      <Sequence from={s(174)} durationInFrames={s(8)}>
        <Highlight x={145} y={352} w={452} h={44} color={theme.cyan} label="Windows 11 25H2 · Build 26200.8457" labelPos="bottom" durationInFrames={s(8)} />
      </Sequence>
      <Sequence from={s(176.5)} durationInFrames={s(5)}>
        <Note x={1250} y={470} icon="🪟" title="Genuine Windows 11 Pro" body="One of Microsoft's latest 25H2 builds." accent={theme.green} durationInFrames={s(5)} />
      </Sequence>

      {/* PART 3 · PERFORMANCE */}
      <Sequence from={s(187.7)} durationInFrames={s(6.5)}>
        <StepCard step={4} total={7} title="Idle performance" sub="Task Manager on a 4 GB dual-core PC" x={1120} y={150} accent={theme.red} durationInFrames={s(6.5)} />
      </Sequence>
      <Sequence from={s(188)} durationInFrames={s(6.5)}>
        <StatCard value="11" label="BACKGROUND PROCESSES" x={70} y={430} accent={theme.amber} durationInFrames={s(6.5)} />
      </Sequence>
      <Sequence from={s(195.3)} durationInFrames={s(3.5)}>
        <StatCard value="2–4%" label="CPU IDLE" x={70} y={430} accent={theme.amber} durationInFrames={s(3.5)} />
      </Sequence>
      <Sequence from={s(199)} durationInFrames={s(5)}>
        <StatCard value="1.3 GB" label="RAM IDLE" x={70} y={430} accent={theme.amber} durationInFrames={s(5)} />
      </Sequence>
      <Sequence from={s(205.3)} durationInFrames={s(5)}>
        <Note x={70} y={780} icon="🖲️" title="Tested on a low-end machine" body="Dual-core / dual-thread · just 4 GB RAM." accent={theme.cyan} durationInFrames={s(5)} />
      </Sequence>

      {/* PART 4 · STORAGE & APPS */}
      <Sequence from={s(222.1)} durationInFrames={s(6)}>
        <StatCard value="5.57 GB" label="ISO SIZE · ENGLISH" x={70} y={180} accent={theme.amber} durationInFrames={s(6)} />
      </Sequence>
      <Sequence from={s(223)} durationInFrames={s(5)}>
        <Note x={70} y={780} icon="💿" title="Rufus-compatible" body="Make a bootable USB with Rufus." accent={theme.cyan} durationInFrames={s(5)} />
      </Sequence>
      <Sequence from={s(233.3)} durationInFrames={s(6)}>
        <StatCard value="8.18 GB" label="TOTAL ON DISK" x={70} y={720} accent={theme.amber} durationInFrames={s(6)} />
      </Sequence>
      <Sequence from={s(234)} durationInFrames={s(5)}>
        <Note x={70} y={150} icon="🪶" title="Tiny for a full Windows 11!" accent={theme.green} durationInFrames={s(5)} />
      </Sequence>
      <Sequence from={s(249.1)} durationInFrames={s(8)}>
        <Note x={70} y={150} icon="🧹" title="Only 4 apps preinstalled" body="7-Zip, CPU-Z, Remote Desktop, StartAllBack — no bloatware." accent={theme.green} durationInFrames={s(8)} />
      </Sequence>
      <Sequence from={s(260.3)} durationInFrames={s(8)}>
        <Note x={70} y={760} icon="🧩" title="Handy features enabled" body=".NET 3.5 & 4.8, Print to PDF, SMB Direct & more." accent={theme.cyan} durationInFrames={s(8)} />
      </Sequence>
      <Sequence from={s(279.8)} durationInFrames={s(5)}>
        <Note x={70} y={150} icon="🔑" title="Windows activation required" body="Activate with your own license." accent={theme.amber} durationInFrames={s(5)} />
      </Sequence>
      <Sequence from={s(296.7)} durationInFrames={s(5)}>
        <Note x={70} y={760} icon="🛡️" title="No Windows Defender" body="This is the Defender-free SE edition." accent={theme.warn} durationInFrames={s(5)} />
      </Sequence>
      <Sequence from={s(304.3)} durationInFrames={s(5)}>
        <StatCard value="2077" label="UPDATES PAUSED UNTIL" x={70} y={720} accent={theme.amber} durationInFrames={s(5)} />
      </Sequence>
      <Sequence from={s(315.8)} durationInFrames={s(4.5)}>
        <Note x={70} y={150} icon="✅" title="Updates still work if you resume them" accent={theme.green} durationInFrames={s(4.5)} />
      </Sequence>

      {/* PART 5 · GHOST MODE */}
      <Sequence from={s(323.9)} durationInFrames={s(5)}>
        <StepCard step={5} total={7} title="Ghost Mode menu" sub="Right-click the desktop for custom tools" x={1120} y={150} accent={theme.red} durationInFrames={s(5)} />
      </Sequence>
      <Sequence from={s(326.5)} durationInFrames={s(7)}>
        <Note x={1120} y={720} icon="⚙️" title="Power · Game Turbo · Memory Cleaner" body="God Mode, ping tools & one-click temp cleanup." accent={theme.cyan} durationInFrames={s(7)} />
      </Sequence>

      {/* PART 6 · GHOST TOOLBOX */}
      <Sequence from={s(353)} durationInFrames={s(7)}>
        <StepCard step={6} total={7} title="Ghost Toolbox" sub="Enable / disable / install components by number" x={70} y={720} accent={theme.red} durationInFrames={s(7)} />
      </Sequence>
      <Sequence from={s(366.7)} durationInFrames={s(4)}>
        <Chip text="Option 4 = activation tools" x={70} y={150} accent durationInFrames={s(4)} />
      </Sequence>
      <Sequence from={s(371.3)} durationInFrames={s(7)}>
        <Note x={70} y={150} icon="🛍️" title="No Microsoft Store by default" body="Install it in one step with Option 10." accent={theme.cyan} durationInFrames={s(7)} />
      </Sequence>
      <Sequence from={s(398.6)} durationInFrames={s(4)}>
        <Note x={70} y={780} icon="✅" title="Store installed & working" accent={theme.green} durationInFrames={s(4)} />
      </Sequence>

      {/* PART 7 · BROWSER & TEST */}
      <Sequence from={s(410.8)} durationInFrames={s(4.5)}>
        <Note x={70} y={150} icon="🌐" title="No browser included — not even Edge" accent={theme.warn} durationInFrames={s(4.5)} />
      </Sequence>
      <Sequence from={s(415.6)} durationInFrames={s(6)}>
        <Note x={70} y={760} icon="📋" title="Option 51 → 17 browsers" body="Chrome, Brave, Firefox, Edge, Opera, Vivaldi…" accent={theme.cyan} durationInFrames={s(6)} />
      </Sequence>
      <Sequence from={s(428.5)} durationInFrames={s(5)}>
        <Chip text="Installing Firefox · Option 3" x={70} y={150} accent durationInFrames={s(5)} />
      </Sequence>
      <Sequence from={s(438.1)} durationInFrames={s(6)}>
        <Note x={70} y={150} icon="🚀" title="Browsing feels fast & responsive" accent={theme.green} durationInFrames={s(6)} />
      </Sequence>
      <Sequence from={s(458)} durationInFrames={s(4.5)}>
        <StatCard value="12" label="PROCESSES UNDER LOAD" x={70} y={720} accent={theme.amber} durationInFrames={s(4.5)} />
      </Sequence>
      <Sequence from={s(463)} durationInFrames={s(6)}>
        <StatCard value="~17%" label="CPU · ~3 GB RAM" x={70} y={720} accent={theme.amber} durationInFrames={s(6)} />
      </Sequence>
      <Sequence from={s(464)} durationInFrames={s(5)}>
        <Note x={70} y={150} icon="💪" title="Impressive on this hardware" body="Toolbox + 3 Firefox tabs open." accent={theme.cyan} durationInFrames={s(5)} />
      </Sequence>

      {/* OUTRO */}
      <Sequence from={s(476.6)} durationInFrames={s(3.2)}>
        <Stamp text="GHOST SPECTRE" sub="SUPERLIGHT SE · 2026" durationInFrames={s(3.2)} />
      </Sequence>
      <Sequence from={s(484.6)} durationInFrames={s(6)}>
        <Note x={70} y={780} icon="✨" title="Lightweight · optimized · customizable" body="Excellent performance, low resource use." accent={theme.red} durationInFrames={s(6)} />
      </Sequence>
      <Sequence from={s(494.6)} durationInFrames={s(6)}>
        <Note x={70} y={150} icon="💬" title="Would you install it on your PC?" body="Let me know down in the comments!" accent={theme.red} durationInFrames={s(6)} />
      </Sequence>

      {/* Watermark over footage (full-screen cards below paint over it) */}
      <Sequence from={s(3)} durationInFrames={s(501) - s(3)}>
        <Watermark />
      </Sequence>

      {/* ===================== FULL-SCREEN CARDS (on top) ===================== */}
      <Sequence from={0} durationInFrames={s(2.8)}>
        <TitleIntro durationInFrames={s(2.8)} />
      </Sequence>
      <Sequence from={s(55.6)} durationInFrames={s(2.1)}>
        <ChapterCard part="Part 1" title="Installation" durationInFrames={s(2.1)} />
      </Sequence>
      <Sequence from={s(148.2)} durationInFrames={s(2.1)}>
        <ChapterCard part="Part 2" title="First boot" durationInFrames={s(2.1)} />
      </Sequence>
      <Sequence from={s(184.2)} durationInFrames={s(2.1)}>
        <ChapterCard part="Part 3" title="Performance" durationInFrames={s(2.1)} />
      </Sequence>
      <Sequence from={s(215.4)} durationInFrames={s(2.1)}>
        <ChapterCard part="Part 4" title="Storage & apps" durationInFrames={s(2.1)} />
      </Sequence>
      <Sequence from={s(320.4)} durationInFrames={s(2)}>
        <ChapterCard part="Part 5" title="Ghost Mode" durationInFrames={s(2)} />
      </Sequence>
      <Sequence from={s(348)} durationInFrames={s(2)}>
        <ChapterCard part="Part 6" title="Ghost Toolbox" durationInFrames={s(2)} />
      </Sequence>
      <Sequence from={s(403.7)} durationInFrames={s(2)}>
        <ChapterCard part="Part 7" title="Browser & test" durationInFrames={s(2)} />
      </Sequence>
      <Sequence from={s(501)} durationInFrames={s(27.5)}>
        <EndCard durationInFrames={s(27.5)} />
      </Sequence>
    </AbsoluteFill>
  );
};
