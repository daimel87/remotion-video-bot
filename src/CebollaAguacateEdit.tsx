import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {CaptionBox} from './components/CaptionBox';
import {LowerThird} from './components/LowerThird';
import {ExplainerGraphic} from './components/ExplainerGraphic';
import {OnionIcon, AvocadoIcon} from './components/icons';

// Timeline (25fps, 1346 frames total):
// 0-168     lower third "Cebolla morada": "Contiene quercetina en concentraciones más altas que la cebolla blanca"
// 168-453   cutaway: quercetina antiinflamatorio natural -> inhibe vías inflamatorias sin impacto gastrointestinal
// 453-582   normal: "Cruda en la ensalada o el taco. Todos los días."
// 582-867   lower third "El aguacate": "Rico en beta-sitosterol y glutatión, el antioxidante intracelular más potente"
// 867-1113  cutaway: aguacate alimento más denso nutricionalmente para próstata
// 1113-1346 normal: "México produce el 45% del aguacate del mundo. No hay excusa."

export const CebollaAguacateEdit: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <OffthreadVideo src={staticFile('cebolla_aguacate.mp4')} />

      <Sequence from={0} durationInFrames={168}>
        <LowerThird name="Cebolla morada" title="Quercetina concentrada" />
      </Sequence>

      <Sequence from={168} durationInFrames={285}>
        <ExplainerGraphic
          icon={<OnionIcon size={56} />}
          from="Quercetina (cebolla)"
          to="↓ inflamación"
          caption="La quercetina es un antiinflamatorio natural que inhibe las mismas vías inflamatorias que los fármacos antiinflamatorios convencionales, pero sin el impacto gastrointestinal."
        />
      </Sequence>

      <Sequence from={460} durationInFrames={110}>
        <CaptionBox text="Cruda, en la ensalada o el taco. Todos los días." />
      </Sequence>

      <Sequence from={582} durationInFrames={285}>
        <LowerThird name="El aguacate" title="Beta-sitosterol y glutatión" />
      </Sequence>

      <Sequence from={867} durationInFrames={246}>
        <ExplainerGraphic
          icon={<AvocadoIcon size={56} />}
          from="Aguacate"
          to="Alimento más denso nutricionalmente"
          caption="El aguacate es probablemente el alimento más denso nutricionalmente que un hombre de 50 puede comer para su próstata."
        />
      </Sequence>

      <Sequence from={1130} durationInFrames={216}>
        <CaptionBox text="México produce el 45% del aguacate del mundo. No hay excusa." />
      </Sequence>
    </AbsoluteFill>
  );
};
