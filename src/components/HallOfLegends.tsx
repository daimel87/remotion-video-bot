import React from 'react';
import {AbsoluteFill, Img, Sequence, useCurrentFrame, useVideoConfig, interpolate, spring, staticFile} from 'remotion';
import {LEGENDS, Legend} from './hallOfLegendsData';

const INTRO_FRAMES = 120;
const LEGEND_FRAMES = 480;
const OUTRO_FRAMES = 150;

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
					<LegendSegment legend={legend} fps={fps} index={i} />
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

	const doorsOpen = interpolate(frame, [10, 50], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const leftDoor = interpolate(doorsOpen, [0, 1], [0, -100], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const rightDoor = interpolate(doorsOpen, [0, 1], [0, 100], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	const titleOp = interpolate(frame, [40, 65], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const titleScale = spring({frame: Math.max(0, frame - 40), fps, from: 0.6, to: 1, durationInFrames: 25});
	const subOp = interpolate(frame, [60, 80], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const lineWidth = interpolate(frame, [55, 90], [0, 500], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const fadeOut = interpolate(frame, [INTRO_FRAMES - 20, INTRO_FRAMES], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	const torchFlicker1 = 0.6 + 0.4 * Math.sin(frame * 0.13);
	const torchFlicker2 = 0.6 + 0.4 * Math.sin(frame * 0.17 + 2);

	return (
		<AbsoluteFill style={{opacity: fadeOut}}>
			<HallwayBackground frame={frame} intensity={doorsOpen} />

			{/* Grand doors opening */}
			<div style={{
				position: 'absolute', inset: 0, overflow: 'hidden',
				opacity: interpolate(doorsOpen, [0.8, 1], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
			}}>
				<div style={{
					position: 'absolute', top: 0, bottom: 0, left: 0, width: '50%',
					background: 'linear-gradient(90deg, #1a1510, #0d0a06)',
					transform: `translateX(${leftDoor}%)`,
					borderRight: '4px solid rgba(201,168,76,0.3)',
					boxShadow: 'inset -20px 0 40px rgba(0,0,0,0.5)',
				}}>
					<div style={{position: 'absolute', right: 30, top: '50%', transform: 'translateY(-50%)', width: 20, height: 80, borderRadius: 10, background: 'linear-gradient(180deg, #c9a84c, #8b6914)', boxShadow: '0 0 15px rgba(201,168,76,0.3)'}} />
				</div>
				<div style={{
					position: 'absolute', top: 0, bottom: 0, right: 0, width: '50%',
					background: 'linear-gradient(270deg, #1a1510, #0d0a06)',
					transform: `translateX(${-rightDoor}%)`,
					borderLeft: '4px solid rgba(201,168,76,0.3)',
					boxShadow: 'inset 20px 0 40px rgba(0,0,0,0.5)',
				}}>
					<div style={{position: 'absolute', left: 30, top: '50%', transform: 'translateY(-50%)', width: 20, height: 80, borderRadius: 10, background: 'linear-gradient(180deg, #c9a84c, #8b6914)', boxShadow: '0 0 15px rgba(201,168,76,0.3)'}} />
				</div>
			</div>

			{/* Torches on walls */}
			<div style={{position: 'absolute', top: '25%', left: '8%', fontSize: 70, opacity: torchFlicker1 * doorsOpen, filter: `drop-shadow(0 0 30px rgba(255,150,30,${torchFlicker1 * 0.8})) drop-shadow(0 0 60px rgba(255,100,0,${torchFlicker1 * 0.3}))`}}>🔥</div>
			<div style={{position: 'absolute', top: '25%', right: '8%', fontSize: 70, opacity: torchFlicker2 * doorsOpen, filter: `drop-shadow(0 0 30px rgba(255,150,30,${torchFlicker2 * 0.8})) drop-shadow(0 0 60px rgba(255,100,0,${torchFlicker2 * 0.3}))`}}>🔥</div>

			{/* Title */}
			<div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 15}}>
				<div style={{
					fontSize: 100, fontWeight: 700, textAlign: 'center',
					opacity: titleOp, transform: `scale(${titleScale})`, lineHeight: 1.1,
					background: 'linear-gradient(180deg, #f0e4c8, #e8d5a3, #c9a84c, #8b6914)',
					WebkitBackgroundClip: 'text',
					WebkitTextFillColor: 'transparent',
					filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.9)) drop-shadow(0 0 40px rgba(201,168,76,0.2))',
					letterSpacing: 8,
				}}>
					HALL OF LEGENDS
				</div>
				<div style={{width: lineWidth, height: 3, background: 'linear-gradient(90deg, transparent, #8b6914, #c9a84c, #e8d5a3, #c9a84c, #8b6914, transparent)', borderRadius: 2}} />
				<div style={{
					fontSize: 38, color: '#8b9dc3', fontWeight: 400, opacity: subOp,
					fontStyle: 'italic', letterSpacing: 4,
					textShadow: '0 2px 15px rgba(0,0,0,0.8)',
				}}>
					Gone but never forgotten
				</div>
				<div style={{
					marginTop: 10, opacity: subOp * 0.6, fontSize: 40,
					filter: `drop-shadow(0 0 15px rgba(255,180,50,0.4))`,
				}}>
					✦ 🕊️ ✦
				</div>
			</div>
		</AbsoluteFill>
	);
};

const Outro: React.FC<{fps: number}> = ({fps}) => {
	const frame = useCurrentFrame();
	const scale = spring({frame, fps, from: 0.5, to: 1, durationInFrames: 25});
	const subOp = interpolate(frame, [30, 55], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const candleFlicker = 0.6 + 0.4 * Math.sin(frame * 0.12);

	return (
		<AbsoluteFill>
			<HallwayBackground frame={frame} intensity={1} />
			<div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20}}>
				<div style={{fontSize: 80, opacity: candleFlicker, filter: `drop-shadow(0 0 30px rgba(255,180,50,${candleFlicker * 0.6})) drop-shadow(0 0 60px rgba(255,120,20,${candleFlicker * 0.2}))`}}>🕊️</div>
				<div style={{
					fontSize: 75, fontWeight: 700, textAlign: 'center',
					transform: `scale(${scale})`, lineHeight: 1.2,
					background: 'linear-gradient(180deg, #f0e4c8, #c9a84c, #8b6914)',
					WebkitBackgroundClip: 'text',
					WebkitTextFillColor: 'transparent',
					filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.9))',
					letterSpacing: 5,
				}}>
					FOREVER<br/>IN OUR HEARTS
				</div>
				<div style={{width: 400, height: 3, background: 'linear-gradient(90deg, transparent, #c9a84c, transparent)', opacity: subOp}} />
				<div style={{
					fontSize: 36, color: '#8b9dc3', fontWeight: 400, opacity: subOp,
					fontStyle: 'italic', letterSpacing: 3,
				}}>
					Like & Subscribe 🕊️
				</div>
			</div>
			{/* Floor candles */}
			<div style={{position: 'absolute', bottom: '10%', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 100}}>
				{[0,1,2,3,4].map(i => {
					const f = 0.5 + 0.5 * Math.sin(frame * (0.1 + i * 0.03) + i * 1.5);
					return <div key={i} style={{fontSize: 50, opacity: f, filter: `drop-shadow(0 0 20px rgba(255,180,50,${f * 0.6}))`}}>🕯️</div>;
				})}
			</div>
		</AbsoluteFill>
	);
};

const LegendSegment: React.FC<{legend: Legend; fps: number; index: number}> = ({legend, fps, index}) => {
	const frame = useCurrentFrame();

	// === PHASE 1: Movie scene fills screen (0-120) ===
	const sceneIn = interpolate(frame, [0, 40], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const sceneZoom = interpolate(frame, [0, 480], [1, 1.15], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const movieTitleOp = interpolate(frame, [30, 60], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const movieTitleScale = spring({frame: Math.max(0, frame - 30), fps, from: 0.5, to: 1, durationInFrames: 18});

	// === PHASE 2: Scene darkens, hallway emerges (100-180) ===
	const sceneDarken = interpolate(frame, [100, 180], [0, 0.85], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const hallwayReveal = interpolate(frame, [120, 180], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	// === PHASE 3: Portrait illuminates in golden frame (140-220) ===
	const portraitIlluminate = interpolate(frame, [140, 220], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const portraitScale = spring({frame: Math.max(0, frame - 150), fps, from: 0.5, to: 1, durationInFrames: 30});
	const frameGlow = interpolate(frame, [160, 230], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	// === PHASE 4: Candles light up (180-230) ===
	const candlesAppear = interpolate(frame, [180, 220], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const candleFlicker1 = 0.5 + 0.5 * Math.sin(frame * 0.13 + index);
	const candleFlicker2 = 0.5 + 0.5 * Math.sin(frame * 0.17 + index + 2);
	const candleFlicker3 = 0.5 + 0.5 * Math.sin(frame * 0.11 + index + 4);
	const candleFlicker4 = 0.5 + 0.5 * Math.sin(frame * 0.15 + index + 6);

	// === PHASE 5: Name plaque (220-270) ===
	const nameOp = interpolate(frame, [220, 255], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const nameScale = spring({frame: Math.max(0, frame - 220), fps, from: 0.6, to: 1, durationInFrames: 20});
	const dateOp = interpolate(frame, [255, 280], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const lineWidth = interpolate(frame, [250, 290], [0, 250], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	// === PHASE 6: Quote (300-360) ===
	const quoteOp = interpolate(frame, [300, 350], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const quoteY = interpolate(frame, [300, 350], [30, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	// === PHASE 7: Torches on walls (200+) ===
	const torchOp = interpolate(frame, [200, 250], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const torch1 = 0.5 + 0.5 * Math.sin(frame * 0.12 + 1);
	const torch2 = 0.5 + 0.5 * Math.sin(frame * 0.14 + 3);

	// Fade out
	const fadeOut = interpolate(frame, [LEGEND_FRAMES - 30, LEGEND_FRAMES], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	// Camera subtle sway
	const cameraSway = Math.sin(frame * 0.008) * 5;

	// Warm glow pulsing
	const glowPulse = 0.7 + 0.3 * Math.sin(frame * 0.06);

	return (
		<AbsoluteFill style={{opacity: fadeOut}}>
			{/* Movie scene background - fills entire screen */}
			<div style={{
				position: 'absolute', inset: 0, opacity: sceneIn,
				transform: `scale(${sceneZoom}) translateX(${cameraSway}px)`,
			}}>
				<Img src={staticFile(legend.movieScene)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
			</div>

			{/* Cinematic letterbox bars */}
			<div style={{position: 'absolute', top: 0, left: 0, right: 0, height: 60, background: 'linear-gradient(180deg, rgba(0,0,0,0.9), transparent)', opacity: sceneIn}} />
			<div style={{position: 'absolute', bottom: 0, left: 0, right: 0, height: 60, background: 'linear-gradient(0deg, rgba(0,0,0,0.9), transparent)', opacity: sceneIn}} />

			{/* Movie title - top */}
			<div style={{
				position: 'absolute', top: 40, left: '50%',
				transform: `translateX(-50%) scale(${movieTitleScale})`,
				opacity: movieTitleOp * interpolate(frame, [140, 180], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
				background: 'rgba(0,0,0,0.7)',
				padding: '12px 50px', borderRadius: 8,
				border: '1px solid rgba(201,168,76,0.4)',
				backdropFilter: 'blur(10px)',
			}}>
				<span style={{fontSize: 36, fontWeight: 400, color: '#c9a84c', fontStyle: 'italic', letterSpacing: 4}}>
					{legend.movie}
				</span>
			</div>

			{/* Darkness sweeps in */}
			<div style={{
				position: 'absolute', inset: 0,
				background: `radial-gradient(ellipse at 50% 40%, rgba(0,0,0,${sceneDarken * 0.6}) 0%, rgba(0,0,0,${sceneDarken}) 60%)`,
			}} />

			{/* Hallway environment */}
			<div style={{position: 'absolute', inset: 0, opacity: hallwayReveal}}>
				<HallwayBackground frame={frame} intensity={hallwayReveal} />

				{/* Perspective walls */}
				{/* Left wall */}
				<div style={{
					position: 'absolute', top: 0, bottom: 0, left: 0, width: '18%',
					background: 'linear-gradient(90deg, rgba(15,12,8,0.95), rgba(15,12,8,0.3))',
				}}>
					{/* Wall panels */}
					{[0,1,2].map(i => (
						<div key={i} style={{
							position: 'absolute',
							top: `${20 + i * 25}%`, left: '20%',
							width: '60%', height: '18%',
							border: '1px solid rgba(201,168,76,0.08)',
							borderRadius: 3,
							background: 'rgba(201,168,76,0.02)',
						}} />
					))}
				</div>
				{/* Right wall */}
				<div style={{
					position: 'absolute', top: 0, bottom: 0, right: 0, width: '18%',
					background: 'linear-gradient(270deg, rgba(15,12,8,0.95), rgba(15,12,8,0.3))',
				}}>
					{[0,1,2].map(i => (
						<div key={i} style={{
							position: 'absolute',
							top: `${20 + i * 25}%`, right: '20%',
							width: '60%', height: '18%',
							border: '1px solid rgba(201,168,76,0.08)',
							borderRadius: 3,
							background: 'rgba(201,168,76,0.02)',
						}} />
					))}
				</div>

				{/* Floor */}
				<div style={{
					position: 'absolute', bottom: 0, left: 0, right: 0, height: '22%',
					background: 'linear-gradient(180deg, transparent, rgba(5,4,2,0.9))',
				}} />
				{/* Floor reflection of candle light */}
				<div style={{
					position: 'absolute', bottom: 0, left: '30%', right: '30%', height: '15%',
					background: `radial-gradient(ellipse at 50% 0%, rgba(255,180,50,${0.06 * candlesAppear * glowPulse}) 0%, transparent 70%)`,
				}} />

				{/* Ceiling arch */}
				<div style={{
					position: 'absolute', top: 0, left: '15%', right: '15%', height: '12%',
					borderRadius: '0 0 50% 50%',
					background: 'linear-gradient(180deg, rgba(5,4,2,0.95), transparent)',
					border: 'none',
					borderBottom: '1px solid rgba(201,168,76,0.06)',
				}} />
			</div>

			{/* Warm spotlight on portrait area */}
			<div style={{
				position: 'absolute', inset: 0, opacity: portraitIlluminate,
				background: `radial-gradient(ellipse at 50% 35%, rgba(255,180,50,${0.08 * glowPulse}) 0%, rgba(255,150,30,${0.03 * glowPulse}) 30%, transparent 60%)`,
			}} />

			{/* Wall torches */}
			<div style={{position: 'absolute', top: '18%', left: '12%', opacity: torchOp, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
				<div style={{fontSize: 65, opacity: torch1, filter: `drop-shadow(0 0 25px rgba(255,150,30,${torch1 * 0.9})) drop-shadow(0 0 50px rgba(255,100,0,${torch1 * 0.4})) drop-shadow(0 -10px 40px rgba(255,180,50,${torch1 * 0.2}))`, transform: `scaleX(${0.9 + torch1 * 0.1})`}}>🔥</div>
				<div style={{width: 8, height: 50, background: 'linear-gradient(180deg, #5a4520, #3a2a10)', borderRadius: 4, marginTop: -5}} />
			</div>
			<div style={{position: 'absolute', top: '18%', right: '12%', opacity: torchOp, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
				<div style={{fontSize: 65, opacity: torch2, filter: `drop-shadow(0 0 25px rgba(255,150,30,${torch2 * 0.9})) drop-shadow(0 0 50px rgba(255,100,0,${torch2 * 0.4})) drop-shadow(0 -10px 40px rgba(255,180,50,${torch2 * 0.2}))`, transform: `scaleX(${0.9 + torch2 * 0.1})`}}>🔥</div>
				<div style={{width: 8, height: 50, background: 'linear-gradient(180deg, #5a4520, #3a2a10)', borderRadius: 4, marginTop: -5}} />
			</div>

			{/* === PORTRAIT IN GOLDEN FRAME === */}
			<div style={{
				position: 'absolute', top: '8%', left: '50%',
				transform: `translateX(-50%) scale(${portraitScale})`,
				opacity: portraitIlluminate,
			}}>
				{/* Outer ornate frame */}
				<div style={{
					padding: 16,
					background: 'linear-gradient(135deg, #c9a84c, #e8d5a3, #8b6914, #c9a84c, #e8d5a3, #8b6914)',
					borderRadius: 8,
					boxShadow: `
						0 0 ${frameGlow * 50}px rgba(255,180,50,${frameGlow * 0.35}),
						0 0 ${frameGlow * 100}px rgba(255,150,30,${frameGlow * 0.15}),
						0 0 ${frameGlow * 150}px rgba(255,120,0,${frameGlow * 0.05}),
						inset 0 0 15px rgba(0,0,0,0.4)
					`,
				}}>
					{/* Inner frame border */}
					<div style={{
						padding: 8,
						background: 'linear-gradient(135deg, #5a4510, #8b6914, #5a4510)',
						borderRadius: 5,
					}}>
						{/* Portrait */}
						<div style={{
							width: 400, height: 500,
							borderRadius: 3,
							overflow: 'hidden',
							position: 'relative',
						}}>
							<Img
								src={staticFile(legend.portrait)}
								style={{
									width: '100%', height: '100%', objectFit: 'cover',
									filter: `brightness(${interpolate(portraitIlluminate, [0, 1], [0.05, 0.85])}) saturate(${interpolate(portraitIlluminate, [0, 1], [0, 0.7])}) contrast(1.1)`,
								}}
							/>
							{/* Warm candlelight overlay */}
							<div style={{
								position: 'absolute', inset: 0,
								background: `linear-gradient(180deg, transparent 30%, rgba(255,180,50,${portraitIlluminate * 0.12 * glowPulse}) 100%)`,
							}} />
							{/* Vignette inside portrait */}
							<div style={{
								position: 'absolute', inset: 0,
								boxShadow: 'inset 0 0 60px rgba(0,0,0,0.6)',
							}} />
						</div>
					</div>
				</div>
				{/* Frame ornament top center */}
				<div style={{
					position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
					fontSize: 28, color: '#c9a84c', opacity: frameGlow * 0.8,
					filter: 'drop-shadow(0 0 10px rgba(201,168,76,0.5))',
				}}>✦</div>
				{/* Frame ornaments corners */}
				<div style={{position: 'absolute', top: 4, left: 4, fontSize: 18, color: '#c9a84c', opacity: frameGlow * 0.5}}>❧</div>
				<div style={{position: 'absolute', top: 4, right: 4, fontSize: 18, color: '#c9a84c', opacity: frameGlow * 0.5, transform: 'scaleX(-1)'}}>❧</div>
			</div>

			{/* === CANDLES BELOW PORTRAIT === */}
			<div style={{
				position: 'absolute', bottom: '28%', left: '50%',
				transform: 'translateX(-50%)',
				display: 'flex', gap: 80, alignItems: 'flex-end',
				opacity: candlesAppear,
			}}>
				<CandleWithGlow flicker={candleFlicker1} size={50} />
				<CandleWithGlow flicker={candleFlicker3} size={58} />
				<CandleWithGlow flicker={candleFlicker2} size={58} />
				<CandleWithGlow flicker={candleFlicker4} size={50} />
			</div>

			{/* === NAME PLAQUE === */}
			<div style={{
				position: 'absolute', bottom: '13%', left: '50%',
				transform: `translateX(-50%) scale(${nameScale})`,
				opacity: nameOp,
			}}>
				<div style={{
					background: 'linear-gradient(180deg, rgba(25,20,10,0.95), rgba(15,12,6,0.98))',
					border: '2px solid rgba(201,168,76,0.5)',
					borderRadius: 10,
					padding: '20px 70px',
					display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
					boxShadow: '0 4px 30px rgba(0,0,0,0.6), inset 0 1px 0 rgba(201,168,76,0.2)',
				}}>
					<div style={{
						fontSize: 56, fontWeight: 700,
						background: 'linear-gradient(180deg, #f0e4c8, #e8d5a3, #c9a84c)',
						WebkitBackgroundClip: 'text',
						WebkitTextFillColor: 'transparent',
						letterSpacing: 6,
						filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.8))',
					}}>
						{legend.name.toUpperCase()}
					</div>
					<div style={{width: lineWidth, height: 2, background: 'linear-gradient(90deg, transparent, #8b6914, #c9a84c, #8b6914, transparent)'}} />
					<div style={{
						fontSize: 34, color: '#999',
						letterSpacing: 10,
						opacity: dateOp,
					}}>
						{legend.born} — {legend.died}
					</div>
				</div>
			</div>

			{/* === QUOTE === */}
			<div style={{
				position: 'absolute', bottom: '3%', left: '50%',
				transform: `translateX(-50%) translateY(${quoteY}px)`,
				opacity: quoteOp,
				maxWidth: '72%',
			}}>
				<div style={{
					fontSize: 26, color: '#8b9dc3', fontStyle: 'italic',
					textAlign: 'center', lineHeight: 1.6,
					textShadow: '0 2px 15px rgba(0,0,0,0.9)',
				}}>
					{legend.quote}
				</div>
			</div>

			{/* === FLOATING EMBERS/PARTICLES === */}
			{frame > 140 && (
				<div style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
					{[...Array(20)].map((_, i) => {
						const startX = 15 + (i * 3.8);
						const speed = 0.25 + (i % 5) * 0.08;
						const y = 100 - ((frame - 140) * speed + i * 5.5) % 130;
						const x = startX + Math.sin((frame * 0.015) + i * 1.2) * 5;
						const particleOp = y > 3 && y < 97 ? (0.12 + 0.18 * Math.sin(frame * 0.05 + i * 0.8)) * Math.min(1, (frame - 140) / 40) : 0;
						const size = 2 + (i % 4);
						const isEmber = i % 4 === 0;
						return (
							<div key={i} style={{
								position: 'absolute',
								left: `${x}%`, top: `${y}%`,
								width: size, height: size, borderRadius: '50%',
								background: isEmber ? '#ffaa44' : i % 3 === 0 ? '#e8d5a3' : '#c9a84c',
								opacity: particleOp,
								boxShadow: isEmber
									? `0 0 ${size * 4}px rgba(255,170,68,${particleOp})`
									: `0 0 ${size * 2}px rgba(232,213,163,${particleOp * 0.5})`,
							}} />
						);
					})}
				</div>
			)}

			{/* Subtle fog at floor level */}
			<div style={{
				position: 'absolute', bottom: 0, left: 0, right: 0, height: '20%',
				opacity: hallwayReveal * 0.15,
				background: `linear-gradient(0deg, rgba(200,180,150,${0.08 + 0.04 * Math.sin(frame * 0.03)}) 0%, transparent 100%)`,
				filter: 'blur(20px)',
			}} />
		</AbsoluteFill>
	);
};

const CandleWithGlow: React.FC<{flicker: number; size: number}> = ({flicker, size}) => (
	<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
		<div style={{
			fontSize: size,
			opacity: flicker,
			filter: `
				drop-shadow(0 0 ${15 * flicker}px rgba(255,180,50,${flicker * 0.8}))
				drop-shadow(0 0 ${30 * flicker}px rgba(255,120,20,${flicker * 0.4}))
				drop-shadow(0 -${8 * flicker}px ${20 * flicker}px rgba(255,200,80,${flicker * 0.2}))
			`,
			transform: `scaleX(${0.92 + flicker * 0.08})`,
		}}>
			🕯️
		</div>
	</div>
);

const HallwayBackground: React.FC<{frame: number; intensity: number}> = ({frame, intensity}) => {
	const shift = frame * 0.01;
	return (
		<div style={{position: 'absolute', inset: 0}}>
			<div style={{
				position: 'absolute', inset: 0,
				background: 'linear-gradient(180deg, #030305 0%, #080610 30%, #060509 60%, #020204 100%)',
			}} />
			{/* Subtle wall texture */}
			<div style={{
				position: 'absolute', inset: 0, opacity: 0.03 * intensity,
				backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 300px, rgba(201,168,76,0.2) 300px, rgba(201,168,76,0.2) 302px)',
			}} />
			{/* Ambient warm light from above */}
			<div style={{
				position: 'absolute', inset: 0,
				background: `radial-gradient(ellipse at 50% 15%, rgba(255,180,50,${(0.03 + 0.01 * Math.sin(shift * 2)) * intensity}) 0%, transparent 45%)`,
			}} />
			{/* Subtle side glows */}
			<div style={{
				position: 'absolute', inset: 0,
				background: `radial-gradient(ellipse at 12% 30%, rgba(255,150,30,${0.02 * intensity}) 0%, transparent 25%)`,
			}} />
			<div style={{
				position: 'absolute', inset: 0,
				background: `radial-gradient(ellipse at 88% 30%, rgba(255,150,30,${0.02 * intensity}) 0%, transparent 25%)`,
			}} />
		</div>
	);
};
