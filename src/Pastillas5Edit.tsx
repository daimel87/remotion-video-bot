import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {FullScreenText} from './components/FullScreenText';

// Timeline (25fps, ~62s = 1540 frames):
// 375-875: "#4 DICLOFENACO → +40% eventos CV — The Lancet, 300K pacientes" (20s)

export const Pastillas5Edit: React.FC = () => {
	return (
		<AbsoluteFill style={{backgroundColor: '#000'}}>
			<OffthreadVideo src={staticFile('pastillas_5.mp4')} />

			<Sequence from={375} durationInFrames={500}>
				<FullScreenText text="#4 DICLOFENACO → +40% eventos CV — The Lancet" color="#f59e0b" />
			</Sequence>
		</AbsoluteFill>
	);
};
