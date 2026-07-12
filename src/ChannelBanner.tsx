import {AbsoluteFill, Img, staticFile} from 'remotion';

const VerifiedBadge: React.FC = () => (
  <svg width="34" height="34" viewBox="0 0 24 24" style={{flexShrink: 0}}>
    <path
      fill="#4a9eff"
      d="M12 1.5l2.4 2.1 3.1-.6 1 3 2.9 1.3-.6 3.1 2.1 2.4-2.1 2.4.6 3.1-2.9 1.3-1 3-3.1-.6L12 22.5l-2.4-2.1-3.1.6-1-3-2.9-1.3.6-3.1L1.1 12l2.1-2.4-.6-3.1 2.9-1.3 1-3 3.1.6L12 1.5z"
    />
    <path fill="#fff" d="M9.8 15.3l-3-3 1.2-1.2 1.8 1.8 4.2-4.2 1.2 1.2z" />
  </svg>
);

export const ChannelBanner: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#0a0f0a'}}>
      {/* Fondo: textura de selva difuminada y oscurecida */}
      <Img
        src={staticFile('assets/banner-bg.png')}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: 'blur(6px) brightness(0.38) saturate(1.2)',
        }}
      />
      <AbsoluteFill
        style={{
          background: 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 50%, rgba(0,0,0,0.55) 100%)',
        }}
      />

      {/* Zona segura de YouTube (1546x423) centrada, con el contenido de marca */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 1546,
          height: 423,
          display: 'flex',
          alignItems: 'center',
          gap: 40,
        }}
      >
        <Img
          src={staticFile('assets/fox-avatar.png')}
          style={{
            width: 260,
            height: 260,
            borderRadius: '50%',
            border: '5px solid rgba(255,255,255,0.9)',
            boxShadow: '0 12px 30px rgba(0,0,0,0.6)',
            flexShrink: 0,
          }}
        />

        <div>
          <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
            <span
              style={{
                fontFamily: 'Helvetica, Arial, sans-serif',
                fontSize: 76,
                fontWeight: 900,
                color: '#fff',
                letterSpacing: '-0.01em',
                lineHeight: 1,
              }}
            >
              Animal Facts Reactions
            </span>
            <VerifiedBadge />
          </div>
          <div
            style={{
              marginTop: 18,
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontSize: 34,
              fontWeight: 600,
              color: 'rgba(255,255,255,0.85)',
            }}
          >
            Wild facts. Wild reactions. New video every day. 🔥
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
