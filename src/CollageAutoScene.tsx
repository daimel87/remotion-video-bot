import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame, delayRender, continueRender} from 'remotion';

// ============================================================
// Escena generica de collage animado. Dado un indice de escena
// (carpeta public/collage/papa/<NN>/), carga su pieces.json y
// re-arma la lamina con ensamblaje stop-motion generico, eligiendo
// la animacion de entrada segun el "kind" de cada pieza detectada
// por el separador automatico (scripts/auto_collage_segment.py).
// ============================================================

type PieceMeta = {
  name: string; x: number; y: number; w: number; h: number; area: number;
  kind: 'photo' | 'tape' | 'string' | 'detail';
  p0?: [number, number]; p1?: [number, number];
};
type SceneData = {source_w: number; source_h: number; pieces: PieceMeta[]};

export const SCENE_FPS = 30;
export const SCENE_DURATION = 150; // 5s
export const TARGET_W = 1920;
export const TARGET_H = 1080;

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const stepped = (frame: number, size: number) => Math.floor(frame / size) * size;
const easeOutBack = (t: number) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};
const paperShadow =
  'drop-shadow(0 1px 1px rgba(35,28,16,.35)) drop-shadow(0 6px 10px rgba(35,28,16,.26)) drop-shadow(0 16px 20px rgba(35,28,16,.15))';

const KIND_DUR: Record<string, number> = {photo: 20, tape: 9, string: 16, detail: 10};
const KIND_FROM = (kind: string, i: number): {dx?: number; dy?: number; rot?: number; scale?: number} => {
  const sign = i % 2 === 0 ? 1 : -1;
  switch (kind) {
    case 'photo':
      return {dy: sign > 0 ? -130 : 130, rot: -7 * sign, scale: 0.92};
    case 'tape':
      return {dy: -35, scale: 1.35};
    case 'detail':
      return {dy: 40 * sign, rot: 10 * sign, scale: 0.7};
    default:
      return {dy: -100};
  }
};

const GRAIN =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="220" height="220"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter><rect width="100%" height="100%" filter="url(#n)" opacity="0.5"/></svg>`,
  );

const Placed: React.FC<{
  piece: PieceMeta; scale: number; offsetX: number; offsetY: number; startFrame: number; durFrames: number;
  from: {dx?: number; dy?: number; rot?: number; scale?: number}; z: number; folder: string; opSpeed?: number;
  alwaysOpaque?: boolean;
}> = ({piece, scale, offsetX, offsetY, startFrame, durFrames, from, z, folder, opSpeed = 5, alwaysOpaque = false}) => {
  const frame = useCurrentFrame();
  const sf = stepped(frame, 3);
  const t = clamp((sf - startFrame) / durFrames);
  const e = t <= 0 ? 0 : t >= 1 ? 1 : easeOutBack(t);
  const dx = (from.dx ?? 0) * (1 - e);
  const dy = (from.dy ?? 0) * (1 - e);
  const rot = (from.rot ?? 0) * (1 - e);
  const sc = (from.scale ?? 1) + (1 - (from.scale ?? 1)) * e;
  // El hero (pieza mas grande) nunca es transparente: si se desvanece desde 0,
  // se alcanza a ver el parche reconstruido del fondo detras suyo durante el
  // hold inicial de stop-motion. Siempre opaco, solo se anima su posicion.
  const op = alwaysOpaque ? 1 : clamp(t * opSpeed);
  const breathe = piece.kind === 'photo' ? 0.15 : 0.08;
  const life = Math.sin((frame / 30) * 1.1 + piece.x) * breathe * clamp((frame - (startFrame + durFrames)) / 20);

  return (
    <div
      style={{
        position: 'absolute', left: piece.x * scale + offsetX, top: piece.y * scale + offsetY,
        width: piece.w * scale, height: piece.h * scale, zIndex: z, opacity: op,
        transform: `translate(${dx}px, ${dy}px) rotate(${rot + life}deg) scale(${sc})`,
        transformOrigin: '50% 50%', filter: piece.kind === 'tape' ? undefined : paperShadow,
      }}
    >
      <Img src={staticFile(`collage/papa/${folder}/${piece.name}.png`)} style={{width: '100%', height: '100%'}} />
    </div>
  );
};

const StringPiece: React.FC<{
  piece: PieceMeta; scale: number; offsetX: number; offsetY: number; startFrame: number; durFrames: number; z: number; folder: string;
}> = ({piece, scale, offsetX, offsetY, startFrame, durFrames, z, folder}) => {
  const frame = useCurrentFrame();
  const sf = stepped(frame, 2);
  const t = clamp((sf - startFrame) / durFrames);
  if (!piece.p0 || !piece.p1) {
    return (
      <Placed piece={piece} scale={scale} offsetX={offsetX} offsetY={offsetY} startFrame={startFrame}
        durFrames={durFrames} from={{dy: -60}} z={z} folder={folder} />
    );
  }
  const [x0, y0] = piece.p0;
  const [x1, y1] = piece.p1;
  const dirX = x1 - x0, dirY = y1 - y0;
  const len = Math.hypot(dirX, dirY) || 1;
  const ux = dirX / len, uy = dirY / len;
  const px = -uy, py = ux;
  const BIG = 2000;
  const reveal = t * len + 20;
  const pt = (along: number, perp: number) => ({
    x: (x0 + ux * along + px * perp) * scale + offsetX,
    y: (y0 + uy * along + py * perp) * scale + offsetY,
  });
  const c1 = pt(-BIG, -BIG), c2 = pt(-BIG, BIG), c3 = pt(reveal, BIG), c4 = pt(reveal, -BIG);
  const clipPath = `polygon(${c1.x}px ${c1.y}px, ${c2.x}px ${c2.y}px, ${c3.x}px ${c3.y}px, ${c4.x}px ${c4.y}px)`;
  const op = clamp(t * 4);
  return (
    <div
      style={{
        position: 'absolute', left: piece.x * scale + offsetX, top: piece.y * scale + offsetY,
        width: piece.w * scale, height: piece.h * scale, zIndex: z, opacity: op, clipPath,
        filter: 'drop-shadow(0 2px 3px rgba(0,0,0,.3))',
      }}
    >
      <Img src={staticFile(`collage/papa/${folder}/${piece.name}.png`)} style={{width: '100%', height: '100%'}} />
    </div>
  );
};

export const CollageAutoScene: React.FC<{folder: string}> = ({folder}) => {
  const [data, setData] = useState<SceneData | null>(null);
  const [handle] = useState(() => delayRender(`load-scene-${folder}`));

  useEffect(() => {
    let cancelled = false;
    fetch(staticFile(`collage/papa/${folder}/pieces.json`))
      .then((r) => r.json())
      .then((json: SceneData) => {
        if (!cancelled) setData(json);
        continueRender(handle);
      })
      .catch(() => continueRender(handle));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [folder]);

  if (!data) return <AbsoluteFill style={{backgroundColor: '#e9e2d0'}} />;

  // Escalado tipo "cover": llena 1920x1080 exacto, recortando el sobrante
  // centrado (los source son ~1376x768, casi el mismo aspecto).
  const scale = Math.max(TARGET_W / data.source_w, TARGET_H / data.source_h);
  const offsetX = (TARGET_W - data.source_w * scale) / 2;
  const offsetY = (TARGET_H - data.source_h * scale) / 2;
  const pieces = data.pieces;
  const N = pieces.length;
  const assemblyWindow = 96;
  const step = N > 0 ? Math.min(13, assemblyWindow / N) : 0;

  return (
    <AbsoluteFill style={{backgroundColor: '#e9e2d0', width: TARGET_W, height: TARGET_H, overflow: 'hidden'}}>
      <Img
        src={staticFile(`collage/papa/${folder}/bg-clean.jpg`)}
        style={{position: 'absolute', width: '100%', height: '100%', objectFit: 'cover'}}
      />
      {pieces.map((p, i) => {
        const isHero = i === 0;
        // La pieza mas grande (el "hero") tapa casi todo el hueco reconstruido del
        // fondo; si tarda en llegar a opacidad completa se alcanza a ver el parche
        // sucio de la reconstruccion. Por eso entra casi instantanea y opaca, como
        // si ya estuviera puesta en la mesa, con solo un pequeno asentamiento.
        const startFrame = isHero ? 0 : Math.round(6 + i * step);
        const durFrames = isHero ? 8 : (KIND_DUR[p.kind] ?? 12);
        const z = 10 + i;
        if (p.kind === 'string') {
          return (
            <StringPiece
              key={p.name} piece={p} scale={scale} offsetX={offsetX} offsetY={offsetY}
              startFrame={startFrame} durFrames={durFrames} z={z} folder={folder}
            />
          );
        }
        const from = isHero ? {dy: -14, rot: -1.8, scale: 0.985} : KIND_FROM(p.kind, i);
        return (
          <Placed
            key={p.name} piece={p} scale={scale} offsetX={offsetX} offsetY={offsetY}
            startFrame={startFrame} durFrames={durFrames} from={from} alwaysOpaque={isHero} z={z} folder={folder}
          />
        );
      })}
      <div
        style={{
          position: 'absolute', inset: 0, backgroundImage: `url("${GRAIN}")`,
          backgroundSize: '380px 380px', mixBlendMode: 'multiply', opacity: 0.06, zIndex: 500, pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(120% 120% at 50% 45%, transparent 55%, rgba(50,40,18,.18) 100%)',
          zIndex: 501, pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};
