import React from 'react';
import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {theme} from './theme';
import {Caption} from './Caption';
import {Watermark, StepBadge, HighlightBox, Callout, MonoChip, Pill} from './ui';
import {
  ChapterCard,
  VersusCard,
  AspectRatios,
  FeatureGrid,
  ClosingCard,
} from './scenes';

// 30 fps · 1920x1080 · 15108 frames (503.6 s)
// Cada overlay se ancla al MOMENTO EXACTO en que se pronuncia la frase en la
// transcripción de Buzz (no al inicio del segmento). Sin offset global.
const TOTAL = 15108;
const f = (sec: number) => Math.min(TOTAL, Math.max(0, Math.round(sec * 30)));

type Scene = {from: number; to: number; fs?: boolean; el: React.ReactNode};

const SCENES: Scene[] = [
  // ---------- INTRO sobre ChatGPT ----------
  {from: f(0.3), to: f(5.5), el: <Caption text="ChatGPT es excelente para resolver problemas" />},
  {
    from: f(5.7),
    to: f(11.5),
    el: <Caption text="Conocimiento, imágenes… casi todo" highlight="casi todo" />,
  },
  // "...funciones son de pago" (se dice ~13-15s)
  {
    from: f(13.0),
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
    from: f(13.5),
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
    from: f(18.3),
    to: f(25.4),
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
  // "...es el caso de Qwen" (transcripción dice "deaves/howen" → es Qwen)
  {
    from: f(25.8),
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
  {from: f(32.0), to: f(38.0), el: <Caption text="Diseño casi idéntico a ChatGPT" highlight="idéntico" />},
  {from: f(38.5), to: f(45.6), el: <Caption text="Te enseño paso a paso todo lo que hace" />},
  {
    from: f(46.2),
    to: f(52.2),
    el: <Caption text="Superior a ChatGPT — y gratis" highlight="gratis" color={theme.ok} />,
  },
  {from: f(47.5), to: f(52.2), el: <Pill x={1360} y={250} color={theme.ok}>GRATIS e ILIMITADA</Pill>},

  // ---------- PASO 1 · Registro ("sign up para registrarnos" ~59s) ----------
  {from: f(58.6), to: f(71.0), el: <StepBadge n={1} title="Regístrate" />},
  {
    from: f(59.5),
    to: f(65.4),
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
    from: f(66.0),
    to: f(71.4),
    el: <Caption text="Nombre, email y contraseña — o Google / GitHub" highlight="Google / GitHub" />,
  },

  // ---------- Caja de chat aparece ("la caja de chat" ~82s) ----------
  {from: f(82.0), to: f(89.4), el: <StepBadge n={'✓'} title="Ya estás dentro" accent={theme.ok} />},
  {
    from: f(82.5),
    to: f(89.4),
    el: <Caption text="Aparece tu caja de chat, lista para usar" highlight="lista para usar" />,
  },
  {from: f(90.0), to: f(95.9), el: <Caption text="Quédate, esto te va a interesar" />},

  // ---------- Nombre + enlace ("se llama Qwen.ai... enlace" ~97-104s) ----------
  {
    from: f(97.0),
    to: f(102.5),
    el: <Callout x={620} y={250} icon="🌐" color={theme.primary}>Qwen · chat.qwen.ai</Callout>,
  },
  {
    from: f(100.5),
    to: f(107.0),
    el: <Pill x={640} y={360} color={theme.secondary}>🔗 Link en el 1º comentario</Pill>,
  },
  {
    from: f(108.0),
    to: f(113.6),
    el: <Caption text="Pídele lo que quieras, igual que a ChatGPT" />,
  },

  // ---------- PASO 2 · Caja de chat ----------
  {from: f(114.0), to: f(138.2), el: <StepBadge n={2} title="Escribe tu petición" />},
  {
    from: f(115.0),
    to: f(119.5),
    el: <MonoChip x={480} y={140}>quiero una historia sobre los caballeros medievales</MonoChip>,
  },
  {
    from: f(119.5),
    to: f(132.2),
    el: (
      <Callout x={560} y={250} icon="🧠" color={theme.qwen} maxW={780}>
        <b style={{color: theme.qwen}}>Pensamiento</b>: controla cuánto razona la IA
      </Callout>
    ),
  },
  {
    from: f(133.0),
    to: f(138.3),
    el: (
      <Callout x={560} y={250} icon="🌐" color={theme.primary} maxW={780}>
        <b style={{color: theme.primary}}>Buscar</b>: consulta información en internet
      </Callout>
    ),
  },
  {
    from: f(139.0),
    to: f(148.6),
    el: (
      <Callout x={560} y={230} icon="⚙️" color={theme.secondary} maxW={860}>
        4 modos potentes: web, investigación, artefactos e imágenes
      </Callout>
    ),
  },

  // ---------- PASO 3 · Genera ("darle generar" ~151s) ----------
  {from: f(151.0), to: f(171.4), el: <StepBadge n={3} title="Genera el texto" />},
  // "más rápida que ChatGPT" se dice ~167s
  {
    from: f(166.5),
    to: f(171.4),
    el: <Pill x={1330} y={250} color={theme.secondary}>⚡ Más rápida que ChatGPT</Pill>,
  },

  // ---------- COMPARACIÓN ("probar en tiempo real" ~172-188s) ----------
  {
    from: f(176.0),
    to: f(188.5),
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

  // ---------- PASO 4 · Desarrollo web ("opción que dice desarrollo web" ~189s) ----------
  {from: f(189.0), to: f(226.0), el: <StepBadge n={4} title="Desarrollo web" />},
  {
    from: f(190.0),
    to: f(197.0),
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
  // "generar el código completo para una web de salud" ~196-200s
  {
    from: f(196.0),
    to: f(206.0),
    el: <MonoChip x={520} y={140}>genera el código completo para una web de salud</MonoChip>,
  },
  // "página web completa... un solo clic" ~213-218s
  {
    from: f(213.0),
    to: f(218.3),
    el: <Caption text="1 clic → una página web completa" highlight="1 clic" color={theme.ok} />,
  },

  // ---------- PASO 5 · Investigación en profundidad ("Tenemos investigación" ~227s) ----------
  {from: f(227.0), to: f(295.6), el: <StepBadge n={5} title="Investigación en profundidad" />},
  // Preguntas clarificadoras ~248-258s
  {
    from: f(248.0),
    to: f(262.0),
    el: (
      <Callout x={560} y={250} icon="🔎" color={theme.qwen} maxW={820}>
        Primero te hace <b style={{color: theme.qwen}}>preguntas</b> para afinar el resultado
      </Callout>
    ),
  },
  // "muchas más opciones que ChatGPT" ~265-272s
  {
    from: f(265.0),
    to: f(278.0),
    el: <Caption text="Un informe más completo que ChatGPT" highlight="más completo" />,
  },
  {
    from: f(280.0),
    to: f(294.5),
    el: <Caption text="Ideal para ensayos y temas a fondo" highlight="a fondo" />,
  },

  // ---------- PASO 6 · Artefactos ("crear de artefactos" ~296s) ----------
  {from: f(296.0), to: f(325.8), el: <StepBadge n={6} title="Artefactos" />},
  // "crea una aplicación para... alimentación de los perros" ~303-309s
  {
    from: f(303.0),
    to: f(313.0),
    el: <MonoChip x={560} y={140}>crea una app para alimentar a los perros</MonoChip>,
  },
  // "crear una aplicación, crear una página web sin problema" ~326-332s
  {
    from: f(326.0),
    to: f(333.0),
    el: (
      <Callout x={560} y={250} icon="🧩" color={theme.primary} maxW={780}>
        Crea <b style={{color: theme.primary}}>apps y webs</b> funcionales completas
      </Callout>
    ),
  },

  // ---------- PASO 7 · Imágenes ("generación de imágenes" ~336s) ----------
  {from: f(334.0), to: f(361.5), el: <StepBadge n={7} title="Imágenes ILIMITADAS" accent={theme.ok} />},
  // "ya no podemos generar más... pagar el plan premium" ~345-354s
  {
    from: f(345.0),
    to: f(355.0),
    el: <Caption text="ChatGPT te limita… y luego cobra" highlight="cobra" color={theme.warn} />,
  },
  // "generar imágenes de forma ilimitada completamente gratis" ~356-361s
  {
    from: f(356.0),
    to: f(361.6),
    el: <Caption text="Aquí: ilimitadas y gratis" highlight="ilimitadas y gratis" color={theme.ok} />,
  },
  // Explicación de proporciones ~369-390s
  {from: f(369.0), to: f(390.0), fs: true, el: <AspectRatios pick={2} />},
  // "lo voy a poner 16 9... horizontal" ~387-392s
  {
    from: f(387.0),
    to: f(393.0),
    el: <Pill x={640} y={250} color={theme.accent}>16:9 · horizontal (YouTube)</Pill>,
  },
  // "más rápida, casi el doble de ChatGPT" ~400-404s
  {
    from: f(400.0),
    to: f(410.0),
    el: <Caption text="Casi el DOBLE de rápido que ChatGPT" highlight="DOBLE" color={theme.secondary} />,
  },
  // "interpretando que león... el nombre se llama león" ~410-420s
  {
    from: f(411.0),
    to: f(423.0),
    el: (
      <Callout x={560} y={250} icon="🙂" color={theme.secondary} maxW={760}>
        Aquí interpretó «León» como un nombre propio
      </Callout>
    ),
  },
  {from: f(424.0), to: f(461.0), el: <StepBadge n={7} title="Imágenes ILIMITADAS" accent={theme.ok} />},
  // "gato con gafas bailando en una fiesta... calidad excelente" ~425-443s
  {
    from: f(425.0),
    to: f(438.0),
    el: <Caption text="Gato con gafas en una fiesta… ¡calidad brutal!" highlight="calidad brutal" />,
  },
  // "podemos descargar, compartirla... de forma ilimitada" ~449-455s
  {
    from: f(449.0),
    to: f(461.0),
    el: (
      <Callout x={560} y={250} icon="⬇️" color={theme.primary} maxW={760}>
        Descarga · comparte · regenera — <b style={{color: theme.ok}}>sin límites</b>
      </Callout>
    ),
  },

  // ---------- PASO 8 · Opción "Más" ("opción de más" ~462-481s) ----------
  {
    from: f(462.0),
    to: f(481.5),
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

  // ---------- CIERRE ("si quieres aprender más..." ~482-503s) ----------
  {
    from: f(482.0),
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
        </Sequence>
      ))}
      {/* Marca de agua salvo en escenas full-screen */}
      {SCENES.filter((sc) => !sc.fs).map((sc, i) => (
        <Sequence key={`wm-${i}`} from={sc.from} durationInFrames={Math.max(1, sc.to - sc.from)}>
          <Watermark />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
