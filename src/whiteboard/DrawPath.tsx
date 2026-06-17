import React, {useRef, useEffect, useState} from 'react';
import {useCurrentFrame, interpolate, spring, useVideoConfig} from 'remotion';

interface DrawPathProps {
	d: string;
	stroke?: string;
	strokeWidth?: number;
	fill?: string;
	startFrame?: number;
	durationFrames?: number;
	style?: React.CSSProperties;
}

export const DrawPath: React.FC<DrawPathProps> = ({
	d,
	stroke = '#2c3e50',
	strokeWidth = 3,
	fill = 'none',
	startFrame = 0,
	durationFrames = 30,
	style,
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const pathRef = useRef<SVGPathElement>(null);
	const [pathLength, setPathLength] = useState(1000);

	useEffect(() => {
		if (pathRef.current) {
			setPathLength(pathRef.current.getTotalLength());
		}
	}, [d]);

	const progress = spring({
		frame: frame - startFrame,
		fps,
		config: {damping: 50, stiffness: 80, mass: 0.5},
	});

	const strokeDashoffset = interpolate(progress, [0, 1], [pathLength, 0]);
	const opacity = frame >= startFrame ? 1 : 0;

	const fillOpacity =
		fill !== 'none'
			? interpolate(
					frame,
					[startFrame + durationFrames - 5, startFrame + durationFrames],
					[0, 1],
					{extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
				)
			: 0;

	return (
		<path
			ref={pathRef}
			d={d}
			stroke={stroke}
			strokeWidth={strokeWidth}
			fill={fill}
			fillOpacity={fillOpacity}
			strokeDasharray={pathLength}
			strokeDashoffset={strokeDashoffset}
			opacity={opacity}
			strokeLinecap="round"
			strokeLinejoin="round"
			style={style}
		/>
	);
};
