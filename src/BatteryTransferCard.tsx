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
          gap: '80px',
          padding: '40px',
          flexWrap: 'nowrap',
        }}
      >
        {/* BATERÍA IZQUIERDA - SE VACÍA */}
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '60px', flex: 1, maxWidth: '400px'}}>
          {/* Cuerpo de batería */}
          <div
            style={{
              width: '280px',
              height: '480px',
              border: '12px solid #FF6B6B',
              borderRadius: '28px',
              position: 'relative',
              backgroundColor: '#1a1a1a',
              overflow: 'hidden',
              boxShadow: '0 0 40px rgba(255, 107, 107, 0.3)',
            }}
          >
            {/* Terminal superior */}
            <div
              style={{
                position: 'absolute',
                top: '-35px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '140px',
                height: '35px',
                backgroundColor: '#FF6B6B',
                borderRadius: '8px',
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
              fontSize: '110px',
              color: '#FF6B6B',
              fontWeight: 'bold',
              fontFamily: 'Arial, sans-serif',
              lineHeight: '1',
            }}
          >
            {Math.round(leftBatteryLevel)}%
          </div>

          {/* Etiqueta */}
          <div
            style={{
              fontSize: '48px',
              color: '#AAAAAA',
              fontFamily: 'Arial, sans-serif',
              textAlign: 'center',
              fontWeight: 'bold',
              lineHeight: '1.2',
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
            gap: '60px',
            opacity: arrowOpacity,
            flex: 1,
            maxWidth: '300px',
          }}
        >
          {/* Flecha horizontal */}
          <svg width="320" height="140" viewBox="0 0 320 140">
            {/* Línea de flecha */}
            <line x1="40" y1="70" x2="280" y2="70" stroke="#FFD700" strokeWidth="12" />

            {/* Punta de flecha */}
            <polygon points="280,70 230,30 230,110" fill="#FFD700" />

            {/* Animación de puntos */}
            <circle cx={40 + (frame % 300) * 240 / 300} cy="70" r="20" fill="#FFD700" opacity="0.6" />
          </svg>

          {/* Texto transferencia */}
          <div
            style={{
              fontSize: '40px',
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
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '60px', flex: 1, maxWidth: '400px'}}>
          {/* Cuerpo de batería */}
          <div
            style={{
              width: '280px',
              height: '480px',
              border: '12px solid #4CAF50',
              borderRadius: '28px',
              position: 'relative',
              backgroundColor: '#1a1a1a',
              overflow: 'hidden',
              boxShadow: '0 0 40px rgba(76, 175, 80, 0.3)',
            }}
          >
            {/* Terminal superior */}
            <div
              style={{
                position: 'absolute',
                top: '-35px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '140px',
                height: '35px',
                backgroundColor: '#4CAF50',
                borderRadius: '8px',
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
              fontSize: '110px',
              color: '#4CAF50',
              fontWeight: 'bold',
              fontFamily: 'Arial, sans-serif',
              lineHeight: '1',
            }}
          >
            {Math.round(rightBatteryLevel)}%
          </div>

          {/* Etiqueta */}
          <div
            style={{
              fontSize: '48px',
              color: '#AAAAAA',
              fontFamily: 'Arial, sans-serif',
              textAlign: 'center',
              fontWeight: 'bold',
              lineHeight: '1.2',
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
