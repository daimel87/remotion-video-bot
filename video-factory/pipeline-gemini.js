/**
 * Full Video Pipeline — Gemini only (no Anthropic needed)
 * Script + Voiceover + Thumbnail + Stock Video Assembly → MP4
 *
 * Usage:
 *   node pipeline-gemini.js "Your idea" --lang English --min 5
 */

const axios  = require('axios');
const fs     = require('fs');
const path   = require('path');
const { execSync, exec } = require('child_process');
require('dotenv').config();

// ── Args ─────────────────────────────────────────────────────────────────────
const cliArgs  = process.argv.slice(2);
const idea     = cliArgs.find(a => !a.startsWith('--')) || '';
const langIdx  = cliArgs.indexOf('--lang');
const minIdx   = cliArgs.indexOf('--min');
const LANGUAGE = langIdx !== -1 ? cliArgs[langIdx + 1] : 'English';
const DURATION = minIdx  !== -1 ? parseInt(cliArgs[minIdx + 1]) : 5;
const GEMINI   = process.env.GEMINI_API_KEY;
const PEXELS   = process.env.PEXELS_API_KEY;

if (!idea)   { console.error('Usage: node pipeline-gemini.js "Your idea"'); process.exit(1); }
if (!GEMINI) { console.error('GEMINI_API_KEY not set in .env'); process.exit(1); }
if (!PEXELS) { console.error('PEXELS_API_KEY not set in .env'); process.exit(1); }

// ── Output dir ────────────────────────────────────────────────────────────────
const ts       = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const safe     = idea.slice(0, 35).replace(/[^a-z0-9]/gi, '_').toLowerCase();
const OUT      = path.join(__dirname, 'output', `${ts}_${safe}`);
const TMP      = path.join(OUT, 'tmp');
fs.mkdirSync(TMP, { recursive: true });

// ── Helpers ───────────────────────────────────────────────────────────────────
const log = (icon, msg) => console.log(`\n${icon}  ${msg}`);
const save = (name, data) => { const p = path.join(OUT, name); fs.writeFileSync(p, data); return p; };

async function gemini(prompt, maxTokens = 3000) {
  const res = await axios.post(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI}`,
    { contents: [{ parts: [{ text: prompt }] }], generationConfig: { maxOutputTokens: maxTokens } }
  );
  return res.data.candidates[0].content.parts[0].text;
}

async function download(url, dest) {
  const res = await axios.get(url, { responseType: 'arraybuffer', timeout: 30000 });
  fs.writeFileSync(dest, Buffer.from(res.data));
  return dest;
}

function shell(cmd, opts = {}) {
  return execSync(cmd, { stdio: 'pipe', timeout: 300000, ...opts }).toString().trim();
}

// ── Step 1: Analyze idea & generate metadata ──────────────────────────────────
async function step1_metadata() {
  log('🧠', 'Step 1: Analyzing idea with Gemini...');
  const text = await gemini(`You are a top YouTube content strategist.

Video idea: "${idea}"
Language: ${LANGUAGE}
Duration: ${DURATION} minutes

Return ONLY a raw JSON object (no markdown, no code blocks):
{
  "title": "Best YouTube title, 50-70 chars, high CTR",
  "hook": "First 15 seconds — what the viewer will see and hear",
  "sections": [
    {"heading": "Section name", "duration": 60, "stockQuery": "pexels search query for b-roll"}
  ],
  "thumbnailPrompt": "Detailed image generation prompt for YouTube thumbnail",
  "description": "Full YouTube description 3 paragraphs + hashtags",
  "tags": ["tag1","tag2","tag3"],
  "pinnedComment": "Engaging comment to pin"
}

Make ${DURATION * 60} total seconds spread across sections. Each stockQuery should be vivid and specific.`, 2000);

  const json = text.match(/\{[\s\S]*\}/)?.[0];
  if (!json) throw new Error('Gemini did not return valid JSON');
  const data = JSON.parse(json);
  save('metadata.json', JSON.stringify(data, null, 2));
  log('✅', `Title: ${data.title}`);
  return data;
}

// ── Step 2: Write full script ─────────────────────────────────────────────────
async function step2_script(meta) {
  log('✍️', `Step 2: Writing ${DURATION}-min script in ${LANGUAGE}...`);
  const script = await gemini(`Write a complete YouTube video script in ${LANGUAGE}.

Title: "${meta.title}"
Hook: ${meta.hook}
Duration: ${DURATION} minutes (~${DURATION * 130} words)

Structure:
${meta.sections.map((s, i) => `[${i + 1}] ${s.heading} (~${s.duration}s)`).join('\n')}

Requirements:
- Start immediately with the hook (no "Hey guys" opener)
- Natural, conversational tone
- Include [TIMESTAMP] markers at each section
- End with call to action (like, subscribe, comment below)
- Only narration text — no stage directions

Write the FULL script now:`, 5000);

  save('script.txt', script);
  log('✅', `Script: ${script.split(/\s+/).length} words`);
  return script;
}

// ── Step 3: Voiceover with Google TTS ────────────────────────────────────────
async function step3_voiceover(script) {
  log('🎙️', 'Step 3: Generating voiceover...');

  const voiceMap = {
    english: { lang: 'en-US', name: 'en-US-Journey-F' },
    español: { lang: 'es-US', name: 'es-US-Journey-F' },
    spanish: { lang: 'es-US', name: 'es-US-Journey-F' },
    portuguese: { lang: 'pt-BR', name: 'pt-BR-Journey-F' },
  };
  const v = voiceMap[LANGUAGE.toLowerCase()] || { lang: 'en-US', name: 'en-US-Journey-F' };

  // Clean script for TTS
  const clean = script
    .replace(/\[.*?\]/g, '')
    .replace(/\*+/g, '')
    .replace(/#{1,6}\s/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  // Split into 4500-char chunks at sentence boundaries
  const chunks = [];
  let rem = clean;
  while (rem.length > 0) {
    const slice = rem.slice(0, 4500);
    const cut = rem.length <= 4500 ? rem.length : Math.max(slice.lastIndexOf('. ') + 2, slice.lastIndexOf('.\n') + 2, 2000);
    chunks.push(rem.slice(0, cut).trim());
    rem = rem.slice(cut).trim();
  }

  const parts = [];
  for (let i = 0; i < chunks.length; i++) {
    process.stdout.write(`  TTS chunk ${i + 1}/${chunks.length}...\r`);
    const res = await axios.post(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${GEMINI}`,
      {
        input: { text: chunks[i] },
        voice: { languageCode: v.lang, name: v.name },
        audioConfig: { audioEncoding: 'MP3', speakingRate: 1.05, pitch: 0 }
      }
    );
    parts.push(Buffer.from(res.data.audioContent, 'base64'));
  }

  const audio = Buffer.concat(parts);
  const p = save('voiceover.mp3', audio);
  log('✅', `Voiceover: ${(audio.length / 1024 / 1024).toFixed(2)} MB`);
  return p;
}

// ── Step 4: Thumbnail with Gemini Imagen ─────────────────────────────────────
async function step4_thumbnail(meta) {
  log('🖼️', 'Step 4: Generating thumbnail...');
  try {
    const res = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${GEMINI}`,
      {
        instances: [{ prompt: `YouTube thumbnail: ${meta.thumbnailPrompt}, professional photography, dramatic lighting, high contrast, vibrant colors, 16:9` }],
        parameters: { sampleCount: 1, aspectRatio: '16:9' }
      }
    );
    const img = res.data.predictions[0].bytesBase64Encoded;
    const p = save('thumbnail.png', Buffer.from(img, 'base64'));
    log('✅', `Thumbnail saved`);
    return p;
  } catch (e) {
    log('⚠️', `Thumbnail skipped: ${e.response?.data?.error?.message || e.message}`);
    return null;
  }
}

// ── Step 5: Download stock clips from Pexels ─────────────────────────────────
async function step5_stock(meta, audioDuration) {
  log('🎬', 'Step 5: Downloading stock clips from Pexels...');

  const queries = meta.sections.map(s => s.stockQuery).slice(0, 6);
  const clips = [];

  for (let qi = 0; qi < queries.length; qi++) {
    const q = queries[qi];
    try {
      const res = await axios.get('https://api.pexels.com/videos/search', {
        params: { query: q, per_page: 3, orientation: 'landscape', min_duration: 5 },
        headers: { Authorization: PEXELS },
        timeout: 10000
      });

      for (const v of res.data.videos.slice(0, 2)) {
        const url = v.video_files.find(f => f.quality === 'hd' && f.width <= 1920)?.link
                 || v.video_files.find(f => f.quality === 'sd')?.link
                 || v.video_files[0]?.link;
        if (!url) continue;

        const dest = path.join(TMP, `clip_${qi}_${v.id}.mp4`);
        process.stdout.write(`  Downloading "${q}" clip ${clips.length + 1}...\r`);
        await download(url, dest);

        // Normalize clip: scale to 1920x1080, 30fps, max 15s
        const norm = path.join(TMP, `norm_${qi}_${v.id}.mp4`);
        shell(`ffmpeg -y -i "${dest}" -t 15 -vf "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080" -r 30 -c:v libx264 -preset fast -crf 23 -an "${norm}" 2>/dev/null`);
        clips.push(norm);

        if (clips.length >= 12) break;
      }
    } catch (e) {
      process.stdout.write(`\n  Skipped query "${q}": ${e.message}\n`);
    }
    if (clips.length >= 12) break;
  }

  log('✅', `Downloaded ${clips.length} clips`);
  return clips;
}

// ── Step 6: Assemble video with ffmpeg ────────────────────────────────────────
async function step6_assemble(clips, voicePath, meta) {
  log('🎞️', 'Step 6: Assembling final video...');

  if (clips.length === 0) throw new Error('No stock clips downloaded');

  // Get audio duration
  const audioDur = parseFloat(shell(`ffprobe -v error -show_entries format=duration -of csv=p=0 "${voicePath}"`));
  log('ℹ️', `Audio duration: ${audioDur.toFixed(1)}s`);

  // Build concat list — repeat clips to fill audio duration
  const concatFile = path.join(TMP, 'concat.txt');
  let totalDur = 0;
  const lines = [];
  while (totalDur < audioDur + 5) {
    for (const clip of clips) {
      const d = parseFloat(shell(`ffprobe -v error -show_entries format=duration -of csv=p=0 "${clip}"`));
      lines.push(`file '${clip}'`);
      totalDur += d;
      if (totalDur >= audioDur + 5) break;
    }
  }
  fs.writeFileSync(concatFile, lines.join('\n'));

  // Concatenate clips
  const joined = path.join(TMP, 'joined.mp4');
  shell(`ffmpeg -y -f concat -safe 0 -i "${concatFile}" -c copy "${joined}" 2>/dev/null`);

  // Trim to audio length + 1s fade
  const trimmed = path.join(TMP, 'trimmed.mp4');
  shell(`ffmpeg -y -i "${joined}" -t ${audioDur + 0.5} -c copy "${trimmed}" 2>/dev/null`);

  // Build title overlay text (escape special chars)
  const titleText = meta.title.replace(/'/g, "’").replace(/:/g, '\\:').replace(/,/g, '\\,');
  const safeTitle = titleText.length > 55 ? titleText.slice(0, 52) + '...' : titleText;

  // Final: add voiceover + title card overlay + fade in/out
  const finalOut = path.join(OUT, 'final_video.mp4');

  shell(`ffmpeg -y \
    -i "${trimmed}" \
    -i "${voicePath}" \
    -filter_complex "\
      [0:v]fade=in:0:30,fade=out:st=${Math.max(audioDur - 1, 0)}:d=1[fv];\
      [fv]drawtext=text='${safeTitle}':fontsize=52:fontcolor=white:fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf:x=(w-text_w)/2:y=h-160:box=1:boxcolor=black@0.6:boxborderw=20:enable='lt(t,6)'[v];\
      [1:a]afade=in:st=0:d=0.5,afade=out:st=${Math.max(audioDur - 1.5, 0)}:d=1.5[a]" \
    -map "[v]" -map "[a]" \
    -c:v libx264 -preset fast -crf 22 \
    -c:a aac -b:a 192k \
    -shortest \
    "${finalOut}" 2>/dev/null`);

  const sizeMB = (fs.statSync(finalOut).size / 1024 / 1024).toFixed(1);
  log('✅', `Final video: ${sizeMB} MB → ${finalOut}`);
  return finalOut;
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log('\n' + '═'.repeat(60));
  console.log('🎬  GEMINI VIDEO PIPELINE');
  console.log('═'.repeat(60));
  console.log(`Idea:     ${idea}`);
  console.log(`Language: ${LANGUAGE}  |  Duration: ${DURATION} min`);
  console.log(`Output:   ${OUT}`);
  console.log('═'.repeat(60));

  const t0 = Date.now();

  const meta    = await step1_metadata();
  const script  = await step2_script(meta);

  // Run voiceover and thumbnail in parallel
  const [voicePath] = await Promise.all([
    step3_voiceover(script),
    step4_thumbnail(meta),
  ]);

  const audioDur  = parseFloat(shell(`ffprobe -v error -show_entries format=duration -of csv=p=0 "${voicePath}"`));
  const clips     = await step5_stock(meta, audioDur);
  const videoPath = await step6_assemble(clips, voicePath, meta);

  const elapsed = ((Date.now() - t0) / 1000).toFixed(0);
  console.log('\n' + '═'.repeat(60));
  console.log(`🏁  DONE in ${elapsed}s`);
  console.log(`📂  ${OUT}`);
  console.log('═'.repeat(60) + '\n');

  return videoPath;
}

main().catch(err => {
  const msg = err.response?.data?.error?.message || err.response?.data || err.message;
  console.error(`\n❌  FAILED: ${msg}`);
  if (err.response?.data) console.error(JSON.stringify(err.response.data, null, 2));
  process.exit(1);
});
