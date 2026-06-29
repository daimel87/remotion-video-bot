import {AbsoluteFill, useCurrentFrame, interpolate} from 'remotion';

export const SeparationCard: React.FC = () => {
  const frame = useCurrentFrame();

  // Animación de entrada
  const entranceProgress = Math.min(1, frame / 40);

  // Animación del corazón perdiendo brillo (izquierda)
  const heartFadeProgress = Math.max(0, Math.min(1, (frame - 80) / 120));

  // Animación de silueta alejándose (derecha)
  const silhouetteMoveProgress = Math.max(0, Math.min(1, (frame - 100) / 100));

  // Animación del corazón desapareciendo (derecha)
  const heartDisappearProgress = Math.max(0, Math.min(1, (frame - 120) / 80));

  // Animación del texto final
  const textProgress = Math.max(0, Math.min(1, (frame - 220) / 60));

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

      {/* LADO IZQUIERDO - CASA CON CORAZÓN PERDIENDO BRILLO */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '50%',
          height: '100%',
          background: 'linear-gradient(135deg, #1a3a1a 0%, #0f1f0f 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '40px',
          padding: '60px',
          overflow: 'hidden',
          opacity: entranceProgress,
        }}
      >
        {/* Casa */}
        <svg width="500" height="500" viewBox="0 0 200 200">
          {/* Techo */}
          <polygon points="50,80 100,30 150,80" fill="#8B4513" stroke="#654321" strokeWidth="2" />

          {/* Pared */}
          <rect x="50" y="80" width="100" height="100" fill="#D2691E" stroke="#8B4513" strokeWidth="2" />

          {/* Puerta */}
          <rect x="85" y="130" width="30" height="50" fill="#654321" stroke="#3E2723" strokeWidth="2" />

          {/* Ventana izquierda */}
          <rect x="60" y="95" width="20" height="20" fill="#87CEEB" stroke="#4682B4" strokeWidth="1" />

          {/* Ventana derecha */}
          <rect x="120" y="95" width="20" height="20" fill="#87CEEB" stroke="#4682B4" strokeWidth="1" />

          {/* Picaporte */}
          <circle cx="115" cy="155" r="2" fill="#FFD700" />
        </svg>

        {/* Corazón izquierdo - Perdiendo brillo */}
        <div
          style={{
            fontSize: '200px',
            opacity: Math.max(0, 1 - heartFadeProgress),
            filter: `brightness(${interpolate(heartFadeProgress, [0, 1], [1, 0.2], {extrapolateRight: 'clamp'})})`,
            transition: 'none',
          }}
        >
          ❤️
        </div>

        {/* Etiqueta */}
        <div
          style={{
            fontSize: '100px',
            fontWeight: 'bold',
            color: '#4CAF50',
            fontFamily: 'Arial, sans-serif',
            opacity: entranceProgress,
          }}
        >
          HOGAR
        </div>
      </div>

      {/* LADO DERECHO - SILUETA ALEJÁNDOSE */}
      <div
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          width: '50%',
          height: '100%',
          background: 'linear-gradient(135deg, #3a1a1a 0%, #1f0f0f 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '40px',
          padding: '60px',
          overflow: 'hidden',
          opacity: entranceProgress,
          perspective: '1000px',
        }}
      >
        {/* Silueta moviéndose hacia la derecha y alejándose */}
        <div
          style={{
            position: 'relative',
            transform: `translateX(${silhouetteMoveProgress * 300}px) scale(${interpolate(silhouetteMoveProgress, [0, 1], [1, 0.6], {extrapolateRight: 'clamp'})})`,
            opacity: Math.max(0, 1 - silhouetteMoveProgress * 0.3),
          }}
        >
          <svg width="300" height="400" viewBox="0 0 120 160">
            {/* Cabeza */}
            <circle cx="60" cy="30" r="20" fill="#666666" opacity="0.8" />

            {/* Cuerpo */}
            <rect x="45" y="55" width="30" height="60" fill="#666666" opacity="0.8" />

            {/* Brazos */}
            <rect x="20" y="60" width="25" height="15" rx="7" fill="#666666" opacity="0.8" />
            <rect x="75" y="60" width="25" height="15" rx="7" fill="#666666" opacity="0.8" />

            {/* Piernas */}
            <rect x="50" y="120" width="10" height="35" rx="5" fill="#666666" opacity="0.8" />
            <rect x="60" y="120" width="10" height="35" rx="5" fill="#666666" opacity="0.8" />
          </svg>
        </div>

        {/* Corazón derecho - Desapareciendo */}
        <div
          style={{
            fontSize: '200px',
            opacity: Math.max(0, 1 - heartDisappearProgress),
            transform: `scale(${interpolate(heartDisappearProgress, [0, 1], [1, 0.5], {extrapolateRight: 'clamp'})})`,
            filter: `brightness(${interpolate(heartDisappearProgress, [0, 1], [1, 0], {extrapolateRight: 'clamp'})})`,
          }}
        >
          💔
        </div>

        {/* Etiqueta */}
        <div
          style={{
            fontSize: '100px',
            fontWeight: 'bold',
            color: '#FF6B6B',
            fontFamily: 'Arial, sans-serif',
            opacity: entranceProgress,
          }}
        >
          AUSENCIA
        </div>
      </div>

      {/* LÍNEA DIVISORIA VERTICAL */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 0,
          width: '4px',
          height: '100%',
          backgroundColor: '#FFD700',
          boxShadow: '0 0 30px rgba(255, 215, 0, 0.5)',
          transform: 'translateX(-2px)',
          opacity: entranceProgress,
        }}
      />

      {/* TEXTO FINAL - CENTRADO EN PANTALLA */}
      <div
        style={{
          position: 'absolute',
          bottom: '100px',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          opacity: textProgress,
          zIndex: 10,
        }}
      >
        <div
          style={{
            fontSize: '140px',
            fontWeight: 'bold',
            color: '#FFFFFF',
            fontFamily: 'Arial, sans-serif',
            lineHeight: '1.2',
            textShadow: '0 0 40px rgba(255, 215, 0, 0.5)',
            maxWidth: '1600px',
          }}
        >
          DOS VIDAS
          <br />
          UNA SOLA VERDAD
        </div>
      </div>
    </AbsoluteFill>
  );
};
