import {
	AbsoluteFill,
	useCurrentFrame,
	interpolate,
	useVideoConfig,
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
const ei = Easing.in(Easing.cubic);

// enter (fade+rise) then hold then optional exit
const rise = (f: number, inAt: number, dur = 12) =>
	interpolate(f, [inAt, inAt + dur], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: eo});

export const LancetStat: React.FC = () => {
	const frame = useCurrentFrame();
	const {width, fps} = useVideoConfig();
	const s = width / 1920;

	// Beats (frames @25fps): B1 source 8-120 | B2 "no es tu edad" 120-250 | B3 "capacidad funcional" 250-end
	// B1 fades out as B2 arrives; B2 shrinks up as B3 arrives.
	const b1o = interpolate(frame, [8, 24, 118, 135], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: eo});

	// B2 "no es tu edad" — appears then gets struck through then fades up/out
	const b2o = interpolate(frame, [128, 145, 250, 268], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const strike = interpolate(frame, [175, 210], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: eo});

	// B3 "capacidad funcional" — spring pop, holds to end
	const b3in = spring({frame: frame - 262, fps, config: {damping: 14, mass: 0.8}});
	const b3o = interpolate(frame, [262, 285], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const subO = rise(frame, 300, 16);

	// gentle continuous zoom on the whole card for life
	const bgScale = interpolate(frame, [0, 500], [1.0, 1.06], {extrapolateRight: 'clamp'});

	return (
		<AbsoluteFill style={{background: theme.fullBg, justifyContent: 'center', alignItems: 'center', overflow: 'hidden'}}>
			<FontFace />
			<AbsoluteFill style={{transform: `scale(${bgScale})`}}>
				<GridBg s={s} />
				<AbsoluteFill style={{backgroundImage: 'radial-gradient(circle at 50% 45%, rgba(6,182,212,0.16), transparent 62%)'}} />
			</AbsoluteFill>

			{/* Source badge — always visible top */}
			<div
				style={{
					position: 'absolute',
					top: 150 * s,
					opacity: interpolate(frame, [8, 26], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					gap: 10 * s,
				}}
			>
				<div
					style={{
						border: `${2 * s}px solid ${theme.panelBorder}`,
						borderRadius: 50 * s,
						padding: `${10 * s}px ${34 * s}px`,
						fontFamily,
						fontWeight: 800,
						fontSize: 28 * s,
						color: theme.c1,
						letterSpacing: 2 * s,
					}}
				>
					📄 ESTUDIO 2024 · THE LANCET HEALTHY LONGEVITY
				</div>
				<div style={{fontFamily, fontWeight: 700, fontSize: 26 * s, color: theme.textDim}}>
					Datos de miles de adultos mayores
				</div>
			</div>

			{/* Center stage */}
			<div style={{position: 'absolute', textAlign: 'center', width: 1500 * s}}>
				{/* B1 kicker */}
				{b1o > 0 && (
					<div style={{opacity: b1o, transform: `translateY(${(1 - b1o) * 20 * s}px)`}}>
						<div style={{fontFamily, fontWeight: 900, fontSize: 66 * s, color: theme.text, lineHeight: 1.2, ...shadow}}>
							¿Qué predice tu independencia<br />y tu <span style={{color: theme.c1}}>mortalidad</span>?
						</div>
					</div>
				)}

				{/* B2 no es tu edad (struck) */}
				{b2o > 0 && (
					<div style={{position: 'absolute', left: 0, right: 0, top: 0, opacity: b2o, transform: `translateY(${(1 - Math.min(b2o, 1)) * 20 * s}px)`}}>
						<div style={{fontFamily, fontWeight: 700, fontSize: 34 * s, color: theme.textDim, letterSpacing: 3 * s, textTransform: 'uppercase'}}>
							No es
						</div>
						<div style={{position: 'relative', display: 'inline-block', marginTop: 8 * s}}>
							<span style={{fontFamily, fontWeight: 900, fontSize: 150 * s, color: theme.textDim, lineHeight: 1}}>TU EDAD</span>
							<span
								style={{
									position: 'absolute',
									left: -10 * s,
									top: '52%',
									height: 10 * s,
									width: `${strike * 108}%`,
									background: theme.accent,
									borderRadius: 5 * s,
									boxShadow: `0 0 ${14 * s}px ${theme.accent}`,
								}}
							/>
						</div>
					</div>
				)}

				{/* B3 capacidad funcional */}
				{b3o > 0 && (
					<div style={{position: 'absolute', left: 0, right: 0, top: -40 * s, opacity: b3o, transform: `scale(${0.7 + b3in * 0.3})`}}>
						<div style={{fontFamily, fontWeight: 700, fontSize: 34 * s, color: theme.c1, letterSpacing: 3 * s, textTransform: 'uppercase'}}>
							Es tu
						</div>
						<div style={{fontFamily, fontWeight: 900, fontSize: 148 * s, color: theme.c1, lineHeight: 1.02, marginTop: 6 * s, textShadow: `0 0 ${40 * s}px rgba(34,211,238,0.45)`}}>
							CAPACIDAD<br />FUNCIONAL
						</div>
						<div style={{opacity: subO, transform: `translateY(${(1 - subO) * 18 * s}px)`, fontFamily, fontWeight: 700, fontSize: 36 * s, color: theme.text, marginTop: 24 * s}}>
							Todo lo que tu cuerpo y tu mente<br />todavía pueden hacer
						</div>
					</div>
				)}
			</div>

			{/* Watermark */}
			<div style={{position: 'absolute', bottom: 44 * s, left: 54 * s, display: 'flex', alignItems: 'center', gap: 12 * s, opacity: 0.85}}>
				<span style={{fontSize: 34 * s}}>🩺</span>
				<span style={{fontFamily, fontWeight: 800, fontSize: 30 * s, color: theme.text, letterSpacing: 1 * s, ...shadow}}>DRA. LAURA</span>
			</div>
		</AbsoluteFill>
	);
};
