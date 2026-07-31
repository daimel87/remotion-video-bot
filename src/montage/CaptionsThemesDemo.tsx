// Demo para elegir un tema de remotion-captions-themes. Cada plano usa un
// theme distinto sobre una imagen real de Odisea, con timing por palabra
// ESTIMADO (ver captionTiming.ts) -- solo para comparar looks, no es el
// timing final.
import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {CaptionTheme, type ThemeName} from 'remotion-captions-themes';
import {KenBurns, Grade, Vignette, Grain} from '../odisea/components';
import {estimateCaptionsData} from '../odisea/captionTiming';
import {theme} from '../theme';

export const FPS = 30;
const SHOT_SEC = 4;

const SHOTS: Array<{img: string; text: string; captionTheme: ThemeName}> = [
  {
    img: 'stock-odisea/photos/b1-turkey-landscape-2.jpg',
    text: 'Empezamos donde termina la guerra de Troya',
    captionTheme: 'karaoke',
  },
  {
    img: 'stock-odisea/photos/b1-ancient-greek-ruins-3.jpg',
    text: 'Diez anios. Un viaje que se volvio leyenda',
    captionTheme: 'kinetic-01',
  },
  {
    img: 'stock-odisea/photos/b1-old-book-candle-3.jpg',
    text: 'Miles de anios despues seguimos abriendo el libro',
    captionTheme: 'soft-ai',
  },
  {
    img: 'stock-odisea/photos/b1-blind-poet-art-2.jpg',
    text: 'Un poeta ciego la conto primero Homero',
    captionTheme: 'beast',
  },
  {
    img: 'stock-odisea/photos/b1-turkey-landscape-4.jpg',
    text: 'Ni Nueva York ni Londres',
    captionTheme: 'gaming-stream',
  },
  {
    img: 'stock-odisea/photos/b1-ancient-greek-ruins-1.jpg',
    text: 'La odisea aun no termina de contarse',
    captionTheme: 'simple-one-word',
  },
];

export const DURATION = SHOTS.length * SHOT_SEC * FPS;

const Label: React.FC<{text: string}> = ({text}) => (
  <div
    style={{
      position: 'absolute',
      top: 32,
      left: 32,
      fontFamily: theme.fonts.body,
      fontSize: 22,
      letterSpacing: 3,
      textTransform: 'uppercase',
      color: theme.colors.primary,
      background: 'rgba(0,0,0,0.5)',
      padding: '8px 16px',
      borderRadius: 6,
    }}
  >
    {text}
  </div>
);

export const CaptionsThemesDemo: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      {SHOTS.map((shot, i) => {
        const data = estimateCaptionsData(shot.text, SHOT_SEC - 0.4);
        return (
          <Sequence key={i} from={i * SHOT_SEC * FPS} durationInFrames={SHOT_SEC * FPS}>
            <AbsoluteFill>
              <KenBurns src={shot.img} direction={i % 2 === 0 ? 'in' : 'out'} />
              <Grade />
              <Label text={shot.captionTheme} />
              <AbsoluteFill style={{top: '62%', height: '34%'}}>
                <CaptionTheme data={data} theme={shot.captionTheme} fontSize={64} />
              </AbsoluteFill>
              <Vignette />
              <Grain />
            </AbsoluteFill>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
