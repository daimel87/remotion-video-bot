#!/usr/bin/env python3
"""Synthesize (from scratch, numpy only) a stereo SFX bed for the AtomOS 11
review edit. Every cue is pinned to the timestamp of its on-screen animation.
Levels are conservative: the voice-over is priority.

Usage: python3 make_sfx.py <out.wav> [total_seconds]
"""
import sys
import numpy as np
import wave

SR = 44100
OUT = sys.argv[1] if len(sys.argv) > 1 else "sfx.wav"
TOTAL = float(sys.argv[2]) if len(sys.argv) > 2 else 334.72

N = int(TOTAL * SR)
bed = np.zeros((N, 2), dtype=np.float64)
rng = np.random.default_rng(11)


def add(sig, t, gain=1.0, pan=0.0):
    if sig.ndim == 1:
        l = np.cos((pan + 1) * np.pi / 4)
        r = np.sin((pan + 1) * np.pi / 4)
        stereo = np.stack([sig * l, sig * r], axis=1)
    else:
        stereo = sig
    start = int(t * SR)
    end = min(N, start + stereo.shape[0])
    if start >= N:
        return
    bed[start:end] += stereo[: end - start] * gain


def env(n, attack, release, hold=0.0):
    a = max(1, int(attack * SR))
    h = int(hold * SR)
    r = max(1, int(release * SR))
    total = a + h + r
    e = np.ones(total)
    e[:a] = np.linspace(0, 1, a) ** 1.5
    e[a + h:] = np.linspace(1, 0, r) ** 1.8
    if n > total:
        e = np.concatenate([e, np.zeros(n - total)])
    return e[:n]


def lp(x, cutoff):
    a = np.exp(-2 * np.pi * cutoff / SR)
    y = np.empty_like(x)
    acc = 0.0
    for i in range(len(x)):
        acc = a * acc + (1 - a) * x[i]
        y[i] = acc
    return y


def hp(x, cutoff):
    return x - lp(x, cutoff)


def tone(f, n, kind="sine", phase=0.0):
    t = np.arange(n) / SR
    if kind == "sine":
        return np.sin(2 * np.pi * f * t + phase)
    return np.sin(2 * np.pi * f * t + phase)


# ---------------------------------------------------------------------------
# Timbres
# ---------------------------------------------------------------------------
def tick():
    n = int(0.03 * SR)
    noise = rng.standard_normal(n)
    body = hp(lp(noise, 6000), 1500)
    body += 0.5 * tone(2400, n)
    return body * env(n, 0.001, 0.028)


def key():
    n = int(0.035 * SR)
    noise = rng.standard_normal(n)
    body = lp(noise, 3500)
    body += 0.4 * tone(1400, n)
    return body * env(n, 0.001, 0.03)


def pop():
    n = int(0.11 * SR)
    f = np.linspace(440, 940, n)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR)
    s += 0.3 * np.sin(2 * np.pi * np.cumsum(f * 2) / SR)
    return s * env(n, 0.004, 0.1)


def blip():
    n = int(0.09 * SR)
    s = tone(760, n) + 0.6 * tone(1140, n)
    return s * env(n, 0.003, 0.085)


def whoosh(dur=0.42, bright=2600):
    n = int(dur * SR)
    noise = rng.standard_normal(n)
    band = hp(lp(noise, bright), 700)
    return band * env(n, dur * 0.4, dur * 0.55)


def swipe(dur=0.22):
    n = int(dur * SR)
    noise = rng.standard_normal(n)
    band = hp(lp(noise, 4000), 1200)
    return band * env(n, 0.01, dur - 0.02)


def riser(dur=1.2):
    n = int(dur * SR)
    t = np.arange(n) / SR
    noise = rng.standard_normal(n)
    lp_c = lp(noise, 900)
    hp_c = hp(noise, 2000)
    body = lp_c * (1 - t / dur) + hp_c * (t / dur)
    sub = np.sin(2 * np.pi * np.cumsum(np.linspace(40, 74, n)) / SR) * (t / dur)
    ramp = (t / dur) ** 1.5
    return (body * 0.7 + sub * 0.6) * ramp


def impact():
    n = int(0.32 * SR)
    t = np.arange(n) / SR
    thump = np.sin(2 * np.pi * np.cumsum(np.linspace(120, 55, n)) / SR)
    body = 0.5 * tone(90, n)
    noise = hp(rng.standard_normal(n), 3000) * np.exp(-t * 40)
    e = env(n, 0.002, 0.31)
    return thump * e + body * e + noise * 0.4


def chime(root=1046.0, dur=0.9):
    n = int(dur * SR)
    t = np.arange(n) / SR
    partials = [(1, 1.0), (2.0, 0.5), (3.01, 0.28), (4.2, 0.16), (5.4, 0.09)]
    s = np.zeros(n)
    for mult, amp in partials:
        s += amp * np.sin(2 * np.pi * root * mult * t) * np.exp(-t * (2.2 + mult * 0.5))
    return s / np.max(np.abs(s) + 1e-9)


def success():
    a = chime(880, 0.5)
    b = chime(1319, 0.9)
    out = np.zeros(int(1.2 * SR))
    out[: len(a)] += a * 0.8
    off = int(0.14 * SR)
    out[off: off + len(b)] += b
    return out / np.max(np.abs(out) + 1e-9)


def charge(dur, start_f=320, end_f=1600):
    n = int(dur * SR)
    out = np.zeros(n + int(0.9 * SR))
    positions = []
    x, gap = 0.0, 0.16
    while x < dur - 0.05:
        positions.append(x)
        gap = max(gap * 0.93, 0.028)
        x += gap
    for tp in positions:
        frac = tp / dur
        f = start_f + (end_f - start_f) * frac
        pn = int(0.045 * SR)
        out[int(tp * SR): int(tp * SR) + pn] += tone(f, pn) * env(pn, 0.002, 0.04) * (0.5 + 0.5 * frac)
    ding = chime(1568, 0.7)
    s = int(dur * SR)
    out[s: s + len(ding)] += ding * 0.9
    return out


# ---------------------------------------------------------------------------
# Cue sheet  (time_s, timbre, gain, pan)  — pinned to AtomOS animations
# ---------------------------------------------------------------------------
G_TICK, G_POP, G_KEY = 0.22, 0.28, 0.20
G_WHOOSH, G_SWIPE = 0.26, 0.28
G_RISER, G_IMPACT = 0.30, 0.42
G_CHIME, G_CHARGE = 0.34, 0.20

cues = [
    # intro / title
    (0.02, "riser", G_RISER * 0.8, 0),
    (1.15, "impact", G_IMPACT, 0),
    (1.6, "pop", G_POP, -0.3),
    (7.0, "pop", G_POP, -0.3),
    # chapter 1 · install (10.0)
    (9.8, "riser", G_RISER, 0),
    (10.0, "swipe", G_SWIPE, 0.4),
    (10.9, "impact", G_IMPACT * 0.8, 0),
    (14.2, "pop", G_POP, -0.3),
    (25.7, "pop", G_POP, -0.3),
    (30.2, "pop", G_POP, -0.3),
    (39.5, "pop", G_POP, 0.3),
    (39.6, "charge", G_CHARGE, 0),  # install progress ~7.4s
    (47.3, "pop", G_POP, -0.3),
    (53.1, "pop", G_POP, -0.3),
    (62.3, "pop", G_POP, -0.3),
    # chapter 2 · first boot (67.8)
    (67.6, "riser", G_RISER, 0),
    (68.7, "impact", G_IMPACT * 0.8, 0),
    (77.2, "pop", G_POP, -0.3),
    (94.4, "success", G_CHIME * 0.8, 0),  # store works
    # chapter 3 · under the hood (100.6)
    (100.4, "riser", G_RISER, 0),
    (101.5, "impact", G_IMPACT * 0.8, 0),
    (102.9, "key", G_KEY, 0.3),  # winver typed
    (103.1, "key", G_KEY, 0.3),
    (108.0, "pop", G_POP, -0.3),  # build highlight
    (114.0, "pop", G_POP, 0.3),
    # task manager stats
    (118.0, "pop", G_POP, 0.3),
    (122.3, "impact", G_IMPACT * 0.7, 0.2),  # "23" reveal
    (125.5, "pop", G_POP, 0.2),
    (129.0, "pop", G_POP, -0.3),
    (134.2, "pop", G_POP, -0.3),
    # sizes
    (143.5, "impact", G_IMPACT * 0.6, 0.3),  # 2.87 GB
    (148.7, "pop", G_POP, -0.3),
    (158.0, "impact", G_IMPACT * 0.7, -0.3),  # 7.44 GB
    (165.2, "pop", G_POP, -0.3),
    # chapter 4 · clean (174.9)
    (174.7, "riser", G_RISER, 0),
    (175.8, "impact", G_IMPACT * 0.8, 0),
    (178.9, "success", G_CHIME * 0.7, -0.3),  # only one app
    (188.5, "pop", G_POP, -0.3),
    (202.6, "pop", G_POP, -0.3),
    # chapter 5 · post-install (213.3)
    (213.1, "riser", G_RISER, 0),
    (214.2, "impact", G_IMPACT * 0.8, 0),
    (218.9, "pop", G_POP, 0.3),
    (233.6, "pop", G_POP, 0.3),
    (237.8, "pop", G_POP, -0.3),
    # settings & updates
    (258.1, "pop", G_POP, -0.3),
    (275.0, "pop", G_POP, -0.3),
    (281.0, "impact", G_IMPACT * 0.7, -0.3),  # 2050 stat
    (288.0, "pop", G_POP * 0.9, -0.3),
    # outro
    (304.0, "impact", G_IMPACT, 0),
    (304.1, "chime", G_CHIME, 0),
    # end card (317.5)
    (317.3, "riser", G_RISER, 0),
    (318.4, "impact", G_IMPACT * 0.8, 0),
    (318.5, "chime", G_CHIME, 0),
]

FACTORY = {
    "tick": tick,
    "key": key,
    "pop": pop,
    "blip": blip,
    "whoosh": lambda: whoosh(),
    "swipe": lambda: swipe(),
    "riser": lambda: riser(1.2),
    "impact": impact,
    "chime": lambda: chime(1046, 0.9),
    "success": success,
}

for t, kind, gain, pan in cues:
    sig = charge(7.3) if kind == "charge" else FACTORY[kind]()
    add(sig, t, gain=gain, pan=pan)

# ---------------------------------------------------------------------------
# Soft limiter + normalize headroom
# ---------------------------------------------------------------------------
peak = np.max(np.abs(bed))
if peak > 0:
    bed = bed / max(peak, 1.0)
bed = np.tanh(bed * 1.1) * 0.9
bed = np.clip(bed, -0.98, 0.98)

pcm = (bed * 32767).astype(np.int16)
with wave.open(OUT, "w") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())

print(f"wrote {OUT}  ({TOTAL:.1f}s, {len(cues)} cues)")
