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
		[400, 1.05],
		[980, 1.06],
		[985, 1.0],
		[1180, 1.0],
		[1295, 1.06],
		[1300, 1.0],
		[1440, 1.0],
		[1605, 1.06],
		[1610, 1.0],
		[1920, 1.0],
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

export const Error10: React.FC = () => {
	const frame = useCurrentFrame();
	const {width} = useVideoConfig();
	const s = width / 1920;
	const sc = zoom(frame);

	const s1 = lifecycle(frame, 0, 95, 8);        // title (0-8s)
	const s7 = lifecycle(frame, 985, 1180, 7);    // modo evitacion (39.4-47.2s)
	const s8 = lifecycle(frame, 1300, 1440, 6);   // no protege deteriora (52-57.6s)
	const s10 = frame >= 1610 ? animIn(frame, 1614, 14) : 0; // final positivo (64.4s+)

	const fsActive =
		(frame >= 0 && frame <= 95) ||
		(frame >= 985 && frame <= 1180) ||
		(frame >= 1300 && frame <= 1440) ||
		frame >= 1610;
	const wmVisible = !fsActive;

	return (
		<AbsoluteFill style={{backgroundColor: '#000'}}>
			<FontFace />
			<AbsoluteFill style={{transform: `scale(${sc})`, transformOrigin: '50% 29%'}}>
				<OffthreadVideo src={staticFile('error10_intro.mp4')} />
			</AbsoluteFill>

			{/* S1 FULL title */}
			{s1 > 0 && (
				<AbsoluteFill style={{opacity: s1, background: theme.fullBg, justifyContent: 'center', alignItems: 'center'}}>
					<GridBg s={s} />
					<div style={{textAlign: 'center', transform: `translateY(${(1 - s1) * 30 * s}px)`}}>
						<div style={{display: 'inline-block', background: theme.accent, borderRadius: 12 * s, padding: `${8 * s}px ${28 * s}px`, fontFamily, fontWeight: 900, fontSize: 34 * s, color: '#fff', letterSpacing: 4 * s, marginBottom: 24 * s}}>
							ERROR #10
						</div>
						<div style={{fontFamily, fontWeight: 900, fontSize: 90 * s, color: theme.text, lineHeight: 1.02, maxWidth: 1500 * s}}>
							EVITAR LA INTIMIDAD<br /><span style={{color: theme.c1}}>POR VERGÜENZA</span>
						</div>
					</div>
				</AbsoluteFill>
			)}

			{/* S2 overlay right — afecta en silencio (4.4-10s) */}
			{(() => {
				const o = lifecycle(frame, 110, 250, 9);
				if (o <= 0) return null;
				return (
					<SidePanel s={s} o={o} side="right" top={150}>
						<div style={{fontFamily, fontWeight: 900, fontSize: 44 * s, color: theme.text, lineHeight: 1.08, ...shadow}}>
							El que más afecta<br /><span style={{color: theme.accent}}>en silencio</span>
						</div>
					</SidePanel>
				);
			})()}

			{/* S3 overlay left — evitar la intimidad (15.6-20.4s) */}
			{(() => {
				const o = lifecycle(frame, 390, 510, 9);
				if (o <= 0) return null;
				return (
					<SidePanel s={s} o={o} side="left" top={260}>
						<div style={{fontFamily, fontWeight: 900, fontSize: 46 * s, color: theme.text, lineHeight: 1.08, ...shadow}}>
							Evitan la <span style={{color: theme.accent}}>intimidad</span><br />por completo
						</div>
					</SidePanel>
				);
			})()}

			{/* S4 overlay right — miedo (21.6-26.4s) */}
			{(() => {
				const o = lifecycle(frame, 540, 660, 9);
				if (o <= 0) return null;
				return (
					<SidePanel s={s} o={o} side="right" top={210}>
						<div style={{fontFamily, fontWeight: 900, fontSize: 42 * s, color: theme.text, lineHeight: 1.18, ...shadow}}>
							Miedo a fallar<br />a la vergüenza<br />a decepcionar
						</div>
					</SidePanel>
				);
			})()}

			{/* S5 overlay left — necesita flujo (27.2-32s) */}
			{(() => {
				const o = lifecycle(frame, 680, 800, 9);
				if (o <= 0) return null;
				return (
					<SidePanel s={s} o={o} side="left" top={250}>
						<span style={{fontSize: 44 * s}}>🩸</span>
						<div style={{fontFamily, fontWeight: 900, fontSize: 40 * s, color: theme.text, lineHeight: 1.12, ...shadow}}>
							Necesita flujo regular<br />para <span style={{color: theme.c1}}>mantenerse sano</span>
						</div>
					</SidePanel>
				);
			})()}

			{/* S6 overlay right — nocturnas + sexo (33.2-38.4s) */}
			{(() => {
				const o = lifecycle(frame, 830, 960, 9);
				if (o <= 0) return null;
				return (
					<SidePanel s={s} o={o} side="right" top={210}>
						<div style={{fontFamily, fontWeight: 900, fontSize: 40 * s, color: theme.text, lineHeight: 1.18, ...shadow}}>
							Erecciones nocturnas<br />+ actividad sexual<br />lo mantienen
						</div>
					</SidePanel>
				);
			})()}

			{/* S7 FULL — modo evitacion (39.4-47.2s) */}
			{s7 > 0 && (
				<AbsoluteFill style={{opacity: s7, background: theme.fullBg, justifyContent: 'center', alignItems: 'center'}}>
					<GridBg s={s} />
					<AbsoluteFill style={{backgroundImage: 'radial-gradient(circle at 50% 45%, rgba(255,90,95,0.16), transparent 60%)'}} />
					<div style={{textAlign: 'center', transform: `scale(${0.92 + s7 * 0.08})`}}>
						<Kicker s={s} color={theme.accent}>El modo evitación</Kicker>
						<div style={{fontFamily, fontWeight: 900, fontSize: 76 * s, color: theme.text, lineHeight: 1.15, marginTop: 14 * s}}>
							↑ ANSIEDAD · ↓ CONFIANZA<br /><span style={{color: theme.accent}}>↓ DESEO</span>
						</div>
					</div>
				</AbsoluteFill>
			)}

			{/* S8 FULL — no protege, deteriora (52-57.6s) */}
			{s8 > 0 && (
				<AbsoluteFill style={{opacity: s8, background: theme.fullBg, justifyContent: 'center', alignItems: 'center'}}>
					<GridBg s={s} />
					<div style={{textAlign: 'center', transform: `scale(${0.92 + s8 * 0.08})`}}>
						<Kicker s={s} color={theme.accent}>La evitación</Kicker>
						<div style={{fontFamily, fontWeight: 900, fontSize: 100 * s, color: theme.text, lineHeight: 1.1, marginTop: 14 * s}}>
							NO PROTEGE<br /><span style={{color: theme.accent}}>DETERIORA</span>
						</div>
					</div>
				</AbsoluteFill>
			)}

			{/* S9 overlay left — un episodio no te define (58.2-63.6s) */}
			{(() => {
				const o = lifecycle(frame, 1455, 1590, 9);
				if (o <= 0) return null;
				return (
					<SidePanel s={s} o={o} side="left" top={250}>
						<div style={{fontFamily, fontWeight: 900, fontSize: 44 * s, color: theme.text, lineHeight: 1.12, ...shadow}}>
							Un episodio malo<br /><span style={{color: theme.c1}}>no te define</span>
						</div>
					</SidePanel>
				);
			})()}

			{/* S10 FULL — cierre positivo (64.4s+) */}
			{s10 > 0 && (
				<AbsoluteFill style={{opacity: s10, background: theme.fullBg, justifyContent: 'center', alignItems: 'center'}}>
					<GridBg s={s} />
					<AbsoluteFill style={{backgroundImage: 'radial-gradient(circle at 50% 45%, rgba(6,182,212,0.18), transparent 60%)'}} />
					<div style={{textAlign: 'center', transform: `scale(${0.92 + s10 * 0.08})`, maxWidth: 1600 * s}}>
						<Kicker s={s}>Habla con un especialista</Kicker>
						<div style={{fontFamily, fontWeight: 900, fontSize: 84 * s, color: theme.text, lineHeight: 1.1, marginTop: 14 * s}}>
							HAY <span style={{color: theme.c1}}>VIDA SEXUAL</span><br />DESPUÉS DE LOS 50, 60<br />Y MÁS ALLÁ
						</div>
						<div style={{fontFamily, fontWeight: 700, fontSize: 34 * s, color: theme.textDim, marginTop: 22 * s}}>
							Hay opciones · hay soluciones ❤️
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
