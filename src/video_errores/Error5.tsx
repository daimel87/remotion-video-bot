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
		[355, 1.06],
		[360, 1.0],
		[500, 1.0],
		[700, 1.05],
		[795, 1.06],
		[800, 1.0],
		[912, 1.0],
		[1100, 1.05],
		[1210, 1.06],
		[1215, 1.0],
		[1441, 1.0],
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

export const Error5: React.FC = () => {
	const frame = useCurrentFrame();
	const {width} = useVideoConfig();
	const s = width / 1920;
	const sc = zoom(frame);

	const s1 = lifecycle(frame, 0, 95, 8);        // title (0-8s)
	const s4 = lifecycle(frame, 360, 500, 6);     // copas contrast (14-20s)
	const s6 = lifecycle(frame, 800, 912, 7);     // sin/con alcohol (32-36.5s)
	const s9 = lifecycle(frame, 1215, 1287, 7);   // siguiente error (48.6-51.5s)
	const s10 = frame >= 1290 ? animIn(frame, 1294, 12) : 0; // 15 años (51.6s)

	const fsActive =
		(frame >= 0 && frame <= 95) ||
		(frame >= 360 && frame <= 500) ||
		(frame >= 800 && frame <= 912) ||
		(frame >= 1215 && frame <= 1287) ||
		frame >= 1290;
	const wmVisible = !fsActive;

	return (
		<AbsoluteFill style={{backgroundColor: '#000'}}>
			<FontFace />
			<AbsoluteFill style={{transform: `scale(${sc})`, transformOrigin: '50% 29%'}}>
				<OffthreadVideo src={staticFile('error5_intro.mp4')} />
			</AbsoluteFill>

			{/* S1 FULL title */}
			{s1 > 0 && (
				<AbsoluteFill style={{opacity: s1, background: theme.fullBg, justifyContent: 'center', alignItems: 'center'}}>
					<GridBg s={s} />
					<div style={{textAlign: 'center', transform: `translateY(${(1 - s1) * 30 * s}px)`}}>
						<div style={{display: 'inline-block', background: theme.accent, borderRadius: 12 * s, padding: `${8 * s}px ${28 * s}px`, fontFamily, fontWeight: 900, fontSize: 34 * s, color: '#fff', letterSpacing: 4 * s, marginBottom: 24 * s}}>
							ERROR #5
						</div>
						<div style={{fontFamily, fontWeight: 900, fontSize: 88 * s, color: theme.text, lineHeight: 1.02, maxWidth: 1500 * s}}>
							EL ALCOHOL<br /><span style={{color: theme.c1}}>ANTES DEL SEXO</span>
						</div>
					</div>
				</AbsoluteFill>
			)}

			{/* S2 overlay right — relajarse con alcohol (4-8s) */}
			{(() => {
				const o = lifecycle(frame, 110, 205, 9);
				if (o <= 0) return null;
				return (
					<SidePanel s={s} o={o} side="right" top={150}>
						<span style={{fontSize: 44 * s}}>🍷</span>
						<div style={{fontFamily, fontWeight: 900, fontSize: 44 * s, color: theme.text, lineHeight: 1.08, ...shadow}}>
							Beber para<br /><span style={{color: theme.c1}}>relajarse</span>
						</div>
					</SidePanel>
				);
			})()}

			{/* S3 overlay left — depresor del sistema nervioso (11-14s) */}
			{(() => {
				const o = lifecycle(frame, 280, 351, 8);
				if (o <= 0) return null;
				return (
					<SidePanel s={s} o={o} side="left" top={260}>
						<span style={{fontSize: 44 * s}}>⚠️</span>
						<div style={{fontFamily, fontWeight: 900, fontSize: 44 * s, color: theme.text, lineHeight: 1.08, ...shadow}}>
							Es un <span style={{color: theme.accent}}>depresor</span><br />del sistema nervioso
						</div>
					</SidePanel>
				);
			})()}

			{/* S4 FULL contrast — copas (14-20s) */}
			{s4 > 0 && (
				<AbsoluteFill style={{opacity: s4, background: theme.fullBg, justifyContent: 'center', alignItems: 'center'}}>
					<GridBg s={s} />
					<div style={{display: 'flex', gap: 110 * s, alignItems: 'center', transform: `scale(${0.92 + s4 * 0.08})`}}>
						<div style={{textAlign: 'center'}}>
							<div style={{fontSize: 84 * s}}>✅</div>
							<div style={{fontFamily, fontWeight: 900, fontSize: 200 * s, color: theme.c1, lineHeight: 1, ...shadow}}>1–2</div>
							<div style={{fontFamily, fontWeight: 800, fontSize: 40 * s, color: theme.text}}>parecen ayudar</div>
						</div>
						<div style={{fontFamily, fontWeight: 900, fontSize: 120 * s, color: theme.textDim}}>→</div>
						<div style={{textAlign: 'center'}}>
							<div style={{fontSize: 84 * s}}>❌</div>
							<div style={{fontFamily, fontWeight: 900, fontSize: 200 * s, color: theme.accent, lineHeight: 1, ...shadow}}>3+</div>
							<div style={{fontFamily, fontWeight: 800, fontSize: 40 * s, color: theme.text}}>la historia cambia</div>
						</div>
					</div>
				</AbsoluteFill>
			)}

			{/* S5 overlay right — bloquea erección + baja testosterona (20.8-26.4s) */}
			{(() => {
				const o = lifecycle(frame, 520, 660, 10);
				if (o <= 0) return null;
				return (
					<SidePanel s={s} o={o} side="right" top={200}>
						<div style={{fontFamily, fontWeight: 900, fontSize: 42 * s, color: theme.text, lineHeight: 1.08, ...shadow}}>
							Bloquea la <span style={{color: theme.accent}}>erección</span>
						</div>
						<div style={{fontFamily, fontWeight: 700, fontSize: 26 * s, color: theme.textDim, ...shadow}}>
							y baja la testosterona esa noche
						</div>
					</SidePanel>
				);
			})()}

			{/* S6 FULL — sin/con alcohol (32-36.5s) */}
			{s6 > 0 && (
				<AbsoluteFill style={{opacity: s6, background: theme.fullBg, justifyContent: 'center', alignItems: 'center'}}>
					<GridBg s={s} />
					<AbsoluteFill style={{backgroundImage: 'radial-gradient(circle at 50% 45%, rgba(255,90,95,0.14), transparent 60%)'}} />
					<div style={{textAlign: 'center', transform: `scale(${0.92 + s6 * 0.08})`}}>
						<Kicker s={s} color={theme.accent}>La trampa</Kicker>
						<div style={{fontFamily, fontWeight: 900, fontSize: 60 * s, color: theme.text, lineHeight: 1.2, marginTop: 14 * s}}>
							SIN alcohol → <span style={{color: theme.accent}}>↑ ansiedad</span><br />
							CON alcohol → <span style={{color: theme.accent}}>↓ función</span>
						</div>
					</div>
				</AbsoluteFill>
			)}

			{/* S7 overlay left — es una trampa (36.8-40.6s) */}
			{(() => {
				const o = lifecycle(frame, 920, 1015, 9);
				if (o <= 0) return null;
				return (
					<SidePanel s={s} o={o} side="left" top={270}>
						<span style={{fontSize: 46 * s}}>🪤</span>
						<div style={{fontFamily, fontWeight: 900, fontSize: 52 * s, color: theme.text, lineHeight: 1, ...shadow}}>
							Es una <span style={{color: theme.accent}}>trampa</span>
						</div>
					</SidePanel>
				);
			})()}

			{/* S8 overlay right — señal de algo que trabajar (41-44.6s) */}
			{(() => {
				const o = lifecycle(frame, 1030, 1115, 8);
				if (o <= 0) return null;
				return (
					<SidePanel s={s} o={o} side="right" top={210}>
						<div style={{fontFamily, fontWeight: 900, fontSize: 42 * s, color: theme.text, lineHeight: 1.08, ...shadow}}>
							Señal de algo<br />que <span style={{color: theme.c1}}>trabajar</span>
						</div>
					</SidePanel>
				);
			})()}

			{/* S9 FULL open-loop — siguiente error (48.6-51.5s) */}
			{s9 > 0 && (
				<AbsoluteFill style={{opacity: s9, background: theme.fullBg, justifyContent: 'center', alignItems: 'center'}}>
					<GridBg s={s} />
					<div style={{textAlign: 'center', transform: `translateY(${(1 - s9) * 26 * s}px)`}}>
						<Kicker s={s} color={theme.accent}>El siguiente error…</Kicker>
						<div style={{fontFamily, fontWeight: 900, fontSize: 84 * s, color: theme.text, lineHeight: 1.05, marginTop: 12 * s}}>
							LO HICISTE<br /><span style={{color: theme.accent}}>ANOCHE</span>
						</div>
					</div>
				</AbsoluteFill>
			)}

			{/* S10 FULL stat — 15 años testosterona (51.6-57.5s) */}
			{s10 > 0 && (
				<AbsoluteFill style={{opacity: s10, background: theme.fullBg, justifyContent: 'center', alignItems: 'center'}}>
					<GridBg s={s} />
					<AbsoluteFill style={{backgroundImage: 'radial-gradient(circle at 50% 45%, rgba(255,90,95,0.16), transparent 60%)'}} />
					<div style={{textAlign: 'center', transform: `scale(${0.92 + s10 * 0.08})`}}>
						<Kicker s={s} color={theme.accent}>Te cuesta</Kicker>
						<div style={{fontFamily, fontWeight: 900, fontSize: 190 * s, color: theme.accent, lineHeight: 1, marginTop: 26 * s, ...shadow}}>
							-15 AÑOS
						</div>
						<div style={{fontFamily, fontWeight: 800, fontSize: 46 * s, color: theme.text, marginTop: 10 * s}}>
							DE TESTOSTERONA EN 1 SEMANA 👀
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
