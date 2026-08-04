#!/usr/bin/env node
/**
 * Lee output/transcripcion.json (salida de transcribe.py) y genera
 * output/keywords.json: agrupa los segmentos en bloques de ~5-8s y extrae
 * 2-4 keywords en INGLES por bloque, para buscar en Pexels/Pixabay (que
 * funcionan mucho mejor en ingles que en español).
 *
 * 100% local, SIN llamar a ninguna API externa (ni de traduccion ni de IA):
 *   1. compromise.terms() tokeniza el texto (funciona para cualquier idioma,
 *      a diferencia de compromise.nouns()/.people(), que asumen gramatica
 *      inglesa y fallan en español -- ver nota abajo).
 *   2. Se filtran stopwords en español y se buscan las palabras restantes
 *      en un diccionario ES->EN curado a mano (DICCIONARIO abajo).
 *   3. Adjetivo+sustantivo consecutivos que esten ambos en el diccionario
 *      se combinan invirtiendo el orden ("casa vieja" -> "old house").
 *
 * LIMITACION CONOCIDA: la calidad depende de cuantas palabras del guion
 * esten en el diccionario. Nombres propios (personas, lugares) que no esten
 * mapeados se dejan tal cual (a veces sirve igual como busqueda, a veces
 * no aporta resultados) -- no hay forma de traducir nombres propios sin una
 * API. Si la cobertura no alcanza para un guion muy tecnico/especifico, hay
 * que sumar terminos al diccionario (ver PLAN.md, nota final sobre usar
 * `claude -p` como upgrade opcional de pago).
 *
 * Uso:
 *   node scripts/generar-keywords.mjs [output/transcripcion.json] [output/keywords.json]
 */
import fs from 'node:fs';
import path from 'node:path';
import nlp from 'compromise';

const IN = process.argv[2] || path.join('output', 'transcripcion.json');
const OUT = process.argv[3] || path.join('output', 'keywords.json');
const MIN_BLOCK_SEC = 5;
const MAX_BLOCK_SEC = 8;

// ============================================================
// Stopwords en español (articulos, preposiciones, conectores, pronombres,
// verbos auxiliares muy comunes). No pretende ser exhaustivo, alcanza para
// filtrar el ruido gramatical de una narracion tipica.
// ============================================================
const STOPWORDS = new Set(`
el la los las un una unos unas de del al a en y o u que se su sus lo le les
por para con sin sobre entre hasta desde durante mediante segun contra
como cuando donde quien cuyo cuyos cual cuales
es son fue fueron era eran ser estar esta estan estaba estaban seria serian
ha han he has hemos habia habian habra habran hay habia
no ni tampoco tambien mas menos muy tan tanto poco mucho todo toda todos todas
este esta estos estas ese esa esos esas aquel aquella aquellos aquellas
mi tu su nuestro vuestro mio tuyo suyo nuestra
yo tu el ella nosotros vosotros ellos ellas usted ustedes me te nos os
pero aunque porque pues ya solo solamente asi entonces luego ademas incluso
sin embargo mientras tanto dentro fuera arriba abajo aqui alli ahi
uno dos tres primera primer segunda segundo tercera tercero
`.split(/\s+/).filter(Boolean));

// ============================================================
// Diccionario ES -> EN curado (sustantivos, adjetivos, gerundios comunes en
// narracion documental/historica/salud/tecnologia). Ampliar segun el nicho
// del canal -- es la parte que mas conviene revisar tras la primera prueba
// real con un guion propio.
// ============================================================
const DICCIONARIO = {
  // --- naturaleza / paisaje ---
  mar: 'ocean', oceano: 'ocean', playa: 'beach', isla: 'island', montaña: 'mountain',
  montañas: 'mountains', rio: 'river', bosque: 'forest', selva: 'jungle', desierto: 'desert',
  cielo: 'sky', estrellas: 'stars', luna: 'moon', sol: 'sun', tormenta: 'storm',
  volcan: 'volcano', costa: 'coast', roca: 'rock', rocas: 'rocks', cueva: 'cave',
  agua: 'water', fuego: 'fire', viento: 'wind', lluvia: 'rain', nieve: 'snow',
  amanecer: 'sunrise', atardecer: 'sunset', horizonte: 'horizon', olas: 'waves',

  // --- ciudad / arquitectura ---
  ciudad: 'city', pueblo: 'village', casa: 'house', edificio: 'building',
  templo: 'temple', ruinas: 'ruins', castillo: 'castle', puente: 'bridge',
  calle: 'street', mercado: 'market', puerto: 'harbor', muralla: 'wall',
  torre: 'tower', palacio: 'palace',

  // --- personas / cuerpo ---
  hombre: 'man', mujer: 'woman', niño: 'child', niña: 'child', anciano: 'elderly man',
  guerrero: 'warrior', soldado: 'soldier', rey: 'king', reina: 'queen', heroe: 'hero',
  poeta: 'poet', cientifico: 'scientist', medico: 'doctor', doctor: 'doctor',
  familia: 'family', multitud: 'crowd', silueta: 'silhouette', manos: 'hands',
  rostro: 'face', ojos: 'eyes', corazon: 'heart', cerebro: 'brain', cuerpo: 'body',

  // --- historia / mitologia ---
  guerra: 'war', batalla: 'battle', barco: 'ship', nave: 'ship', espada: 'sword',
  escudo: 'shield', mapa: 'map', tesoro: 'treasure', tumba: 'tomb', estatua: 'statue',
  manuscrito: 'manuscript', pergamino: 'scroll', libro: 'book', imperio: 'empire',
  dios: 'god', diosa: 'goddess', monstruo: 'monster', mito: 'myth', leyenda: 'legend',
  antiguo: 'ancient', antigua: 'ancient', clasico: 'classical',

  // --- ciencia / tecnologia ---
  computadora: 'computer', ordenador: 'computer', pantalla: 'screen', codigo: 'code',
  robot: 'robot', maquina: 'machine', television: 'television', radio: 'radio',
  telefono: 'phone', internet: 'internet', laboratorio: 'laboratory', microscopio: 'microscope',
  invento: 'invention', inventor: 'inventor', ingeniero: 'engineer', tecnologia: 'technology',

  // --- salud / cocina ---
  comida: 'food', cocina: 'kitchen', receta: 'recipe', fruta: 'fruit', verdura: 'vegetable',
  vitamina: 'vitamin', ejercicio: 'exercise', salud: 'health', medicina: 'medicine',
  hospital: 'hospital', enfermedad: 'disease', energia: 'energy', dieta: 'diet',

  // --- emociones / abstracto (para b-roll conceptual) ---
  miedo: 'fear', esperanza: 'hope', tristeza: 'sadness', felicidad: 'happiness',
  soledad: 'loneliness', libertad: 'freedom', poder: 'power', dinero: 'money',
  tiempo: 'time', futuro: 'future', pasado: 'past', misterio: 'mystery',
  descubrimiento: 'discovery', secreto: 'secret', verdad: 'truth', mentira: 'lie',

  // --- adjetivos comunes ---
  grande: 'big', pequeño: 'small', pequeña: 'small', viejo: 'old', vieja: 'old',
  nuevo: 'new', nueva: 'new', oscuro: 'dark', oscura: 'dark', brillante: 'bright',
  hermoso: 'beautiful', hermosa: 'beautiful', peligroso: 'dangerous', peligrosa: 'dangerous',
  rapido: 'fast', lento: 'slow', fuerte: 'strong', debil: 'weak', profundo: 'deep',
  profunda: 'deep', dorado: 'golden', dorada: 'golden', dramatico: 'dramatic',
  epico: 'epic', epica: 'epic', real: 'real', falso: 'fake',

  // --- gerundios / acciones visuales ---
  caminando: 'walking', corriendo: 'running', navegando: 'sailing', volando: 'flying',
  luchando: 'fighting', trabajando: 'working', mirando: 'looking', esperando: 'waiting',
  construyendo: 'building', excavando: 'digging', escribiendo: 'writing', pensando: 'thinking',
  cayendo: 'falling', naciendo: 'being born', muriendo: 'dying',

  // --- animales ---
  caballo: 'horse', leon: 'lion', aguila: 'eagle', lobo: 'wolf', serpiente: 'snake',
  pajaro: 'bird', pez: 'fish', perro: 'dog', gato: 'cat',
};

// palabras que forman "adjetivo + sustantivo" en español pero en ingles van
// invertidas ("mar oscuro" -> "dark sea", no "sea dark").
const ADJETIVOS = new Set([
  'grande', 'pequeño', 'pequeña', 'viejo', 'vieja', 'nuevo', 'nueva', 'oscuro', 'oscura',
  'brillante', 'hermoso', 'hermosa', 'peligroso', 'peligrosa', 'rapido', 'lento', 'fuerte',
  'debil', 'profundo', 'profunda', 'dorado', 'dorada', 'dramatico', 'epico', 'epica',
  'antiguo', 'antigua',
]);

const norm = (w) => w.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-zñ]/g, '');
// el diccionario/stopwords usan ñ sin tilde en las vocales; normalizamos aparte para no romper "ñ"
const normKeepN = (w) =>
  w
    .toLowerCase()
    .replace(/[áàä]/g, 'a').replace(/[éèë]/g, 'e').replace(/[íìï]/g, 'i')
    .replace(/[óòö]/g, 'o').replace(/[úùü]/g, 'u')
    .replace(/[^a-zñ]/g, '');

function groupIntoBlocks(segments) {
  const blocks = [];
  let cur = null;
  for (const seg of segments) {
    if (!cur) {
      cur = {inicio: seg.inicio, fin: seg.fin, texto: seg.texto};
      continue;
    }
    const durIfAdded = seg.fin - cur.inicio;
    if (durIfAdded <= MAX_BLOCK_SEC) {
      cur.fin = seg.fin;
      cur.texto += ' ' + seg.texto;
      if (cur.fin - cur.inicio >= MIN_BLOCK_SEC) {
        blocks.push(cur);
        cur = null;
      }
    } else {
      blocks.push(cur);
      cur = {inicio: seg.inicio, fin: seg.fin, texto: seg.texto};
    }
  }
  if (cur) blocks.push(cur);
  return blocks;
}

// Busca en el diccionario probando la forma exacta y, si falla, quitando
// terminaciones de plural simples ("inventos" -> "invento", "flores" -> "flor").
function lookup(w) {
  if (DICCIONARIO[w]) return DICCIONARIO[w];
  if (w.endsWith('es') && DICCIONARIO[w.slice(0, -2)]) return DICCIONARIO[w.slice(0, -2)];
  if (w.endsWith('s') && DICCIONARIO[w.slice(0, -1)]) return DICCIONARIO[w.slice(0, -1)];
  return null;
}

// Palabras en mayuscula que aparecen DENTRO de una oracion (no en la
// primera posicion) -- esas si son candidatas solidas a nombre propio. Una
// mayuscula solo por ser inicio de oracion no dice nada (evita falsos
// positivos como "Navegaba" al arrancar una frase).
function interiorCapitalized(texto) {
  const sentences = texto.split(/(?<=[.!?])\s+/);
  const set = new Set();
  for (const s of sentences) {
    const words = s.trim().split(/\s+/);
    for (let i = 1; i < words.length; i++) {
      const raw = words[i].replace(/[^\wÁÉÍÓÚÑáéíóúñ]/g, '');
      if (/^[A-ZÁÉÍÓÚÑ]/.test(raw) && raw.length > 3) set.add(raw);
    }
  }
  return set;
}

function extractKeywords(texto) {
  const terms = nlp(texto).terms().out('array');
  const properNouns = interiorCapitalized(texto);
  const candidates = [];
  for (let i = 0; i < terms.length; i++) {
    const w = normKeepN(terms[i]);
    if (!w || w.length < 3 || STOPWORDS.has(w)) continue;

    // sustantivo + adjetivo (orden normal en español, ej. "mar oscuro") o
    // adjetivo + sustantivo (orden poetico/preposeido, ej. "hermosa ciudad")
    // consecutivos y ambos traducibles -> frase de 2 palabras en ingles
    // ("mar oscuro" -> "dark ocean", ya en el orden correcto para ingles).
    if (i + 1 < terms.length) {
      const w2 = normKeepN(terms[i + 1]);
      const nounFirst = !ADJETIVOS.has(w) && lookup(w) && ADJETIVOS.has(w2);
      const adjFirst = ADJETIVOS.has(w) && lookup(w2) && !ADJETIVOS.has(w2);
      if (nounFirst) {
        candidates.push(`${DICCIONARIO[w2]} ${lookup(w)}`);
        i++;
        continue;
      }
      if (adjFirst) {
        candidates.push(`${DICCIONARIO[w]} ${lookup(w2)}`);
        i++;
        continue;
      }
    }
    const en = lookup(w);
    if (en) {
      candidates.push(en);
    } else if (properNouns.has(terms[i].replace(/[^\wÁÉÍÓÚÑáéíóúñ]/g, ''))) {
      // nombre propio no traducible (persona/lugar): se deja tal cual,
      // capitalizado, como ultimo recurso de busqueda.
      candidates.push(terms[i].replace(/[^\wÁÉÍÓÚÑáéíóúñ]/g, ''));
    }
  }
  // dedupe preservando orden, maximo 4 keywords por bloque
  const seen = new Set();
  const out = [];
  for (const c of candidates) {
    const key = c.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(c);
    if (out.length >= 4) break;
  }
  return out.length ? out : ['abstract background']; // fallback si el bloque no dio nada
}

// ---------------- run ----------------
const segments = JSON.parse(fs.readFileSync(IN, 'utf-8'));
if (!Array.isArray(segments) || segments.length === 0) {
  console.error(`Error: '${IN}' esta vacio o no tiene el formato esperado.`);
  process.exit(1);
}

const blocks = groupIntoBlocks(segments);
const keywordBlocks = blocks.map((b) => ({
  inicio: b.inicio,
  fin: b.fin,
  keywords: extractKeywords(b.texto),
}));

const outDir = path.dirname(OUT);
if (outDir) fs.mkdirSync(outDir, {recursive: true});
fs.writeFileSync(OUT, JSON.stringify(keywordBlocks, null, 2));

console.log(`OK: ${segments.length} segmentos -> ${keywordBlocks.length} bloques -> ${OUT}`);
for (const b of keywordBlocks) {
  console.log(`  [${b.inicio.toFixed(1)}-${b.fin.toFixed(1)}] ${b.keywords.join(', ')}`);
}
