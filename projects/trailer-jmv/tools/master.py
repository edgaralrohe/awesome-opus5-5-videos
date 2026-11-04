# Máster a −14 LUFS con limitador de anticipación (techo −1,5 dBFS de pico verdadero aprox., 4× sobremuestreo).
# Uso: python tools/master.py out/mix.wav out/master.wav
import sys, subprocess, re
import numpy as np, soundfile as sf
from scipy.signal import resample_poly
from scipy.ndimage import maximum_filter1d, uniform_filter1d

x, sr = sf.read(sys.argv[1]); x = x.astype(np.float64)
CEIL = 10 ** (-1.5 / 20)

def limit(y):
    up = resample_poly(y, 4, 1, axis=0)
    pk = np.abs(up).max(1).reshape(-1, 4).max(1)[: len(y)]          # pico entre muestras
    look = int(0.005 * sr)
    need = np.minimum(1.0, CEIL / np.maximum(pk, 1e-9))
    g = -maximum_filter1d(-need, size=2 * look + 1)                  # mínimo en la ventana
    g = uniform_filter1d(g, size=look)                               # suavizado del ataque
    g = np.minimum(g, 1.0)
    # liberación de 80 ms
    rel = np.exp(-1 / (0.08 * sr)); out = np.empty_like(g); acc = 1.0
    for i, v in enumerate(g):
        acc = v if v < acc else v + (acc - v) * rel
        out[i] = acc
    return y * out[:, None]

def lufs(path):
    r = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', path, '-af', 'ebur128=peak=true', '-f', 'null', '-'], capture_output=True, text=True).stderr
    s = r[r.rfind('Summary:'):]
    return float(re.search(r'I:\s+(-?[\d.]+) LUFS', s).group(1)), float(re.search(r'Peak:\s+(-?[\d.]+) dBFS', s).group(1))

gain = 1.0
for it in range(6):
    y = limit(x * gain)
    sf.write(sys.argv[2], y.astype(np.float32), sr, subtype='FLOAT')
    I, tp = lufs(sys.argv[2])
    print(f'pasada {it}: {I} LUFS, pico verdadero {tp} dBFS')
    if abs(I + 14) < 0.2: break
    gain *= 10 ** ((-14 - I) / 20)
