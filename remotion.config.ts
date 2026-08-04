import fs from 'fs';
import path from 'path';
import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);

// Use a locally installed Chrome Headless Shell (downloaded via
// `npm run setup:browser`) since Remotion's automatic download is blocked
// in THIS sandbox's network policy. On any other machine (e.g. a user's own
// PC with normal internet) this path won't exist, so we skip the override
// entirely and let Remotion download/detect a browser on its own -- setting
// a nonexistent browserExecutable makes every render fail outright.
const localChrome = path.join(
  process.cwd(),
  '.chrome/chrome-headless-shell/linux-131.0.6778.204/chrome-headless-shell-linux64/chrome-headless-shell',
);
if (fs.existsSync(localChrome)) {
  Config.setBrowserExecutable(localChrome);
}
