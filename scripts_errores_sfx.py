import numpy as np, wave, struct, sys

SR = 44100
DUR = 44.52
N = int(SR*DUR)
bed = np.zeros((N,2), dtype=np.float32)

def place(sig, t, pan=0.0, gain=1.0):
    i = int(t*SR)
    if sig.ndim==1:
        l = sig*np.sqrt((1-pan)/2 if pan>=0 else 1.0)
        r = sig*np.sqrt((1+pan)/2 if pan<=0 else 1.0)
        # simpler equal-power pan
        lg = np.cos((pan+1)*np.pi/4); rg = np.sin((pan+1)*np.pi/4)
        st = np.stack([sig*lg, sig*rg], axis=1)
    else:
        st = sig
    st = st*gain
    j = min(i+len(st), N)
    bed[i:j] += st[:j-i]

def env(n, a, d, sus=0.0, r=None):
    r = r if r is not None else n-a-d
    e = np.ones(n)
    e[:a] = np.linspace(0,1,a)
    e[a:a+d] = np.linspace(1,sus if sus>0 else 1, d) if sus>0 else np.linspace(1,0,d)
    if sus>0 and r>0:
        e[a+d:a+d+r] = np.linspace(sus,0,min(r,n-a-d))
    return e

def blip(freq=1400, dur=0.09):
    n=int(dur*SR); t=np.arange(n)/SR
    s=np.sin(2*np.pi*freq*t)+0.4*np.sin(2*np.pi*freq*2*t)
    return (s*env(n,int(0.005*SR),int(0.02*SR),0.3)).astype(np.float32)

def pop(freq=680, dur=0.13):
    n=int(dur*SR); t=np.arange(n)/SR
    f=freq*(1+2*np.exp(-t*40))
    s=np.sin(2*np.pi*f*t)+0.3*np.sin(2*np.pi*freq*2*t)
    return (s*env(n,int(0.003*SR),int(0.04*SR),0.25)).astype(np.float32)

def chime(base=880, dur=0.7):
    n=int(dur*SR); t=np.arange(n)/SR
    s=(np.sin(2*np.pi*base*t)+0.5*np.sin(2*np.pi*base*1.5*t)+0.25*np.sin(2*np.pi*base*2*t))
    e=np.exp(-t*4)
    return (s*e).astype(np.float32)

def whoosh(dur=0.5):
    n=int(dur*SR); t=np.arange(n)/SR
    noise=np.random.randn(n)
    # bandpass sweep via simple 1-pole moving
    from numpy import cumsum
    cutoff=np.linspace(0.02,0.25,n)
    y=np.zeros(n); prev=0
    for i in range(n):
        prev=prev+cutoff[i]*(noise[i]-prev); y[i]=prev
    e=np.sin(np.pi*np.linspace(0,1,n))
    return (y*e*3.0).astype(np.float32)

def impact(dur=0.6):
    n=int(dur*SR); t=np.arange(n)/SR
    f=np.linspace(180,45,n)
    s=np.sin(2*np.pi*cumfreq(f))
    sub=0.6*np.sin(2*np.pi*cumfreq(np.linspace(90,30,n)))
    e=np.exp(-t*6)
    return ((s+sub)*e).astype(np.float32)

def cumfreq(f):
    return np.cumsum(f)/SR

def riser(dur=1.2):
    n=int(dur*SR); t=np.arange(n)/SR
    noise=np.random.randn(n)
    cutoff=np.linspace(0.01,0.35,n)
    y=np.zeros(n); prev=0
    for i in range(n):
        prev=prev+cutoff[i]*(noise[i]-prev); y[i]=prev
    sub=0.5*np.sin(2*np.pi*cumfreq(np.linspace(40,80,n)))
    e=np.linspace(0,1,n)**1.5
    return ((y*2.5+sub)*e).astype(np.float32)

def stamp(dur=0.22):
    n=int(dur*SR); t=np.arange(n)/SR
    f=np.linspace(240,70,n)
    s=np.sin(2*np.pi*cumfreq(f))
    click=np.random.randn(n)*np.exp(-t*120)*0.4
    e=np.exp(-t*14)
    return ((s+click)*e).astype(np.float32)

# ---- Cue map (t seconds = in-frame/25, aligned to MOTION ONSET) ----
# Scene lifecycles (frames): S1 in8/out98-108 | S2 in120 | S3 in166 | S4a in280 S4b in300 out320
# S5 in346/exit460 | S6 in482 | S7 in626/exit736 | S8 in756 | S9 in878 | S10 in1000
cues = [
 (8/25,   blip(1500), 0.5, 0.5),    # S1 in
 (120/25, pop(700),   0.5, 0.55),   # S2 in
 (166/25, blip(1300),-0.4, 0.5),    # S3 in
 (280/25, pop(620),  -0.5, 0.6),    # S4 stair 1 in
 (300/25, pop(780),  -0.5, 0.6),    # S4 stair 2 in (higher)
 (346/25, blip(1300),-0.4, 0.5),    # S5 in
 (460/25, whoosh(0.4),0.0, 0.35),   # S5 EXIT start
 (482/25, blip(1400), 0.5, 0.5),    # S6 in
 (626/25-1.1, riser(1.1),0.0,0.3),  # riser ENDS at S7 card hit (626)
 (626/25, chime(900), 0.0, 0.4),    # S7 brand card hit
 (736/25, whoosh(0.4),0.0, 0.35),   # S7 EXIT start
 (756/25, impact(0.6),0.0, 0.55),   # S8 "10" reveal in
 (878/25, stamp(0.22),0.0, 0.5),    # S9 teaser in
 (1000/25-1.1, riser(1.1),0.0,0.32),# riser ENDS at S10 CTA hit (1000)
 (1000/25, chime(760),0.0, 0.45),   # S10 CTA hit
]
for t,sig,pan,g in cues:
    place(sig,t,pan,g)

# soft limit
peak=np.max(np.abs(bed))
if peak>0: bed=bed/max(peak,1.0)
bed=np.tanh(bed*1.1)*0.9

# write wav
out=(bed*32767).astype(np.int16)
w=wave.open(sys.argv[1],'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
w.writeframes(out.tobytes()); w.close()
print("SFX bed written:", sys.argv[1], "cues:", len(cues))
