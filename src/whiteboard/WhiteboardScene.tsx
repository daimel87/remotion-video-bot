import React from 'react';
import {AbsoluteFill, useCurrentFrame, interpolate} from 'remotion';

interface WhiteboardSceneProps {
	children: React.ReactNode;
	startFrame?: number;
	durationFrames: number;
	backgroundColor?: string;
}

export const WhiteboardScene: React.FC<WhiteboardSceneProps> = ({
	children,
	startFrame = 0,
	durationFrames,
	backgroundColor = '#faf9f6',
}) => {
	const frame = useCurrentFrame();

	const fadeIn = interpolate(frame, [startFrame, startFrame + 8], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	const fadeOut = interpolate(
		frame,
		[startFrame + durationFrames - 8, startFrame + durationFrames],
		[1, 0],
		{extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
	);

	const opacity = Math.min(fadeIn, fadeOut);
	const isVisible =
		frame >= startFrame && frame <= startFrame + durationFrames;

	if (!isVisible) return null;

	return (
		<AbsoluteFill
			style={{
				backgroundColor,
				opacity,
			}}
		>
			<svg
				viewBox="0 0 1920 1080"
				style={{width: '100%', height: '100%'}}
			>
				{children}
			</svg>
		</AbsoluteFill>
	);
};
