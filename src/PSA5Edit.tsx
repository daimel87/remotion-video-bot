import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {BigTextGraphic} from './components/BigTextGraphic';

// Timeline (25fps, ~20s = 506 frames):
// 0-125:   "#3 GRANADA"
// 250-425: "PSA tarda 2X más en subir"

export const PSA5Edit: React.FC = () => {
	return (
		<AbsoluteFill style={{backgroundColor: '#000'}}>
			<OffthreadVideo src={staticFile('psa_5.mp4')} />

			<Sequence from={0} durationInFrames={125}>
				<BigTextGraphic text="#3 GRANADA" highlight="#3 GRANADA" highlightColor="#f43f5e" />
			</Sequence>

			<Sequence from={250} durationInFrames={175}>
				<BigTextGraphic text="PSA tarda 2X más en subir" highlight="2X" highlightColor="#facc15" />
			</Sequence>
		</AbsoluteFill>
	);
};
