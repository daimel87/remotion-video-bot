# Documental: ¿Por qué desapareció el CD?

Máster final en 1080p (11:34), sin recomprimir. Por el límite de 100 MB por
archivo de GitHub, el video se subió partido en 5 trozos. Se reúnen en 1 solo
archivo (byte a byte idéntico al máster, sin pérdida de calidad).

## Reunir el video

**Windows (CMD):**
```cmd
copy /b cd.part-00+cd.part-01+cd.part-02+cd.part-03+cd.part-04 por-que-desaparecio-el-cd.mp4
```

**Windows (PowerShell):**
```powershell
cmd /c copy /b cd.part-00+cd.part-01+cd.part-02+cd.part-03+cd.part-04 por-que-desaparecio-el-cd.mp4
```

**macOS / Linux:**
```bash
cat cd.part-* > por-que-desaparecio-el-cd.mp4
```

## Verificar (opcional)
SHA-256 del máster reunido:
```
9ed30fe6786f6b37d57fa83e4164654d69b41eeedc9936a8bee9ffe79b18439f
```
Windows: `certutil -hashfile por-que-desaparecio-el-cd.mp4 SHA256`
