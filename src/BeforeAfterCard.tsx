import {AbsoluteFill, useCurrentFrame, interpolate} from 'remotion';

export const BeforeAfterCard: React.FC = () => {
  const frame = useCurrentFrame();

  // Animaciones de entrada
  const beforeProgress = Math.min(1, frame / 60);
  const afterProgress = Math.max(0, Math.min(1, (frame - 30) / 60));
  const crackProgress = Math.max(0, Math.min(1, (frame - 80) / 80));

  // Movimiento de los lados (separation effect)
  const leftOffset = interpolate(crackProgress, [0, 1], [0, -30], {extrapolateRight: 'clamp'});
  const rightOffset = interpolate(crackProgress, [0, 1], [0, 30], {extrapolateRight: 'clamp'});

  // Animación del texto final
  const textProgress = Math.max(0, Math.min(1, (frame - 200) / 60));

  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      {/* Fondo gradiente */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0a1a 50%, #0a0a0a 100%)',
        }}
      />

      {/* LADO IZQUIERDO - ANTES */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '50%',
          height: '100%',
          background: 'linear-gradient(135deg, #1a4d1a 0%, #0f2f0f 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '40px',
          padding: '60px',
          overflow: 'hidden',
          transform: `translateX(${leftOffset}px)`,
          opacity: beforeProgress,
        }}
      >
        {/* Título ANTES */}
        <div
          style={{
            fontSize: '120px',
            fontWeight: 'bold',
            color: '#4CAF50',
            fontFamily: 'Arial, sans-serif',
            letterSpacing: '2px',
          }}
        >
          ANTES
        </div>

        {/* Iconos antes */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '60px',
            alignItems: 'center',
          }}
        >
          {/* Fotos */}
          <div
            style={{
              textAlign: 'center',
              opacity: beforeProgress,
              transform: `translateY(${(1 - beforeProgress) * 40}px)`,
            }}
          >
            <div style={{fontSize: '140px'}}>📸</div>
            <div style={{fontSize: '70px', color: '#4CAF50', fontWeight: 'bold', marginTop: '10px'}}>
              Fotos
            </div>
          </div>

          {/* Chats */}
          <div
            style={{
              textAlign: 'center',
              opacity: beforeProgress,
              transform: `translateY(${(1 - beforeProgress) * 40}px) translateX(${beforeProgress * -20}px)`,
            }}
          >
            <div style={{fontSize: '140px'}}>💬</div>
            <div style={{fontSize: '70px', color: '#FFD700', fontWeight: 'bold', marginTop: '10px'}}>
              Chats
            </div>
          </div>

          {/* Corazón */}
          <div
            style={{
              textAlign: 'center',
              opacity: beforeProgress,
              transform: `translateY(${(1 - beforeProgress) * 40}px)`,
            }}
          >
            <div style={{fontSize: '140px'}}>❤️</div>
            <div style={{fontSize: '70px', color: '#FF6B6B', fontWeight: 'bold', marginTop: '10px'}}>
              Amor
            </div>
          </div>
        </div>
      </div>

      {/* LADO DERECHO - AHORA */}
      <div
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          width: '50%',
          height: '100%',
          background: 'linear-gradient(135deg, #4d1a1a 0%, #2f0f0f 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '40px',
          padding: '60px',
          overflow: 'hidden',
          transform: `translateX(${rightOffset}px)`,
          opacity: afterProgress,
        }}
      >
        {/* Título AHORA */}
        <div
          style={{
            fontSize: '120px',
            fontWeight: 'bold',
            color: '#FF6B6B',
            fontFamily: 'Arial, sans-serif',
            letterSpacing: '2px',
          }}
        >
          AHORA
        </div>

        {/* Iconos ahora */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '60px',
            alignItems: 'center',
          }}
        >
          {/* Candado */}
          <div
            style={{
              textAlign: 'center',
              opacity: afterProgress,
              transform: `translateY(${(1 - afterProgress) * 40}px)`,
            }}
          >
            <div style={{fontSize: '140px'}}>🔒</div>
            <div style={{fontSize: '70px', color: '#FF6B6B', fontWeight: 'bold', marginTop: '10px'}}>
              Candado
            </div>
          </div>

          {/* Teléfono oculto */}
          <div
            style={{
              textAlign: 'center',
              opacity: afterProgress,
              transform: `translateY(${(1 - afterProgress) * 40}px) translateX(${afterProgress * 20}px)`,
            }}
          >
            <div style={{fontSize: '140px'}}>📱</div>
            <div style={{fontSize: '70px', color: '#AAAAAA', fontWeight: 'bold', marginTop: '10px'}}>
              Oculto
            </div>
          </div>

          {/* Sombra */}
          <div
            style={{
              textAlign: 'center',
              opacity: afterProgress,
              transform: `translateY(${(1 - afterProgress) * 40}px)`,
            }}
          >
            <div style={{fontSize: '140px'}}>👤</div>
            <div style={{fontSize: '70px', color: '#666666', fontWeight: 'bold', marginTop: '10px'}}>
              Sombra
            </div>
          </div>
        </div>
      </div>

      {/* GRIETA DIVISORIA */}
      <svg
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
        viewBox="0 0 100 1080"
        preserveAspectRatio="none"
      >
        {/* Grieta principal */}
        <path
          d={`
            M 50 0
            Q ${50 + crackProgress * 20} ${270} 50 ${540}
            Q ${50 - crackProgress * 15} ${810} 50 1080
          `}
          stroke="#FF6B6B"
          strokeWidth="8"
          fill="none"
          opacity={crackProgress}
          strokeLinecap="round"
        />

        {/* Grieta secundaria - izquierda */}
        <path
          d={`
            M 50 ${270 + crackProgress * 50}
            L ${40 - crackProgress * 30} ${320}
          `}
          stroke="#FFD700"
          strokeWidth="4"
          fill="none"
          opacity={crackProgress * 0.7}
          strokeLinecap="round"
        />

        {/* Grieta secundaria - derecha */}
        <path
          d={`
            M 50 ${810 - crackProgress * 50}
            L ${60 + crackProgress * 25} ${760}
          `}
          stroke="#FFD700"
          strokeWidth="4"
          fill="none"
          opacity={crackProgress * 0.7}
          strokeLinecap="round"
        />
      </svg>

      {/* TEXTO FINAL */}
      <div
        style={{
          position: 'absolute',
          bottom: '80px',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          opacity: textProgress,
        }}
      >
        <div
          style={{
            fontSize: '120px',
            fontWeight: 'bold',
            color: '#FF6B6B',
            fontFamily: 'Arial, sans-serif',
            lineHeight: '1.1',
            textShadow: '0 0 40px rgba(255, 107, 107, 0.5)',
          }}
        >
          LA VERDAD QUIEBRA
          <br />
          LA ILUSIÓN
        </div>
      </div>
    </AbsoluteFill>
  );
};
