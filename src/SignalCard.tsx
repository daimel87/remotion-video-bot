import {AbsoluteFill, useCurrentFrame} from 'remotion';

interface SignalCardProps {
  number: number;
  title: string;
  description: string;
}

export const SignalCard: React.FC<SignalCardProps> = ({number, title, description}) => {
  const frame = useCurrentFrame();

  // Animated text reveal for title (first 60 frames)
  const titleProgress = Math.max(0, Math.min(1, frame / 60));

  // Animated text reveal for description (starts at frame 40, duration 80 frames)
  const descProgress = Math.max(0, Math.min(1, (frame - 40) / 80));

  // Animated text reveal for number (frame 0-40)
  const numberProgress = Math.max(0, Math.min(1, frame / 40));

  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      {/* Fondo gradiente profesional */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0a1a 50%, #0a0a0a 100%)',
        }}
      />

      {/* Contenido */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '80px 60px',
          textAlign: 'center',
          gap: '40px',
        }}
      >
        {/* Número de señal */}
        <div
          style={{
            fontSize: '140px',
            fontWeight: 'bold',
            color: '#FFD700',
            fontFamily: 'Arial, sans-serif',
            letterSpacing: '2px',
            opacity: numberProgress,
            transform: `scale(${0.7 + numberProgress * 0.3}) translateY(${(1 - numberProgress) * 40}px)`,
          }}
        >
          SEÑAL {number}
        </div>

        {/* Línea decorativa */}
        <div
          style={{
            width: '400px',
            height: '3px',
            background: 'linear-gradient(90deg, transparent, #FFD700, #FF6B6B, #FFD700, transparent)',
            borderRadius: '2px',
            boxShadow: '0 0 20px rgba(255, 215, 0, 0.4)',
            opacity: numberProgress,
          }}
        />

        {/* Título principal */}
        <div
          style={{
            fontSize: '100px',
            fontWeight: 'bold',
            lineHeight: '1.2',
            fontFamily: 'Arial, sans-serif',
            letterSpacing: '1px',
            maxWidth: '1600px',
            color: '#FFFFFF',
            opacity: titleProgress,
            transform: `translateY(${(1 - titleProgress) * 30}px)`,
          }}
        >
          {title}
        </div>

        {/* Descripción / contexto */}
        <div
          style={{
            fontSize: '48px',
            color: '#AAAAAA',
            fontFamily: 'Arial, sans-serif',
            lineHeight: '1.4',
            maxWidth: '1400px',
            opacity: descProgress,
            transform: `translateY(${(1 - descProgress) * 20}px)`,
          }}
        >
          {description}
        </div>
      </div>
    </AbsoluteFill>
  );
};
