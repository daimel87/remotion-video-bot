import {useEffect, useState} from 'react';
import {
  AbsoluteFill,
  Audio,
  OffthreadVideo,
  Sequence,
  staticFile,
  useCurrentFrame,
  interpolate,
  delayRender,
  continueRender,
} from 'remotion';

const FONT = 'KomikaAxis';
const useKomikaFont = () => {
  const [handle] = useState(() => delayRender('komika-wc'));
  useEffect(() => {
    const f = new FontFace(FONT, `url(${staticFile('fonts/KomikaAxis.ttf')}) format('truetype')`);
    f.load()
      .then((l) => {
        document.fonts.add(l);
        continueRender(handle);
      })
      .catch(() => continueRender(handle));
  }, [handle]);
};

const FPS = 30;
const STROKE = '#000';
const GREEN = '#39E75F';

const TITLE_PARTS = ['Ranking The Most ', 'DEADLY', ' World Cup Animals'];

// Fondo: cada animal en su ventana, sincronizada al SRT de Buzz (audio narrado).
// from/dur en frames a 30fps. La columna 5->1 revela el nombre cuando la voz lo dice.
type Item = {n: number; color: string; team: string; animal: string; emoji: string; src: string; objX: number; off: number; from: number; dur: number};
const ITEMS: Item[] = [
  {n: 5, color: '#FFD23F', team: 'FRANCE', animal: 'Rooster', emoji: '🐓', src: 'ba-rooster-adult', objX: 50, off: 1, from: 0, dur: 216},
  {n: 4, color: '#FF3B30', team: 'SPAIN', animal: 'Bull', emoji: '🐂', src: 'ba-bull-adult', objX: 50, off: 1, from: 216, dur: 203},
  {n: 3, color: '#FF8C00', team: 'SOUTH KOREA', animal: 'Tiger', emoji: '🐯', src: 'ba-tiger-adult', objX: 22, off: 1, from: 419, dur: 203},
  {n: 2, color: '#4aa3ff', team: 'ENGLAND', animal: 'Lion', emoji: '🦁', src: 'ba-lion-adult', objX: 50, off: 1, from: 622, dur: 233},
  {n: 1, color: GREEN, team: 'IVORY COAST', animal: 'Elephant', emoji: '🐘', src: 'ba-elephant-adult', objX: 50, off: 1, from: 855, dur: 377},
];
const TOTAL = 1232;

const Shot: React.FC<{src: string; objX: number; off: number; dur: number}> = ({src, objX, off, dur}) => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [0, dur], [1.03, 1.12], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{backgroundColor: '#000', overflow: 'hidden'}}>
      <OffthreadVideo
        src={staticFile(`${src}.mp4`)}
        startFrom={Math.round(off * FPS)}
        muted
        style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: `${objX}% 50%`, transform: `scale(${zoom})`}}
      />
    </AbsoluteFill>
  );
};

const Flash: React.FC<{at: number}> = ({at}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [at - 3, at, at + 6], [0, 0.85, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  if (o <= 0) return null;
  return <AbsoluteFill style={{background: '#fff', opacity: o, mixBlendMode: 'screen'}} />;
};

export const WorldCupAnimals: React.FC = () => {
  useKomikaFont();
  const frame = useCurrentFrame();

  const stroke = (w: number) => ({WebkitTextStroke: `${w}px ${STROKE}`, paintOrder: 'stroke fill' as const, textShadow: '0 3px 8px rgba(0,0,0,0.7)'});

  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      {/* Narración */}
      <Audio src={staticFile('worldcup-vo.mp3')} />

      {/* Fondo: clips en secuencia, sincronizados a la voz (SRT de Buzz) */}
      {ITEMS.map((item) => (
        <Sequence key={item.animal} from={item.from} durationInFrames={item.dur}>
          <Shot src={item.src} objX={item.objX} off={item.off} dur={item.dur} />
        </Sequence>
      ))}
      {ITEMS.map((item, i) => (i > 0 ? <Flash key={i} at={item.from} /> : null))}

      {/* Oscurecer un poco arriba/izquierda para que lea el texto */}
      <AbsoluteFill
        style={{background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.1) 32%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.4) 100%)'}}
      />

      {/* Título arriba */}
      <div
        style={{
          position: 'absolute',
          top: 60,
          left: 20,
          right: 20,
          textAlign: 'center',
          fontFamily: FONT,
          fontSize: 46,
          lineHeight: 1.1,
          ...stroke(4),
        }}
      >
        <span style={{color: '#fff'}}>{TITLE_PARTS[0]}</span>
        <span style={{color: GREEN}}>{TITLE_PARTS[1]}</span>
        <span style={{color: '#fff'}}>{TITLE_PARTS[2]}</span>
      </div>

      {/* "Watch until the end" */}
      <div style={{position: 'absolute', top: 188, left: 0, right: 0, textAlign: 'center', fontFamily: FONT, fontSize: 24, color: '#fff', ...stroke(3)}}>
        Watch until the end 💀
      </div>

      {/* Columna de puestos 3->1 a la izquierda; el nombre se revela cuando su clip entra */}
      {ITEMS.map((item, i) => {
        const revealAt = item.from + 4;
        const labelOpacity = interpolate(frame, [revealAt, revealAt + 10], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
        const pop = interpolate(frame, [revealAt, revealAt + 8], [0.6, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
        const top = 340 + i * 118;
        return (
          <div key={item.n} style={{position: 'absolute', left: 32, top, display: 'flex', alignItems: 'center', gap: 14}}>
            <span style={{fontFamily: FONT, fontSize: 66, color: item.color, ...stroke(4)}}>{item.n}.</span>
            <div style={{display: 'flex', flexDirection: 'column', opacity: labelOpacity, transform: `scale(${pop})`, transformOrigin: 'left center'}}>
              <span style={{fontFamily: FONT, fontSize: 34, color: '#fff', ...stroke(3)}}>
                {item.animal} {item.emoji}
              </span>
              <span style={{fontFamily: FONT, fontSize: 20, color: item.color, ...stroke(2)}}>{item.team}</span>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
