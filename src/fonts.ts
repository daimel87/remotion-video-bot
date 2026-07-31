// Carga Playfair Display auto-hospedada (public/fonts/) en vez de tirar de
// Google Fonts en tiempo de render -- mismo look tipografico pero sin
// depender de una red externa (mas robusto en cualquier maquina/proxy).
import {continueRender, delayRender, staticFile} from 'remotion';

let started = false;

export function ensurePlayfairLoaded(): void {
  if (started) return;
  started = true;
  const handle = delayRender('Loading Playfair Display (self-hosted)');
  const specs: Array<{weight: string; style: string; file: string}> = [
    {weight: '700', style: 'normal', file: 'PlayfairDisplay-700.ttf'},
    {weight: '800', style: 'normal', file: 'PlayfairDisplay-800.ttf'},
    {weight: '500', style: 'italic', file: 'PlayfairDisplay-500Italic.ttf'},
  ];
  Promise.all(
    specs.map(({weight, style, file}) =>
      new FontFace('Playfair Display', `url(${staticFile(`fonts/${file}`)})`, {
        weight,
        style,
      }).load(),
    ),
  )
    .then((fonts) => {
      fonts.forEach((f) => (document.fonts as unknown as Set<FontFace>).add(f));
      continueRender(handle);
    })
    .catch(() => continueRender(handle));
}
