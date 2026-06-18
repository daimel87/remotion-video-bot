import {AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate} from 'remotion';

export const FullScreenText: React.FC<{
	text: string;
	color?: string;
	bgOpacity?: number;
}> = ({text, color = '#ffffff', bgOpacity = 0.85}) => {
	const frame = useCurrentFrame();
	const {fps, durationInFrames, width} = useVideoConfig();
	const scale = width / 1920;

	const enter = spring({frame, fps, config: {damping: 200, stiffness: 100}});
	const exit = interpolate(frame, [durationInFrames - 12, durationInFrames], [1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	const textScale = interpolate(enter, [0, 1], [0.7, 1]);
	const opacity = enter * exit;

	return (
		<AbsoluteFill style={{
			background: `rgba(8, 16, 40, ${bgOpacity})`,
			justifyContent: 'center',
			alignItems: 'center',
			padding: 60 * scale,
			opacity,
		}}>
			<div style={{
				transform: `scale(${textScale})`,
				fontFamily: 'Helvetica, Arial, sans-serif',
				fontWeight: 900,
				fontSize: 90 * scale,
				lineHeight: 1.2,
				color,
				textAlign: 'center',
				maxWidth: 1600 * scale,
				textShadow: `0 0 40px ${color}60`,
			}}>
				{text}
			</div>
		</AbsoluteFill>
	);
};
