import React from 'react';
import {DrawPath} from './DrawPath';

interface IconProps {
	x: number;
	y: number;
	scale?: number;
	startFrame?: number;
	stroke?: string;
}

const Sword: React.FC<IconProps> = ({x, y, scale = 1, startFrame = 0, stroke = '#2c3e50'}) => (
	<g transform={`translate(${x}, ${y}) scale(${scale})`}>
		<DrawPath d="M 0,-40 L 0,30" stroke={stroke} strokeWidth={4} startFrame={startFrame} />
		<DrawPath d="M -15,20 L 15,20" stroke={stroke} strokeWidth={4} startFrame={startFrame + 5} />
		<DrawPath d="M -5,30 L 5,30 L 3,40 L -3,40 Z" stroke={stroke} strokeWidth={3} startFrame={startFrame + 8} />
	</g>
);

const Shield: React.FC<IconProps> = ({x, y, scale = 1, startFrame = 0, stroke = '#2c3e50'}) => (
	<g transform={`translate(${x}, ${y}) scale(${scale})`}>
		<DrawPath
			d="M 0,-35 L 25,-25 L 25,5 Q 25,30 0,40 Q -25,30 -25,5 L -25,-25 Z"
			stroke={stroke}
			strokeWidth={3}
			startFrame={startFrame}
		/>
		<DrawPath d="M 0,-20 L 0,25" stroke={stroke} strokeWidth={2} startFrame={startFrame + 10} />
		<DrawPath d="M -15,0 L 15,0" stroke={stroke} strokeWidth={2} startFrame={startFrame + 12} />
	</g>
);

const Crown: React.FC<IconProps> = ({x, y, scale = 1, startFrame = 0, stroke = '#c0a030'}) => (
	<g transform={`translate(${x}, ${y}) scale(${scale})`}>
		<DrawPath
			d="M -30,15 L -30,-10 L -15,-0 L 0,-20 L 15,0 L 30,-10 L 30,15 Z"
			stroke={stroke}
			strokeWidth={3}
			fill={stroke}
			startFrame={startFrame}
		/>
		<DrawPath d="M -30,15 L 30,15" stroke={stroke} strokeWidth={4} startFrame={startFrame + 8} />
	</g>
);

const Skull: React.FC<IconProps> = ({x, y, scale = 1, startFrame = 0, stroke = '#2c3e50'}) => (
	<g transform={`translate(${x}, ${y}) scale(${scale})`}>
		<DrawPath
			d="M 0,-25 Q 25,-25 25,0 Q 25,15 15,20 L 15,25 L -15,25 L -15,20 Q -25,15 -25,0 Q -25,-25 0,-25"
			stroke={stroke}
			strokeWidth={3}
			startFrame={startFrame}
		/>
		<DrawPath d="M -8,-5 Q -8,-12 -3,-5 Q -8,-12 -13,-5 Z" stroke={stroke} strokeWidth={2} startFrame={startFrame + 10} />
		<DrawPath d="M 8,-5 Q 8,-12 13,-5 Q 8,-12 3,-5 Z" stroke={stroke} strokeWidth={2} startFrame={startFrame + 10} />
		<DrawPath d="M -3,8 L 3,8" stroke={stroke} strokeWidth={2} startFrame={startFrame + 15} />
	</g>
);

const Column: React.FC<IconProps> = ({x, y, scale = 1, startFrame = 0, stroke = '#2c3e50'}) => (
	<g transform={`translate(${x}, ${y}) scale(${scale})`}>
		<DrawPath d="M -15,-40 L 15,-40" stroke={stroke} strokeWidth={4} startFrame={startFrame} />
		<DrawPath d="M -20,-45 L 20,-45 L 15,-40 L -15,-40 Z" stroke={stroke} strokeWidth={2} startFrame={startFrame} />
		<DrawPath d="M -10,-40 L -8,35" stroke={stroke} strokeWidth={3} startFrame={startFrame + 5} />
		<DrawPath d="M 10,-40 L 8,35" stroke={stroke} strokeWidth={3} startFrame={startFrame + 5} />
		<DrawPath d="M -20,35 L 20,35" stroke={stroke} strokeWidth={4} startFrame={startFrame + 12} />
		<DrawPath d="M -20,35 L -15,40 L 15,40 L 20,35" stroke={stroke} strokeWidth={2} startFrame={startFrame + 14} />
	</g>
);

const Fire: React.FC<IconProps> = ({x, y, scale = 1, startFrame = 0, stroke = '#e74c3c'}) => (
	<g transform={`translate(${x}, ${y}) scale(${scale})`}>
		<DrawPath
			d="M 0,20 Q -20,5 -15,-15 Q -10,0 0,-10 Q -5,-25 0,-35 Q 5,-25 10,-15 Q 15,0 10,-10 Q 20,5 15,10 Q 20,-5 15,-15 Q 25,5 0,20"
			stroke={stroke}
			strokeWidth={3}
			fill={stroke}
			startFrame={startFrame}
		/>
	</g>
);

export const SvgIcons = {
	Sword,
	Shield,
	Crown,
	Skull,
	Column,
	Fire,
};
