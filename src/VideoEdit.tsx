import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {CaptionBox} from './components/CaptionBox';
import {ExplainerGraphic} from './components/ExplainerGraphic';
import {ZincIcon, SunIcon} from './components/icons';

const captions: {from: number; durationInFrames: number; text: string}[] = [
  {from: 0, durationInFrames: 125, text: 'Sé que puede parecer mucha información de golpe...'},
  {from: 125, durationInFrames: 75, text: 'Pero quiero que sepas algo.'},
  {
    from: 200,
    durationInFrames: 150,
    text: 'He visto con mis propios ojos cómo hombres de 50, 60 e incluso 70 años recuperan vitalidad',
  },
  {
    from: 350,
    durationInFrames: 125,
    text: 'energía y calidad de vida, cuidando su nutrición de forma inteligente.',
  },
  {
    from: 475,
    durationInFrames: 125,
    text: 'No importa tu edad ni cuánto tiempo llevas sintiéndote así.',
  },
  {
    from: 600,
    durationInFrames: 150,
    text: 'Tu cuerpo tiene una capacidad increíble de responder cuando le das lo que necesita.',
  },
  {
    from: 750,
    durationInFrames: 125,
    text: 'No tienes que implementar los 7 suplementos de golpe.',
  },
  {
    from: 875,
    durationInFrames: 125,
    text: 'Empieza con uno o dos, observa cómo te sientes y ve ajustando.',
  },
  {from: 1000, durationInFrames: 100, text: 'Esto es un camino, no una carrera.'},
  {
    from: 1100,
    durationInFrames: 150,
    text: 'Cada paso en la dirección correcta es un paso hacia una mejor versión de ti mismo.',
  },
  {from: 1250, durationInFrames: 50, text: 'Entonces, recapitulando rápidamente...'},
];

export const VideoEdit: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <OffthreadVideo src={staticFile('input.mp4')} />

      {captions.map((c) => (
        <Sequence key={c.text} from={c.from} durationInFrames={c.durationInFrames}>
          <CaptionBox text={c.text} />
        </Sequence>
      ))}

      <Sequence from={1300} durationInFrames={100}>
        <ExplainerGraphic
          icon={<ZincIcon size={56} />}
          from="Zinc"
          to="Testosterona + sistema inmune"
          caption="1. Zinc: clave para los niveles de testosterona y la defensa del organismo"
        />
      </Sequence>

      <Sequence from={1400} durationInFrames={100}>
        <ExplainerGraphic
          icon={<SunIcon size={56} />}
          from="Vitamina D"
          to="Fuerza + estado de ánimo"
          caption="2. Vitamina D: fortalece músculos y huesos, y mejora el estado de ánimo"
        />
      </Sequence>
    </AbsoluteFill>
  );
};
