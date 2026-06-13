import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {CaptionBox} from './components/CaptionBox';
import {LowerThird} from './components/LowerThird';
import {ExplainerGraphic} from './components/ExplainerGraphic';
import {TomatoIcon, ZincIcon} from './components/icons';

// Timeline (25fps, 1214 frames total):
// 0-165     lower third "El jitomate": "El jitomate cocido libera licopeno, el antioxidante más estudiado en relación con la próstata"
// 165-483   cutaway: metaanálisis Cancer Epidemiology (licopeno -> menor riesgo / PSA)
// 483-743   normal: "Cocido funciona mejor... Salsa, sopa, guisado. Ya lo estás comiendo. Solo hazlo más seguido."
// 743-861   lower third "Pepita de calabaza": "Contiene zinc y fitosteroles, especialmente beta-sitosterol"
// 861-1132  cutaway: estudio BJU International (zinc/beta-sitosterol -> síntomas urinarios)
// 1132-1214 normal: "Un puño al día. Así de simple."

export const JitomatePepitaEdit: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <OffthreadVideo src={staticFile('jitomate_pepita.mp4')} />

      <Sequence from={0} durationInFrames={165}>
        <LowerThird name="El jitomate" title="Libera licopeno" />
      </Sequence>

      <Sequence from={165} durationInFrames={318}>
        <ExplainerGraphic
          icon={<TomatoIcon size={56} />}
          from="Licopeno"
          to="↓ PSA y riesgo"
          caption="Metaanálisis en Cancer Epidemiology: el consumo regular de licopeno se asocia con menor riesgo de cáncer de próstata y reducción del PSA elevado."
        />
      </Sequence>

      <Sequence from={690} durationInFrames={53}>
        <CaptionBox text="Ya lo estás comiendo. Solo hazlo más seguido." />
      </Sequence>

      <Sequence from={743} durationInFrames={118}>
        <LowerThird name="Pepita de calabaza" title="Zinc y fitosteroles" />
      </Sequence>

      <Sequence from={861} durationInFrames={271}>
        <ExplainerGraphic
          icon={<ZincIcon size={56} />}
          from="Zinc + beta-sitosterol"
          to="↓ síntomas urinarios"
          caption="Estudios en BJU International asocian estos compuestos con reducción del chorro débil y la urgencia urinaria nocturna."
        />
      </Sequence>

      <Sequence from={1132} durationInFrames={82}>
        <CaptionBox text="Un puño al día. Así de simple." />
      </Sequence>
    </AbsoluteFill>
  );
};
