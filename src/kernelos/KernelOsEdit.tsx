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
import {backOut, easeOut, FONT_MONO, FONT_TITLE, panelShadow, textShadow, theme} from './theme';
import {
  ChapterCard,
  Chip,
  EndCard,
  Highlight,
  Panel,
  StepCard,
  TitleIntro,
  useLife,
  Watermark,
} from './components';

// "KernelOS 11 25H2" — gaming-optimized Windows build review. 4:47.45 source (30 fps).
const SRC = 'kernelos_11_25h2.mp4';
const s = (sec: number) => Math.round(sec * 30);
const TOTAL = 8623;

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
    ])
      .then(() => document.fonts.ready)
      .then(clear)
      .catch((e) => cancelRender(e));
    const t = setTimeout(clear, 6000);
    return () => clearTimeout(t);
  }, [handle]);
  return null;
};

// ===========================================================================
// INTRO — full-screen motion graphics (0 → 0:22.96). The raw footage is
// fully hidden here; only the original narration audio plays underneath.
// From "Once the installation is complete..." onward, the real video plays.
// ===========================================================================
const SceneShell: React.FC<{
  children: React.ReactNode;
  durationInFrames: number;
  shardSide?: 'left' | 'right';
}> = ({children, durationInFrames, shardSide = 'right'}) => {
  const frame = useCurrentFrame();
  const {vis} = useLife(durationInFrames, 14, 14);
  const drift = (frame * 0.4) % 64;
  return (
    <AbsoluteFill style={{opacity: vis}}>
      <AbsoluteFill style={{background: theme.gradientDark}} />
      <AbsoluteFill
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, rgba(255,255,255,0.035) 0px, rgba(255,255,255,0.035) 1px, transparent 1px, transparent 64px)',
          backgroundPosition: `${drift}px 0px`,
        }}
      />
      <AbsoluteFill style={{overflow: 'hidden'}}>
        <div
          style={{
            position: 'absolute',
            [shardSide === 'right' ? 'right' : 'left']: -260,
            top: -260,
            width: 1100,
            height: 1100,
            background: theme.gradient,
            opacity: 0.16,
            clipPath: 'polygon(40% 0, 100% 45%, 60% 100%, 0 55%)',
            transform: `rotate(${shardSide === 'right' ? 12 : -12}deg)`,
          }}
        />
      </AbsoluteFill>
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};

const Bumper: React.FC<{icon: string; text: string; durationInFrames: number}> = ({icon, text, durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sp = spring({frame, fps, config: {damping: 11, stiffness: 200}});
  const spin = interpolate(frame, [0, durationInFrames], [0, 220]);
  const flash = interpolate(frame, [0, 4, 12], [0, 0.85, 0], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{background: theme.bg, justifyContent: 'center', alignItems: 'center'}}>
      <AbsoluteFill style={{background: theme.red, opacity: flash}} />
      <div style={{textAlign: 'center', transform: `scale(${sp})`}}>
        <div style={{fontSize: 110, transform: `rotate(${spin}deg)`}}>{icon}</div>
        <div style={{fontFamily: FONT_TITLE, fontWeight: 900, fontSize: 56, color: theme.text, letterSpacing: 4, marginTop: 14}}>{text}</div>
      </div>
    </AbsoluteFill>
  );
};

const GameChipsScene: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s1 = spring({frame, fps, config: {damping: 200}});
  const games = ['🟩 ROBLOX', '🔫 VALORANT', '🚗 GTA 6'];
  return (
    <SceneShell durationInFrames={durationInFrames}>
      <div style={{textAlign: 'center', maxWidth: 1560}}>
        <div style={{fontFamily: FONT_MONO, fontWeight: 700, fontSize: 26, letterSpacing: 7, color: theme.cyan, opacity: s1, textTransform: 'uppercase'}}>
          Whatever you play
        </div>
        <div
          style={{
            fontFamily: FONT_TITLE,
            fontWeight: 900,
            fontSize: 74,
            color: theme.text,
            lineHeight: 1.08,
            marginTop: 10,
            textShadow: '0 8px 40px rgba(0,0,0,0.6)',
            transform: `scale(${interpolate(s1, [0, 1], [0.92, 1])})`,
          }}
        >
          THIS VIDEO IS FOR YOU
        </div>
        <div style={{display: 'inline-flex', gap: 18, marginTop: 40}}>
          {games.map((g, i) => {
            const gs = spring({frame: frame - 14 - i * 8, fps, config: {damping: 200}});
            return (
              <span
                key={g}
                style={{
                  fontFamily: FONT_TITLE,
                  fontWeight: 800,
                  fontSize: 30,
                  color: theme.text,
                  border: `2px solid ${theme.red}`,
                  padding: '12px 26px',
                  borderRadius: 999,
                  opacity: gs,
                  transform: `translateY(${interpolate(gs, [0, 1], [20, 0])}px) scale(${interpolate(gs, [0, 1], [0.85, 1], {easing: backOut})})`,
                }}
              >
                {g}
              </span>
            );
          })}
        </div>
      </div>
    </SceneShell>
  );
};

const Hook: React.FC<{kicker?: string; title: string; sub?: string; icon?: string; durationInFrames: number}> = ({
  kicker,
  title,
  sub,
  icon,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s1 = spring({frame, fps, config: {damping: 200}});
  const s2 = spring({frame: frame - 12, fps, config: {damping: 200}});
  return (
    <SceneShell durationInFrames={durationInFrames}>
      <div style={{textAlign: 'center', maxWidth: 1560, transform: `translateY(${interpolate(s1, [0, 1], [36, 0])}px)`}}>
        {icon ? <div style={{fontSize: 72, marginBottom: 14, opacity: s1}}>{icon}</div> : null}
        {kicker ? (
          <div style={{fontFamily: FONT_MONO, fontWeight: 700, fontSize: 26, letterSpacing: 7, color: theme.cyan, opacity: s1, textTransform: 'uppercase'}}>
            {kicker}
          </div>
        ) : null}
        <div
          style={{
            fontFamily: FONT_TITLE,
            fontWeight: 900,
            fontSize: 72,
            color: theme.text,
            lineHeight: 1.1,
            marginTop: 10,
            textShadow: '0 8px 40px rgba(0,0,0,0.6)',
            transform: `scale(${interpolate(s1, [0, 1], [0.92, 1])})`,
          }}
        >
          {title}
        </div>
        {sub ? (
          <div
            style={{
              fontFamily: FONT_TITLE,
              fontWeight: 600,
              fontSize: 30,
              color: theme.textDim,
              marginTop: 22,
              opacity: s2,
              transform: `translateY(${interpolate(s2, [0, 1], [16, 0])}px)`,
            }}
          >
            {sub}
          </div>
        ) : null}
      </div>
    </SceneShell>
  );
};

const WipeOutScene: React.FC<{text: string; durationInFrames: number}> = ({text, durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {vis} = useLife(durationInFrames, 10, 22);
  const s1 = spring({frame, fps, config: {damping: 200}});
  return (
    <AbsoluteFill style={{background: theme.gradientDark, opacity: vis, justifyContent: 'center', alignItems: 'center'}}>
      <div style={{textAlign: 'center', transform: `translateY(${interpolate(s1, [0, 1], [26, 0])}px)`}}>
        <div style={{fontFamily: FONT_TITLE, fontWeight: 900, fontSize: 60, color: theme.text}}>
          📌 {text}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ===========================================================================
// TUTORIAL PART — light overlays over the real footage, from "Once the
// installation is complete..." (0:22.96) onward. Timings are anchored to
// the BUZZ TRANSCRIPT so every overlay appears when the narrator says it.
// ===========================================================================
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
            <div style={{fontFamily: FONT_TITLE, fontWeight: 800, fontSize: 25, color: theme.text, textShadow}}>{title}</div>
            {body ? (
              <div style={{fontFamily: FONT_TITLE, fontWeight: 400, fontSize: 18, color: theme.textDim, marginTop: 5, lineHeight: 1.3}}>{body}</div>
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
        <div style={{fontFamily: FONT_TITLE, fontWeight: 900, fontSize: 58, color: accent, lineHeight: 1}}>{value}</div>
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
      <AbsoluteFill style={{background: 'rgba(6,4,2,0.4)'}} />
      <div style={{textAlign: 'center', transform: `scale(${sc})`}}>
        <div style={{fontFamily: FONT_TITLE, fontWeight: 900, fontSize: 100, color: theme.text, textShadow: '0 8px 40px rgba(0,0,0,0.7)'}}>{text}</div>
        {sub ? <div style={{fontFamily: FONT_TITLE, fontWeight: 800, fontSize: 28, color: theme.red, letterSpacing: 3, marginTop: 8}}>{sub}</div> : null}
      </div>
    </AbsoluteFill>
  );
};

// ===========================================================================
// Main composition
// ===========================================================================
export const KernelOsEdit: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: theme.bg}}>
      <FontGate />
      <OffthreadVideo src={staticFile(SRC)} />

      {/* Solid backdrop under every intro scene except the final WipeOut, so
          scene-to-scene fades never flash the raw footage underneath. */}
      <Sequence from={0} durationInFrames={s(20.72)}>
        <AbsoluteFill style={{background: theme.gradientDark}} />
      </Sequence>

      {/* =============================== INTRO =============================== */}
      <Sequence from={0} durationInFrames={s(7.66)}>
        <TitleIntro durationInFrames={s(7.66)} />
      </Sequence>
      <Sequence from={s(7.66)} durationInFrames={s(9.74) - s(7.66)}>
        <Bumper icon="🎮" text="FOR GAMING" durationInFrames={s(9.74) - s(7.66)} />
      </Sequence>
      <Sequence from={s(9.74)} durationInFrames={s(15.92) - s(9.74)}>
        <GameChipsScene durationInFrames={s(15.92) - s(9.74)} />
      </Sequence>
      <Sequence from={s(15.92)} durationInFrames={s(20.72) - s(15.92)}>
        <Hook kicker="Full article + ISO download" title="LINK IN THE FIRST PINNED COMMENT" icon="🔗" durationInFrames={s(20.72) - s(15.92)} />
      </Sequence>
      <Sequence from={s(20.72)} durationInFrames={s(22.96) - s(20.72)}>
        <WipeOutScene text="CHECK THE PINNED COMMENT" durationInFrames={s(22.96) - s(20.72)} />
      </Sequence>

      {/* ============================ TUTORIAL ============================ */}
      <Sequence from={s(22.96)} durationInFrames={TOTAL - s(22.96)}>
        <Watermark />
      </Sequence>

      {/* seg 6-9 (0:22.96) post-installation script, integrity check */}
      <Sequence from={s(22.96)} durationInFrames={s(32.2) - s(22.96)}>
        <StepCard step={1} total={5} title="Post-installation script" sub="Runs automatically right after setup" x={70} y={780} accent={theme.red} durationInFrames={s(32.2) - s(22.96)} />
      </Sequence>
      <Sequence from={s(32.2)} durationInFrames={s(37.6) - s(32.2)}>
        <Note x={70} y={150} icon="✅" title="System integrity check (optional)" body="Runs DISM + SFC — skip it to keep moving." accent={theme.cyan} durationInFrames={s(37.6) - s(32.2)} />
      </Sequence>
      {/* seg 10-13 (0:37.6) explorer patcher, power plan, 7-zip, directx, vc++ */}
      <Sequence from={s(37.6)} durationInFrames={s(51.8) - s(37.6)}>
        <StepCard step={2} total={5} title="Auto-installs the essentials" sub="Explorer Patcher · KernelOS power plan · 7-Zip · DirectX" x={70} y={150} accent={theme.red} durationInFrames={s(51.8) - s(37.6)} />
      </Sequence>
      <Sequence from={s(51.8)} durationInFrames={s(59.32) - s(51.8)}>
        <Note x={70} y={780} icon="🎮" title="Visual C++ Redistributables" body="Essential for running modern games." accent={theme.cyan} durationInFrames={s(59.32) - s(51.8)} />
      </Sequence>
      {/* seg 14-15 (0:59.32) restart to apply changes */}
      <Sequence from={s(59.32)} durationInFrames={s(65.64) - s(59.32)}>
        <Note x={70} y={150} icon="🔄" title="PC restarts to apply everything" accent={theme.amber} durationInFrames={s(65.64) - s(59.32)} />
      </Sequence>

      {/* seg 16-19 (1:05.64) inside KernelOS, desktop shortcuts + toolbox */}
      <Sequence from={s(72.399)} durationInFrames={s(87.16) - s(72.399)}>
        <Note x={70} y={150} icon="🖥️" title="Desktop shortcuts" body="Recycle bin, official site, YouTube, TikTok, Discord, X — and the post-install toolbox." accent={theme.cyan} durationInFrames={s(87.16) - s(72.399)} />
      </Sequence>

      {/* seg 20-27 (1:27.16) post-install toolbox: browsers, tools, solutions, tweaking */}
      <Sequence from={s(87.16)} durationInFrames={s(90.479) - s(87.16)}>
        <StepCard step={3} total={5} title="The post-install toolbox" x={1180} y={150} accent={theme.red} durationInFrames={s(90.479) - s(87.16)} />
      </Sequence>
      <Sequence from={s(90.479)} durationInFrames={s(99.759) - s(90.479)}>
        <Note x={1180} y={720} icon="🌐" title="Install any popular browser" body="KernelOS ships without one by default." accent={theme.cyan} durationInFrames={s(99.759) - s(90.479)} />
      </Sequence>
      <Sequence from={s(99.759)} durationInFrames={s(105.199) - s(99.759)}>
        <Note x={70} y={150} icon="🛠️" title="Useful tools section" body="Worth checking out." accent={theme.cyan} durationInFrames={s(105.199) - s(99.759)} />
      </Sequence>
      <Sequence from={s(105.199)} durationInFrames={s(112.52) - s(105.199)}>
        <Note x={70} y={150} icon="🩹" title="Solutions section" body="Fixes for common issues." accent={theme.cyan} durationInFrames={s(112.52) - s(105.199)} />
      </Sequence>
      <Sequence from={s(112.52)} durationInFrames={s(121.039) - s(112.52)}>
        <Note x={70} y={780} icon="⚙️" title="Tweaking section" body="Registry tweaks and other optimizations." accent={theme.cyan} durationInFrames={s(121.039) - s(112.52)} />
      </Sequence>

      {/* seg 28 (2:01.039) start menu */}
      <Sequence from={s(121.039)} durationInFrames={s(126) - s(121.039)}>
        <Note x={70} y={150} icon="🪟" title="Official Windows 11 Start menu" body="Left-aligned, untouched." accent={theme.green} durationInFrames={s(126) - s(121.039)} />
      </Sequence>

      {/* seg 29-30 (2:06) winver → build 26200.7462 */}
      <Sequence from={s(126)} durationInFrames={s(137.76) - s(126)}>
        <Chip text="winver" x={1500} y={150} accent durationInFrames={s(137.76) - s(126)} />
      </Sequence>
      <Sequence from={s(133.32)} durationInFrames={s(136.8) - s(133.32)}>
        <Highlight x={150} y={352} w={420} h={32} color={theme.cyan} label="Windows 11 25H2 · Build 26200.7462" labelPos="bottom" durationInFrames={s(136.8) - s(133.32)} />
      </Sequence>

      {/* seg 31-34 (2:17.76) task manager idle performance */}
      <Sequence from={s(137.76)} durationInFrames={s(147.96) - s(137.76)}>
        <StepCard step={4} total={5} title="Idle performance" sub="Task Manager on a gaming rig" x={1260} y={150} accent={theme.red} durationInFrames={s(147.96) - s(137.76)} />
      </Sequence>
      <Sequence from={s(141.36)} durationInFrames={s(147.96) - s(141.36)}>
        <Highlight x={537} y={422} w={192} h={22} color={theme.amber} label="19 background processes" durationInFrames={s(147.96) - s(141.36)} />
      </Sequence>
      <Sequence from={s(147.96)} durationInFrames={s(153.28) - s(147.96)}>
        <StatCard value="3%" label="CPU IDLE" x={1300} y={360} accent={theme.amber} durationInFrames={s(153.28) - s(147.96)} />
      </Sequence>
      <Sequence from={s(153.28)} durationInFrames={s(158.44) - s(153.28)}>
        <Highlight x={280} y={225} w={340} h={90} color={theme.cyan} label="RAM: 1.2 / 4 GB idle" labelPos="top" durationInFrames={s(158.44) - s(153.28)} />
      </Sequence>

      {/* seg 35-37 (2:38.44) file explorer, ISO size */}
      <Sequence from={s(158.44)} durationInFrames={s(164.48) - s(158.44)}>
        <Note x={70} y={150} icon="📁" title="Official Windows 11 icons" body="No visual modifications in File Explorer." accent={theme.cyan} durationInFrames={s(164.48) - s(158.44)} />
      </Sequence>
      <Sequence from={s(164.48)} durationInFrames={s(173.04) - s(164.48)}>
        <StatCard value="6.56 GB" label="ISO SIZE · ENGLISH" x={70} y={760} accent={theme.amber} durationInFrames={s(173.04) - s(164.48)} />
      </Sequence>

      {/* seg 38-39 (2:53.04) disk properties → 13.6GB installed */}
      <Sequence from={s(173.04)} durationInFrames={s(184.399) - s(173.04)}>
        <StepCard step={5} total={5} title="Disk footprint" sub="Right-click C: → Properties" x={1180} y={150} accent={theme.red} durationInFrames={s(184.399) - s(173.04)} />
      </Sequence>
      <Sequence from={s(179.88)} durationInFrames={s(184.399) - s(179.88)}>
        <Highlight x={1548} y={393} w={140} h={40} color={theme.amber} label="13.6 GB installed" durationInFrames={s(184.399) - s(179.88)} />
      </Sequence>

      {/* seg 40-44 (3:04.4) control panel installed apps */}
      <Sequence from={s(184.399)} durationInFrames={s(205.679) - s(184.399)}>
        <Note x={70} y={150} icon="🗂️" title="What's installed by default" body="7-Zip, Explorer Patcher, KernelOS Toolbox, VC++ redistributables 2005–2022, Desktop Runtime, Paint, Remote Desktop, Snipping Tool." accent={theme.cyan} durationInFrames={s(205.679) - s(184.399)} />
      </Sequence>

      {/* seg 45-46 (3:25.679) two updates already integrated */}
      <Sequence from={s(205.679)} durationInFrames={s(212.64) - s(205.679)}>
        <Note x={1180} y={780} icon="🧩" title="Two updates already integrated" body="Baked in by the creator." accent={theme.amber} durationInFrames={s(212.64) - s(205.679)} />
      </Sequence>

      {/* seg 47-48 (3:32.64) windows features */}
      <Sequence from={s(212.64)} durationInFrames={s(224.64) - s(212.64)}>
        <Note x={70} y={780} icon="✔️" title="Optional Windows features intact" body=".NET 3.5 & 4.8, Legacy Components, Multimedia Features & more." accent={theme.cyan} durationInFrames={s(224.64) - s(212.64)} />
      </Sequence>

      {/* seg 49 (3:44.64) settings needs activation */}
      <Sequence from={s(224.64)} durationInFrames={s(229.32) - s(224.64)}>
        <Note x={70} y={150} icon="🔑" title="Windows needs to be activated" accent={theme.warn} durationInFrames={s(229.32) - s(224.64)} />
      </Sequence>
      {/* seg 50-51 (3:49.32) apps section matches control panel */}
      <Sequence from={s(229.32)} durationInFrames={s(234.399) - s(229.32)}>
        <Note x={70} y={150} icon="📦" title="Apps section matches Control Panel" accent={theme.cyan} durationInFrames={s(234.399) - s(229.32)} />
      </Sequence>

      {/* seg 52-53 (3:54.399) defender not included */}
      <Sequence from={s(234.399)} durationInFrames={s(244.72) - s(234.399)}>
        <Note x={70} y={780} icon="🛡️" title="Microsoft Defender not included" body="Install a third-party antivirus if you want protection." accent={theme.warn} durationInFrames={s(244.72) - s(234.399)} />
      </Sequence>

      {/* seg 54-55 (4:04.72) windows update disabled */}
      <Sequence from={s(244.72)} durationInFrames={s(255.76) - s(244.72)}>
        <Note x={70} y={150} icon="🚫" title="Windows Update is disabled" body="KernelOS 1125H2 can't update through Windows Update." accent={theme.warn} durationInFrames={s(255.76) - s(244.72)} />
      </Sequence>

      {/* seg 56 (4:15.76) that's KernelOS 1125H2 */}
      <Sequence from={s(255.76)} durationInFrames={s(259.24) - s(255.76)}>
        <Stamp text="THAT'S KERNELOS" sub="1125H2" durationInFrames={s(259.24) - s(255.76)} />
      </Sequence>
      {/* seg 57-58 (4:19.24) try it yourself, link pinned */}
      <Sequence from={s(259.24)} durationInFrames={s(265.52) - s(259.24)}>
        <Chip text="📌 Download link pinned" x={70} y={150} accent durationInFrames={s(265.52) - s(259.24)} />
      </Sequence>

      {/* ============================== OUTRO ============================== */}
      <Sequence from={s(274)} durationInFrames={TOTAL - s(274)}>
        <EndCard durationInFrames={TOTAL - s(274)} />
      </Sequence>

      {/* ===================== FULL-SCREEN CARDS (on top) ===================== */}
      {/* seg 6 (0:22.96) install begins */}
      <Sequence from={s(22.96)} durationInFrames={s(2.2)}>
        <ChapterCard part="Part 1" title="Installation" durationInFrames={s(2.2)} />
      </Sequence>
      {/* seg 16 (1:05.64) reboot into the desktop */}
      <Sequence from={s(65.64)} durationInFrames={s(2.2)}>
        <ChapterCard part="Part 2" title="First boot" durationInFrames={s(2.2)} />
      </Sequence>
      {/* seg 29 (2:06) winver → under the hood */}
      <Sequence from={s(126)} durationInFrames={s(2)}>
        <ChapterCard part="Part 3" title="Under the hood" durationInFrames={s(2)} />
      </Sequence>
      {/* seg 40 (3:04.4) control panel → what's inside */}
      <Sequence from={s(184.399)} durationInFrames={s(2.2)}>
        <ChapterCard part="Part 4" title="What's inside" durationInFrames={s(2.2)} />
      </Sequence>
      {/* seg 49 (3:44.64) settings → activation & updates */}
      <Sequence from={s(224.64)} durationInFrames={s(2.2)}>
        <ChapterCard part="Part 5" title="Settings & updates" durationInFrames={s(2.2)} />
      </Sequence>
    </AbsoluteFill>
  );
};
