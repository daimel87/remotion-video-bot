// Selector de pool "menos usado + separacion minima" para el pipeline
// automatico audio->video. Es una copia self-contained de src/odisea/plan.ts
// (misma logica pickFromPool / MIN_SEP descrita en CLAUDE.md) para no acoplar
// el sistema nuevo al material de odisea. Consume los pools auto-generados por
// scripts/auto/4-emit.mjs.
import {POOLS} from './pools.generated';
import type {PoolItem} from './pools.generated';

const MIN_SEP = 4; // minimo de tomas entre dos usos del mismo archivo

type UsageState = {
  count: Map<string, number>;
  lastIndex: Map<string, number>;
};

export const createUsageState = (): UsageState => ({
  count: new Map(),
  lastIndex: new Map(),
});

export function pickFromPool(poolName: string, state: UsageState, atIndex: number): PoolItem {
  const pool = POOLS[poolName];
  if (!pool || pool.length === 0) {
    throw new Error(
      `Pool "${poolName}" no existe o esta vacio. Pools: ${Object.keys(POOLS).join(', ')}`,
    );
  }
  const candidates = pool.filter((item) => {
    const last = state.lastIndex.get(item.file);
    return last === undefined || atIndex - last >= MIN_SEP;
  });
  const usable = candidates.length > 0 ? candidates : pool;
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
  durationSec: number; // siempre viene del SRT real (regla "el SRT es ley")
};

export const DEFAULT_SHOT_SEC = 4;

export type PlannedShot = Cue & {item: PoolItem; fromSec: number};

export function buildPlan(cues: Cue[]): PlannedShot[] {
  const state = createUsageState();
  let t = 0;
  return cues.map((cue, i) => {
    const item = pickFromPool(cue.pool, state, i);
    const shot: PlannedShot = {...cue, item, fromSec: t};
    t += cue.durationSec;
    return shot;
  });
}

export const planDurationSec = (cues: Cue[]): number =>
  cues.reduce((sum, c) => sum + c.durationSec, 0);
