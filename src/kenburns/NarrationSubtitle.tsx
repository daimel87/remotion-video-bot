import React from 'react';
import {useCurrentFrame, interpolate, spring, useVideoConfig} from 'remotion';

interface NarrationSubtitleProps {
	text: string;
	startFrame: number;
	durationFrames: number;
	position?: 'bottom' | 'top' | 'center';
	fontSize?: number;
}

export const NarrationSubtitle: React.FC<NarrationSubtitleProps> = ({
	text,
	startFrame,
	durationFrames,
	position = 'bottom',
	fontSize = 42,
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const isVisible = frame >= startFrame && frame <= startFrame + durationFrames;
	if (!isVisible) return null;

	const localFrame = frame - startFrame;

	const fadeIn = interpolate(localFrame, [0, 10], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const fadeOut = interpolate(
		localFrame,
		[durationFrames - 10, durationFrames],
		[1, 0],
		{extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
	);
	const opacity = Math.min(fadeIn, fadeOut);

	const slideUp = interpolate(localFrame, [0, 12], [20, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	const posY = position === 'bottom' ? 'auto' : position === 'top' ? '60px' : '50%';
	const bottom = position === 'bottom' ? '80px' : 'auto';
	const translateY = position === 'center' ? `calc(-50% + ${slideUp}px)` : `${slideUp}px`;

	return (
		<div
			style={{
				position: 'absolute',
				left: '50%',
				top: posY,
				bottom,
				transform: `translateX(-50%) translateY(${translateY})`,
				opacity,
				zIndex: 10,
				width: '80%',
				textAlign: 'center',
			}}
		>
			<div
				style={{
					display: 'inline-block',
					backgroundColor: 'rgba(0, 0, 0, 0.7)',
					borderRadius: 12,
					padding: '14px 32px',
					backdropFilter: 'blur(4px)',
				}}
			>
				<span
					style={{
						color: '#ffffff',
						fontSize,
						fontFamily: "'Segoe UI', Arial, sans-serif",
						fontWeight: 600,
						lineHeight: 1.4,
						textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
					}}
				>
					{text}
				</span>
			</div>
		</div>
	);
};
