import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {BigTextGraphic} from './components/BigTextGraphic';

// Timeline (25fps, ~29s = 718 frames):
// 0-125:   "#5 TÉ VERDE"
// 325-500: "90% menos riesgo — Estudio italiano"

export const PSA7Edit: React.FC = () => {
	return (
		<AbsoluteFill style={{backgroundColor: '#000'}}>
			<OffthreadVideo src={staticFile('psa_7.mp4')} />

			<Sequence from={0} durationInFrames={125}>
				<BigTextGraphic text="#5 TÉ VERDE" highlight="#5 TÉ VERDE" highlightColor="#4ade80" />
			</Sequence>

			<Sequence from={325} durationInFrames={175}>
				<BigTextGraphic text="90% menos riesgo — Estudio italiano" highlight="90%" highlightColor="#facc15" />
			</Sequence>
		</AbsoluteFill>
	);
};
