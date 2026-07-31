// Imagenes al oleo (Nano Banana 2, estilo "Cronicas Ilustradas":
// Caravaggio/Turner, paleta dorado-azul-terracota) para el Bloque 1.
//
// CERO REPETICION: cada corte del bloque tiene su propia imagen unica,
// nunca se reusa ninguna. Por eso cada "pool" de abajo tiene un solo
// archivo -- el selector de plan.ts sigue funcionando igual, solo que
// aqui nunca hay nada entre lo cual elegir.
//
// Subir los archivos a public/stock-odisea/ai/ con estos nombres exactos
// (via la web de GitHub -- el proxy de git de esta sesion esta caido).
import type {PoolItem} from './pools.generated';

const ai = (file: string): PoolItem => ({file: `stock-odisea/ai/${file}`, kind: 'photos', block: 'b1'});

export const POOLS_AI: Record<string, PoolItem[]> = {
  // --- ya generadas (10 originales + 7 del segundo lote) ---
  'b1-odiseo-1': [ai('b1-odiseo-1.jpg')], // Odiseo en la proa, retrato general
  'b1-ruinas-1': [ai('b1-ruinas-1.jpg')], // templo griego en ruinas
  'b1-odiseo-2': [ai('b1-odiseo-2.jpg')], // Odiseo primer plano
  'b1-mar-1': [ai('b1-mar-1.jpg')], // vista amplia del Egeo
  'b1-artefacto-1': [ai('b1-artefacto-1.jpg')], // casco semienterrado
  'b1-silueta-1': [ai('b1-silueta-1.jpg')], // figura misteriosa con linterna
  'b1-manuscrito-1': [ai('b1-manuscrito-1.jpg')], // libro abierto junto a vela
  'b1-manuscrito-2': [ai('b1-manuscrito-2.jpg')], // pergamino/rollo de cerca
  'b1-ciudad-1': [ai('b1-ciudad-1.jpg')], // ciudad griega antigua al atardecer
  'b1-poeta-1': [ai('b1-poeta-1.jpg')], // Homero, poeta ciego
  'b1-artefactos-2': [ai('b1-artefactos-2.jpg')], // ceramica/monedas, naturaleza muerta

  // --- nuevas, 16 (una por corte que faltaba) ---
  'b1-mito-fresco-1': [ai('b1-mito-fresco-1.jpg')], // fresco desvaido de monstruos/dioses
  'b1-manos-descubrimiento-1': [ai('b1-manos-descubrimiento-1.jpg')], // manos revelando un fragmento de piedra
  'b1-balanza-1': [ai('b1-balanza-1.jpg')], // balanza dorada: corona de laurel vs tablilla de piedra
  'b1-estudio-1': [ai('b1-estudio-1.jpg')], // estudio de erudito, estantes de rollos
  'b1-trono-vacio-1': [ai('b1-trono-vacio-1.jpg')], // trono vacio con laurel, ausencia de Homero
  'b1-tumba-vacia-1': [ai('b1-tumba-vacia-1.jpg')], // sarcofago vacio, sin confirmar
  'b1-mapa-siete-1': [ai('b1-mapa-siete-1.jpg')], // mapa antiguo con siete ciudades marcadas
  'b1-multitud-1': [ai('b1-multitud-1.jpg')], // multitud aclamando a un poeta
  'b1-encapuchado-1': [ai('b1-encapuchado-1.jpg')], // figura encapuchada, rostro oculto
  'b1-vela-1': [ai('b1-vela-1.jpg')], // vela solitaria en la oscuridad
  'b1-balanza-2': [ai('b1-balanza-2.jpg')], // rollo vs tablilla sobre una mesa
  'b1-amanecer-excavacion-1': [ai('b1-amanecer-excavacion-1.jpg')], // amanecer sobre sitio de excavacion
  'b1-pico-tierra-1': [ai('b1-pico-tierra-1.jpg')], // pico clavado en tierra recien removida
  'b1-manos-tablilla-1': [ai('b1-manos-tablilla-1.jpg')], // manos descubriendo una tablilla
  'b1-obsesionado-1': [ai('b1-obsesionado-1.jpg')], // silueta de hombre obsesionado con monedas de oro
  'b1-montana-atardecer-1': [ai('b1-montana-atardecer-1.jpg')], // colina/monticulo al atardecer, tormenta
};
