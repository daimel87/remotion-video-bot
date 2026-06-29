import {AbsoluteFill, useCurrentFrame, interpolate} from 'remotion';

export const EvidencePhoneCard: React.FC = () => {
  const frame = useCurrentFrame();

  // Fases de animación
  const phoneAppearProgress = Math.min(1, frame / 40);
  const iconsStartFrame = 40;
  const iconsProgress = Math.max(0, Math.min(1, (frame - iconsStartFrame) / 120));
  const lockStartFrame = 160;
  const lockProgress = Math.max(0, Math.min(1, (frame - lockStartFrame) / 80));
  const textStartFrame = 240;
  const textProgress = Math.max(0, Math.min(1, (frame - textStartFrame) / 60));

  // Icons data
  const icons = [
    {id: 'whatsapp', emoji: '💬', label: 'WhatsApp', color: '#25D366'},
    {id: 'photos', emoji: '📸', label: 'Fotos', color: '#FF6B6B'},
    {id: 'chats', emoji: '💭', label: 'Chats', color: '#FFD700'},
    {id: 'gallery', emoji: '🖼️', label: 'Galería', color: '#4CAF50'},
    {id: 'lock', emoji: '🔒', label: 'Candado', color: '#FF6B6B'},
  ];

  // Calcular posición de cada icono
  const getIconPosition = (index: number) => {
    const angle = (index / icons.length) * Math.PI * 2 - Math.PI / 2;
    const radius = 500;

    // Posición inicial (fuera de la pantalla)
    const startX = Math.cos(angle) * radius;
    const startY = Math.sin(angle) * radius;

    // Posición final (dentro del teléfono)
    const endX = 0;
    const endY = 0;

    // Interpolación
    const progress = Math.max(0, Math.min(1, (iconsProgress * 1.2 - index * 0.15)));
    const x = startX + (endX - startX) * progress;
    const y = startY + (endY - startY) * progress;
    const opacity = progress;

    return {x, y, opacity, progress};
  };

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
          perspective: '1200px',
        }}
      >
        {/* TELÉFONO */}
        <div
          style={{
            position: 'relative',
            opacity: phoneAppearProgress,
            transform: `scale(${0.5 + phoneAppearProgress * 0.5})`,
          }}
        >
          <svg
            width="600"
            height="800"
            viewBox="0 0 200 300"
            style={{
              filter: `drop-shadow(0 0 80px rgba(255, 215, 0, ${phoneAppearProgress * 0.6}))`,
            }}
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

            {/* Notch */}
            <rect x="80" y="40" width="40" height="20" rx="8" fill="#000" />

            {/* Candado animado */}
            <g opacity={Math.max(0, lockProgress)}>
              {/* Cuerpo del candado */}
              <rect
                x="75"
                y="100"
                width="50"
                height="50"
                rx="5"
                fill="none"
                stroke="#FF6B6B"
                strokeWidth="3"
              />

              {/* Arco del candado */}
              <path
                d="M 85 100 Q 100 70 115 100"
                fill="none"
                stroke="#FF6B6B"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Punto del candado */}
              <circle cx="100" cy="125" r="3" fill="#FF6B6B" />
            </g>

            {/* Home button */}
            <circle cx="100" cy="270" r="8" fill="none" stroke="#FFD700" strokeWidth="2" />
          </svg>
        </div>

        {/* ICONOS ENTRANTES */}
        {icons.map((icon, index) => {
          const pos = getIconPosition(index);

          return (
            <div
              key={icon.id}
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px)) scale(${pos.progress})`,
                opacity: pos.opacity,
                textAlign: 'center',
              }}
            >
              {/* Icono emoji */}
              <div
                style={{
                  fontSize: '150px',
                  filter: `drop-shadow(0 0 40px rgba(${
                    icon.color === '#25D366'
                      ? '37, 211, 102'
                      : icon.color === '#FF6B6B'
                        ? '255, 107, 107'
                        : icon.color === '#FFD700'
                          ? '255, 215, 0'
                          : '76, 175, 80'
                  }, ${pos.opacity}))`,
                }}
              >
                {icon.emoji}
              </div>

              {/* Etiqueta */}
              <div
                style={{
                  fontSize: '40px',
                  color: icon.color,
                  fontWeight: 'bold',
                  fontFamily: 'Arial, sans-serif',
                  marginTop: '10px',
                }}
              >
                {icon.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* TEXTO FINAL */}
      <div
        style={{
          position: 'absolute',
          bottom: '100px',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          opacity: textProgress,
        }}
      >
        <div
          style={{
            fontSize: '140px',
            fontWeight: 'bold',
            color: '#FF6B6B',
            fontFamily: 'Arial, sans-serif',
            lineHeight: '1.1',
            textShadow: '0 0 40px rgba(255, 107, 107, 0.5)',
          }}
        >
          TODA LA EVIDENCIA
          <br />
          ESTÁ AQUÍ
        </div>
      </div>
    </AbsoluteFill>
  );
};
