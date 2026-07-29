import {bundle} from '@remotion/bundler';
import {renderMedia, selectComposition} from '@remotion/renderer';
import path from 'path';
import fs from 'fs';

const projectRoot = '/home/user/remotion-video-bot';
process.chdir(projectRoot);

const localChrome = path.join(
  projectRoot,
  '.chrome/chrome-headless-shell/linux-131.0.6778.204/chrome-headless-shell-linux64/chrome-headless-shell',
);
const chrome = fs.existsSync(localChrome) ? localChrome : undefined;

const log = (msg) => {
  fs.appendFileSync('/tmp/papa-scenes-render.log', `[${new Date().toISOString()}] ${msg}\n`);
};

// Bundle cacheado: si ya existe de un lanzamiento previo, se reutiliza para no
// perder ~30s rebundleando en cada relanzamiento (el contenedor se reinicia
// seguido y mata el proceso).
const BUNDLE_DIR = path.join(projectRoot, 'out/papa-bundle');

const main = async () => {
  let bundled;
  if (fs.existsSync(path.join(BUNDLE_DIR, 'index.html'))) {
    bundled = BUNDLE_DIR;
    log('Reusing cached bundle: ' + bundled);
  } else {
    log('Bundling...');
    bundled = await bundle({
      entryPoint: path.join(projectRoot, 'src/index.ts'),
      outDir: BUNDLE_DIR,
    });
    log('Bundle done: ' + bundled);
  }

  const composition = await selectComposition({
    serveUrl: bundled,
    id: 'PapaHistoriaFull',
    browserExecutable: chrome,
  });
  log('Composition selected.');

  const outDir = path.join(projectRoot, 'out/papa-scenes');
  fs.mkdirSync(outDir, {recursive: true});

  for (let i = 1; i <= 94; i++) {
    const n = String(i).padStart(2, '0');
    const outPath = path.join(outDir, `${n}.mp4`);
    if (fs.existsSync(outPath)) continue;
    const start = (i - 1) * 150;
    const end = start + 149;
    log(`RENDER scene ${n}: frames ${start}-${end}`);
    const tmpPath = path.join(outDir, `${n}.part.mp4`);
    try {
      await renderMedia({
        composition,
        serveUrl: bundled,
        codec: 'h264',
        outputLocation: tmpPath,
        frameRange: [start, end],
        concurrency: 4,
        browserExecutable: chrome,
      });
      fs.renameSync(tmpPath, outPath);
      log(`DONE scene ${n}`);
    } catch (e) {
      log(`FAILED scene ${n}: ${e.message}`);
      if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
    }
  }
  log('ALL SCENES DONE');
};

main().catch((e) => {
  log('FATAL: ' + (e.stack || e.message));
  process.exit(1);
});
