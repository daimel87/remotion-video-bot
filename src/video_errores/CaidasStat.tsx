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

export const CaidasStat: React.FC = () => {
	const frame = useCurrentFrame();
	const {width, fps} = useVideoConfig();
	const s = width / 1920;

	const bgScale = interpolate(frame, [0, 500], [1.0, 1.06], {extrapolateRight: 'clamp'});
	const badge = interpolate(frame, [8, 28], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	// B1 headline 30-150: caidas = principal causa de lesiones fatales +65
	const h1 = rise(frame, 40, 14);
	const numPop = spring({frame: frame - 70, fps, config: {damping: 12, mass: 0.9}});
	const h1out = interpolate(frame, [178, 200], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	// B2 chips: agacharse / girar / levantarse (208-...)
	const chipsWrap = interpolate(frame, [208, 226, 330, 350], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const chipSp = (i: number) => spring({frame: frame - (222 + i * 22), fps, config: {damping: 13, mass: 0.7}});

	// B3 conclusion 360-end: no en actividades peligrosas, en la vida diaria
	const conO = interpolate(frame, [360, 382], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const conPop = spring({frame: frame - 360, fps, config: {damping: 13, mass: 0.9}});
	const subO = rise(frame, 402, 16);

	const chips = [
		{i: 'stooping', icon: '🧎', t: 'AGACHARSE'},
		{i: 'turn', icon: '🔄', t: 'GIRAR'},
		{i: 'rise', icon: '🪑', t: 'LEVANTARSE'},
	];

	return (
		<AbsoluteFill style={{background: theme.fullBg, justifyContent: 'center', alignItems: 'center', overflow: 'hidden'}}>
			<FontFace />
			<AbsoluteFill style={{transform: `scale(${bgScale})`}}>
				<GridBg s={s} />
				<AbsoluteFill style={{backgroundImage: 'radial-gradient(circle at 50% 45%, rgba(255,90,95,0.12), transparent 62%)'}} />
			</AbsoluteFill>

			{/* Source badge */}
			<div style={{position: 'absolute', top: 130 * s, opacity: badge, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 * s}}>
				<div style={{border: `${2 * s}px solid rgba(255,90,95,0.5)`, borderRadius: 50 * s, padding: `${10 * s}px ${34 * s}px`, fontFamily, fontWeight: 800, fontSize: 27 * s, color: theme.accent, letterSpacing: 2 * s}}>
					⚠️ ADULTOS MAYORES DE 65
				</div>
			</div>

			{/* B1 — caidas principal causa */}
			{h1 > 0 && h1out > 0 && (
				<div style={{position: 'absolute', textAlign: 'center', opacity: h1 * h1out, transform: `translateY(${(1 - h1) * 24 * s}px)`, maxWidth: 1550 * s}}>
					<div style={{fontSize: 90 * s}}>🚨</div>
					<div style={{fontFamily, fontWeight: 700, fontSize: 40 * s, color: theme.textDim, marginTop: 6 * s}}>Las caídas son la</div>
					<div style={{fontFamily, fontWeight: 900, fontSize: 96 * s, color: theme.accent, lineHeight: 1.05, marginTop: 8 * s, transform: `scale(${0.85 + numPop * 0.15})`, textShadow: `0 0 ${40 * s}px rgba(255,90,95,0.4)`}}>
						PRINCIPAL CAUSA
					</div>
					<div style={{fontFamily, fontWeight: 800, fontSize: 44 * s, color: theme.text, marginTop: 8 * s}}>de lesiones fatales a esta edad</div>
				</div>
			)}

			{/* B2 — everyday movement chips */}
			{chipsWrap > 0 && (
				<div style={{position: 'absolute', opacity: chipsWrap, textAlign: 'center'}}>
					<div style={{fontFamily, fontWeight: 700, fontSize: 34 * s, color: theme.c1, letterSpacing: 3 * s, textTransform: 'uppercase', marginBottom: 40 * s}}>
						Y ocurren en movimientos cotidianos
					</div>
					<div style={{display: 'flex', gap: 44 * s, justifyContent: 'center'}}>
						{chips.map((c, i) => {
							const sp = chipSp(i);
							return (
								<div key={c.i} style={{opacity: Math.min(sp, 1), transform: `translateY(${(1 - sp) * 40 * s}px) scale(${0.85 + sp * 0.15})`, width: 400 * s, background: 'rgba(9,24,44,0.75)', border: `${2 * s}px solid ${theme.panelBorder}`, borderRadius: 26 * s, padding: `${36 * s}px ${20 * s}px`}}>
									<div style={{fontSize: 90 * s}}>{c.icon}</div>
									<div style={{fontFamily, fontWeight: 900, fontSize: 46 * s, color: theme.text, marginTop: 10 * s}}>{c.t}</div>
								</div>
							);
						})}
					</div>
				</div>
			)}

			{/* B3 — conclusion */}
			{conO > 0 && (
				<div style={{position: 'absolute', textAlign: 'center', opacity: conO, transform: `scale(${0.82 + conPop * 0.18})`, maxWidth: 1550 * s}}>
					<div style={{fontFamily, fontWeight: 900, fontSize: 62 * s, color: theme.textDim, lineHeight: 1.1}}>
						No en actividades peligrosas
					</div>
					<div style={{fontFamily, fontWeight: 900, fontSize: 104 * s, color: theme.c1, lineHeight: 1.05, marginTop: 14 * s, textShadow: `0 0 ${40 * s}px rgba(34,211,238,0.4)`}}>
						EN LA VIDA DIARIA
					</div>
					<div style={{opacity: subO, transform: `translateY(${(1 - subO) * 18 * s}px)`, fontFamily, fontWeight: 700, fontSize: 34 * s, color: theme.text, marginTop: 26 * s}}>
						Por eso mantener el equilibrio importa tanto
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
