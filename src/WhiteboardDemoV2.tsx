import React from 'react';
import {AbsoluteFill, useCurrentFrame, interpolate} from 'remotion';
import {
	WhiteboardScene,
	DrawText,
	DrawLine,
	DrawCircle,
	DrawArrow,
	DrawBox,
	DrawPath,
	DrawingHand,
	RevealImage,
	DetailedIcons,
	SvgIcons,
} from './whiteboard';

const Scene1Title: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<WhiteboardScene startFrame={0} durationFrames={120}>
			{/* Colosseum drawing with hand */}
			<DetailedIcons.Colosseum x={960} y={350} scale={3} startFrame={5} />
			<DrawingHand
				points={[
					{x: 720, y: 350, frame: 5},
					{x: 850, y: 280, frame: 15},
					{x: 960, y: 260, frame: 20},
					{x: 1080, y: 280, frame: 25},
					{x: 1200, y: 350, frame: 35},
					{x: 960, y: 400, frame: 45},
				]}
				scale={0.8}
			/>

			{/* Title appears after colosseum */}
			<DrawText
				text="¿Por qué cayó"
				x={960}
				y={560}
				fontSize={80}
				align="center"
				startFrame={50}
				color="#2c3e50"
			/>
			<DrawText
				text="el Imperio Romano?"
				x={960}
				y={650}
				fontSize={80}
				align="center"
				startFrame={58}
				color="#c0392b"
			/>

			<DrawingHand
				points={[
					{x: 650, y: 560, frame: 50},
					{x: 960, y: 560, frame: 58},
					{x: 650, y: 650, frame: 60},
					{x: 1100, y: 650, frame: 70},
				]}
				scale={0.7}
			/>

			{/* Underline */}
			<DrawLine x1={560} y1={680} x2={1360} y2={680} stroke="#c0392b" strokeWidth={4} startFrame={75} />

			{/* Subtitle */}
			<DrawText
				text="La historia completa en 60 segundos"
				x={960}
				y={760}
				fontSize={32}
				align="center"
				startFrame={85}
				color="#7f8c8d"
				fontWeight="normal"
			/>
		</WhiteboardScene>
	);
};

const Scene2Peak: React.FC = () => {
	return (
		<WhiteboardScene startFrame={110} durationFrames={160}>
			{/* Section header with hand */}
			<DrawText
				text="117 d.C. — El imperio más grande del mundo"
				x={960}
				y={80}
				fontSize={44}
				align="center"
				startFrame={115}
			/>
			<DrawingHand
				points={[
					{x: 500, y: 80, frame: 115},
					{x: 960, y: 80, frame: 125},
					{x: 1400, y: 80, frame: 130},
				]}
				scale={0.6}
			/>

			{/* Map being drawn */}
			<DetailedIcons.MapRome x={960} y={350} scale={2.5} startFrame={130} />
			<DrawingHand
				points={[
					{x: 580, y: 350, frame: 130},
					{x: 750, y: 280, frame: 140},
					{x: 960, y: 300, frame: 148},
					{x: 1200, y: 320, frame: 155},
					{x: 1340, y: 350, frame: 162},
				]}
				scale={0.7}
			/>

			{/* Roman soldier on the left */}
			<DetailedIcons.RomanSoldier x={250} y={550} scale={2} startFrame={165} />
			<DrawingHand
				points={[
					{x: 250, y: 420, frame: 165},
					{x: 240, y: 500, frame: 175},
					{x: 260, y: 600, frame: 185},
					{x: 250, y: 650, frame: 190},
				]}
				scale={0.7}
			/>

			{/* Stats boxes */}
			<DrawBox x={500} y={560} width={250} height={120} stroke="#3498db" fill="#3498db" startFrame={195} rx={12} />
			<DrawText text="70 millones" x={625} y={610} fontSize={30} align="center" startFrame={200} color="#2c3e50" />
			<DrawText text="habitantes" x={625} y={650} fontSize={22} align="center" startFrame={203} color="#7f8c8d" fontWeight="normal" />

			<DrawBox x={790} y={560} width={250} height={120} stroke="#e74c3c" fill="#e74c3c" startFrame={208} rx={12} />
			<DrawText text="5M km²" x={915} y={610} fontSize={30} align="center" startFrame={213} color="#2c3e50" />
			<DrawText text="territorio" x={915} y={650} fontSize={22} align="center" startFrame={216} color="#7f8c8d" fontWeight="normal" />

			<DrawBox x={1080} y={560} width={280} height={120} stroke="#f39c12" fill="#f39c12" startFrame={221} rx={12} />
			<DrawText text="400,000" x={1220} y={610} fontSize={30} align="center" startFrame={226} color="#2c3e50" />
			<DrawText text="legionarios" x={1220} y={650} fontSize={22} align="center" startFrame={229} color="#7f8c8d" fontWeight="normal" />

			<DrawingHand
				points={[
					{x: 500, y: 600, frame: 195},
					{x: 750, y: 600, frame: 208},
					{x: 1000, y: 600, frame: 221},
					{x: 1300, y: 600, frame: 235},
				]}
				scale={0.6}
			/>
		</WhiteboardScene>
	);
};

const Scene3Causes: React.FC = () => {
	return (
		<WhiteboardScene startFrame={260} durationFrames={280}>
			<DrawText
				text="Pero todo se derrumbó por 4 razones:"
				x={960}
				y={70}
				fontSize={46}
				align="center"
				startFrame={265}
				color="#c0392b"
			/>
			<DrawingHand
				points={[
					{x: 500, y: 70, frame: 265},
					{x: 960, y: 70, frame: 275},
					{x: 1350, y: 70, frame: 280},
				]}
				scale={0.6}
			/>

			{/* CAUSE 1: Barbarian invasions */}
			<DrawBox x={60} y={120} width={420} height={400} stroke="#e74c3c" fill="#e74c3c" startFrame={285} rx={15} />
			<DrawText text="1" x={100} y={160} fontSize={36} startFrame={288} color="#e74c3c" />
			<DrawText text="Invasiones Bárbaras" x={270} y={175} fontSize={28} align="center" startFrame={290} color="#c0392b" />
			<DetailedIcons.Barbarian x={270} y={340} scale={1.8} startFrame={295} />
			<DrawText text="Godos, Hunos y Vándalos" x={270} y={470} fontSize={20} align="center" startFrame={320} color="#7f8c8d" fontWeight="normal" />
			<DrawText text="atacaron sin descanso" x={270} y={495} fontSize={20} align="center" startFrame={323} color="#7f8c8d" fontWeight="normal" />
			<DrawingHand
				points={[
					{x: 270, y: 200, frame: 295},
					{x: 260, y: 300, frame: 305},
					{x: 280, y: 400, frame: 315},
					{x: 270, y: 480, frame: 325},
				]}
				scale={0.6}
			/>

			{/* CAUSE 2: Political crisis */}
			<DrawBox x={510} y={120} width={420} height={400} stroke="#f39c12" fill="#f39c12" startFrame={330} rx={15} />
			<DrawText text="2" x={550} y={160} fontSize={36} startFrame={333} color="#f39c12" />
			<DrawText text="Caos Político" x={720} y={175} fontSize={28} align="center" startFrame={335} color="#e67e22" />
			<SvgIcons.Crown x={720} y={280} scale={2.5} startFrame={340} stroke="#e67e22" />
			<SvgIcons.Skull x={680} y={340} scale={1.2} startFrame={348} />
			<SvgIcons.Skull x={760} y={340} scale={1.2} startFrame={350} />
			<DrawText text="26 emperadores" x={720} y={410} fontSize={28} align="center" startFrame={355} color="#2c3e50" />
			<DrawText text="asesinados en 50 años" x={720} y={445} fontSize={22} align="center" startFrame={358} color="#7f8c8d" fontWeight="normal" />
			<DrawText text="(Crisis del siglo III)" x={720} y={475} fontSize={20} align="center" startFrame={361} color="#95a5a6" fontWeight="normal" />
			<DrawingHand
				points={[
					{x: 720, y: 200, frame: 340},
					{x: 700, y: 300, frame: 348},
					{x: 740, y: 380, frame: 356},
					{x: 720, y: 460, frame: 365},
				]}
				scale={0.6}
			/>

			{/* CAUSE 3: Economy */}
			<DrawBox x={60} y={540} width={420} height={400} stroke="#27ae60" fill="#27ae60" startFrame={370} rx={15} />
			<DrawText text="3" x={100} y={580} fontSize={36} startFrame={373} color="#27ae60" />
			<DrawText text="Economía Destruida" x={270} y={595} fontSize={28} align="center" startFrame={375} color="#229954" />
			<DetailedIcons.Coins x={240} y={720} scale={2.5} startFrame={380} />
			{/* X over coins */}
			<DrawPath d="M 200,690 L 320,750" stroke="#e74c3c" strokeWidth={4} startFrame={395} />
			<DrawPath d="M 320,690 L 200,750" stroke="#e74c3c" strokeWidth={4} startFrame={397} />
			<DrawText text="Inflación descontrolada" x={270} y={830} fontSize={22} align="center" startFrame={400} color="#7f8c8d" fontWeight="normal" />
			<DrawText text="e impuestos aplastantes" x={270} y={858} fontSize={22} align="center" startFrame={403} color="#7f8c8d" fontWeight="normal" />
			<DrawingHand
				points={[
					{x: 240, y: 620, frame: 380},
					{x: 260, y: 720, frame: 390},
					{x: 270, y: 820, frame: 400},
				]}
				scale={0.6}
			/>

			{/* CAUSE 4: Division */}
			<DrawBox x={510} y={540} width={420} height={400} stroke="#8e44ad" fill="#8e44ad" startFrame={410} rx={15} />
			<DrawText text="4" x={550} y={580} fontSize={36} startFrame={413} color="#8e44ad" />
			<DrawText text="División del Imperio" x={720} y={595} fontSize={28} align="center" startFrame={415} color="#7d3c98" />
			{/* Split map concept */}
			<DrawCircle cx={680} cy={720} r={50} stroke="#3498db" fill="#3498db" startFrame={420} />
			<DrawText text="W" x={680} y={730} fontSize={28} align="center" startFrame={425} color="#fff" />
			<DrawCircle cx={760} cy={720} r={50} stroke="#e74c3c" fill="#e74c3c" startFrame={428} />
			<DrawText text="E" x={760} y={730} fontSize={28} align="center" startFrame={432} color="#fff" />
			{/* Arrow down on W */}
			<DrawArrow x1={680} y1={780} x2={680} y2={830} stroke="#e74c3c" strokeWidth={3} startFrame={435} />
			<DrawText text="Cae" x={680} y={860} fontSize={20} align="center" startFrame={438} color="#e74c3c" />
			{/* Arrow up on E */}
			<DrawArrow x1={760} y1={780} x2={760} y2={830} stroke="#27ae60" strokeWidth={3} startFrame={440} />
			<DrawText text="Sobrevive" x={760} y={860} fontSize={20} align="center" startFrame={443} color="#27ae60" />
			<DrawingHand
				points={[
					{x: 680, y: 650, frame: 420},
					{x: 760, y: 700, frame: 430},
					{x: 720, y: 800, frame: 440},
				]}
				scale={0.6}
			/>
		</WhiteboardScene>
	);
};

const Scene4Timeline: React.FC = () => {
	return (
		<WhiteboardScene startFrame={530} durationFrames={140}>
			<DrawText
				text="Línea del tiempo de la caída"
				x={960}
				y={80}
				fontSize={48}
				align="center"
				startFrame={535}
			/>

			{/* Main timeline arrow */}
			<DrawArrow x1={100} y1={250} x2={1820} y2={250} stroke="#2c3e50" strokeWidth={4} startFrame={540} />
			<DrawingHand
				points={[
					{x: 100, y: 250, frame: 540},
					{x: 500, y: 250, frame: 545},
					{x: 960, y: 250, frame: 550},
					{x: 1400, y: 250, frame: 555},
					{x: 1820, y: 250, frame: 560},
				]}
				scale={0.6}
			/>

			{/* Timeline events */}
			{/* 117 AD */}
			<DrawLine x1={200} y1={230} x2={200} y2={270} stroke="#27ae60" strokeWidth={3} startFrame={562} />
			<DrawText text="117" x={200} y={310} fontSize={24} align="center" startFrame={565} color="#27ae60" />
			<DrawText text="Máxima" x={200} y={340} fontSize={18} align="center" startFrame={567} color="#27ae60" fontWeight="normal" />
			<DrawText text="extensión" x={200} y={362} fontSize={18} align="center" startFrame={569} color="#27ae60" fontWeight="normal" />
			<SvgIcons.Shield x={200} y={420} scale={1} startFrame={571} stroke="#27ae60" />

			{/* 235 AD */}
			<DrawLine x1={560} y1={230} x2={560} y2={270} stroke="#f39c12" strokeWidth={3} startFrame={575} />
			<DrawText text="235-284" x={560} y={310} fontSize={24} align="center" startFrame={578} color="#f39c12" />
			<DrawText text="Crisis del" x={560} y={340} fontSize={18} align="center" startFrame={580} color="#f39c12" fontWeight="normal" />
			<DrawText text="siglo III" x={560} y={362} fontSize={18} align="center" startFrame={582} color="#f39c12" fontWeight="normal" />
			<SvgIcons.Crown x={560} y={420} scale={1} startFrame={584} stroke="#f39c12" />

			{/* 395 AD */}
			<DrawLine x1={960} y1={230} x2={960} y2={270} stroke="#8e44ad" strokeWidth={3} startFrame={590} />
			<DrawText text="395" x={960} y={310} fontSize={24} align="center" startFrame={593} color="#8e44ad" />
			<DrawText text="División" x={960} y={340} fontSize={18} align="center" startFrame={595} color="#8e44ad" fontWeight="normal" />
			<DrawText text="Oriente/Occidente" x={960} y={362} fontSize={18} align="center" startFrame={597} color="#8e44ad" fontWeight="normal" />
			<SvgIcons.Sword x={960} y={420} scale={1} startFrame={599} />

			{/* 410 AD */}
			<DrawLine x1={1350} y1={230} x2={1350} y2={270} stroke="#e67e22" strokeWidth={3} startFrame={605} />
			<DrawText text="410" x={1350} y={310} fontSize={24} align="center" startFrame={608} color="#e67e22" />
			<DrawText text="Saqueo" x={1350} y={340} fontSize={18} align="center" startFrame={610} color="#e67e22" fontWeight="normal" />
			<DrawText text="de Roma" x={1350} y={362} fontSize={18} align="center" startFrame={612} color="#e67e22" fontWeight="normal" />
			<SvgIcons.Fire x={1350} y={420} scale={1.2} startFrame={614} />

			{/* 476 AD */}
			<DrawLine x1={1700} y1={230} x2={1700} y2={270} stroke="#e74c3c" strokeWidth={3} startFrame={620} />
			<DrawText text="476" x={1700} y={310} fontSize={30} align="center" startFrame={623} color="#e74c3c" />
			<DrawText text="CAÍDA DE" x={1700} y={345} fontSize={20} align="center" startFrame={625} color="#e74c3c" />
			<DrawText text="ROMA" x={1700} y={370} fontSize={24} align="center" startFrame={627} color="#e74c3c" />
			<SvgIcons.Skull x={1700} y={430} scale={1.3} startFrame={630} stroke="#e74c3c" />

			<DrawingHand
				points={[
					{x: 200, y: 350, frame: 562},
					{x: 560, y: 350, frame: 575},
					{x: 960, y: 350, frame: 590},
					{x: 1350, y: 350, frame: 605},
					{x: 1700, y: 350, frame: 620},
				]}
				scale={0.6}
			/>

			{/* Bottom summary */}
			<DrawBox x={350} y={520} width={1220} height={130} stroke="#2c3e50" fill="#2c3e50" startFrame={640} rx={15} />
			<DetailedIcons.BrokenColumn x={460} y={575} scale={1.2} startFrame={645} stroke="#7f8c8d" />
			<DrawText
				text="Rómulo Augústulo, el último emperador,"
				x={960}
				y={570}
				fontSize={28}
				align="center"
				startFrame={648}
				color="#ecf0f1"
				fontWeight="normal"
			/>
			<DrawText
				text="fue depuesto por el bárbaro Odoacro"
				x={960}
				y={610}
				fontSize={28}
				align="center"
				startFrame={653}
				color="#ecf0f1"
				fontWeight="normal"
			/>
		</WhiteboardScene>
	);
};

const Scene5Conclusion: React.FC = () => {
	return (
		<WhiteboardScene startFrame={660} durationFrames={100}>
			<DrawText
				text="Roma no cayó en un día..."
				x={960}
				y={250}
				fontSize={64}
				align="center"
				startFrame={665}
			/>
			<DrawingHand
				points={[
					{x: 550, y: 250, frame: 665},
					{x: 960, y: 250, frame: 675},
					{x: 1300, y: 250, frame: 680},
				]}
				scale={0.7}
			/>

			<DrawText
				text="Se desmoronó durante 300 años"
				x={960}
				y={350}
				fontSize={52}
				align="center"
				startFrame={685}
				color="#c0392b"
			/>
			<DrawLine x1={480} y1={380} x2={1440} y2={380} stroke="#c0392b" strokeWidth={5} startFrame={695} />

			{/* Three broken columns getting smaller */}
			<DetailedIcons.BrokenColumn x={650} y={530} scale={2} startFrame={700} stroke="#95a5a6" />
			<DetailedIcons.BrokenColumn x={960} y={550} scale={1.7} startFrame={708} stroke="#bdc3c7" />
			<DetailedIcons.BrokenColumn x={1270} y={570} scale={1.3} startFrame={716} stroke="#d5dbdb" />

			<DrawingHand
				points={[
					{x: 650, y: 480, frame: 700},
					{x: 960, y: 500, frame: 708},
					{x: 1270, y: 520, frame: 716},
				]}
				scale={0.6}
			/>

			{/* CTA */}
			<DrawBox x={560} y={750} width={800} height={80} stroke="#3498db" fill="#3498db" rx={40} startFrame={725} />
			<DrawText
				text="Suscríbete para más historia animada"
				x={960}
				y={800}
				fontSize={30}
				align="center"
				startFrame={730}
				color="#fff"
			/>
		</WhiteboardScene>
	);
};

export const WhiteboardDemoV2: React.FC = () => {
	return (
		<AbsoluteFill style={{backgroundColor: '#faf9f6'}}>
			<Scene1Title />
			<Scene2Peak />
			<Scene3Causes />
			<Scene4Timeline />
			<Scene5Conclusion />
		</AbsoluteFill>
	);
};
