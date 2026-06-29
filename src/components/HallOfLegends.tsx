import React from 'react';
import {AbsoluteFill, Img, Sequence, useCurrentFrame, useVideoConfig, interpolate, spring, staticFile} from 'remotion';
import {LEGENDS, Legend} from './hallOfLegendsData';

const INTRO_FRAMES = 120;
const LEGEND_FRAMES = 540;
const OUTRO_FRAMES = 120;

export const HallOfLegends: React.FC = () => {
	const {fps} = useVideoConfig();
	const total = LEGENDS.length;
	const outroStart = INTRO_FRAMES + total * LEGEND_FRAMES;

	return (
		<AbsoluteFill style={{backgroundColor: '#0a0a0a', fontFamily: "'Arial Black', 'Helvetica Neue', sans-serif", overflow: 'hidden'}}>
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

// ============ INTRO — MAGNATES STYLE HOOK ============
const Intro: React.FC<{fps: number}> = ({fps}) => {
	const frame = useCurrentFrame();

	// Glitch flash
	const flash1 = interpolate(frame, [0, 3, 5], [1, 0, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const flash2 = interpolate(frame, [8, 10, 12], [0, 0.5, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	// "THEY CHANGED" slams in
	const t1Scale = spring({frame: Math.max(0, frame - 5), fps, from: 3, to: 1, durationInFrames: 8});
	const t1Op = interpolate(frame, [5, 8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	// "THE WORLD" slams in
	const t2Scale = spring({frame: Math.max(0, frame - 18), fps, from: 3, to: 1, durationInFrames: 8});
	const t2Op = interpolate(frame, [18, 21], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	// Both disappear
	const t12Out = interpolate(frame, [38, 42], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	// "AND THEN" small
	const t3Op = interpolate(frame, [45, 50, 55, 58], [0, 0.6, 0.6, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	// "THE WORLD LOST THEM" slams huge
	const t4Scale = spring({frame: Math.max(0, frame - 60), fps, from: 4, to: 1, durationInFrames: 10});
	const t4Op = interpolate(frame, [60, 63], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const t4Shake = frame >= 60 && frame <= 68 ? Math.sin(frame * 3) * (68 - frame) * 0.8 : 0;

	// Red line wipe
	const redLine = interpolate(frame, [58, 62], [0, 100], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	// "HALL OF LEGENDS" final title
	const finalOp = interpolate(frame, [85, 90], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const finalScale = spring({frame: Math.max(0, frame - 85), fps, from: 0.5, to: 1, durationInFrames: 12});
	const finalGlow = 0.5 + 0.5 * Math.sin(frame * 0.08);

	const fadeOut = interpolate(frame, [INTRO_FRAMES - 10, INTRO_FRAMES], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	return (
		<AbsoluteFill style={{opacity: fadeOut, background: '#0a0a0a'}}>
			{/* Flashes */}
			<div style={{position: 'absolute', inset: 0, background: '#fff', opacity: flash1}} />
			<div style={{position: 'absolute', inset: 0, background: '#fff', opacity: flash2}} />

			{/* Noise/grain bg */}
			<NoiseBackground frame={frame} />

			{/* Animated lines */}
			<div style={{position: 'absolute', top: '48%', left: 0, width: `${redLine}%`, height: 4, background: '#e63946'}} />

			{/* "THEY CHANGED" */}
			<div style={{
				position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
				opacity: t1Op * t12Out,
				transform: `scale(${t1Scale})`,
			}}>
				<span style={{fontSize: 130, fontWeight: 900, color: '#fff', letterSpacing: -3, textShadow: '4px 4px 0 #e63946'}}>
					THEY CHANGED
				</span>
			</div>

			{/* "THE WORLD" */}
			<div style={{
				position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
				opacity: t2Op * t12Out,
				transform: `scale(${t2Scale}) translateY(85px)`,
			}}>
				<span style={{fontSize: 140, fontWeight: 900, color: '#e63946', letterSpacing: -3}}>
					THE WORLD
				</span>
			</div>

			{/* "and then..." */}
			<div style={{
				position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
				opacity: t3Op,
			}}>
				<span style={{fontSize: 50, fontWeight: 400, color: '#666', fontStyle: 'italic', letterSpacing: 5}}>
					and then...
				</span>
			</div>

			{/* "THE WORLD LOST THEM" */}
			<div style={{
				position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
				opacity: t4Op, transform: `scale(${t4Scale}) translateX(${t4Shake}px)`,
			}}>
				<div style={{textAlign: 'center'}}>
					<div style={{fontSize: 60, fontWeight: 400, color: '#888', letterSpacing: 10, marginBottom: 10}}>THE WORLD</div>
					<div style={{fontSize: 150, fontWeight: 900, color: '#fff', letterSpacing: -4, lineHeight: 0.9, textShadow: '0 0 30px rgba(230,57,70,0.5)'}}>
						LOST THEM
					</div>
				</div>
			</div>

			{/* "HALL OF LEGENDS" */}
			<div style={{
				position: 'absolute', bottom: '12%', left: '50%',
				transform: `translateX(-50%) scale(${finalScale})`,
				opacity: finalOp,
			}}>
				<div style={{display: 'flex', alignItems: 'center', gap: 20}}>
					<div style={{width: 60, height: 2, background: '#c9a84c'}} />
					<span style={{
						fontSize: 42, fontWeight: 900, letterSpacing: 12,
						background: 'linear-gradient(90deg, #c9a84c, #e8d5a3, #c9a84c)',
						WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
						filter: `drop-shadow(0 0 ${10 + finalGlow * 10}px rgba(201,168,76,0.3))`,
					}}>HALL OF LEGENDS</span>
					<div style={{width: 60, height: 2, background: '#c9a84c'}} />
				</div>
			</div>
		</AbsoluteFill>
	);
};

// ============ LEGEND SEGMENT — DOCUMENTARY STYLE ============
const LegendSegment: React.FC<{legend: Legend; fps: number; index: number}> = ({legend, fps, index}) => {
	const frame = useCurrentFrame();

	// ====== ACT 1: MOVIE SCENE — DRAMATIC ZOOM IN (0-130) ======
	const sceneZoom = interpolate(frame, [0, 130], [1, 1.4], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const sceneOp = interpolate(frame, [0, 15], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	// Movie title SLAMS in at top
	const movieSlam = spring({frame: Math.max(0, frame - 20), fps, from: 5, to: 1, durationInFrames: 8});
	const movieOp = interpolate(frame, [20, 24], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const movieOut = interpolate(frame, [110, 120], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	// Year badge pops
	const yearPop = spring({frame: Math.max(0, frame - 40), fps, from: 0, to: 1, durationInFrames: 10});
	const yearOut = interpolate(frame, [110, 120], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	// ====== TRANSITION: GLITCH CUT (120-140) ======
	const glitchActive = frame >= 120 && frame <= 135;
	const glitchFlash = interpolate(frame, [120, 122, 125, 127, 130, 132], [0, 1, 0, 0.7, 0, 0.5], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const glitchSlice = glitchActive ? Math.sin(frame * 8) * 30 : 0;

	// ====== ACT 2: PORTRAIT — KEN BURNS + PARALLAX (135-320) ======
	const portraitIn = interpolate(frame, [130, 150], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const portraitZoom = interpolate(frame, [135, 400], [1.15, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const portraitPanX = interpolate(frame, [135, 400], [3, -2], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	// Name SLAMS in huge
	const nameSlam = spring({frame: Math.max(0, frame - 160), fps, from: 4, to: 1, durationInFrames: 8});
	const nameOp = interpolate(frame, [160, 164], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const nameShake = frame >= 160 && frame <= 168 ? Math.sin(frame * 4) * (168 - frame) * 1 : 0;

	// Red underline wipes
	const redLineW = interpolate(frame, [168, 180], [0, 100], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	// Birth-Death dates counter effect
	const dateOp = interpolate(frame, [190, 200], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const bornCount = Math.round(interpolate(frame, [190, 210], [1900, legend.born], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
	const diedCount = Math.round(interpolate(frame, [205, 225], [1950, legend.died], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));

	// ====== ACT 3: SPLIT SCREEN — MOVIE + PORTRAIT (240-380) ======
	const splitProgress = interpolate(frame, [240, 270], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const leftSlide = interpolate(splitProgress, [0, 1], [-100, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const rightSlide = interpolate(splitProgress, [0, 1], [100, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	// "ICONIC ROLE" text
	const iconicSlam = spring({frame: Math.max(0, frame - 280), fps, from: 3, to: 1, durationInFrames: 8});
	const iconicOp = interpolate(frame, [280, 284], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	// Movie name below
	const movieName2Op = interpolate(frame, [295, 310], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const movieName2Y = interpolate(frame, [295, 310], [20, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	// Split out
	const splitOut = interpolate(frame, [370, 385], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	// ====== ACT 4: QUOTE — TYPEWRITER + ZOOM (390-500) ======
	const quoteIn = interpolate(frame, [385, 395], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const quoteZoom = interpolate(frame, [390, 500], [1.05, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const quoteChars = Math.floor(interpolate(frame, [395, 480], [0, legend.quote.length], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));

	// Attribution
	const attrOp = interpolate(frame, [485, 500], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	// ====== GLOBAL ======
	const fadeOut = interpolate(frame, [LEGEND_FRAMES - 15, LEGEND_FRAMES], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	// Determine which "act" we're in for bg
	const act1Visible = interpolate(frame, [120, 135], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const act2Visible = interpolate(frame, [130, 150, 235, 250], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const act3Visible = interpolate(frame, [240, 260, 370, 390], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const act4Visible = interpolate(frame, [385, 400], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	return (
		<AbsoluteFill style={{opacity: fadeOut, background: '#0a0a0a'}}>
			<NoiseBackground frame={frame} />

			{/* ===== ACT 1: MOVIE SCENE FULLSCREEN ===== */}
			<div style={{position: 'absolute', inset: -40, opacity: sceneOp * act1Visible, transform: `scale(${sceneZoom})`}}>
				<Img src={staticFile(legend.movieScene)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
			</div>
			{/* Dark gradient overlay */}
			<div style={{position: 'absolute', inset: 0, background: 'linear-gradient(0deg, rgba(0,0,0,0.8) 0%, transparent 40%, transparent 60%, rgba(0,0,0,0.6) 100%)', opacity: act1Visible}} />

			{/* Movie title SLAM */}
			<div style={{
				position: 'absolute', top: '8%', left: '50%',
				transform: `translateX(-50%) scale(${movieSlam})`,
				opacity: movieOp * movieOut * act1Visible,
			}}>
				<div style={{
					background: 'rgba(230,57,70,0.95)', padding: '12px 50px',
					transform: 'skewX(-3deg)',
				}}>
					<span style={{fontSize: 48, fontWeight: 900, color: '#fff', letterSpacing: 3, transform: 'skewX(3deg)', display: 'block'}}>
						{legend.movie.toUpperCase()}
					</span>
				</div>
			</div>

			{/* Year badge */}
			<div style={{
				position: 'absolute', bottom: '10%', right: '8%',
				transform: `scale(${yearPop})`, opacity: yearOut * act1Visible,
			}}>
				<div style={{background: '#fff', padding: '8px 25px', borderRadius: 4}}>
					<span style={{fontSize: 36, fontWeight: 900, color: '#0a0a0a'}}>{legend.born} — {legend.died}</span>
				</div>
			</div>

			{/* ===== GLITCH TRANSITION ===== */}
			{glitchActive && (
				<>
					<div style={{position: 'absolute', inset: 0, background: '#fff', opacity: glitchFlash * 0.8}} />
					<div style={{position: 'absolute', top: '30%', left: 0, right: 0, height: 4, background: '#e63946', transform: `translateX(${glitchSlice}px)`}} />
					<div style={{position: 'absolute', top: '60%', left: 0, right: 0, height: 3, background: '#e63946', transform: `translateX(${-glitchSlice}px)`}} />
					<div style={{position: 'absolute', top: '45%', left: 0, right: 0, height: 2, background: 'cyan', transform: `translateX(${glitchSlice * 1.5}px)`, opacity: 0.5}} />
				</>
			)}

			{/* ===== ACT 2: PORTRAIT FULLSCREEN + NAME ===== */}
			<div style={{
				position: 'absolute', inset: -30, opacity: portraitIn * act2Visible,
				transform: `scale(${portraitZoom}) translateX(${portraitPanX}%)`,
			}}>
				<Img src={staticFile(legend.portrait)} style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.7) contrast(1.15)'}} />
			</div>
			{/* Gradient overlay for text readability */}
			<div style={{position: 'absolute', inset: 0, background: 'linear-gradient(0deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 35%, transparent 55%, rgba(0,0,0,0.4) 100%)', opacity: act2Visible}} />

			{/* Name SLAM */}
			<div style={{
				position: 'absolute', bottom: '18%', left: '50%',
				transform: `translateX(-50%) scale(${nameSlam}) translateX(${nameShake}px)`,
				opacity: nameOp * act2Visible,
				textAlign: 'center',
			}}>
				<div style={{fontSize: 120, fontWeight: 900, color: '#fff', letterSpacing: -2, lineHeight: 0.95, textShadow: '4px 4px 0 rgba(230,57,70,0.6), 0 0 40px rgba(0,0,0,0.8)'}}>
					{legend.name.toUpperCase()}
				</div>
				{/* Red underline wipe */}
				<div style={{width: `${redLineW}%`, height: 5, background: '#e63946', margin: '15px auto 0', borderRadius: 2}} />
			</div>

			{/* Date counters */}
			<div style={{
				position: 'absolute', bottom: '8%', left: '50%',
				transform: 'translateX(-50%)',
				opacity: dateOp * act2Visible,
				display: 'flex', gap: 40, alignItems: 'center',
			}}>
				<div style={{textAlign: 'center'}}>
					<div style={{fontSize: 18, fontWeight: 700, color: '#888', letterSpacing: 4}}>BORN</div>
					<div style={{fontSize: 52, fontWeight: 900, color: '#fff', fontFamily: "'Courier New', monospace"}}>{bornCount}</div>
				</div>
				<div style={{fontSize: 40, color: '#e63946', fontWeight: 900}}>—</div>
				<div style={{textAlign: 'center'}}>
					<div style={{fontSize: 18, fontWeight: 700, color: '#888', letterSpacing: 4}}>DIED</div>
					<div style={{fontSize: 52, fontWeight: 900, color: '#e63946', fontFamily: "'Courier New', monospace"}}>{diedCount}</div>
				</div>
				<div style={{
					marginLeft: 20, background: 'rgba(255,255,255,0.1)',
					padding: '8px 20px', borderRadius: 4, border: '1px solid rgba(255,255,255,0.2)',
				}}>
					<span style={{fontSize: 28, fontWeight: 900, color: '#fff'}}>{legend.died - legend.born} years</span>
				</div>
			</div>

			{/* ===== ACT 3: SPLIT SCREEN ===== */}
			<div style={{position: 'absolute', inset: 0, opacity: act3Visible, overflow: 'hidden'}}>
				{/* Left half — Movie scene */}
				<div style={{
					position: 'absolute', top: 0, bottom: 0, left: 0, width: '50%',
					overflow: 'hidden', transform: `translateX(${leftSlide}%)`,
				}}>
					<Img src={staticFile(legend.movieScene)} style={{
						width: '200%', height: '100%', objectFit: 'cover',
						filter: 'brightness(0.6) contrast(1.1)',
					}} />
					{/* Label */}
					<div style={{position: 'absolute', bottom: 30, left: 30}}>
						<div style={{background: '#e63946', padding: '6px 20px', display: 'inline-block', transform: 'skewX(-3deg)'}}>
							<span style={{fontSize: 22, fontWeight: 900, color: '#fff', letterSpacing: 3}}>THE ROLE</span>
						</div>
					</div>
				</div>

				{/* Right half — Portrait */}
				<div style={{
					position: 'absolute', top: 0, bottom: 0, right: 0, width: '50%',
					overflow: 'hidden', transform: `translateX(${-rightSlide}%)`,
				}}>
					<Img src={staticFile(legend.portrait)} style={{
						width: '200%', height: '100%', objectFit: 'cover', objectPosition: 'right',
						filter: 'brightness(0.7) contrast(1.1)',
					}} />
					{/* Label */}
					<div style={{position: 'absolute', bottom: 30, right: 30}}>
						<div style={{background: '#c9a84c', padding: '6px 20px', display: 'inline-block', transform: 'skewX(-3deg)'}}>
							<span style={{fontSize: 22, fontWeight: 900, color: '#000', letterSpacing: 3}}>THE LEGEND</span>
						</div>
					</div>
				</div>

				{/* Center divider */}
				<div style={{position: 'absolute', top: 0, bottom: 0, left: '50%', width: 4, background: '#e63946', transform: 'translateX(-50%)', boxShadow: '0 0 20px rgba(230,57,70,0.5)', opacity: splitProgress}} />

				{/* "ICONIC ROLE" slam */}
				<div style={{
					position: 'absolute', top: '10%', left: '50%',
					transform: `translateX(-50%) scale(${iconicSlam})`,
					opacity: iconicOp,
				}}>
					<span style={{fontSize: 70, fontWeight: 900, color: '#fff', letterSpacing: -1, textShadow: '3px 3px 0 #e63946, 0 0 30px rgba(0,0,0,0.8)'}}>
						ICONIC ROLE
					</span>
				</div>

				{/* Movie name */}
				<div style={{
					position: 'absolute', top: '22%', left: '50%',
					transform: `translateX(-50%) translateY(${movieName2Y}px)`,
					opacity: movieName2Op,
				}}>
					<div style={{background: 'rgba(0,0,0,0.8)', padding: '10px 40px', border: '2px solid #c9a84c'}}>
						<span style={{fontSize: 36, fontWeight: 400, color: '#c9a84c', fontStyle: 'italic', letterSpacing: 4}}>
							{legend.movie}
						</span>
					</div>
				</div>
			</div>

			{/* ===== ACT 4: QUOTE — CINEMATIC ===== */}
			<div style={{position: 'absolute', inset: 0, opacity: quoteIn * act4Visible}}>
				{/* Darkened portrait bg */}
				<div style={{position: 'absolute', inset: -20, transform: `scale(${quoteZoom})`}}>
					<Img src={staticFile(legend.portrait)} style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.15) blur(3px) contrast(1.2)'}} />
				</div>

				{/* Large quotation mark */}
				<div style={{
					position: 'absolute', top: '15%', left: '10%',
					fontSize: 250, color: 'rgba(230,57,70,0.15)', fontFamily: 'Georgia, serif', lineHeight: 0.8,
				}}>"</div>

				{/* Quote text typewriter */}
				<div style={{
					position: 'absolute', top: '25%', left: '12%', right: '12%',
				}}>
					<div style={{
						fontSize: 42, color: '#fff', fontStyle: 'italic', fontFamily: 'Georgia, serif',
						lineHeight: 1.7, fontWeight: 400,
						textShadow: '0 2px 20px rgba(0,0,0,0.8)',
					}}>
						{legend.quote.slice(0, quoteChars)}
						{quoteChars < legend.quote.length && (
							<span style={{
								display: 'inline-block', width: 3, height: 42,
								background: '#e63946', marginLeft: 4, verticalAlign: 'middle',
								opacity: frame % 14 > 7 ? 1 : 0,
							}} />
						)}
					</div>
				</div>

				{/* Attribution */}
				<div style={{
					position: 'absolute', bottom: '18%', right: '12%',
					opacity: attrOp,
				}}>
					<div style={{display: 'flex', alignItems: 'center', gap: 15}}>
						<div style={{width: 50, height: 2, background: '#e63946'}} />
						<span style={{fontSize: 32, fontWeight: 900, color: '#e63946', letterSpacing: 3}}>
							{legend.name.toUpperCase()}
						</span>
					</div>
					<div style={{fontSize: 22, color: '#666', letterSpacing: 5, marginTop: 8, textAlign: 'right'}}>
						{legend.born} — {legend.died}
					</div>
				</div>
			</div>

			{/* ===== PERSISTENT ELEMENTS ===== */}
			{/* Progress bar at very bottom */}
			<div style={{position: 'absolute', bottom: 0, left: 0, height: 3, background: '#e63946', width: `${(frame / LEGEND_FRAMES) * 100}%`}} />

			{/* Corner branding */}
			<div style={{
				position: 'absolute', top: 20, right: 25,
				opacity: 0.4, fontSize: 16, color: '#666', letterSpacing: 3, fontWeight: 700,
			}}>
				HALL OF LEGENDS
			</div>
		</AbsoluteFill>
	);
};

// ============ OUTRO ============
const Outro: React.FC<{fps: number}> = ({fps}) => {
	const frame = useCurrentFrame();

	const titleSlam = spring({frame: Math.max(0, frame - 5), fps, from: 3, to: 1, durationInFrames: 10});
	const titleOp = interpolate(frame, [5, 10], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const shake = frame >= 5 && frame <= 15 ? Math.sin(frame * 3) * (15 - frame) * 0.6 : 0;

	const subOp = interpolate(frame, [25, 40], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const subY = interpolate(frame, [25, 40], [30, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	const ctaScale = spring({frame: Math.max(0, frame - 55), fps, from: 0, to: 1, durationInFrames: 12});
	const ctaPulse = 1 + 0.03 * Math.sin(frame * 0.15);

	const lineW = interpolate(frame, [15, 50], [0, 500], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	return (
		<AbsoluteFill style={{background: '#0a0a0a'}}>
			<NoiseBackground frame={frame} />

			<div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20}}>
				<div style={{
					opacity: titleOp, transform: `scale(${titleSlam}) translateX(${shake}px)`,
					textAlign: 'center',
				}}>
					<div style={{fontSize: 100, fontWeight: 900, color: '#fff', letterSpacing: -2, lineHeight: 0.95}}>
						GONE BUT
					</div>
					<div style={{fontSize: 110, fontWeight: 900, color: '#e63946', letterSpacing: -2, lineHeight: 0.95}}>
						NEVER FORGOTTEN
					</div>
				</div>

				<div style={{display: 'flex', alignItems: 'center', gap: 15}}>
					<div style={{width: lineW / 2, height: 3, background: 'linear-gradient(90deg, transparent, #e63946)'}} />
					<div style={{fontSize: 30, opacity: subOp}}>🕊️</div>
					<div style={{width: lineW / 2, height: 3, background: 'linear-gradient(270deg, transparent, #e63946)'}} />
				</div>

				<div style={{opacity: subOp, transform: `translateY(${subY}px)`}}>
					<span style={{fontSize: 36, color: '#666', letterSpacing: 8, fontWeight: 700}}>
						HALL OF LEGENDS
					</span>
				</div>

				{/* CTA */}
				<div style={{
					marginTop: 20, transform: `scale(${ctaScale * ctaPulse})`,
				}}>
					<div style={{
						background: '#e63946', padding: '18px 60px',
						transform: 'skewX(-3deg)', borderRadius: 4,
						boxShadow: '0 4px 20px rgba(230,57,70,0.4)',
					}}>
						<span style={{fontSize: 36, fontWeight: 900, color: '#fff', letterSpacing: 4, transform: 'skewX(3deg)', display: 'block'}}>
							SUBSCRIBE 🔔
						</span>
					</div>
				</div>
			</div>
		</AbsoluteFill>
	);
};

// ============ SHARED COMPONENTS ============

const NoiseBackground: React.FC<{frame: number}> = ({frame}) => (
	<>
		{/* Subtle animated grain */}
		<div style={{
			position: 'absolute', inset: 0, opacity: 0.035, pointerEvents: 'none',
			backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' seed='${frame % 30}' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
			mixBlendMode: 'overlay',
		}} />
		{/* Subtle vignette */}
		<div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.6) 100%)', pointerEvents: 'none'}} />
	</>
);
