import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {CaptionBox} from './components/CaptionBox';
import {LowerThird} from './components/LowerThird';
import {ExplainerGraphic} from './components/ExplainerGraphic';
import {TurmericIcon, PomegranateIcon} from './components/icons';

// Timeline (25fps, 1215 frames total):
// 0-151     lower third "Curcumina": "tiene uno de los perfiles antiinflamatorios más estudiados de cualquier compuesto natural"
// 151-409   cutaway: Prostate Cancer and Prostatic Diseases -> inhibe NF-κB, inflamación crónica
// 409-602   normal: "Una pizca al arroz, al caldo, al guisado. Azafrán de bolita en mercados y farmacias."
// 602-699   lower third "Jugo de granada": "punicalagina y ácido elágico"
// 699-892   cutaway: Journal of Medicinal Food -> reducción de la velocidad de crecimiento del PSA
// 892-1053  normal: "Estudios clínicos en humanos sobre marcadores prostáticos"
// 1053-1215 normal: "Media granada al día en temporada. Jugo natural sin azúcar fuera de temporada."

export const CurcuminaGranadaEdit: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <OffthreadVideo src={staticFile('curcumina_granada.mp4')} />

      <Sequence from={0} durationInFrames={151}>
        <LowerThird name="Curcumina" title="Perfil antiinflamatorio estudiado" />
      </Sequence>

      <Sequence from={151} durationInFrames={258}>
        <ExplainerGraphic
          icon={<TurmericIcon size={56} />}
          from="Curcumina"
          to="Inhibe NF-κB"
          caption="Publicaciones en Prostate Cancer and Prostatic Diseases documentan su capacidad de inhibir NF-κB, la proteína que activa la inflamación crónica en el tejido prostático."
        />
      </Sequence>

      <Sequence from={415} durationInFrames={180}>
        <CaptionBox text="Una pizca al arroz, al caldo, al guisado: azafrán de bolita" />
      </Sequence>

      <Sequence from={602} durationInFrames={97}>
        <LowerThird name="Jugo de granada" title="Punicalagina y ácido elágico" />
      </Sequence>

      <Sequence from={699} durationInFrames={193}>
        <ExplainerGraphic
          icon={<PomegranateIcon size={56} />}
          from="Punicalagina + ácido elágico"
          to="↓ velocidad de crecimiento del PSA"
          caption="Estudios del Journal of Medicinal Food asocian estos compuestos con la reducción de la velocidad de crecimiento del PSA."
        />
      </Sequence>

      <Sequence from={898} durationInFrames={150}>
        <CaptionBox text="Uno de los pocos alimentos con estudios clínicos en humanos sobre marcadores prostáticos" />
      </Sequence>

      <Sequence from={1058} durationInFrames={157}>
        <CaptionBox text="Media granada al día en temporada. Fuera de temporada, jugo natural sin azúcar." />
      </Sequence>
    </AbsoluteFill>
  );
};
