import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import piecesData from '../public/collage/hg/pieces.json';

// ============================================================
// Reconstrucción animada de UNA lámina de collage ya terminada
// (el reloj de arena "TIME PASSAGE / 8,000 YEARS"). Las capas se
// separaron de la imagen fuente (rembg/opencv) y se re-arman aquí
// con ensamblaje stop-motion, cámara fija, hasta calzar EXACTO
// con la imagen original; luego póster vivo.
// ============================================================

const SCALE = 1920 / piecesData.source_w; // 1.3953
const CANVAS_W = Math.round(piecesData.source_w * SCALE); // 1920
const CANVAS_H = Math.round(piecesData.source_h * SCALE); // ~1072

type PieceMeta = {name: string; x: number; y: number; w: number; h: number};
const P: Record<string, PieceMeta> = Object.fromEntries(
  (piecesData.pieces as PieceMeta[]).map((p) => [p.name, p]),
);

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const stepped = (frame: number, size: number) => Math.floor(frame / size) * size;
const easeOutBack = (t: number) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

const paperShadow =
  'drop-shadow(0 1px 1px rgba(35,28,16,.35)) drop-shadow(0 6px 10px rgba(35,28,16,.28)) drop-shadow(0 16px 22px rgba(35,28,16,.16))';

const Placed: React.FC<{
  name: string;
  startFrame: number;
  durFrames: number;
  from: {dx?: number; dy?: number; rot?: number; scale?: number};
  z: number;
  breathe?: number;
  shadow?: boolean;
}> = ({name, startFrame, durFrames, from, z, breathe = 0, shadow = true}) => {
  const frame = useCurrentFrame();
  const meta = P[name];
  const sf = stepped(frame, 3);
  const t = clamp((sf - startFrame) / durFrames);
  const e = t <= 0 ? 0 : t >= 1 ? 1 : easeOutBack(t);

  const dx = (from.dx ?? 0) * (1 - e);
  const dy = (from.dy ?? 0) * (1 - e);
  const rot = (from.rot ?? 0) * (1 - e);
  const sc = (from.scale ?? 1) + (1 - (from.scale ?? 1)) * e;
  const op = clamp(t * 2.4);

  const life = breathe
    ? Math.sin((frame / 30) * 1.1 + meta.x) * breathe * clamp((frame - (startFrame + durFrames)) / 20)
    : 0;

  return (
    <div
      style={{
        position: 'absolute',
        left: meta.x * SCALE,
        top: meta.y * SCALE,
        width: meta.w * SCALE,
        height: meta.h * SCALE,
        zIndex: z,
        opacity: op,
        transform: `translate(${dx}px, ${dy}px) rotate(${rot + life}deg) scale(${sc})`,
        transformOrigin: '50% 50%',
        filter: shadow ? paperShadow : undefined,
      }}
    >
      <Img src={staticFile(`collage/hg/${name}.png`)} style={{width: '100%', height: '100%'}} />
    </div>
  );
};

// Hilo rojo: revela con un barrido perpendicular a su dirección real
// (pin inferior -> pin superior), usando los píxeles originales tal cual.
const StringReveal: React.FC<{startFrame: number; durFrames: number; z: number}> = ({
  startFrame,
  durFrames,
  z,
}) => {
  const frame = useCurrentFrame();
  const meta = P['string'];
  const sf = stepped(frame, 2);
  const t = clamp((sf - startFrame) / durFrames);

  // Coordenadas locales (dentro del recorte string.png, en px fuente) de los 2 pines.
  const lower = {x: 25, y: 177}; // pin junto a la etiqueta
  const upper = {x: 327, y: 17}; // pin sobre el reloj
  const dirX = upper.x - lower.x;
  const dirY = upper.y - lower.y;
  const len = Math.hypot(dirX, dirY);
  const ux = dirX / len;
  const uy = dirY / len;
  const px = -uy;
  const py = ux;
  const BIG = 1400;
  const lead = 18;
  const reveal = t * len + lead;

  const pt = (alongDir: number, alongPerp: number) => ({
    x: (lower.x + ux * alongDir + px * alongPerp) * SCALE,
    y: (lower.y + uy * alongDir + py * alongPerp) * SCALE,
  });
  const c1 = pt(-BIG, -BIG);
  const c2 = pt(-BIG, BIG);
  const c3 = pt(reveal, BIG);
  const c4 = pt(reveal, -BIG);
  const clipPath = `polygon(${c1.x}px ${c1.y}px, ${c2.x}px ${c2.y}px, ${c3.x}px ${c3.y}px, ${c4.x}px ${c4.y}px)`;

  const op = clamp(t * 4);
  // pequeño temblor único al terminar de dibujarse
  const quiver = Math.sin((frame / 30) * 9) * 0.5 * clamp(1 - (frame - (startFrame + durFrames + 6)) / 14) * clamp((frame - (startFrame + durFrames)) / 4);

  return (
    <div
      style={{
        position: 'absolute',
        left: meta.x * SCALE,
        top: meta.y * SCALE,
        width: meta.w * SCALE,
        height: meta.h * SCALE,
        zIndex: z,
        opacity: op,
        clipPath,
        transform: `translateY(${quiver}px)`,
        filter: 'drop-shadow(0 2px 3px rgba(0,0,0,.3))',
      }}
    >
      <Img src={staticFile('collage/hg/string.png')} style={{width: '100%', height: '100%'}} />
    </div>
  );
};

const GRAIN =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="220" height="220"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter><rect width="100%" height="100%" filter="url(#n)" opacity="0.5"/></svg>`,
  );

export const CollageHourglass: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#e9e2d0', width: CANVAS_W, height: CANVAS_H}}>
      <Img
        src={staticFile('collage/hg/bg-clean.jpg')}
        style={{position: 'absolute', width: '100%', height: '100%', objectFit: 'cover'}}
      />

      {/* Pieza hero: reloj de arena + fragmento de mapa */}
      <Placed name="hero" startFrame={8} durFrames={22} from={{dy: -160, rot: -6, scale: 0.9}} z={20} breathe={0.18} />

      {/* Fotos de esquina */}
      <Placed name="photo-tl" startFrame={26} durFrames={16} from={{dy: -120, rot: -8}} z={10} breathe={0.2} />
      <Placed name="photo-tr" startFrame={34} durFrames={16} from={{dy: -110, rot: 7}} z={10} breathe={0.2} />
      <Placed name="photo-br" startFrame={42} durFrames={16} from={{dy: 110, rot: 6}} z={10} breathe={0.2} />

      {/* Cinta que asegura cada foto */}
      <Placed name="tape-1" startFrame={52} durFrames={9} from={{dy: -40, scale: 1.3}} z={30} shadow={false} />
      <Placed name="tape-2" startFrame={56} durFrames={9} from={{dy: -40, scale: 1.3}} z={30} shadow={false} />
      <Placed name="tape-3" startFrame={60} durFrames={9} from={{dy: -40, scale: 1.3}} z={30} shadow={false} />
      <Placed name="tape-6" startFrame={64} durFrames={9} from={{dx: 40, scale: 1.3}} z={30} shadow={false} />
      <Placed name="tape-4" startFrame={68} durFrames={9} from={{dy: 40, scale: 1.3}} z={30} shadow={false} />
      <Placed name="tape-5" startFrame={72} durFrames={9} from={{dy: 40, scale: 1.3}} z={30} shadow={false} />

      {/* Sello */}
      <Placed name="stamp" startFrame={78} durFrames={12} from={{scale: 1.8, rot: 8}} z={40} breathe={0.08} />

      {/* Etiqueta de máquina de escribir */}
      <Placed name="label" startFrame={88} durFrames={14} from={{dx: -140, rot: 5}} z={40} breathe={0.15} />

      {/* Hilo rojo: se dibuja al final, de pin a pin */}
      <StringReveal startFrame={100} durFrames={16} z={50} />

      {/* Grano de papel + viñeta */}
      <div
        style={{
          position: 'absolute', inset: 0, backgroundImage: `url("${GRAIN}")`,
          backgroundSize: '380px 380px', mixBlendMode: 'multiply', opacity: 0.07, zIndex: 90, pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(120% 120% at 50% 45%, transparent 55%, rgba(50,40,18,.20) 100%)',
          zIndex: 91, pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};

export {CANVAS_W, CANVAS_H};
