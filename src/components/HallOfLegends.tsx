import React from 'react';
import {AbsoluteFill, Img, Sequence, useCurrentFrame, useVideoConfig, interpolate, spring, staticFile} from 'remotion';
import {LEGENDS, Legend} from './hallOfLegendsData';

const INTRO_FRAMES = 150;
const LEGEND_FRAMES = 600;
const OUTRO_FRAMES = 180;

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

// ============ INTRO ============
const Intro: React.FC<{fps: number}> = ({fps}) => {
	const frame = useCurrentFrame();

	// Dramatic slow zoom from black
	const zoomIn = interpolate(frame, [0, 150], [1.3, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const bgReveal = interpolate(frame, [5, 40], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	// White flash at start
	const flash = interpolate(frame, [3, 15], [0.6, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	// Dove flies in
	const doveX = interpolate(frame, [15, 60], [-200, 960], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const doveY = interpolate(frame, [15, 60], [600, 200], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const doveOp = interpolate(frame, [15, 25, 50, 60], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const doveScale = interpolate(frame, [15, 60], [0.5, 1.2], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	// Title dramatic entrance
	const titleOp = interpolate(frame, [50, 75], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const titleY = interpolate(frame, [50, 75], [60, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const titleGlow = 0.5 + 0.5 * Math.sin(frame * 0.06);

	// Subtitle typewriter
	const subText = 'Gone but never forgotten';
	const subChars = Math.floor(interpolate(frame, [80, 115], [0, subText.length], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));

	// Decorative lines expand
	const lineW = interpolate(frame, [70, 110], [0, 600], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	// Light rays from center
	const rayOp = interpolate(frame, [40, 80], [0, 0.12], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const rayRot = frame * 0.15;

	const fadeOut = interpolate(frame, [INTRO_FRAMES - 25, INTRO_FRAMES], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	return (
		<AbsoluteFill style={{opacity: fadeOut}}>
			{/* Deep background with zoom */}
			<div style={{position: 'absolute', inset: 0, transform: `scale(${zoomIn})`, opacity: bgReveal}}>
				<HallwayBackground frame={frame} intensity={1} />
			</div>

			{/* Rotating light rays */}
			<div style={{
				position: 'absolute', top: '40%', left: '50%',
				transform: `translate(-50%, -50%) rotate(${rayRot}deg)`,
				opacity: rayOp,
			}}>
				{[...Array(8)].map((_, i) => (
					<div key={i} style={{
						position: 'absolute', top: '50%', left: '50%',
						width: 4, height: 800,
						background: 'linear-gradient(180deg, transparent, rgba(232,213,163,0.4), transparent)',
						transform: `translate(-50%, -50%) rotate(${i * 22.5}deg)`,
					}} />
				))}
			</div>

			{/* Film grain */}
			<FilmGrain frame={frame} opacity={0.04} />

			{/* White flash */}
			<div style={{position: 'absolute', inset: 0, background: '#fff', opacity: flash}} />

			{/* Dove flying across */}
			<div style={{
				position: 'absolute',
				left: doveX, top: doveY,
				fontSize: 80, opacity: doveOp,
				transform: `scale(${doveScale}) rotate(-10deg)`,
				filter: 'drop-shadow(0 0 30px rgba(255,255,255,0.5))',
			}}>🕊️</div>

			{/* Floating particles from start */}
			<FloatingParticles frame={frame} count={25} startFrame={20} color="gold" />

			{/* Title */}
			<div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12}}>
				<div style={{
					fontSize: 110, fontWeight: 700, textAlign: 'center',
					opacity: titleOp,
					transform: `translateY(${titleY}px)`,
					lineHeight: 1.05,
					background: 'linear-gradient(180deg, #fff, #f0e4c8, #c9a84c, #8b6914)',
					WebkitBackgroundClip: 'text',
					WebkitTextFillColor: 'transparent',
					filter: `drop-shadow(0 4px 20px rgba(0,0,0,0.9)) drop-shadow(0 0 ${30 + titleGlow * 20}px rgba(201,168,76,${0.15 + titleGlow * 0.15}))`,
					letterSpacing: 10,
				}}>
					HALL OF<br/>LEGENDS
				</div>

				{/* Ornamental lines */}
				<div style={{display: 'flex', alignItems: 'center', gap: 15, opacity: titleOp}}>
					<div style={{width: lineW / 2, height: 2, background: 'linear-gradient(90deg, transparent, #c9a84c)', borderRadius: 1}} />
					<div style={{fontSize: 24, color: '#c9a84c', filter: 'drop-shadow(0 0 8px rgba(201,168,76,0.6))'}}>✦</div>
					<div style={{width: lineW / 2, height: 2, background: 'linear-gradient(270deg, transparent, #c9a84c)', borderRadius: 1}} />
				</div>

				{/* Typewriter subtitle */}
				<div style={{
					fontSize: 38, color: '#8b9dc3', fontStyle: 'italic',
					letterSpacing: 4, height: 50,
					textShadow: '0 2px 20px rgba(0,0,0,0.8)',
				}}>
					{subText.slice(0, subChars)}
					<span style={{opacity: frame % 20 > 10 ? 1 : 0, color: '#c9a84c'}}>|</span>
				</div>
			</div>

			{/* Vignette */}
			<Vignette intensity={0.8} />
		</AbsoluteFill>
	);
};

// ============ LEGEND SEGMENT ============
const LegendSegment: React.FC<{legend: Legend; fps: number; index: number}> = ({legend, fps, index}) => {
	const frame = useCurrentFrame();

	// ======= PHASE 1: MOVIE SCENE DRAMATIC ENTRANCE (0-150) =======
	// Starts zoomed in, slowly pulls back — Ken Burns
	const sceneZoom = interpolate(frame, [0, 500], [1.25, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const scenePanX = interpolate(frame, [0, 500], [-3, 3], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const scenePanY = interpolate(frame, [0, 500], [-2, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const sceneIn = interpolate(frame, [0, 50], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	// Movie title with dramatic bar
	const movieBarW = interpolate(frame, [40, 80], [0, 100], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const movieTitleOp = interpolate(frame, [55, 80], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const movieBarFade = interpolate(frame, [200, 240], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	// ======= PHASE 2: DRAMATIC FLASH + DARKEN (140-220) =======
	const whiteFlash = interpolate(frame, [140, 145, 155, 165], [0, 0.7, 0.7, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const sceneDarken = interpolate(frame, [150, 240], [0, 0.92], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	// ======= PHASE 3: PORTRAIT REVEAL (180-280) =======
	// Portrait zooms from far away, slows to stop
	const portraitProgress = interpolate(frame, [180, 270], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const portraitScale = interpolate(portraitProgress, [0, 0.3, 1], [0.2, 0.6, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const portraitOp = interpolate(frame, [180, 210], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const frameGlow = interpolate(frame, [220, 300], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const portraitBright = interpolate(frame, [180, 280], [0.05, 0.9], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	// Portrait slight float animation
	const portraitFloat = Math.sin(frame * 0.02) * 3;

	// ======= PHASE 4: CANDLES IGNITE ONE BY ONE (250-330) =======
	const candle1 = interpolate(frame, [250, 265], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const candle2 = interpolate(frame, [265, 280], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const candle3 = interpolate(frame, [280, 295], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const candle4 = interpolate(frame, [295, 310], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const candle5 = interpolate(frame, [310, 325], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const candleFlickers = [0,1,2,3,4].map(i => 0.5 + 0.5 * Math.sin(frame * (0.11 + i * 0.02) + i * 1.7));
	const candleApps = [candle1, candle2, candle3, candle4, candle5];

	// ======= PHASE 5: NAME - LETTER BY LETTER (300-380) =======
	const nameText = legend.name.toUpperCase();
	const nameChars = Math.floor(interpolate(frame, [300, 340], [0, nameText.length], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
	const nameOp = interpolate(frame, [300, 315], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const nameFlash = interpolate(frame, [300, 305, 310, 315], [0, 0.3, 0, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	// Dates with counting effect
	const dateOp = interpolate(frame, [345, 370], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const lineW = interpolate(frame, [340, 390], [0, 300], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	// Cross/memorial symbol
	const crossOp = interpolate(frame, [360, 385], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const crossScale = spring({frame: Math.max(0, frame - 360), fps, from: 0.3, to: 1, durationInFrames: 20});

	// ======= PHASE 6: QUOTE TYPES IN (400-480) =======
	const quoteChars = Math.floor(interpolate(frame, [400, 480], [0, legend.quote.length], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
	const quoteOp = interpolate(frame, [400, 415], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	// ======= PHASE 7: ROSE PETALS FALL (350+) =======
	const petalsActive = frame > 350;

	// ======= TORCHES + ATMOSPHERE (200+) =======
	const torchOp = interpolate(frame, [200, 260], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const torch1 = 0.5 + 0.5 * Math.sin(frame * 0.12 + 1);
	const torch2 = 0.5 + 0.5 * Math.sin(frame * 0.14 + 3);

	// God rays from portrait
	const godRayOp = interpolate(frame, [250, 320], [0, 0.08], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const godRayRot = frame * 0.08;

	// Heartbeat pulse on portrait
	const heartbeat = frame > 200 && frame < 400 ? 1 + 0.015 * Math.sin(frame * 0.2) * Math.sin(frame * 0.2) : 1;

	// Fade out with zoom
	const fadeOut = interpolate(frame, [LEGEND_FRAMES - 40, LEGEND_FRAMES], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const endZoom = interpolate(frame, [LEGEND_FRAMES - 40, LEGEND_FRAMES], [1, 1.1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	// Warm color shift over time
	const warmth = interpolate(frame, [150, 350], [0, 0.06], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	return (
		<AbsoluteFill style={{opacity: fadeOut, transform: `scale(${endZoom})`}}>

			{/* ===== MOVIE SCENE BACKGROUND ===== */}
			<div style={{
				position: 'absolute', inset: -20,
				opacity: sceneIn,
				transform: `scale(${sceneZoom}) translate(${scenePanX}%, ${scenePanY}%)`,
			}}>
				<Img src={staticFile(legend.movieScene)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
			</div>

			{/* Cinematic letterbox */}
			<div style={{position: 'absolute', top: 0, left: 0, right: 0, height: 80, background: 'linear-gradient(180deg, rgba(0,0,0,0.95), transparent)'}} />
			<div style={{position: 'absolute', bottom: 0, left: 0, right: 0, height: 80, background: 'linear-gradient(0deg, rgba(0,0,0,0.95), transparent)'}} />

			{/* Movie title bar */}
			<div style={{
				position: 'absolute', top: 50, left: '50%',
				transform: 'translateX(-50%)',
				opacity: movieTitleOp * movieBarFade,
				display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
			}}>
				<div style={{width: `${movieBarW}%`, maxWidth: 700, height: 2, background: 'linear-gradient(90deg, transparent, #c9a84c, transparent)'}} />
				<div style={{
					background: 'rgba(0,0,0,0.75)',
					padding: '14px 60px', borderRadius: 4,
					backdropFilter: 'blur(10px)',
					border: '1px solid rgba(201,168,76,0.3)',
				}}>
					<span style={{fontSize: 38, fontWeight: 400, color: '#e8d5a3', fontStyle: 'italic', letterSpacing: 5}}>
						{legend.movie}
					</span>
				</div>
				<div style={{width: `${movieBarW}%`, maxWidth: 700, height: 2, background: 'linear-gradient(90deg, transparent, #c9a84c, transparent)'}} />
			</div>

			{/* ===== DARKNESS SWEEPS IN ===== */}
			<div style={{
				position: 'absolute', inset: 0,
				background: `radial-gradient(ellipse at 50% 35%, rgba(0,0,0,${sceneDarken * 0.5}) 0%, rgba(0,0,0,${sceneDarken}) 55%)`,
			}} />

			{/* White flash transition */}
			<div style={{position: 'absolute', inset: 0, background: '#fff', opacity: whiteFlash}} />

			{/* ===== HALLWAY ENVIRONMENT ===== */}
			<div style={{position: 'absolute', inset: 0, opacity: interpolate(frame, [160, 220], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}}>
				<HallwayBackground frame={frame} intensity={1} />

				{/* Wall panels left */}
				<div style={{position: 'absolute', top: 0, bottom: 0, left: 0, width: '20%', background: 'linear-gradient(90deg, rgba(10,8,4,0.95), transparent)'}}>
					{[0,1,2,3].map(i => (
						<div key={i} style={{
							position: 'absolute', top: `${15 + i * 20}%`, left: '15%',
							width: '70%', height: '14%',
							border: '1px solid rgba(201,168,76,0.06)',
							borderRadius: 3,
							background: 'linear-gradient(135deg, rgba(201,168,76,0.02), transparent)',
						}} />
					))}
				</div>
				{/* Wall panels right */}
				<div style={{position: 'absolute', top: 0, bottom: 0, right: 0, width: '20%', background: 'linear-gradient(270deg, rgba(10,8,4,0.95), transparent)'}}>
					{[0,1,2,3].map(i => (
						<div key={i} style={{
							position: 'absolute', top: `${15 + i * 20}%`, right: '15%',
							width: '70%', height: '14%',
							border: '1px solid rgba(201,168,76,0.06)',
							borderRadius: 3,
							background: 'linear-gradient(225deg, rgba(201,168,76,0.02), transparent)',
						}} />
					))}
				</div>

				{/* Floor with reflection */}
				<div style={{position: 'absolute', bottom: 0, left: 0, right: 0, height: '20%', background: 'linear-gradient(180deg, transparent, rgba(3,2,1,0.95))'}} />
				<div style={{
					position: 'absolute', bottom: 0, left: '25%', right: '25%', height: '18%',
					background: `radial-gradient(ellipse at 50% 0%, rgba(255,180,50,${0.04 * (0.7 + 0.3 * Math.sin(frame * 0.08))}) 0%, transparent 70%)`,
				}} />

				{/* Ceiling arch */}
				<div style={{position: 'absolute', top: 0, left: '12%', right: '12%', height: '10%', borderRadius: '0 0 50% 50%', background: 'linear-gradient(180deg, rgba(3,2,1,0.98), transparent)', borderBottom: '1px solid rgba(201,168,76,0.04)'}} />
			</div>

			{/* ===== WALL TORCHES ===== */}
			<div style={{position: 'absolute', top: '15%', left: '6%', opacity: torchOp}}>
				<Torch flicker={torch1} />
			</div>
			<div style={{position: 'absolute', top: '15%', right: '6%', opacity: torchOp}}>
				<Torch flicker={torch2} />
			</div>

			{/* ===== GOD RAYS FROM PORTRAIT ===== */}
			<div style={{
				position: 'absolute', top: '30%', left: '50%',
				transform: `translate(-50%, -50%) rotate(${godRayRot}deg)`,
				opacity: godRayOp,
				pointerEvents: 'none',
			}}>
				{[...Array(12)].map((_, i) => (
					<div key={i} style={{
						position: 'absolute', top: '50%', left: '50%',
						width: 3, height: 900,
						background: 'linear-gradient(180deg, transparent 20%, rgba(232,213,163,0.3) 50%, transparent 80%)',
						transform: `translate(-50%, -50%) rotate(${i * 15}deg)`,
					}} />
				))}
			</div>

			{/* ===== PORTRAIT IN ORNATE FRAME ===== */}
			<div style={{
				position: 'absolute', top: '6%', left: '50%',
				transform: `translateX(-50%) scale(${portraitScale * heartbeat}) translateY(${portraitFloat}px)`,
				opacity: portraitOp,
			}}>
				{/* Outer glow ring */}
				<div style={{
					position: 'absolute', inset: -30,
					borderRadius: 12,
					boxShadow: `
						0 0 ${frameGlow * 60}px rgba(255,180,50,${frameGlow * 0.25}),
						0 0 ${frameGlow * 120}px rgba(255,150,30,${frameGlow * 0.1}),
						0 0 ${frameGlow * 200}px rgba(255,120,0,${frameGlow * 0.04})
					`,
				}} />

				{/* Triple-layered ornate frame */}
				<div style={{
					padding: 18,
					background: 'linear-gradient(135deg, #d4b85a, #f0e4c8, #a8892a, #d4b85a, #f0e4c8, #8b6914)',
					borderRadius: 8,
					boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)',
				}}>
					<div style={{
						padding: 6,
						background: 'linear-gradient(135deg, #3a2a10, #5a4520, #3a2a10)',
						borderRadius: 5,
					}}>
						<div style={{
							padding: 10,
							background: 'linear-gradient(135deg, #c9a84c, #e8d5a3, #8b6914, #c9a84c)',
							borderRadius: 4,
						}}>
							<div style={{
								width: 420, height: 520,
								borderRadius: 3,
								overflow: 'hidden',
								position: 'relative',
								boxShadow: 'inset 0 0 40px rgba(0,0,0,0.4)',
							}}>
								<Img
									src={staticFile(legend.portrait)}
									style={{
										width: '100%', height: '100%', objectFit: 'cover',
										filter: `brightness(${portraitBright}) saturate(${interpolate(portraitBright, [0.05, 0.9], [0, 0.75])}) contrast(1.1) sepia(${warmth})`,
									}}
								/>
								{/* Candlelight warm overlay */}
								<div style={{
									position: 'absolute', inset: 0,
									background: `linear-gradient(180deg, transparent 20%, rgba(255,180,50,${frameGlow * 0.1}) 80%, rgba(255,150,30,${frameGlow * 0.15}) 100%)`,
								}} />
								{/* Inner vignette */}
								<div style={{position: 'absolute', inset: 0, boxShadow: `inset 0 0 80px rgba(0,0,0,${0.3 + (1 - portraitBright) * 0.5})`}} />
							</div>
						</div>
					</div>
				</div>

				{/* Frame ornaments */}
				<div style={{position: 'absolute', top: -16, left: '50%', transform: 'translateX(-50%)', fontSize: 30, color: '#d4b85a', opacity: frameGlow * 0.9, filter: 'drop-shadow(0 0 10px rgba(201,168,76,0.6))'}}>✦</div>
				<div style={{position: 'absolute', bottom: -16, left: '50%', transform: 'translateX(-50%) rotate(180deg)', fontSize: 30, color: '#d4b85a', opacity: frameGlow * 0.9, filter: 'drop-shadow(0 0 10px rgba(201,168,76,0.6))'}}>✦</div>
				<div style={{position: 'absolute', top: 6, left: 6, fontSize: 20, color: '#c9a84c', opacity: frameGlow * 0.5}}>❧</div>
				<div style={{position: 'absolute', top: 6, right: 6, fontSize: 20, color: '#c9a84c', opacity: frameGlow * 0.5, transform: 'scaleX(-1)'}}>❧</div>
				<div style={{position: 'absolute', bottom: 6, left: 6, fontSize: 20, color: '#c9a84c', opacity: frameGlow * 0.5, transform: 'scaleY(-1)'}}>❧</div>
				<div style={{position: 'absolute', bottom: 6, right: 6, fontSize: 20, color: '#c9a84c', opacity: frameGlow * 0.5, transform: 'scale(-1)'}}>❧</div>
			</div>

			{/* ===== CANDLES - IGNITE ONE BY ONE ===== */}
			<div style={{
				position: 'absolute', bottom: '27%', left: '50%',
				transform: 'translateX(-50%)',
				display: 'flex', gap: 55,
			}}>
				{[0,1,2,3,4].map(i => (
					<div key={i} style={{opacity: candleApps[i]}}>
						<CandleWithGlow flicker={candleFlickers[i]} size={i === 2 ? 60 : 48} />
					</div>
				))}
			</div>

			{/* ===== NAME PLAQUE ===== */}
			<div style={{
				position: 'absolute', bottom: '14%', left: '50%',
				transform: 'translateX(-50%)',
				opacity: nameOp,
			}}>
				{/* Flash on name appear */}
				<div style={{position: 'absolute', inset: -50, background: `radial-gradient(circle, rgba(255,255,255,${nameFlash}) 0%, transparent 70%)`, pointerEvents: 'none'}} />

				<div style={{
					background: 'linear-gradient(180deg, rgba(20,16,8,0.97), rgba(10,8,4,0.98))',
					border: '2px solid rgba(201,168,76,0.5)',
					borderRadius: 10,
					padding: '22px 80px',
					display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
					boxShadow: '0 6px 40px rgba(0,0,0,0.7), inset 0 1px 0 rgba(201,168,76,0.25), inset 0 -1px 0 rgba(201,168,76,0.1)',
				}}>
					{/* Cross symbol */}
					<div style={{opacity: crossOp, transform: `scale(${crossScale})`, fontSize: 28, marginBottom: -5}}>
						<span style={{color: '#c9a84c', filter: 'drop-shadow(0 0 8px rgba(201,168,76,0.4))'}}>✝</span>
					</div>

					{/* Name - letter by letter */}
					<div style={{
						fontSize: 58, fontWeight: 700, letterSpacing: 7, height: 70,
						display: 'flex', alignItems: 'center',
					}}>
						{nameText.split('').map((char, ci) => (
							<span key={ci} style={{
								opacity: ci < nameChars ? 1 : 0,
								background: 'linear-gradient(180deg, #fff, #f0e4c8, #c9a84c)',
								WebkitBackgroundClip: 'text',
								WebkitTextFillColor: 'transparent',
								filter: ci === nameChars - 1 ? 'drop-shadow(0 0 15px rgba(201,168,76,0.8))' : 'drop-shadow(0 2px 8px rgba(0,0,0,0.8))',
								display: 'inline-block',
								transform: ci < nameChars ? 'translateY(0)' : 'translateY(10px)',
							}}>
								{char === ' ' ? ' ' : char}
							</span>
						))}
					</div>

					{/* Decorative line */}
					<div style={{width: lineW, height: 2, background: 'linear-gradient(90deg, transparent, #8b6914, #c9a84c, #e8d5a3, #c9a84c, #8b6914, transparent)'}} />

					{/* Dates */}
					<div style={{
						fontSize: 36, color: '#aaa', letterSpacing: 10, opacity: dateOp,
						textShadow: '0 2px 10px rgba(0,0,0,0.5)',
					}}>
						{legend.born} — {legend.died}
					</div>
				</div>
			</div>

			{/* ===== QUOTE - TYPEWRITER ===== */}
			<div style={{
				position: 'absolute', bottom: '3%', left: '50%',
				transform: 'translateX(-50%)',
				opacity: quoteOp,
				maxWidth: '75%',
			}}>
				<div style={{
					fontSize: 26, color: '#8b9dc3', fontStyle: 'italic',
					textAlign: 'center', lineHeight: 1.7,
					textShadow: '0 2px 15px rgba(0,0,0,0.9)',
				}}>
					{legend.quote.slice(0, quoteChars)}
					{quoteChars < legend.quote.length && (
						<span style={{opacity: frame % 16 > 8 ? 1 : 0, color: '#c9a84c'}}>|</span>
					)}
				</div>
			</div>

			{/* ===== ROSE PETALS FALLING ===== */}
			{petalsActive && (
				<div style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
					{[...Array(10)].map((_, i) => {
						const startX = 10 + i * 8.5;
						const fallSpeed = 0.3 + (i % 4) * 0.1;
						const y = ((frame - 350) * fallSpeed + i * 12) % 120 - 10;
						const x = startX + Math.sin((frame * 0.02) + i * 2) * 6;
						const rot = frame * (1 + i * 0.3) + i * 40;
						const petalOp = y > -5 && y < 105 ? 0.25 + 0.15 * Math.sin(frame * 0.04 + i) : 0;
						return (
							<div key={i} style={{
								position: 'absolute',
								left: `${x}%`, top: `${y}%`,
								fontSize: 18 + (i % 3) * 4,
								transform: `rotate(${rot}deg)`,
								opacity: petalOp,
								filter: `drop-shadow(0 0 5px rgba(200,50,50,${petalOp * 0.3}))`,
							}}>🌹</div>
						);
					})}
				</div>
			)}

			{/* ===== FLOATING EMBERS ===== */}
			<FloatingParticles frame={frame} count={22} startFrame={180} color="warm" />

			{/* Film grain overlay */}
			<FilmGrain frame={frame} opacity={0.03} />

			{/* Warm color overlay */}
			<div style={{position: 'absolute', inset: 0, background: `rgba(255,200,100,${warmth})`, mixBlendMode: 'overlay', pointerEvents: 'none'}} />

			{/* Vignette */}
			<Vignette intensity={0.7} />

			{/* Floor fog */}
			<div style={{
				position: 'absolute', bottom: 0, left: 0, right: 0, height: '15%',
				opacity: interpolate(frame, [200, 280], [0, 0.2], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
				background: `linear-gradient(0deg, rgba(180,160,130,${0.1 + 0.05 * Math.sin(frame * 0.025)}) 0%, transparent 100%)`,
				filter: 'blur(15px)',
			}} />
		</AbsoluteFill>
	);
};

// ============ OUTRO ============
const Outro: React.FC<{fps: number}> = ({fps}) => {
	const frame = useCurrentFrame();
	const scale = spring({frame, fps, from: 0.4, to: 1, durationInFrames: 25});
	const subOp = interpolate(frame, [35, 60], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const doveFloat = Math.sin(frame * 0.04) * 8;
	const lineW = interpolate(frame, [25, 70], [0, 500], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	return (
		<AbsoluteFill>
			<HallwayBackground frame={frame} intensity={1} />

			{/* God rays */}
			<div style={{position: 'absolute', top: '30%', left: '50%', transform: `translate(-50%, -50%) rotate(${frame * 0.1}deg)`, opacity: 0.06}}>
				{[...Array(8)].map((_, i) => (
					<div key={i} style={{position: 'absolute', top: '50%', left: '50%', width: 3, height: 700, background: 'linear-gradient(180deg, transparent, rgba(232,213,163,0.3), transparent)', transform: `translate(-50%, -50%) rotate(${i * 22.5}deg)`}} />
				))}
			</div>

			<div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18}}>
				<div style={{
					fontSize: 90, transform: `scale(${scale}) translateY(${doveFloat}px)`,
					filter: 'drop-shadow(0 0 40px rgba(255,255,255,0.3)) drop-shadow(0 0 80px rgba(255,200,100,0.15))',
				}}>🕊️</div>
				<div style={{
					fontSize: 78, fontWeight: 700, textAlign: 'center',
					transform: `scale(${scale})`, lineHeight: 1.15,
					background: 'linear-gradient(180deg, #fff, #f0e4c8, #c9a84c)',
					WebkitBackgroundClip: 'text',
					WebkitTextFillColor: 'transparent',
					filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.9))',
					letterSpacing: 5,
				}}>
					FOREVER<br/>IN OUR HEARTS
				</div>
				<div style={{display: 'flex', alignItems: 'center', gap: 15, opacity: subOp}}>
					<div style={{width: lineW / 2, height: 2, background: 'linear-gradient(90deg, transparent, #c9a84c)'}} />
					<span style={{fontSize: 20, color: '#c9a84c'}}>✦</span>
					<div style={{width: lineW / 2, height: 2, background: 'linear-gradient(270deg, transparent, #c9a84c)'}} />
				</div>
				<div style={{fontSize: 38, color: '#8b9dc3', fontWeight: 400, opacity: subOp, fontStyle: 'italic', letterSpacing: 3}}>
					Like & Subscribe 🕊️
				</div>
			</div>

			{/* Floor candles */}
			<div style={{position: 'absolute', bottom: '8%', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 80}}>
				{[0,1,2,3,4,5,6].map(i => {
					const f = 0.4 + 0.6 * Math.sin(frame * (0.09 + i * 0.025) + i * 1.5);
					return <CandleWithGlow key={i} flicker={f} size={45} />;
				})}
			</div>

			<FloatingParticles frame={frame} count={20} startFrame={0} color="gold" />
			<FilmGrain frame={frame} opacity={0.03} />
			<Vignette intensity={0.6} />
		</AbsoluteFill>
	);
};

// ============ SHARED COMPONENTS ============

const Torch: React.FC<{flicker: number}> = ({flicker}) => (
	<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
		<div style={{
			fontSize: 70, opacity: flicker,
			filter: `
				drop-shadow(0 0 30px rgba(255,150,30,${flicker * 0.9}))
				drop-shadow(0 0 60px rgba(255,100,0,${flicker * 0.5}))
				drop-shadow(0 -15px 50px rgba(255,180,50,${flicker * 0.25}))
			`,
			transform: `scaleX(${0.88 + flicker * 0.12})`,
		}}>🔥</div>
		<div style={{width: 10, height: 60, background: 'linear-gradient(180deg, #5a4520, #2a1a08)', borderRadius: 5, marginTop: -8}} />
		{/* Torch bracket */}
		<div style={{width: 30, height: 6, background: 'linear-gradient(180deg, #5a4520, #3a2a10)', borderRadius: 3, marginTop: -2}} />
	</div>
);

const CandleWithGlow: React.FC<{flicker: number; size: number}> = ({flicker, size}) => (
	<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
		<div style={{
			fontSize: size, opacity: flicker,
			filter: `
				drop-shadow(0 0 ${18 * flicker}px rgba(255,180,50,${flicker * 0.85}))
				drop-shadow(0 0 ${35 * flicker}px rgba(255,120,20,${flicker * 0.45}))
				drop-shadow(0 -${10 * flicker}px ${25 * flicker}px rgba(255,200,80,${flicker * 0.25}))
			`,
			transform: `scaleX(${0.9 + flicker * 0.1})`,
		}}>🕯️</div>
	</div>
);

const FloatingParticles: React.FC<{frame: number; count: number; startFrame: number; color: 'gold' | 'warm'}> = ({frame, count, startFrame, color}) => {
	if (frame < startFrame) return null;
	const elapsed = frame - startFrame;
	return (
		<div style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
			{[...Array(count)].map((_, i) => {
				const startX = 8 + (i * (84 / count));
				const speed = 0.2 + (i % 5) * 0.08;
				const y = 100 - (elapsed * speed + i * (100 / count)) % 130;
				const x = startX + Math.sin((frame * 0.015) + i * 1.3) * 5;
				const op = y > 2 && y < 98 ? (0.1 + 0.2 * Math.sin(frame * 0.05 + i * 0.9)) * Math.min(1, elapsed / 30) : 0;
				const size = 2 + (i % 4);
				const isEmber = i % 5 === 0;
				const c = color === 'gold'
					? (isEmber ? '#fff' : i % 3 === 0 ? '#e8d5a3' : '#c9a84c')
					: (isEmber ? '#ffaa44' : i % 3 === 0 ? '#e8d5a3' : '#c9a84c');
				return (
					<div key={i} style={{
						position: 'absolute', left: `${x}%`, top: `${y}%`,
						width: size, height: size, borderRadius: '50%',
						background: c, opacity: op,
						boxShadow: `0 0 ${size * 3}px ${c}${Math.round(op * 80).toString(16).padStart(2, '0')}`,
					}} />
				);
			})}
		</div>
	);
};

const FilmGrain: React.FC<{frame: number; opacity: number}> = ({frame, opacity}) => (
	<div style={{
		position: 'absolute', inset: 0, pointerEvents: 'none', opacity,
		backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' seed='${frame % 60}' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
		mixBlendMode: 'overlay',
	}} />
);

const Vignette: React.FC<{intensity: number}> = ({intensity}) => (
	<div style={{
		position: 'absolute', inset: 0, pointerEvents: 'none',
		background: `radial-gradient(ellipse at 50% 50%, transparent 30%, rgba(0,0,0,${intensity}) 100%)`,
	}} />
);

const HallwayBackground: React.FC<{frame: number; intensity: number}> = ({frame, intensity}) => {
	const shift = frame * 0.01;
	return (
		<div style={{position: 'absolute', inset: 0}}>
			<div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #030305 0%, #080610 30%, #060509 60%, #020204 100%)'}} />
			<div style={{position: 'absolute', inset: 0, opacity: 0.03 * intensity, backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 300px, rgba(201,168,76,0.2) 300px, rgba(201,168,76,0.2) 302px)'}} />
			<div style={{position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 50% 15%, rgba(255,180,50,${(0.025 + 0.01 * Math.sin(shift * 2)) * intensity}) 0%, transparent 45%)`}} />
			<div style={{position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 10% 30%, rgba(255,150,30,${0.015 * intensity}) 0%, transparent 20%)`}} />
			<div style={{position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 90% 30%, rgba(255,150,30,${0.015 * intensity}) 0%, transparent 20%)`}} />
		</div>
	);
};
