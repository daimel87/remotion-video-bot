import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {CaptionBox} from './components/CaptionBox';
import {LowerThird} from './components/LowerThird';
import {ExplainerGraphic} from './components/ExplainerGraphic';
import {BeanIcon, ChiliIcon} from './components/icons';

// Timeline (25fps, 1274 frames total):
// 0-127     lower third "Frijol negro": "El frijol negro es Alto en isoflavonas y fibra fermentable"
// 127-382   normal: "Las isoflavonas compiten... frena el crecimiento de tejido en la glándula"
// 382-624   cutaway: estudios poblacionales en Asia -> menor hiperplasia prostática benigna
// 624-815   lower third "Chile serrano": "La capsaicina del chile serrano... efecto apoptótico sobre células prostáticas anormales"
// 815-968   normal: "es decir, induce la muerte programada de células que no deberían crecer"
// 968-1274  cutaway: estudio Cancer Research in vitro / "no cures nada con chile, pero tampoco lo evites"

export const FrijolChileEdit: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <OffthreadVideo src={staticFile('frijol_chile.mp4')} />

      <Sequence from={0} durationInFrames={127}>
        <LowerThird name="Frijol negro" title="Isoflavonas y fibra fermentable" />
      </Sequence>

      <Sequence from={280} durationInFrames={100}>
        <CaptionBox text="Frena el crecimiento de tejido en la glándula" />
      </Sequence>

      <Sequence from={382} durationInFrames={242}>
        <ExplainerGraphic
          icon={<BeanIcon size={56} />}
          from="Isoflavonas (frijol)"
          to="↓ hiperplasia prostática"
          caption="Estudios poblacionales en Asia, donde el consumo de leguminosas es alto, muestran tasas significativamente menores de hiperplasia prostática benigna."
        />
      </Sequence>

      <Sequence from={624} durationInFrames={191}>
        <LowerThird name="Chile serrano" title="Capsaicina apoptótica" />
      </Sequence>

      <Sequence from={830} durationInFrames={130}>
        <CaptionBox text="Induce la muerte programada de células que no deberían crecer" />
      </Sequence>

      <Sequence from={968} durationInFrames={306}>
        <ExplainerGraphic
          icon={<ChiliIcon size={56} />}
          from="Capsaicina (chile)"
          to="Apoptosis celular"
          caption="Un estudio en Cancer Research documentó este mecanismo in vitro. No cures nada con chile, pero tampoco lo evites pensando que te hace daño."
        />
      </Sequence>
    </AbsoluteFill>
  );
};
