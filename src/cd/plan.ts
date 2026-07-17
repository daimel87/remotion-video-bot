import {cues} from '../data/cdCues';
import {photoSrc, videoSrc} from './assets';

type Accent = 'amber' | 'teal' | 'red' | 'paper';
export interface Shot {from: number; dur: number; src: string; video: boolean; motion: 'punchIn' | 'zoomIn' | 'zoomOut' | 'panLeft' | 'panRight';}
export interface StatDef {value?: number; display?: string; prefix?: string; suffix?: string; label?: string; decimals?: number; format?: 'plain' | 'comma'; accent?: Accent;}
export interface Overlay {from: number; dur: number; kind: 'title' | 'chapter' | 'stat' | 'chart'; pre?: string; text?: string; num?: number; stat?: StatDef; chart?: 'growth' | 'decline';}

const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

const RULES: [RegExp, string][] = [
  [/gualman|walkman/, 'walkman'],
  [/pmp300|rio pmp|reproductor mp3|mp3 portatil/, 'mp3-player'],
  [/dos reproductores|duplicar|grabadora|doble/, 'dual-cassette-deck'],
  [/casete|cassette/, 'cassette-tape'],
  [/beatles|elvis|michael jackson|led zeppelin|catalogo/, 'vinyl-collection'],
  [/vinilo/, 'vinyl-record'],
  [/laser/, 'cd-player-laser'],
  [/reproductor de cd|mil dolares|reproductor/, 'cd-player-vintage'],
  [/disco compacto|12 centimetros|aluminio|disco de 12/, 'cd-disc-macro'],
  [/japon/, 'tokyo-neon-night'],
  [/bach|brandenburg|orquesta|conciertos de/, 'orchestra-classical-music'],
  [/fraunhofer|von hofer|ingenieros|codec|compresion|mpeg|audio la/, 'computer-code-programming'],
  [/modem/, 'dial-up-modem'],
  [/napster/, 'downloading-progress-bar'],
  [/kazaa|limewire|lamb guire|morpheus|bit torrent|bittorrent/, 'hacker-typing'],
  [/descarga|compartir|archivos mp3|intercambia/, 'downloading-progress-bar'],
  [/servidor|escribiendo un programa|programa en su|codigo/, 'typing-code-computer'],
  [/internet|foros|red academica/, 'old-computer'],
  [/universidad|estudiante|boston|sotanos|geeks|sueco|daniel ek/, 'college-student-laptop'],
  [/riaa|tribunal|demand|judiciales|fallo|acuerdos|pleito/, 'courtroom'],
  [/335|nombres de|documentos/, 'legal-documents'],
  [/metallica|baterista|lars|ulrich/, 'rock-drummer'],
  [/oceano/, 'ocean-waves'],
  [/ipod/, 'ipod'],
  [/itunes|99 centavos|90 centavos|musica digital|cancion que querias|catalogos/, 'music-streaming-app'],
  [/iphone|telefono/, 'smartphone-music'],
  [/spotify|streaming/, 'streaming-music-phone'],
  [/rootkit|software spy|software espia|virus|vulnerable|investigador de seguridad|parche|sistema operativo|monitore/, 'computer-virus-code'],
  [/sony bmg|escandal/, 'cybersecurity-hacker'],
  [/tower|towel|banca rota|bancarrota|tiendas|sellos|estudios de grabacion|cerrad/, 'empty-retail-store'],
  [/irrelevante|basura|bargain|centavos la pieza/, 'cd-bargain-bin'],
  [/suscribete|memes|burlas|odio/, 'subscribe-social-media'],
  [/bodega|grabaciones maestras|relanzamiento|transferir|archivo/, 'warehouse-archive'],
  [/audifonos|oido/, 'headphones'],
  [/dinero|dolares|precio|pagar|premium|acuerdos|estafa|codicia|acudicia/, 'cash-money'],
  [/edad de oro|concierto|consumidores|gente|publico|masivamente/, 'concert-crowd'],
  [/estudio|grabacion/, 'recording-studio'],
];

// 'v:' = video
const POOLS: Record<string, string[]> = {
  'walkman': ['walkman', 'headphones-vintage', 'v:cassette-tape-playing', 'cassette-tape'],
  'cassette-tape': ['cassette-tape', 'dual-cassette-deck', 'audio-cassette-player', 'v:cassette-tape-playing', 'walkman'],
  'dual-cassette-deck': ['dual-cassette-deck', 'cassette-tape', 'v:cassette-tape-playing', 'audio-cassette-player'],
  'cd-disc': ['cd-disc', 'cd-disc-macro', 'compact-disc', 'stack-of-cds', 'v:compact-disc-spinning', 'v:cd-player-laser'],
  'cd-disc-macro': ['cd-disc-macro', 'compact-disc', 'cd-disc', 'v:compact-disc-spinning', 'v:cd-player-laser', 'stack-of-cds'],
  'cd-player-vintage': ['cd-player-vintage', 'hifi-stereo-system', 'stereo-system', 'cd-disc', 'v:cd-player-laser'],
  'cd-player-laser': ['v:cd-player-laser', 'cd-disc-macro', 'v:compact-disc-spinning', 'compact-disc'],
  'vinyl-record': ['vinyl-record', 'vinyl-collection', 'vinyl-record-player', 'turntable', 'v:vinyl-record-player-spinning', 'v:turntable-closeup'],
  'vinyl-collection': ['vinyl-collection', 'vinyl-record', 'record-store', 'v:record-store-browsing', 'turntable'],
  'orchestra-classical-music': ['orchestra-classical-music', 'recording-studio', 'audio-mixing-console'],
  'recording-studio': ['recording-studio', 'audio-mixing-console', 'reel-to-reel-tape', 'v:recording-studio'],
  'warehouse-archive': ['warehouse-archive', 'reel-to-reel-tape', 'vinyl-collection', 'stack-of-cds'],
  'cash-money': ['cash-money', 'coins', 'stock-market-screen'],
  'coins': ['coins', 'cash-money'],
  'tokyo-neon-night': ['tokyo-neon-night', 'stereo-system', 'hifi-stereo-system'],
  'headphones': ['headphones', 'headphones-vintage', 'v:headphones-music'],
  'computer-code-programming': ['computer-code-programming', 'v:typing-code-computer', 'old-computer', 'retro-computer-1990s'],
  'old-computer': ['old-computer', 'retro-computer-1990s', 'dial-up-modem', 'v:old-computer-screen'],
  'dial-up-modem': ['dial-up-modem', 'old-computer', 'retro-computer-1990s', 'v:old-computer-screen'],
  'college-student-laptop': ['college-student-laptop', 'university-library', 'old-computer', 'v:typing-code-computer'],
  'downloading-progress-bar': ['v:downloading-progress-bar', 'computer-code-programming', 'v:old-computer-screen', 'v:hacker-typing'],
  'typing-code-computer': ['v:typing-code-computer', 'computer-code-programming', 'v:hacker-typing', 'old-computer'],
  'hacker-typing': ['v:hacker-typing', 'computer-virus-code', 'v:typing-code-computer', 'cybersecurity-hacker'],
  'mp3-player': ['mp3-player', 'ipod', 'headphones'],
  'courtroom': ['courtroom', 'judge-gavel', 'legal-documents', 'v:courtroom'],
  'legal-documents': ['legal-documents', 'courtroom', 'judge-gavel'],
  'rock-drummer': ['rock-drummer', 'v:concert-crowd', 'concert-crowd'],
  'concert-crowd': ['v:concert-crowd', 'concert-crowd', 'rock-drummer'],
  'ocean-waves': ['v:ocean-waves'],
  'ipod': ['ipod', 'mp3-player', 'v:headphones-music', 'smartphone-music'],
  'music-streaming-app': ['music-streaming-app', 'smartphone-music', 'v:smartphone-scrolling-music', 'v:music-streaming-phone'],
  'smartphone-music': ['smartphone-music', 'music-streaming-app', 'v:smartphone-scrolling-music', 'streaming-music-phone'],
  'streaming-music-phone': ['streaming-music-phone', 'v:music-streaming-phone', 'v:smartphone-scrolling-music', 'smartphone-music', 'v:city-street-people-walking'],
  'computer-virus-code': ['computer-virus-code', 'v:hacker-typing', 'cybersecurity-hacker', 'v:typing-code-computer'],
  'cybersecurity-hacker': ['cybersecurity-hacker', 'computer-virus-code', 'v:hacker-typing'],
  'empty-retail-store': ['empty-retail-store', 'closed-store', 'record-store', 'v:record-store-browsing'],
  'cd-bargain-bin': ['cd-bargain-bin', 'broken-cd', 'stack-of-cds'],
  'subscribe-social-media': ['subscribe-social-media', 'concert-crowd', 'v:city-street-people-walking'],
};

const resolveBase = (text: string): string => {
  const t = norm(text);
  for (const [re, base] of RULES) if (re.test(t)) return base;
  return 'cd-disc';
};
const poolFor = (base: string): string[] => POOLS[base] ?? [base];

// Capítulos (por número de cue donde arrancan)
const CHAPTERS: {cue: number; num: number; title: string}[] = [
  {cue: 5, num: 1, title: 'El rey del casete'},
  {cue: 13, num: 2, title: 'El disco perfecto'},
  {cue: 27, num: 3, title: 'La mina de oro'},
  {cue: 38, num: 4, title: 'La rebelión'},
  {cue: 58, num: 5, title: 'Napster'},
  {cue: 88, num: 6, title: 'Apple lo cambia todo'},
  {cue: 117, num: 7, title: 'El lado oscuro'},
  {cue: 142, num: 8, title: 'El veredicto'},
];

// Cifras / gráficas (callouts numéricos)
const STATS: Record<number, StatDef> = {
  23: {value: 1000, prefix: '$', label: 'El primer reproductor'},
  43: {display: '40 MB → 4 MB', label: 'La misma canción'},
  65: {value: 25, suffix: ' M', label: 'usuarios en 12 meses'},
  66: {value: 80, suffix: ' M', label: 'usuarios', accent: 'red'},
  71: {value: 335000, format: 'comma', label: 'usuarios denunciados', accent: 'red'},
  90: {display: '1.000', label: 'canciones en tu bolsillo'},
  91: {value: 5, suffix: ' GB', label: 'de música'},
  97: {display: '$0.99', label: 'por canción'},
  103: {value: 200000, format: 'comma', label: 'canciones · día 1'},
  104: {value: 1000000, format: 'comma', label: 'en la 1ª semana'},
  112: {display: '-70%', label: 'en una década', accent: 'red'},
  129: {value: 22, suffix: ' M', label: 'CDs infectados', accent: 'red'},
  157: {display: '#1', label: 'fuente de ingresos', accent: 'teal'},
};
const CHARTS: Record<number, 'growth' | 'decline'> = {35: 'growth', 111: 'decline'};

export const buildPlan = (fps: number, total: number) => {
  const shots: Shot[] = [];
  const overlays: Overlay[] = [];
  const counter: Record<string, number> = {};
  const pick = (pool: string[], k: number) => {
    const token = pool[k % pool.length];
    const isV = token.startsWith('v:');
    const base = isV ? token.slice(2) : token;
    counter[base] = (counter[base] ?? 0) + 1;
    return {src: isV ? videoSrc(base, counter[base] - 1) : photoSrc(base, counter[base] - 1), video: isV};
  };
  const cutMotions: Shot['motion'][] = ['punchIn', 'zoomIn', 'punchIn', 'zoomOut', 'panRight', 'punchIn', 'panLeft'];

  const chapterByCue = new Map(CHAPTERS.map((c) => [c.cue, c]));

  cues.forEach((c, idx) => {
    const from = Math.round(c.start * fps);
    const to = idx < cues.length - 1 ? Math.round(cues[idx + 1].start * fps) : total;
    const dur = Math.max(1, to - from);
    const base = resolveBase(c.text);
    const pool = poolFor(base);
    const special = STATS[c.i] || CHARTS[c.i] || c.i === 4; // cue 4 = título

    if (special) {
      const b = pick(pool, 0);
      shots.push({from, dur, ...b, motion: 'zoomIn'});
    } else {
      const target = 2.1 * fps;
      const n = Math.max(1, Math.round(dur / target));
      for (let k = 0; k < n; k++) {
        const sFrom = from + Math.round((k * dur) / n);
        const sTo = from + Math.round(((k + 1) * dur) / n);
        shots.push({from: sFrom, dur: Math.max(1, sTo - sFrom), ...pick(pool, k), motion: cutMotions[(idx + k) % cutMotions.length]});
      }
    }

    // Overlays
    if (c.i === 4) overlays.push({from, dur, kind: 'title', pre: 'la historia real del', text: 'CD'});
    if (chapterByCue.has(c.i)) {
      const ch = chapterByCue.get(c.i)!;
      overlays.push({from, dur: Math.round(fps * 2.3), kind: 'chapter', num: ch.num, text: ch.title});
    }
    if (STATS[c.i]) overlays.push({from, dur, kind: 'stat', stat: STATS[c.i]});
    if (CHARTS[c.i]) overlays.push({from, dur, kind: 'chart', chart: CHARTS[c.i]});
  });

  return {shots, overlays};
};
