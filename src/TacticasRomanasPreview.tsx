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
const TITLE = staticFile('tacticas-romanas/title.png');
const SOLDIERS = staticFile('tacticas-romanas/soldiers.png');
const ARROWS = staticFile('tacticas-romanas/arrows.png');
const ICON = staticFile('tacticas-romanas/icon.png');

export const TacticasRomanasPreview: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps, durationInFrames} = useVideoConfig();

	// Phase 1 (0-20): Background fade in
	const bgOpacity = interpolate(frame, [0, 15], [0, 1], {
		extrapolateRight: 'clamp',
	});

	// Phase 2 (30-65): Title drops from top
	const titleSpring = spring({frame: frame - 30, fps, config: {damping: 12, mass: 0.7}});
	const titleY = interpolate(titleSpring, [0, 1], [-150, 0]);
	const titleScale = interpolate(titleSpring, [0, 1], [0.6, 1]);

	// Phase 3 (70-120): Soldiers pop up from bottom
	const soldiersSpring = spring({frame: frame - 70, fps, config: {damping: 14, mass: 1}});
	const soldiersY = interpolate(soldiersSpring, [0, 1], [400, 0]);
	const soldiersScale = interpolate(soldiersSpring, [0, 1], [0.6, 1]);

	// Phase 4 (140-190): Arrows fly in from upper right
	const arrowsSpring = spring({frame: frame - 140, fps, config: {damping: 16, mass: 0.8}});
	const arrowsX = interpolate(arrowsSpring, [0, 1], [600, 0]);
	const arrowsY = interpolate(arrowsSpring, [0, 1], [-400, 0]);
	const arrowsOpacity = interpolate(arrowsSpring, [0, 0.15], [0, 1], {
		extrapolateRight: 'clamp',
	});

	// Phase 5 (200-240): Icon pops in with bounce
	const iconSpring = spring({frame: frame - 200, fps, config: {damping: 8, mass: 0.5, stiffness: 200}});
	const iconScale = interpolate(iconSpring, [0, 1], [0, 1]);

	// Ken Burns after build (frame 260+)
	const kenBurnsScale = interpolate(frame, [260, durationInFrames], [1, 1.05], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const panX = interpolate(frame, [260, durationInFrames], [0, -10], {
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

			{/* Layer 2: Title */}
			<AbsoluteFill
				style={{
					transform: `translateY(${titleY}px) scale(${titleScale}) scale(${kenBurnsScale}) translateX(${panX}px)`,
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
			</AbsoluteFill>

			{/* Layer 3: Soldiers */}
			<AbsoluteFill
				style={{
					transform: `translateY(${soldiersY}px) scale(${soldiersScale * kenBurnsScale}) translateX(${panX}px)`,
				}}
			>
				<Img
					src={SOLDIERS}
					style={{
						width: '100%',
						height: '100%',
						objectFit: 'contain',
						objectPosition: 'center 60%',
					}}
				/>
			</AbsoluteFill>

			{/* Layer 4: Arrows */}
			<AbsoluteFill
				style={{
					opacity: arrowsOpacity,
					transform: `translate(${arrowsX}px, ${arrowsY}px) scale(${kenBurnsScale}) translateX(${panX}px)`,
				}}
			>
				<Img
					src={ARROWS}
					style={{
						width: '100%',
						height: '70%',
						objectFit: 'contain',
						objectPosition: 'center top',
					}}
				/>
			</AbsoluteFill>

			{/* Layer 5: Icon badge */}
			<div
				style={{
					position: 'absolute',
					top: 30,
					right: 40,
					width: 110,
					height: 110,
					transform: `scale(${iconScale})`,
					overflow: 'hidden',
				}}
			>
				<Img
					src={ICON}
					style={{width: '100%', height: '100%', objectFit: 'contain'}}
				/>
			</div>
		</AbsoluteFill>
	);
};
