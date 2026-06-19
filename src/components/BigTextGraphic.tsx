import {AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate} from 'remotion';
import {TechGrid} from './TechGrid';

export const BigTextGraphic: React.FC<{text: string; highlight?: string}> = ({text, highlight}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames, width} = useVideoConfig();
  const scale = width / 1920;

  const exit = interpolate(frame, [durationInFrames - 12, durationInFrames], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const words = text.split(/\s+/);
  const highlightWords = highlight ? highlight.split(/\s+/) : [];

  const glowLine = spring({frame, fps, delay: 8, config: {damping: 200, stiffness: 100}});

  const glowPulse = Math.sin(frame * 0.15) * 0.3 + 0.7;

  return (
    <AbsoluteFill style={{opacity: exit}}>
      <TechGrid />
      {/* Glow line at bottom */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 3 * scale,
          background: 'linear-gradient(90deg, transparent, #9be1ff, transparent)',
          transform: `scaleX(${glowLine})`,
          opacity: glowLine,
        }}
      />
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: 80 * scale}}>
        <div
          style={{
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 800,
            fontSize: 64 * scale,
            lineHeight: 1.3,
            color: '#ffffff',
            textAlign: 'center',
            maxWidth: 1500 * scale,
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: `0px ${12 * scale}px`,
          }}
        >
          {words.map((word, i) => {
            const wordDelay = i * 2;
            const wordEnter = spring({frame, fps, delay: wordDelay, config: {damping: 12, stiffness: 120, mass: 0.8}});
            const wordY = interpolate(wordEnter, [0, 1], [50, 0]) * scale;
            const wordScale = interpolate(wordEnter, [0, 0.5, 1], [0.7, 1.05, 1]);

            const isHighlight = highlightWords.includes(word) || (highlight && text.indexOf(highlight) !== -1 && (() => {
              const hStart = text.indexOf(highlight);
              const hEnd = hStart + highlight.length;
              let pos = 0;
              for (let j = 0; j < i; j++) {
                pos = text.indexOf(words[j], pos) + words[j].length;
              }
              const wordStart = text.indexOf(word, pos > 0 ? pos : 0);
              return wordStart >= hStart && wordStart + word.length <= hEnd;
            })());

            const highlightReveal = isHighlight
              ? spring({frame, fps, delay: Math.max(wordDelay + 4, words.length * 2), config: {damping: 200, stiffness: 80}})
              : 0;

            const wordColor = isHighlight
              ? `rgb(${Math.round(255 - (255 - 155) * highlightReveal)}, ${Math.round(255 - (255 - 225) * highlightReveal)}, 255)`
              : '#ffffff';

            const wordGlow = isHighlight && highlightReveal > 0.5
              ? `0 0 ${20 * glowPulse * scale}px rgba(155,225,255,${0.8 * highlightReveal}), 0 0 ${50 * glowPulse * scale}px rgba(155,225,255,${0.3 * highlightReveal})`
              : 'none';

            return (
              <span
                key={i}
                style={{
                  display: 'inline-block',
                  opacity: wordEnter,
                  transform: `translateY(${wordY}px) scale(${wordScale})`,
                  color: wordColor,
                  textShadow: wordGlow,
                  whiteSpace: 'pre',
                }}
              >
                {word}
              </span>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
