import {AbsoluteFill, useVideoConfig, spring, interpolate} from 'remotion';
import {useEffect, useState} from 'react';

export const InfidelityTitleCard: React.FC = () => {
  const {fps} = useVideoConfig();
  const frame = 0;

  const words = [
    {text: '15', color: '#FFF'},
    {text: 'SEÑALES', color: '#FFF'},
    {text: 'QUE', color: '#FFF'},
    {text: 'NUNCA', color: '#FFD700'},
    {text: 'MIENTEN', color: '#FF4444'},
  ];

  const wordDuration = 20;
  const totalWords = words.length;
  const staggerDelay = 8;

  return (
    <AbsoluteFill style={{backgroundColor: '#000', overflow: 'hidden'}}>
      {/* Fondo dinámico animado */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #1a0000 0%, #660000 50%, #1a0000 100%)',
          animation: 'gradientShift 8s ease-in-out infinite',
        }}
      />

      {/* Partículas/efectos */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background:
            'radial-gradient(circle at 20% 50%, rgba(255,0,0,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255,215,0,0.1) 0%, transparent 50%)',
          animation: 'pulse 4s ease-in-out infinite',
        }}
      />

      {/* Texto principal */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          padding: '40px',
          gap: '20px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '20px',
            fontSize: '120px',
            fontWeight: 'bold',
            lineHeight: '1.2',
            fontFamily: 'Arial, sans-serif',
            letterSpacing: '2px',
          }}
        >
          {words.map((word, index) => {
            const startFrame = index * staggerDelay;
            const progress = Math.max(0, Math.min(1, (frame - startFrame) / wordDuration));

            return (
              <div
                key={index}
                style={{
                  color: word.color,
                  opacity: progress,
                  transform: `scale(${0.8 + progress * 0.2})`,
                  transition: 'none',
                }}
              >
                {word.text}
              </div>
            );
          })}
        </div>
      </div>

      {/* Línea decorativa inferior */}
      <div
        style={{
          position: 'absolute',
          bottom: '15%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '400px',
          height: '4px',
          background: 'linear-gradient(90deg, transparent, #FFD700, #FF4444, #FFD700, transparent)',
          borderRadius: '2px',
          boxShadow: '0 0 20px rgba(255, 215, 0, 0.5)',
        }}
      />

      <style>{`
        @keyframes gradientShift {
          0%, 100% {
            background: linear-gradient(135deg, #1a0000 0%, #660000 50%, #1a0000 100%);
          }
          50% {
            background: linear-gradient(135deg, #330000 0%, #990000 50%, #330000 100%);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
      `}</style>
    </AbsoluteFill>
  );
};
