import React from 'react';
import {useCurrentFrame, interpolate, spring, useVideoConfig} from 'remotion';

interface SpeechBubbleProps {
	x: number;
	y: number;
	text: string;
	startFrame?: number;
	width?: number;
	tailDirection?: 'left' | 'right' | 'bottom';
	type?: 'speech' | 'thought' | 'shout';
	fontSize?: number;
	bgColor?: string;
	textColor?: string;
}

export const SpeechBubble: React.FC<SpeechBubbleProps> = ({
	x,
	y,
	text,
	startFrame = 0,
	width = 280,
	tailDirection = 'bottom',
	type = 'speech',
	fontSize = 20,
	bgColor = 'white',
	textColor = '#2c3e50',
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const progress = spring({
		frame: frame - startFrame,
		fps,
		config: {damping: 15, stiffness: 150, mass: 0.4},
	});

	if (frame < startFrame) return null;

	const scaleVal = interpolate(progress, [0, 1], [0, 1]);

	const lines = [];
	const words = text.split(' ');
	let currentLine = '';
	const charsPerLine = Math.floor(width / (fontSize * 0.55));

	for (const word of words) {
		if ((currentLine + ' ' + word).trim().length > charsPerLine && currentLine) {
			lines.push(currentLine);
			currentLine = word;
		} else {
			currentLine = currentLine ? currentLine + ' ' + word : word;
		}
	}
	if (currentLine) lines.push(currentLine);

	const padding = 16;
	const lineHeight = fontSize * 1.4;
	const height = lines.length * lineHeight + padding * 2;
	const halfW = width / 2;
	const halfH = height / 2;

	const borderColor = type === 'shout' ? '#e74c3c' : '#2c3e50';
	const strokeWidth = type === 'shout' ? 3 : 2;

	let tailPath = '';
	if (tailDirection === 'bottom') {
		tailPath = `M ${-8},${halfH} L ${0},${halfH + 18} L ${8},${halfH}`;
	} else if (tailDirection === 'left') {
		tailPath = `M ${-halfW},${5} L ${-halfW - 18},${12} L ${-halfW},${18}`;
	} else {
		tailPath = `M ${halfW},${5} L ${halfW + 18},${12} L ${halfW},${18}`;
	}

	return (
		<g
			transform={`translate(${x}, ${y}) scale(${scaleVal})`}
			style={{transformOrigin: `${x}px ${y}px`}}
		>
			{type === 'thought' ? (
				<>
					<rect
						x={-halfW}
						y={-halfH}
						width={width}
						height={height}
						rx={20}
						fill={bgColor}
						stroke={borderColor}
						strokeWidth={strokeWidth}
					/>
					{/* Thought bubbles */}
					<circle cx={-5} cy={halfH + 10} r={6} fill={bgColor} stroke={borderColor} strokeWidth={1.5} />
					<circle cx={-10} cy={halfH + 22} r={4} fill={bgColor} stroke={borderColor} strokeWidth={1.5} />
				</>
			) : (
				<>
					<rect
						x={-halfW}
						y={-halfH}
						width={width}
						height={height}
						rx={type === 'shout' ? 5 : 15}
						fill={bgColor}
						stroke={borderColor}
						strokeWidth={strokeWidth}
					/>
					<path d={tailPath} fill={bgColor} stroke={borderColor} strokeWidth={strokeWidth} />
					{/* Cover the border where tail meets bubble */}
					{tailDirection === 'bottom' && (
						<line x1={-7} y1={halfH} x2={7} y2={halfH} stroke={bgColor} strokeWidth={3} />
					)}
				</>
			)}

			{lines.map((line, i) => (
				<text
					key={i}
					x={0}
					y={-halfH + padding + fontSize + i * lineHeight}
					textAnchor="middle"
					fontSize={fontSize}
					fill={textColor}
					fontFamily="'Segoe Print', 'Comic Sans MS', cursive"
					fontWeight={type === 'shout' ? 'bold' : 'normal'}
				>
					{line}
				</text>
			))}
		</g>
	);
};
