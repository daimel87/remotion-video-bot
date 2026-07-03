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
		[210, 1.05],
		[540, 1.06],
		[545, 1.0],
		[650, 1.0],
		[820, 1.05],
		[825, 1.0],
		[910, 1.0],
		[1245, 1.06],
		[1250, 1.0],
		[1391, 1.0],
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

export const Error2: React.FC = () => {
	const frame = useCurrentFrame();
	const {width} = useVideoConfig();
	const s = width / 1920;
	const sc = zoom(frame);

	const s1 = lifecycle(frame, 0, 95, 8);        // title
	const s4 = lifecycle(frame, 545, 650, 6);     // 30-40 min stat
	const s6 = lifecycle(frame, 825, 910, 7);     // circulación
	const s10 = frame >= 1250 ? animIn(frame, 1254, 12) : 0; // open loop

	const fsActive =
		(frame >= 0 && frame <= 95) ||
		(frame >= 545 && frame <= 650) ||
		(frame >= 825 && frame <= 910) ||
		frame >= 1250;
	const wmVisible = !fsActive;

	return (
		<AbsoluteFill style={{backgroundColor: '#000'}}>
			<FontFace />
			<AbsoluteFill style={{transform: `scale(${sc})`, transformOrigin: '50% 29%'}}>
				<OffthreadVideo src={staticFile('error2_intro.mp4')} />
			</AbsoluteFill>

			{/* S1 FULL title */}
			{s1 > 0 && (
				<AbsoluteFill style={{opacity: s1, background: theme.fullBg, justifyContent: 'center', alignItems: 'center'}}>
					<GridBg s={s} />
					<div style={{textAlign: 'center', transform: `translateY(${(1 - s1) * 30 * s}px)`}}>
						<div style={{display: 'inline-block', background: theme.accent, borderRadius: 12 * s, padding: `${8 * s}px ${28 * s}px`, fontFamily, fontWeight: 900, fontSize: 34 * s, color: '#fff', letterSpacing: 4 * s, marginBottom: 24 * s}}>
							ERROR #2
						</div>
						<div style={{fontFamily, fontWeight: 900, fontSize: 92 * s, color: theme.text, lineHeight: 1, maxWidth: 1500 * s}}>
							EL CELULAR<br /><span style={{color: theme.c1}}>EN EL BAÑO</span>
						</div>
					</div>
				</AbsoluteFill>
			)}

			{/* S2 overlay right — casi todo el mundo */}
			{(() => {
				const o = lifecycle(frame, 130, 215, 9);
				if (o <= 0) return null;
				return (
					<SidePanel s={s} o={o} side="right" top={150}>
						<Kicker s={s}>El error que</Kicker>
						<div style={{fontFamily, fontWeight: 900, fontSize: 44 * s, color: theme.text, lineHeight: 1.05, ...shadow}}>
							Casi <span style={{color: theme.c1}}>todos</span> cometen
						</div>
					</SidePanel>
				);
			})()}

			{/* S3 overlay left — nervio pudendo / periné */}
			{(() => {
				const o = lifecycle(frame, 240, 520, 10);
				if (o <= 0) return null;
				return (
					<SidePanel s={s} o={o} side="left" top={250}>
						<span style={{fontSize: 44 * s}}>⚠️</span>
						<div style={{fontFamily, fontWeight: 900, fontSize: 42 * s, color: theme.text, lineHeight: 1.08, ...shadow}}>
							Presión en el<br /><span style={{color: theme.accent}}>nervio pudendo</span>
						</div>
						<div style={{fontFamily, fontWeight: 700, fontSize: 24 * s, color: theme.textDim, ...shadow}}>
							La zona entre el escroto y el ano
						</div>
					</SidePanel>
				);
			})()}

			{/* S4 FULL stat — 30-40 min */}
			{s4 > 0 && (
				<AbsoluteFill style={{opacity: s4, background: theme.fullBg, justifyContent: 'center', alignItems: 'center'}}>
					<GridBg s={s} />
					<div style={{textAlign: 'center', transform: `scale(${0.9 + s4 * 0.1})`}}>
						<Kicker s={s}>Hay quien pasa</Kicker>
						<div style={{fontFamily, fontWeight: 900, fontSize: 240 * s, color: theme.c1, lineHeight: 1, ...shadow}}>
							30–40
						</div>
						<div style={{fontFamily, fontWeight: 900, fontSize: 54 * s, color: theme.text, marginTop: 10 * s}}>
							MINUTOS AL DÍA EN EL BAÑO
						</div>
					</div>
				</AbsoluteFill>
			)}

			{/* S5 overlay left — adormecimiento */}
			{(() => {
				const o = lifecycle(frame, 660, 820, 10);
				if (o <= 0) return null;
				return (
					<SidePanel s={s} o={o} side="left" top={260}>
						<Kicker s={s} color={theme.accent}>Consecuencias</Kicker>
						<div style={{fontFamily, fontWeight: 900, fontSize: 44 * s, color: theme.text, lineHeight: 1.08, ...shadow}}>
							Adormecimiento y<br />pérdida de <span style={{color: theme.accent}}>sensibilidad</span>
						</div>
					</SidePanel>
				);
			})()}

			{/* S6 FULL — circulación local */}
			{s6 > 0 && (
				<AbsoluteFill style={{opacity: s6, background: theme.fullBg, justifyContent: 'center', alignItems: 'center'}}>
					<GridBg s={s} />
					<AbsoluteFill style={{backgroundImage: 'radial-gradient(circle at 50% 45%, rgba(255,90,95,0.16), transparent 60%)'}} />
					<div style={{textAlign: 'center', transform: `scale(${0.92 + s6 * 0.08})`}}>
						<div style={{fontSize: 80 * s, marginBottom: 6 * s}}>🩸</div>
						<div style={{fontFamily, fontWeight: 900, fontSize: 96 * s, color: theme.accent, lineHeight: 1}}>
							↓ CIRCULACIÓN
						</div>
						<div style={{fontFamily, fontWeight: 800, fontSize: 44 * s, color: theme.text, marginTop: 10 * s}}>
							LOCAL, A LARGO PLAZO
						</div>
					</div>
				</AbsoluteFill>
			)}

			{/* S7 overlay right — no es sala de entretenimiento */}
			{(() => {
				const o = lifecycle(frame, 918, 985, 8);
				if (o <= 0) return null;
				return (
					<SidePanel s={s} o={o} side="right" top={200}>
						<div style={{fontFamily, fontWeight: 900, fontSize: 46 * s, color: theme.text, lineHeight: 1.05, ...shadow}}>
							El baño <span style={{color: theme.accent}}>NO</span> es<br />sala de estar
						</div>
					</SidePanel>
				);
			})()}

			{/* S8 overlay left — entra haz y sal */}
			{(() => {
				const o = lifecycle(frame, 990, 1110, 10);
				if (o <= 0) return null;
				return (
					<SidePanel s={s} o={o} side="left" top={270}>
						<span style={{fontSize: 44 * s}}>✅</span>
						<div style={{fontFamily, fontWeight: 900, fontSize: 46 * s, color: theme.text, lineHeight: 1.05, ...shadow}}>
							Entra, haz lo tuyo<br />y <span style={{color: theme.c1}}>sal</span>
						</div>
					</SidePanel>
				);
			})()}

			{/* S9 overlay right — te lo agradecerá */}
			{(() => {
				const o = lifecycle(frame, 1120, 1205, 9);
				if (o <= 0) return null;
				return (
					<SidePanel s={s} o={o} side="right" top={230}>
						<span style={{fontSize: 46 * s}}>🙏</span>
						<div style={{fontFamily, fontWeight: 900, fontSize: 46 * s, color: theme.text, lineHeight: 1.05, ...shadow}}>
							Tu cuerpo te lo<br /><span style={{color: theme.c1}}>agradecerá</span>
						</div>
					</SidePanel>
				);
			})()}

			{/* S10 FULL open-loop → ERROR #3 */}
			{s10 > 0 && (
				<AbsoluteFill style={{opacity: s10, background: theme.fullBg, justifyContent: 'center', alignItems: 'center'}}>
					<GridBg s={s} />
					<AbsoluteFill style={{backgroundImage: 'radial-gradient(circle at 50% 45%, rgba(255,90,95,0.16), transparent 60%)'}} />
					<div style={{textAlign: 'center', transform: `scale(${0.92 + s10 * 0.08})`, maxWidth: 1500 * s}}>
						<Kicker s={s} color={theme.accent}>Espera a escuchar…</Kicker>
						<div style={{fontFamily, fontWeight: 900, fontSize: 92 * s, color: theme.text, lineHeight: 1.02, marginTop: 14 * s}}>
							EL <span style={{color: theme.accent}}>ERROR #3</span><br />ARRUINÓ HOMBRES DE 28
						</div>
						<div style={{fontFamily, fontWeight: 700, fontSize: 32 * s, color: theme.textDim, marginTop: 22 * s}}>
							…y no entienden por qué 👀
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
