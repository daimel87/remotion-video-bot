import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {FullScreenText} from './components/FullScreenText';

// Timeline (25fps, ~15s = 369 frames):
// 0-150: "TUS ARTERIAS SE ESTÁN TAPANDO 🔴" letras enormes

export const Arterias1Edit: React.FC = () => {
	return (
		<AbsoluteFill style={{backgroundColor: '#000'}}>
			<OffthreadVideo src={staticFile('arterias_1.mp4')} />

			<Sequence from={0} durationInFrames={150}>
				<FullScreenText text="TUS ARTERIAS SE ESTÁN TAPANDO 🔴" color="#ff4444" />
			</Sequence>
		</AbsoluteFill>
	);
};
