// theme.ts -- fuente unica de verdad del pipeline generico (colores,
// easings, springs). Deliberadamente neutro (sirve para cualquier
// nicho/guion que suba el usuario), pero con el mismo azul que usa la
// interfaz web (public/index.html) para que la marca se sienta consistente
// entre la app y el video que produce.
import {Easing} from 'remotion';

export const theme = {
  colors: {
    bg: '#0A0B0F',
    primary: '#5B8DEF', // color heroe -- maximo un elemento por frame
    accent: '#F5A623',
    text: '#F5F5F7',
    textDim: '#A8AFBD',
    glow: 'rgba(91, 141, 239, 0.45)',
  },
  fonts: {
    display: '-apple-system, "Segoe UI", Roboto, Arial, sans-serif',
    body: '-apple-system, "Segoe UI", Roboto, Arial, sans-serif',
  },
  ease: {
    out: Easing.bezier(0.16, 1, 0.3, 1), // easeOutExpo -- entradas
    inOut: Easing.bezier(0.83, 0, 0.17, 1), // easeInOutQuint -- Ken Burns, moves
    in: Easing.bezier(0.7, 0, 0.84, 0), // solo salidas
  },
  spring: {
    snappy: {damping: 14, stiffness: 160, mass: 0.6}, // palabras, UI pops
    smooth: {damping: 20, stiffness: 90, mass: 1}, // elementos grandes
    bouncy: {damping: 11, stiffness: 170, mass: 0.7}, // acentos
  },
} as const;
