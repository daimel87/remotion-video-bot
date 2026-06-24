import {AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate} from 'remotion';

const pills = [
	{num: '1', text: 'Ibuprofeno → +48%', color: '#ff4444'},
	{num: '2', text: 'Omeprazol → +16-21%', color: '#f59e0b'},
	{num: '3', text: 'Azitromicina → +250%', color: '#ff4444'},
	{num: '4', text: 'Diclofenaco → +40%', color: '#f59e0b'},
	{num: '5', text: 'Calcio → +30%', color: '#ff4444'},
];

export const PillsSummary: React.FC = () => {
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
				background: 'rgba(40, 8, 8, 0.93)',
				justifyContent: 'center',
				alignItems: 'center',
				padding: 30 * scale,
			}}>
				<div style={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					gap: 28 * scale,
					maxWidth: 1700 * scale,
					width: '100%',
				}}>
					<div style={{
						opacity: titleEnter,
						transform: `translateY(${titleY}px)`,
						fontFamily: 'Helvetica, Arial, sans-serif',
						fontWeight: 900,
						fontSize: 64 * scale,
						color: '#ff4444',
						textAlign: 'center',
					}}>
						⛔ LAS 5 PASTILLAS
					</div>
					{pills.map((pill, i) => {
						const delay = 12 + i * 12;
						const enter = spring({frame, fps, delay, config: {damping: 200, stiffness: 150}});
						const translateX = interpolate(enter, [0, 1], [-50, 0]) * scale;
						const itemScale = interpolate(enter, [0, 1], [0.8, 1]);
						return (
							<div
								key={i}
								style={{
									opacity: enter,
									transform: `translateX(${translateX}px) scale(${itemScale})`,
									display: 'flex',
									alignItems: 'center',
									gap: 20 * scale,
									padding: `${16 * scale}px ${28 * scale}px`,
									background: 'rgba(255,255,255,0.06)',
									borderRadius: 14 * scale,
									borderLeft: `6px solid ${pill.color}`,
									width: '100%',
								}}
							>
								<div style={{
									fontFamily: 'Helvetica, Arial, sans-serif',
									fontWeight: 900,
									fontSize: 56 * scale,
									color: '#ffffff',
									minWidth: 60 * scale,
									textAlign: 'center',
								}}>
									{pill.num}
								</div>
								<div style={{
									fontFamily: 'Helvetica, Arial, sans-serif',
									fontWeight: 800,
									fontSize: 52 * scale,
									color: pill.color,
								}}>
									{pill.text}
								</div>
							</div>
						);
					})}
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
