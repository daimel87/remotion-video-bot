import React from 'react';
import {AbsoluteFill, Img, interpolate, useCurrentFrame, useVideoConfig, Sequence, staticFile} from 'remotion';
import {getActorData} from './data/actorsData';

interface ActorPair {
  number: number;
}

const ActorTransition: React.FC<ActorPair> = ({number}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const duration = 300; // 10 seconds at 30fps
  const panDuration = 150; // 5 seconds of pan
  const staticDuration = 150; // 5 seconds static

  // Calculate local frame within this actor's duration
  const progress = frame % duration;

  // Pan animation: 0-150 frames (5 seconds)
  // Then static: 150-300 frames (5 seconds)
  const panProgress = Math.min(progress / panDuration, 1);

  // Left image pans right (0px to 100px)
  const leftPanX = interpolate(
    panProgress,
    [0, 1],
    [0, 100],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );

  // Right image pans left (0px to -100px)
  const rightPanX = interpolate(
    panProgress,
    [0, 1],
    [0, -100],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );

  // Opacity animation - fade in at start, fade out at end
  const opacity = interpolate(
    progress,
    [0, 20, duration - 20, duration],
    [0, 1, 1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );

  const paddedNum = String(number).padStart(2, '0');
  const thenPath = staticFile(`images/then-now/actor-${paddedNum}-then.jpg`);
  const nowPath = staticFile(`images/then-now/actor-${paddedNum}-now.jpg`);
  const actorData = getActorData(number);

  return (
    <AbsoluteFill style={{opacity}}>
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
        <div
          style={{
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <Img
            src={thenPath}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: `translateX(${leftPanX}px)`,
              transition: 'none',
            }}
          />
        </div>
        {/* Then - Text Box */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            padding: '20px 30px',
            borderRadius: '12px',
            textAlign: 'center',
            border: '3px solid rgba(255, 255, 255, 0.3)',
            maxWidth: '90%',
          }}
        >
          <div
            style={{
              color: 'white',
              fontSize: 48,
              fontWeight: 'bold',
              marginBottom: '10px',
              textShadow: '2px 2px 8px rgba(0,0,0,0.9)',
              lineHeight: '1.2',
            }}
          >
            {actorData?.characterName || 'Character'}
          </div>
          <div
            style={{
              color: '#FFD700',
              fontSize: 40,
              fontWeight: 'bold',
              textShadow: '2px 2px 8px rgba(0,0,0,0.9)',
            }}
          >
            Age: {actorData?.ageInSeries || '?'}
          </div>
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
        <div
          style={{
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <Img
            src={nowPath}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: `translateX(${rightPanX}px)`,
              transition: 'none',
            }}
          />
        </div>
        {/* Now - Text Box */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            padding: '20px 30px',
            borderRadius: '12px',
            textAlign: 'center',
            border: '3px solid rgba(255, 255, 255, 0.3)',
            maxWidth: '90%',
          }}
        >
          <div
            style={{
              color: 'white',
              fontSize: 48,
              fontWeight: 'bold',
              marginBottom: '10px',
              textShadow: '2px 2px 8px rgba(0,0,0,0.9)',
              lineHeight: '1.2',
            }}
          >
            {actorData?.actorName || 'Actor'}
          </div>
          <div
            style={{
              color: '#FFD700',
              fontSize: 40,
              fontWeight: 'bold',
              textShadow: '2px 2px 8px rgba(0,0,0,0.9)',
            }}
          >
            Age: {actorData?.currentAge || '?'}
          </div>
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
  const framesPerActor = 300; // 10 seconds at 30fps
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
