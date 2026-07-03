import {AbsoluteFill, useCurrentFrame, spring, useVideoConfig, interpolate} from 'remotion';
import {ZoomVideo, Scene, FullScreen, Panel, T, AccentLine, theme} from './kit';

// Frames clave (25fps) — un estímulo cada ~5-6s. También usados para clavar los SFX.
export const S2 = {
  fsIn: 200, fsOut: 320,   // ~8s  full-screen PRE-JUSTIFICACIÓN
  s2In: 350, s2Out: 465,   // ~14s coartada lista
  s3In: 525, s3Out: 640,   // ~21s armando excusas
  s4In: 690, s4Out: 800,   // ~28s antes de que sospeches
  s5In: 840, s5Out: 950,   // ~34s es delatador
  s6In: 1000, s6Out: 1110, // ~40s compensando
  s7In: 1150, s7Out: 1260, // ~46s simplemente sucedería
  s8In: 1300, s8Out: 1410, // ~52s construye la narrativa
  teaser: 1450,            // ~58s escape final
};

export const CosaS2Edit: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const teaserEnter = spring({frame: Math.max(0, frame - S2.teaser), fps, config: {damping: 14, stiffness: 160}});
  const teaserScale = interpolate(teaserEnter, [0, 1], [0.5, 1]);

  return (
    <AbsoluteFill style={{backgroundColor: theme.bg}}>
      <ZoomVideo
        src="cosa_s2.mp4"
        frames={[0, 175, 350, 465, 690, 950, 1150, 1300, 1450, 1634]}
        scales={[1.0, 1.0, 1.0, 1.05, 1.05, 1.0, 1.05, 1.0, 1.04, 1.07]}
      />

      {/* 1 · FULL-SCREEN concepto */}
      <FullScreen frameIn={S2.fsIn} frameOut={S2.fsOut} kicker="Lo que ella hace" big="Pre-justificación" small="Explica lo que nadie le preguntó" />

      {/* 2 · cita coartada (derecha) */}
      <Scene frameIn={S2.s2In} frameOut={S2.s2Out} pos="right" maxWidth={660}>
        <Panel>
          <div style={{fontSize: 54, marginBottom: 4}}>🗣️</div>
          <T size={40} color={theme.textDim}>Es como decir:</T>
          <div style={{marginTop: 8}}><T size={56} color={theme.accent} weight={900}>"TENGO UNA COARTADA LISTA"</T></div>
        </Panel>
      </Scene>

      {/* 3 · armando excusas (izquierda) */}
      <Scene frameIn={S2.s3In} frameOut={S2.s3Out} pos="left" maxWidth={640}>
        <Panel>
          <div style={{fontSize: 58, marginBottom: 6}}>🧠</div>
          <T size={42} color={theme.text}>Su mente culpable</T>
          <br />
          <T size={60} color={theme.accent} weight={900}>ARMANDO EXCUSAS</T>
          <AccentLine width={400} />
        </Panel>
      </Scene>

      {/* 4 · antes de que sospeches (banda inferior) */}
      <Scene frameIn={S2.s4In} frameOut={S2.s4Out} pos="bottom">
        <Panel>
          <T size={46} color={theme.text}>Todo listo </T>
          <T size={46} color={theme.accent} weight={900}>ANTES DE QUE SOSPECHES</T>
        </Panel>
      </Scene>

      {/* 5 · es delatador (derecha) */}
      <Scene frameIn={S2.s5In} frameOut={S2.s5Out} pos="right" maxWidth={640}>
        <Panel>
          <div style={{fontSize: 54, marginBottom: 6}}>🚩</div>
          <T size={40} color={theme.textDim}>Explicar sin que preguntes</T>
          <div style={{marginTop: 8}}><T size={62} color={theme.accent} weight={900}>ES DELATADOR</T></div>
        </Panel>
      </Scene>

      {/* 6 · compensando (izquierda) */}
      <Scene frameIn={S2.s6In} frameOut={S2.s6Out} pos="left" maxWidth={640}>
        <Panel>
          <T size={40} color={theme.textDim}>Está </T>
          <T size={58} color={theme.accent} weight={900}>COMPENSANDO</T>
          <div style={{marginTop: 8}}><T size={38} color={theme.text}>borrando culpa con palabras</T></div>
        </Panel>
      </Scene>

      {/* 7 · simplemente sucedería (banda inferior) */}
      <Scene frameIn={S2.s7In} frameOut={S2.s7Out} pos="bottom">
        <Panel>
          <T size={44} color={theme.text}>Si fuera verdad, </T>
          <T size={44} color={theme.accent} weight={900}>SIMPLEMENTE SUCEDERÍA</T>
        </Panel>
      </Scene>

      {/* 8 · construye la narrativa (derecha) */}
      <Scene frameIn={S2.s8In} frameOut={S2.s8Out} pos="right" maxWidth={640}>
        <Panel>
          <div style={{fontSize: 54, marginBottom: 6}}>📝</div>
          <T size={40} color={theme.textDim}>Hay algo más y</T>
          <div style={{marginTop: 8}}><T size={56} color={theme.accent} weight={900}>CONSTRUYE LA NARRATIVA</T></div>
        </Panel>
      </Scene>

      {/* 9 · teaser #3 (centro-abajo) */}
      {frame >= S2.teaser && (
        <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 80}}>
          <div style={{transform: `scale(${teaserScale})`, opacity: interpolate(frame, [S2.teaser, S2.teaser + 15], [0, 1], {extrapolateRight: 'clamp'})}}>
            <Panel style={{display: 'flex', alignItems: 'center', gap: 24}}>
              <div style={{fontFamily: theme.font, fontWeight: 900, fontSize: 90, color: theme.accent, textShadow: `0 0 50px ${theme.accentGlow}`}}>#3</div>
              <div style={{textAlign: 'left'}}>
                <T size={38} color={theme.textDim}>La frase que prepara</T>
                <br />
                <T size={48} color={theme.text} weight={900}>EL ESCAPE FINAL</T>
              </div>
            </Panel>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
