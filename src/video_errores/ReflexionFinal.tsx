import {
	AbsoluteFill,
	OffthreadVideo,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
	interpolate,
} from 'remotion';
import {theme, lifecycle, animIn, shadow, panelStyle, EASE_OUT, EASE_IN} from './theme';

const fontFamily = 'Montserrat';
const FontFace: React.FC = () => (
	<style>{`@font-face{font-family:'Montserrat';font-style:normal;font-weight:100 900;font-display:block;src:url('${staticFile(
		'fonts/Montserrat.ttf'
	)}') format('truetype');}`}</style>
);

const zoom = (f: number) => {
	const pts = [
		[0, 1.0],
		[145, 1.05],
		[150, 1.0],
		[300, 1.0],
		[505, 1.05],
		[510, 1.0],
		[750, 1.0],
	];
	for (let i = 0; i < pts.length - 1; i++) {
		const [f0, s0] = pts[i];
		const [f1, s1] = pts[i + 1];
		if (f >= f0 && f <= f1) {
			return interpolate(f, [f0, f1], [s0, s1], {
				easing: s1 >= s0 ? EASE_OUT : EASE_IN,
				extrapolateLeft: 'clamp',
				extrapolateRight: 'clamp',
			});
		}
	}
	return 1.0;
};

const Kicker: React.FC<{s: number; children: React.ReactNode; color?: string}> = ({s, children, color}) => (
	<div style={{fontFamily, fontWeight: 700, fontSize: 26 * s, letterSpacing: 3 * s, textTransform: 'uppercase', color: color ?? theme.c1, ...shadow}}>
		{children}
	</div>
);

const GridBg: React.FC<{s: number}> = ({s}) => (
	<AbsoluteFill
		style={{
			backgroundImage:
				'linear-gradient(rgba(56,189,217,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,217,0.08) 1px, transparent 1px)',
			backgroundSize: `${70 * s}px ${70 * s}px`,
			opacity: 0.6,
		}}
	/>
);

const SidePanel: React.FC<{s: number; o: number; side: 'left' | 'right'; top: number; children: React.ReactNode}> = ({s, o, side, top, children}) => (
	<div
		style={{
			position: 'absolute',
			[side]: side === 'left' ? 90 * s : 70 * s,
			top: top * s,
			opacity: o,
			transform: `translateX(${(1 - o) * (side === 'left' ? -50 : 50) * s}px)`,
			...panelStyle(s),
			padding: `${22 * s}px ${34 * s}px`,
			maxWidth: 600 * s,
			display: 'flex',
			flexDirection: 'column',
			gap: 8 * s,
		}}
	>
		{children}
	</div>
);

export const ReflexionFinal: React.FC = () => {
	const frame = useCurrentFrame();
	const {width} = useVideoConfig();
	const s = width / 1920;
	const sc = zoom(frame);

	const s2 = lifecycle(frame, 150, 300, 7);     // indicador (6-12s)
	const s4 = frame >= 510 && frame < 668 ? animIn(frame, 514, 12) : 0; // suscribete (20.4-26.6s)
	const s5 = frame >= 668 ? animIn(frame, 672, 12) : 0; // brand outro (26.7s+)

	const fsActive = (frame >= 150 && frame <= 300) || frame >= 510;
	const wmVisible = !fsActive;

	return (
		<AbsoluteFill style={{backgroundColor: '#000'}}>
			<FontFace />
			<AbsoluteFill style={{transform: `scale(${sc})`, transformOrigin: '50% 29%'}}>
				<OffthreadVideo src={staticFile('reflexion_intro.mp4')} />
			</AbsoluteFill>

			{/* S1 overlay right — no es un lujo (1.2-5.2s) */}
			{(() => {
				const o = lifecycle(frame, 30, 130, 9);
				if (o <= 0) return null;
				return (
					<SidePanel s={s} o={o} side="right" top={150}>
						<div style={{fontFamily, fontWeight: 900, fontSize: 44 * s, color: theme.text, lineHeight: 1.1, ...shadow}}>
							Tu salud sexual<br /><span style={{color: theme.c1}}>no es un lujo</span>
						</div>
					</SidePanel>
				);
			})()}

			{/* S2 FULL — indicador de tu salud (6-12s) */}
			{s2 > 0 && (
				<AbsoluteFill style={{opacity: s2, background: theme.fullBg, justifyContent: 'center', alignItems: 'center'}}>
					<GridBg s={s} />
					<div style={{textAlign: 'center', transform: `scale(${0.92 + s2 * 0.08})`}}>
						<Kicker s={s}>Es un indicador de tu</Kicker>
						<div style={{fontFamily, fontWeight: 900, fontSize: 78 * s, color: theme.text, lineHeight: 1.15, marginTop: 14 * s}}>
							CORAZÓN · ARTERIAS<br /><span style={{color: theme.c1}}>HORMONAS · BIENESTAR</span>
						</div>
					</div>
				</AbsoluteFill>
			)}

			{/* S3 overlay left — like y comparte (14.4-19.6s) */}
			{(() => {
				const o = lifecycle(frame, 360, 490, 9);
				if (o <= 0) return null;
				return (
					<SidePanel s={s} o={o} side="left" top={250}>
						<span style={{fontSize: 46 * s}}>👍</span>
						<div style={{fontFamily, fontWeight: 900, fontSize: 46 * s, color: theme.text, lineHeight: 1.05, ...shadow}}>
							Dale <span style={{color: theme.c1}}>like</span><br />y compártelo
						</div>
					</SidePanel>
				);
			})()}

			{/* S4 FULL — SUSCRÍBETE CTA (20.4-26.6s) */}
			{s4 > 0 && (
				<AbsoluteFill style={{opacity: s4, background: theme.fullBg, justifyContent: 'center', alignItems: 'center'}}>
					<GridBg s={s} />
					<AbsoluteFill style={{backgroundImage: 'radial-gradient(circle at 50% 42%, rgba(6,182,212,0.18), transparent 60%)'}} />
					<div style={{textAlign: 'center', transform: `scale(${0.9 + s4 * 0.1})`}}>
						<div style={{fontSize: 84 * s, marginBottom: 4 * s}}>🔔</div>
						<div style={{fontFamily, fontWeight: 900, fontSize: 104 * s, color: theme.text, lineHeight: 1}}>
							SUSCRÍBETE
						</div>
						<div style={{fontFamily, fontWeight: 700, fontSize: 34 * s, color: theme.textDim, marginTop: 14 * s}}>
							Cada semana · contenido basado en ciencia real
						</div>
						<div style={{marginTop: 30 * s, display: 'inline-flex', alignItems: 'center', gap: 16 * s, background: '#ff0000', borderRadius: 60 * s, padding: `${20 * s}px ${52 * s}px`, boxShadow: `0 ${8 * s}px ${30 * s}px rgba(255,0,0,0.4)`}}>
							<span style={{fontSize: 34 * s, color: '#fff'}}>▶</span>
							<span style={{fontFamily, fontWeight: 900, fontSize: 40 * s, color: '#fff', letterSpacing: 2 * s}}>DRA. LAURA JIMÉNEZ</span>
						</div>
					</div>
				</AbsoluteFill>
			)}

			{/* S5 FULL — brand outro (26.7s+) */}
			{s5 > 0 && (
				<AbsoluteFill style={{opacity: s5, background: theme.fullBg, justifyContent: 'center', alignItems: 'center'}}>
					<GridBg s={s} />
					<div style={{textAlign: 'center', transform: `translateY(${(1 - s5) * 24 * s}px)`}}>
						<div style={{fontSize: 70 * s, marginBottom: 10 * s}}>🩺</div>
						<div style={{fontFamily, fontWeight: 900, fontSize: 84 * s, color: theme.text, lineHeight: 1}}>
							DRA. LAURA JIMÉNEZ
						</div>
						<div style={{marginTop: 18 * s, display: 'inline-block', background: theme.grad, borderRadius: 40 * s, padding: `${12 * s}px ${34 * s}px`, fontFamily, fontWeight: 800, fontSize: 32 * s, color: '#fff', letterSpacing: 3 * s}}>
							SALUD DESPUÉS DE LOS 50
						</div>
						<div style={{fontFamily, fontWeight: 700, fontSize: 34 * s, color: theme.textDim, marginTop: 24 * s}}>
							Nos vemos en el próximo video 👋
						</div>
					</div>
				</AbsoluteFill>
			)}

			{/* Watermark */}
			{wmVisible && (
				<div style={{position: 'absolute', bottom: 44 * s, left: 54 * s, display: 'flex', alignItems: 'center', gap: 12 * s, opacity: 0.9}}>
					<span style={{fontSize: 34 * s}}>🩺</span>
					<span style={{fontFamily, fontWeight: 800, fontSize: 30 * s, color: theme.text, letterSpacing: 1 * s, ...shadow}}>
						DRA. LAURA
					</span>
				</div>
			)}
		</AbsoluteFill>
	);
};
