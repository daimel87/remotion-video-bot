import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring} from 'remotion';

const FPS = 24;
const DURATION = Math.round(258 * FPS);

export const RomaOverlay: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	return (
		<AbsoluteFill style={{fontFamily: "'Arial Black', 'Impact', sans-serif"}}>

			{/* ===== 0.0s — FLASH + HOOK SLAM ===== */}
			<FlashEffect frame={frame} triggerFrame={0} />
			<HookSlam frame={frame} fps={fps} startFrame={0}
				lines={['EL IMPERIO', 'MÁS PODEROSO', 'DE LA HISTORIA']}
			/>

			{/* ===== 2.5s — GLITCH TRANSITION ===== */}
			<GlitchTransition frame={frame} triggerFrame={Math.round(2.5 * FPS)} />

			{/* ===== 3s — COUNTER: Año del apogeo ===== */}
			<CounterPop frame={frame} fps={fps} startFrame={Math.round(3 * FPS)}
				label="APOGEO" endValue={117} suffix=" d.C." position="left"
			/>

			{/* ===== 5s — ZOOM TEXT ===== */}
			<ZoomText frame={frame} fps={fps} startFrame={Math.round(5 * FPS)}
				text="ROMA DOMINABA TODO" size={48}
			/>

			{/* ===== 7s — FLASH + COUNTER: Extensión ===== */}
			<FlashEffect frame={frame} triggerFrame={Math.round(7 * FPS)} />
			<CounterPop frame={frame} fps={fps} startFrame={Math.round(7.5 * FPS)}
				label="EXTENSIÓN" endValue={5} suffix=" MILLONES KM²" position="right"
			/>

			{/* ===== 10s — KINETIC STACK (rápido) ===== */}
			<KineticStack frame={frame} fps={fps} startFrame={Math.round(10 * FPS)}
				lines={['CARRETERAS', 'ACUEDUCTOS', 'COLISEOS', 'LEGIONES']}
				stagger={3}
			/>

			{/* ===== 13s — GLITCH + COUNTER: Población ===== */}
			<GlitchTransition frame={frame} triggerFrame={Math.round(13 * FPS)} />
			<CounterPop frame={frame} fps={fps} startFrame={Math.round(13.5 * FPS)}
				label="POBLACIÓN" endValue={70} suffix=" MILLONES" position="left"
			/>

			{/* ===== 16s — LOCATION POP ===== */}
			<FlashEffect frame={frame} triggerFrame={Math.round(15.8 * FPS)} />
			<LocationPop frame={frame} fps={fps} startFrame={Math.round(16 * FPS)}
				text="ROMA, ITALIA"
			/>

			{/* ===== 18s — ZOOM TEXT ===== */}
			<ZoomText frame={frame} fps={fps} startFrame={Math.round(18 * FPS)}
				text="UN IMPERIO INVENCIBLE" size={44} color="#c9a84c"
			/>

			{/* ===== 20s — SECTION SLAM ===== */}
			<GlitchTransition frame={frame} triggerFrame={Math.round(19.8 * FPS)} />
			<FlashEffect frame={frame} triggerFrame={Math.round(20 * FPS)} />
			<SectionSlam frame={frame} fps={fps} startFrame={Math.round(20 * FPS)}
				text="LA GLORIA DE ROMA" color="#c9a84c"
			/>

			{/* ===== 23s — COUNTER: Legiones ===== */}
			<CounterPop frame={frame} fps={fps} startFrame={Math.round(23 * FPS)}
				label="LEGIONES" endValue={450} suffix=",000 SOLDADOS" position="right"
			/>

			{/* ===== 25s — KINETIC rapid fire ===== */}
			<KineticStack frame={frame} fps={fps} startFrame={Math.round(25 * FPS)}
				lines={['CONQUISTARON', 'EUROPA', 'ÁFRICA', 'ASIA']}
				stagger={2}
			/>

			{/* ===== 28s — FLASH + ZOOM ===== */}
			<FlashEffect frame={frame} triggerFrame={Math.round(28 * FPS)} />
			<ZoomText frame={frame} fps={fps} startFrame={Math.round(28 * FPS)}
				text="NADIE PODÍA DETENERLOS" size={46} color="#e63946"
			/>

			{/* ===== REST OF VIDEO — simple elements from 30s+ ===== */}
			{frame >= Math.round(40 * FPS) && <SectionSlam frame={frame} fps={fps} startFrame={Math.round(42 * FPS)} text="CORRUPCIÓN INTERNA" color="#e63946" />}
			{frame >= Math.round(60 * FPS) && <SectionSlam frame={frame} fps={fps} startFrame={Math.round(62 * FPS)} text="CRISIS ECONÓMICA" color="#e63946" />}
			{frame >= Math.round(80 * FPS) && <SectionSlam frame={frame} fps={fps} startFrame={Math.round(82 * FPS)} text="INVASIONES BÁRBARAS" color="#ff6b35" />}
			{frame >= Math.round(136 * FPS) && <HookSlam frame={frame} fps={fps} startFrame={Math.round(140 * FPS)} lines={['DEMASIADO', 'GRANDE PARA', 'SOBREVIVIR']} />}
			{frame >= Math.round(174 * FPS) && <SectionSlam frame={frame} fps={fps} startFrame={Math.round(178 * FPS)} text="LA CAÍDA FINAL" color="#e63946" />}
			{frame >= Math.round(184 * FPS) && <HookSlam frame={frame} fps={fps} startFrame={Math.round(188 * FPS)} lines={['4 DE SEPTIEMBRE', '476 d.C.']} />}
			{frame >= Math.round(208 * FPS) && <HookSlam frame={frame} fps={fps} startFrame={Math.round(212 * FPS)} lines={['FIN DE', 'UNA ERA']} />}

			{/* ===== TOP BAR ===== */}
			<TopBar frame={frame} />

			{/* ===== PROGRESS BAR ===== */}
			<div style={{
				position: 'absolute', bottom: 0, left: 0,
				height: 4, background: '#e63946',
				width: `${(frame / DURATION) * 100}%`,
			}} />
		</AbsoluteFill>
	);
};

// ============ FLASH EFFECT ============
const FlashEffect: React.FC<{frame: number; triggerFrame: number}> = ({frame, triggerFrame}) => {
	const local = frame - triggerFrame;
	if (local < 0 || local > 4) return null;
	const op = interpolate(local, [0, 1, 4], [0.9, 0.6, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	return <div style={{position: 'absolute', inset: 0, background: '#fff', opacity: op, pointerEvents: 'none'}} />;
};

// ============ GLITCH TRANSITION ============
const GlitchTransition: React.FC<{frame: number; triggerFrame: number}> = ({frame, triggerFrame}) => {
	const local = frame - triggerFrame;
	if (local < 0 || local > 6) return null;

	const sliceCount = 8;
	const slices = Array.from({length: sliceCount}, (_, i) => {
		const offset = ((i * 37 + local * 13) % 40) - 20;
		const h = 100 / sliceCount;
		const op = interpolate(local, [0, 2, 6], [0.9, 0.7, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
		return (
			<div key={i} style={{
				position: 'absolute', left: 0, right: 0,
				top: `${i * h}%`, height: `${h}%`,
				background: i % 2 === 0 ? '#e63946' : '#00ffff',
				transform: `translateX(${offset}px)`,
				opacity: op * 0.4,
				mixBlendMode: 'screen',
			}} />
		);
	});

	return <div style={{position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden'}}>{slices}</div>;
};

// ============ HOOK SLAM — multi-line title with stagger ============
const HookSlam: React.FC<{
	frame: number; fps: number; startFrame: number;
	lines: string[];
}> = ({frame, fps, startFrame, lines}) => {
	const local = frame - startFrame;
	if (local < 0 || local > 55) return null;

	const shake = local <= 15 ? Math.sin(local * 6) * Math.max(0, 15 - local) * 1.5 : 0;
	const fadeOut = interpolate(local, [40, 52], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const bgOp = interpolate(local, [0, 3, 40, 52], [0, 0.7, 0.7, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	return (
		<div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 0, transform: `translateX(${shake}px)`}}>
			<div style={{position: 'absolute', inset: 0, background: '#000', opacity: bgOp}} />
			{lines.map((line, i) => {
				const s = spring({frame: Math.max(0, local - i * 4), fps, from: 5, to: 1, durationInFrames: 6, config: {mass: 0.4, damping: 8}});
				const op = interpolate(local - i * 4, [0, 3], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
				const isLast = i === lines.length - 1;
				return (
					<div key={i} style={{
						fontSize: isLast ? 76 : 50,
						fontWeight: 900, color: isLast ? '#e63946' : '#fff',
						transform: `scale(${s})`, opacity: op * fadeOut,
						textShadow: '4px 4px 0 rgba(0,0,0,0.9)',
						letterSpacing: isLast ? -3 : -1, lineHeight: 1.0,
						zIndex: 1,
					}}>{line}</div>
				);
			})}
		</div>
	);
};

// ============ COUNTER POP — animated number ============
const CounterPop: React.FC<{
	frame: number; fps: number; startFrame: number;
	label: string; endValue: number; suffix: string;
	position: 'left' | 'right';
}> = ({frame, fps, startFrame, label, endValue, suffix, position}) => {
	const local = frame - startFrame;
	if (local < 0 || local > 65) return null;

	const slideIn = spring({frame: Math.max(0, local), fps, from: position === 'left' ? -300 : 300, to: 0, durationInFrames: 8, config: {mass: 0.5, damping: 10}});
	const countProgress = interpolate(local, [4, 20], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const currentValue = Math.round(endValue * countProgress);
	const pop = local >= 20 && local <= 26 ? spring({frame: local - 20, fps, from: 1.3, to: 1, durationInFrames: 6}) : 1;
	const fadeOut = interpolate(local, [50, 62], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const op = interpolate(local, [0, 4], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	return (
		<div style={{
			position: 'absolute', bottom: 90,
			...(position === 'left' ? {left: 30} : {right: 30}),
			transform: `translateX(${slideIn}px)`,
			opacity: op * fadeOut,
		}}>
			<div style={{
				background: 'rgba(0,0,0,0.9)', padding: '14px 28px',
				borderRadius: 4,
				borderLeft: position === 'left' ? '5px solid #e63946' : 'none',
				borderRight: position === 'right' ? '5px solid #e63946' : 'none',
			}}>
				<div style={{fontSize: 11, fontWeight: 700, color: '#e63946', letterSpacing: 4, marginBottom: 6}}>
					{label}
				</div>
				<div style={{
					fontSize: 42, fontWeight: 900, color: '#fff',
					transform: `scale(${pop})`,
					transformOrigin: position === 'left' ? 'left center' : 'right center',
					textAlign: position,
				}}>
					{currentValue}{suffix}
				</div>
			</div>
		</div>
	);
};

// ============ ZOOM TEXT — text that zooms from huge to normal ============
const ZoomText: React.FC<{
	frame: number; fps: number; startFrame: number;
	text: string; size: number; color?: string;
}> = ({frame, fps, startFrame, text, size, color = '#fff'}) => {
	const local = frame - startFrame;
	if (local < 0 || local > 36) return null;

	const scale = spring({frame: Math.max(0, local), fps, from: 3, to: 1, durationInFrames: 6, config: {mass: 0.3, damping: 9}});
	const op = interpolate(local, [0, 2], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const fadeOut = interpolate(local, [26, 34], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const blur = interpolate(local, [0, 5], [8, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	return (
		<div style={{
			position: 'absolute', inset: 0,
			display: 'flex', alignItems: 'center', justifyContent: 'center',
			pointerEvents: 'none',
		}}>
			<div style={{
				fontSize: size, fontWeight: 900, color,
				transform: `scale(${scale})`, opacity: op * fadeOut,
				textShadow: '3px 3px 0 rgba(0,0,0,0.9)',
				letterSpacing: 3,
				filter: `blur(${blur}px)`,
			}}>{text}</div>
		</div>
	);
};

// ============ KINETIC STACK — words appearing rapidly staggered ============
const KineticStack: React.FC<{
	frame: number; fps: number; startFrame: number;
	lines: string[]; stagger: number;
}> = ({frame, fps, startFrame, lines, stagger}) => {
	const local = frame - startFrame;
	const totalDur = lines.length * stagger + 35;
	if (local < 0 || local > totalDur) return null;

	const fadeOut = interpolate(local, [totalDur - 12, totalDur - 2], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	return (
		<div style={{
			position: 'absolute', top: '15%', right: 40,
			display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4,
			opacity: fadeOut,
		}}>
			{lines.map((line, i) => {
				const lineLocal = local - i * stagger;
				if (lineLocal < 0) return null;
				const s = spring({frame: lineLocal, fps, from: 0, to: 1, durationInFrames: 5, config: {mass: 0.3, damping: 9}});
				const slideX = interpolate(lineLocal, [0, 5], [60, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
				return (
					<div key={i} style={{
						fontSize: 36, fontWeight: 900, color: i === lines.length - 1 ? '#e63946' : '#fff',
						transform: `scale(${s}) translateX(${slideX}px)`,
						textShadow: '3px 3px 0 rgba(0,0,0,0.9)',
						letterSpacing: 2,
					}}>{line}</div>
				);
			})}
		</div>
	);
};

// ============ LOCATION POP ============
const LocationPop: React.FC<{
	frame: number; fps: number; startFrame: number; text: string;
}> = ({frame, fps, startFrame, text}) => {
	const local = frame - startFrame;
	if (local < 0 || local > 48) return null;

	const scaleUp = spring({frame: Math.max(0, local), fps, from: 0, to: 1, durationInFrames: 6, config: {mass: 0.3, damping: 9}});
	const fadeOut = interpolate(local, [36, 46], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	return (
		<div style={{
			position: 'absolute', top: 50, right: 30,
			transform: `scale(${scaleUp})`, opacity: fadeOut,
		}}>
			<div style={{
				background: '#e63946', padding: '8px 20px',
				borderRadius: 3, display: 'flex', alignItems: 'center', gap: 10,
				boxShadow: '0 4px 20px rgba(230,57,70,0.6)',
			}}>
				<span style={{fontSize: 20, fontWeight: 900, color: '#fff', letterSpacing: 3}}>{text}</span>
			</div>
		</div>
	);
};

// ============ SECTION SLAM — big section title with line ============
const SectionSlam: React.FC<{
	frame: number; fps: number; startFrame: number;
	text: string; color?: string;
}> = ({frame, fps, startFrame, text, color = '#c9a84c'}) => {
	const local = frame - startFrame;
	if (local < 0 || local > 48) return null;

	const lineW = spring({frame: Math.max(0, local), fps, from: 0, to: 100, durationInFrames: 8});
	const textScale = spring({frame: Math.max(0, local - 4), fps, from: 3, to: 1, durationInFrames: 6, config: {mass: 0.3, damping: 9}});
	const textOp = interpolate(local, [4, 7], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const fadeOut = interpolate(local, [36, 46], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const shake = local >= 4 && local <= 10 ? Math.sin(local * 8) * (10 - local) * 0.8 : 0;

	return (
		<div style={{
			position: 'absolute', top: 40, left: 30, opacity: fadeOut,
			transform: `translateX(${shake}px)`,
		}}>
			<div style={{width: `${lineW}%`, maxWidth: 400, height: 4, background: color, borderRadius: 2, marginBottom: 8}} />
			<div style={{
				fontSize: 38, fontWeight: 900, color,
				transform: `scale(${textScale})`, opacity: textOp,
				transformOrigin: 'left center',
				textShadow: '3px 3px 0 rgba(0,0,0,0.9)',
				letterSpacing: 4,
			}}>{text}</div>
		</div>
	);
};

// ============ TOP BAR ============
const TopBar: React.FC<{frame: number}> = ({frame}) => {
	const op = interpolate(frame, [Math.round(3 * FPS), Math.round(4 * FPS)], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	if (op === 0) return null;

	return (
		<div style={{
			position: 'absolute', top: 10, left: 10, opacity: op,
			display: 'flex', alignItems: 'center', gap: 8,
		}}>
			<div style={{width: 4, height: 22, background: '#e63946', borderRadius: 2}} />
			<span style={{fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: 4}}>
				CRÓNICAS ILUSTRADAS
			</span>
		</div>
	);
};
