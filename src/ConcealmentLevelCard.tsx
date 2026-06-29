import {AbsoluteFill, useCurrentFrame, interpolate} from 'remotion';

export const ConcealmentLevelCard: React.FC = () => {
  const frame = useCurrentFrame();

  // Fases de animación
  // Fase 1: 10% (0-125 frames)
  const level10Progress = Math.min(1, frame / 125);
  // Fase 2: 30% (125-250 frames)
  const level30Progress = Math.max(0, Math.min(1, (frame - 125) / 125));
  // Fase 3: 60% (250-375 frames)
  const level60Progress = Math.max(0, Math.min(1, (frame - 250) / 125));
  // Fase 4: 100% (375-500 frames)
  const level100Progress = Math.max(0, Math.min(1, (frame - 375) / 125));

  // Progreso total de la barra
  const barProgress = interpolate(
    frame,
    [0, 125, 250, 375, 500],
    [0.1, 0.3, 0.6, 1, 1],
    {extrapolateRight: 'clamp'}
  );

  // Items que aparecen en cada nivel
  const items = [
    {level: 0.1, emoji: '🔐', label: 'Contraseña', color: '#FFD700'},
    {level: 0.3, emoji: '🗑️', label: 'Mensajes\nEliminados', color: '#FF6B6B'},
    {level: 0.6, emoji: '💬', label: 'Chat\nOculto', color: '#4CAF50'},
    {level: 1, emoji: '📁', label: 'Carpeta\nCifrada', color: '#FF6B6B'},
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
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '80px 60px',
          gap: '60px',
        }}
      >
        {/* TÍTULO */}
        <div
          style={{
            fontSize: '140px',
            fontWeight: 'bold',
            color: '#FFD700',
            fontFamily: 'Arial, sans-serif',
            letterSpacing: '2px',
            opacity: Math.min(1, frame / 40),
          }}
        >
          NIVEL DE OCULTAMIENTO
        </div>

        {/* BARRA DE PROGRESO */}
        <div
          style={{
            width: '1200px',
            height: '120px',
            backgroundColor: 'rgba(26, 26, 26, 0.8)',
            border: '4px solid #FFD700',
            borderRadius: '20px',
            overflow: 'hidden',
            position: 'relative',
            boxShadow: '0 0 40px rgba(255, 215, 0, 0.3)',
          }}
        >
          {/* Barra de relleno */}
          <div
            style={{
              position: 'absolute',
              height: '100%',
              width: `${barProgress * 100}%`,
              backgroundColor: `hsl(${interpolate(barProgress, [0, 1], [60, 0], {extrapolateRight: 'clamp'})}, 100%, 50%)`,
              transition: 'none',
              boxShadow: `inset 0 0 40px rgba(255, 107, 107, ${barProgress})`,
            }}
          />

          {/* Porcentaje de texto en la barra */}
          <div
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '80px',
              fontWeight: 'bold',
              color: '#FFFFFF',
              fontFamily: 'Arial, sans-serif',
              zIndex: 2,
              textShadow: '0 0 20px rgba(0, 0, 0, 0.8)',
            }}
          >
            {Math.round(barProgress * 100)}%
          </div>
        </div>

        {/* ITEMS POR NIVEL */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            width: '100%',
            maxWidth: '1400px',
            gap: '40px',
          }}
        >
          {items.map((item, index) => {
            let itemProgress = 0;
            if (item.level === 0.1) itemProgress = level10Progress;
            else if (item.level === 0.3) itemProgress = level30Progress;
            else if (item.level === 0.6) itemProgress = level60Progress;
            else if (item.level === 1) itemProgress = level100Progress;

            return (
              <div
                key={index}
                style={{
                  flex: 1,
                  textAlign: 'center',
                  opacity: itemProgress,
                  transform: `scale(${0.5 + itemProgress * 0.5}) translateY(${(1 - itemProgress) * 50}px)`,
                }}
              >
                {/* Icono emoji grande */}
                <div
                  style={{
                    fontSize: '140px',
                    marginBottom: '20px',
                    filter: `drop-shadow(0 0 40px ${item.color})`,
                  }}
                >
                  {item.emoji}
                </div>

                {/* Etiqueta */}
                <div
                  style={{
                    fontSize: '70px',
                    fontWeight: 'bold',
                    color: item.color,
                    fontFamily: 'Arial, sans-serif',
                    lineHeight: '1.2',
                    whiteSpace: 'pre-line',
                  }}
                >
                  {item.label}
                </div>

                {/* Hito de nivel */}
                <div
                  style={{
                    fontSize: '50px',
                    color: '#AAAAAA',
                    fontFamily: 'Arial, sans-serif',
                    marginTop: '15px',
                  }}
                >
                  {Math.round(item.level * 100)}%
                </div>
              </div>
            );
          })}
        </div>

        {/* CANDADO FINAL - Aparece al 100% */}
        {level100Progress > 0 && (
          <div
            style={{
              position: 'absolute',
              bottom: '100px',
              fontSize: '300px',
              opacity: level100Progress,
              transform: `scale(${0.5 + level100Progress * 0.5})`,
              filter: `drop-shadow(0 0 80px rgba(255, 107, 107, ${level100Progress}))`,
              animation: level100Progress > 0.9 ? 'none' : 'none',
            }}
          >
            🔒
          </div>
        )}

        {/* TEXTO FINAL */}
        {level100Progress > 0.3 && (
          <div
            style={{
              position: 'absolute',
              bottom: '-80px',
              textAlign: 'center',
              opacity: Math.max(0, level100Progress - 0.3),
              fontSize: '120px',
              fontWeight: 'bold',
              color: '#FF6B6B',
              fontFamily: 'Arial, sans-serif',
              letterSpacing: '2px',
              textShadow: '0 0 40px rgba(255, 107, 107, 0.5)',
            }}
          >
            COMPLETAMENTE PROTEGIDO
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
