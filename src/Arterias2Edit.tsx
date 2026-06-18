import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {FullScreenText} from './components/FullScreenText';

// Timeline (25fps, ~39s = 981 frames):
// 0-150: "ATEROSCLEROSIS = Causa #1 de infartos" letras enormes

export const Arterias2Edit: React.FC = () => {
	return (
		<AbsoluteFill style={{backgroundColor: '#000'}}>
			<OffthreadVideo src={staticFile('arterias_2.mp4')} />

			<Sequence from={0} durationInFrames={150}>
				<FullScreenText text="ATEROSCLEROSIS = Causa #1 de infartos" color="#ff4444" />
			</Sequence>
		</AbsoluteFill>
	);
};
