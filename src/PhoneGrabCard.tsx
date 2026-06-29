import {AbsoluteFill, useCurrentFrame, interpolate} from 'remotion';

export const PhoneGrabCard: React.FC = () => {
  const frame = useCurrentFrame();

  // Fases de animación
  const hand1Reach = Math.min(1, frame / 40); // Mano 1 se acerca
  const hand2Snatch = Math.max(0, Math.min(1, (frame - 30) / 40)); // Mano 2 arrebata
  const shieldProgress = Math.max(0, Math.min(1, (frame - 70) / 80)); // Escudo aparece
  const textProgress = Math.max(0, Math.min(1, (frame - 150) / 120)); // Textos aparecen
  const screenDarkness = interpolate(shieldProgress, [0, 1], [0, 0.7], {extrapolateRight: 'clamp'});

  // Palabras que aparecen
  const words = ['PÁNICO', 'AGRESIÓN', 'NEGACIÓN'];

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

      {/* Contenedor central */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          perspective: '1000px',
        }}
      >
        {/* MANO IZQUIERDA (intenta tomar) */}
        <svg
          style={{
            position: 'absolute',
            left: `${interpolate(hand1Reach, [0, 1], [100, 400])}px`,
            top: `${interpolate(hand1Reach, [0, 1], [300, 420])}px`,
            width: '300px',
            height: '300px',
            zIndex: hand2Snatch < 0.8 ? 5 : 2,
            opacity: hand1Reach > 0 ? 1 : 0,
          }}
          viewBox="0 0 300 300"
        >
          {/* Mano izquierda */}
          <g fill="#CCCCCC" stroke="#999999" strokeWidth="2">
            {/* Palma */}
            <ellipse cx="150" cy="180" rx="60" ry="80" />

            {/* Pulgar */}
            <rect x="100" y="100" width="25" height="100" rx="12" />

            {/* Índice */}
            <rect x="140" y="60" width="25" height="140" rx="12" />

            {/* Medio */}
            <rect x="170" y="50" width="25" height="150" rx="12" />

            {/* Anular */}
            <rect x="200" y="70" width="25" height="130" rx="12" />

            {/* Meñique */}
            <rect x="230" y="100" width="25" height="100" rx="12" />
          </g>
        </svg>

        {/* MANO DERECHA (arrebata) */}
        <svg
          style={{
            position: 'absolute',
            right: `${interpolate(hand2Snatch, [0, 1], [100, 300])}px`,
            top: `${interpolate(hand2Snatch, [0, 1], [300, 380])}px`,
            width: '300px',
            height: '300px',
            zIndex: hand2Snatch > 0.2 ? 8 : 1,
            opacity: hand2Snatch > 0 ? 1 : 0,
            transform: 'scaleX(-1)',
          }}
          viewBox="0 0 300 300"
        >
          {/* Mano derecha (espejo) */}
          <g fill="#CCCCCC" stroke="#999999" strokeWidth="2">
            {/* Palma */}
            <ellipse cx="150" cy="180" rx="60" ry="80" />

            {/* Pulgar */}
            <rect x="100" y="100" width="25" height="100" rx="12" />

            {/* Índice */}
            <rect x="140" y="60" width="25" height="140" rx="12" />

            {/* Medio */}
            <rect x="170" y="50" width="25" height="150" rx="12" />

            {/* Anular */}
            <rect x="200" y="70" width="25" height="130" rx="12" />

            {/* Meñique */}
            <rect x="230" y="100" width="25" height="100" rx="12" />
          </g>
        </svg>

        {/* TELÉFONO CENTRAL */}
        <svg
          style={{
            position: 'absolute',
            width: '500px',
            height: '700px',
            zIndex: 4,
            filter: `brightness(${1 - screenDarkness})`,
          }}
          viewBox="0 0 200 300"
        >
          {/* Cuerpo del teléfono */}
          <rect
            x="20"
            y="20"
            width="160"
            height="260"
            rx="20"
            fill="#1a1a1a"
            stroke="#FFD700"
            strokeWidth="4"
          />

          {/* Pantalla */}
          <rect
            x="35"
            y="40"
            width="130"
            height="180"
            rx="10"
            fill="#0a0a0a"
            stroke="#4CAF50"
            strokeWidth="2"
          />

          {/* Home button */}
          <circle cx="100" cy="270" r="8" fill="none" stroke="#FFD700" strokeWidth="2" />
        </svg>

        {/* ESCUDO ROJO */}
        <svg
          style={{
            position: 'absolute',
            width: '500px',
            height: '700px',
            zIndex: shieldProgress > 0.2 ? 9 : 3,
            opacity: shieldProgress,
          }}
          viewBox="0 0 200 300"
        >
          {/* Forma de escudo */}
          <path
            d="M 100 20 L 160 60 L 160 160 Q 100 220 100 220 Q 100 220 40 160 L 40 60 Z"
            fill="#FF6B6B"
            stroke="#FF4444"
            strokeWidth="3"
            opacity="0.9"
          />

          {/* Símbolo de protección */}
          <text
            x="100"
            y="140"
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="50"
            fontWeight="bold"
          >
            🔒
          </text>
        </svg>
      </div>

      {/* PALABRAS ANIMADAS */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '20px',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 6,
        }}
      >
        {words.map((word, index) => {
          const wordStartFrame = 150 + index * 25;
          const wordProgress = Math.max(0, Math.min(1, (frame - wordStartFrame) / 40));

          return (
            <div
              key={index}
              style={{
                fontSize: '140px',
                fontWeight: 'bold',
                color: ['#FF6B6B', '#FF4444', '#990000'][index],
                fontFamily: 'Arial, sans-serif',
                opacity: wordProgress,
                transform: `scale(${0.5 + wordProgress * 0.5}) translateY(${(1 - wordProgress) * 50}px)`,
                textShadow: `0 0 40px ${['rgba(255, 107, 107, 0.8)', 'rgba(255, 68, 68, 0.8)', 'rgba(153, 0, 0, 0.8)'][index]}`,
                letterSpacing: '3px',
              }}
            >
              {word}
            </div>
          );
        })}
      </div>

      {/* TÍTULO */}
      <div
        style={{
          position: 'absolute',
          top: '60px',
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
          REACCIÓN
        </div>
      </div>
    </AbsoluteFill>
  );
};
