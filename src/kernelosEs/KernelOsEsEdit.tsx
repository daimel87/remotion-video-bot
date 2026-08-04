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
import {backOut, easeOut, FONT_MONO, FONT_TITLE, theme} from './theme';
import {
  ChapterCard,
  EndCard,
  Panel,
  StepCard,
  TitleIntro,
  useLife,
  Watermark,
} from './components';

// "KernelOS 11 25H2" (audio en español) — review de Windows 11 optimizado para gaming. 4:04.58 fuente (30 fps).
const SRC = 'kernelos_11_25h2_es.mp4';
const s = (sec: number) => Math.round(sec * 30);
const TOTAL = 7337;

const FontGate: React.FC = () => {
  const [handle] = React.useState(() => delayRender('brand-fonts-es'));
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
// INTRO — motion graphics a pantalla completa (0 → 0:22.96). El metraje real
// está oculto aquí; solo suena el audio original de narración debajo.
// A partir de "una vez que termine la instalación..." se ve el video real.
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
          Sin importar qué juegues
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
          ESTE VIDEO ES PARA TI
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
// TUTORIAL — overlays ligeros sobre el metraje real, desde "una vez que
// termine la instalación..." (0:22.96) en adelante. Timings anclados a la
// TRANSCRIPCIÓN BUZZ en español para que cada overlay salga cuando se dice.
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
            <div style={{fontFamily: FONT_TITLE, fontWeight: 800, fontSize: 25, color: theme.text}}>{title}</div>
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
// Composición principal
// ===========================================================================
export const KernelOsEsEdit: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: theme.bg}}>
      <FontGate />
      <OffthreadVideo src={staticFile(SRC)} />

      {/* Fondo opaco bajo toda la intro para que los fundidos entre escenas
          nunca dejen ver el metraje real por debajo. */}
      <Sequence from={0} durationInFrames={s(19.02)}>
        <AbsoluteFill style={{background: theme.gradientDark}} />
      </Sequence>

      {/* =============================== INTRO =============================== */}
      <Sequence from={0} durationInFrames={s(6.28)}>
        <TitleIntro durationInFrames={s(6.28)} />
      </Sequence>
      <Sequence from={s(6.28)} durationInFrames={s(9.84) - s(6.28)}>
        <GameChipsScene durationInFrames={s(9.84) - s(6.28)} />
      </Sequence>
      <Sequence from={s(9.84)} durationInFrames={s(14.6) - s(9.84)}>
        <Hook kicker="Artículo + enlace de descarga" title="EN EL PRIMER COMENTARIO FIJADO" icon="🔗" durationInFrames={s(14.6) - s(9.84)} />
      </Sequence>
      <Sequence from={s(14.6)} durationInFrames={s(19.02) - s(14.6)}>
        <Bumper icon="🛠️" text="SCRIPT AUTOMÁTICO" durationInFrames={s(19.02) - s(14.6)} />
      </Sequence>
      <Sequence from={s(19.02)} durationInFrames={s(22.96) - s(19.02)}>
        <WipeOutScene text="EMPIEZA LA INSTALACIÓN" durationInFrames={s(22.96) - s(19.02)} />
      </Sequence>

      {/* ============================ TUTORIAL ============================ */}
      <Sequence from={s(22.96)} durationInFrames={TOTAL - s(22.96)}>
        <Watermark />
      </Sequence>

      {/* cue6-7 (0:22.96) script post-instalación / chequeo de integridad */}
      <Sequence from={s(22.96)} durationInFrames={s(27.4) - s(22.96)}>
        <StepCard step={1} total={5} title="Script de post-instalación" sub="Primero, el chequeo de integridad (opcional)" x={70} y={780} accent={theme.red} durationInFrames={s(27.4) - s(22.96)} />
      </Sequence>
      {/* cue7-9 (0:27.52) explorer patcher, plan de energía, 7-zip, directx */}
      <Sequence from={s(27.52)} durationInFrames={s(40.36) - s(27.52)}>
        <Note x={70} y={150} icon="🛠️" title="Instala lo esencial" body="Explorer Patcher · Plan de energía KernelOS · 7-Zip · DirectX" accent={theme.cyan} durationInFrames={s(40.36) - s(27.52)} />
      </Sequence>
      {/* cue10 (0:40.36) vc++ redistributables */}
      <Sequence from={s(40.36)} durationInFrames={s(44.32) - s(40.36)}>
        <Note x={70} y={780} icon="🎮" title="Visual C++ Redistributables" body="Esenciales para tus juegos." accent={theme.cyan} durationInFrames={s(44.32) - s(40.36)} />
      </Sequence>
      {/* cue11 (0:44.32) reinicio */}
      <Sequence from={s(44.32)} durationInFrames={s(48.84) - s(44.32)}>
        <Note x={70} y={150} icon="🔄" title="Reinicia para aplicar los cambios" accent={theme.amber} durationInFrames={s(48.84) - s(44.32)} />
      </Sequence>
      {/* cue12 (0:48.84) dentro de KernelOS */}
      <Sequence from={s(48.84)} durationInFrames={s(53.36) - s(48.84)}>
        <Note x={70} y={150} icon="✅" title="Ya estamos dentro de KernelOS 1125H2" accent={theme.green} durationInFrames={s(53.36) - s(48.84)} />
      </Sequence>

      {/* cue13 (0:53.44) fondo de escritorio con el logo */}
      <Sequence from={s(53.36)} durationInFrames={s(57.24) - s(53.36)}>
        <StepCard step={2} total={5} title="Fondo con el logo de KernelOS" sub="Centrado en el escritorio" x={70} y={150} accent={theme.red} durationInFrames={s(57.24) - s(53.36)} />
      </Sequence>
      {/* cue14-15 (0:57.24) accesos directos + redes */}
      <Sequence from={s(57.24)} durationInFrames={s(66.56) - s(57.24)}>
        <Note x={70} y={780} icon="🖥️" title="Accesos directos" body="Papelera, web oficial, YouTube, TikTok, Discord, X — y el toolbox de post-instalación." accent={theme.cyan} durationInFrames={s(66.56) - s(57.24)} />
      </Sequence>

      {/* cue16 (1:06.56) toolbox de post-instalación */}
      <Sequence from={s(66.56)} durationInFrames={s(71.0) - s(66.56)}>
        <StepCard step={3} total={5} title="El toolbox de post-instalación" x={1180} y={150} accent={theme.red} durationInFrames={s(71.0) - s(66.56)} />
      </Sequence>
      {/* cue17-18 (1:11.0) navegadores */}
      <Sequence from={s(71.0)} durationInFrames={s(77.52) - s(71.0)}>
        <Note x={1180} y={720} icon="🌐" title="Instala cualquier navegador popular" body="KernelOS no trae ninguno por defecto." accent={theme.cyan} durationInFrames={s(77.52) - s(71.0)} />
      </Sequence>
      {/* cue19-20 (1:17.52) tools y soluciones */}
      <Sequence from={s(77.52)} durationInFrames={s(86.76) - s(77.52)}>
        <Note x={70} y={150} icon="🛠️" title="Sección de herramientas útiles" body="Vale la pena revisarla." accent={theme.cyan} durationInFrames={s(86.76) - s(77.52)} />
      </Sequence>
      {/* cue21-22 (1:26.76) soluciones + tweaking */}
      <Sequence from={s(86.76)} durationInFrames={s(93.84) - s(86.76)}>
        <Note x={70} y={780} icon="🩹" title="Soluciones y ajustes" body="Arreglos comunes y tweaking del registro." accent={theme.cyan} durationInFrames={s(93.84) - s(86.76)} />
      </Sequence>

      {/* cue23 (1:33.84) menú inicio */}
      <Sequence from={s(93.84)} durationInFrames={s(97.36) - s(93.84)}>
        <Note x={70} y={150} icon="🪟" title="Menú Inicio oficial de Windows 11" body="Alineado a la izquierda, sin tocar." accent={theme.green} durationInFrames={s(97.36) - s(93.84)} />
      </Sequence>

      {/* cue24-25 (1:37.36) winver → build 26200.7462 */}
      <Sequence from={s(97.36)} durationInFrames={s(111.08) - s(97.36)}>
        <Note x={70} y={150} icon="🔎" title="winver → Windows 1125H2" body="Build 26200.7462 · Basado en Windows 11 IoT Enterprise LTSC." accent={theme.amber} durationInFrames={s(111.08) - s(97.36)} />
      </Sequence>
      {/* cue26 (1:51.08) sin tienda ni apps */}
      <Sequence from={s(111.08)} durationInFrames={s(114.56) - s(111.08)}>
        <Note x={70} y={780} icon="🚫" title="Sin tienda de Microsoft ni apps" accent={theme.warn} durationInFrames={s(114.56) - s(111.08)} />
      </Sequence>

      {/* cue27-28 (1:54.56) administrador de tareas, 19 procesos */}
      <Sequence from={s(114.56)} durationInFrames={s(123.96) - s(114.56)}>
        <StepCard step={4} total={5} title="Rendimiento en reposo" sub="Administrador de tareas en un equipo gamer" x={1260} y={150} accent={theme.red} durationInFrames={s(123.96) - s(114.56)} />
      </Sequence>
      {/* cue29 (2:03.96) CPU 3% */}
      <Sequence from={s(123.96)} durationInFrames={s(129.52) - s(123.96)}>
        <StatCard value="3%" label="CPU EN REPOSO" x={1300} y={360} accent={theme.amber} durationInFrames={s(129.52) - s(123.96)} />
      </Sequence>
      {/* cue30 (2:09.52) RAM 1.2/4GB */}
      <Sequence from={s(129.52)} durationInFrames={s(134.24) - s(129.52)}>
        <StatCard value="1.2 / 4 GB" label="RAM EN REPOSO" x={280} y={360} accent={theme.cyan} durationInFrames={s(134.24) - s(129.52)} />
      </Sequence>

      {/* cue31 (2:14.24) explorador, iconografía oficial */}
      <Sequence from={s(134.24)} durationInFrames={s(139.679) - s(134.24)}>
        <Note x={70} y={150} icon="📁" title="Iconografía oficial de Windows 11" body="Sin cambios visuales en el Explorador." accent={theme.cyan} durationInFrames={s(139.679) - s(134.24)} />
      </Sequence>
      {/* cue32-33 (2:19.679) ISO 6.56GB inglés */}
      <Sequence from={s(139.679)} durationInFrames={s(147.56) - s(139.679)}>
        <StatCard value="6.56 GB" label="ISO · IDIOMA INGLÉS" x={70} y={760} accent={theme.amber} durationInFrames={s(147.56) - s(139.679)} />
      </Sequence>

      {/* cue34 (2:27.56) propiedades disco C: → 13.6GB */}
      <Sequence from={s(147.56)} durationInFrames={s(158.32) - s(147.56)}>
        <StepCard step={5} total={5} title="Espacio en disco" sub="Clic derecho en C: → Propiedades" x={1180} y={150} accent={theme.red} durationInFrames={s(158.32) - s(147.56)} />
      </Sequence>
      <Sequence from={s(152)} durationInFrames={s(158.32) - s(152)}>
        <StatCard value="13.6 GB" label="OCUPADO EN DISCO" x={1400} y={393} accent={theme.amber} durationInFrames={s(158.32) - s(152)} />
      </Sequence>

      {/* cue35-37 (2:35.04) panel de control, apps instaladas */}
      <Sequence from={s(158.32)} durationInFrames={s(167.04) - s(158.32)}>
        <Note x={70} y={150} icon="🗂️" title="Apps instaladas por defecto" body="7-Zip, Explorer Patcher, KernelOS Toolbox, VC++ Redistributables 2005–2022." accent={theme.cyan} durationInFrames={s(167.04) - s(158.32)} />
      </Sequence>
      {/* cue38-40 (2:47.28) desktop runtime, paint, rdp + 2 updates */}
      <Sequence from={s(167.28)} durationInFrames={s(181.92) - s(167.28)}>
        <Note x={1180} y={780} icon="🧩" title="Dos actualizaciones ya integradas" body="El propio creador las incluyó de fábrica." accent={theme.amber} durationInFrames={s(181.92) - s(167.28)} />
      </Sequence>
      {/* cue41-42 (3:01.92) .net, componentes heredados */}
      <Sequence from={s(181.92)} durationInFrames={s(190.44) - s(181.92)}>
        <Note x={70} y={780} icon="✔️" title="Funciones opcionales de Windows intactas" body=".NET 3.5 y 4.8, componentes heredados, multimedia y más." accent={theme.cyan} durationInFrames={s(190.44) - s(181.92)} />
      </Sequence>

      {/* cue43-44 (3:10.44) activar Windows */}
      <Sequence from={s(190.44)} durationInFrames={s(199.96) - s(190.44)}>
        <Note x={70} y={150} icon="🔑" title="Hay que activar Windows" body="La app de Configuración lo pide de entrada." accent={theme.warn} durationInFrames={s(199.96) - s(190.44)} />
      </Sequence>
      {/* cue45-46 (3:19.96) sin defender */}
      <Sequence from={s(199.96)} durationInFrames={s(207.24) - s(199.96)}>
        <Note x={70} y={780} icon="🛡️" title="Sin Microsoft Defender" body="Instala un antivirus de terceros si lo necesitas." accent={theme.warn} durationInFrames={s(207.24) - s(199.96)} />
      </Sequence>
      {/* cue47-48 (3:27.24) windows update deshabilitado */}
      <Sequence from={s(207.24)} durationInFrames={s(216.32) - s(207.24)}>
        <Note x={70} y={150} icon="🚫" title="Windows Update deshabilitado" body="KernelOS 1125H2 no se actualiza por esta vía." accent={theme.warn} durationInFrames={s(216.32) - s(207.24)} />
      </Sequence>
      {/* cue49 (3:36.32) eso es kernelos */}
      <Sequence from={s(216.32)} durationInFrames={s(219.28) - s(216.32)}>
        <Stamp text="ESO ES KERNELOS" sub="1125H2" durationInFrames={s(219.28) - s(216.32)} />
      </Sequence>

      {/* ============================== OUTRO ============================== */}
      <Sequence from={s(230.72)} durationInFrames={TOTAL - s(230.72)}>
        <EndCard durationInFrames={TOTAL - s(230.72)} />
      </Sequence>

      {/* ===================== TARJETAS A PANTALLA COMPLETA ===================== */}
      <Sequence from={s(22.96)} durationInFrames={s(2.2)}>
        <ChapterCard part="Parte 1" title="Instalación" durationInFrames={s(2.2)} />
      </Sequence>
      <Sequence from={s(53.36)} durationInFrames={s(2.2)}>
        <ChapterCard part="Parte 2" title="Primer arranque" durationInFrames={s(2.2)} />
      </Sequence>
      <Sequence from={s(97.36)} durationInFrames={s(2)}>
        <ChapterCard part="Parte 3" title="Por dentro" durationInFrames={s(2)} />
      </Sequence>
      <Sequence from={s(147.56)} durationInFrames={s(2.2)}>
        <ChapterCard part="Parte 4" title="Qué incluye" durationInFrames={s(2.2)} />
      </Sequence>
      <Sequence from={s(190.44)} durationInFrames={s(2.2)}>
        <ChapterCard part="Parte 5" title="Configuración" durationInFrames={s(2.2)} />
      </Sequence>
    </AbsoluteFill>
  );
};
