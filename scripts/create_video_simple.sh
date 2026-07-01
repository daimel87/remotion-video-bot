#!/bin/bash
# Script para generar video short con ffmpeg de forma simple

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
AUDIO_FILE="$PROJECT_ROOT/pippit-output/short_audio.mp3"
OUTPUT_FILE="$PROJECT_ROOT/pippit-output/short_prelox_ginseng.mp4"
TEMP_DIR="$PROJECT_ROOT/pippit-output/temp_frames"
WIDTH=1080
HEIGHT=1920
FPS=24

echo "🎬 Generando short video..."
echo "📁 Proyecto: $PROJECT_ROOT"
echo "🎤 Audio: $AUDIO_FILE"
echo "📁 Salida: $OUTPUT_FILE"
echo ""

# Crear directorio temporal
mkdir -p "$TEMP_DIR"

# Función para crear imagen con ffmpeg
create_image() {
    local text=$1
    local color=$2
    local output=$3

    # Crear imagen sólida de color con texto usando drawtext
    ffmpeg -f lavfi -i color=$color:s=${WIDTH}x${HEIGHT}:d=1 \
        -vf "drawtext=text='$text':fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf:fontsize=80:fontcolor=white:x=(w-text_w)/2:y=(h-text_h)/2" \
        -frames:v 1 -y "$output" 2>/dev/null
}

echo "📸 Creando imágenes con ffmpeg..."

# Crear cada escena
echo "  1. Hook..."
ffmpeg -f lavfi -i color=FF4500:s=${WIDTH}x${HEIGHT}:d=1 \
    -vf "drawtext=text='A los 40+ años tu\ntestosterona cae 1% anual\n\nPero esto lo\ndetiene en 21 días':fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf:fontsize=70:fontcolor=white:x=(w-text_w)/2:y=(h-text_h)/2:line_spacing=20" \
    -frames:v 1 -y "$TEMP_DIR/scene_01.png" 2>/dev/null

echo "  2. Prelox..."
ffmpeg -f lavfi -i color=4169E1:s=${WIDTH}x${HEIGHT}:d=1 \
    -vf "drawtext=text='Prelox\n\nMejora la circulación\nsanguínea naturalmente':fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf:fontsize=70:fontcolor=white:x=(w-text_w)/2:y=(h-text_h)/2:line_spacing=20" \
    -frames:v 1 -y "$TEMP_DIR/scene_02.png" 2>/dev/null

echo "  3. Ginseng..."
ffmpeg -f lavfi -i color=DC143C:s=${WIDTH}x${HEIGHT}:d=1 \
    -vf "drawtext=text='Ginseng Rojo\n\nAumenta tu resistencia\ny energía':fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf:fontsize=70:fontcolor=white:x=(w-text_w)/2:y=(h-text_h)/2:line_spacing=20" \
    -frames:v 1 -y "$TEMP_DIR/scene_03.png" 2>/dev/null

echo "  4. Beneficios..."
ffmpeg -f lavfi -i color=2ECC71:s=${WIDTH}x${HEIGHT}:d=1 \
    -vf "drawtext=text='Beneficios\n\n✓ Flujo sanguíneo\n✓ Resistencia\n✓ Confianza\n✓ Sin efectos secundarios':fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf:fontsize=60:fontcolor=white:x=(w-text_w)/2:y=(h-text_h)/2:line_spacing=15" \
    -frames:v 1 -y "$TEMP_DIR/scene_04.png" 2>/dev/null

echo "  5. Resultados..."
ffmpeg -f lavfi -i color=1A3A52:s=${WIDTH}x${HEIGHT}:d=1 \
    -vf "drawtext=text='RESULTADOS\n\n92% de hombres\nsienten cambios\nen 3-4 semanas':fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf:fontsize=70:fontcolor=white:x=(w-text_w)/2:y=(h-text_h)/2:line_spacing=20" \
    -frames:v 1 -y "$TEMP_DIR/scene_05.png" 2>/dev/null

echo "  6. CTA..."
ffmpeg -f lavfi -i color=9400D3:s=${WIDTH}x${HEIGHT}:d=1 \
    -vf "drawtext=text='¿Ya conoces estos\nbeneficios?\n\nComenta y sígueme\npara más tips':fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf:fontsize=65:fontcolor=white:x=(w-text_w)/2:y=(h-text_h)/2:line_spacing=20" \
    -frames:v 1 -y "$TEMP_DIR/scene_06.png" 2>/dev/null

echo ""
echo "🎬 Creando videos individuales..."

# Crear archivo de entrada para concat
cat > "$TEMP_DIR/concat.txt" << 'EOF'
file 'scene_01.png'
duration 3
file 'scene_02.png'
duration 7
file 'scene_03.png'
duration 8
file 'scene_04.png'
duration 17
file 'scene_05.png'
duration 10
file 'scene_06.png'
duration 5
EOF

# Crear video desde imágenes individuales con duración
ffmpeg -loop 1 -i "$TEMP_DIR/scene_01.png" -c:v libx264 -t 3 -pix_fmt yuv420p "$TEMP_DIR/v01.mp4" 2>/dev/null &
ffmpeg -loop 1 -i "$TEMP_DIR/scene_02.png" -c:v libx264 -t 7 -pix_fmt yuv420p "$TEMP_DIR/v02.mp4" 2>/dev/null &
ffmpeg -loop 1 -i "$TEMP_DIR/scene_03.png" -c:v libx264 -t 8 -pix_fmt yuv420p "$TEMP_DIR/v03.mp4" 2>/dev/null &
ffmpeg -loop 1 -i "$TEMP_DIR/scene_04.png" -c:v libx264 -t 17 -pix_fmt yuv420p "$TEMP_DIR/v04.mp4" 2>/dev/null &
ffmpeg -loop 1 -i "$TEMP_DIR/scene_05.png" -c:v libx264 -t 10 -pix_fmt yuv420p "$TEMP_DIR/v05.mp4" 2>/dev/null &
ffmpeg -loop 1 -i "$TEMP_DIR/scene_06.png" -c:v libx264 -t 5 -pix_fmt yuv420p "$TEMP_DIR/v06.mp4" 2>/dev/null &
wait

echo "🔗 Concatenando videos..."

# Crear archivo de concaten
cat > "$TEMP_DIR/filelist.txt" << 'EOF'
file 'v01.mp4'
file 'v02.mp4'
file 'v03.mp4'
file 'v04.mp4'
file 'v05.mp4'
file 'v06.mp4'
EOF

# Concatenar videos
ffmpeg -f concat -safe 0 -i "$TEMP_DIR/filelist.txt" -c copy "$TEMP_DIR/video_no_audio.mp4" -y 2>/dev/null

echo "🎤 Añadiendo audio..."

# Añadir audio
ffmpeg -i "$TEMP_DIR/video_no_audio.mp4" -i "$AUDIO_FILE" \
    -c:v copy -c:a aac -map 0:v:0 -map 1:a:0 \
    -shortest "$OUTPUT_FILE" -y 2>/dev/null

# Limpiar temporales
rm -rf "$TEMP_DIR"

echo ""
echo "✅ ¡Video creado!"
echo "📁 Archivo: $OUTPUT_FILE"

if [ -f "$OUTPUT_FILE" ]; then
    SIZE=$(du -h "$OUTPUT_FILE" | cut -f1)
    echo "📊 Tamaño: $SIZE"
    echo ""
    echo "🚀 Listo para descargar y subir a:"
    echo "   - TikTok"
    echo "   - Instagram Reels"
    echo "   - YouTube Shorts"
fi
