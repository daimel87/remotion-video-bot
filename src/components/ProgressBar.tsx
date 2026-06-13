import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';

export const ProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const progress = (frame / (durationInFrames - 1)) * 100;

  return (
    <AbsoluteFill style={{justifyContent: 'flex-end'}}>
      <div style={{height: 6, width: '100%', background: 'rgba(255,255,255,0.15)'}}>
        <div
          style={{
            height: '100%',
            width: `${progress}%`,
            background: '#9be15d',
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
