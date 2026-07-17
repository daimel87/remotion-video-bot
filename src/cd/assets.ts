import {staticFile} from 'remotion';

// Cantidad de variantes por cada base de FOTO (según lo descargado)
const PHOTO_POOL: Record<string, number> = {
  'audio-cassette-player': 4, 'audio-mixing-console': 4, 'broken-cd': 4, 'cash-money': 4,
  'cassette-tape': 5, 'cd-bargain-bin': 4, 'cd-disc': 5, 'cd-disc-macro': 4,
  'cd-player-vintage': 4, 'closed-store': 4, 'coins': 4, 'college-student-laptop': 4,
  'compact-disc': 5, 'computer-code-programming': 4, 'computer-virus-code': 4,
  'concert-crowd': 4, 'courtroom': 4, 'cybersecurity-hacker': 4, 'declining-graph': 4,
  'dial-up-modem': 4, 'dual-cassette-deck': 4, 'empty-retail-store': 4,
  'financial-growth-chart': 4, 'headphones': 4, 'headphones-vintage': 5,
  'hifi-stereo-system': 4, 'ipod': 4, 'judge-gavel': 4, 'legal-documents': 4,
  'mp3-player': 4, 'music-store': 5, 'music-streaming-app': 4, 'old-computer': 4,
  'orchestra-classical-music': 4, 'record-store': 4, 'recording-studio': 4,
  'reel-to-reel-tape': 4, 'retro-computer-1990s': 4, 'retro-technology': 5,
  'rock-drummer': 4, 'smartphone-music': 4, 'stack-of-cds': 4, 'stereo-system': 5,
  'stock-market-screen': 4, 'streaming-music-phone': 5, 'subscribe-social-media': 4,
  'thrift-store': 4, 'tokyo-neon-night': 4, 'turntable': 4, 'vinyl-collection': 4,
  'vinyl-record': 5, 'vinyl-record-player': 4, 'walkman': 5, 'warehouse-archive': 4,
};
// university-library empieza en 2 (no hay -1)
const PHOTO_START: Record<string, number> = {'university-library': 2};
const PHOTO_POOL2: Record<string, number> = {'university-library': 4};

// Videos disponibles (base -> cantidad)
const VIDEO_POOL: Record<string, number> = {
  'cassette-tape': 3, 'cassette-tape-playing': 2, 'cd-player-laser': 2,
  'city-street-people-walking': 2, 'compact-disc': 3, 'compact-disc-spinning': 2,
  'concert-crowd': 2, 'courtroom': 2, 'downloading-progress-bar': 2, 'hacker-typing': 2,
  'headphones-music': 3, 'music-streaming': 3, 'music-streaming-phone': 2,
  'ocean-waves': 1, 'old-computer-screen': 2, 'record-store-browsing': 2,
  'recording-studio': 2, 'retro-technology': 3, 'smartphone-scrolling-music': 2,
  'stock-market-chart': 2, 'turntable-closeup': 2, 'typing-code-computer': 2,
  'vinyl-record-player': 3, 'vinyl-record-player-spinning': 2,
};

export const photoSrc = (base: string, n: number) => {
  const start = PHOTO_START[base] ?? 1;
  const count = (base in PHOTO_POOL2 ? PHOTO_POOL2[base] : PHOTO_POOL[base]) ?? 1;
  const idx = start + (n % count);
  return staticFile(`stock/photos/${base}-${idx}.jpg`);
};

export const videoSrc = (base: string, n: number) => {
  const count = VIDEO_POOL[base] ?? 1;
  const idx = 1 + (n % count);
  return staticFile(`stock/videos/${base}-${idx}.mp4`);
};

export const hasPhoto = (base: string) => base in PHOTO_POOL || base in PHOTO_POOL2;
export const hasVideo = (base: string) => base in VIDEO_POOL;
