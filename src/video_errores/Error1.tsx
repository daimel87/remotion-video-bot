import {
	AbsoluteFill,
	OffthreadVideo,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
	interpolate,
	Easing,
} from 'remotion';
import {theme, lifecycle, animIn, shadow, panelStyle, EASE_OUT, EASE_IN} from './theme';

const fontFamily = 'Montserrat';
const FontFace: React.FC = () => (
	<style>{`@font-face{font-family:'Montserrat';font-style:normal;font-weight:100 900;font-display:block;src:url('${staticFile(
		'fonts/Montserrat.ttf'
	)}') format('truetype');}`}</style>
);

// Camera zoom (continuous shot). Origin on eye line, scale >= 1.0, resets hidden behind full-screens.
const zoom = (f: number) => {
	const pts = [
		[0, 1.0],
		[95, 1.0],
		[210, 1.05],
		[465, 1.06],
		[472, 1.0],
		[575, 1.0],
		[720, 1.05],
		[945, 1.05],
		[950, 1.0],
		[1185, 1.0],
		[1650, 1.06],
		[1655, 1.0],
		[1896, 1.0],
	];
	for (let i = 0; i < pts.length - 1; i++) {
		const [f0, s0] = pts[i];
		const [f1, s1] = pts[i + 1];
		if (f >= f0 && f <= f1) {
			const rising = s1 >= s0;
			return interpolate(f, [f0, f1], [s0, s1], {
				easing: rising ? EASE_OUT : EASE_IN,
				extrapolateLeft: 'clamp',
				extrapolateRight: 'clamp',
			});
		}
	}
	return 1.0;
};

const Kicker: React.FC<{s: number; children: React.ReactNode; color?: string}> = ({s, children, color}) => (
	<div
		style={{
			fontFamily,
			fontWeight: 700,
			fontSize: 26 * s,
			letterSpacing: 3 * s,
			textTransform: 'uppercase',
			color: color ?? theme.c1,
			...shadow,
		}}
	>
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

const SidePanel: React.FC<{
	s: number;
	o: number;
	side: 'left' | 'right';
	top: number;
	children: React.ReactNode;
}> = ({s, o, side, top, children}) => (
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

export const Error1: React.FC = () => {
	const frame = useCurrentFrame();
	const {width} = useVideoConfig();
	const s = width / 1920;
	const sc = zoom(frame);

	// full-screen scenes (person hidden)
	const s1 = lifecycle(frame, 0, 95, 8);       // title
	const s5 = lifecycle(frame, 472, 575, 6);    // 3-5 stat
	const s8 = lifecycle(frame, 950, 1185, 12);  // study stat
	const s11 = frame >= 1655 ? animIn(frame, 1659, 12) : 0; // open loop close

	const fsActive =
		(frame >= 0 && frame <= 95) ||
		(frame >= 472 && frame <= 575) ||
		(frame >= 950 && frame <= 1185) ||
		frame >= 1655;
	const wmVisible = !fsActive;

	return (
		<AbsoluteFill style={{backgroundColor: '#000'}}>
			<FontFace />
			<AbsoluteFill style={{transform: `scale(${sc})`, transformOrigin: '50% 29%'}}>
				<OffthreadVideo src={staticFile('error1_intro.mp4')} />
			</AbsoluteFill>

			{/* ---------- S1: FULL-SCREEN title ERROR #1 ---------- */}
			{s1 > 0 && (
				<AbsoluteFill style={{opacity: s1, background: theme.fullBg, justifyContent: 'center', alignItems: 'center'}}>
					<GridBg s={s} />
					<div style={{textAlign: 'center', transform: `translateY(${(1 - s1) * 30 * s}px)`}}>
						<div
							style={{
								display: 'inline-block',
								background: theme.accent,
								borderRadius: 12 * s,
								padding: `${8 * s}px ${28 * s}px`,
								fontFamily,
								fontWeight: 900,
								fontSize: 34 * s,
								color: '#fff',
								letterSpacing: 4 * s,
								marginBottom: 24 * s,
							}}
						>
							ERROR #1
						</div>
						<div style={{fontFamily, fontWeight: 900, fontSize: 96 * s, color: theme.text, lineHeight: 1, maxWidth: 1500 * s}}>
							IGNORAR TUS ERECCIONES<br />
							<span style={{color: theme.c1}}>MATUTINAS</span>
						</div>
					</div>
				</AbsoluteFill>
			)}

			{/* ---------- S2: right panel — señal gratis ---------- */}
			{(() => {
				const o = lifecycle(frame, 108, 205, 10);
				if (o <= 0) return null;
				return (
					<SidePanel s={s} o={o} side="right" top={150}>
						<Kicker s={s}>Cada mañana</Kicker>
						<div style={{fontFamily, fontWeight: 900, fontSize: 46 * s, color: theme.text, lineHeight: 1.05, ...shadow}}>
							Una señal <span style={{color: theme.c1}}>gratis</span>
						</div>
					</SidePanel>
				);
			})()}

			{/* ---------- S3: left chip — no es accidente ---------- */}
			{(() => {
				const o = lifecycle(frame, 215, 345, 10);
				if (o <= 0) return null;
				return (
					<SidePanel s={s} o={o} side="left" top={280}>
						<div style={{display: 'flex', alignItems: 'center', gap: 14 * s}}>
							<span style={{fontSize: 40 * s}}>✅</span>
							<div style={{fontFamily, fontWeight: 900, fontSize: 44 * s, color: theme.text, ...shadow}}>
								NO es casualidad
							</div>
						</div>
						<div style={{fontFamily, fontWeight: 700, fontSize: 24 * s, color: theme.textDim, ...shadow}}>
							Es una prueba de salud vascular
						</div>
					</SidePanel>
				);
			})()}

			{/* ---------- S4: right panel — mientras duermes ---------- */}
			{(() => {
				const o = lifecycle(frame, 360, 470, 10);
				if (o <= 0) return null;
				return (
					<SidePanel s={s} o={o} side="right" top={170}>
						<span style={{fontSize: 44 * s}}>🌙</span>
						<div style={{fontFamily, fontWeight: 900, fontSize: 44 * s, color: theme.text, lineHeight: 1.05, ...shadow}}>
							Tu cuerpo la corre<br />mientras <span style={{color: theme.c1}}>duermes</span>
						</div>
					</SidePanel>
				);
			})()}

			{/* ---------- S5: FULL-SCREEN stat 3-5 ---------- */}
			{s5 > 0 && (
				<AbsoluteFill style={{opacity: s5, background: theme.fullBg, justifyContent: 'center', alignItems: 'center'}}>
					<GridBg s={s} />
					<div style={{textAlign: 'center', transform: `scale(${0.9 + s5 * 0.1})`}}>
						<Kicker s={s}>Cada noche tienes</Kicker>
						<div style={{fontFamily, fontWeight: 900, fontSize: 260 * s, color: theme.c1, lineHeight: 1, ...shadow}}>
							3–5
						</div>
						<div style={{fontFamily, fontWeight: 900, fontSize: 56 * s, color: theme.text, marginTop: 10 * s}}>
							ERECCIONES MIENTRAS DUERMES
						</div>
					</div>
				</AbsoluteFill>
			)}

			{/* ---------- S6: left panel — oxigena ---------- */}
			{(() => {
				const o = lifecycle(frame, 580, 710, 10);
				if (o <= 0) return null;
				return (
					<SidePanel s={s} o={o} side="left" top={280}>
						<Kicker s={s}>Su función</Kicker>
						<div style={{fontFamily, fontWeight: 900, fontSize: 46 * s, color: theme.text, lineHeight: 1.05, ...shadow}}>
							<span style={{color: theme.c1}}>Oxigenar</span> el tejido eréctil
						</div>
					</SidePanel>
				);
			})()}

			{/* ---------- S7: right panel — analogía dolor en el pecho ---------- */}
			{(() => {
				const o = lifecycle(frame, 815, 945, 10);
				if (o <= 0) return null;
				return (
					<SidePanel s={s} o={o} side="right" top={180}>
						<span style={{fontSize: 44 * s}}>⚠️</span>
						<div style={{fontFamily, fontWeight: 900, fontSize: 42 * s, color: theme.text, lineHeight: 1.08, ...shadow}}>
							Tan serio como<br />un <span style={{color: theme.accent}}>dolor en el pecho</span>
						</div>
					</SidePanel>
				);
			})()}

			{/* ---------- S8: FULL-SCREEN study stat ---------- */}
			{s8 > 0 && (
				<AbsoluteFill style={{opacity: s8, background: theme.fullBg, justifyContent: 'center', alignItems: 'center'}}>
					<GridBg s={s} />
					<div style={{textAlign: 'center', transform: `translateY(${(1 - s8) * 30 * s}px)`, maxWidth: 1500 * s}}>
						<div
							style={{
								display: 'inline-block',
								border: `${2 * s}px solid ${theme.panelBorder}`,
								borderRadius: 40 * s,
								padding: `${8 * s}px ${26 * s}px`,
								fontFamily,
								fontWeight: 700,
								fontSize: 24 * s,
								color: theme.c1,
								letterSpacing: 2 * s,
								marginBottom: 24 * s,
							}}
						>
							ESTUDIO A LARGO PLAZO
						</div>
						<div style={{fontFamily, fontWeight: 900, fontSize: 78 * s, color: theme.text, lineHeight: 1.05}}>
							Disfunción eréctil persistente =<br />
							<span style={{color: theme.accent}}>mayor riesgo cardiovascular</span>
						</div>
						<div style={{fontFamily, fontWeight: 700, fontSize: 30 * s, color: theme.textDim, marginTop: 24 * s}}>
							El pene avisa antes que el corazón ❤️
						</div>
					</div>
				</AbsoluteFill>
			)}

			{/* ---------- S9: left panel — primer órgano ---------- */}
			{(() => {
				const o = lifecycle(frame, 1195, 1310, 10);
				if (o <= 0) return null;
				return (
					<SidePanel s={s} o={o} side="left" top={270}>
						<div style={{fontFamily, fontWeight: 900, fontSize: 46 * s, color: theme.text, lineHeight: 1.05, ...shadow}}>
							El <span style={{color: theme.c1}}>primer órgano</span><br />que da la alarma
						</div>
					</SidePanel>
				);
			})()}

			{/* ---------- S10: right — bandera roja ---------- */}
			{(() => {
				const o = lifecycle(frame, 1540, 1650, 9);
				if (o <= 0) return null;
				return (
					<SidePanel s={s} o={o} side="right" top={200}>
						<span style={{fontSize: 48 * s}}>🚩</span>
						<div style={{fontFamily, fontWeight: 900, fontSize: 46 * s, color: theme.text, lineHeight: 1.05, ...shadow}}>
							Tu cuerpo está<br /><span style={{color: theme.accent}}>levantando la mano</span>
						</div>
						<div style={{fontFamily, fontWeight: 700, fontSize: 24 * s, color: theme.textDim, ...shadow}}>
							No lo culpes al cansancio
						</div>
					</SidePanel>
				);
			})()}

			{/* ---------- S11: FULL-SCREEN open-loop close → ERROR #2 ---------- */}
			{s11 > 0 && (
				<AbsoluteFill style={{opacity: s11, background: theme.fullBg, justifyContent: 'center', alignItems: 'center'}}>
					<GridBg s={s} />
					<AbsoluteFill style={{backgroundImage: 'radial-gradient(circle at 50% 45%, rgba(255,90,95,0.16), transparent 60%)'}} />
					<div style={{textAlign: 'center', transform: `scale(${0.92 + s11 * 0.08})`, maxWidth: 1500 * s}}>
						<Kicker s={s} color={theme.accent}>Y presta atención…</Kicker>
						<div style={{fontFamily, fontWeight: 900, fontSize: 92 * s, color: theme.text, lineHeight: 1.02, marginTop: 14 * s}}>
							EL <span style={{color: theme.accent}}>ERROR #2</span><br />LO HACES CADA DÍA
						</div>
						<div style={{fontFamily, fontWeight: 700, fontSize: 32 * s, color: theme.textDim, marginTop: 22 * s}}>
							…probablemente ahora mismo 👀
						</div>
					</div>
				</AbsoluteFill>
			)}

			{/* ---------- Watermark ---------- */}
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
