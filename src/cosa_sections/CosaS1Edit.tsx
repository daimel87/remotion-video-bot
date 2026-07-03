import {AbsoluteFill, useCurrentFrame, spring, useVideoConfig, interpolate} from 'remotion';
import {ZoomVideo, Scene, Panel, T, AccentLine, theme} from './kit';

export const CosaS1Edit: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // #7-style pulse helper for badge/teaser
  const teaserEnter = spring({frame: Math.max(0, frame - 1320), fps, config: {damping: 14, stiffness: 160}});
  const teaserScale = interpolate(teaserEnter, [0, 1], [0.5, 1]);

  return (
    <AbsoluteFill style={{backgroundColor: theme.bg}}>
      {/* Respeta el intro #1 ya incrustado (0-7s). Zoom motivado sutil el resto. */}
      <ZoomVideo
        src="cosa_s1.mp4"
        frames={[0, 175, 225, 900, 1320, 1478]}
        scales={[1.0, 1.0, 1.03, 1.06, 1.03, 1.06]}
      />

      {/* S1 ~9s: "Invierte la culpa" (derecha, concepto disruptivo) */}
      <Scene frameIn={225} frameOut={345} pos="right" maxWidth={640}>
        <Panel>
          <T size={40} color={theme.textDim}>Ella hace algo específico</T>
          <div style={{marginTop: 10}}>
            <T size={66} color={theme.accent} weight={900}>INVIERTE LA CULPA</T>
          </div>
          <div style={{fontSize: 56, marginTop: 6}}>🔄</div>
        </Panel>
      </Scene>

      {/* S2 ~16s: ecuación causa-efecto (banda inferior) */}
      <Scene frameIn={410} frameOut={540} pos="bottom">
        <Panel>
          <T size={52} color={theme.text}>Los celos son la </T>
          <T size={52} color={theme.accent} weight={900}>RESPUESTA</T>
          <T size={52} color={theme.text}>, no la causa</T>
          <AccentLine width={420} />
        </Panel>
      </Scene>

      {/* S3 ~24s: "el villano de tu propia historia" (izquierda) */}
      <Scene frameIn={610} frameOut={725} pos="left" maxWidth={640}>
        <Panel>
          <div style={{fontSize: 60, marginBottom: 6}}>🎭</div>
          <T size={44} color={theme.text}>Te convierte en</T>
          <br />
          <T size={64} color={theme.accent} weight={900}>EL VILLANO</T>
          <AccentLine width={380} />
        </Panel>
      </Scene>

      {/* S4 ~35s: punto más vulnerable (derecha, diana) */}
      <Scene frameIn={880} frameOut={1000} pos="right" maxWidth={640}>
        <Panel>
          <div style={{fontSize: 60, marginBottom: 6}}>🎯</div>
          <T size={40} color={theme.textDim}>Ataca tu punto más vulnerable</T>
          <div style={{marginTop: 8}}>
            <T size={62} color={theme.accent} weight={900}>TU AUTOCONFIANZA</T>
          </div>
        </Panel>
      </Scene>

      {/* S5 ~43s: dejarás de cuestionar (banda inferior) */}
      <Scene frameIn={1080} frameOut={1195} pos="bottom">
        <Panel>
          <T size={46} color={theme.text}>Si dudas de ti, </T>
          <T size={46} color={theme.accent} weight={900}>DEJARÁS DE CUESTIONAR</T>
        </Panel>
      </Scene>

      {/* S6 ~53s: open loop / teaser a la siguiente frase (centro-abajo) */}
      {frame >= 1320 && (
        <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 80}}>
          <div style={{transform: `scale(${teaserScale})`, opacity: interpolate(frame, [1320, 1335], [0, 1], {extrapolateRight: 'clamp'})}}>
            <Panel style={{display: 'flex', alignItems: 'center', gap: 24}}>
              <div style={{fontFamily: theme.font, fontWeight: 900, fontSize: 90, color: theme.accent, textShadow: `0 0 50px ${theme.accentGlow}`}}>#2</div>
              <div style={{textAlign: 'left'}}>
                <T size={38} color={theme.textDim}>La que usa cuando</T>
                <br />
                <T size={48} color={theme.text} weight={900}>LA PRIMERA NO FUNCIONA</T>
              </div>
            </Panel>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
