import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {ZoomVideo, Scene, FullScreen, Panel, T, AccentLine, theme} from './kit';

// Última sección — cierra con full-screen "DEMASIADO TARDE" (sin teaser).
export const S8 = {
  fsIn: 245, fsOut: 350,   // ~9.8s FULL-SCREEN privacidad ≠ secretos
  s2In: 350, s2Out: 500,   // ~14s  comparación
  s3In: 508, s3Out: 600,   // ~20s  mezcla ambos
  s4In: 612, s4Out: 700,   // ~24.5s el cierre perfecto
  s5In: 695, s5Out: 850,   // ~28s  permiso bajo disfraz
  s6In: 858, s6Out: 960,   // ~34s  sin herramientas
  s7In: 985, s7Out: 1105,  // ~39s  autorizaste cada paso
  finalIn: 1120,           // ~45s  FULL-SCREEN demasiado tarde
};

export const CosaS8Edit: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{backgroundColor: theme.bg}}>
      <ZoomVideo
        src="cosa_s8.mp4"
        frames={[0, 175, 350, 500, 612, 850, 985, 1105, 1120, 1264]}
        scales={[1.0, 1.0, 1.0, 1.05, 1.05, 1.0, 1.05, 1.05, 1.0, 1.0]}
      />

      {/* 1 · FULL-SCREEN privacidad ≠ secretos */}
      <FullScreen frameIn={S8.fsIn} frameOut={S8.fsOut} kicker="Hay una diferencia" big="Privacidad ≠ Secretos" small="y ella los mezcla a propósito" />

      {/* 2 · comparación (centro-abajo, dos columnas) */}
      <Scene frameIn={S8.s2In} frameOut={S8.s2Out} pos="bottom">
        <Panel style={{display: 'flex', alignItems: 'stretch', gap: 40}}>
          <div style={{textAlign: 'left', paddingRight: 36, borderRight: `2px solid ${theme.panelBorder}`}}>
            <T size={34} color={theme.textDim}>PRIVACIDAD</T>
            <div><T size={40} color={theme.text} weight={900}>No leer sus ideas</T></div>
          </div>
          <div style={{textAlign: 'left'}}>
            <T size={34} color={theme.textDim}>SECRETOS</T>
            <div><T size={40} color={theme.accent} weight={900}>Ocultar hechos que te afectan</T></div>
          </div>
        </Panel>
      </Scene>

      {/* 3 · mezcla ambos (derecha) */}
      <Scene frameIn={S8.s3In} frameOut={S8.s3Out} pos="right" maxWidth={640}>
        <Panel>
          <T size={40} color={theme.textDim}>Mezcla ambos para</T>
          <div style={{marginTop: 8}}><T size={54} color={theme.accent} weight={900}>JUSTIFICAR SU OPACIDAD</T></div>
        </Panel>
      </Scene>

      {/* 4 · el cierre perfecto (izquierda) */}
      <Scene frameIn={S8.s4In} frameOut={S8.s4Out} pos="left" maxWidth={620}>
        <Panel>
          <div style={{fontSize: 52, marginBottom: 6}}>🔒</div>
          <T size={42} color={theme.text}>Es el</T>
          <br />
          <T size={58} color={theme.accent} weight={900}>CIERRE PERFECTO</T>
          <AccentLine width={400} />
        </Panel>
      </Scene>

      {/* 5 · permiso bajo disfraz (derecha) */}
      <Scene frameIn={S8.s5In} frameOut={S8.s5Out} pos="right" maxWidth={660}>
        <Panel>
          <T size={40} color={theme.textDim}>Ahora tiene permiso</T>
          <div style={{marginTop: 8}}><T size={50} color={theme.accent} weight={900}>BAJO EL DISFRAZ DE "PRIVACIDAD"</T></div>
        </Panel>
      </Scene>

      {/* 6 · sin herramientas para tu paz (izquierda) */}
      <Scene frameIn={S8.s6In} frameOut={S8.s6Out} pos="left" maxWidth={660}>
        <Panel>
          <T size={42} color={theme.text}>Quedaste</T>
          <br />
          <T size={54} color={theme.accent} weight={900}>SIN HERRAMIENTAS PARA TU PAZ</T>
        </Panel>
      </Scene>

      {/* 7 · autorizaste cada paso (derecha) */}
      <Scene frameIn={S8.s7In} frameOut={S8.s7Out} pos="right" maxWidth={660}>
        <Panel>
          <T size={40} color={theme.textDim}>El patrón está completo:</T>
          <div style={{marginTop: 8}}><T size={54} color={theme.accent} weight={900}>AUTORIZASTE CADA PASO</T></div>
        </Panel>
      </Scene>

      {/* 8 · FULL-SCREEN cierre demasiado tarde */}
      {frame >= S8.finalIn && (
        <FullScreen frameIn={S8.finalIn} frameOut={1264} kicker="La mayoría se da cuenta" big="Demasiado tarde" />
      )}
    </AbsoluteFill>
  );
};
