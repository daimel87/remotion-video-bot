import {AbsoluteFill, useCurrentFrame} from 'remotion';

export const DualTimelineCard: React.FC = () => {
  const frame = useCurrentFrame();

  // Progreso general
  const generalProgress = Math.min(1, frame / 250);

  // Porcentajes inversos: Contigo baja de 100% a 20%, Otra vida sube de 0% a 80%
  const contigoPercent = Math.max(20, 100 - generalProgress * 80);
  const otraVidaPercent = Math.min(80, generalProgress * 80);

  // Cambio de intensidad: superior pierde brillo, inferior gana
  const topBrightness = contigoPercent / 100;
  const bottomBrightness = otraVidaPercent / 100;

  // Opacidad del texto
  const topTextOpacity = topBrightness;
  const bottomTextOpacity = bottomBrightness;

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
          gap: '120px',
          padding: '60px',
        }}
      >
        {/* LÍNEA SUPERIOR - "CONTIGO" */}
        <div
          style={{
            width: '100%',
            maxWidth: '1400px',
            display: 'flex',
            flexDirection: 'column',
            gap: '40px',
          }}
        >
          {/* Etiqueta */}
          <div
            style={{
              fontSize: '120px',
              fontWeight: 'bold',
              color: '#AAAAAA',
              fontFamily: 'Arial, sans-serif',
              letterSpacing: '2px',
              opacity: topTextOpacity,
            }}
          >
            CONTIGO
          </div>

          {/* Barra de progreso */}
          <div
            style={{
              width: '100%',
              height: '80px',
              backgroundColor: 'rgba(100, 100, 100, 0.3)',
              borderRadius: '20px',
              overflow: 'hidden',
              border: `4px solid rgba(150, 150, 150, ${topBrightness})`,
              boxShadow: `inset 0 0 30px rgba(150, 150, 150, ${topBrightness * 0.3})`,
            }}
          >
            {/* Barra de relleno - gris que se oscurece */}
            <div
              style={{
                width: `${contigoPercent}%`,
                height: '100%',
                backgroundColor: `rgba(150, 150, 150, ${topBrightness})`,
                transition: 'none',
                boxShadow: `inset 0 0 20px rgba(150, 150, 150, ${topBrightness * 0.5})`,
              }}
            />
          </div>

          {/* Porcentaje */}
          <div
            style={{
              fontSize: '80px',
              fontWeight: 'bold',
              color: `rgba(150, 150, 150, ${topBrightness})`,
              fontFamily: 'Arial, sans-serif',
              opacity: topTextOpacity,
            }}
          >
            {Math.round(contigoPercent)}%
          </div>
        </div>

        {/* LÍNEA INFERIOR - "OTRA VIDA" */}
        <div
          style={{
            width: '100%',
            maxWidth: '1400px',
            display: 'flex',
            flexDirection: 'column',
            gap: '40px',
          }}
        >
          {/* Etiqueta */}
          <div
            style={{
              fontSize: '120px',
              fontWeight: 'bold',
              color: '#FF6B6B',
              fontFamily: 'Arial, sans-serif',
              letterSpacing: '2px',
              opacity: bottomTextOpacity,
              filter: `drop-shadow(0 0 ${30 * bottomBrightness}px #FF6B6B)`,
            }}
          >
            OTRA VIDA
          </div>

          {/* Barra de progreso */}
          <div
            style={{
              width: '100%',
              height: '80px',
              backgroundColor: 'rgba(255, 107, 107, 0.2)',
              borderRadius: '20px',
              overflow: 'hidden',
              border: `4px solid rgba(255, 107, 107, ${bottomBrightness})`,
              boxShadow: `0 0 40px rgba(255, 107, 107, ${bottomBrightness * 0.6})`,
            }}
          >
            {/* Barra de relleno - rojo que se ilumina */}
            <div
              style={{
                width: `${otraVidaPercent}%`,
                height: '100%',
                backgroundColor: `rgba(255, 107, 107, ${bottomBrightness})`,
                transition: 'none',
                boxShadow: `0 0 40px rgba(255, 107, 107, ${bottomBrightness})`,
              }}
            />
          </div>

          {/* Porcentaje */}
          <div
            style={{
              fontSize: '80px',
              fontWeight: 'bold',
              color: `rgba(255, 107, 107, ${bottomBrightness})`,
              fontFamily: 'Arial, sans-serif',
              opacity: bottomTextOpacity,
              filter: `drop-shadow(0 0 ${20 * bottomBrightness}px #FF6B6B)`,
            }}
          >
            {Math.round(otraVidaPercent)}%
          </div>
        </div>
      </div>


      {/* TEXTO FINAL */}
      {otraVidaPercent > 70 && (
        <div
          style={{
            position: 'absolute',
            bottom: '80px',
            left: '50%',
            transform: 'translateX(-50%)',
            textAlign: 'center',
            opacity: Math.max(0, otraVidaPercent - 70) / 10,
          }}
        >
          <div
            style={{
              fontSize: '100px',
              fontWeight: 'bold',
              color: '#FF6B6B',
              fontFamily: 'Arial, sans-serif',
              letterSpacing: '2px',
              textShadow: '0 0 40px rgba(255, 107, 107, 0.8)',
            }}
          >
            AMBAS REALIDADES
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
