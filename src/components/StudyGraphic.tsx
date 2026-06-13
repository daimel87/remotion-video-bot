import {AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate} from 'remotion';
import {TechGrid} from './TechGrid';
import {MagnifierIcon} from './icons';

export const StudyGraphic: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();

  const paperEnter = spring({frame, fps, config: {damping: 200, stiffness: 140}});
  const captionEnter = spring({frame: Math.max(0, frame - 35), fps, config: {damping: 200, stiffness: 150}});

  const exit = interpolate(frame, [durationInFrames - 10, durationInFrames], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{opacity: exit}}>
      <TechGrid />
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
        <div
          style={{
            opacity: paperEnter,
            transform: `translateY(${interpolate(paperEnter, [0, 1], [40, 0])}px) scale(${interpolate(paperEnter, [0, 1], [0.85, 1])})`,
            background: 'rgba(255, 255, 255, 0.97)',
            borderRadius: 12,
            width: 620,
            padding: '36px 44px',
            boxShadow: '0 0 50px rgba(91, 140, 255, 0.55)',
            border: '1px solid rgba(91, 140, 255, 0.6)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontWeight: 700,
              fontSize: 14,
              color: '#5b8cff',
              textTransform: 'uppercase',
              letterSpacing: 1,
              marginBottom: 14,
            }}
          >
            <MagnifierIcon size={20} />
            Estudio científico · IATREIA 2010
          </div>
          <div
            style={{
              fontFamily: 'Georgia, serif',
              fontWeight: 700,
              fontSize: 28,
              color: '#111',
              lineHeight: 1.3,
              marginBottom: 14,
            }}
          >
            Relación entre la dieta y el desarrollo de la hiperplasia prostática benigna
          </div>
          <div
            style={{
              fontFamily: 'Georgia, serif',
              fontSize: 17,
              color: '#333',
              lineHeight: 1.5,
            }}
          >
            Entre los compuestos demostrados como benéficos para la salud prostática están los{' '}
            <b>licopenos</b>, los <b>fitoestrógenos</b> y las <b>verduras</b>.
          </div>
        </div>

        <div
          style={{
            marginTop: 44,
            opacity: captionEnter,
            transform: `translateY(${interpolate(captionEnter, [0, 1], [20, 0])}px)`,
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 600,
            fontSize: 28,
            color: '#9be1ff',
            textAlign: 'center',
            maxWidth: 900,
          }}
        >
          La evidencia científica vincula directamente estos alimentos con la salud de tu próstata
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
