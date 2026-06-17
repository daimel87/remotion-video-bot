import React from 'react';
import {useCurrentFrame, interpolate, Easing, useVideoConfig, Img, staticFile} from 'remotion';

export type KenBurnsEffect =
	| 'zoomInSlow'
	| 'zoomOutSlow'
	| 'panLeft'
	| 'panRight'
	| 'panUp'
	| 'panDown'
	| 'panLeftZoomIn'
	| 'panRightZoomIn'
	| 'zoomInCenter'
	| 'zoomOutCenter';

interface KenBurnsImageProps {
	src: string;
	startFrame: number;
	durationFrames: number;
	effect?: KenBurnsEffect;
	fadeIn?: number;
	fadeOut?: number;
}

export const KenBurnsImage: React.FC<KenBurnsImageProps> = ({
	src,
	startFrame,
	durationFrames,
	effect = 'zoomInSlow',
	fadeIn = 15,
	fadeOut = 15,
}) => {
	const frame = useCurrentFrame();

	const isVisible = frame >= startFrame && frame <= startFrame + durationFrames;
	if (!isVisible) return null;

	const localFrame = frame - startFrame;
	const progress = interpolate(localFrame, [0, durationFrames], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.inOut(Easing.ease),
	});

	const opacityIn = interpolate(localFrame, [0, fadeIn], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const opacityOut = interpolate(
		localFrame,
		[durationFrames - fadeOut, durationFrames],
		[1, 0],
		{extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
	);
	const opacity = Math.min(opacityIn, opacityOut);

	let scale = 1;
	let translateX = 0;
	let translateY = 0;

	switch (effect) {
		case 'zoomInSlow':
			scale = interpolate(progress, [0, 1], [1, 1.15]);
			break;
		case 'zoomOutSlow':
			scale = interpolate(progress, [0, 1], [1.15, 1]);
			break;
		case 'panLeft':
			scale = 1.2;
			translateX = interpolate(progress, [0, 1], [5, -5]);
			break;
		case 'panRight':
			scale = 1.2;
			translateX = interpolate(progress, [0, 1], [-5, 5]);
			break;
		case 'panUp':
			scale = 1.2;
			translateY = interpolate(progress, [0, 1], [5, -5]);
			break;
		case 'panDown':
			scale = 1.2;
			translateY = interpolate(progress, [0, 1], [-5, 5]);
			break;
		case 'panLeftZoomIn':
			scale = interpolate(progress, [0, 1], [1.05, 1.2]);
			translateX = interpolate(progress, [0, 1], [5, -5]);
			break;
		case 'panRightZoomIn':
			scale = interpolate(progress, [0, 1], [1.05, 1.2]);
			translateX = interpolate(progress, [0, 1], [-5, 5]);
			break;
		case 'zoomInCenter':
			scale = interpolate(progress, [0, 1], [1, 1.3]);
			break;
		case 'zoomOutCenter':
			scale = interpolate(progress, [0, 1], [1.3, 1]);
			break;
	}

	return (
		<div
			style={{
				position: 'absolute',
				top: 0,
				left: 0,
				width: '100%',
				height: '100%',
				overflow: 'hidden',
				opacity,
			}}
		>
			<img
				src={src}
				style={{
					width: '100%',
					height: '100%',
					objectFit: 'cover',
					transform: `scale(${scale}) translate(${translateX}%, ${translateY}%)`,
					transformOrigin: 'center center',
				}}
			/>
		</div>
	);
};
