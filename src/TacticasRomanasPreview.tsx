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

const GRID = staticFile('tacticas-romanas/Grid_layout_on_solid_parchment_202606271726.jpeg');
const BG = staticFile('tacticas-romanas/Solid_parchment_background,_aged_sand-colored_202606271650.jpeg');
const SOLDIERS = staticFile('tacticas-romanas/soldiers.png');
const ARROWS = staticFile('tacticas-romanas/arrows.png');
const ICON = staticFile('tacticas-romanas/icon.png');
const TITLE = staticFile('tacticas-romanas/title.png');

export const TacticasRomanasPreview: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps, durationInFrames} = useVideoConfig();

	// === PHASE A: Grid overview (frame 0-45) — show full grid 1.5s ===
	const gridOpacity = interpolate(frame, [0, 15], [0, 1], {
		extrapolateRight: 'clamp',
	});

	// === PHASE B: Zoom into Testudo (frame 45-120) — zoom to fill screen ===
	const zoomProgress = spring({
		frame: frame - 45,
		fps,
		config: {damping: 22, mass: 1.8},
	});
	// Zoom enough so the testudo circle fills the frame
	const zoomScale = interpolate(zoomProgress, [0, 1], [1, 6]);
	// Testudo is top-left: ~10% from left, ~25% from top of image
	const panX = interpolate(zoomProgress, [0, 1], [0, 42]);
	const panY = interpolate(zoomProgress, [0, 1], [0, 18]);

	// === PHASE C: Hold zoomed testudo (frame 120-210) — 3 seconds ===

	// === PHASE D: Smooth crossfade to detail scene (frame 210-260) ===
	const crossfadeProgress = interpolate(frame, [210, 260], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	// === PHASE E: Detail layers appear (frame 260+) ===
	const titleSpring = spring({frame: frame - 270, fps, config: {damping: 12, mass: 0.7}});
	const titleY = interpolate(titleSpring, [0, 1], [-150, 0]);
	const titleScale = interpolate(titleSpring, [0, 1], [0.6, 1]);

	const soldiersSpring = spring({frame: frame - 310, fps, config: {damping: 14, mass: 1}});
	const soldiersY = interpolate(soldiersSpring, [0, 1], [400, 0]);
	const soldiersScale = interpolate(soldiersSpring, [0, 1], [0.6, 1]);

	const arrowsSpring = spring({frame: frame - 400, fps, config: {damping: 16, mass: 0.8}});
	const arrowsX = interpolate(arrowsSpring, [0, 1], [600, 0]);
	const arrowsY = interpolate(arrowsSpring, [0, 1], [-400, 0]);
	const arrowsOpacity = interpolate(arrowsSpring, [0, 0.15], [0, 1], {
		extrapolateRight: 'clamp',
	});

	const iconSpring = spring({frame: frame - 440, fps, config: {damping: 8, mass: 0.5, stiffness: 200}});
	const iconScale = interpolate(iconSpring, [0, 1], [0, 1]);

	// Ken Burns (frame 480+)
	const kenBurnsScale = interpolate(frame, [480, durationInFrames], [1, 1.05], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const kbPanX = interpolate(frame, [480, durationInFrames], [0, -10], {
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
			{/* Grid with zoom */}
			{crossfadeProgress < 1 && (
				<AbsoluteFill
					style={{
						opacity: gridOpacity * (1 - crossfadeProgress),
						transform: `scale(${zoomScale}) translate(${panX}%, ${panY}%)`,
						transformOrigin: '0% 0%',
					}}
				>
					<Img src={GRID} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
				</AbsoluteFill>
			)}

			{/* Detail scene */}
			{crossfadeProgress > 0 && (
				<AbsoluteFill style={{opacity: crossfadeProgress}}>
					<AbsoluteFill>
						<Img src={BG} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
					</AbsoluteFill>

					<AbsoluteFill
						style={{
							transform: `translateY(${titleY}px) scale(${titleScale * kenBurnsScale}) translateX(${kbPanX}px)`,
						}}
					>
						<Img src={TITLE} style={{width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'top center'}} />
					</AbsoluteFill>

					<AbsoluteFill
						style={{
							transform: `translateY(${soldiersY}px) scale(${soldiersScale * kenBurnsScale}) translateX(${kbPanX}px)`,
						}}
					>
						<Img src={SOLDIERS} style={{width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center 60%'}} />
					</AbsoluteFill>

					<AbsoluteFill
						style={{
							opacity: arrowsOpacity,
							transform: `translate(${arrowsX}px, ${arrowsY}px) scale(${kenBurnsScale}) translateX(${kbPanX}px)`,
						}}
					>
						<Img src={ARROWS} style={{width: '100%', height: '70%', objectFit: 'contain', objectPosition: 'center top'}} />
					</AbsoluteFill>

					<div
						style={{
							position: 'absolute',
							top: 30,
							right: 40,
							width: 110,
							height: 110,
							transform: `scale(${iconScale})`,
						}}
					>
						<Img src={ICON} style={{width: '100%', height: '100%', objectFit: 'contain'}} />
					</div>
				</AbsoluteFill>
			)}
		</AbsoluteFill>
	);
};
