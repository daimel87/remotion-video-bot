// Laboratorio de variantes de tarjetas/lower-thirds "premium" -- 5
// direcciones distintas, no variaciones del mismo look. Una vez elegida
// una (o una mezcla), se traslada a src/odisea/cards.tsx y esta carpeta
// se borra.
import React from 'react';
import {AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {theme} from '../theme';
import {KenBurns, Grade, Vignette, Grain} from '../odisea/components';

const fade = (frame: number, from: number, to: number, fps: number, cfg = theme.spring.smooth) =>
  spring({frame: frame - from, fps, config: cfg});

// ---------------------------------------------------------------------
// 1. EDITORIAL MINIMAL -- mucho espacio en blanco, peso liviano, nada de
// grid ni numero fantasma. La elegancia viene del espacio, no del adorno.
// ---------------------------------------------------------------------
export const EditorialMinimal: React.FC<{eyebrow: string; title: string; sub: string}> = ({
  eyebrow,
  title,
  sub,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p1 = fade(frame, 6, 0, fps);
  const p2 = fade(frame, 16, 0, fps);
  const p3 = fade(frame, 26, 0, fps);
  const lineW = interpolate(frame, [4, 40], [0, 64], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: theme.ease.out,
  });
  return (
    <AbsoluteFill style={{background: theme.colors.bg}}>
      <AbsoluteFill style={{justifyContent: 'center', paddingLeft: 140, paddingRight: 300}}>
        <div style={{width: lineW, height: 1, background: theme.colors.primary, marginBottom: 28}} />
        <div
          style={{
            opacity: p1,
            fontFamily: theme.fonts.body,
            fontSize: 15,
            letterSpacing: 5,
            textTransform: 'uppercase',
            color: theme.colors.primary,
            marginBottom: 22,
          }}
        >
          {eyebrow}
        </div>
        <div
          style={{
            opacity: p2,
            transform: `translateY(${interpolate(p2, [0, 1], [16, 0])}px)`,
            fontFamily: theme.fonts.display,
            fontWeight: 500,
            fontSize: 68,
            lineHeight: 1.15,
            color: theme.colors.text,
            maxWidth: 760,
          }}
        >
          {title}
        </div>
        <div
          style={{
            opacity: p3,
            fontFamily: theme.fonts.body,
            fontWeight: 300,
            fontSize: 20,
            color: theme.colors.textDim,
            marginTop: 24,
            maxWidth: 560,
          }}
        >
          {sub}
        </div>
      </AbsoluteFill>
      <Vignette />
      <Grain />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------
// 2. MUSEUM PLACARD -- ficha de museo/catalogo: recuadro centrado con
// doble filete dorado, papel calido, mayusculas serif. Encaja con el
// tono "documental de archivo" de Odisea.
// ---------------------------------------------------------------------
export const MuseumPlacard: React.FC<{catalog: string; title: string; sub: string}> = ({
  catalog,
  title,
  sub,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const box = spring({frame: frame - 3, fps, config: theme.spring.smooth});
  const p1 = fade(frame, 18, 0, fps);
  const p2 = fade(frame, 26, 0, fps);
  return (
    <AbsoluteFill style={{background: theme.colors.bg, alignItems: 'center', justifyContent: 'center'}}>
      <div
        style={{
          opacity: box,
          transform: `scale(${interpolate(box, [0, 1], [0.97, 1])})`,
          border: `1px solid ${theme.colors.primary}`,
          outline: `1px solid ${theme.colors.primary}`,
          outlineOffset: 8,
          padding: '56px 84px',
          textAlign: 'center',
          maxWidth: 900,
        }}
      >
        <div
          style={{
            fontFamily: theme.fonts.body,
            fontSize: 13,
            letterSpacing: 4,
            color: theme.colors.primary,
            marginBottom: 18,
          }}
        >
          {catalog}
        </div>
        <div
          style={{
            opacity: p1,
            fontFamily: theme.fonts.display,
            fontWeight: 700,
            fontSize: 58,
            textTransform: 'uppercase',
            letterSpacing: 2,
            color: theme.colors.text,
            lineHeight: 1.2,
          }}
        >
          {title}
        </div>
        <div
          style={{
            opacity: p2,
            fontFamily: theme.fonts.display,
            fontStyle: 'italic',
            fontWeight: 500,
            fontSize: 22,
            color: theme.colors.textDim,
            marginTop: 18,
          }}
        >
          {sub}
        </div>
      </div>
      <Vignette />
      <Grain />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------
// 3. CINEMATIC TITLE -- titular enorme centrado sobre la imagen (estilo
// caratula de documental de streaming), no tarjeta a negro.
// ---------------------------------------------------------------------
export const CinematicTitle: React.FC<{img: string; title: string; sub: string}> = ({
  img,
  title,
  sub,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p1 = fade(frame, 8, 0, fps);
  const p2 = fade(frame, 22, 0, fps);
  const lineW = interpolate(frame, [16, 46], [0, 120], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: theme.ease.out,
  });
  return (
    <AbsoluteFill>
      <KenBurns src={img} direction="out" />
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.55), rgba(0,0,0,0.25) 40%, rgba(0,0,0,0.7))'}} />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}>
        <div
          style={{
            opacity: p1,
            transform: `translateY(${interpolate(p1, [0, 1], [18, 0])}px)`,
            fontFamily: theme.fonts.display,
            fontWeight: 800,
            fontSize: 108,
            color: theme.colors.text,
            letterSpacing: 1,
            maxWidth: 1200,
          }}
        >
          {title}
        </div>
        <div style={{width: lineW, height: 2, background: theme.colors.primary, margin: '26px 0'}} />
        <div
          style={{
            opacity: p2,
            fontFamily: theme.fonts.body,
            fontSize: 22,
            letterSpacing: 2,
            textTransform: 'uppercase',
            color: theme.colors.textDim,
          }}
        >
          {sub}
        </div>
      </AbsoluteFill>
      <Vignette />
      <Grain />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------
// 4. BROADCAST LOWER THIRD -- barra clasica abajo-izquierda, franja
// dorada de canto, sobre la imagen (no tapa toda la pantalla).
// ---------------------------------------------------------------------
export const BroadcastLowerThird: React.FC<{img: string; name: string; role: string}> = ({
  img,
  name,
  role,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const slide = spring({frame: frame - 8, fps, config: theme.spring.smooth});
  return (
    <AbsoluteFill>
      <KenBurns src={img} direction="in" pan="left" />
      <Grade />
      <div
        style={{
          position: 'absolute',
          left: 0,
          bottom: 130,
          transform: `translateX(${interpolate(slide, [0, 1], [-40, 0])}px)`,
          opacity: slide,
          display: 'flex',
        }}
      >
        <div style={{width: 5, background: theme.colors.primary}} />
        <div style={{background: 'rgba(10,9,7,0.72)', padding: '14px 28px'}}>
          <div
            style={{
              fontFamily: theme.fonts.body,
              fontWeight: 700,
              fontSize: 30,
              color: theme.colors.text,
              letterSpacing: 0.5,
            }}
          >
            {name}
          </div>
          <div
            style={{
              fontFamily: theme.fonts.display,
              fontStyle: 'italic',
              fontSize: 18,
              color: theme.colors.primary,
              marginTop: 2,
            }}
          >
            {role}
          </div>
        </div>
      </div>
      <Vignette />
      <Grain />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------
// 5. GLASS TAG -- pastilla pequeña vidrio esmerilado, para datos rapidos
// (lugar/fecha), esquina superior.
// ---------------------------------------------------------------------
export const GlassTag: React.FC<{img: string; text: string}> = ({img, text}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: frame - 6, fps, config: theme.spring.bouncy});
  return (
    <AbsoluteFill>
      <KenBurns src={img} direction="out" pan="right" />
      <Grade />
      <div
        style={{
          position: 'absolute',
          top: 56,
          left: 56,
          opacity: p,
          transform: `translateY(${interpolate(p, [0, 1], [-10, 0])}px)`,
          background: 'rgba(21,19,14,0.45)',
          backdropFilter: 'blur(6px)',
          border: `1px solid ${theme.colors.primary}55`,
          borderRadius: 999,
          padding: '10px 24px',
          fontFamily: theme.fonts.body,
          fontSize: 18,
          letterSpacing: 2,
          textTransform: 'uppercase',
          color: theme.colors.text,
        }}
      >
        {text}
      </div>
      <Vignette />
      <Grain />
    </AbsoluteFill>
  );
};
