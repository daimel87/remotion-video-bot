import {AbsoluteFill, useCurrentFrame} from 'remotion';

export const HeartTransferCard: React.FC = () => {
  const frame = useCurrentFrame();

  // Animación de división del corazón
  const heartSplitProgress = Math.min(1, frame / 100);
  const heartOpacity = heartSplitProgress;

  // Partículas que se mueven
  const particleCount = 15;
  const particles = Array.from({length: particleCount}, (_, i) => {
    const delay = (i / particleCount) * 100;
    const progress = Math.max(0, Math.min(1, (frame - delay) / 150));
    const angle = (i / particleCount) * Math.PI * 2;

    return {
      x: 960 + Math.cos(angle) * 50 + Math.cos(angle) * 300 * progress,
      y: 400 + Math.sin(angle) * 50 + Math.sin(angle) * 300 * progress,
      opacity: progress < 0.1 ? progress * 10 : Math.max(0, 1 - (progress - 0.7) / 0.3),
      scale: 0.5 + progress * 0.5,
    };
  });

  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      {/* Fondo gradiente profesional */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0a0a 50%, #0a0a0a 100%)',
        }}
      />

      {/* Contenedor principal */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          gap: '80px',
          padding: '40px',
        }}
      >
        {/* CORAZÓN DIVIDIDO - LADO IZQUIERDO */}
        <div
          style={{
            position: 'relative',
            width: '420px',
            height: '420px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            opacity: heartOpacity,
          }}
        >
          <svg width="420" height="420" viewBox="0 0 300 300">
            {/* Mitad izquierda del corazón - Rojo */}
            <path
              d="M 150 280 Q 75 220 75 140 Q 75 90 110 90 Q 135 90 150 110 L 150 280"
              fill="#FF6B6B"
              opacity="0.9"
            />

            {/* Línea de división */}
            <line x1="150" y1="280" x2="150" y2="90" stroke="#FFD700" strokeWidth="6" />
          </svg>

          {/* Etiqueta debajo */}
          <div
            style={{
              position: 'absolute',
              bottom: '-120px',
              fontSize: '54px',
              color: '#FF6B6B',
              fontWeight: 'bold',
              fontFamily: 'Arial, sans-serif',
              textAlign: 'center',
              width: '100%',
            }}
          >
            TU CORAZÓN
          </div>
        </div>

        {/* PARTÍCULAS MOVIÉNDOSE */}
        <div style={{position: 'relative', width: '300px', height: '600px'}}>
          {particles.map((particle, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: particle.x,
                top: particle.y,
                width: '28px',
                height: '28px',
                backgroundColor: '#FFD700',
                borderRadius: '50%',
                opacity: particle.opacity,
                transform: `scale(${particle.scale})`,
                boxShadow: '0 0 30px rgba(255, 215, 0, 0.9)',
              }}
            />
          ))}

          {/* Flecha de movimiento */}
          <svg
            style={{
              position: 'absolute',
              left: '30px',
              top: '180px',
              opacity: Math.sin((frame / 25) * Math.PI * 2) * 0.3 + 0.7,
            }}
            width="240"
            height="100"
            viewBox="0 0 240 100"
          >
            <line x1="20" y1="50" x2="220" y2="50" stroke="#FFD700" strokeWidth="8" />
            <polygon points="220,50 180,20 180,80" fill="#FFD700" />
          </svg>
        </div>

        {/* SILUETA RECEPTORA - LADO DERECHO */}
        <div
          style={{
            position: 'relative',
            width: '360px',
            height: '480px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '50px',
          }}
        >
          {/* Silueta simple - MUCHO MÁS GRANDE */}
          <svg width="280" height="380" viewBox="0 0 200 280">
            {/* Cabeza */}
            <circle cx="100" cy="60" r="45" fill="#4CAF50" opacity="0.8" />

            {/* Cuerpo */}
            <rect x="70" y="110" width="60" height="100" rx="10" fill="#4CAF50" opacity="0.8" />

            {/* Brazos */}
            <rect x="20" y="120" width="50" height="30" rx="15" fill="#4CAF50" opacity="0.8" />
            <rect x="130" y="120" width="50" height="30" rx="15" fill="#4CAF50" opacity="0.8" />

            {/* Piernas */}
            <rect x="75" y="215" width="20" height="65" rx="10" fill="#4CAF50" opacity="0.8" />
            <rect x="105" y="215" width="20" height="65" rx="10" fill="#4CAF50" opacity="0.8" />
          </svg>

          {/* Etiqueta debajo */}
          <div
            style={{
              fontSize: '54px',
              color: '#4CAF50',
              fontWeight: 'bold',
              fontFamily: 'Arial, sans-serif',
              textAlign: 'center',
              marginTop: '30px',
            }}
          >
            OTRA PERSONA
          </div>
        </div>
      </div>

      {/* Texto central inferior - MÁS GRANDE */}
      <div
        style={{
          position: 'absolute',
          bottom: '40px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '58px',
          color: '#FFD700',
          fontWeight: 'bold',
          fontFamily: 'Arial, sans-serif',
          textAlign: 'center',
          maxWidth: '1200px',
          lineHeight: '1.4',
        }}
      >
        TRANSFERENCIA DE AFECTO
      </div>
    </AbsoluteFill>
  );
};
