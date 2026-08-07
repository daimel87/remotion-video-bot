#!/usr/bin/env node
/**
 * Master pipeline — generates FFmpeg commands to:
 *  1. Apply Ken Burns (slow zoom) + cinematic color grade to each stock clip
 *  2. Overlay HyperFrames motion graphics (WebM with alpha)
 *  3. Mix narration audio
 *  4. Output final segment MP4s ready for CapCut assembly
 *
 * Run AFTER:
 *   node scripts/download_stock.mjs        → ./clips/
 *   node scripts/render_graphics.mjs       → ./graphics_out/
 *
 * Usage:
 *   node scripts/build_video.mjs
 *   node scripts/build_video.mjs --clips ./clips --graphics ./graphics_out --audio ./audio --out ./final
 */

import fs   from 'fs';
import path from 'path';

const cliArgs = process.argv.slice(2);
const flags   = {};
for (let i = 0; i < cliArgs.length; i++) {
  if (cliArgs[i].startsWith('--')) { flags[cliArgs[i].slice(2)] = cliArgs[i + 1]; i++; }
}

const CLIPS_DIR    = flags.clips    || './clips';
const GRAPHICS_DIR = flags.graphics || './graphics_out';
const AUDIO_DIR    = flags.audio    || './audio';
const OUT_DIR      = flags.out      || './final';

fs.mkdirSync(OUT_DIR, { recursive: true });

// ── Ken Burns filter — slow zoom in from center ────────────────────────────
// zoompan: zoom from 1.0 → 1.08 over the clip duration, anchored center
function kenBurns(durationSec, fps = 25) {
  const totalFrames = Math.ceil(durationSec * fps);
  // zoom increases linearly from 1.0 to 1.08
  const zoomExpr = `min(zoom+0.0008,1.08)`;
  const xExpr    = `iw/2-(iw/zoom/2)`;
  const yExpr    = `ih/2-(ih/zoom/2)`;
  return `zoompan=z='${zoomExpr}':x='${xExpr}':y='${yExpr}':d=${totalFrames}:s=1920x1080:fps=${fps}`;
}

// ── Cinematic color grade ─────────────────────────────────────────────────
// Slight desaturation + lifted blacks + teal-orange push (common YouTube style)
const COLOR_GRADE = [
  `curves=all='0/0 0.1/0.05 0.5/0.5 0.9/0.92 1/1'`,   // lift blacks, crush whites slightly
  `hue=s=0.85`,                                          // slight desaturation
  `colorchannelmixer=rr=1.05:gg=0.98:bb=0.95`,          // warm highlights
  `eq=gamma=0.97:contrast=1.04`,                         // micro contrast
].join(',');

// ── Segment definitions ────────────────────────────────────────────────────
const SEGMENTS = [
  { id: 'intro',    index: 1, duration: 10, label: 'INTRO' },
  { id: 'habito_1', index: 2, duration: 10, label: 'Hábito #1' },
  { id: 'habito_2', index: 3, duration: 10, label: 'Hábito #2' },
  { id: 'habito_3', index: 4, duration: 10, label: 'Hábito #3' },
  { id: 'habito_4', index: 5, duration: 10, label: 'Hábito #4' },
  { id: 'habito_5', index: 6, duration: 10, label: 'Hábito #5' },
  { id: 'habito_6', index: 7, duration: 10, label: 'Hábito #6' },
  { id: 'cierre',   index: 8, duration:  8, label: 'CIERRE' },
];

const shCmds  = [];
const batCmds = [];

for (const seg of SEGMENTS) {
  const idx     = String(seg.index).padStart(2, '0');
  const bgPath  = path.join(CLIPS_DIR, `${idx}_${seg.id}_combined.mp4`).replace(/\\/g, '/');
  const grDir   = path.join(GRAPHICS_DIR, seg.id).replace(/\\/g, '/');
  const outPath = path.join(OUT_DIR, `${idx}_${seg.id}_final.mp4`).replace(/\\/g, '/');

  // Detect available audio file for this segment (optional)
  const audioCandidates = [
    path.join(AUDIO_DIR, `${idx}_${seg.id}.mp3`),
    path.join(AUDIO_DIR, `${idx}_${seg.id}.wav`),
    path.join(AUDIO_DIR, `${seg.id}.mp3`),
    path.join(AUDIO_DIR, `${seg.id}.wav`),
  ];
  const audioFile = audioCandidates.find(p => fs.existsSync(p));

  // Detect available graphics for this segment
  const headerPath  = path.join(grDir, 'header.webm');
  const bigtextPath = path.join(grDir, 'bigtext_01.webm');
  const ltPath      = path.join(grDir, 'lower_third_01.webm');

  const hasHeader  = fs.existsSync(headerPath);
  const hasBigtext = fs.existsSync(bigtextPath);
  const hasLt      = fs.existsSync(ltPath);

  // ── Build filter_complex ──────────────────────────────────────────────
  const kb       = kenBurns(seg.duration);
  const inputs   = [`-i "${bgPath}"`];
  const filters  = [];
  let   lastVideo = '[kb]';

  // Step 1: Ken Burns + color grade on background
  filters.push(`[0:v]${kb},${COLOR_GRADE}[kb]`);

  let inputIdx = 1;

  // Step 2: Overlay header fullscreen (start at t=0.5, show for ~3s)
  if (hasHeader) {
    inputs.push(`-i "${headerPath.replace(/\\/g, '/')}"`);
    const next = `[v${inputIdx}]`;
    filters.push(`${lastVideo}[${inputIdx}:v]overlay=0:0:enable='between(t,0.5,3.5)'${next}`);
    lastVideo = next;
    inputIdx++;
  }

  // Step 3: Overlay bigtext fullscreen (start at t=4, show for ~3.5s)
  if (hasBigtext) {
    inputs.push(`-i "${bigtextPath.replace(/\\/g, '/')}"`);
    const next = `[v${inputIdx}]`;
    filters.push(`${lastVideo}[${inputIdx}:v]overlay=0:0:enable='between(t,4,7.5)'${next}`);
    lastVideo = next;
    inputIdx++;
  }

  // Step 4: Lower third (start at t=1.5, show for ~4s)
  if (hasLt) {
    inputs.push(`-i "${ltPath.replace(/\\/g, '/')}"`);
    const next = `[vfinal]`;
    filters.push(`${lastVideo}[${inputIdx}:v]overlay=0:0:enable='between(t,1.5,5.5)'${next}`);
    lastVideo = '[vfinal]';
    inputIdx++;
  } else {
    // Rename last to vfinal if no lower third
    filters[filters.length - 1] = filters[filters.length - 1].replace(lastVideo, '[vfinal]');
    lastVideo = '[vfinal]';
  }

  // Audio
  const audioArgs = audioFile
    ? `-i "${audioFile.replace(/\\/g, '/')}" -map "[vfinal]" -map ${inputIdx}:a -c:a aac -b:a 192k`
    : `-map "[vfinal]" -an`;

  const cmd = [
    'ffmpeg -y',
    ...inputs,
    `-filter_complex "${filters.join(';')}"`,
    audioArgs,
    `-t ${seg.duration}`,
    `-c:v libx264 -crf 16 -preset fast -pix_fmt yuv420p`,
    `"${outPath}"`,
  ].join(' ');

  shCmds.push(`# ${seg.label}\n${cmd}`);
  batCmds.push(`rem ${seg.label}\n${cmd}`);

  console.log(`✓ ${seg.label}: ${hasHeader ? '📋header' : ''}${hasBigtext ? ' 📝bigtext' : ''}${hasLt ? ' 📌lower_third' : ''}${audioFile ? ' 🎤audio' : ''}`);
}

const sh  = '#!/bin/bash\n\n' + shCmds.join('\n\n')  + '\n';
const bat = '@echo off\n\n'   + batCmds.join('\n\n') + '\n';

fs.writeFileSync(path.join(OUT_DIR, 'build.sh'),  sh);
fs.writeFileSync(path.join(OUT_DIR, 'build.bat'), bat);

console.log(`\n→ Scripts generados:`);
console.log(`  Windows:   ${path.join(OUT_DIR, 'build.bat')}`);
console.log(`  Mac/Linux: bash ${path.join(OUT_DIR, 'build.sh')}`);
console.log(`\nEjecuta el script para producir los segmentos finales en: ${OUT_DIR}`);
