import {AbsoluteFill, OffthreadVideo, staticFile, useVideoConfig, useCurrentFrame, Img} from 'remotion';

const ChromaKeyVideo: React.FC<{src: string; style?: React.CSSProperties}> = ({src, style}) => {
	return (
		<div style={{position: 'relative', ...style}}>
			<OffthreadVideo
				src={src}
				style={{
					width: '100%',
					height: '100%',
					objectFit: 'contain',
					objectPosition: 'bottom center',
				}}
			/>
			{/* Green screen removal via SVG filter */}
			<svg style={{position: 'absolute', width: 0, height: 0}}>
				<defs>
					<filter id="chromakey">
						<feColorMatrix
							type="matrix"
							values="1 0 0 0 0
									0 1 0 0 0
									0 0 1 0 0
									-1 -2 -1 0 1"
							result="mask"
						/>
					</filter>
				</defs>
			</svg>
		</div>
	);
};

export const PruebaFormatoEdit: React.FC = () => {
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
					fontSize: 40 * scale,
					color: '#ffffff',
					textAlign: 'center',
					textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
				}}>
					Cómo Recuperar el Segundo Round Después de los 50
				</div>
			</div>

			{/* Doctor avatar - bottom center, with green bg visible (user adds subtitles in CapCut) */}
			<div style={{
				position: 'absolute',
				bottom: -10 * scale,
				left: '50%',
				transform: 'translateX(-60%)',
				width: 700 * scale,
				height: 580 * scale,
			}}>
				<OffthreadVideo
					src={staticFile('doctora_alpha.webm')}
					style={{
						width: '100%',
						height: '100%',
						objectFit: 'contain',
						objectPosition: 'bottom center',
					}}
				/>
			</div>

			{/* Logo bottom left */}
			<div style={{
				position: 'absolute',
				bottom: 16 * scale,
				left: 16 * scale,
				display: 'flex',
				alignItems: 'center',
				gap: 10 * scale,
			}}>
				<div style={{
					background: 'linear-gradient(135deg, #059669, #10b981)',
					borderRadius: 12 * scale,
					padding: `${8 * scale}px ${14 * scale}px`,
					fontFamily: 'Helvetica, Arial, sans-serif',
					fontWeight: 900,
					fontSize: 18 * scale,
					color: '#fff',
				}}>
					🩺 DRA LAURA
				</div>
				<div style={{
					fontFamily: 'Helvetica, Arial, sans-serif',
					fontWeight: 800,
					fontSize: 20 * scale,
					color: '#1e293b',
				}}>
					Salud Después de los 50
				</div>
			</div>

			{/* Subscribe button bottom right */}
			<div style={{
				position: 'absolute',
				bottom: 16 * scale,
				right: 16 * scale,
				display: 'flex',
				alignItems: 'center',
				gap: 8 * scale,
				background: '#ff0000',
				borderRadius: 8 * scale,
				padding: `${10 * scale}px ${20 * scale}px`,
			}}>
				<div style={{fontSize: 20 * scale, color: '#fff'}}>▶</div>
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
