import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {theme} from '../theme';
import {
  EditorialMinimal,
  MuseumPlacard,
  CinematicTitle,
  BroadcastLowerThird,
  GlassTag,
} from './variants';

export const FPS = 30;
const SHOT_SEC = 4.5;
const N = 5;
export const DURATION = Math.round(N * SHOT_SEC * FPS);

const Tag: React.FC<{n: number; label: string}> = ({n, label}) => (
  <div
    style={{
      position: 'absolute',
      bottom: 28,
      right: 32,
      fontFamily: theme.fonts.body,
      fontSize: 18,
      letterSpacing: 2,
      color: theme.colors.primary,
      background: 'rgba(0,0,0,0.5)',
      padding: '6px 14px',
      borderRadius: 4,
    }}
  >
    {n}. {label}
  </div>
);

export const CardLabDemo: React.FC = () => {
  const F = Math.round(SHOT_SEC * FPS);
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <Sequence from={0} durationInFrames={F}>
        <AbsoluteFill>
          <EditorialMinimal
            eyebrow="Capitulo 01"
            title="El viaje que se volvio leyenda"
            sub="Diez anios de regreso a casa, en el corazon del Mediterraneo."
          />
          <Tag n={1} label="EDITORIAL MINIMAL" />
        </AbsoluteFill>
      </Sequence>

      <Sequence from={F} durationInFrames={F}>
        <AbsoluteFill>
          <MuseumPlacard catalog="CATALOGO N.° 01" title="Odiseo" sub="El protagonista" />
          <Tag n={2} label="MUSEUM PLACARD" />
        </AbsoluteFill>
      </Sequence>

      <Sequence from={F * 2} durationInFrames={F}>
        <AbsoluteFill>
          <CinematicTitle
            img="stock-odisea/photos/b1-ancient-greek-ruins-3.jpg"
            title="La Odisea"
            sub="La historia real detras del mito"
          />
          <Tag n={3} label="CINEMATIC TITLE" />
        </AbsoluteFill>
      </Sequence>

      <Sequence from={F * 3} durationInFrames={F}>
        <AbsoluteFill>
          <BroadcastLowerThird
            img="stock-odisea/photos/b1-turkey-landscape-2.jpg"
            name="Odiseo"
            role="Rey de Itaca"
          />
          <Tag n={4} label="BROADCAST LOWER THIRD" />
        </AbsoluteFill>
      </Sequence>

      <Sequence from={F * 4} durationInFrames={F}>
        <AbsoluteFill>
          <GlassTag img="stock-odisea/photos/b1-old-book-candle-3.jpg" text="Grecia, S. VIII a.C." />
          <Tag n={5} label="GLASS TAG" />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
