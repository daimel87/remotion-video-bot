import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {BigTextGraphic} from './components/BigTextGraphic';

// Timeline (25fps, 42s = 1050 frames):
// 100-200: PSA ELEVADO graphic (red)
// 625-800: 10 ALIMENTOS → PSA ↓ graphic

export const PSA1Edit: React.FC = () => {
	return (
		<AbsoluteFill style={{backgroundColor: '#000'}}>
			<OffthreadVideo src={staticFile('psa_1.mp4')} />

			<Sequence from={100} durationInFrames={100}>
				<BigTextGraphic text="⚠ PSA ELEVADO" highlight="PSA ELEVADO" highlightColor="#ff4444" />
			</Sequence>

			<Sequence from={625} durationInFrames={175}>
				<BigTextGraphic text="10 ALIMENTOS → PSA ↓" highlight="10 ALIMENTOS" />
			</Sequence>
		</AbsoluteFill>
	);
};
