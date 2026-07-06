#!/usr/bin/env python3
"""Synthesize (from scratch, numpy only) a stereo SFX bed for the ReviOS 2026
tutorial edit and write it to a WAV file. Every cue is pinned to the timestamp
of its on-screen animation. Levels are conservative: the voice-over is priority.

Usage: python3 make_sfx.py <out.wav> [total_seconds]
"""
import sys
import numpy as np
import wave

SR = 44100
OUT = sys.argv[1] if len(sys.argv) > 1 else "sfx.wav"
TOTAL = float(sys.argv[2]) if len(sys.argv) > 2 else 219.6

N = int(TOTAL * SR)
bed = np.zeros((N, 2), dtype=np.float64)
rng = np.random.default_rng(7)


def add(sig, t, gain=1.0, pan=0.0):
    """Mix a mono signal into the stereo bed at time t (s) with equal-power pan."""
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
    """Cheap one-pole low-pass."""
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
    if kind == "tri":
        return 2 / np.pi * np.arcsin(np.sin(2 * np.pi * f * t + phase))
    return np.sin(2 * np.pi * f * t + phase)


# ----------------------------------------------------------------------------
# Timbres
# ----------------------------------------------------------------------------
def tick():
    n = int(0.03 * SR)
    noise = rng.standard_normal(n)
    body = hp(lp(noise, 6000), 1500)
    body += 0.5 * tone(2400, n)
    return body * env(n, 0.001, 0.028)


def key():  # keystroke, drier/lower than tick
    n = int(0.035 * SR)
    noise = rng.standard_normal(n)
    body = lp(noise, 3500)
    body += 0.4 * tone(1400, n)
    return body * env(n, 0.001, 0.03)


def pop():
    n = int(0.11 * SR)
    t = np.arange(n) / SR
    f = np.linspace(420, 900, n)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR)
    s += 0.3 * np.sin(2 * np.pi * np.cumsum(f * 2) / SR)
    return s * env(n, 0.004, 0.1)


def blip():
    n = int(0.09 * SR)
    s = tone(720, n) + 0.6 * tone(1080, n)
    return s * env(n, 0.003, 0.085)


def whoosh(dur=0.42, bright=2600, pan=0.0):
    n = int(dur * SR)
    noise = rng.standard_normal(n)
    band = hp(lp(noise, bright), 700)
    e = env(n, dur * 0.4, dur * 0.55)
    return band * e


def swipe(dur=0.22, pan=0.0):
    n = int(dur * SR)
    noise = rng.standard_normal(n)
    band = hp(lp(noise, 4000), 1200)
    e = env(n, 0.01, dur - 0.02)
    return band * e


def riser(dur=1.2):
    n = int(dur * SR)
    t = np.arange(n) / SR
    noise = rng.standard_normal(n)
    # brightness opens over time: mix from lp to hp
    lp_c = lp(noise, 900)
    hp_c = hp(noise, 2000)
    mix = (1 - t / dur)[:, None].ravel()
    body = lp_c * (1 - t / dur) + hp_c * (t / dur)
    sub = np.sin(2 * np.pi * np.cumsum(np.linspace(38, 70, n)) / SR) * (t / dur)
    ramp = (t / dur) ** 1.5
    return (body * 0.7 + sub * 0.6) * ramp


def impact():
    n = int(0.32 * SR)
    t = np.arange(n) / SR
    thump = np.sin(2 * np.pi * np.cumsum(np.linspace(120, 55, n)) / SR)
    body = 0.5 * tone(90, n)
    noise = hp(rng.standard_normal(n), 3000) * np.exp(-t * 40)
    e = env(n, 0.002, 0.31)
    return (thump * e + body * e + noise * 0.4)


def chime(root=880.0, dur=0.9):
    n = int(dur * SR)
    t = np.arange(n) / SR
    partials = [(1, 1.0), (2.0, 0.5), (3.01, 0.28), (4.2, 0.16), (5.4, 0.09)]
    s = np.zeros(n)
    for mult, amp in partials:
        s += amp * np.sin(2 * np.pi * root * mult * t) * np.exp(-t * (2.2 + mult * 0.5))
    return s / np.max(np.abs(s) + 1e-9)


def success():
    # two-note rising bell
    a = chime(784, 0.5)   # G5
    b = chime(1175, 0.9)  # D6
    out = np.zeros(int(1.2 * SR))
    out[: len(a)] += a * 0.8
    off = int(0.14 * SR)
    out[off: off + len(b)] += b
    return out / np.max(np.abs(out) + 1e-9)


def charge(dur, start_f=300, end_f=1500):
    """Accelerating train of micro-pulses that rise in pitch, + ding at the end."""
    n = int(dur * SR)
    out = np.zeros(n + int(0.9 * SR))
    t_positions = []
    # accelerating intervals
    x = 0.0
    gap = 0.16
    while x < dur - 0.05:
        t_positions.append(x)
        gap *= 0.93
        gap = max(gap, 0.028)
        x += gap
    for i, tp in enumerate(t_positions):
        frac = tp / dur
        f = start_f + (end_f - start_f) * frac
        pn = int(0.045 * SR)
        pulse = tone(f, pn) * env(pn, 0.002, 0.04)
        s = int(tp * SR)
        out[s: s + pn] += pulse * (0.5 + 0.5 * frac)
    ding = chime(1568, 0.7)  # G6 ding on fill
    s = int(dur * SR)
    out[s: s + len(ding)] += ding * 0.9
    return out


# ----------------------------------------------------------------------------
# Cue sheet  (time_s, timbre, gain, pan)
# ----------------------------------------------------------------------------
G_TICK, G_POP, G_KEY = 0.22, 0.28, 0.20
G_WHOOSH, G_SWIPE = 0.26, 0.28
G_RISER, G_IMPACT = 0.30, 0.42
G_CHIME, G_CHARGE = 0.34, 0.20

cues = [
    # intro / title
    (0.02, "riser", G_RISER * 0.8, 0),
    (1.15, "impact", G_IMPACT, 0),
    (1.2, "pop", G_POP, 0),
    (3.2, "pop", G_POP, -0.3),
    (8.6, "blip", G_POP, 0.3),
    (9.6, "blip", G_POP, 0.3),
    (11.0, "pop", G_POP, 0.2),
    # chapter 1
    (17.5, "riser", G_RISER, 0),
    (18.7, "impact", G_IMPACT * 0.8, 0),
    (17.7, "swipe", G_SWIPE, 0.4),
    # step 1
    (20.0, "pop", G_POP, -0.3),
    (20.2, "key", G_KEY, 0),
    (20.35, "key", G_KEY, 0),
    (20.5, "key", G_KEY, 0),
    # step 2
    (24.6, "pop", G_POP, 0.3),
    (24.8, "pop", G_POP * 0.8, -0.4),
    (29.4, "tick", G_TICK * 1.4, -0.4),
    # step 3 modal
    (30.3, "swipe", G_SWIPE, 0),
    (30.35, "pop", G_POP, -0.3),
    (30.6, "pop", G_POP * 0.8, 0),
    (33.7, "tick", G_TICK * 1.4, 0),
    # github playbook
    (34.3, "whoosh", G_WHOOSH, 0.3),
    (34.4, "pop", G_POP, -0.3),
    # modsfire
    (38.3, "pop", G_POP, -0.3),
    (39.0, "key", G_KEY, 0),
    (39.15, "key", G_KEY, 0),
    (39.3, "key", G_KEY, 0),
    # get ame
    (48.0, "pop", G_POP * 0.8, -0.4),
    # step 4 github ame
    (51.4, "whoosh", G_WHOOSH, 0.3),
    (51.45, "pop", G_POP, 0.3),
    (52.4, "pop", G_POP * 0.8, -0.4),
    (58.6, "key", G_KEY, 0),
    (58.75, "key", G_KEY, 0),
    (63.4, "pop", G_POP, -0.3),
    # chapter 2
    (64.5, "riser", G_RISER, 0),
    (65.6, "impact", G_IMPACT * 0.8, 0),
    # step 5 desktop
    (67.0, "pop", G_POP, -0.3),
    (67.3, "pop", G_POP * 0.8, 0.2),
    # step 6 browse / drag
    (78.3, "pop", G_POP, 0.3),
    (79.0, "pop", G_POP * 0.8, 0),
    (85.0, "pop", G_POP, 0.3),
    (85.2, "pop", G_POP * 0.8, -0.4),
    (90.0, "pop", G_POP, 0),
    # chapter 3
    (93.1, "riser", G_RISER, 0),
    (94.2, "impact", G_IMPACT * 0.8, 0),
    # step 7 disable security
    (96.5, "pop", G_POP, -0.3),
    (104.0, "pop", G_POP, -0.3),
    (110.5, "pop", G_POP, 0.3),
    (115.0, "success", G_CHIME, 0),
    # chapter 4
    (120.9, "riser", G_RISER, 0),
    (122.0, "impact", G_IMPACT * 0.8, 0),
    (125.0, "pop", G_POP, -0.3),
    (133.2, "pop", G_POP, -0.3),
    (138.4, "pop", G_POP, -0.3),
    (139.0, "pop", G_POP * 0.8, 0),
    (150.4, "pop", G_POP, 0.3),
    (153.4, "pop", G_POP, -0.3),
    (164.5, "pop", G_POP, -0.3),
    # install progress
    (168.5, "pop", G_POP, 0.3),
    (168.6, "charge", G_CHARGE, 0),  # ~15.4s accelerating meter + ding
    (177.5, "pop", G_POP, 0),
    (184.0, "success", G_CHIME, 0),
    # result
    (192.2, "impact", G_IMPACT, 0),
    (192.3, "chime", G_CHIME, 0),
    (195.0, "pop", G_POP, -0.3),
    (200.4, "pop", G_POP, -0.3),
    # end card
    (207.0, "riser", G_RISER, 0),
    (208.1, "impact", G_IMPACT * 0.8, 0),
    (208.2, "chime", G_CHIME, 0),
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

for cue in cues:
    t, kind, gain, pan = cue
    if kind == "charge":
        sig = charge(15.4)
    else:
        sig = FACTORY[kind]()
    add(sig, t, gain=gain, pan=pan)

# ----------------------------------------------------------------------------
# Soft limiter + normalize headroom
# ----------------------------------------------------------------------------
peak = np.max(np.abs(bed))
if peak > 0:
    bed = bed / max(peak, 1.0)
bed = np.tanh(bed * 1.1) * 0.9  # gentle saturation/limit
bed = np.clip(bed, -0.98, 0.98)

pcm = (bed * 32767).astype(np.int16)
with wave.open(OUT, "w") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())

print(f"wrote {OUT}  ({TOTAL:.1f}s, {len(cues)} cues)")
