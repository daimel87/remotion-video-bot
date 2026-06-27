import React from 'react';
import {
	AbsoluteFill,
	Img,
	interpolate,
	spring,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';

export const TacticasRomanasPreview: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps, durationInFrames} = useVideoConfig();

	const entryProgress = spring({frame, fps, config: {damping: 12, mass: 0.8}});
	const entryScale = interpolate(entryProgress, [0, 1], [1.3, 1]);
	const opacity = interpolate(frame, [0, 10], [0, 1], {
		extrapolateRight: 'clamp',
	});

	const kenBurnsScale = interpolate(frame, [0, durationInFrames], [1, 1.12], {
		extrapolateRight: 'clamp',
	});

	const panX = interpolate(frame, [0, durationInFrames], [20, -20], {
		extrapolateRight: 'clamp',
	});
	const panY = interpolate(frame, [0, durationInFrames], [10, -5], {
		extrapolateRight: 'clamp',
	});

	const fadeOut = interpolate(
		frame,
		[durationInFrames - 15, durationInFrames],
		[1, 0],
		{extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
	);

	return (
		<AbsoluteFill style={{backgroundColor: '#D4C5A9'}}>
			<AbsoluteFill
				style={{
					opacity: opacity * fadeOut,
					transform: `scale(${entryScale * kenBurnsScale}) translate(${panX}px, ${panY}px)`,
				}}
			>
				<Img
					src={staticFile(
						'tacticas-romanas/Simple_cartoon_illustration_on_solid_202606271610.jpeg'
					)}
					style={{
						width: '100%',
						height: '100%',
						objectFit: 'cover',
					}}
				/>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
