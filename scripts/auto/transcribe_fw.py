#!/usr/bin/env python3
"""Transcribe un audio a SRT con faster-whisper.

Uso:  python3 transcribe_fw.py <audio> <out.srt> [lang] [model]

model por defecto: 'small' (buen equilibrio calidad/velocidad en CPU).
lang por defecto: 'es'. Escribe un SRT con una entrada por segmento.
"""
import sys
from faster_whisper import WhisperModel


def ts(seconds: float) -> str:
    if seconds < 0:
        seconds = 0
    ms = int(round(seconds * 1000))
    h, ms = divmod(ms, 3600_000)
    m, ms = divmod(ms, 60_000)
    s, ms = divmod(ms, 1000)
    return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"


def main() -> int:
    if len(sys.argv) < 3:
        print("uso: transcribe_fw.py <audio> <out.srt> [lang] [model]", file=sys.stderr)
        return 1
    audio = sys.argv[1]
    out = sys.argv[2]
    lang = sys.argv[3] if len(sys.argv) > 3 else "es"
    model_size = sys.argv[4] if len(sys.argv) > 4 else "small"

    print(f"cargando modelo faster-whisper '{model_size}' (int8, CPU)...", file=sys.stderr)
    model = WhisperModel(model_size, device="cpu", compute_type="int8")
    print(f"transcribiendo {audio} (lang={lang})...", file=sys.stderr)
    segments, info = model.transcribe(audio, language=lang, vad_filter=True)

    lines = []
    n = 0
    for seg in segments:
        n += 1
        text = seg.text.strip()
        lines.append(f"{n}\n{ts(seg.start)} --> {ts(seg.end)}\n{text}\n")
        print(f"  [{ts(seg.start)}] {text}", file=sys.stderr)

    with open(out, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))
    print(f"OK: {n} segmentos -> {out}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
