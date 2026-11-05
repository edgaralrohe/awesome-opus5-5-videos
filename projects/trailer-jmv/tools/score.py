# Chiptune original y foley del tráiler (TREATMENT §6–7), sintetizados con numpy desde src/timeline.js.
# Uso: python tools/score.py out/timeline.json out/mix.wav
import sys, json
import numpy as np
import soundfile as sf

SR = 48000
tl = json.load(open(sys.argv[1]))
DUR, BEAT = tl['DUR'], tl['BEAT']
N = int(DUR * SR)
music = np.zeros((N, 2)); fx = np.zeros((N, 2))
rng = np.random.default_rng(7)

def midi(m): return 440.0 * 2 ** ((m - 69) / 12)
def env(n, a=0.004, r=0.04, sus=1.0):
    e = np.ones(n) * sus
    na, nr = max(1, int(a * SR)), max(1, int(r * SR))
    e[:na] = np.linspace(0, 1, na) * sus if n > na else e[:na]
    if n > nr: e[-nr:] *= np.linspace(1, 0, nr)
    return e
def pulse(f, n, duty, vib=0.0):
    t = np.arange(n) / SR
    ph = np.cumsum(f * (1 + vib * np.sin(2 * np.pi * 5.5 * t)) / SR) % 1
    return np.where(ph < duty, 1.0, -1.0)
def tri4(f, n):
    ph = (np.arange(n) * f / SR) % 1
    x = 2 * np.abs(2 * ph - 1) - 1
    return np.round(x * 7.5) / 7.5          # triángulo de 4 bits
def lfsr_noise(n, short=False):
    reg, out, period = 1, np.empty(n), 4 if short else 1
    vals = []
    for i in range(0, n, period):
        bit = (reg ^ (reg >> (6 if short else 1))) & 1
        reg = (reg >> 1) | (bit << 14)
        vals.append(1.0 if reg & 1 else -1.0)
    return np.repeat(np.array(vals), period)[:n]
NOISE = lfsr_noise(SR)
NOISE_S = lfsr_noise(SR, True)

def put(buf, x, t, gain=1.0, pan=0.0):
    i = int(round(t * SR))
    if i >= N or i + len(x) <= 0: return
    x = x[: N - i] * gain
    buf[i:i + len(x), 0] += x * np.sqrt((1 - pan) / 2) * 1.414
    buf[i:i + len(x), 1] += x * np.sqrt((1 + pan) / 2) * 1.414

def note(buf, m, t, d, wave='p25', gain=0.15, pan=0.0, vib=0.0, r=0.05):
    n = int(d * SR)
    if wave == 'tri': x = tri4(midi(m), n)
    else: x = pulse(midi(m), n, {'p12': 0.125, 'p25': 0.25, 'p50': 0.5}[wave], vib)
    put(buf, x * env(n, r=r), t, gain, pan)

def kick(t, g=0.3):
    n = int(0.16 * SR); tt = np.arange(n) / SR
    f = 50 + 110 * np.exp(-tt * 40)
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 18)
    put(music, x, t, g)
def snare(t, g=0.22):
    n = int(0.14 * SR); put(music, NOISE[:n] * np.exp(-np.arange(n) / SR * 26), t, g)
def hat(t, g=0.06, pan=0.3):
    n = int(0.03 * SR); put(music, NOISE_S[:n] * np.exp(-np.arange(n) / SR * 120), t, g, pan)

# --- armonía: re menor (i–VI–VII–V) y re mayor para el final ---
MINOR = [(50, [62, 65, 69]), (46, [58, 62, 65]), (48, [60, 64, 67]), (45, [57, 61, 64])]
MAJOR = [(50, [62, 66, 69]), (46, [58, 62, 65]), (48, [60, 64, 67]), (50, [62, 66, 69])]
# Motivo A (original), 16 corcheas = 2 compases. None = silencio.
MOTIF = [74, None, 77, 81, 79, 77, 76, 72, 74, None, 69, None, 72, 74, 76, 77]
MOTIF_B = [74, None, 77, 81, 79, 77, 76, 79, 81, None, 77, None, 76, 74, 73, 74]
BAR = 4 * BEAT
E8 = BEAT / 2

def lead(t0, bars, motif_major=False, wave='p25', gain=0.11, oct=0, vib=0.0, half=False, stop=None):
    for b in range(0, bars, 2):
        mot = MOTIF if (b // 2) % 2 == 0 else MOTIF_B
        for k, m in enumerate(mot):
            t = t0 + b * BAR + k * E8 * (2 if half else 1)
            if half and t >= t0 + bars * BAR: break
            if m is None or (stop and t >= stop): continue
            if motif_major and m in (77, 65): m += 1          # fa → fa#
            note(music, m + oct, t, E8 * (2 if half else 1) * 0.9, wave, gain, -0.15, vib)

def bass(t0, bars, prog, eighths=True, stop=None, wave='tri', gain=0.12, oct=-12):
    for b in range(bars):
        root = prog[b % 4][0]
        steps = 8 if eighths else 4
        for k in range(steps):
            t = t0 + b * BAR + k * BAR / steps
            if stop and t >= stop: return
            m = root + oct + (12 if (eighths and k % 2) else 0)
            note(music, m, t, BAR / steps * 0.85, wave, gain)

def arp(t0, bars, prog, wave='p12', gain=0.06, stop=None, up=False):
    for b in range(bars):
        ch = prog[b % 4][1]
        for k in range(16):
            t = t0 + b * BAR + k * BEAT / 4
            if stop and t >= stop: return
            m = ch[k % 3] + 12 * ((k // 3) % 2 if up else 0)
            note(music, m + 12, t, BEAT / 4 * 0.8, wave, gain, 0.35)

def drums(t0, bars, half=False, stop=None, hats=True):
    for b in range(bars):
        for k in range(8):
            t = t0 + b * BAR + k * E8
            if stop and t >= stop: return
            if half:
                if k == 0: kick(t)
                if k == 4: snare(t)
            else:
                if k in (0, 3, 4): kick(t, 0.27)
                if k in (2, 6): snare(t)
            if hats and k % 2 == 1: hat(t)

S = {s['id']: s for s in tl['SECS']}
st = tl['PALETTE_STEPS']
# Premisa (0–10): misterio — bajo a negras y arpegio, sin batería; el motivo entra suave en el compás 4.
bass(0, 5, MINOR, eighths=False); arp(0, 5, MINOR, gain=0.05)
lead(6, 4, wave='p12', gain=0.06, half=True)
for k in range(8): snare(9.0 + k * BEAT / 4, 0.06 + k * 0.02)          # redoble hacia «cómo se juega»
# Cómo se juega (10–26): toda la banda.
lead(10, 8); bass(10, 8, MINOR); arp(10, 8, MINOR); drums(10, 8)
note(music, 74, 10, BAR * 8, 'p50', 0.02, 0.4)                          # pedal agudo
# Carmesí (26–30): banda; una capa menos por paso de paleta y silencio total en S.carmesi.silence.
lead(26, 2, stop=st[0]); arp(26, 2, MINOR, stop=st[1]); drums(26, 2, stop=st[2]); bass(26, 2, MINOR, stop=S['carmesi']['silence'])
# Noche (30–38): el motivo a medio tiempo y más oscuro; campanada grave en cada toma.
lead(30, 4, wave='p50', gain=0.08, oct=-12, vib=0.012, half=True)
bass(30, 4, MINOR, eighths=False, gain=0.14)
drums(30, 4, half=True)
for t in (30, 32, 34, 36):
    n = int(1.6 * SR); tt = np.arange(n) / SR
    put(music, (np.sin(2 * np.pi * midi(50) * tt) + 0.5 * np.sin(2 * np.pi * midi(50) * 2.76 * tt)) * np.exp(-tt * 2.2), t, 0.12)
# Recuerdo (38–40): arpegio ascendente en re mayor.
arp(38, 1, MAJOR, wave='p25', gain=0.07, up=True); bass(38, 1, MAJOR, eighths=False)
# Cierre (40–44): el motivo en mayor y acorde final.
lead(40, 1, motif_major=True, wave='p50', gain=0.09); bass(40, 1, MAJOR); arp(40, 1, MAJOR, gain=0.05); drums(40, 1)
for m in (62, 66, 69, 74): note(music, m, 42, 1.8, 'p25', 0.07, r=1.0)
note(music, 50, 42, 1.8, 'tri', 0.18, r=1.0); kick(42, 0.3)

# --- eco de 16 bits: dos tomas, realimentación 0,4 con paso bajo; estéreo cruzado ---
def echo(x):
    y = x.copy()
    for d, g, cross in ((0.18, 0.32, True), (0.37, 0.22, False)):
        k = int(d * SR)
        for _ in range(3):
            sh = np.zeros_like(y); sh[k:] = y[:-k] * g
            for c in range(2):  # paso bajo de un polo
                a = 0.25; v = sh[:, c]; out = np.empty_like(v); acc = 0.0
                out = np.convolve(v, [a, 1 - a], mode='same')
                sh[:, c] = out
            if cross: sh = sh[:, ::-1]
            y = x + sh; g *= 0.4
    return y
music = echo(music)
# Silencio de verdad (también el eco): 15,5–16,0 y desde las 33,9.
def mute(a, b, buf):
    i, j = int(a * SR), min(N, int(b * SR)); buf[i:j] = 0
mute(S['carmesi']['silence'], 30.0, music); mute(DUR - 0.1, DUR, music)

# --- foley desde los eventos ---
def blip(t, p=2):
    n = int(0.035 * SR); put(fx, pulse(midi(84 + p), n, 0.25) * env(n, r=0.02), t, 0.05, 0.1)
def cursor(t):
    n = int(0.04 * SR); put(fx, pulse(midi(88), n, 0.5) * env(n, r=0.03), t, 0.06)
def select(t):
    for k, m in enumerate((84, 91)): n = int(0.06 * SR); put(fx, pulse(midi(m), n, 0.25) * env(n, r=0.03), t + k * 0.05, 0.07)
def swoosh(t):
    n = int(0.35 * SR); tt = np.arange(n) / SR; e = np.sin(np.pi * tt / tt[-1]) ** 2
    put(fx, NOISE[:n] * e * np.linspace(0.3, 1, n), t - 0.2, 0.05)
def bitdrop(t, k):
    n = int(0.12 * SR); f = midi(76 - k * 4) * np.linspace(1, 0.5, n)
    put(fx, np.where((np.cumsum(f) / SR) % 1 < 0.5, 1.0, -1.0) * env(n, r=0.05), t, 0.07)
def fanfare(t, major=True):
    for k, m in enumerate((74, 78 if major else 77, 81, 86)): note(fx, m, t + k * 0.09, 0.3 if k == 3 else 0.09, 'p25', 0.07)
def tick(t):
    n = int(0.03 * SR); put(fx, pulse(midi(96), n, 0.5) * env(n, r=0.02), t, 0.05)
def hit(t):
    n = int(0.2 * SR); tt = np.arange(n) / SR
    put(fx, (NOISE[:n] * 0.6 + np.sin(2 * np.pi * 90 * tt)) * np.exp(-tt * 22), t, 0.25)
def wind(t, d=6.2):
    n = int(d * SR); x = np.convolve(rng.standard_normal(n), np.ones(400) / 400, mode='same') * 6
    e = np.minimum(1, np.arange(n) / (0.4 * SR)) * np.minimum(1, (n - np.arange(n)) / (0.6 * SR)) * (0.6 + 0.4 * np.sin(np.arange(n) / SR * 1.3))
    put(fx, x * e, t, 0.05, -0.3)
def crowd(t, d=4.0):
    n = int(d * SR); x = np.convolve(rng.standard_normal(n), np.ones(60) / 60, mode='same') * 3
    swell = np.sin(np.pi * np.arange(n) / n) ** 0.6
    put(fx, x * swell, t, 0.05, 0.2)
nb = 0
for e in tl['EV']:
    ty, t = e['type'], e['t']
    if ty == 'blip': blip(t)
    elif ty == 'cursor': cursor(t)
    elif ty == 'select': select(t)
    elif ty == 'mosaic': swoosh(t)
    elif ty == 'bitdrop': bitdrop(t, nb); nb += 1
    elif ty == 'fanfare': fanfare(t, major=t < 30)
    elif ty == 'levelup': fanfare(t, True); fanfare(t + 0.4, True)
    elif ty == 'tick': tick(t)
    elif ty == 'start': select(t)
    elif ty == 'wind': wind(t, 8.0)
    elif ty == 'crowd': crowd(t)
for t in tl.get('HITS', []): hit(t)
mute(S['carmesi']['silence'], 30.0, fx); mute(DUR - 0.1, DUR, fx)

mix = music * 0.9 + fx
mix /= max(1e-9, np.abs(mix).max()) / 0.7
sf.write(sys.argv[2], mix.astype(np.float32), SR)
print(sys.argv[2], f'{DUR}s', 'pico', round(float(np.abs(mix).max()), 3))
