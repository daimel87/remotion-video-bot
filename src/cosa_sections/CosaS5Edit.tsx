import {AbsoluteFill, useCurrentFrame, spring, useVideoConfig, interpolate} from 'remotion';
import {ZoomVideo, Scene, FullScreen, Panel, T, AccentLine, theme} from './kit';

export const S5 = {
  s1In: 205, s1Out: 300,   // ~8s  invierte el ataque
  s2In: 305, s2Out: 420,   // ~12s preocupación = defecto
  s3In: 460, s3Out: 570,   // ~18s tú eres el villano
  fsIn: 640, fsOut: 760,   // ~26s FULL-SCREEN arma final
  s5In: 780, s5Out: 890,   // ~31s te hace sentir culpable
  s6In: 915, s6Out: 1030,  // ~37s paz mental vs relación
  s7In: 1075, s7Out: 1185, // ~43s lo usa en tu contra
  teaser: 1320,            // ~53s sexta frase
};

export const CosaS5Edit: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const teaserEnter = spring({frame: Math.max(0, frame - S5.teaser), fps, config: {damping: 14, stiffness: 160}});
  const teaserScale = interpolate(teaserEnter, [0, 1], [0.5, 1]);

  return (
    <AbsoluteFill style={{backgroundColor: theme.bg}}>
      <ZoomVideo
        src="cosa_s5.mp4"
        frames={[0, 175, 305, 420, 640, 760, 915, 1075, 1320, 1497]}
        scales={[1.0, 1.0, 1.0, 1.05, 1.05, 1.0, 1.05, 1.0, 1.04, 1.07]}
      />

      {/* 1 · invierte el ataque (banda inferior) */}
      <Scene frameIn={S5.s1In} frameOut={S5.s1Out} pos="bottom">
        <Panel>
          <div style={{fontSize: 48, marginBottom: 2}}>🔄</div>
          <T size={44} color={theme.text}>Ella </T>
          <T size={54} color={theme.accent} weight={900}>INVIERTE EL ATAQUE</T>
        </Panel>
      </Scene>

      {/* 2 · tu preocupación = tu defecto (derecha) */}
      <Scene frameIn={S5.s2In} frameOut={S5.s2Out} pos="right" maxWidth={660}>
        <Panel>
          <T size={40} color={theme.textDim}>Convierte</T>
          <div style={{marginTop: 8}}>
            <T size={50} color={theme.text} weight={900}>TU PREOCUPACIÓN</T>
          </div>
          <div style={{marginTop: 4}}>
            <T size={50} color={theme.accent} weight={900}>= TU DEFECTO</T>
          </div>
        </Panel>
      </Scene>

      {/* 3 · tú eres el villano (izquierda) */}
      <Scene frameIn={S5.s3In} frameOut={S5.s3Out} pos="left" maxWidth={620}>
        <Panel>
          <div style={{fontSize: 54, marginBottom: 6}}>🎭</div>
          <T size={42} color={theme.text}>De repente</T>
          <br />
          <T size={60} color={theme.accent} weight={900}>TÚ ERES EL VILLANO</T>
          <AccentLine width={420} />
        </Panel>
      </Scene>

      {/* 4 · FULL-SCREEN arma final */}
      <FullScreen frameIn={S5.fsIn} frameOut={S5.fsOut} kicker="Por cuidarte, por tener intuición" big="El arma final" small="del manipulador" />

      {/* 5 · te hace sentir culpable (derecha) */}
      <Scene frameIn={S5.s5In} frameOut={S5.s5Out} pos="right" maxWidth={660}>
        <Panel>
          <T size={40} color={theme.textDim}>Por protegerte</T>
          <div style={{marginTop: 8}}><T size={54} color={theme.accent} weight={900}>TE HACE SENTIR CULPABLE</T></div>
        </Panel>
      </Scene>

      {/* 6 · paz mental vs relación (izquierda, balanza) */}
      <Scene frameIn={S5.s6In} frameOut={S5.s6Out} pos="left" maxWidth={680}>
        <Panel>
          <T size={40} color={theme.textDim}>Te obliga a elegir</T>
          <div style={{marginTop: 10, display: 'flex', alignItems: 'center', gap: 18}}>
            <T size={46} color={theme.text} weight={900}>TU PAZ</T>
            <span style={{fontSize: 52}}>⚖️</span>
            <T size={46} color={theme.accent} weight={900}>LA RELACIÓN</T>
          </div>
        </Panel>
      </Scene>

      {/* 7 · lo usa en tu contra (banda inferior) */}
      <Scene frameIn={S5.s7In} frameOut={S5.s7Out} pos="bottom">
        <Panel>
          <T size={44} color={theme.text}>Elegirás la relación… y eso </T>
          <T size={44} color={theme.accent} weight={900}>LO USA EN TU CONTRA</T>
        </Panel>
      </Scene>

      {/* 8 · teaser #6 */}
      {frame >= S5.teaser && (
        <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 80}}>
          <div style={{transform: `scale(${teaserScale})`, opacity: interpolate(frame, [S5.teaser, S5.teaser + 15], [0, 1], {extrapolateRight: 'clamp'})}}>
            <Panel style={{display: 'flex', alignItems: 'center', gap: 24}}>
              <div style={{fontFamily: theme.font, fontWeight: 900, fontSize: 90, color: theme.accent, textShadow: `0 0 50px ${theme.accentGlow}`}}>#6</div>
              <div style={{textAlign: 'left'}}>
                <T size={38} color={theme.textDim}>Te hace creer que hay esperanza</T>
                <br />
                <T size={48} color={theme.text} weight={900}>CUANDO YA NO LA HAY</T>
              </div>
            </Panel>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
