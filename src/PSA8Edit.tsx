import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {BigTextGraphic} from './components/BigTextGraphic';

// Timeline (25fps, ~27s = 668 frames):
// 0-125:   "#6 AJO"
// 300-475: "CRUDO O MACHACADO = Alicina activa"

export const PSA8Edit: React.FC = () => {
	return (
		<AbsoluteFill style={{backgroundColor: '#000'}}>
			<OffthreadVideo src={staticFile('psa_8.mp4')} />

			<Sequence from={0} durationInFrames={125}>
				<BigTextGraphic text="#6 AJO" highlight="#6 AJO" highlightColor="#e2e8f0" />
			</Sequence>

			<Sequence from={300} durationInFrames={175}>
				<BigTextGraphic text="CRUDO O MACHACADO = Alicina activa" highlight="CRUDO O MACHACADO" highlightColor="#f59e0b" />
			</Sequence>
		</AbsoluteFill>
	);
};
