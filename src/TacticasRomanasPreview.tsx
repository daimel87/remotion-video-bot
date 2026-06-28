import React from 'react';
import {
	AbsoluteFill,
	Img,
	interpolate,
	spring,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';

const FULL_IMG = staticFile(
	'tacticas-romanas/Simple_cartoon_illustration_on_solid_202606271610.jpeg'
);

export const TacticasRomanasPreview: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps, durationInFrames} = useVideoConfig();

	// Phase 1 (0-30): Parchment bg only
	const bgOpacity = interpolate(frame, [0, 15], [0, 1], {
		extrapolateRight: 'clamp',
	});

	// Phase 2 (30-70): Reveal soldiers from bottom up (lower 60% of image)
	const soldiersReveal = spring({
		frame: frame - 30,
		fps,
		config: {damping: 16, mass: 1.2},
	});
	const soldiersClip = interpolate(soldiersReveal, [0, 1], [100, 35]);

	// Phase 3 (80-120): Reveal title area (top 35%)
	const titleReveal = spring({
		frame: frame - 80,
		fps,
		config: {damping: 14, mass: 0.8},
	});
	const titleClip = interpolate(titleReveal, [0, 1], [35, 0]);

	// Phase 4 (130-170): Reveal icon (top-right corner)
	const iconReveal = spring({
		frame: frame - 130,
		fps,
		config: {damping: 10, mass: 0.6},
	});
	const iconScale = interpolate(iconReveal, [0, 1], [0, 1]);

	// Phase 5 (180-220): Reveal arrows (upper portion overlay)
	const arrowsReveal = spring({
		frame: frame - 180,
		fps,
		config: {damping: 12, mass: 0.7},
	});
	const arrowsOpacity = interpolate(arrowsReveal, [0, 1], [0, 1]);

	// Ken Burns after everything revealed (frame 240+)
	const kenBurnsScale = interpolate(frame, [240, durationInFrames], [1, 1.06], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const panX = interpolate(frame, [240, durationInFrames], [0, -15], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const panY = interpolate(frame, [240, durationInFrames], [0, -8], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	// Fade out
	const fadeOut = interpolate(
		frame,
		[durationInFrames - 25, durationInFrames],
		[1, 0],
		{extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
	);

	// Combined clip: reveal soldiers first (bottom), then title (top)
	const topClip = Math.min(titleClip, 35);
	const bottomClip = soldiersClip;

	return (
		<AbsoluteFill style={{backgroundColor: '#D4C5A9', opacity: fadeOut}}>
			{/* Parchment base */}
			<AbsoluteFill style={{opacity: bgOpacity, backgroundColor: '#D4C5A9'}} />

			{/* Main image — progressive reveal via clipPath */}
			<AbsoluteFill
				style={{
					clipPath: `inset(${topClip}% 0 ${bottomClip}% 0)`,
					transform: `scale(${kenBurnsScale}) translate(${panX}px, ${panY}px)`,
				}}
			>
				<Img
					src={FULL_IMG}
					style={{width: '100%', height: '100%', objectFit: 'cover'}}
				/>
			</AbsoluteFill>

			{/* Icon area — separate reveal with pop */}
			{frame >= 130 && (
				<div
					style={{
						position: 'absolute',
						top: '2%',
						right: '3%',
						width: '8%',
						height: '14%',
						overflow: 'hidden',
						borderRadius: '50%',
						transform: `scale(${iconScale})`,
					}}
				>
					<Img
						src={FULL_IMG}
						style={{
							position: 'absolute',
							top: 0,
							left: 0,
							width: `${100 / 0.08}%`,
							height: `${100 / 0.14}%`,
							objectFit: 'cover',
							transform: 'translate(-92%, -2%)',
						}}
					/>
				</div>
			)}

			{/* Arrows overlay — fade in with shake */}
			{frame >= 180 && (
				<AbsoluteFill
					style={{
						opacity: arrowsOpacity,
						mixBlendMode: 'multiply',
						transform: `scale(${kenBurnsScale}) translate(${panX}px, ${panY}px)`,
					}}
				>
					<Img
						src={staticFile(
							'tacticas-romanas/Multiple_black_arrows_flying_diagonally_202606271659.jpeg'
						)}
						style={{
							width: '100%',
							height: '60%',
							objectFit: 'cover',
							objectPosition: 'center top',
						}}
					/>
				</AbsoluteFill>
			)}
		</AbsoluteFill>
	);
};
