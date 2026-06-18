import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {BigTextGraphic} from './components/BigTextGraphic';
import {FoodListGraphic} from './components/FoodListGraphic';

// Timeline (25fps, ~63s = 1563 frames):
// 50-350:    Lista de 10 alimentos
// 900-1100:  "⚠️ Consulta siempre a tu médico"
// 1300-1563: "SUSCRÍBETE → Más salud masculina cada semana"

export const PSAFinalEdit: React.FC = () => {
	return (
		<AbsoluteFill style={{backgroundColor: '#000'}}>
			<OffthreadVideo src={staticFile('psa_final.mp4')} />

			<Sequence from={50} durationInFrames={300}>
				<FoodListGraphic />
			</Sequence>

			<Sequence from={900} durationInFrames={200}>
				<BigTextGraphic text="⚠️ Consulta siempre a tu médico" highlight="siempre a tu médico" highlightColor="#ff4444" />
			</Sequence>

			<Sequence from={1300} durationInFrames={263}>
				<BigTextGraphic text="SUSCRÍBETE → Más salud masculina cada semana" highlight="SUSCRÍBETE" highlightColor="#4ade80" />
			</Sequence>
		</AbsoluteFill>
	);
};
