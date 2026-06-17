import React from 'react';
import {useCurrentFrame, interpolate, spring, useVideoConfig} from 'remotion';

interface TextOverlayProps {
	text: string;
	x: number;
	y: number;
	fontSize?: number;
	color?: string;
	startFrame?: number;
	align?: 'left' | 'center' | 'right';
	fontWeight?: string;
	bg?: string;
	bgPadding?: number;
	animation?: 'pop' | 'slide' | 'typewriter' | 'shake';
}

export const TextOverlay: React.FC<TextOverlayProps> = ({
	text,
	x,
	y,
	fontSize = 40,
	color = '#2c3e50',
	startFrame = 0,
	align = 'center',
	fontWeight = 'bold',
	bg,
	bgPadding = 12,
	animation = 'pop',
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	if (frame < startFrame) return null;

	const localFrame = frame - startFrame;
	const textAnchor = align === 'center' ? 'middle' : align === 'right' ? 'end' : 'start';

	let transform = '';
	let opacity = 1;

	switch (animation) {
		case 'pop': {
			const s = spring({frame: localFrame, fps, config: {damping: 12, stiffness: 150, mass: 0.4}});
			const sc = interpolate(s, [0, 1], [0, 1]);
			transform = `scale(${sc})`;
			opacity = interpolate(s, [0, 0.3], [0, 1], {extrapolateRight: 'clamp'});
			break;
		}
		case 'slide': {
			const s = spring({frame: localFrame, fps, config: {damping: 20, stiffness: 100, mass: 0.5}});
			const ty = interpolate(s, [0, 1], [40, 0]);
			opacity = interpolate(s, [0, 0.5], [0, 1], {extrapolateRight: 'clamp'});
			transform = `translate(0, ${ty})`;
			break;
		}
		case 'typewriter': {
			const charsToShow = Math.floor(interpolate(localFrame, [0, text.length * 2], [0, text.length], {extrapolateRight: 'clamp'}));
			return (
				<text
					x={x}
					y={y}
					textAnchor={textAnchor}
					fontSize={fontSize}
					fill={color}
					fontFamily="'Segoe Print', 'Comic Sans MS', cursive"
					fontWeight={fontWeight}
				>
					{text.slice(0, charsToShow)}
					{charsToShow < text.length && (
						<tspan opacity={localFrame % 8 < 4 ? 1 : 0}>|</tspan>
					)}
				</text>
			);
		}
		case 'shake': {
			const s = spring({frame: localFrame, fps, config: {damping: 8, stiffness: 200, mass: 0.3}});
			const sc = interpolate(s, [0, 1], [0, 1]);
			const shakeX = localFrame < 10 ? Math.sin(localFrame * 3) * 5 : 0;
			const shakeY = localFrame < 10 ? Math.cos(localFrame * 4) * 3 : 0;
			transform = `translate(${shakeX}, ${shakeY}) scale(${sc})`;
			opacity = interpolate(s, [0, 0.2], [0, 1], {extrapolateRight: 'clamp'});
			break;
		}
	}

	const textWidth = text.length * fontSize * 0.55;
	const bgX = align === 'center' ? x - textWidth / 2 - bgPadding : x - bgPadding;
	const bgWidth = textWidth + bgPadding * 2;

	return (
		<g transform={`translate(${x}, ${y})`} opacity={opacity}>
			<g transform={transform} style={{transformOrigin: '0 0'}}>
				{bg && (
					<rect
						x={-bgWidth / 2 + (align === 'center' ? 0 : bgWidth / 2)}
						y={-fontSize * 0.8}
						width={bgWidth}
						height={fontSize * 1.3}
						rx={8}
						fill={bg}
					/>
				)}
				<text
					x={0}
					y={0}
					textAnchor={textAnchor}
					fontSize={fontSize}
					fill={color}
					fontFamily="'Segoe Print', 'Comic Sans MS', cursive"
					fontWeight={fontWeight}
				>
					{text}
				</text>
			</g>
		</g>
	);
};
