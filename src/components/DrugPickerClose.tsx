import {AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate} from 'remotion';

const options = [
	{emoji: '🔵', text: 'Necesitas duración → Tadalafilo', color: '#60a5fa'},
	{emoji: '🟢', text: 'Necesitas rapidez → Avanafilo', color: '#4ade80'},
	{emoji: '🟡', text: 'Necesitas precio bajo → Sildenafilo', color: '#f59e0b'},
];

export const DrugPickerClose: React.FC = () => {
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
					maxWidth: 1500 * scale,
				}}>
					<div style={{
						opacity: titleEnter,
						transform: `translateY(${titleY}px)`,
						fontFamily: 'Helvetica, Arial, sans-serif',
						fontWeight: 900,
						fontSize: 58 * scale,
						color: '#ffffff',
						textAlign: 'center',
					}}>
						¿Cuál es mejor para TI?
					</div>
					{options.map((item, i) => {
						const delay = 15 + i * 15;
						const enter = spring({frame, fps, delay, config: {damping: 200, stiffness: 150}});
						const translateX = interpolate(enter, [0, 1], [-40, 0]) * scale;
						return (
							<div
								key={i}
								style={{
									opacity: enter,
									transform: `translateX(${translateX}px)`,
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
								<div style={{fontSize: 50 * scale}}>{item.emoji}</div>
								<div style={{
									fontFamily: 'Helvetica, Arial, sans-serif',
									fontWeight: 800,
									fontSize: 46 * scale,
									color: item.color,
								}}>
									{item.text}
								</div>
							</div>
						);
					})}
					<div style={{
						opacity: spring({frame, fps, delay: 70, config: {damping: 200, stiffness: 150}}),
						fontFamily: 'Helvetica, Arial, sans-serif',
						fontWeight: 900,
						fontSize: 44 * scale,
						color: '#4ade80',
						textAlign: 'center',
					}}>
						SUSCRÍBETE → Salud masculina cada semana
					</div>
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
