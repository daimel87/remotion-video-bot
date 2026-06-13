import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {CaptionBox} from './components/CaptionBox';
import {LowerThird} from './components/LowerThird';
import {ConditionsGraphic} from './components/ConditionsGraphic';
import {Foods10Graphic} from './components/Foods10Graphic';

// Timeline (25fps, 1142 frames total):
// 0-145    lower third: "Soy la Dra. Laura Jiménez, uróloga con 12 años de práctica clínica."
// 140-320  cutaway: "He tratado cientos de casos de HPB, PSA elevado y prostatitis crónica"
// 320-565  normal: "...¿Qué estaba comiendo este hombre los últimos 20 años?"
// 565-946  normal: "...la dieta puede frenar o acelerar"
// 946-1142 cutaway: "Hoy te doy los 10 alimentos que frenan ese proceso..."

export const DoctorIntroEdit: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <OffthreadVideo src={staticFile('doctora_intro.mp4')} />

      <Sequence from={0} durationInFrames={145}>
        <LowerThird name="Dra. Laura Jiménez" title="Uróloga con 12 años de experiencia" />
      </Sequence>

      <Sequence from={140} durationInFrames={180}>
        <ConditionsGraphic />
      </Sequence>

      <Sequence from={460} durationInFrames={110}>
        <CaptionBox text="¿Qué estaba comiendo este hombre los últimos 20 años?" />
      </Sequence>

      <Sequence from={875} durationInFrames={70}>
        <CaptionBox text="La dieta puede frenar o acelerar" />
      </Sequence>

      <Sequence from={946} durationInFrames={196}>
        <Foods10Graphic />
      </Sequence>
    </AbsoluteFill>
  );
};
