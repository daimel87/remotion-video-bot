// Estimador de timing por palabra -- PLACEHOLDER hasta que haya narracion
// real transcrita (Whisper, via el skill video-understand). Reparte la
// duracion del plano entre las palabras proporcional a su longitud, para
// poder probar remotion-captions-themes ya mismo. Reemplazar por
// timestamps reales en cuanto exista audio.
import type {CaptionsData} from 'remotion-captions-themes';

export function estimateCaptionsData(text: string, durationSec: number): CaptionsData {
  const words = text.split(' ').filter(Boolean);
  const weights = words.map((w) => Math.max(w.length, 2));
  const total = weights.reduce((a, b) => a + b, 0);
  let t = 0;
  const timed = words.map((w, i) => {
    const dur = (weights[i] / total) * durationSec;
    const start = t;
    const end = t + dur;
    t = end;
    return {text: w, start, end};
  });
  return {lines: [{words: timed}]};
}
