import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {FullScreenText} from './components/FullScreenText';

// Timeline (25fps, ~73s = 1837 frames):
// 500-1000: "#5 CALCIO → +30% infarto — BMJ, Dr. Bolland" (20s)
// 1400-1700: "Mejor: sardinas, brócoli, almendras, yogur" (12s)

export const Pastillas6Edit: React.FC = () => {
	return (
		<AbsoluteFill style={{backgroundColor: '#000'}}>
			<OffthreadVideo src={staticFile('pastillas_6.mp4')} />

			<Sequence from={500} durationInFrames={500}>
				<FullScreenText text="#5 SUPLEMENTOS DE CALCIO → +30% infarto — BMJ" color="#ff4444" />
			</Sequence>

			<Sequence from={1400} durationInFrames={300}>
				<FullScreenText text="✅ Mejor: sardinas, brócoli, almendras, yogur" color="#4ade80" />
			</Sequence>
		</AbsoluteFill>
	);
};
