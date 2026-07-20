import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {sec2f, lifecycle} from '../motion';
import {Statement} from './Statement';
import {materials, type Style} from '../theme';

// variant "overlay": for SCREEN-SHARE / B-ROLL beats where the screen content
// must stay predominant. No field, no panel, no footage transform: a
// transparent-background display-size statement over a directional scrim.
// The Director picks the zone by LOOKING at the frame for the least-busy
// pocket (default: bottom).
export const ConceptOverlay = ({evt, style}: {evt: any; style: Style}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const mo = style.theme.motion;
  const m = materials(style);
  const sF = sec2f(evt.startSec, fps);
  const eF = sec2f(evt.endSec, fps);
  const life = lifecycle(frame, fps, sF, eF, mo.springs, mo.outMs);

  // Scrim is TEXT-LOCAL, not a wash: the footage must keep its original look
  // (max ~10 percent luminance loss outside the statement's own zone). The
  // statement rides the THEME's panel material, so the scrim only assists.
  const zone: string = evt.payload?.zone ?? 'bottom';
  const scrim =
    zone === 'top'
      ? 'linear-gradient(to bottom, rgba(6,10,16,0.45) 0%, rgba(6,10,16,0.15) 16%, transparent 32%)'
      : zone === 'center'
        ? 'radial-gradient(46% 30% at 50% 50%, rgba(6,10,16,0.42) 0%, rgba(6,10,16,0.15) 60%, transparent 80%)'
        : 'linear-gradient(to top, rgba(6,10,16,0.48) 0%, rgba(6,10,16,0.16) 16%, transparent 32%)';

  const justify = zone === 'top' ? 'flex-start' : zone === 'center' ? 'center' : 'flex-end';

  return (
    <AbsoluteFill style={{opacity: life.p}}>
      {/* directional scrim keeps the screen content visible AND the type legible */}
      <AbsoluteFill style={{background: scrim}} />
      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: justify,
          paddingTop: zone === 'top' ? height * 0.07 : 0,
          paddingBottom: zone === 'bottom' ? height * 0.07 : 0,
          paddingLeft: width * 0.08,
          paddingRight: width * 0.08,
        }}
      >
        {/* the statement lives on the theme's material, like every surface */}
        <div
          style={{
            background: m.isFlat ? m.panelBg : m.panelBg,
            border: m.panelBorder,
            borderRadius: m.radiusPx,
            backdropFilter: m.panelBlurPx ? `blur(${m.panelBlurPx}px)` : undefined,
            WebkitBackdropFilter: m.panelBlurPx ? `blur(${m.panelBlurPx}px)` : undefined,
            boxShadow: m.isFlat
              ? '0 10px 34px rgba(31,30,29,0.14)'
              : `0 18px 60px rgba(0,0,0,0.5), 0 0 34px ${m.glowA}33, inset 0 1px 0 rgba(255,255,255,0.25)`,
            padding: `${height * 0.035}px ${height * 0.06}px`,
            filter: 'drop-shadow(0 2px 14px rgba(0,0,0,0.45))',
          }}
        >
          <Statement payload={evt.payload} style={style} m={m} sF={sF} fontPx={height * 0.095} maxLinePx={width * 0.84 - height * 0.12} align="center" />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
