import {AbsoluteFill, useCurrentFrame, spring, useVideoConfig, interpolate} from 'remotion';
import {ZoomVideo, Scene, FullScreen, Panel, T, AccentLine, theme} from './kit';

// Un estímulo cada ~5-6s. Frames (25fps) usados también para clavar SFX.
export const S3 = {
  s1In: 200, s1Out: 315,   // ~8s  «necesito espacio» (cita)
  fsIn: 325, fsOut: 445,   // ~13s FULL-SCREEN = libertad
  s3In: 475, s3Out: 585,   // ~19s justificar distanciamiento
  s4In: 600, s4Out: 700,   // ~24s ya hay alguien más
  s5In: 725, s5Out: 850,   // ~29s frase preparatoria
  s6In: 875, s6Out: 975,   // ~35s no te va a gustar
  s7In: 1000, s7Out: 1125, // ~40s no necesita espacios
  s8In: 1150, s8Out: 1290, // ~46s se sienten cerca
  s9In: 1325, s9Out: 1435, // ~53s ya la encontró en otro lado
  teaser: 1460,            // ~58s cuarta arma
};

export const CosaS3Edit: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const teaserEnter = spring({frame: Math.max(0, frame - S3.teaser), fps, config: {damping: 14, stiffness: 160}});
  const teaserScale = interpolate(teaserEnter, [0, 1], [0.5, 1]);

  return (
    <AbsoluteFill style={{backgroundColor: theme.bg}}>
      <ZoomVideo
        src="cosa_s3.mp4"
        frames={[0, 175, 325, 445, 600, 975, 1150, 1325, 1460, 1609]}
        scales={[1.0, 1.0, 1.0, 1.05, 1.05, 1.0, 1.05, 1.0, 1.04, 1.07]}
      />

      {/* 1 · cita «necesito espacio» (banda inferior) */}
      <Scene frameIn={S3.s1In} frameOut={S3.s1Out} pos="bottom">
        <Panel>
          <div style={{fontSize: 48, marginBottom: 2}}>🚪</div>
          <T size={54} color={theme.accent} weight={900}>"NECESITO ESPACIO"</T>
        </Panel>
      </Scene>

      {/* 2 · FULL-SCREEN significado real */}
      <FullScreen frameIn={S3.fsIn} frameOut={S3.fsOut} kicker="Lo que realmente significa" big="= Libertad" small="Sin rendir cuentas después" />

      {/* 3 · justificar el distanciamiento (derecha) */}
      <Scene frameIn={S3.s3In} frameOut={S3.s3Out} pos="right" maxWidth={660}>
        <Panel>
          <T size={40} color={theme.textDim}>"Somos diferentes" para</T>
          <div style={{marginTop: 8}}><T size={56} color={theme.accent} weight={900}>JUSTIFICAR EL DISTANCIAMIENTO</T></div>
        </Panel>
      </Scene>

      {/* 4 · ya hay alguien más (izquierda) */}
      <Scene frameIn={S3.s4In} frameOut={S3.s4Out} pos="left" maxWidth={620}>
        <Panel>
          <div style={{fontSize: 56, marginBottom: 6}}>👤</div>
          <T size={44} color={theme.text}>Sale cuando</T>
          <br />
          <T size={60} color={theme.accent} weight={900}>YA HAY ALGUIEN MÁS</T>
          <AccentLine width={400} />
        </Panel>
      </Scene>

      {/* 5 · frase preparatoria (derecha) */}
      <Scene frameIn={S3.s5In} frameOut={S3.s5Out} pos="right" maxWidth={660}>
        <Panel>
          <div style={{fontSize: 52, marginBottom: 6}}>🧩</div>
          <T size={40} color={theme.textDim}>Distancia emocional antes que física</T>
          <div style={{marginTop: 8}}><T size={56} color={theme.accent} weight={900}>FRASE PREPARATORIA</T></div>
        </Panel>
      </Scene>

      {/* 6 · no te va a gustar (banda inferior) */}
      <Scene frameIn={S3.s6In} frameOut={S3.s6Out} pos="bottom">
        <Panel>
          <T size={44} color={theme.text}>Sabe que lo que viene </T>
          <T size={44} color={theme.accent} weight={900}>NO TE VA A GUSTAR</T>
        </Panel>
      </Scene>

      {/* 7 · el amor sano no necesita espacios (izquierda) */}
      <Scene frameIn={S3.s7In} frameOut={S3.s7Out} pos="left" maxWidth={660}>
        <Panel>
          <div style={{fontSize: 52, marginBottom: 6}}>❤️</div>
          <T size={42} color={theme.text}>Una relación sana</T>
          <br />
          <T size={54} color={theme.accent} weight={900}>NO NECESITA "ESPACIOS"</T>
          <AccentLine width={420} />
        </Panel>
      </Scene>

      {/* 8 · se sienten cerca aunque separadas (derecha) */}
      <Scene frameIn={S3.s8In} frameOut={S3.s8Out} pos="right" maxWidth={660}>
        <Panel>
          <T size={40} color={theme.textDim}>Las parejas seguras</T>
          <div style={{marginTop: 8}}><T size={54} color={theme.accent} weight={900}>SE SIENTEN CERCA</T></div>
          <div style={{marginTop: 6}}><T size={36} color={theme.text}>aunque estén separadas</T></div>
        </Panel>
      </Scene>

      {/* 9 · ya la encontró en otro lado (banda inferior) */}
      <Scene frameIn={S3.s9In} frameOut={S3.s9Out} pos="bottom">
        <Panel>
          <T size={44} color={theme.text}>Necesita distancia porque </T>
          <T size={44} color={theme.accent} weight={900}>YA LA ENCONTRÓ EN OTRO LADO</T>
        </Panel>
      </Scene>

      {/* 10 · teaser #4 (centro-abajo) */}
      {frame >= S3.teaser && (
        <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 80}}>
          <div style={{transform: `scale(${teaserScale})`, opacity: interpolate(frame, [S3.teaser, S3.teaser + 15], [0, 1], {extrapolateRight: 'clamp'})}}>
            <Panel style={{display: 'flex', alignItems: 'center', gap: 24}}>
              <div style={{fontFamily: theme.font, fontWeight: 900, fontSize: 90, color: theme.accent, textShadow: `0 0 50px ${theme.accentGlow}`}}>#4</div>
              <div style={{textAlign: 'left'}}>
                <T size={38} color={theme.textDim}>La cuarta arma, más peligrosa</T>
                <br />
                <T size={48} color={theme.text} weight={900}>ATACA TU MENTE</T>
              </div>
            </Panel>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
