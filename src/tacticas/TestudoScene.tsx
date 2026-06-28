import React from 'react';
import {
	AbsoluteFill,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
	Series,
} from 'remotion';

const PARCHMENT = '#D4C5A9';
const DARK = '#1a1a1a';
const RED = '#8B1A1A';
const GOLD = '#D4A843';
const HELMET_GOLD = '#B8860B';
const SKIN = '#F5D0A9';
const SHIELD_RED = '#7A1818';
const GREEN = '#4A8C3F';

// ─── Reusable animated wrapper ───
const FadeSlideIn: React.FC<{
	children: React.ReactNode;
	delay?: number;
	direction?: 'up' | 'down' | 'left' | 'right';
	distance?: number;
}> = ({children, delay = 0, direction = 'up', distance = 60}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const progress = spring({frame: frame - delay, fps, config: {damping: 14, mass: 0.8}});
	const offset = interpolate(progress, [0, 1], [distance, 0]);
	const opacity = interpolate(progress, [0, 0.4], [0, 1], {extrapolateRight: 'clamp'});

	const transform = {
		up: `translateY(${offset}px)`,
		down: `translateY(${-offset}px)`,
		left: `translateX(${offset}px)`,
		right: `translateX(${-offset}px)`,
	}[direction];

	return <div style={{opacity, transform}}>{children}</div>;
};

// ─── Scene 1: Title card ───
export const TitleCard: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const iconPop = spring({frame: frame - 15, fps, config: {damping: 8, mass: 0.5, stiffness: 200}});
	const iconScale = interpolate(iconPop, [0, 1], [0, 1]);

	return (
		<AbsoluteFill style={{backgroundColor: PARCHMENT, justifyContent: 'center', alignItems: 'center'}}>
			{/* Icon */}
			<FadeSlideIn delay={5} direction="down">
				<div style={{
					width: 180, height: 180, borderRadius: '50%', backgroundColor: GREEN,
					display: 'flex', justifyContent: 'center', alignItems: 'center',
					transform: `scale(${iconScale})`,
					boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
				}}>
					<svg viewBox="0 0 100 100" width={110} height={110}>
						<ellipse cx={50} cy={60} rx={35} ry={22} fill="white" />
						<ellipse cx={50} cy={55} rx={30} ry={18} fill="white" stroke="white" strokeWidth={1} />
						<path d="M50,38 Q50,30 45,32 Q48,35 48,40" fill="white" />
						<circle cx={72} cy={58} r={8} fill="white" />
						<circle cx={74} cy={56} r={2.5} fill={GREEN} />
						<ellipse cx={30} cy={68} rx={6} ry={4} fill="white" />
						<ellipse cx={70} cy={68} rx={6} ry={4} fill="white" />
						<ellipse cx={38} cy={72} rx={5} ry={3} fill="white" />
						<ellipse cx={62} cy={72} rx={5} ry={3} fill="white" />
					</svg>
				</div>
			</FadeSlideIn>

			{/* Title */}
			<FadeSlideIn delay={25} direction="up">
				<h1 style={{
					fontFamily: 'Impact, Arial Black, sans-serif',
					fontSize: 110, color: DARK, textAlign: 'center',
					marginTop: 40, letterSpacing: 6,
					textShadow: '4px 4px 0px rgba(0,0,0,0.12)',
				}}>
					FORMACIÓN TESTUDO
				</h1>
			</FadeSlideIn>

			{/* Subtitle */}
			<FadeSlideIn delay={40} direction="up">
				<p style={{
					fontFamily: 'Georgia, serif', fontSize: 36,
					color: '#5C4A2A', textAlign: 'center', marginTop: 10,
					fontStyle: 'italic',
				}}>
					La tortuga de guerra romana
				</p>
			</FadeSlideIn>
		</AbsoluteFill>
	);
};

// ─── Cartoon Soldier SVG ───
const CartoonSoldier: React.FC<{
	x: number; y: number; scale?: number; shieldUp?: boolean; flip?: boolean;
}> = ({x, y, scale = 1, shieldUp = false, flip = false}) => {
	return (
		<g transform={`translate(${x}, ${y}) scale(${scale * (flip ? -1 : 1)}, ${scale})`}>
			<rect x={-8} y={50} width={8} height={25} rx={3} fill="#8B6914" />
			<rect x={4} y={50} width={8} height={25} rx={3} fill="#8B6914" />
			<rect x={-10} y={72} width={12} height={5} rx={2} fill="#5C4A1E" />
			<rect x={2} y={72} width={12} height={5} rx={2} fill="#5C4A1E" />
			<rect x={-15} y={12} width={32} height={42} rx={5} fill={RED} />
			<rect x={-13} y={18} width={28} height={3.5} rx={1} fill={GOLD} />
			<rect x={-13} y={25} width={28} height={3.5} rx={1} fill={GOLD} />
			<rect x={-13} y={32} width={28} height={3.5} rx={1} fill={GOLD} />
			<rect x={-15} y={44} width={32} height={5} rx={1} fill="#7B5B2A" />
			<circle cx={1} cy={-2} r={15} fill={SKIN} />
			<circle cx={-5} cy={-5} r={2.5} fill={DARK} />
			<circle cx={8} cy={-5} r={2.5} fill={DARK} />
			<path d="M-15,-8 Q-15,-28 1,-30 Q17,-28 17,-8 L15,-4 Q1,-10 -13,-4 Z" fill={HELMET_GOLD} />
			<rect x={-1} y={-38} width={4} height={14} rx={2} fill={RED} />
			{shieldUp ? (
				<g transform="translate(-20, -35) rotate(-12)">
					<rect x={0} y={0} width={44} height={30} rx={4} fill={SHIELD_RED} stroke={GOLD} strokeWidth={1.5} />
					<ellipse cx={22} cy={15} rx={8} ry={6} fill={GOLD} />
					<line x1={22} y1={2} x2={22} y2={28} stroke={GOLD} strokeWidth={1.5} />
				</g>
			) : (
				<g transform="translate(-28, 8)">
					<rect x={0} y={0} width={24} height={42} rx={4} fill={SHIELD_RED} stroke={GOLD} strokeWidth={1.5} />
					<ellipse cx={12} cy={21} rx={6} ry={8} fill={GOLD} />
					<line x1={12} y1={3} x2={12} y2={39} stroke={GOLD} strokeWidth={1.5} />
				</g>
			)}
		</g>
	);
};

// ─── Scene 2: Formation building ───
export const FormationScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const soldiers = [
		{x: 700, y: 520, delay: 10, shieldUp: true},
		{x: 790, y: 515, delay: 15, shieldUp: true},
		{x: 880, y: 515, delay: 12, shieldUp: true},
		{x: 970, y: 520, delay: 18, shieldUp: true},
		{x: 650, y: 600, delay: 25},
		{x: 740, y: 595, delay: 28},
		{x: 830, y: 593, delay: 31},
		{x: 920, y: 595, delay: 28},
		{x: 1010, y: 600, delay: 25, flip: true},
	];

	const narrationOpacity = interpolate(frame, [60, 75], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	return (
		<AbsoluteFill style={{backgroundColor: PARCHMENT}}>
			<svg viewBox="0 0 1920 1080" style={{width: '100%', height: '100%', position: 'absolute'}}>
				{/* Ground */}
				<ellipse cx={830} cy={720} rx={500} ry={45} fill="#A0896B" />
				{[650, 750, 850, 950, 1000].map((rx, i) => (
					<ellipse key={i} cx={rx} cy={725 + (i % 2) * 6} rx={6 + i * 1.5} ry={4} fill="#6B5B45" />
				))}

				{/* Soldiers with staggered entry */}
				{soldiers.map((s, i) => {
					const pop = spring({frame: frame - s.delay, fps, config: {damping: 12, mass: 0.7}});
					const soldierScale = interpolate(pop, [0, 1], [0, 1]);
					const bounceY = interpolate(pop, [0, 0.5, 1], [40, -8, 0]);
					return (
						<g key={i} transform={`translate(0, ${bounceY}) scale(${soldierScale})`} style={{transformOrigin: `${s.x}px ${s.y}px`}}>
							<CartoonSoldier x={s.x} y={s.y} shieldUp={s.shieldUp} flip={s.flip} />
						</g>
					);
				})}

				{/* Roof shields appearing */}
				{[
					{x: 740, y: 470, delay: 45, rot: -5},
					{x: 820, y: 465, delay: 48, rot: 0},
					{x: 900, y: 465, delay: 51, rot: 3},
					{x: 980, y: 470, delay: 54, rot: 5},
				].map((sh, i) => {
					const pop = spring({frame: frame - sh.delay, fps, config: {damping: 10, mass: 0.5}});
					const s = interpolate(pop, [0, 1], [0, 1]);
					return (
						<g key={i} transform={`translate(${sh.x}, ${sh.y}) scale(${s}) rotate(${sh.rot})`}>
							<rect x={-26} y={-15} width={52} height={30} rx={4} fill={SHIELD_RED} stroke={GOLD} strokeWidth={1.5} />
							<ellipse cx={0} cy={0} rx={10} ry={8} fill={GOLD} />
							<line x1={0} y1={-13} x2={0} y2={13} stroke={GOLD} strokeWidth={1.5} />
						</g>
					);
				})}
			</svg>

			{/* Narration text */}
			<div style={{
				position: 'absolute', bottom: 80, left: 0, right: 0,
				display: 'flex', justifyContent: 'center', opacity: narrationOpacity,
			}}>
				<div style={{
					backgroundColor: 'rgba(0,0,0,0.75)', borderRadius: 14,
					padding: '18px 50px', maxWidth: '75%',
				}}>
					<span style={{
						color: 'white', fontSize: 34, fontFamily: 'Georgia, serif',
						fontWeight: 600, lineHeight: 1.5, textAlign: 'center', display: 'block',
					}}>
						Los legionarios levantaban sus escudos creando un caparazón impenetrable
					</span>
				</div>
			</div>
		</AbsoluteFill>
	);
};

// ─── Scene 3: Arrows bouncing ───
export const ArrowsScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const arrows = [
		{sx: 1700, sy: 50, ex: 870, ey: 430, delay: 10, rot: 48},
		{sx: 1750, sy: 100, ex: 820, ey: 450, delay: 16, rot: 44},
		{sx: 1650, sy: 30, ex: 920, ey: 420, delay: 22, rot: 52},
		{sx: 1800, sy: 80, ex: 780, ey: 460, delay: 28, rot: 42},
		{sx: 1680, sy: 20, ex: 900, ey: 440, delay: 34, rot: 50},
		{sx: 1720, sy: 130, ex: 850, ey: 470, delay: 40, rot: 46},
	];

	const bounceArrows = [
		{x: 860, y: 430, delay: 45, angle: -35},
		{x: 920, y: 420, delay: 50, angle: -50},
		{x: 800, y: 450, delay: 55, angle: -25},
		{x: 880, y: 440, delay: 60, angle: -40},
	];

	const textOpacity = interpolate(frame, [70, 85], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	return (
		<AbsoluteFill style={{backgroundColor: PARCHMENT}}>
			<svg viewBox="0 0 1920 1080" style={{width: '100%', height: '100%', position: 'absolute'}}>
				{/* Ground */}
				<ellipse cx={830} cy={720} rx={500} ry={45} fill="#A0896B" />

				{/* Static formation */}
				{[
					{x: 700, y: 520, shieldUp: true},
					{x: 790, y: 515, shieldUp: true},
					{x: 880, y: 515, shieldUp: true},
					{x: 970, y: 520, shieldUp: true},
					{x: 650, y: 600},
					{x: 740, y: 595},
					{x: 830, y: 593},
					{x: 920, y: 595},
					{x: 1010, y: 600, flip: true},
				].map((s, i) => (
					<CartoonSoldier key={i} x={s.x} y={s.y} shieldUp={s.shieldUp} flip={s.flip} />
				))}

				{/* Roof shields */}
				{[
					{x: 740, y: 470, rot: -5},
					{x: 820, y: 465, rot: 0},
					{x: 900, y: 465, rot: 3},
					{x: 980, y: 470, rot: 5},
				].map((sh, i) => (
					<g key={i} transform={`translate(${sh.x}, ${sh.y}) rotate(${sh.rot})`}>
						<rect x={-26} y={-15} width={52} height={30} rx={4} fill={SHIELD_RED} stroke={GOLD} strokeWidth={1.5} />
						<ellipse cx={0} cy={0} rx={10} ry={8} fill={GOLD} />
						<line x1={0} y1={-13} x2={0} y2={13} stroke={GOLD} strokeWidth={1.5} />
					</g>
				))}

				{/* Flying arrows */}
				{arrows.map((a, i) => {
					const prog = spring({frame: frame - a.delay, fps, config: {damping: 22, mass: 0.4, stiffness: 150}});
					const x = interpolate(prog, [0, 1], [a.sx, a.ex]);
					const y = interpolate(prog, [0, 1], [a.sy, a.ey]);
					const opacity = interpolate(prog, [0, 0.05], [0, 1], {extrapolateRight: 'clamp'});
					return (
						<g key={i} transform={`translate(${x}, ${y}) rotate(${a.rot})`} opacity={opacity}>
							<line x1={0} y1={0} x2={-35} y2={0} stroke="#3D2B1F" strokeWidth={2.5} />
							<polygon points="0,-4 8,0 0,4" fill="#3D2B1F" />
							<line x1={-30} y1={-5} x2={-35} y2={0} stroke="#3D2B1F" strokeWidth={1.5} />
							<line x1={-30} y1={5} x2={-35} y2={0} stroke="#3D2B1F" strokeWidth={1.5} />
						</g>
					);
				})}

				{/* Bouncing arrows */}
				{bounceArrows.map((a, i) => {
					const bounce = spring({frame: frame - a.delay, fps, config: {damping: 6, mass: 0.3, stiffness: 300}});
					const offY = interpolate(bounce, [0, 1], [0, -50]);
					const offX = interpolate(bounce, [0, 1], [0, 25]);
					const rot = interpolate(bounce, [0, 1], [a.angle, a.angle + 70]);
					const opacity = interpolate(bounce, [0, 0.1, 0.8, 1], [0, 1, 1, 0], {extrapolateRight: 'clamp'});
					return (
						<g key={i} transform={`translate(${a.x + offX}, ${a.y + offY}) rotate(${rot})`} opacity={opacity}>
							<line x1={0} y1={0} x2={-20} y2={0} stroke="#3D2B1F" strokeWidth={2} />
							<polygon points="0,-3 6,0 0,3" fill="#3D2B1F" />
						</g>
					);
				})}

				{/* Impact sparks */}
				{bounceArrows.map((a, i) => {
					const sparkProg = spring({frame: frame - a.delay - 2, fps, config: {damping: 10, mass: 0.2}});
					const sparkScale = interpolate(sparkProg, [0, 1], [0, 1.5]);
					const sparkOpacity = interpolate(sparkProg, [0, 0.3, 1], [0, 1, 0]);
					return (
						<g key={i} transform={`translate(${a.x}, ${a.y}) scale(${sparkScale})`} opacity={sparkOpacity}>
							<line x1={-8} y1={0} x2={8} y2={0} stroke={GOLD} strokeWidth={2} />
							<line x1={0} y1={-8} x2={0} y2={8} stroke={GOLD} strokeWidth={2} />
							<line x1={-6} y1={-6} x2={6} y2={6} stroke={GOLD} strokeWidth={1.5} />
							<line x1={6} y1={-6} x2={-6} y2={6} stroke={GOLD} strokeWidth={1.5} />
						</g>
					);
				})}
			</svg>

			{/* "IMPENETRABLE" text */}
			<FadeSlideIn delay={75} direction="up">
				<div style={{
					position: 'absolute', top: 60, left: 0, right: 0,
					display: 'flex', justifyContent: 'center',
				}}>
					<span style={{
						fontFamily: 'Impact, Arial Black, sans-serif',
						fontSize: 80, color: RED, letterSpacing: 8,
						textShadow: '3px 3px 0px rgba(0,0,0,0.1)',
					}}>
						¡IMPENETRABLE!
					</span>
				</div>
			</FadeSlideIn>

			{/* Narration */}
			<div style={{
				position: 'absolute', bottom: 80, left: 0, right: 0,
				display: 'flex', justifyContent: 'center', opacity: textOpacity,
			}}>
				<div style={{
					backgroundColor: 'rgba(0,0,0,0.75)', borderRadius: 14,
					padding: '18px 50px', maxWidth: '75%',
				}}>
					<span style={{
						color: 'white', fontSize: 34, fontFamily: 'Georgia, serif',
						fontWeight: 600, lineHeight: 1.5, textAlign: 'center', display: 'block',
					}}>
						Las flechas rebotaban. Las piedras resbalaban. Un tanque humano imparable.
					</span>
				</div>
			</div>
		</AbsoluteFill>
	);
};

// ─── Scene 4: Tank advancing ───
export const TankScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps, durationInFrames} = useVideoConfig();

	// Formation moves left to right
	const advanceX = interpolate(frame, [0, durationInFrames], [-100, 200], {
		extrapolateRight: 'clamp',
	});

	// Wall on right side
	const wallReveal = spring({frame: frame - 10, fps, config: {damping: 20}});
	const wallOpacity = interpolate(wallReveal, [0, 1], [0, 1]);

	const textOpacity = interpolate(frame, [40, 55], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	return (
		<AbsoluteFill style={{backgroundColor: PARCHMENT}}>
			<svg viewBox="0 0 1920 1080" style={{width: '100%', height: '100%', position: 'absolute'}}>
				{/* Ground */}
				<rect x={0} y={680} width={1920} height={400} fill="#A0896B" />
				<rect x={0} y={680} width={1920} height={8} fill="#8B7355" />

				{/* Enemy wall */}
				<g opacity={wallOpacity}>
					<rect x={1500} y={200} width={180} height={500} fill="#8B7355" rx={4} />
					<rect x={1500} y={200} width={180} height={30} fill="#7A6545" rx={4} />
					{[0, 1, 2, 3, 4, 5, 6, 7].map(i => (
						<rect key={i} x={1505 + (i % 4) * 44} y={235 + Math.floor(i / 4) * 55} width={40} height={50} fill="#9B8365" rx={2} stroke="#7A6545" strokeWidth={1} />
					))}
					{/* Battlements */}
					{[0, 1, 2, 3].map(i => (
						<rect key={i} x={1500 + i * 50} y={180} width={30} height={30} fill="#8B7355" />
					))}
				</g>

				{/* Moving formation */}
				<g transform={`translate(${advanceX}, 0)`}>
					{[
						{x: 600, y: 480, shieldUp: true},
						{x: 680, y: 475, shieldUp: true},
						{x: 760, y: 475, shieldUp: true},
						{x: 840, y: 480, shieldUp: true},
						{x: 560, y: 560},
						{x: 640, y: 555},
						{x: 720, y: 553},
						{x: 800, y: 555},
						{x: 880, y: 560, flip: true},
					].map((s, i) => (
						<CartoonSoldier key={i} x={s.x} y={s.y} shieldUp={s.shieldUp} flip={s.flip} />
					))}
					{/* Roof */}
					{[
						{x: 640, y: 435, rot: -4},
						{x: 720, y: 430, rot: 0},
						{x: 800, y: 430, rot: 3},
						{x: 870, y: 435, rot: 5},
					].map((sh, i) => (
						<g key={i} transform={`translate(${sh.x}, ${sh.y}) rotate(${sh.rot})`}>
							<rect x={-26} y={-15} width={52} height={30} rx={4} fill={SHIELD_RED} stroke={GOLD} strokeWidth={1.5} />
							<ellipse cx={0} cy={0} rx={10} ry={8} fill={GOLD} />
						</g>
					))}
				</g>

				{/* Arrow showing direction */}
				<g opacity={wallOpacity}>
					<line x1={advanceX + 920} y1={520} x2={1460} y2={520} stroke={RED} strokeWidth={4} strokeDasharray="12,8" />
					<polygon points={`1460,510 1480,520 1460,530`} fill={RED} />
				</g>
			</svg>

			{/* Narration */}
			<div style={{
				position: 'absolute', bottom: 80, left: 0, right: 0,
				display: 'flex', justifyContent: 'center', opacity: textOpacity,
			}}>
				<div style={{
					backgroundColor: 'rgba(0,0,0,0.75)', borderRadius: 14,
					padding: '18px 50px', maxWidth: '75%',
				}}>
					<span style={{
						color: 'white', fontSize: 34, fontFamily: 'Georgia, serif',
						fontWeight: 600, lineHeight: 1.5, textAlign: 'center', display: 'block',
					}}>
						Avanzaba lento pero imparable hacia las murallas enemigas
					</span>
				</div>
			</div>
		</AbsoluteFill>
	);
};

// ─── Scene 5: Cross-section diagram ───
export const DiagramScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	return (
		<AbsoluteFill style={{backgroundColor: PARCHMENT}}>
			{/* Title */}
			<FadeSlideIn delay={5} direction="down">
				<h2 style={{
					fontFamily: 'Impact, Arial Black, sans-serif',
					fontSize: 60, color: DARK, textAlign: 'center',
					marginTop: 40, letterSpacing: 4,
				}}>
					VISTA SUPERIOR — FORMACIÓN TESTUDO
				</h2>
			</FadeSlideIn>

			<svg viewBox="0 0 1920 900" style={{width: '100%', height: '75%', position: 'absolute', top: '15%'}}>
				{/* Formation rectangle from above */}
				<FadeGroup delay={15}>
					<rect x={560} y={150} width={800} height={500} rx={20} fill="none" stroke={DARK} strokeWidth={3} strokeDasharray="10,6" />

					{/* Top shields */}
					{[0, 1, 2, 3, 4].map(col =>
						[0, 1, 2, 3].map(row => {
							const d = 20 + col * 5 + row * 3;
							return (
								<AnimatedRect key={`${col}-${row}`} delay={d}
									x={590 + col * 155} y={170 + row * 120}
									w={140} h={105} fill={SHIELD_RED} stroke={GOLD}
								/>
							);
						})
					)}

					{/* Labels */}
					<FadeGroup delay={60}>
						{/* Top arrow */}
						<line x1={960} y1={100} x2={960} y2={155} stroke={RED} strokeWidth={3} markerEnd="url(#arrowhead)" />
						<text x={960} y={85} textAnchor="middle" fontSize={28} fontWeight="bold" fill={RED} fontFamily="Arial">ESCUDOS SUPERIORES</text>

						{/* Side arrows */}
						<line x1={510} y1={400} x2={565} y2={400} stroke={RED} strokeWidth={3} />
						<text x={500} y={395} textAnchor="end" fontSize={24} fontWeight="bold" fill={RED} fontFamily="Arial">ESCUDOS</text>
						<text x={500} y={425} textAnchor="end" fontSize={24} fontWeight="bold" fill={RED} fontFamily="Arial">LATERALES</text>

						<line x1={1410} y1={400} x2={1360} y2={400} stroke={RED} strokeWidth={3} />
						<text x={1420} y={395} textAnchor="start" fontSize={24} fontWeight="bold" fill={RED} fontFamily="Arial">ESCUDOS</text>
						<text x={1420} y={425} textAnchor="start" fontSize={24} fontWeight="bold" fill={RED} fontFamily="Arial">LATERALES</text>
					</FadeGroup>

					{/* Red attack arrows bouncing */}
					<FadeGroup delay={75}>
						{[
							{x1: 960, y1: 30, x2: 960, y2: 100, label: '↓'},
							{x1: 450, y1: 300, x2: 520, y2: 300},
							{x1: 1470, y1: 500, x2: 1400, y2: 500},
						].map((a, i) => (
							<g key={i}>
								<line x1={a.x1} y1={a.y1} x2={a.x2} y2={a.y2} stroke="orange" strokeWidth={3} strokeDasharray="8,4" />
							</g>
						))}
					</FadeGroup>
				</FadeGroup>

				<defs>
					<marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
						<polygon points="0 0, 10 3.5, 0 7" fill={RED} />
					</marker>
				</defs>
			</svg>

			{/* Bottom label */}
			<FadeSlideIn delay={85} direction="up">
				<div style={{
					position: 'absolute', bottom: 60, left: 0, right: 0,
					display: 'flex', justifyContent: 'center',
				}}>
					<div style={{
						backgroundColor: GREEN, borderRadius: 14,
						padding: '14px 60px',
					}}>
						<span style={{
							color: 'white', fontSize: 40, fontFamily: 'Impact, sans-serif',
							letterSpacing: 4,
						}}>
							PROTECCIÓN 360° — IMPENETRABLE
						</span>
					</div>
				</div>
			</FadeSlideIn>
		</AbsoluteFill>
	);
};

// Helper components
const FadeGroup: React.FC<{delay: number; children: React.ReactNode}> = ({delay, children}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const progress = spring({frame: frame - delay, fps, config: {damping: 14}});
	const opacity = interpolate(progress, [0, 1], [0, 1]);
	return <g opacity={opacity}>{children}</g>;
};

const AnimatedRect: React.FC<{delay: number; x: number; y: number; w: number; h: number; fill: string; stroke: string}> = ({
	delay, x, y, w, h, fill, stroke,
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const pop = spring({frame: frame - delay, fps, config: {damping: 10, mass: 0.5}});
	const scale = interpolate(pop, [0, 1], [0, 1]);
	return (
		<g transform={`translate(${x + w / 2}, ${y + h / 2}) scale(${scale}) translate(${-(x + w / 2)}, ${-(y + h / 2)})`}>
			<rect x={x} y={y} width={w} height={h} rx={6} fill={fill} stroke={stroke} strokeWidth={2} />
			<ellipse cx={x + w / 2} cy={y + h / 2} rx={w * 0.15} ry={h * 0.18} fill={GOLD} />
		</g>
	);
};

// ─── Main composition: all scenes in sequence ───
export const TestudoTactica: React.FC = () => {
	return (
		<AbsoluteFill>
			<Series>
				<Series.Sequence durationInFrames={120}>
					<TitleCard />
				</Series.Sequence>
				<Series.Sequence durationInFrames={240}>
					<FormationScene />
				</Series.Sequence>
				<Series.Sequence durationInFrames={210}>
					<ArrowsScene />
				</Series.Sequence>
				<Series.Sequence durationInFrames={210}>
					<TankScene />
				</Series.Sequence>
				<Series.Sequence durationInFrames={120}>
					<DiagramScene />
				</Series.Sequence>
			</Series>
		</AbsoluteFill>
	);
};
