#!/usr/bin/env python3
"""
Script para generar short video usando ffmpeg directamente
Crea un video 9:16 de 50 segundos con storyboard completo
"""

import os
import subprocess
import sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

PROJECT_ROOT = Path(__file__).parent.parent
AUDIO_FILE = PROJECT_ROOT / "pippit-output" / "short_audio.mp3"
OUTPUT_FILE = PROJECT_ROOT / "pippit-output" / "short_prelox_ginseng.mp4"
TEMP_DIR = PROJECT_ROOT / "pippit-output" / "temp_frames"
WIDTH, HEIGHT = 1080, 1920

print("🎬 Generando short video con ffmpeg...")
print()

# Crear directorio temporal
TEMP_DIR.mkdir(parents=True, exist_ok=True)
OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)

def create_frame(text, bg_color, duration, filename):
    """Crea un frame de imagen con texto"""
    img = Image.new('RGB', (WIDTH, HEIGHT), bg_color)
    draw = ImageDraw.Draw(img)

    # Usar fuente predeterminada más grande
    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 80)
    except:
        font = ImageFont.load_default()

    # Escribir texto centrado
    lines = text.split('\n')
    y_offset = (HEIGHT - len(lines) * 100) // 2

    for line in lines:
        bbox = draw.textbbox((0, 0), line, font=font)
        text_width = bbox[2] - bbox[0]
        x = (WIDTH - text_width) // 2
        draw.text((x, y_offset), line, fill=(255, 255, 255), font=font)
        y_offset += 100

    img.save(filename)
    return img

print("📸 Creando frames...")

# Escena 1: HOOK (3 segundos a 24fps = 72 frames)
print("  1. Hook (3s)...")
create_frame(
    "A los 40+ años tu\ntestosterona cae 1%\nanual...\n\nPero esto lo\ndetiene en 21 días",
    (255, 69, 0),  # Naranja rojo
    3,
    TEMP_DIR / "scene_01.png"
)

# Escena 2: PRELOX (7 segundos)
print("  2. Prelox (7s)...")
create_frame(
    "Prelox®\n\nMejora la circulación\nsanguínea naturalmente",
    (65, 105, 225),  # Azul
    7,
    TEMP_DIR / "scene_02.png"
)

# Escena 3: GINSENG (8 segundos)
print("  3. Ginseng Rojo (8s)...")
create_frame(
    "Ginseng Rojo\n\nAumenta tu resistencia\ny energía",
    (220, 20, 60),  # Crimson
    8,
    TEMP_DIR / "scene_03.png"
)

# Escena 4: BENEFICIOS (17 segundos)
print("  4. Beneficios (17s)...")
create_frame(
    "Beneficios Comprobados\n\n✓ Flujo sanguíneo\n✓ Resistencia\n✓ Confianza\n✓ Sin efectos secundarios",
    (46, 204, 113),  # Verde
    17,
    TEMP_DIR / "scene_04.png"
)

# Escena 5: RESULTADOS (10 segundos)
print("  5. Resultados (10s)...")
create_frame(
    "RESULTADOS CLÍNICOS\n\n92% de hombres\nsienten cambios\nen 3-4 semanas",
    (26, 58, 82),  # Azul oscuro
    10,
    TEMP_DIR / "scene_05.png"
)

# Escena 6: CALL TO ACTION (5 segundos)
print("  6. Call to Action (5s)...")
create_frame(
    "¿Ya conoces estos\nbeneficios?\n\nComenta y sígueme\npara más tips 💪\n\n#SaludNatural #PreLox",
    (148, 0, 211),  # Violeta
    5,
    TEMP_DIR / "scene_06.png"
)

print()
print("🎥 Creando filtro de imágenes...")

# Crear archivo de filtro para ffmpeg
filter_complex = []
current_time = 0
durations = [3, 7, 8, 17, 10, 5]
scale_filters = []

for i, duration in enumerate(durations, 1):
    scale_filters.append(f"[{i}:v]scale={WIDTH}:{HEIGHT}[v{i}]")

filter_complex_str = ";".join(scale_filters)

# Crear comando ffmpeg
cmd = ["ffmpeg"]

# Inputs: imágenes
for i in range(1, 7):
    cmd.extend(["-loop", "1", "-t", str(durations[i-1]), "-i", str(TEMP_DIR / f"scene_{i:02d}.png")])

# Input: audio
cmd.extend(["-i", str(AUDIO_FILE)])

# Filter complex
filter_parts = []
for i in range(1, 7):
    filter_parts.append(f"[{i}:v]scale={WIDTH}:{HEIGHT}[v{i}]")

for i in range(1, 7):
    if i == 1:
        filter_parts.append(f"[v1]")
    else:
        filter_parts.append(f"[v{i}]")

concat_str = "".join(filter_parts) + f"concat=n=6:v=1:a=0[v]"

cmd.extend([
    "-filter_complex", concat_str,
    "-map", "[v]",
    "-map", "6:a",
    "-c:v", "libx264",
    "-preset", "veryfast",
    "-c:a", "aac",
    "-b:a", "128k",
    "-fps_mode", "passthrough",
    str(OUTPUT_FILE)
])

print("🎬 Renderizando video (esto toma 1-2 minutos)...")
print()

try:
    result = subprocess.run(cmd, capture_output=True, text=True)

    if result.returncode != 0:
        print("Error en ffmpeg:")
        print(result.stderr)
        sys.exit(1)

    # Limpiar archivos temporales
    import shutil
    shutil.rmtree(TEMP_DIR)

    print()
    print("✅ ¡Video creado exitosamente!")
    print(f"📁 Archivo: {OUTPUT_FILE}")

    if OUTPUT_FILE.exists():
        size_mb = OUTPUT_FILE.stat().st_size / (1024 * 1024)
        print(f"📊 Tamaño: {size_mb:.1f} MB")

    print()
    print("🚀 Próximos pasos:")
    print(f"   1. Descarga: {OUTPUT_FILE}")
    print("   2. Sube a: TikTok, Instagram Reels, YouTube Shorts")
    print("   3. Usa hashtags: #SaludNatural #PreLox #GinsengRojo #Vitalidad")
    print()

except Exception as e:
    print(f"❌ Error: {e}")
    sys.exit(1)
