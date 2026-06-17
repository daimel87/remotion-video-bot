import React from 'react';
import {AbsoluteFill, Audio, staticFile} from 'remotion';
import {KenBurnsImage} from './kenburns/KenBurnsImage';
import {NarrationSubtitle} from './kenburns/NarrationSubtitle';

export const RomeFallIntro: React.FC = () => {
	return (
		<AbsoluteFill style={{backgroundColor: 'black'}}>
			<Audio src={staticFile('rome-fall/audio/escena1.wav')} />

			{/* 0:00-0:06 (frames 0-180) — Mapa del imperio */}
			<KenBurnsImage
				src={staticFile('rome-fall/1a-mapa-imperio.jpg')}
				startFrame={0}
				durationFrames={195}
				effect="zoomInSlow"
			/>
			<NarrationSubtitle
				text="Imagina un imperio tan grande que controlaba desde las arenas de Egipto hasta los bosques helados de Britania..."
				startFrame={0}
				durationFrames={180}
			/>

			{/* 0:06-0:09 (frames 180-270) — Mercado romano */}
			<KenBurnsImage
				src={staticFile('rome-fall/2b-mercado-romano.jpg')}
				startFrame={180}
				durationFrames={105}
				effect="panRight"
			/>
			<NarrationSubtitle
				text="Roma lo tenía todo: caminos que conectaban el mundo..."
				startFrame={180}
				durationFrames={90}
			/>

			{/* 0:09-0:11.5 (frames 270-345) — Legiones marchando */}
			<KenBurnsImage
				src={staticFile('rome-fall/1b-legiones-marchando.jpg')}
				startFrame={270}
				durationFrames={90}
				effect="panLeftZoomIn"
			/>
			<NarrationSubtitle
				text="...ejércitos invencibles..."
				startFrame={270}
				durationFrames={75}
			/>

			{/* 0:11.5-0:14 (frames 345-420) — Roma panorámica */}
			<KenBurnsImage
				src={staticFile('rome-fall/2a-roma-panoramica.jpg')}
				startFrame={345}
				durationFrames={90}
				effect="zoomOutSlow"
			/>
			<NarrationSubtitle
				text="...y ciudades que hacían llorar de envidia."
				startFrame={345}
				durationFrames={75}
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
				startFrame={420}
				durationFrames={205}
			/>
		</AbsoluteFill>
	);
};
