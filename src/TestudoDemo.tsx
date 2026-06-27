import {AbsoluteFill, Img, useCurrentFrame, useVideoConfig, spring, interpolate, staticFile} from 'remotion';

const IMG_SRC = staticFile('assets/Simple_cartoon_illustration_on_solid_202606271610.jpeg');

const LAYERS = [
  {clipTop: 55, clipBottom: 0, delay: 0, label: 'soldados'},
  {clipTop: 28, clipBottom: 45, delay: 15, label: 'escudos'},
  {clipTop: 12, clipBottom: 65, delay: 30, label: 'flechas'},
  {clipTop: 0, clipBottom: 88, delay: 45, label: 'titulo'},
];

export const TestudoDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();

  const exit = interpolate(frame, [durationInFrames - 15, durationInFrames], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{backgroundColor: '#f5e6c8', opacity: exit}}>
      {LAYERS.map((layer, i) => {
        const enter = spring({
          frame,
          fps,
          delay: layer.delay,
          config: {damping: 13, stiffness: 90, mass: 0.8},
        });

        const scaleVal = interpolate(enter, [0, 0.4, 1], [0.8, 1.04, 1]);
        const yOffset = interpolate(enter, [0, 1], [40, 0]);

        return (
          <AbsoluteFill
            key={i}
            style={{
              opacity: enter,
              transform: `translateY(${yOffset}px) scale(${scaleVal})`,
            }}
          >
            <Img
              src={IMG_SRC}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                clipPath: `inset(${layer.clipTop}% 0 ${layer.clipBottom}% 0)`,
              }}
            />
          </AbsoluteFill>
        );
      })}
    </AbsoluteFill>
  );
};
