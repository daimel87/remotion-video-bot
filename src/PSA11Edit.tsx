import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {BigTextGraphic} from './components/BigTextGraphic';

// Timeline (25fps, ~31s = 770 frames):
// 0-125:   "#9 CÚRCUMA"
// 525-770: "CÚRCUMA + PIMIENTA NEGRA = 2000% más absorción"

export const PSA11Edit: React.FC = () => {
	return (
		<AbsoluteFill style={{backgroundColor: '#000'}}>
			<OffthreadVideo src={staticFile('psa_11.mp4')} />

			<Sequence from={0} durationInFrames={125}>
				<BigTextGraphic text="#9 CÚRCUMA" highlight="#9 CÚRCUMA" highlightColor="#f59e0b" />
			</Sequence>

			<Sequence from={525} durationInFrames={200}>
				<BigTextGraphic text="CÚRCUMA + PIMIENTA NEGRA = 2000% más absorción" highlight="2000%" highlightColor="#facc15" />
			</Sequence>
		</AbsoluteFill>
	);
};
