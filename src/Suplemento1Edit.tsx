import {AbsoluteFill, useVideoConfig} from 'remotion';

export const Suplemento1Edit: React.FC = () => {
	const {width} = useVideoConfig();
	const s = width / 1920;

	return (
		<AbsoluteFill>
			{/* Gradient background */}
			<AbsoluteFill style={{
				background: 'linear-gradient(135deg, #a78bfa 0%, #e879a8 40%, #f9a8d4 70%, #fbc2eb 100%)',
			}} />

			{/* Top banner */}
			<div style={{
				position: 'absolute',
				top: 0,
				left: 0,
				right: 0,
				padding: `${26 * s}px ${30 * s}px`,
				background: 'linear-gradient(90deg, #7c3aed, #db2777)',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
			}}>
				<div style={{
					fontFamily: 'Helvetica, Arial, sans-serif',
					fontWeight: 900,
					fontSize: 54 * s,
					color: '#ffffff',
					textAlign: 'center',
					WebkitTextStroke: `${4 * s}px #000000`,
					paintOrder: 'stroke fill',
					letterSpacing: 1,
					lineHeight: 1.2,
				}}>
					El Suplemento Natural Que Reemplaza Al Tadalafilo
				</div>
			</div>

			{/* Logo bottom left - stacked, big with borders */}
			<div style={{
				position: 'absolute',
				bottom: 50 * s,
				left: 40 * s,
				display: 'flex',
				flexDirection: 'column',
				gap: 6 * s,
			}}>
				<div style={{
					fontFamily: 'Helvetica, Arial, sans-serif',
					fontWeight: 900,
					fontSize: 60 * s,
					color: '#ffffff',
					WebkitTextStroke: `${4 * s}px #000000`,
					paintOrder: 'stroke fill',
				}}>
					🩺 DRA LAURA
				</div>
				<div style={{
					fontFamily: 'Helvetica, Arial, sans-serif',
					fontWeight: 900,
					fontSize: 40 * s,
					color: '#ffffff',
					WebkitTextStroke: `${3 * s}px #000000`,
					paintOrder: 'stroke fill',
				}}>
					SALUD DESPUÉS DE LOS 50
				</div>
			</div>

			{/* Subscribe button - big */}
			<div style={{
				position: 'absolute',
				bottom: 50 * s,
				right: 50 * s,
				display: 'flex',
				alignItems: 'center',
				gap: 12 * s,
				background: '#ff0000',
				borderRadius: 14 * s,
				padding: `${18 * s}px ${36 * s}px`,
				boxShadow: `0 ${4 * s}px ${15 * s}px rgba(0,0,0,0.4)`,
			}}>
				<div style={{
					fontSize: 36 * s,
					color: '#fff',
				}}>▶</div>
				<div style={{
					fontFamily: 'Helvetica, Arial, sans-serif',
					fontWeight: 900,
					fontSize: 38 * s,
					color: '#ffffff',
				}}>
					SUSCRÍBETE
				</div>
			</div>
		</AbsoluteFill>
	);
};
