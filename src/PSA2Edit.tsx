import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {BigTextGraphic} from './components/BigTextGraphic';

// Timeline (25fps, ~48.5s = 1213 frames):
// ~375-550: "PSA Normal: menor a 4 ng/mL"

export const PSA2Edit: React.FC = () => {
	return (
		<AbsoluteFill style={{backgroundColor: '#000'}}>
			<OffthreadVideo src={staticFile('psa_2.mp4')} />

			<Sequence from={375} durationInFrames={175}>
				<BigTextGraphic text="PSA Normal: menor a 4 ng/mL" highlight="menor a 4 ng/mL" highlightColor="#4ade80" />
			</Sequence>
		</AbsoluteFill>
	);
};
