#!/usr/bin/env python3
"""
Script para generar short video con audio personalizado
Crea un video 9:16 de 50 segundos con storyboard completo
"""

import os
import sys
from pathlib import Path

# Instalar moviepy si no está disponible
try:
    from moviepy.editor import (
        VideoClip, TextClip, ImageClip, CompositeVideoClip,
        AudioFileClip, concatenate_videoclips, ColorClip
    )
    from moviepy.video.io.ffmpeg_tools import ffmpeg_extract_subclip
    import numpy as np
except ImportError:
    print("Instalando moviepy...")
    os.system("pip install moviepy imageio imageio-ffmpeg")
    from moviepy.editor import (
        VideoClip, TextClip, ImageClip, CompositeVideoClip,
        AudioFileClip, concatenate_videoclips, ColorClip
    )

# Configuración
PROJECT_ROOT = Path(__file__).parent.parent
AUDIO_FILE = PROJECT_ROOT / "pippit-output" / "short_audio.mp3"
OUTPUT_FILE = PROJECT_ROOT / "pippit-output" / "short_prelox_ginseng.mp4"
WIDTH, HEIGHT = 1080, 1920  # 9:16 vertical

print("🎬 Generando short video...")
print(f"Audio: {AUDIO_FILE}")
print(f"Salida: {OUTPUT_FILE}")
print()

# Crear carpeta de salida si no existe
OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)

# Función para crear un clip de color con texto
def create_text_clip(text, duration, bg_color, text_color="white", fontsize=70):
    """Crea un clip de video con fondo de color y texto"""
    # Crear fondo de color
    bg_clip = ColorClip(size=(WIDTH, HEIGHT), color=bg_color).set_duration(duration)

    # Crear texto
    txt_clip = TextClip(
        text,
        fontsize=fontsize,
        color=text_color,
        font='Arial-Bold',
        method='caption',
        size=(WIDTH - 100, None),
        align='center'
    ).set_duration(duration)

    # Centrar el texto
    txt_clip = txt_clip.set_position('center')

    # Combinar fondo + texto
    video = CompositeVideoClip([bg_clip, txt_clip])
    return video

# Función para crear clip con fade in/out
def add_fade(clip, fade_in=0.5, fade_out=0.5):
    """Añade fade in y fade out a un clip"""
    clip = clip.fadein(fade_in).fadeout(fade_out)
    return clip

print("⏳ Creando escenas...")

# ESCENA 1: HOOK (0-3s) - Fondo rojo/naranja
print("  1. Hook potente (3s)...")
scene1 = create_text_clip(
    "A los 40+ años tu testosterona\ncae 1% anual...\n\nPero esto lo\ndetiene en 21 días",
    duration=3,
    bg_color=(255, 69, 0),  # Naranja rojo
    fontsize=65
)
scene1 = add_fade(scene1, fade_in=0.5, fade_out=0.3)

# ESCENA 2: PRELOX (3-10s) - Fondo azul
print("  2. Prelox (7s)...")
scene2 = create_text_clip(
    "Prelox®\n\nMejora la circulación\nsanguínea naturalmente",
    duration=7,
    bg_color=(65, 105, 225),  # Azul royal
    fontsize=60
)
scene2 = add_fade(scene2, fade_in=0.5, fade_out=0.3)

# ESCENA 3: GINSENG ROJO (10-18s) - Fondo rojo suave
print("  3. Ginseng Rojo (8s)...")
scene3 = create_text_clip(
    "Ginseng Rojo\n\nAumenta tu resistencia\ny energía",
    duration=8,
    bg_color=(220, 20, 60),  # Crimson
    fontsize=60
)
scene3 = add_fade(scene3, fade_in=0.5, fade_out=0.3)

# ESCENA 4: BENEFICIOS (18-35s) - Fondo verde
print("  4. Beneficios (17s)...")
benefits_text = "Beneficios Comprobados\n\n✓ Flujo sanguíneo\n✓ Resistencia\n✓ Confianza\n✓ Sin efectos secundarios"
scene4 = create_text_clip(
    benefits_text,
    duration=17,
    bg_color=(46, 204, 113),  # Verde
    fontsize=55
)
scene4 = add_fade(scene4, fade_in=0.5, fade_out=0.3)

# ESCENA 5: RESULTADOS (35-45s) - Fondo azul oscuro
print("  5. Resultados (10s)...")
results_text = "RESULTADOS\n\n92% de hombres\nsienten cambios\nen 3-4 semanas\n\nClínicamente\ncomprobado"
scene5 = create_text_clip(
    results_text,
    duration=10,
    bg_color=(26, 58, 82),  # Azul oscuro
    text_color="white",
    fontsize=55
)
scene5 = add_fade(scene5, fade_in=0.5, fade_out=0.3)

# ESCENA 6: CALL TO ACTION (45-50s) - Fondo gradiente colorido
print("  6. Call to Action (5s)...")
cta_text = "¿Ya conoces estos beneficios?\n\nComenta y sígueme para más tips 💪\n\n#SaludNatural #PreLox #GinsengRojo"
scene6 = create_text_clip(
    cta_text,
    duration=5,
    bg_color=(148, 0, 211),  # Violeta
    fontsize=50
)
scene6 = add_fade(scene6, fade_in=0.5, fade_out=0.5)

# Concatenar todas las escenas
print("\n⏳ Ensamblando video...")
video = concatenate_videoclips([scene1, scene2, scene3, scene4, scene5, scene6])

# Cargar audio
print("🔊 Integrando audio...")
try:
    audio = AudioFileClip(str(AUDIO_FILE))
    # Trimear audio si es más largo que el video
    if audio.duration > video.duration:
        audio = audio.set_duration(video.duration)
    video = video.set_audio(audio)
except Exception as e:
    print(f"⚠️  No se pudo cargar audio: {e}")
    print("   Continuando sin audio...")

# Exportar video
print(f"\n🎥 Renderizando video...")
print(f"   Resolución: {WIDTH}x{HEIGHT} (9:16)")
print(f"   Duración: 50 segundos")
print(f"   Formato: MP4")
print()

try:
    # Usar preset más rápido (veryfast)
    video.write_videofile(
        str(OUTPUT_FILE),
        fps=24,
        codec='libx264',
        audio_codec='aac',
        preset='veryfast',
        verbose=False,
        logger=None
    )

    print()
    print("✅ ¡Video creado exitosamente!")
    print(f"📁 Archivo: {OUTPUT_FILE}")
    print(f"📊 Tamaño: {os.path.getsize(OUTPUT_FILE) / (1024*1024):.1f} MB")
    print()
    print("🚀 Próximos pasos:")
    print("   1. Descarga: pippit-output/short_prelox_ginseng.mp4")
    print("   2. Sube a: TikTok, Instagram Reels, YouTube Shorts")
    print("   3. Usa hashtags: #SaludNatural #PreLox #GinsengRojo #Vitalidad")
    print()

except Exception as e:
    print(f"❌ Error creando video: {e}")
    sys.exit(1)
