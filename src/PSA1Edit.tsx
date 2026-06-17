import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {CaptionBox} from './components/CaptionBox';
import {BigTextGraphic} from './components/BigTextGraphic';

// Timeline (25fps, 42s = 1050 frames):
// 0-100:   "Tu médico te dijo que tu PSA subió..."
// 100-200: PSA ELEVADO graphic (red)
// 200-375: "Te voy a ser honesta: un PSA alto no siempre es cáncer"
// 375-500: "Pero sí es una señal de que algo está pasando"
// 500-625: "Y lo que comes puede marcar la diferencia"
// 625-800: 10 ALIMENTOS → PSA ↓ graphic
// 800-925: "Hoy te voy a mostrar 10 alimentos"
// 925-1050: "que la ciencia ha demostrado que ayudan"

const PSAAlertGraphic: React.FC = () => {
	return (
		<BigTextGraphic text="⚠ PSA ELEVADO" highlight="PSA ELEVADO" highlightColor="#ff4444" />
	);
};

export const PSA1Edit: React.FC = () => {
	return (
		<AbsoluteFill style={{backgroundColor: '#000'}}>
			<OffthreadVideo src={staticFile('psa_1.mp4')} />

			<Sequence from={0} durationInFrames={100}>
				<CaptionBox text="Tu médico te dijo que tu PSA subió..." />
			</Sequence>

			<Sequence from={100} durationInFrames={100}>
				<PSAAlertGraphic />
			</Sequence>

			<Sequence from={200} durationInFrames={175}>
				<CaptionBox text="Un PSA alto no siempre es cáncer" />
			</Sequence>

			<Sequence from={375} durationInFrames={125}>
				<CaptionBox text="Pero sí es una señal de que algo está pasando" />
			</Sequence>

			<Sequence from={500} durationInFrames={125}>
				<CaptionBox text="Y lo que comes puede marcar la diferencia" />
			</Sequence>

			<Sequence from={625} durationInFrames={175}>
				<BigTextGraphic text="10 ALIMENTOS → PSA ↓" highlight="10 ALIMENTOS" />
			</Sequence>

			<Sequence from={800} durationInFrames={125}>
				<CaptionBox text="Hoy te voy a mostrar 10 alimentos" />
			</Sequence>

			<Sequence from={925} durationInFrames={125}>
				<CaptionBox text="Que la ciencia ha demostrado que ayudan" />
			</Sequence>
		</AbsoluteFill>
	);
};
