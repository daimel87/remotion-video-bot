// Guarda cada corrida y compara contra la anterior para calcular VELOCIDAD
// (qué tan rápido crece el score de un token entre corridas). Esa aceleración
// es la señal de "esto va a explotar pronto" — una sola foto no la da.

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import path from "node:path";

export function loadLatestSnapshot(outDir) {
  const latestFile = path.join(outDir, "latest.json");
  if (!existsSync(latestFile)) return null;
  try {
    return JSON.parse(readFileSync(latestFile, "utf8"));
  } catch {
    return null;
  }
}

export function saveSnapshot(outDir, snapshot) {
  const historyDir = path.join(outDir, "history");
  if (!existsSync(historyDir)) mkdirSync(historyDir, { recursive: true });
  const stamp = snapshot.generatedAt.replace(/[:.]/g, "-");
  writeFileSync(path.join(historyDir, `${stamp}.json`), JSON.stringify(snapshot, null, 2));
  // latest.json siempre apunta a la corrida más reciente: es lo que se compara
  // en la siguiente corrida.
  writeFileSync(path.join(outDir, "latest.json"), JSON.stringify(snapshot, null, 2));
}

// Compara el board actual contra el de la corrida anterior y marca:
// - isNew: el token no existía en la corrida anterior (apareció de la nada)
// - scorePerHour: qué tan rápido está subiendo el score (aceleración)
export function computeVelocity(currentBoard, previousSnapshot) {
  if (!previousSnapshot) {
    return currentBoard.map((row) => ({ ...row, isNew: true, scoreDelta: row.score, scorePerHour: null }));
  }

  const hoursSinceLastRun = Math.max(
    0.05,
    (Date.now() - new Date(previousSnapshot.generatedAt).getTime()) / 3600000
  );
  const prevByToken = new Map((previousSnapshot.board || []).map((r) => [r.token, r]));

  return currentBoard.map((row) => {
    const prev = prevByToken.get(row.token);
    const scoreDelta = prev ? row.score - prev.score : row.score;
    return {
      ...row,
      isNew: !prev,
      scoreDelta: Math.round(scoreDelta * 10) / 10,
      scorePerHour: Math.round((scoreDelta / hoursSinceLastRun) * 10) / 10,
    };
  });
}
