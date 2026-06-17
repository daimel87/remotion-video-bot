import React from 'react';
import {AbsoluteFill} from 'remotion';
import {
	WhiteboardScene,
	DrawText,
	DrawLine,
	DrawCircle,
	DrawArrow,
	DrawBox,
	SvgIcons,
} from './whiteboard';

export const WhiteboardDemo: React.FC = () => {
	return (
		<AbsoluteFill style={{backgroundColor: '#faf9f6'}}>
			{/* SCENE 1: Title (frames 0–90) */}
			<WhiteboardScene startFrame={0} durationFrames={90}>
				<SvgIcons.Column x={960} y={250} scale={2.5} startFrame={5} />
				<DrawText
					text="¿Por qué cayó Roma?"
					x={960}
					y={500}
					fontSize={72}
					align="center"
					startFrame={15}
					color="#2c3e50"
				/>
				<DrawLine x1={660} y1={520} x2={1260} y2={520} stroke="#e74c3c" strokeWidth={4} startFrame={30} />
				<DrawText
					text="La verdad en 60 segundos"
					x={960}
					y={580}
					fontSize={36}
					align="center"
					startFrame={40}
					color="#7f8c8d"
					fontWeight="normal"
				/>
			</WhiteboardScene>

			{/* SCENE 2: Rome at its peak (frames 80–200) */}
			<WhiteboardScene startFrame={80} durationFrames={120}>
				<DrawText
					text="117 d.C. — Roma en su máximo esplendor"
					x={960}
					y={100}
					fontSize={48}
					align="center"
					startFrame={85}
				/>

				{/* Map outline */}
				<DrawBox x={300} y={160} width={1320} height={550} stroke="#bdc3c7" strokeWidth={2} startFrame={90} />

				{/* Territory blob */}
				<DrawCircle cx={960} cy={430} r={180} stroke="#e74c3c" fill="#e74c3c" strokeWidth={3} startFrame={95} />
				<DrawText text="ROMA" x={960} y={440} fontSize={40} align="center" startFrame={105} color="#fff" />

				{/* Stats */}
				<DrawText text="70 millones" x={480} y={800} fontSize={36} align="center" startFrame={110} color="#2c3e50" />
				<DrawText text="de habitantes" x={480} y={845} fontSize={28} align="center" startFrame={112} color="#7f8c8d" fontWeight="normal" />

				<DrawText text="5 millones km²" x={960} y={800} fontSize={36} align="center" startFrame={118} color="#2c3e50" />
				<DrawText text="de territorio" x={960} y={845} fontSize={28} align="center" startFrame={120} color="#7f8c8d" fontWeight="normal" />

				<DrawText text="400,000" x={1440} y={800} fontSize={36} align="center" startFrame={126} color="#2c3e50" />
				<DrawText text="legionarios" x={1440} y={845} fontSize={28} align="center" startFrame={128} color="#7f8c8d" fontWeight="normal" />

				<SvgIcons.Shield x={480} y={900} scale={1} startFrame={115} stroke="#3498db" />
				<SvgIcons.Crown x={960} y={900} scale={1} startFrame={123} />
				<SvgIcons.Sword x={1440} y={900} scale={1} startFrame={131} />
			</WhiteboardScene>

			{/* SCENE 3: The 4 causes (frames 190–370) */}
			<WhiteboardScene startFrame={190} durationFrames={180}>
				<DrawText
					text="4 causas principales"
					x={960}
					y={80}
					fontSize={52}
					align="center"
					startFrame={195}
				/>

				{/* Cause 1 */}
				<DrawBox x={80} y={140} width={400} height={350} stroke="#e74c3c" fill="#e74c3c" startFrame={205} />
				<SvgIcons.Sword x={280} y={240} scale={1.5} startFrame={210} stroke="#e74c3c" />
				<DrawText text="Invasiones" x={280} y={340} fontSize={32} align="center" startFrame={215} color="#c0392b" />
				<DrawText text="bárbaras" x={280} y={375} fontSize={32} align="center" startFrame={217} color="#c0392b" />
				<DrawText text="Godos, Vándalos," x={280} y={420} fontSize={22} align="center" startFrame={220} color="#7f8c8d" fontWeight="normal" />
				<DrawText text="Hunos atacan sin parar" x={280} y={450} fontSize={22} align="center" startFrame={222} color="#7f8c8d" fontWeight="normal" />

				{/* Cause 2 */}
				<DrawBox x={520} y={140} width={400} height={350} stroke="#f39c12" fill="#f39c12" startFrame={235} />
				<SvgIcons.Crown x={720} y={240} scale={1.5} startFrame={240} stroke="#f39c12" />
				<DrawText text="Crisis" x={720} y={340} fontSize={32} align="center" startFrame={245} color="#e67e22" />
				<DrawText text="política" x={720} y={375} fontSize={32} align="center" startFrame={247} color="#e67e22" />
				<DrawText text="26 emperadores en" x={720} y={420} fontSize={22} align="center" startFrame={250} color="#7f8c8d" fontWeight="normal" />
				<DrawText text="50 años (siglo III)" x={720} y={450} fontSize={22} align="center" startFrame={252} color="#7f8c8d" fontWeight="normal" />

				{/* Cause 3 */}
				<DrawBox x={960} y={140} width={400} height={350} stroke="#27ae60" fill="#27ae60" startFrame={265} />
				<SvgIcons.Skull x={1160} y={240} scale={1.5} startFrame={270} stroke="#27ae60" />
				<DrawText text="Economía" x={1160} y={340} fontSize={32} align="center" startFrame={275} color="#229954" />
				<DrawText text="destruida" x={1160} y={375} fontSize={32} align="center" startFrame={277} color="#229954" />
				<DrawText text="Inflación, impuestos" x={1160} y={420} fontSize={22} align="center" startFrame={280} color="#7f8c8d" fontWeight="normal" />
				<DrawText text="aplastantes, comercio roto" x={1160} y={450} fontSize={22} align="center" startFrame={282} color="#7f8c8d" fontWeight="normal" />

				{/* Cause 4 */}
				<DrawBox x={1400} y={140} width={400} height={350} stroke="#8e44ad" fill="#8e44ad" startFrame={295} />
				<SvgIcons.Fire x={1600} y={240} scale={1.5} startFrame={300} />
				<DrawText text="División" x={1600} y={340} fontSize={32} align="center" startFrame={305} color="#7d3c98" />
				<DrawText text="del imperio" x={1600} y={375} fontSize={32} align="center" startFrame={307} color="#7d3c98" />
				<DrawText text="Oriente sobrevive," x={1600} y={420} fontSize={22} align="center" startFrame={310} color="#7f8c8d" fontWeight="normal" />
				<DrawText text="Occidente se derrumba" x={1600} y={450} fontSize={22} align="center" startFrame={312} color="#7f8c8d" fontWeight="normal" />

				{/* Timeline arrow */}
				<DrawArrow x1={200} y1={570} x2={1700} y2={570} stroke="#2c3e50" strokeWidth={3} startFrame={325} />
				<DrawText text="117 d.C." x={200} y={610} fontSize={24} startFrame={330} color="#7f8c8d" fontWeight="normal" />
				<DrawText text="235" x={620} y={610} fontSize={24} startFrame={335} color="#7f8c8d" fontWeight="normal" />
				<DrawText text="395" x={1100} y={610} fontSize={24} startFrame={340} color="#7f8c8d" fontWeight="normal" />
				<DrawText text="476 d.C." x={1600} y={610} fontSize={24} startFrame={345} color="#e74c3c" />

				<DrawText
					text="476 d.C. — Cae el último emperador de Occidente: Rómulo Augústulo"
					x={960}
					y={700}
					fontSize={30}
					align="center"
					startFrame={350}
					color="#2c3e50"
				/>
			</WhiteboardScene>

			{/* SCENE 4: Conclusion (frames 360–450) */}
			<WhiteboardScene startFrame={360} durationFrames={90}>
				<DrawText
					text="Roma no cayó en un día..."
					x={960}
					y={300}
					fontSize={56}
					align="center"
					startFrame={365}
				/>
				<DrawText
					text="Se desmoronó durante 300 años"
					x={960}
					y={400}
					fontSize={44}
					align="center"
					startFrame={380}
					color="#e74c3c"
				/>
				<DrawLine x1={560} y1={430} x2={1360} y2={430} stroke="#e74c3c" strokeWidth={4} startFrame={390} />

				<SvgIcons.Column x={700} y={600} scale={2} startFrame={395} stroke="#bdc3c7" />
				<SvgIcons.Column x={960} y={620} scale={1.8} startFrame={400} stroke="#bdc3c7" />
				<SvgIcons.Column x={1220} y={640} scale={1.5} startFrame={405} stroke="#bdc3c7" />

				<DrawText
					text="Suscríbete para más historia animada"
					x={960}
					y={850}
					fontSize={32}
					align="center"
					startFrame={415}
					color="#3498db"
				/>
			</WhiteboardScene>
		</AbsoluteFill>
	);
};
