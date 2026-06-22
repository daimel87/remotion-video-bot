import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {DrugCompareTable} from './components/DrugCompareTable';

// Timeline (25fps, ~80s = 1993 frames):
// 100-475: Tabla comparativa animada (15 segundos)

export const Viagra2_4Edit: React.FC = () => {
	return (
		<AbsoluteFill style={{backgroundColor: '#000'}}>
			<OffthreadVideo src={staticFile('viagra2_4.mp4')} />

			<Sequence from={100} durationInFrames={375}>
				<DrugCompareTable />
			</Sequence>
		</AbsoluteFill>
	);
};
