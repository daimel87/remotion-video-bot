import path from 'path';
import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('png');
Config.setOverwriteOutput(true);

// Use a locally installed Chrome Headless Shell (downloaded via
// `npm run setup:browser`) since Remotion's automatic download
// is blocked in this environment's network sandbox.
const localChrome = path.join(
  process.cwd(),
  '.chrome/chrome-headless-shell/linux-131.0.6778.204/chrome-headless-shell-linux64/chrome-headless-shell',
);
Config.setBrowserExecutable(localChrome);
