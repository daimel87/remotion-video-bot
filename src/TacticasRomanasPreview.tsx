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

const BG = staticFile('tacticas-romanas/Solid_parchment_background,_aged_sand-colored_202606271650.jpeg');
const TITLE = staticFile('tacticas-romanas/Bold_black_text__FORMACIÓN_TESTUDO__202606271650.jpeg');
const SOLDIERS = staticFile('tacticas-romanas/Simple_cartoon_illustration_of_Roman_202606271651.jpeg');
const ARROWS = staticFile('tacticas-romanas/Multiple_black_arrows_flying_diagonally_202606271659.jpeg');
const ICON = staticFile('tacticas-romanas/Simple_circular_icon_badge,_dark_202606271700.jpeg');

export const TacticasRomanasPreview: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps, durationInFrames} = useVideoConfig();

	// Layer 1: Background — fade in (frame 0-20)
	const bgOpacity = interpolate(frame, [0, 20], [0, 1], {
		extrapolateRight: 'clamp',
	});

	// Layer 2: Title — drops from top (frame 30-60)
	const titleSpring = spring({frame: frame - 30, fps, config: {damping: 12, mass: 0.7}});
	const titleY = interpolate(titleSpring, [0, 1], [-200, 0]);
	const titleOpacity = interpolate(titleSpring, [0, 0.3], [0, 1], {
		extrapolateRight: 'clamp',
	});
	const titleScale = interpolate(titleSpring, [0, 1], [0.8, 1]);

	// Layer 3: Soldiers — pop up from bottom (frame 75-120)
	const soldiersSpring = spring({frame: frame - 75, fps, config: {damping: 14, mass: 1}});
	const soldiersY = interpolate(soldiersSpring, [0, 1], [300, 0]);
	const soldiersOpacity = interpolate(soldiersSpring, [0, 0.2], [0, 1], {
		extrapolateRight: 'clamp',
	});
	const soldiersScale = interpolate(soldiersSpring, [0, 1], [0.7, 1]);

	// Layer 4: Arrows — fly in from upper right (frame 150-200)
	const arrowsSpring = spring({frame: frame - 150, fps, config: {damping: 18, mass: 0.8}});
	const arrowsX = interpolate(arrowsSpring, [0, 1], [500, 0]);
	const arrowsY = interpolate(arrowsSpring, [0, 1], [-300, 0]);
	const arrowsOpacity = interpolate(arrowsSpring, [0, 0.2], [0, 1], {
		extrapolateRight: 'clamp',
	});

	// Layer 5: Icon — bounces in (frame 200-240)
	const iconSpring = spring({frame: frame - 200, fps, config: {damping: 8, mass: 0.5, stiffness: 200}});
	const iconScale = interpolate(iconSpring, [0, 1], [0, 1]);

	// Ken Burns on soldiers after everything is built (frame 250+)
	const kenBurnsScale = interpolate(frame, [250, durationInFrames], [1, 1.08], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const panX = interpolate(frame, [250, durationInFrames], [0, -20], {
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

	return (
		<AbsoluteFill style={{backgroundColor: '#D4C5A9', opacity: fadeOut}}>
			{/* Layer 1: Parchment background */}
			<AbsoluteFill style={{opacity: bgOpacity}}>
				<Img src={BG} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
			</AbsoluteFill>

			{/* Layer 3: Soldiers (behind title) */}
			<AbsoluteFill
				style={{
					opacity: soldiersOpacity,
					transform: `translateY(${soldiersY}px) scale(${soldiersScale * kenBurnsScale}) translateX(${panX}px)`,
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				<Img
					src={SOLDIERS}
					style={{
						width: '100%',
						height: '100%',
						objectFit: 'contain',
					}}
				/>
			</AbsoluteFill>

			{/* Layer 4: Arrows overlay */}
			<AbsoluteFill
				style={{
					opacity: arrowsOpacity,
					transform: `translate(${arrowsX}px, ${arrowsY}px)`,
					mixBlendMode: 'multiply',
				}}
			>
				<Img
					src={ARROWS}
					style={{
						width: '100%',
						height: '100%',
						objectFit: 'cover',
					}}
				/>
			</AbsoluteFill>

			{/* Layer 2: Title */}
			<div
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					height: '25%',
					opacity: titleOpacity,
					transform: `translateY(${titleY}px) scale(${titleScale})`,
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'flex-start',
					mixBlendMode: 'multiply',
				}}
			>
				<Img
					src={TITLE}
					style={{
						width: '100%',
						height: '100%',
						objectFit: 'contain',
						objectPosition: 'top center',
					}}
				/>
			</div>

			{/* Layer 5: Icon badge */}
			<div
				style={{
					position: 'absolute',
					top: 30,
					right: 40,
					width: 110,
					height: 110,
					transform: `scale(${iconScale})`,
					borderRadius: '50%',
					overflow: 'hidden',
				}}
			>
				<Img
					src={ICON}
					style={{
						width: '100%',
						height: '100%',
						objectFit: 'cover',
					}}
				/>
			</div>
		</AbsoluteFill>
	);
};
