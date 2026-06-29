import React from 'react';
import {AbsoluteFill, Img, useCurrentFrame, useVideoConfig, interpolate, spring, staticFile, Sequence} from 'remotion';

const FPS = 24;

// Each "shot" = a frame image with specific Ken Burns movement and duration
// Magnates Media style: 2-3s per shot, alternating zoom directions, punch-in cuts
const SHOTS: Shot[] = [
	// 0-2s: Wide map — slow zoom in to center (Mediterranean)
	{frame: 'frame_001.jpg', dur: 48, zoom: [1, 1.3], panX: [0, -5], panY: [0, -8], type: 'wide'},
	// 2-2.8s: PUNCH CUT — same map zoomed into Italy
	{frame: 'frame_002.jpg', dur: 20, zoom: [1.6, 1.8], panX: [5, 3], panY: [-10, -12], type: 'detail'},
	// 2.8-5s: Harbor with Colosseum — zoom out reveal
	{frame: 'frame_005.jpg', dur: 52, zoom: [1.4, 1.1], panX: [8, 0], panY: [5, 0], type: 'wide'},
	// 5-6.2s: PUNCH CUT — zoom into ships
	{frame: 'frame_005.jpg', dur: 28, zoom: [1.8, 2.0], panX: [-5, -3], panY: [10, 8], type: 'detail'},
	// 6.2-8s: Map with empire extent — slow pan right
	{frame: 'frame_004.jpg', dur: 44, zoom: [1.1, 1.25], panX: [-10, 10], panY: [0, -3], type: 'wide'},
	// 8-9.5s: Market scene — zoom in
	{frame: 'frame_010.jpg', dur: 36, zoom: [1, 1.35], panX: [0, 5], panY: [0, -5], type: 'wide'},
	// 9.5-10.5s: PUNCH CUT — market detail (spices)
	{frame: 'frame_010.jpg', dur: 24, zoom: [2.0, 2.1], panX: [-15, -13], panY: [8, 6], type: 'detail'},
	// 10.5-12.5s: Market wide — different angle
	{frame: 'frame_011.jpg', dur: 48, zoom: [1.15, 1.0], panX: [5, -5], panY: [-3, 0], type: 'wide'},
	// 12.5-14.5s: Roma city with Colosseum — zoom in to Colosseum
	{frame: 'frame_015.jpg', dur: 48, zoom: [1, 1.4], panX: [0, 12], panY: [0, -5], type: 'wide'},
	// 14.5-15.5s: PUNCH — Colosseum detail
	{frame: 'frame_015.jpg', dur: 24, zoom: [1.8, 1.9], panX: [15, 14], panY: [-8, -10], type: 'detail'},
	// 15.5-18s: Aqueduct + soldiers — epic pan
	{frame: 'frame_025.jpg', dur: 60, zoom: [1.1, 1.3], panX: [-10, 10], panY: [0, -5], type: 'wide'},
	// 18-19s: PUNCH — soldiers close-up
	{frame: 'frame_025.jpg', dur: 24, zoom: [1.9, 2.0], panX: [12, 10], panY: [5, 3], type: 'detail'},
	// 19-21s: Roman soldier portrait — slow zoom in face
	{frame: 'frame_020.jpg', dur: 48, zoom: [1, 1.25], panX: [-5, -3], panY: [0, -3], type: 'wide'},
	// 21-22s: PUNCH — eyes detail
	{frame: 'frame_020.jpg', dur: 24, zoom: [1.8, 1.85], panX: [-8, -7], panY: [-10, -11], type: 'detail'},
	// 22-24.5s: Map overview — wide
	{frame: 'frame_022.jpg', dur: 60, zoom: [1.2, 1.0], panX: [5, -5], panY: [-5, 0], type: 'wide'},
	// 24.5-26s: Soldiers marching — zoom
	{frame: 'frame_025.jpg', dur: 36, zoom: [1, 1.3], panX: [0, -8], panY: [0, -5], type: 'wide'},
	// 26-27s: PUNCH — detail
	{frame: 'frame_026.jpg', dur: 24, zoom: [1.6, 1.7], panX: [0, 3], panY: [-5, -7], type: 'detail'},
	// 27-30s: Map with ships — slow epic pan to close
	{frame: 'frame_028.jpg', dur: 72, zoom: [1.05, 1.25], panX: [-5, 8], panY: [0, -8], type: 'wide'},
];

interface Shot {
	frame: string;
	dur: number;
	zoom: [number, number];
	panX: [number, number];
	panY: [number, number];
	type: 'wide' | 'detail';
}

export const RomaFullEdit: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	let accumulated = 0;
	const shotElements: React.ReactNode[] = [];

	for (let i = 0; i < SHOTS.length; i++) {
		const shot = SHOTS[i];
		shotElements.push(
			<Sequence key={i} from={accumulated} durationInFrames={shot.dur}>
				<ShotRenderer shot={shot} isDetail={shot.type === 'detail'} prevType={i > 0 ? SHOTS[i-1].type : 'wide'} />
			</Sequence>
		);
		accumulated += shot.dur;
	}

	const totalFrames = accumulated;

	return (
		<AbsoluteFill style={{background: '#000', fontFamily: "'Arial Black', 'Impact', sans-serif"}}>
			{shotElements}

			{/* ===== OVERLAYS ===== */}
			<FlashEffect frame={frame} triggerFrame={0} />
			<HookSlam frame={frame} fps={fps} startFrame={0}
				lines={['EL IMPERIO', 'MÁS PODEROSO', 'DE LA HISTORIA']}
			/>

			<GlitchCut frame={frame} triggerFrame={48} />
			<FlashEffect frame={frame} triggerFrame={48} />

			<CounterPop frame={frame} fps={fps} startFrame={Math.round(3 * FPS)}
				label="APOGEO" endValue={117} suffix=" d.C." position="left"
			/>

			<ZoomText frame={frame} fps={fps} startFrame={Math.round(5 * FPS)}
				text="ROMA DOMINABA TODO" size={48}
			/>

			<FlashEffect frame={frame} triggerFrame={Math.round(6.2 * FPS)} />
			<GlitchCut frame={frame} triggerFrame={Math.round(6.2 * FPS)} />

			<CounterPop frame={frame} fps={fps} startFrame={Math.round(7 * FPS)}
				label="EXTENSIÓN" endValue={5} suffix=" MILLONES KM²" position="right"
			/>

			<FlashEffect frame={frame} triggerFrame={Math.round(9.5 * FPS)} />

			<KineticStack frame={frame} fps={fps} startFrame={Math.round(10 * FPS)}
				lines={['CARRETERAS', 'ACUEDUCTOS', 'COLISEOS', 'LEGIONES']} stagger={3}
			/>

			<GlitchCut frame={frame} triggerFrame={Math.round(12.5 * FPS)} />
			<CounterPop frame={frame} fps={fps} startFrame={Math.round(13 * FPS)}
				label="POBLACIÓN" endValue={70} suffix=" MILLONES" position="left"
			/>

			<FlashEffect frame={frame} triggerFrame={Math.round(14.5 * FPS)} />

			<LocationPop frame={frame} fps={fps} startFrame={Math.round(15.5 * FPS)} text="ROMA, ITALIA" />

			<ZoomText frame={frame} fps={fps} startFrame={Math.round(18 * FPS)}
				text="UN IMPERIO INVENCIBLE" size={44} color="#c9a84c"
			/>

			<GlitchCut frame={frame} triggerFrame={Math.round(19 * FPS)} />
			<FlashEffect frame={frame} triggerFrame={Math.round(19 * FPS)} />
			<SectionSlam frame={frame} fps={fps} startFrame={Math.round(19.5 * FPS)}
				text="LA GLORIA DE ROMA" color="#c9a84c"
			/>

			<FlashEffect frame={frame} triggerFrame={Math.round(21 * FPS)} />

			<CounterPop frame={frame} fps={fps} startFrame={Math.round(22 * FPS)}
				label="LEGIONES" endValue={450} suffix=",000 SOLDADOS" position="right"
			/>

			<KineticStack frame={frame} fps={fps} startFrame={Math.round(25 * FPS)}
				lines={['CONQUISTARON', 'EUROPA', 'ÁFRICA', 'ASIA']} stagger={2}
			/>

			<FlashEffect frame={frame} triggerFrame={Math.round(26 * FPS)} />
			<GlitchCut frame={frame} triggerFrame={Math.round(27 * FPS)} />
			<ZoomText frame={frame} fps={fps} startFrame={Math.round(28 * FPS)}
				text="NADIE PODÍA DETENERLOS" size={46} color="#e63946"
			/>

			{/* TOP BAR */}
			<TopBar frame={frame} />

			{/* PROGRESS */}
			<div style={{
				position: 'absolute', bottom: 0, left: 0,
				height: 4, background: '#e63946',
				width: `${(frame / totalFrames) * 100}%`,
			}} />
		</AbsoluteFill>
	);
};

// ============ SHOT RENDERER with Ken Burns ============
const ShotRenderer: React.FC<{shot: Shot; isDetail: boolean; prevType: string}> = ({shot, isDetail}) => {
	const frame = useCurrentFrame();
	const {durationInFrames} = useVideoConfig();
	const dur = shot.dur;

	const progress = frame / dur;
	const zoom = interpolate(progress, [0, 1], shot.zoom, {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const px = interpolate(progress, [0, 1], shot.panX, {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const py = interpolate(progress, [0, 1], shot.panY, {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	return (
		<AbsoluteFill style={{overflow: 'hidden'}}>
			<Img
				src={staticFile(`images/roma_frames/${shot.frame}`)}
				style={{
					position: 'absolute',
					width: '100%', height: '100%',
					objectFit: 'cover',
					transform: `scale(${zoom}) translate(${px}%, ${py}%)`,
					transformOrigin: 'center center',
				}}
			/>
			{isDetail && (
				<div style={{
					position: 'absolute', inset: 0,
					boxShadow: 'inset 0 0 80px rgba(0,0,0,0.5)',
					pointerEvents: 'none',
				}} />
			)}
		</AbsoluteFill>
	);
};

// ============ FLASH EFFECT ============
const FlashEffect: React.FC<{frame: number; triggerFrame: number}> = ({frame, triggerFrame}) => {
	const local = frame - triggerFrame;
	if (local < 0 || local > 4) return null;
	const op = interpolate(local, [0, 1, 4], [0.9, 0.6, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	return <div style={{position: 'absolute', inset: 0, background: '#fff', opacity: op, pointerEvents: 'none', zIndex: 50}} />;
};

// ============ GLITCH CUT ============
const GlitchCut: React.FC<{frame: number; triggerFrame: number}> = ({frame, triggerFrame}) => {
	const local = frame - triggerFrame;
	if (local < 0 || local > 5) return null;
	const slices = Array.from({length: 6}, (_, i) => {
		const offset = ((i * 41 + local * 17) % 50) - 25;
		const h = 100 / 6;
		const op = interpolate(local, [0, 1, 5], [0.8, 0.5, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
		return (
			<div key={i} style={{
				position: 'absolute', left: 0, right: 0,
				top: `${i * h}%`, height: `${h}%`,
				background: i % 2 === 0 ? '#e63946' : '#00ffff',
				transform: `translateX(${offset}px)`,
				opacity: op * 0.5, mixBlendMode: 'screen' as const,
			}} />
		);
	});
	return <div style={{position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 40}}>{slices}</div>;
};

// ============ HOOK SLAM ============
const HookSlam: React.FC<{frame: number; fps: number; startFrame: number; lines: string[]}> = ({frame, fps, startFrame, lines}) => {
	const local = frame - startFrame;
	if (local < 0 || local > 48) return null;
	const shake = local <= 15 ? Math.sin(local * 6) * Math.max(0, 15 - local) * 1.5 : 0;
	const fadeOut = interpolate(local, [35, 46], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const bgOp = interpolate(local, [0, 3, 35, 46], [0, 0.7, 0.7, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	return (
		<div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 0, transform: `translateX(${shake}px)`, zIndex: 30}}>
			<div style={{position: 'absolute', inset: 0, background: '#000', opacity: bgOp}} />
			{lines.map((line, i) => {
				const s = spring({frame: Math.max(0, local - i * 4), fps, from: 5, to: 1, durationInFrames: 6, config: {mass: 0.4, damping: 8}});
				const op = interpolate(local - i * 4, [0, 3], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
				const isLast = i === lines.length - 1;
				return (
					<div key={i} style={{fontSize: isLast ? 76 : 50, fontWeight: 900, color: isLast ? '#e63946' : '#fff', transform: `scale(${s})`, opacity: op * fadeOut, textShadow: '4px 4px 0 rgba(0,0,0,0.9)', letterSpacing: isLast ? -3 : -1, lineHeight: 1.0, zIndex: 1}}>{line}</div>
				);
			})}
		</div>
	);
};

// ============ COUNTER POP ============
const CounterPop: React.FC<{frame: number; fps: number; startFrame: number; label: string; endValue: number; suffix: string; position: 'left' | 'right'}> = ({frame, fps, startFrame, label, endValue, suffix, position}) => {
	const local = frame - startFrame;
	if (local < 0 || local > 55) return null;
	const slideIn = spring({frame: Math.max(0, local), fps, from: position === 'left' ? -300 : 300, to: 0, durationInFrames: 8, config: {mass: 0.5, damping: 10}});
	const countProgress = interpolate(local, [4, 18], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const currentValue = Math.round(endValue * countProgress);
	const pop = local >= 18 && local <= 24 ? spring({frame: local - 18, fps, from: 1.3, to: 1, durationInFrames: 6}) : 1;
	const fadeOut = interpolate(local, [42, 52], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const op = interpolate(local, [0, 4], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	return (
		<div style={{position: 'absolute', bottom: 90, ...(position === 'left' ? {left: 30} : {right: 30}), transform: `translateX(${slideIn}px)`, opacity: op * fadeOut, zIndex: 20}}>
			<div style={{background: 'rgba(0,0,0,0.9)', padding: '14px 28px', borderRadius: 4, borderLeft: position === 'left' ? '5px solid #e63946' : 'none', borderRight: position === 'right' ? '5px solid #e63946' : 'none'}}>
				<div style={{fontSize: 11, fontWeight: 700, color: '#e63946', letterSpacing: 4, marginBottom: 6}}>{label}</div>
				<div style={{fontSize: 42, fontWeight: 900, color: '#fff', transform: `scale(${pop})`, transformOrigin: position === 'left' ? 'left center' : 'right center', textAlign: position}}>{currentValue}{suffix}</div>
			</div>
		</div>
	);
};

// ============ ZOOM TEXT ============
const ZoomText: React.FC<{frame: number; fps: number; startFrame: number; text: string; size: number; color?: string}> = ({frame, fps, startFrame, text, size, color = '#fff'}) => {
	const local = frame - startFrame;
	if (local < 0 || local > 30) return null;
	const scale = spring({frame: Math.max(0, local), fps, from: 3, to: 1, durationInFrames: 6, config: {mass: 0.3, damping: 9}});
	const op = interpolate(local, [0, 2], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const fadeOut = interpolate(local, [22, 28], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const blur = interpolate(local, [0, 5], [8, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	return (
		<div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', zIndex: 20}}>
			<div style={{fontSize: size, fontWeight: 900, color, transform: `scale(${scale})`, opacity: op * fadeOut, textShadow: '3px 3px 0 rgba(0,0,0,0.9)', letterSpacing: 3, filter: `blur(${blur}px)`}}>{text}</div>
		</div>
	);
};

// ============ KINETIC STACK ============
const KineticStack: React.FC<{frame: number; fps: number; startFrame: number; lines: string[]; stagger: number}> = ({frame, fps, startFrame, lines, stagger}) => {
	const local = frame - startFrame;
	const totalDur = lines.length * stagger + 30;
	if (local < 0 || local > totalDur) return null;
	const fadeOut = interpolate(local, [totalDur - 10, totalDur - 2], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	return (
		<div style={{position: 'absolute', top: '15%', right: 40, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, opacity: fadeOut, zIndex: 20}}>
			{lines.map((line, i) => {
				const lineLocal = local - i * stagger;
				if (lineLocal < 0) return null;
				const s = spring({frame: lineLocal, fps, from: 0, to: 1, durationInFrames: 5, config: {mass: 0.3, damping: 9}});
				const slideX = interpolate(lineLocal, [0, 5], [60, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
				return (
					<div key={i} style={{fontSize: 36, fontWeight: 900, color: i === lines.length - 1 ? '#e63946' : '#fff', transform: `scale(${s}) translateX(${slideX}px)`, textShadow: '3px 3px 0 rgba(0,0,0,0.9)', letterSpacing: 2}}>{line}</div>
				);
			})}
		</div>
	);
};

// ============ LOCATION POP ============
const LocationPop: React.FC<{frame: number; fps: number; startFrame: number; text: string}> = ({frame, fps, startFrame, text}) => {
	const local = frame - startFrame;
	if (local < 0 || local > 42) return null;
	const scaleUp = spring({frame: Math.max(0, local), fps, from: 0, to: 1, durationInFrames: 6, config: {mass: 0.3, damping: 9}});
	const fadeOut = interpolate(local, [32, 40], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	return (
		<div style={{position: 'absolute', top: 50, right: 30, transform: `scale(${scaleUp})`, opacity: fadeOut, zIndex: 20}}>
			<div style={{background: '#e63946', padding: '8px 20px', borderRadius: 3, boxShadow: '0 4px 20px rgba(230,57,70,0.6)'}}>
				<span style={{fontSize: 20, fontWeight: 900, color: '#fff', letterSpacing: 3}}>{text}</span>
			</div>
		</div>
	);
};

// ============ SECTION SLAM ============
const SectionSlam: React.FC<{frame: number; fps: number; startFrame: number; text: string; color?: string}> = ({frame, fps, startFrame, text, color = '#c9a84c'}) => {
	const local = frame - startFrame;
	if (local < 0 || local > 42) return null;
	const lineW = spring({frame: Math.max(0, local), fps, from: 0, to: 100, durationInFrames: 8});
	const textScale = spring({frame: Math.max(0, local - 4), fps, from: 3, to: 1, durationInFrames: 6, config: {mass: 0.3, damping: 9}});
	const textOp = interpolate(local, [4, 7], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const fadeOut = interpolate(local, [32, 40], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const shake = local >= 4 && local <= 10 ? Math.sin(local * 8) * (10 - local) * 0.8 : 0;
	return (
		<div style={{position: 'absolute', top: 40, left: 30, opacity: fadeOut, transform: `translateX(${shake}px)`, zIndex: 20}}>
			<div style={{width: `${lineW}%`, maxWidth: 400, height: 4, background: color, borderRadius: 2, marginBottom: 8}} />
			<div style={{fontSize: 38, fontWeight: 900, color, transform: `scale(${textScale})`, opacity: textOp, transformOrigin: 'left center', textShadow: '3px 3px 0 rgba(0,0,0,0.9)', letterSpacing: 4}}>{text}</div>
		</div>
	);
};

// ============ TOP BAR ============
const TopBar: React.FC<{frame: number}> = ({frame}) => {
	const op = interpolate(frame, [Math.round(3 * FPS), Math.round(4 * FPS)], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	if (op === 0) return null;
	return (
		<div style={{position: 'absolute', top: 10, left: 10, opacity: op, display: 'flex', alignItems: 'center', gap: 8, zIndex: 20}}>
			<div style={{width: 4, height: 22, background: '#e63946', borderRadius: 2}} />
			<span style={{fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: 4}}>CRÓNICAS ILUSTRADAS</span>
		</div>
	);
};
