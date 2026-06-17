import React from 'react';
import {DrawPath} from './DrawPath';

interface IconProps {
	x: number;
	y: number;
	scale?: number;
	startFrame?: number;
	stroke?: string;
}

const RomanSoldier: React.FC<IconProps> = ({x, y, scale = 1, startFrame = 0, stroke = '#2c3e50'}) => (
	<g transform={`translate(${x}, ${y}) scale(${scale})`}>
		{/* Helmet */}
		<DrawPath d="M -20,-65 Q -25,-85 0,-90 Q 25,-85 20,-65" stroke={stroke} strokeWidth={2.5} startFrame={startFrame} />
		<DrawPath d="M -5,-90 Q 0,-95 5,-90" stroke={stroke} strokeWidth={2} startFrame={startFrame + 2} />
		{/* Helmet crest */}
		<DrawPath d="M 0,-92 Q -8,-105 -3,-110 Q 5,-108 8,-100 Q 12,-92 5,-90" stroke="#c0392b" strokeWidth={2} fill="#c0392b" startFrame={startFrame + 3} />
		{/* Face */}
		<DrawPath d="M -15,-65 Q -15,-45 0,-40 Q 15,-45 15,-65" stroke={stroke} strokeWidth={2} startFrame={startFrame + 5} />
		{/* Eyes */}
		<DrawPath d="M -8,-58 L -5,-58" stroke={stroke} strokeWidth={2} startFrame={startFrame + 8} />
		<DrawPath d="M 5,-58 L 8,-58" stroke={stroke} strokeWidth={2} startFrame={startFrame + 8} />
		{/* Body/armor */}
		<DrawPath d="M -18,-38 L -22,15 L 22,15 L 18,-38" stroke={stroke} strokeWidth={2.5} startFrame={startFrame + 10} />
		{/* Belt */}
		<DrawPath d="M -22,-5 L 22,-5" stroke={stroke} strokeWidth={2} startFrame={startFrame + 13} />
		{/* Skirt strips */}
		<DrawPath d="M -18,15 L -20,35" stroke={stroke} strokeWidth={2} startFrame={startFrame + 15} />
		<DrawPath d="M -8,15 L -9,35" stroke={stroke} strokeWidth={2} startFrame={startFrame + 15} />
		<DrawPath d="M 2,15 L 1,35" stroke={stroke} strokeWidth={2} startFrame={startFrame + 15} />
		<DrawPath d="M 12,15 L 11,35" stroke={stroke} strokeWidth={2} startFrame={startFrame + 15} />
		<DrawPath d="M 18,15 L 20,35" stroke={stroke} strokeWidth={2} startFrame={startFrame + 15} />
		{/* Legs */}
		<DrawPath d="M -12,35 L -14,65" stroke={stroke} strokeWidth={2.5} startFrame={startFrame + 18} />
		<DrawPath d="M 12,35 L 14,65" stroke={stroke} strokeWidth={2.5} startFrame={startFrame + 18} />
		{/* Sandals */}
		<DrawPath d="M -18,65 L -10,65" stroke={stroke} strokeWidth={2.5} startFrame={startFrame + 20} />
		<DrawPath d="M 10,65 L 18,65" stroke={stroke} strokeWidth={2.5} startFrame={startFrame + 20} />
		{/* Shield (left hand) */}
		<DrawPath d="M -40,-30 L -40,10 Q -40,20 -30,20 L -25,20 Q -20,20 -20,10 L -20,-30 Q -20,-35 -30,-35 L -35,-35 Q -40,-35 -40,-30" stroke="#c0392b" strokeWidth={2} fill="#c0392b" startFrame={startFrame + 22} />
		<DrawPath d="M -30,-20 L -30,5" stroke="#f1c40f" strokeWidth={2} startFrame={startFrame + 25} />
		<DrawPath d="M -37,-8 L -23,-8" stroke="#f1c40f" strokeWidth={2} startFrame={startFrame + 25} />
		{/* Sword (right hand) */}
		<DrawPath d="M 25,-35 L 28,-70" stroke="#7f8c8d" strokeWidth={2.5} startFrame={startFrame + 27} />
		<DrawPath d="M 20,-35 L 35,-35" stroke={stroke} strokeWidth={2.5} startFrame={startFrame + 29} />
		<DrawPath d="M 25,-30 L 30,-30" stroke="#c0392b" strokeWidth={3} startFrame={startFrame + 30} />
	</g>
);

const Barbarian: React.FC<IconProps> = ({x, y, scale = 1, startFrame = 0, stroke = '#2c3e50'}) => (
	<g transform={`translate(${x}, ${y}) scale(${scale})`}>
		{/* Wild hair */}
		<DrawPath d="M -20,-75 Q -30,-85 -15,-90 Q 0,-95 15,-90 Q 30,-85 20,-75" stroke={stroke} strokeWidth={2} startFrame={startFrame} />
		<DrawPath d="M -18,-88 Q -22,-95 -15,-93" stroke={stroke} strokeWidth={1.5} startFrame={startFrame + 2} />
		<DrawPath d="M 18,-88 Q 22,-95 15,-93" stroke={stroke} strokeWidth={1.5} startFrame={startFrame + 2} />
		{/* Face */}
		<DrawPath d="M -18,-75 L -18,-50 Q -18,-40 0,-38 Q 18,-40 18,-50 L 18,-75" stroke={stroke} strokeWidth={2} startFrame={startFrame + 4} />
		{/* Beard */}
		<DrawPath d="M -15,-50 Q -15,-35 0,-30 Q 15,-35 15,-50" stroke={stroke} strokeWidth={2} startFrame={startFrame + 6} />
		{/* Eyes (angry) */}
		<DrawPath d="M -12,-62 L -6,-60" stroke={stroke} strokeWidth={2} startFrame={startFrame + 8} />
		<DrawPath d="M 6,-60 L 12,-62" stroke={stroke} strokeWidth={2} startFrame={startFrame + 8} />
		{/* Body (fur vest) */}
		<DrawPath d="M -22,-30 L -25,20 L 25,20 L 22,-30" stroke={stroke} strokeWidth={2.5} startFrame={startFrame + 10} />
		{/* Fur texture */}
		<DrawPath d="M -22,-20 Q -18,-18 -22,-15 Q -18,-13 -22,-10" stroke={stroke} strokeWidth={1.5} startFrame={startFrame + 13} />
		<DrawPath d="M 22,-20 Q 18,-18 22,-15 Q 18,-13 22,-10" stroke={stroke} strokeWidth={1.5} startFrame={startFrame + 13} />
		{/* Belt */}
		<DrawPath d="M -25,5 L 25,5" stroke={stroke} strokeWidth={2.5} startFrame={startFrame + 14} />
		{/* Legs with fur boots */}
		<DrawPath d="M -12,20 L -14,55 Q -18,60 -18,65 L -8,65" stroke={stroke} strokeWidth={2.5} startFrame={startFrame + 16} />
		<DrawPath d="M 12,20 L 14,55 Q 18,60 18,65 L 8,65" stroke={stroke} strokeWidth={2.5} startFrame={startFrame + 16} />
		{/* Axe */}
		<DrawPath d="M 30,-30 L 35,25" stroke="#8B4513" strokeWidth={3} startFrame={startFrame + 19} />
		<DrawPath d="M 28,-35 Q 40,-40 45,-30 Q 42,-20 30,-25" stroke="#7f8c8d" strokeWidth={2} fill="#95a5a6" startFrame={startFrame + 21} />
	</g>
);

const Colosseum: React.FC<IconProps> = ({x, y, scale = 1, startFrame = 0, stroke = '#2c3e50'}) => (
	<g transform={`translate(${x}, ${y}) scale(${scale})`}>
		{/* Outer ellipse */}
		<DrawPath d="M -80,20 Q -80,-40 0,-45 Q 80,-40 80,20 Q 80,40 0,45 Q -80,40 -80,20" stroke={stroke} strokeWidth={2.5} startFrame={startFrame} />
		{/* Top row arches */}
		<DrawPath d="M -60,-25 Q -50,-35 -40,-25" stroke={stroke} strokeWidth={2} startFrame={startFrame + 8} />
		<DrawPath d="M -30,-32 Q -20,-42 -10,-32" stroke={stroke} strokeWidth={2} startFrame={startFrame + 10} />
		<DrawPath d="M 0,-35 Q 10,-45 20,-35" stroke={stroke} strokeWidth={2} startFrame={startFrame + 12} />
		<DrawPath d="M 30,-32 Q 40,-42 50,-32" stroke={stroke} strokeWidth={2} startFrame={startFrame + 14} />
		{/* Middle row arches */}
		<DrawPath d="M -65,-5 Q -55,-15 -45,-5" stroke={stroke} strokeWidth={2} startFrame={startFrame + 16} />
		<DrawPath d="M -35,-10 Q -25,-20 -15,-10" stroke={stroke} strokeWidth={2} startFrame={startFrame + 18} />
		<DrawPath d="M -5,-12 Q 5,-22 15,-12" stroke={stroke} strokeWidth={2} startFrame={startFrame + 20} />
		<DrawPath d="M 25,-10 Q 35,-20 45,-10" stroke={stroke} strokeWidth={2} startFrame={startFrame + 22} />
		{/* Bottom row arches */}
		<DrawPath d="M -65,15 Q -55,5 -45,15" stroke={stroke} strokeWidth={2} startFrame={startFrame + 24} />
		<DrawPath d="M -35,12 Q -25,2 -15,12" stroke={stroke} strokeWidth={2} startFrame={startFrame + 26} />
		<DrawPath d="M -5,10 Q 5,0 15,10" stroke={stroke} strokeWidth={2} startFrame={startFrame + 28} />
		<DrawPath d="M 25,12 Q 35,2 45,12" stroke={stroke} strokeWidth={2} startFrame={startFrame + 30} />
		{/* Floor lines */}
		<DrawPath d="M -70,-25 L -70,25" stroke={stroke} strokeWidth={1.5} startFrame={startFrame + 5} />
		<DrawPath d="M 70,-25 L 70,25" stroke={stroke} strokeWidth={1.5} startFrame={startFrame + 5} />
		{/* Damage/ruins on right side */}
		<DrawPath d="M 55,-30 Q 65,-20 60,-10" stroke={stroke} strokeWidth={2} startFrame={startFrame + 32} />
		<DrawPath d="M 62,-25 L 70,-35" stroke={stroke} strokeWidth={1.5} startFrame={startFrame + 33} />
	</g>
);

const Coins: React.FC<IconProps> = ({x, y, scale = 1, startFrame = 0}) => (
	<g transform={`translate(${x}, ${y}) scale(${scale})`}>
		<DrawPath d="M -15,0 Q -15,-20 0,-20 Q 15,-20 15,0 Q 15,20 0,20 Q -15,20 -15,0" stroke="#c0a030" strokeWidth={2.5} fill="#f1c40f" startFrame={startFrame} />
		<DrawPath d="M -2,-12 L -2,12" stroke="#c0a030" strokeWidth={2} startFrame={startFrame + 8} />
		<DrawPath d="M -6,-8 L 2,-8" stroke="#c0a030" strokeWidth={1.5} startFrame={startFrame + 10} />
		<DrawPath d="M -6,8 L 2,8" stroke="#c0a030" strokeWidth={1.5} startFrame={startFrame + 10} />
		{/* Second coin behind */}
		<DrawPath d="M 5,-5 Q 5,-25 20,-25 Q 35,-25 35,-5 Q 35,15 20,15 Q 5,15 5,-5" stroke="#c0a030" strokeWidth={2} fill="#f39c12" startFrame={startFrame + 3} />
	</g>
);

const BrokenColumn: React.FC<IconProps> = ({x, y, scale = 1, startFrame = 0, stroke = '#2c3e50'}) => (
	<g transform={`translate(${x}, ${y}) scale(${scale})`}>
		{/* Base */}
		<DrawPath d="M -25,50 L 25,50" stroke={stroke} strokeWidth={3} startFrame={startFrame} />
		<DrawPath d="M -22,50 L -20,45 L 20,45 L 22,50" stroke={stroke} strokeWidth={2} startFrame={startFrame + 2} />
		{/* Column shaft */}
		<DrawPath d="M -12,45 L -10,-10" stroke={stroke} strokeWidth={2.5} startFrame={startFrame + 4} />
		<DrawPath d="M 12,45 L 10,-10" stroke={stroke} strokeWidth={2.5} startFrame={startFrame + 4} />
		{/* Broken top */}
		<DrawPath d="M -10,-10 L -15,-15 L -5,-20 L 0,-12 L 8,-18 L 10,-10" stroke={stroke} strokeWidth={2} startFrame={startFrame + 8} />
		{/* Fallen piece */}
		<DrawPath d="M 20,40 L 35,35 L 40,45 L 25,48 Z" stroke={stroke} strokeWidth={2} startFrame={startFrame + 12} />
		{/* Cracks */}
		<DrawPath d="M -5,20 L 2,15 L -3,8" stroke={stroke} strokeWidth={1.5} startFrame={startFrame + 14} />
	</g>
);

const MapRome: React.FC<IconProps> = ({x, y, scale = 1, startFrame = 0}) => (
	<g transform={`translate(${x}, ${y}) scale(${scale})`}>
		{/* Mediterranean simplified */}
		<DrawPath d="M -150,0 Q -120,-60 -60,-50 Q 0,-80 60,-50 Q 120,-30 150,-40" stroke="#3498db" strokeWidth={2} startFrame={startFrame} />
		<DrawPath d="M -150,30 Q -100,50 -40,20 Q 20,40 80,20 Q 130,30 150,10" stroke="#3498db" strokeWidth={2} startFrame={startFrame + 5} />
		{/* Italy boot */}
		<DrawPath d="M -10,-50 L -5,-20 Q 0,0 10,-5 Q 5,10 -5,5 Q -15,15 -20,10" stroke="#2c3e50" strokeWidth={2.5} startFrame={startFrame + 10} />
		{/* Rome marker */}
		<DrawPath d="M -8,-25 Q -8,-35 0,-35 Q 8,-35 8,-25 Q 8,-20 0,-15 Q -8,-20 -8,-25" stroke="#e74c3c" strokeWidth={2} fill="#e74c3c" startFrame={startFrame + 15} />
		{/* Territory fill - expanding */}
		<DrawPath d="M -80,-30 Q -60,-60 -20,-55 Q 20,-70 60,-45 Q 100,-25 120,-35 L 120,15 Q 80,25 40,15 Q 0,30 -50,20 Q -100,40 -120,20 L -120,-10 Q -100,-20 -80,-30" stroke="#e74c3c" strokeWidth={1.5} fill="#e74c3c" startFrame={startFrame + 18} durationFrames={40} />
	</g>
);

export const DetailedIcons = {
	RomanSoldier,
	Barbarian,
	Colosseum,
	Coins,
	BrokenColumn,
	MapRome,
};
