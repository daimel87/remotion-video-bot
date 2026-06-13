import React from 'react';
import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {CaptionBox} from './components/CaptionBox';
import {ExplainerGraphic} from './components/ExplainerGraphic';
import {RecapGraphic} from './components/RecapGraphic';
import {BrainIcon, EnergyIcon, HeartIcon, StepsIcon, RouteIcon} from './components/icons';

const BLOCK = 250; // 10s at 25fps
const VIDEO_PART = 175; // 7s of talking head with caption
const GRAPHIC_PART = BLOCK - VIDEO_PART; // 3s explainer cutaway

const blocks: {caption: string; graphic: React.ReactNode}[] = [
  {
    caption: 'Sé que parece mucha información de golpe...',
    graphic: (
      <ExplainerGraphic
        icon={<BrainIcon size={56} />}
        from="Mucha información"
        to="Empieza simple"
        caption="No te abrumes: un paso a la vez"
      />
    ),
  },
  {
    caption: 'Hombres de 50, 60 y 70 años recuperan vitalidad y energía',
    graphic: (
      <ExplainerGraphic
        icon={<EnergyIcon size={56} />}
        from="Nutrición inteligente"
        to="Vitalidad y energía"
        caption="El cambio es posible a cualquier edad"
      />
    ),
  },
  {
    caption: 'Tu cuerpo responde cuando le das lo que necesita',
    graphic: (
      <ExplainerGraphic
        icon={<HeartIcon size={56} />}
        from="Lo que necesitas"
        to="Tu cuerpo responde"
        caption="Una capacidad de adaptación increíble"
      />
    ),
  },
  {
    caption: 'No implementes los 7 suplementos de golpe',
    graphic: (
      <ExplainerGraphic
        icon={<StepsIcon size={56} />}
        from="1 o 2 suplementos"
        to="Observa y ajusta"
        caption="Empieza poco a poco, sin abrumarte"
      />
    ),
  },
  {
    caption: 'Esto es un camino, no una carrera',
    graphic: (
      <ExplainerGraphic
        icon={<RouteIcon size={56} />}
        from="Cada paso cuenta"
        to="Mejor versión de ti"
        caption="El progreso constante es lo que importa"
      />
    ),
  },
  {
    caption: 'Recapitulando rápidamente...',
    graphic: <RecapGraphic />,
  },
];

export const VideoEdit: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <OffthreadVideo src={staticFile('input.mp4')} />

      {blocks.map((block, i) => {
        const blockStart = i * BLOCK;
        return (
          <React.Fragment key={i}>
            <Sequence from={blockStart + 20} durationInFrames={110}>
              <CaptionBox text={block.caption} />
            </Sequence>
            <Sequence from={blockStart + VIDEO_PART} durationInFrames={GRAPHIC_PART}>
              {block.graphic}
            </Sequence>
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};
