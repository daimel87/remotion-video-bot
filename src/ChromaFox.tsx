import {Img, staticFile, useCurrentFrame} from 'remotion';

// Reproduce la secuencia de PNG con canal alfa real (chroma key ya aplicado)
// del zorro reaccionando. 120 frames disponibles (5s a 24fps).
const TOTAL_FRAMES = 120;

export const ChromaFox: React.FC<{style?: React.CSSProperties; startFrame?: number}> = ({
  style,
  startFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const idx = Math.min(startFrame + frame, TOTAL_FRAMES - 1);
  const padded = String(idx + 1).padStart(4, '0');

  return (
    <Img
      src={staticFile(`fox-shocked-frames/frame-${padded}.png`)}
      style={{width: '100%', height: '100%', objectFit: 'contain', ...style}}
    />
  );
};
