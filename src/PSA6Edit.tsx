import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {BigTextGraphic} from './components/BigTextGraphic';

// Timeline (25fps, ~26s = 661 frames):
// 0-125:   "#4 SEMILLAS DE CALABAZA"
// 300-475: "ZINC → Antiinflamatorio prostático"

export const PSA6Edit: React.FC = () => {
	return (
		<AbsoluteFill style={{backgroundColor: '#000'}}>
			<OffthreadVideo src={staticFile('psa_6.mp4')} />

			<Sequence from={0} durationInFrames={125}>
				<BigTextGraphic text="#4 SEMILLAS DE CALABAZA" highlight="#4 SEMILLAS DE CALABAZA" highlightColor="#f59e0b" />
			</Sequence>

			<Sequence from={300} durationInFrames={175}>
				<BigTextGraphic text="ZINC → Antiinflamatorio prostático" highlight="ZINC" highlightColor="#38bdf8" />
			</Sequence>
		</AbsoluteFill>
	);
};
