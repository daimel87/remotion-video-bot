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
	years: string;
	portrait: string;
	movie1: string;
	movie1Title: string;
	movie2: string;
	movie2Title: string;
	quote: string;
}

const ACTORS: ActorData[] = [
	{
		name: 'Paul Walker',
		years: '1973 — 2013',
		portrait: 'images/legends/131202152330_paul3_304x304_getty.jpg.webp',
		movie1: 'images/legends/REXUSA_1001806a_fast_and_the_furious_jt_131201_16x9_992.jpg',
		movie1Title: 'Fast & Furious',
		movie2: 'images/legends/x1080.jpg',
		movie2Title: 'Into the Blue',
		quote: '"If one day speed kills me, don\'t cry. Because I was smiling."',
	},
	{
		name: 'Luke Perry',
		years: '1966 — 2019',
		portrait: 'images/legends/luke-perry-milestones.webp',
		movie1: 'images/legends/beverly_hills_90210_perry_1_copy.webp',
		movie1Title: 'Beverly Hills 90210',
		movie2: 'images/legends/luke-perry-molly-ringwald-2000-190c9e72813e4fdba8560ecd23c39f3e.jpg',
		movie2Title: 'Riverdale',
		quote: '"I have a reverence for the past that I don\'t have for the future."',
	},
	{
		name: 'Alan Rickman',
		years: '1946 — 2016',
		portrait: 'images/legends/Alan_Rickman.webp',
		movie1: 'images/legends/KB542PRCYZBKTL3357N4S2FWOQ.webp',
		movie1Title: 'Harry Potter',
		movie2: 'images/legends/die-hard-alan-rickman.png',
		movie2Title: 'Die Hard',
		quote: '"Actors are agents of change. A film, a piece of theater, a piece of music, or a book can make a difference."',
	},
	{
		name: 'Anton Yelchin',
		years: '1989 — 2016',
		portrait: 'images/legends/Anton_Yelchin.webp',
		movie1: 'images/legends/hero-image.fill.size_1248x702.v1611610881.webp',
		movie1Title: 'Star Trek',
		movie2: 'images/legends/Green-Room-1400x771.jpg',
		movie2Title: 'Green Room',
		quote: '"I just want to act. I just want to do what I love."',
	},
	{
		name: 'James Dean',
		years: '1931 — 1955',
		portrait: 'images/legends/featured-famous-bi-james-dean-1.jpg',
		movie1: 'images/legends/MQZSZA4DYREC5L25O5NX2HOULQ.jpg',
		movie1Title: 'Rebel Without a Cause',
		movie2: 'images/legends/x1080 (1).jpg',
		movie2Title: 'East of Eden',
		quote: '"Dream as if you\'ll live forever. Live as if you\'ll die today."',
	},
	{
		name: 'Brittany Murphy',
		years: '1977 — 2009',
		portrait: 'images/legends/brittany-murphy-2008_104.webp',
		movie1: 'images/legends/maxresdefault.jpg',
		movie1Title: 'Clueless',
		movie2: 'images/legends/8-Mile-Brittany-Murphy-Eminem-e1611154142478.jpg',
		movie2Title: '8 Mile',
		quote: '"I\'m not afraid of anything. That\'s just the way I am."',
	},
	{
		name: 'Patrick Swayze',
		years: '1952 — 2009',
		portrait: 'images/legends/image-w856.webp',
		movie1: 'images/legends/663774dc11a3b05fb1f6799343ffe18c5cbfd84cdca665226067d2cf830b9997._SX1080_FMjpg_.jpg',
		movie1Title: 'Dirty Dancing',
		movie2: 'images/legends/demi-moore-y-patrick-swayze-sufrieron-mucho-al-5UMAHYKJGJAMDJ3IJPUIBJWZ2Q.png',
		movie2Title: 'Ghost',
		quote: '"Nobody puts Baby in a corner."',
	},
	{
		name: 'River Phoenix',
		years: '1970 — 1993',
		portrait: 'images/legends/MV5BM2E0MGI0MmItMWRlMy00OTAxLWJkM2QtMDRmMmZhZThhOGVmXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
		movie1: 'images/legends/River Phoenix Stand By Me.png',
		movie1Title: 'Stand By Me',
		movie2: 'images/legends/AAAABbUDfDzLZnXlI1XXO1N71TOqRhg8Stcne9FOzs9EoorvsBOM4mqwezjIM2gjFNFSYtjyc-y3L7FSwkS12i1n3GlwZ9SWBU8nrCyH.jpg',
		movie2Title: 'My Own Private Idaho',
		quote: '"Run to the rescue with love and peace will follow."',
	},
	{
		name: 'Bernie Mac',
		years: '1957 — 2008',
		portrait: 'images/legends/bernie-mac.webp',
		movie1: 'images/legends/MV5BNWNlZjQyYmQtODMyMS00M2IyLWE3OWMtM2M5ZThjNmM5NDIwXkEyXkFqcGc@._V1_.jpg',
		movie1Title: "Ocean's Eleven",
		movie2: 'images/legends/image-w1280.webp',
		movie2Title: 'The Bernie Mac Show',
		quote: '"I ain\'t scared of nobody."',
	},
	{
		name: 'Naya Rivera',
		years: '1987 — 2020',
		portrait: 'images/legends/MV5BOTk0MzMzODQ2OV5BMl5BanBnXkFtZTcwMTAyMzY3Mg@@._V1_FMjpg_UX1000_.jpg',
		movie1: 'images/legends/2026542.jpg',
		movie1Title: 'Glee',
		movie2: 'images/legends/maxresdefault (1).jpg',
		movie2Title: 'Glee',
		quote: '"Tomorrow is not promised. Be present."',
	},
	{
		name: 'Philip Seymour Hoffman',
		years: '1967 — 2014',
		portrait: 'images/legends/image.jpg',
		movie1: 'images/legends/rs-18506-capote-1800-1391373806.webp',
		movie1Title: 'Capote',
		movie2: 'images/legends/rs-150259-20120910-master-624x420-1347307563.webp',
		movie2Title: 'The Master',
		quote: '"The only true currency in this bankrupt world is what you share with someone else."',
	},
	{
		name: 'Brandon Lee',
		years: '1965 — 1993',
		portrait: 'images/legends/gettyimages-50743046.png',
		movie1: 'images/legends/movie-the-crow-brandon-lee-crow-wallpaper-a9e0e83d617acd6b76c748af800116cd.webp',
		movie1Title: 'The Crow',
		movie2: 'images/legends/rapid-fire-blu-ray.jpg',
		movie2Title: 'Rapid Fire',
		quote: '"Because nothing is what it seems."',
	},
	{
		name: 'Audrey Hepburn',
		years: '1929 — 1993',
		portrait: 'images/legends/MV5BMWUzODRjYzItY2ZlOC00NDgxLThhM2EtZGRjZDcyZDljOWUxXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
		movie1: 'images/legends/audrey_hepburn-hubert_de_givenchy-muertes_291483840_69602984_1706x960.webp',
		movie1Title: "Breakfast at Tiffany's",
		movie2: 'images/legends/Photo_Audrey_Hepburn_in_a_scene_from_Roman_Holiday,_a_1953_film_directed_by_William_Wyler_1953_-_Touring_Club_Italiano_04_0815.jpg',
		movie2Title: 'Roman Holiday',
		quote: '"Nothing is impossible. The word itself says \'I\'m possible!\'"',
	},
	{
		name: 'Cameron Boyce',
		years: '1999 — 2019',
		portrait: 'images/legends/517639_v9_bc.jpg',
		movie1: 'images/legends/Cameron-Boyce-Descendants-3-071124-3a4d5d1f87b842f084bf48c81b22ce0e.jpg',
		movie1Title: 'Descendants',
		movie2: 'images/legends/maxresdefault (2).jpg',
		movie2Title: 'Jessie',
		quote: '"Use your voice for kindness, your ears for compassion."',
	},
	{
		name: 'John Candy',
		years: '1950 — 1994',
		portrait: 'images/legends/uvLWbMDE6UfWNF5tfrsrC9NqeEA.webp',
		movie1: 'images/legends/john-candy-planes-trains-and-automobiles.png',
		movie1Title: 'Planes, Trains & Automobiles',
		movie2: 'images/legends/john-candy-in-the-final-scene-from-uncle-buck-1989-he-v0-fit9vv0ftbmc1.webp',
		movie2Title: 'Uncle Buck',
		quote: '"I think I am a good person. And I think I\'m funny."',
	},
	{
		name: 'Natasha Richardson',
		years: '1963 — 2009',
		portrait: 'images/legends/275316592962842-nm_200.jpg',
		movie1: 'images/legends/dennis-quaid-natasha-richardson-parent-trap-041524-a5f5bbcba9424305a5cb65a3ffb73103.jpg',
		movie1Title: 'The Parent Trap',
		movie2: 'images/legends/171318_800x321.jpg',
		movie2Title: 'Nell',
		quote: '"People think that if you are beautiful, life is easy. It isn\'t."',
	},
	{
		name: 'Chris Farley',
		years: '1964 — 1997',
		portrait: 'images/legends/image-w856 (1).webp',
		movie1: 'images/legends/889709f0cd903190731c3a6ddbf660ed.webp',
		movie1Title: 'Tommy Boy',
		movie2: 'images/legends/attachment-snl1.webp',
		movie2Title: 'Saturday Night Live',
		quote: '"Brothers don\'t shake hands. Brothers gotta hug."',
	},
	{
		name: 'Grace Kelly',
		years: '1929 — 1982',
		portrait: 'images/legends/Grace-Kelly.webp',
		movie1: 'images/legends/640x640-ajes-flechazos-news-viaje-vida-grace-kelly-10607506-1-esl-es-un-viaje-por-la-vida-de-grace-kelly-jpg.png',
		movie1Title: 'Rear Window',
		movie2: 'images/legends/to+catch+a+thief+grace+kelly+white+dress.webp',
		movie2Title: 'To Catch a Thief',
		quote: '"I would like to be remembered as someone who accomplished useful deeds."',
	},
	{
		name: 'Cory Monteith',
		years: '1982 — 2013',
		portrait: 'images/legends/MV5BMTUzMzI2ODMxNl5BMl5BanBnXkFtZTcwNDA2MjMyMw@@._V1_.jpg',
		movie1: 'images/legends/MV5BODljOWVhODEtYWNiNy00Njg2LThmM2MtMWQyZjIzZjJkYjEyXkEyXkFqcGc@._V1_.jpg',
		movie1Title: 'Glee',
		movie2: 'images/legends/313GLEE_Ep313-Sc31_181_16x9_992.jpg',
		movie2Title: 'Glee',
		quote: '"You just have to be yourself and go full with confidence."',
	},
	{
		name: 'Marilyn Monroe',
		years: '1926 — 1962',
		portrait: 'images/legends/7b1520a52e969ac7f064c0fe4c1c9dba.jpg',
		movie1: 'images/legends/l-intro-1661204756.jpg',
		movie1Title: 'Some Like It Hot',
		movie2: 'images/legends/10_1adbc1.webp',
		movie2Title: 'The Seven Year Itch',
		quote: '"Imperfection is beauty, madness is genius, and it\'s better to be absolutely ridiculous than absolutely boring."',
	},
	{
		name: 'Chadwick Boseman',
		years: '1976 — 2020',
		portrait: 'images/legends/chadwick-boseman-450-600.jpg',
		movie1: 'images/legends/R6KYOL42NZDLNDY6YCP3WV54XY.png',
		movie1Title: 'Black Panther',
		movie2: 'images/legends/chadwick-boseman-jackierobinson-42.jpg',
		movie2Title: '42',
		quote: '"The only difference between a hero and a villain is that the villain chooses to use that power in a way that is selfish."',
	},
	{
		name: 'Heath Ledger',
		years: '1979 — 2008',
		portrait: 'images/legends/Heath_Ledger_(2).jpg',
		movie1: 'images/legends/Heath-Ledger-Joker.jpg',
		movie1Title: 'The Dark Knight',
		movie2: 'images/legends/68dbd9425dbc4fd10da9d44c.webp',
		movie2Title: '10 Things I Hate About You',
		quote: '"I feel like I\'m wasting time if I repeat myself."',
	},
	{
		name: 'Paul Newman',
		years: '1925 — 2008',
		portrait: 'images/legends/paul-newman.webp',
		movie1: 'images/legends/butch-cassidy-and-the-sundance-kid-paul-newman-1.png',
		movie1Title: 'Butch Cassidy',
		movie2: 'images/legends/hq720.jpg',
		movie2Title: 'The Sting',
		quote: '"I\'d like to be remembered as a guy who tried to be part of his times."',
	},
	{
		name: 'Carrie Fisher',
		years: '1956 — 2016',
		portrait: 'images/legends/Carrie_Fisher_2013-a_straightened.jpg',
		movie1: 'images/legends/Carrie-Fisher-Postscript.webp',
		movie1Title: 'Star Wars',
		movie2: 'images/legends/carrie-fisher-2.jpg',
		movie2Title: 'When Harry Met Sally',
		quote: '"Stay afraid, but do it anyway."',
	},
	{
		name: 'Robin Williams',
		years: '1951 — 2014',
		portrait: 'images/legends/images.jpeg',
		movie1: 'images/legends/l-intro-1653049977.jpg',
		movie1Title: 'Good Will Hunting',
		movie2: 'images/legends/MSDMRDO_EC018.webp',
		movie2Title: 'Mrs. Doubtfire',
		quote: '"You\'re not perfect. And let me save you the suspense: this girl you met, she\'s not perfect either."',
	},
];

const FPS = 30;
const INTRO_DURATION = 4 * FPS; // 120 frames
const ACTOR_DURATION = 10 * FPS; // 300 frames
const OUTRO_DURATION = 4 * FPS; // 120 frames
const TRANSITION = 30; // 1s cross-dissolve

const BG_COLOR = '#111122';

// ─── Particles ───────────────────────────────────────────────
const Particles: React.FC = () => {
	const frame = useCurrentFrame();
	const particles = Array.from({length: 25}, (_, i) => {
		const seed = i * 137.508;
		const x = ((seed * 7.3) % 100);
		const baseY = ((seed * 3.7) % 100);
		const speed = 0.15 + (seed % 0.3);
		const y = (baseY - frame * speed + 200) % 120 - 10;
		const size = 2 + (seed % 3);
		const opacity = 0.15 + (seed % 0.25);
		const drift = Math.sin(frame * 0.02 + seed) * 15;

		return (
			<div
				key={i}
				style={{
					position: 'absolute',
					left: `calc(${x}% + ${drift}px)`,
					top: `${y}%`,
					width: size,
					height: size,
					borderRadius: '50%',
					backgroundColor: '#d4a844',
					opacity,
					boxShadow: `0 0 ${size * 2}px ${size}px rgba(212, 168, 68, ${opacity * 0.5})`,
				}}
			/>
		);
	});
	return <AbsoluteFill style={{pointerEvents: 'none'}}>{particles}</AbsoluteFill>;
};

// ─── Candle Emoji ────────────────────────────────────────────
const Candle: React.FC<{size?: number}> = ({size = 40}) => (
	<span style={{fontSize: size, lineHeight: 1}}>🕯️</span>
);

// ─── Gold Separator Line ─────────────────────────────────────
const GoldLine: React.FC<{width?: number; opacity?: number}> = ({
	width = 200,
	opacity = 0.6,
}) => (
	<div
		style={{
			width,
			height: 1,
			background: `linear-gradient(90deg, transparent, rgba(212, 168, 68, ${opacity}), transparent)`,
			margin: '12px auto',
		}}
	/>
);

// ─── Intro Card ──────────────────────────────────────────────
const IntroCard: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const candleOpacity = interpolate(frame, [0, 30], [0, 1], {extrapolateRight: 'clamp'});
	const titleOpacity = interpolate(frame, [20, 50], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const subtitleOpacity = interpolate(frame, [50, 80], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const fadeOut = interpolate(frame, [INTRO_DURATION - 30, INTRO_DURATION], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	return (
		<AbsoluteFill
			style={{
				backgroundColor: BG_COLOR,
				justifyContent: 'center',
				alignItems: 'center',
				opacity: fadeOut,
			}}
		>
			<Particles />
			<div style={{textAlign: 'center', opacity: candleOpacity}}>
				<Candle size={50} />
			</div>
			<div
				style={{
					fontFamily: "'Georgia', 'Times New Roman', serif",
					color: '#c9a84c',
					fontSize: 72,
					fontWeight: 700,
					letterSpacing: 8,
					marginTop: 20,
					opacity: titleOpacity,
					textShadow: '0 0 40px rgba(201, 168, 76, 0.3)',
				}}
			>
				HALL OF LEGENDS
			</div>
			<GoldLine width={300} opacity={subtitleOpacity * 0.6} />
			<div
				style={{
					fontFamily: "'Georgia', serif",
					color: '#8a8aaa',
					fontSize: 24,
					fontStyle: 'italic',
					letterSpacing: 3,
					opacity: subtitleOpacity,
				}}
			>
				Gone but never forgotten
			</div>
		</AbsoluteFill>
	);
};

// ─── Movie Title Badge ───────────────────────────────────────
const MovieBadge: React.FC<{title: string; opacity: number}> = ({title, opacity}) => (
	<div
		style={{
			position: 'absolute',
			top: 40,
			left: '50%',
			transform: 'translateX(-50%)',
			opacity,
		}}
	>
		<div
			style={{
				fontFamily: "'Georgia', serif",
				color: '#c9a84c',
				fontSize: 28,
				letterSpacing: 3,
				padding: '12px 36px',
				border: '1px solid rgba(201, 168, 76, 0.4)',
				backgroundColor: 'rgba(0, 0, 0, 0.5)',
			}}
		>
			{title}
		</div>
	</div>
);

// ─── Portrait Frame ──────────────────────────────────────────
const PortraitFrame: React.FC<{src: string; scale: number; opacity: number}> = ({
	src,
	scale,
	opacity,
}) => (
	<div
		style={{
			width: 420,
			height: 500,
			border: '3px solid #c9a84c',
			boxShadow: '0 0 40px rgba(201, 168, 76, 0.4), 0 0 80px rgba(201, 168, 76, 0.15), inset 0 0 20px rgba(0,0,0,0.3)',
			overflow: 'hidden',
			transform: `scale(${scale})`,
			opacity,
		}}
	>
		<Img
			src={staticFile(src)}
			style={{
				width: '100%',
				height: '100%',
				objectFit: 'cover',
			}}
		/>
	</div>
);

// ─── Actor Segment ───────────────────────────────────────────
const ActorSegment: React.FC<{actor: ActorData; index: number}> = ({
	actor,
	index,
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	// Background movie scene transitions
	const bgPhase1End = 150;
	const bg1Opacity = interpolate(frame, [0, 20, bgPhase1End - 20, bgPhase1End], [0, 1, 1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const bg2Opacity = interpolate(frame, [bgPhase1End - 20, bgPhase1End, ACTOR_DURATION - 30, ACTOR_DURATION], [0, 1, 1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	// Movie title
	const movieTitle = frame < bgPhase1End ? actor.movie1Title : actor.movie2Title;
	const badgeOpacity = interpolate(
		frame,
		[30, 50, bgPhase1End - 30, bgPhase1End - 10, bgPhase1End + 20, bgPhase1End + 40, ACTOR_DURATION - 40, ACTOR_DURATION - 20],
		[0, 1, 1, 0, 0, 1, 1, 0],
		{extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
	);

	// Portrait entrance
	const portraitScale = spring({fps, frame: frame - 40, config: {damping: 80, stiffness: 100}});
	const portraitOpacity = interpolate(frame, [40, 60, ACTOR_DURATION - 20, ACTOR_DURATION], [0, 1, 1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	// Name & info
	const nameOpacity = interpolate(frame, [60, 85, ACTOR_DURATION - 20, ACTOR_DURATION], [0, 1, 1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const nameY = interpolate(frame, [60, 85], [30, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	// Quote
	const quoteOpacity = interpolate(frame, [90, 115, ACTOR_DURATION - 20, ACTOR_DURATION], [0, 1, 1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	// Segment fade
	const segFadeIn = index === 0 ? 1 : interpolate(frame, [0, TRANSITION], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const segFadeOut = index === ACTORS.length - 1 ? 1 : interpolate(frame, [ACTOR_DURATION - TRANSITION, ACTOR_DURATION], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	// Ken Burns on background
	const bgScale1 = interpolate(frame, [0, bgPhase1End], [1.0, 1.08], {extrapolateRight: 'clamp'});
	const bgScale2 = interpolate(frame, [bgPhase1End, ACTOR_DURATION], [1.0, 1.08], {extrapolateRight: 'clamp'});

	return (
		<AbsoluteFill style={{opacity: Math.min(segFadeIn, segFadeOut)}}>
			{/* Background movie 1 */}
			<AbsoluteFill style={{opacity: bg1Opacity}}>
				<Img
					src={staticFile(actor.movie1)}
					style={{
						width: '100%',
						height: '100%',
						objectFit: 'cover',
						transform: `scale(${bgScale1})`,
						filter: 'brightness(0.45) blur(2px)',
					}}
				/>
			</AbsoluteFill>

			{/* Background movie 2 */}
			<AbsoluteFill style={{opacity: bg2Opacity}}>
				<Img
					src={staticFile(actor.movie2)}
					style={{
						width: '100%',
						height: '100%',
						objectFit: 'cover',
						transform: `scale(${bgScale2})`,
						filter: 'brightness(0.45) blur(2px)',
					}}
				/>
			</AbsoluteFill>

			{/* Dark overlay */}
			<AbsoluteFill style={{backgroundColor: 'rgba(17, 17, 34, 0.25)'}} />

			{/* Vignette */}
			<AbsoluteFill
				style={{
					background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.7) 100%)',
				}}
			/>

			<Particles />

			{/* Movie title badge */}
			<MovieBadge title={movieTitle} opacity={badgeOpacity} />

			{/* Center content */}
			<AbsoluteFill
				style={{
					justifyContent: 'center',
					alignItems: 'center',
					flexDirection: 'column',
				}}
			>
				{/* Portrait */}
				<PortraitFrame
					src={actor.portrait}
					scale={portraitScale}
					opacity={portraitOpacity}
				/>

				{/* Name */}
				<div
					style={{
						marginTop: 30,
						opacity: nameOpacity,
						transform: `translateY(${nameY}px)`,
						textAlign: 'center',
					}}
				>
					<div
						style={{
							fontFamily: "'Georgia', serif",
							color: '#d4c487',
							fontSize: 62,
							fontWeight: 400,
							letterSpacing: 6,
							textShadow: '0 2px 20px rgba(0,0,0,0.8)',
						}}
					>
						{actor.name.toUpperCase()}
					</div>

					<GoldLine width={250} />

					<div
						style={{
							fontFamily: "'Georgia', serif",
							color: '#8a8aaa',
							fontSize: 28,
							letterSpacing: 8,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							gap: 15,
						}}
					>
						<Candle size={28} />
						{actor.years}
						<Candle size={28} />
					</div>
				</div>

				{/* Quote */}
				<div
					style={{
						marginTop: 25,
						opacity: quoteOpacity,
						fontFamily: "'Georgia', serif",
						color: '#9a9ab0',
						fontSize: 26,
						fontStyle: 'italic',
						textAlign: 'center',
						maxWidth: 900,
						lineHeight: 1.5,
						padding: '0 40px',
					}}
				>
					{actor.quote}
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

// ─── Outro Card ──────────────────────────────────────────────
const OutroCard: React.FC = () => {
	const frame = useCurrentFrame();

	const fadeIn = interpolate(frame, [0, 40], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const titleOpacity = interpolate(frame, [20, 50], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	return (
		<AbsoluteFill
			style={{
				backgroundColor: BG_COLOR,
				justifyContent: 'center',
				alignItems: 'center',
				opacity: fadeIn,
			}}
		>
			<Particles />
			<Candle size={50} />
			<div
				style={{
					fontFamily: "'Georgia', serif",
					color: '#c9a84c',
					fontSize: 56,
					fontWeight: 700,
					letterSpacing: 6,
					textAlign: 'center',
					marginTop: 20,
					opacity: titleOpacity,
					textShadow: '0 0 40px rgba(201, 168, 76, 0.3)',
					lineHeight: 1.3,
				}}
			>
				FOREVER
				<br />
				IN OUR HEARTS
			</div>
			<GoldLine width={300} opacity={titleOpacity * 0.6} />
			<div
				style={{
					fontFamily: "'Georgia', serif",
					color: '#8a8aaa',
					fontSize: 22,
					fontStyle: 'italic',
					opacity: titleOpacity,
					marginTop: 5,
				}}
			>
				Like & Subscribe 🕊️
			</div>
		</AbsoluteFill>
	);
};

// ─── Main Composition ────────────────────────────────────────
export const CinematicTribute: React.FC = () => {
	const actorStart = INTRO_DURATION;

	return (
		<AbsoluteFill style={{backgroundColor: BG_COLOR}}>
			{/* Intro */}
			<Sequence from={0} durationInFrames={INTRO_DURATION}>
				<IntroCard />
			</Sequence>

			{/* Actors */}
			{ACTORS.map((actor, index) => {
				const startFrame = actorStart + index * (ACTOR_DURATION - TRANSITION);
				return (
					<Sequence
						key={actor.name}
						from={startFrame}
						durationInFrames={ACTOR_DURATION}
					>
						<ActorSegment actor={actor} index={index} />
					</Sequence>
				);
			})}

			{/* Outro */}
			<Sequence
				from={actorStart + (ACTORS.length - 1) * (ACTOR_DURATION - TRANSITION) + ACTOR_DURATION - TRANSITION}
				durationInFrames={OUTRO_DURATION}
			>
				<OutroCard />
			</Sequence>
		</AbsoluteFill>
	);
};
