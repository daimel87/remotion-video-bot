import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';

export const CelebrityThumbnail: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000', fontFamily: 'Arial, sans-serif'}}>
      {/* Red gradient background */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 40%, #000 100%)',
      }} />

      {/* Left photo - Cindy Crawford */}
      <div style={{
        position: 'absolute', left: 40, top: 40, bottom: 40, width: '42%',
        borderRadius: 30,
        overflow: 'hidden',
        border: '6px solid #FFD700',
        boxShadow: '0 0 40px rgba(255,215,0,0.4)',
      }}>
        <Img src={staticFile('images/celebrities/MV5BMTk4ODYyMzgwOV5BMl5BanBnXkFtZTcwNzIzNDUwMw@@._V1_FMjpg_UX1000_.jpg')} style={{
          width: '100%', height: '100%', objectFit: 'cover',
        }} />
        {/* Name badge */}
        <div style={{
          position: 'absolute', bottom: 30, left: '50%',
          transform: 'translateX(-50%)',
          background: '#FFD700',
          padding: '10px 30px',
          borderRadius: 12,
          whiteSpace: 'nowrap',
        }}>
          <span style={{fontSize: 38, fontWeight: 900, color: '#000'}}>
            CINDY CRAWFORD
          </span>
        </div>
      </div>

      {/* Right photo - Kaia Gerber */}
      <div style={{
        position: 'absolute', right: 40, top: 40, bottom: 40, width: '42%',
        borderRadius: 30,
        overflow: 'hidden',
        border: '6px solid #FFD700',
        boxShadow: '0 0 40px rgba(255,215,0,0.4)',
      }}>
        <Img src={staticFile('images/celebrities/GNLZZGG002GN5E6.jpg')} style={{
          width: '100%', height: '100%', objectFit: 'cover',
        }} />
        {/* Name badge */}
        <div style={{
          position: 'absolute', bottom: 30, left: '50%',
          transform: 'translateX(-50%)',
          background: '#FFD700',
          padding: '10px 30px',
          borderRadius: 12,
          whiteSpace: 'nowrap',
        }}>
          <span style={{fontSize: 38, fontWeight: 900, color: '#000'}}>
            KAIA GERBER
          </span>
        </div>
      </div>

      {/* Center text "SAME PERSON?!" */}
      <div style={{
        position: 'absolute',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        zIndex: 10,
      }}>
        <div style={{
          background: 'rgba(0,0,0,0.85)',
          padding: '15px 25px',
          borderRadius: 20,
          border: '4px solid #FFD700',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          gap: 0,
        }}>
          <span style={{
            fontSize: 72, fontWeight: 900, color: '#fff',
            lineHeight: 1.1, textAlign: 'center',
            textShadow: '0 4px 20px rgba(0,0,0,0.8)',
          }}>
            SAME
          </span>
          <span style={{
            fontSize: 72, fontWeight: 900, color: '#FFD700',
            lineHeight: 1.1, textAlign: 'center',
            textShadow: '0 4px 20px rgba(0,0,0,0.8)',
          }}>
            PERSON?!
          </span>
        </div>
      </div>

      {/* Top label */}
      <div style={{
        position: 'absolute', top: 0, left: '50%',
        transform: 'translateX(-50%)',
        background: '#FFD700',
        padding: '8px 40px',
        borderRadius: '0 0 15px 15px',
      }}>
        <span style={{fontSize: 36, fontWeight: 900, color: '#000', letterSpacing: 3}}>
          MOTHER & DAUGHTER
        </span>
      </div>
    </AbsoluteFill>
  );
};
