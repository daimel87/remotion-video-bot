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

export type CosaTitleProps = {
	num: number;
	l1: string; // línea normal (blanca)
	l2: string; // línea destacada (cian)
};

export const CosaTitle: React.FC<CosaTitleProps> = ({num, l1, l2}) => {
	const frame = useCurrentFrame();
	const {width, fps, durationInFrames} = useVideoConfig();
	const s = width / 1920;

	const badge = spring({frame: frame - 4, fps, config: {damping: 13, mass: 0.7}});
	const txt = interpolate(frame, [14, 30], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: eo});
	const out = interpolate(frame, [durationInFrames - 12, durationInFrames], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const bgScale = interpolate(frame, [0, durationInFrames], [1.0, 1.05], {extrapolateRight: 'clamp'});

	return (
		<AbsoluteFill style={{background: theme.fullBg, justifyContent: 'center', alignItems: 'center', overflow: 'hidden', opacity: out}}>
			<FontFace />
			<AbsoluteFill style={{transform: `scale(${bgScale})`}}>
				<GridBg s={s} />
				<AbsoluteFill style={{backgroundImage: 'radial-gradient(circle at 50% 45%, rgba(6,182,212,0.16), transparent 62%)'}} />
			</AbsoluteFill>

			<div style={{textAlign: 'center', maxWidth: 1550 * s}}>
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
					COSA #{num}
				</div>
				<div
					style={{
						fontFamily,
						fontWeight: 900,
						fontSize: 88 * s,
						color: theme.text,
						lineHeight: 1.08,
						opacity: txt,
						transform: `translateY(${(1 - txt) * 30 * s}px)`,
						...shadow,
					}}
				>
					{l1}
					<br />
					<span style={{color: theme.c1}}>{l2}</span>
				</div>
			</div>

			<div style={{position: 'absolute', bottom: 44 * s, left: 54 * s, display: 'flex', alignItems: 'center', gap: 12 * s, opacity: 0.85}}>
				<span style={{fontSize: 34 * s}}>🩺</span>
				<span style={{fontFamily, fontWeight: 800, fontSize: 30 * s, color: theme.text, letterSpacing: 1 * s, ...shadow}}>DRA. LAURA</span>
			</div>
		</AbsoluteFill>
	);
};

export const COSAS: CosaTitleProps[] = [
	{num: 1, l1: 'Levantarte de una silla', l2: 'sin usar las manos'},
	{num: 2, l1: 'Subir un piso de escaleras', l2: 'sin detenerte'},
	{num: 3, l1: 'Agacharte al piso', l2: 'y levantarte sin ayuda'},
	{num: 4, l1: 'Caminar 30 minutos', l2: 'sin sentarte'},
	{num: 5, l1: 'Recordar tu ayer', l2: 'y tu semana pasada'},
	{num: 6, l1: 'Dormir 6 horas', l2: 'con un solo despertar'},
	{num: 7, l1: 'Seguir una conversación', l2: 'sin perder el hilo'},
	{num: 8, l1: 'Cuidarte por completo', l2: 'sin depender de nadie'},
];
