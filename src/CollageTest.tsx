import React from 'react';
import {
  AbsoluteFill,
  Img,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from 'remotion';

// ============================================================
// TEST estilo "collage de papel documental" (tipo Vox / Johnny Harris)
// Ensamblaje build-on con cadencia stop-motion, cámara FIJA, y póster vivo.
// Todo son piezas de papel rígidas que entran una por una, de atrás a adelante.
// ============================================================

const FPS = 30;
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

// Cadencia stop-motion: "cortar en treses" (~10 fps) para el paso de entradas.
const stepped = (frame: number, size: number) => Math.floor(frame / size) * size;

// easeOutBack (overshoot suave -> el "asentamiento" con rebotito de papel)
const easeOutBack = (t: number) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

// sombra en capas (grosor de papel + sombra proyectada)
const paperShadow =
  'drop-shadow(0 1px 1px rgba(40,32,18,.35)) drop-shadow(0 8px 14px rgba(40,32,18,.30)) drop-shadow(0 22px 30px rgba(40,32,18,.18))';

type PieceProps = {
  startFrame: number;
  durFrames: number;
  from: {dx?: number; dy?: number; rot?: number; scale?: number};
  x: number;
  y: number;
  rot?: number;
  z?: number;
  children: React.ReactNode;
  // "vida" en el hold (levantar esquina / respirar)
  breathe?: number;
};

// Una pieza de papel que entra con arrastre + asentamiento y luego queda quieta.
const Piece: React.FC<PieceProps> = ({
  startFrame,
  durFrames,
  from,
  x,
  y,
  rot = 0,
  z = 0,
  children,
  breathe = 0,
}) => {
  const frame = useCurrentFrame();
  const sf = stepped(frame, 3); // cadencia stop-motion en la entrada
  const t = clamp((sf - startFrame) / durFrames);
  const e = t <= 0 ? 0 : t >= 1 ? 1 : easeOutBack(t);

  const dx = (from.dx ?? 0) * (1 - e);
  const dy = (from.dy ?? 0) * (1 - e);
  const r = rot + (from.rot ?? 0) * (1 - e);
  const s = (from.scale ?? 1) + (1 - (from.scale ?? 1)) * e;
  const op = clamp(t * 2.2);

  // respiración/levantar esquina en el hold (sutil, después de asentar)
  const life = breathe
    ? Math.sin((frame / FPS) * 1.1 + x) * breathe * clamp((frame - (startFrame + durFrames)) / 20)
    : 0;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        zIndex: z,
        transform: `translate(-50%,-50%) translate(${dx}px, ${dy}px) rotate(${r + life}deg) scale(${s})`,
        filter: paperShadow,
        opacity: op,
        transformOrigin: '50% 60%',
      }}
    >
      {children}
    </div>
  );
};

// Cinta adhesiva (papel washi amarillento translúcido)
const Tape: React.FC<{x: number; y: number; rot: number; w?: number; start: number}> = ({
  x,
  y,
  rot,
  w = 150,
  start,
}) => {
  const frame = useCurrentFrame();
  const sf = stepped(frame, 3);
  const t = clamp((sf - start) / 6);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        height: 46,
        zIndex: 40,
        transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${0.9 + 0.1 * t})`,
        opacity: clamp(t * 1.6),
        background:
          'repeating-linear-gradient(90deg, rgba(214,198,150,.78) 0 6px, rgba(206,190,142,.78) 6px 12px)',
        boxShadow: '0 3px 6px rgba(40,32,18,.28)',
        borderLeft: '2px solid rgba(180,166,120,.5)',
        borderRight: '2px solid rgba(180,166,120,.5)',
        mixBlendMode: 'multiply',
      }}
    />
  );
};

// Chincheta metálica
const Pin: React.FC<{x: number; y: number; start: number}> = ({x, y, start}) => {
  const frame = useCurrentFrame();
  const sf = stepped(frame, 3);
  const t = clamp((sf - start) / 5);
  const e = t >= 1 ? 1 : easeOutBack(t);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 26,
        height: 26,
        zIndex: 60,
        transform: `translate(-50%,-50%) scale(${e})`,
        opacity: clamp(t * 2),
        borderRadius: '50%',
        background:
          'radial-gradient(circle at 35% 30%, #f4e6b0 0%, #caa63a 45%, #8a6a1e 100%)',
        boxShadow: '0 4px 6px rgba(0,0,0,.4), inset 0 -2px 3px rgba(0,0,0,.35)',
      }}
    />
  );
};

// Sello rojo distorsionado que "cae"
const Stamp: React.FC<{start: number}> = ({start}) => {
  const frame = useCurrentFrame();
  const sf = stepped(frame, 3);
  const t = clamp((sf - start) / 7);
  const e = t >= 1 ? 1 : easeOutBack(t);
  const scale = 1.7 - 0.7 * e;
  const op = clamp(t * 2);
  return (
    <div
      style={{
        position: 'absolute',
        left: 1480,
        top: 815,
        zIndex: 70,
        transform: `translate(-50%,-50%) rotate(-13deg) scale(${scale})`,
        opacity: op,
      }}
    >
      <div
        style={{
          border: '5px solid #b4241f',
          color: '#b4241f',
          padding: '10px 20px',
          fontFamily: '"Courier New", monospace',
          fontWeight: 900,
          fontSize: 40,
          letterSpacing: 3,
          borderRadius: 4,
          // "tinta" irregular
          WebkitMaskImage:
            'radial-gradient(circle at 20% 30%, #000 60%, transparent 62%), radial-gradient(circle at 80% 70%, #000 55%, transparent 58%), linear-gradient(#000,#000)',
          WebkitMaskComposite: 'source-over',
          opacity: 0.9,
          textShadow: '0 0 1px #b4241f',
          transform: 'rotate(.5deg)',
        }}
      >
        PATENTADO · 1942
      </div>
    </div>
  );
};

// Hilo rojo que se dibuja de chincheta en chincheta (con caída)
const RedString: React.FC<{start: number; pts: [number, number][]}> = ({start, pts}) => {
  const frame = useCurrentFrame();
  const sf = stepped(frame, 2);
  const t = clamp((sf - start) / 14);
  // caída (sag) entre puntos con curva cuadrática
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  let len = 0;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1];
    const [x1, y1] = pts[i];
    const mx = (x0 + x1) / 2;
    const my = (y0 + y1) / 2 + 26; // caída
    d += ` Q ${mx} ${my} ${x1} ${y1}`;
    len += Math.hypot(x1 - x0, y1 - y0) + 26;
  }
  // temblor único en el hold
  const quiver = Math.sin((frame / FPS) * 9) * 0.6 * clamp((frame - (start + 16)) / 8) * clamp(1 - (frame - (start + 40)) / 20);
  return (
    <svg
      width={1920}
      height={1080}
      style={{position: 'absolute', left: 0, top: 0, zIndex: 65, transform: `translateY(${quiver}px)`}}
    >
      <path
        d={d}
        fill="none"
        stroke="#8f1d18"
        strokeWidth={4.5}
        strokeLinecap="round"
        strokeDasharray={len}
        strokeDashoffset={len * (1 - t)}
        style={{filter: 'drop-shadow(0 2px 2px rgba(0,0,0,.35))'}}
      />
    </svg>
  );
};

// Etiqueta de máquina de escribir (se teclea)
const TypeLabel: React.FC<{start: number; text: string}> = ({start, text}) => {
  const frame = useCurrentFrame();
  const sf = stepped(frame, 2);
  const n = Math.round(clamp((sf - start) / 40) * text.length);
  return (
    <span
      style={{
        fontFamily: '"Courier New", monospace',
        fontWeight: 700,
        fontSize: 30,
        letterSpacing: 2,
        color: '#2a2620',
        whiteSpace: 'nowrap',
      }}
    >
      {text.slice(0, n)}
      <span style={{opacity: n < text.length ? 0.6 : 0}}>▮</span>
    </span>
  );
};

const GRAIN =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="220" height="220"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter><rect width="100%" height="100%" filter="url(#n)" opacity="0.5"/></svg>`,
  );

export const CollageTest: React.FC = () => {
  const frame = useCurrentFrame();
  useVideoConfig();

  // hero escala de display
  const heroScale = 0.78;

  return (
    <AbsoluteFill style={{backgroundColor: '#e9e2d0'}}>
      {/* Fondo de papel */}
      <Img
        src={staticFile('collage/paper-bg.jpg')}
        style={{position: 'absolute', width: '100%', height: '100%', objectFit: 'cover'}}
      />

      {/* Fragmento de mapa (atrás) */}
      <Piece startFrame={6} durFrames={16} from={{dy: -40, rot: -8, scale: 0.92}} x={980} y={520} rot={-3} z={10} breathe={0.25}>
        <Img src={staticFile('collage/frag-map.png')} style={{width: 900}} />
      </Piece>

      {/* Tira de papel para el título (atrás-medio) */}
      <Piece startFrame={40} durFrames={16} from={{dx: -120, rot: 6}} x={980} y={905} rot={-1.5} z={20} breathe={0.2}>
        <div style={{position: 'relative'}}>
          <Img src={staticFile('collage/frag-strip.png')} style={{width: 760}} />
          <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <TypeLabel start={62} text="EL JOVEN QUE CREÓ LA TV A COLOR" />
          </div>
        </div>
      </Piece>

      {/* HERO: recorte real de González Camarena (semitono + borde roto) */}
      <Piece startFrame={18} durFrames={26} from={{dx: -260, rot: -7}} x={860} y={470} rot={-2} z={30} breathe={0.15}>
        <Img src={staticFile('collage/ggc-cutout.png')} style={{width: 685 * heroScale}} />
      </Piece>

      {/* Cinta adhesiva */}
      <Tape x={1330} y={250} rot={42} w={150} start={56} />
      <Tape x={690} y={230} rot={-22} w={140} start={60} />
      <Tape x={640} y={880} rot={12} w={120} start={64} />

      {/* Chinchetas */}
      <Pin x={720} y={770} start={74} />
      <Pin x={980} y={800} start={78} />
      <Pin x={1430} y={860} start={82} />

      {/* Hilo rojo de investigación */}
      <RedString start={92} pts={[[720, 770], [980, 800], [1430, 860]]} />

      {/* Sello */}
      <Stamp start={86} />

      {/* Grano de papel encima (mezcla multiply) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url("${GRAIN}")`,
          backgroundSize: '440px 440px',
          mixBlendMode: 'multiply',
          opacity: 0.08,
          zIndex: 90,
          pointerEvents: 'none',
        }}
      />
      {/* Viñeta cálida */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(120% 120% at 50% 45%, transparent 55%, rgba(60,45,20,.22) 100%)',
          zIndex: 91,
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};
