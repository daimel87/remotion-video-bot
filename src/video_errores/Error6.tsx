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
		[560, 1.0],
		[700, 1.05],
		[985, 1.06],
		[990, 1.0],
		[1085, 1.0],
		[1095, 1.05],
		[1100, 1.0],
		[1422, 1.0],
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
			maxWidth: 580 * s,
			display: 'flex',
			flexDirection: 'column',
			gap: 8 * s,
		}}
	>
		{children}
	</div>
);

export const Error6: React.FC = () => {
	const frame = useCurrentFrame();
	const {width} = useVideoConfig();
	const s = width / 1920;
	const sc = zoom(frame);

	const s1 = lifecycle(frame, 0, 95, 8);        // title (0-5.7s)
	const s4 = lifecycle(frame, 290, 395, 6);     // -15% (11.6-15.8s)
	const s5 = lifecycle(frame, 405, 560, 6);     // 10-15 años (16.2-22.4s)
	const s9 = lifecycle(frame, 990, 1085, 7);    // la almohada (39.6-43.4s)
	const s10 = frame >= 1100 ? animIn(frame, 1104, 12) : 0; // error 7 (44s+)

	const fsActive =
		(frame >= 0 && frame <= 95) ||
		(frame >= 290 && frame <= 395) ||
		(frame >= 405 && frame <= 560) ||
		(frame >= 990 && frame <= 1085) ||
		frame >= 1100;
	const wmVisible = !fsActive;

	return (
		<AbsoluteFill style={{backgroundColor: '#000'}}>
			<FontFace />
			<AbsoluteFill style={{transform: `scale(${sc})`, transformOrigin: '50% 29%'}}>
				<OffthreadVideo src={staticFile('error6_intro.mp4')} />
			</AbsoluteFill>

			{/* S1 FULL title */}
			{s1 > 0 && (
				<AbsoluteFill style={{opacity: s1, background: theme.fullBg, justifyContent: 'center', alignItems: 'center'}}>
					<GridBg s={s} />
					<div style={{textAlign: 'center', transform: `translateY(${(1 - s1) * 30 * s}px)`}}>
						<div style={{display: 'inline-block', background: theme.accent, borderRadius: 12 * s, padding: `${8 * s}px ${28 * s}px`, fontFamily, fontWeight: 900, fontSize: 34 * s, color: '#fff', letterSpacing: 4 * s, marginBottom: 24 * s}}>
							ERROR #6
						</div>
						<div style={{fontFamily, fontWeight: 900, fontSize: 92 * s, color: theme.text, lineHeight: 1.02, maxWidth: 1500 * s}}>
							DORMIR POCO<br /><span style={{color: theme.c1}}>MATA TU TESTOSTERONA</span>
						</div>
					</div>
				</AbsoluteFill>
			)}

			{/* S2 overlay right — sueño profundo (4-8s) */}
			{(() => {
				const o = lifecycle(frame, 100, 200, 9);
				if (o <= 0) return null;
				return (
					<SidePanel s={s} o={o} side="right" top={150}>
						<span style={{fontSize: 44 * s}}>🌙</span>
						<div style={{fontFamily, fontWeight: 900, fontSize: 44 * s, color: theme.text, lineHeight: 1.08, ...shadow}}>
							Se produce en el<br /><span style={{color: theme.c1}}>sueño profundo</span>
						</div>
					</SidePanel>
				);
			})()}

			{/* S3 overlay left — 5 horas/noche (8.4-11.2s) */}
			{(() => {
				const o = lifecycle(frame, 210, 280, 8);
				if (o <= 0) return null;
				return (
					<SidePanel s={s} o={o} side="left" top={260}>
						<span style={{fontSize: 44 * s}}>😴</span>
						<div style={{fontFamily, fontWeight: 900, fontSize: 46 * s, color: theme.text, lineHeight: 1.08, ...shadow}}>
							5 horas/noche<br />durante 1 semana
						</div>
					</SidePanel>
				);
			})()}

			{/* S4 FULL stat — -15% (11.6-15.8s) */}
			{s4 > 0 && (
				<AbsoluteFill style={{opacity: s4, background: theme.fullBg, justifyContent: 'center', alignItems: 'center'}}>
					<GridBg s={s} />
					<AbsoluteFill style={{backgroundImage: 'radial-gradient(circle at 50% 45%, rgba(255,90,95,0.16), transparent 60%)'}} />
					<div style={{textAlign: 'center', transform: `scale(${0.92 + s4 * 0.08})`}}>
						<Kicker s={s} color={theme.accent}>En solo 1 semana</Kicker>
						<div style={{fontFamily, fontWeight: 900, fontSize: 240 * s, color: theme.accent, lineHeight: 1, marginTop: 20 * s, ...shadow}}>-15%</div>
						<div style={{fontFamily, fontWeight: 800, fontSize: 52 * s, color: theme.text, marginTop: 6 * s}}>DE TESTOSTERONA</div>
					</div>
				</AbsoluteFill>
			)}

			{/* S5 FULL stat — envejecer 10-15 años (16.2-22.4s) */}
			{s5 > 0 && (
				<AbsoluteFill style={{opacity: s5, background: theme.fullBg, justifyContent: 'center', alignItems: 'center'}}>
					<GridBg s={s} />
					<div style={{textAlign: 'center', transform: `scale(${0.92 + s5 * 0.08})`}}>
						<Kicker s={s}>Es como envejecer</Kicker>
						<div style={{fontFamily, fontWeight: 900, fontSize: 220 * s, color: theme.c1, lineHeight: 1, marginTop: 18 * s, ...shadow}}>10–15</div>
						<div style={{fontFamily, fontWeight: 800, fontSize: 50 * s, color: theme.text, marginTop: 6 * s}}>AÑOS · EN SOLO 7 DÍAS</div>
					</div>
				</AbsoluteFill>
			)}

			{/* S6 overlay right — cortisol (23.4-28s) */}
			{(() => {
				const o = lifecycle(frame, 585, 700, 9);
				if (o <= 0) return null;
				return (
					<SidePanel s={s} o={o} side="right" top={200}>
						<span style={{fontSize: 44 * s}}>📈</span>
						<div style={{fontFamily, fontWeight: 900, fontSize: 44 * s, color: theme.text, lineHeight: 1.08, ...shadow}}>
							Sube el <span style={{color: theme.accent}}>cortisol</span><br />la hormona del estrés
						</div>
					</SidePanel>
				);
			})()}

			{/* S7 overlay left — antagonista (28.6-33s) */}
			{(() => {
				const o = lifecycle(frame, 715, 826, 9);
				if (o <= 0) return null;
				return (
					<SidePanel s={s} o={o} side="left" top={260}>
						<div style={{fontFamily, fontWeight: 900, fontSize: 44 * s, color: theme.text, lineHeight: 1.08, ...shadow}}>
							<span style={{color: theme.accent}}>Enemigo</span> directo de<br />tu testosterona
						</div>
					</SidePanel>
				);
			})()}

			{/* S8 overlay right — menos de 6 horas (33.4-38s) */}
			{(() => {
				const o = lifecycle(frame, 835, 950, 9);
				if (o <= 0) return null;
				return (
					<SidePanel s={s} o={o} side="right" top={200}>
						<span style={{fontSize: 44 * s}}>😴</span>
						<div style={{fontFamily, fontWeight: 900, fontSize: 46 * s, color: theme.text, lineHeight: 1.08, ...shadow}}>
							¿Duermes menos<br />de <span style={{color: theme.accent}}>6 horas</span>?
						</div>
					</SidePanel>
				);
			})()}

			{/* S9 FULL — la almohada (39.6-43.4s) */}
			{s9 > 0 && (
				<AbsoluteFill style={{opacity: s9, background: theme.fullBg, justifyContent: 'center', alignItems: 'center'}}>
					<GridBg s={s} />
					<div style={{textAlign: 'center', transform: `scale(${0.92 + s9 * 0.08})`}}>
						<div style={{fontFamily, fontWeight: 900, fontSize: 64 * s, color: theme.text, lineHeight: 1.2}}>
							<span style={{color: theme.accent}}>NO</span> es la pastilla azul 💊
						</div>
						<div style={{fontFamily, fontWeight: 900, fontSize: 84 * s, color: theme.c1, lineHeight: 1.1, marginTop: 16 * s}}>
							ES LA ALMOHADA 🛏️
						</div>
					</div>
				</AbsoluteFill>
			)}

			{/* S10 FULL open-loop — error 7 (44s+) */}
			{s10 > 0 && (
				<AbsoluteFill style={{opacity: s10, background: theme.fullBg, justifyContent: 'center', alignItems: 'center'}}>
					<GridBg s={s} />
					<AbsoluteFill style={{backgroundImage: 'radial-gradient(circle at 50% 45%, rgba(255,90,95,0.16), transparent 60%)'}} />
					<div style={{textAlign: 'center', transform: `scale(${0.92 + s10 * 0.08})`, maxWidth: 1550 * s}}>
						<Kicker s={s} color={theme.accent}>El error #7 es traicionero…</Kicker>
						<div style={{fontFamily, fontWeight: 900, fontSize: 78 * s, color: theme.text, lineHeight: 1.05, marginTop: 12 * s}}>
							TU CUERPO CONVIERTE<br />TU TESTOSTERONA EN LA<br /><span style={{color: theme.accent}}>HORMONA EQUIVOCADA</span>
						</div>
						<div style={{fontFamily, fontWeight: 700, fontSize: 30 * s, color: theme.textDim, marginTop: 20 * s}}>
							…y casi nadie lo sabe 👀
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
