import React from 'react';
import {AbsoluteFill, Img, interpolate, useCurrentFrame, useVideoConfig, Sequence, staticFile} from 'remotion';

interface ActorPair {
  number: number;
}

const ActorTransition: React.FC<ActorPair> = ({number}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const duration = 100; // frames per actor
  const fadeInDuration = 10;
  const fadeDuration = 10;
  const holdDuration = duration - fadeInDuration - fadeDuration;

  // Calculate local frame within this actor's duration
  const progress = frame % duration;

  // Opacity animation
  const opacity = interpolate(
    progress,
    [0, fadeInDuration, holdDuration, duration],
    [0, 1, 1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );

  // Slight zoom in effect
  const scale = interpolate(
    progress,
    [0, fadeInDuration, holdDuration, duration],
    [0.95, 1, 1, 0.95],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );

  const paddedNum = String(number).padStart(2, '0');
  const thenPath = staticFile(`images/then-now/actor-${paddedNum}-then.jpg`);
  const nowPath = staticFile(`images/then-now/actor-${paddedNum}-now.jpg`);

  return (
    <AbsoluteFill style={{opacity, transform: `scale(${scale})`}}>
      {/* Then - Left side */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '50%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#000',
          overflow: 'hidden',
        }}
      >
        <Img
          src={thenPath}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 20,
            left: 0,
            right: '50%',
            textAlign: 'center',
            color: 'white',
            fontSize: 24,
            fontWeight: 'bold',
            textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
          }}
        >
          THEN
        </div>
      </div>

      {/* Now - Right side */}
      <div
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          width: '50%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#000',
          overflow: 'hidden',
        }}
      >
        <Img
          src={nowPath}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 20,
            right: 0,
            left: '50%',
            textAlign: 'center',
            color: 'white',
            fontSize: 24,
            fontWeight: 'bold',
            textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
          }}
        >
          NOW
        </div>
      </div>

      {/* Center divider */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 0,
          width: 4,
          height: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
          transform: 'translateX(-50%)',
        }}
      />
    </AbsoluteFill>
  );
};

export const ThenNowEdit: React.FC = () => {
  const numActors = 30;
  const framesPerActor = 100;
  const totalFrames = numActors * framesPerActor;

  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      {Array.from({length: numActors}, (_, i) => (
        <Sequence
          key={i}
          from={i * framesPerActor}
          durationInFrames={framesPerActor}
        >
          <ActorTransition number={i + 1} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
