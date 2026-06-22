import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {WarningList} from './components/WarningList';

// Timeline (25fps, ~75s = 1879 frames):
// 75-575: Lista de advertencias (20 segundos)

export const Viagra2_5Edit: React.FC = () => {
	return (
		<AbsoluteFill style={{backgroundColor: '#000'}}>
			<OffthreadVideo src={staticFile('viagra2_5.mp4')} />

			<Sequence from={75} durationInFrames={1500}>
				<WarningList />
			</Sequence>
		</AbsoluteFill>
	);
};
