import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {theme, F, animIn, animOut} from './theme';

const S = 1920;

// Lower-third caption — guía la narración; respaldo legible sobre capturas.
export const Caption: React.FC<{
  text: string;
  highlight?: string;
  color?: string;
  pos?: 'bottom' | 'top';
}> = ({text, highlight, color = theme.primary, pos = 'bottom'}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames, width} = useVideoConfig();
  const s = width / S;
  const enter = animIn(frame, fps);
  const exit = animOut(frame, durationInFrames, 8);
  const ty = interpolate(enter, [0, 1], [26, 0]) * s;
  const parts = highlight ? text.split(highlight) : [text];

  return (
    <AbsoluteFill
      style={{
        justifyContent: pos === 'bottom' ? 'flex-end' : 'flex-start',
        alignItems: 'center',
        padding: pos === 'bottom' ? `0 0 ${64 * s}px` : `${150 * s}px 0 0`,
      }}
    >
      <div
        style={{
          opacity: enter * exit,
          transform: `translateY(${ty}px)`,
          maxWidth: 1250 * s,
          display: 'flex',
          alignItems: 'center',
          gap: 18 * s,
          background: theme.panel,
          backdropFilter: 'blur(8px)',
          border: `1px solid ${theme.border}`,
          borderRadius: 14 * s,
          padding: `${16 * s}px ${30 * s}px`,
          boxShadow: `${theme.shadow}, ${theme.glow('rgba(34,211,238,0.22)')}`,
        }}
      >
        <div
          style={{
            width: 6 * s,
            alignSelf: 'stretch',
            background: color,
            borderRadius: 4 * s,
            boxShadow: theme.glow(color),
          }}
        />
        <div
          style={{
            fontFamily: F.mont,
            fontWeight: 700,
            fontSize: 32 * s,
            color: theme.text,
            lineHeight: 1.3,
            textAlign: 'center',
          }}
        >
          {highlight ? (
            <>
              {parts[0]}
              <span style={{color, textShadow: theme.glow(color)}}>{highlight}</span>
              {parts[1]}
            </>
          ) : (
            text
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};
