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
		[675, 1.0],
		[685, 1.05],
		[690, 1.0],
		[810, 1.0],
		[1365, 1.06],
		[1370, 1.0],
		[1541, 1.0],
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

export const Error4: React.FC = () => {
	const frame = useCurrentFrame();
	const {width} = useVideoConfig();
	const s = width / 1920;
	const sc = zoom(frame);

	const s1 = lifecycle(frame, 0, 95, 8);        // title (0-4.2s)
	const s5 = lifecycle(frame, 515, 675, 7);     // menos flujo (20.6-27s)
	const s7 = lifecycle(frame, 690, 810, 7);     // no duele no avisa (27.6-32.4s)
	const s10 = frame >= 1370 ? animIn(frame, 1374, 12) : 0; // error 5 (54.8s)

	const fsActive =
		(frame >= 0 && frame <= 95) ||
		(frame >= 515 && frame <= 675) ||
		(frame >= 690 && frame <= 810) ||
		frame >= 1370;
	const wmVisible = !fsActive;

	return (
		<AbsoluteFill style={{backgroundColor: '#000'}}>
			<FontFace />
			<AbsoluteFill style={{transform: `scale(${sc})`, transformOrigin: '50% 29%'}}>
				<OffthreadVideo src={staticFile('error4_intro.mp4')} />
			</AbsoluteFill>

			{/* S1 FULL title */}
			{s1 > 0 && (
				<AbsoluteFill style={{opacity: s1, background: theme.fullBg, justifyContent: 'center', alignItems: 'center'}}>
					<GridBg s={s} />
					<div style={{textAlign: 'center', transform: `translateY(${(1 - s1) * 30 * s}px)`}}>
						<div style={{display: 'inline-block', background: theme.accent, borderRadius: 12 * s, padding: `${8 * s}px ${28 * s}px`, fontFamily, fontWeight: 900, fontSize: 34 * s, color: '#fff', letterSpacing: 4 * s, marginBottom: 24 * s}}>
							ERROR #4
						</div>
						<div style={{fontFamily, fontWeight: 900, fontSize: 90 * s, color: theme.text, lineHeight: 1.02, maxWidth: 1500 * s}}>
							LA PRESIÓN ALTA<br /><span style={{color: theme.c1}}>SILENCIOSA</span>
						</div>
					</div>
				</AbsoluteFill>
			)}

			{/* S2 overlay right — destruye tus erecciones (4.2-9.9s) */}
			{(() => {
				const o = lifecycle(frame, 125, 247, 9);
				if (o <= 0) return null;
				return (
					<SidePanel s={s} o={o} side="right" top={150}>
						<span style={{fontSize: 44 * s}}>⚠️</span>
						<div style={{fontFamily, fontWeight: 900, fontSize: 42 * s, color: theme.text, lineHeight: 1.08, ...shadow}}>
							Destruye tus erecciones<br /><span style={{color: theme.accent}}>gradual e invisible</span>
						</div>
					</SidePanel>
				);
			})()}

			{/* S3 overlay left — vasos más pequeños (9.9-13.8s) */}
			{(() => {
				const o = lifecycle(frame, 250, 344, 8);
				if (o <= 0) return null;
				return (
					<SidePanel s={s} o={o} side="left" top={260}>
						<span style={{fontSize: 44 * s}}>🩸</span>
						<div style={{fontFamily, fontWeight: 900, fontSize: 44 * s, color: theme.text, lineHeight: 1.08, ...shadow}}>
							Los vasos <span style={{color: theme.c1}}>más pequeños</span><br />del cuerpo
						</div>
					</SidePanel>
				);
			})()}

			{/* S4 overlay right — daña los más finos (17.2-20.6s) */}
			{(() => {
				const o = lifecycle(frame, 430, 515, 8);
				if (o <= 0) return null;
				return (
					<SidePanel s={s} o={o} side="right" top={200}>
						<div style={{fontFamily, fontWeight: 900, fontSize: 44 * s, color: theme.text, lineHeight: 1.08, ...shadow}}>
							Daña primero<br />los <span style={{color: theme.accent}}>más finos</span>
						</div>
					</SidePanel>
				);
			})()}

			{/* S5 FULL result stat */}
			{s5 > 0 && (
				<AbsoluteFill style={{opacity: s5, background: theme.fullBg, justifyContent: 'center', alignItems: 'center'}}>
					<GridBg s={s} />
					<AbsoluteFill style={{backgroundImage: 'radial-gradient(circle at 50% 45%, rgba(255,90,95,0.16), transparent 60%)'}} />
					<div style={{textAlign: 'center', transform: `scale(${0.92 + s5 * 0.08})`}}>
						<div style={{fontSize: 76 * s, marginBottom: 6 * s}}>🩸</div>
						<div style={{fontFamily, fontWeight: 900, fontSize: 92 * s, color: theme.accent, lineHeight: 1}}>
							↓ MENOS FLUJO
						</div>
						<div style={{fontFamily, fontWeight: 800, fontSize: 46 * s, color: theme.text, marginTop: 10 * s}}>
							ERECCIONES DÉBILES O NULAS
						</div>
					</div>
				</AbsoluteFill>
			)}

			{/* S7 FULL — no duele, no avisa */}
			{s7 > 0 && (
				<AbsoluteFill style={{opacity: s7, background: theme.fullBg, justifyContent: 'center', alignItems: 'center'}}>
					<GridBg s={s} />
					<div style={{textAlign: 'center', transform: `scale(${0.92 + s7 * 0.08})`}}>
						<Kicker s={s} color={theme.accent}>El peligro</Kicker>
						<div style={{fontFamily, fontWeight: 900, fontSize: 100 * s, color: theme.text, lineHeight: 1.05, marginTop: 10 * s}}>
							NO DUELE.<br /><span style={{color: theme.accent}}>NO AVISA.</span>
						</div>
					</div>
				</AbsoluteFill>
			)}

			{/* S6 overlay left — años sin saberlo */}
			{(() => {
				const o = lifecycle(frame, 820, 925, 9);
				if (o <= 0) return null;
				return (
					<SidePanel s={s} o={o} side="left" top={260}>
						<div style={{fontFamily, fontWeight: 900, fontSize: 46 * s, color: theme.text, lineHeight: 1.05, ...shadow}}>
							Años <span style={{color: theme.accent}}>sin saberlo</span>
						</div>
					</SidePanel>
				);
			})()}

			{/* S8 overlay right — mídete y trata */}
			{(() => {
				const o = lifecycle(frame, 1000, 1075, 8);
				if (o <= 0) return null;
				return (
					<SidePanel s={s} o={o} side="right" top={200}>
						<span style={{fontSize: 44 * s}}>✅</span>
						<div style={{fontFamily, fontWeight: 900, fontSize: 44 * s, color: theme.text, lineHeight: 1.08, ...shadow}}>
							Mídete la presión<br />y <span style={{color: theme.c1}}>trátala</span>
						</div>
					</SidePanel>
				);
			})()}

			{/* S9 overlay left — fármacos afectan */}
			{(() => {
				const o = lifecycle(frame, 1075, 1278, 10);
				if (o <= 0) return null;
				return (
					<SidePanel s={s} o={o} side="left" top={250}>
						<span style={{fontSize: 40 * s}}>💊</span>
						<div style={{fontFamily, fontWeight: 900, fontSize: 40 * s, color: theme.text, lineHeight: 1.08, ...shadow}}>
							Algunos fármacos<br />afectan la <span style={{color: theme.accent}}>erección</span>
						</div>
						<div style={{fontFamily, fontWeight: 700, fontSize: 24 * s, color: theme.textDim, ...shadow}}>
							Hay opciones con menos impacto
						</div>
					</SidePanel>
				);
			})()}

			{/* S10 FULL open-loop → ERROR #5 */}
			{s10 > 0 && (
				<AbsoluteFill style={{opacity: s10, background: theme.fullBg, justifyContent: 'center', alignItems: 'center'}}>
					<GridBg s={s} />
					<AbsoluteFill style={{backgroundImage: 'radial-gradient(circle at 50% 45%, rgba(255,90,95,0.16), transparent 60%)'}} />
					<div style={{textAlign: 'center', transform: `scale(${0.92 + s10 * 0.08})`, maxWidth: 1500 * s}}>
						<Kicker s={s} color={theme.accent}>Parece ayudar, pero traiciona…</Kicker>
						<div style={{fontFamily, fontWeight: 900, fontSize: 92 * s, color: theme.text, lineHeight: 1.02, marginTop: 14 * s}}>
							EL <span style={{color: theme.accent}}>ERROR #5</span><br />LO USAN ANTES DEL SEXO
						</div>
						<div style={{fontFamily, fontWeight: 700, fontSize: 32 * s, color: theme.textDim, marginTop: 22 * s}}>
							…creyendo que da confianza 👀
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
