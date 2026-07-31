// theme.ts -- fuente unica de verdad para el proyecto (paleta, tipografia,
// easings, springs). Adaptado del theme.ts del skill remotion-motion-graphics
// al estilo "documental de archivo" (Vidrush) que usamos en Odisea: grade
// filmico calido, dorado como color heroe, tipografia serif para titulares.
//
// Playfair Display auto-hospedada (public/fonts/, ver src/fonts.ts) para los
// titulares -- no depende de la red en render, a diferencia de
// @remotion/google-fonts, pero da la tipografia serif real (no un fallback
// generico de sistema) que pide un documental "premium".
import {Easing} from 'remotion';
import {ensurePlayfairLoaded} from './fonts';

ensurePlayfairLoaded();

const playfair = '"Playfair Display", Georgia, "Times New Roman", serif';
const inter = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif';

export const theme = {
  colors: {
    bg: '#0B0A08',
    bgAlt: '#15130E',
    primary: '#C9A227', // dorado -- color heroe, maximo un elemento por frame
    accent: '#8B5E34',
    text: '#F5EFE0',
    textDim: '#B8AD94',
    glow: 'rgba(201, 162, 39, 0.45)',
  },
  fonts: {
    display: playfair,
    body: inter,
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
