import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring} from 'remotion';

const FPS = 24;
const DURATION = Math.round(258 * FPS);

export const RomaOverlay: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	return (
		<AbsoluteFill style={{fontFamily: "'Arial Black', 'Helvetica Neue', sans-serif"}}>
			{/* ===== HOOK TITLE — 0-3s ===== */}
			<TitleSlam
				text="EL IMPERIO MÁS"
				text2="PODEROSO DE LA HISTORIA"
				startFrame={0}
				fps={fps}
				frame={frame}
			/>

			{/* ===== TOP BAR — persistent channel branding ===== */}
			<TopBar frame={frame} />

			{/* ===== SECTION: ROMA EN SU GLORIA — ~4s ===== */}
			<DataCard
				frame={frame} fps={fps}
				startFrame={Math.round(4 * FPS)}
				label="APOGEO DEL IMPERIO"
				value="117 d.C."
				position="left"
			/>

			{/* ===== SECTION: EXTENSIÓN — ~8s ===== */}
			<DataCard
				frame={frame} fps={fps}
				startFrame={Math.round(8 * FPS)}
				label="EXTENSIÓN TERRITORIAL"
				value="5 MILLONES KM²"
				position="right"
			/>

			{/* ===== SECTION: POBLACIÓN — ~14s ===== */}
			<DataCard
				frame={frame} fps={fps}
				startFrame={Math.round(14 * FPS)}
				label="POBLACIÓN"
				value="70 MILLONES"
				position="left"
			/>

			{/* ===== ROMA CIUDAD — ~16s ===== */}
			<LocationTag frame={frame} fps={fps} startFrame={Math.round(16 * FPS)} text="ROMA, ITALIA" />

			{/* ===== SECTION HEADER: GLORIA — ~20s ===== */}
			<SectionHeader frame={frame} fps={fps} startFrame={Math.round(20 * FPS)} text="LA GLORIA DE ROMA" />

			{/* ===== LEGIONES — ~30s ===== */}
			<DataCard
				frame={frame} fps={fps}
				startFrame={Math.round(30 * FPS)}
				label="LEGIONES ROMANAS"
				value="450,000 SOLDADOS"
				position="right"
			/>

			{/* ===== SECTION: CORRUPCIÓN — ~40s ===== */}
			<SectionHeader frame={frame} fps={fps} startFrame={Math.round(42 * FPS)} text="CORRUPCIÓN INTERNA" color="#e63946" />

			{/* ===== SENADORES — ~45s ===== */}
			<DataCard
				frame={frame} fps={fps}
				startFrame={Math.round(46 * FPS)}
				label="SENADORES CORRUPTOS"
				value="VENDÍAN CARGOS"
				position="left"
				accent="#e63946"
			/>

			{/* ===== CÓMODO — ~52s ===== */}
			<CharacterTag frame={frame} fps={fps} startFrame={Math.round(53 * FPS)} name="CÓMODO" subtitle="Emperador 180-192 d.C." />

			{/* ===== SECTION: CRISIS ECONÓMICA — ~60s ===== */}
			<SectionHeader frame={frame} fps={fps} startFrame={Math.round(62 * FPS)} text="CRISIS ECONÓMICA" color="#e63946" />

			{/* ===== DENARIO — ~66s ===== */}
			<DataCard
				frame={frame} fps={fps}
				startFrame={Math.round(67 * FPS)}
				label="DEVALUACIÓN DEL DENARIO"
				value="−80% PLATA"
				position="right"
				accent="#e63946"
			/>

			{/* ===== INFLACIÓN — ~72s ===== */}
			<DataCard
				frame={frame} fps={fps}
				startFrame={Math.round(73 * FPS)}
				label="INFLACIÓN"
				value="1,000%"
				position="left"
				accent="#e63946"
			/>

			{/* ===== SECTION: INVASIONES BÁRBARAS — ~80s ===== */}
			<SectionHeader frame={frame} fps={fps} startFrame={Math.round(82 * FPS)} text="INVASIONES BÁRBARAS" color="#ff6b35" />

			{/* ===== BÁRBAROS — ~85s ===== */}
			<DataCard
				frame={frame} fps={fps}
				startFrame={Math.round(86 * FPS)}
				label="PUEBLOS INVASORES"
				value="GODOS · HUNOS · VÁNDALOS"
				position="right"
				accent="#ff6b35"
			/>

			{/* ===== SAQUEO — ~95s ===== */}
			<DataCard
				frame={frame} fps={fps}
				startFrame={Math.round(96 * FPS)}
				label="SAQUEO DE ROMA"
				value="410 d.C."
				position="left"
				accent="#ff6b35"
			/>

			{/* ===== FUNDACIÓN ROMA — ~105s ===== */}
			<SectionHeader frame={frame} fps={fps} startFrame={Math.round(106 * FPS)} text="ORÍGENES DE ROMA" color="#c9a84c" />

			{/* ===== RÓMULO — ~108s ===== */}
			<DataCard
				frame={frame} fps={fps}
				startFrame={Math.round(109 * FPS)}
				label="FUNDACIÓN"
				value="753 a.C."
				position="right"
				accent="#c9a84c"
			/>

			{/* ===== IMPERIO DEMASIADO GRANDE — ~140s ===== */}
			<TitleSlam
				text="DEMASIADO"
				text2="GRANDE PARA SOBREVIVIR"
				startFrame={Math.round(140 * FPS)}
				fps={fps}
				frame={frame}
				color="#e63946"
			/>

			{/* ===== CONSTANTINOPLA — ~160s ===== */}
			<LocationTag frame={frame} fps={fps} startFrame={Math.round(160 * FPS)} text="CONSTANTINOPLA" />

			<DataCard
				frame={frame} fps={fps}
				startFrame={Math.round(163 * FPS)}
				label="IMPERIO ROMANO DE ORIENTE"
				value="SOBREVIVIÓ 1,000 AÑOS MÁS"
				position="left"
				accent="#4895ef"
			/>

			{/* ===== CAÍDA 476 — ~180s ===== */}
			<SectionHeader frame={frame} fps={fps} startFrame={Math.round(178 * FPS)} text="LA CAÍDA FINAL" color="#e63946" />

			<CharacterTag frame={frame} fps={fps} startFrame={Math.round(182 * FPS)} name="ODOACRO" subtitle="Líder hérulo" />

			<TitleSlam
				text="4 DE SEPTIEMBRE"
				text2="476 d.C."
				startFrame={Math.round(188 * FPS)}
				fps={fps}
				frame={frame}
				color="#e63946"
			/>

			{/* ===== RÓMULO AUGÚSTULO — ~196s ===== */}
			<CharacterTag frame={frame} fps={fps} startFrame={Math.round(198 * FPS)} name="RÓMULO AUGÚSTULO" subtitle="Último emperador romano" />

			{/* ===== COLISEO DESTRUIDO — ~210s ===== */}
			<TitleSlam
				text="FIN DE UNA"
				text2="ERA"
				startFrame={Math.round(212 * FPS)}
				fps={fps}
				frame={frame}
				color="#e63946"
			/>

			{/* ===== TIMELINE BAR — persistent ===== */}
			<TimelineBar frame={frame} totalFrames={DURATION} />

			{/* ===== PROGRESS BAR — bottom ===== */}
			<div style={{
				position: 'absolute', bottom: 0, left: 0,
				height: 4, background: '#e63946',
				width: `${(frame / DURATION) * 100}%`,
			}} />
		</AbsoluteFill>
	);
};

// ============ COMPONENTS ============

const TitleSlam: React.FC<{
	text: string; text2: string;
	startFrame: number; fps: number; frame: number;
	color?: string;
}> = ({text, text2, startFrame, fps, frame, color = '#fff'}) => {
	const localFrame = frame - startFrame;
	if (localFrame < 0 || localFrame > 80) return null;

	const s1 = spring({frame: Math.max(0, localFrame), fps, from: 4, to: 1, durationInFrames: 8});
	const op1 = interpolate(localFrame, [0, 4], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const s2 = spring({frame: Math.max(0, localFrame - 8), fps, from: 4, to: 1, durationInFrames: 8});
	const op2 = interpolate(localFrame, [8, 12], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const shake = localFrame >= 0 && localFrame <= 12 ? Math.sin(localFrame * 4) * Math.max(0, 12 - localFrame) * 0.8 : 0;
	const fadeOut = interpolate(localFrame, [60, 72], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	return (
		<div style={{
			position: 'absolute', inset: 0,
			display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
			gap: 5, opacity: fadeOut, transform: `translateX(${shake}px)`,
		}}>
			{/* Dark bg for readability */}
			<div style={{position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', opacity: op1}} />
			<div style={{
				fontSize: 52, fontWeight: 900, color: color === '#e63946' ? '#fff' : '#ddd',
				letterSpacing: -1, transform: `scale(${s1})`, opacity: op1, zIndex: 1,
				textShadow: '3px 3px 0 rgba(0,0,0,0.8)',
			}}>{text}</div>
			<div style={{
				fontSize: 72, fontWeight: 900, color,
				letterSpacing: -2, transform: `scale(${s2})`, opacity: op2, zIndex: 1,
				textShadow: color === '#e63946' ? '3px 3px 0 rgba(0,0,0,0.8)' : `3px 3px 0 #e63946`,
				lineHeight: 0.95,
			}}>{text2}</div>
		</div>
	);
};

const SectionHeader: React.FC<{
	frame: number; fps: number; startFrame: number; text: string; color?: string;
}> = ({frame, fps, startFrame, text, color = '#c9a84c'}) => {
	const localFrame = frame - startFrame;
	if (localFrame < 0 || localFrame > 60) return null;

	const lineW = interpolate(localFrame, [0, 12], [0, 100], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const textOp = interpolate(localFrame, [5, 12], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const textScale = spring({frame: Math.max(0, localFrame - 5), fps, from: 0.7, to: 1, durationInFrames: 10});
	const fadeOut = interpolate(localFrame, [45, 55], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	return (
		<div style={{
			position: 'absolute', top: 50, left: 40, opacity: fadeOut,
			display: 'flex', flexDirection: 'column', gap: 6,
		}}>
			<div style={{width: `${lineW}%`, maxWidth: 300, height: 3, background: color, borderRadius: 2}} />
			<div style={{
				opacity: textOp, transform: `scale(${textScale})`, transformOrigin: 'left center',
				fontSize: 32, fontWeight: 900, color, letterSpacing: 3,
				textShadow: '2px 2px 0 rgba(0,0,0,0.9)',
			}}>
				{text}
			</div>
		</div>
	);
};

const DataCard: React.FC<{
	frame: number; fps: number; startFrame: number;
	label: string; value: string; position: 'left' | 'right';
	accent?: string;
}> = ({frame, fps, startFrame, label, value, position, accent = '#c9a84c'}) => {
	const localFrame = frame - startFrame;
	if (localFrame < 0 || localFrame > 90) return null;

	const slideIn = interpolate(localFrame, [0, 10], [position === 'left' ? -200 : 200, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const op = interpolate(localFrame, [0, 8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const fadeOut = interpolate(localFrame, [70, 85], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	const valueScale = spring({frame: Math.max(0, localFrame - 10), fps, from: 1.5, to: 1, durationInFrames: 10});

	return (
		<div style={{
			position: 'absolute',
			bottom: 80,
			...(position === 'left' ? {left: 30} : {right: 30}),
			transform: `translateX(${slideIn}px)`,
			opacity: op * fadeOut,
		}}>
			<div style={{
				background: 'rgba(0,0,0,0.85)',
				padding: '12px 24px',
				borderRadius: 6,
				borderLeft: position === 'left' ? `4px solid ${accent}` : 'none',
				borderRight: position === 'right' ? `4px solid ${accent}` : 'none',
				backdropFilter: 'blur(8px)',
				maxWidth: 350,
			}}>
				<div style={{fontSize: 13, fontWeight: 700, color: accent, letterSpacing: 3, marginBottom: 4}}>
					{label}
				</div>
				<div style={{
					fontSize: 28, fontWeight: 900, color: '#fff',
					transform: `scale(${valueScale})`, transformOrigin: position === 'left' ? 'left center' : 'right center',
					textAlign: position === 'left' ? 'left' : 'right',
				}}>
					{value}
				</div>
			</div>
		</div>
	);
};

const CharacterTag: React.FC<{
	frame: number; fps: number; startFrame: number; name: string; subtitle: string;
}> = ({frame, fps, startFrame, name, subtitle}) => {
	const localFrame = frame - startFrame;
	if (localFrame < 0 || localFrame > 72) return null;

	const lineW = interpolate(localFrame, [0, 8], [0, 100], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const nameOp = interpolate(localFrame, [4, 10], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const subOp = interpolate(localFrame, [10, 16], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const fadeOut = interpolate(localFrame, [55, 68], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	return (
		<div style={{
			position: 'absolute', bottom: 80, left: 30, opacity: fadeOut,
			display: 'flex', flexDirection: 'column', gap: 4,
		}}>
			<div style={{width: `${lineW}%`, maxWidth: 200, height: 3, background: '#e63946'}} />
			<div style={{
				opacity: nameOp, fontSize: 30, fontWeight: 900, color: '#fff',
				letterSpacing: 2, textShadow: '2px 2px 0 rgba(0,0,0,0.9)',
			}}>{name}</div>
			<div style={{
				opacity: subOp, fontSize: 16, fontWeight: 400, color: '#ccc',
				fontStyle: 'italic', letterSpacing: 1,
				textShadow: '1px 1px 0 rgba(0,0,0,0.9)',
			}}>{subtitle}</div>
		</div>
	);
};

const LocationTag: React.FC<{
	frame: number; fps: number; startFrame: number; text: string;
}> = ({frame, fps, startFrame, text}) => {
	const localFrame = frame - startFrame;
	if (localFrame < 0 || localFrame > 60) return null;

	const pop = spring({frame: Math.max(0, localFrame), fps, from: 0, to: 1, durationInFrames: 10});
	const fadeOut = interpolate(localFrame, [45, 55], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	return (
		<div style={{
			position: 'absolute', top: 50, right: 30,
			transform: `scale(${pop})`, opacity: fadeOut,
		}}>
			<div style={{
				background: 'rgba(230,57,70,0.95)', padding: '6px 18px',
				borderRadius: 4, display: 'flex', alignItems: 'center', gap: 8,
			}}>
				<span style={{fontSize: 16}}>📍</span>
				<span style={{fontSize: 18, fontWeight: 900, color: '#fff', letterSpacing: 2}}>{text}</span>
			</div>
		</div>
	);
};

const TopBar: React.FC<{frame: number}> = ({frame}) => {
	const op = interpolate(frame, [Math.round(4 * FPS), Math.round(5 * FPS)], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const endFade = interpolate(frame, [Math.round(240 * FPS), Math.round(245 * FPS)], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	if (op === 0) return null;

	return (
		<div style={{
			position: 'absolute', top: 12, left: 12, opacity: op * endFade,
			display: 'flex', alignItems: 'center', gap: 8,
		}}>
			<div style={{width: 4, height: 22, background: '#e63946', borderRadius: 2}} />
			<span style={{fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.6)', letterSpacing: 3}}>
				CRÓNICAS ILUSTRADAS
			</span>
		</div>
	);
};

const TimelineBar: React.FC<{frame: number; totalFrames: number}> = ({frame, totalFrames}) => {
	const progress = frame / totalFrames;
	const periods = [
		{label: 'GLORIA', start: 0, end: 0.15, color: '#c9a84c'},
		{label: 'CORRUPCIÓN', start: 0.15, end: 0.3, color: '#e63946'},
		{label: 'CRISIS', start: 0.3, end: 0.45, color: '#e63946'},
		{label: 'INVASIONES', start: 0.45, end: 0.65, color: '#ff6b35'},
		{label: 'CAÍDA', start: 0.65, end: 0.85, color: '#e63946'},
	];

	const showTimeline = frame > Math.round(20 * FPS) && frame < Math.round(230 * FPS);
	if (!showTimeline) return null;

	const tlOp = interpolate(frame,
		[Math.round(20 * FPS), Math.round(22 * FPS), Math.round(225 * FPS), Math.round(230 * FPS)],
		[0, 0.7, 0.7, 0],
		{extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
	);

	return (
		<div style={{
			position: 'absolute', bottom: 12, left: 30, right: 30,
			opacity: tlOp,
		}}>
			<div style={{
				height: 3, background: 'rgba(255,255,255,0.15)', borderRadius: 2,
				position: 'relative', overflow: 'hidden',
			}}>
				<div style={{
					position: 'absolute', top: 0, left: 0, bottom: 0,
					width: `${progress * 100}%`,
					background: 'linear-gradient(90deg, #c9a84c, #e63946)',
					borderRadius: 2,
				}} />
			</div>
		</div>
	);
};
