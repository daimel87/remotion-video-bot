import {
	AbsoluteFill,
	OffthreadVideo,
	Sequence,
	Loop,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
	interpolate,
	spring,
} from 'remotion';
import {theme, EASE_OUT, EASE_IN, EASE_IN_OUT, shadow} from './video_errores/theme';
import {CaptionBox} from './components/CaptionBox';

// ============================================================
// NeuropatiaEdit — 25fps, 8364 frames (334.56s)
//
// Two video sources:
//   • prueba_neuropatia.mp4  → BASE (full-screen). Talking head synced to
//     the voice + the client's own baked-in b-rolls (turmeric, pills,
//     spoon, knee/nerve). This track also carries the AUDIO (the voice).
//   • doctora_circulo.mp4    → clean talking-head loop, MUTED. Shown in a
//     corner CIRCLE over every b-roll and every full-screen graphic, so the
//     doctor stays present even when the base cuts to a b-roll.
//
// Circle appears (smooth ease) over b-rolls + graphics, and retracts to
// full-screen talking head landing on the next phrase. Emphasis captions
// are short (leave as soon as the idea is said) and never sit over a graphic.
// ============================================================

const TRANS = 20;

// ---- Full-screen graphic windows (start right after any preceding b-roll) ----
const G_BEN1: [number, number] = [2100, 2200];
const G_BEN2: [number, number] = [2650, 2775];
const G_BEN3: [number, number] = [3165, 3300];
const G_BEN4: [number, number] = [3675, 3825];
const G_BEN5: [number, number] = [4277, 4475];
const G_FOOD: [number, number] = [4775, 5450];
const G_SUB: [number, number] = [8000, 8364];
const GRAPHICS = [G_BEN1, G_BEN2, G_BEN3, G_BEN4, G_BEN5, G_FOOD];

// ---- Circle windows: the source's own b-rolls, merged with the adjacent
//      graphic windows so the doctor circle stays up continuously. ----
const CIRCLE_WINDOWS: [number, number][] = [
	[80, 283],     // legs / foot (opening b-roll)
	[742, 950],    // knee / nerve glow
	[1154, 1283],  // turmeric root
	[1376, 1762],  // turmeric bowl
	G_BEN1,
	G_BEN2,
	[2300, 2472],  // turmeric close-up (benefit 1 study)
	[3018, 3300],  // glass bowl → Beneficio 3
	[3454, 3825],  // root       → Beneficio 4
	[4076, 4475],  // spoon      → Beneficio 5
	[4566, 4625],  // turmeric powder drop
	G_FOOD,
	[5490, 5980],  // turmeric table (warning section)
	[6131, 6336],  // pills
	[6561, 6734],  // spoon (protocol)
];

// envelope: 0 → ramp-up over [a, a+tin] → 1 → ramp-down over [b-tout, b] → 0
const envelope = (frame: number, a: number, b: number, tin = TRANS, tout = TRANS) => {
	if (frame < a || frame > b) return 0;
	const up = interpolate(frame, [a, a + tin], [0, 1], {easing: EASE_OUT, extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const down = interpolate(frame, [b - tout, b], [1, 0], {easing: EASE_IN, extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	return Math.min(up, down);
};

const circleAmount = (frame: number) => {
	for (const [a, b] of CIRCLE_WINDOWS) {
		const e = envelope(frame, a, b, TRANS, TRANS);
		if (e > 0) return e;
	}
	return 0;
};

const graphicAmount = (frame: number, range: [number, number]) => envelope(frame, range[0], range[1], TRANS, TRANS);

// Subtle push-in on the long talking-head windows of the base clip.
const FULL_SEGMENTS: [number, number][] = [
	[1762, 2100],
	[2472, 3018],
	[3300, 3454],
	[3825, 4076],
	[4625, 4775],
	[5980, 6131],
	[6734, 7900],
];
const pushZoom = (frame: number) => {
	for (const [a, b] of FULL_SEGMENTS) {
		if (frame >= a && frame <= b) {
			return interpolate(frame, [a, b], [1, 1.04], {easing: EASE_OUT, extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
		}
	}
	return 1;
};

// ---- Base: original clip full-screen, carries the audio (voice) ----
const BaseVideo: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<AbsoluteFill style={{transform: `scale(${pushZoom(frame)})`, transformOrigin: '50% 28%'}}>
			<OffthreadVideo src={staticFile('prueba_neuropatia.mp4')} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
		</AbsoluteFill>
	);
};

// ---- Doctor circle: clean loop, muted, appears over b-rolls & graphics ----
const DoctorCircle: React.FC = () => {
	const frame = useCurrentFrame();
	const {width} = useVideoConfig();
	const s = width / 1920;
	const p = circleAmount(frame);
	if (p <= 0) return null;

	const size = 320 * s;
	const margin = 46 * s;
	const scale = interpolate(p, [0, 1], [0.7, 1]);
	return (
		<div
			style={{
				position: 'absolute',
				top: margin,
				right: margin,
				width: size,
				height: size,
				opacity: p,
				transform: `scale(${scale})`,
				transformOrigin: '100% 0%',
				borderRadius: '50%',
				overflow: 'hidden',
				border: `${5 * s}px solid rgba(255,255,255,0.95)`,
				boxShadow: `0 ${14 * s}px ${40 * s}px rgba(0,0,0,0.5)`,
			}}
		>
			<Loop durationInFrames={2080}>
				<OffthreadVideo src={staticFile('doctora_circulo.mp4')} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
			</Loop>
		</div>
	);
};

const BeneficioTitle: React.FC<{num: number; title: string; range: [number, number]}> = ({num, title, range}) => {
	const frame = useCurrentFrame();
	const {width} = useVideoConfig();
	const s = width / 1920;
	const o = graphicAmount(frame, range);
	if (o <= 0) return null;
	const scale = interpolate(o, [0, 1], [0.92, 1]);
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
	const o = graphicAmount(frame, G_FOOD);
	if (o <= 0) return null;

	return (
		<AbsoluteFill style={{opacity: o, background: 'rgba(8, 16, 40, 0.94)', justifyContent: 'center', alignItems: 'center', padding: 50 * s, paddingTop: 150 * s}}>
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

// Emphasis captions — short: appear as the line is said, gone once the idea lands.
const CAPTIONS: {from: number; to: number; text: string}[] = [
	{from: 505, to: 590, text: 'No es una cura milagrosa'},
	{from: 1300, to: 1420, text: 'Reduce la inflamación alrededor del nervio'},
	{from: 2480, to: 2600, text: 'Menos ardor y menos dolor punzante'},
	{from: 2840, to: 2960, text: 'La mielina protege el nervio, como el forro de un cable'},
	{from: 3340, to: 3450, text: 'Mejora la circulación que nutre el nervio'},
	{from: 3880, to: 4000, text: 'El BDNF ayuda a reparar las fibras dañadas'},
	{from: 5620, to: 5760, text: '⚠️ Consulte a su médico si toma anticoagulantes'},
	{from: 6260, to: 6400, text: 'Como alimento diario, es segura para la mayoría'},
	{from: 6600, to: 6720, text: '½ cucharadita al día, con pimienta negra'},
	{from: 6930, to: 7060, text: 'Salmón, almendras, espinaca y aguacate'},
	{from: 7240, to: 7370, text: '💬 ¿Siente hormigueo en los pies? Cuéntenos'},
	{from: 7700, to: 7830, text: 'Suscríbase para más consejos de salud'},
];

export const NeuropatiaEdit: React.FC = () => {
	const frame = useCurrentFrame();

	return (
		<AbsoluteFill style={{backgroundColor: '#000'}}>
			{/* Base: original clip full-screen (talking head + baked b-rolls + audio) */}
			<BaseVideo />

			{/* Full-screen structural graphics (cover the base while up) */}
			<BeneficioTitle num={1} title="Reduce la inflamación del nervio" range={G_BEN1} />
			<BeneficioTitle num={2} title="Antioxidante que protege la mielina" range={G_BEN2} />
			<BeneficioTitle num={3} title="Mejora la circulación hacia manos y pies" range={G_BEN3} />
			<BeneficioTitle num={4} title="Apoya la producción de BDNF" range={G_BEN4} />
			<BeneficioTitle num={5} title="Complementa B1, B6, folato y omega 3" range={G_BEN5} />
			<FoodListCard />
			<SubscribeCard />

			{/* Doctor circle on top of everything (b-rolls + graphics) */}
			<DoctorCircle />

			{/* Emphasis captions */}
			{CAPTIONS.map((c, i) => (
				<Sequence key={i} from={c.from} durationInFrames={c.to - c.from}>
					<CaptionBox text={c.text} />
				</Sequence>
			))}

			{/* Watermark — only during plain full-screen talking head */}
			{circleAmount(frame) < 0.2 && frame < G_SUB[0] - 40 && frame > 100 && (
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
