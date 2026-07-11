import {AbsoluteFill, Img, OffthreadVideo, staticFile, useCurrentFrame} from 'remotion';
import {interpolate} from 'remotion';

const HEADLINE =
  'This beetle can blast **boiling chemicals** at 100°C from its own body — up to **20 times per second**.';

const QUOTE =
  "Predators have been recorded **spitting it back out** unharmed — the reaction fires too fast to stop. 🔥";

const renderBold = (text: string) => {
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
  return parts.map((part, i) => {
    const isBold = part.startsWith('**') && part.endsWith('**');
    const content = isBold ? part.slice(2, -2) : part;
    return (
      <span key={i} style={{fontWeight: isBold ? 800 : 400}}>
        {content}
      </span>
    );
  });
};

const VerifiedBadge: React.FC = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" style={{flexShrink: 0}}>
    <path
      fill="#4a9eff"
      d="M12 1.5l2.4 2.1 3.1-.6 1 3 2.9 1.3-.6 3.1 2.1 2.4-2.1 2.4.6 3.1-2.9 1.3-1 3-3.1-.6L12 22.5l-2.4-2.1-3.1.6-1-3-2.9-1.3.6-3.1L1.1 12l2.1-2.4-.6-3.1 2.9-1.3 1-3 3.1.6L12 1.5z"
    />
    <path fill="#fff" d="M9.8 15.3l-3-3 1.2-1.2 1.8 1.8 4.2-4.2 1.2 1.2z" />
  </svg>
);

export const AnimalFactBeetle: React.FC = () => {
  const frame = useCurrentFrame();

  const headlineOpacity = interpolate(frame, [0, 10], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const profileOpacity = interpolate(frame, [8, 18], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const quoteOpacity = interpolate(frame, [16, 26], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <OffthreadVideo src={staticFile('frog-fact-test.mp4')} />

      {/* Tarjeta estilo "post viral" reposteado: headline + perfil verificado + quote */}
      <div
        style={{
          position: 'absolute',
          top: 48,
          left: 24,
          right: 24,
          borderRadius: 22,
          overflow: 'hidden',
          background: '#000',
          border: '2px solid rgba(255,255,255,0.85)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
        }}
      >
        <div style={{padding: '26px 24px 16px', opacity: headlineOpacity}}>
          <span style={{fontFamily: 'Helvetica, Arial, sans-serif', fontSize: 27, lineHeight: 1.35, color: '#fff'}}>
            {renderBold(HEADLINE)}
          </span>
        </div>

        <div style={{height: 1, background: 'rgba(255,255,255,0.15)', margin: '0 24px'}} />

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '16px 24px 10px',
            opacity: profileOpacity,
          }}
        >
          <Img
            src={staticFile('assets/fox-avatar.png')}
            style={{width: 44, height: 44, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.7)'}}
          />
          <div>
            <div style={{display: 'flex', alignItems: 'center', gap: 6}}>
              <span style={{color: '#fff', fontWeight: 800, fontSize: 17, fontFamily: 'Helvetica, Arial, sans-serif'}}>
                Animal Facts Reactions
              </span>
              <VerifiedBadge />
            </div>
            <div style={{color: 'rgba(255,255,255,0.55)', fontSize: 14, fontFamily: 'Helvetica, Arial, sans-serif'}}>
              @AnimalFactsReax
            </div>
          </div>
        </div>

        <div style={{padding: '4px 24px 24px', opacity: quoteOpacity}}>
          <span style={{fontFamily: 'Helvetica, Arial, sans-serif', fontSize: 21, lineHeight: 1.35, color: 'rgba(255,255,255,0.9)'}}>
            {renderBold(QUOTE)}
          </span>
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: 30,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 340,
          height: 340,
          borderRadius: 20,
          overflow: 'hidden',
          border: '3px solid rgba(255,255,255,0.85)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
        }}
      >
        <OffthreadVideo
          src={staticFile('fox-reaction-test.mp4')}
          muted
          style={{width: '100%', height: '100%', objectFit: 'cover'}}
        />
      </div>

      <Img
        src={staticFile('assets/pngtree-like-button-for-youtube-vector-png-image_16285919.png')}
        style={{
          position: 'absolute',
          bottom: -50,
          right: -10,
          width: 190,
        }}
      />
    </AbsoluteFill>
  );
};
