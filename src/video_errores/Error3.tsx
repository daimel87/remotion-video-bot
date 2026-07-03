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
		[95, 1.0],
		[300, 1.05],
		[510, 1.06],
		[515, 1.0],
		[615, 1.0],
		[900, 1.05],
		[1000, 1.06],
		[1005, 1.0],
		[1120, 1.0],
		[1530, 1.06],
		[1535, 1.0],
		[1784, 1.0],
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
			maxWidth: 560 * s,
			display: 'flex',
			flexDirection: 'column',
			gap: 8 * s,
		}}
	>
		{children}
	</div>
);

export const Error3: React.FC = () => {
	const frame = useCurrentFrame();
	const {width} = useVideoConfig();
	const s = width / 1920;
	const sc = zoom(frame);

	const s1 = lifecycle(frame, 0, 95, 8);        // title
	const s4 = lifecycle(frame, 515, 615, 6);     // 28 años stat (0:20)
	const s8 = lifecycle(frame, 1005, 1120, 8);   // name reveal (0:40)
	const s11 = frame >= 1535 ? animIn(frame, 1539, 12) : 0; // open loop (1:00)

	const fsActive =
		(frame >= 0 && frame <= 95) ||
		(frame >= 515 && frame <= 615) ||
		(frame >= 1005 && frame <= 1120) ||
		frame >= 1535;
	const wmVisible = !fsActive;

	return (
		<AbsoluteFill style={{backgroundColor: '#000'}}>
			<FontFace />
			<AbsoluteFill style={{transform: `scale(${sc})`, transformOrigin: '50% 29%'}}>
				<OffthreadVideo src={staticFile('error3_intro.mp4')} />
			</AbsoluteFill>

			{/* S1 FULL title */}
			{s1 > 0 && (
				<AbsoluteFill style={{opacity: s1, background: theme.fullBg, justifyContent: 'center', alignItems: 'center'}}>
					<GridBg s={s} />
					<div style={{textAlign: 'center', transform: `translateY(${(1 - s1) * 30 * s}px)`}}>
						<div style={{display: 'inline-block', background: theme.accent, borderRadius: 12 * s, padding: `${8 * s}px ${28 * s}px`, fontFamily, fontWeight: 900, fontSize: 34 * s, color: '#fff', letterSpacing: 4 * s, marginBottom: 24 * s}}>
							ERROR #3
						</div>
						<div style={{fontFamily, fontWeight: 900, fontSize: 88 * s, color: theme.text, lineHeight: 1.02, maxWidth: 1500 * s}}>
							LA PORNO COMO<br /><span style={{color: theme.c1}}>ÚNICO ESTÍMULO</span>
						</div>
					</div>
				</AbsoluteFill>
			)}

			{/* S2 overlay right — no es la porno */}
			{(() => {
				const o = lifecycle(frame, 150, 225, 8);
				if (o <= 0) return null;
				return (
					<SidePanel s={s} o={o} side="right" top={150}>
						<Kicker s={s}>El problema real</Kicker>
						<div style={{fontFamily, fontWeight: 900, fontSize: 42 * s, color: theme.text, lineHeight: 1.08, ...shadow}}>
							Usarla como<br /><span style={{color: theme.c1}}>único estímulo</span>
						</div>
					</SidePanel>
				);
			})()}

			{/* S3 overlay left — la realidad pierde */}
			{(() => {
				const o = lifecycle(frame, 410, 500, 8);
				if (o <= 0) return null;
				return (
					<SidePanel s={s} o={o} side="left" top={260}>
						<span style={{fontSize: 44 * s}}>📉</span>
						<div style={{fontFamily, fontWeight: 900, fontSize: 44 * s, color: theme.text, lineHeight: 1.08, ...shadow}}>
							La realidad<br />empieza a <span style={{color: theme.accent}}>perder</span>
						</div>
					</SidePanel>
				);
			})()}

			{/* S4 FULL stat — 28 años */}
			{s4 > 0 && (
				<AbsoluteFill style={{opacity: s4, background: theme.fullBg, justifyContent: 'center', alignItems: 'center'}}>
					<GridBg s={s} />
					<div style={{textAlign: 'center', transform: `scale(${0.9 + s4 * 0.1})`}}>
						<Kicker s={s}>Pacientes de solo</Kicker>
						<div style={{fontFamily, fontWeight: 900, fontSize: 260 * s, color: theme.c1, lineHeight: 1, ...shadow}}>
							28
						</div>
						<div style={{fontFamily, fontWeight: 900, fontSize: 52 * s, color: theme.text, marginTop: 10 * s}}>
							AÑOS · SIN PROBLEMA FÍSICO
						</div>
					</div>
				</AbsoluteFill>
			)}

			{/* S5 overlay left — firme solo */}
			{(() => {
				const o = lifecycle(frame, 640, 720, 9);
				if (o <= 0) return null;
				return (
					<SidePanel s={s} o={o} side="left" top={260}>
						<Kicker s={s} color={theme.accent}>El síntoma clave</Kicker>
						<div style={{fontFamily, fontWeight: 900, fontSize: 42 * s, color: theme.text, lineHeight: 1.08, ...shadow}}>
							Responde solo…<br /><span style={{color: theme.accent}}>no con la pareja</span>
						</div>
					</SidePanel>
				);
			})()}

			{/* S6 overlay right — el cerebro aprende */}
			{(() => {
				const o = lifecycle(frame, 735, 850, 9);
				if (o <= 0) return null;
				return (
					<SidePanel s={s} o={o} side="right" top={200}>
						<span style={{fontSize: 44 * s}}>🧠</span>
						<div style={{fontFamily, fontWeight: 900, fontSize: 46 * s, color: theme.text, lineHeight: 1.05, ...shadow}}>
							El cerebro <span style={{color: theme.c1}}>aprende</span><br />lo que aprende
						</div>
					</SidePanel>
				);
			})()}

			{/* S7 overlay left — contacto insuficiente */}
			{(() => {
				const o = lifecycle(frame, 890, 975, 8);
				if (o <= 0) return null;
				return (
					<SidePanel s={s} o={o} side="left" top={260}>
						<div style={{fontFamily, fontWeight: 900, fontSize: 42 * s, color: theme.text, lineHeight: 1.08, ...shadow}}>
							El contacto real<br />se siente <span style={{color: theme.accent}}>insuficiente</span>
						</div>
					</SidePanel>
				);
			})()}

			{/* S8 FULL name reveal */}
			{s8 > 0 && (
				<AbsoluteFill style={{opacity: s8, background: theme.fullBg, justifyContent: 'center', alignItems: 'center'}}>
					<GridBg s={s} />
					<AbsoluteFill style={{backgroundImage: 'radial-gradient(circle at 50% 45%, rgba(255,90,95,0.16), transparent 60%)'}} />
					<div style={{textAlign: 'center', transform: `translateY(${(1 - s8) * 26 * s}px)`, maxWidth: 1550 * s}}>
						<div style={{display: 'inline-block', border: `${2 * s}px solid ${theme.panelBorder}`, borderRadius: 40 * s, padding: `${8 * s}px ${26 * s}px`, fontFamily, fontWeight: 700, fontSize: 24 * s, color: theme.c1, letterSpacing: 2 * s, marginBottom: 24 * s}}>
							ESTO TIENE NOMBRE
						</div>
						<div style={{fontFamily, fontWeight: 900, fontSize: 76 * s, color: theme.text, lineHeight: 1.05}}>
							DISFUNCIÓN ERÉCTIL<br /><span style={{color: theme.accent}}>INDUCIDA POR PORNOGRAFÍA</span>
						</div>
					</div>
				</AbsoluteFill>
			)}

			{/* S9 overlay right — reduce/recalibra */}
			{(() => {
				const o = lifecycle(frame, 1250, 1410, 10);
				if (o <= 0) return null;
				return (
					<SidePanel s={s} o={o} side="right" top={200}>
						<span style={{fontSize: 44 * s}}>🔄</span>
						<div style={{fontFamily, fontWeight: 900, fontSize: 44 * s, color: theme.text, lineHeight: 1.08, ...shadow}}>
							Reduce el consumo<br />y <span style={{color: theme.c1}}>recalibra</span>
						</div>
					</SidePanel>
				);
			})()}

			{/* S10 overlay left — reversible */}
			{(() => {
				const o = lifecycle(frame, 1455, 1525, 8);
				if (o <= 0) return null;
				return (
					<SidePanel s={s} o={o} side="left" top={280}>
						<span style={{fontSize: 46 * s}}>✅</span>
						<div style={{fontFamily, fontWeight: 900, fontSize: 54 * s, color: theme.text, lineHeight: 1, ...shadow}}>
							Es <span style={{color: theme.c1}}>REVERSIBLE</span>
						</div>
					</SidePanel>
				);
			})()}

			{/* S11 FULL open-loop → ERROR #4 */}
			{s11 > 0 && (
				<AbsoluteFill style={{opacity: s11, background: theme.fullBg, justifyContent: 'center', alignItems: 'center'}}>
					<GridBg s={s} />
					<AbsoluteFill style={{backgroundImage: 'radial-gradient(circle at 50% 45%, rgba(255,90,95,0.16), transparent 60%)'}} />
					<div style={{textAlign: 'center', transform: `scale(${0.92 + s11 * 0.08})`, maxWidth: 1500 * s}}>
						<Kicker s={s} color={theme.accent}>Ahora bien…</Kicker>
						<div style={{fontFamily, fontWeight: 900, fontSize: 92 * s, color: theme.text, lineHeight: 1.02, marginTop: 14 * s}}>
							EL <span style={{color: theme.accent}}>ERROR #4</span><br />ES SILENCIOSO
						</div>
						<div style={{fontFamily, fontWeight: 700, fontSize: 32 * s, color: theme.textDim, marginTop: 22 * s}}>
							…y te está dañando ahora 👀
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
