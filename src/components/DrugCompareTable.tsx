import {AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate} from 'remotion';

const drugs = [
	{name: 'Sildenafilo', inicio: '30-60 min', duracion: '4-6 h', comida: '❌ Afecta', efectos: 'Dolor cabeza', color: '#f59e0b'},
	{name: 'Tadalafilo', inicio: '1-2 horas', duracion: '36 h', comida: '✅ Poco', efectos: 'Dolor espalda', color: '#60a5fa'},
	{name: 'Avanafilo', inicio: '15 min', duracion: '6-8 h', comida: '✅ Mínimo', efectos: 'Mínimos', color: '#4ade80'},
];

export const DrugCompareTable: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps, durationInFrames, width} = useVideoConfig();
	const scale = width / 1920;

	const titleEnter = spring({frame, fps, config: {damping: 200, stiffness: 150}});

	const exit = interpolate(frame, [durationInFrames - 15, durationInFrames], [1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill style={{opacity: exit}}>
			<AbsoluteFill style={{
				background: 'rgba(8, 16, 40, 0.92)',
				justifyContent: 'center',
				alignItems: 'center',
				padding: 40 * scale,
			}}>
				<div style={{
					display: 'flex',
					flexDirection: 'column',
					gap: 30 * scale,
					maxWidth: 1700 * scale,
					width: '100%',
				}}>
					<div style={{
						opacity: titleEnter,
						fontFamily: 'Helvetica, Arial, sans-serif',
						fontWeight: 900,
						fontSize: 52 * scale,
						color: '#ffffff',
						textAlign: 'center',
						textShadow: '0 0 20px rgba(74,222,128,0.5)',
					}}>
						⚡ COMPARATIVA DIRECTA
					</div>

					<div style={{
						display: 'flex',
						justifyContent: 'space-around',
						opacity: titleEnter,
						gap: 10 * scale,
					}}>
						{['⏱️ Inicio', '⏳ Duración', '🍔 Comida', '⚠️ Efectos'].map((h) => (
							<div key={h} style={{
								fontFamily: 'Helvetica, Arial, sans-serif',
								fontWeight: 700,
								fontSize: 28 * scale,
								color: '#94a3b8',
								textAlign: 'center',
								flex: 1,
								marginLeft: 180 * scale,
							}}>
								{h}
							</div>
						))}
					</div>

					{drugs.map((drug, i) => {
						const delay = 20 + i * 20;
						const enter = spring({frame, fps, delay, config: {damping: 200, stiffness: 150}});
						const translateX = interpolate(enter, [0, 1], [-50, 0]) * scale;
						return (
							<div
								key={i}
								style={{
									opacity: enter,
									transform: `translateX(${translateX}px)`,
									display: 'flex',
									alignItems: 'center',
									padding: `${18 * scale}px ${24 * scale}px`,
									background: i === 2 ? 'rgba(74,222,128,0.12)' : 'rgba(255,255,255,0.04)',
									borderRadius: 14 * scale,
									borderLeft: `5px solid ${drug.color}`,
									gap: 10 * scale,
								}}
							>
								<div style={{
									fontFamily: 'Helvetica, Arial, sans-serif',
									fontWeight: 900,
									fontSize: 36 * scale,
									color: drug.color,
									minWidth: 180 * scale,
								}}>
									{drug.name}
								</div>
								{[drug.inicio, drug.duracion, drug.comida, drug.efectos].map((val, j) => (
									<div key={j} style={{
										flex: 1,
										fontFamily: 'Helvetica, Arial, sans-serif',
										fontWeight: 700,
										fontSize: 32 * scale,
										color: '#ffffff',
										textAlign: 'center',
									}}>
										{val}
									</div>
								))}
							</div>
						);
					})}
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
