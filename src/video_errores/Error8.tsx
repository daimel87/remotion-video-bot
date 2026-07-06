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
		[340, 1.05],
		[345, 1.0],
		[470, 1.0],
		[615, 1.05],
		[620, 1.0],
		[745, 1.0],
		[1000, 1.05],
		[1265, 1.06],
		[1270, 1.0],
		[1536, 1.0],
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

export const Error8: React.FC = () => {
	const frame = useCurrentFrame();
	const {width} = useVideoConfig();
	const s = width / 1920;
	const sc = zoom(frame);

	const s1 = lifecycle(frame, 0, 95, 8);        // title (0-6s)
	const s4 = lifecycle(frame, 345, 470, 6);     // anillos metal (13.8-18.8s)
	const s6 = lifecycle(frame, 620, 745, 6);     // emergencia (24.8-29.8s)
	const s10 = frame >= 1270 ? animIn(frame, 1274, 12) : 0; // error 9 (50.8s+)

	const fsActive =
		(frame >= 0 && frame <= 95) ||
		(frame >= 345 && frame <= 470) ||
		(frame >= 620 && frame <= 745) ||
		frame >= 1270;
	const wmVisible = !fsActive;

	return (
		<AbsoluteFill style={{backgroundColor: '#000'}}>
			<FontFace />
			<AbsoluteFill style={{transform: `scale(${sc})`, transformOrigin: '50% 29%'}}>
				<OffthreadVideo src={staticFile('error8_intro.mp4')} />
			</AbsoluteFill>

			{/* S1 FULL title */}
			{s1 > 0 && (
				<AbsoluteFill style={{opacity: s1, background: theme.fullBg, justifyContent: 'center', alignItems: 'center'}}>
					<GridBg s={s} />
					<div style={{textAlign: 'center', transform: `translateY(${(1 - s1) * 30 * s}px)`}}>
						<div style={{display: 'inline-block', background: theme.accent, borderRadius: 12 * s, padding: `${8 * s}px ${28 * s}px`, fontFamily, fontWeight: 900, fontSize: 34 * s, color: '#fff', letterSpacing: 4 * s, marginBottom: 24 * s}}>
							ERROR #8
						</div>
						<div style={{fontFamily, fontWeight: 900, fontSize: 90 * s, color: theme.text, lineHeight: 1.02, maxWidth: 1500 * s}}>
							LOS TRUCOS CASEROS<br /><span style={{color: theme.c1}}>DE INTERNET</span>
						</div>
					</div>
				</AbsoluteFill>
			)}

			{/* S2 overlay right — soluciones milagrosas (4-9s) */}
			{(() => {
				const o = lifecycle(frame, 100, 230, 9);
				if (o <= 0) return null;
				return (
					<SidePanel s={s} o={o} side="right" top={150}>
						<span style={{fontSize: 44 * s}}>❌</span>
						<div style={{fontFamily, fontWeight: 900, fontSize: 46 * s, color: theme.text, lineHeight: 1.08, ...shadow}}>
							Soluciones<br /><span style={{color: theme.accent}}>milagrosas</span>
						</div>
					</SidePanel>
				);
			})()}

			{/* S3 overlay left — aceites cremas estiramientos (10-13.2s) */}
			{(() => {
				const o = lifecycle(frame, 250, 330, 8);
				if (o <= 0) return null;
				return (
					<SidePanel s={s} o={o} side="left" top={250}>
						<div style={{fontFamily, fontWeight: 900, fontSize: 40 * s, color: theme.text, lineHeight: 1.25, ...shadow}}>
							Aceites · cremas<br />estiramientos agresivos
						</div>
					</SidePanel>
				);
			})()}

			{/* S4 FULL — anillos de metal (13.8-18.8s) */}
			{s4 > 0 && (
				<AbsoluteFill style={{opacity: s4, background: theme.fullBg, justifyContent: 'center', alignItems: 'center'}}>
					<GridBg s={s} />
					<AbsoluteFill style={{backgroundImage: 'radial-gradient(circle at 50% 45%, rgba(255,90,95,0.16), transparent 60%)'}} />
					<div style={{textAlign: 'center', transform: `scale(${0.92 + s4 * 0.08})`}}>
						<div style={{fontSize: 76 * s, marginBottom: 8 * s}}>⛓️</div>
						<div style={{fontFamily, fontWeight: 900, fontSize: 100 * s, color: theme.accent, lineHeight: 1.05}}>
							ANILLOS DE METAL
						</div>
						<div style={{fontFamily, fontWeight: 800, fontSize: 46 * s, color: theme.text, marginTop: 8 * s}}>IMPROVISADOS</div>
					</div>
				</AbsoluteFill>
			)}

			{/* S5 overlay right — urgencias atascados (19.6-24s) */}
			{(() => {
				const o = lifecycle(frame, 490, 600, 9);
				if (o <= 0) return null;
				return (
					<SidePanel s={s} o={o} side="right" top={200}>
						<span style={{fontSize: 44 * s}}>🚨</span>
						<div style={{fontFamily, fontWeight: 900, fontSize: 44 * s, color: theme.text, lineHeight: 1.08, ...shadow}}>
							Terminan en <span style={{color: theme.accent}}>urgencias</span><br />atascados
						</div>
					</SidePanel>
				);
			})()}

			{/* S6 FULL — emergencia medica (24.8-29.8s) */}
			{s6 > 0 && (
				<AbsoluteFill style={{opacity: s6, background: theme.fullBg, justifyContent: 'center', alignItems: 'center'}}>
					<GridBg s={s} />
					<div style={{textAlign: 'center', transform: `scale(${0.92 + s6 * 0.08})`}}>
						<div style={{fontSize: 76 * s, marginBottom: 6 * s}}>⚠️</div>
						<div style={{fontFamily, fontWeight: 900, fontSize: 96 * s, color: theme.accent, lineHeight: 1.05}}>
							EMERGENCIA<br />MÉDICA
						</div>
					</div>
				</AbsoluteFill>
			)}

			{/* S7 overlay left — tejido delicado (30.4-36s) */}
			{(() => {
				const o = lifecycle(frame, 760, 905, 9);
				if (o <= 0) return null;
				return (
					<SidePanel s={s} o={o} side="left" top={260}>
						<div style={{fontFamily, fontWeight: 900, fontSize: 46 * s, color: theme.text, lineHeight: 1.08, ...shadow}}>
							El tejido eréctil<br />es <span style={{color: theme.accent}}>delicado</span>
						</div>
					</SidePanel>
				);
			})()}

			{/* S8 overlay right — cicatrices curvatura (36.8-44s) */}
			{(() => {
				const o = lifecycle(frame, 920, 1100, 10);
				if (o <= 0) return null;
				return (
					<SidePanel s={s} o={o} side="right" top={220}>
						<span style={{fontSize: 40 * s}}>⚠️</span>
						<div style={{fontFamily, fontWeight: 900, fontSize: 42 * s, color: theme.text, lineHeight: 1.12, ...shadow}}>
							Cicatrices internas<br /><span style={{color: theme.accent}}>curvatura dolorosa</span>
						</div>
					</SidePanel>
				);
			})()}

			{/* S9 overlay left — habla con un medico (44.6-51s) */}
			{(() => {
				const o = lifecycle(frame, 1115, 1255, 9);
				if (o <= 0) return null;
				return (
					<SidePanel s={s} o={o} side="left" top={250}>
						<span style={{fontSize: 44 * s}}>🩺</span>
						<div style={{fontFamily, fontWeight: 900, fontSize: 42 * s, color: theme.text, lineHeight: 1.12, ...shadow}}>
							Habla con un <span style={{color: theme.c1}}>médico</span><br />no con un foro anónimo
						</div>
					</SidePanel>
				);
			})()}

			{/* S10 FULL open-loop — error 9 (50.8s+) */}
			{s10 > 0 && (
				<AbsoluteFill style={{opacity: s10, background: theme.fullBg, justifyContent: 'center', alignItems: 'center'}}>
					<GridBg s={s} />
					<AbsoluteFill style={{backgroundImage: 'radial-gradient(circle at 50% 45%, rgba(255,90,95,0.16), transparent 60%)'}} />
					<div style={{textAlign: 'center', transform: `scale(${0.92 + s10 * 0.08})`, maxWidth: 1550 * s}}>
						<Kicker s={s} color={theme.accent}>El error #9…</Kicker>
						<div style={{fontFamily, fontWeight: 900, fontSize: 84 * s, color: theme.text, lineHeight: 1.05, marginTop: 12 * s}}>
							NO ESTÁ EN TU CUERPO<br />ESTÁ EN TU <span style={{color: theme.accent}}>CABEZA</span>
						</div>
						<div style={{fontFamily, fontWeight: 700, fontSize: 32 * s, color: theme.textDim, marginTop: 20 * s}}>
							…y sabotea a hombres sanos 👀
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
