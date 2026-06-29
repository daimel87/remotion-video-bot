import {AbsoluteFill, useCurrentFrame, interpolate} from 'remotion';

export const HeartCrackCard: React.FC = () => {
  const frame = useCurrentFrame();

  // Fase 1: Manos acercándose (0-80 frames)
  const handsApproachProgress = Math.min(1, frame / 80);
  const leftHandPos = interpolate(handsApproachProgress, [0, 1], [-400, -100], {extrapolateRight: 'clamp'});
  const rightHandPos = interpolate(handsApproachProgress, [0, 1], [400, 100], {extrapolateRight: 'clamp'});

  // Fase 2: Corazón brillante aparece (20-100 frames)
  const heartAppearProgress = Math.max(0, Math.min(1, (frame - 20) / 60));
  const heartBrightness = interpolate(heartAppearProgress, [0, 1], [0.3, 1.2], {extrapolateRight: 'clamp'});

  // Texto AMOR (aparece en la primera fase)
  const amorProgress = Math.max(0, Math.min(1, (frame - 40) / 40));

  // Fase 3: Transición al temblor (100-160 frames)
  const trembleStartFrame = 100;
  const trembleProgress = Math.max(0, Math.min(1, (frame - trembleStartFrame) / 60));

  // Temblor de manos
  const trembleAmount = Math.sin(frame * 0.3) * trembleProgress * 20;

  // Fase 4: Corazón se agrieta (160-200 frames)
  const crackProgress = Math.max(0, Math.min(1, (frame - 160) / 40));

  // Texto CULPA (aparece cuando se agrieta)
  const culpaProgress = Math.max(0, Math.min(1, (frame - 180) / 40));

  // Fase 5: Corazón se rompe en fragmentos (200-300 frames)
  const breakProgress = Math.max(0, Math.min(1, (frame - 200) / 100));

  // Fragmentos del corazón
  const fragments = [
    {angle: 0, distance: 200, color: '#FF6B6B'},
    {angle: Math.PI * 0.4, distance: 200, color: '#FF5555'},
    {angle: Math.PI * 0.8, distance: 200, color: '#FF4444'},
    {angle: Math.PI * 1.2, distance: 200, color: '#FF3333'},
    {angle: Math.PI * 1.6, distance: 200, color: '#FF2222'},
  ];

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
        }}
      >
        {/* MANO IZQUIERDA */}
        <svg
          style={{
            position: 'absolute',
            left: `calc(50% + ${leftHandPos + trembleAmount}px)`,
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: '350px',
            height: '350px',
            zIndex: 5,
            opacity: handsApproachProgress,
          }}
          viewBox="0 0 300 300"
        >
          {/* Mano */}
          <g fill="#E8C4A0" stroke="#B8956A" strokeWidth="2">
            {/* Palma */}
            <ellipse cx="150" cy="200" rx="70" ry="90" />

            {/* Pulgar */}
            <rect x="85" y="100" width="30" height="110" rx="15" />

            {/* Índice */}
            <rect x="125" y="50" width="30" height="160" rx="15" />

            {/* Medio */}
            <rect x="160" y="40" width="30" height="170" rx="15" />

            {/* Anular */}
            <rect x="195" y="70" width="30" height="140" rx="15" />

            {/* Meñique */}
            <rect x="230" y="110" width="30" height="100" rx="15" />
          </g>
        </svg>

        {/* MANO DERECHA */}
        <svg
          style={{
            position: 'absolute',
            right: `calc(50% + ${-rightHandPos - trembleAmount}px)`,
            top: '50%',
            transform: 'translate(50%, -50%) scaleX(-1)',
            width: '350px',
            height: '350px',
            zIndex: 5,
            opacity: handsApproachProgress,
          }}
          viewBox="0 0 300 300"
        >
          {/* Mano */}
          <g fill="#E8C4A0" stroke="#B8956A" strokeWidth="2">
            {/* Palma */}
            <ellipse cx="150" cy="200" rx="70" ry="90" />

            {/* Pulgar */}
            <rect x="85" y="100" width="30" height="110" rx="15" />

            {/* Índice */}
            <rect x="125" y="50" width="30" height="160" rx="15" />

            {/* Medio */}
            <rect x="160" y="40" width="30" height="170" rx="15" />

            {/* Anular */}
            <rect x="195" y="70" width="30" height="140" rx="15" />

            {/* Meñique */}
            <rect x="230" y="110" width="30" height="100" rx="15" />
          </g>
        </svg>

        {/* CORAZÓN ÍNTEGRO */}
        {breakProgress < 0.8 && (
          <div
            style={{
              position: 'absolute',
              fontSize: '250px',
              opacity: heartAppearProgress * (1 - breakProgress * 0.5),
              filter: `brightness(${heartBrightness}) drop-shadow(0 0 ${60 * heartBrightness}px #FF6B6B)`,
              transform: `scale(${heartAppearProgress})`,
            }}
          >
            ❤️
          </div>
        )}

        {/* GRIETA EN EL CORAZÓN (efecto visual) */}
        {crackProgress > 0 && crackProgress < 1 && (
          <svg
            style={{
              position: 'absolute',
              width: '250px',
              height: '250px',
              opacity: crackProgress * 0.8,
              pointerEvents: 'none',
            }}
            viewBox="0 0 100 100"
          >
            <path
              d="M 50 20 Q 40 30 45 50 T 50 80 M 50 50 Q 60 40 55 60 T 50 80"
              stroke="#FF4444"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        )}

        {/* FRAGMENTOS DEL CORAZÓN */}
        {fragments.map((fragment, index) => {
          const fragmentProgress = Math.max(0, Math.min(1, breakProgress - index * 0.05));
          const fallDistance = fragmentProgress * 300;

          return (
            <div
              key={index}
              style={{
                position: 'absolute',
                fontSize: '80px',
                opacity: Math.max(0, 1 - fragmentProgress),
                transform: `
                  translate(
                    ${Math.cos(fragment.angle) * fragment.distance * fragmentProgress}px,
                    ${Math.sin(fragment.angle) * fragment.distance * fragmentProgress + fallDistance}px
                  )
                  rotate(${fragmentProgress * 360}deg)
                  scale(${1 - fragmentProgress * 0.5})
                `,
                filter: `drop-shadow(0 0 30px ${fragment.color})`,
              }}
            >
              💔
            </div>
          );
        })}
      </div>

      {/* TEXTO AMOR */}
      <div
        style={{
          position: 'absolute',
          top: '100px',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          opacity: amorProgress * (1 - trembleProgress),
        }}
      >
        <div
          style={{
            fontSize: '160px',
            fontWeight: 'bold',
            color: '#FF6B6B',
            fontFamily: 'Arial, sans-serif',
            letterSpacing: '4px',
            textShadow: '0 0 60px rgba(255, 107, 107, 0.8)',
          }}
        >
          AMOR
        </div>
      </div>

      {/* TEXTO CULPA */}
      <div
        style={{
          position: 'absolute',
          top: '100px',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          opacity: culpaProgress,
        }}
      >
        <div
          style={{
            fontSize: '160px',
            fontWeight: 'bold',
            color: '#FF4444',
            fontFamily: 'Arial, sans-serif',
            letterSpacing: '4px',
            textShadow: '0 0 60px rgba(255, 68, 68, 0.8)',
          }}
        >
          CULPA
        </div>
      </div>

      {/* TÍTULO */}
      <div
        style={{
          position: 'absolute',
          bottom: '80px',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          opacity: Math.max(amorProgress, culpaProgress),
        }}
      >
        <div
          style={{
            fontSize: '120px',
            fontWeight: 'bold',
            color: '#FFD700',
            fontFamily: 'Arial, sans-serif',
            letterSpacing: '2px',
          }}
        >
          {trembleProgress < 0.5 ? 'UNIÓN' : 'RUPTURA'}
        </div>
      </div>
    </AbsoluteFill>
  );
};
