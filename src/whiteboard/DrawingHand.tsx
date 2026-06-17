import React from 'react';
import {useCurrentFrame, interpolate, spring, useVideoConfig} from 'remotion';

interface DrawingHandProps {
	points: {x: number; y: number; frame: number}[];
	scale?: number;
}

export const DrawingHand: React.FC<DrawingHandProps> = ({points, scale = 1}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const activeIdx = points.findIndex((p, i) => {
		const next = points[i + 1];
		if (!next) return frame >= p.frame;
		return frame >= p.frame && frame < next.frame;
	});

	if (activeIdx === -1) return null;

	const current = points[activeIdx];
	const next = points[activeIdx + 1];

	let x = current.x;
	let y = current.y;

	if (next) {
		const progress = interpolate(
			frame,
			[current.frame, next.frame],
			[0, 1],
			{extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
		);
		x = interpolate(progress, [0, 1], [current.x, next.x]);
		y = interpolate(progress, [0, 1], [current.y, next.y]);
	}

	const lastPoint = points[points.length - 1];
	const fadeOut = interpolate(
		frame,
		[lastPoint.frame, lastPoint.frame + 10],
		[1, 0],
		{extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
	);

	return (
		<g
			transform={`translate(${x}, ${y}) scale(${scale})`}
			opacity={fadeOut}
		>
			{/* Pen/marker shape */}
			<g transform="translate(5, -5) rotate(35)">
				{/* Marker body */}
				<rect x={-4} y={-55} width={8} height={40} rx={2} fill="#34495e" />
				{/* Marker tip */}
				<polygon points="-4,-15 4,-15 1,0 -1,0" fill="#2c3e50" />
				{/* Marker cap */}
				<rect x={-5} y={-60} width={10} height={8} rx={2} fill="#e74c3c" />
				{/* Hand */}
				<ellipse cx={0} cy={-70} rx={18} ry={14} fill="#f5cba7" stroke="#e8b88a" strokeWidth={1.5} />
				{/* Thumb */}
				<ellipse cx={12} cy={-60} rx={7} ry={5} fill="#f5cba7" stroke="#e8b88a" strokeWidth={1} transform="rotate(-20, 12, -60)" />
				{/* Fingers */}
				<ellipse cx={-8} cy={-58} rx={5} ry={4} fill="#f5cba7" stroke="#e8b88a" strokeWidth={1} />
				<ellipse cx={-2} cy={-56} rx={5} ry={4} fill="#f5cba7" stroke="#e8b88a" strokeWidth={1} />
				<ellipse cx={5} cy={-57} rx={5} ry={4} fill="#f5cba7" stroke="#e8b88a" strokeWidth={1} />
			</g>
		</g>
	);
};
