import React from 'react';
import {
	AbsoluteFill,
	Img,
	interpolate,
	useCurrentFrame,
	useVideoConfig,
	Sequence,
	staticFile,
	spring,
} from 'remotion';

interface ActorData {
	name: string;
	born: number;
	died?: number;
	notable: string;
	then: string;
	now: string;
}

const ACTORS: ActorData[] = [
	{name: 'Tom Cruise', born: 1962, notable: 'Top Gun · Mission: Impossible', then: 'images/then-now/images.jpg', now: 'images/then-now/Tom_Cruise_at_53rd_Saturn_Awards_2026-01.jpg'},
	{name: 'Brad Pitt', born: 1963, notable: 'Fight Club · Se7en', then: 'images/then-now/images (1).jpg', now: 'images/then-now/Brad-pitt-F1-movie-world-premeire.jpg'},
	{name: 'Keanu Reeves', born: 1964, notable: 'The Matrix · Speed', then: 'images/then-now/images (2).jpg', now: 'images/then-now/Keanu_Reeves_at_TIFF_2025_02_(Cropped).jpg'},
	{name: 'Kevin Costner', born: 1955, notable: 'Bodyguard · Dances with Wolves', then: 'images/then-now/images (3).jpg', now: 'images/then-now/images (4).jpg'},
	{name: 'Sylvester Stallone', born: 1946, notable: 'Rocky · Rambo', then: 'images/then-now/65b4cbcfffffc1bbe2f892964dd10e6b.jpg', now: 'images/then-now/images (5).jpg'},
	{name: 'Arnold Schwarzenegger', born: 1947, notable: 'Terminator · Predator', then: 'images/then-now/a9c0c384a0c55ad3d39a80f459f30dc5.jpg', now: 'images/then-now/images (6).jpg'},
	{name: 'Bruce Willis', born: 1955, notable: 'Die Hard · Pulp Fiction', then: 'images/then-now/images (7).jpg', now: 'images/then-now/Bruce_Willis_by_Gage_Skidmore_3.jpg'},
	{name: 'Denzel Washington', born: 1954, notable: 'Training Day · Malcolm X', then: 'images/then-now/Denzel_Washington.webp', now: 'images/then-now/images (8).jpg'},
	{name: 'Al Pacino', born: 1940, notable: 'The Godfather · Scarface', then: 'images/then-now/59c408d34f440e640adfb5d582cdf599.jpg', now: 'images/then-now/images (9).jpg'},
	{name: 'Robert De Niro', born: 1943, notable: 'Goodfellas · Taxi Driver', then: 'images/then-now/images (10).jpg', now: 'images/then-now/Robert_de_Niro-9578.jpg'},
	{name: 'Rob Lowe', born: 1964, notable: 'St. Elmo\'s Fire · The Outsiders', then: 'images/then-now/51SaHKu7eZL._AC_UF894,1000_QL80_.jpg', now: 'images/then-now/images (11).jpg'},
	{name: 'Matt Dillon', born: 1964, notable: 'The Outsiders · Drugstore Cowboy', then: 'images/then-now/98a099dd42dba59c3d209e60aece52c7.jpg', now: 'images/then-now/images (12).jpg'},
	{name: 'Emilio Estevez', born: 1962, notable: 'The Breakfast Club · Repo Man', then: 'images/then-now/images (13).jpg', now: 'images/then-now/19527_v9_bb.jpg'},
	{name: 'Charlie Sheen', born: 1965, notable: 'Platoon · Wall Street', then: 'images/then-now/46a65204628e160c06d8f1c05fe054ce.jpg', now: 'images/then-now/images (14).jpg'},
	{name: 'Val Kilmer', born: 1959, died: 2025, notable: 'Top Gun · Batman Forever', then: 'images/then-now/images (15).jpg', now: 'images/then-now/923_v9_bd.jpg'},
	{name: 'Nick Nolte', born: 1941, notable: '48 Hrs. · Cape Fear', then: 'images/then-now/image-w856.webp', now: 'images/then-now/images (16).jpg'},
	{name: 'Liam Neeson', born: 1952, notable: 'Schindler\'s List · Taken', then: 'images/then-now/3090635b795e02b9e6da9705821b57f4.jpg', now: 'images/then-now/images (17).jpg'},
	{name: 'Pierce Brosnan', born: 1953, notable: 'GoldenEye · The Thomas Crown Affair', then: 'images/then-now/images (18).jpg', now: 'images/then-now/images (25).jpg'},
	{name: 'Steven Seagal', born: 1952, notable: 'Above the Law · Under Siege', then: 'images/then-now/images (19).jpg', now: 'images/then-now/277638264399603-nm_200.jpg'},
	{name: 'Don Johnson', born: 1949, notable: 'Miami Vice · Nash Bridges', then: 'images/then-now/A-259648-1502914381-9031.jpg', now: 'images/then-now/images (20).jpg'},
	{name: 'Tom Selleck', born: 1945, notable: 'Magnum P.I. · Three Men and a Baby', then: 'images/then-now/tom-selleck-couldve-been-a-great-sully-and-he-has-a-action-v0-ewc0fmfv81v71.webp', now: 'images/then-now/images (21).jpg'},
	{name: 'Alec Baldwin', born: 1958, notable: 'The Hunt for Red October · Beetlejuice', then: 'images/then-now/what-marvel-or-dc-roles-could-a-1990s-alec-baldwin-have-v0-1qktc294grje1.webp', now: 'images/then-now/images (22).jpg'},
	{name: 'Nicolas Cage', born: 1964, notable: 'Face/Off · The Rock', then: 'images/then-now/images (23).jpg', now: 'images/then-now/images (24).jpg'},
	{name: 'Mel Gibson', born: 1956, notable: 'Braveheart · Lethal Weapon', then: 'images/then-now/03111c93993f02ae08c09e93bfbe00bc.jpg', now: 'images/then-now/GNLZZGG002GYKTG.jpg'},
	{name: 'George Clooney', born: 1961, notable: 'ER · Ocean\'s Eleven', then: 'images/then-now/0336b7881607719371e09dd9d19ff3c4.jpg', now: 'images/then-now/George_Clooney_Jay_Kelly-19_(cropped).jpg'},
	{name: 'Jean-Claude Van Damme', born: 1960, notable: 'Bloodsport · Universal Soldier', then: 'images/then-now/514uKH-5fhL._AC_UF894,1000_QL80_.jpg', now: 'images/then-now/119263.jpg'},
	{name: 'Mickey Rourke', born: 1952, notable: '9½ Weeks · The Wrestler', then: 'images/then-now/2acfe9cdca6acfab5f2d74a64ca369de.jpg', now: 'images/then-now/1505_v9_be.jpg'},
	{name: 'Harrison Ford', born: 1942, notable: 'Indiana Jones · Star Wars', then: 'images/then-now/american-actor-harrison-ford-news-photo-1629205435.png', now: 'images/then-now/25704_v9_bc.jpg'},
	{name: 'Johnny Depp', born: 1963, notable: 'Edward Scissorhands · Pirates of the Caribbean', then: 'images/then-now/image.webp', now: 'images/then-now/33623_v9_bc.jpg'},
	{name: 'Wesley Snipes', born: 1962, notable: 'Blade · New Jack City', then: 'images/then-now/393a41d07f9064ac86c67494011554ba.jpg', now: 'images/then-now/Wesley_Snipes_(41969097750)_(cropped).jpg'},
	{name: 'Dolph Lundgren', born: 1957, notable: 'Rocky IV · Universal Soldier', then: 'images/then-now/51UgZzJ8ABL._AC_UF894,1000_QL80_.jpg', now: 'images/then-now/Dolph_Lundgren_Photo_Op_GalaxyCon_Richmond_2024.jpg'},
	{name: 'Viggo Mortensen', born: 1958, notable: 'Lord of the Rings · A History of Violence', then: 'images/then-now/6d806d70bb9d8f17ae43cf9a52aebc61.jpg', now: 'images/then-now/2156534488.webp'},
	{name: 'Hugh Jackman', born: 1968, notable: 'X-Men · The Greatest Showman', then: 'images/then-now/6eb50b2962c4e3387314812abe54cca3.jpg', now: 'images/then-now/Hugh_Jackman_Is_This_Thing_On-68_(cropped).jpg'},
	{name: 'Richard Gere', born: 1949, notable: 'Pretty Woman · An Officer and a Gentleman', then: 'images/then-now/73183f9d25341ba1fcc2867245d1d4d9.jpg', now: 'images/then-now/Richard_Gere-69101.jpg'},
	{name: 'Will Smith', born: 1968, notable: 'The Fresh Prince · Men in Black', then: 'images/then-now/75b4b8fd89d4eae8e0dd0aa3efcb1ada.jpg', now: 'images/then-now/will-smith-at-the-london-premiere-of-pole-to-pole-with-will-smith.png'},
	{name: 'Laurence Fishburne', born: 1961, notable: 'The Matrix · Boyz n the Hood', then: 'images/then-now/9568d3af1d2c91b7dfef10a7f678de33.jpg', now: 'images/then-now/Laurence_Fishburne_at_53rd_Saturn_Awards_2026.jpg'},
	{name: 'C. Thomas Howell', born: 1966, notable: 'The Outsiders · Soul Man', then: 'images/then-now/c3d7591666e0674956c8c1610e29f9ca.jpg', now: 'images/then-now/tomas c howell.jpg'},
	{name: 'Tom Hanks', born: 1956, notable: 'Forrest Gump · Cast Away', then: 'images/then-now/d0680b16b50afce3cee189b02de62255.jpg', now: 'images/then-now/TomHanksPrincEdw031223_(11_of_41)_(cropped).jpg'},
	{name: 'Leonardo DiCaprio', born: 1974, notable: 'Titanic · The Departed', then: 'images/then-now/d1b4155cc8ebbcea2795c2c86bd4567c.jpg', now: 'images/then-now/leonardo-dicaprio-440nw-10353131ce.jpg'},
	{name: 'Patrick Swayze', born: 1952, died: 2009, notable: 'Dirty Dancing · Ghost', then: 'images/then-now/d5d95eaae2244179dabf2384170ed3b5.jpg', now: ''},
	{name: 'Jude Law', born: 1972, notable: 'The Talented Mr. Ripley · Sherlock Holmes', then: 'images/then-now/f1724de9418aa62f9ba49c804432c6f8.jpg', now: 'images/then-now/Jude_Law-67896_(cropped).jpg'},
	{name: 'Andy Garcia', born: 1956, notable: 'The Godfather Part III · Oceans Eleven', then: 'images/then-now/image-w856 (1).webp', now: 'images/then-now/andy-garcia-now.jpg'},
	{name: 'Brendan Fraser', born: 1968, notable: 'The Mummy · George of the Jungle', then: 'images/then-now/k594q7aujal71.jpg', now: 'images/then-now/Brendan_Fraser_MFF_2025.jpg'},
	{name: 'John Travolta', born: 1954, notable: 'Saturday Night Fever · Grease', then: 'images/then-now/John_T_color_01.jpg', now: 'images/then-now/1100x1900.png'},
	{name: 'Russell Crowe', born: 1964, notable: 'Gladiator · L.A. Confidential', then: 'images/then-now/russel-crowe-in-the-90s-v0-2jd2ln2x4q6c1.webp', now: 'images/then-now/Russell_Crowe_on_the_Green_Carpet_at_the_2025_Zurich_Film_Festival_06_(cropped).jpg'},
	{name: 'Edward Norton', born: 1969, notable: 'Fight Club · American History X', then: 'images/then-now/Ed_Norton_1997.jpg', now: 'images/then-now/Ed_Norton_and_Shauna_Robertson_TIFF_2025_(cropped).jpg'},
	{name: 'Jeff Bridges', born: 1949, notable: 'The Big Lebowski · Tron', then: 'images/then-now/bc400cfb3ea8c1d6201096a38a19f01e.jpg', now: 'images/then-now/Jeff_Bridges_by_Gage_Skidmore_3.jpg'},
	{name: 'Antonio Banderas', born: 1960, notable: 'The Mask of Zorro · Desperado', then: 'images/then-now/antonio-banderas-actor-joven-69ab563030bd5.png', now: 'images/then-now/antonio-banderas-686bb59547544.png'},
	{name: 'Christian Slater', born: 1969, notable: 'Heathers · True Romance', then: 'images/then-now/f5173dc97ac2dae3f3b76d022db959ce.jpg', now: 'images/then-now/christan_slater_060116_mr._robot_1.webp'},
	{name: 'Kurt Russell', born: 1951, notable: 'Escape from New York · The Thing', then: 'images/then-now/which-dc-characters-kurt-russell-could-have-played-in-the-v0-tncuuz01fvzc1.webp', now: 'images/then-now/Kurt_Russell_by_Gage_Skidmore_2.jpg'},
];

const FPS = 30;
const INTRO_DURATION = 5 * FPS;   // 5s
const ACTOR_DURATION = 10 * FPS;  // 10s
const OUTRO_DURATION = 5 * FPS;   // 5s
const TRANSITION = 20;

// ─── Gold divider line ─────────────────────────────
const GoldLine: React.FC<{width?: number}> = ({width = 400}) => (
	<div style={{width, height: 2, background: 'linear-gradient(90deg, transparent, #c9a84c, transparent)', margin: '0 auto'}} />
);

// ─── Intro Card ────────────────────────────────────
const IntroCard: React.FC = () => {
	const frame = useCurrentFrame();
	const titleOpacity = interpolate(frame, [0, 30], [0, 1], {extrapolateRight: 'clamp'});
	const sub1Opacity = interpolate(frame, [30, 60], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const sub2Opacity = interpolate(frame, [60, 90], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const fadeOut = interpolate(frame, [INTRO_DURATION - 20, INTRO_DURATION], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	return (
		<AbsoluteFill style={{backgroundColor: '#080810', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', opacity: fadeOut}}>
			{/* THEN vs NOW split bg hint */}
			<div style={{position: 'absolute', left: 0, top: 0, width: '50%', height: '100%', backgroundColor: 'rgba(180,140,60,0.04)'}} />
			<div style={{position: 'absolute', right: 0, top: 0, width: '50%', height: '100%', backgroundColor: 'rgba(60,120,200,0.04)'}} />

			<div style={{opacity: titleOpacity, textAlign: 'center'}}>
				<div style={{fontFamily: "'Georgia', serif", color: '#c9a84c', fontSize: 28, letterSpacing: 10, marginBottom: 16}}>50 HANDSOME</div>
				<div style={{fontFamily: "'Georgia', serif", color: '#ffffff', fontSize: 96, fontWeight: 700, letterSpacing: 4, lineHeight: 1, textShadow: '0 0 60px rgba(255,255,255,0.1)'}}>
					HOLLYWOOD
				</div>
				<div style={{fontFamily: "'Georgia', serif", color: '#ffffff', fontSize: 96, fontWeight: 700, letterSpacing: 4, lineHeight: 1, textShadow: '0 0 60px rgba(255,255,255,0.1)'}}>
					ACTORS
				</div>
			</div>

			<div style={{marginTop: 32, opacity: sub1Opacity, display: 'flex', alignItems: 'center', gap: 40}}>
				<div style={{textAlign: 'center'}}>
					<div style={{fontFamily: "'Georgia', serif", color: '#d4a844', fontSize: 48, fontWeight: 700, letterSpacing: 6}}>THEN</div>
					<div style={{color: '#888', fontSize: 18, letterSpacing: 4}}>80s &amp; 90s</div>
				</div>
				<div style={{color: '#555', fontSize: 48, fontWeight: 300}}>vs</div>
				<div style={{textAlign: 'center'}}>
					<div style={{fontFamily: "'Georgia', serif", color: '#4a9eff', fontSize: 48, fontWeight: 700, letterSpacing: 6}}>NOW</div>
					<div style={{color: '#888', fontSize: 18, letterSpacing: 4}}>2024 – 2026</div>
				</div>
			</div>

			<div style={{marginTop: 40, opacity: sub2Opacity}}>
				<GoldLine width={500} />
				<div style={{fontFamily: "'Georgia', serif", color: '#666', fontSize: 22, fontStyle: 'italic', textAlign: 'center', marginTop: 16, letterSpacing: 2}}>
					From the Golden Era to Today
				</div>
			</div>
		</AbsoluteFill>
	);
};

// ─── Actor Segment ─────────────────────────────────
const ActorSegment: React.FC<{actor: ActorData; index: number}> = ({actor, index}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const isDeceased = !!actor.died;
	const noNow = !actor.now;
	const currentYear = 2026;
	const age = actor.died ? `${actor.born} – ${actor.died}` : `${currentYear - actor.born} years old`;

	// Segment fade
	const fadeIn = index === 0
		? 1
		: interpolate(frame, [0, TRANSITION], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const fadeOut = index === ACTORS.length - 1
		? 1
		: interpolate(frame, [ACTOR_DURATION - TRANSITION, ACTOR_DURATION], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	// Counter
	const counterOpacity = interpolate(frame, [0, 20], [0, 1], {extrapolateRight: 'clamp'});

	// Photo entrance
	const thenScale = spring({fps, frame: frame - 10, config: {damping: 80, stiffness: 120}});
	const nowScale = spring({fps, frame: frame - 25, config: {damping: 80, stiffness: 120}});
	const thenOpacity = interpolate(frame, [10, 30, ACTOR_DURATION - 15, ACTOR_DURATION], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const nowOpacity = interpolate(frame, [25, 45, ACTOR_DURATION - 15, ACTOR_DURATION], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	// Name slide up
	const nameY = interpolate(frame, [15, 40], [40, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const nameOpacity = interpolate(frame, [15, 40, ACTOR_DURATION - 15, ACTOR_DURATION], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	// Info fade
	const infoOpacity = interpolate(frame, [40, 60, ACTOR_DURATION - 15, ACTOR_DURATION], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	const photoW = 700;
	const photoH = 840;

	return (
		<AbsoluteFill style={{opacity: Math.min(fadeIn, fadeOut), backgroundColor: '#080810'}}>
			{/* Subtle gradient backgrounds for each side */}
			<div style={{position: 'absolute', left: 0, top: 0, width: '50%', height: '100%', background: 'linear-gradient(135deg, rgba(180,140,60,0.06) 0%, transparent 100%)'}} />
			<div style={{position: 'absolute', right: 0, top: 0, width: '50%', height: '100%', background: 'linear-gradient(225deg, rgba(60,120,220,0.06) 0%, transparent 100%)'}} />

			{/* Center divider */}
			<div style={{position: 'absolute', left: '50%', top: '10%', height: '80%', width: 1, background: 'linear-gradient(180deg, transparent, rgba(201,168,76,0.5), rgba(201,168,76,0.5), transparent)', transform: 'translateX(-50%)'}} />

			{/* THEN label */}
			<div style={{
				position: 'absolute', top: 32, left: 0, width: '50%',
				textAlign: 'center', opacity: nameOpacity,
			}}>
				<div style={{fontFamily: "'Georgia', serif", color: '#d4a844', fontSize: 28, fontWeight: 700, letterSpacing: 10}}>THEN</div>
				<div style={{color: '#666', fontSize: 16, letterSpacing: 4, marginTop: 4}}>80s &amp; 90s</div>
			</div>

			{/* NOW label */}
			<div style={{
				position: 'absolute', top: 32, right: 0, width: '50%',
				textAlign: 'center', opacity: nameOpacity,
			}}>
				<div style={{fontFamily: "'Georgia', serif", color: isDeceased ? '#c9a84c' : '#4a9eff', fontSize: 28, fontWeight: 700, letterSpacing: 10}}>
					{isDeceased ? 'IN MEMORIAM' : 'NOW'}
				</div>
				<div style={{color: '#666', fontSize: 16, letterSpacing: 4, marginTop: 4}}>
					{isDeceased ? `✝ ${actor.died}` : '2024 – 2026'}
				</div>
			</div>

			{/* Photos row */}
			<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 0, paddingTop: 30, paddingBottom: 160}}>
				{/* THEN photo */}
				<div style={{
					width: photoW, height: photoH,
					transform: `scale(${thenScale})`,
					opacity: thenOpacity,
					overflow: 'hidden',
					border: '3px solid rgba(212,168,68,0.6)',
					boxShadow: '0 0 40px rgba(212,168,68,0.2)',
					margin: '0 20px',
				}}>
					<Img
						src={staticFile(actor.then)}
						style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 15%', filter: 'sepia(30%) contrast(1.05)'}}
					/>
					{/* Sepia overlay */}
					<div style={{position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 60%, rgba(20,15,5,0.6) 100%)'}} />
				</div>

				{/* NOW photo */}
				<div style={{
					width: photoW, height: photoH,
					transform: `scale(${nowScale})`,
					opacity: nowOpacity,
					overflow: 'hidden',
					border: `3px solid ${isDeceased ? 'rgba(201,168,76,0.6)' : 'rgba(74,158,255,0.5)'}`,
					boxShadow: `0 0 40px ${isDeceased ? 'rgba(201,168,76,0.2)' : 'rgba(74,158,255,0.15)'}`,
					margin: '0 20px',
					position: 'relative',
				}}>
					{noNow ? (
						<div style={{width: '100%', height: '100%', backgroundColor: '#111', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
							<div style={{fontSize: 60}}>✝</div>
							<div style={{color: '#c9a84c', fontFamily: "'Georgia', serif", fontSize: 28, marginTop: 20}}>In Memoriam</div>
							<div style={{color: '#888', fontFamily: "'Georgia', serif", fontSize: 22, marginTop: 10}}>{actor.born} – {actor.died}</div>
						</div>
					) : (
						<Img
							src={staticFile(actor.now)}
							style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 15%'}}
						/>
					)}
					{isDeceased && !noNow && (
						<div style={{
							position: 'absolute', inset: 0,
							background: 'linear-gradient(to bottom, transparent 50%, rgba(10,5,0,0.8) 100%)',
							display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 20,
						}}>
							<div style={{color: '#c9a84c', fontFamily: "'Georgia', serif", fontSize: 22, letterSpacing: 3}}>R.I.P. {actor.born} – {actor.died}</div>
						</div>
					)}
					{/* Fade bottom */}
					{!isDeceased && <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 60%, rgba(8,8,16,0.5) 100%)'}} />}
				</div>
			</AbsoluteFill>

			{/* Actor name */}
			<AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', flexDirection: 'column', paddingBottom: 60}}>
				<div style={{opacity: nameOpacity, transform: `translateY(${nameY}px)`, textAlign: 'center'}}>
					<div style={{
						fontFamily: "'Georgia', serif",
						color: '#ffffff',
						fontSize: 72,
						fontWeight: 700,
						letterSpacing: 4,
						textShadow: '0 2px 30px rgba(0,0,0,0.9)',
						lineHeight: 1,
					}}>
						{actor.name.toUpperCase()}
					</div>
				</div>

				<div style={{opacity: infoOpacity, marginTop: 16, textAlign: 'center'}}>
					<GoldLine width={600} />
					<div style={{display: 'flex', gap: 40, justifyContent: 'center', marginTop: 14, alignItems: 'center'}}>
						<div style={{fontFamily: "'Georgia', serif", color: '#c9a84c', fontSize: 24, letterSpacing: 2}}>
							Born {actor.born}
						</div>
						<div style={{color: '#444', fontSize: 20}}>•</div>
						<div style={{fontFamily: "'Georgia', serif", color: isDeceased ? '#c9a84c' : '#8ab4f8', fontSize: 24, letterSpacing: 2}}>
							{age}
						</div>
					</div>
					<div style={{fontFamily: "'Georgia', serif", color: '#666', fontSize: 20, fontStyle: 'italic', marginTop: 10, letterSpacing: 1}}>
						{actor.notable}
					</div>
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

// ─── Outro Card ────────────────────────────────────
const OutroCard: React.FC = () => {
	const frame = useCurrentFrame();
	const fadeIn = interpolate(frame, [0, 30], [0, 1], {extrapolateRight: 'clamp'});
	const sub = interpolate(frame, [30, 60], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	return (
		<AbsoluteFill style={{backgroundColor: '#080810', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', opacity: fadeIn}}>
			<div style={{fontFamily: "'Georgia', serif", color: '#c9a84c', fontSize: 32, letterSpacing: 10, marginBottom: 20}}>50 HANDSOME</div>
			<div style={{fontFamily: "'Georgia', serif", color: '#ffffff', fontSize: 80, fontWeight: 700, letterSpacing: 4, textAlign: 'center', lineHeight: 1.1}}>
				HOLLYWOOD<br />ACTORS
			</div>
			<div style={{fontFamily: "'Georgia', serif", color: '#4a9eff', fontSize: 48, fontWeight: 700, letterSpacing: 8, marginTop: 20}}>THEN &amp; NOW</div>
			<div style={{marginTop: 40, opacity: sub}}>
				<GoldLine width={500} />
				<div style={{fontFamily: "'Georgia', serif", color: '#666', fontSize: 22, fontStyle: 'italic', textAlign: 'center', marginTop: 20}}>
					Like &amp; Subscribe for more! 🎬
				</div>
			</div>
		</AbsoluteFill>
	);
};

// ─── Main Composition ──────────────────────────────
export const ThenNow: React.FC = () => {
	return (
		<AbsoluteFill style={{backgroundColor: '#080810'}}>
			<Sequence from={0} durationInFrames={INTRO_DURATION}>
				<IntroCard />
			</Sequence>

			{ACTORS.map((actor, index) => {
				const start = INTRO_DURATION + index * (ACTOR_DURATION - TRANSITION);
				return (
					<Sequence key={actor.name} from={start} durationInFrames={ACTOR_DURATION}>
						<ActorSegment actor={actor} index={index} />
					</Sequence>
				);
			})}

			<Sequence
				from={INTRO_DURATION + (ACTORS.length - 1) * (ACTOR_DURATION - TRANSITION) + ACTOR_DURATION - TRANSITION}
				durationInFrames={OUTRO_DURATION}
			>
				<OutroCard />
			</Sequence>
		</AbsoluteFill>
	);
};

export {INTRO_DURATION, ACTOR_DURATION, OUTRO_DURATION, TRANSITION};
export const ACTOR_COUNT = ACTORS.length;
