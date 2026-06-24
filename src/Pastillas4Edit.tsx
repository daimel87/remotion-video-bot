import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {FullScreenText} from './components/FullScreenText';

// Timeline (25fps, ~62s = 1540 frames):
// 375-875: "#3 AZITROMICINA → +250% muerte CV en 5 días — NEJM" (20s)

export const Pastillas4Edit: React.FC = () => {
	return (
		<AbsoluteFill style={{backgroundColor: '#000'}}>
			<OffthreadVideo src={staticFile('pastillas_4.mp4')} />

			<Sequence from={375} durationInFrames={500}>
				<FullScreenText text="#3 AZITROMICINA → +250% muerte CV en 5 días — NEJM" color="#ff4444" />
			</Sequence>
		</AbsoluteFill>
	);
};
