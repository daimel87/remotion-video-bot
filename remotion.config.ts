import path from 'path';
import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
// El proxy del sandbox reescribe el TLS de fonts.gstatic.com y el navegador
// headless rechaza el certificado. Permitimos cargar las fuentes de marca.
Config.setChromiumIgnoreCertificateErrors(true);

// Use a locally installed Chrome Headless Shell (downloaded via
// `npm run setup:browser`) since Remotion's automatic download
// is blocked in this environment's network sandbox.
const localChrome = path.join(
  process.cwd(),
  '.chrome/chrome-headless-shell/linux-131.0.6778.204/chrome-headless-shell-linux64/chrome-headless-shell',
);
Config.setBrowserExecutable(localChrome);
