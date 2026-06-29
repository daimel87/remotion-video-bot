import {AbsoluteFill, useCurrentFrame} from 'remotion';

export const InfidelityTitleCard: React.FC = () => {
  const frame = useCurrentFrame();

  const words = [
    {text: '15', color: '#FFF'},
    {text: 'SEÑALES', color: '#FFF'},
    {text: 'QUE', color: '#FFF'},
    {text: 'NUNCA', color: '#FFD700'},
    {text: 'MIENTEN', color: '#FF4444'},
  ];

  const wordDuration = 20;
  const staggerDelay = 8;

  return (
    <AbsoluteFill style={{backgroundColor: '#001a4d', overflow: 'hidden'}}>
      {/* Fondo azul con gradiente */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #001a4d 0%, #003d99 50%, #001a4d 100%)',
          animation: 'gradientShift 8s ease-in-out infinite',
        }}
      />

      {/* Efectos de partículas */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background:
            'radial-gradient(circle at 20% 50%, rgba(0,100,255,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255,215,0,0.1) 0%, transparent 50%)',
          animation: 'pulse 4s ease-in-out infinite',
        }}
      />

      {/* Texto principal - MUCHO MÁS GRANDE */}
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
          padding: '60px',
          gap: '30px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '30px',
            fontSize: '180px',
            fontWeight: 'bold',
            lineHeight: '0.95',
            fontFamily: 'Arial, sans-serif',
            letterSpacing: '3px',
            textTransform: 'uppercase',
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
                  transform: `scale(${0.7 + progress * 0.3}) translateY(${(1 - progress) * 30}px)`,
                  transition: 'none',
                }}
              >
                {word.text}
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes gradientShift {
          0%, 100% {
            background: linear-gradient(135deg, #001a4d 0%, #003d99 50%, #001a4d 100%);
          }
          50% {
            background: linear-gradient(135deg, #0033cc 0%, #0052cc 50%, #0033cc 100%);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }
      `}</style>
    </AbsoluteFill>
  );
};
