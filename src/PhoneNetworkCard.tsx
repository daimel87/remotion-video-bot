import {AbsoluteFill, useCurrentFrame, interpolate} from 'remotion';

export const PhoneNetworkCard: React.FC = () => {
  const frame = useCurrentFrame();

  // Animación del teléfono central
  const phoneProgress = Math.min(1, frame / 40);

  // Animación de las líneas y nodos
  const networkProgress = Math.max(0, Math.min(1, (frame - 40) / 150));

  // Animación del texto final
  const textProgress = Math.max(0, Math.min(1, (frame - 220) / 60));

  // Nodos de la red
  const nodes = [
    {
      id: 'cloud',
      emoji: '☁️',
      label: 'Cloud',
      angle: 0,
      color: '#FFD700',
      radius: 500,
    },
    {
      id: 'laptop',
      emoji: '💻',
      label: 'Laptop',
      angle: Math.PI * 0.4,
      color: '#4CAF50',
      radius: 500,
    },
    {
      id: 'folder',
      emoji: '🔒',
      label: 'Carpeta',
      angle: Math.PI * 0.8,
      color: '#FF6B6B',
      radius: 500,
    },
    {
      id: 'phone2',
      emoji: '📱',
      label: 'Otro Tel.',
      angle: Math.PI * 1.2,
      color: '#4CAF50',
      radius: 500,
    },
    {
      id: 'app',
      emoji: '💬',
      label: 'App Secreta',
      angle: Math.PI * 1.6,
      color: '#FF6B6B',
      radius: 500,
    },
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

      {/* SVG para las líneas de conexión */}
      <svg
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          top: 0,
          left: 0,
          pointerEvents: 'none',
        }}
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Líneas conectoras */}
        {nodes.map((node, index) => {
          const nodeX = 960 + Math.cos(node.angle) * node.radius * networkProgress;
          const nodeY = 540 + Math.sin(node.angle) * node.radius * networkProgress;

          return (
            <g key={`line-${node.id}`} opacity={networkProgress}>
              {/* Línea pulsante */}
              <line
                x1="960"
                y1="540"
                x2={nodeX}
                y2={nodeY}
                stroke={node.color}
                strokeWidth="6"
                opacity={networkProgress}
                strokeDasharray="20,10"
              />

              {/* Puntos de la línea animados */}
              <circle
                cx={960 + (nodeX - 960) * ((frame % 300) / 300)}
                cy={540 + (nodeY - 540) * ((frame % 300) / 300)}
                r="8"
                fill={node.color}
                opacity={networkProgress * 0.8}
              />
            </g>
          );
        })}
      </svg>

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
        {/* TELÉFONO CENTRAL */}
        <div
          style={{
            position: 'relative',
            opacity: phoneProgress,
            transform: `scale(${0.3 + phoneProgress * 0.7})`,
            zIndex: 10,
          }}
        >
          <svg width="600" height="800" viewBox="0 0 200 300">
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

            {/* Conexión símbolo */}
            <text
              x="100"
              y="140"
              textAnchor="middle"
              fill="#FFD700"
              fontSize="40"
              fontWeight="bold"
            >
              SYNC
            </text>

            {/* Home button */}
            <circle cx="100" cy="270" r="8" fill="none" stroke="#FFD700" strokeWidth="2" />
          </svg>
        </div>

        {/* NODOS DE LA RED */}
        {nodes.map((node, index) => {
          const nodeX = 960 + Math.cos(node.angle) * node.radius * networkProgress;
          const nodeY = 540 + Math.sin(node.angle) * node.radius * networkProgress;

          const nodeProgress = Math.max(0, networkProgress - index * 0.1);

          return (
            <div
              key={`node-${node.id}`}
              style={{
                position: 'absolute',
                left: `${nodeX}px`,
                top: `${nodeY}px`,
                transform: `translate(-50%, -50%) scale(${nodeProgress})`,
                opacity: nodeProgress,
                textAlign: 'center',
                zIndex: 5,
              }}
            >
              {/* Icono emoji grande */}
              <div
                style={{
                  fontSize: '140px',
                  filter: `drop-shadow(0 0 40px ${node.color})`,
                }}
              >
                {node.emoji}
              </div>

              {/* Etiqueta */}
              <div
                style={{
                  fontSize: '50px',
                  color: node.color,
                  fontWeight: 'bold',
                  fontFamily: 'Arial, sans-serif',
                  marginTop: '10px',
                  textShadow: `0 0 20px ${node.color}`,
                }}
              >
                {node.label}
              </div>

              {/* Círculo decorativo */}
              <svg
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  zIndex: -1,
                  width: '200px',
                  height: '200px',
                  marginTop: '-100px',
                  marginLeft: '-100px',
                }}
                viewBox="0 0 200 200"
              >
                <circle
                  cx="100"
                  cy="100"
                  r="90"
                  fill="none"
                  stroke={node.color}
                  strokeWidth="2"
                  opacity={nodeProgress * 0.6}
                  strokeDasharray="10,5"
                />
              </svg>
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
          opacity: Math.min(1, frame / 60),
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
          CONECTADO
        </div>
      </div>

      {/* TEXTO FINAL */}
      <div
        style={{
          position: 'absolute',
          bottom: '80px',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          opacity: textProgress,
        }}
      >
        <div
          style={{
            fontSize: '120px',
            fontWeight: 'bold',
            color: '#FF6B6B',
            fontFamily: 'Arial, sans-serif',
            lineHeight: '1.1',
            textShadow: '0 0 40px rgba(255, 107, 107, 0.5)',
          }}
        >
          TODO SINCRONIZADO
        </div>
      </div>
    </AbsoluteFill>
  );
};
