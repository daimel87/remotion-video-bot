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
		[275, 1.05],
		[280, 1.0],
		[430, 1.0],
		[605, 1.05],
		[610, 1.0],
		[785, 1.0],
		[1000, 1.05],
		[1270, 1.06],
		[1275, 1.0],
		[1661, 1.0],
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

export const Error9: React.FC = () => {
	const frame = useCurrentFrame();
	const {width} = useVideoConfig();
	const s = width / 1920;
	const sc = zoom(frame);

	const s1 = lifecycle(frame, 0, 95, 8);        // title (0-7.4s)
	const s3 = lifecycle(frame, 280, 430, 6);     // cortisol (11.2-17.2s)
	const s5 = lifecycle(frame, 610, 785, 6);     // sobrevivir (24.4-31.4s)
	const s9 = frame >= 1275 ? animIn(frame, 1279, 12) : 0; // error 10 (51s+)

	const fsActive =
		(frame >= 0 && frame <= 95) ||
		(frame >= 280 && frame <= 430) ||
		(frame >= 610 && frame <= 785) ||
		frame >= 1275;
	const wmVisible = !fsActive;

	return (
		<AbsoluteFill style={{backgroundColor: '#000'}}>
			<FontFace />
			<AbsoluteFill style={{transform: `scale(${sc})`, transformOrigin: '50% 29%'}}>
				<OffthreadVideo src={staticFile('error9_intro.mp4')} />
			</AbsoluteFill>

			{/* S1 FULL title */}
			{s1 > 0 && (
				<AbsoluteFill style={{opacity: s1, background: theme.fullBg, justifyContent: 'center', alignItems: 'center'}}>
					<GridBg s={s} />
					<div style={{textAlign: 'center', transform: `translateY(${(1 - s1) * 30 * s}px)`}}>
						<div style={{display: 'inline-block', background: theme.accent, borderRadius: 12 * s, padding: `${8 * s}px ${28 * s}px`, fontFamily, fontWeight: 900, fontSize: 34 * s, color: '#fff', letterSpacing: 4 * s, marginBottom: 24 * s}}>
							ERROR #9
						</div>
						<div style={{fontFamily, fontWeight: 900, fontSize: 92 * s, color: theme.text, lineHeight: 1.02, maxWidth: 1500 * s}}>
							EL ESTRÉS<br /><span style={{color: theme.c1}}>CRÓNICO</span>
						</div>
					</div>
				</AbsoluteFill>
			)}

			{/* S2 overlay right — enemigo subestimado (4.4-10s) */}
			{(() => {
				const o = lifecycle(frame, 110, 250, 9);
				if (o <= 0) return null;
				return (
					<SidePanel s={s} o={o} side="right" top={150}>
						<span style={{fontSize: 44 * s}}>😰</span>
						<div style={{fontFamily, fontWeight: 900, fontSize: 44 * s, color: theme.text, lineHeight: 1.08, ...shadow}}>
							El enemigo más<br /><span style={{color: theme.accent}}>subestimado</span>
						</div>
					</SidePanel>
				);
			})()}

			{/* S3 FULL — cortisol suprime testosterona (11.2-17.2s) */}
			{s3 > 0 && (
				<AbsoluteFill style={{opacity: s3, background: theme.fullBg, justifyContent: 'center', alignItems: 'center'}}>
					<GridBg s={s} />
					<AbsoluteFill style={{backgroundImage: 'radial-gradient(circle at 50% 45%, rgba(255,90,95,0.16), transparent 60%)'}} />
					<div style={{textAlign: 'center', transform: `scale(${0.92 + s3 * 0.08})`}}>
						<div style={{fontFamily, fontWeight: 900, fontSize: 84 * s, color: theme.text, lineHeight: 1.15}}>
							<span style={{color: theme.accent}}>↑ CORTISOL</span><br />↓ TESTOSTERONA
						</div>
						<div style={{fontFamily, fontWeight: 800, fontSize: 40 * s, color: theme.textDim, marginTop: 16 * s}}>y bloquea el flujo de la erección</div>
					</div>
				</AbsoluteFill>
			)}

			{/* S4 overlay left — pelea o huye (18.8-23.6s) */}
			{(() => {
				const o = lifecycle(frame, 470, 590, 9);
				if (o <= 0) return null;
				return (
					<SidePanel s={s} o={o} side="left" top={260}>
						<span style={{fontSize: 44 * s}}>⚔️</span>
						<div style={{fontFamily, fontWeight: 900, fontSize: 48 * s, color: theme.text, lineHeight: 1.05, ...shadow}}>
							Modo <span style={{color: theme.accent}}>pelea o huye</span>
						</div>
					</SidePanel>
				);
			})()}

			{/* S5 FULL — sobrevivir vs reproducirse (24.4-31.4s) */}
			{s5 > 0 && (
				<AbsoluteFill style={{opacity: s5, background: theme.fullBg, justifyContent: 'center', alignItems: 'center'}}>
					<GridBg s={s} />
					<div style={{textAlign: 'center', transform: `scale(${0.92 + s5 * 0.08})`}}>
						<Kicker s={s} color={theme.accent}>En ese modo</Kicker>
						<div style={{fontFamily, fontWeight: 900, fontSize: 80 * s, color: theme.text, lineHeight: 1.12, marginTop: 14 * s}}>
							TU CUERPO QUIERE<br /><span style={{color: theme.c1}}>SOBREVIVIR</span>, NO REPRODUCIRSE
						</div>
					</div>
				</AbsoluteFill>
			)}

			{/* S6 overlay right — hombres sanos con DE (32-38.4s) */}
			{(() => {
				const o = lifecycle(frame, 800, 960, 9);
				if (o <= 0) return null;
				return (
					<SidePanel s={s} o={o} side="right" top={210}>
						<div style={{fontFamily, fontWeight: 900, fontSize: 42 * s, color: theme.text, lineHeight: 1.12, ...shadow}}>
							Hombres <span style={{color: theme.c1}}>sanos</span><br />con disfunción eréctil
						</div>
					</SidePanel>
				);
			})()}

			{/* S7 overlay left — resolver el estres (39-44s) */}
			{(() => {
				const o = lifecycle(frame, 975, 1100, 9);
				if (o <= 0) return null;
				return (
					<SidePanel s={s} o={o} side="left" top={250}>
						<span style={{fontSize: 44 * s}}>✅</span>
						<div style={{fontFamily, fontWeight: 900, fontSize: 42 * s, color: theme.text, lineHeight: 1.12, ...shadow}}>
							Desaparece al bajar<br />la <span style={{color: theme.c1}}>presión</span> laboral o de pareja
						</div>
					</SidePanel>
				);
			})()}

			{/* S8 overlay right — arterias hormonas erecciones (44.8-50.4s) */}
			{(() => {
				const o = lifecycle(frame, 1120, 1260, 9);
				if (o <= 0) return null;
				return (
					<SidePanel s={s} o={o} side="right" top={210}>
						<Kicker s={s} color={theme.accent}>No solo en la cabeza</Kicker>
						<div style={{fontFamily, fontWeight: 900, fontSize: 42 * s, color: theme.text, lineHeight: 1.12, ...shadow}}>
							Está en tus <span style={{color: theme.accent}}>arterias</span>,<br />hormonas y erecciones
						</div>
					</SidePanel>
				);
			})()}

			{/* S9 FULL open-loop — error 10 (51s+) */}
			{s9 > 0 && (
				<AbsoluteFill style={{opacity: s9, background: theme.fullBg, justifyContent: 'center', alignItems: 'center'}}>
					<GridBg s={s} />
					<AbsoluteFill style={{backgroundImage: 'radial-gradient(circle at 50% 45%, rgba(255,90,95,0.16), transparent 60%)'}} />
					<div style={{textAlign: 'center', transform: `scale(${0.92 + s9 * 0.08})`, maxWidth: 1550 * s}}>
						<Kicker s={s} color={theme.accent}>Y llegamos al…</Kicker>
						<div style={{fontFamily, fontWeight: 900, fontSize: 88 * s, color: theme.text, lineHeight: 1.05, marginTop: 12 * s}}>
							ERROR <span style={{color: theme.accent}}>#10</span><br />EL MÁS SILENCIOSO
						</div>
						<div style={{fontFamily, fontWeight: 700, fontSize: 32 * s, color: theme.textDim, marginTop: 20 * s}}>
							…casi nadie admite que lo comete 👀
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
