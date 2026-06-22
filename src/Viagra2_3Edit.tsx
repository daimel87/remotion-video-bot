import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {FullScreenText} from './components/FullScreenText';

// Timeline (25fps, ~58s = 1447 frames):
// 1050-1250: "AVANAFILO → 66% éxito en 15 MIN — Journal of Urology, 646 pacientes"

export const Viagra2_3Edit: React.FC = () => {
	return (
		<AbsoluteFill style={{backgroundColor: '#000'}}>
			<OffthreadVideo src={staticFile('viagra2_3.mp4')} />

			<Sequence from={1050} durationInFrames={200}>
				<FullScreenText text="AVANAFILO → 66% éxito en 15 MIN — Journal of Urology" color="#4ade80" />
			</Sequence>
		</AbsoluteFill>
	);
};
