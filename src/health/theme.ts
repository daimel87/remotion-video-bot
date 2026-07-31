// Paleta y tipografía — canal de salud / cocina frugal para seniors (50+).
// Prioridad: ALTA LEGIBILIDAD (contraste fuerte, texto grande), tono cálido de cocina.
export const FPS = 30;

export const COLORS = {
  bg: '#151009',       // marrón muy oscuro cálido (no negro frío)
  paper: '#fbf6ec',    // crema cálida — texto principal (contraste alto para 50+)
  ink: '#241809',
  amber: '#eaa63a',    // ámbar cálido (acento principal, apetitoso)
  tomato: '#d1492f',   // rojo tomate (acento de precio/urgencia)
  sage: '#7f9152',     // verde salvia (salud / vegetales)
  cream: '#f2e7d2',    // fondo de tarjetas de papel
  dim: 'rgba(251,246,236,0.78)',
};

// Serif para titulares (calidez, confianza), sans para etiquetas.
export const FONT = `Georgia, 'Times New Roman', serif`;
export const FONT_SANS = `'Helvetica Neue', Arial, sans-serif`;
export const FONT_BODY = `'Helvetica Neue', Arial, sans-serif`;

export type Accent = 'amber' | 'tomato' | 'sage' | 'paper';
export const accentColor = (a?: Accent) =>
  a === 'tomato' ? COLORS.tomato : a === 'sage' ? COLORS.sage : a === 'paper' ? COLORS.paper : COLORS.amber;
