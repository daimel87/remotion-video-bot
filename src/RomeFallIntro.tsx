import React from 'react';
import {AbsoluteFill, Audio, staticFile} from 'remotion';
import {KenBurnsImage} from './kenburns/KenBurnsImage';
import {NarrationSubtitle} from './kenburns/NarrationSubtitle';

export const RomeFallIntro: React.FC = () => {
	return (
		<AbsoluteFill style={{backgroundColor: 'black'}}>
			<Audio src={staticFile('rome-fall/audio/escena1.wav')} />

			{/* 0:00-0:06 — "Imagina un imperio tan grande..." + Mapa */}
			<KenBurnsImage
				src={staticFile('rome-fall/1a-mapa-imperio.jpg')}
				startFrame={0}
				durationFrames={195}
				effect="zoomInSlow"
			/>
			<NarrationSubtitle
				text="Imagina un imperio tan grande que controlaba desde las arenas de Egipto hasta los bosques helados de Britania..."
				startFrame={0}
				durationFrames={170}
			/>

			{/* 0:06-0:14 — "Roma lo tenía todo..." + Legiones marchando */}
			<KenBurnsImage
				src={staticFile('rome-fall/1b-legiones-marchando.jpg')}
				startFrame={180}
				durationFrames={240}
				effect="panRight"
			/>
			<NarrationSubtitle
				text="Roma lo tenía todo: caminos que conectaban el mundo, ejércitos invencibles, y ciudades que hacían llorar de envidia..."
				startFrame={185}
				durationFrames={225}
			/>

			{/* 0:14-0:21 — "Pero todo eso... se derrumbó" + Legionario closeup */}
			<KenBurnsImage
				src={staticFile('rome-fall/1c-legionario-closeup.jpg')}
				startFrame={405}
				durationFrames={234}
				effect="zoomInCenter"
			/>
			<NarrationSubtitle
				text="Pero todo eso... se derrumbó. Y lo peor es que gran parte fue culpa suya."
				startFrame={420}
				durationFrames={210}
			/>
		</AbsoluteFill>
	);
};
