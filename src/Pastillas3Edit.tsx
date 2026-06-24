import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {FullScreenText} from './components/FullScreenText';

// Timeline (25fps, ~52s = 1301 frames):
// 375-875: "#2 OMEPRAZOL → +16-21% riesgo cardiovascular — Stanford" (20s)

export const Pastillas3Edit: React.FC = () => {
	return (
		<AbsoluteFill style={{backgroundColor: '#000'}}>
			<OffthreadVideo src={staticFile('pastillas_3.mp4')} />

			<Sequence from={375} durationInFrames={500}>
				<FullScreenText text="#2 OMEPRAZOL → +16-21% riesgo cardiovascular — Stanford" color="#f59e0b" />
			</Sequence>
		</AbsoluteFill>
	);
};
