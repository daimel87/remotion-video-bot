import {AbsoluteFill, useCurrentFrame, spring, useVideoConfig, interpolate} from 'remotion';
import {ZoomVideo, Scene, FullScreen, Panel, T, AccentLine, theme} from '../cosa_sections/kit';

// 13 estímulos (mezcla overlay + 3 full-screen), uno cada ~6-7s. 25fps.
export const MC1 = {
  s1In: 15, s1Out: 150,     // ~1s   hay una razón que no crees
  fsAIn: 160, fsAOut: 330,  // ~6.4s FULL-SCREEN no es sexo/dinero/otro
  s3In: 345, s3Out: 500,    // ~14s  meses o años antes
  s4In: 510, s4Out: 700,    // ~20s  señales que nadie nota a tiempo
  fsBIn: 712, fsBOut: 860,  // ~28.5s FULL-SCREEN teaser minuto 6
  s6In: 872, s6Out: 1050,   // ~35s  desconexión emocional progresiva
  s7In: 1060, s7Out: 1180,  // ~42s  cerebro femenino / vacío afectivo
  fsCIn: 1185, fsCOut: 1310, // ~47.5s FULL-SCREEN 4 etapas
  s9In: 1320, s9Out: 1470,  // ~53s  no es para justificar
  s10In: 1480, s10Out: 1650, // ~59s  romper el mito más grande
  s11In: 1660, s11Out: 1865, // ~66.5s la causa raíz que nadie menciona
  s12In: 1875, s12Out: 1975, // ~75s  señales que confunden hasta relaciones sanas
  s13In: 1985,               // ~79.5s presta mucha atención
};

export const MujerCasada1Edit: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s13Enter = spring({frame: Math.max(0, frame - MC1.s13In), fps, config: {damping: 14, stiffness: 160}});
  const s13Scale = interpolate(s13Enter, [0, 1], [0.6, 1]);

  return (
    <AbsoluteFill style={{backgroundColor: theme.bg}}>
      <ZoomVideo
        src="mujer_casada_1.mp4"
        frames={[0, 160, 330, 712, 860, 1185, 1310, 1660, 1985, 2154]}
        scales={[1.0, 1.0, 1.04, 1.04, 1.0, 1.05, 1.05, 1.0, 1.03, 1.06]}
      />

      {/* 1 · hay una razón que no crees (banda inferior) */}
      <Scene frameIn={MC1.s1In} frameOut={MC1.s1Out} pos="bottom">
        <Panel>
          <T size={44} color={theme.text}>Hay una razón… </T>
          <T size={50} color={theme.accent} weight={900}>Y NO ES LA QUE CREES</T>
        </Panel>
      </Scene>

      {/* 2 · FULL-SCREEN no es sexo, dinero, ni el otro */}
      <FullScreen frameIn={MC1.fsAIn} frameOut={MC1.fsAOut} kicker="No es lo que piensas" big="No es sexo. No es dinero." small="No es el otro." />

      {/* 3 · meses o años antes (izquierda) */}
      <Scene frameIn={MC1.s3In} frameOut={MC1.s3Out} pos="left" maxWidth={640}>
        <Panel>
          <div style={{fontSize: 52, marginBottom: 6}}>🧠</div>
          <T size={42} color={theme.text}>Empieza en su mente</T>
          <br />
          <T size={56} color={theme.accent} weight={900}>MESES O AÑOS ANTES</T>
          <AccentLine width={420} />
        </Panel>
      </Scene>

      {/* 4 · señales que nadie nota a tiempo (derecha) */}
      <Scene frameIn={MC1.s4In} frameOut={MC1.s4Out} pos="right" maxWidth={660}>
        <Panel>
          <T size={40} color={theme.textDim}>Las señales que</T>
          <div style={{marginTop: 8}}><T size={52} color={theme.accent} weight={900}>CASI NADIE NOTA A TIEMPO</T></div>
        </Panel>
      </Scene>

      {/* 5 · FULL-SCREEN teaser minuto 6 (open loop fuerte) */}
      <FullScreen frameIn={MC1.fsBIn} frameOut={MC1.fsBOut} kicker="Quédate hasta el" big="Minuto 6" small="cambiará cómo ves esto para siempre" />

      {/* 6 · desconexión emocional progresiva (banda inferior, término clave) */}
      <Scene frameIn={MC1.s6In} frameOut={MC1.s6Out} pos="bottom">
        <Panel>
          <div style={{fontSize: 46, marginBottom: 2}}>💔</div>
          <T size={50} color={theme.accent} weight={900}>DESCONEXIÓN EMOCIONAL PROGRESIVA</T>
        </Panel>
      </Scene>

      {/* 7 · cerebro femenino / vacío afectivo (izquierda) */}
      <Scene frameIn={MC1.s7In} frameOut={MC1.s7Out} pos="left" maxWidth={660}>
        <Panel>
          <T size={40} color={theme.textDim}>El cerebro femenino y el</T>
          <div style={{marginTop: 8}}><T size={54} color={theme.accent} weight={900}>VACÍO AFECTIVO</T></div>
        </Panel>
      </Scene>

      {/* 8 · FULL-SCREEN 4 etapas (estructura clave del video) */}
      <FullScreen frameIn={MC1.fsCIn} frameOut={MC1.fsCOut} kicker="Antes de cruzar la línea" big="4 etapas" />

      {/* 9 · no es para justificar (derecha) */}
      <Scene frameIn={MC1.s9In} frameOut={MC1.s9Out} pos="right" maxWidth={660}>
        <Panel>
          <T size={42} color={theme.text}>No es para justificar…</T>
          <div style={{marginTop: 8}}><T size={48} color={theme.accent} weight={900}>ES PARA ENTENDER</T></div>
        </Panel>
      </Scene>

      {/* 10 · romper el mito más grande (izquierda) */}
      <Scene frameIn={MC1.s10In} frameOut={MC1.s10Out} pos="left" maxWidth={640}>
        <Panel>
          <div style={{fontSize: 50, marginBottom: 6}}>💥</div>
          <T size={54} color={theme.accent} weight={900}>EL MITO MÁS GRANDE</T>
        </Panel>
      </Scene>

      {/* 11 · la causa raíz que nadie menciona (derecha) */}
      <Scene frameIn={MC1.s11In} frameOut={MC1.s11Out} pos="right" maxWidth={660}>
        <Panel>
          <T size={40} color={theme.textDim}>La causa raíz</T>
          <div style={{marginTop: 8}}><T size={50} color={theme.accent} weight={900}>QUE NADIE MENCIONA</T></div>
        </Panel>
      </Scene>

      {/* 12 · señales que confunden relaciones sanas (banda inferior) */}
      <Scene frameIn={MC1.s12In} frameOut={MC1.s12Out} pos="bottom">
        <Panel>
          <T size={42} color={theme.text}>Confunden hasta </T>
          <T size={48} color={theme.accent} weight={900}>LAS RELACIONES MÁS SANAS</T>
        </Panel>
      </Scene>

      {/* 13 · presta mucha atención (centro-abajo, cierre del segmento) */}
      {frame >= MC1.s13In && (
        <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 80}}>
          <div style={{transform: `scale(${s13Scale})`, opacity: interpolate(frame, [MC1.s13In, MC1.s13In + 15], [0, 1], {extrapolateRight: 'clamp'})}}>
            <Panel>
              <div style={{fontSize: 48, marginBottom: 2}}>⚠️</div>
              <T size={50} color={theme.accent} weight={900}>PRESTA MUCHA ATENCIÓN</T>
            </Panel>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
