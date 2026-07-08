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
  TitleIntro,
  useLife,
  Watermark,
} from './components';

const SRC = 'Atom Os 11.mp4';
const s = (sec: number) => Math.round(sec * 30);

// Small floating info panel
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
        maxWidth: 560,
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

// Big stat card — hero number (retention gold in this niche)
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
      <AbsoluteFill style={{background: 'rgba(4,6,12,0.35)'}} />
      <div style={{textAlign: 'center', transform: `scale(${sc})`}}>
        <div style={{fontFamily: FONT_TITLE, fontWeight: 900, fontSize: 120, color: theme.text, textShadow: '0 8px 40px rgba(0,0,0,0.7)'}}>{text}</div>
        {sub ? <div style={{fontFamily: FONT_TITLE, fontWeight: 800, fontSize: 30, color: theme.cyan, letterSpacing: 3, marginTop: 8}}>{sub}</div> : null}
      </div>
    </AbsoluteFill>
  );
};

// Wait for the embedded brand fonts before capturing any frame.
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
// Timings below are anchored to the BUZZ TRANSCRIPT (voice), so every text
// appears when the narrator says it — never before.
// ---------------------------------------------------------------------------
export const AtomOsEdit: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: theme.bg}}>
      <FontGate />
      <OffthreadVideo src={staticFile(SRC)} />

      {/* INTRO — seg 1-2 (0:00–0:09) */}
      <Sequence from={s(1.6)} durationInFrames={s(6.5)}>
        <Note x={70} y={780} icon="⚛️" title="AtomOS 11 Standard" body="A Windows 11 25H2 custom build for low-end PCs" accent={theme.red} durationInFrames={s(6.5)} />
      </Sequence>
      <Sequence from={s(7)} durationInFrames={s(4.5)}>
        <Note x={70} y={150} icon="🪶" title="Debloated · lightweight · fast" accent={theme.cyan} durationInFrames={s(4.5)} />
      </Sequence>

      {/* PART 1 · INSTALL */}
      {/* seg 4 (0:14) desktop with installer */}
      <Sequence from={s(14.2)} durationInFrames={s(7)}>
        <StepCard step={1} total={6} title="Unusual first screen" sub="A full desktop loads, with the installer in the center" x={70} y={720} accent={theme.red} durationInFrames={s(7)} />
      </Sequence>
      {/* seg 7 (0:25.6) select English, Next, Install Now */}
      <Sequence from={s(25.7)} durationInFrames={s(4.3)}>
        <Note x={70} y={150} icon="🌐" title="Select English → Next → Install Now" accent={theme.cyan} durationInFrames={s(4.3)} />
      </Sequence>
      {/* seg 8-9 (0:30) standard install */}
      <Sequence from={s(30.2)} durationInFrames={s(8.8)}>
        <Note x={70} y={150} icon="📝" title="Standard Windows 11 install" body="Accept the license, choose the drive, copy files." accent={theme.cyan} durationInFrames={s(8.8)} />
      </Sequence>
      {/* seg 10 (0:39.4) copying files / installing */}
      <Sequence from={s(39.5)} durationInFrames={s(7.4)}>
        <ProgressBar label="Installing Windows 11 25H2" x={70} y={860} from={10} to={92} accent={theme.red} durationInFrames={s(7.4)} />
      </Sequence>
      {/* seg 11 (0:47.1) auto compression */}
      <Sequence from={s(47.3)} durationInFrames={s(7.5)}>
        <StepCard step={2} total={6} title="Automatic file compression" sub="How devs shrink the OS footprint on disk" x={70} y={150} accent={theme.red} durationInFrames={s(7.5)} />
      </Sequence>
      {/* seg 12 (0:53) reduce disk space */}
      <Sequence from={s(53.1)} durationInFrames={s(5.5)}>
        <Note x={70} y={760} icon="🗜️" title="Shrinks the OS footprint" body="Less disk space — results shown later." accent={theme.cyan} durationInFrames={s(5.5)} />
      </Sequence>
      {/* seg 14 (1:02.2) ~15 minutes */}
      <Sequence from={s(62.3)} durationInFrames={s(5)}>
        <Note x={70} y={760} icon="⏱️" title="~15 minutes — be patient" body="This is what makes AtomOS so tiny." accent={theme.amber} durationInFrames={s(5)} />
      </Sequence>

      {/* PART 2 · FIRST BOOT */}
      {/* seg 17-18 (1:17) official Start menu, no bloatware */}
      <Sequence from={s(77.2)} durationInFrames={s(7)}>
        <StepCard step={3} total={6} title="Clean, minimalist desktop" sub="Official Windows 11 Start menu — zero bloatware" x={70} y={720} accent={theme.red} durationInFrames={s(7)} />
      </Sequence>
      {/* seg 21 (1:34.2) store opens */}
      <Sequence from={s(94.4)} durationInFrames={s(6.5)}>
        <Note x={70} y={150} icon="🛍️" title="Microsoft Store works normally" body="Install any Store app just like stock Windows." accent={theme.green} durationInFrames={s(6.5)} />
      </Sequence>

      {/* PART 3 · UNDER THE HOOD */}
      {/* seg 23 (1:42.7) run WinVer */}
      <Sequence from={s(102.9)} durationInFrames={s(12)}>
        <Chip text="winver" x={1500} y={150} accent durationInFrames={s(12)} />
      </Sequence>
      {/* seg 23-24: 25H2 (~1:47) then build 26200.6901 (1:51.1) */}
      <Sequence from={s(108)} durationInFrames={s(9)}>
        <Highlight x={185} y={376} w={492} h={44} color={theme.cyan} label="Windows 11 25H2 · Build 26200.6901" labelPos="bottom" durationInFrames={s(9)} />
      </Sequence>
      {/* seg 24 (1:53) running on Windows 11 Pro */}
      <Sequence from={s(114)} durationInFrames={s(4)}>
        <Note x={1290} y={470} icon="🪟" title="Genuine Windows 11 Pro" body="Not a fake ISO — real 25H2 underneath." accent={theme.green} durationInFrames={s(4)} />
      </Sequence>
      {/* seg 25 (1:57.8) task manager idle performance */}
      <Sequence from={s(118)} durationInFrames={s(6.5)}>
        <StepCard step={4} total={6} title="Idle performance" sub="Task Manager on a low-end 4 GB machine" x={1260} y={150} accent={theme.red} durationInFrames={s(6.5)} />
      </Sequence>
      {/* seg 26 (2:02.2) only 23 background processes */}
      <Sequence from={s(122.3)} durationInFrames={s(5.5)}>
        <StatCard value="23" label="BACKGROUND PROCESSES" x={1300} y={360} accent={theme.amber} durationInFrames={s(5.5)} />
      </Sequence>
      {/* seg 26 (~2:05) CPU ~7% */}
      <Sequence from={s(125.5)} durationInFrames={s(3)}>
        <StatCard value="~7%" label="CPU IDLE" x={1300} y={360} accent={theme.amber} durationInFrames={s(3)} />
      </Sequence>
      {/* seg 27 (2:08.8) memory 2.4 / 4 GB */}
      <Sequence from={s(129)} durationInFrames={s(5)}>
        <Highlight x={308} y={344} w={352} h={70} color={theme.cyan} label="RAM: 2.4 / 4 GB idle" labelPos="top" durationInFrames={s(5)} />
      </Sequence>
      {/* seg 28 (2:14) estimates */}
      <Sequence from={s(134.2)} durationInFrames={s(3.4)}>
        <Note x={70} y={150} icon="ℹ️" title="Numbers are estimates" body="Your results vary with your hardware." accent={theme.cyan} durationInFrames={s(3.4)} />
      </Sequence>
      {/* seg 30 (2:21.2 / value ~2:26) ISO only 2.87 GB */}
      <Sequence from={s(143.5)} durationInFrames={s(6.5)}>
        <StatCard value="2.87 GB" label="TINY ISO · ENGLISH" x={1330} y={180} accent={theme.amber} durationInFrames={s(6.5)} />
      </Sequence>
      {/* seg 31 (2:28.6) available in English */}
      <Sequence from={s(148.7)} durationInFrames={s(6)}>
        <Note x={70} y={760} icon="💿" title="Tiny ISO · English" body="Download from the official AtomOS site (pinned)." accent={theme.cyan} durationInFrames={s(6)} />
      </Sequence>
      {/* seg 33 (2:37.9 / value ~2:43) C drive only 7.44 GB */}
      <Sequence from={s(158)} durationInFrames={s(8)}>
        <StatCard value="7.44 GB" label="TOTAL INSTALL SIZE" x={70} y={720} accent={theme.amber} durationInFrames={s(8)} />
      </Sequence>
      {/* seg 34-35 (2:45) that's the compression payoff */}
      <Sequence from={s(165.2)} durationInFrames={s(6)}>
        <Note x={70} y={150} icon="🪶" title="Barely any disk space" body="A full Windows 11 in ~7 GB — thanks to compression." accent={theme.green} durationInFrames={s(6)} />
      </Sequence>

      {/* PART 4 · CLEAN & BLOAT-FREE */}
      {/* seg 37 (2:58.8) only Remote Desktop */}
      <Sequence from={s(178.9)} durationInFrames={s(7)}>
        <Note x={70} y={150} icon="🧹" title="Only ONE app installed" body="Remote Desktop Connection — that's it." accent={theme.green} durationInFrames={s(7)} />
      </Sequence>
      {/* seg 39-40 (3:08.4) optional features */}
      <Sequence from={s(188.5)} durationInFrames={s(9)}>
        <Note x={70} y={760} icon="🧩" title="Useful features pre-enabled" body=".NET 3.5 & 4.8, Legacy Components, Print to PDF…" accent={theme.cyan} durationInFrames={s(9)} />
      </Sequence>
      {/* seg 41 (3:22.6) no extended right-click menu */}
      <Sequence from={s(202.6)} durationInFrames={s(7)}>
        <Note x={70} y={150} icon="🖱️" title="No cluttered right-click menu" body="Everything is organized in the Post-Install folder." accent={theme.cyan} durationInFrames={s(7)} />
      </Sequence>

      {/* PART 5 · POST-INSTALL TOOLKIT */}
      {/* seg 44 (3:38.8) subfolders: Start... */}
      <Sequence from={s(218.9)} durationInFrames={s(8.5)}>
        <StepCard step={5} total={6} title="The Post-Install toolkit" sub="Start · Tweaks · Tools · Wallpapers · Others" x={1180} y={150} accent={theme.red} durationInFrames={s(8.5)} />
      </Sequence>
      {/* seg 47 (3:53.5) Tools folder */}
      <Sequence from={s(233.6)} durationInFrames={s(6)}>
        <Note x={1180} y={720} icon="🛠️" title="Tools included" body="7-Zip, WinUtil, OO ShutUp10, WPD & more." accent={theme.cyan} durationInFrames={s(6)} />
      </Sequence>
      {/* seg 48-49 (3:57.7) wallpapers */}
      <Sequence from={s(237.8)} durationInFrames={s(6.5)}>
        <Note x={70} y={150} icon="🖼️" title="Wallpaper pack (light & dark)" body="Which one do you prefer? Tell me in the comments." accent={theme.red} durationInFrames={s(6.5)} />
      </Sequence>

      {/* PART 6 · SETTINGS & UPDATES */}
      {/* seg 52 (4:18) activation message */}
      <Sequence from={s(258.1)} durationInFrames={s(6)}>
        <Note x={70} y={150} icon="🔑" title="Windows needs activation" body="Expected — activate it with your own license." accent={theme.amber} durationInFrames={s(6)} />
      </Sequence>
      {/* seg 55 (4:34.9) Defender default AV */}
      <Sequence from={s(275)} durationInFrames={s(5.5)}>
        <Note x={70} y={760} icon="🛡️" title="Windows Defender included" body="Full built-in antivirus, still active." accent={theme.green} durationInFrames={s(5.5)} />
      </Sequence>
      {/* seg 56 (4:40.6 / value ~4:44) updates paused until 2050 */}
      <Sequence from={s(281)} durationInFrames={s(6)}>
        <StatCard value="2050" label="UPDATES PAUSED UNTIL" x={70} y={150} accent={theme.amber} durationInFrames={s(6)} />
      </Sequence>
      {/* seg 57-59 (4:52) don't update a modded build */}
      <Sequence from={s(288)} durationInFrames={s(7)}>
        <Note x={70} y={760} icon="⚠️" title="Don't update a modded build" body="Updating can undo the developer's optimizations." accent={theme.warn} durationInFrames={s(7)} />
      </Sequence>

      {/* OUTRO — seg 60 (5:03.8) "that's AtomOS 11" */}
      <Sequence from={s(304)} durationInFrames={s(3)}>
        <Stamp text="AtomOS 11" sub="LIGHTWEIGHT · BLOAT-FREE" durationInFrames={s(3)} />
      </Sequence>

      {/* Watermark over footage (full-screen cards below paint over it) */}
      <Sequence from={s(3)} durationInFrames={s(316) - s(3)}>
        <Watermark />
      </Sequence>

      {/* ===================== FULL-SCREEN CARDS (on top) ===================== */}
      <Sequence from={0} durationInFrames={s(2.8)}>
        <TitleIntro durationInFrames={s(2.8)} />
      </Sequence>
      {/* seg 3 (0:09.8) install topic */}
      <Sequence from={s(10)} durationInFrames={s(2.1)}>
        <ChapterCard part="Part 1" title="The install" durationInFrames={s(2.1)} />
      </Sequence>
      {/* seg 15 (1:07.7) you'll see the desktop */}
      <Sequence from={s(67.8)} durationInFrames={s(2.1)}>
        <ChapterCard part="Part 2" title="First boot" durationInFrames={s(2.1)} />
      </Sequence>
      {/* seg 23 (~1:41) about to run winver */}
      <Sequence from={s(100.6)} durationInFrames={s(2)}>
        <ChapterCard part="Part 3" title="Under the hood" durationInFrames={s(2)} />
      </Sequence>
      {/* seg 36 (2:54.8) open Control Panel */}
      <Sequence from={s(174.9)} durationInFrames={s(2)}>
        <ChapterCard part="Part 4" title="Clean & bloat-free" durationInFrames={s(2)} />
      </Sequence>
      {/* seg 43 (3:33.2) Post-Install folder */}
      <Sequence from={s(213.3)} durationInFrames={s(2)}>
        <ChapterCard part="Part 5" title="Post-install toolkit" durationInFrames={s(2)} />
      </Sequence>
      {/* seg 62-65 (5:16.5→end) outro CTA */}
      <Sequence from={s(317.5)} durationInFrames={s(17.2)}>
        <EndCard durationInFrames={s(17.2)} />
      </Sequence>
    </AbsoluteFill>
  );
};
