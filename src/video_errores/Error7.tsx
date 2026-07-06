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
		[285, 1.05],
		[290, 1.0],
		[440, 1.0],
		[700, 1.05],
		[875, 1.06],
		[880, 1.0],
		[1050, 1.0],
		[1285, 1.06],
		[1290, 1.0],
		[1610, 1.0],
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

export const Error7: React.FC = () => {
	const frame = useCurrentFrame();
	const {width} = useVideoConfig();
	const s = width / 1920;
	const sc = zoom(frame);

	const s1 = lifecycle(frame, 0, 95, 8);        // title (0-5.2s)
	const s4 = lifecycle(frame, 290, 440, 6);     // testo->estrogeno (11.6-17.6s)
	const s7 = lifecycle(frame, 880, 1050, 6);    // 8-10 kg (35.2-42s)
	const s10 = frame >= 1290 ? animIn(frame, 1294, 12) : 0; // error 8 (51.6s+)

	const fsActive =
		(frame >= 0 && frame <= 95) ||
		(frame >= 290 && frame <= 440) ||
		(frame >= 880 && frame <= 1050) ||
		frame >= 1290;
	const wmVisible = !fsActive;

	return (
		<AbsoluteFill style={{backgroundColor: '#000'}}>
			<FontFace />
			<AbsoluteFill style={{transform: `scale(${sc})`, transformOrigin: '50% 29%'}}>
				<OffthreadVideo src={staticFile('error7_intro.mp4')} />
			</AbsoluteFill>

			{/* S1 FULL title */}
			{s1 > 0 && (
				<AbsoluteFill style={{opacity: s1, background: theme.fullBg, justifyContent: 'center', alignItems: 'center'}}>
					<GridBg s={s} />
					<div style={{textAlign: 'center', transform: `translateY(${(1 - s1) * 30 * s}px)`}}>
						<div style={{display: 'inline-block', background: theme.accent, borderRadius: 12 * s, padding: `${8 * s}px ${28 * s}px`, fontFamily, fontWeight: 900, fontSize: 34 * s, color: '#fff', letterSpacing: 4 * s, marginBottom: 24 * s}}>
							ERROR #7
						</div>
						<div style={{fontFamily, fontWeight: 900, fontSize: 92 * s, color: theme.text, lineHeight: 1.02, maxWidth: 1500 * s}}>
							LA GRASA<br /><span style={{color: theme.c1}}>ABDOMINAL</span>
						</div>
					</div>
				</AbsoluteFill>
			)}

			{/* S2 overlay right — no es estético (4-8.4s) */}
			{(() => {
				const o = lifecycle(frame, 100, 210, 9);
				if (o <= 0) return null;
				return (
					<SidePanel s={s} o={o} side="right" top={150}>
						<div style={{fontFamily, fontWeight: 900, fontSize: 46 * s, color: theme.text, lineHeight: 1.08, ...shadow}}>
							No es solo un<br />problema <span style={{color: theme.c1}}>estético</span>
						</div>
					</SidePanel>
				);
			})()}

			{/* S3 overlay left — grasa visceral (8.6-11.4s) */}
			{(() => {
				const o = lifecycle(frame, 215, 285, 8);
				if (o <= 0) return null;
				return (
					<SidePanel s={s} o={o} side="left" top={260}>
						<span style={{fontSize: 44 * s}}>⚠️</span>
						<div style={{fontFamily, fontWeight: 900, fontSize: 46 * s, color: theme.text, lineHeight: 1.08, ...shadow}}>
							La grasa <span style={{color: theme.accent}}>visceral</span><br />del abdomen
						</div>
					</SidePanel>
				);
			})()}

			{/* S4 FULL — testosterona -> estrogeno (11.6-17.6s) */}
			{s4 > 0 && (
				<AbsoluteFill style={{opacity: s4, background: theme.fullBg, justifyContent: 'center', alignItems: 'center'}}>
					<GridBg s={s} />
					<AbsoluteFill style={{backgroundImage: 'radial-gradient(circle at 50% 45%, rgba(255,90,95,0.16), transparent 60%)'}} />
					<div style={{textAlign: 'center', transform: `scale(${0.92 + s4 * 0.08})`}}>
						<Kicker s={s} color={theme.accent}>Convierte tu</Kicker>
						<div style={{fontFamily, fontWeight: 900, fontSize: 96 * s, color: theme.text, lineHeight: 1.1, marginTop: 14 * s}}>
							TESTOSTERONA<br /><span style={{color: theme.accent}}>→ ESTRÓGENO</span>
						</div>
					</div>
				</AbsoluteFill>
			)}

			{/* S5 overlay right — mas grasa menos testo (19.6-22.4s) */}
			{(() => {
				const o = lifecycle(frame, 490, 560, 8);
				if (o <= 0) return null;
				return (
					<SidePanel s={s} o={o} side="right" top={200}>
						<div style={{fontFamily, fontWeight: 900, fontSize: 48 * s, color: theme.text, lineHeight: 1.1, ...shadow}}>
							+ grasa<br /><span style={{color: theme.accent}}>− testosterona</span>
						</div>
					</SidePanel>
				);
			})()}

			{/* S6 overlay left — insulina/inflamacion/vascular (27.2-34.4s) */}
			{(() => {
				const o = lifecycle(frame, 680, 860, 10);
				if (o <= 0) return null;
				return (
					<SidePanel s={s} o={o} side="left" top={230}>
						<Kicker s={s} color={theme.accent}>También trae</Kicker>
						<div style={{fontFamily, fontWeight: 900, fontSize: 40 * s, color: theme.text, lineHeight: 1.25, ...shadow}}>
							Resistencia a la insulina<br />Inflamación crónica<br />Daño vascular
						</div>
					</SidePanel>
				);
			})()}

			{/* S7 FULL stat — 8-10 kg (35.2-42s) */}
			{s7 > 0 && (
				<AbsoluteFill style={{opacity: s7, background: theme.fullBg, justifyContent: 'center', alignItems: 'center'}}>
					<GridBg s={s} />
					<div style={{textAlign: 'center', transform: `scale(${0.92 + s7 * 0.08})`}}>
						<Kicker s={s}>Basta con bajar</Kicker>
						<div style={{fontFamily, fontWeight: 900, fontSize: 220 * s, color: theme.c1, lineHeight: 1, marginTop: 16 * s, ...shadow}}>8–10 kg</div>
						<div style={{fontFamily, fontWeight: 800, fontSize: 48 * s, color: theme.text, marginTop: 6 * s}}>PARA RECUPERAR LA ERECCIÓN</div>
					</div>
				</AbsoluteFill>
			)}

			{/* S8 overlay right — sin medicamento (42.4-44.6s) */}
			{(() => {
				const o = lifecycle(frame, 1060, 1115, 7);
				if (o <= 0) return null;
				return (
					<SidePanel s={s} o={o} side="right" top={230}>
						<span style={{fontSize: 44 * s}}>✅</span>
						<div style={{fontFamily, fontWeight: 900, fontSize: 48 * s, color: theme.text, lineHeight: 1.05, ...shadow}}>
							Sin ningún<br /><span style={{color: theme.c1}}>medicamento</span>
						</div>
					</SidePanel>
				);
			})()}

			{/* S9 overlay left — cintura indicador (45-50.8s) */}
			{(() => {
				const o = lifecycle(frame, 1125, 1270, 9);
				if (o <= 0) return null;
				return (
					<SidePanel s={s} o={o} side="left" top={240}>
						<span style={{fontSize: 44 * s}}>📏</span>
						<div style={{fontFamily, fontWeight: 900, fontSize: 42 * s, color: theme.text, lineHeight: 1.1, ...shadow}}>
							Tu cintura <span style={{color: theme.accent}}>delata</span><br />tu salud sexual
						</div>
					</SidePanel>
				);
			})()}

			{/* S10 FULL open-loop — error 8 (51.6s+) */}
			{s10 > 0 && (
				<AbsoluteFill style={{opacity: s10, background: theme.fullBg, justifyContent: 'center', alignItems: 'center'}}>
					<GridBg s={s} />
					<AbsoluteFill style={{backgroundImage: 'radial-gradient(circle at 50% 45%, rgba(255,90,95,0.16), transparent 60%)'}} />
					<div style={{textAlign: 'center', transform: `scale(${0.92 + s10 * 0.08})`, maxWidth: 1550 * s}}>
						<Kicker s={s} color={theme.accent}>El error #8 · el más peligroso</Kicker>
						<div style={{fontFamily, fontWeight: 900, fontSize: 80 * s, color: theme.text, lineHeight: 1.05, marginTop: 12 * s}}>
							CADA AÑO MANDA<br />HOMBRES A <span style={{color: theme.accent}}>URGENCIAS</span>
						</div>
						<div style={{fontFamily, fontWeight: 700, fontSize: 32 * s, color: theme.textDim, marginTop: 20 * s}}>
							…por un experimento en casa 👀
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
