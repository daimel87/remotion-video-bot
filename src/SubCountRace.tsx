import {
  AbsoluteFill,
  Audio,
  Img,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from 'remotion';

// Música de fondo libre de derechos: pon el archivo en public/ (ej: 'music.mp3')
// o déjalo en null para renderizar sin música.
const MUSIC: string | null = null;

/**
 * ============ COMPARADOR DE SUSCRIPTORES (estilo "Data Wolf") ============
 * Datos REALES año por año. La animación recorre la línea de tiempo y los
 * números siguen la curva real (se ve el sorpasso de MrBeast a Cocomelon
 * durante 2023). El número del centro = diferencia entre ambos.
 *
 * MrBeast: cifras exactas de Social Blade (fin de cada año).
 * Cocomelon: estimado y anclado a puntos confirmados (abr-2021 ~110M al
 * superar a PewDiePie, dic-2023 169M, 2025 ~198M). Ajusta si tienes exactos.
 */
type Point = {date: string; v: number};

const DATA = {
  title: 'MRBEAST VS COCOMELON',
  left: {
    name: 'MrBeast',
    color: '#17b6d6',
    logo: 'mrbeast.jpg' as string | undefined,
    logoScale: 1.05,
    points: [
      {date: '2018-12-31', v: 13_300_000},
      {date: '2019-12-31', v: 28_400_000},
      {date: '2020-12-31', v: 49_500_000},
      {date: '2021-12-31', v: 87_000_000},
      {date: '2022-12-31', v: 125_400_000},
      {date: '2023-12-31', v: 224_700_000},
      {date: '2024-12-31', v: 340_700_000},
      {date: '2025-12-31', v: 457_000_000},
      {date: '2026-07-06', v: 506_912_778},
    ] as Point[],
  },
  right: {
    name: 'Cocomelon',
    color: '#3ea832',
    logo: 'cocomelon.jpg' as string | undefined,
    logoScale: 1.55,
    points: [
      {date: '2018-12-31', v: 23_000_000},
      {date: '2019-12-31', v: 65_000_000},
      {date: '2020-12-31', v: 100_000_000},
      {date: '2021-12-31', v: 125_000_000},
      {date: '2022-12-31', v: 150_000_000},
      {date: '2023-12-31', v: 169_000_000},
      {date: '2024-12-31', v: 186_000_000},
      {date: '2025-12-31', v: 198_000_000},
      {date: '2026-07-06', v: 201_685_513},
    ] as Point[],
  },
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY = 86_400_000;
const fmt = (n: number) => Math.round(n).toLocaleString('en-US');

const toTs = (p: Point[]) => p.map((x) => ({t: new Date(x.date).getTime(), v: x.v}));

const valueAt = (pts: {t: number; v: number}[], ts: number): number => {
  if (ts <= pts[0].t) return pts[0].v;
  const last = pts[pts.length - 1];
  if (ts >= last.t) return last.v;
  for (let i = 0; i < pts.length - 1; i++) {
    if (ts >= pts[i].t && ts <= pts[i + 1].t) {
      const f = (ts - pts[i].t) / (pts[i + 1].t - pts[i].t);
      return pts[i].v + f * (pts[i + 1].v - pts[i].v);
    }
  }
  return last.v;
};

const Channel: React.FC<{
  side: typeof DATA.left;
  count: number;
  scale: number;
}> = ({side, count, scale}) => (
  <div style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
    <div style={{width: '100%', height: 150 * scale, background: side.color, borderRadius: 8 * scale}} />
    <div
      style={{
        width: 150 * scale,
        height: 150 * scale,
        borderRadius: '50%',
        marginTop: -95 * scale,
        border: `${5 * scale}px solid #fff`,
        background: side.color,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
      }}
    >
      {side.logo ? (
        <Img
          src={staticFile(side.logo)}
          style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${side.logoScale ?? 1})`}}
        />
      ) : (
        <span style={{fontSize: 72 * scale, fontWeight: 900, color: '#fff'}}>{side.name[0]}</span>
      )}
    </div>
    <div style={{fontSize: 52 * scale, fontWeight: 700, color: '#111', marginTop: 14 * scale}}>{side.name}</div>
    <div
      style={{
        fontSize: 96 * scale,
        fontWeight: 900,
        color: '#111',
        letterSpacing: -1,
        fontFamily: 'Arial, Helvetica, sans-serif',
        lineHeight: 1.05,
      }}
    >
      {fmt(count)}
    </div>
    <div style={{fontSize: 30 * scale, color: '#555', marginTop: 2 * scale}}>Subscribers</div>
  </div>
);

export const SubCountRace: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, durationInFrames, fps} = useVideoConfig();
  const scale = width / 1920;

  const leftPts = toTs(DATA.left.points);
  const rightPts = toTs(DATA.right.points);
  const startTs = leftPts[0].t;
  const endTs = leftPts[leftPts.length - 1].t;

  const countFrames = durationInFrames - fps; // ~1s de hold al final
  const p = interpolate(frame, [0, countFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const ts = interpolate(p, [0, 1], [startTs, endTs]);

  const leftCount = valueAt(leftPts, ts);
  const rightCount = valueAt(rightPts, ts);
  const gap = Math.abs(leftCount - rightCount);

  // Suscriptores/día = pendiente local de la curva real
  const leftDaily = Math.max(0, valueAt(leftPts, ts) - valueAt(leftPts, ts - DAY));
  const rightDaily = Math.max(0, valueAt(rightPts, ts) - valueAt(rightPts, ts - DAY));

  const d = new Date(ts);
  const dateStr = `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;

  const dailyRows: [typeof DATA.left, number][] = [
    [DATA.left, leftDaily],
    [DATA.right, rightDaily],
  ];

  return (
    <AbsoluteFill style={{backgroundColor: '#fafafa', fontFamily: 'Arial, Helvetica, sans-serif'}}>
      {MUSIC ? <Audio src={staticFile(MUSIC)} volume={0.6} /> : null}
      <div style={{padding: `${50 * scale}px ${70 * scale}px`, height: '100%', display: 'flex', flexDirection: 'column'}}>
        <div style={{textAlign: 'center'}}>
          <div style={{fontSize: 68 * scale, fontWeight: 900, fontStyle: 'italic', color: '#111'}}>{DATA.title}</div>
        </div>

        <div style={{display: 'flex', gap: 90 * scale, marginTop: 55 * scale, flex: 1}}>
          <Channel side={DATA.left} count={leftCount} scale={scale} />
          <Channel side={DATA.right} count={rightCount} scale={scale} />
        </div>

        <div style={{display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between'}}>
          <div>
            <div style={{fontSize: 30 * scale, fontWeight: 800, color: '#111', marginBottom: 8 * scale}}>Daily Subscribers</div>
            {dailyRows.map(([s, daily]) => (
              <div key={s.name} style={{display: 'flex', alignItems: 'center', marginBottom: 6 * scale}}>
                <div
                  style={{
                    background: s.color,
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: 22 * scale,
                    padding: `${3 * scale}px ${12 * scale}px`,
                    borderRadius: 4 * scale,
                    minWidth: 150 * scale,
                  }}
                >
                  {s.name}
                </div>
                <div style={{fontSize: 24 * scale, color: '#111', marginLeft: 12 * scale, fontWeight: 700}}>
                  +{fmt(daily)}
                </div>
              </div>
            ))}
          </div>

          <div style={{fontSize: 58 * scale, fontWeight: 900, color: '#111'}}>{fmt(gap)}</div>
          <div style={{fontSize: 52 * scale, fontWeight: 800, color: '#111'}}>{dateStr}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
