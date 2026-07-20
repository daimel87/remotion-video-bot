// Perfect VFX renderer bootstrap. Plain Node, zero dependencies.
// Silent, idempotent, self-healing: safe to run before every render.
//   node setup.mjs
// Verifies Node 18+, ffmpeg + ffprobe on PATH, installs npm dependencies only
// when missing or stale, and pre-downloads the Remotion headless browser so
// the first render never stalls. Prints exactly one line on success. All
// sub-step output is captured and discarded unless that step fails.
import {spawnSync} from 'node:child_process';
import {existsSync, statSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = dirname(fileURLToPath(import.meta.url));

function fail(step, detail) {
  process.stderr.write(`Perfect VFX setup failed at: ${step}\n`);
  if (detail && detail.trim()) process.stderr.write(detail.trim() + '\n');
  process.exit(1);
}

// Run a command silently; return {ok, output}. Never inherits stdio.
function run(cmd) {
  const r = spawnSync(cmd, {
    cwd: ROOT,
    shell: true, // resolves npm.cmd / npx.cmd on Windows, sh elsewhere
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    windowsHide: true,
    maxBuffer: 32 * 1024 * 1024,
  });
  const output = `${r.stdout ?? ''}${r.stderr ?? ''}`;
  return {ok: r.status === 0 && !r.error, output};
}

// 1. Node version -----------------------------------------------------------
const major = Number(process.versions.node.split('.')[0]);
if (!Number.isFinite(major) || major < 18) {
  fail('Node version check', `Node 18+ required, found ${process.versions.node}. Install the current LTS from https://nodejs.org`);
}

// 2. ffmpeg + ffprobe -------------------------------------------------------
const FFMPEG_HINT =
  process.platform === 'win32'
    ? 'winget install Gyan.FFmpeg   (then open a new terminal)'
    : process.platform === 'darwin'
      ? 'brew install ffmpeg'
      : 'sudo apt install ffmpeg   (or your distro\'s package manager)';

let toolMissing = false;
for (const tool of ['ffmpeg', 'ffprobe']) {
  if (!run(`${tool} -version`).ok) {
    process.stderr.write(`${tool} not found on PATH. Install it: ${FFMPEG_HINT}\n`);
    toolMissing = true;
  }
}
if (toolMissing) process.exit(1);

// 3. npm dependencies (only when missing or stale) ---------------------------
const nodeModules = join(ROOT, 'node_modules');
const pkgJson = join(ROOT, 'package.json');
let needInstall = !existsSync(nodeModules);
if (!needInstall) {
  try {
    needInstall = statSync(pkgJson).mtimeMs > statSync(nodeModules).mtimeMs;
  } catch {
    needInstall = true;
  }
}
if (needInstall) {
  const r = run('npm install --no-fund --no-audit --loglevel=error');
  if (!r.ok) fail('npm install', r.output);
}

// 4. Remotion headless browser ----------------------------------------------
const browser = run('npx remotion browser ensure --log=error');
if (!browser.ok) fail('remotion browser ensure', browser.output);

process.stdout.write('Perfect VFX renderer ready.\n');
