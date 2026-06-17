import React from 'react';
import {useCurrentFrame, interpolate, spring, useVideoConfig} from 'remotion';

export type Expression = 'neutral' | 'happy' | 'angry' | 'scared' | 'dead' | 'confused' | 'crying' | 'shocked';
export type Pose = 'standing' | 'walking' | 'fighting' | 'sitting' | 'fallen' | 'celebrating' | 'marching';
export type Accessory = 'none' | 'roman_helmet' | 'roman_shield' | 'sword' | 'spear' | 'backpack' | 'sandals';

interface StickmanProps {
	x: number;
	y: number;
	scale?: number;
	expression?: Expression;
	pose?: Pose;
	accessories?: Accessory[];
	startFrame?: number;
	color?: string;
	flip?: boolean;
	label?: string;
	labelColor?: string;
}

const EyesAndMouth: React.FC<{expression: Expression}> = ({expression}) => {
	switch (expression) {
		case 'happy':
			return (
				<>
					{/* Eyes */}
					<circle cx={-6} cy={-6} r={2.5} fill="#2c3e50" />
					<circle cx={6} cy={-6} r={2.5} fill="#2c3e50" />
					{/* Smile */}
					<path d="M -7,3 Q 0,12 7,3" stroke="#2c3e50" strokeWidth={2} fill="none" strokeLinecap="round" />
				</>
			);
		case 'angry':
			return (
				<>
					{/* Angry eyebrows */}
					<line x1={-9} y1={-12} x2={-3} y2={-9} stroke="#2c3e50" strokeWidth={2} strokeLinecap="round" />
					<line x1={9} y1={-12} x2={3} y2={-9} stroke="#2c3e50" strokeWidth={2} strokeLinecap="round" />
					{/* Eyes */}
					<circle cx={-6} cy={-5} r={2.5} fill="#2c3e50" />
					<circle cx={6} cy={-5} r={2.5} fill="#2c3e50" />
					{/* Frown */}
					<path d="M -6,5 Q 0,1 6,5" stroke="#2c3e50" strokeWidth={2} fill="none" strokeLinecap="round" />
				</>
			);
		case 'scared':
			return (
				<>
					{/* Wide eyes */}
					<circle cx={-6} cy={-5} r={4} fill="white" stroke="#2c3e50" strokeWidth={1.5} />
					<circle cx={6} cy={-5} r={4} fill="white" stroke="#2c3e50" strokeWidth={1.5} />
					<circle cx={-5} cy={-5} r={2} fill="#2c3e50" />
					<circle cx={7} cy={-5} r={2} fill="#2c3e50" />
					{/* O mouth */}
					<ellipse cx={0} cy={6} rx={4} ry={5} fill="#2c3e50" />
				</>
			);
		case 'dead':
			return (
				<>
					{/* X eyes */}
					<line x1={-9} y1={-9} x2={-3} y2={-3} stroke="#2c3e50" strokeWidth={2} strokeLinecap="round" />
					<line x1={-3} y1={-9} x2={-9} y2={-3} stroke="#2c3e50" strokeWidth={2} strokeLinecap="round" />
					<line x1={3} y1={-9} x2={9} y2={-3} stroke="#2c3e50" strokeWidth={2} strokeLinecap="round" />
					<line x1={9} y1={-9} x2={3} y2={-3} stroke="#2c3e50" strokeWidth={2} strokeLinecap="round" />
					{/* Tongue */}
					<path d="M -3,4 L -3,8 Q 0,12 3,8 L 3,4" stroke="#e74c3c" strokeWidth={1.5} fill="#e74c3c" />
				</>
			);
		case 'confused':
			return (
				<>
					{/* One eye squint */}
					<circle cx={-6} cy={-5} r={2.5} fill="#2c3e50" />
					<line x1={3} y1={-5} x2={9} y2={-5} stroke="#2c3e50" strokeWidth={2.5} strokeLinecap="round" />
					{/* Wavy mouth */}
					<path d="M -6,5 Q -3,2 0,5 Q 3,8 6,5" stroke="#2c3e50" strokeWidth={2} fill="none" strokeLinecap="round" />
				</>
			);
		case 'crying':
			return (
				<>
					{/* Closed eyes */}
					<path d="M -9,-6 Q -6,-3 -3,-6" stroke="#2c3e50" strokeWidth={2} fill="none" strokeLinecap="round" />
					<path d="M 3,-6 Q 6,-3 9,-6" stroke="#2c3e50" strokeWidth={2} fill="none" strokeLinecap="round" />
					{/* Tears */}
					<ellipse cx={-10} cy={0} rx={2} ry={4} fill="#3498db" />
					<ellipse cx={10} cy={0} rx={2} ry={4} fill="#3498db" />
					{/* Sad mouth */}
					<path d="M -6,6 Q 0,2 6,6" stroke="#2c3e50" strokeWidth={2} fill="none" strokeLinecap="round" />
				</>
			);
		case 'shocked':
			return (
				<>
					{/* Huge eyes */}
					<circle cx={-7} cy={-5} r={5} fill="white" stroke="#2c3e50" strokeWidth={2} />
					<circle cx={7} cy={-5} r={5} fill="white" stroke="#2c3e50" strokeWidth={2} />
					<circle cx={-6} cy={-5} r={2.5} fill="#2c3e50" />
					<circle cx={8} cy={-5} r={2.5} fill="#2c3e50" />
					{/* Big O mouth */}
					<ellipse cx={0} cy={8} rx={6} ry={7} fill="#2c3e50" />
				</>
			);
		default: // neutral
			return (
				<>
					<circle cx={-6} cy={-5} r={2.5} fill="#2c3e50" />
					<circle cx={6} cy={-5} r={2.5} fill="#2c3e50" />
					<line x1={-5} y1={5} x2={5} y2={5} stroke="#2c3e50" strokeWidth={2} strokeLinecap="round" />
				</>
			);
	}
};

const AccessoryRenderer: React.FC<{accessory: Accessory; pose: Pose}> = ({accessory, pose}) => {
	switch (accessory) {
		case 'roman_helmet':
			return (
				<g transform="translate(0, -30)">
					{/* Helmet dome */}
					<path d="M -18,-5 Q -18,-25 0,-28 Q 18,-25 18,-5" fill="#c0392b" stroke="#922b21" strokeWidth={2} />
					{/* Crest */}
					<path d="M 0,-28 Q -5,-40 0,-42 Q 5,-40 0,-28" fill="#e74c3c" stroke="#c0392b" strokeWidth={1.5} />
					<path d="M 0,-42 L 0,-48 Q 8,-45 12,-38 Q 8,-42 0,-42" fill="#f1c40f" stroke="none" />
					{/* Crest plume */}
					<rect x={-2} y={-55} width={4} height={15} rx={2} fill="#e74c3c" />
					<ellipse cx={0} cy={-57} rx={5} ry={4} fill="#c0392b" />
					{/* Cheek guards */}
					<path d="M -18,-5 L -20,8 L -14,10" fill="#c0392b" stroke="#922b21" strokeWidth={1.5} />
					<path d="M 18,-5 L 20,8 L 14,10" fill="#c0392b" stroke="#922b21" strokeWidth={1.5} />
				</g>
			);
		case 'roman_shield':
			return (
				<g transform="translate(-45, 20)">
					<rect x={-18} y={-35} width={36} height={60} rx={4} fill="#c0392b" stroke="#922b21" strokeWidth={2} />
					{/* Shield boss */}
					<circle cx={0} cy={-5} r={8} fill="#f1c40f" stroke="#c0a030" strokeWidth={1.5} />
					{/* Shield decoration */}
					<line x1={0} y1={-30} x2={0} y2={20} stroke="#f1c40f" strokeWidth={2} />
					<line x1={-14} y1={-5} x2={14} y2={-5} stroke="#f1c40f" strokeWidth={2} />
				</g>
			);
		case 'sword':
			return (
				<g transform="translate(35, 0)">
					{/* Blade */}
					<rect x={-2} y={-45} width={4} height={35} fill="#bdc3c7" stroke="#95a5a6" strokeWidth={1} />
					<polygon points="-2,-45 2,-45 0,-52" fill="#bdc3c7" stroke="#95a5a6" strokeWidth={1} />
					{/* Guard */}
					<rect x={-8} y={-10} width={16} height={4} rx={1} fill="#c0a030" />
					{/* Handle */}
					<rect x={-2} y={-6} width={4} height={14} fill="#8B4513" />
					{/* Pommel */}
					<circle cx={0} cy={10} r={4} fill="#c0a030" />
				</g>
			);
		case 'spear':
			return (
				<g transform="translate(30, -20)">
					<line x1={0} y1={-50} x2={0} y2={60} stroke="#8B4513" strokeWidth={3} strokeLinecap="round" />
					<polygon points="-5,-50 5,-50 0,-65" fill="#95a5a6" stroke="#7f8c8d" strokeWidth={1} />
				</g>
			);
		case 'backpack':
			return (
				<g transform="translate(-30, 10)">
					<rect x={-12} y={-15} width={18} height={30} rx={3} fill="#8B4513" stroke="#6d3a1a" strokeWidth={1.5} />
					<line x1={-12} y1={-5} x2={6} y2={-5} stroke="#6d3a1a" strokeWidth={1} />
					<line x1={-12} y1={5} x2={6} y2={5} stroke="#6d3a1a" strokeWidth={1} />
					{/* Stuff poking out */}
					<line x1={-6} y1={-15} x2={-8} y2={-22} stroke="#7f8c8d" strokeWidth={2} />
					<circle cx={-8} cy={-24} r={3} fill="#bdc3c7" />
				</g>
			);
		case 'sandals':
			return (
				<g>
					{/* Left sandal straps */}
					<path d="M -12,88 Q -15,80 -12,72" stroke="#c0a030" strokeWidth={1.5} fill="none" />
					{/* Right sandal straps */}
					<path d="M 12,88 Q 15,80 12,72" stroke="#c0a030" strokeWidth={1.5} fill="none" />
				</g>
			);
		default:
			return null;
	}
};

const BodyPose: React.FC<{pose: Pose; color: string; frame: number}> = ({pose, color, frame}) => {
	const walkCycle = Math.sin(frame * 0.3) * 15;
	const marchCycle = Math.sin(frame * 0.2) * 10;

	switch (pose) {
		case 'walking':
			return (
				<g>
					{/* Body */}
					<line x1={0} y1={18} x2={0} y2={55} stroke={color} strokeWidth={4} strokeLinecap="round" />
					{/* Arms swinging */}
					<line x1={0} y1={28} x2={-18 + walkCycle * 0.5} y2={50} stroke={color} strokeWidth={3.5} strokeLinecap="round" />
					<line x1={0} y1={28} x2={18 - walkCycle * 0.5} y2={50} stroke={color} strokeWidth={3.5} strokeLinecap="round" />
					{/* Legs walking */}
					<line x1={0} y1={55} x2={-12 + walkCycle} y2={90} stroke={color} strokeWidth={3.5} strokeLinecap="round" />
					<line x1={0} y1={55} x2={12 - walkCycle} y2={90} stroke={color} strokeWidth={3.5} strokeLinecap="round" />
				</g>
			);
		case 'marching':
			return (
				<g>
					{/* Body straight */}
					<line x1={0} y1={18} x2={0} y2={55} stroke={color} strokeWidth={4} strokeLinecap="round" />
					{/* Arms rigid march */}
					<line x1={0} y1={28} x2={-15 + marchCycle} y2={48} stroke={color} strokeWidth={3.5} strokeLinecap="round" />
					<line x1={0} y1={28} x2={15 - marchCycle} y2={48} stroke={color} strokeWidth={3.5} strokeLinecap="round" />
					{/* Legs marching high step */}
					<line x1={0} y1={55} x2={-10 + marchCycle} y2={88} stroke={color} strokeWidth={3.5} strokeLinecap="round" />
					<line x1={0} y1={55} x2={10 - marchCycle} y2={88} stroke={color} strokeWidth={3.5} strokeLinecap="round" />
				</g>
			);
		case 'fighting':
			return (
				<g>
					{/* Body slightly leaned */}
					<line x1={0} y1={18} x2={-3} y2={55} stroke={color} strokeWidth={4} strokeLinecap="round" />
					{/* Right arm raised with weapon */}
					<line x1={0} y1={28} x2={25} y2={10} stroke={color} strokeWidth={3.5} strokeLinecap="round" />
					{/* Left arm with shield */}
					<line x1={0} y1={28} x2={-25} y2={35} stroke={color} strokeWidth={3.5} strokeLinecap="round" />
					{/* Wide stance */}
					<line x1={-3} y1={55} x2={-18} y2={90} stroke={color} strokeWidth={3.5} strokeLinecap="round" />
					<line x1={-3} y1={55} x2={15} y2={88} stroke={color} strokeWidth={3.5} strokeLinecap="round" />
				</g>
			);
		case 'sitting':
			return (
				<g>
					{/* Body */}
					<line x1={0} y1={18} x2={0} y2={50} stroke={color} strokeWidth={4} strokeLinecap="round" />
					{/* Arms resting */}
					<line x1={0} y1={28} x2={-18} y2={45} stroke={color} strokeWidth={3.5} strokeLinecap="round" />
					<line x1={0} y1={28} x2={18} y2={45} stroke={color} strokeWidth={3.5} strokeLinecap="round" />
					{/* Legs bent */}
					<line x1={0} y1={50} x2={-15} y2={65} stroke={color} strokeWidth={3.5} strokeLinecap="round" />
					<line x1={-15} y1={65} x2={-12} y2={88} stroke={color} strokeWidth={3.5} strokeLinecap="round" />
					<line x1={0} y1={50} x2={15} y2={65} stroke={color} strokeWidth={3.5} strokeLinecap="round" />
					<line x1={15} y1={65} x2={12} y2={88} stroke={color} strokeWidth={3.5} strokeLinecap="round" />
				</g>
			);
		case 'fallen':
			return (
				<g transform="rotate(80, 0, 50)">
					{/* Body */}
					<line x1={0} y1={18} x2={0} y2={55} stroke={color} strokeWidth={4} strokeLinecap="round" />
					{/* Arms limp */}
					<line x1={0} y1={28} x2={-15} y2={50} stroke={color} strokeWidth={3.5} strokeLinecap="round" />
					<line x1={0} y1={28} x2={20} y2={45} stroke={color} strokeWidth={3.5} strokeLinecap="round" />
					{/* Legs */}
					<line x1={0} y1={55} x2={-12} y2={85} stroke={color} strokeWidth={3.5} strokeLinecap="round" />
					<line x1={0} y1={55} x2={8} y2={88} stroke={color} strokeWidth={3.5} strokeLinecap="round" />
				</g>
			);
		case 'celebrating':
			return (
				<g>
					{/* Body */}
					<line x1={0} y1={18} x2={0} y2={55} stroke={color} strokeWidth={4} strokeLinecap="round" />
					{/* Arms up! */}
					<line x1={0} y1={28} x2={-22} y2={5} stroke={color} strokeWidth={3.5} strokeLinecap="round" />
					<line x1={0} y1={28} x2={22} y2={5} stroke={color} strokeWidth={3.5} strokeLinecap="round" />
					{/* Legs */}
					<line x1={0} y1={55} x2={-12} y2={90} stroke={color} strokeWidth={3.5} strokeLinecap="round" />
					<line x1={0} y1={55} x2={12} y2={90} stroke={color} strokeWidth={3.5} strokeLinecap="round" />
				</g>
			);
		default: // standing
			return (
				<g>
					{/* Body */}
					<line x1={0} y1={18} x2={0} y2={55} stroke={color} strokeWidth={4} strokeLinecap="round" />
					{/* Arms */}
					<line x1={0} y1={28} x2={-18} y2={48} stroke={color} strokeWidth={3.5} strokeLinecap="round" />
					<line x1={0} y1={28} x2={18} y2={48} stroke={color} strokeWidth={3.5} strokeLinecap="round" />
					{/* Legs */}
					<line x1={0} y1={55} x2={-12} y2={90} stroke={color} strokeWidth={3.5} strokeLinecap="round" />
					<line x1={0} y1={55} x2={12} y2={90} stroke={color} strokeWidth={3.5} strokeLinecap="round" />
				</g>
			);
	}
};

export const StickmanCharacter: React.FC<StickmanProps> = ({
	x,
	y,
	scale = 1,
	expression = 'neutral',
	pose = 'standing',
	accessories = [],
	startFrame = 0,
	color = '#2c3e50',
	flip = false,
	label,
	labelColor = '#2c3e50',
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const progress = spring({
		frame: frame - startFrame,
		fps,
		config: {damping: 20, stiffness: 100, mass: 0.5},
	});

	const scaleAnim = interpolate(progress, [0, 1], [0, scale]);
	const opacity = frame >= startFrame ? 1 : 0;
	const flipX = flip ? -1 : 1;

	return (
		<g
			transform={`translate(${x}, ${y}) scale(${scaleAnim * flipX}, ${scaleAnim})`}
			opacity={opacity}
		>
			{/* Accessories behind body */}
			{accessories.includes('roman_shield') && <AccessoryRenderer accessory="roman_shield" pose={pose} />}
			{accessories.includes('backpack') && <AccessoryRenderer accessory="backpack" pose={pose} />}

			{/* Body */}
			<BodyPose pose={pose} color={color} frame={frame} />

			{/* Head */}
			<circle cx={0} cy={0} r={18} fill="white" stroke={color} strokeWidth={3} />

			{/* Face */}
			<EyesAndMouth expression={expression} />

			{/* Accessories on top */}
			{accessories.includes('roman_helmet') && <AccessoryRenderer accessory="roman_helmet" pose={pose} />}
			{accessories.includes('sword') && <AccessoryRenderer accessory="sword" pose={pose} />}
			{accessories.includes('spear') && <AccessoryRenderer accessory="spear" pose={pose} />}
			{accessories.includes('sandals') && <AccessoryRenderer accessory="sandals" pose={pose} />}

			{/* Label */}
			{label && (
				<text
					x={0}
					y={110}
					textAnchor="middle"
					fontSize={16}
					fill={labelColor}
					fontFamily="'Segoe Print', 'Comic Sans MS', cursive"
					fontWeight="bold"
				>
					{label}
				</text>
			)}
		</g>
	);
};
