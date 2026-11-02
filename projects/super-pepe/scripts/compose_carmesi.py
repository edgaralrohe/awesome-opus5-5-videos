#!/usr/bin/env python3
"""Compone hojas limpias (un fotograma por figura, fondo gris liso) a partir del concepto de Gemini
del Mundo 1 para pasarlas por scripts/slice_sheet.py. PROVISIONAL: el arte final será una hoja
lateral, sin sombras ni texto, por personaje (art/PROMPTS-GEMINI.md).

Uso: python3 scripts/compose_carmesi.py   →  art/source/carmesi/enemigos-sheet.png y flashbot-sheet.png
"""
import sys, os
import numpy as np
from PIL import Image
sys.path.insert(0, os.path.dirname(__file__))
from slice_sheet import components

SRC = 'art/source/carmesi/concepto-jefe-enemigos.jpg'
BG = (76, 76, 76)
im = np.asarray(Image.open(SRC).convert('RGB')).astype(np.int16)
mask = np.abs(im - np.array(BG)).sum(axis=2) > 30
comps = [c for c in components(mask) if c[4] >= 30]

def figure(box, scale, shadow_from=None):
    """Recorta las componentes cuyo centro cae dentro de `box` (x0,y0,x1,y1) y quita la sombra del suelo."""
    x0, y0, x1, y1 = box
    rgba = np.zeros((y1 - y0, x1 - x0, 4), np.uint8)
    for c in comps:
        cx, cy = (c[0] + c[2]) / 2, (c[1] + c[3]) / 2
        if not (x0 <= cx < x1 and y0 <= cy < y1): continue
        for (y, a, b) in c[5]:
            if y0 <= y < y1:
                a2, b2 = max(a, x0), min(b, x1)
                if a2 < b2:
                    rgba[y - y0, a2 - x0:b2 - x0, :3] = im[y, a2:b2]
                    rgba[y - y0, a2 - x0:b2 - x0, 3] = 255
    if shadow_from is not None:
        # Sombra elíptica: gris neutro oscuro en la franja inferior.
        rgb = rgba[..., :3].astype(int)
        v = rgb.mean(axis=2); sat = rgb.max(axis=2) - rgb.min(axis=2)
        sh = (v > 30) & (v < 66) & (sat < 10)
        sh[: int((y1 - y0) * shadow_from)] = False
        rgba[sh, 3] = 0
    img = Image.fromarray(rgba, 'RGBA')
    return img.resize((max(1, round(img.width * scale)), max(1, round(img.height * scale))), Image.LANCZOS)

def sheet(figs, out, gap=220):
    figs = [f.crop(f.getbbox()) for f in figs]
    H = max(f.height for f in figs) + 2 * gap
    W = sum(f.width for f in figs) + gap * (len(figs) + 1)
    canvas = Image.new('RGB', (W, H), BG)
    x = gap
    for f in figs:
        canvas.paste(f, (x, H - gap - f.height), f)  # todos apoyados en la misma línea
        x += f.width + gap
    canvas.save(out)
    print(out, canvas.size)

# Coordenadas en píxeles del concepto (2752×1536).
sheet([
    figure((1800, 228, 2184, 470), 1.0),        # traidorHover  (Espera)
    figure((1848, 496, 2144, 822), 0.85),       # traidorAtk    (Ataque)
    figure((2160, 540, 2470, 722), 0.85),       # traidorKo     (Derrota)
    figure((1808, 965, 2092, 1290), 0.62),      # rumorFly      (Vuelo)
    figure((2116, 1110, 2396, 1395), 0.62),     # rumorAtk      (Ataque)
    figure((2364, 1270, 2712, 1470), 0.62),     # rumorKo       (Derrota)
], 'art/source/carmesi/enemigos-sheet.png')

sheet([
    figure((56, 240, 1012, 1356), 0.62, shadow_from=0.80),   # bossIdle   (pose principal)
    figure((1136, 812, 1636, 1412), 1.2, shadow_from=0.80),  # bossHurt   (Daño / punto débil)
], 'art/source/carmesi/flashbot-sheet.png')
