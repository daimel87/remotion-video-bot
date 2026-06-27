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

const NARRATION_TEXT =
	'Los soldados se cubrían con sus escudos formando un caparazón impenetrable... como una tortuga gigante de guerra.';

const SubtitleBar: React.FC<{text: string}> = ({text}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const slideUp = spring({frame: frame - 30, fps, config: {damping: 15}});
	const translateY = interpolate(slideUp, [0, 1], [80, 0]);
	const opacity = interpolate(frame, [30, 45], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<div
			style={{
				position: 'absolute',
				bottom: 60,
				left: 0,
				right: 0,
				display: 'flex',
				justifyContent: 'center',
				opacity,
				transform: `translateY(${translateY}px)`,
			}}
		>
			<div
				style={{
					backgroundColor: 'rgba(0, 0, 0, 0.75)',
					borderRadius: 12,
					padding: '16px 40px',
					maxWidth: '80%',
				}}
			>
				<span
					style={{
						color: 'white',
						fontSize: 38,
						fontFamily: 'Arial, sans-serif',
						fontWeight: 700,
						lineHeight: 1.4,
						textAlign: 'center',
						display: 'block',
					}}
				>
					{text}
				</span>
			</div>
		</div>
	);
};

export const TacticasRomanasPreview: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps, durationInFrames} = useVideoConfig();

	const imageEntryProgress = spring({frame, fps, config: {damping: 20}});
	const imageScale = interpolate(imageEntryProgress, [0, 1], [1.15, 1]);
	const imageOpacity = interpolate(frame, [0, 15], [0, 1], {
		extrapolateRight: 'clamp',
	});

	const kenBurnsScale = interpolate(
		frame,
		[0, durationInFrames],
		[1, 1.08],
		{extrapolateRight: 'clamp'}
	);

	const fadeOut = interpolate(
		frame,
		[durationInFrames - 20, durationInFrames],
		[1, 0],
		{extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
	);

	return (
		<AbsoluteFill style={{backgroundColor: '#D4C5A9'}}>
			{/* Illustration */}
			<AbsoluteFill
				style={{
					justifyContent: 'center',
					alignItems: 'center',
					opacity: imageOpacity * fadeOut,
					transform: `scale(${imageScale * kenBurnsScale})`,
				}}
			>
				<Img
					src={staticFile('tacticas-romanas/testudo.png')}
					style={{
						width: '100%',
						height: '100%',
						objectFit: 'cover',
					}}
				/>
			</AbsoluteFill>

			{/* Subtitle narration */}
			<SubtitleBar text={NARRATION_TEXT} />
		</AbsoluteFill>
	);
};
