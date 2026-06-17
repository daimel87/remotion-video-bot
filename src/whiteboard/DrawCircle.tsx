import React from 'react';
import {useCurrentFrame, interpolate, spring, useVideoConfig} from 'remotion';

interface DrawCircleProps {
	cx: number;
	cy: number;
	r: number;
	stroke?: string;
	strokeWidth?: number;
	fill?: string;
	startFrame?: number;
}

export const DrawCircle: React.FC<DrawCircleProps> = ({
	cx,
	cy,
	r,
	stroke = '#2c3e50',
	strokeWidth = 3,
	fill = 'none',
	startFrame = 0,
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const circumference = 2 * Math.PI * r;

	const progress = spring({
		frame: frame - startFrame,
		fps,
		config: {damping: 50, stiffness: 80, mass: 0.5},
	});

	const dashOffset = interpolate(progress, [0, 1], [circumference, 0]);
	const fillOpacity =
		fill !== 'none' ? interpolate(progress, [0.7, 1], [0, 0.3], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 0;
	const opacity = frame >= startFrame ? 1 : 0;

	return (
		<circle
			cx={cx}
			cy={cy}
			r={r}
			stroke={stroke}
			strokeWidth={strokeWidth}
			fill={fill}
			fillOpacity={fillOpacity}
			strokeDasharray={circumference}
			strokeDashoffset={dashOffset}
			opacity={opacity}
			strokeLinecap="round"
		/>
	);
};
