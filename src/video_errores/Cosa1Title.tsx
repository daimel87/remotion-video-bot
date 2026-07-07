import {
	AbsoluteFill,
	useCurrentFrame,
	useVideoConfig,
	interpolate,
	Easing,
	spring,
} from 'remotion';
import {theme, shadow} from './theme';

const fontFamily = 'Montserrat';
const FontFace: React.FC = () => (
	<style>{`@font-face{font-family:'Montserrat';font-style:normal;font-weight:100 900;font-display:block;src:url('/fonts/Montserrat.ttf') format('truetype');}`}</style>
);

const GridBg: React.FC<{s: number}> = ({s}) => (
	<AbsoluteFill
		style={{
			backgroundImage:
				'linear-gradient(rgba(56,189,217,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,217,0.08) 1px, transparent 1px)',
			backgroundSize: `${70 * s}px ${70 * s}px`,
			opacity: 0.5,
		}}
	/>
);

const eo = Easing.out(Easing.cubic);

export const Cosa1Title: React.FC = () => {
	const frame = useCurrentFrame();
	const {width, fps, durationInFrames} = useVideoConfig();
	const s = width / 1920;

	// badge pop
	const badge = spring({frame: frame - 4, fps, config: {damping: 13, mass: 0.7}});
	// text rise
	const txt = interpolate(frame, [14, 30], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: eo});
	// whole-card fade out at the end
	const out = interpolate(frame, [durationInFrames - 12, durationInFrames], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const bgScale = interpolate(frame, [0, durationInFrames], [1.0, 1.05], {extrapolateRight: 'clamp'});

	return (
		<AbsoluteFill style={{background: theme.fullBg, justifyContent: 'center', alignItems: 'center', overflow: 'hidden', opacity: out}}>
			<FontFace />
			<AbsoluteFill style={{transform: `scale(${bgScale})`}}>
				<GridBg s={s} />
				<AbsoluteFill style={{backgroundImage: 'radial-gradient(circle at 50% 45%, rgba(6,182,212,0.16), transparent 62%)'}} />
			</AbsoluteFill>

			<div style={{textAlign: 'center', maxWidth: 1500 * s}}>
				<div
					style={{
						display: 'inline-block',
						background: theme.grad,
						borderRadius: 14 * s,
						padding: `${10 * s}px ${34 * s}px`,
						fontFamily,
						fontWeight: 900,
						fontSize: 40 * s,
						color: '#fff',
						letterSpacing: 5 * s,
						marginBottom: 30 * s,
						transform: `scale(${0.6 + badge * 0.4})`,
						opacity: Math.min(badge, 1),
						boxShadow: `0 ${8 * s}px ${30 * s}px rgba(6,182,212,0.4)`,
					}}
				>
					COSA #1
				</div>
				<div
					style={{
						fontFamily,
						fontWeight: 900,
						fontSize: 90 * s,
						color: theme.text,
						lineHeight: 1.08,
						opacity: txt,
						transform: `translateY(${(1 - txt) * 30 * s}px)`,
						...shadow,
					}}
				>
					Levantarte de una silla<br /><span style={{color: theme.c1}}>sin usar las manos</span>
				</div>
			</div>

			{/* Watermark */}
			<div style={{position: 'absolute', bottom: 44 * s, left: 54 * s, display: 'flex', alignItems: 'center', gap: 12 * s, opacity: 0.85}}>
				<span style={{fontSize: 34 * s}}>🩺</span>
				<span style={{fontFamily, fontWeight: 800, fontSize: 30 * s, color: theme.text, letterSpacing: 1 * s, ...shadow}}>DRA. LAURA</span>
			</div>
		</AbsoluteFill>
	);
};
