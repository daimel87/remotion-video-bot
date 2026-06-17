import React from 'react';
import {AbsoluteFill, Audio, staticFile} from 'remotion';
import {KenBurnsImage} from './kenburns/KenBurnsImage';
import {NarrationSubtitle} from './kenburns/NarrationSubtitle';

export const RomeFallIntro: React.FC = () => {
	return (
		<AbsoluteFill style={{backgroundColor: 'black'}}>
			<Audio src={staticFile('rome-fall/audio/escena1.wav')} />

			{/* 0:00-0:05 (frames 0-150) — Mapa */}
			<KenBurnsImage
				src={staticFile('rome-fall/1a-mapa-imperio.jpg')}
				startFrame={0}
				durationFrames={165}
				effect="zoomInSlow"
			/>
			<NarrationSubtitle
				text="Imagina un imperio tan grande que controlaba desde las arenas de Egipto hasta los bosques helados de Britania..."
				startFrame={0}
				durationFrames={150}
			/>

			{/* 0:06-0:08 (frames 180-240) — Mercado */}
			<KenBurnsImage
				src={staticFile('rome-fall/2b-mercado-romano.jpg')}
				startFrame={165}
				durationFrames={90}
				effect="panRight"
			/>
			<NarrationSubtitle
				text="Roma lo tenía todo: caminos que conectaban el mundo..."
				startFrame={170}
				durationFrames={75}
			/>

			{/* 0:08-0:11 (frames 240-330) — Legiones */}
			<KenBurnsImage
				src={staticFile('rome-fall/1b-legiones-marchando.jpg')}
				startFrame={240}
				durationFrames={105}
				effect="panLeftZoomIn"
			/>
			<NarrationSubtitle
				text="...ejércitos invencibles..."
				startFrame={245}
				durationFrames={85}
			/>

			{/* 0:11-0:14 (frames 330-420) — Roma panorámica */}
			<KenBurnsImage
				src={staticFile('rome-fall/2a-roma-panoramica.jpg')}
				startFrame={330}
				durationFrames={105}
				effect="zoomOutSlow"
			/>
			<NarrationSubtitle
				text="...y ciudades que hacían llorar de envidia."
				startFrame={335}
				durationFrames={85}
			/>

			{/* 0:14-0:21 (frames 420-639) — Legionario closeup */}
			<KenBurnsImage
				src={staticFile('rome-fall/1c-legionario-closeup.jpg')}
				startFrame={420}
				durationFrames={219}
				effect="zoomInCenter"
			/>
			<NarrationSubtitle
				text="Pero todo eso... se derrumbó. Y lo peor es que gran parte fue culpa suya."
				startFrame={425}
				durationFrames={205}
			/>
		</AbsoluteFill>
	);
};
