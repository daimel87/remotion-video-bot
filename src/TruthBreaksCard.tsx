import {AbsoluteFill, useCurrentFrame, interpolate} from 'remotion';

export const TruthBreaksCard: React.FC = () => {
  const frame = useCurrentFrame();

  // Fase 1: Grietas aparecen (0-150 frames)
  const cracksProgress = Math.min(1, frame / 150);

  // Fase 2: Luz sale de las grietas (80-250 frames)
  const lightProgress = Math.max(0, Math.min(1, (frame - 80) / 170));

  // Fase 3: Texto aparece (200-300 frames)
  const textProgress = Math.max(0, Math.min(1, (frame - 200) / 100));

  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      {/* Fondo completamente oscuro */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backgroundColor: '#000000',
        }}
      />

      {/* EFECTO DE LUZ - Brillo desde las grietas */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: `radial-gradient(circle at 50% 50%, rgba(255, 255, 255, ${lightProgress * 0.8}) 0%, transparent 60%)`,
          pointerEvents: 'none',
        }}
      />

      {/* Luz adicional en los bordes */}
      {lightProgress > 0.3 && (
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: `linear-gradient(45deg,
              rgba(255, 255, 255, 0) 0%,
              rgba(255, 255, 255, ${lightProgress * 0.3}) 25%,
              rgba(255, 255, 255, 0) 50%,
              rgba(255, 255, 255, ${lightProgress * 0.3}) 75%,
              rgba(255, 255, 255, 0) 100%)`,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* SVG PARA GRIETAS */}
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
        {/* Grieta principal vertical desde arriba */}
        <path
          d={`
            M 960 0
            Q ${960 + Math.sin(cracksProgress * Math.PI) * 50} ${540 * cracksProgress}
            960 ${540}
            Q ${960 - Math.sin(cracksProgress * Math.PI) * 50} ${540 + 540 * cracksProgress}
            960 1080
          `}
          stroke="#FFFFFF"
          strokeWidth={8 + cracksProgress * 4}
          fill="none"
          opacity={cracksProgress}
          strokeLinecap="round"
        />

        {/* Grieta diagonal izquierda */}
        <path
          d={`
            M 960 ${540 * cracksProgress}
            L ${400 - cracksProgress * 200} ${200 + cracksProgress * 400}
          `}
          stroke="#FFFFFF"
          strokeWidth={6 + cracksProgress * 2}
          fill="none"
          opacity={cracksProgress * 0.8}
          strokeLinecap="round"
        />

        {/* Grieta diagonal derecha */}
        <path
          d={`
            M 960 ${540 * cracksProgress}
            L ${1520 + cracksProgress * 200} ${200 + cracksProgress * 400}
          `}
          stroke="#FFFFFF"
          strokeWidth={6 + cracksProgress * 2}
          fill="none"
          opacity={cracksProgress * 0.8}
          strokeLinecap="round"
        />

        {/* Grieta inferior izquierda */}
        <path
          d={`
            M 960 ${540 + 540 * cracksProgress}
            L ${300 - cracksProgress * 150} ${800 + cracksProgress * 200}
          `}
          stroke="#FFFFFF"
          strokeWidth={5 + cracksProgress * 2}
          fill="none"
          opacity={cracksProgress * 0.7}
          strokeLinecap="round"
        />

        {/* Grieta inferior derecha */}
        <path
          d={`
            M 960 ${540 + 540 * cracksProgress}
            L ${1620 + cracksProgress * 150} ${800 + cracksProgress * 200}
          `}
          stroke="#FFFFFF"
          strokeWidth={5 + cracksProgress * 2}
          fill="none"
          opacity={cracksProgress * 0.7}
          strokeLinecap="round"
        />

        {/* Grietas secundarias */}
        {cracksProgress > 0.5 && (
          <>
            <path
              d={`
                M 600 300
                L ${400 - (cracksProgress - 0.5) * 200} 100
              `}
              stroke="#FFFFFF"
              strokeWidth="3"
              fill="none"
              opacity={(cracksProgress - 0.5) * 2 * 0.6}
              strokeLinecap="round"
            />
            <path
              d={`
                M 1320 300
                L ${1520 + (cracksProgress - 0.5) * 200} 100
              `}
              stroke="#FFFFFF"
              strokeWidth="3"
              fill="none"
              opacity={(cracksProgress - 0.5) * 2 * 0.6}
              strokeLinecap="round"
            />
          </>
        )}
      </svg>

      {/* LUZ BLANCA INTENSA EN GRIETAS */}
      <svg
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          opacity: lightProgress,
        }}
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Brillo alrededor de las grietas principales */}
        <filter id="glow">
          <feGaussianBlur stdDeviation={20 * lightProgress} result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Grieta brillante */}
        <path
          d={`
            M 960 0
            Q ${960 + Math.sin(cracksProgress * Math.PI) * 50} ${540 * cracksProgress}
            960 ${540}
            Q ${960 - Math.sin(cracksProgress * Math.PI) * 50} ${540 + 540 * cracksProgress}
            960 1080
          `}
          stroke="#FFFFFF"
          strokeWidth={20 + lightProgress * 30}
          fill="none"
          opacity={lightProgress * 0.6}
          strokeLinecap="round"
          filter="url(#glow)"
        />
      </svg>

      {/* TEXTO FINAL */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          opacity: textProgress,
        }}
      >
        <div
          style={{
            fontSize: '140px',
            fontWeight: 'bold',
            color: '#FFFFFF',
            fontFamily: 'Arial, sans-serif',
            textAlign: 'center',
            lineHeight: '1.3',
            maxWidth: '1600px',
            padding: '60px',
            textShadow: `0 0 80px rgba(255, 255, 255, ${textProgress * 0.8})`,
            letterSpacing: '2px',
          }}
        >
          LA VERDAD SIEMPRE
          <br />
          ENCUENTRA UNA SALIDA
        </div>
      </div>
    </AbsoluteFill>
  );
};
