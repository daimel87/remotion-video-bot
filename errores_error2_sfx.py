import numpy as np, wave, sys
SR=44100; DUR=55.68; N=int(SR*DUR)
bed=np.zeros((N,2),dtype=np.float32)
def cumfreq(f): return np.cumsum(f)/SR
def place(sig,t,pan=0.0,gain=1.0):
    i=int(t*SR); lg=np.cos((pan+1)*np.pi/4); rg=np.sin((pan+1)*np.pi/4)
    st=np.stack([sig*lg,sig*rg],axis=1)*gain; j=min(i+len(st),N)
    bed[i:j]+=st[:j-i]
def envd(n,a,d,sus=0.0,r=None):
    r=r if r is not None else n-a-d; e=np.ones(n); e[:a]=np.linspace(0,1,a)
    if sus>0:
        e[a:a+d]=np.linspace(1,sus,d); e[a+d:a+d+r]=np.linspace(sus,0,min(r,n-a-d))
    else: e[a:a+d]=np.linspace(1,0,d)
    return e
def blip(freq=1400,dur=0.09):
    n=int(dur*SR);t=np.arange(n)/SR
    s=np.sin(2*np.pi*freq*t)+0.4*np.sin(2*np.pi*freq*2*t)
    return (s*envd(n,int(0.005*SR),int(0.02*SR),0.3)).astype(np.float32)
def pop(freq=680,dur=0.13):
    n=int(dur*SR);t=np.arange(n)/SR;f=freq*(1+2*np.exp(-t*40))
    s=np.sin(2*np.pi*f*t)+0.3*np.sin(2*np.pi*freq*2*t)
    return (s*envd(n,int(0.003*SR),int(0.04*SR),0.25)).astype(np.float32)
def chime(base=880,dur=0.7):
    n=int(dur*SR);t=np.arange(n)/SR
    s=np.sin(2*np.pi*base*t)+0.5*np.sin(2*np.pi*base*1.5*t)+0.25*np.sin(2*np.pi*base*2*t)
    return (s*np.exp(-t*4)).astype(np.float32)
def whoosh(dur=0.45):
    n=int(dur*SR);noise=np.random.randn(n);cut=np.linspace(0.02,0.25,n)
    y=np.zeros(n);p=0
    for i in range(n): p=p+cut[i]*(noise[i]-p);y[i]=p
    return (y*np.sin(np.pi*np.linspace(0,1,n))*3.0).astype(np.float32)
def impact(dur=0.6):
    n=int(dur*SR);t=np.arange(n)/SR
    s=np.sin(2*np.pi*cumfreq(np.linspace(180,45,n)))
    sub=0.6*np.sin(2*np.pi*cumfreq(np.linspace(90,30,n)))
    return ((s+sub)*np.exp(-t*6)).astype(np.float32)
def riser(dur=1.1):
    n=int(dur*SR);noise=np.randn(n) if False else np.random.randn(n);cut=np.linspace(0.01,0.35,n)
    y=np.zeros(n);p=0
    for i in range(n): p=p+cut[i]*(noise[i]-p);y[i]=p
    sub=0.5*np.sin(2*np.pi*cumfreq(np.linspace(40,80,n)))
    return ((y*2.5+sub)*(np.linspace(0,1,n)**1.5)).astype(np.float32)
def stamp(dur=0.22):
    n=int(dur*SR);t=np.arange(n)/SR
    s=np.sin(2*np.pi*cumfreq(np.linspace(240,70,n)))
    click=np.random.randn(n)*np.exp(-t*120)*0.4
    return ((s+click)*np.exp(-t*14)).astype(np.float32)

# Scene in/out (25fps): S1 0/95 | S2 130 | S3 240 | S4 545/650 | S5 660 | S6 825/910 | S7 918 | S8 990 | S9 1120 | S10 1250
cues=[
 (0/25,   impact(0.6), 0.0, 0.5),    # S1 title
 (130/25, blip(1500), 0.5, 0.5),     # S2
 (240/25, blip(1300),-0.4, 0.5),     # S3
 (545/25-1.1, riser(1.1),0.0,0.3),   # riser -> S4 (545)
 (545/25, chime(950), 0.0, 0.42),    # S4 stat 30-40
 (650/25, whoosh(0.4),0.0, 0.35),    # S4 exit
 (660/25, blip(1300),-0.4, 0.5),     # S5
 (825/25-1.1, riser(1.1),0.0,0.32),  # riser -> S6 (825)
 (825/25, impact(0.55),0.0, 0.5),    # S6 circulacion slam
 (910/25, whoosh(0.4),0.0, 0.35),    # S6 exit
 (918/25, pop(640),   0.5, 0.5),     # S7
 (990/25, blip(1300),-0.4, 0.5),     # S8
 (1120/25,pop(760),   0.5, 0.5),     # S9
 (1250/25-1.1,riser(1.1),0.0,0.34),  # riser -> S10 (1250)
 (1250/25,impact(0.6),0.0, 0.55),    # S10 open-loop error #3
]
for t,sig,pan,g in cues: place(sig,t,pan,g)
peak=np.max(np.abs(bed))
if peak>0: bed=bed/max(peak,1.0)
bed=np.tanh(bed*1.1)*0.9
out=(bed*32767).astype(np.int16)
w=wave.open(sys.argv[1],'wb');w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR)
w.writeframes(out.tobytes());w.close()
print("SFX bed:",sys.argv[1],"cues:",len(cues))

