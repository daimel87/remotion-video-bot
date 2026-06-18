import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {FullScreenText} from './components/FullScreenText';

// Timeline (25fps, ~40s = 991 frames):
// 75-275: "ULTRAPROCESADOS = Más placa — Harvard 2025"

export const Arterias5Edit: React.FC = () => {
	return (
		<AbsoluteFill style={{backgroundColor: '#000'}}>
			<OffthreadVideo src={staticFile('arterias_5.mp4')} />

			<Sequence from={75} durationInFrames={200}>
				<FullScreenText text="ULTRAPROCESADOS = Más placa — Harvard 2025" color="#ff4444" />
			</Sequence>
		</AbsoluteFill>
	);
};
