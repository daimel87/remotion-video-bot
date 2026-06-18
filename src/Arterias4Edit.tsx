import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {FullScreenText} from './components/FullScreenText';

// Timeline (25fps, ~86s = 2154 frames):
// ~750-950:   "35% MENOS placa — Clinical Nutrition"
// ~1850-2100: "GRANADA: Antiinflamatorio + Antioxidante + Protector arterial"

export const Arterias4Edit: React.FC = () => {
	return (
		<AbsoluteFill style={{backgroundColor: '#000'}}>
			<OffthreadVideo src={staticFile('arterias_4.mp4')} />

			<Sequence from={750} durationInFrames={200}>
				<FullScreenText text="35% MENOS placa — Clinical Nutrition" color="#4ade80" />
			</Sequence>

			<Sequence from={1850} durationInFrames={250}>
				<FullScreenText text="GRANADA: Antiinflamatorio + Antioxidante + Protector arterial" color="#f43f5e" />
			</Sequence>
		</AbsoluteFill>
	);
};
