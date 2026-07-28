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

MERGE_GAP = 20  # px maximo de hueco para fusionar fragmentos cercanos
SMALL_TEXTY_AREA = 6000  # una pieza 'photo' pequeña asi suele ser texto mal clasificado

def _is_mergeable(p):
    if p['kind'] in ('detail', 'tape'):
        return True
    # Un sello/leyenda (p.ej. "8,000 YEARS") a veces cae en 'photo' por
    # default de classify() cuando su area supera el corte de 'detail'; si es
    # chica igual es candidata a fusionarse con el fragmento vecino.
    if p['kind'] == 'photo' and p['area'] < SMALL_TEXTY_AREA:
        return True
    return False

def merge_text_fragments(raw, gap=MERGE_GAP):
    """Las leyendas/cintas/sellos con texto quedan partidos en varios blobs
    pequenos porque el hueco entre palabras/letras es del mismo color que el
    fondo (no hay tarjeta solida detras). Se agrupan por proximidad
    (union-find) los fragmentos cercanos para que se animen como UNA sola
    pieza (la cinta/sello completo con su texto), en vez de que cada palabra
    entre volando por separado."""
    n = len(raw)
    parent = list(range(n))

    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x

    def union(a, b):
        ra, rb = find(a), find(b)
        if ra != rb:
            parent[ra] = rb

    for i in range(n):
        if not _is_mergeable(raw[i]):
            continue
        for j in range(i + 1, n):
            if not _is_mergeable(raw[j]):
                continue
            a, b = raw[i], raw[j]
            dx = max(0, b['x0'] - a['x1'], a['x0'] - b['x1'])
            dy = max(0, b['y0'] - a['y1'], a['y0'] - b['y1'])
            if dx <= gap and dy <= gap:
                union(i, j)

    groups = {}
    for i in range(n):
        groups.setdefault(find(i), []).append(i)
    return list(groups.values())

def _group_kind(raw, members):
    if len(members) == 1:
        return raw[members[0]]['kind']
    return 'tape'

def _group_bbox(raw, members):
    x0 = min(raw[m]['x0'] for m in members); y0 = min(raw[m]['y0'] for m in members)
    x1 = max(raw[m]['x1'] for m in members); y1 = max(raw[m]['y1'] for m in members)
    return x0, y0, x1, y1

def _bbox_gap(a, b):
    ax0, ay0, ax1, ay1 = a
    bx0, by0, bx1, by1 = b
    dx = max(0, bx0 - ax1, ax0 - bx1)
    dy = max(0, by0 - ay1, ay0 - by1)
    return max(dx, dy)

def absorb_lone_details(raw, groups):
    """Un fragmento de texto/detalle que no encontro con quien agruparse no
    debe animar solo: se pega al elemento mas cercano (fondo/foto/cinta) para
    viajar siempre junto a su portador, nunca como texto suelto flotando."""
    groups = [list(g) for g in groups]
    guard = 0
    changed = True
    while changed and guard < len(groups) + 5:
        changed = False
        guard += 1
        for i, members in enumerate(groups):
            if _group_kind(raw, members) != 'detail' or len(members) != 1:
                continue
            if len(groups) < 2:
                break
            bbox_i = _group_bbox(raw, members)
            best_j, best_d = None, None
            for j, other in enumerate(groups):
                if j == i or _group_kind(raw, other) == 'string':
                    continue
                d = _bbox_gap(bbox_i, _group_bbox(raw, other))
                if best_d is None or d < best_d:
                    best_d, best_j = d, j
            if best_j is not None:
                groups[best_j] = groups[best_j] + members
                groups.pop(i)
                changed = True
                break
    return groups

def process(src_path, out_dir, thresh=None):
    os.makedirs(out_dir, exist_ok=True)
    img = load(src_path)
    H, W = img.shape[:2]
    if thresh is None:
        thresh = auto_pick_threshold(img)
    bg, bg_med = background_mask(img, thresh=thresh)
    fg = clean_fg_mask(~bg)

    lbl, n = ndimage.label(fg, structure=np.ones((3, 3)))
    raw = []
    for i in range(1, n + 1):
        comp = lbl == i
        area = int(comp.sum())
        if area < MIN_AREA:
            continue
        ys, xs = np.where(comp)
        x0, y0, x1, y1 = int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1
        pad = 3
        x0p, y0p = max(0, x0 - pad), max(0, y0 - pad)
        x1p, y1p = min(W, x1 + pad), min(H, y1 + pad)
        crop = img[y0p:y1p, x0p:x1p]
        local_bool = comp[y0p:y1p, x0p:x1p]
        kind = classify(crop, local_bool, (x0p, y0p, x1p, y1p))
        raw.append({'mask': comp, 'area': area, 'kind': kind,
                     'x0': x0, 'y0': y0, 'x1': x1, 'y1': y1,
                     'x0p': x0p, 'y0p': y0p, 'x1p': x1p, 'y1p': y1p})

    groups = merge_text_fragments(raw)
    groups = absorb_lone_details(raw, groups)
    pieces = []
    for gi, members in enumerate(groups, start=1):
        name = f"p{gi:02d}"
        # "portador real" = una foto o cinta genuina (no otro fragmento de texto
        # mal clasificado como 'photo' por ser un poco grande, p.ej. un sello).
        real_host = [m for m in members
                     if raw[m]['kind'] == 'tape'
                     or (raw[m]['kind'] == 'photo' and raw[m]['area'] >= SMALL_TEXTY_AREA)]
        if len(members) == 1:
            r = raw[members[0]]
            x0p, y0p, x1p, y1p = r['x0p'], r['y0p'], r['x1p'], r['y1p']
            bool_mask = r['mask'][y0p:y1p, x0p:x1p]
            kind = r['kind']
            area = r['area']
        elif not real_host:
            # cluster de puro texto/sello sin un portador real cerca: se
            # exporta como tarjeta solida (rectangulo, con margen generoso
            # para capturar bordes finos como el recuadro de un sello) para
            # que viaje como un solo objeto completo.
            x0 = min(raw[m]['x0'] for m in members); y0 = min(raw[m]['y0'] for m in members)
            x1 = max(raw[m]['x1'] for m in members); y1 = max(raw[m]['y1'] for m in members)
            pad = 26
            x0p, y0p = max(0, x0 - pad), max(0, y0 - pad)
            x1p, y1p = min(W, x1 + pad), min(H, y1 + pad)
            bool_mask = np.ones((y1p - y0p, x1p - x0p), bool)
            kind = 'tape'
            area = int(bool_mask.sum())
        else:
            # texto/fragmento absorbido por su portador real (foto o cinta):
            # se mantiene la silueta natural del portador, solo se le pega el
            # fragmento encima en su posicion real, sin rectangularizar.
            host = max(real_host, key=lambda m: raw[m]['area'])
            x0 = min(raw[m]['x0'] for m in members); y0 = min(raw[m]['y0'] for m in members)
            x1 = max(raw[m]['x1'] for m in members); y1 = max(raw[m]['y1'] for m in members)
            pad = 3
            x0p, y0p = max(0, x0 - pad), max(0, y0 - pad)
            x1p, y1p = min(W, x1 + pad), min(H, y1 + pad)
            bool_mask = np.zeros((y1p - y0p, x1p - x0p), bool)
            for m in members:
                bool_mask |= raw[m]['mask'][y0p:y1p, x0p:x1p]
            kind = raw[host]['kind']
            area = int(bool_mask.sum())
        local_mask = bool_mask.astype(np.uint8) * 255
        local_mask = cv2.GaussianBlur(local_mask, (0, 0), 1.2)
        crop = img[y0p:y1p, x0p:x1p]
        rgba = cv2.cvtColor(crop, cv2.COLOR_BGR2RGBA)
        rgba[..., 3] = local_mask
        Image.fromarray(rgba, 'RGBA').save(f"{out_dir}/{name}.png")
        meta = {'name': name, 'x': int(x0p), 'y': int(y0p), 'w': int(x1p - x0p),
                'h': int(y1p - y0p), 'area': area, 'kind': kind}
        if kind == 'string':
            anchors = string_anchors(bool_mask, (x0p, y0p, x1p, y1p))
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
