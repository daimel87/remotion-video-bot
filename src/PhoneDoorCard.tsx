import {AbsoluteFill, useCurrentFrame, interpolate} from 'remotion';

export const PhoneDoorCard: React.FC = () => {
  const frame = useCurrentFrame();

  // Transformación del teléfono a puerta
  const transformProgress = Math.min(1, frame / 150);

  // Rotación y escala durante la transformación
  const rotation = transformProgress * 180;
  const phoneScale = interpolate(transformProgress, [0, 1], [1, 0.3], {extrapolateRight: 'clamp'});
  const doorScale = interpolate(transformProgress, [0, 1], [0, 1], {extrapolateRight: 'clamp'});

  // Opacidad de los mundos
  const world1Opacity = interpolate(transformProgress, [0, 0.5, 1], [1, 0.5, 0], {extrapolateRight: 'clamp'});
  const world2Opacity = interpolate(transformProgress, [0.5, 1], [0, 1], {extrapolateRight: 'clamp'});

  // Revelación del texto
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

      {/* MUNDO 1 - Izquierda (teléfono) */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '50%',
          height: '100%',
          background: 'linear-gradient(135deg, #1a3a6f 0%, #0f2347 100%)',
          opacity: world1Opacity,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
        }}
      >
        <div style={{fontSize: '120px', color: '#4CAF50', textAlign: 'center'}}>
          <div>📱</div>
          <div style={{fontSize: '60px', marginTop: '20px', color: '#FFD700'}}>REALIDAD</div>
        </div>
      </div>

      {/* MUNDO 2 - Derecha (puerta) */}
      <div
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          width: '50%',
          height: '100%',
          background: 'linear-gradient(135deg, #6f1a1a 0%, #471a2f 100%)',
          opacity: world2Opacity,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
        }}
      >
        <div style={{fontSize: '120px', color: '#FF6B6B', textAlign: 'center'}}>
          <div>🚪</div>
          <div style={{fontSize: '60px', marginTop: '20px', color: '#FFD700'}}>VERDAD</div>
        </div>
      </div>

      {/* TELÉFONO - Centro */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: `translate(-50%, -50%) rotateY(${rotation}deg)`,
          transformStyle: 'preserve-3d',
          perspective: '1000px',
        }}
      >
        {/* TELÉFONO */}
        <div
          style={{
            opacity: 1 - transformProgress,
            transform: `scale(${phoneScale})`,
            transition: 'none',
          }}
        >
          <svg width="500" height="600" viewBox="0 0 200 280">
            {/* Cuerpo del teléfono */}
            <rect x="20" y="20" width="160" height="240" rx="15" fill="#1a1a1a" stroke="#FFD700" strokeWidth="3" />

            {/* Pantalla */}
            <rect x="30" y="40" width="140" height="160" rx="8" fill="#0a0a0a" stroke="#4CAF50" strokeWidth="2" />

            {/* Contenido de pantalla */}
            <text x="100" y="130" textAnchor="middle" fill="#4CAF50" fontSize="24" fontWeight="bold">
              SECRETO
            </text>

            {/* Botón home */}
            <circle cx="100" cy="230" r="12" fill="#FFD700" stroke="#FFD700" strokeWidth="1" />
          </svg>
        </div>

        {/* PUERTA */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            opacity: transformProgress,
            transform: `scale(${doorScale})`,
            transition: 'none',
          }}
        >
          <svg width="500" height="600" viewBox="0 0 200 280">
            {/* Marco de puerta */}
            <rect x="20" y="20" width="160" height="240" rx="5" fill="none" stroke="#FFD700" strokeWidth="4" />

            {/* Puerta - lado izquierdo */}
            <rect x="20" y="20" width="80" height="240" rx="5" fill="#2a1a1a" stroke="#FF6B6B" strokeWidth="2" />

            {/* Puerta - lado derecho */}
            <rect x="100" y="20" width="80" height="240" rx="5" fill="#1a2a3a" stroke="#FF6B6B" strokeWidth="2" />

            {/* Picaporte */}
            <circle cx="170" cy="140" r="6" fill="#FFD700" />

            {/* Línea del medio (apertura) */}
            <line x1="100" y1="20" x2="100" y2="260" stroke="#FFD700" strokeWidth="2" strokeDasharray="10,5" />

            {/* Texto en la puerta */}
            <text x="100" y="140" textAnchor="middle" fill="#FFD700" fontSize="20" fontWeight="bold">
              ABRE
            </text>
          </svg>
        </div>
      </div>

      {/* Texto principal */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          marginTop: '400px',
          textAlign: 'center',
          opacity: textProgress,
        }}
      >
        <div
          style={{
            fontSize: '140px',
            fontWeight: 'bold',
            color: '#FFD700',
            fontFamily: 'Arial, sans-serif',
            lineHeight: '1.1',
          }}
        >
          {transformProgress < 0.5 ? 'ATRAPA' : 'LA VERDAD'}
        </div>
      </div>
    </AbsoluteFill>
  );
};
