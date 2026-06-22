import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {FullScreenText} from './components/FullScreenText';

// Timeline (25fps, ~59s = 1470 frames):
// 75-275:   "⏱️ Sildenafilo: 30-60 min · Tadalafilo: 1-2 horas"
// 850-1050: "52% frustración por tiempo de espera — Journal of Sexual Medicine"

export const Viagra2_2Edit: React.FC = () => {
	return (
		<AbsoluteFill style={{backgroundColor: '#000'}}>
			<OffthreadVideo src={staticFile('viagra2_2.mp4')} />

			<Sequence from={75} durationInFrames={200}>
				<FullScreenText text="⏱️ Sildenafilo: 30-60 min · Tadalafilo: 1-2 horas" color="#f59e0b" />
			</Sequence>

			<Sequence from={850} durationInFrames={200}>
				<FullScreenText text="52% frustración por tiempo de espera — J. Sexual Medicine" color="#f43f5e" />
			</Sequence>
		</AbsoluteFill>
	);
};
