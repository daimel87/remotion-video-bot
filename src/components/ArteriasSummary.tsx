import {AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate} from 'remotion';

const items = [
	{emoji: '🧄', text: 'Ajo → 80% menos placa', color: '#4ade80'},
	{emoji: '🫐', text: 'Granada → 35% menos placa', color: '#f43f5e'},
	{emoji: '❌', text: 'Ultraprocesados → Eliminar', color: '#ff4444'},
];

export const ArteriasSummary: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps, durationInFrames, width} = useVideoConfig();
	const scale = width / 1920;

	const titleEnter = spring({frame, fps, config: {damping: 200, stiffness: 150}});
	const titleY = interpolate(titleEnter, [0, 1], [30, 0]) * scale;

	const exit = interpolate(frame, [durationInFrames - 15, durationInFrames], [1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill style={{opacity: exit}}>
			<AbsoluteFill style={{
				background: 'rgba(8, 16, 40, 0.90)',
				justifyContent: 'center',
				alignItems: 'center',
				padding: 60 * scale,
			}}>
				<div style={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					gap: 50 * scale,
					maxWidth: 1600 * scale,
				}}>
					<div style={{
						opacity: titleEnter,
						transform: `translateY(${titleY}px)`,
						fontFamily: 'Helvetica, Arial, sans-serif',
						fontWeight: 900,
						fontSize: 60 * scale,
						color: '#ffffff',
						textAlign: 'center',
						textShadow: '0 0 30px rgba(91,140,255,0.6)',
					}}>
						LIMPIA TUS ARTERIAS
					</div>
					{items.map((item, i) => {
						const delay = 15 + i * 15;
						const enter = spring({frame, fps, delay, config: {damping: 200, stiffness: 150}});
						const translateY = interpolate(enter, [0, 1], [40, 0]) * scale;
						const itemScale = interpolate(enter, [0, 1], [0.8, 1]);
						return (
							<div
								key={i}
								style={{
									opacity: enter,
									transform: `translateY(${translateY}px) scale(${itemScale})`,
									display: 'flex',
									alignItems: 'center',
									gap: 24 * scale,
									padding: `${20 * scale}px ${36 * scale}px`,
									background: 'rgba(255,255,255,0.06)',
									borderRadius: 16 * scale,
									borderLeft: `6px solid ${item.color}`,
									width: '100%',
								}}
							>
								<div style={{fontSize: 60 * scale}}>{item.emoji}</div>
								<div style={{
									fontFamily: 'Helvetica, Arial, sans-serif',
									fontWeight: 800,
									fontSize: 48 * scale,
									color: item.color,
									lineHeight: 1.2,
								}}>
									{item.text}
								</div>
							</div>
						);
					})}
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
