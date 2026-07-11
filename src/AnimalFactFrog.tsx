import {AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {FactText} from './components/FactText';

const FACT =
  "This tiny golden frog carries enough poison to kill **10 grown men** — and it doesn't even have to bite you. Just touching its skin with a **cut or scratch** can be lethal. Local tribes rub the tips of their **blow darts** directly on its back before hunting. The toxin stays deadly for **years**, even after the frog dies. Strangest part? In captivity, away from its jungle diet, this same frog is **completely harmless**.";

const HOOK_FRAMES = 17;

export const AnimalFactFrog: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <Sequence from={0} durationInFrames={HOOK_FRAMES}>
        <AbsoluteFill style={{backgroundColor: '#000'}}>
          <OffthreadVideo src={staticFile('skull-arrow-hook.mp4')} muted />
        </AbsoluteFill>
      </Sequence>

      <Sequence from={HOOK_FRAMES}>
        <AbsoluteFill style={{backgroundColor: '#000'}}>
          <OffthreadVideo src={staticFile('frog-fact-test.mp4')} />

          <FactText text={FACT} />

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
      </Sequence>
    </AbsoluteFill>
  );
};
