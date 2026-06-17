import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {BigTextGraphic} from './components/BigTextGraphic';

// Timeline (25fps, ~37s = 923 frames):
// 0-125:   "#1 JITOMATE" amarillo
// 525-700: "COCIDO > CRUDO"

export const PSA3Edit: React.FC = () => {
	return (
		<AbsoluteFill style={{backgroundColor: '#000'}}>
			<OffthreadVideo src={staticFile('psa_3.mp4')} />

			<Sequence from={0} durationInFrames={125}>
				<BigTextGraphic text="#1 JITOMATE" highlight="#1 JITOMATE" highlightColor="#facc15" />
			</Sequence>

			<Sequence from={525} durationInFrames={175}>
				<BigTextGraphic text="COCIDO > CRUDO" highlight="COCIDO" highlightColor="#ff6b35" />
			</Sequence>
		</AbsoluteFill>
	);
};
