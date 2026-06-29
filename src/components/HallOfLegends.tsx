import React from 'react';
import {AbsoluteFill, Img, Sequence, useCurrentFrame, useVideoConfig, interpolate, spring, staticFile} from 'remotion';
import {LEGENDS, Legend} from './hallOfLegendsData';

const INTRO_FRAMES = 90;
const LEGEND_FRAMES = 300;
const TRANSITION_FRAMES = 60;
const OUTRO_FRAMES = 120;

const HALLWAY_SEGMENT_WIDTH = 1920;

export const HallOfLegends: React.FC = () => {
	const {fps} = useVideoConfig();
	const total = LEGENDS.length;
	const outroStart = INTRO_FRAMES + total * LEGEND_FRAMES;

	return (
		<AbsoluteFill style={{backgroundColor: '#000', fontFamily: 'Georgia, serif', overflow: 'hidden'}}>
			<Sequence from={0} durationInFrames={INTRO_FRAMES}>
				<Intro fps={fps} />
			</Sequence>

			{LEGENDS.map((legend, i) => (
				<Sequence key={i} from={INTRO_FRAMES + i * LEGEND_FRAMES} durationInFrames={LEGEND_FRAMES}>
					<HallwaySegment legend={legend} fps={fps} index={i} />
				</Sequence>
			))}

			<Sequence from={outroStart} durationInFrames={OUTRO_FRAMES}>
				<Outro fps={fps} />
			</Sequence>
		</AbsoluteFill>
	);
};

const Intro: React.FC<{fps: number}> = ({fps}) => {
	const frame = useCurrentFrame();
	const candleFlicker = 0.7 + 0.3 * Math.sin(frame * 0.15);
	const titleOp = interpolate(frame, [15, 40], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const titleScale = spring({frame: Math.max(0, frame - 15), fps, from: 0.8, to: 1, durationInFrames: 20});
	const subOp = interpolate(frame, [40, 60], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const lineWidth = interpolate(frame, [30, 70], [0, 400], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const fadeOut = interpolate(frame, [INTRO_FRAMES - 15, INTRO_FRAMES], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	return (
		<AbsoluteFill style={{opacity: fadeOut}}>
			<HallwayBackground frame={frame} />
			<div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20}}>
				<div style={{fontSize: 60, opacity: candleFlicker, filter: `drop-shadow(0 0 20px rgba(255,180,50,${candleFlicker * 0.6}))`}}>🕯️</div>
				<div style={{
					fontSize: 90, fontWeight: 700, textAlign: 'center',
					opacity: titleOp, transform: `scale(${titleScale})`, lineHeight: 1.1,
					background: 'linear-gradient(180deg, #e8d5a3, #c9a84c, #8b6914)',
					WebkitBackgroundClip: 'text',
					WebkitTextFillColor: 'transparent',
					filter: 'drop-shadow(0 4px 15px rgba(0,0,0,0.8))',
					letterSpacing: 6,
				}}>
					HALL OF LEGENDS
				</div>
				<div style={{width: lineWidth, height: 2, background: 'linear-gradient(90deg, transparent, #c9a84c, transparent)'}} />
				<div style={{
					fontSize: 36, color: '#8b9dc3', fontWeight: 400, opacity: subOp,
					fontStyle: 'italic', letterSpacing: 3,
				}}>
					Gone but never forgotten
				</div>
			</div>
		</AbsoluteFill>
	);
};

const Outro: React.FC<{fps: number}> = ({fps}) => {
	const frame = useCurrentFrame();
	const candleFlicker = 0.7 + 0.3 * Math.sin(frame * 0.12);
	const scale = spring({frame, fps, from: 0.5, to: 1, durationInFrames: 20});
	const subOp = interpolate(frame, [30, 50], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	return (
		<AbsoluteFill>
			<HallwayBackground frame={frame} />
			<div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 25}}>
				<div style={{fontSize: 70, opacity: candleFlicker, filter: `drop-shadow(0 0 25px rgba(255,180,50,${candleFlicker * 0.5}))`}}>🕯️</div>
				<div style={{
					fontSize: 70, fontWeight: 700, color: '#e8d5a3', textAlign: 'center',
					transform: `scale(${scale})`, lineHeight: 1.2,
					textShadow: '0 4px 20px rgba(0,0,0,0.8)',
					letterSpacing: 4,
				}}>
					FOREVER<br/>IN OUR HEARTS
				</div>
				<div style={{width: 300, height: 2, background: 'linear-gradient(90deg, transparent, #c9a84c, transparent)', opacity: subOp}} />
				<div style={{
					fontSize: 35, color: '#8b9dc3', fontWeight: 400, opacity: subOp,
					fontStyle: 'italic',
				}}>
					Like & Subscribe 🕊️
				</div>
			</div>
		</AbsoluteFill>
	);
};

const HallwaySegment: React.FC<{legend: Legend; fps: number; index: number}> = ({legend, fps, index}) => {
	const frame = useCurrentFrame();

	const cameraX = interpolate(frame, [0, LEGEND_FRAMES], [800, -200], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	const fadeIn = interpolate(frame, [0, 20], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const fadeOut = interpolate(frame, [LEGEND_FRAMES - 20, LEGEND_FRAMES], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	const portraitIlluminate = interpolate(frame, [40, 90], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const candleAppear = interpolate(frame, [30, 60], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const nameAppear = interpolate(frame, [100, 130], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const nameScale = spring({frame: Math.max(0, frame - 100), fps, from: 0.7, to: 1, durationInFrames: 18});
	const dateAppear = interpolate(frame, [130, 155], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const quoteAppear = interpolate(frame, [160, 200], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const movieAppear = interpolate(frame, [200, 230], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	const candleFlicker1 = 0.6 + 0.4 * Math.sin(frame * 0.13 + index);
	const candleFlicker2 = 0.6 + 0.4 * Math.sin(frame * 0.17 + index + 2);
	const candleFlicker3 = 0.6 + 0.4 * Math.sin(frame * 0.11 + index + 4);

	const glowRadius = 150 + 50 * Math.sin(frame * 0.08);
	const glowIntensity = portraitIlluminate * (0.3 + 0.1 * Math.sin(frame * 0.1));

	return (
		<AbsoluteFill style={{opacity: fadeIn * fadeOut}}>
			<HallwayBackground frame={frame + index * 100} />

			{/* Hallway depth lines */}
			<div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
				{/* Floor reflection line */}
				<div style={{
					position: 'absolute', bottom: '28%', left: 0, right: 0, height: 1,
					background: 'linear-gradient(90deg, transparent 10%, rgba(201,168,76,0.08) 30%, rgba(201,168,76,0.08) 70%, transparent 90%)',
				}} />
				{/* Wall trim */}
				<div style={{
					position: 'absolute', top: '18%', left: 0, right: 0, height: 2,
					background: 'linear-gradient(90deg, transparent 5%, rgba(201,168,76,0.12) 20%, rgba(201,168,76,0.12) 80%, transparent 95%)',
				}} />
				{/* Distant hallway frames (decoration) */}
				{[...Array(4)].map((_, i) => {
					const xPos = 8 + i * 22;
					const size = 30 + i * 5;
					const op = 0.04 + i * 0.01;
					return (
						<div key={i} style={{
							position: 'absolute',
							left: `${xPos}%`, top: '30%',
							width: size, height: size * 1.3,
							border: `1px solid rgba(201,168,76,${op})`,
							borderRadius: 2,
						}} />
					);
				})}
			</div>

			{/* Warm glow behind portrait */}
			<div style={{
				position: 'absolute',
				top: '25%', left: '50%',
				transform: `translate(-50%, -20%) translateX(${cameraX * 0.05}px)`,
				width: glowRadius * 2, height: glowRadius * 2,
				borderRadius: '50%',
				background: `radial-gradient(circle, rgba(255,180,50,${glowIntensity}) 0%, rgba(255,150,30,${glowIntensity * 0.5}) 30%, transparent 70%)`,
				filter: 'blur(40px)',
			}} />

			{/* Main portrait on the wall */}
			<div style={{
				position: 'absolute',
				top: '12%', left: '50%',
				transform: `translateX(-50%) translateX(${cameraX * 0.15}px)`,
			}}>
				{/* Ornate golden frame */}
				<div style={{
					padding: 14,
					background: 'linear-gradient(135deg, #c9a84c, #e8d5a3, #8b6914, #c9a84c, #e8d5a3)',
					borderRadius: 6,
					boxShadow: `
						0 0 ${portraitIlluminate * 40}px rgba(255,180,50,${portraitIlluminate * 0.3}),
						0 0 ${portraitIlluminate * 80}px rgba(255,150,30,${portraitIlluminate * 0.1}),
						inset 0 0 20px rgba(0,0,0,0.3)
					`,
					border: '2px solid rgba(232,213,163,0.6)',
				}}>
					<div style={{
						padding: 6,
						background: 'linear-gradient(135deg, #8b6914, #5a4510)',
						borderRadius: 3,
					}}>
						<div style={{
							width: 380, height: 480,
							borderRadius: 2,
							overflow: 'hidden',
							position: 'relative',
						}}>
							<Img
								src={staticFile(legend.portrait)}
								style={{
									width: '100%', height: '100%', objectFit: 'cover',
									filter: `brightness(${interpolate(portraitIlluminate, [0, 1], [0.1, 0.9])}) saturate(${interpolate(portraitIlluminate, [0, 1], [0, 0.8])})`,
								}}
							/>
							{/* Warm light overlay on portrait */}
							<div style={{
								position: 'absolute', inset: 0,
								background: `linear-gradient(180deg, transparent 40%, rgba(255,180,50,${portraitIlluminate * 0.15}) 100%)`,
							}} />
						</div>
					</div>
				</div>

				{/* Frame ornament top */}
				<div style={{
					position: 'absolute', top: -8, left: '50%', transform: 'translateX(-50%)',
					width: 60, height: 16,
					background: 'linear-gradient(180deg, #e8d5a3, #c9a84c)',
					borderRadius: '8px 8px 0 0',
					opacity: 0.7,
				}} />
			</div>

			{/* Candle below portrait */}
			<div style={{
				position: 'absolute',
				bottom: '26%', left: '50%',
				transform: `translateX(-50%) translateX(${cameraX * 0.15}px)`,
				display: 'flex', gap: 200, alignItems: 'flex-end',
				opacity: candleAppear,
			}}>
				<CandleFlame flicker={candleFlicker1} size={55} />
				<CandleFlame flicker={candleFlicker2} size={60} />
				<CandleFlame flicker={candleFlicker3} size={55} />
			</div>

			{/* Name plate */}
			<div style={{
				position: 'absolute',
				bottom: '15%', left: '50%',
				transform: `translateX(-50%) translateX(${cameraX * 0.15}px) scale(${nameScale})`,
				opacity: nameAppear,
				display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
			}}>
				{/* Name plaque */}
				<div style={{
					background: 'linear-gradient(180deg, rgba(30,25,15,0.9), rgba(20,15,8,0.95))',
					border: '2px solid rgba(201,168,76,0.5)',
					borderRadius: 8,
					padding: '16px 50px',
					display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
				}}>
					<div style={{
						fontSize: 52, fontWeight: 700,
						background: 'linear-gradient(180deg, #e8d5a3, #c9a84c)',
						WebkitBackgroundClip: 'text',
						WebkitTextFillColor: 'transparent',
						letterSpacing: 5,
						filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.8))',
					}}>
						{legend.name.toUpperCase()}
					</div>
					<div style={{width: 200, height: 1, background: 'linear-gradient(90deg, transparent, #c9a84c, transparent)', opacity: dateAppear}} />
					<div style={{
						fontSize: 32, color: '#999',
						letterSpacing: 8,
						opacity: dateAppear,
					}}>
						{legend.born} — {legend.died}
					</div>
				</div>
			</div>

			{/* Quote */}
			<div style={{
				position: 'absolute',
				bottom: '5%', left: '50%',
				transform: `translateX(-50%) translateX(${cameraX * 0.1}px)`,
				opacity: quoteAppear,
				maxWidth: '70%',
			}}>
				<div style={{
					fontSize: 24, color: '#8b9dc3', fontStyle: 'italic',
					textAlign: 'center', lineHeight: 1.5,
					textShadow: '0 2px 10px rgba(0,0,0,0.8)',
				}}>
					{legend.quote}
				</div>
			</div>

			{/* Movie scene small overlay - bottom corner */}
			<div style={{
				position: 'absolute',
				bottom: '5%', right: '5%',
				transform: `translateX(${cameraX * 0.08}px)`,
				opacity: movieAppear,
				width: 280, height: 160,
				borderRadius: 8,
				overflow: 'hidden',
				border: '2px solid rgba(201,168,76,0.3)',
				boxShadow: '0 4px 20px rgba(0,0,0,0.6)',
			}}>
				<Img src={staticFile(legend.movieScene)} style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.7) saturate(0.6)'}} />
				<div style={{
					position: 'absolute', bottom: 0, left: 0, right: 0,
					background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
					padding: '20px 10px 8px',
				}}>
					<div style={{fontSize: 16, color: '#c9a84c', fontStyle: 'italic', textAlign: 'center'}}>
						{legend.movie}
					</div>
				</div>
			</div>

			{/* Floating dust/light particles */}
			{frame > 50 && (
				<div style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
					{[...Array(15)].map((_, i) => {
						const startX = 10 + (i * 6);
						const speed = 0.3 + (i % 4) * 0.1;
						const y = 100 - ((frame - 50) * speed + i * 7) % 120;
						const x = startX + Math.sin((frame * 0.02) + i * 1.8) * 4;
						const particleOp = y > 5 && y < 95 ? (0.15 + 0.15 * Math.sin(frame * 0.06 + i)) * portraitIlluminate : 0;
						const size = 2 + (i % 3);
						return (
							<div key={i} style={{
								position: 'absolute',
								left: `${x}%`, top: `${y}%`,
								width: size, height: size, borderRadius: '50%',
								background: i % 3 === 0 ? '#e8d5a3' : '#c9a84c',
								opacity: particleOp,
								boxShadow: `0 0 ${size * 3}px rgba(232,213,163,${particleOp})`,
							}} />
						);
					})}
				</div>
			)}
		</AbsoluteFill>
	);
};

const CandleFlame: React.FC<{flicker: number; size: number}> = ({flicker, size}) => (
	<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0}}>
		<div style={{
			fontSize: size,
			opacity: flicker,
			filter: `drop-shadow(0 0 ${12 * flicker}px rgba(255,180,50,${flicker * 0.7})) drop-shadow(0 0 ${25 * flicker}px rgba(255,120,20,${flicker * 0.3}))`,
			transform: `scaleX(${0.95 + flicker * 0.05})`,
		}}>
			🕯️
		</div>
	</div>
);

const HallwayBackground: React.FC<{frame: number}> = ({frame}) => {
	const shift = frame * 0.01;
	return (
		<div style={{position: 'absolute', inset: 0}}>
			{/* Dark hallway base */}
			<div style={{
				position: 'absolute', inset: 0,
				background: 'linear-gradient(180deg, #05050a 0%, #0a0a12 30%, #08080e 60%, #030308 100%)',
			}} />
			{/* Wall texture - subtle vertical panels */}
			<div style={{
				position: 'absolute', inset: 0, opacity: 0.04,
				backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 240px, rgba(201,168,76,0.3) 240px, rgba(201,168,76,0.3) 242px)',
			}} />
			{/* Wainscoting line */}
			<div style={{
				position: 'absolute', left: 0, right: 0, top: '70%', height: 2,
				background: 'linear-gradient(90deg, transparent 5%, rgba(201,168,76,0.06) 20%, rgba(201,168,76,0.06) 80%, transparent 95%)',
			}} />
			{/* Floor */}
			<div style={{
				position: 'absolute', left: 0, right: 0, bottom: 0, height: '25%',
				background: 'linear-gradient(180deg, #08080e, #040406)',
			}} />
			{/* Floor reflection */}
			<div style={{
				position: 'absolute', left: 0, right: 0, bottom: 0, height: '25%',
				background: `radial-gradient(ellipse at 50% 0%, rgba(255,180,50,${0.02 + 0.01 * Math.sin(shift * 3)}) 0%, transparent 60%)`,
			}} />
			{/* Ambient warm glow top */}
			<div style={{
				position: 'absolute', inset: 0,
				background: `radial-gradient(ellipse at 50% 20%, rgba(201,168,76,${0.02 + 0.005 * Math.sin(shift * 2)}) 0%, transparent 50%)`,
			}} />
		</div>
	);
};
