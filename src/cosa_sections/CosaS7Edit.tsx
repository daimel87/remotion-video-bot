import {AbsoluteFill, useCurrentFrame, spring, useVideoConfig, interpolate} from 'remotion';
import {ZoomVideo, Scene, FullScreen, Panel, T, AccentLine, theme} from './kit';

export const S7 = {
  s1In: 205, s1Out: 300,   // ~8s  niega la realidad
  fsIn: 355, fsOut: 470,   // ~14s FULL-SCREEN amnesia selectiva
  s3In: 520, s3Out: 630,   // ~21s culpable por tener memoria
  s4In: 680, s4Out: 800,   // ~27s es una forma de control
  s5In: 830, s5Out: 900,   // ~33s protestar/recordar/atento
  s6In: 915, s6Out: 1030,  // ~36s reescribe el pasado
  s7In: 1060, s7Out: 1165, // ~42s dudas de tus propios ojos
  teaser: 1210,            // ~48s octava frase
};

export const CosaS7Edit: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const teaserEnter = spring({frame: Math.max(0, frame - S7.teaser), fps, config: {damping: 14, stiffness: 160}});
  const teaserScale = interpolate(teaserEnter, [0, 1], [0.5, 1]);

  return (
    <AbsoluteFill style={{backgroundColor: theme.bg}}>
      <ZoomVideo
        src="cosa_s7.mp4"
        frames={[0, 175, 355, 470, 680, 900, 915, 1060, 1210, 1438]}
        scales={[1.0, 1.0, 1.0, 1.05, 1.05, 1.0, 1.0, 1.05, 1.04, 1.07]}
      />

      {/* 1 · niega la realidad (banda inferior) */}
      <Scene frameIn={S7.s1In} frameOut={S7.s1Out} pos="bottom">
        <Panel>
          <T size={44} color={theme.text}>"Yo no soy así" → </T>
          <T size={52} color={theme.accent} weight={900}>NIEGA LA REALIDAD</T>
        </Panel>
      </Scene>

      {/* 2 · FULL-SCREEN amnesia selectiva */}
      <FullScreen frameIn={S7.fsIn} frameOut={S7.fsOut} kicker="Olvida todo lo que hizo mal" big="Amnesia selectiva" small="y tú te sientes el culpable" />

      {/* 3 · culpable por tener memoria (derecha) */}
      <Scene frameIn={S7.s3In} frameOut={S7.s3Out} pos="right" maxWidth={660}>
        <Panel>
          <div style={{fontSize: 52, marginBottom: 6}}>🧠</div>
          <T size={40} color={theme.textDim}>Te sientes</T>
          <div style={{marginTop: 8}}><T size={52} color={theme.accent} weight={900}>CULPABLE POR TENER MEMORIA</T></div>
        </Panel>
      </Scene>

      {/* 4 · es una forma de control (izquierda) */}
      <Scene frameIn={S7.s4In} frameOut={S7.s4Out} pos="left" maxWidth={620}>
        <Panel>
          <div style={{fontSize: 54, marginBottom: 6}}>🎛️</div>
          <T size={44} color={theme.text}>En realidad es</T>
          <br />
          <T size={58} color={theme.accent} weight={900}>UNA FORMA DE CONTROL</T>
          <AccentLine width={420} />
        </Panel>
      </Scene>

      {/* 5 · protestar/recordar/atento (banda inferior, ecuaciones) */}
      <Scene frameIn={S7.s5In} frameOut={S7.s5Out} pos="bottom">
        <Panel>
          <T size={42} color={theme.text} weight={900}>PROTESTAR = </T><T size={42} color={theme.accent} weight={900}>culpar</T>
          <span style={{margin: '0 18px'}} />
          <T size={42} color={theme.text} weight={900}>RECORDAR = </T><T size={42} color={theme.accent} weight={900}>injusto</T>
        </Panel>
      </Scene>

      {/* 6 · reescribe el pasado (derecha) */}
      <Scene frameIn={S7.s6In} frameOut={S7.s6Out} pos="right" maxWidth={640}>
        <Panel>
          <div style={{fontSize: 52, marginBottom: 6}}>📝</div>
          <T size={40} color={theme.textDim}>Cada vez que la confrontas</T>
          <div style={{marginTop: 8}}><T size={56} color={theme.accent} weight={900}>REESCRIBE EL PASADO</T></div>
        </Panel>
      </Scene>

      {/* 7 · dudas de tus propios ojos (izquierda) */}
      <Scene frameIn={S7.s7In} frameOut={S7.s7Out} pos="left" maxWidth={640}>
        <Panel>
          <div style={{fontSize: 52, marginBottom: 6}}>👁️</div>
          <T size={42} color={theme.text}>Empiezas a dudar de</T>
          <br />
          <T size={54} color={theme.accent} weight={900}>LO QUE VISTE CON TUS OJOS</T>
        </Panel>
      </Scene>

      {/* 8 · teaser #8 */}
      {frame >= S7.teaser && (
        <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 80}}>
          <div style={{transform: `scale(${teaserScale})`, opacity: interpolate(frame, [S7.teaser, S7.teaser + 15], [0, 1], {extrapolateRight: 'clamp'})}}>
            <Panel style={{display: 'flex', alignItems: 'center', gap: 24}}>
              <div style={{fontFamily: theme.font, fontWeight: 900, fontSize: 90, color: theme.accent, textShadow: `0 0 50px ${theme.accentGlow}`}}>#8</div>
              <div style={{textAlign: 'left'}}>
                <T size={38} color={theme.textDim}>La más inteligente de todas</T>
                <br />
                <T size={48} color={theme.text} weight={900}>TE AUTORIZA A PERMITIRLO</T>
              </div>
            </Panel>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
