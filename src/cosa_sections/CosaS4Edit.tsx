import {AbsoluteFill, useCurrentFrame, spring, useVideoConfig, interpolate} from 'remotion';
import {ZoomVideo, Scene, FullScreen, Panel, T, AccentLine, theme} from './kit';

export const S4 = {
  fsIn: 220, fsOut: 335,   // ~9s  FULL-SCREEN GASLIGHTING
  s2In: 355, s2Out: 470,   // ~14s tienes pruebas
  s3In: 490, s3Out: 620,   // ~20s te hace dudar
  s4In: 650, s4Out: 770,   // ~26s la frase más peligrosa
  s5In: 800, s5Out: 920,   // ~32s tu propio enemigo
  s6In: 975, s6Out: 1100,  // ~39s sin herramientas
  s7In: 1150, s7Out: 1270, // ~46s cuando la confrontas
  teaser: 1320,            // ~53s invierte el juego
};

export const CosaS4Edit: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const teaserEnter = spring({frame: Math.max(0, frame - S4.teaser), fps, config: {damping: 14, stiffness: 160}});
  const teaserScale = interpolate(teaserEnter, [0, 1], [0.5, 1]);

  return (
    <AbsoluteFill style={{backgroundColor: theme.bg}}>
      <ZoomVideo
        src="cosa_s4.mp4"
        frames={[0, 175, 355, 470, 650, 920, 1150, 1320, 1412]}
        scales={[1.0, 1.0, 1.0, 1.05, 1.05, 1.0, 1.05, 1.04, 1.07]}
      />

      {/* 1 · FULL-SCREEN GASLIGHTING */}
      <FullScreen frameIn={S4.fsIn} frameOut={S4.fsOut} kicker="Minimiza tus sospechas" big="Gaslighting" small="Te enseña a no confiar en ti" />

      {/* 2 · tienes pruebas (izquierda) */}
      <Scene frameIn={S4.s2In} frameOut={S4.s2Out} pos="left" maxWidth={640}>
        <Panel>
          <div style={{fontSize: 52, marginBottom: 6}}>🔍</div>
          <T size={42} color={theme.text}>Tú tienes</T>
          <br />
          <T size={54} color={theme.accent} weight={900}>PRUEBAS · EVIDENCIA</T>
          <div style={{marginTop: 6}}><T size={38} color={theme.text}>intuición de patrones</T></div>
        </Panel>
      </Scene>

      {/* 3 · te hace dudar de todo (derecha) */}
      <Scene frameIn={S4.s3In} frameOut={S4.s3Out} pos="right" maxWidth={640}>
        <Panel>
          <T size={40} color={theme.textDim}>Y ella</T>
          <div style={{marginTop: 8}}><T size={58} color={theme.accent} weight={900}>TE HACE DUDAR DE TODO</T></div>
          <div style={{marginTop: 6}}><T size={36} color={theme.text}>mientras sigue haciéndolo</T></div>
        </Panel>
      </Scene>

      {/* 4 · la frase más peligrosa (banda inferior, fuerte) */}
      <Scene frameIn={S4.s4In} frameOut={S4.s4Out} pos="bottom">
        <Panel>
          <div style={{fontSize: 48, marginBottom: 2}}>⚠️</div>
          <T size={44} color={theme.text}>Es </T>
          <T size={56} color={theme.accent} weight={900}>LA FRASE MÁS PELIGROSA</T>
        </Panel>
      </Scene>

      {/* 5 · tu propio enemigo (izquierda) */}
      <Scene frameIn={S4.s5In} frameOut={S4.s5Out} pos="left" maxWidth={620}>
        <Panel>
          <div style={{fontSize: 54, marginBottom: 6}}>🪞</div>
          <T size={42} color={theme.text}>Te vuelves</T>
          <br />
          <T size={60} color={theme.accent} weight={900}>TU PROPIO ENEMIGO</T>
          <AccentLine width={400} />
        </Panel>
      </Scene>

      {/* 6 · sin herramientas para defenderte (derecha) */}
      <Scene frameIn={S4.s6In} frameOut={S4.s6Out} pos="right" maxWidth={660}>
        <Panel>
          <T size={40} color={theme.textDim}>Ella sonríe: ya no tienes</T>
          <div style={{marginTop: 8}}><T size={52} color={theme.accent} weight={900}>HERRAMIENTAS PARA DEFENDERTE</T></div>
        </Panel>
      </Scene>

      {/* 7 · cuando la confrontas (banda inferior) */}
      <Scene frameIn={S4.s7In} frameOut={S4.s7Out} pos="bottom">
        <Panel>
          <T size={44} color={theme.text}>Y cuando por fin </T>
          <T size={44} color={theme.accent} weight={900}>LA CONFRONTAS...</T>
        </Panel>
      </Scene>

      {/* 8 · teaser #5 */}
      {frame >= S4.teaser && (
        <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 80}}>
          <div style={{transform: `scale(${teaserScale})`, opacity: interpolate(frame, [S4.teaser, S4.teaser + 15], [0, 1], {extrapolateRight: 'clamp'})}}>
            <Panel style={{display: 'flex', alignItems: 'center', gap: 24}}>
              <div style={{fontFamily: theme.font, fontWeight: 900, fontSize: 90, color: theme.accent, textShadow: `0 0 50px ${theme.accentGlow}`}}>#5</div>
              <div style={{textAlign: 'left'}}>
                <T size={38} color={theme.textDim}>La quinta frase</T>
                <br />
                <T size={48} color={theme.text} weight={900}>INVIERTE EL JUEGO</T>
              </div>
            </Panel>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
