/**
 * Video Pipeline — idea → script → voiceover → thumbnail → stock videos → metadata
 *
 * Usage:
 *   node pipeline.js "Tu idea de video aquí"
 *   node pipeline.js "Tu idea" --lang es   (español, default: English)
 *   node pipeline.js "Tu idea" --min 8     (duración en minutos, default: 8)
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// ── Config ──────────────────────────────────────────────────────────────────

const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
const GEMINI_KEY    = process.env.GEMINI_API_KEY;
const PEXELS_KEY    = process.env.PEXELS_API_KEY;

const args      = process.argv.slice(2);
const idea      = args.find(a => !a.startsWith('--')) || '';
const langFlag  = args.indexOf('--lang');
const minFlag   = args.indexOf('--min');
const LANGUAGE  = langFlag !== -1 ? args[langFlag + 1] : 'English';
const DURATION  = minFlag  !== -1 ? parseInt(args[minFlag + 1]) : 8;

if (!idea) {
  console.error('❌  Uso: node pipeline.js "Tu idea de video"');
  process.exit(1);
}

if (!ANTHROPIC_KEY) { console.error('❌  ANTHROPIC_API_KEY no configurado en .env'); process.exit(1); }
if (!GEMINI_KEY)    { console.error('❌  GEMINI_API_KEY no configurado en .env'); process.exit(1); }
if (!PEXELS_KEY)    { console.error('❌  PEXELS_API_KEY no configurado en .env'); process.exit(1); }

// ── Output directory ─────────────────────────────────────────────────────────

const timestamp  = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const safeTitle  = idea.slice(0, 40).replace(/[^a-z0-9]/gi, '_').toLowerCase();
const outputDir  = path.join(__dirname, 'output', `${timestamp}_${safeTitle}`);
fs.mkdirSync(outputDir, { recursive: true });

// ── Helpers ──────────────────────────────────────────────────────────────────

function log(step, msg) {
  const icons = { start: '🚀', done: '✅', skip: '⏭️ ', err: '❌', info: 'ℹ️ ' };
  console.log(`\n${icons[step] || '▶'} ${msg}`);
}

function save(filename, content) {
  const p = path.join(outputDir, filename);
  fs.writeFileSync(p, content);
  return p;
}

async function claude(prompt, maxTokens = 2000) {
  const res = await axios.post('https://api.anthropic.com/v1/messages', {
    model: 'claude-opus-4-8',
    max_tokens: maxTokens,
    messages: [{ role: 'user', content: prompt }]
  }, {
    headers: {
      'x-api-key': ANTHROPIC_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json'
    }
  });
  return res.data.content[0].text;
}

// ── Step 1 — Optimize the idea & extract metadata ───────────────────────────

async function step1_analyze() {
  log('start', 'Paso 1: Analizando y optimizando la idea...');

  const text = await claude(`You are a top YouTube content strategist.

The user has this video idea: "${idea}"
Language for the video: ${LANGUAGE}
Target duration: ${DURATION} minutes

Return a JSON object (no markdown, just raw JSON) with:
{
  "optimizedTitle": "Best YouTube title for maximum CTR (50-70 chars)",
  "hook": "Compelling first 10 seconds description",
  "angle": "Unique angle or twist that makes this video stand out",
  "keywords": ["kw1", "kw2", "kw3", "kw4", "kw5"],
  "thumbnailPrompt": "Detailed prompt for generating a YouTube thumbnail image",
  "stockQueries": ["search query 1", "search query 2", "search query 3"],
  "description": "Full YouTube description (3-4 paragraphs + hashtags)",
  "tags": ["tag1", "tag2", ... up to 20 tags],
  "pinnedComment": "Engaging pinned comment to boost interaction"
}`, 2500);

  const json = text.match(/\{[\s\S]*\}/)?.[0];
  if (!json) throw new Error('Claude no devolvió JSON válido en paso 1');
  const data = JSON.parse(json);
  save('metadata.json', JSON.stringify(data, null, 2));
  log('done', `Título: ${data.optimizedTitle}`);
  return data;
}

// ── Step 2 — Write full script ───────────────────────────────────────────────

async function step2_script(meta) {
  log('start', `Paso 2: Escribiendo script de ${DURATION} minutos...`);

  const script = await claude(`Write a complete YouTube video script in ${LANGUAGE}.

Title: "${meta.optimizedTitle}"
Hook: ${meta.hook}
Angle: ${meta.angle}
Duration: approximately ${DURATION} minutes

Requirements:
- Start with the hook immediately in the first 10 seconds
- Use timestamp markers [0:00], [1:00], [2:00], etc.
- Conversational, engaging tone
- Include natural pauses and emphasis cues in parentheses
- End with a strong call to action (like, subscribe, comment)
- Each section should flow naturally into the next
- Total word count: approximately ${DURATION * 130} words

Write the FULL script now:`, 5000);

  const p = save('script.txt', script);
  const wordCount = script.split(/\s+/).length;
  log('done', `Script listo — ${wordCount} palabras (~${Math.round(wordCount / 130)} min) → ${p}`);
  return script;
}

// ── Step 3 — Generate voiceover ──────────────────────────────────────────────

async function step3_voiceover(script) {
  log('start', 'Paso 3: Generando voiceover con Google TTS...');

  // Pick voice based on language
  const voiceMap = {
    english: 'en-US-Journey-F',
    español: 'es-US-Journey-F',
    spanish: 'es-US-Journey-F',
    portuguese: 'pt-BR-Journey-F',
    français: 'fr-FR-Journey-F',
    deutsch: 'de-DE-Journey-F',
  };
  const voice = voiceMap[LANGUAGE.toLowerCase()] || 'en-US-Journey-F';
  const langCode = voice.slice(0, 5);

  // Strip stage directions for TTS
  const cleanScript = script
    .replace(/\[[\d:]+\]/g, '')
    .replace(/\(.*?\)/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  // TTS has 5000 char limit per request — split into chunks
  const chunks = [];
  let remaining = cleanScript;
  while (remaining.length > 0) {
    const chunk = remaining.slice(0, 4800);
    const breakAt = chunk.lastIndexOf('. ');
    const cut = breakAt > 2000 ? breakAt + 2 : chunk.length;
    chunks.push(remaining.slice(0, cut).trim());
    remaining = remaining.slice(cut).trim();
  }

  log('info', `Procesando ${chunks.length} chunk(s) de audio...`);

  const audioParts = [];
  for (let i = 0; i < chunks.length; i++) {
    const res = await axios.post(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${GEMINI_KEY}`,
      {
        input: { text: chunks[i] },
        voice: { languageCode: langCode, name: voice },
        audioConfig: { audioEncoding: 'MP3', speakingRate: 1.05, pitch: 0 }
      }
    );
    audioParts.push(Buffer.from(res.data.audioContent, 'base64'));
    process.stdout.write(`  Chunk ${i + 1}/${chunks.length} ✓\r`);
  }

  // Combine all audio buffers
  const combined = Buffer.concat(audioParts);
  const p = save('voiceover.mp3', combined);
  const sizeMB = (combined.length / 1024 / 1024).toFixed(2);
  log('done', `Voiceover listo — ${sizeMB} MB → ${p}`);
  return p;
}

// ── Step 4 — Generate thumbnail ──────────────────────────────────────────────

async function step4_thumbnail(meta) {
  log('start', 'Paso 4: Generando thumbnail con Gemini Imagen...');

  const res = await axios.post(
    `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${GEMINI_KEY}`,
    {
      instances: [{
        prompt: `YouTube thumbnail: ${meta.thumbnailPrompt}, professional photography, high contrast, vibrant colors, dramatic lighting, 16:9 format, no text overlay`
      }],
      parameters: { sampleCount: 1, aspectRatio: '16:9' }
    }
  );

  const imageData = res.data.predictions[0].bytesBase64Encoded;
  const p = save('thumbnail.png', Buffer.from(imageData, 'base64'));
  log('done', `Thumbnail listo → ${p}`);
  return p;
}

// ── Step 5 — Search stock videos ─────────────────────────────────────────────

async function step5_stock(meta) {
  log('start', 'Paso 5: Buscando videos stock en Pexels...');

  const results = [];
  for (const query of meta.stockQueries.slice(0, 3)) {
    const res = await axios.get('https://api.pexels.com/videos/search', {
      params: { query, per_page: 4, orientation: 'landscape' },
      headers: { Authorization: PEXELS_KEY }
    });

    const videos = res.data.videos.map(v => ({
      id: v.id,
      query,
      duration: v.duration,
      thumbnail: v.image,
      url: v.video_files.find(f => f.quality === 'hd')?.link || v.video_files[0]?.link,
      photographer: v.user.name
    }));
    results.push(...videos);
    process.stdout.write(`  "${query}" → ${videos.length} videos\n`);
  }

  const p = save('stock_videos.json', JSON.stringify(results, null, 2));
  log('done', `${results.length} videos stock encontrados → ${p}`);
  return results;
}

// ── Step 6 — Write summary report ────────────────────────────────────────────

function step6_report(meta, script, stockVideos) {
  log('start', 'Paso 6: Generando reporte final...');

  const report = `# Video Pipeline Report
Generated: ${new Date().toISOString()}
Idea: ${idea}

## 📹 Title
${meta.optimizedTitle}

## 🎯 Hook
${meta.hook}

## 💡 Angle
${meta.angle}

## 📝 Description
${meta.description}

## 🏷️ Tags
${meta.tags.join(', ')}

## 📌 Pinned Comment
${meta.pinnedComment}

## 🔍 Keywords
${meta.keywords.join(', ')}

## 🎬 Stock Videos (${stockVideos.length} results)
${stockVideos.map(v => `- [${v.query}] ${v.duration}s by ${v.photographer}\n  ${v.url}`).join('\n')}

## 📁 Output Files
- script.txt      — Full video script
- voiceover.mp3   — AI voiceover audio
- thumbnail.png   — YouTube thumbnail
- stock_videos.json — Stock footage links
- metadata.json   — All metadata

## ✅ Next Steps
1. Review and edit script.txt if needed
2. Listen to voiceover.mp3 — re-generate if needed
3. Use thumbnail.png or design your own inspired by it
4. Download stock videos from stock_videos.json links
5. Assemble in your video editor (Premiere, DaVinci, CapCut)
6. Copy description and tags to YouTube Studio
`;

  const p = save('REPORT.md', report);
  log('done', `Reporte completo → ${p}`);
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n' + '═'.repeat(60));
  console.log('🎬  VIDEO PIPELINE');
  console.log('═'.repeat(60));
  console.log(`Idea:     ${idea}`);
  console.log(`Idioma:   ${LANGUAGE}`);
  console.log(`Duración: ${DURATION} minutos`);
  console.log(`Output:   ${outputDir}`);
  console.log('═'.repeat(60));

  const startTime = Date.now();

  try {
    const meta        = await step1_analyze();
    const script      = await step2_script(meta);
    const [vo, thumb, stock] = await Promise.all([
      step3_voiceover(script),
      step4_thumbnail(meta),
      step5_stock(meta),
    ]);
    step6_report(meta, script, stock);

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log('\n' + '═'.repeat(60));
    console.log(`🏁  PIPELINE COMPLETO en ${elapsed}s`);
    console.log(`📂  Todo guardado en: ${outputDir}`);
    console.log('═'.repeat(60) + '\n');

  } catch (err) {
    const detail = err.response?.data?.error?.message || err.response?.data || err.message;
    log('err', `Pipeline falló: ${detail}`);
    process.exit(1);
  }
}

main();
