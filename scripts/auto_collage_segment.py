#!/usr/bin/env python3
"""
Separador automatico de capas para collages de papel (estilo Vox).
Para cada imagen: detecta el fondo (region conectada al borde con color
similar), extrae cada elemento restante como pieza RGBA independiente,
reconstruye el "plato vacio" de papel, y clasifica cada pieza (hero/
photo, tape, string, detail) para elegir su animacion de entrada.
"""
import sys, os, json
import numpy as np
import cv2
from PIL import Image
from scipy import ndimage

MIN_AREA = 380  # px^2 minimo para contar como pieza (si no, es ruido/grano)

def load(path):
    img = cv2.imread(path)
    if img is None:
        raise RuntimeError(f"no se pudo leer {path}")
    return img

def _masked_blur(chan, weight, k):
    num = cv2.boxFilter(chan * weight, -1, (k, k))
    den = cv2.boxFilter(weight, -1, (k, k))
    den[den < 1e-6] = 1e-6
    return num / den

def background_mask(img, thresh=12, border=4, seed_thresh=5, blur_k=81):
    """Modelo de fondo TOLERANTE A VIÑETAS/GRADIENTES: en vez de comparar
    contra un solo color global, se estima un fondo LOCAL suavizado
    (ignorando candidatos a primer plano) y se compara cada pixel contra
    su propio entorno. Esto separa piezas del mismo tono que el fondo
    (p.ej. una tarjeta de papel envejecido sobre papel envejecido)."""
    H, W = img.shape[:2]
    lab = cv2.cvtColor(img, cv2.COLOR_BGR2LAB).astype(np.float32)
    ring = np.zeros((H, W), bool)
    ring[:border, :] = True; ring[-border:, :] = True
    ring[:, :border] = True; ring[:, -border:] = True
    bg_med = np.median(lab[ring], axis=0)
    diff0 = np.linalg.norm(lab - bg_med[None, None, :], axis=2)
    rough_fg = diff0 > seed_thresh
    weight = (~rough_fg).astype(np.float32)
    smooth_bg = np.stack([_masked_blur(lab[..., c], weight, blur_k) for c in range(3)], axis=-1)
    resid = np.linalg.norm(lab - smooth_bg, axis=2)
    cand = resid < thresh
    lbl, n = ndimage.label(cand, structure=np.ones((3, 3)))
    border_labels = set(lbl[0, :]) | set(lbl[-1, :]) | set(lbl[:, 0]) | set(lbl[:, -1])
    border_labels.discard(0)
    bg = np.isin(lbl, list(border_labels))
    return bg, bg_med

CANDIDATE_THRESHOLDS = [7, 8, 10, 12, 14, 17, 20, 25, 30, 40, 55]

def auto_pick_threshold(img):
    """Prueba varios umbrales y elige el que da la silueta mas 'limpia':
    ni ruido de grano fusionado en un blob gigante (umbral muy laxo), ni
    nada detectado (muy estricto). Puntua cada candidato y se queda con
    el mejor, en vez de un umbral fijo (los fondos varian mucho: papel
    piano, mapas, viñetas...)."""
    H, W = img.shape[:2]
    total = H * W
    best_t, best_score = None, -1e18
    for t in CANDIDATE_THRESHOLDS:
        bg, _ = background_mask(img, thresh=t)
        fg = clean_fg_mask(~bg)
        fg_frac = fg.mean()
        lbl, n = ndimage.label(fg, structure=np.ones((3, 3)))
        if n == 0:
            continue
        sizes = ndimage.sum(np.ones_like(lbl), lbl, range(1, n + 1))
        n_substantial = int((sizes > MIN_AREA).sum())
        largest_frac = sizes.max() / total
        if n_substantial == 0:
            continue
        score = 0.0
        score -= abs(fg_frac - 0.22) * 6.0
        if n_substantial > 22:
            score -= (n_substantial - 22) * 0.15
        if largest_frac > 0.55:
            score -= (largest_frac - 0.55) * 12.0
        if fg_frac > 0.6:
            score -= (fg_frac - 0.6) * 20.0
        if score > best_score:
            best_score = score
            best_t = t
    return best_t if best_t is not None else 12

def clean_fg_mask(fg, min_area=MIN_AREA):
    fg8 = fg.astype(np.uint8) * 255
    fg8 = cv2.morphologyEx(fg8, cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
    fg8 = cv2.morphologyEx(fg8, cv2.MORPH_CLOSE, np.ones((9, 9), np.uint8))
    fg8 = cv2.morphologyEx(fg8, cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
    return fg8 > 0

def rowwise_fill(img, holes_mask):
    H, W = img.shape[:2]
    clean = ~holes_mask
    result = img.astype(np.float32).copy()
    for y in range(H):
        row_clean = clean[y]
        if row_clean.sum() == 0:
            continue
        xs_clean = np.where(row_clean)[0]
        xs_all = np.arange(W)
        for c in range(3):
            vals = img[y, :, c].astype(np.float32)
            filled = np.interp(xs_all, xs_clean, vals[xs_clean])
            result[y, :, c] = np.where(row_clean, vals, filled)
    return result

def classify(piece_bgr, mask, bbox):
    x0, y0, x1, y1 = bbox
    w, h = x1 - x0, y1 - y0
    area = int(mask.sum())
    hsv = cv2.cvtColor(piece_bgr, cv2.COLOR_BGR2HSV).astype(np.float32)
    m = mask.astype(bool)
    if m.sum() == 0:
        return 'detail'
    hue = hsv[..., 0][m]; sat = hsv[..., 1][m]; val = hsv[..., 2][m]
    red_frac = float((((hue < 12) | (hue > 168)) & (sat > 90) & (val > 50)).mean())
    aspect = max(w, h) / max(1, min(w, h))
    fill_ratio = area / max(1, w * h)
    if red_frac > 0.25 and aspect > 2.5:
        return 'string'
    if area < 1600:
        return 'detail'
    yellow_frac = float(((hue > 15) & (hue < 40) & (sat > 40) & (sat < 200)).mean())
    if aspect > 1.8 and fill_ratio > 0.55 and yellow_frac > 0.3 and area < 9000:
        return 'tape'
    return 'photo'

def string_anchors(mask, bbox):
    ys, xs = np.where(mask)
    if len(xs) < 2:
        return None
    pts = np.stack([xs, ys], axis=1).astype(np.float32)
    mean = pts.mean(axis=0)
    _, _, vt = np.linalg.svd(pts - mean, full_matrices=False)
    axis = vt[0]
    proj = (pts - mean) @ axis
    i0, i1 = proj.argmin(), proj.argmax()
    p0, p1 = pts[i0], pts[i1]
    x0, y0, _, _ = bbox
    return [float(p0[0] - x0), float(p0[1] - y0)], [float(p1[0] - x0), float(p1[1] - y0)]

def process(src_path, out_dir, thresh=None):
    os.makedirs(out_dir, exist_ok=True)
    img = load(src_path)
    H, W = img.shape[:2]
    if thresh is None:
        thresh = auto_pick_threshold(img)
    bg, bg_med = background_mask(img, thresh=thresh)
    fg = clean_fg_mask(~bg)

    lbl, n = ndimage.label(fg, structure=np.ones((3, 3)))
    pieces = []
    for i in range(1, n + 1):
        comp = lbl == i
        area = int(comp.sum())
        if area < MIN_AREA:
            continue
        ys, xs = np.where(comp)
        x0, y0, x1, y1 = xs.min(), ys.min(), xs.max() + 1, ys.max() + 1
        pad = 3
        x0p, y0p = max(0, x0 - pad), max(0, y0 - pad)
        x1p, y1p = min(W, x1 + pad), min(H, y1 + pad)
        local_mask = comp[y0p:y1p, x0p:x1p].astype(np.uint8) * 255
        local_mask = cv2.GaussianBlur(local_mask, (0, 0), 1.2)
        crop = img[y0p:y1p, x0p:x1p]
        rgba = cv2.cvtColor(crop, cv2.COLOR_BGR2RGBA)
        rgba[..., 3] = local_mask
        kind = classify(crop, comp[y0p:y1p, x0p:x1p], (x0p, y0p, x1p, y1p))
        name = f"p{i:02d}"
        Image.fromarray(rgba, 'RGBA').save(f"{out_dir}/{name}.png")
        meta = {'name': name, 'x': int(x0p), 'y': int(y0p), 'w': int(x1p - x0p),
                'h': int(y1p - y0p), 'area': area, 'kind': kind}
        if kind == 'string':
            anchors = string_anchors(comp[y0p:y1p, x0p:x1p], (x0p, y0p, x1p, y1p))
            if anchors:
                meta['p0'], meta['p1'] = anchors
        pieces.append(meta)

    pieces.sort(key=lambda p: -p['area'])

    holes = cv2.dilate((fg).astype(np.uint8) * 255, np.ones((7, 7), np.uint8)) > 0
    filled = rowwise_fill(img, holes)
    mask3 = cv2.merge([holes.astype(np.uint8) * 255] * 3).astype(np.float32) / 255.0
    mask3 = cv2.GaussianBlur(mask3, (0, 0), 4)
    blurred = cv2.GaussianBlur(filled.astype(np.uint8), (0, 0), 2.0)
    mixed = filled * (1 - mask3) + blurred.astype(np.float32) * mask3
    rng = np.random.default_rng(abs(hash(src_path)) % (2**31))
    noise = rng.normal(0, 4.0, size=(H, W, 1))
    mixed = mixed + noise * mask3
    mixed = np.clip(mixed, 0, 255).astype(np.uint8)
    mask3_soft = cv2.GaussianBlur(mask3, (0, 0), 5)
    final_bg = (img.astype(np.float32) * (1 - mask3_soft) + mixed.astype(np.float32) * mask3_soft).astype(np.uint8)
    cv2.imwrite(f"{out_dir}/bg-clean.jpg", final_bg, [cv2.IMWRITE_JPEG_QUALITY, 92])

    with open(f"{out_dir}/pieces.json", 'w') as f:
        json.dump({'source_w': W, 'source_h': H, 'pieces': pieces}, f, indent=2)
    return len(pieces), thresh

if __name__ == '__main__':
    src, out = sys.argv[1], sys.argv[2]
    thresh = float(sys.argv[3]) if len(sys.argv) > 3 else None
    n, used_t = process(src, out, thresh)
    print(f"OK {src} -> {out} ({n} piezas, thresh={used_t})")
