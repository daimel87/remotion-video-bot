import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {BigTextGraphic} from './components/BigTextGraphic';

// Timeline (25fps, ~21s = 524 frames):
// 0-125:   "#2 BRÓCOLI"
// 350-524: "AL VAPOR 5 MIN → Máximo beneficio"

export const PSA4Edit: React.FC = () => {
	return (
		<AbsoluteFill style={{backgroundColor: '#000'}}>
			<OffthreadVideo src={staticFile('psa_4.mp4')} />

			<Sequence from={0} durationInFrames={125}>
				<BigTextGraphic text="#2 BRÓCOLI" highlight="#2 BRÓCOLI" highlightColor="#4ade80" />
			</Sequence>

			<Sequence from={350} durationInFrames={174}>
				<BigTextGraphic text="AL VAPOR 5 MIN → Máximo beneficio" highlight="AL VAPOR 5 MIN" highlightColor="#38bdf8" />
			</Sequence>
		</AbsoluteFill>
	);
};
