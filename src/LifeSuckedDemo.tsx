import React from 'react';
import {AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, Sequence} from 'remotion';
import {StickmanCharacter} from './stickman/StickmanCharacter';
import {SpeechBubble} from './stickman/SpeechBubble';
import {TextOverlay} from './stickman/TextOverlay';
import {SceneBackground} from './stickman/SceneBackground';

const TitleScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const shieldScale = spring({frame: frame - 10, fps, config: {damping: 12, stiffness: 100}});
	const titleScale = spring({frame: frame - 25, fps, config: {damping: 10, stiffness: 120}});

	return (
		<SceneBackground type="plain" startFrame={0} durationFrames={120}>
			{/* Big shield icon */}
			<g transform={`translate(960, 350) scale(${shieldScale * 4})`}>
				<path d="M 0,-35 L 25,-25 L 25,5 Q 25,30 0,40 Q -25,30 -25,5 L -25,-25 Z"
					fill="#c0392b" stroke="#922b21" strokeWidth={2} />
				<text x={0} y={8} textAnchor="middle" fontSize={24} fill="#f1c40f" fontWeight="bold"
					fontFamily="'Segoe Print', cursive">SPQR</text>
			</g>

			{/* Title */}
			<g transform={`scale(${titleScale})`} style={{transformOrigin: '960px 550px'}}>
				<TextOverlay
					text="LA VIDA APESTABA SIENDO..."
					x={960} y={520}
					fontSize={42}
					color="#7f8c8d"
					startFrame={0}
					animation="slide"
				/>
				<TextOverlay
					text="UN LEGIONARIO ROMANO"
					x={960} y={600}
					fontSize={64}
					color="#c0392b"
					startFrame={0}
					animation="shake"
					fontWeight="bold"
				/>
			</g>

			{/* Stickmen soldiers marching at bottom */}
			<StickmanCharacter x={300} y={780} scale={1.5} pose="marching" expression="angry"
				accessories={['roman_helmet', 'spear']} startFrame={40} />
			<StickmanCharacter x={500} y={780} scale={1.5} pose="marching" expression="neutral"
				accessories={['roman_helmet', 'sword']} startFrame={45} />
			<StickmanCharacter x={700} y={780} scale={1.5} pose="marching" expression="scared"
				accessories={['roman_helmet', 'roman_shield']} startFrame={50} />
			<StickmanCharacter x={1200} y={780} scale={1.5} pose="marching" expression="crying"
				accessories={['roman_helmet', 'backpack']} startFrame={55} />
			<StickmanCharacter x={1400} y={780} scale={1.5} pose="marching" expression="angry"
				accessories={['roman_helmet', 'spear']} startFrame={60} />
			<StickmanCharacter x={1600} y={780} scale={1.5} pose="marching" expression="neutral"
				accessories={['roman_helmet', 'sword']} startFrame={65} />
		</SceneBackground>
	);
};

const RecruitmentScene: React.FC = () => {
	return (
		<SceneBackground type="rome" startFrame={110} durationFrames={160}>
			{/* Section title */}
			<TextOverlay
				text="1. El reclutamiento"
				x={960} y={80}
				fontSize={48}
				color="#2c3e50"
				startFrame={115}
				animation="slide"
				bg="#ffeaa7"
				bgPadding={20}
			/>

			{/* Recruiter */}
			<StickmanCharacter x={500} y={450} scale={2.2} pose="standing" expression="happy"
				accessories={['roman_helmet', 'sword']} startFrame={125} label="Centurión" />
			<SpeechBubble x={500} y={260} text="¡Felicidades! Ahora eres legionario. Solo son 25 años de servicio."
				startFrame={135} width={320} fontSize={18} />

			{/* Recruit */}
			<StickmanCharacter x={900} y={450} scale={2.2} pose="standing" expression="happy"
				accessories={[]} startFrame={130} label="Tú, a los 18" />
			<SpeechBubble x={900} y={260} text="¡Genial! ¿Y el sueldo?"
				startFrame={155} width={250} fontSize={18} />

			{/* Recruiter response */}
			<SpeechBubble x={500} y={120} text="Jajaja... 'sueldo'. Qué gracioso eres, novato."
				startFrame={170} width={300} fontSize={18} type="speech" />

			{/* The recruit's face changes */}
			<StickmanCharacter x={900} y={450} scale={2.2} pose="standing" expression="confused"
				accessories={[]} startFrame={175} />

			{/* Fun fact box */}
			<g>
				<rect x={1200} y={400} width={550} height={200} rx={15} fill="#2c3e50" opacity={0.9}
					style={{display: 'none'}} />
			</g>
			<TextOverlay text="DATO REAL:" x={1480} y={440} fontSize={22} color="#f1c40f"
				startFrame={200} animation="pop" bg="#2c3e50" bgPadding={15} />
			<TextOverlay text="Un legionario ganaba" x={1480} y={480} fontSize={20} color="#ecf0f1"
				startFrame={205} animation="slide" fontWeight="normal" />
			<TextOverlay text="225 denarios al año" x={1480} y={510} fontSize={24} color="#ffeaa7"
				startFrame={210} animation="pop" />
			<TextOverlay text="(pero le descontaban comida," x={1480} y={545} fontSize={17} color="#b2bec3"
				startFrame={218} animation="slide" fontWeight="normal" />
			<TextOverlay text="armas y hasta los funerales)" x={1480} y={570} fontSize={17} color="#b2bec3"
				startFrame={222} animation="slide" fontWeight="normal" />
		</SceneBackground>
	);
};

const MarchScene: React.FC = () => {
	return (
		<SceneBackground type="road" startFrame={260} durationFrames={160}>
			<TextOverlay
				text="2. La marcha diaria"
				x={960} y={80}
				fontSize={48}
				color="#2c3e50"
				startFrame={265}
				animation="slide"
				bg="#ffeaa7"
				bgPadding={20}
			/>

			{/* Suffering soldiers marching */}
			<StickmanCharacter x={300} y={500} scale={2} pose="marching" expression="crying"
				accessories={['roman_helmet', 'backpack', 'spear']} startFrame={275} />
			<SpeechBubble x={300} y={310} text="Llevamos 30 km... con 30 kilos encima..."
				startFrame={285} width={280} fontSize={17} />

			<StickmanCharacter x={650} y={500} scale={2} pose="marching" expression="angry"
				accessories={['roman_helmet', 'backpack', 'sword']} startFrame={280} />
			<SpeechBubble x={650} y={310} text="Y todavía falta construir el campamento"
				startFrame={300} width={260} fontSize={17} />

			<StickmanCharacter x={1000} y={500} scale={2} pose="marching" expression="dead"
				accessories={['roman_helmet', 'backpack']} startFrame={285} />

			{/* Comedy beat - one guy fallen */}
			<StickmanCharacter x={1350} y={550} scale={2} pose="fallen" expression="dead"
				accessories={['roman_helmet', 'backpack']} startFrame={310} />
			<SpeechBubble x={1400} y={360} text="Despiértenme cuando lleguemos a Britania..."
				startFrame={320} width={300} fontSize={17} type="thought" />

			{/* Fun fact */}
			<TextOverlay text="DATO REAL:" x={960} y={780} fontSize={22} color="#f1c40f"
				startFrame={340} animation="pop" bg="#2c3e50" bgPadding={15} />
			<TextOverlay text="Marchaban 30km diarios con 30kg de equipo." x={960} y={825}
				fontSize={22} color="#2c3e50" startFrame={345} animation="slide" fontWeight="normal" />
			<TextOverlay text="Los llamaban 'las mulas de Mario'" x={960} y={860}
				fontSize={24} color="#c0392b" startFrame={350} animation="pop" />
		</SceneBackground>
	);
};

const BattleScene: React.FC = () => {
	return (
		<SceneBackground type="battlefield" startFrame={410} durationFrames={170}>
			<TextOverlay
				text="3. La batalla"
				x={960} y={80}
				fontSize={48}
				color="#ecf0f1"
				startFrame={415}
				animation="shake"
				bg="#e74c3c"
				bgPadding={20}
			/>

			{/* Romans on the left */}
			<StickmanCharacter x={250} y={480} scale={2} pose="fighting" expression="angry"
				accessories={['roman_helmet', 'roman_shield', 'sword']} startFrame={425} />
			<StickmanCharacter x={450} y={500} scale={1.8} pose="fighting" expression="scared"
				accessories={['roman_helmet', 'roman_shield']} startFrame={430} />
			<StickmanCharacter x={350} y={550} scale={1.6} pose="fighting" expression="angry"
				accessories={['roman_helmet', 'spear']} startFrame={435} />

			{/* Enemy barbarians on the right */}
			<StickmanCharacter x={1400} y={480} scale={2.2} pose="fighting" expression="angry"
				accessories={[]} startFrame={440} flip={true} color="#636e72" label="Bárbaros" labelColor="#ecf0f1" />
			<StickmanCharacter x={1600} y={500} scale={2} pose="fighting" expression="angry"
				accessories={[]} startFrame={445} flip={true} color="#636e72" />
			<StickmanCharacter x={1500} y={560} scale={1.8} pose="fighting" expression="angry"
				accessories={[]} startFrame={448} flip={true} color="#636e72" />

			{/* Speech bubbles */}
			<SpeechBubble x={250} y={300} text="¡POR ROMA!"
				startFrame={450} width={180} fontSize={22} type="shout" />
			<SpeechBubble x={1400} y={290} text="¡AAAAAARGH!"
				startFrame={455} width={200} fontSize={22} type="shout" />

			{/* The scared one */}
			<SpeechBubble x={450} y={310} text="Yo solo quería una granjita..."
				startFrame={465} width={250} fontSize={16} type="thought" />

			{/* Fallen soldier */}
			<StickmanCharacter x={800} y={600} scale={1.5} pose="fallen" expression="dead"
				accessories={['roman_helmet']} startFrame={470} />

			{/* Fun fact */}
			<TextOverlay text="DATO REAL:" x={960} y={800} fontSize={22} color="#f1c40f"
				startFrame={490} animation="pop" bg="#2c3e50" bgPadding={15} />
			<TextOverlay text="Si huías de la batalla, tu propia unidad te ejecutaba." x={960} y={845}
				fontSize={22} color="#ecf0f1" startFrame={495} animation="slide" fontWeight="normal" />
			<TextOverlay text="'Decimatio': mataban a 1 de cada 10 soldados como castigo" x={960} y={880}
				fontSize={20} color="#e74c3c" startFrame={500} animation="pop" fontWeight="normal" />
		</SceneBackground>
	);
};

const CampLifeScene: React.FC = () => {
	return (
		<SceneBackground type="camp" startFrame={570} durationFrames={160}>
			<TextOverlay
				text="4. La vida en el campamento"
				x={960} y={80}
				fontSize={48}
				color="#2c3e50"
				startFrame={575}
				animation="slide"
				bg="#ffeaa7"
				bgPadding={20}
			/>

			{/* Soldier eating */}
			<StickmanCharacter x={350} y={480} scale={2} pose="sitting" expression="angry"
				accessories={['roman_helmet']} startFrame={585} />
			<SpeechBubble x={350} y={300} text="¿Otra vez gachas de trigo? Llevamos 3 años comiendo lo mismo"
				startFrame={595} width={300} fontSize={17} />

			{/* Soldier with disease */}
			<StickmanCharacter x={750} y={480} scale={2} pose="standing" expression="dead"
				accessories={['roman_helmet']} startFrame={600} />
			<SpeechBubble x={750} y={290} text="Me siento mal... otra vez disentería"
				startFrame={615} width={260} fontSize={17} />

			{/* Soldier building */}
			<StickmanCharacter x={1150} y={480} scale={2} pose="standing" expression="crying"
				accessories={['roman_helmet']} startFrame={605} />
			<SpeechBubble x={1150} y={280} text="Me hice soldado para pelear, no para ser albañil"
				startFrame={625} width={280} fontSize={17} />

			{/* Centurion */}
			<StickmanCharacter x={1550} y={480} scale={2.2} pose="standing" expression="happy"
				accessories={['roman_helmet', 'sword']} startFrame={610} label="Centurión" />
			<SpeechBubble x={1550} y={270} text="¡A CAVAR LETRINAS!"
				startFrame={640} width={240} fontSize={20} type="shout" />

			{/* Fun fact */}
			<TextOverlay text="DATO REAL:" x={960} y={800} fontSize={22} color="#f1c40f"
				startFrame={660} animation="pop" bg="#2c3e50" bgPadding={15} />
			<TextOverlay text="Los legionarios construían carreteras, puentes y acueductos." x={960} y={845}
				fontSize={22} color="#2c3e50" startFrame={665} animation="slide" fontWeight="normal" />
			<TextOverlay text="Eran más albañiles que guerreros" x={960} y={880}
				fontSize={24} color="#c0392b" startFrame={670} animation="pop" />
		</SceneBackground>
	);
};

const ConclusionScene: React.FC = () => {
	return (
		<SceneBackground type="plain" startFrame={720} durationFrames={130}>
			<TextOverlay
				text="Después de 25 años..."
				x={960} y={120}
				fontSize={52}
				color="#2c3e50"
				startFrame={725}
				animation="typewriter"
			/>

			{/* Old soldier - celebrating */}
			<StickmanCharacter x={600} y={450} scale={2.5} pose="celebrating" expression="happy"
				accessories={['roman_helmet']} startFrame={745} label="Tú, a los 43" labelColor="#7f8c8d" />
			<SpeechBubble x={600} y={240} text="¡¡SOY LIBRE!! ¡Me dieron tierras!"
				startFrame={755} width={300} fontSize={20} type="shout" />

			{/* Reward box */}
			<rect x={980} y={320} width={500} height={300} rx={15} fill="#27ae60" opacity={0.15}
				stroke="#27ae60" strokeWidth={2} />
			<TextOverlay text="Tu recompensa:" x={1230} y={370} fontSize={28} color="#27ae60"
				startFrame={770} animation="pop" />
			<TextOverlay text="✓ Ciudadanía romana" x={1230} y={420} fontSize={24} color="#2c3e50"
				startFrame={775} animation="slide" fontWeight="normal" />
			<TextOverlay text="✓ Un pedazo de tierra" x={1230} y={460} fontSize={24} color="#2c3e50"
				startFrame={780} animation="slide" fontWeight="normal" />
			<TextOverlay text="✓ PTSD romano" x={1230} y={500} fontSize={24} color="#e74c3c"
				startFrame={785} animation="pop" />
			<TextOverlay text="✓ Cojera permanente" x={1230} y={540} fontSize={24} color="#e74c3c"
				startFrame={790} animation="pop" />
			<TextOverlay text="✓ 0 dientes" x={1230} y={580} fontSize={24} color="#e74c3c"
				startFrame={795} animation="pop" />

			{/* Final joke */}
			<TextOverlay text="¿Valió la pena? Claramente no." x={960} y={750}
				fontSize={36} color="#c0392b" startFrame={810} animation="shake" />

			{/* CTA */}
			<rect x={560} y={850} width={800} height={70} rx={35} fill="#3498db" />
			<TextOverlay text="Suscríbete para más vidas que apestaban" x={960} y={895}
				fontSize={26} color="#fff" startFrame={825} animation="pop" />
		</SceneBackground>
	);
};

export const LifeSuckedDemo: React.FC = () => {
	return (
		<AbsoluteFill style={{backgroundColor: '#faf9f6'}}>
			<TitleScene />
			<RecruitmentScene />
			<MarchScene />
			<BattleScene />
			<CampLifeScene />
			<ConclusionScene />
		</AbsoluteFill>
	);
};
