import numpy as np, wave, os
SR=44100
def env(n, a=0.005, d=0.2, kind='exp'):
    e=np.ones(n); ai=int(a*SR); di=int(d*SR)
    if ai>0: e[:ai]=np.linspace(0,1,ai)
    if kind=='exp':
        t=np.linspace(0,1,max(1,n-ai)); e[ai:]= np.exp(-4*t)
    return e
def tone(f,dur,a=0.005,d=None):
    n=int(dur*SR); t=np.arange(n)/SR
    if d is None: d=dur
    return np.sin(2*np.pi*f*t)*env(n,a,d)
def noise(dur,d=None):
    n=int(dur*SR)
    if d is None: d=dur
    return (np.random.RandomState(7).randn(n))*env(n,0.002,d)
def sweep(f0,f1,dur,d=None):
    n=int(dur*SR); t=np.arange(n)/SR
    ph=2*np.pi*(f0*t + (f1-f0)/(2*dur)*t*t)
    if d is None: d=dur
    return np.sin(ph)*env(n,0.003,d)
def norm(x,p=0.9):
    m=np.max(np.abs(x))+1e-9; return x/m*p


def mix(*arrs):
    n=max(len(a) for a in arrs); out=np.zeros(n)
    for a in arrs: out[:len(a)]+=a
    return out

def pop():
    x=mix(tone(760,0.09,0.002,0.05),0.5*tone(1180,0.06,0.002,0.04)); return norm(x,0.8)
def click():
    n=int(0.02*SR); x=np.random.RandomState(3).randn(n)*env(n,0.0005,0.01); return norm(x,0.6)
def whoosh():
    x=mix(sweep(900,180,0.32,0.3)*0.5, noise(0.32,0.3)*0.5)
    # bandpass-ish: emphasize mid by mild smoothing
    return norm(x,0.7)
def swipe():
    x=mix(sweep(240,1200,0.22,0.2)*0.5, noise(0.22,0.18)*0.4); return norm(x,0.7)
def stamp():
    x=mix(tone(120,0.16,0.002,0.12),0.6*tone(240,0.09,0.002,0.06),0.4*click()); 
    x=x[:int(0.16*SR)] if len(x)>int(0.16*SR) else x; return norm(x,0.9)
def impact():
    x=mix(tone(90,0.28,0.002,0.22),0.5*tone(150,0.2,0.002,0.16),0.3*noise(0.1,0.06)); 
    n=int(0.28*SR); x=x[:n]; return norm(x,0.95)
def impact_big():
    x=mix(tone(64,0.5,0.003,0.42),0.6*tone(110,0.42,0.003,0.34),0.35*noise(0.16,0.1))
    n=int(0.5*SR); x=x[:n]; return norm(x,1.0)
def riser():
    dur=1.3; n=int(dur*SR); t=np.arange(n)/SR
    x=mix(sweep(120,900,dur,dur)*(t/dur), noise(dur,dur)*(t/dur)*0.5)
    return norm(x,0.85)
def sparkle():
    x=mix(*[tone(f,0.35,0.002,0.28) for f in (2200,2800,3500)])/3; return norm(x,0.5)
def charge():
    dur=1.0; x=sweep(300,760,dur,dur)*0.6; 
    n=len(x); t=np.arange(n)/SR; x*= (0.4+0.6*t/dur); return norm(x,0.55)
def chime():
    x=mix(tone(880,0.6,0.003,0.5),0.6*tone(1320,0.6,0.003,0.45),0.4*tone(1760,0.5,0.003,0.4))
    return norm(x,0.6)

SFX={ 'pop':pop(),'click':click(),'whoosh':whoosh(),'swipe':swipe(),'stamp':stamp(),
      'impact':impact(),'impact_big':impact_big(),'riser':riser(),'sparkle':sparkle(),
      'charge':charge(),'chime':chime() }

# Event schedule: (time_sec, name, gain)
EV=[
 (0.55,'chime',0.5),(0.7,'impact',0.55),          # title climax
 (8.6,'pop',0.6),                                  # comercio appear
 (12.9,'pop',0.6),(13.1,'charge',0.4),(14.55,'click',0.6),  # calzadas + count
 (20.2,'swipe',0.6),                               # envidia band
 (24.6,'pop',0.6),(26.0,'click',0.6),              # poblacion + count land
 (29.6,'swipe',0.55),                              # acueducto
 (35.5,'impact_big',0.7),(37.0,'click',0.5),       # coliseo climax stat
 (40.5,'stamp',0.6),                               # legion
 (48.7,'riser',0.6),                               # riser into interstitial
 (50.5,'impact',0.6),(50.85,'impact',0.5),         # interstitial lines
 (55.9,'pop',0.6),(56.3,'stamp',0.55),(57.4,'chime',0.45), # cesares closing
]
bed=np.zeros(int(61*SR))
for t,name,g in EV:
    s=SFX[name]*g; i=int(t*SR); j=min(len(bed),i+len(s)); bed[i:j]+=s[:j-i]
# soft limit
bed=np.tanh(bed*1.1)*0.9
# stereo
st=np.stack([bed,bed],axis=1)
out="/home/user/remotion-video-bot/videos/roma-editado/assets/sfx_bed.wav"
with wave.open(out,'w') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((st*32767).astype('<i2').tobytes())
print("wrote",out,"peak",round(float(np.max(np.abs(bed))),3),"events",len(EV))
