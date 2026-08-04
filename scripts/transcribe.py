#!/usr/bin/env python3
"""
Transcribe un audio con faster-whisper (100% local, sin API de pago).

Uso:
    python scripts/transcribe.py <ruta_audio> [--model base|small|medium] [--out output/transcripcion.json]

Salida (output/transcripcion.json):
    [{"texto": "...", "inicio": 0.0, "fin": 3.2}, ...]

Instala faster-whisper automaticamente si no esta disponible en el entorno.
Usa CPU con compute_type "int8" para que corra rapido en una laptop sin GPU.
"""
import argparse
import json
import os
import subprocess
import sys

def ensure_faster_whisper():
    try:
        import faster_whisper  # noqa: F401
    except ImportError:
        print("faster-whisper no esta instalado, instalando...", file=sys.stderr)
        subprocess.check_call([sys.executable, "-m", "pip", "install", "--quiet", "faster-whisper"])

def main():
    parser = argparse.ArgumentParser(description="Transcribe un audio con faster-whisper.")
    parser.add_argument("audio", help="Ruta al archivo de audio (mp3, wav, m4a, ...)")
    parser.add_argument("--model", default="small", choices=["tiny", "base", "small", "medium", "large-v3"],
                         help="Tamano del modelo Whisper (default: small)")
    parser.add_argument("--out", default=os.path.join("output", "transcripcion.json"),
                         help="Ruta del JSON de salida (default: output/transcripcion.json)")
    parser.add_argument("--language", default=None,
                         help="Codigo de idioma (ej. es, en). Si se omite, se autodetecta.")
    args = parser.parse_args()

    if not os.path.isfile(args.audio):
        print(f"Error: no existe el archivo de audio '{args.audio}'", file=sys.stderr)
        sys.exit(1)

    ensure_faster_whisper()
    from faster_whisper import WhisperModel

    print(f"Cargando modelo Whisper '{args.model}' (CPU, int8)...", file=sys.stderr)
    model = WhisperModel(args.model, device="cpu", compute_type="int8")

    print(f"Transcribiendo '{args.audio}'...", file=sys.stderr)
    segments, info = model.transcribe(args.audio, language=args.language, vad_filter=True)

    print(f"Idioma detectado: {info.language} (prob {info.language_probability:.2f})", file=sys.stderr)

    resultado = []
    for seg in segments:
        texto = seg.text.strip()
        if not texto:
            continue
        resultado.append({"texto": texto, "inicio": round(seg.start, 2), "fin": round(seg.end, 2)})
        print(f"  [{seg.start:6.2f} -> {seg.end:6.2f}] {texto}", file=sys.stderr)

    out_dir = os.path.dirname(args.out)
    if out_dir:
        os.makedirs(out_dir, exist_ok=True)
    with open(args.out, "w", encoding="utf-8") as f:
        json.dump(resultado, f, ensure_ascii=False, indent=2)

    print(f"\nOK: {len(resultado)} segmentos -> {args.out}", file=sys.stderr)

if __name__ == "__main__":
    main()
