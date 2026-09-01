// RamTableEdit.tsx -- tabla resumen animada "estilo tech, rejilla azul" para
// el calculo de tamano de pagefile segun RAM. Composicion autocontenida: no
// toca src/theme.ts (que es el tema documental dorado usado en Odisea/salud)
// -- define su propio tema local azul/tech para no chocar con el resto del
// proyecto.
import React from 'react';
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from 'remotion';

export const FPS = 30;
export const DURATION = 60 * FPS; // 1800 frames / 60s

export type Lang = 'es' | 'en';

const STR = {
  es: {
    eyebrow: 'Configuracion de memoria virtual',
    title: 'TAMAÑO DE PAGEFILE SEGÚN TU RAM',
    subtitle: 'Tamaño inicial y máximo recomendados, por nivel de RAM',
    header: ['RAM', 'TAMAÑO INICIAL', 'TAMAÑO MÁXIMO'],
    tableTitle: 'Resumen por nivel de RAM',
    formulaTitle: 'La fórmula es sencilla',
    initialLabel: 'Tamaño inicial',
    maxLabel: 'Tamaño máximo',
    numberLocale: 'es-MX',
  },
  en: {
    eyebrow: 'Virtual memory configuration',
    title: 'PAGEFILE SIZE BASED ON YOUR RAM',
    subtitle: 'Recommended initial and maximum size, by RAM tier',
    header: ['RAM', 'INITIAL SIZE', 'MAXIMUM SIZE'],
    tableTitle: 'Summary by RAM tier',
    formulaTitle: "The formula is simple",
    initialLabel: 'Initial size',
    maxLabel: 'Maximum size',
    numberLocale: 'en-US',
  },
} as const;

const theme = {
  colors: {
    bg: '#050B16',
    bgAlt: '#0A1830',
    grid: 'rgba(56, 154, 255, 0.14)',
    gridDim: 'rgba(56, 154, 255, 0.06)',
    primary: '#3AA9FF', // azul -- color heroe, un solo elemento por frame
    accent: '#22D3EE',
    text: '#EAF3FF',
    textDim: '#7FA3CC',
    glow: 'rgba(58, 169, 255, 0.5)',
    card: 'rgba(12, 28, 54, 0.72)',
    cardBorder: 'rgba(90, 170, 255, 0.28)',
  },
  fonts: {
    display:
      '"Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, Arial, sans-serif',
    mono: '"JetBrains Mono", "SFMono-Regular", ui-monospace, Menlo, Consolas, monospace',
  },
  ease: {
    out: Easing.bezier(0.16, 1, 0.3, 1),
    inOut: Easing.bezier(0.83, 0, 0.17, 1),
    in: Easing.bezier(0.7, 0, 0.84, 0),
  },
  spring: {
    snappy: {damping: 14, stiffness: 160, mass: 0.6},
    smooth: {damping: 20, stiffness: 90, mass: 1},
    bouncy: {damping: 11, stiffness: 170, mass: 0.7},
  },
} as const;

// ---------- layer 1: background mesh + moving tech grid ----------
const BgMesh: React.FC = () => {
  const frame = useCurrentFrame();
  const d1 = Math.sin(frame / 60) * 60;
  const d2 = Math.cos(frame / 75) * 45;
  const gridShift = (frame * 0.35) % 64;
  return (
    <AbsoluteFill style={{background: theme.colors.bg}}>
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${theme.colors.gridDim} 1px, transparent 1px),
            linear-gradient(90deg, ${theme.colors.gridDim} 1px, transparent 1px)`,
          backgroundSize: '64px 64px',
          backgroundPosition: `${gridShift}px ${gridShift}px`,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${theme.colors.grid} 1px, transparent 1px),
            linear-gradient(90deg, ${theme.colors.grid} 1px, transparent 1px)`,
          backgroundSize: '320px 320px',
          backgroundPosition: `${gridShift * 5}px ${gridShift * 5}px`,
          maskImage:
            'radial-gradient(ellipse 70% 60% at 50% 42%, black 40%, transparent 85%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 1300,
          height: 1300,
          borderRadius: '50%',
          top: -520,
          left: -360 + d1,
          filter: 'blur(90px)',
          background: `radial-gradient(circle, ${theme.colors.primary}30, transparent 62%)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 1000,
          height: 1000,
          borderRadius: '50%',
          bottom: -420,
          right: -280 - d2,
          filter: 'blur(100px)',
          background: `radial-gradient(circle, ${theme.colors.accent}22, transparent 65%)`,
        }}
      />
    </AbsoluteFill>
  );
};

// ---------- layers: grade, grain, vignette ----------
const Grade: React.FC = () => (
  <AbsoluteFill style={{pointerEvents: 'none'}}>
    <AbsoluteFill
      style={{
        backgroundColor: theme.colors.primary,
        mixBlendMode: 'soft-light',
        opacity: 0.16,
      }}
    />
    <AbsoluteFill
      style={{
        background:
          'linear-gradient(180deg, rgba(0,0,0,0.22), transparent 30%, transparent 70%, rgba(0,0,0,0.3))',
      }}
    />
  </AbsoluteFill>
);

const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  const noise = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`;
  return (
    <AbsoluteFill
      style={{
        pointerEvents: 'none',
        backgroundImage: noise,
        backgroundSize: '220px',
        backgroundPosition: `${(frame * 7) % 220}px ${(frame * 13) % 220}px`,
        opacity: 0.045,
        mixBlendMode: 'overlay',
      }}
    />
  );
};

const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      pointerEvents: 'none',
      background:
        'radial-gradient(ellipse at center, transparent 55%, rgba(0,4,10,0.55) 100%)',
    }}
  />
);

// ---------- reusable: entrance wrapper ----------
const Entrance: React.FC<{
  delay?: number;
  springConfig?: typeof theme.spring.smooth;
  yFrom?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({delay = 0, springConfig = theme.spring.smooth, yFrom = 40, style, children}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: frame - delay, fps, config: springConfig});
  return (
    <div
      style={{
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [yFrom, 0])}px) scale(${interpolate(
          p,
          [0, 1],
          [0.94, 1],
        )})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// ---------- reusable: word-by-word reveal ----------
const WordReveal: React.FC<{
  text: string;
  delay?: number;
  per?: number;
  style?: React.CSSProperties;
}> = ({text, delay = 0, per = 3, style}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <div style={{display: 'flex', flexWrap: 'wrap', gap: 14, ...style}}>
      {text.split(' ').map((word, i) => {
        const p = spring({frame: frame - delay - i * per, fps, config: theme.spring.snappy});
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              opacity: p,
              transform: `translateY(${interpolate(p, [0, 1], [30, 0])}px)`,
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};

// ---------- reusable: animated tabular counter ----------
const Counter: React.FC<{
  target: number;
  delay?: number;
  suffix?: string;
  locale?: string;
  style?: React.CSSProperties;
}> = ({target, delay = 0, suffix = '', locale = 'es-MX', style}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: frame - delay, fps, config: {damping: 30, stiffness: 60}});
  const value = Math.round(interpolate(p, [0, 1], [0, target], {extrapolateRight: 'clamp'}));
  return (
    <span style={{fontVariantNumeric: 'tabular-nums', ...style}}>
      {value.toLocaleString(locale)}
      {suffix}
    </span>
  );
};

// ---------- data ----------
const ROWS: Array<{ram: number; initial: number; max: number}> = [
  {ram: 2, initial: 3072, max: 6144},
  {ram: 6, initial: 9216, max: 18432},
  {ram: 8, initial: 12288, max: 24576},
  {ram: 16, initial: 24576, max: 49152},
];

// frame each row's entrance begins (staggered across the ~45s table scene)
const ROW_START = [30, 330, 630, 930];
const ROW_STAGGER = 8; // ram chip -> initial -> max, frame offsets within a row

// ---------- Scene 1: intro title ----------
const IntroScene: React.FC<{lang: Lang}> = ({lang}) => {
  const t = STR[lang];
  const frame = useCurrentFrame();
  const exitO = interpolate(frame, [120, 148], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <AbsoluteFill
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        opacity: exitO,
      }}
    >
      <Entrance delay={4} springConfig={theme.spring.bouncy}>
        <div
          style={{
            fontFamily: theme.fonts.mono,
            fontSize: 30,
            letterSpacing: 6,
            color: theme.colors.accent,
            textTransform: 'uppercase',
            marginBottom: 22,
            textAlign: 'center',
          }}
        >
          {t.eyebrow}
        </div>
      </Entrance>
      <div style={{maxWidth: 1400, textAlign: 'center'}}>
        <WordReveal
          text={t.title}
          delay={12}
          per={3}
          style={{
            justifyContent: 'center',
            fontFamily: theme.fonts.display,
            fontWeight: 800,
            fontSize: 92,
            color: theme.colors.text,
            lineHeight: 1.05,
            textShadow: `0 0 60px ${theme.colors.glow}`,
          }}
        />
      </div>
      <Entrance delay={38} yFrom={24}>
        <div
          style={{
            marginTop: 30,
            fontFamily: theme.fonts.display,
            fontSize: 34,
            color: theme.colors.textDim,
            textAlign: 'center',
          }}
        >
          {t.subtitle}
        </div>
      </Entrance>
    </AbsoluteFill>
  );
};

// ---------- table header ----------
const HeaderRow: React.FC<{lang: Lang}> = ({lang}) => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1.5fr 1.5fr',
      gap: 24,
      padding: '0 40px',
      marginBottom: 18,
    }}
  >
    {STR[lang].header.map((label) => (
      <div
        key={label}
        style={{
          fontFamily: theme.fonts.mono,
          fontSize: 24,
          letterSpacing: 3,
          color: theme.colors.textDim,
          textTransform: 'uppercase',
        }}
      >
        {label}
      </div>
    ))}
  </div>
);

// ---------- a single animated table row ----------
const TableRow: React.FC<{
  ram: number;
  initial: number;
  max: number;
  delay: number;
  breathePhase: number;
  locale: string;
}> = ({ram, initial, max, delay, breathePhase, locale}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: frame - delay, fps, config: theme.spring.smooth});
  const breathe = 1 + Math.sin(frame / 26 + breathePhase) * 0.008;
  const cellStyle: React.CSSProperties = {
    background: theme.colors.card,
    border: `1px solid ${theme.colors.cardBorder}`,
    borderRadius: 18,
    padding: '26px 32px',
    boxShadow: '0 24px 50px -18px rgba(0,10,30,0.7)',
  };
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1.5fr 1.5fr',
        gap: 24,
        padding: '0 40px',
        marginBottom: 22,
        opacity: p,
        transform: `translateX(${interpolate(p, [0, 1], [-60, 0])}px) scale(${breathe})`,
      }}
    >
      <div style={{...cellStyle, display: 'flex', alignItems: 'center', gap: 14}}>
        <div
          style={{
            width: 14,
            height: 14,
            borderRadius: 7,
            background: theme.colors.primary,
            boxShadow: `0 0 18px ${theme.colors.glow}`,
          }}
        />
        <span
          style={{
            fontFamily: theme.fonts.mono,
            fontSize: 44,
            fontWeight: 700,
            color: theme.colors.text,
          }}
        >
          {ram} GB
        </span>
      </div>
      <div style={cellStyle}>
        <Counter
          target={initial}
          delay={delay + ROW_STAGGER}
          suffix=" MB"
          locale={locale}
          style={{
            fontFamily: theme.fonts.mono,
            fontSize: 44,
            fontWeight: 600,
            color: theme.colors.accent,
          }}
        />
      </div>
      <div style={cellStyle}>
        <Counter
          target={max}
          delay={delay + ROW_STAGGER * 2}
          suffix=" MB"
          locale={locale}
          style={{
            fontFamily: theme.fonts.mono,
            fontSize: 44,
            fontWeight: 600,
            color: theme.colors.primary,
          }}
        />
      </div>
    </div>
  );
};

// ---------- Scene 2: the table builds row by row ----------
const TableScene: React.FC<{lang: Lang}> = ({lang}) => {
  const t = STR[lang];
  const frame = useCurrentFrame();
  const entrance = spring({frame: frame - 6, fps: FPS, config: theme.spring.smooth});
  const exitO = interpolate(frame, [1330, 1350], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const exitY = interpolate(frame, [1330, 1350], [0, -30], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        opacity: entrance * exitO,
        transform: `translateY(${interpolate(entrance, [0, 1], [26, 0]) + exitY}px)`,
      }}
    >
      <div
        style={{
          fontFamily: theme.fonts.display,
          fontWeight: 800,
          fontSize: 40,
          color: theme.colors.text,
          marginBottom: 34,
          letterSpacing: 1,
        }}
      >
        {t.tableTitle}
      </div>
      <div style={{width: 1560}}>
        <HeaderRow lang={lang} />
        {ROWS.map((row, i) => (
          <TableRow
            key={row.ram}
            ram={row.ram}
            initial={row.initial}
            max={row.max}
            delay={ROW_START[i]}
            breathePhase={i * 1.7}
            locale={t.numberLocale}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ---------- Scene 3: formula recap ----------
const FormulaCard: React.FC<{
  label: string;
  formula: string;
  delay: number;
  color: string;
}> = ({label, formula, delay, color}) => {
  return (
    <Entrance delay={delay} springConfig={theme.spring.bouncy} yFrom={54}>
      <div
        style={{
          background: theme.colors.card,
          border: `1px solid ${theme.colors.cardBorder}`,
          borderRadius: 26,
          padding: '40px 56px',
          minWidth: 620,
          boxShadow: `0 30px 70px -20px rgba(0,10,30,0.75), 0 0 0 1px rgba(255,255,255,0.02)`,
        }}
      >
        <div
          style={{
            fontFamily: theme.fonts.mono,
            fontSize: 22,
            letterSpacing: 3,
            textTransform: 'uppercase',
            color: theme.colors.textDim,
            marginBottom: 14,
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontFamily: theme.fonts.mono,
            fontWeight: 700,
            fontSize: 56,
            color,
            textShadow: `0 0 40px ${color}66`,
          }}
        >
          {formula}
        </div>
      </div>
    </Entrance>
  );
};

const FormulaScene: React.FC<{lang: Lang}> = ({lang}) => {
  const t = STR[lang];
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame, fps, config: theme.spring.smooth});
  return (
    <AbsoluteFill
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [30, 0])}px)`,
      }}
    >
      <Entrance delay={0} yFrom={20}>
        <div
          style={{
            fontFamily: theme.fonts.display,
            fontWeight: 800,
            fontSize: 52,
            color: theme.colors.text,
            marginBottom: 44,
            textAlign: 'center',
          }}
        >
          {t.formulaTitle}
        </div>
      </Entrance>
      <div style={{display: 'flex', gap: 42}}>
        <FormulaCard
          label={t.initialLabel}
          formula="RAM × 1024 × 1.5"
          delay={14}
          color={theme.colors.accent}
        />
        <FormulaCard
          label={t.maxLabel}
          formula="RAM × 1024 × 3"
          delay={22}
          color={theme.colors.primary}
        />
      </div>
    </AbsoluteFill>
  );
};

// ---------- root composition ----------
export const RamTableEdit: React.FC<{lang?: Lang}> = ({lang = 'es'}) => {
  return (
    <AbsoluteFill style={{fontFamily: theme.fonts.display}}>
      <BgMesh />
      <Sequence from={0} durationInFrames={150}>
        <IntroScene lang={lang} />
      </Sequence>
      <Sequence from={120} durationInFrames={1350}>
        <TableScene lang={lang} />
      </Sequence>
      <Sequence from={1440} durationInFrames={360}>
        <FormulaScene lang={lang} />
      </Sequence>
      <Grade />
      <Grain />
      <Vignette />
    </AbsoluteFill>
  );
};
