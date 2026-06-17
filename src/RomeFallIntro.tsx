import React from 'react';
import {AbsoluteFill, staticFile} from 'remotion';
import {KenBurnsImage} from './kenburns/KenBurnsImage';
import {NarrationSubtitle} from './kenburns/NarrationSubtitle';

export const RomeFallIntro: React.FC = () => {
	return (
		<AbsoluteFill style={{backgroundColor: 'black'}}>
			{/* Scene 1: frames 0-240 */}
			<KenBurnsImage
				src={staticFile('rome-fall/1a-mapa-imperio.jpg')}
				startFrame={0}
				durationFrames={90}
				effect="zoomInSlow"
			/>
			<KenBurnsImage
				src={staticFile('rome-fall/1b-legiones-marchando.jpg')}
				startFrame={70}
				durationFrames={100}
				effect="panRight"
			/>
			<KenBurnsImage
				src={staticFile('rome-fall/1c-legionario-closeup.jpg')}
				startFrame={150}
				durationFrames={90}
				effect="zoomInCenter"
			/>
			<NarrationSubtitle
				text="Imagina un imperio tan grande que controlaba desde las arenas de Egipto hasta los bosques helados de Britania..."
				startFrame={10}
				durationFrames={220}
			/>

			{/* Scene 2: frames 240-450 */}
			<KenBurnsImage
				src={staticFile('rome-fall/2a-roma-panoramica.jpg')}
				startFrame={230}
				durationFrames={120}
				effect="panLeftZoomIn"
			/>
			<KenBurnsImage
				src={staticFile('rome-fall/2b-mercado-romano.jpg')}
				startFrame={330}
				durationFrames={120}
				effect="zoomOutSlow"
			/>
			<NarrationSubtitle
				text="Roma lo tenía todo: caminos que conectaban el mundo, ejércitos invencibles, y ciudades que hacían llorar de envidia..."
				startFrame={250}
				durationFrames={190}
			/>
		</AbsoluteFill>
	);
};
