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

// ---- Camera zoom (continuous shot → motivated push-ins). Origin on eye line, scale >= 1.0 ----
const zoom = (f: number) => {
	const pts = [
		[0, 1.0],
		[108, 1.05],
		[274, 1.05],
		[300, 1.09],
		[346, 1.04],
		[620, 1.06],
		[626, 1.0], // hidden behind full-screen card
		[746, 1.0],
		[862, 1.07],
		[998, 1.03], // hidden behind CTA card
		[1113, 1.03],
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
	return 1.03;
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

export const ErroresIntro: React.FC = () => {
	const frame = useCurrentFrame();
	const {width} = useVideoConfig();
	const s = width / 1920;

	const sc = zoom(frame);

	// full-screen scenes (person hidden) → hide watermark
	const inBrandCard = frame >= 626 && frame <= 746;
	const inCTA = frame >= 996;
	const wmVisible = !inBrandCard && !inCTA;

	// ---- S7 full-screen brand card ----
	const s7 = lifecycle(frame, 626, 746, 10);
	// ---- S10 full-screen CTA ----
	const s10In = animIn(frame, 1000, 12);

	return (
		<AbsoluteFill style={{backgroundColor: '#000'}}>
			<FontFace />
			{/* Background video with camera zoom, origin on eye line */}
			<AbsoluteFill
				style={{transform: `scale(${sc})`, transformOrigin: '50% 29%'}}
			>
				<OffthreadVideo src={staticFile('errores_intro.mp4')} />
			</AbsoluteFill>

			{/* ---------- S1: right kicker panel ---------- */}
			{(() => {
				const o = lifecycle(frame, 8, 108, 10);
				if (o <= 0) return null;
				const x = interpolate(o, [0, 1], [60 * s, 0]);
				return (
					<div
						style={{
							position: 'absolute',
							top: 150 * s,
							right: 70 * s,
							opacity: o,
							transform: `translateX(${(1 - o) * 60 * s}px)`,
							...panelStyle(s),
							padding: `${20 * s}px ${30 * s}px`,
							display: 'flex',
							flexDirection: 'column',
							gap: 8 * s,
							maxWidth: 460 * s,
						}}
					>
						<Kicker s={s}>Lo que nadie te dice</Kicker>
						<div
							style={{
								fontFamily,
								fontWeight: 900,
								fontSize: 40 * s,
								color: theme.text,
								lineHeight: 1.05,
								...shadow,
							}}
						>
							en el consultorio
						</div>
					</div>
				);
			})()}

			{/* ---------- S2: chip top-right "CADA SEMANA" ---------- */}
			{(() => {
				const o = lifecycle(frame, 120, 158, 7);
				if (o <= 0) return null;
				return (
					<div
						style={{
							position: 'absolute',
							top: 90 * s,
							right: 80 * s,
							opacity: o,
							transform: `scale(${0.9 + o * 0.1})`,
							background: theme.grad,
							borderRadius: 40 * s,
							padding: `${12 * s}px ${28 * s}px`,
							fontFamily,
							fontWeight: 800,
							fontSize: 26 * s,
							color: '#fff',
							letterSpacing: 2 * s,
							boxShadow: `0 ${6 * s}px ${20 * s}px rgba(6,182,212,0.4)`,
						}}
					>
						CADA SEMANA
					</div>
				);
			})()}

			{/* ---------- S3: lower band w/ backing — AUTO-SABOTAJE ---------- */}
			{(() => {
				const o = lifecycle(frame, 166, 274, 11);
				if (o <= 0) return null;
				return (
					<div
						style={{
							position: 'absolute',
							left: 90 * s,
							top: 250 * s,
							opacity: o,
							transform: `translateX(${(1 - o) * -50 * s}px)`,
							...panelStyle(s),
							padding: `${22 * s}px ${34 * s}px`,
							display: 'flex',
							flexDirection: 'column',
							gap: 6 * s,
							maxWidth: 520 * s,
						}}
					>
						<Kicker s={s} color={theme.accent}>La causa real</Kicker>
						<div
							style={{
								fontFamily,
								fontWeight: 900,
								fontSize: 58 * s,
								color: theme.text,
								lineHeight: 1,
								...shadow,
							}}
						>
							AUTO-<span style={{color: theme.accent}}>SABOTAJE</span>
						</div>
						<div
							style={{
								fontFamily,
								fontWeight: 700,
								fontSize: 24 * s,
								color: theme.textDim,
								...shadow,
							}}
						>
							No es la edad. Eres tú.
						</div>
					</div>
				);
			})()}

			{/* ---------- S4: staircase strike chips (disruptive) ---------- */}
			{(() => {
				const items = [
					{t: 'LA EDAD', at: 280},
					{t: 'LA MALA SUERTE', at: 300},
				];
				const anyVisible = frame >= 280 && frame <= 328;
				if (!anyVisible) return null;
				return (
					<div
						style={{
							position: 'absolute',
							left: 90 * s,
							top: 300 * s,
							display: 'flex',
							flexDirection: 'column',
							gap: 18 * s,
						}}
					>
						{items.map((it, i) => {
							const o = lifecycle(frame, it.at, 326, 6);
							if (o <= 0) return null;
							const strike = interpolate(frame, [it.at + 7, it.at + 16], [0, 1], {
								extrapolateLeft: 'clamp',
								extrapolateRight: 'clamp',
								easing: EASE_OUT,
							});
							return (
								<div
									key={i}
									style={{
										opacity: o,
										transform: `translateX(${(1 - o) * -40 * s}px)`,
										...panelStyle(s),
										padding: `${14 * s}px ${28 * s}px`,
										display: 'flex',
										alignItems: 'center',
										gap: 16 * s,
										width: 'fit-content',
									}}
								>
									<span style={{fontSize: 34 * s}}>❌</span>
									<span
										style={{
											position: 'relative',
											fontFamily,
											fontWeight: 800,
											fontSize: 38 * s,
											color: theme.textDim,
											...shadow,
										}}
									>
										{it.t}
										<span
											style={{
												position: 'absolute',
												left: 0,
												top: '52%',
												height: 4 * s,
												width: `${strike * 100}%`,
												background: theme.accent,
												borderRadius: 2 * s,
											}}
										/>
									</span>
								</div>
							);
						})}
					</div>
				);
			})()}

			{/* ---------- S5: left panel ERRORES SILENCIOSOS ---------- */}
			{(() => {
				const o = lifecycle(frame, 346, 470, 10);
				if (o <= 0) return null;
				return (
					<div
						style={{
							position: 'absolute',
							left: 90 * s,
							top: 280 * s,
							opacity: o,
							transform: `translateY(${(1 - o) * 40 * s}px)`,
							...panelStyle(s),
							padding: `${24 * s}px ${36 * s}px`,
							maxWidth: 560 * s,
						}}
					>
						<Kicker s={s}>Se cometen</Kicker>
						<div
							style={{
								fontFamily,
								fontWeight: 900,
								fontSize: 52 * s,
								color: theme.text,
								lineHeight: 1,
								marginTop: 8 * s,
								...shadow,
							}}
						>
							EN <span style={{color: theme.c1}}>SILENCIO</span>
						</div>
					</div>
				);
			})()}

			{/* ---------- S6: right 👀 NADIE TE LO ENSEÑÓ ---------- */}
			{(() => {
				const o = lifecycle(frame, 482, 612, 10);
				if (o <= 0) return null;
				return (
					<div
						style={{
							position: 'absolute',
							right: 70 * s,
							top: 300 * s,
							opacity: o,
							transform: `translateX(${(1 - o) * 50 * s}px)`,
							...panelStyle(s),
							padding: `${22 * s}px ${34 * s}px`,
							display: 'flex',
							flexDirection: 'column',
							gap: 6 * s,
							alignItems: 'flex-start',
							maxWidth: 520 * s,
						}}
					>
						<span style={{fontSize: 44 * s}}>👀</span>
						<div
							style={{
								fontFamily,
								fontWeight: 900,
								fontSize: 46 * s,
								color: theme.text,
								lineHeight: 1.05,
								...shadow,
							}}
						>
							NADIE TE LO<br />ENSEÑÓ
						</div>
					</div>
				);
			})()}

			{/* ---------- S7: FULL-SCREEN brand card (person hidden) ---------- */}
			{s7 > 0 && (
				<AbsoluteFill
					style={{
						opacity: s7,
						background: theme.fullBg,
						justifyContent: 'center',
						alignItems: 'center',
					}}
				>
					{/* subtle grid */}
					<AbsoluteFill
						style={{
							backgroundImage:
								'linear-gradient(rgba(56,189,217,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,217,0.08) 1px, transparent 1px)',
							backgroundSize: `${70 * s}px ${70 * s}px`,
							opacity: 0.6,
						}}
					/>
					<div style={{textAlign: 'center', transform: `translateY(${(1 - s7) * 30 * s}px)`}}>
						<div style={{fontSize: 70 * s, marginBottom: 10 * s}}>🩺</div>
						<Kicker s={s}>Canal médico</Kicker>
						<div
							style={{
								fontFamily,
								fontWeight: 900,
								fontSize: 92 * s,
								color: theme.text,
								lineHeight: 1,
								marginTop: 10 * s,
							}}
						>
							DRA. LAURA JIMÉNEZ
						</div>
						<div
							style={{
								marginTop: 20 * s,
								display: 'inline-block',
								background: theme.grad,
								borderRadius: 40 * s,
								padding: `${12 * s}px ${34 * s}px`,
								fontFamily,
								fontWeight: 800,
								fontSize: 32 * s,
								color: '#fff',
								letterSpacing: 3 * s,
							}}
						>
							SALUD DESPUÉS DE LOS 50
						</div>
					</div>
				</AbsoluteFill>
			)}

			{/* ---------- S8: big "10" reveal (disruptive) ---------- */}
			{(() => {
				const o = lifecycle(frame, 756, 862, 10);
				if (o <= 0) return null;
				const pop = interpolate(frame, [756, 774], [0.6, 1], {
					extrapolateLeft: 'clamp',
					extrapolateRight: 'clamp',
					easing: Easing.out(Easing.back(1.6)),
				});
				return (
					<>
						{/* giant 10 on the left, behind text panel */}
						<div
							style={{
								position: 'absolute',
								left: 40 * s,
								top: 120 * s,
								opacity: o * 0.9,
								transform: `scale(${pop})`,
								transformOrigin: 'left top',
								fontFamily,
								fontWeight: 900,
								fontSize: 520 * s,
								lineHeight: 0.8,
								color: 'transparent',
								WebkitTextStroke: `${5 * s}px ${theme.c1}`,
							}}
						>
							10
						</div>
						<div
							style={{
								position: 'absolute',
								right: 80 * s,
								top: 360 * s,
								opacity: o,
								transform: `translateX(${(1 - o) * 50 * s}px)`,
								...panelStyle(s),
								padding: `${24 * s}px ${36 * s}px`,
								maxWidth: 620 * s,
							}}
						>
							<Kicker s={s} color={theme.accent}>Errores que</Kicker>
							<div
								style={{
									fontFamily,
									fontWeight: 900,
									fontSize: 56 * s,
									color: theme.text,
									lineHeight: 1.02,
									marginTop: 8 * s,
									...shadow,
								}}
							>
								DESTRUYEN TUS<br />
								<span style={{color: theme.accent}}>ERECCIONES</span>
							</div>
						</div>
					</>
				);
			})()}

			{/* ---------- S9: lower teaser band ---------- */}
			{(() => {
				const o = lifecycle(frame, 878, 988, 10);
				if (o <= 0) return null;
				return (
					<div
						style={{
							position: 'absolute',
							left: '50%',
							bottom: 70 * s,
							transform: `translateX(-50%) translateY(${(1 - o) * 30 * s}px)`,
							opacity: o,
							...panelStyle(s),
							padding: `${18 * s}px ${40 * s}px`,
							display: 'flex',
							alignItems: 'center',
							gap: 18 * s,
						}}
					>
						<span style={{fontSize: 36 * s}}>⚠️</span>
						<span
							style={{
								fontFamily,
								fontWeight: 800,
								fontSize: 40 * s,
								color: theme.text,
								...shadow,
							}}
						>
							El <span style={{color: theme.accent}}>#10</span> te va a sorprender
						</span>
					</div>
				);
			})()}

			{/* ---------- S10: FULL-SCREEN CTA (person hidden) ---------- */}
			{inCTA && (
				<AbsoluteFill
					style={{
						opacity: s10In,
						background: theme.fullBg,
						justifyContent: 'center',
						alignItems: 'center',
					}}
				>
					<AbsoluteFill
						style={{
							backgroundImage:
								'radial-gradient(circle at 50% 40%, rgba(6,182,212,0.18), transparent 60%)',
						}}
					/>
					<div style={{textAlign: 'center', transform: `scale(${0.9 + s10In * 0.1})`}}>
						<div style={{fontSize: 90 * s, marginBottom: 6 * s}}>🔔</div>
						<div
							style={{
								fontFamily,
								fontWeight: 900,
								fontSize: 110 * s,
								color: theme.text,
								lineHeight: 1,
							}}
						>
							SUSCRÍBETE
						</div>
						<div
							style={{
								fontFamily,
								fontWeight: 700,
								fontSize: 34 * s,
								color: theme.textDim,
								marginTop: 16 * s,
							}}
						>
							Activa la campana · Información médica real
						</div>
						<div
							style={{
								marginTop: 34 * s,
								display: 'inline-flex',
								alignItems: 'center',
								gap: 16 * s,
								background: '#ff0000',
								borderRadius: 60 * s,
								padding: `${20 * s}px ${52 * s}px`,
								boxShadow: `0 ${8 * s}px ${30 * s}px rgba(255,0,0,0.4)`,
							}}
						>
							<span style={{fontSize: 34 * s, color: '#fff'}}>▶</span>
							<span
								style={{
									fontFamily,
									fontWeight: 900,
									fontSize: 40 * s,
									color: '#fff',
									letterSpacing: 2 * s,
								}}
							>
								DRA. LAURA JIMÉNEZ
							</span>
						</div>
					</div>
				</AbsoluteFill>
			)}

			{/* ---------- Watermark (hidden during full-screen scenes) ---------- */}
			{wmVisible && (
				<div
					style={{
						position: 'absolute',
						bottom: 44 * s,
						left: 54 * s,
						display: 'flex',
						alignItems: 'center',
						gap: 12 * s,
						opacity: 0.9,
					}}
				>
					<span style={{fontSize: 34 * s}}>🩺</span>
					<span
						style={{
							fontFamily,
							fontWeight: 800,
							fontSize: 30 * s,
							color: theme.text,
							letterSpacing: 1 * s,
							...shadow,
						}}
					>
						DRA. LAURA
					</span>
				</div>
			)}
		</AbsoluteFill>
	);
};
