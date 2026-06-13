import {AbsoluteFill, useCurrentFrame, interpolate} from 'remotion';

export const MyComposition: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0b0b0b',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <h1
        style={{
          color: 'white',
          fontFamily: 'sans-serif',
          fontSize: 80,
          opacity,
        }}
      >
        Hola desde Remotion!
      </h1>
    </AbsoluteFill>
  );
};
