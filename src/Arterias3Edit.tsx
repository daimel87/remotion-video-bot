import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {FullScreenText} from './components/FullScreenText';

// Timeline (25fps, ~72s = 1810 frames):
// ~550-750:   "80% MENOS placa arterial — Journal of Nutrition"
// ~1500-1750: "AJO CRUDO → Alicina / AJO ENVEJECIDO → S-alilcisteína"

export const Arterias3Edit: React.FC = () => {
	return (
		<AbsoluteFill style={{backgroundColor: '#000'}}>
			<OffthreadVideo src={staticFile('arterias_3.mp4')} />

			<Sequence from={550} durationInFrames={200}>
				<FullScreenText text="80% MENOS placa arterial — Journal of Nutrition" color="#4ade80" />
			</Sequence>

			<Sequence from={1500} durationInFrames={250}>
				<FullScreenText text="AJO CRUDO → Alicina AJO ENVEJECIDO → S-alilcisteína" color="#facc15" />
			</Sequence>
		</AbsoluteFill>
	);
};
