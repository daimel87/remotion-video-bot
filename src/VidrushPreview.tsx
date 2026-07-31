import React from 'react';
import {
  AbsoluteFill,
  Img,
  OffthreadVideo,
  Audio,
  staticFile,
  useCurrentFrame,
  interpolate,
} from 'remotion';
import {cues} from './gc/cues';

// ============================================================
// PREVIEW "estilo Vidrush" (30s) sobre el material de González Camarena.
// Replica lo medido cuadro-a-cuadro del video de referencia:
//  - Plano ~4s, 30fps. Mezcla foto (Ken Burns) + video stock a velocidad nativa.
//  - ~1 de cada 5 transiciones es fundido (~1s); el resto corte seco.
//  - Grade filmico global (contraste + desaturacion + viñeta + grano).
//  - 3 capas de texto: subtitulos corridos por frase (barra inferior),
//    titular serif de enfasis, y card de seccion a negro con numero grande.
//  - Numero fantasma translucido sobre el b-roll.
// ============================================================

export const VP_FPS = 30;
export const VP_DURATION = 30 * VP_FPS; // 900
const W = 1920;
const H = 1080;

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

// --- Grano sutil (mismo truco que el collage) ---
const GRAIN =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter><rect width="100%" height="100%" filter="url(#n)" opacity="0.5"/></svg>`,
  );

const SERIF = 'Georgia, "Times New Roman", serif';
const SANS = 'Arial, Helvetica, sans-serif';

type Motion = 'zoomIn' | 'zoomOut' | 'panLeft' | 'panRight';
type Shot = {
  from: number; // s
  dur: number; // s
  kind: 'photo' | 'video' | 'card';
  src?: string;
  motion?: Motion;
  fade?: boolean; // transicion de ENTRADA en fundido (1s)
  // solo para card:
  num?: string;
  title?: string;
  sub?: string;
};

const FADE = 1; // s de crossfade

// -------- Guion visual del hook (0-30s), calzado con la narracion --------
// Cada plano calzado con lo que se DICE en ese segundo (ver cues.ts):
//  0-5   "viendo esto en color, rojo verde azul"        -> pixeles RGB
//  5-9   "ese color no siempre estuvo ahi"              -> espectro de color -> TV B/N
//  9-14  "alguien tuvo que inventarlo / meter colores"  -> inventor en su taller
//  14-18 "dentro de una caja de vidrio"                 -> el televisor (caja de vidrio)
//  18-23 "no fue una corporacion en NY, ni Londres"     -> torre de transmision + titular
//  23-25 (card capitulo)                                -> "Guadalajara, 1917"
//  25-30 "un joven de Guadalajara, tenia 23 años"       -> Guadalajara + numero 23
const SHOTS: Shot[] = [
  {from: 0, dur: 5, kind: 'video', src: 'stock-gc/preview/rgb-pixels-macro-1.mp4'},
  {from: 5, dur: 4, kind: 'photo', src: 'stock-gc/photos/color-spectrum-prism-2.jpg', motion: 'zoomIn'},
  {from: 9, dur: 5, kind: 'photo', src: 'stock-gc/photos/engineer-workshop-2.jpg', motion: 'panRight'},
  {from: 14, dur: 4, kind: 'photo', src: 'stock-gc/photos/family-tv-vintage-3.jpg', motion: 'zoomIn', fade: true},
  {from: 18, dur: 5, kind: 'photo', src: 'stock-gc/photos/broadcast-tower-2.jpg', motion: 'zoomOut'},
  {from: 23, dur: 2, kind: 'card', num: '01', title: 'Guadalajara, 1917', sub: 'El joven que soñó en color'},
  {from: 25, dur: 5, kind: 'photo', src: 'stock-gc/photos/guadalajara-city-1.jpg', motion: 'zoomIn', fade: true},
];

// Titular serif de enfasis — cae EXACTO sobre "corporacion en Nueva York... Londres"
const HEADLINE = {from: 19.2, dur: 3.4, text: 'Ni Nueva York.\nNi Londres.'};
// Numero fantasma — la narracion dice "tenia 23 años" (~seg 25-27)
const GHOST = {from: 25.4, dur: 4.2, text: '23'};

// -------- Subtitulos corridos: parte cada cue en trozos de ~6 palabras --------
type Cap = {start: number; end: number; text: string};
const buildCaptions = (): Cap[] => {
  const out: Cap[] = [];
  const maxWords = 6;
  for (const c of cues) {
    if (c.start >= 30) break;
    const words = c.text.trim().split(/\s+/);
    const groups: string[][] = [];
    for (let i = 0; i < words.length; i += maxWords) groups.push(words.slice(i, i + maxWords));
    const span = c.end - c.start;
    const totalW = words.length || 1;
    let acc = c.start;
    for (const g of groups) {
      const d = span * (g.length / totalW);
      out.push({start: acc, end: acc + d, text: g.join(' ')});
      acc += d;
    }
  }
  return out;
};
const CAPTIONS = buildCaptions();

// ---------------- Ken Burns ----------------
const kb = (motion: Motion | undefined, p: number) => {
  // p: 0..1 progreso del plano
  switch (motion) {
    case 'zoomIn':
      return {scale: interpolate(p, [0, 1], [1.06, 1.18]), x: 0, y: 0};
    case 'zoomOut':
      return {scale: interpolate(p, [0, 1], [1.18, 1.06]), x: 0, y: 0};
    case 'panRight':
      return {scale: 1.14, x: interpolate(p, [0, 1], [-3.5, 3.5]), y: 0};
    case 'panLeft':
      return {scale: 1.14, x: interpolate(p, [0, 1], [3.5, -3.5]), y: 0};
    default:
      return {scale: 1.04, x: 0, y: 0};
  }
};

const ShotLayer: React.FC<{shot: Shot; index: number}> = ({shot, index}) => {
  const frame = useCurrentFrame();
  const t = frame / VP_FPS;
  const start = shot.fade ? shot.from - FADE : shot.from;
  const end = shot.from + shot.dur;
  if (t < start || t >= end) return null;

  // opacidad de entrada (crossfade) y salida corta para no cortar en seco el fundido
  let op = 1;
  if (shot.fade) op = clamp((t - start) / FADE);

  const p = clamp((t - shot.from) / shot.dur);
  const {scale, x, y} = kb(shot.motion, p);

  if (shot.kind === 'card') {
    return (
      <AbsoluteFill style={{zIndex: 10 + index, opacity: op, backgroundColor: '#0b0b0c'}}>
        <SectionCard num={shot.num!} title={shot.title!} sub={shot.sub!} localT={t - shot.from} />
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill style={{zIndex: 10 + index, opacity: op, overflow: 'hidden', backgroundColor: '#000'}}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `scale(${scale}) translate(${x}%, ${y}%)`,
          transformOrigin: '50% 50%',
        }}
      >
        {shot.kind === 'video' ? (
          <OffthreadVideo
            src={staticFile(shot.src!)}
            muted
            toneMapped={false}
            style={{width: '100%', height: '100%', objectFit: 'cover'}}
          />
        ) : (
          <Img src={staticFile(shot.src!)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
        )}
      </div>
    </AbsoluteFill>
  );
};

const SectionCard: React.FC<{num: string; title: string; sub: string; localT: number}> = ({
  num,
  title,
  sub,
  localT,
}) => {
  const rise = interpolate(clamp(localT / 0.5), [0, 1], [30, 0]);
  const op = clamp(localT / 0.4);
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
      <div style={{textAlign: 'center', transform: `translateY(${rise}px)`, opacity: op}}>
        <div style={{fontFamily: SERIF, fontSize: 240, fontWeight: 700, color: '#c9a24b', lineHeight: 1, letterSpacing: 4}}>
          {num}
        </div>
        <div style={{fontFamily: SERIF, fontSize: 74, fontWeight: 700, color: '#f2ede1', marginTop: 6}}>
          {title}
        </div>
        <div style={{display: 'inline-block', marginTop: 20, background: '#f2ede1', padding: '8px 22px'}}>
          <span style={{fontFamily: SERIF, fontSize: 34, fontStyle: 'italic', color: '#1a1a1a'}}>{sub}</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const SerifHeadline: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / VP_FPS;
  if (t < HEADLINE.from || t > HEADLINE.from + HEADLINE.dur) return null;
  const local = t - HEADLINE.from;
  const op = clamp(local / 0.5) * clamp((HEADLINE.from + HEADLINE.dur - t) / 0.4);
  const rise = interpolate(clamp(local / 0.5), [0, 1], [24, 0]);
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-end', zIndex: 200, paddingBottom: 240}}>
      <div
        style={{
          fontFamily: SERIF,
          fontSize: 90,
          fontWeight: 700,
          color: '#fff',
          textAlign: 'center',
          whiteSpace: 'pre-line',
          lineHeight: 1.05,
          textShadow: '0 3px 18px rgba(0,0,0,.7)',
          opacity: op,
          transform: `translateY(${rise}px)`,
        }}
      >
        {HEADLINE.text}
      </div>
    </AbsoluteFill>
  );
};

const GhostNumber: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / VP_FPS;
  if (t < GHOST.from || t > GHOST.from + GHOST.dur) return null;
  const local = t - GHOST.from;
  const op = clamp(local / 0.6) * clamp((GHOST.from + GHOST.dur - t) / 0.6) * 0.22;
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', zIndex: 150}}>
      <div style={{fontFamily: SERIF, fontSize: 520, fontWeight: 700, color: '#fff', opacity: op, lineHeight: 1}}>
        {GHOST.text}
      </div>
    </AbsoluteFill>
  );
};

const RunningCaptions: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / VP_FPS;
  const cap = CAPTIONS.find((c) => t >= c.start && t < c.end);
  if (!cap) return null;
  const local = t - cap.start;
  const op = clamp(local / 0.12);
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-end', zIndex: 300, paddingBottom: 70}}>
      <div
        style={{
          maxWidth: '80%',
          background: 'rgba(15,15,17,.72)',
          borderRadius: 8,
          padding: '10px 22px',
          opacity: op,
        }}
      >
        <span style={{fontFamily: SANS, fontSize: 40, fontWeight: 600, color: '#fff', textAlign: 'center', display: 'block'}}>
          {cap.text}
        </span>
      </div>
    </AbsoluteFill>
  );
};

export const VidrushPreview: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000', width: W, height: H}}>
      <Audio src={staticFile('audio/gc-narration.mp3')} />

      {/* Capa de imagen con GRADE filmico global */}
      <AbsoluteFill style={{filter: 'contrast(1.09) saturate(0.82) brightness(1.02) sepia(0.06)'}}>
        {SHOTS.map((s, i) => (
          <ShotLayer key={i} shot={s} index={i} />
        ))}
      </AbsoluteFill>

      {/* Viñeta */}
      <AbsoluteFill
        style={{
          zIndex: 100,
          pointerEvents: 'none',
          background: 'radial-gradient(120% 120% at 50% 45%, transparent 55%, rgba(0,0,0,.45) 100%)',
        }}
      />
      {/* Grano */}
      <AbsoluteFill
        style={{
          zIndex: 101,
          pointerEvents: 'none',
          backgroundImage: `url("${GRAIN}")`,
          backgroundSize: '300px 300px',
          mixBlendMode: 'overlay',
          opacity: 0.05,
        }}
      />

      <GhostNumber />
      <SerifHeadline />
      <RunningCaptions />
    </AbsoluteFill>
  );
};
