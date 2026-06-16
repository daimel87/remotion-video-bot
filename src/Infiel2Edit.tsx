import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {CaptionBox} from './components/CaptionBox';
import {InfielSignalGraphic} from './components/InfielSignalGraphic';

// Timeline (25fps) — clip: infiel_2.mp4
// ⚠️ Ajusta los frames según duración real del clip
//
// PUENTE avatar (0-330):
//   0-175    "Antes de empezar, una aclaración importante. Ninguna de estas señales por sí sola confirma una infidelidad."
//   175-330  "Lo que debes observar es el patrón. Cuando varias ocurren juntas, de forma repetida, ahí está la respuesta."
//
// GRÁFICO #1 señal (330-505):
//   330-505  InfielSignalGraphic "#1 / VA DIRECTO AL BAÑO"
//
// SEÑAL 1 avatar (505-1980):
//   505-730   "La primera cosa que hace una mujer infiel al llegar a casa es ir directo al baño."
//   730-880   "Sin saludarte bien. Sin sentarse. Sin contarte cómo le fue."
//   880-1130  "Y no hablo de cuando llega del gimnasio o de un día de calor. Hablo de cuando esto se convierte en un hábito nuevo. Algo que antes no hacía."
//   1130-1480 "La psicología lo explica de forma simple: el baño es el primer lugar donde puede eliminar evidencia. Perfume, mensajes, el estado de ánimo que traía de afuera."
//   1480-1730 "Pregúntate: ¿antes llegaba y te buscaba? ¿Y ahora lo primero que hace es desaparecer diez minutos?"
//   1730-1980 "Eso no es higiene. Eso es protocolo."
//
// Total estimado: 1980 frames (~79 segundos)

export const Infiel2Edit: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>

      <OffthreadVideo src={staticFile('infiel_2.mp4')} endAt={1630} />

      {/* PUENTE */}
      <Sequence from={0} durationInFrames={175}>
        <CaptionBox text="Antes de empezar: ninguna de estas señales por sí sola confirma una infidelidad." />
      </Sequence>

      <Sequence from={175} durationInFrames={155}>
        <CaptionBox text="Lo que debes observar es el patrón. Cuando varias ocurren juntas, de forma repetida, ahí está la respuesta." />
      </Sequence>

      {/* GRÁFICO #1 */}
      <Sequence from={330} durationInFrames={175}>
        <InfielSignalGraphic number="#1" title="Va directo al baño" />
      </Sequence>

      {/* SEÑAL 1 — avatar */}
      <Sequence from={505} durationInFrames={225}>
        <CaptionBox text="La primera cosa que hace una mujer infiel al llegar a casa es ir directo al baño." />
      </Sequence>

      <Sequence from={730} durationInFrames={150}>
        <CaptionBox text="Sin saludarte bien. Sin sentarse. Sin contarte cómo le fue." />
      </Sequence>

      <Sequence from={880} durationInFrames={250}>
        <CaptionBox text="No hablo de cuando llega del gimnasio. Hablo de cuando esto se convierte en un hábito nuevo. Algo que antes no hacía." />
      </Sequence>

      <Sequence from={1130} durationInFrames={350}>
        <CaptionBox text="La psicología lo explica: el baño es el primer lugar donde puede eliminar evidencia. Perfume, mensajes, el estado de ánimo que traía de afuera." />
      </Sequence>

      <Sequence from={1480} durationInFrames={250}>
        <CaptionBox text="¿Antes llegaba y te buscaba? ¿Y ahora lo primero que hace es desaparecer diez minutos?" />
      </Sequence>

      <Sequence from={1730} durationInFrames={250}>
        <CaptionBox text="Eso no es higiene. Eso es protocolo." />
      </Sequence>

    </AbsoluteFill>
  );
};
