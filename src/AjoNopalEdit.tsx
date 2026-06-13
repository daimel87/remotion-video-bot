import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {CaptionBox} from './components/CaptionBox';
import {LowerThird} from './components/LowerThird';
import {ExplainerGraphic} from './components/ExplainerGraphic';
import {GarlicIcon, CactusIcon} from './components/icons';

// Timeline (25fps, 1115 frames total):
// 0-76      lower third "El ajo": "La alicina del ajo tiene actividad antiinflamatoria"
// 76-260    cutaway: estudio Asian Pacific Journal of Cancer Prevention (alicina -> riesgo prostático)
// 260-465   normal: "Dos dientes crudos machacados al día... El calor destruye parte de la alicina activa"
// 465-595   lower third "El nopal": "Rico en quercetina y flavonoides con efecto antiinflamatorio documentado"
// 595-801   cutaway: regula glucosa / resistencia a la insulina y crecimiento prostático
// 801-1115  normal: "Atacar la inflamación y el azúcar al mismo tiempo... decisión más inteligente para un hombre de 50"

export const AjoNopalEdit: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <OffthreadVideo src={staticFile('ajo_nopal.mp4')} />

      <Sequence from={0} durationInFrames={76}>
        <LowerThird name="El ajo" title="Alicina antiinflamatoria" />
      </Sequence>

      <Sequence from={76} durationInFrames={184}>
        <ExplainerGraphic
          icon={<GarlicIcon size={56} />}
          from="Alicina (ajo)"
          to="↓ riesgo prostático"
          caption="Estudios en Asian Pacific Journal of Cancer Prevention documentan su asociación con reducción del riesgo prostático."
        />
      </Sequence>

      <Sequence from={265} durationInFrames={80}>
        <CaptionBox text="Dos dientes crudos machacados al día" />
      </Sequence>

      <Sequence from={385} durationInFrames={80}>
        <CaptionBox text="El calor destruye la alicina activa" />
      </Sequence>

      <Sequence from={465} durationInFrames={130}>
        <LowerThird name="El nopal" title="Quercetina y flavonoides" />
      </Sequence>

      <Sequence from={595} durationInFrames={206}>
        <ExplainerGraphic
          icon={<CactusIcon size={56} />}
          from="Regula la glucosa"
          to="↓ resistencia a la insulina"
          caption="La resistencia a la insulina acelera el crecimiento prostático: atacar la inflamación y el azúcar al mismo tiempo es clave."
        />
      </Sequence>

      <Sequence from={805} durationInFrames={80}>
        <CaptionBox text="Atacar la inflamación y el azúcar al mismo tiempo" />
      </Sequence>

      <Sequence from={995} durationInFrames={120}>
        <CaptionBox text="Una de las decisiones más inteligentes para un hombre de 50" />
      </Sequence>
    </AbsoluteFill>
  );
};
