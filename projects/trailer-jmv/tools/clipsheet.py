# Hoja de contactos de una toma: python3 tools/clipsheet.py <clip> <cada> → out/sheet_<clip>.png
import sys, os
from PIL import Image, ImageDraw
clip, every = sys.argv[1], int(sys.argv[2])
d = f'out/clips/{clip}'
fs = sorted(f for f in os.listdir(d) if f.endswith('.png'))[::every][:24]
cols = 4; W, H = 320, 224
s = Image.new('RGB', (W * cols, (H + 12) * ((len(fs) + cols - 1) // cols)), 'black')
dr = ImageDraw.Draw(s)
for k, f in enumerate(fs):
    x, y = (k % cols) * W, (k // cols) * (H + 12)
    s.paste(Image.open(f'{d}/{f}').convert('RGB'), (x, y + 12)); dr.text((x + 2, y), f, fill='yellow')
s.save(f'out/sheet_{clip}.png')
