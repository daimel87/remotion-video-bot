import {
	AbsoluteFill,
	OffthreadVideo,
	Sequence,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
	interpolate,
	spring,
} from 'remotion';
import {theme, EASE_OUT, EASE_IN, shadow} from './video_errores/theme';
import {CaptionBox} from './components/CaptionBox';

// ============================================================
// NeuropatiaEdit — 25fps, 8364 frames (334.56s)
//
// The SOURCE clip (prueba_neuropatia.mp4) already contains its OWN
// baked-in b-roll (turmeric powder/root, pills, spoon, the glowing
// knee/nerve, the opening foot massage) plus a weak "DA CLIC" outro.
// We RESPECT those b-rolls: full-screen Remotion graphics are placed
// ONLY over clean talking-head windows, never over the source b-roll.
//
// Source b-roll segments (seconds), do NOT cover with graphics:
//   0.0–3.2 foot massage | 29.7–38 knee/nerve | 51.3–70.5 turmeric
//   120.7–126.6 turmeric | 138.2–147 root | 163–171 spoon
//   214–239 turmeric | 245–253 pills | 262–269 spoon | 322.8–end outro
//
// Emphasis captions may sit over talking-head OR over a source b-roll
// (when the line matters), but NEVER over a full-screen graphic.
// ============================================================

// ---- Full-screen graphic windows (all on clean talking-head) ----
const G_BEN1: [number, number] = [2100, 2225];
const G_BEN2: [number, number] = [2650, 2775];
const G_BEN3: [number, number] = [3175, 3300];
const G_BEN4: [number, number] = [3688, 3812];
const G_BEN5: [number, number] = [4288, 4412];
const G_FOOD: [number, number] = [4775, 5325];
// Subscribe card covers the weak baked-in outro at the tail.
const G_SUB: [number, number] = [8000, 8364];

// Windows during which the doctor shrinks to a corner PIP (graphic on top).
// Subscribe is excluded — the source there is the baked outro, not talking head.
const PIP_RANGES: [number, number][] = [G_BEN1, G_BEN2, G_BEN3, G_BEN4, G_BEN5, G_FOOD];
const TRANS = 18;

const pipAmount = (frame: number) => {
	for (const [a, b] of PIP_RANGES) {
		if (frame >= a - TRANS && frame < a) {
			return interpolate(frame, [a - TRANS, a], [0, 1], {easing: EASE_OUT, extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
		}
		if (frame >= a && frame <= b) return 1;
		if (frame > b && frame <= b + TRANS) {
			return interpolate(frame, [b, b + TRANS], [1, 0], {easing: EASE_IN, extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
		}
	}
	return 0;
};

// Subtle push-in on the three long talking-head windows (resets at source cuts).
const FULL_SEGMENTS: [number, number][] = [
	[1762, 3018],
	[4277, 5350],
	[6734, 8000],
];
const pushZoom = (frame: number) => {
	for (const [a, b] of FULL_SEGMENTS) {
		if (frame >= a && frame <= b) {
			return interpolate(frame, [a, b], [1, 1.05], {easing: EASE_OUT, extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
		}
	}
	return 1;
};

const PipVideo: React.FC = () => {
	const frame = useCurrentFrame();
	const {width} = useVideoConfig();
	const s = width / 1920;
	const p = pipAmount(frame);
	const zoom = pushZoom(frame) * (1 - p) + p;

	const pipSize = 300 * s;
	const margin = 44 * s;
	const w = interpolate(p, [0, 1], [width, pipSize]);
	const h = interpolate(p, [0, 1], [1080 * s, pipSize]);
	const top = interpolate(p, [0, 1], [0, margin]);
	const left = interpolate(p, [0, 1], [0, width - pipSize - margin]);
	const radius = interpolate(p, [0, 1], [0, pipSize / 2]);
	const border = interpolate(p, [0, 1], [0, 5 * s]);
	// Fade the pip out before the baked outro so it never peeks through the subscribe card.
	const tailFade = interpolate(frame, [7940, 7990], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	return (
		<div
			style={{
				position: 'absolute',
				top,
				left,
				width: w,
				height: h,
				borderRadius: radius,
				overflow: 'hidden',
				opacity: tailFade,
				border: `${border}px solid rgba(255,255,255,${p})`,
				boxShadow: p > 0.05 ? `0 ${14 * s}px ${40 * s}px rgba(0,0,0,${0.5 * p})` : 'none',
				transform: `scale(${zoom})`,
				transformOrigin: '50% 30%',
			}}
		>
			<OffthreadVideo src={staticFile('prueba_neuropatia.mp4')} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
		</div>
	);
};

const BeneficioTitle: React.FC<{num: number; title: string; range: [number, number]}> = ({num, title, range}) => {
	const frame = useCurrentFrame();
	const {width} = useVideoConfig();
	const s = width / 1920;
	const o = interpolate(
		frame,
		[range[0] - TRANS, range[0], range[1], range[1] + TRANS],
		[0, 1, 1, 0],
		{extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_OUT}
	);
	if (o <= 0) return null;
	const scale = interpolate(o, [0, 1], [0.9, 1]);
	return (
		<AbsoluteFill style={{opacity: o, background: theme.fullBg, justifyContent: 'center', alignItems: 'center'}}>
			<div style={{textAlign: 'center', transform: `scale(${scale})`, maxWidth: 1500 * s}}>
				<div
					style={{
						display: 'inline-block',
						background: theme.grad,
						borderRadius: 16 * s,
						padding: `${10 * s}px ${34 * s}px`,
						fontFamily: 'Helvetica, Arial, sans-serif',
						fontWeight: 900,
						fontSize: 44 * s,
						color: '#fff',
						letterSpacing: 4 * s,
						marginBottom: 30 * s,
					}}
				>
					BENEFICIO {num}
				</div>
				<div style={{fontFamily: 'Helvetica, Arial, sans-serif', fontWeight: 900, fontSize: 74 * s, color: theme.text, lineHeight: 1.1}}>
					{title}
				</div>
			</div>
		</AbsoluteFill>
	);
};

const FOOD_ITEMS = [
	{emoji: '🌻', label: 'Vitamina B1', food: 'Semillas de girasol, legumbres', at: 4820},
	{emoji: '🐟', label: 'Omega 3', food: 'Salmón, sardinas', at: 4900},
	{emoji: '🥬', label: 'Folato', food: 'Espinaca, hojas verdes', at: 4980},
	{emoji: '🌰', label: 'Vitamina E', food: 'Almendras', at: 5060},
];

const FoodListCard: React.FC = () => {
	const frame = useCurrentFrame();
	const {width} = useVideoConfig();
	const s = width / 1920;
	const o = interpolate(
		frame,
		[G_FOOD[0] - TRANS, G_FOOD[0], G_FOOD[1], G_FOOD[1] + TRANS],
		[0, 1, 1, 0],
		{extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_OUT}
	);
	if (o <= 0) return null;

	return (
		<AbsoluteFill style={{opacity: o, background: 'rgba(8, 16, 40, 0.94)', justifyContent: 'center', alignItems: 'center', padding: 50 * s, paddingTop: 140 * s}}>
			<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 34 * s, maxWidth: 1700 * s, width: '100%'}}>
				<div style={{fontFamily: 'Helvetica, Arial, sans-serif', fontWeight: 900, fontSize: 62 * s, color: '#fff', textAlign: 'center', ...shadow}}>
					🌿 Mejor con estos aliados
				</div>
				<div style={{display: 'flex', flexDirection: 'column', gap: 18 * s, width: '100%'}}>
					{FOOD_ITEMS.map((item, i) => {
						const enter = spring({frame: Math.max(0, frame - item.at), fps: 25, config: {damping: 200, stiffness: 150}});
						const tx = interpolate(enter, [0, 1], [-40, 0]) * s;
						return (
							<div
								key={i}
								style={{
									opacity: enter,
									transform: `translateX(${tx}px)`,
									display: 'flex',
									alignItems: 'center',
									gap: 26 * s,
									padding: `${20 * s}px ${34 * s}px`,
									background: 'rgba(255,255,255,0.06)',
									borderRadius: 16 * s,
									borderLeft: `5px solid ${theme.c1}`,
								}}
							>
								<div style={{fontSize: 68 * s}}>{item.emoji}</div>
								<div style={{fontFamily: 'Helvetica, Arial, sans-serif', fontWeight: 900, fontSize: 48 * s, color: theme.c1}}>
									{item.label} <span style={{color: '#e8f0f8', fontWeight: 600, fontSize: 40 * s}}>· {item.food}</span>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</AbsoluteFill>
	);
};

const SubscribeCard: React.FC = () => {
	const frame = useCurrentFrame();
	const {width} = useVideoConfig();
	const s = width / 1920;
	const o = interpolate(frame, [G_SUB[0] - 40, G_SUB[0]], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	if (o <= 0) return null;
	return (
		<AbsoluteFill style={{background: theme.fullBg, opacity: o, justifyContent: 'center', alignItems: 'center'}}>
			<div style={{textAlign: 'center', transform: `scale(${interpolate(o, [0, 1], [0.92, 1])})`}}>
				<div style={{fontFamily: 'Helvetica, Arial, sans-serif', fontWeight: 900, fontSize: 76 * s, color: theme.c1, letterSpacing: 2 * s}}>
					SALUD DESPUÉS DE LOS 50
				</div>
				<div
					style={{
						marginTop: 50 * s,
						display: 'inline-flex',
						alignItems: 'center',
						gap: 22 * s,
						background: '#ff0000',
						borderRadius: 24 * s,
						padding: `${34 * s}px ${72 * s}px`,
						boxShadow: '0 0 60px rgba(255,0,0,0.6)',
					}}
				>
					<span style={{fontSize: 60 * s, color: '#fff'}}>▶</span>
					<span style={{fontFamily: 'Helvetica, Arial, sans-serif', fontWeight: 900, fontSize: 72 * s, color: '#fff'}}>SUSCRÍBETE</span>
				</div>
				<div style={{marginTop: 44 * s, fontFamily: 'Helvetica, Arial, sans-serif', fontWeight: 700, fontSize: 46 * s, color: '#fff'}}>
					Información clara y confiable para su bienestar
				</div>
			</div>
		</AbsoluteFill>
	);
};

// Emphasis captions — key lines only. Placed on talking-head or over a
// source b-roll, NEVER during a full-screen graphic window above.
const CAPTIONS: {from: number; to: number; text: string}[] = [
	{from: 500, to: 700, text: 'No es una cura milagrosa'},
	{from: 1400, to: 1700, text: 'La curcumina reduce la inflamación alrededor del nervio'},
	{from: 2400, to: 2600, text: 'Menos ardor y menos dolor punzante'},
	{from: 2830, to: 3070, text: 'La mielina protege el nervio, como el forro de un cable'},
	{from: 3330, to: 3570, text: 'Mejora la circulación que nutre el nervio'},
	{from: 3880, to: 4120, text: 'El BDNF ayuda a reparar las fibras dañadas'},
	{from: 5650, to: 6000, text: '⚠️ Consulte a su médico si toma anticoagulantes'},
	{from: 6200, to: 6480, text: 'Como alimento diario, es segura para la mayoría'},
	{from: 6575, to: 6820, text: '½ cucharadita al día, con una pizca de pimienta negra'},
	{from: 6880, to: 7120, text: 'Acompáñela con salmón, almendras, espinaca y aguacate'},
	{from: 7250, to: 7500, text: '💬 ¿Siente hormigueo en los pies? Cuéntenos'},
	{from: 7700, to: 7900, text: 'Suscríbase para más consejos de salud'},
];

export const NeuropatiaEdit: React.FC = () => {
	const frame = useCurrentFrame();

	return (
		<AbsoluteFill style={{backgroundColor: '#000'}}>
			{/* Full-screen structural graphics — talking-head windows only.
			    Rendered BELOW the video so the shrinking pip lands on top of them. */}
			<BeneficioTitle num={1} title="Reduce la inflamación del nervio" range={G_BEN1} />
			<BeneficioTitle num={2} title="Antioxidante que protege la mielina" range={G_BEN2} />
			<BeneficioTitle num={3} title="Mejora la circulación hacia manos y pies" range={G_BEN3} />
			<BeneficioTitle num={4} title="Apoya la producción de BDNF" range={G_BEN4} />
			<BeneficioTitle num={5} title="Complementa B1, B6, folato y omega 3" range={G_BEN5} />
			<FoodListCard />
			<SubscribeCard />

			{/* Source clip: full-screen (respects baked-in b-rolls), morphs to a
			    corner circle over the graphics, then fades before the outro. */}
			<PipVideo />

			{/* Emphasis captions */}
			{CAPTIONS.map((c, i) => (
				<Sequence key={i} from={c.from} durationInFrames={c.to - c.from}>
					<CaptionBox text={c.text} />
				</Sequence>
			))}

			{/* Channel watermark — hidden during full-screen graphics and outro */}
			{pipAmount(frame) < 0.3 && frame < G_SUB[0] - 40 && (
				<div style={{position: 'absolute', bottom: 44, left: 54, display: 'flex', alignItems: 'center', gap: 12, opacity: 0.9}}>
					<span style={{fontSize: 34}}>🩺</span>
					<span style={{fontFamily: 'Helvetica, Arial, sans-serif', fontWeight: 800, fontSize: 30, color: '#fff', letterSpacing: 1, ...shadow}}>
						SALUD DESPUÉS DE LOS 50
					</span>
				</div>
			)}
		</AbsoluteFill>
	);
};
