// Imagenes al oleo (Nano Banana 2, estilo "Cronicas Ilustradas":
// Caravaggio/Turner, paleta dorado-azul-terracota) para el Bloque 1.
//
// CERO REPETICION: cada corte del bloque tiene su propia imagen unica,
// nunca se reusa ninguna.
//
// Los nombres de archivo son los originales (largos, con comas/apostrofes)
// tal como los exporta Nano Banana / Flow -- no se renombraron para
// ahorrar el paso manual. Viven en public/stock-odisea/ai/.
import type {PoolItem} from './pools.generated';

const ai = (file: string): PoolItem => ({file: `stock-odisea/ai/${file}`, kind: 'photos', block: 'b1'});

export const POOLS_AI: Record<string, PoolItem[]> = {
  // --- lote 1 (10 originales, solo se usan estas 4 en el Bloque 1) ---
  'b1-odiseo-1': [ai('01_Odysseus,_weathered_Greek_warr_202607310903.jpeg')],
  'b1-ruinas-1': [ai('03_Ancient_Greek_temple_ruins_on_202607310903.jpeg')],
  'b1-poeta-1': [ai('05_An_elderly_blind_poet_with_202607310903.jpeg')],
  'b1-manuscrito-1': [ai('06_An_open_ancient_leather-bound_202607310903.jpeg')],

  // --- lote 2 (7 "b1-extra") ---
  'b1-odiseo-2': [ai('01_Odysseus_in_close-up_portrait,_202607310937.jpeg')],
  'b1-ciudad-1': [ai('02_An_ancient_Greek_city_skyline_202607310937.jpeg')],
  'b1-manuscrito-2': [ai('03_Close-up_of_an_ancient_Greek_202607310937.jpeg')],
  'b1-artefacto-1': [ai('04_A_half-buried_ancient_artifact_202607310937.jpeg')],
  'b1-silueta-1': [ai('05_Silhouette_of_a_lone_figure_202607310937.jpeg')],
  'b1-mar-1': [ai('06_A_wide_view_of_the_202607310937.jpeg')],
  'b1-artefactos-2': [ai("07_Ancient_Greek_pottery,_coins,_202607310937.jpeg")],

  // --- lote 3 (16 nuevas) ---
  'b1-mito-fresco-1': [ai('01_A_faded_ancient_fresco_depicti_202607311012.jpeg')],
  'b1-manos-descubrimiento-1': [ai('02_Close-up_of_weathered_archaeol_202607311012.jpeg')],
  'b1-balanza-1': [ai('03_An_ornate_golden_scale_balanci_202607311012.jpeg')],
  'b1-estudio-1': [ai("04_An_ancient_scholar's_study_fil_202607311012.jpeg")],
  'b1-trono-vacio-1': [ai('05_An_empty_ancient_stone_throne_202607311012.jpeg')],
  'b1-tumba-vacia-1': [ai('06_An_ancient_empty_stone_sarcoph_202607311012.jpeg')],
  'b1-mapa-siete-1': [ai('07_An_antique_hand-drawn_map_of_202607311012.jpeg')],
  'b1-multitud-1': [ai('08_A_crowd_of_ancient_Greeks_202607311012.jpeg')],
  'b1-encapuchado-1': [ai('09_A_hooded_figure_standing_in_202607311012.jpeg')],
  'b1-vela-1': [ai('10_A_single_candle_flickering_in_202607311012.jpeg')],
  'b1-balanza-2': [ai('11_An_old_scroll_and_a_202607311012.jpeg')],
  'b1-amanecer-excavacion-1': [ai('12_Sunrise_breaking_over_an_archa_202607311012.jpeg')],
  'b1-pico-tierra-1': [ai('13_A_weathered_iron_pickaxe_stuck_202607311012.jpeg')],
  'b1-manos-tablilla-1': [ai('14_Close-up_of_weathered_hands_br_202607311013.jpeg')],
  'b1-obsesionado-1': [ai('15_Silhouette_of_a_wealthy_19th-c_202607311012.jpeg')],
  'b1-montana-atardecer-1': [ai('16_A_dramatic_wide_view_of_202607311012.jpeg')],
};
