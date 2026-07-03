import {AbsoluteFill, useCurrentFrame, spring, useVideoConfig, interpolate} from 'remotion';
import {ZoomVideo, Scene, FullScreen, Panel, T, AccentLine, theme} from './kit';

// Frames clave (25fps) — usados también para clavar los SFX
export const S2 = {
  fsIn: 230, fsOut: 360, // full-screen PRE-JUSTIFICACIÓN
  s2In: 390, s2Out: 495, // coartada lista
  s3In: 590, s3Out: 705, // armando excusas
  s4In: 875, s4Out: 980, // delatador
  s5In: 1010, s5Out: 1130, // compensando
  teaser: 1440,
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
        frames={[0, 175, 230, 360, 590, 980, 1130, 1440, 1634]}
        scales={[1.0, 1.0, 1.0, 1.05, 1.05, 1.0, 1.04, 1.04, 1.07]}
      />

      {/* S1 FULL-SCREEN: definición del concepto */}
      <FullScreen
        frameIn={S2.fsIn}
        frameOut={S2.fsOut}
        kicker="Lo que ella hace"
        big="Pre-justificación"
        small="Explica lo que nadie le preguntó"
      />

      {/* S2 cita: "tengo una coartada lista" (derecha) */}
      <Scene frameIn={S2.s2In} frameOut={S2.s2Out} pos="right" maxWidth={660}>
        <Panel>
          <div style={{fontSize: 54, marginBottom: 4}}>🗣️</div>
          <T size={40} color={theme.textDim}>Es como decir:</T>
          <div style={{marginTop: 8}}>
            <T size={58} color={theme.accent} weight={900}>"TENGO UNA COARTADA LISTA"</T>
          </div>
        </Panel>
      </Scene>

      {/* S3 "creando historias, armando excusas" (izquierda) */}
      <Scene frameIn={S2.s3In} frameOut={S2.s3Out} pos="left" maxWidth={640}>
        <Panel>
          <div style={{fontSize: 58, marginBottom: 6}}>🧠</div>
          <T size={42} color={theme.text}>Su mente culpable</T>
          <br />
          <T size={60} color={theme.accent} weight={900}>ARMANDO EXCUSAS</T>
          <AccentLine width={400} />
        </Panel>
      </Scene>

      {/* S4 "eso es delatador" (banda inferior) */}
      <Scene frameIn={S2.s4In} frameOut={S2.s4Out} pos="bottom">
        <Panel>
          <T size={46} color={theme.text}>Explicar sin que preguntes </T>
          <T size={46} color={theme.accent} weight={900}>ES DELATADOR</T>
        </Panel>
      </Scene>

      {/* S5 "compensando / borrando culpa con palabras" (derecha) */}
      <Scene frameIn={S2.s5In} frameOut={S2.s5Out} pos="right" maxWidth={660}>
        <Panel>
          <T size={40} color={theme.textDim}>Está </T>
          <T size={58} color={theme.accent} weight={900}>COMPENSANDO</T>
          <div style={{marginTop: 8}}>
            <T size={40} color={theme.text}>borrando culpa con palabras</T>
          </div>
        </Panel>
      </Scene>

      {/* S6 teaser #3 (centro-abajo) */}
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
