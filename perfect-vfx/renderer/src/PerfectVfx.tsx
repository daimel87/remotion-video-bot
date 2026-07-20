import {AbsoluteFill, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {resolveStyle} from './theme';
import {sec2f, lifecycle} from './motion';
import {CtaBanner} from './components/CtaBanner';
import {SubscribeCta} from './components/SubscribeCta';
import {ConceptSplit} from './components/ConceptSplit';
import {Concept75} from './components/Concept75';
import {ConceptFullscreen} from './components/ConceptFullscreen';
import {ConceptOverlay} from './components/ConceptOverlay';
import {Grain} from './components/Grain';

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// Main composition. The spec (Edit Decision Spec JSON) arrives as input props.
// The footage is a layer driven by the LAYOUT ENGINE:
//  - split-screen: footage slides right into the 50 percent slot (panel covers the left)
//  - 75-split: footage shrinks into a rounded portrait card on the right (field renders UNDER it)
//  - full-screen: footage stays put; the opaque themed comp blooms over it (audio continues)
// One spring drives footage + panel together so they read as one surface.
export const PerfectVfx = (spec: any) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const style = resolveStyle(spec);
  const events: any[] = spec.events ?? [];

  const active = (e: any) => {
    const sF = sec2f(e.startSec, fps);
    const eF = sec2f(e.endSec, fps);
    return frame >= sF - 1 && frame <= eF; // exit completes AT eF (cut-synced); nothing may bleed past it
  };

  // ---- footage camera: sub-perceptual life + push-in during graphic holds
  // + a 2-frame impact dip on every graphic ENTER. Static-on-static is the
  // amateur tell WHILE a graphic is on; between events the footage is
  // BIT-EXACT source pixels (parity law: the section must drop back onto the
  // user's timeline frame-perfect, and the PSNR gate measures ~45dB+ on
  // no-overlay segments). Everything is gated by the events' own lifecycle p,
  // so camera life fades in/out with the graphics and never pops on a cut.
  let excess = 0;
  let pMax = 0;
  for (const e of events) {
    const sF = sec2f(e.startSec, fps);
    const eF = sec2f(e.endSec, fps);
    if (eF <= sF) continue;
    const life = lifecycle(frame, fps, sF, eF, style.theme.motion.springs, style.theme.motion.outMs);
    pMax = Math.max(pMax, life.p);
    if (frame >= sF && frame <= eF) {
      excess += 0.02 * ((frame - sF) / (eF - sF)) * life.p; // slow Ken Burns push across the hold, fading with the exit
      const dip =
        frame <= sF + 6
          ? 0.005 * (frame <= sF + 2 ? (frame - sF) / 2 : 1 - (frame - sF - 2) / 4)
          : 0;
      excess -= dip;
    }
  }
  const cam = 1 + pMax * (0.008 + 0.004 * Math.sin(frame / 240)) + excess;

  // ---- layout engine: compute the footage container + inner video transform
  let containerStyle: React.CSSProperties = {left: 0, top: 0, width, height};
  let innerStyle: React.CSSProperties = {
    position: 'absolute',
    left: 0,
    top: 0,
    width,
    height,
    // Identity transform is omitted entirely so clean stretches stay bit-exact
    // (no resample pass on the source pixels).
    transform: cam === 1 ? undefined : `scale(${cam})`,
    transformOrigin: '50% 50%',
  };

  const layoutEvt = events.find(
    (e) =>
      e.move === 'CONCEPT_GRAPHIC' &&
      (e.payload?.variant === 'split-screen' || e.payload?.variant === '75-split') &&
      active(e)
  );

  if (layoutEvt) {
    const sF = sec2f(layoutEvt.startSec, fps);
    const eF = sec2f(layoutEvt.endSec, fps);
    const life = lifecycle(frame, fps, sF, eF, style.theme.motion.springs, style.theme.motion.outMs);
    const p = life.p;

    if (layoutEvt.payload.variant === 'split-screen') {
      // Footage slides right so the subject centers in the right HALF (50/50).
      innerStyle = {position: 'absolute', left: 0, top: 0, width, height, transform: `translateX(${width * 0.25 * p}px)`};
    } else {
      // 75-split: full frame shrinks into a rounded portrait card, right side.
      const cw = width * 0.225;
      const ch = height * 0.66;
      const cx = width * 0.72;
      const cy = height * 0.17;
      const cW = lerp(width, cw, p);
      const cH = lerp(height, ch, p);
      const cX = lerp(0, cx, p);
      const cY = lerp(0, cy, p);
      const scale = Math.max(cW / width, cH / height); // cover-fit, no distortion
      const vw = width * scale;
      const vh = height * scale;
      containerStyle = {
        left: cX,
        top: cY,
        width: cW,
        height: cH,
        borderRadius: 26 * p,
        border: p > 0.4 ? `1.5px solid rgba(255,255,255,${0.35 * p})` : 'none',
        boxShadow: p > 0.4 ? `0 0 34px rgba(0,0,0,${0.55 * p}), 0 0 22px ${p * 0.25 > 0 ? 'rgba(77,225,255,0.22)' : 'transparent'}` : 'none',
      };
      innerStyle = {position: 'absolute', left: (cW - vw) / 2, top: (cH - vh) / 2, width: vw, height: vh};
    }
  }

  const render = (e: any) => {
    switch (e.move) {
      case 'CTA_BANNER':
        return <CtaBanner key={e.id} evt={e} style={style} />;
      case 'SUBSCRIBE_CTA':
        return <SubscribeCta key={e.id} evt={e} style={style} />;
      case 'CONCEPT_GRAPHIC':
        if (e.payload?.variant === 'split-screen') return <ConceptSplit key={e.id} evt={e} style={style} />;
        if (e.payload?.variant === 'full-screen') return <ConceptFullscreen key={e.id} evt={e} style={style} />;
        if (e.payload?.variant === 'overlay') return <ConceptOverlay key={e.id} evt={e} style={style} />;
        return null; // 75-split renders below the footage, handled separately
      default:
        return null;
    }
  };

  const activeEvents = events.filter(active);
  const under = activeEvents.filter((e) => e.move === 'CONCEPT_GRAPHIC' && e.payload?.variant === '75-split');
  const over = activeEvents.filter((e) => !(e.move === 'CONCEPT_GRAPHIC' && e.payload?.variant === '75-split'));

  return (
    <AbsoluteFill style={{backgroundColor: style.colors.void ?? '#000000'}}>
      {/* 75-split fields live UNDER the footage card */}
      {under.map((e) => (
        <Concept75 key={e.id} evt={e} style={style} />
      ))}

      <div style={{position: 'absolute', overflow: 'hidden', ...containerStyle}}>
        {/* toneMapped=false: pass source pixels through without Chrome's display
            color transform (default true adds a midtone gamma lift, ~2 luma
            codes, caught by the PSNR parity gate). */}
        <OffthreadVideo src={staticFile('src.mp4')} toneMapped={false} style={innerStyle as any} />
      </div>

      {over.map(render)}

      {style.theme.atmosphere?.grain ? <Grain /> : null}
    </AbsoluteFill>
  );
};
