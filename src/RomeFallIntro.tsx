import React from 'react';
import {AbsoluteFill, Audio, staticFile} from 'remotion';
import {KenBurnsImage} from './kenburns/KenBurnsImage';

export const RomeFallIntro: React.FC = () => {
	return (
		<AbsoluteFill style={{backgroundColor: 'black'}}>
			<Audio src={staticFile('rome-fall/audio/escena1.wav')} />

			{/* 0:00-0:06 — Mapa del imperio */}
			<KenBurnsImage
				src={staticFile('rome-fall/1a-mapa-imperio.jpg')}
				startFrame={0}
				durationFrames={195}
				effect="zoomInSlow"
			/>

			{/* 0:06-0:09 — Mercado romano */}
			<KenBurnsImage
				src={staticFile('rome-fall/2b-mercado-romano.jpg')}
				startFrame={180}
				durationFrames={105}
				effect="panRight"
			/>

			{/* 0:09-0:11.5 — Legiones marchando */}
			<KenBurnsImage
				src={staticFile('rome-fall/1b-legiones-marchando.jpg')}
				startFrame={270}
				durationFrames={90}
				effect="panLeftZoomIn"
			/>

			{/* 0:11.5-0:14 — Roma panorámica */}
			<KenBurnsImage
				src={staticFile('rome-fall/2a-roma-panoramica.jpg')}
				startFrame={345}
				durationFrames={90}
				effect="zoomOutSlow"
			/>

			{/* 0:14-0:21 — Legionario closeup */}
			<KenBurnsImage
				src={staticFile('rome-fall/1c-legionario-closeup.jpg')}
				startFrame={420}
				durationFrames={219}
				effect="zoomInCenter"
			/>
		</AbsoluteFill>
	);
};
