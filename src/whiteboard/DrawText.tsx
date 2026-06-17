import React from 'react';
import {useCurrentFrame, interpolate, spring, useVideoConfig} from 'remotion';

interface DrawTextProps {
	text: string;
	x: number;
	y: number;
	fontSize?: number;
	color?: string;
	fontWeight?: string;
	startFrame?: number;
	align?: 'left' | 'center' | 'right';
	maxWidth?: number;
}

export const DrawText: React.FC<DrawTextProps> = ({
	text,
	x,
	y,
	fontSize = 40,
	color = '#2c3e50',
	fontWeight = 'bold',
	startFrame = 0,
	align = 'left',
	maxWidth,
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const progress = spring({
		frame: frame - startFrame,
		fps,
		config: {damping: 30, stiffness: 120, mass: 0.4},
	});

	const opacity = interpolate(progress, [0, 0.3], [0, 1], {
		extrapolateRight: 'clamp',
	});
	const translateY = interpolate(progress, [0, 1], [15, 0]);
	const scale = interpolate(progress, [0, 1], [0.9, 1]);

	const textAnchor =
		align === 'center' ? 'middle' : align === 'right' ? 'end' : 'start';

	if (maxWidth) {
		const words = text.split(' ');
		const lines: string[] = [];
		let currentLine = '';

		for (const word of words) {
			const testLine = currentLine ? `${currentLine} ${word}` : word;
			if (testLine.length * fontSize * 0.55 > maxWidth && currentLine) {
				lines.push(currentLine);
				currentLine = word;
			} else {
				currentLine = testLine;
			}
		}
		if (currentLine) lines.push(currentLine);

		return (
			<g
				opacity={opacity}
				transform={`translate(${x}, ${y + translateY}) scale(${scale})`}
			>
				{lines.map((line, i) => (
					<text
						key={i}
						x={0}
						y={i * fontSize * 1.3}
						fontSize={fontSize}
						fill={color}
						fontWeight={fontWeight}
						fontFamily="'Virgil', 'Segoe Print', 'Comic Sans MS', cursive"
						textAnchor={textAnchor}
					>
						{line}
					</text>
				))}
			</g>
		);
	}

	return (
		<text
			x={x}
			y={y}
			fontSize={fontSize}
			fill={color}
			fontWeight={fontWeight}
			fontFamily="'Virgil', 'Segoe Print', 'Comic Sans MS', cursive"
			textAnchor={textAnchor}
			opacity={opacity}
			transform={`translate(0, ${translateY}) scale(${scale})`}
			style={{transformOrigin: `${x}px ${y}px`}}
		>
			{text}
		</text>
	);
};
