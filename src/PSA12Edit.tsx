import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {BigTextGraphic} from './components/BigTextGraphic';

// Timeline (25fps, ~32s = 796 frames):
// 0-125:   "#10 FRIJOLES"
// 600-796: "FRIJOLES = Protección hormonal natural"

export const PSA12Edit: React.FC = () => {
	return (
		<AbsoluteFill style={{backgroundColor: '#000'}}>
			<OffthreadVideo src={staticFile('psa_12.mp4')} />

			<Sequence from={0} durationInFrames={125}>
				<BigTextGraphic text="#10 FRIJOLES" highlight="#10 FRIJOLES" highlightColor="#a78bfa" />
			</Sequence>

			<Sequence from={600} durationInFrames={196}>
				<BigTextGraphic text="FRIJOLES = Protección hormonal natural" highlight="Protección hormonal" highlightColor="#4ade80" />
			</Sequence>
		</AbsoluteFill>
	);
};
