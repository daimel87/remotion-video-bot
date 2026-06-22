import {AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate} from 'remotion';

const warnings = [
	{emoji: '💊', text: 'Nitratos (nitroglicerina, isosorbide)', color: '#f43f5e'},
	{emoji: '💊', text: 'Alfa-bloqueadores (sin consulta)', color: '#f59e0b'},
	{emoji: '❤️', text: 'Infarto reciente (<6 meses)', color: '#f43f5e'},
	{emoji: '🍺', text: 'Alcohol en exceso', color: '#f59e0b'},
];

export const WarningList: React.FC = () => {
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
				background: 'rgba(40, 8, 8, 0.92)',
				justifyContent: 'center',
				alignItems: 'center',
				padding: 60 * scale,
			}}>
				<div style={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					gap: 40 * scale,
					maxWidth: 1500 * scale,
				}}>
					<div style={{
						opacity: titleEnter,
						transform: `translateY(${titleY}px)`,
						fontFamily: 'Helvetica, Arial, sans-serif',
						fontWeight: 900,
						fontSize: 56 * scale,
						color: '#ff4444',
						textAlign: 'center',
					}}>
						⛔ NUNCA combines con:
					</div>
					{warnings.map((item, i) => {
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
									padding: `${18 * scale}px ${32 * scale}px`,
									background: 'rgba(255,255,255,0.06)',
									borderRadius: 14 * scale,
									borderLeft: `5px solid ${item.color}`,
									width: '100%',
								}}
							>
								<div style={{fontSize: 50 * scale}}>{item.emoji}</div>
								<div style={{
									fontFamily: 'Helvetica, Arial, sans-serif',
									fontWeight: 800,
									fontSize: 44 * scale,
									color: '#ffffff',
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
