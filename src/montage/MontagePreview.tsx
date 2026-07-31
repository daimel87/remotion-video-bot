// Preview de 30s que combina los dos skills recien instalados:
//  - remotion-motion-graphics: Ken Burns, grade, grano, vineta, reveal de
//    texto por palabra, entradas con spring, transiciones de @remotion/transitions.
//  - remotion-scenes: TextMaskReveal y TextKinetic (librerio de 201 escenas)
//    reusados tal cual para el card de apertura y el card de golpe.
// Material: fotos ya descargadas del Bloque 1 de Odisea (public/stock-odisea).
import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {slide} from '@remotion/transitions/slide';
import {fade} from '@remotion/transitions/fade';
import {ImageShot} from './components';
import {HeroCard, PunchCard, ChapterCard, ClosingCard} from './cards';

export const FPS = 30;
export const DURATION = 900; // 30s

const PH = (name: string) => `stock-odisea/photos/${name}`;

export const MontagePreview: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      {/* 0-90 (3.0s): card de apertura */}
      <Sequence from={0} durationInFrames={90}>
        <HeroCard />
      </Sequence>

      {/* 90-210 (4.0s): primera imagen, corte seco */}
      <Sequence from={90} durationInFrames={120}>
        <ImageShot
          src={PH('b1-turkey-landscape-2.jpg')}
          caption="Empezamos donde termina la guerra de Troya."
          direction="in"
          pan="right"
        />
      </Sequence>

      {/* 210-438: dos imagenes unidas con transicion slide (12f) */}
      <Sequence from={210} durationInFrames={228}>
        <TransitionSeries>
          <TransitionSeries.Sequence durationInFrames={120}>
            <ImageShot
              src={PH('b1-ancient-greek-ruins-3.jpg')}
              caption="Diez anios. Un viaje que se volvio leyenda."
              direction="out"
            />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition
            presentation={slide({direction: 'from-right'})}
            timing={linearTiming({durationInFrames: 12})}
          />
          <TransitionSeries.Sequence durationInFrames={120}>
            <ImageShot
              src={PH('b1-greek-gods-art-3.jpg')}
              caption="Los dioses intervienen en cada paso del camino."
              direction="in"
              pan="left"
            />
          </TransitionSeries.Sequence>
        </TransitionSeries>
      </Sequence>

      {/* 438-498 (2.0s): stinger de golpe, corte seco */}
      <Sequence from={438} durationInFrames={60}>
        <PunchCard word="Odiseo" eyebrow="El protagonista" />
      </Sequence>

      {/* 498-618 (4.0s): imagen, corte seco */}
      <Sequence from={498} durationInFrames={120}>
        <ImageShot
          src={PH('b1-blind-poet-art-2.jpg')}
          caption="La tradicion dice que un poeta ciego la conto primero: Homero."
          direction="in"
          pan="right"
        />
      </Sequence>

      {/* 618-828: card de capitulo + imagen, unidos con fundido (10f) */}
      <Sequence from={618} durationInFrames={210}>
        <TransitionSeries>
          <TransitionSeries.Sequence durationInFrames={110}>
            <ChapterCard num="01" title="El viaje" sub="Diez anios de regreso a casa" />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition
            presentation={fade()}
            timing={linearTiming({durationInFrames: 10})}
          />
          <TransitionSeries.Sequence durationInFrames={110}>
            <ImageShot
              src={PH('b1-old-book-candle-3.jpg')}
              caption="Miles de anios despues, seguimos abriendo el libro."
              direction="out"
            />
          </TransitionSeries.Sequence>
        </TransitionSeries>
      </Sequence>

      {/* 828-900 (2.4s): cierre */}
      <Sequence from={828} durationInFrames={72}>
        <ClosingCard />
      </Sequence>
    </AbsoluteFill>
  );
};
