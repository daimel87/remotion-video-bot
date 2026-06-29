import {AbsoluteFill, useCurrentFrame, interpolate} from 'remotion';

export const InfidelityCierreCard: React.FC = () => {
  const frame = useCurrentFrame();

  // Text reveal animations
  const titleProgress = Math.max(0, Math.min(1, frame / 50));
  const subtitleProgress = Math.max(0, Math.min(1, (frame - 30) / 50));
  const ctaProgress = Math.max(0, Math.min(1, (frame - 60) / 50));
  const finalOpacity = interpolate(frame, [450, 500], [1, 0], {extrapolateRight: 'clamp'});

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
          opacity: finalOpacity,
        }}
      >
        {/* Título principal */}
        <div
          style={{
            fontSize: '120px',
            fontWeight: 'bold',
            lineHeight: '1.2',
            fontFamily: 'Arial, sans-serif',
            letterSpacing: '2px',
            maxWidth: '1600px',
            color: '#FFD700',
            opacity: titleProgress,
            transform: `scale(${0.7 + titleProgress * 0.3}) translateY(${(1 - titleProgress) * 40}px)`,
          }}
        >
          AHORA SABES LA VERDAD
        </div>

        {/* Subtítulo */}
        <div
          style={{
            fontSize: '72px',
            color: '#FFFFFF',
            fontFamily: 'Arial, sans-serif',
            lineHeight: '1.3',
            maxWidth: '1400px',
            opacity: subtitleProgress,
            transform: `translateY(${(1 - subtitleProgress) * 30}px)`,
          }}
        >
          15 SEÑALES QUE NUNCA MIENTEN
        </div>

        {/* Línea decorativa */}
        <div
          style={{
            width: '400px',
            height: '3px',
            background: 'linear-gradient(90deg, transparent, #FFD700, #FF6B6B, #FFD700, transparent)',
            borderRadius: '2px',
            boxShadow: '0 0 20px rgba(255, 215, 0, 0.4)',
            opacity: subtitleProgress,
          }}
        />

        {/* CTA */}
        <div
          style={{
            fontSize: '56px',
            color: '#FF6B6B',
            fontWeight: 'bold',
            fontFamily: 'Arial, sans-serif',
            lineHeight: '1.4',
            maxWidth: '1400px',
            opacity: ctaProgress,
            transform: `translateY(${(1 - ctaProgress) * 20}px)`,
          }}
        >
          ¿RECONOCISTE ALGUNA DE ESTAS SEÑALES?
          <br />
          <span style={{fontSize: '48px', color: '#AAAAAA', marginTop: '20px'}}>
            Suscríbete para más análisis de relaciones y psicología
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
