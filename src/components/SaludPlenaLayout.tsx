import {AbsoluteFill, OffthreadVideo, staticFile, useVideoConfig} from 'remotion';

export const SaludPlenaLayout: React.FC<{
	videoSrc: string;
	title: string;
}> = ({videoSrc, title}) => {
	const {width} = useVideoConfig();
	const scale = width / 1920;

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
				padding: `${14 * scale}px ${30 * scale}px`,
				background: 'linear-gradient(90deg, #7c3aed, #db2777)',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
			}}>
				<div style={{
					fontFamily: 'Helvetica, Arial, sans-serif',
					fontWeight: 900,
					fontSize: 42 * scale,
					color: '#ffffff',
					textAlign: 'center',
					textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
					letterSpacing: 1,
				}}>
					{title}
				</div>
			</div>

			{/* Doctor avatar - bottom center */}
			<div style={{
				position: 'absolute',
				bottom: 0,
				left: '50%',
				transform: 'translateX(-50%)',
				width: 700 * scale,
				height: 600 * scale,
				overflow: 'hidden',
			}}>
				<OffthreadVideo
					src={staticFile(videoSrc)}
					style={{
						width: '100%',
						height: '100%',
						objectFit: 'cover',
						objectPosition: 'top center',
					}}
				/>
			</div>

			{/* Logo bottom left */}
			<div style={{
				position: 'absolute',
				bottom: 20 * scale,
				left: 20 * scale,
				display: 'flex',
				alignItems: 'center',
				gap: 10 * scale,
			}}>
				<div style={{
					background: 'linear-gradient(135deg, #059669, #10b981)',
					borderRadius: 12 * scale,
					padding: `${8 * scale}px ${12 * scale}px`,
					fontFamily: 'Helvetica, Arial, sans-serif',
					fontWeight: 900,
					fontSize: 16 * scale,
					color: '#fff',
				}}>
					🩺 DRA LAURA
				</div>
				<div style={{
					fontFamily: 'Helvetica, Arial, sans-serif',
					fontWeight: 800,
					fontSize: 22 * scale,
					color: '#1e293b',
				}}>
					Salud Después de los 50
				</div>
			</div>

			{/* Subscribe button bottom right */}
			<div style={{
				position: 'absolute',
				bottom: 20 * scale,
				right: 20 * scale,
				display: 'flex',
				alignItems: 'center',
				gap: 8 * scale,
				background: '#ff0000',
				borderRadius: 8 * scale,
				padding: `${10 * scale}px ${20 * scale}px`,
			}}>
				<div style={{fontSize: 20 * scale}}>▶</div>
				<div style={{
					fontFamily: 'Helvetica, Arial, sans-serif',
					fontWeight: 900,
					fontSize: 22 * scale,
					color: '#ffffff',
				}}>
					SUSCRÍBETE
				</div>
			</div>
		</AbsoluteFill>
	);
};
