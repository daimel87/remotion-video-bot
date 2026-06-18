import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {ArteriasSummary} from './components/ArteriasSummary';
import {FullScreenText} from './components/FullScreenText';

// Timeline (25fps, ~47s = 1181 frames):
// 0-400:     Lista resumen (16 segundos)
// 950-1181:  "SUSCRÍBETE → Más salud cada semana"

export const ArteriasFinalEdit: React.FC = () => {
	return (
		<AbsoluteFill style={{backgroundColor: '#000'}}>
			<OffthreadVideo src={staticFile('arterias_final.mp4')} />

			<Sequence from={0} durationInFrames={400}>
				<ArteriasSummary />
			</Sequence>

			<Sequence from={950} durationInFrames={231}>
				<FullScreenText text="SUSCRÍBETE → Más salud cada semana" color="#4ade80" />
			</Sequence>
		</AbsoluteFill>
	);
};
