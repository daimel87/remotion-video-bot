import {AbsoluteFill, useCurrentFrame, interpolate} from 'remotion';

export const HeartAttractionCard: React.FC = () => {
  const frame = useCurrentFrame();

  // Fase 1: Dos corazones unidos (0-60 frames)
  const uniteProgress = Math.min(1, frame / 60);

  // Fase 2: Tercer corazón aparece (60-120 frames)
  const thirdHeartProgress = Math.max(0, Math.min(1, (frame - 60) / 60));

  // Fase 3: Atracción (120-250 frames)
  const attractionProgress = Math.max(0, Math.min(1, (frame - 120) / 130));

  // Fase 4: Ruptura de conexión (150-300 frames)
  const breakProgress = Math.max(0, Math.min(1, (frame - 150) / 150));

  // Posiciones de los corazones
  // Corazón 1: Izquierda (se mueve hacia el corazón 3)
  const heart1X = interpolate(attractionProgress, [0, 1], [-300, 200], {extrapolateRight: 'clamp'});
  const heart1Y = interpolate(attractionProgress, [0, 1], [0, 100], {extrapolateRight: 'clamp'});

  // Corazón 2: Derecha (se queda más o menos en su lugar)
  const heart2X = interpolate(attractionProgress, [0, 1], [300, 150], {extrapolateRight: 'clamp'});
  const heart2Y = 0;

  // Corazón 3: Aparece abajo/derecha y atrae el corazón 1
  const heart3Opacity = thirdHeartProgress;
  const heart3X = 400;
  const heart3Y = 150;

  // Opacidad de la conexión (línea entre corazones 1 y 2)
  const connectionOpacity = Math.max(0, 1 - breakProgress);

  // Parpadeo del corazón 1 cuando se atrae
  const heart1Pulse = 1 + Math.sin((frame - 120) * 0.1) * 0.2;

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

      {/* SVG para líneas de conexión */}
      <svg
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          top: 0,
          left: 0,
          pointerEvents: 'none',
        }}
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Línea de conexión original (1-2) */}
        <line
          x1={960 + heart1X}
          y1={540 + heart1Y}
          x2={960 + heart2X}
          y2={540 + heart2Y}
          stroke="#FFD700"
          strokeWidth="8"
          opacity={connectionOpacity}
          strokeDasharray={`${breakProgress * 500} 500`}
          strokeLinecap="round"
        />

        {/* Línea de atracción (1-3) */}
        {thirdHeartProgress > 0 && (
          <line
            x1={960 + heart1X}
            y1={540 + heart1Y}
            x2={960 + heart3X}
            y2={540 + heart3Y}
            stroke="#FF6B6B"
            strokeWidth="6"
            opacity={attractionProgress * 0.8}
            strokeDasharray="20,10"
            strokeLinecap="round"
          />
        )}

        {/* Partículas de atracción */}
        {attractionProgress > 0 &&
          Array.from({length: 5}).map((_, i) => {
            const particleProgress = (attractionProgress * 1.2 - (i * 0.1)) % 1;
            const px = heart1X + (heart3X - heart1X) * particleProgress;
            const py = heart1Y + (heart3Y - heart1Y) * particleProgress;

            return (
              <circle
                key={i}
                cx={960 + px}
                cy={540 + py}
                r="8"
                fill="#FF6B6B"
                opacity={Math.max(0, 1 - particleProgress) * 0.8}
              />
            );
          })}
      </svg>

      {/* Contenedor central */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {/* CORAZÓN 1 - Izquierda (se atrae) */}
        <div
          style={{
            position: 'absolute',
            left: `calc(50% + ${heart1X}px)`,
            top: `calc(50% + ${heart1Y}px)`,
            fontSize: '200px',
            opacity: uniteProgress,
            transform: `scale(${uniteProgress * heart1Pulse})`,
            filter: `drop-shadow(0 0 ${40 * attractionProgress}px #FF6B6B)`,
          }}
        >
          ❤️
        </div>

        {/* CORAZÓN 2 - Derecha (se queda) */}
        <div
          style={{
            position: 'absolute',
            left: `calc(50% + ${heart2X}px)`,
            top: `calc(50% + ${heart2Y}px)`,
            fontSize: '200px',
            opacity: uniteProgress * (1 - breakProgress * 0.3),
            transform: `scale(${uniteProgress})`,
            filter: `drop-shadow(0 0 ${30 * (1 - attractionProgress)}px #FFD700)`,
          }}
        >
          ❤️
        </div>

        {/* CORAZÓN 3 - Nuevo (aparece abajo/derecha) */}
        <div
          style={{
            position: 'absolute',
            left: `calc(50% + ${heart3X}px)`,
            top: `calc(50% + ${heart3Y}px)`,
            fontSize: '200px',
            opacity: heart3Opacity,
            transform: `scale(${0.5 + heart3Opacity * 0.5})`,
            filter: `drop-shadow(0 0 ${60 * heart3Opacity}px #FF6B6B)`,
          }}
        >
          ❤️
        </div>
      </div>

      {/* TÍTULO */}
      <div
        style={{
          position: 'absolute',
          top: '80px',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          opacity: Math.min(1, frame / 40),
        }}
      >
        <div
          style={{
            fontSize: '140px',
            fontWeight: 'bold',
            color: '#FFD700',
            fontFamily: 'Arial, sans-serif',
            letterSpacing: '2px',
          }}
        >
          ATRACCIÓN
        </div>
      </div>

      {/* TEXTO FASE 1 */}
      {uniteProgress > 0.5 && attractionProgress < 0.5 && (
        <div
          style={{
            position: 'absolute',
            bottom: '100px',
            left: '50%',
            transform: 'translateX(-50%)',
            textAlign: 'center',
            opacity: Math.min(1, (uniteProgress - 0.5) * 2) * Math.max(0, 1 - attractionProgress * 2),
          }}
        >
          <div
            style={{
              fontSize: '120px',
              fontWeight: 'bold',
              color: '#4CAF50',
              fontFamily: 'Arial, sans-serif',
              letterSpacing: '2px',
            }}
          >
            CONEXIÓN
          </div>
        </div>
      )}

      {/* TEXTO FASE 2 */}
      {attractionProgress > 0.3 && (
        <div
          style={{
            position: 'absolute',
            bottom: '100px',
            left: '50%',
            transform: 'translateX(-50%)',
            textAlign: 'center',
            opacity: Math.max(0, Math.min(1, attractionProgress - 0.3)),
          }}
        >
          <div
            style={{
              fontSize: '120px',
              fontWeight: 'bold',
              color: '#FF6B6B',
              fontFamily: 'Arial, sans-serif',
              letterSpacing: '2px',
            }}
          >
            RUPTURA
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
