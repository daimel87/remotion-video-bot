import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {BigTextGraphic} from './components/BigTextGraphic';

// Timeline (25fps, ~30s = 747 frames):
// 0-125:   "#8 SALMÓN O SARDINAS"
// 575-747: "2-3 veces por semana"

export const PSA10Edit: React.FC = () => {
	return (
		<AbsoluteFill style={{backgroundColor: '#000'}}>
			<OffthreadVideo src={staticFile('psa_10.mp4')} />

			<Sequence from={0} durationInFrames={125}>
				<BigTextGraphic text="#8 SALMÓN O SARDINAS" highlight="#8 SALMÓN O SARDINAS" highlightColor="#38bdf8" />
			</Sequence>

			<Sequence from={575} durationInFrames={172}>
				<BigTextGraphic text="2-3 veces por semana" highlight="2-3 veces" highlightColor="#facc15" />
			</Sequence>
		</AbsoluteFill>
	);
};
