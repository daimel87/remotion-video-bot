import {AbsoluteFill, Img, useCurrentFrame, useVideoConfig, spring, interpolate, staticFile} from 'remotion';

interface RevealLayer {
  clipY: [number, number];
  delay: number;
  label?: string;
}

export const ProgressiveReveal: React.FC<{
  imageSrc: string;
  layers: RevealLayer[];
  title?: string;
}> = ({imageSrc, layers, title}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();

  const bgReveal = spring({frame, fps, delay: 0, config: {damping: 200, stiffness: 100}});

  const exit = interpolate(frame, [durationInFrames - 15, durationInFrames], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{backgroundColor: '#f5e6c8', opacity: exit}}>
      {layers.map((layer, i) => {
        const enter = spring({
          frame,
          fps,
          delay: layer.delay,
          config: {damping: 12, stiffness: 80, mass: 0.9},
        });

        const scaleVal = interpolate(enter, [0, 0.5, 1], [0.85, 1.03, 1]);
        const yOffset = interpolate(enter, [0, 1], [30, 0]);

        return (
          <AbsoluteFill
            key={i}
            style={{
              opacity: enter,
              transform: `translateY(${yOffset}px) scale(${scaleVal})`,
            }}
          >
            <Img
              src={imageSrc}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                clipPath: `inset(${layer.clipY[0]}% 0 ${layer.clipY[1]}% 0)`,
              }}
            />
          </AbsoluteFill>
        );
      })}

      {title && (() => {
        const titleDelay = layers.length > 0 ? layers[layers.length - 1].delay + 8 : 0;
        const titleEnter = spring({
          frame,
          fps,
          delay: titleDelay,
          config: {damping: 14, stiffness: 120, mass: 0.7},
        });
        const titleY = interpolate(titleEnter, [0, 1], [-40, 0]);

        return (
          <div
            style={{
              position: 'absolute',
              top: 30,
              left: 0,
              right: 0,
              textAlign: 'center',
              opacity: titleEnter,
              transform: `translateY(${titleY}px)`,
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontWeight: 900,
              fontSize: 72,
              color: '#1a1a1a',
              textShadow: '2px 2px 0 rgba(0,0,0,0.1)',
              letterSpacing: 3,
            }}
          >
            {title}
          </div>
        );
      })()}
    </AbsoluteFill>
  );
};
