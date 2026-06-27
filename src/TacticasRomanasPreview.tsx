import React from 'react';
import {
	AbsoluteFill,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';

const Soldier: React.FC<{
	x: number;
	y: number;
	delay: number;
	shieldUp?: boolean;
	flip?: boolean;
}> = ({x, y, delay, shieldUp = false, flip = false}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const pop = spring({frame: frame - delay, fps, config: {damping: 10, mass: 0.6}});
	const scale = interpolate(pop, [0, 1], [0, 1]);
	const bounceY = interpolate(pop, [0, 0.5, 1], [30, -5, 0]);

	return (
		<g
			transform={`translate(${x}, ${y}) scale(${scale * (flip ? -1 : 1)}, ${scale}) translate(0, ${bounceY})`}
		>
			{/* Legs */}
			<rect x={-12} y={50} width={10} height={30} rx={3} fill="#8B6914" />
			<rect x={4} y={50} width={10} height={30} rx={3} fill="#8B6914" />
			{/* Sandals */}
			<rect x={-14} y={76} width={14} height={6} rx={2} fill="#5C4A1E" />
			<rect x={2} y={76} width={14} height={6} rx={2} fill="#5C4A1E" />
			{/* Body - tunic */}
			<rect x={-18} y={10} width={38} height={45} rx={5} fill="#C41E1E" />
			{/* Armor strips */}
			<rect x={-16} y={18} width={34} height={4} rx={1} fill="#D4A843" />
			<rect x={-16} y={26} width={34} height={4} rx={1} fill="#D4A843" />
			<rect x={-16} y={34} width={34} height={4} rx={1} fill="#D4A843" />
			{/* Belt */}
			<rect x={-18} y={44} width={38} height={6} rx={1} fill="#7B5B2A" />
			<rect x={-3} y={43} width={8} height={8} rx={1} fill="#D4A843" />
			{/* Head */}
			<circle cx={1} cy={-5} r={18} fill="#F5D0A9" />
			{/* Eyes */}
			<circle cx={-6} cy={-8} r={3} fill="#1a1a1a" />
			<circle cx={10} cy={-8} r={3} fill="#1a1a1a" />
			<circle cx={-5} cy={-9} r={1} fill="white" />
			<circle cx={11} cy={-9} r={1} fill="white" />
			{/* Mouth */}
			<ellipse cx={2} cy={2} rx={4} ry={2} fill="#C47A5A" />
			{/* Helmet */}
			<path
				d="M-18,-12 Q-18,-32 1,-35 Q20,-32 20,-12 L18,-8 Q1,-15 -16,-8 Z"
				fill="#B8860B"
			/>
			{/* Helmet crest */}
			<path
				d="M1,-35 Q1,-48 -5,-45 Q5,-42 5,-35"
				fill="#C41E1E"
				stroke="#C41E1E"
				strokeWidth={3}
			/>
			<rect x={-2} y={-48} width={6} height={16} rx={3} fill="#C41E1E" />
			{/* Shield */}
			{shieldUp ? (
				<g transform="translate(-25, -40) rotate(-15)">
					<rect x={0} y={0} width={52} height={35} rx={4} fill="#8B1A1A" stroke="#D4A843" strokeWidth={2} />
					<ellipse cx={26} cy={17} rx={10} ry={8} fill="#D4A843" />
					<line x1={26} y1={2} x2={26} y2={33} stroke="#D4A843" strokeWidth={2} />
					<line x1={4} y1={17} x2={48} y2={17} stroke="#D4A843" strokeWidth={2} />
				</g>
			) : (
				<g transform="translate(-35, 5)">
					<rect x={0} y={0} width={30} height={50} rx={5} fill="#8B1A1A" stroke="#D4A843" strokeWidth={2} />
					<ellipse cx={15} cy={25} rx={8} ry={10} fill="#D4A843" />
					<line x1={15} y1={4} x2={15} y2={46} stroke="#D4A843" strokeWidth={2} />
					<line x1={3} y1={25} x2={27} y2={25} stroke="#D4A843" strokeWidth={2} />
				</g>
			)}
		</g>
	);
};

const TopShield: React.FC<{x: number; y: number; delay: number; rotation?: number}> = ({
	x, y, delay, rotation = 0,
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const pop = spring({frame: frame - delay, fps, config: {damping: 12, mass: 0.5}});
	const scale = interpolate(pop, [0, 1], [0, 1]);

	return (
		<g transform={`translate(${x}, ${y}) scale(${scale}) rotate(${rotation})`}>
			<rect x={-30} y={-18} width={60} height={36} rx={5} fill="#8B1A1A" stroke="#D4A843" strokeWidth={2} />
			<ellipse cx={0} cy={0} rx={12} ry={10} fill="#D4A843" />
			<line x1={0} y1={-16} x2={0} y2={16} stroke="#D4A843" strokeWidth={2} />
			<line x1={-28} y1={0} x2={28} y2={0} stroke="#D4A843" strokeWidth={2} />
		</g>
	);
};

const Arrow: React.FC<{
	startX: number;
	startY: number;
	endX: number;
	endY: number;
	delay: number;
	rotation: number;
}> = ({startX, startY, endX, endY, delay, rotation}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const flyProgress = spring({
		frame: frame - delay,
		fps,
		config: {damping: 20, mass: 0.4, stiffness: 150},
	});
	const x = interpolate(flyProgress, [0, 1], [startX, endX]);
	const y = interpolate(flyProgress, [0, 1], [startY, endY]);
	const opacity = interpolate(flyProgress, [0, 0.1], [0, 1], {
		extrapolateRight: 'clamp',
	});

	return (
		<g transform={`translate(${x}, ${y}) rotate(${rotation})`} opacity={opacity}>
			<line x1={0} y1={0} x2={-40} y2={0} stroke="#3D2B1F" strokeWidth={3} />
			<polygon points="0,-5 10,0 0,5" fill="#3D2B1F" />
			{/* Fletching */}
			<line x1={-35} y1={-6} x2={-40} y2={0} stroke="#3D2B1F" strokeWidth={2} />
			<line x1={-35} y1={6} x2={-40} y2={0} stroke="#3D2B1F" strokeWidth={2} />
		</g>
	);
};

const BounceArrow: React.FC<{x: number; y: number; delay: number; angle: number}> = ({
	x, y, delay, angle,
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const bounce = spring({
		frame: frame - delay,
		fps,
		config: {damping: 6, mass: 0.3, stiffness: 300},
	});
	const offsetY = interpolate(bounce, [0, 1], [0, -40]);
	const offsetX = interpolate(bounce, [0, 1], [0, 20]);
	const rot = interpolate(bounce, [0, 1], [angle, angle + 60]);
	const opacity = interpolate(bounce, [0, 0.1, 0.8, 1], [0, 1, 1, 0], {
		extrapolateRight: 'clamp',
	});

	return (
		<g transform={`translate(${x + offsetX}, ${y + offsetY}) rotate(${rot})`} opacity={opacity}>
			<line x1={0} y1={0} x2={-25} y2={0} stroke="#3D2B1F" strokeWidth={2.5} />
			<polygon points="0,-4 8,0 0,4" fill="#3D2B1F" />
		</g>
	);
};

const Ground: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const reveal = spring({frame: frame - 5, fps, config: {damping: 20}});
	const opacity = interpolate(reveal, [0, 1], [0, 1]);

	return (
		<g opacity={opacity}>
			<ellipse cx={960} cy={780} rx={700} ry={60} fill="#8B7355" />
			<ellipse cx={960} cy={775} rx={680} ry={50} fill="#A0896B" />
			{/* Rocks */}
			{[720, 800, 900, 1020, 1100, 1180].map((rx, i) => (
				<ellipse key={i} cx={rx} cy={785 + (i % 2) * 8} rx={8 + i * 2} ry={5} fill="#6B5B45" />
			))}
		</g>
	);
};

const DustPuff: React.FC<{x: number; y: number; delay: number}> = ({x, y, delay}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const puff = spring({frame: frame - delay, fps, config: {damping: 15, mass: 0.5}});
	const scale = interpolate(puff, [0, 1], [0, 1.5]);
	const opacity = interpolate(puff, [0, 0.3, 1], [0, 0.4, 0]);

	return (
		<g transform={`translate(${x}, ${y}) scale(${scale})`} opacity={opacity}>
			<circle cx={0} cy={0} r={15} fill="#C4B396" />
			<circle cx={12} cy={-5} r={10} fill="#C4B396" />
			<circle cx={-10} cy={-3} r={12} fill="#C4B396" />
		</g>
	);
};

export const TacticasRomanasPreview: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps, durationInFrames} = useVideoConfig();

	// Title animation (frame 100+)
	const titleSpring = spring({
		frame: frame - 100,
		fps,
		config: {damping: 10, mass: 0.7},
	});
	const titleScale = interpolate(titleSpring, [0, 1], [0, 1]);
	const titleRotation = interpolate(titleSpring, [0, 0.5, 1], [-5, 2, 0]);

	// Icon animation (frame 115+)
	const iconSpring = spring({
		frame: frame - 115,
		fps,
		config: {damping: 8, mass: 0.5, stiffness: 200},
	});
	const iconScale = interpolate(iconSpring, [0, 1], [0, 1]);

	// Fade out
	const fadeOut = interpolate(
		frame,
		[durationInFrames - 15, durationInFrames],
		[1, 0],
		{extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
	);

	// Gentle camera movement after build
	const camX = interpolate(frame, [130, durationInFrames], [0, -10], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const camScale = interpolate(frame, [130, durationInFrames], [1, 1.03], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill style={{backgroundColor: '#D4C5A9', opacity: fadeOut}}>
			{/* Parchment texture overlay */}
			<div
				style={{
					position: 'absolute',
					inset: 0,
					background:
						'radial-gradient(ellipse at 30% 20%, rgba(180,160,120,0.3) 0%, transparent 70%), radial-gradient(ellipse at 70% 80%, rgba(160,140,100,0.3) 0%, transparent 70%)',
				}}
			/>

			<svg
				viewBox="0 0 1920 1080"
				style={{
					width: '100%',
					height: '100%',
					position: 'absolute',
					transform: `scale(${camScale}) translateX(${camX}px)`,
				}}
			>
				{/* Ground */}
				<Ground />

				{/* Dust puffs when soldiers land */}
				<DustPuff x={780} y={760} delay={22} />
				<DustPuff x={880} y={755} delay={28} />
				<DustPuff x={980} y={760} delay={25} />
				<DustPuff x={1080} y={755} delay={32} />
				<DustPuff x={1140} y={760} delay={35} />

				{/* Back row soldiers (shields up) */}
				<Soldier x={830} y={560} delay={20} shieldUp />
				<Soldier x={920} y={555} delay={25} shieldUp />
				<Soldier x={1010} y={555} delay={22} shieldUp />
				<Soldier x={1100} y={560} delay={28} shieldUp />

				{/* Front row soldiers (shields front) */}
				<Soldier x={780} y={640} delay={30} />
				<Soldier x={870} y={635} delay={33} />
				<Soldier x={960} y={633} delay={36} />
				<Soldier x={1050} y={635} delay={33} />
				<Soldier x={1140} y={640} delay={30} flip />

				{/* Top shields forming the testudo roof */}
				<TopShield x={870} y={510} delay={50} rotation={-5} />
				<TopShield x={940} y={505} delay={53} rotation={0} />
				<TopShield x={1010} y={505} delay={56} rotation={2} />
				<TopShield x={1080} y={510} delay={59} rotation={5} />

				{/* Second row of roof shields */}
				<TopShield x={900} y={480} delay={62} rotation={-8} />
				<TopShield x={975} y={475} delay={65} rotation={0} />
				<TopShield x={1050} y={480} delay={68} rotation={6} />

				{/* Arrows flying in */}
				<Arrow startX={1600} startY={100} endX={1000} endY={470} delay={85} rotation={50} />
				<Arrow startX={1650} startY={150} endX={950} endY={490} delay={88} rotation={45} />
				<Arrow startX={1550} startY={80} endX={1060} endY={475} delay={91} rotation={55} />
				<Arrow startX={1700} startY={120} endX={900} endY={500} delay={94} rotation={42} />
				<Arrow startX={1580} startY={60} endX={1030} endY={465} delay={97} rotation={52} />

				{/* Arrows bouncing off shields */}
				<BounceArrow x={980} y={470} delay={92} angle={-30} />
				<BounceArrow x={1040} y={475} delay={95} angle={-45} />
				<BounceArrow x={910} y={485} delay={98} angle={-20} />
			</svg>

			{/* Title */}
			<div
				style={{
					position: 'absolute',
					top: 40,
					left: 0,
					right: 0,
					display: 'flex',
					justifyContent: 'center',
					transform: `scale(${titleScale}) rotate(${titleRotation}deg)`,
					transformOrigin: 'center center',
				}}
			>
				<span
					style={{
						fontFamily: 'Impact, Arial Black, sans-serif',
						fontSize: 95,
						fontWeight: 900,
						color: '#1a1a1a',
						letterSpacing: 6,
						textShadow: '4px 4px 0px rgba(0,0,0,0.15)',
					}}
				>
					FORMACIÓN TESTUDO
				</span>
			</div>

			{/* Icon badge */}
			<div
				style={{
					position: 'absolute',
					top: 40,
					right: 55,
					width: 95,
					height: 95,
					borderRadius: '50%',
					backgroundColor: '#B83232',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					transform: `scale(${iconScale})`,
					boxShadow: '3px 5px 10px rgba(0,0,0,0.3)',
				}}
			>
				<span style={{fontSize: 52, filter: 'brightness(10)'}}>🐢</span>
			</div>
		</AbsoluteFill>
	);
};
