import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {BigTextGraphic} from './components/BigTextGraphic';

// Timeline (25fps, ~35s = 867 frames):
// 0-125:   "#7 NUEZ DE BRASIL ⭐"
// 425-600: "50% MENOS — The Lancet"
// 700-867: "MÁXIMO: 2 al día ⚠️"

export const PSA9Edit: React.FC = () => {
	return (
		<AbsoluteFill style={{backgroundColor: '#000'}}>
			<OffthreadVideo src={staticFile('psa_9.mp4')} />

			<Sequence from={0} durationInFrames={125}>
				<BigTextGraphic text="⭐ #7 NUEZ DE BRASIL" highlight="#7 NUEZ DE BRASIL" highlightColor="#facc15" />
			</Sequence>

			<Sequence from={425} durationInFrames={175}>
				<BigTextGraphic text="50% MENOS — The Lancet" highlight="50% MENOS" highlightColor="#4ade80" />
			</Sequence>

			<Sequence from={700} durationInFrames={167}>
				<BigTextGraphic text="MÁXIMO: 2 al día ⚠️" highlight="2 al día" highlightColor="#ff4444" />
			</Sequence>
		</AbsoluteFill>
	);
};
