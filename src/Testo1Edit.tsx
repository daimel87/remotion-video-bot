import {AbsoluteFill, Audio, Img, staticFile, useVideoConfig} from 'remotion';

export const Testo1Edit: React.FC = () => {
	const {width} = useVideoConfig();
	const s = width / 1920;

	return (
		<AbsoluteFill>
			{/* Audio */}
			<Audio src={staticFile('testo_1_audio.wav')} />

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
					fontSize: 58 * s,
					color: '#ffffff',
					textAlign: 'center',
					WebkitTextStroke: `${4 * s}px #000000`,
					paintOrder: 'stroke fill',
					letterSpacing: 1,
					lineHeight: 1.2,
				}}>
					7 Señales De Testosterona Baja Después De Los 50
				</div>
			</div>

			{/* Illustration - left side */}
			<div style={{
				position: 'absolute',
				top: '50%',
				left: 40 * s,
				transform: 'translateY(-45%)',
				width: 620 * s,
				height: 620 * s,
				borderRadius: 30 * s,
				overflow: 'hidden',
				boxShadow: `0 ${8 * s}px ${30 * s}px rgba(0,0,0,0.3)`,
				border: `${4 * s}px solid rgba(255,255,255,0.4)`,
			}}>
				<Img
					src={staticFile('testo_1_img.png')}
					style={{
						width: '100%',
						height: '100%',
						objectFit: 'cover',
					}}
				/>
			</div>

			{/* Logo bottom left - bigger */}
			<div style={{
				position: 'absolute',
				bottom: 100 * s,
				left: 30 * s,
				display: 'flex',
				alignItems: 'center',
				gap: 12 * s,
			}}>
				<div style={{
					background: 'linear-gradient(135deg, #059669, #10b981)',
					borderRadius: 14 * s,
					padding: `${10 * s}px ${16 * s}px`,
					fontFamily: 'Helvetica, Arial, sans-serif',
					fontWeight: 900,
					fontSize: 24 * s,
					color: '#fff',
				}}>
					🩺 DRA LAURA
				</div>
				<div style={{
					fontFamily: 'Helvetica, Arial, sans-serif',
					fontWeight: 800,
					fontSize: 26 * s,
					color: '#1e293b',
					WebkitTextStroke: `${0.5 * s}px rgba(255,255,255,0.5)`,
					paintOrder: 'stroke fill',
				}}>
					Salud Después de los 50
				</div>
			</div>

			{/* Subscribe button - bigger, higher, more centered-right */}
			<div style={{
				position: 'absolute',
				bottom: 100 * s,
				right: 60 * s,
				display: 'flex',
				alignItems: 'center',
				gap: 10 * s,
				background: '#ff0000',
				borderRadius: 12 * s,
				padding: `${14 * s}px ${28 * s}px`,
				boxShadow: `0 ${4 * s}px ${15 * s}px rgba(0,0,0,0.4)`,
			}}>
				<div style={{
					fontSize: 28 * s,
					color: '#fff',
				}}>▶</div>
				<div style={{
					fontFamily: 'Helvetica, Arial, sans-serif',
					fontWeight: 900,
					fontSize: 30 * s,
					color: '#ffffff',
				}}>
					SUSCRÍBETE
				</div>
			</div>
		</AbsoluteFill>
	);
};
