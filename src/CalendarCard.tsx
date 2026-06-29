import {AbsoluteFill, useCurrentFrame, interpolate} from 'remotion';

export const CalendarCard: React.FC = () => {
  const frame = useCurrentFrame();

  // Animación de llenado del calendario
  const fillProgress = Math.min(1, frame / 200);

  // Animación de tachar elementos
  const strikeProgress = Math.max(0, Math.min(1, (frame - 100) / 100));

  // Número de elementos visibles
  const visibleItems = Math.floor(fillProgress * 10);

  // Items del calendario
  const calendarItems = [
    {time: '08:00', label: 'Reunión', color: '#FF6B6B'},
    {time: '10:30', label: 'Llamada', color: '#FFD700'},
    {time: '12:00', label: 'Almuerzo', color: '#4CAF50'},
    {time: '14:00', label: 'Proyecto', color: '#FF6B6B'},
    {time: '16:00', label: 'Pendiente', color: '#FFD700'},
    {time: '17:30', label: 'Importante', color: '#4CAF50'},
    {time: '19:00', label: 'Cita', color: '#FF6B6B'},
    {time: '20:30', label: 'Cancelada', color: '#FFD700'},
    {time: '21:00', label: 'Compromisos', color: '#4CAF50'},
    {time: '22:00', label: 'Secreto', color: '#FF6B6B'},
  ];

  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      {/* Fondo gradiente profesional */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0a1a 50%, #0a0a0a 100%)',
        }}
      />

      {/* Contenido */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '60px 40px',
          gap: '30px',
        }}
      >
        {/* Título */}
        <div
          style={{
            fontSize: '140px',
            fontWeight: 'bold',
            color: '#FFD700',
            fontFamily: 'Arial, sans-serif',
            letterSpacing: '2px',
            opacity: Math.max(0, Math.min(1, frame / 40)),
          }}
        >
          AGENDA LLENA
        </div>

        {/* Línea decorativa */}
        <div
          style={{
            width: '500px',
            height: '4px',
            background: 'linear-gradient(90deg, transparent, #FFD700, #FF6B6B, #FFD700, transparent)',
            borderRadius: '2px',
            boxShadow: '0 0 30px rgba(255, 215, 0, 0.5)',
          }}
        />

        {/* Calendario items */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            maxWidth: '1200px',
            width: '100%',
          }}
        >
          {calendarItems.slice(0, visibleItems).map((item, index) => {
            // Progreso de aparición de cada item
            const itemAppearProgress = Math.max(
              0,
              Math.min(1, (frame - index * 20) / 30)
            );

            // Progreso de tachado
            const itemStrikeProgress =
              index < Math.floor(strikeProgress * calendarItems.length)
                ? 1
                : 0;

            return (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '40px',
                  padding: '20px 30px',
                  backgroundColor: 'rgba(26, 26, 26, 0.8)',
                  borderRadius: '15px',
                  border: `3px solid ${item.color}`,
                  opacity: itemAppearProgress,
                  transform: `translateX(${(1 - itemAppearProgress) * 50}px)`,
                  boxShadow: `0 0 40px rgba(${
                    item.color === '#FF6B6B'
                      ? '255, 107, 107'
                      : item.color === '#FFD700'
                        ? '255, 215, 0'
                        : '76, 175, 80'
                  }, 0.3)`,
                }}
              >
                {/* Hora - ENORME */}
                <div
                  style={{
                    fontSize: '100px',
                    fontWeight: 'bold',
                    color: item.color,
                    fontFamily: 'Arial, sans-serif',
                    minWidth: '280px',
                  }}
                >
                  {item.time}
                </div>

                {/* Etiqueta */}
                <div
                  style={{
                    fontSize: '90px',
                    fontWeight: 'bold',
                    color: '#FFFFFF',
                    fontFamily: 'Arial, sans-serif',
                    flex: 1,
                    position: 'relative',
                    textDecoration: itemStrikeProgress > 0 ? 'line-through' : 'none',
                    opacity: itemStrikeProgress > 0 ? 0.5 : 1,
                  }}
                >
                  {item.label}

                  {/* Línea de tachado animada */}
                  {itemStrikeProgress > 0 && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: 0,
                        width: `${itemStrikeProgress * 100}%`,
                        height: '8px',
                        backgroundColor: '#FF6B6B',
                        transform: 'translateY(-50%)',
                      }}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Texto inferior */}
        <div
          style={{
            fontSize: '80px',
            color: '#FF6B6B',
            fontWeight: 'bold',
            fontFamily: 'Arial, sans-serif',
            textAlign: 'center',
            marginTop: '40px',
            opacity: Math.max(0, Math.min(1, (frame - 200) / 60)),
          }}
        >
          ¿CUÁNDO TIENE TIEMPO PARA TI?
        </div>
      </div>
    </AbsoluteFill>
  );
};
