#!/usr/bin/env node
/**
 * HyperFrames renderer — captures animated HTML graphics as MP4 (transparent WebM)
 * using Puppeteer + Chrome.
 *
 * Prerequisites (run once):
 *   npm install puppeteer
 *
 * Usage:
 *   node scripts/render_graphics.mjs
 *   node scripts/render_graphics.mjs --segment habito_1 --out ./graphics_out
 *
 * Output per segment:
 *   section_header_01.webm   (fullscreen card, ~3s)
 *   bigtext_01_a.webm        (key phrase overlay, ~3s)
 *   lower_third_01_a.webm    (phrase bar bottom, ~4s)
 */

import path    from 'path';
import fs      from 'fs';
import { URL, fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── CONFIG ────────────────────────────────────────────────────────────────────
const FPS      = 25;
const WIDTH    = 1920;
const HEIGHT   = 1080;
const GRAPHICS = path.join(__dirname, 'graphics');

// Segment data for "Hábitos Cotidianos que son Señales de Baja Inteligencia"
const SEGMENTS = [
  {
    id: 'intro',
    header: null,
    bigtexts: [
      { text: 'Hay hábitos que parecen normales.\\nPero te hacen menos inteligente cada día.', highlight: 'menos inteligente cada día', duration: 3.5 },
    ],
    lowerThirds: [
      { text: 'No son vicios. Son patrones invisibles.', highlight: 'patrones invisibles', duration: 4 },
    ],
  },
  {
    id: 'habito_1',
    header: { number: 'Hábito #1', title: 'Consumo Pasivo de Contenido', subtitle: 'Tu cerebro aprende a no necesitar esfuerzo.', duration: 3 },
    bigtexts: [
      { text: 'Scrollear no descansa la mente.\\nLa acostumbra a la recompensa instantánea.', highlight: 'recompensa instantánea', duration: 3.5 },
    ],
    lowerThirds: [
      { text: 'Cada scroll entrena tu cerebro para aburrirse más rápido.', highlight: 'aburrirse más rápido', duration: 4 },
    ],
  },
  {
    id: 'habito_2',
    header: { number: 'Hábito #2', title: 'Huir del Aburrimiento', subtitle: 'El aburrimiento es donde nace el pensamiento real.', duration: 3 },
    bigtexts: [
      { text: 'La mente que no tolera el silencio\\nnunca aprende a pensar en profundidad.', highlight: 'pensar en profundidad', duration: 3.5 },
    ],
    lowerThirds: [
      { text: 'El aburrimiento no es un problema. Es una señal.', highlight: 'Es una señal', duration: 4 },
    ],
  },
  {
    id: 'habito_3',
    header: { number: 'Hábito #3', title: 'Hablar Más que Escuchar', subtitle: 'La escucha activa es la habilidad más subestimada.', duration: 3 },
    bigtexts: [
      { text: 'Mientras hablas, no aprendes nada nuevo.\\nMientras escuchas, cambias.', highlight: 'escuchas, cambias', duration: 3.5 },
    ],
    lowerThirds: [
      { text: 'Los más inteligentes preguntan. Los demás explican.', highlight: 'preguntan', duration: 4 },
    ],
  },
  {
    id: 'habito_4',
    header: { number: 'Hábito #4', title: 'Sesgo de Confirmación', subtitle: 'Solo buscas lo que ya crees que es verdad.', duration: 3 },
    bigtexts: [
      { text: 'No buscas información.\\nBuscas confirmación de lo que ya piensas.', highlight: 'confirmación', duration: 3.5 },
    ],
    lowerThirds: [
      { text: 'La mente cómoda rechaza lo que la contradice.', highlight: 'rechaza', duration: 4 },
    ],
  },
  {
    id: 'habito_5',
    header: { number: 'Hábito #5', title: 'Decisiones por Impulso', subtitle: 'La emoción actúa primero. La razón llega tarde.', duration: 3 },
    bigtexts: [
      { text: 'Una decisión tomada con rabia\\nes una decisión que tomarías diferente en calma.', highlight: 'diferente en calma', duration: 3.5 },
    ],
    lowerThirds: [
      { text: 'El impulso actúa. La inteligencia espera.', highlight: 'espera', duration: 4 },
    ],
  },
  {
    id: 'habito_6',
    header: { number: 'Hábito #6', title: 'No Terminar lo que Empiezas', subtitle: 'Cada abandono refuerza el siguiente.', duration: 3 },
    bigtexts: [
      { text: 'No terminar no es falta de tiempo.\\nEs falta de tolerancia a la dificultad.', highlight: 'tolerancia a la dificultad', duration: 3.5 },
    ],
    lowerThirds: [
      { text: 'Cada proyecto abandonado entrena tu cerebro para rendirse.', highlight: 'rendirse', duration: 4 },
    ],
  },
  {
    id: 'cierre',
    header: null,
    bigtexts: [
      { text: 'La inteligencia no es talento.\\nEs el resultado de tus hábitos diarios.', highlight: 'hábitos diarios', duration: 3.5 },
    ],
    lowerThirds: [
      { text: 'Cambia el hábito. Cambia el cerebro.', highlight: 'Cambia el cerebro', duration: 4 },
    ],
  },
];

// ── RENDERER ──────────────────────────────────────────────────────────────────

function toFileUrl(filePath) {
  return 'file:///' + filePath.replace(/\\/g, '/');
}

function buildUrl(template, params) {
  const base = toFileUrl(path.join(GRAPHICS, template));
  const qs   = new URLSearchParams(params).toString();
  return `${base}?${qs}`;
}

async function renderToWebM(browser, url, outPath, durationSec) {
  if (fs.existsSync(outPath)) {
    console.log(`  → Ya existe: ${path.basename(outPath)}`);
    return outPath;
  }

  const page = await browser.newPage();
  await page.setViewport({ width: WIDTH, height: HEIGHT, deviceScaleFactor: 1 });

  // Enable transparent background for overlay graphics
  await page.evaluateOnNewDocument(() => {
    document.documentElement.style.background = 'transparent';
  });

  await page.goto(url, { waitUntil: 'networkidle0' });
  await page.waitForFunction(() => window.__ready === true, { timeout: 5000 });

  const frames    = Math.ceil(durationSec * FPS);
  const frameDir  = outPath.replace(/\.webm$/, '_frames');
  fs.mkdirSync(frameDir, { recursive: true });

  console.log(`  ↓ ${path.basename(outPath)} — ${frames} frames`);

  for (let f = 0; f < frames; f++) {
    await page.evaluate(f => {
      // Advance CSS animation time via custom property if needed
      // Animations run in real-time; we capture them sequentially
    }, f);

    const framePath = path.join(frameDir, `frame_${String(f).padStart(5, '0')}.png`);
    await page.screenshot({ path: framePath, omitBackground: true });

    // Small delay to let animation play at ~real-time pace
    if (f < frames - 1) {
      await new Promise(r => setTimeout(r, 1000 / FPS));
    }
  }

  await page.close();
  return { frameDir, outPath, frames };
}

// ── CLI ───────────────────────────────────────────────────────────────────────

const cliArgs = process.argv.slice(2);
const flags   = {};
for (let i = 0; i < cliArgs.length; i++) {
  if (cliArgs[i].startsWith('--')) { flags[cliArgs[i].slice(2)] = cliArgs[i + 1]; i++; }
}

const outDir  = flags.out || './graphics_out';
const segFilter = flags.segment || null;
fs.mkdirSync(outDir, { recursive: true });

console.log('\nLaunching Chrome via Puppeteer...');

let puppeteer;
try {
  puppeteer = (await import('puppeteer')).default;
} catch {
  console.error('\n✗ Puppeteer no está instalado. Ejecuta:\n  npm install puppeteer\n');
  process.exit(1);
}

const browser = await puppeteer.launch({
  headless: 'new',
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--enable-transparent-background'],
  defaultViewport: { width: WIDTH, height: HEIGHT },
});

const ffmpegCmds = [];
const segments   = segFilter ? SEGMENTS.filter(s => s.id === segFilter) : SEGMENTS;

for (const seg of segments) {
  console.log(`\n── ${seg.id} ──`);
  const segOut = path.join(outDir, seg.id);
  fs.mkdirSync(segOut, { recursive: true });

  // 1. Section header
  if (seg.header) {
    const url     = buildUrl('section_header.html', { ...seg.header });
    const outPath = path.join(segOut, 'header.webm');
    const result  = await renderToWebM(browser, url, outPath, seg.header.duration + 0.5);
    if (result?.frameDir) {
      ffmpegCmds.push({
        label: `${seg.id}/header`,
        cmd: `ffmpeg -framerate ${FPS} -i "${result.frameDir}/frame_%05d.png" -c:v libvpx-vp9 -pix_fmt yuva420p -auto-alt-ref 0 -b:v 0 -crf 10 "${result.outPath}"`,
      });
    }
  }

  // 2. BigTexts
  for (let i = 0; i < seg.bigtexts.length; i++) {
    const bt      = seg.bigtexts[i];
    const url     = buildUrl('bigtext.html', bt);
    const outPath = path.join(segOut, `bigtext_${String(i + 1).padStart(2, '0')}.webm`);
    const result  = await renderToWebM(browser, url, outPath, bt.duration + 0.5);
    if (result?.frameDir) {
      ffmpegCmds.push({
        label: `${seg.id}/bigtext_${i + 1}`,
        cmd: `ffmpeg -framerate ${FPS} -i "${result.frameDir}/frame_%05d.png" -c:v libvpx-vp9 -pix_fmt yuva420p -auto-alt-ref 0 -b:v 0 -crf 10 "${result.outPath}"`,
      });
    }
  }

  // 3. Lower thirds
  for (let i = 0; i < seg.lowerThirds.length; i++) {
    const lt      = seg.lowerThirds[i];
    const url     = buildUrl('lower_third.html', lt);
    const outPath = path.join(segOut, `lower_third_${String(i + 1).padStart(2, '0')}.webm`);
    const result  = await renderToWebM(browser, url, outPath, lt.duration + 0.5);
    if (result?.frameDir) {
      ffmpegCmds.push({
        label: `${seg.id}/lower_third_${i + 1}`,
        cmd: `ffmpeg -framerate ${FPS} -i "${result.frameDir}/frame_%05d.png" -c:v libvpx-vp9 -pix_fmt yuva420p -auto-alt-ref 0 -b:v 0 -crf 10 "${result.outPath}"`,
      });
    }
  }
}

await browser.close();

// Write FFmpeg encode commands
const encodeSh  = ffmpegCmds.map(c => `# ${c.label}\n${c.cmd}`).join('\n\n');
const encodeBat = ffmpegCmds.map(c => `rem ${c.label}\n${c.cmd}`).join('\n\n');
fs.writeFileSync(path.join(outDir, 'encode.sh'),  '#!/bin/bash\n\n' + encodeSh  + '\n');
fs.writeFileSync(path.join(outDir, 'encode.bat'), '@echo off\n\n'   + encodeBat + '\n');

console.log(`\n✓ Frames capturados → ${outDir}`);
console.log(`Encoda los WebM con:`);
console.log(`  Windows: ${path.join(outDir, 'encode.bat')}`);
console.log(`  Mac/Linux: bash ${path.join(outDir, 'encode.sh')}`);
