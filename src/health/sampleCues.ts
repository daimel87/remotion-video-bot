// GUION DE MUESTRA (placeholder) — se reemplaza mañana por la transcripción de Buzz.
// Formato idéntico al del CD: {i, start, end, text}. Tiempos en segundos.
// Tema de ejemplo: "5 comidas saludables y baratas después de los 50".
// Sirve para verificar la plantilla; NO es el guion final.
export interface Cue {i: number; start: number; end: number; text: string;}

export const cues: Cue[] = [
  {i: 1, start: 0.0, end: 4.2, text: 'Comer sano después de los 50 no tiene por qué costar una fortuna.'},
  {i: 2, start: 4.2, end: 9.0, text: 'Con menos de dos dólares al día puedes preparar comidas que cuidan tu corazón, tus huesos y tu energía.'},
  {i: 3, start: 9.0, end: 13.0, text: 'Hoy te muestro cinco recetas humildes que hacían nuestras abuelas y que hoy la ciencia recomienda.'},

  {i: 4, start: 13.0, end: 16.0, text: 'Empecemos. Receta número uno: sopa de lentejas.'},
  {i: 5, start: 16.0, end: 21.0, text: 'Un plato de lentejas cuesta apenas cincuenta centavos y aporta más proteína que un huevo.'},
  {i: 6, start: 21.0, end: 26.0, text: 'Es rica en hierro y en fibra, ideal para mantener el azúcar en sangre estable.'},

  {i: 7, start: 26.0, end: 29.5, text: 'Receta número dos: crema de avena con canela.'},
  {i: 8, start: 29.5, end: 34.5, text: 'La avena reduce el colesterol y te mantiene lleno toda la mañana por muy poco dinero.'},
  {i: 9, start: 34.5, end: 39.0, text: 'Una pizca de canela ayuda a controlar la glucosa, según varios estudios.'},

  {i: 10, start: 39.0, end: 42.5, text: 'Receta número tres: sardinas con pan integral.'},
  {i: 11, start: 42.5, end: 48.0, text: 'Las sardinas en lata son la fuente más barata de omega tres y de calcio con vitamina D.'},
  {i: 12, start: 48.0, end: 52.5, text: 'Perfectas para fortalecer los huesos y prevenir la osteoporosis.'},

  {i: 13, start: 52.5, end: 56.0, text: 'Receta número cuatro: sopa de vegetales de la semana.'},
  {i: 14, start: 56.0, end: 61.5, text: 'Con las verduras que te sobran armas una olla que rinde para varios días por menos de dos dólares.'},
  {i: 15, start: 61.5, end: 66.0, text: 'Nada se desperdicia, como en los tiempos de nuestros abuelos.'},

  {i: 16, start: 66.0, end: 69.5, text: 'Y la receta número cinco: arroz con pollo enlatado.'},
  {i: 17, start: 69.5, end: 74.5, text: 'Cálida, cremosa, de una sola olla y sin carne cruda que manipular. Comodidad y dignidad.'},

  {i: 18, start: 74.5, end: 79.0, text: 'Cinco comidas, una semana entera de nutrición, por el precio de un solo café.'},
  {i: 19, start: 79.0, end: 83.0, text: 'Si te sirvió, quédate para el próximo video. Tu salud y tu bolsillo te lo agradecerán.'},
];

export const DURATION_SECONDS = 83.0;
