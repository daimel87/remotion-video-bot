import {interpolate, Easing} from 'remotion';

// ---- Professional health identity ----
// Deep clinical navy panels, medical teal, clean white, single warm accent for the key datum.
export const theme = {
	panel: 'rgba(9, 24, 44, 0.9)',           // deep clinical navy backing
	panelBorder: 'rgba(56, 189, 217, 0.5)',
	c1: '#22d3ee',                            // medical teal / cyan
	c2: '#7dd3fc',                            // light clinical blue
	gradFrom: '#0e7490',
	gradTo: '#06b6d4',
	accent: '#ff5a5f',                        // SOLO dato/palabra clave (alerta clínica)
	text: '#ffffff',
	textDim: 'rgba(255,255,255,0.74)',
	grad: 'linear-gradient(90deg, #0e7490, #06b6d4)',
	fullBg: 'linear-gradient(135deg, #04121f 0%, #0a2540 55%, #072033 100%)',
};

export const EASE_OUT = Easing.out(Easing.cubic);
export const EASE_IN = Easing.in(Easing.cubic);
export const EASE_IN_OUT = Easing.inOut(Easing.cubic);

// entra (ease-out) / permanece / sale (ease-in)
export const lifecycle = (frame: number, inAt: number, outAt: number, dur = 9) => {
	const enter = interpolate(frame, [inAt, inAt + dur], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: EASE_OUT,
	});
	const exit = interpolate(frame, [outAt - dur, outAt], [1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: EASE_IN,
	});
	return Math.min(enter, exit);
};

export const animIn = (frame: number, inAt: number, dur = 9) =>
	interpolate(frame, [inAt, inAt + dur], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: EASE_OUT,
	});

export const shadow = {textShadow: '0 2px 8px rgba(0,0,0,0.6)'} as const;

export const panelStyle = (s: number) => ({
	background: theme.panel,
	border: `${1.5 * s}px solid ${theme.panelBorder}`,
	borderRadius: 16 * s,
	backdropFilter: 'blur(8px)',
	WebkitBackdropFilter: 'blur(8px)',
	boxShadow: `0 ${10 * s}px ${40 * s}px rgba(0,0,0,0.45)`,
});
