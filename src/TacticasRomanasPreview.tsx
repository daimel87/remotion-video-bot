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

const IMG_SRC = staticFile(
	'tacticas-romanas/Simple_cartoon_illustration_on_solid_202606271610.jpeg'
);

export const TacticasRomanasPreview: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps, durationInFrames} = useVideoConfig();

	// Phase 1 (frame 0-20): parchment bg only
	// Phase 2 (frame 20-55): soldiers reveal from bottom via clipPath
	const revealProgress = spring({
		frame: frame - 15,
		fps,
		config: {damping: 14, mass: 1.2},
	});
	const clipBottom = interpolate(revealProgress, [0, 1], [100, 0]);

	// Phase 3 (frame 40-65): title slides down from top
	const titleSpring = spring({
		frame: frame - 40,
		fps,
		config: {damping: 13, mass: 0.6},
	});
	const titleY = interpolate(titleSpring, [0, 1], [-120, 0]);
	const titleOpacity = interpolate(titleSpring, [0, 0.3], [0, 1], {
		extrapolateRight: 'clamp',
	});

	// Phase 4 (frame 55-80): icon pops in with bounce
	const iconSpring = spring({
		frame: frame - 55,
		fps,
		config: {damping: 8, mass: 0.5, stiffness: 200},
	});
	const iconScale = interpolate(iconSpring, [0, 1], [0, 1]);

	// Phase 5 (frame 70+): arrows fly in from sides
	const arrowSpring = spring({
		frame: frame - 70,
		fps,
		config: {damping: 12, mass: 0.8},
	});

	// Gentle Ken Burns after everything is revealed (frame 80+)
	const kenBurnsScale = interpolate(
		frame,
		[80, durationInFrames],
		[1, 1.06],
		{extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
	);
	const panX = interpolate(frame, [80, durationInFrames], [0, -15], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	// Fade out
	const fadeOut = interpolate(
		frame,
		[durationInFrames - 15, durationInFrames],
		[1, 0],
		{extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
	);

	return (
		<AbsoluteFill style={{backgroundColor: '#D4C5A9', opacity: fadeOut}}>
			{/* Soldiers — reveal from bottom */}
			<AbsoluteFill
				style={{
					clipPath: `inset(0 0 ${clipBottom}% 0)`,
					transform: `scale(${kenBurnsScale}) translateX(${panX}px)`,
				}}
			>
				<Img
					src={IMG_SRC}
					style={{
						width: '100%',
						height: '100%',
						objectFit: 'cover',
					}}
				/>
			</AbsoluteFill>

			{/* Title — slides down from top */}
			<div
				style={{
					position: 'absolute',
					top: 30,
					left: 0,
					right: 0,
					display: 'flex',
					justifyContent: 'center',
					opacity: titleOpacity,
					transform: `translateY(${titleY}px)`,
				}}
			>
				<span
					style={{
						fontFamily: 'Impact, Arial Black, sans-serif',
						fontSize: 90,
						fontWeight: 900,
						color: '#1a1a1a',
						letterSpacing: 4,
						textTransform: 'uppercase',
						textShadow: '3px 3px 0px rgba(0,0,0,0.15)',
					}}
				>
					FORMACIÓN TESTUDO
				</span>
			</div>

			{/* Icon — pops in with bounce */}
			<div
				style={{
					position: 'absolute',
					top: 35,
					right: 50,
					width: 90,
					height: 90,
					borderRadius: '50%',
					backgroundColor: '#B83232',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					transform: `scale(${iconScale})`,
					boxShadow: '2px 4px 8px rgba(0,0,0,0.25)',
				}}
			>
				<span style={{fontSize: 50, filter: 'brightness(10)'}}>🐢</span>
			</div>

			{/* Arrows flying in from right */}
			{[0, 1, 2, 3, 4].map((i) => {
				const delay = 70 + i * 4;
				const arrowProgress = spring({
					frame: frame - delay,
					fps,
					config: {damping: 15, mass: 0.5},
				});
				const x = interpolate(arrowProgress, [0, 1], [400, 0]);
				const arrowOpacity = interpolate(arrowProgress, [0, 0.2], [0, 1], {
					extrapolateRight: 'clamp',
				});
				const rotation = -35 + i * 12;
				const top = 180 + i * 60;
				return (
					<div
						key={i}
						style={{
							position: 'absolute',
							top,
							right: 120 + i * 30,
							opacity: arrowOpacity,
							transform: `translateX(${x}px) rotate(${rotation}deg)`,
							fontSize: 36,
						}}
					>
						➜
					</div>
				);
			})}
		</AbsoluteFill>
	);
};
