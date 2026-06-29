import {AbsoluteFill, useCurrentFrame, interpolate} from 'remotion';

export const BatteryTransferCard: React.FC = () => {
  const frame = useCurrentFrame();

  // La batería izquierda se vacía (de 100% a 0%)
  const leftBatteryLevel = interpolate(frame, [0, 300], [100, 0]);

  // La batería derecha se llena (de 0% a 100%)
  const rightBatteryLevel = interpolate(frame, [0, 300], [0, 100]);

  // Flecha pulsante
  const arrowOpacity = Math.sin((frame / 25) * Math.PI * 2) * 0.3 + 0.7;

  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      {/* Fondo gradiente profesional */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0a0a0a 100%)',
        }}
      />

      {/* Contenedor principal */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '100px',
          padding: '60px',
        }}
      >
        {/* BATERÍA IZQUIERDA - SE VACÍA */}
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '30px'}}>
          {/* Cuerpo de batería */}
          <div
            style={{
              width: '120px',
              height: '200px',
              border: '4px solid #FF6B6B',
              borderRadius: '12px',
              position: 'relative',
              backgroundColor: '#1a1a1a',
              overflow: 'hidden',
            }}
          >
            {/* Terminal superior */}
            <div
              style={{
                position: 'absolute',
                top: '-15px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '60px',
                height: '15px',
                backgroundColor: '#FF6B6B',
                borderRadius: '4px',
              }}
            />

            {/* Nivel de carga - rojo */}
            <div
              style={{
                position: 'absolute',
                bottom: '0',
                left: '0',
                right: '0',
                height: `${leftBatteryLevel}%`,
                backgroundColor: '#FF6B6B',
                transition: 'height 0.1s linear',
              }}
            />
          </div>

          {/* Porcentaje */}
          <div
            style={{
              fontSize: '32px',
              color: '#FF6B6B',
              fontWeight: 'bold',
              fontFamily: 'Arial, sans-serif',
            }}
          >
            {Math.round(leftBatteryLevel)}%
          </div>

          {/* Etiqueta */}
          <div
            style={{
              fontSize: '20px',
              color: '#AAAAAA',
              fontFamily: 'Arial, sans-serif',
              textAlign: 'center',
            }}
          >
            ENERGÍA
            <br />
            CEDIDA
          </div>
        </div>

        {/* FLECHA DE TRANSFERENCIA CON PULSO */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '30px',
            opacity: arrowOpacity,
          }}
        >
          {/* Flecha horizontal */}
          <svg width="150" height="60" viewBox="0 0 150 60">
            {/* Línea de flecha */}
            <line x1="20" y1="30" x2="130" y2="30" stroke="#FFD700" strokeWidth="4" />

            {/* Punta de flecha */}
            <polygon points="130,30 110,20 110,40" fill="#FFD700" />

            {/* Animación de puntos */}
            <circle cx={20 + (frame % 300) * 110 / 300} cy="30" r="8" fill="#FFD700" opacity="0.6" />
          </svg>

          {/* Texto transferencia */}
          <div
            style={{
              fontSize: '18px',
              color: '#FFD700',
              fontWeight: 'bold',
              fontFamily: 'Arial, sans-serif',
              textAlign: 'center',
            }}
          >
            TRANSFERENCIA
            <br />
            DE ENERGÍA
          </div>
        </div>

        {/* BATERÍA DERECHA - SE LLENA */}
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '30px'}}>
          {/* Cuerpo de batería */}
          <div
            style={{
              width: '120px',
              height: '200px',
              border: '4px solid #4CAF50',
              borderRadius: '12px',
              position: 'relative',
              backgroundColor: '#1a1a1a',
              overflow: 'hidden',
            }}
          >
            {/* Terminal superior */}
            <div
              style={{
                position: 'absolute',
                top: '-15px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '60px',
                height: '15px',
                backgroundColor: '#4CAF50',
                borderRadius: '4px',
              }}
            />

            {/* Nivel de carga - verde */}
            <div
              style={{
                position: 'absolute',
                bottom: '0',
                left: '0',
                right: '0',
                height: `${rightBatteryLevel}%`,
                backgroundColor: '#4CAF50',
                transition: 'height 0.1s linear',
              }}
            />
          </div>

          {/* Porcentaje */}
          <div
            style={{
              fontSize: '32px',
              color: '#4CAF50',
              fontWeight: 'bold',
              fontFamily: 'Arial, sans-serif',
            }}
          >
            {Math.round(rightBatteryLevel)}%
          </div>

          {/* Etiqueta */}
          <div
            style={{
              fontSize: '20px',
              color: '#AAAAAA',
              fontFamily: 'Arial, sans-serif',
              textAlign: 'center',
            }}
          >
            ENERGÍA
            <br />
            RECIBIDA
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
