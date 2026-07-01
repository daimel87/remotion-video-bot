# Video Factory

YouTube video production pipeline local tool.

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

3. Run:
```bash
npm start
```

4. Open http://localhost:3000

## Features
- 📊 Channel Analysis — analyze any YouTube channel with yt-dlp
- 💡 Video Ideas — generate ideas with Claude AI
- ✏️ Titles — generate high-CTR titles
- 📝 Script — write full scripts with Claude AI
- 🎙️ Voiceover — generate voiceover with Google TTS
- 🖼️ Thumbnail — generate thumbnails with Gemini Imagen
- 🎥 Stock Videos — search free stock videos from Pexels
