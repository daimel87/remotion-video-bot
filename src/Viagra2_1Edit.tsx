import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {FullScreenText} from './components/FullScreenText';

// Timeline (25fps, ~24s = 608 frames):
// 75-550: "VIAGRA 2.0: FUNCIONA EN 15 MINUTOS — El fármaco que tu urólogo no te ha mencionado"

export const Viagra2_1Edit: React.FC = () => {
	return (
		<AbsoluteFill style={{backgroundColor: '#000'}}>
			<OffthreadVideo src={staticFile('viagra2_1.mp4')} />

			<Sequence from={75} durationInFrames={475}>
				<FullScreenText text="VIAGRA 2.0: FUNCIONA EN 15 MINUTOS" color="#4ade80" />
			</Sequence>
		</AbsoluteFill>
	);
};
