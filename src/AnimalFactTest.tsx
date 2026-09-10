import {AbsoluteFill, Img, OffthreadVideo, staticFile} from 'remotion';
import {FactText} from './components/FactText';

const FACT =
  'The mantis shrimp has the **fastest strike** in the entire animal kingdom: its claw moves as fast as a **.22 caliber bullet**, generating so much pressure it actually **boils the water** around it. When that bubble collapses, it releases a flash of light and reaches nearly **8,500°F** — almost as hot as the **surface of the Sun**. It doesn’t even need to touch its prey: the shockwave alone can **crack open shells and shatter aquarium glass**.';

export const AnimalFactTest: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <OffthreadVideo src={staticFile('mantis-fact-test.mp4')} />

      <FactText text={FACT} />

      {/* Reactor en recuadro tipo "cámara de reacción", centrado abajo */}
      <div
        style={{
          position: 'absolute',
          bottom: 30,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 340,
          height: 340,
          borderRadius: 20,
          overflow: 'hidden',
          border: '3px solid rgba(255,255,255,0.85)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
        }}
      >
        <OffthreadVideo
          src={staticFile('fox-reaction-test.mp4')}
          muted
          style={{width: '100%', height: '100%', objectFit: 'cover'}}
        />
      </div>

      <Img
        src={staticFile('assets/pngtree-like-button-for-youtube-vector-png-image_16285919.png')}
        style={{
          position: 'absolute',
          bottom: -50,
          right: -10,
          width: 190,
        }}
      />
    </AbsoluteFill>
  );
};
