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
import {backOut, easeIn, easeOut, FONT_MONO, FONT_TITLE, panelShadow, textShadow, theme} from './theme';
import {Arrow, Chip, ClickRipple, Highlight, Panel, StepCard, SubNudge, Watermark, useLife} from './components';

// "El Alcor Truco" — repair-channel edit. 3:35.23 source (30 fps).
const SRC = 'alcor_truco.mp4';
const s = (sec: number) => Math.round(sec * 30);
const TOTAL = s(215.23);

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
// INTRO — full-screen motion graphics (0 → 1:29.5). The raw footage is fully
// hidden here; only the original narration audio plays underneath.
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
            fontSize: 80,
            color: theme.text,
            lineHeight: 1.08,
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
              fontSize: 32,
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

const Nudge: React.FC<{text: string; durationInFrames: number}> = ({text, durationInFrames}) => {
  const {vis, enter} = useLife(durationInFrames, 10, 10);
  const sc = interpolate(enter, [0, 1], [0.85, 1], {easing: backOut});
  return (
    <SceneShell durationInFrames={durationInFrames}>
      <div style={{opacity: vis, transform: `scale(${sc})`, background: theme.panel, border: `1px solid ${theme.panelBorder}`, borderRadius: 999, padding: '20px 44px', boxShadow: panelShadow}}>
        <span style={{fontFamily: FONT_TITLE, fontWeight: 800, fontSize: 36, color: theme.text}}>{text}</span>
      </div>
    </SceneShell>
  );
};

const Bumper: React.FC<{icon: string; text: string; durationInFrames: number}> = ({icon, text, durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sp = spring({frame, fps, config: {damping: 11, stiffness: 200}});
  const spin = interpolate(frame, [0, durationInFrames], [0, 300]);
  const flash = interpolate(frame, [0, 4, 12], [0, 0.85, 0], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{background: theme.bg, justifyContent: 'center', alignItems: 'center'}}>
      <AbsoluteFill style={{background: theme.red, opacity: flash}} />
      <div style={{textAlign: 'center', transform: `scale(${sp})`}}>
        <div style={{fontSize: 120, transform: `rotate(${spin}deg)`}}>{icon}</div>
        <div style={{fontFamily: FONT_TITLE, fontWeight: 900, fontSize: 56, color: theme.text, letterSpacing: 4, marginTop: 14}}>{text}</div>
      </div>
    </AbsoluteFill>
  );
};

const TrickTitleReveal: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {vis} = useLife(durationInFrames, 16, 14);
  const burst = interpolate(frame, [0, 20], [0, 1], {extrapolateRight: 'clamp', easing: easeOut});
  const s1 = spring({frame, fps, config: {damping: 200}});
  const s2 = spring({frame: frame - 70, fps, config: {damping: 200}});
  const rays = new Array(10).fill(0);
  return (
    <AbsoluteFill style={{opacity: vis, background: theme.gradientDark, justifyContent: 'center', alignItems: 'center'}}>
      <AbsoluteFill style={{overflow: 'hidden'}}>
        {rays.map((_, i) => {
          const angle = (360 / rays.length) * i;
          const len = interpolate(burst, [0, 1], [0, 900]);
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                width: len,
                height: 4,
                background: theme.gradient,
                opacity: 0.5 * burst,
                transform: `translate(-2px,-2px) rotate(${angle}deg)`,
                transformOrigin: '0 50%',
              }}
            />
          );
        })}
      </AbsoluteFill>
      <div style={{textAlign: 'center'}}>
        <div style={{fontFamily: FONT_MONO, fontWeight: 700, fontSize: 26, letterSpacing: 8, color: theme.cyan, opacity: s1}}>
          ASÍ SE LLAMA ESTA ESTRATEGIA
        </div>
        <div
          style={{
            fontFamily: FONT_TITLE,
            fontWeight: 900,
            fontSize: 116,
            color: theme.text,
            lineHeight: 0.98,
            marginTop: 10,
            transform: `scale(${interpolate(s1, [0, 1], [0.8, 1], {easing: backOut})})`,
            textShadow: '0 10px 50px rgba(0,0,0,0.7)',
          }}
        >
          EL <span style={{color: theme.red}}>ALCOR</span> TRUCO
        </div>
        <div
          style={{
            fontFamily: FONT_TITLE,
            fontWeight: 600,
            fontSize: 26,
            color: theme.textDim,
            marginTop: 26,
            opacity: s2,
            transform: `translateY(${interpolate(s2, [0, 1], [16, 0])}px)`,
          }}
        >
          (nombre temporal… ¡ya buscaré uno mejor! 😅)
        </div>
      </div>
    </AbsoluteFill>
  );
};

const CounterScene: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const n = interpolate(frame, [14, 150], [1, 1240], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easeOut});
  const display = n >= 999 ? `${Math.round(n)}+` : `${Math.round(n)}`;
  return (
    <SceneShell durationInFrames={durationInFrames}>
      <div style={{textAlign: 'center'}}>
        <div style={{fontFamily: FONT_MONO, fontWeight: 700, fontSize: 24, letterSpacing: 6, color: theme.cyan, textTransform: 'uppercase'}}>
          1 estrategia · miles de memorias reparadas
        </div>
        <div style={{fontFamily: FONT_TITLE, fontWeight: 900, fontSize: 170, color: theme.amber, lineHeight: 1, marginTop: 14, textShadow: '0 10px 50px rgba(0,0,0,0.7)'}}>
          {display}
        </div>
        <div style={{fontFamily: FONT_TITLE, fontWeight: 800, fontSize: 34, color: theme.text, marginTop: 10}}>🔌 memorias USB reparadas</div>
      </div>
    </SceneShell>
  );
};

const ExplainScene: React.FC<{
  icon: string;
  title: string;
  sub: string;
  secondary?: string;
  secondaryDelay?: number;
  durationInFrames: number;
}> = ({icon, title, sub, secondary, secondaryDelay = 90, durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s1 = spring({frame, fps, config: {damping: 200}});
  const s2 = spring({frame: frame - secondaryDelay, fps, config: {damping: 200}});
  return (
    <SceneShell durationInFrames={durationInFrames}>
      <div style={{textAlign: 'center', maxWidth: 1520}}>
        <div style={{fontSize: 80, opacity: s1}}>{icon}</div>
        <div
          style={{
            fontFamily: FONT_TITLE,
            fontWeight: 900,
            fontSize: 68,
            color: theme.text,
            marginTop: 14,
            lineHeight: 1.1,
            transform: `scale(${interpolate(s1, [0, 1], [0.92, 1])})`,
          }}
        >
          {title}
        </div>
        <div style={{fontFamily: FONT_TITLE, fontWeight: 600, fontSize: 32, color: theme.textDim, marginTop: 18, opacity: s1}}>{sub}</div>
        {secondary ? (
          <div style={{marginTop: 34, opacity: s2, transform: `translateY(${interpolate(s2, [0, 1], [16, 0])}px)`}}>
            <div style={{display: 'inline-block', background: theme.panel, border: `1px solid ${theme.panelBorder}`, borderLeft: `4px solid ${theme.amber}`, borderRadius: 14, padding: '14px 26px'}}>
              <span style={{fontFamily: FONT_TITLE, fontWeight: 700, fontSize: 26, color: theme.text}}>{secondary}</span>
            </div>
          </div>
        ) : null}
      </div>
    </SceneShell>
  );
};

const WorldStatScene: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const s1 = spring({frame, fps: 30, config: {damping: 200}});
  const bar1 = interpolate(frame, [20, 60], [0, 92], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easeOut});
  const bar2 = interpolate(frame, [30, 70], [0, 84], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easeOut});
  return (
    <SceneShell durationInFrames={durationInFrames}>
      <div style={{textAlign: 'center', width: 1100}}>
        <div style={{fontFamily: FONT_TITLE, fontWeight: 900, fontSize: 54, color: theme.text, opacity: s1}}>
          ALCOR MICRO <span style={{color: theme.textDim, fontWeight: 700}}>+</span> FISON
        </div>
        <div style={{fontFamily: FONT_TITLE, fontWeight: 800, fontSize: 30, color: theme.amber, marginTop: 12}}>
          🌍 LOS CONTROLADORES USB MÁS USADOS DEL MUNDO
        </div>
        <div style={{marginTop: 44, display: 'flex', flexDirection: 'column', gap: 22}}>
          {[{label: 'Alcor Micro', v: bar1}, {label: 'Fison', v: bar2}].map((b) => (
            <div key={b.label} style={{textAlign: 'left'}}>
              <div style={{fontFamily: FONT_TITLE, fontWeight: 700, fontSize: 22, color: theme.text, marginBottom: 8}}>{b.label}</div>
              <div style={{height: 20, borderRadius: 10, background: 'rgba(255,255,255,0.1)', overflow: 'hidden'}}>
                <div style={{width: `${b.v}%`, height: '100%', background: theme.gradient, borderRadius: 10}} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </SceneShell>
  );
};

const ReqIntroScene: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const s1 = spring({frame, fps: 30, config: {damping: 200}});
  return (
    <SceneShell durationInFrames={durationInFrames}>
      <div style={{textAlign: 'center'}}>
        <div style={{fontSize: 70, opacity: s1}}>⚠️</div>
        <div style={{fontFamily: FONT_MONO, fontWeight: 700, fontSize: 26, letterSpacing: 6, color: theme.cyan, marginTop: 10}}>ANTES DE EMPEZAR</div>
        <div style={{fontFamily: FONT_TITLE, fontWeight: 900, fontSize: 76, color: theme.text, marginTop: 8, transform: `scale(${interpolate(s1, [0, 1], [0.9, 1])})`}}>
          2 REQUISITOS IMPORTANTES
        </div>
      </div>
    </SceneShell>
  );
};

const RequirementScene: React.FC<{
  num: number;
  title: string;
  sub: string;
  secondary?: string;
  secondaryDelay?: number;
  icon: string;
  durationInFrames: number;
}> = ({num, title, sub, secondary, secondaryDelay = 110, icon, durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s1 = spring({frame, fps, config: {damping: 200}});
  const s2 = spring({frame: frame - secondaryDelay, fps, config: {damping: 200}});
  return (
    <SceneShell durationInFrames={durationInFrames} shardSide={num === 1 ? 'right' : 'left'}>
      <div style={{textAlign: 'center', maxWidth: 1500}}>
        <div style={{display: 'inline-flex', alignItems: 'center', gap: 16, opacity: s1}}>
          <div
            style={{
              width: 76,
              height: 76,
              borderRadius: '50%',
              background: theme.gradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: FONT_TITLE,
              fontWeight: 900,
              fontSize: 38,
              color: '#fff',
            }}
          >
            {num}
          </div>
          <div style={{fontFamily: FONT_MONO, fontWeight: 700, fontSize: 24, letterSpacing: 5, color: theme.cyan, textTransform: 'uppercase'}}>
            Requisito {num}
          </div>
        </div>
        <div style={{fontSize: 64, marginTop: 20, opacity: s1}}>{icon}</div>
        <div
          style={{
            fontFamily: FONT_TITLE,
            fontWeight: 900,
            fontSize: 62,
            color: theme.text,
            marginTop: 10,
            lineHeight: 1.1,
            transform: `scale(${interpolate(s1, [0, 1], [0.92, 1])})`,
          }}
        >
          {title}
        </div>
        <div style={{fontFamily: FONT_TITLE, fontWeight: 600, fontSize: 28, color: theme.textDim, marginTop: 16}}>{sub}</div>
        {secondary ? (
          <div style={{marginTop: 30, opacity: s2, transform: `translateY(${interpolate(s2, [0, 1], [14, 0])}px)`}}>
            <span style={{fontFamily: FONT_TITLE, fontWeight: 600, fontSize: 22, color: theme.textDim, fontStyle: 'italic'}}>{secondary}</span>
          </div>
        ) : null}
      </div>
    </SceneShell>
  );
};

const QuestionScene: React.FC<{text: string; durationInFrames: number}> = ({text, durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sp = spring({frame, fps, config: {damping: 10, stiffness: 220}});
  const {vis} = useLife(durationInFrames, 6, 8);
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', opacity: vis}}>
      <AbsoluteFill style={{background: 'rgba(4,3,2,0.35)'}} />
      <div style={{transform: `scale(${sp})`, fontFamily: FONT_TITLE, fontWeight: 900, fontSize: 60, color: theme.text, textAlign: 'center', textShadow}}>
        {text}
      </div>
    </AbsoluteFill>
  );
};

const WipeOutScene: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {vis} = useLife(durationInFrames, 14, 22);
  const s1 = spring({frame, fps, config: {damping: 200}});
  return (
    <AbsoluteFill style={{background: theme.gradientDark, opacity: vis, justifyContent: 'center', alignItems: 'center'}}>
      <div style={{textAlign: 'center', transform: `translateY(${interpolate(s1, [0, 1], [26, 0])}px)`}}>
        <div style={{fontFamily: FONT_TITLE, fontWeight: 900, fontSize: 68, color: theme.text}}>
          VAMOS A VERLO <span style={{color: theme.red}}>EN VIVO</span> 👇
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ===========================================================================
// TUTORIAL PART — light overlays over the real footage (from 1:29.5 onward).
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
        maxWidth: 620,
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

const KeyValueBig: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {vis} = useLife(durationInFrames, 12, 10);
  const pop = interpolate(spring({frame, fps, config: {damping: 200}}), [0, 1], [0.8, 1], {easing: backOut});
  return (
    <div style={{position: 'absolute', left: '50%', bottom: 120, transform: `translateX(-50%) scale(${pop})`, opacity: vis}}>
      <div style={{display: 'flex', gap: 18, alignItems: 'center', background: theme.gradient, padding: '20px 36px', borderRadius: 18, boxShadow: panelShadow}}>
        <span style={{fontSize: 34}}>🔑</span>
        <span style={{fontFamily: FONT_MONO, fontWeight: 800, fontSize: 36, color: '#fff'}}>VID: 8564 · PID: 1000</span>
      </div>
    </div>
  );
};

const CTABar: React.FC<{icon: string; title: string; sub?: string; accent?: string; durationInFrames: number}> = ({
  icon,
  title,
  sub,
  accent = theme.amber,
  durationInFrames,
}) => {
  const {vis, enter} = useLife(durationInFrames, 14, 12);
  const sc = interpolate(enter, [0, 1], [0.92, 1], {easing: backOut});
  return (
    <div style={{position: 'absolute', left: '50%', bottom: 110, transform: `translateX(-50%) scale(${sc})`, opacity: vis, maxWidth: 1300}}>
      <Panel accent={accent} style={{display: 'flex', alignItems: 'center', gap: 20, padding: '18px 30px'}}>
        <span style={{fontSize: 40}}>{icon}</span>
        <div>
          <div style={{fontFamily: FONT_TITLE, fontWeight: 800, fontSize: 28, color: theme.text}}>{title}</div>
          {sub ? <div style={{fontFamily: FONT_TITLE, fontWeight: 500, fontSize: 19, color: theme.textDim, marginTop: 4}}>{sub}</div> : null}
        </div>
      </Panel>
    </div>
  );
};

const Stamp: React.FC<{text: string; sub?: string; durationInFrames: number}> = ({text, sub, durationInFrames}) => {
  const frame = useCurrentFrame();
  const {vis} = useLife(durationInFrames, 8, 10);
  const sc = interpolate(frame, [0, 10], [1.4, 1], {extrapolateRight: 'clamp', easing: easeOut});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', opacity: vis}}>
      <AbsoluteFill style={{background: 'rgba(4,3,2,0.42)'}} />
      <div style={{textAlign: 'center', transform: `scale(${sc})`}}>
        <div style={{fontFamily: FONT_TITLE, fontWeight: 900, fontSize: 96, color: theme.text, textShadow: '0 8px 40px rgba(0,0,0,0.7)'}}>{text}</div>
        {sub ? <div style={{fontFamily: FONT_TITLE, fontWeight: 800, fontSize: 28, color: theme.red, letterSpacing: 3, marginTop: 8}}>{sub}</div> : null}
      </div>
    </AbsoluteFill>
  );
};

const EndCardFinal: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {vis} = useLife(durationInFrames, 18, 12);
  const sp = spring({frame, fps, config: {damping: 200}});
  const steps = ['Iguala VID y PID en la herramienta', 'Funciona con Alcor Micro + Fison', 'Repara memorias "no reconocidas"', 'Deja 🐤 para el Alcor Truco PLUS'];
  return (
    <AbsoluteFill style={{opacity: vis, background: theme.gradientDark, justifyContent: 'center', alignItems: 'center'}}>
      <AbsoluteFill style={{overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: -200, top: -200, width: 1000, height: 1000, background: theme.gradient, opacity: 0.85, clipPath: 'polygon(0 0, 60% 0, 30% 100%, 0 70%)'}} />
      </AbsoluteFill>
      <div style={{textAlign: 'center', transform: `translateY(${interpolate(sp, [0, 1], [40, 0])}px)`}}>
        <div style={{fontSize: 74, marginBottom: 6}}>🔧</div>
        <div style={{fontFamily: FONT_TITLE, fontWeight: 900, fontSize: 86, color: theme.text}}>
          El <span style={{color: theme.red}}>Alcor</span> Truco
        </div>
        <div style={{display: 'flex', gap: 16, justifyContent: 'center', marginTop: 34, flexWrap: 'wrap', maxWidth: 1400}}>
          {steps.map((t, i) => {
            const ap = interpolate(frame, [20 + i * 8, 34 + i * 8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easeOut});
            return (
              <div
                key={t}
                style={{
                  opacity: ap,
                  transform: `translateY(${interpolate(ap, [0, 1], [18, 0])}px)`,
                  fontFamily: FONT_TITLE,
                  fontWeight: 700,
                  fontSize: 20,
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
        <div style={{marginTop: 44, display: 'inline-flex', alignItems: 'center', gap: 16, background: theme.gradient, padding: '16px 34px', borderRadius: 999, boxShadow: panelShadow}}>
          <span style={{fontSize: 34}}>🔔</span>
          <span style={{fontFamily: FONT_TITLE, fontWeight: 800, fontSize: 28, color: '#fff'}}>Suscríbete para más trucos de reparación</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ===========================================================================
// Main composition
// ===========================================================================
export const AlcorTrucoEdit: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: theme.bg}}>
      <FontGate />
      <OffthreadVideo src={staticFile(SRC)} />

      {/*
        Solid backdrop under every intro scene except the final WipeOut.
        Individual scenes fade in/out (opacity) for their own transitions;
        without an opaque floor here, those fades would let the raw footage
        flash through underneath for a frame or two, which read as an editing
        mistake. This keeps every intro-to-intro cut seamless. The WipeOut
        scene (from s(86.2)) is intentionally left uncovered — its own fade
        is the designed reveal of the real footage at s(89.5).
      */}
      <Sequence from={0} durationInFrames={s(86.2)}>
        <AbsoluteFill style={{background: theme.gradientDark}} />
      </Sequence>

      {/* =============================== INTRO =============================== */}
      <Sequence from={0} durationInFrames={s(7.8)}>
        <Hook kicker="Atención" title="1 SOLA ESTRATEGIA" sub="para reparar CIENTOS, MILES de memorias USB" icon="🧠" durationInFrames={s(7.8)} />
      </Sequence>
      <Sequence from={s(7.8)} durationInFrames={s(9.4) - s(7.8)}>
        <Nudge text="👀 Debes ver TODO el video" durationInFrames={s(9.4) - s(7.8)} />
      </Sequence>
      <Sequence from={s(9.4)} durationInFrames={s(11.4) - s(9.4)}>
        <Bumper icon="⚡" text="PREPÁRATE" durationInFrames={s(11.4) - s(9.4)} />
      </Sequence>
      <Sequence from={s(11.4)} durationInFrames={s(17.8) - s(11.4)}>
        <Hook kicker="La verdad" title="LA MEJOR ESTRATEGIA DE REPARACIÓN QUE HAS VISTO" icon="🔥" durationInFrames={s(17.8) - s(11.4)} />
      </Sequence>
      <Sequence from={s(17.8)} durationInFrames={s(25.5) - s(17.8)}>
        <CounterScene durationInFrames={s(25.5) - s(17.8)} />
      </Sequence>
      <Sequence from={s(25.5)} durationInFrames={s(27.7) - s(25.5)}>
        <Nudge text="👀 Mira el video completo" durationInFrames={s(27.7) - s(25.5)} />
      </Sequence>
      <Sequence from={s(27.7)} durationInFrames={s(34.5) - s(27.7)}>
        <TrickTitleReveal durationInFrames={s(34.5) - s(27.7)} />
      </Sequence>
      <Sequence from={s(34.5)} durationInFrames={s(42.4) - s(34.5)}>
        <Hook kicker="El resultado" title="TUS REPARACIONES SE MULTIPLICAN 📈" sub="sin que te des cuenta" icon="💥" durationInFrames={s(42.4) - s(34.5)} />
      </Sequence>
      <Sequence from={s(42.4)} durationInFrames={s(45.2) - s(42.4)}>
        <Nudge text="🔋 Repararás MUCHAS MÁS memorias USB" durationInFrames={s(45.2) - s(42.4)} />
      </Sequence>
      <Sequence from={s(45.2)} durationInFrames={s(53.8) - s(45.2)}>
        <ExplainScene
          icon="🔌"
          title={'SE LLAMA "ALCOR TRUCO"'}
          sub="porque se enfoca en el controlador ALCOR MICRO"
          secondary="Repararás cientos y miles de memorias"
          secondaryDelay={110}
          durationInFrames={s(53.8) - s(45.2)}
        />
      </Sequence>
      <Sequence from={s(53.8)} durationInFrames={s(61.7) - s(53.8)}>
        <WorldStatScene durationInFrames={s(61.7) - s(53.8)} />
      </Sequence>
      <Sequence from={s(61.7)} durationInFrames={s(66.2) - s(61.7)}>
        <ReqIntroScene durationInFrames={s(66.2) - s(61.7)} />
      </Sequence>
      <Sequence from={s(66.2)} durationInFrames={s(77.5) - s(66.2)}>
        <RequirementScene
          num={1}
          icon="🔌"
          title="Chip controlador ALCOR MICRO"
          sub="Este truco es SOLO para memorias con este chip"
          secondary="Más trucos de otros controladores, próximamente"
          secondaryDelay={140}
          durationInFrames={s(77.5) - s(66.2)}
        />
      </Sequence>
      <Sequence from={s(77.5)} durationInFrames={s(85.2) - s(77.5)}>
        <RequirementScene
          num={2}
          icon="🔍"
          title="NO reconocida por Alcor MP"
          sub="Se aplica cuando la herramienta no detecta la memoria"
          durationInFrames={s(85.2) - s(77.5)}
        />
      </Sequence>
      <Sequence from={s(85.2)} durationInFrames={s(86.2) - s(85.2)}>
        <QuestionScene text="¿Y cómo es esto? 🤔" durationInFrames={s(86.2) - s(85.2)} />
      </Sequence>
      <Sequence from={s(86.2)} durationInFrames={s(89.5) - s(86.2)}>
        <WipeOutScene durationInFrames={s(89.5) - s(86.2)} />
      </Sequence>

      {/* ============================ TUTORIAL ============================ */}
      <Sequence from={s(89.5)} durationInFrames={TOTAL - s(89.5)}>
        <Watermark />
      </Sequence>

      <Sequence from={s(89.5)} durationInFrames={s(97.2) - s(89.5)}>
        <StepCard step={1} total={3} title="Abrimos ChipGenius y AlcorMP" sub="Detectamos el chip y probamos la MP" x={70} y={150} accent={theme.red} durationInFrames={s(97.2) - s(89.5)} />
      </Sequence>
      <Sequence from={s(93.7)} durationInFrames={s(97.0) - s(93.7)}>
        <Highlight x={615} y={678} w={700} h={40} color={theme.amber} label="Alcor Micro · AU6989SN" labelPos="bottom" durationInFrames={s(97.0) - s(93.7)} />
      </Sequence>

      <Sequence from={s(97.2)} durationInFrames={s(101.5) - s(97.2)}>
        <Note x={1100} y={150} icon="❌" title="¡Sorpresa! No aparece en AlcorMP" body="La memoria USB no es detectada" accent={theme.warn} durationInFrames={s(101.5) - s(97.2)} />
      </Sequence>
      <Sequence from={s(101.5)} durationInFrames={s(104.4) - s(101.5)}>
        <Note x={1100} y={150} icon="😌" title="Tranquilo, no entres en pánico" accent={theme.cyan} durationInFrames={s(104.4) - s(101.5)} />
      </Sequence>
      <Sequence from={s(104.4)} durationInFrames={s(107.8) - s(104.4)}>
        <Chip text="🔧 Aquí entra el ALCOR TRUCO" x={70} y={780} accent durationInFrames={s(107.8) - s(104.4)} />
      </Sequence>
      <Sequence from={s(107.8)} durationInFrames={s(116.1) - s(107.8)}>
        <Note x={70} y={150} icon="🎯" title="La clave: igualar VID y PID" body="con los datos que pide la herramienta" accent={theme.cyan} durationInFrames={s(116.1) - s(107.8)} />
      </Sequence>
      <Sequence from={s(116.1)} durationInFrames={s(121.7) - s(116.1)}>
        <Note x={70} y={150} icon="💬" title="Así le decimos: revisa SOLO esta memoria" accent={theme.cyan} durationInFrames={s(121.7) - s(116.1)} />
      </Sequence>
      <Sequence from={s(121.7)} durationInFrames={s(122.8) - s(121.7)}>
        <QuestionScene text="¿Y cómo lo hacemos? 🤔" durationInFrames={s(122.8) - s(121.7)} />
      </Sequence>
      <Sequence from={s(122.8)} durationInFrames={s(126.6) - s(122.8)}>
        <Highlight x={1108} y={422} w={300} h={32} color={theme.cyan} label="VID · PID" durationInFrames={s(126.6) - s(122.8)} />
      </Sequence>
      <Sequence from={s(126.6)} durationInFrames={s(132.9) - s(126.6)}>
        <StepCard step={2} total={3} title="Igualamos VID y PID en Setup" sub="Clic derecho en la herramienta → Setup" x={70} y={150} accent={theme.red} durationInFrames={s(132.9) - s(126.6)} />
        <Highlight x={963} y={474} w={125} h={34} color={theme.amber} label="Clic derecho → Setup" durationInFrames={s(132.9) - s(126.6)} />
      </Sequence>
      <Sequence from={s(128)} durationInFrames={40}>
        <ClickRipple x={1025} y={490} durationInFrames={40} />
      </Sequence>
      <Sequence from={s(132.9)} durationInFrames={s(138.8) - s(132.9)}>
        <Highlight x={548} y={278} w={162} h={34} color={theme.amber} label="Pestaña Information" durationInFrames={s(138.8) - s(132.9)} />
      </Sequence>
      <Sequence from={s(142.6)} durationInFrames={s(149.5) - s(142.6)}>
        <KeyValueBig durationInFrames={s(149.5) - s(142.6)} />
      </Sequence>
      <Sequence from={s(149.5)} durationInFrames={s(152.7) - s(149.5)}>
        <Note x={70} y={780} icon="✅" title="Damos OK y listo" accent={theme.green} durationInFrames={s(152.7) - s(149.5)} />
      </Sequence>
      <Sequence from={s(152.7)} durationInFrames={s(158.5) - s(152.7)}>
        <StepCard step={3} total={3} title="Start → reparar la memoria" sub="Ya la reconoce sin problemas" x={1100} y={150} accent={theme.red} durationInFrames={s(158.5) - s(152.7)} />
      </Sequence>
      <Sequence from={s(153.4)} durationInFrames={s(158.5) - s(153.4)}>
        <Highlight x={963} y={432} w={125} h={38} color={theme.green} label="¡Reconocida! → Start" durationInFrames={s(158.5) - s(153.4)} />
      </Sequence>
      <Sequence from={s(155)} durationInFrames={40}>
        <ClickRipple x={1025} y={450} durationInFrames={40} />
      </Sequence>
      <Sequence from={s(158.5)} durationInFrames={s(160.7) - s(158.5)}>
        <Note x={70} y={150} icon="▶️" title="Comenzamos a reparar la memoria" accent={theme.green} durationInFrames={s(160.7) - s(158.5)} />
      </Sequence>
      <Sequence from={s(160.7)} durationInFrames={s(162.3) - s(160.7)}>
        <Stamp text="¡ES SENCILLO!" sub="🔧 ALCOR TRUCO" durationInFrames={s(162.3) - s(160.7)} />
      </Sequence>
      <Sequence from={s(162.3)} durationInFrames={s(167.9) - s(162.3)}>
        <Note x={70} y={150} icon="🌶️" title="Este Alcor Truco es la bomba" accent={theme.red} durationInFrames={s(167.9) - s(162.3)} />
      </Sequence>
      <Sequence from={s(167.9)} durationInFrames={s(172.0) - s(167.9)}>
        <Note x={1100} y={150} icon="🔴" title="Existe una variante PLUS" body="cuando la memoria aparece en ROJO (error)" accent={theme.warn} durationInFrames={s(172.0) - s(167.9)} />
      </Sequence>
      <Sequence from={s(172.0)} durationInFrames={s(175.5) - s(172.0)}>
        <Note x={70} y={780} icon="🛠️" title="Podemos modificarlo para repararla igual" accent={theme.cyan} durationInFrames={s(175.5) - s(172.0)} />
      </Sequence>
      <Sequence from={s(175.5)} durationInFrames={s(182.2) - s(175.5)}>
        <CTABar icon="🐤" title="Deja un emoji de POLLITO en los comentarios" sub="para que traiga el ALCOR TRUCO PLUS" durationInFrames={s(182.2) - s(175.5)} />
      </Sequence>
      <Sequence from={s(182.2)} durationInFrames={s(185.7) - s(182.2)}>
        <Note x={70} y={150} icon="🐔" title="Si veo muchos pollitos, ¡traigo el video!" accent={theme.amber} durationInFrames={s(185.7) - s(182.2)} />
      </Sequence>
      <Sequence from={s(185.7)} durationInFrames={s(189.3) - s(185.7)}>
        <SubNudge text="¿Te sirvió? Deja tu LIKE y SUSCRÍBETE" durationInFrames={s(189.3) - s(185.7)} />
      </Sequence>
      <Sequence from={s(189.3)} durationInFrames={s(193.4) - s(189.3)}>
        <Note x={1100} y={150} icon="🔔" title="No te pierdas las próximas estrategias" accent={theme.red} durationInFrames={s(193.4) - s(189.3)} />
      </Sequence>

      {/* ============================== OUTRO ============================== */}
      <Sequence from={s(195)} durationInFrames={90}>
        <Stamp text="ALCOR TRUCO" sub="REPARA CIENTOS DE MEMORIAS USB" durationInFrames={90} />
      </Sequence>
      <Sequence from={s(202)} durationInFrames={TOTAL - s(202)}>
        <EndCardFinal durationInFrames={TOTAL - s(202)} />
      </Sequence>
    </AbsoluteFill>
  );
};
