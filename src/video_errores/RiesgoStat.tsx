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

export const RiesgoStat: React.FC = () => {
	const frame = useCurrentFrame();
	const {width, fps} = useVideoConfig();
	const s = width / 1920;

	const bgScale = interpolate(frame, [0, 500], [1.0, 1.06], {extrapolateRight: 'clamp'});

	// Badge always on top
	const badge = interpolate(frame, [8, 28], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	// Two columns (comparison) — appear 40-320, then fade up/out for conclusion
	const colsO = interpolate(frame, [40, 60, 300, 320], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const colR = spring({frame: frame - 55, fps, config: {damping: 14, mass: 0.8}}); // ❌ red col
	const colG = spring({frame: frame - 85, fps, config: {damping: 14, mass: 0.8}}); // ✅ green col

	// Conclusion 330-end
	const conO = interpolate(frame, [330, 352], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const conPop = spring({frame: frame - 330, fps, config: {damping: 13, mass: 0.9}});
	const subO = rise(frame, 372, 16);

	const Column: React.FC<{
		o: number;
		pop: number;
		x: number;
		icon: string;
		top: string;
		big: string;
		color: string;
		border: string;
	}> = ({o, pop, x, icon, top, big, color, border}) => (
		<div
			style={{
				opacity: o,
				transform: `translateX(${x}px) scale(${0.85 + pop * 0.15})`,
				width: 620 * s,
				background: 'rgba(9,24,44,0.75)',
				border: `${2 * s}px solid ${border}`,
				borderRadius: 28 * s,
				padding: `${40 * s}px ${30 * s}px`,
				textAlign: 'center',
				boxShadow: `0 ${12 * s}px ${44 * s}px rgba(0,0,0,0.45)`,
			}}
		>
			<div style={{fontSize: 86 * s}}>{icon}</div>
			<div style={{fontFamily, fontWeight: 800, fontSize: 40 * s, color: theme.text, marginTop: 10 * s, lineHeight: 1.15, whiteSpace: 'pre-line'}}>{top}</div>
			<div style={{width: '70%', height: 2 * s, background: 'rgba(255,255,255,0.15)', margin: `${24 * s}px auto`}} />
			<div style={{fontFamily, fontWeight: 900, fontSize: 60 * s, color, lineHeight: 1.05, whiteSpace: 'pre-line'}}>{big}</div>
		</div>
	);

	return (
		<AbsoluteFill style={{background: theme.fullBg, justifyContent: 'center', alignItems: 'center', overflow: 'hidden'}}>
			<FontFace />
			<AbsoluteFill style={{transform: `scale(${bgScale})`}}>
				<GridBg s={s} />
				<AbsoluteFill style={{backgroundImage: 'radial-gradient(circle at 50% 45%, rgba(6,182,212,0.14), transparent 62%)'}} />
			</AbsoluteFill>

			{/* Source badge */}
			<div style={{position: 'absolute', top: 130 * s, opacity: badge, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 * s}}>
				<div style={{border: `${2 * s}px solid ${theme.panelBorder}`, borderRadius: 50 * s, padding: `${10 * s}px ${34 * s}px`, fontFamily, fontWeight: 800, fontSize: 27 * s, color: theme.c1, letterSpacing: 2 * s}}>
					❤️ CARDIOLOGÍA PREVENTIVA
				</div>
				<div style={{fontFamily, fontWeight: 700, fontSize: 26 * s, color: theme.textDim}}>La prueba de levantarse sin apoyo</div>
			</div>

			{/* Comparison columns */}
			{colsO > 0 && (
				<div style={{position: 'absolute', display: 'flex', gap: 50 * s, opacity: colsO, marginTop: 40 * s}}>
					<Column o={1} pop={colR} x={(1 - colR) * -40 * s} icon="❌" top={'No puede levantarse\nsin apoyo'} big={'MAYOR RIESGO\nde morir'} color={theme.accent} border={'rgba(255,90,95,0.55)'} />
					<Column o={1} pop={colG} x={(1 - colG) * 40 * s} icon="✅" top={'Se levanta\nsin apoyo'} big={'MENOR RIESGO\nmás años'} color={theme.c1} border={'rgba(56,189,217,0.55)'} />
				</div>
			)}

			{/* Conclusion */}
			{conO > 0 && (
				<div style={{position: 'absolute', textAlign: 'center', opacity: conO, transform: `scale(${0.8 + conPop * 0.2})`, maxWidth: 1550 * s}}>
					<div style={{fontFamily, fontWeight: 700, fontSize: 34 * s, color: theme.c1, letterSpacing: 3 * s, textTransform: 'uppercase'}}>Lo confirmó la ciencia</div>
					<div style={{fontFamily, fontWeight: 900, fontSize: 92 * s, color: theme.text, lineHeight: 1.08, marginTop: 14 * s, ...shadow}}>
						Levantarte sin manos<br /><span style={{color: theme.c1}}>predice tu longevidad</span>
					</div>
					<div style={{opacity: subO, transform: `translateY(${(1 - subO) * 18 * s}px)`, fontFamily, fontWeight: 700, fontSize: 34 * s, color: theme.textDim, marginTop: 24 * s}}>
						No es fuerza de gimnasio: es tu esperanza de vida
					</div>
				</div>
			)}

			{/* Watermark */}
			<div style={{position: 'absolute', bottom: 44 * s, left: 54 * s, display: 'flex', alignItems: 'center', gap: 12 * s, opacity: 0.85}}>
				<span style={{fontSize: 34 * s}}>🩺</span>
				<span style={{fontFamily, fontWeight: 800, fontSize: 30 * s, color: theme.text, letterSpacing: 1 * s, ...shadow}}>DRA. LAURA</span>
			</div>
		</AbsoluteFill>
	);
};
