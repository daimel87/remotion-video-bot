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
const rise = (f: number, inAt: number, dur = 12) =>
	interpolate(f, [inAt, inAt + dur], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: eo});

export const EscalerasStat: React.FC = () => {
	const frame = useCurrentFrame();
	const {width, fps} = useVideoConfig();
	const s = width / 1920;

	const bgScale = interpolate(frame, [0, 375], [1.0, 1.06], {extrapolateRight: 'clamp'});
	const badge = interpolate(frame, [8, 28], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	// Animated staircase (5 steps rising in)
	const steps = 5;

	// Headline "Subir escaleras predice…" 30-130
	const headO = rise(frame, 40, 14);

	// Two risk chips pop 150-... : INFARTOS + MUERTE PREMATURA
	const chip1 = spring({frame: frame - 165, fps, config: {damping: 13, mass: 0.8}});
	const chip2 = spring({frame: frame - 195, fps, config: {damping: 13, mass: 0.8}});

	// Kicker bottom "por sí sola" 250+
	const kO = rise(frame, 255, 14);

	return (
		<AbsoluteFill style={{background: theme.fullBg, justifyContent: 'center', alignItems: 'center', overflow: 'hidden'}}>
			<FontFace />
			<AbsoluteFill style={{transform: `scale(${bgScale})`}}>
				<GridBg s={s} />
				<AbsoluteFill style={{backgroundImage: 'radial-gradient(circle at 50% 45%, rgba(255,90,95,0.12), transparent 62%)'}} />
			</AbsoluteFill>

			{/* Source badge */}
			<div style={{position: 'absolute', top: 130 * s, opacity: badge, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 * s}}>
				<div style={{border: `${2 * s}px solid ${theme.panelBorder}`, borderRadius: 50 * s, padding: `${10 * s}px ${34 * s}px`, fontFamily, fontWeight: 800, fontSize: 27 * s, color: theme.c1, letterSpacing: 2 * s}}>
					❤️ ESTUDIOS DE CARDIOLOGÍA
				</div>
			</div>

			{/* Animated staircase (left) */}
			<div style={{position: 'absolute', left: 210 * s, bottom: 300 * s, display: 'flex', alignItems: 'flex-end', gap: 6 * s}}>
				{Array.from({length: steps}).map((_, i) => {
					const sp = spring({frame: frame - (55 + i * 12), fps, config: {damping: 14, mass: 0.7}});
					const h = (70 + i * 60) * s;
					return (
						<div
							key={i}
							style={{
								width: 62 * s,
								height: h * sp,
								background: `linear-gradient(180deg, ${theme.c1}, #0e7490)`,
								borderRadius: 8 * s,
								opacity: sp,
								boxShadow: `0 ${4 * s}px ${16 * s}px rgba(6,182,212,0.35)`,
							}}
						/>
					);
				})}
				{/* little runner emoji on top step */}
				<div style={{position: 'absolute', right: -14 * s, bottom: (70 + (steps - 1) * 60) * s, fontSize: 60 * s, opacity: spring({frame: frame - 120, fps, config: {damping: 12}})}}>🚶</div>
			</div>

			{/* Right side content */}
			<div style={{position: 'absolute', right: 170 * s, width: 900 * s, textAlign: 'left'}}>
				<div style={{opacity: headO, transform: `translateY(${(1 - headO) * 22 * s}px)`, fontFamily, fontWeight: 900, fontSize: 68 * s, color: theme.text, lineHeight: 1.1, ...shadow}}>
					Subir escaleras<br />predice <span style={{color: theme.c1}}>por sí solo</span>…
				</div>

				<div style={{display: 'flex', flexDirection: 'column', gap: 20 * s, marginTop: 40 * s}}>
					<div style={{opacity: Math.min(chip1, 1), transform: `translateX(${(1 - chip1) * 40 * s}px) scale(${0.9 + chip1 * 0.1})`, display: 'inline-flex', alignItems: 'center', gap: 18 * s, background: 'rgba(255,90,95,0.14)', border: `${2 * s}px solid rgba(255,90,95,0.55)`, borderRadius: 18 * s, padding: `${18 * s}px ${30 * s}px`, width: 'fit-content'}}>
						<span style={{fontSize: 50 * s}}>💔</span>
						<span style={{fontFamily, fontWeight: 900, fontSize: 56 * s, color: theme.accent}}>INFARTOS</span>
					</div>
					<div style={{opacity: Math.min(chip2, 1), transform: `translateX(${(1 - chip2) * 40 * s}px) scale(${0.9 + chip2 * 0.1})`, display: 'inline-flex', alignItems: 'center', gap: 18 * s, background: 'rgba(255,90,95,0.14)', border: `${2 * s}px solid rgba(255,90,95,0.55)`, borderRadius: 18 * s, padding: `${18 * s}px ${30 * s}px`, width: 'fit-content'}}>
						<span style={{fontSize: 50 * s}}>⚠️</span>
						<span style={{fontFamily, fontWeight: 900, fontSize: 56 * s, color: theme.accent}}>MUERTE PREMATURA</span>
					</div>
				</div>

				<div style={{opacity: kO, transform: `translateY(${(1 - kO) * 16 * s}px)`, fontFamily, fontWeight: 700, fontSize: 32 * s, color: theme.textDim, marginTop: 34 * s}}>
					Un piso sin parar = una gran señal de salud
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
