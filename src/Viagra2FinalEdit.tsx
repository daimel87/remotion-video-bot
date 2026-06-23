import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {DrugPickerClose} from './components/DrugPickerClose';

// Timeline (25fps, ~38s = 953 frames):
// 500-953: Cierre "¿Cuál es mejor para TI?" + suscríbete

export const Viagra2FinalEdit: React.FC = () => {
	return (
		<AbsoluteFill style={{backgroundColor: '#000'}}>
			<OffthreadVideo src={staticFile('viagra2_final.mp4')} />

			<Sequence from={500} durationInFrames={453}>
				<DrugPickerClose />
			</Sequence>
		</AbsoluteFill>
	);
};
