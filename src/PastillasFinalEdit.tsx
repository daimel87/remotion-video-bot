import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {PillsSummary} from './components/PillsSummary';
import {FullScreenText} from './components/FullScreenText';

// Timeline (25fps, ~32s = 806 frames):
// 0-500:   Resumen 5 pastillas (20s)
// 600-806: "SUSCRÍBETE → Tu salud después de los 50"

export const PastillasFinalEdit: React.FC = () => {
	return (
		<AbsoluteFill style={{backgroundColor: '#000'}}>
			<OffthreadVideo src={staticFile('pastillas_final.mp4')} />

			<Sequence from={0} durationInFrames={500}>
				<PillsSummary />
			</Sequence>

			<Sequence from={600} durationInFrames={206}>
				<FullScreenText text="SUSCRÍBETE → Tu salud después de los 50" color="#4ade80" />
			</Sequence>
		</AbsoluteFill>
	);
};
