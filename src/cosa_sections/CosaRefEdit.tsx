import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {ZoomVideo, Scene, FullScreen, Panel, T, AccentLine, theme} from './kit';

// Reflexión — respeta el título "8 SEÑALES" ya incrustado (0-7s). Cierra con full-screen.
export const REF = {
  s1In: 190, s1Out: 285,   // ~8s  más de 3 = no es coincidencia
  fsIn: 290, fsOut: 400,   // ~11.6s FULL-SCREEN patrón de manipulación
  s3In: 410, s3Out: 535,   // ~16s  propósito: hacerte dudar
  s4In: 545, s4Out: 645,   // ~22s  las palabras no mienten
  s5In: 652, s5Out: 755,   // ~26s  tu intuición no miente
  s6In: 760, s6Out: 858,   // ~30s  lo único que miente es ella
  s7In: 862, s7Out: 985,   // ~34.5s no es accidente
  s7bIn: 990, s7bOut: 1045, // ~39.6s es control · manipulación
  finalIn: 1050,           // ~42s  FULL-SCREEN mereces la verdad
};

export const CosaRefEdit: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{backgroundColor: theme.bg}}>
      <ZoomVideo
        src="cosa_reflexion.mp4"
        frames={[0, 175, 290, 400, 545, 755, 862, 985, 1050, 1108]}
        scales={[1.0, 1.0, 1.0, 1.05, 1.05, 1.0, 1.05, 1.05, 1.0, 1.0]}
      />

      {/* 1 · más de 3 = no es coincidencia (banda inferior) */}
      <Scene frameIn={REF.s1In} frameOut={REF.s1Out} pos="bottom">
        <Panel>
          <T size={46} color={theme.text}>¿Más de 3? </T>
          <T size={52} color={theme.accent} weight={900}>NO ES COINCIDENCIA</T>
        </Panel>
      </Scene>

      {/* 2 · FULL-SCREEN patrón de manipulación */}
      <FullScreen frameIn={REF.fsIn} frameOut={REF.fsOut} kicker="No son frases sueltas" big="Un patrón" small="de manipulación" />

      {/* 3 · propósito: hacerte dudar (derecha) */}
      <Scene frameIn={REF.s3In} frameOut={REF.s3Out} pos="right" maxWidth={660}>
        <Panel>
          <T size={40} color={theme.textDim}>Su único propósito:</T>
          <div style={{marginTop: 8}}><T size={58} color={theme.accent} weight={900}>HACERTE DUDAR</T></div>
          <div style={{marginTop: 6}}><T size={34} color={theme.text}>de ti, de tu intuición, de la verdad</T></div>
        </Panel>
      </Scene>

      {/* 4 · las palabras no mienten (izquierda) */}
      <Scene frameIn={REF.s4In} frameOut={REF.s4Out} pos="left" maxWidth={620}>
        <Panel>
          <div style={{fontSize: 50, marginBottom: 6}}>💬</div>
          <T size={54} color={theme.accent} weight={900}>LAS PALABRAS NO MIENTEN</T>
          <AccentLine width={420} />
        </Panel>
      </Scene>

      {/* 5 · tu intuición no miente (derecha) */}
      <Scene frameIn={REF.s5In} frameOut={REF.s5Out} pos="right" maxWidth={620}>
        <Panel>
          <div style={{fontSize: 50, marginBottom: 6}}>🧭</div>
          <T size={54} color={theme.accent} weight={900}>TU INTUICIÓN NO MIENTE</T>
        </Panel>
      </Scene>

      {/* 6 · lo único que miente es ella (banda inferior, fuerte) */}
      <Scene frameIn={REF.s6In} frameOut={REF.s6Out} pos="bottom">
        <Panel>
          <T size={44} color={theme.text}>Lo único que miente… </T>
          <T size={56} color={theme.accent} weight={900}>ES ELLA</T>
        </Panel>
      </Scene>

      {/* 7 · no es accidente (izquierda) */}
      <Scene frameIn={REF.s7In} frameOut={REF.s7Out} pos="left" maxWidth={640}>
        <Panel>
          <div style={{fontSize: 50, marginBottom: 6}}>⚠️</div>
          <T size={56} color={theme.accent} weight={900}>NO ES ACCIDENTE</T>
        </Panel>
      </Scene>

      {/* 7b · es control · manipulación (banda inferior) */}
      <Scene frameIn={REF.s7bIn} frameOut={REF.s7bOut} pos="bottom">
        <Panel>
          <T size={52} color={theme.accent} weight={900}>ES CONTROL · MANIPULACIÓN</T>
        </Panel>
      </Scene>

      {/* 8 · FULL-SCREEN cierre mereces la verdad */}
      {frame >= REF.finalIn && (
        <FullScreen frameIn={REF.finalIn} frameOut={1105} kicker="Y tú" big="Mereces la verdad" />
      )}
    </AbsoluteFill>
  );
};
