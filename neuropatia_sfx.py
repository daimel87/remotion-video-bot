import numpy as np, wave, sys
SR=44100; DUR=334.56; N=int(SR*DUR)
bed=np.zeros((N,2),dtype=np.float32)
def cumfreq(f): return np.cumsum(f)/SR
def place(sig,t,pan=0.0,gain=1.0):
    i=int(t*SR); lg=np.cos((pan+1)*np.pi/4); rg=np.sin((pan+1)*np.pi/4)
    st=np.stack([sig*lg,sig*rg],axis=1)*gain; j=min(i+len(st),N)
    if i>=N or i<0: return
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
def chime(base=880,dur=0.7):
    n=int(dur*SR);t=np.arange(n)/SR
    s=np.sin(2*np.pi*base*t)+0.5*np.sin(2*np.pi*base*1.5*t)+0.25*np.sin(2*np.pi*base*2*t)
    return (s*np.exp(-t*4)).astype(np.float32)
def whoosh(dur=0.45):
    n=int(dur*SR);noise=np.random.randn(n);cut=np.linspace(0.02,0.25,n)
    y=np.zeros(n);p=0
    for i in range(n): p=p+cut[i]*(noise[i]-p);y[i]=p
    return (y*np.sin(np.pi*np.linspace(0,1,n))*3.0).astype(np.float32)
def stamp(dur=0.22):
    n=int(dur*SR);t=np.arange(n)/SR
    s=np.sin(2*np.pi*cumfreq(np.linspace(240,70,n)))
    click=np.random.randn(n)*np.exp(-t*120)*0.4
    return ((s+click)*np.exp(-t*14)).astype(np.float32)
def riser(dur=1.0):
    n=int(dur*SR);noise=np.random.randn(n);cut=np.linspace(0.01,0.35,n)
    y=np.zeros(n);p=0
    for i in range(n): p=p+cut[i]*(noise[i]-p);y[i]=p
    sub=0.5*np.sin(2*np.pi*cumfreq(np.linspace(40,80,n)))
    return ((y*2.2+sub)*(np.linspace(0,1,n)**1.5)).astype(np.float32)
def impact(dur=0.55):
    n=int(dur*SR);t=np.arange(n)/SR
    s=np.sin(2*np.pi*cumfreq(np.linspace(170,45,n)))
    sub=0.6*np.sin(2*np.pi*cumfreq(np.linspace(85,30,n)))
    return ((s+sub)*np.exp(-t*6)).astype(np.float32)
def pop(freq=680,dur=0.13):
    n=int(dur*SR);t=np.arange(n)/SR;f=freq*(1+2*np.exp(-t*40))
    s=np.sin(2*np.pi*f*t)+0.3*np.sin(2*np.pi*freq*2*t)
    return (s*envd(n,int(0.003*SR),int(0.04*SR),0.25)).astype(np.float32)

# Cues synced to NeuropatiaEdit.tsx timeline (25fps -> seconds)
cues=[
 (46.0-0.9, riser(0.9), 0.0, 0.28),   # -> mechanism graphic (curcumina)
 (46.0,     chime(760), 0.0, 0.4),
 (58.0,     blip(1200), 0.3, 0.4),    # -> BDNF graphic swap
 (70.0,     whoosh(0.4), 0.0, 0.32),  # back to talking head
 (84.0,     stamp(0.22), 0.4, 0.5),   # Beneficio 1
 (88.0,     whoosh(0.35),0.0, 0.28),
 (106.0,    stamp(0.22),-0.4, 0.5),   # Beneficio 2
 (111.0,    whoosh(0.35),0.0, 0.28),
 (126.0,    stamp(0.22), 0.4, 0.5),   # Beneficio 3
 (131.0,    whoosh(0.35),0.0, 0.28),
 (146.0,    stamp(0.22),-0.4, 0.5),   # Beneficio 4
 (153.0,    whoosh(0.35),0.0, 0.28),
 (170.0,    stamp(0.24), 0.4, 0.55),  # Beneficio 5
 (179.0,    whoosh(0.35),0.0, 0.28),
 (191.0-0.9,riser(0.9),  0.0, 0.28),  # -> food list card
 (191.0,    chime(700),  0.0, 0.38),
 (200.0,    blip(1100),-0.3, 0.32),   # omega 3 item
 (207.0,    blip(1100), 0.3, 0.32),   # folato item
 (213.0,    blip(1100),-0.3, 0.32),   # vitamina E item
 (224.0-0.9,riser(0.9),  0.0, 0.3),   # -> warning card (more serious)
 (224.0,    impact(0.5), 0.0, 0.5),
 (231.0,    pop(600),    0.4, 0.32),  # warfarina line
 (239.0,    pop(600),   -0.4, 0.32),  # vesicula line
 (244.0,    whoosh(0.4), 0.0, 0.3),   # warning ends
 (257.0,    chime(880),  0.0, 0.4),   # protocol starts
 (264.0,    blip(1100),  0.3, 0.28),
 (271.0,    blip(1100), -0.3, 0.28),
 (277.0,    whoosh(0.4), 0.0, 0.3),   # protocol ends
 (289.0,    pop(650),    0.0, 0.4),   # "cuenteños en comentarios"
 (308.0-1.0,riser(1.0),  0.0, 0.3),   # -> subscribe card
 (308.0,    impact(0.55),0.0, 0.55),
]
for t,sig,pan,g in cues: place(sig,t,pan,g)
peak=np.max(np.abs(bed))
if peak>0: bed=bed/max(peak,1.0)
bed=np.tanh(bed*1.1)*0.85
out=(bed*32767).astype(np.int16)
w=wave.open(sys.argv[1],'wb');w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR)
w.writeframes(out.tobytes());w.close()
print("SFX bed:",sys.argv[1],"cues:",len(cues))
