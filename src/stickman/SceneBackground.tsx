import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';

interface SceneBackgroundProps {
	type: 'plain' | 'camp' | 'battlefield' | 'road' | 'rome';
	startFrame?: number;
	durationFrames: number;
	children: React.ReactNode;
}

const CampBg: React.FC = () => (
	<>
		{/* Sky gradient */}
		<rect x={0} y={0} width={1920} height={650} fill="#dfe6e9" />
		{/* Ground */}
		<rect x={0} y={650} width={1920} height={430} fill="#b2bec3" />
		<line x1={0} y1={650} x2={1920} y2={650} stroke="#636e72" strokeWidth={2} />
		{/* Tents */}
		<polygon points="200,650 280,520 360,650" fill="#d63031" stroke="#c0392b" strokeWidth={2} />
		<polygon points="400,650 460,550 520,650" fill="#d63031" stroke="#c0392b" strokeWidth={2} />
		<polygon points="1500,650 1580,530 1660,650" fill="#d63031" stroke="#c0392b" strokeWidth={2} />
		{/* Camp fire */}
		<circle cx={700} cy={640} r={20} fill="#2d3436" opacity={0.3} />
		<path d="M 695,640 Q 700,610 705,640" stroke="#e17055" strokeWidth={3} fill="#fdcb6e" />
	</>
);

const BattlefieldBg: React.FC = () => (
	<>
		<rect x={0} y={0} width={1920} height={600} fill="#636e72" />
		<rect x={0} y={600} width={1920} height={480} fill="#b2bec3" />
		{/* Smoke/dust */}
		<circle cx={300} cy={400} r={80} fill="#636e72" opacity={0.3} />
		<circle cx={1600} cy={350} r={100} fill="#636e72" opacity={0.2} />
		{/* Ground debris */}
		<line x1={100} y1={680} x2={150} y2={675} stroke="#636e72" strokeWidth={2} />
		<line x1={800} y1={700} x2={860} y2={695} stroke="#636e72" strokeWidth={2} />
		<line x1={1400} y1={690} x2={1450} y2={688} stroke="#636e72" strokeWidth={2} />
	</>
);

const RoadBg: React.FC = () => (
	<>
		<rect x={0} y={0} width={1920} height={550} fill="#dfe6e9" />
		{/* Hills */}
		<ellipse cx={400} cy={550} rx={350} ry={80} fill="#a4b0be" />
		<ellipse cx={1200} cy={550} rx={400} ry={90} fill="#a4b0be" />
		{/* Road */}
		<rect x={0} y={620} width={1920} height={460} fill="#b2bec3" />
		<polygon points="700,620 1220,620 1920,1080 0,1080" fill="#636e72" opacity={0.3} />
		{/* Road lines */}
		<line x1={850} y1={700} x2={900} y2={700} stroke="#dfe6e9" strokeWidth={3} strokeDasharray="20,15" />
	</>
);

const RomeBg: React.FC = () => (
	<>
		<rect x={0} y={0} width={1920} height={500} fill="#dfe6e9" />
		{/* Ground */}
		<rect x={0} y={600} width={1920} height={480} fill="#b2bec3" />
		{/* Colosseum silhouette */}
		<path d="M 700,600 L 700,420 Q 700,380 750,370 Q 850,350 960,345 Q 1070,350 1170,370 Q 1220,380 1220,420 L 1220,600" fill="#a4b0be" stroke="#636e72" strokeWidth={2} />
		{/* Arches */}
		<path d="M 760,500 Q 790,470 820,500" stroke="#636e72" strokeWidth={2} fill="none" />
		<path d="M 860,490 Q 890,460 920,490" stroke="#636e72" strokeWidth={2} fill="none" />
		<path d="M 960,488 Q 990,458 1020,488" stroke="#636e72" strokeWidth={2} fill="none" />
		<path d="M 1060,490 Q 1090,460 1120,490" stroke="#636e72" strokeWidth={2} fill="none" />
		{/* Columns */}
		<rect x={300} y={450} width={15} height={150} fill="#a4b0be" stroke="#636e72" strokeWidth={1} />
		<rect x={340} y={470} width={15} height={130} fill="#a4b0be" stroke="#636e72" strokeWidth={1} />
		<rect x={1550} y={440} width={15} height={160} fill="#a4b0be" stroke="#636e72" strokeWidth={1} />
		<rect x={1600} y={460} width={15} height={140} fill="#a4b0be" stroke="#636e72" strokeWidth={1} />
	</>
);

export const SceneBackground: React.FC<SceneBackgroundProps> = ({
	type,
	startFrame = 0,
	durationFrames,
	children,
}) => {
	const frame = useCurrentFrame();

	const fadeIn = interpolate(frame, [startFrame, startFrame + 10], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const fadeOut = interpolate(
		frame,
		[startFrame + durationFrames - 10, startFrame + durationFrames],
		[1, 0],
		{extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
	);
	const opacity = Math.min(fadeIn, fadeOut);
	const isVisible = frame >= startFrame && frame <= startFrame + durationFrames;

	if (!isVisible) return null;

	return (
		<g opacity={opacity}>
			<svg viewBox="0 0 1920 1080" style={{width: '100%', height: '100%', position: 'absolute'}}>
				{type === 'camp' && <CampBg />}
				{type === 'battlefield' && <BattlefieldBg />}
				{type === 'road' && <RoadBg />}
				{type === 'rome' && <RomeBg />}
				{type === 'plain' && <rect x={0} y={0} width={1920} height={1080} fill="#faf9f6" />}
				{children}
			</svg>
		</g>
	);
};
