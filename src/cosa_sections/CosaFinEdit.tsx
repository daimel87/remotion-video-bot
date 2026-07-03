import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {ZoomVideo, Scene, Panel, T, AccentLine, theme} from './kit';

// Cierre/CTA — respeta el gráfico incrustado "La verdad siempre encuentra una salida" (18-26s).
export const FIN = {
  s1In: 20, s1Out: 135,   // ~1s  ¿cuántas reconociste?
  s2In: 145, s2Out: 215,  // ~6s  ¿cuál te dolió más?
  s3In: 230, s3Out: 335,  // ~9s  suscríbete
  s4In: 340, s4Out: 445,  // ~14s dale like
};

export const CosaFinEdit: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{backgroundColor: theme.bg}}>
      <ZoomVideo
        src="cosa_final.mp4"
        frames={[0, 230, 340, 445, 451, 653]}
        scales={[1.0, 1.03, 1.05, 1.05, 1.0, 1.0]}
      />

      {/* 1 · ¿cuántas reconociste? (banda inferior) */}
      <Scene frameIn={FIN.s1In} frameOut={FIN.s1Out} pos="bottom">
        <Panel>
          <div style={{fontSize: 48, marginBottom: 2}}>💬</div>
          <T size={44} color={theme.text}>Cuéntame: </T>
          <T size={52} color={theme.accent} weight={900}>¿CUÁNTAS RECONOCISTE?</T>
        </Panel>
      </Scene>

      {/* 2 · ¿cuál te dolió más? (banda inferior) */}
      <Scene frameIn={FIN.s2In} frameOut={FIN.s2Out} pos="bottom">
        <Panel>
          <T size={46} color={theme.text}>¿Cuál te </T>
          <T size={52} color={theme.accent} weight={900}>DOLIÓ MÁS ESCUCHAR?</T>
        </Panel>
      </Scene>

      {/* 3 · suscríbete (derecha, CTA fuerte) */}
      <Scene frameIn={FIN.s3In} frameOut={FIN.s3Out} pos="right" maxWidth={640}>
        <Panel>
          <div style={{fontSize: 72, marginBottom: 6}}>🔔</div>
          <T size={64} color={theme.accent} weight={900}>SUSCRÍBETE</T>
          <div style={{marginTop: 6}}><T size={34} color={theme.text}>más psicología de relaciones</T></div>
          <AccentLine width={380} />
        </Panel>
      </Scene>

      {/* 4 · dale like (izquierda, CTA) */}
      <Scene frameIn={FIN.s4In} frameOut={FIN.s4Out} pos="left" maxWidth={620}>
        <Panel>
          <div style={{fontSize: 72, marginBottom: 6}}>👍</div>
          <T size={64} color={theme.accent} weight={900}>DALE LIKE</T>
          <div style={{marginTop: 6}}><T size={34} color={theme.text}>si reconociste al menos una</T></div>
        </Panel>
      </Scene>

      {/* 18-26s: gráfico "La verdad siempre encuentra una salida" ya incrustado — respetado */}
    </AbsoluteFill>
  );
};
