import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {FullScreenText} from './components/FullScreenText';

// Timeline (25fps, ~51s = 1284 frames):
// 375-875: "#1 IBUPROFENO → +48% infarto en 7 días — BMJ, 446K pacientes" (20s)

export const Pastillas2Edit: React.FC = () => {
	return (
		<AbsoluteFill style={{backgroundColor: '#000'}}>
			<OffthreadVideo src={staticFile('pastillas_2.mp4')} />

			<Sequence from={375} durationInFrames={500}>
				<FullScreenText text="#1 IBUPROFENO → +48% infarto en solo 7 días — BMJ" color="#ff4444" />
			</Sequence>
		</AbsoluteFill>
	);
};
