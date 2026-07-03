import {AbsoluteFill, useCurrentFrame, spring, useVideoConfig, interpolate} from 'remotion';
import {ZoomVideo, Scene, FullScreen, Panel, T, AccentLine, theme} from './kit';

export const S6 = {
  s1In: 205, s1Out: 300,   // ~8s  la verdad es más oscura
  s2In: 320, s2Out: 440,   // ~13s por qué oculta los mensajes
  s3In: 500, s3Out: 620,   // ~20s «solo» nunca significa solo
  fsIn: 660, fsOut: 780,   // ~26s FULL-SCREEN la más destructiva
  s5In: 830, s5Out: 950,   // ~33s «confía en mí» mata la sospecha
  s6In: 1025, s6Out: 1150, // ~41s entre dos paredes
  s7In: 1180, s7Out: 1270, // ~47s ella está del otro lado
  teaser: 1310,            // ~52s séptima frase
};

export const CosaS6Edit: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const teaserEnter = spring({frame: Math.max(0, frame - S6.teaser), fps, config: {damping: 14, stiffness: 160}});
  const teaserScale = interpolate(teaserEnter, [0, 1], [0.5, 1]);

  return (
    <AbsoluteFill style={{backgroundColor: theme.bg}}>
      <ZoomVideo
        src="cosa_s6.mp4"
        frames={[0, 175, 320, 440, 660, 780, 1025, 1180, 1310, 1503]}
        scales={[1.0, 1.0, 1.0, 1.05, 1.05, 1.0, 1.05, 1.0, 1.04, 1.07]}
      />

      {/* 1 · la verdad es más oscura (banda inferior) */}
      <Scene frameIn={S6.s1In} frameOut={S6.s1Out} pos="bottom">
        <Panel>
          <T size={44} color={theme.text}>Quieres confiar, pero </T>
          <T size={52} color={theme.accent} weight={900}>LA VERDAD ES MÁS OSCURA</T>
        </Panel>
      </Scene>

      {/* 2 · por qué oculta los mensajes (derecha, preguntas) */}
      <Scene frameIn={S6.s2In} frameOut={S6.s2Out} pos="right" maxWidth={680}>
        <Panel>
          <div style={{fontSize: 50, marginBottom: 6}}>📱</div>
          <T size={46} color={theme.accent} weight={900}>¿POR QUÉ OCULTA</T>
          <div style={{marginTop: 4}}><T size={46} color={theme.accent} weight={900}>LOS MENSAJES?</T></div>
          <div style={{marginTop: 8}}><T size={36} color={theme.text}>¿por qué a horas específicas?</T></div>
        </Panel>
      </Scene>

      {/* 3 · «solo» nunca significa solo (izquierda) */}
      <Scene frameIn={S6.s3In} frameOut={S6.s3Out} pos="left" maxWidth={640}>
        <Panel>
          <T size={44} color={theme.text}>La palabra "solo"</T>
          <br />
          <T size={56} color={theme.accent} weight={900}>NUNCA SIGNIFICA SOLO</T>
          <AccentLine width={420} />
        </Panel>
      </Scene>

      {/* 4 · FULL-SCREEN la más destructiva */}
      <FullScreen frameIn={S6.fsIn} frameOut={S6.fsOut} kicker="Apela a tu amor" big="La más destructiva" small={'"si confías, no preguntes"'} />

      {/* 5 · «confía en mí» mata la sospecha (derecha) */}
      <Scene frameIn={S6.s5In} frameOut={S6.s5Out} pos="right" maxWidth={680}>
        <Panel>
          <T size={40} color={theme.textDim}>"Confía en mí"</T>
          <div style={{marginTop: 8}}><T size={52} color={theme.accent} weight={900}>MATA CUALQUIER SOSPECHA</T></div>
        </Panel>
      </Scene>

      {/* 6 · entre dos paredes (izquierda, atrapado) */}
      <Scene frameIn={S6.s6In} frameOut={S6.s6Out} pos="left" maxWidth={680}>
        <Panel>
          <div style={{display: 'flex', alignItems: 'center', gap: 14, marginBottom: 6}}>
            <T size={40} color={theme.text} weight={900}>PREGUNTAS = celoso</T>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
            <T size={40} color={theme.text} weight={900}>DESCONFÍAS = paranoico</T>
          </div>
          <div style={{marginTop: 10}}><T size={50} color={theme.accent} weight={900}>ATRAPADO ENTRE DOS PAREDES</T></div>
        </Panel>
      </Scene>

      {/* 7 · ella está del otro lado (banda inferior) */}
      <Scene frameIn={S6.s7In} frameOut={S6.s7Out} pos="bottom">
        <Panel>
          <T size={44} color={theme.text}>Y ella está </T>
          <T size={44} color={theme.accent} weight={900}>DEL OTRO LADO</T>
        </Panel>
      </Scene>

      {/* 8 · teaser #7 */}
      {frame >= S6.teaser && (
        <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 80}}>
          <div style={{transform: `scale(${teaserScale})`, opacity: interpolate(frame, [S6.teaser, S6.teaser + 15], [0, 1], {extrapolateRight: 'clamp'})}}>
            <Panel style={{display: 'flex', alignItems: 'center', gap: 24}}>
              <div style={{fontFamily: theme.font, fontWeight: 900, fontSize: 90, color: theme.accent, textShadow: `0 0 50px ${theme.accentGlow}`}}>#7</div>
              <div style={{textAlign: 'left'}}>
                <T size={38} color={theme.textDim}>La séptima frase</T>
                <br />
                <T size={48} color={theme.text} weight={900}>BORRA LA REALIDAD</T>
              </div>
            </Panel>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
