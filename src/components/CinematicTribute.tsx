import React from 'react';
import {
	AbsoluteFill,
	Img,
	interpolate,
	useCurrentFrame,
	useVideoConfig,
	Sequence,
	staticFile,
} from 'remotion';

interface ActorData {
	name: string;
	years: string;
	portrait: string;
	movie1: string;
	movie2: string;
}

const ACTORS: ActorData[] = [
	{
		name: 'Paul Walker',
		years: '1973 – 2013',
		portrait: 'images/legends/131202152330_paul3_304x304_getty.jpg.webp',
		movie1: 'images/legends/REXUSA_1001806a_fast_and_the_furious_jt_131201_16x9_992.jpg',
		movie2: 'images/legends/x1080.jpg',
	},
	{
		name: 'Luke Perry',
		years: '1966 – 2019',
		portrait: 'images/legends/luke-perry-milestones.webp',
		movie1: 'images/legends/beverly_hills_90210_perry_1_copy.webp',
		movie2: 'images/legends/luke-perry-molly-ringwald-2000-190c9e72813e4fdba8560ecd23c39f3e.jpg',
	},
	{
		name: 'Alan Rickman',
		years: '1946 – 2016',
		portrait: 'images/legends/Alan_Rickman.webp',
		movie1: 'images/legends/KB542PRCYZBKTL3357N4S2FWOQ.webp',
		movie2: 'images/legends/die-hard-alan-rickman.png',
	},
	{
		name: 'Anton Yelchin',
		years: '1989 – 2016',
		portrait: 'images/legends/Anton_Yelchin.webp',
		movie1: 'images/legends/hero-image.fill.size_1248x702.v1611610881.webp',
		movie2: 'images/legends/Green-Room-1400x771.jpg',
	},
	{
		name: 'James Dean',
		years: '1931 – 1955',
		portrait: 'images/legends/featured-famous-bi-james-dean-1.jpg',
		movie1: 'images/legends/MQZSZA4DYREC5L25O5NX2HOULQ.jpg',
		movie2: 'images/legends/x1080 (1).jpg',
	},
	{
		name: 'Brittany Murphy',
		years: '1977 – 2009',
		portrait: 'images/legends/brittany-murphy-2008_104.webp',
		movie1: 'images/legends/maxresdefault.jpg',
		movie2: 'images/legends/8-Mile-Brittany-Murphy-Eminem-e1611154142478.jpg',
	},
	{
		name: 'Patrick Swayze',
		years: '1952 – 2009',
		portrait: 'images/legends/image-w856.webp',
		movie1: 'images/legends/663774dc11a3b05fb1f6799343ffe18c5cbfd84cdca665226067d2cf830b9997._SX1080_FMjpg_.jpg',
		movie2: 'images/legends/demi-moore-y-patrick-swayze-sufrieron-mucho-al-5UMAHYKJGJAMDJ3IJPUIBJWZ2Q.png',
	},
	{
		name: 'River Phoenix',
		years: '1970 – 1993',
		portrait: 'images/legends/MV5BM2E0MGI0MmItMWRlMy00OTAxLWJkM2QtMDRmMmZhZThhOGVmXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
		movie1: 'images/legends/River Phoenix Stand By Me.png',
		movie2: 'images/legends/AAAABbUDfDzLZnXlI1XXO1N71TOqRhg8Stcne9FOzs9EoorvsBOM4mqwezjIM2gjFNFSYtjyc-y3L7FSwkS12i1n3GlwZ9SWBU8nrCyH.jpg',
	},
	{
		name: 'Bernie Mac',
		years: '1957 – 2008',
		portrait: 'images/legends/bernie-mac.webp',
		movie1: 'images/legends/MV5BNWNlZjQyYmQtODMyMS00M2IyLWE3OWMtM2M5ZThjNmM5NDIwXkEyXkFqcGc@._V1_.jpg',
		movie2: 'images/legends/image-w1280.webp',
	},
	{
		name: 'Naya Rivera',
		years: '1987 – 2020',
		portrait: 'images/legends/MV5BOTk0MzMzODQ2OV5BMl5BanBnXkFtZTcwMTAyMzY3Mg@@._V1_FMjpg_UX1000_.jpg',
		movie1: 'images/legends/2026542.jpg',
		movie2: 'images/legends/maxresdefault (1).jpg',
	},
	{
		name: 'Philip Seymour Hoffman',
		years: '1967 – 2014',
		portrait: 'images/legends/image.jpg',
		movie1: 'images/legends/rs-18506-capote-1800-1391373806.webp',
		movie2: 'images/legends/rs-150259-20120910-master-624x420-1347307563.webp',
	},
	{
		name: 'Brandon Lee',
		years: '1965 – 1993',
		portrait: 'images/legends/gettyimages-50743046.png',
		movie1: 'images/legends/movie-the-crow-brandon-lee-crow-wallpaper-a9e0e83d617acd6b76c748af800116cd.webp',
		movie2: 'images/legends/rapid-fire-blu-ray.jpg',
	},
	{
		name: 'Audrey Hepburn',
		years: '1929 – 1993',
		portrait: 'images/legends/MV5BMWUzODRjYzItY2ZlOC00NDgxLThhM2EtZGRjZDcyZDljOWUxXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
		movie1: 'images/legends/audrey_hepburn-hubert_de_givenchy-muertes_291483840_69602984_1706x960.webp',
		movie2: 'images/legends/Photo_Audrey_Hepburn_in_a_scene_from_Roman_Holiday,_a_1953_film_directed_by_William_Wyler_1953_-_Touring_Club_Italiano_04_0815.jpg',
	},
	{
		name: 'Cameron Boyce',
		years: '1999 – 2019',
		portrait: 'images/legends/517639_v9_bc.jpg',
		movie1: 'images/legends/Cameron-Boyce-Descendants-3-071124-3a4d5d1f87b842f084bf48c81b22ce0e.jpg',
		movie2: 'images/legends/maxresdefault (2).jpg',
	},
	{
		name: 'John Candy',
		years: '1950 – 1994',
		portrait: 'images/legends/uvLWbMDE6UfWNF5tfrsrC9NqeEA.webp',
		movie1: 'images/legends/john-candy-planes-trains-and-automobiles.png',
		movie2: 'images/legends/john-candy-in-the-final-scene-from-uncle-buck-1989-he-v0-fit9vv0ftbmc1.webp',
	},
	{
		name: 'Natasha Richardson',
		years: '1963 – 2009',
		portrait: 'images/legends/275316592962842-nm_200.jpg',
		movie1: 'images/legends/dennis-quaid-natasha-richardson-parent-trap-041524-a5f5bbcba9424305a5cb65a3ffb73103.jpg',
		movie2: 'images/legends/171318_800x321.jpg',
	},
	{
		name: 'Chris Farley',
		years: '1964 – 1997',
		portrait: 'images/legends/image-w856 (1).webp',
		movie1: 'images/legends/889709f0cd903190731c3a6ddbf660ed.webp',
		movie2: 'images/legends/attachment-snl1.webp',
	},
	{
		name: 'Grace Kelly',
		years: '1929 – 1982',
		portrait: 'images/legends/Grace-Kelly.webp',
		movie1: 'images/legends/640x640-ajes-flechazos-news-viaje-vida-grace-kelly-10607506-1-esl-es-un-viaje-por-la-vida-de-grace-kelly-jpg.png',
		movie2: 'images/legends/to+catch+a+thief+grace+kelly+white+dress.webp',
	},
	{
		name: 'Cory Monteith',
		years: '1982 – 2013',
		portrait: 'images/legends/MV5BMTUzMzI2ODMxNl5BMl5BanBnXkFtZTcwNDA2MjMyMw@@._V1_.jpg',
		movie1: 'images/legends/MV5BODljOWVhODEtYWNiNy00Njg2LThmM2MtMWQyZjIzZjJkYjEyXkEyXkFqcGc@._V1_.jpg',
		movie2: 'images/legends/313GLEE_Ep313-Sc31_181_16x9_992.jpg',
	},
	{
		name: 'Marilyn Monroe',
		years: '1926 – 1962',
		portrait: 'images/legends/7b1520a52e969ac7f064c0fe4c1c9dba.jpg',
		movie1: 'images/legends/l-intro-1661204756.jpg',
		movie2: 'images/legends/10_1adbc1.webp',
	},
	{
		name: 'Chadwick Boseman',
		years: '1976 – 2020',
		portrait: 'images/legends/chadwick-boseman-450-600.jpg',
		movie1: 'images/legends/R6KYOL42NZDLNDY6YCP3WV54XY.png',
		movie2: 'images/legends/chadwick-boseman-450-600.jpg',
	},
	{
		name: 'Heath Ledger',
		years: '1979 – 2008',
		portrait: 'images/legends/Heath_Ledger_(2).jpg',
		movie1: 'images/legends/Heath-Ledger-Joker.jpg',
		movie2: 'images/legends/68dbd9425dbc4fd10da9d44c.webp',
	},
	{
		name: 'Paul Newman',
		years: '1925 – 2008',
		portrait: 'images/legends/paul-newman.webp',
		movie1: 'images/legends/butch-cassidy-and-the-sundance-kid-paul-newman-1.png',
		movie2: 'images/legends/hq720.jpg',
	},
	{
		name: 'Carrie Fisher',
		years: '1956 – 2016',
		portrait: 'images/legends/Carrie_Fisher_2013-a_straightened.jpg',
		movie1: 'images/legends/Carrie-Fisher-Postscript.webp',
		movie2: 'images/legends/carrie-fisher-2.jpg',
	},
	{
		name: 'Robin Williams',
		years: '1951 – 2014',
		portrait: 'images/legends/images.jpeg',
		movie1: 'images/legends/l-intro-1653049977.jpg',
		movie2: 'images/legends/MSDMRDO_EC018.webp',
	},
];

const FPS = 30;
const ACTOR_DURATION = 10 * FPS; // 300 frames = 10 seconds
const TRANSITION = 30; // 1 second cross-dissolve between actors
const IMG_DURATION = Math.floor(ACTOR_DURATION / 3);

const KenBurnsImage: React.FC<{
	src: string;
	durationInFrames: number;
	startFrame: number;
	direction: number;
}> = ({src, durationInFrames, startFrame, direction}) => {
	const frame = useCurrentFrame();
	const localFrame = frame - startFrame;
	const progress = Math.max(0, Math.min(1, localFrame / durationInFrames));

	const scale = interpolate(progress, [0, 1], [1.0, 1.12]);
	const translateX = direction % 2 === 0
		? interpolate(progress, [0, 1], [0, -2])
		: interpolate(progress, [0, 1], [0, 2]);
	const translateY = direction % 3 === 0
		? interpolate(progress, [0, 1], [0, -1.5])
		: interpolate(progress, [0, 1], [0, 1.5]);

	return (
		<Img
			src={staticFile(src)}
			style={{
				width: '100%',
				height: '100%',
				objectFit: 'cover',
				transform: `scale(${scale}) translate(${translateX}%, ${translateY}%)`,
			}}
		/>
	);
};

const ActorSegment: React.FC<{
	actor: ActorData;
	index: number;
}> = ({actor, index}) => {
	const frame = useCurrentFrame();
	const images = [actor.portrait, actor.movie1, actor.movie2];
	const crossFade = 20;

	const fadeIn = interpolate(frame, [0, TRANSITION], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const fadeOut = interpolate(
		frame,
		[ACTOR_DURATION - TRANSITION, ACTOR_DURATION],
		[1, 0],
		{extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
	);
	const segmentOpacity = index === 0 ? fadeOut : index === ACTORS.length - 1 ? fadeIn : Math.min(fadeIn, fadeOut);

	const nameOpacity = interpolate(frame, [20, 50, ACTOR_DURATION - 40, ACTOR_DURATION - 10], [0, 1, 1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	const nameTranslateY = interpolate(frame, [20, 50], [20, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill style={{opacity: segmentOpacity}}>
			{images.map((img, imgIdx) => {
				const imgStart = imgIdx * IMG_DURATION;
				const imgEnd = imgStart + IMG_DURATION + crossFade;

				const imgOpacity =
					imgIdx === 0
						? interpolate(frame, [imgEnd - crossFade, imgEnd], [1, 0], {
								extrapolateLeft: 'clamp',
								extrapolateRight: 'clamp',
							})
						: imgIdx === images.length - 1
							? interpolate(frame, [imgStart, imgStart + crossFade], [0, 1], {
									extrapolateLeft: 'clamp',
									extrapolateRight: 'clamp',
								})
							: interpolate(
									frame,
									[imgStart, imgStart + crossFade, imgEnd - crossFade, imgEnd],
									[0, 1, 1, 0],
									{extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
								);

				return (
					<AbsoluteFill key={imgIdx} style={{opacity: imgOpacity}}>
						<KenBurnsImage
							src={img}
							durationInFrames={IMG_DURATION + crossFade}
							startFrame={imgStart}
							direction={index * 3 + imgIdx}
						/>
					</AbsoluteFill>
				);
			})}

			{/* Cinematic vignette */}
			<AbsoluteFill
				style={{
					background:
						'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)',
				}}
			/>

			{/* Desaturated overlay */}
			<AbsoluteFill style={{backgroundColor: 'rgba(20, 18, 25, 0.15)', mixBlendMode: 'color'}} />

			{/* Bottom gradient for text */}
			<AbsoluteFill
				style={{
					background: 'linear-gradient(transparent 60%, rgba(0,0,0,0.7) 100%)',
				}}
			/>

			{/* Name and years */}
			<AbsoluteFill
				style={{
					justifyContent: 'flex-end',
					alignItems: 'center',
					paddingBottom: 60,
					opacity: nameOpacity,
					transform: `translateY(${nameTranslateY}px)`,
				}}
			>
				<div
					style={{
						fontFamily: "'Georgia', 'Times New Roman', serif",
						color: 'white',
						textAlign: 'center',
						textShadow: '0 2px 20px rgba(0,0,0,0.8)',
					}}
				>
					<div style={{fontSize: 56, fontWeight: 400, letterSpacing: 3}}>
						{actor.name}
					</div>
					<div
						style={{
							fontSize: 26,
							fontWeight: 300,
							letterSpacing: 6,
							marginTop: 10,
							opacity: 0.8,
						}}
					>
						{actor.years}
					</div>
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

export const CinematicTribute: React.FC = () => {
	const {fps} = useVideoConfig();

	return (
		<AbsoluteFill style={{backgroundColor: 'black'}}>
			{ACTORS.map((actor, index) => {
				const startFrame = index * (ACTOR_DURATION - TRANSITION);
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

			{/* Final fade to black */}
			<Sequence from={(ACTORS.length - 1) * (ACTOR_DURATION - TRANSITION) + ACTOR_DURATION - 60} durationInFrames={90}>
				<FinalCard />
			</Sequence>
		</AbsoluteFill>
	);
};

const FinalCard: React.FC = () => {
	const frame = useCurrentFrame();
	const opacity = interpolate(frame, [0, 30, 60, 90], [0, 1, 1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill
			style={{
				backgroundColor: 'black',
				justifyContent: 'center',
				alignItems: 'center',
				opacity,
			}}
		>
			<div
				style={{
					fontFamily: "'Georgia', 'Times New Roman', serif",
					color: 'white',
					fontSize: 36,
					letterSpacing: 8,
					textAlign: 'center',
					opacity: 0.9,
				}}
			>
				GONE TOO SOON
			</div>
		</AbsoluteFill>
	);
};
