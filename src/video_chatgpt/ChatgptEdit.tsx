import React from 'react';
import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {theme} from './theme';
import {Caption} from './Caption';
import {
  Watermark,
  StepBadge,
  HighlightBox,
  Callout,
  MonoChip,
  Pill,
} from './ui';
import {
  ChapterCard,
  VersusCard,
  AspectRatios,
  FeatureGrid,
  ClosingCard,
} from './scenes';

// 30 fps · 1920x1080 · 15108 frames (503.6 s)
// Timings anclados a la transcripción de Buzz (SRT). El SRT iba adelantado
// respecto a la voz real, así que retrasamos TODO con un offset global.
const OFFSET_SEC = 4.0; // retardo global (ajústalo aquí si hace falta)
const TOTAL = 15108;
const f = (sec: number) => Math.min(TOTAL, Math.round((sec + OFFSET_SEC) * 30));

type Scene = {from: number; to: number; fs?: boolean; el: React.ReactNode};

const SCENES: Scene[] = [
  // ---------- INTRO sobre ChatGPT ----------
  {
    from: f(0.3),
    to: f(5.6),
    el: <Caption text="ChatGPT es excelente para resolver problemas" />,
  },
  {
    from: f(5.7),
    to: f(12.4),
    el: <Caption text="Texto, ideas, imágenes… casi todo" highlight="casi todo" />,
  },
  // "de pago" — resalta el plan de pago (frame 8s: 'Mejorar el plan')
  {
    from: f(12.7),
    to: f(18.0),
    el: (
      <Caption
        text="Pero la mayoría de funciones son DE PAGO"
        highlight="DE PAGO"
        color={theme.warn}
      />
    ),
  },
  {
    from: f(13.4),
    to: f(18.0),
    el: (
      <HighlightBox
        x={18}
        y={974}
        w={222}
        h={46}
        color={theme.warn}
        label="De pago 💳"
        labelSide="top"
      />
    ),
  },

  // ---------- CAPÍTULO: la alternativa gratis ----------
  {
    from: f(18.2),
    to: f(25.5),
    fs: true,
    el: (
      <ChapterCard
        kicker="HOY"
        title="Una IA GRATIS que hace lo mismo"
        highlight="GRATIS"
        accent={theme.ok}
      />
    ),
  },
  // Revela el nombre real (transcripción dice "deaves/howen" → es Qwen)
  {
    from: f(25.6),
    to: f(31.5),
    fs: true,
    el: (
      <ChapterCard
        kicker="Y MUCHO MÁS · GRATIS"
        title="Se llama Qwen"
        highlight="Qwen"
        accent={theme.primary}
      />
    ),
  },

  // ---------- Login Qwen ----------
  {
    from: f(31.7),
    to: f(38.0),
    el: <Caption text="Diseño casi idéntico a ChatGPT" highlight="idéntico" />,
  },
  {
    from: f(38.3),
    to: f(45.6),
    el: <Caption text="Te enseño paso a paso todo lo que hace" />,
  },
  {
    from: f(45.9),
    to: f(52.2),
    el: <Caption text="Superior a ChatGPT — y gratis" highlight="gratis" color={theme.ok} />,
  },
  {
    from: f(46.2),
    to: f(52.2),
    el: <Pill x={1360} y={250} color={theme.ok}>GRATIS e ILIMITADA</Pill>,
  },

  // ---------- PASO 1 · Registro ----------
  {from: f(52.5), to: f(65.4), el: <StepBadge n={1} title="Regístrate" />},
  {
    from: f(55.0),
    to: f(65.0),
    el: (
      <HighlightBox
        x={1812}
        y={138}
        w={100}
        h={40}
        color={theme.accent}
        label="Regístrate 👈"
        labelSide="bottom"
        labelAlign="right"
      />
    ),
  },
  {
    from: f(58.6),
    to: f(65.4),
    el: (
      <Caption text="Nombre, email y contraseña — o Google / GitHub" highlight="Google / GitHub" />
    ),
  },

  // ---------- Caja de chat aparece ----------
  {from: f(65.6), to: f(81.4), el: <StepBadge n={'✓'} title="Ya estás dentro" accent={theme.ok} />},
  {
    from: f(66.5),
    to: f(81.4),
    el: <Caption text="Aparece tu caja de chat, lista para usar" highlight="lista para usar" />,
  },
  {
    from: f(82.0),
    to: f(95.8),
    el: <Caption text="Pruébalo tú mismo, es muy fácil" />,
  },

  // ---------- Nombre + enlace ----------
  {
    from: f(96.2),
    to: f(102.0),
    el: <Callout x={620} y={250} icon="🌐" color={theme.primary}>Qwen · chat.qwen.ai</Callout>,
  },
  {
    from: f(96.6),
    to: f(102.0),
    el: <Pill x={640} y={360} color={theme.secondary}>🔗 Link en el 1º comentario</Pill>,
  },
  {
    from: f(102.2),
    to: f(113.6),
    el: <Caption text="Pídele lo que quieras, igual que a ChatGPT" />,
  },

  // ---------- PASO 2 · Caja de chat (creador con zoom ~118-160) ----------
  {from: f(113.8), to: f(152.6), el: <StepBadge n={2} title="Escribe tu petición" />},
  {
    from: f(114.0),
    to: f(118.6),
    el: <MonoChip x={480} y={140}>quiero una historia sobre los caballeros medievales</MonoChip>,
  },
  {
    from: f(119.0),
    to: f(131.8),
    el: (
      <Callout x={560} y={250} icon="🧠" color={theme.qwen} maxW={780}>
        <b style={{color: theme.qwen}}>Pensamiento</b>: controla cuánto razona la IA
      </Callout>
    ),
  },
  {
    from: f(132.2),
    to: f(138.3),
    el: (
      <Callout x={560} y={250} icon="🌐" color={theme.primary} maxW={780}>
        <b style={{color: theme.primary}}>Buscar</b>: consulta información en internet
      </Callout>
    ),
  },
  {
    from: f(138.6),
    to: f(152.6),
    el: (
      <Callout x={560} y={230} icon="⚙️" color={theme.secondary} maxW={860}>
        4 modos potentes: web, investigación, artefactos e imágenes
      </Callout>
    ),
  },

  // ---------- PASO 3 · Genera ----------
  {from: f(152.9), to: f(170.8), el: <StepBadge n={3} title="Genera el texto" />},
  {
    from: f(153.5),
    to: f(170.8),
    el: <Pill x={1330} y={250} color={theme.secondary}>⚡ Más rápida que ChatGPT</Pill>,
  },

  // ---------- COMPARACIÓN Qwen vs ChatGPT ----------
  {
    from: f(176.0),
    to: f(187.8),
    fs: true,
    el: (
      <VersusCard
        rows={[
          {label: 'velocidad', qwen: 'Más rápido', gpt: 'Más lento', win: true},
          {label: 'precio', qwen: 'Gratis', gpt: 'Funciones de pago', win: true},
          {label: 'imágenes', qwen: 'Ilimitadas', gpt: 'Limitadas', win: true},
        ]}
      />
    ),
  },

  // ---------- PASO 4 · Desarrollo web ----------
  {from: f(188.2), to: f(225.8), el: <StepBadge n={4} title="Desarrollo web" />},
  {
    from: f(200.0),
    to: f(213.0),
    el: (
      <HighlightBox
        x={296}
        y={880}
        w={116}
        h={36}
        color={theme.primary}
        label="Modo: desarrollo web"
        labelSide="top"
      />
    ),
  },
  {
    from: f(200.0),
    to: f(213.0),
    el: <MonoChip x={520} y={140}>genera el código completo para una web de salud</MonoChip>,
  },
  {
    from: f(214.0),
    to: f(225.8),
    el: <Caption text="1 clic → una página web completa" highlight="1 clic" color={theme.ok} />,
  },

  // ---------- PASO 5 · Investigación en profundidad ----------
  {from: f(226.0), to: f(294.8), el: <StepBadge n={5} title="Investigación en profundidad" />},
  {
    from: f(228.0),
    to: f(245.0),
    el: (
      <Callout x={560} y={250} icon="🔎" color={theme.qwen} maxW={820}>
        Primero te hace <b style={{color: theme.qwen}}>preguntas</b> para afinar el resultado
      </Callout>
    ),
  },
  {
    from: f(246.0),
    to: f(270.0),
    el: <Caption text="Un informe más completo que ChatGPT" highlight="más completo" />,
  },
  {
    from: f(271.0),
    to: f(294.8),
    el: <Caption text="Ideal para ensayos y temas a fondo" highlight="a fondo" />,
  },

  // ---------- PASO 6 · Artefactos ----------
  {from: f(302.0), to: f(325.8), el: <StepBadge n={6} title="Artefactos" />},
  {
    from: f(303.0),
    to: f(313.0),
    el: <MonoChip x={560} y={140}>crea una app para alimentar a los perros</MonoChip>,
  },
  {
    from: f(314.0),
    to: f(325.8),
    el: (
      <Callout x={560} y={250} icon="🧩" color={theme.primary} maxW={780}>
        Crea <b style={{color: theme.primary}}>apps y webs</b> funcionales completas
      </Callout>
    ),
  },

  // ---------- PASO 7 · Imágenes ilimitadas ----------
  {from: f(338.0), to: f(360.8), el: <StepBadge n={7} title="Imágenes ILIMITADAS" accent={theme.ok} />},
  {
    from: f(338.5),
    to: f(349.0),
    el: <Caption text="ChatGPT te limita… y luego cobra" highlight="cobra" color={theme.warn} />,
  },
  {
    from: f(349.5),
    to: f(360.8),
    el: <Caption text="Aquí: ilimitadas y gratis" highlight="ilimitadas y gratis" color={theme.ok} />,
  },
  // Explicador de proporciones (scene innovadora full-screen)
  {from: f(361.0), to: f(379.5), fs: true, el: <AspectRatios pick={2} />},
  {
    from: f(380.0),
    to: f(391.8),
    el: <Pill x={640} y={250} color={theme.accent}>16:9 · horizontal (YouTube)</Pill>,
  },
  {
    from: f(392.2),
    to: f(410.0),
    el: <Caption text="Casi el DOBLE de rápido que ChatGPT" highlight="DOBLE" color={theme.secondary} />,
  },
  {
    from: f(411.0),
    to: f(423.8),
    el: (
      <Callout x={560} y={250} icon="🙂" color={theme.secondary} maxW={760}>
        Aquí interpretó «León» como un nombre propio
      </Callout>
    ),
  },
  {from: f(424.0), to: f(449.8), el: <StepBadge n={7} title="Imágenes ILIMITADAS" accent={theme.ok} />},
  {
    from: f(424.5),
    to: f(437.0),
    el: <Caption text="Gato con gafas en una fiesta… ¡calidad brutal!" highlight="calidad brutal" />,
  },
  {
    from: f(437.5),
    to: f(449.8),
    el: (
      <Callout x={560} y={250} icon="⬇️" color={theme.primary} maxW={760}>
        Descarga · comparte · regenera — <b style={{color: theme.ok}}>sin límites</b>
      </Callout>
    ),
  },

  // ---------- PASO 8 · Opción "Más" ----------
  {
    from: f(450.0),
    to: f(473.8),
    fs: true,
    el: (
      <FeatureGrid
        title="Con «Más» también puedes…"
        items={[
          {icon: '🎬', label: 'Generar vídeo'},
          {icon: '💻', label: 'Código'},
          {icon: '🗓️', label: 'Haz un plan'},
          {icon: '📰', label: 'Noticias'},
          {icon: '🔍', label: 'Analizar imagen'},
          {icon: '📝', label: 'Resumir texto'},
          {icon: '💡', label: 'Obtén consejo'},
          {icon: '✍️', label: 'Ayúdame a escribir'},
          {icon: '🌱', label: 'Lluvia de ideas'},
        ]}
      />
    ),
  },

  // ---------- CIERRE ----------
  {
    from: f(474.0),
    to: f(503.5),
    fs: true,
    el: (
      <ClosingCard
        items={[
          'Texto, ideas y ensayos a fondo',
          'Webs y apps con 1 clic',
          'Imágenes ilimitadas',
          'Vídeo, código y mucho más',
        ]}
      />
    ),
  },
];

export const ChatgptEdit: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <OffthreadVideo src={staticFile('Chatgpt(1).mp4')} />
      {SCENES.map((sc, i) => (
        <Sequence key={i} from={sc.from} durationInFrames={Math.max(1, sc.to - sc.from)}>
          {sc.el}
          {/* Marca de agua solo en overlays (oculta en full-screen) */}
          {!sc.fs ? null : null}
        </Sequence>
      ))}
      {/* Watermark global salvo en escenas full-screen */}
      {SCENES.filter((sc) => !sc.fs).map((sc, i) => (
        <Sequence key={`wm-${i}`} from={sc.from} durationInFrames={Math.max(1, sc.to - sc.from)}>
          <Watermark />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
