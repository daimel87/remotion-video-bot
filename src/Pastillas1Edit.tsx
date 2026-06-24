import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {FullScreenText} from './components/FullScreenText';

// Timeline (25fps, ~35s = 875 frames):
// 50-250: "5 PASTILLAS QUE AUMENTAN TU RIESGO DE INFARTO"

export const Pastillas1Edit: React.FC = () => {
	return (
		<AbsoluteFill style={{backgroundColor: '#000'}}>
			<OffthreadVideo src={staticFile('pastillas_1.mp4')} />

			<Sequence from={50} durationInFrames={200}>
				<FullScreenText text="5 PASTILLAS QUE AUMENTAN TU RIESGO DE INFARTO" color="#ff4444" />
			</Sequence>
		</AbsoluteFill>
	);
};
