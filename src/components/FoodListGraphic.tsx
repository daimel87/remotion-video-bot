import {AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate} from 'remotion';

const leftItems = [
	'Jitomate cocido',
	'Brócoli al vapor',
	'Granada',
	'Semillas de calabaza',
	'Té verde',
];

const rightItems = [
	'Ajo crudo',
	'Nuez de Brasil (1-2/día)',
	'Salmón o sardinas',
	'Cúrcuma + pimienta',
	'Frijoles y legumbres',
];

const colors = ['#ff6b6b','#4ade80','#f43f5e','#f59e0b','#4ade80','#e2e8f0','#facc15','#38bdf8','#f59e0b','#a78bfa'];

const emojis = ['🍅','🥦','🫐','🎃','🍵','🧄','🥜','🐟','🟡','🫘'];

export const FoodListGraphic: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps, durationInFrames, width} = useVideoConfig();
	const scale = width / 1920;

	const titleEnter = spring({frame, fps, config: {damping: 200, stiffness: 150}});
	const titleY = interpolate(titleEnter, [0, 1], [30, 0]) * scale;

	const exit = interpolate(frame, [durationInFrames - 15, durationInFrames], [1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	const renderItem = (item: string, globalIndex: number) => {
		const delay = 15 + globalIndex * 10;
		const enter = spring({frame, fps, delay, config: {damping: 200, stiffness: 150}});
		const translateY = interpolate(enter, [0, 1], [30, 0]) * scale;
		const itemScale = interpolate(enter, [0, 1], [0.8, 1]);
		return (
			<div
				key={globalIndex}
				style={{
					opacity: enter,
					transform: `translateY(${translateY}px) scale(${itemScale})`,
					display: 'flex',
					alignItems: 'center',
					gap: 16 * scale,
					padding: `${12 * scale}px ${20 * scale}px`,
					background: 'rgba(255,255,255,0.06)',
					borderRadius: 12 * scale,
					borderLeft: `4px solid ${colors[globalIndex]}`,
				}}
			>
				<div style={{fontSize: 42 * scale}}>{emojis[globalIndex]}</div>
				<div style={{display: 'flex', flexDirection: 'column'}}>
					<div style={{
						fontFamily: 'Helvetica, Arial, sans-serif',
						fontWeight: 800,
						fontSize: 22 * scale,
						color: colors[globalIndex],
					}}>
						#{globalIndex + 1}
					</div>
					<div style={{
						fontFamily: 'Helvetica, Arial, sans-serif',
						fontWeight: 700,
						fontSize: 36 * scale,
						color: '#ffffff',
						lineHeight: 1.2,
					}}>
						{item}
					</div>
				</div>
			</div>
		);
	};

	return (
		<AbsoluteFill style={{opacity: exit}}>
			<AbsoluteFill style={{
				background: 'rgba(8, 16, 40, 0.90)',
				justifyContent: 'center',
				alignItems: 'center',
				padding: 50 * scale,
			}}>
				<div style={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					width: '100%',
					maxWidth: 1700 * scale,
					gap: 40 * scale,
				}}>
					<div style={{
						opacity: titleEnter,
						transform: `translateY(${titleY}px)`,
						fontFamily: 'Helvetica, Arial, sans-serif',
						fontWeight: 900,
						fontSize: 56 * scale,
						color: '#ffffff',
						textAlign: 'center',
						textShadow: '0 0 30px rgba(91,140,255,0.6)',
					}}>
						🥗 TUS 10 ALIADOS CONTRA EL PSA
					</div>
					<div style={{
						display: 'flex',
						gap: 40 * scale,
						width: '100%',
					}}>
						<div style={{
							flex: 1,
							display: 'flex',
							flexDirection: 'column',
							gap: 14 * scale,
						}}>
							{leftItems.map((item, i) => renderItem(item, i))}
						</div>
						<div style={{
							flex: 1,
							display: 'flex',
							flexDirection: 'column',
							gap: 14 * scale,
						}}>
							{rightItems.map((item, i) => renderItem(item, i + 5))}
						</div>
					</div>
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
