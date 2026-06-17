import React from 'react';
import {useCurrentFrame, interpolate, spring, useVideoConfig} from 'remotion';

interface DrawArrowProps {
	x1: number;
	y1: number;
	x2: number;
	y2: number;
	stroke?: string;
	strokeWidth?: number;
	startFrame?: number;
}

export const DrawArrow: React.FC<DrawArrowProps> = ({
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
	const angle = Math.atan2(y2 - y1, x2 - x1);

	const progress = spring({
		frame: frame - startFrame,
		fps,
		config: {damping: 50, stiffness: 80, mass: 0.5},
	});

	const dashOffset = interpolate(progress, [0, 1], [length, 0]);
	const headOpacity = interpolate(progress, [0.6, 1], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const opacity = frame >= startFrame ? 1 : 0;

	const headSize = 12;
	const hx = x2 - headSize * Math.cos(angle - Math.PI / 6);
	const hy = y2 - headSize * Math.sin(angle - Math.PI / 6);
	const hx2 = x2 - headSize * Math.cos(angle + Math.PI / 6);
	const hy2 = y2 - headSize * Math.sin(angle + Math.PI / 6);

	return (
		<g opacity={opacity}>
			<line
				x1={x1}
				y1={y1}
				x2={x2}
				y2={y2}
				stroke={stroke}
				strokeWidth={strokeWidth}
				strokeDasharray={length}
				strokeDashoffset={dashOffset}
				strokeLinecap="round"
			/>
			<polygon
				points={`${x2},${y2} ${hx},${hy} ${hx2},${hy2}`}
				fill={stroke}
				opacity={headOpacity}
			/>
		</g>
	);
};
