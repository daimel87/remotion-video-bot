import React from 'react';
import {useCurrentFrame, interpolate, spring, useVideoConfig} from 'remotion';

interface RevealImageProps {
	x: number;
	y: number;
	width: number;
	height: number;
	children: React.ReactNode;
	startFrame?: number;
	durationFrames?: number;
	direction?: 'left' | 'right' | 'top' | 'bottom';
}

export const RevealImage: React.FC<RevealImageProps> = ({
	x,
	y,
	width,
	height,
	children,
	startFrame = 0,
	durationFrames = 40,
	direction = 'left',
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const progress = spring({
		frame: frame - startFrame,
		fps,
		config: {damping: 80, stiffness: 40, mass: 0.8},
	});

	const clipId = `reveal-${x}-${y}-${startFrame}`;

	let clipRect;
	switch (direction) {
		case 'left':
			clipRect = {x: 0, y: 0, width: width * progress, height};
			break;
		case 'right':
			clipRect = {x: width * (1 - progress), y: 0, width: width * progress, height};
			break;
		case 'top':
			clipRect = {x: 0, y: 0, width, height: height * progress};
			break;
		case 'bottom':
			clipRect = {x: 0, y: height * (1 - progress), width, height: height * progress};
			break;
	}

	if (frame < startFrame) return null;

	return (
		<>
			<defs>
				<clipPath id={clipId}>
					<rect {...clipRect} />
				</clipPath>
			</defs>
			<g transform={`translate(${x}, ${y})`} clipPath={`url(#${clipId})`}>
				{children}
			</g>
		</>
	);
};
