import React from 'react';
import {AbsoluteFill, Audio, staticFile} from 'remotion';
import {KenBurnsImage} from './kenburns/KenBurnsImage';
import {NarrationSubtitle} from './kenburns/NarrationSubtitle';

export const RomeFallIntro: React.FC = () => {
	return (
		<AbsoluteFill style={{backgroundColor: 'black'}}>
			<Audio src={staticFile('rome-fall/audio/escena1.wav')} />

			{/* Scene 1: 0-10s (frames 0-300) — "Imagina un imperio tan grande..." */}
			<KenBurnsImage
				src={staticFile('rome-fall/1a-mapa-imperio.jpg')}
				startFrame={0}
				durationFrames={130}
				effect="zoomInSlow"
			/>
			<KenBurnsImage
				src={staticFile('rome-fall/1b-legiones-marchando.jpg')}
				startFrame={110}
				durationFrames={130}
				effect="panRight"
			/>
			<KenBurnsImage
				src={staticFile('rome-fall/1c-legionario-closeup.jpg')}
				startFrame={220}
				durationFrames={100}
				effect="zoomInCenter"
			/>
			<NarrationSubtitle
				text="Imagina un imperio tan grande que controlaba desde las arenas de Egipto hasta los bosques helados de Britania..."
				startFrame={5}
				durationFrames={290}
			/>

			{/* Scene 2: 10-18s (frames 300-540) — "Roma lo tenía todo..." */}
			<KenBurnsImage
				src={staticFile('rome-fall/2a-roma-panoramica.jpg')}
				startFrame={290}
				durationFrames={150}
				effect="panLeftZoomIn"
			/>
			<KenBurnsImage
				src={staticFile('rome-fall/2b-mercado-romano.jpg')}
				startFrame={420}
				durationFrames={150}
				effect="zoomOutSlow"
			/>
			<NarrationSubtitle
				text="Roma lo tenía todo: caminos que conectaban el mundo, ejércitos invencibles, y ciudades que hacían llorar de envidia..."
				startFrame={310}
				durationFrames={220}
			/>

			{/* Scene 1 final — "Pero todo eso... se derrumbó" */}
			<NarrationSubtitle
				text="Pero todo eso... se derrumbó. Y lo peor es que gran parte fue culpa suya."
				startFrame={540}
				durationFrames={95}
				fontSize={48}
			/>
		</AbsoluteFill>
	);
};
