import React from 'react';
import {useCurrentFrame, interpolate, spring, useVideoConfig} from 'remotion';

interface DrawBoxProps {
	x: number;
	y: number;
	width: number;
	height: number;
	stroke?: string;
	strokeWidth?: number;
	fill?: string;
	rx?: number;
	startFrame?: number;
}

export const DrawBox: React.FC<DrawBoxProps> = ({
	x,
	y,
	width,
	height,
	stroke = '#2c3e50',
	strokeWidth = 3,
	fill = 'none',
	rx = 8,
	startFrame = 0,
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const perimeter = 2 * (width + height);

	const progress = spring({
		frame: frame - startFrame,
		fps,
		config: {damping: 50, stiffness: 80, mass: 0.5},
	});

	const dashOffset = interpolate(progress, [0, 1], [perimeter, 0]);
	const fillOpacity =
		fill !== 'none'
			? interpolate(progress, [0.7, 1], [0, 0.15], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})
			: 0;
	const opacity = frame >= startFrame ? 1 : 0;

	return (
		<rect
			x={x}
			y={y}
			width={width}
			height={height}
			rx={rx}
			stroke={stroke}
			strokeWidth={strokeWidth}
			fill={fill}
			fillOpacity={fillOpacity}
			strokeDasharray={perimeter}
			strokeDashoffset={dashOffset}
			opacity={opacity}
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	);
};
