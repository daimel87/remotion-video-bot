import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {BigTextGraphic} from './components/BigTextGraphic';
import {InfielTitleGraphic} from './components/InfielTitleGraphic';

export const Gacrux1Edit: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>

      <OffthreadVideo src={staticFile('gacrux_1.mp4')} />

      {/* BigTextGraphic sobre la última frase del avatar */}
      <Sequence from={593} durationInFrames={285}>
        <BigTextGraphic
          text="Hoy te voy a mostrar exactamente qué hace. Y cuando termines este video, ya no vas a poder ignorarlo."
          highlight="ya no vas a poder ignorarlo."
        />
      </Sequence>

      {/* GRÁFICO 1 — Título animado */}
      <Sequence from={878} durationInFrames={175}>
        <InfielTitleGraphic />
      </Sequence>

    </AbsoluteFill>
  );
};
