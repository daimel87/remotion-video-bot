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
          justifyContent: 'space-around',
          alignItems: 'center',
          gap: '150px',
          padding: '80px',
        }}
      >
        {/* BATERÍA IZQUIERDA - SE VACÍA */}
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '50px'}}>
          {/* Cuerpo de batería */}
          <div
            style={{
              width: '200px',
              height: '350px',
              border: '8px solid #FF6B6B',
              borderRadius: '20px',
              position: 'relative',
              backgroundColor: '#1a1a1a',
              overflow: 'hidden',
            }}
          >
            {/* Terminal superior */}
            <div
              style={{
                position: 'absolute',
                top: '-25px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '100px',
                height: '25px',
                backgroundColor: '#FF6B6B',
                borderRadius: '6px',
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
              fontSize: '72px',
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
              fontSize: '36px',
              color: '#AAAAAA',
              fontFamily: 'Arial, sans-serif',
              textAlign: 'center',
              fontWeight: 'bold',
              lineHeight: '1.3',
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
            gap: '50px',
            opacity: arrowOpacity,
          }}
        >
          {/* Flecha horizontal */}
          <svg width="280" height="120" viewBox="0 0 280 120">
            {/* Línea de flecha */}
            <line x1="40" y1="60" x2="240" y2="60" stroke="#FFD700" strokeWidth="8" />

            {/* Punta de flecha */}
            <polygon points="240,60 200,30 200,90" fill="#FFD700" />

            {/* Animación de puntos */}
            <circle cx={40 + (frame % 300) * 200 / 300} cy="60" r="16" fill="#FFD700" opacity="0.6" />
          </svg>

          {/* Texto transferencia */}
          <div
            style={{
              fontSize: '32px',
              color: '#FFD700',
              fontWeight: 'bold',
              fontFamily: 'Arial, sans-serif',
              textAlign: 'center',
              lineHeight: '1.3',
            }}
          >
            TRANSFERENCIA
            <br />
            DE ENERGÍA
          </div>
        </div>

        {/* BATERÍA DERECHA - SE LLENA */}
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '50px'}}>
          {/* Cuerpo de batería */}
          <div
            style={{
              width: '200px',
              height: '350px',
              border: '8px solid #4CAF50',
              borderRadius: '20px',
              position: 'relative',
              backgroundColor: '#1a1a1a',
              overflow: 'hidden',
            }}
          >
            {/* Terminal superior */}
            <div
              style={{
                position: 'absolute',
                top: '-25px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '100px',
                height: '25px',
                backgroundColor: '#4CAF50',
                borderRadius: '6px',
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
              fontSize: '72px',
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
              fontSize: '36px',
              color: '#AAAAAA',
              fontFamily: 'Arial, sans-serif',
              textAlign: 'center',
              fontWeight: 'bold',
              lineHeight: '1.3',
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
