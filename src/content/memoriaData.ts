// Timing calculado directamente sobre la forma de onda del audio real
// (deteccion de silencios con ffmpeg, no solo el SRT). El SRT de Buzz se
// uso para saber que texto va en cada bloque, pero cada corte se ajusto
// al punto exacto donde la voz retoma despues de la pausa real mas
// cercana, a 30fps.
//
// Correcciones respecto al guion original (el audio grabado no dijo
// exactamente lo mismo en 2 lugares, se ajusto el caption para que
// coincida con lo que realmente se escucha):
//   - Bloque 30: el guion decia "...una sola vez, nunca se repitio."
//     pero el audio solo dice "...una sola vez." (la clausula final
//     no se llego a narrar)
//   - Bloque 38: el audio dice "almuerzo" en vez de "comida"

export interface Segment {
  text: string;
  image: string;
  durationInFrames: number;
}

export const segments: Segment[] = [
  {text: 'Puedes cantar una canción entera que no escuchabas hace veinte años.', image: 'memoria_images/01.png', durationInFrames: 146},
  {text: 'Cada palabra, cada pausa, cada nota exacta.', image: 'memoria_images/02.png', durationInFrames: 115},
  {text: 'Pero no recuerdas qué comiste ayer al mediodía.', image: 'memoria_images/03.png', durationInFrames: 109},
  {text: '¿No te parece extraño?', image: 'memoria_images/04.png', durationInFrames: 56},
  {text: 'Tu cerebro no está fallando.', image: 'memoria_images/05.png', durationInFrames: 48},
  {text: 'Está haciendo justo lo que fue diseñado para hacer.', image: 'memoria_images/06.png', durationInFrames: 123},
  {text: 'Esto no es solo curiosidad.', image: 'memoria_images/07.png', durationInFrames: 59},
  {text: 'Es la clave de cómo funciona tu memoria en cada momento del día.', image: 'memoria_images/08.png', durationInFrames: 158},
  {text: 'Todos los días olvidas miles de detalles sin darte cuenta.', image: 'memoria_images/09.png', durationInFrames: 119},
  {text: 'Una conversación, un trayecto, una comida completa.', image: 'memoria_images/10.png', durationInFrames: 130},
  {text: 'Y sin embargo, ciertos recuerdos se quedan grabados para siempre.', image: 'memoria_images/11.png', durationInFrames: 138},
  {text: 'La diferencia no es casualidad.', image: 'memoria_images/12.png', durationInFrames: 73},
  {text: 'Es un mecanismo que decide, sin pedirte permiso, qué merece quedarse contigo.', image: 'memoria_images/13.png', durationInFrames: 197},
  {text: 'Primero, tu cerebro no guarda información. Guarda emociones con información pegada.', image: 'memoria_images/14.png', durationInFrames: 190},
  {text: 'Cuando escuchaste esa canción por primera vez, probablemente estabas viviendo algo intenso.', image: 'memoria_images/15.png', durationInFrames: 165},
  {text: 'Un primer amor, una fiesta, una despedida.', image: 'memoria_images/16.png', durationInFrames: 107},
  {text: 'Tu cerebro liberó dopamina en ese instante exacto.', image: 'memoria_images/17.png', durationInFrames: 113},
  {text: 'Y esa dopamina actuó como pegamento neuronal.', image: 'memoria_images/18.png', durationInFrames: 110},
  {text: 'Grabó la canción junto con la emoción, con una fuerza que el comer de ayer nunca tuvo.', image: 'memoria_images/19.png', durationInFrames: 198},
  {text: 'Comer al mediodía es rutina. Tu cerebro ignora la rutina de forma automática.', image: 'memoria_images/20.png', durationInFrames: 157},
  {text: 'No porque quiera, sino porque procesarlo todo te volvería loco.', image: 'memoria_images/21.png', durationInFrames: 138},
  {text: 'Pero lo que nadie esperaba es que esa misma dopamina puede secuestrarte años después.', image: 'memoria_images/22.png', durationInFrames: 201},
  {text: 'Segundo factor: la repetición inconsciente.', image: 'memoria_images/23.png', durationInFrames: 114},
  {text: 'Esa canción no la escuchaste una sola vez.', image: 'memoria_images/24.png', durationInFrames: 88},
  {text: 'La escuchaste en la radio del auto, en una fiesta, en un anuncio de televisión.', image: 'memoria_images/25.png', durationInFrames: 156},
  {text: 'Docenas de veces, sin que decidieras memorizarla.', image: 'memoria_images/26.png', durationInFrames: 122},
  {text: 'Cada repetición reforzó la conexión neuronal un poco más.', image: 'memoria_images/27.png', durationInFrames: 132},
  {text: 'Es como pisar el mismo camino de tierra cada día.', image: 'memoria_images/28.png', durationInFrames: 95},
  {text: 'Al principio es solo hierba. Después de cien pasos, es un sendero imposible de borrar.', image: 'memoria_images/29.png', durationInFrames: 201},
  {text: 'Tu almuerzo de ayer lo viviste una sola vez.', image: 'memoria_images/30.png', durationInFrames: 86},
  {text: 'Nunca se convirtió en sendero.', image: 'memoria_images/31.png', durationInFrames: 73},
  {text: 'Pero lo que nadie esperaba es que ni siquiera necesitas prestar atención para que el sendero se forme.', image: 'memoria_images/32.png', durationInFrames: 217},
  {text: 'Tercero: el contexto multisensorial.', image: 'memoria_images/33.png', durationInFrames: 114},
  {text: 'Una canción llega acompañada de ritmo, de letra, de melodía, de la voz exacta del cantante.', image: 'memoria_images/34.png', durationInFrames: 203},
  {text: 'Son cuatro o cinco canales de información grabándose al mismo tiempo.', image: 'memoria_images/35.png', durationInFrames: 144},
  {text: 'Tu cerebro conecta todos esos canales entre sí.', image: 'memoria_images/36.png', durationInFrames: 102},
  {text: 'Por eso basta escuchar los primeros dos segundos para recordar la canción completa.', image: 'memoria_images/37.png', durationInFrames: 170},
  {text: 'Tu almuerzo de ayer solo tuvo un canal débil: la vista, por unos segundos, sin significado especial.', image: 'memoria_images/38.png', durationInFrames: 203},
  {text: 'Ningún ritmo, ninguna emoción, ninguna repetición.', image: 'memoria_images/39.png', durationInFrames: 144},
  {text: 'Pero lo que nadie esperaba es que este mismo mecanismo explica por qué recuerdas un olor de la infancia treinta años después.', image: 'memoria_images/40.png', durationInFrames: 232},
  {text: 'Con una fuerza que ninguna otra cosa logra.', image: 'memoria_images/41.png', durationInFrames: 112},
  {text: 'Cuarto: tu hipocampo hace una selección brutal cada noche.', image: 'memoria_images/42.png', durationInFrames: 149},
  {text: 'Mientras duermes, tu cerebro revisa el día completo.', image: 'memoria_images/43.png', durationInFrames: 105},
  {text: 'Decide qué guardar a largo plazo y qué borrar para siempre.', image: 'memoria_images/44.png', durationInFrames: 129},
  {text: 'Prioriza lo emocional, lo novedoso, lo repetido con fuerza.', image: 'memoria_images/45.png', durationInFrames: 139},
  {text: 'Descarta lo predecible, lo neutro, lo que ya conocías.', image: 'memoria_images/46.png', durationInFrames: 140},
  {text: 'Tu almuerzo de ayer fue descartado en cuestión de horas, no por error, por diseño.', image: 'memoria_images/47.png', durationInFrames: 174},
  {text: 'Guardar cada comida de tu vida saturaría tu mente en semanas.', image: 'memoria_images/48.png', durationInFrames: 134},
  {text: 'Pero lo que nadie esperaba es que este filtro nocturno es tan preciso que puede sobrevivir incluso cuando el resto de la memoria colapsa.', image: 'memoria_images/49.png', durationInFrames: 283},
  {text: 'Aquí está el dato que cambia todo.', image: 'memoria_images/50.png', durationInFrames: 74},
  {text: 'Pacientes con alzhéimer avanzado, que ya no reconocen a su propia familia, todavía pueden cantar canciones completas de su juventud.', image: 'memoria_images/51.png', durationInFrames: 249},
  {text: 'La memoria musical vive en una zona del cerebro distinta, una de las últimas en deteriorarse.', image: 'memoria_images/52.png', durationInFrames: 180},
  {text: 'Es el equivalente a un edificio que se derrumba entero, menos una habitación blindada.', image: 'memoria_images/53.png', durationInFrames: 165},
  {text: 'Esa habitación guarda las canciones que una vez te hicieron sentir algo real.', image: 'memoria_images/54.png', durationInFrames: 163},
  {text: 'Tu cerebro no olvida por accidente ni recuerda por casualidad.', image: 'memoria_images/55.png', durationInFrames: 120},
  {text: 'Elige, todos los días, qué merece sobrevivir dentro de ti.', image: 'memoria_images/56.png', durationInFrames: 157},
  {text: '¿Cuál es la canción que tu cerebro decidió guardar para siempre?', image: 'memoria_images/57.png', durationInFrames: 104},
  {text: 'Cuéntamelo en los comentarios.', image: 'memoria_images/58.png', durationInFrames: 52},
  {text: 'Si te voló la cabeza, dale like y suscríbete para el próximo dato que no vas a poder ignorar.', image: 'memoria_images/59.png', durationInFrames: 170},
];

export const TOTAL_FRAMES = segments.reduce((sum, s) => sum + s.durationInFrames, 0);
