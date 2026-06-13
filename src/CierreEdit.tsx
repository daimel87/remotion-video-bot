import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {CaptionBox} from './components/CaptionBox';
import {ExplainerGraphic} from './components/ExplainerGraphic';
import {FlameIcon, RouteIcon, MagnifierIcon} from './components/icons';

// Timeline (25fps, 1447 frames total):
// 0-64       caption: "¿Por qué estos diez y no otros?"
// 64-355     cutaway: inflamación crónica de bajo grado -> denominador común (hiperplasia, prostatitis, PSA)
// 355-537    normal: "La próstata no crece porque sí... vive en un ambiente inflamatorio"
// 537-673    cutaway: cambiar el ambiente no requiere fármacos, requiere constancia en la cocina
// 673-874    normal: "México tiene ingredientes con poder antiinflamatorio real..."
// 874-974    normal: "Ninguno de estos alimentos reemplaza tu revisión anual con el urólogo"
// 974-1201   cutaway: tacto rectal y PSA siguen siendo las herramientas de detección más importantes
// 1201-1447  normal: "lo que pones en tu plato... la intervención más silenciosa y poderosa"

export const CierreEdit: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <OffthreadVideo src={staticFile('cierre.mp4')} />

      <Sequence from={5} durationInFrames={59}>
        <CaptionBox text="¿Por qué estos diez y no otros?" />
      </Sequence>

      <Sequence from={64} durationInFrames={291}>
        <ExplainerGraphic
          icon={<FlameIcon size={56} />}
          from="Inflamación crónica de bajo grado"
          to="Hiperplasia, prostatitis, PSA alto"
          caption="Todos comparten algo: atacan la inflamación crónica de bajo grado, el denominador común detrás de la hiperplasia prostática, la prostatitis crónica y el PSA que sube sin infección visible."
        />
      </Sequence>

      <Sequence from={360} durationInFrames={170}>
        <CaptionBox text="La próstata crece porque vive en un ambiente inflamatorio que le dice que tiene que protegerse" />
      </Sequence>

      <Sequence from={537} durationInFrames={136}>
        <ExplainerGraphic
          icon={<RouteIcon size={56} />}
          from="Constancia en la cocina"
          to="Cambia el ambiente"
          caption="Cambiar ese ambiente no requiere fármacos en las etapas tempranas. Requiere constancia en la cocina."
        />
      </Sequence>

      <Sequence from={680} durationInFrames={185}>
        <CaptionBox text="México tiene ingredientes con poder antiinflamatorio real que cuestan menos que una consulta privada" />
      </Sequence>

      <Sequence from={878} durationInFrames={90}>
        <CaptionBox text="Ninguno de estos alimentos reemplaza tu revisión anual con el urólogo" />
      </Sequence>

      <Sequence from={974} durationInFrames={227}>
        <ExplainerGraphic
          icon={<MagnifierIcon size={56} />}
          from="Tacto rectal + PSA"
          to="Detección temprana"
          caption="El tacto rectal y el PSA siguen siendo las herramientas de detección más importantes que tenemos, y nadie debería evitarlos por miedo o por pena."
        />
      </Sequence>

      <Sequence from={1205} durationInFrames={242}>
        <CaptionBox text="Lo que pones en tu plato todos los días es la intervención más silenciosa y más poderosa que tienes" />
      </Sequence>
    </AbsoluteFill>
  );
};
