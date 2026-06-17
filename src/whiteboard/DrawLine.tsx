import React from 'react';
import {useCurrentFrame, interpolate, spring, useVideoConfig} from 'remotion';

interface DrawLineProps {
	x1: number;
	y1: number;
	x2: number;
	y2: number;
	stroke?: string;
	strokeWidth?: number;
	startFrame?: number;
}

export const DrawLine: React.FC<DrawLineProps> = ({
	x1,
	y1,
	x2,
	y2,
	stroke = '#2c3e50',
	strokeWidth = 3,
	startFrame = 0,
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

	const progress = spring({
		frame: frame - startFrame,
		fps,
		config: {damping: 50, stiffness: 80, mass: 0.5},
	});

	const dashOffset = interpolate(progress, [0, 1], [length, 0]);
	const opacity = frame >= startFrame ? 1 : 0;

	return (
		<line
			x1={x1}
			y1={y1}
			x2={x2}
			y2={y2}
			stroke={stroke}
			strokeWidth={strokeWidth}
			strokeDasharray={length}
			strokeDashoffset={dashOffset}
			opacity={opacity}
			strokeLinecap="round"
		/>
	);
};
