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
import './fonts.css';
import {easeInOut, easeOut, FONT_TITLE, textShadow, theme} from './theme';
import {
  Arrow,
  ChapterCard,
  Chip,
  ClickRipple,
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

const SRC = 'revi os 2026.mp4';
const s = (sec: number) => Math.round(sec * 30);

// ---------------------------------------------------------------------------
// Punch-in: a zoomed, in-sync copy of the footage to read tiny UI details.
// ---------------------------------------------------------------------------
const PunchIn: React.FC<{
  absStart: number;
  durationInFrames: number;
  scale: number;
  originX: number; // %
  originY: number; // %
}> = ({absStart, durationInFrames, scale, originX, originY}) => {
  const {vis} = useLife(durationInFrames, 14, 12);
  const sc = interpolate(vis, [0, 1], [1, scale], {easing: easeInOut});
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `scale(${sc})`, transformOrigin: `${originX}% ${originY}%`}}>
        <OffthreadVideo src={staticFile(SRC)} startFrom={absStart} muted />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Small floating info panel (guidance / reassurance / notes)
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

// Big centered stamp (impact reveal), keeps footage visible behind
const Stamp: React.FC<{text: string; sub?: string; durationInFrames: number}> = ({
  text,
  sub,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const {vis} = useLife(durationInFrames, 8, 12);
  const sc = interpolate(frame, [0, 10], [1.4, 1], {extrapolateRight: 'clamp', easing: easeOut});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', opacity: vis}}>
      <AbsoluteFill style={{background: 'rgba(4,4,6,0.35)'}} />
      <div style={{textAlign: 'center', transform: `scale(${sc})`}}>
        <div
          style={{
            fontFamily: FONT_TITLE,
            fontWeight: 900,
            fontSize: 120,
            color: theme.text,
            textShadow: '0 8px 40px rgba(0,0,0,0.7)',
          }}
        >
          {text}
        </div>
        {sub ? (
          <div style={{fontFamily: FONT_TITLE, fontWeight: 800, fontSize: 30, color: theme.red, letterSpacing: 3, marginTop: 8}}>
            {sub}
          </div>
        ) : null}
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
    // Safety: never hang the render on fonts.
    const t = setTimeout(clear, 6000);
    return () => clearTimeout(t);
  }, [handle]);
  return null;
};

export const ReviOsEdit: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: theme.bg}}>
      <FontGate />
      <OffthreadVideo src={staticFile(SRC)} />

      {/* ========================= INTRO (0–18s desktop) ========================= */}
      <Sequence from={s(3.2)} durationInFrames={s(5)}>
        <Note x={70} y={780} icon="⚡" title="ReviOS 2026 — Custom Windows" body="A debloated build tuned for gaming & everyday tasks" accent={theme.red} durationInFrames={s(5)} />
      </Sequence>
      <Sequence from={s(8.6)} durationInFrames={s(8.4)}>
        <Chip text="AME Wizard" x={640} y={150} durationInFrames={s(8.4)} />
      </Sequence>
      <Sequence from={s(9.6)} durationInFrames={s(7.4)}>
        <Chip text="ReviOS Playbook" x={640} y={214} durationInFrames={s(7.4)} />
      </Sequence>
      <Sequence from={s(11)} durationInFrames={s(6)}>
        <Note x={640} y={300} icon="🎮" title="One of the best for gaming in 2026" accent={theme.amber} durationInFrames={s(6)} />
      </Sequence>

      {/* ========================= CH1 · GET THE FILES ========================= */}
      {/* revi.cc/download visible ~20–30 */}
      <Sequence from={s(20)} durationInFrames={s(4.8)}>
        <StepCard step={1} total={8} title="Open the official ReviOS site" sub="Link is in the pinned comment" x={70} y={720} accent={theme.red} durationInFrames={s(4.8)} />
      </Sequence>
      <Sequence from={s(20.2)} durationInFrames={s(4.4)}>
        <Chip text="revi.cc/download" x={230} y={110} accent durationInFrames={s(4.4)} />
      </Sequence>
      <Sequence from={s(20.4)} durationInFrames={s(3.8)}>
        <Arrow tx={215} ty={64} from="bottom" label="Address bar" color={theme.amber} len={150} durationInFrames={s(3.8)} />
      </Sequence>

      {/* download playbook white button */}
      <Sequence from={s(24.6)} durationInFrames={s(5.4)}>
        <StepCard step={2} total={8} title="Download the ReviOS Playbook" sub="Click the white download button" x={1180} y={150} accent={theme.red} durationInFrames={s(5.4)} />
      </Sequence>
      <Sequence from={s(24.8)} durationInFrames={s(5)}>
        <Highlight x={398} y={758} w={262} h={46} color={theme.cyan} label="Download ReviOS Playbook" labelPos="bottom" durationInFrames={s(5)} />
      </Sequence>
      <Sequence from={s(29.4)} durationInFrames={s(0.9)}>
        <ClickRipple x={528} y={780} durationInFrames={s(0.9)} />
      </Sequence>

      {/* download modal ~30–34 */}
      <Sequence from={s(30.3)} durationInFrames={s(3.9)}>
        <StepCard step={3} total={8} title="Choose GitHub (No Ads)" sub="A pop-up asks how to download" x={70} y={150} accent={theme.red} durationInFrames={s(3.9)} />
      </Sequence>
      <Sequence from={s(30.6)} durationInFrames={s(3.4)}>
        <Highlight x={762} y={676} w={396} h={44} color={theme.green} label="Download from GitHub" labelPos="bottom" durationInFrames={s(3.4)} />
      </Sequence>
      <Sequence from={s(30.8)} durationInFrames={s(3)}>
        <Arrow tx={960} ty={608} from="top" label="Skip 'with Ads'" color={theme.warn} len={130} durationInFrames={s(3)} />
      </Sequence>

      {/* GitHub playbook release ~34–38 */}
      <Sequence from={s(34.3)} durationInFrames={s(3.5)}>
        <Note x={70} y={150} icon="🐙" title="GitHub release opens" body="This is the official ReviOS Playbook 26.04." accent={theme.cyan} durationInFrames={s(3.5)} />
      </Sequence>

      {/* ModsFire download page ~38–48 */}
      <Sequence from={s(38.3)} durationInFrames={s(6)}>
        <Note x={70} y={720} icon="⬇️" title="Download the Playbook file" body="Click Generate Link, then download the .apbx." accent={theme.cyan} durationInFrames={s(6)} />
      </Sequence>
      <Sequence from={s(39)} durationInFrames={s(5)}>
        <Chip text="Revi-PB-26.04.apbx" x={70} y={860} accent durationInFrames={s(5)} />
      </Sequence>

      {/* revi.cc brief ~48–51: Get AME Wizard */}
      <Sequence from={s(48)} durationInFrames={s(3)}>
        <Highlight x={686} y={760} w={150} h={44} color={theme.cyan} label="Get AME Wizard" labelPos="top" durationInFrames={s(3)} />
      </Sequence>

      {/* GitHub AME Wizard ~51–60 */}
      <Sequence from={s(51.4)} durationInFrames={s(8)}>
        <StepCard step={4} total={8} title="Download AME Wizard" sub="The open-source app that loads the Playbook" x={1120} y={150} accent={theme.red} durationInFrames={s(8)} />
      </Sequence>
      <Sequence from={s(52.4)} durationInFrames={s(6.5)}>
        <Highlight x={350} y={704} w={272} h={46} color={theme.green} label="AME-Beta.exe · 147 MB" labelPos="top" durationInFrames={s(6.5)} />
      </Sequence>

      {/* requirements */}
      <Sequence from={s(58.6)} durationInFrames={s(4.6)}>
        <Chip text="Windows 11 · 24H2 / 25H2" x={70} y={860} durationInFrames={s(4.6)} />
      </Sequence>
      <Sequence from={s(63.4)} durationInFrames={s(4)}>
        <Note x={70} y={150} icon="✅" title="Needs an official, activated Windows" body="Your install must meet these builds." accent={theme.amber} durationInFrames={s(4)} />
      </Sequence>

      {/* ========================= CH2 · LOAD PLAYBOOK ========================= */}
      {/* beach desktop 63–77 : both files */}
      <Sequence from={s(67)} durationInFrames={s(5)}>
        <StepCard step={5} total={8} title="Both files on the Desktop" sub="AME Wizard + ReviOS Playbook are ready" x={70} y={720} accent={theme.red} durationInFrames={s(5)} />
      </Sequence>
      <Sequence from={s(67.3)} durationInFrames={s(4.4)}>
        <Highlight x={856} y={4} w={210} h={82} color={theme.cyan} label="Your two files" labelPos="bottom" durationInFrames={s(4.4)} />
      </Sequence>

      {/* AME wizard first screen 78–92 */}
      <Sequence from={s(78.3)} durationInFrames={s(6.5)}>
        <StepCard step={6} total={8} title="Open AME Wizard → load the Playbook" sub="Click Browse and pick it on your Desktop" x={1120} y={150} accent={theme.red} durationInFrames={s(6.5)} />
      </Sequence>
      <Sequence from={s(79)} durationInFrames={s(5.5)}>
        <Highlight x={808} y={298} w={178} h={42} color={theme.cyan} label="Browse" labelPos="top" durationInFrames={s(5.5)} />
      </Sequence>
      <Sequence from={s(85)} durationInFrames={s(5)}>
        <Note x={1120} y={150} icon="🖱️" title="…or just drag & drop it" body="Drop the Playbook into AME Wizard — it loads automatically." accent={theme.cyan} durationInFrames={s(5)} />
      </Sequence>
      <Sequence from={s(85.2)} durationInFrames={s(4.6)}>
        <Highlight x={424} y={165} w={256} h={140} color={theme.amber} label="Drop it here" labelPos="bottom" durationInFrames={s(4.6)} />
      </Sequence>

      {/* like & subscribe (narration ~88–94) */}
      <Sequence from={s(90)} durationInFrames={s(5)}>
        <SubNudge durationInFrames={s(5)} />
      </Sequence>

      {/* ========================= CH3 · DISABLE SECURITY ========================= */}
      {/* wizard Run action 96 ; Windows security flow 99–118 */}
      <Sequence from={s(96.5)} durationInFrames={s(7)}>
        <StepCard step={7} total={8} title="Disable Windows security" sub="Run Action → open Windows Security" x={70} y={720} accent={theme.warn} durationInFrames={s(7)} />
      </Sequence>
      <Sequence from={s(104)} durationInFrames={s(6)}>
        <Note x={70} y={150} icon="🚫" title="Turn every protection OFF" body="Real-time, tamper & cloud protection — all off." accent={theme.warn} durationInFrames={s(6)} />
      </Sequence>
      <Sequence from={s(110.5)} durationInFrames={s(4.5)}>
        <Note x={1180} y={150} icon="🛡️" title="Safe & tested by thousands" body="No viruses — Defender is off only for the install." accent={theme.green} durationInFrames={s(4.5)} />
      </Sequence>
      <Sequence from={s(115)} durationInFrames={s(4)}>
        <Note x={70} y={150} icon="✅" title="Security disabled — close the window" accent={theme.green} durationInFrames={s(4)} />
      </Sequence>

      {/* ========================= CH4 · CONFIGURE & INSTALL ========================= */}
      {/* Analyzing / checking 123–138 */}
      <Sequence from={s(125)} durationInFrames={s(6)}>
        <Note x={70} y={150} icon="▶️" title="Click Next — AME prepares the install" body="It verifies your Windows build & requirements." accent={theme.cyan} durationInFrames={s(6)} />
      </Sequence>
      <Sequence from={s(133.2)} durationInFrames={s(4.5)}>
        <Note x={70} y={720} icon="💬" title="Tried ReviOS before?" body="Tell me in the comments 👇" accent={theme.red} durationInFrames={s(4.5)} />
      </Sequence>

      {/* license 138–147 */}
      <Sequence from={s(138.4)} durationInFrames={s(7.5)}>
        <Note x={70} y={720} icon="📜" title="Requirements met → accept the license" body="Acknowledge the ReviOS Project agreements, then Next." accent={theme.cyan} durationInFrames={s(7.5)} />
      </Sequence>
      <Sequence from={s(139)} durationInFrames={s(4.5)}>
        <Arrow tx={1235} ty={781} from="top" label="Next" color={theme.amber} len={140} durationInFrames={s(4.5)} />
      </Sequence>

      {/* configure options 150–165 */}
      <Sequence from={s(150.4)} durationInFrames={s(13)}>
        <StepCard step={8} total={8} title="Configure it to your taste" sub="Defaults are safe — but review every option" x={1120} y={150} accent={theme.red} durationInFrames={s(13)} />
      </Sequence>
      <Sequence from={s(152.6)} durationInFrames={s(10)}>
        <PunchIn absStart={s(152.6)} durationInFrames={s(10)} scale={1.3} originX={38} originY={34} />
      </Sequence>
      <Sequence from={s(153.4)} durationInFrames={s(9)}>
        <Note x={70} y={760} icon="⚙️" title="Review every option" body="Browser, debloat, hibernate… defaults are safe." accent={theme.cyan} durationInFrames={s(9)} />
      </Sequence>

      {/* start install 165–168 */}
      <Sequence from={s(164.5)} durationInFrames={s(4)}>
        <Note x={70} y={150} icon="🚀" title="Click Next to start installing" accent={theme.green} durationInFrames={s(4)} />
      </Sequence>

      {/* apply playbook 168–191 */}
      <Sequence from={s(168.5)} durationInFrames={s(5)}>
        <Note x={1180} y={150} icon="⏱️" title="Takes 5–30 minutes" body="Be patient — it's worth the wait." accent={theme.amber} durationInFrames={s(5)} />
      </Sequence>
      <Sequence from={s(168.5)} durationInFrames={s(16)}>
        <ProgressBar label="Installing ReviOS 2026" x={70} y={860} from={5} to={99} accent={theme.red} durationInFrames={s(16)} />
      </Sequence>
      <Sequence from={s(177.5)} durationInFrames={s(5.5)}>
        <SubNudge durationInFrames={s(5.5)} text="Enjoying it? LIKE & SHARE the guide" />
      </Sequence>
      <Sequence from={s(184)} durationInFrames={s(5.5)}>
        <Note x={1180} y={150} icon="🔁" title="Done! Auto-restart in ~10s" body="The PC reboots into ReviOS automatically." accent={theme.green} durationInFrames={s(5.5)} />
      </Sequence>

      {/* ========================= RESULT (192–219 red desktop) ========================= */}
      <Sequence from={s(192.2)} durationInFrames={s(2.6)}>
        <Stamp text="ReviOS 2026" sub="INSTALLED ✓" durationInFrames={s(2.6)} />
      </Sequence>
      <Sequence from={s(195)} durationInFrames={s(5)}>
        <Note x={70} y={780} icon="🎉" title="Welcome to your ReviOS 2026 desktop" body="One of the best custom OSes for gaming right now." accent={theme.red} durationInFrames={s(5)} />
      </Sequence>
      <Sequence from={s(200.4)} durationInFrames={s(6)}>
        <Note x={70} y={150} icon="📌" title="All download links in the pinned comment" accent={theme.amber} durationInFrames={s(6)} />
      </Sequence>

      {/* Watermark over footage (full-screen cards below paint over it) */}
      <Sequence from={s(3)} durationInFrames={s(207) - s(3)}>
        <Watermark />
      </Sequence>

      {/* ===================== FULL-SCREEN CARDS (painted on top) ===================== */}
      <Sequence from={0} durationInFrames={s(2.8)}>
        <TitleIntro durationInFrames={s(2.8)} />
      </Sequence>
      <Sequence from={s(17.6)} durationInFrames={s(2.1)}>
        <ChapterCard part="Part 1" title="Get the files" durationInFrames={s(2.1)} />
      </Sequence>
      <Sequence from={s(64.6)} durationInFrames={s(2)}>
        <ChapterCard part="Part 2" title="Load the Playbook" durationInFrames={s(2)} />
      </Sequence>
      <Sequence from={s(93.2)} durationInFrames={s(2)}>
        <ChapterCard part="Part 3" title="Disable security" durationInFrames={s(2)} />
      </Sequence>
      <Sequence from={s(121)} durationInFrames={s(2)}>
        <ChapterCard part="Part 4" title="Configure & install" durationInFrames={s(2)} />
      </Sequence>
      <Sequence from={s(207)} durationInFrames={s(12.5)}>
        <EndCard durationInFrames={s(12.5)} />
      </Sequence>
    </AbsoluteFill>
  );
};
