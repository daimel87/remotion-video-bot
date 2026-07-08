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

export const AtomOsEdit: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: theme.bg}}>
      <FontGate />
      <OffthreadVideo src={staticFile(SRC)} />

      {/* ===================== INTRO (0–12 boot splash) ===================== */}
      <Sequence from={s(3.2)} durationInFrames={s(5)}>
        <Note x={70} y={780} icon="⚛️" title="AtomOS 11 Standard" body="A Windows 11 25H2 custom build for low-end PCs" accent={theme.red} durationInFrames={s(5)} />
      </Sequence>
      <Sequence from={s(6.8)} durationInFrames={s(5.5)}>
        <Note x={70} y={150} icon="🪶" title="Debloated · lightweight · fast" accent={theme.cyan} durationInFrames={s(5.5)} />
      </Sequence>

      {/* ===================== PART 1 · INSTALL ===================== */}
      {/* language dialog 12–24 */}
      <Sequence from={s(14)} durationInFrames={s(7)}>
        <StepCard step={1} total={6} title="Unusual first screen" sub="A full desktop loads, with the installer in the center" x={70} y={720} accent={theme.red} durationInFrames={s(7)} />
      </Sequence>
      <Sequence from={s(22.6)} durationInFrames={s(6.4)}>
        <Note x={70} y={150} icon="🌐" title="Pick your language → English" body="Then click Next and Install Now." accent={theme.cyan} durationInFrames={s(6.4)} />
      </Sequence>
      {/* install flow 30–47 */}
      <Sequence from={s(30.2)} durationInFrames={s(9)}>
        <Note x={70} y={150} icon="📝" title="Standard Windows 11 install" body="Accept the license, choose the drive, copy files." accent={theme.cyan} durationInFrames={s(9)} />
      </Sequence>
      <Sequence from={s(40)} durationInFrames={s(7)}>
        <ProgressBar label="Installing Windows 11 25H2" x={70} y={860} from={10} to={92} accent={theme.red} durationInFrames={s(7)} />
      </Sequence>
      {/* compression 47–67 */}
      <Sequence from={s(47.3)} durationInFrames={s(8)}>
        <StepCard step={2} total={6} title="Automatic file compression" sub="How devs shrink the OS footprint on disk" x={70} y={150} accent={theme.red} durationInFrames={s(8)} />
      </Sequence>
      <Sequence from={s(55.5)} durationInFrames={s(11)}>
        <Note x={70} y={760} icon="⏱️" title="~15 minutes — be patient" body="This compression is what makes AtomOS so tiny." accent={theme.amber} durationInFrames={s(11)} />
      </Sequence>

      {/* ===================== PART 2 · FIRST BOOT ===================== */}
      {/* desktop + start 78–92 */}
      <Sequence from={s(78.5)} durationInFrames={s(7)}>
        <StepCard step={3} total={6} title="Clean, minimalist desktop" sub="Official Windows 11 Start menu — zero bloatware" x={70} y={720} accent={theme.red} durationInFrames={s(7)} />
      </Sequence>
      {/* microsoft store 92–100 */}
      <Sequence from={s(92.5)} durationInFrames={s(6.5)}>
        <Note x={70} y={150} icon="🛍️" title="Microsoft Store works normally" body="Install any Store app just like stock Windows." accent={theme.green} durationInFrames={s(6.5)} />
      </Sequence>

      {/* ===================== PART 3 · UNDER THE HOOD ===================== */}
      {/* winver 100–116 */}
      <Sequence from={s(101)} durationInFrames={s(13.5)}>
        <Chip text="winver" x={1500} y={150} accent durationInFrames={s(13.5)} />
      </Sequence>
      <Sequence from={s(101.5)} durationInFrames={s(12.5)}>
        <Highlight x={185} y={376} w={492} h={44} color={theme.cyan} label="Windows 11 25H2 · Build 26200.6901" labelPos="bottom" durationInFrames={s(12.5)} />
      </Sequence>
      <Sequence from={s(103)} durationInFrames={s(10)}>
        <Note x={1290} y={470} icon="🪟" title="Genuine Windows 11 Pro" body="Not a fake ISO — real 25H2 underneath." accent={theme.green} durationInFrames={s(10)} />
      </Sequence>

      {/* task manager 120–135 */}
      <Sequence from={s(120.5)} durationInFrames={s(6.5)}>
        <StepCard step={4} total={6} title="Idle performance" sub="Task Manager on a low-end 4 GB machine" x={1260} y={150} accent={theme.red} durationInFrames={s(6.5)} />
      </Sequence>
      <Sequence from={s(121)} durationInFrames={s(6)}>
        <StatCard value="23" label="BACKGROUND PROCESSES" x={1300} y={360} accent={theme.amber} durationInFrames={s(6)} />
      </Sequence>
      <Sequence from={s(127)} durationInFrames={s(3.5)}>
        <StatCard value="~7%" label="CPU IDLE" x={1300} y={360} accent={theme.amber} durationInFrames={s(3.5)} />
      </Sequence>
      <Sequence from={s(130.5)} durationInFrames={s(5)}>
        <Highlight x={308} y={344} w={352} h={70} color={theme.cyan} label="RAM: 2.4 / 4 GB idle" labelPos="top" durationInFrames={s(5)} />
      </Sequence>
      <Sequence from={s(135.5)} durationInFrames={s(3.5)}>
        <Note x={70} y={150} icon="ℹ️" title="Numbers are estimates" body="Your results vary with your hardware." accent={theme.cyan} durationInFrames={s(3.5)} />
      </Sequence>

      {/* ISO size 140–156 */}
      <Sequence from={s(140.5)} durationInFrames={s(7.5)}>
        <StatCard value="2.87 GB" label="TINY ISO · ENGLISH" x={1330} y={180} accent={theme.amber} durationInFrames={s(7.5)} />
      </Sequence>
      <Sequence from={s(141)} durationInFrames={s(7)}>
        <Note x={70} y={760} icon="💿" title="Tiny ISO · English" body="Download from the official AtomOS site (pinned)." accent={theme.cyan} durationInFrames={s(7)} />
      </Sequence>
      {/* C drive 156–168 : creator zooms the dialog, so use a position-safe stat */}
      <Sequence from={s(157.5)} durationInFrames={s(8.5)}>
        <StatCard value="7.44 GB" label="TOTAL INSTALL SIZE" x={70} y={720} accent={theme.amber} durationInFrames={s(8.5)} />
      </Sequence>
      <Sequence from={s(158)} durationInFrames={s(7.5)}>
        <Note x={70} y={150} icon="🪶" title="Barely any disk space" body="A full Windows 11 in ~7 GB — that's tiny." accent={theme.green} durationInFrames={s(7.5)} />
      </Sequence>

      {/* ===================== PART 4 · CLEAN & BLOAT-FREE ===================== */}
      {/* control panel programs 176–192 */}
      <Sequence from={s(176.5)} durationInFrames={s(8)}>
        <Note x={70} y={150} icon="🧹" title="Only ONE app installed" body="Remote Desktop Connection — that's it." accent={theme.green} durationInFrames={s(8)} />
      </Sequence>
      {/* windows features 192–204 */}
      <Sequence from={s(192.5)} durationInFrames={s(9)}>
        <Note x={70} y={760} icon="🧩" title="Useful features pre-enabled" body=".NET 3.5 & 4.8, Legacy Components, Print to PDF…" accent={theme.cyan} durationInFrames={s(9)} />
      </Sequence>
      {/* right-click 204–214 */}
      <Sequence from={s(205)} durationInFrames={s(7)}>
        <Note x={70} y={150} icon="🖱️" title="No cluttered right-click menu" body="Everything is organized in the Post-Install folder." accent={theme.cyan} durationInFrames={s(7)} />
      </Sequence>

      {/* ===================== PART 5 · POST-INSTALL TOOLKIT ===================== */}
      {/* post-install folder 216–236 */}
      <Sequence from={s(217)} durationInFrames={s(9)}>
        <StepCard step={5} total={6} title="The Post-Install toolkit" sub="Start · Tweaks · Tools · Wallpapers · Others" x={1180} y={150} accent={theme.red} durationInFrames={s(9)} />
      </Sequence>
      <Sequence from={s(228)} durationInFrames={s(7)}>
        <Note x={1180} y={720} icon="🛠️" title="Tools included" body="7-Zip, WinUtil, OO ShutUp10, WPD & more." accent={theme.cyan} durationInFrames={s(7)} />
      </Sequence>
      {/* wallpapers 236–248 */}
      <Sequence from={s(236.5)} durationInFrames={s(7)}>
        <Note x={70} y={150} icon="🖼️" title="Wallpaper pack (light & dark)" body="Which one do you prefer? Tell me in the comments." accent={theme.red} durationInFrames={s(7)} />
      </Sequence>

      {/* ===================== PART 6 · SETTINGS & UPDATES ===================== */}
      {/* activation 248–260 */}
      <Sequence from={s(249)} durationInFrames={s(7)}>
        <Note x={70} y={150} icon="🔑" title="Windows needs activation" body="Expected — activate it with your own license." accent={theme.amber} durationInFrames={s(7)} />
      </Sequence>
      {/* defender 268–280 */}
      <Sequence from={s(268.5)} durationInFrames={s(7)}>
        <Note x={70} y={760} icon="🛡️" title="Windows Defender included" body="Full built-in antivirus, still active." accent={theme.green} durationInFrames={s(7)} />
      </Sequence>
      {/* updates 2050 280–290 */}
      <Sequence from={s(279)} durationInFrames={s(6)}>
        <StatCard value="2050" label="UPDATES PAUSED UNTIL" x={70} y={150} accent={theme.amber} durationInFrames={s(6)} />
      </Sequence>
      <Sequence from={s(285)} durationInFrames={s(6.5)}>
        <Note x={70} y={760} icon="⚠️" title="Don't update a modded build" body="Updating can undo the developer's optimizations." accent={theme.warn} durationInFrames={s(6.5)} />
      </Sequence>

      {/* like nudge mid-outro */}
      <Sequence from={s(300)} durationInFrames={s(5.5)}>
        <SubNudge durationInFrames={s(5.5)} text="Enjoying the review? LIKE & SUBSCRIBE" />
      </Sequence>

      {/* result stamp */}
      <Sequence from={s(308)} durationInFrames={s(3)}>
        <Stamp text="AtomOS 11" sub="LIGHTWEIGHT · BLOAT-FREE" durationInFrames={s(3)} />
      </Sequence>
      <Sequence from={s(312)} durationInFrames={s(6.5)}>
        <Note x={70} y={760} icon="📌" title="Official AtomOS link in the pinned comment" accent={theme.amber} durationInFrames={s(6.5)} />
      </Sequence>

      {/* Watermark over footage (full-screen cards below paint over it) */}
      <Sequence from={s(3)} durationInFrames={s(320) - s(3)}>
        <Watermark />
      </Sequence>

      {/* ===================== FULL-SCREEN CARDS (on top) ===================== */}
      <Sequence from={0} durationInFrames={s(2.8)}>
        <TitleIntro durationInFrames={s(2.8)} />
      </Sequence>
      <Sequence from={s(11.4)} durationInFrames={s(2.1)}>
        <ChapterCard part="Part 1" title="The install" durationInFrames={s(2.1)} />
      </Sequence>
      <Sequence from={s(75)} durationInFrames={s(2.1)}>
        <ChapterCard part="Part 2" title="First boot" durationInFrames={s(2.1)} />
      </Sequence>
      <Sequence from={s(98)} durationInFrames={s(2.1)}>
        <ChapterCard part="Part 3" title="Under the hood" durationInFrames={s(2.1)} />
      </Sequence>
      <Sequence from={s(172.5)} durationInFrames={s(2.1)}>
        <ChapterCard part="Part 4" title="Clean & bloat-free" durationInFrames={s(2.1)} />
      </Sequence>
      <Sequence from={s(214)} durationInFrames={s(2.1)}>
        <ChapterCard part="Part 5" title="Post-install toolkit" durationInFrames={s(2.1)} />
      </Sequence>
      <Sequence from={s(320)} durationInFrames={s(14.5)}>
        <EndCard durationInFrames={s(14.5)} />
      </Sequence>
    </AbsoluteFill>
  );
};
