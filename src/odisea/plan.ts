// Selector de pool "menos usado + separacion minima" (ver CLAUDE.md).
// Evita repetir el mismo archivo seguido y reparte todo el material
// descargado entre los cues del guion, en vez de reusar siempre los
// primeros resultados de cada pool.
import {POOLS as POOLS_STOCK} from './pools.generated';
import {POOLS_AI, POOLS_AI_B2, POOLS_AI_B3} from './pools-ai';
import type {PoolItem} from './pools.generated';

const POOLS: Record<string, PoolItem[]> = {
  ...POOLS_STOCK,
  ...POOLS_AI,
  ...POOLS_AI_B2,
  ...POOLS_AI_B3,
};

const MIN_SEP = 4; // minimo de tomas entre dos usos del mismo archivo

type UsageState = {
  count: Map<string, number>; // file -> veces usado
  lastIndex: Map<string, number>; // file -> indice (posicion en el plan) del ultimo uso
};

export const createUsageState = (): UsageState => ({count: new Map(), lastIndex: new Map()});

export function pickFromPool(poolName: string, state: UsageState, atIndex: number): PoolItem {
  const pool = POOLS[poolName];
  if (!pool || pool.length === 0) {
    throw new Error(
      `Pool "${poolName}" no existe o esta vacio. Pools disponibles: ${Object.keys(POOLS).join(', ')}`,
    );
  }
  const candidates = pool.filter((item) => {
    const last = state.lastIndex.get(item.file);
    return last === undefined || atIndex - last >= MIN_SEP;
  });
  const usable = candidates.length > 0 ? candidates : pool; // si el pool es chico, relaja la separacion
  const sorted = [...usable].sort(
    (a, b) => (state.count.get(a.file) ?? 0) - (state.count.get(b.file) ?? 0),
  );
  const chosen = sorted[0];
  state.count.set(chosen.file, (state.count.get(chosen.file) ?? 0) + 1);
  state.lastIndex.set(chosen.file, atIndex);
  return chosen;
}

export type Cue = {
  text: string;
  pool: string;
  durationSec?: number; // por defecto DEFAULT_SHOT_SEC
};

export const DEFAULT_SHOT_SEC = 5;

export type PlannedShot = Cue & {item: PoolItem; fromSec: number};

export function buildPlan(cues: Cue[]): PlannedShot[] {
  const state = createUsageState();
  let t = 0;
  return cues.map((cue, i) => {
    const item = pickFromPool(cue.pool, state, i);
    const dur = cue.durationSec ?? DEFAULT_SHOT_SEC;
    const shot: PlannedShot = {...cue, item, fromSec: t};
    t += dur;
    return shot;
  });
}

export const planDurationSec = (cues: Cue[]): number =>
  cues.reduce((sum, c) => sum + (c.durationSec ?? DEFAULT_SHOT_SEC), 0);
