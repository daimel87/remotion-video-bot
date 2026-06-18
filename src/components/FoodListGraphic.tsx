import {AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate} from 'remotion';

const items = [
	'Jitomate cocido',
	'Brócoli al vapor',
	'Granada',
	'Semillas de calabaza',
	'Té verde',
	'Ajo crudo',
	'Nuez de Brasil (1-2/día)',
	'Salmón o sardinas',
	'Cúrcuma + pimienta negra',
	'Frijoles y legumbres',
];

const colors = ['#ff6b6b','#4ade80','#f43f5e','#f59e0b','#4ade80','#e2e8f0','#facc15','#38bdf8','#f59e0b','#a78bfa'];

export const FoodListGraphic: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps, durationInFrames, width} = useVideoConfig();
	const scale = width / 1920;

	const exit = interpolate(frame, [durationInFrames - 10, durationInFrames], [1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill style={{opacity: exit}}>
			<AbsoluteFill
				style={{
					background: 'rgba(8, 16, 40, 0.88)',
					justifyContent: 'center',
					alignItems: 'center',
					padding: 40 * scale,
				}}
			>
				<div style={{
					display: 'flex',
					flexDirection: 'column',
					gap: 8 * scale,
					maxWidth: 900 * scale,
					width: '100%',
				}}>
					<div style={{
						fontFamily: 'Helvetica, Arial, sans-serif',
						fontWeight: 800,
						fontSize: 36 * scale,
						color: '#ffffff',
						textAlign: 'center',
						marginBottom: 16 * scale,
					}}>
						🥗 TUS 10 ALIADOS
					</div>
					{items.map((item, i) => {
						const enter = spring({frame, fps, delay: i * 4, config: {damping: 200, stiffness: 200}});
						const translateX = interpolate(enter, [0, 1], [-40, 0]) * scale;
						return (
							<div
								key={i}
								style={{
									opacity: enter,
									transform: `translateX(${translateX}px)`,
									display: 'flex',
									alignItems: 'center',
									gap: 14 * scale,
									padding: `${6 * scale}px ${16 * scale}px`,
								}}
							>
								<div style={{
									fontFamily: 'Helvetica, Arial, sans-serif',
									fontWeight: 800,
									fontSize: 28 * scale,
									color: colors[i],
									minWidth: 40 * scale,
								}}>
									{i + 1}.
								</div>
								<div style={{
									fontFamily: 'Helvetica, Arial, sans-serif',
									fontWeight: 700,
									fontSize: 26 * scale,
									color: '#ffffff',
								}}>
									{item}
								</div>
							</div>
						);
					})}
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
