import {AbsoluteFill} from 'remotion';

export const SignalsIntroCard: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      {/* Fondo con gradiente profesional */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0a0a0a 100%)',
        }}
      />

      {/* Contenido de texto */}
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
          textAlign: 'center',
          gap: '40px',
        }}
      >
        {/* Texto principal */}
        <div
          style={{
            fontSize: '140px',
            fontWeight: 'bold',
            lineHeight: '1.1',
            fontFamily: 'Arial, sans-serif',
            letterSpacing: '2px',
            maxWidth: '1800px',
          }}
        >
          <div style={{color: '#FFFFFF', marginBottom: '20px'}}>
            15 SEÑALES
          </div>
          <div style={{marginBottom: '20px'}}>
            <span style={{color: '#FFFFFF'}}>QUE </span>
            <span style={{color: '#FFD700', fontWeight: 'bold', textTransform: 'uppercase'}}>NUNCA</span>
          </div>
          <div>
            <span style={{color: '#FF6B6B', fontWeight: 'bold', fontSize: '160px', textTransform: 'uppercase'}}>MIENTEN</span>
          </div>
        </div>

        {/* Línea decorativa */}
        <div
          style={{
            width: '400px',
            height: '3px',
            background: 'linear-gradient(90deg, transparent, #FFD700, #FF6B6B, #FFD700, transparent)',
            borderRadius: '2px',
            boxShadow: '0 0 20px rgba(255, 215, 0, 0.4)',
          }}
        />

        {/* Subtítulo pequeño */}
        <div
          style={{
            fontSize: '28px',
            color: '#AAAAAA',
            fontFamily: 'Arial, sans-serif',
            letterSpacing: '1px',
            marginTop: '20px',
          }}
        >
          DESCUBRE LA VERDAD
        </div>
      </div>
    </AbsoluteFill>
  );
};
