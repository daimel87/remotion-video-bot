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

export const OmsStat: React.FC = () => {
	const frame = useCurrentFrame();
	const {width, fps} = useVideoConfig();
	const s = width / 1920;

	const bgScale = interpolate(frame, [0, 500], [1.0, 1.06], {extrapolateRight: 'clamp'});
	const badge = interpolate(frame, [8, 28], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	// B1: 150 min count-up 30-190
	const b1o = interpolate(frame, [30, 50, 195, 215], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const count = Math.round(interpolate(frame, [45, 120], [0, 150], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: eo}));
	const numPop = spring({frame: frame - 45, fps, config: {damping: 12, mass: 0.9}});

	// B2: pero la realidad… 1 de cada 3 (225-end)
	const b2o = interpolate(frame, [225, 245], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	// three figures pop
	const figSp = (i: number) => spring({frame: frame - (255 + i * 16), fps, config: {damping: 13, mass: 0.7}});
	const concO = rise(frame, 360, 16);

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
					🌍 ORGANIZACIÓN MUNDIAL DE LA SALUD
				</div>
			</div>

			{/* B1 — 150 minutos */}
			{b1o > 0 && (
				<div style={{position: 'absolute', textAlign: 'center', opacity: b1o}}>
					<div style={{fontFamily, fontWeight: 700, fontSize: 40 * s, color: theme.textDim}}>Recomienda al menos</div>
					<div style={{fontFamily, fontWeight: 900, fontSize: 300 * s, color: theme.c1, lineHeight: 1, transform: `scale(${0.85 + numPop * 0.15})`, textShadow: `0 0 ${50 * s}px rgba(34,211,238,0.45)`}}>
						{count}
					</div>
					<div style={{fontFamily, fontWeight: 900, fontSize: 54 * s, color: theme.text, marginTop: 4 * s}}>MINUTOS DE ACTIVIDAD / SEMANA</div>
				</div>
			)}

			{/* B2 — 1 de cada 3 */}
			{b2o > 0 && (
				<div style={{position: 'absolute', textAlign: 'center', opacity: b2o}}>
					<div style={{fontFamily, fontWeight: 700, fontSize: 38 * s, color: theme.accent, letterSpacing: 2 * s, textTransform: 'uppercase', marginBottom: 34 * s}}>
						Pero la realidad…
					</div>
					<div style={{display: 'flex', gap: 40 * s, justifyContent: 'center', marginBottom: 30 * s}}>
						{[0, 1, 2].map((i) => {
							const sp = figSp(i);
							const active = i === 0;
							return (
								<div
									key={i}
									style={{
										fontSize: 170 * s,
										opacity: Math.min(sp, 1),
										transform: `translateY(${(1 - sp) * 40 * s}px) scale(${0.8 + sp * 0.2})`,
										filter: active ? 'none' : 'grayscale(1) brightness(0.55)',
									}}
								>
									{active ? '🚶' : '🧍'}
								</div>
							);
						})}
					</div>
					<div style={{fontFamily, fontWeight: 900, fontSize: 70 * s, color: theme.text, lineHeight: 1.1}}>
						Menos de <span style={{color: theme.accent}}>1 de cada 3</span>
					</div>
					<div style={{opacity: concO, transform: `translateY(${(1 - concO) * 16 * s}px)`, fontFamily, fontWeight: 700, fontSize: 40 * s, color: theme.textDim, marginTop: 18 * s}}>
						mayores de 70 lo cumple
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
