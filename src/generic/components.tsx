// Componentes de la composicion generica del pipeline automatico (audio ->
// video). A diferencia de src/odisea/components.tsx (tema documental fijo
// "Cronicas Ilustradas"), esto es deliberadamente neutro: sirve para
// cualquier guion/nicho que el usuario suba, no solo para un canal puntual.
import React from 'react';
import {
  AbsoluteFill,
  Img,
  OffthreadVideo,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

export type ClipKind = 'photos' | 'videos';

// Ken Burns lento para fotos (mismo rango que el resto del proyecto).
export const KenBurnsPhoto: React.FC<{src: string}> = ({src}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const scale = interpolate(frame, [0, durationInFrames], [1, 1.12]);
  return (
    <Img
      src={staticFile(src)}
      style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${scale})`}}
    />
  );
};

// Video de stock recortado a la duracion exacta del bloque (silenciado: la
// pista de audio real es siempre la locucion, nunca el sonido del clip).
export const StockVideo: React.FC<{src: string}> = ({src}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const scale = interpolate(frame, [0, durationInFrames], [1.04, 1.1]);
  return (
    <OffthreadVideo
      src={staticFile(src)}
      muted
      style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${scale})`}}
    />
  );
};

export const Grade: React.FC = () => (
  <AbsoluteFill
    style={{
      pointerEvents: 'none',
      background: 'linear-gradient(180deg, rgba(0,0,0,0.22), transparent 30%, transparent 62%, rgba(0,0,0,0.5))',
    }}
  />
);

// Subtitulo estilo "auto-caption" (fondo solido corto, texto grande) -- el
// formato mas legible/generico para cualquier video, no atado a un theme.
export const Caption: React.FC<{text: string}> = ({text}) =>
  text ? (
    <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 110, pointerEvents: 'none'}}>
      <div
        style={{
          maxWidth: '82%',
          textAlign: 'center',
          fontFamily: '-apple-system, "Segoe UI", Roboto, Arial, sans-serif',
          fontSize: 46,
          fontWeight: 800,
          color: '#fff',
          lineHeight: 1.25,
          textShadow: '0 2px 4px rgba(0,0,0,0.9), 0 0 24px rgba(0,0,0,0.6)',
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  ) : null;

export const GenericShot: React.FC<{src: string; kind: ClipKind; caption: string}> = ({src, kind, caption}) => (
  <AbsoluteFill style={{backgroundColor: '#000'}}>
    {kind === 'videos' ? <StockVideo src={src} /> : <KenBurnsPhoto src={src} />}
    <Grade />
    <Caption text={caption} />
  </AbsoluteFill>
);
