import {spring, interpolate, Easing} from 'remotion';

export const sec2f = (s: number, fps: number) => Math.round(s * fps);

const FALLBACK_SPRING = {damping: 20, stiffness: 150, mass: 1};

export type Life = {p: number; enter: number; exit: number};

// Enter spring from startF, exit spring beginning outMs before endF.
// p = enter * (1 - exit): 0 -> 1 -> 0 over the event's life.
// The exit is time-normalized (durationInFrames) so p reaches EXACTLY 0 at
// endF: the Director cut-syncs endSec to footage cuts, and a graphic must be
// fully gone on the cut frame, never mid-fade across it.
export function lifecycle(
  frame: number,
  fps: number,
  startF: number,
  endF: number,
  springs: any,
  outMs: number
): Life {
  const enterCfg = springs?.enter ?? FALLBACK_SPRING;
  const exitCfg = springs?.exit ?? enterCfg;
  const enter = spring({frame: Math.max(0, frame - startF), fps, config: enterCfg});
  const outFrames = Math.max(6, Math.round((outMs / 1000) * fps));
  const exitStart = endF - outFrames;
  const exit =
    frame >= endF
      ? 1
      : frame >= exitStart
        ? spring({frame: frame - exitStart, fps, config: exitCfg, durationInFrames: outFrames})
        : 0;
  return {p: enter * (1 - exit), enter, exit};
}

// Deterministic decaying wiggle (bell shake): +-amp degrees, settling.
export function wiggle(framesSince: number, amp = 14): number {
  if (framesSince <= 0) return 0;
  return amp * Math.sin(framesSince * 0.85) * Math.exp(-framesSince * 0.11);
}

// Payoff punctuation: 0 -> 1 -> 0 impulse at the final reveal of a concept
// graphic (the "turn" of the storyline). Callers scale/glow with it.
export function payoffPulse(frame: number, lastRevealF: number): number {
  if (!isFinite(lastRevealF) || lastRevealF <= 0) return 0;
  return interpolate(frame, [lastRevealF, lastRevealF + 4, lastRevealF + 16], [0, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
}

// Eased count-up for metric numbers (fast start, soft landing).
export function countUp(
  frame: number,
  startF: number,
  fps: number,
  to: number,
  from = 0,
  durSec = 1
): number {
  const t = interpolate(frame, [startF, startF + durSec * fps], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  return Math.round(from + (to - from) * t);
}

// Latest reveal frame across a concept payload's items (for payoffPulse).
export function lastReveal(items: any[], fps: number): number {
  const rs = (items ?? []).map((it) => it.revealSec).filter((v) => v != null);
  if (!rs.length) return -1;
  return Math.round(Math.max(...rs) * fps);
}
