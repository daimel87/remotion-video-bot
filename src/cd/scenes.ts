import {cues} from '../data/cdCues';
import {photoSrc, videoSrc} from './assets';

type Motion = 'zoomIn' | 'zoomOut' | 'panLeft' | 'panRight' | 'punchIn' | 'static';
interface Stat {value: number; prefix?: string; suffix?: string; label?: string; decimals?: number; format?: 'plain' | 'comma';}

export interface Scene {
  i: number; from: number; durationInFrames: number;
  bg: string; video: boolean; motion: Motion;
  headline?: string; sub?: string; tag?: string; card?: boolean;
  accent?: 'red' | 'gold' | 'white'; stat?: Stat; chart?: 'growth' | 'decline';
  emphasis?: string[]; caption: boolean; text: string;
}

const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

// Resolución por palabra clave -> base de foto (primer match gana)
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
const VIDEO_BASES = new Set([
  'cd-player-laser', 'downloading-progress-bar', 'hacker-typing', 'typing-code-computer',
  'ocean-waves',
]);

const resolveBase = (text: string): string => {
  const t = norm(text);
  for (const [re, base] of RULES) if (re.test(t)) return base;
  return 'cd-disc';
};

// Overrides de alto impacto por número de cue
type OV = Partial<{
  b: string; v: string; m: Motion; h: string; s: string; t: string; card: boolean;
  a: 'red' | 'gold' | 'white'; stat: Stat; chart: 'growth' | 'decline'; em: string[];
}>;
const OVR: Record<number, OV> = {
  1: {v: 'compact-disc-spinning', h: '1988', a: 'gold', em: ['más copias', 'un solo día']},
  2: {v: 'cassette-tape-playing', em: ['matado', 'competidor']},
  3: {b: 'broken-cd', a: 'red', em: ['no murió', 'rentable', 'matarlo']},
  4: {b: 'cd-disc-macro', card: true, h: 'La historia real del CD', s: 'Lo que no te contaron', a: 'red'},
  5: {b: 'cassette-tape', t: '1979', em: ['rey absoluto']},
  6: {b: 'walkman', t: 'Walkman', em: ['por primera vez']},
  7: {b: 'dual-cassette-deck', em: ['se podía copiar']},
  8: {v: 'cassette-tape-playing', em: ['álbum completo']},
  9: {b: 'dual-cassette-deck', h: 'Piratería doméstica', a: 'red'},
  10: {b: 'legal-documents', em: ['ilegalizar']},
  11: {card: true, h: 'No funcionó', a: 'white'},
  12: {b: 'cd-disc-macro', em: ['no se podía copiar']},
  13: {b: 'audio-mixing-console', t: '1979', h: 'Sony + Philips', em: ['futuro del audio']},
  14: {b: 'cd-disc-macro', h: '12 cm', s: 'plástico y aluminio', a: 'gold'},
  15: {v: 'cd-player-laser', em: ['láser', 'sin desgaste', 'sin deterioro']},
  16: {b: 'cd-disc-macro', em: ['perfecta', 'no se podía copiar']},
  17: {b: 'cd-disc', t: '1982'},
  18: {b: 'tokyo-neon-night', t: '17 AGO 1982', em: ['Japón']},
  19: {b: 'orchestra-classical-music'},
  20: {b: 'orchestra-classical-music'},
  22: {b: 'cd-disc-macro', m: 'punchIn', h: 'El futuro', a: 'gold'},
  23: {b: 'cd-player-vintage', stat: {value: 1000, prefix: '$', label: 'El primer reproductor'}},
  24: {b: 'cash-money', em: ['15', '25', '8 dólares']},
  26: {b: 'cash-money', em: ['misma música']},
  27: {b: 'warehouse-archive', em: ['no sabe']},
  28: {b: 'warehouse-archive', em: ['grabaciones maestras']},
  29: {b: 'vinyl-collection', em: ['Beatles', 'Elvis', 'Michael', 'Led']},
  25: {b: 'cd-player-vintage', em: ['caro', 'exclusivo']},
  30: {b: 'vinyl-record', em: ['millones de veces']},
  31: {b: 'cd-disc', em: ['otra vez']},
  32: {b: 'cash-money', h: 'Otra vez', a: 'red'},
  33: {b: 'recording-studio'},
  34: {b: 'stack-of-cds', em: ['mayor negocio']},
  35: {chart: 'growth', t: '1983 → 1998'},
  36: {b: 'concert-crowd', em: ['edad de oro']},
  37: {b: 'college-student-laptop', em: ['sótanos', 'universidades']},
  38: {b: 'computer-code-programming', t: '1987', em: ['ingenieros', 'compresión']},
  39: {b: 'computer-code-programming'},
  40: {card: true, h: 'MP3', a: 'gold'},
  41: {v: 'downloading-progress-bar', em: ['fracción']},
  42: {b: 'headphones', em: ['ninguna diferencia']},
  43: {b: 'cd-disc-macro', h: '40 MB → 4 MB', a: 'gold'},
  44: {b: 'old-computer', t: '1991', em: ['nadie', 'atención']},
  45: {card: true, h: 'Error histórico', a: 'red'},
  46: {b: 'dial-up-modem', t: '1993', em: ['lentas']},
  47: {v: 'old-computer-screen', em: ['horas']},
  48: {v: 'downloading-progress-bar', em: ['lentamente', 'ilegalmente', 'imparablemente']},
  49: {b: 'stack-of-cds', em: ['máximos']},
  50: {b: 'college-student-laptop', em: ['geeks']},
  51: {b: 'mp3-player', t: '1997', h: 'Rio PMP300', s: 'primer MP3 portátil'},
  52: {b: 'mp3-player', em: ['legal']},
  53: {b: 'courtroom', em: ['demandó']},
  54: {b: 'legal-documents', em: ['RIAA', 'piratería']},
  55: {b: 'judge-gavel', h: 'La RIAA perdió', a: 'gold'},
  56: {b: 'mp3-player', em: ['éxito']},
  57: {b: 'courtroom', em: ['batalla equivocada']},
  58: {b: 'college-student-laptop', h: 'Shawn Fanning'},
  59: {b: 'college-student-laptop', t: '1999', em: ['19 años', 'Boston']},
  60: {v: 'typing-code-computer', em: ['programa']},
  61: {card: true, h: 'Napster', a: 'red'},
  62: {v: 'downloading-progress-bar', em: ['compartir', 'directamente']},
  63: {v: 'typing-code-computer', em: ['sin servidor', 'sin pago', 'sin permiso']},
  64: {v: 'old-computer-screen', t: 'JUN 1999'},
  65: {b: 'college-student-laptop', stat: {value: 25, suffix: ' M', label: 'usuarios en 12 meses'}},
  66: {b: 'concert-crowd', stat: {value: 80, suffix: ' M', label: 'usuarios', }, a: 'red'},
  67: {v: 'stock-market-chart', em: ['más rápido']},
  68: {v: 'downloading-progress-bar', em: ['sin pagar', 'centavo']},
  69: {b: 'courtroom', t: 'DIC 1999', em: ['pánico', 'demandaron']},
  70: {b: 'rock-drummer', h: 'Lars Ulrich', s: 'Metallica'},
  71: {b: 'legal-documents', stat: {value: 335000, format: 'comma', label: 'usuarios denunciados'}, a: 'red'},
  72: {b: 'concert-crowd'},
  73: {b: 'subscribe-social-media', em: ['memes', 'burlas', 'odio']},
  74: {b: 'rock-drummer', em: ['razón']},
  75: {b: 'courtroom', em: ['error', 'profundo']},
  76: {b: 'cash-money', h: '3 veces', s: 'la misma música', a: 'gold'},
  77: {b: 'vinyl-record', em: ['Vinilo', 'casete', 'CD']},
  78: {b: 'cash-money', em: ['más altos']},
  79: {b: 'concert-crowd', em: ['salida']},
  80: {card: true, h: 'Venganza del mercado', a: 'red'},
  81: {b: 'courtroom', t: '2001', em: ['cerrar']},
  82: {b: 'judge-gavel'},
  83: {card: true, h: 'Nada cambió', a: 'white'},
  84: {v: 'downloading-progress-bar'},
  85: {v: 'hacker-typing', em: ['Kazaa', 'LimeWire', 'Morpheus', 'BitTorrent']},
  86: {v: 'ocean-waves', em: ['océano', 'manos']},
  87: {b: 'courtroom', em: ['guerra']},
  88: {b: 'ipod', t: 'OCT 2001'},
  89: {b: 'ipod', em: ['Steve Jobs']},
  90: {card: true, h: '1.000 canciones en tu bolsillo', a: 'gold'},
  91: {b: 'ipod', stat: {value: 5, suffix: ' GB', label: 'de música'}},
  92: {b: 'ipod', em: ['perfecto']},
  93: {b: 'ipod', em: ['no fue el iPod']},
  94: {card: true, h: 'Fue lo que vino después', a: 'white'},
  95: {b: 'music-streaming-app', t: 'ABR 2003', h: 'iTunes Store'},
  96: {b: 'smartphone-music', em: ['legalmente']},
  97: {b: 'music-streaming-app', h: '$0.99', s: 'por canción', a: 'gold'},
  98: {b: 'music-streaming-app', em: ['la canción que querías']},
  99: {b: 'cash-money', em: ['15 dólares']},
  100: {b: 'ipod'},
  101: {b: 'ipod', h: 'A $0.99 o nada', a: 'red'},
  102: {card: true, h: 'Cedieron', a: 'white'},
  103: {b: 'music-streaming-app', stat: {value: 200000, format: 'comma', label: 'canciones · día 1'}},
  104: {b: 'music-streaming-app', stat: {value: 1000000, format: 'comma', label: 'en la 1ª semana'}},
  105: {b: 'cd-disc', em: ['no quiere que recuerdes']},
  106: {b: 'cd-disc', em: ['mal menor']},
  107: {b: 'cash-money', em: ['subir los precios']},
  108: {b: 'cd-player-vintage', em: ['premium']},
  109: {b: 'vinyl-collection'},
  110: {card: true, h: 'Se equivocaron', a: 'red'},
  111: {chart: 'decline', t: '2000 → 2010'},
  112: {b: 'declining-graph', h: '-70%', s: 'en una década', a: 'red'},
  113: {b: 'empty-retail-store', em: ['cerrados', 'quebrados', 'desaparecidas']},
  114: {b: 'empty-retail-store', t: '2006', h: 'Tower Records', s: 'Bancarrota'},
  115: {b: 'closed-store', em: ['500 tiendas', '3', '30 años']},
  116: {b: 'closed-store', em: ['en meses']},
  117: {b: 'cd-disc', em: ['nadie te cuenta']},
  118: {b: 'computer-virus-code', em: ['no fue la única causa']},
  119: {card: true, h: 'Algo más oscuro', a: 'red'},
  120: {b: 'cd-disc', t: '2005', em: ['Sony BMG']},
  121: {b: 'cybersecurity-hacker', em: ['escandalizó']},
  122: {b: 'computer-virus-code', h: 'Software espía', a: 'red'},
  123: {b: 'cd-disc', em: ['tu computadora']},
  124: {b: 'computer-virus-code', h: 'Rootkit', a: 'red'},
  125: {v: 'hacker-typing', em: ['se ocultaba']},
  126: {b: 'cybersecurity-hacker', em: ['monitoreaba']},
  127: {b: 'computer-virus-code', em: ['vulnerable']},
  128: {v: 'hacker-typing', em: ['sin permiso']},
  129: {b: 'computer-virus-code', stat: {value: 22, suffix: ' M', label: 'CDs infectados'}, a: 'red'},
  130: {b: 'cybersecurity-hacker'},
  131: {b: 'legal-documents', em: ['lo negó', 'inofensivo']},
  132: {b: 'legal-documents', em: ['evidencia irrefutable']},
  133: {b: 'computer-virus-code', em: ['vulnerabilidades']},
  134: {b: 'courtroom', em: ['demandas colectivas']},
  135: {b: 'legal-documents'},
  136: {b: 'cash-money', em: ['millones']},
  137: {b: 'broken-cd', em: ['nunca se recuperó']},
  138: {b: 'smartphone-music', t: '2007', em: ['iPhone']},
  139: {b: 'smartphone-music', em: ['un iPod con teléfono']},
  140: {b: 'ipod', em: ['desapareció']},
  141: {b: 'cd-disc'},
  142: {b: 'streaming-music-phone', h: 'Streaming', a: 'gold'},
  143: {b: 'college-student-laptop', t: '2006', h: 'Daniel Ek'},
  144: {v: 'downloading-progress-bar'},
  145: {b: 'smartphone-music'},
  146: {b: 'streaming-music-phone'},
  147: {card: true, h: 'Spotify', a: 'gold'},
  148: {b: 'music-streaming-app', t: '2008 · 2011'},
  149: {b: 'streaming-music-phone', em: ['toda la música']},
  150: {v: 'smartphone-scrolling-music', em: ['gratis', '10 dólares']},
  151: {b: 'streaming-music-phone', em: ['sin descargas', 'sin archivos']},
  152: {v: 'city-street-people-walking'},
  153: {b: 'music-streaming-app', em: ['firmaron con Spotify']},
  154: {b: 'smartphone-music', em: ['lección de iTunes']},
  155: {v: 'stock-market-chart'},
  156: {v: 'stock-market-chart', t: '2012', em: ['superaron']},
  157: {b: 'streaming-music-phone', t: '2015', h: 'Streaming #1', a: 'gold'},
  158: {b: 'cd-bargain-bin', em: ['irrelevante']},
  159: {card: true, h: '¿Por qué desapareció el CD?', a: 'red'},
  160: {b: 'cd-disc', em: ['no fue solo']},
  161: {b: 'courtroom', h: '20 años', s: 'clientes como criminales', a: 'red'},
  162: {b: 'cd-disc', em: ['canciones malas']},
  163: {b: 'computer-virus-code', em: ['software spy', 'adolescentes']},
  164: {b: 'streaming-music-phone', em: ['alternativa']},
  165: {b: 'smartphone-music', em: ['piratería', 'iTunes', 'Spotify']},
  166: {b: 'streaming-music-phone', em: ['perfectas']},
  167: {b: 'cash-money', em: ['estafando']},
  168: {b: 'broken-cd', h: 'Codicia', s: 'no la tecnología', a: 'red'},
  169: {b: 'subscribe-social-media', em: ['suscríbete']},
  170: {b: 'subscribe-social-media', em: ['historias ocultas']},
  171: {card: true, h: 'Esto apenas empieza', a: 'gold'},
};

const MOTIONS: Motion[] = ['zoomIn', 'panRight', 'zoomOut', 'panLeft'];

export const buildScenes = (fps: number): Scene[] => {
  const counter: Record<string, number> = {};
  const next = (base: string) => {
    counter[base] = (counter[base] ?? 0) + 1;
    return counter[base] - 1;
  };
  return cues.map((c, idx) => {
    const ov = OVR[c.i] ?? {};
    let video = false;
    let bg = '';
    if (ov.v) {video = true; bg = videoSrc(ov.v, next(ov.v));}
    else if (ov.b) {bg = photoSrc(ov.b, next(ov.b));}
    else {
      const base = resolveBase(c.text);
      if (VIDEO_BASES.has(base)) {video = true; bg = videoSrc(base, next(base));}
      else {bg = photoSrc(base, next(base));}
    }
    const motion: Motion = ov.m ?? (ov.h ? 'punchIn' : MOTIONS[idx % MOTIONS.length]);
    const hasBlockOverlay = Boolean(ov.card || ov.stat || ov.chart);
    return {
      i: c.i,
      from: Math.round(c.start * fps),
      durationInFrames: Math.max(1, Math.round((c.end - c.start) * fps)),
      bg, video, motion,
      headline: ov.h, sub: ov.s, tag: ov.t, card: ov.card, accent: ov.a,
      stat: ov.stat, chart: ov.chart, emphasis: ov.em,
      caption: !hasBlockOverlay,
      text: c.text,
    };
  });
};
