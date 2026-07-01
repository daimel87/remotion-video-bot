const express = require('express');
const axios = require('axios');
const { execSync, exec } = require('child_process');
const fs = require('fs');
const path = require('path');

require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.static('public'));

// ── YouTube channel analysis via yt-dlp ──────────────────────
app.post('/api/channel', async (req, res) => {
  const { url, limit = 10 } = req.body;
  if (!url) return res.status(400).json({ error: 'URL required' });

  try {
    const cmd = `yt-dlp --flat-playlist --print "%(title)s|||%(view_count)s|||%(id)s" --playlist-end ${limit} "${url}"`;
    const output = execSync(cmd, { timeout: 30000 }).toString().trim();

    const videos = output.split('\n').map(line => {
      const [title, views, id] = line.split('|||');
      return { title, views: parseInt(views) || 0, id, url: `https://youtube.com/watch?v=${id}` };
    }).filter(v => v.title);

    // Channel name
    let channelName = '';
    try {
      channelName = execSync(`yt-dlp --print "%(channel)s" --playlist-end 1 "${url}"`, { timeout: 15000 }).toString().trim();
    } catch (e) {}

    res.json({ channel: channelName, videos });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Generate video ideas with Claude ─────────────────────────
app.post('/api/ideas', async (req, res) => {
  const { channelData, niche } = req.body;

  const topVideos = channelData.videos
    .sort((a, b) => b.views - a.views)
    .slice(0, 10)
    .map(v => `- "${v.title}" (${v.views.toLocaleString()} views)`)
    .join('\n');

  const prompt = `You are a YouTube content strategist. Analyze these top-performing videos from the channel "${channelData.channel}":

${topVideos}

Niche/focus: ${niche || 'general'}

Generate 10 fresh video ideas inspired by what works in this channel. For each idea provide:
1. Title (optimized for YouTube CTR)
2. Hook (first 10 seconds description)
3. Why it will perform well

Format as JSON array: [{"title": "...", "hook": "...", "reason": "..."}]`;

  try {
    const response = await axios.post('https://api.anthropic.com/v1/messages', {
      model: 'claude-opus-4-8',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }]
    }, {
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      }
    });

    const text = response.data.content[0].text;
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    const ideas = jsonMatch ? JSON.parse(jsonMatch[0]) : [];
    res.json({ ideas });
  } catch (err) {
    res.status(500).json({ error: err.response?.data?.error?.message || err.message });
  }
});

// ── Generate script with Claude ───────────────────────────────
app.post('/api/script', async (req, res) => {
  const { title, hook, duration = 8, language = 'English' } = req.body;

  const prompt = `Write a YouTube video script in ${language} for the video titled: "${title}"

Hook: ${hook}

Requirements:
- Duration: approximately ${duration} minutes
- Engaging, conversational tone
- Start with the hook to grab attention in the first 10 seconds
- Include timestamps markers like [0:00], [1:00], etc.
- End with a strong call to action (like & subscribe)
- Optimized for audience retention

Write the full script now:`;

  try {
    const response = await axios.post('https://api.anthropic.com/v1/messages', {
      model: 'claude-opus-4-8',
      max_tokens: 4000,
      messages: [{ role: 'user', content: prompt }]
    }, {
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      }
    });

    res.json({ script: response.data.content[0].text });
  } catch (err) {
    res.status(500).json({ error: err.response?.data?.error?.message || err.message });
  }
});

// ── Generate voiceover with Gemini TTS ───────────────────────
app.post('/api/voiceover', async (req, res) => {
  const { text, voice = 'en-US-Journey-F' } = req.body;
  if (!text) return res.status(400).json({ error: 'Text required' });

  try {
    const response = await axios.post(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${process.env.GEMINI_API_KEY}`,
      {
        input: { text: text.slice(0, 5000) },
        voice: { languageCode: voice.slice(0, 5), name: voice },
        audioConfig: { audioEncoding: 'MP3', speakingRate: 1.0, pitch: 0 }
      }
    );

    const audioBuffer = Buffer.from(response.data.audioContent, 'base64');
    const filename = `voiceover_${Date.now()}.mp3`;
    const filepath = path.join(__dirname, 'public', 'output', filename);
    fs.mkdirSync(path.dirname(filepath), { recursive: true });
    fs.writeFileSync(filepath, audioBuffer);

    res.json({ url: `/output/${filename}`, filename });
  } catch (err) {
    res.status(500).json({ error: err.response?.data?.error?.message || err.message });
  }
});

// ── Generate thumbnail with Gemini Imagen ────────────────────
app.post('/api/thumbnail', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Prompt required' });

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${process.env.GEMINI_API_KEY}`,
      {
        instances: [{ prompt: `YouTube thumbnail: ${prompt}, professional, high contrast, vibrant colors, 16:9 format` }],
        parameters: { sampleCount: 1, aspectRatio: '16:9' }
      }
    );

    const imageData = response.data.predictions[0].bytesBase64Encoded;
    const filename = `thumbnail_${Date.now()}.png`;
    const filepath = path.join(__dirname, 'public', 'output', filename);
    fs.mkdirSync(path.dirname(filepath), { recursive: true });
    fs.writeFileSync(filepath, Buffer.from(imageData, 'base64'));

    res.json({ url: `/output/${filename}`, filename });
  } catch (err) {
    res.status(500).json({ error: err.response?.data?.error?.message || err.message });
  }
});

// ── Search stock videos from Pexels ──────────────────────────
app.post('/api/stock', async (req, res) => {
  const { query, perPage = 6 } = req.body;
  if (!query) return res.status(400).json({ error: 'Query required' });

  try {
    const response = await axios.get(`https://api.pexels.com/videos/search`, {
      params: { query, per_page: perPage, orientation: 'landscape' },
      headers: { Authorization: process.env.PEXELS_API_KEY }
    });

    const videos = response.data.videos.map(v => ({
      id: v.id,
      duration: v.duration,
      thumbnail: v.image,
      url: v.video_files.find(f => f.quality === 'hd')?.link || v.video_files[0]?.link,
      photographer: v.user.name
    }));

    res.json({ videos });
  } catch (err) {
    res.status(500).json({ error: err.response?.data?.error || err.message });
  }
});

// ── Generate titles with Claude ───────────────────────────────
app.post('/api/titles', async (req, res) => {
  const { topic, style = 'engaging' } = req.body;

  const prompt = `Generate 10 high-CTR YouTube video titles for the topic: "${topic}"

Style: ${style}
Requirements:
- Between 50-70 characters
- Use power words, numbers, or emotional triggers
- Optimized for search and clicks
- Mix of different formats (question, list, how-to, shocking fact)

Return as JSON array: ["title1", "title2", ...]`;

  try {
    const response = await axios.post('https://api.anthropic.com/v1/messages', {
      model: 'claude-opus-4-8',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }]
    }, {
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      }
    });

    const text = response.data.content[0].text;
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    const titles = jsonMatch ? JSON.parse(jsonMatch[0]) : [];
    res.json({ titles });
  } catch (err) {
    res.status(500).json({ error: err.response?.data?.error?.message || err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Video Factory running at http://localhost:${PORT}`));
