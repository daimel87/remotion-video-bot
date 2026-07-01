# Video Factory

YouTube video production pipeline — web UI + automated CLI pipeline.

## Setup

1. Copy `.env.example` to `.env` and fill in your API keys:
```
ANTHROPIC_API_KEY=sk-ant-...
GEMINI_API_KEY=AIza...
PEXELS_API_KEY=...
PORT=3000
```

2. Install dependencies:
```bash
npm install
pip install yt-dlp
```

---

## 🤖 Automated Pipeline (CLI)

Give it an idea, get everything back automatically:

```bash
node pipeline.js "Your video idea here"
```

**Options:**
```bash
node pipeline.js "Your idea" --lang español    # Language (default: English)
node pipeline.js "Your idea" --min 10          # Duration in minutes (default: 8)
```

**Example:**
```bash
node pipeline.js "Top 10 richest athletes of 2025" --lang English --min 8
```

**What it produces (in `output/TIMESTAMP_idea/`):**

| File | Contents |
|------|----------|
| `REPORT.md` | Full summary with all metadata |
| `script.txt` | Complete video script with timestamps |
| `voiceover.mp3` | AI-generated narration audio |
| `thumbnail.png` | YouTube thumbnail image |
| `stock_videos.json` | Links to relevant stock footage |
| `metadata.json` | Title, description, tags, pinned comment |

**Pipeline steps:**
1. Analyzes and optimizes the idea — best title, angle, hook
2. Writes full script with timestamp markers
3. Generates voiceover (Google TTS — splits long scripts automatically)
4. Generates thumbnail (Gemini Imagen 3)
5. Finds stock footage (Pexels — 3 queries, 4 results each)
6. Generates YouTube metadata (title, description, tags, pinned comment)

**After the pipeline runs:**
1. Review/edit `script.txt` if needed
2. Download stock videos from `stock_videos.json`
3. Assemble in your editor (Premiere, DaVinci, CapCut)
4. Use `thumbnail.png` or design your own
5. Copy description + tags directly to YouTube Studio

---

## 🌐 Web UI (manual tool)

```bash
npm start
```

Open http://localhost:3000

### Features
- Channel Analysis — analyze any YouTube channel with yt-dlp
- Video Ideas — generate ideas with Claude AI
- Titles — generate high-CTR titles
- Script — write full scripts with Claude AI
- Voiceover — generate voiceover with Google TTS
- Thumbnail — generate thumbnails with Gemini Imagen
- Stock Videos — search free stock videos from Pexels

---

## API Keys

| Key | Where to get it |
|-----|-----------------|
| `ANTHROPIC_API_KEY` | console.anthropic.com |
| `GEMINI_API_KEY` | aistudio.google.com |
| `PEXELS_API_KEY` | pexels.com/api |
