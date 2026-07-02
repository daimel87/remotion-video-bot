import React from 'react';
import {AbsoluteFill, Img, Sequence, useCurrentFrame, interpolate} from 'remotion';

const ACTORS = [
	{name: 'Emilia Clarke', born: 1986, character: 'Daenerys Targaryen', then: 'images/then-now/71B0YQ0w+9L._AC_UF894,1000_QL80_.jpg', now: 'images/then-now/emilia clarke.jpg'},
	{name: 'Kit Harington', born: 1986, character: 'Jon Snow', then: 'images/then-now/108731348.jpg', now: 'images/then-now/images.jpg'},
	{name: 'Sophie Turner', born: 1996, character: 'Sansa Stark', then: 'images/then-now/Sophie_Turner_2009_(cropped).jpg', now: 'images/then-now/images (1).jpg'},
	{name: 'Maisie Williams', born: 1997, character: 'Arya Stark', then: 'images/then-now/150626141447-maisie-williams.jpg', now: 'images/then-now/Maisie_Williams_by_Gage_Skidmore_3.jpg'},
	{name: 'Isaac Hempstead Wright', born: 1999, character: 'Bran Stark', then: 'images/then-now/isaac-hempstead-wright-87671-c.jpg', now: 'images/then-now/451320_1.7.webp'},
	{name: 'Lena Headey', born: 1973, character: 'Cersei Lannister', then: 'images/then-now/2cc100084253ebcbca1085a5c26bd7aa.jpg', now: 'images/then-now/Lena_Headey_(47086135862)_(cropped).jpg'},
	{name: 'Peter Dinklage', born: 1969, character: 'Tyrion Lannister', then: 'images/then-now/Peter_Dinklage.webp', now: 'images/then-now/9CAd7wr8QZyIN0E7nm8v1B6WkGn.webp'},
	{name: 'Nikolaj Coster-Waldau', born: 1975, character: 'Jaime Lannister', then: 'images/then-now/49d2cfcb5ce315d32d5015756f7ec1cd.jpg', now: 'images/then-now/Nikolaj_Coster-Waldau_2012_(cropped).jpg'},
	{name: 'Jason Momoa', born: 1979, character: 'Khal Drogo', then: 'images/then-now/khal-1571179282.png', now: 'images/then-now/Jason_Momoa_(43055621224)_(cropped).jpg'},
	{name: 'Sean Bean', born: 1959, character: 'Ned Stark', then: 'images/then-now/wishing-sean-bean-the-one-and-only-boromir-a-happy-67th-v0-l5doebl9irvg1.webp', now: 'images/then-now/Sean_Bean_TIFF_2015.jpg'},
	{name: 'Richard Madden', born: 1986, character: 'Robb Stark', then: 'images/then-now/richard-madden-40-jahre-alt-zukunft-erfolg-serien-.jpg', now: 'images/then-now/richard-madden-40-jahre-alt-zukunft-erfolg-serien-.jpg'},
	{name: 'Gwendoline Christie', born: 1981, character: 'Brienne of Tarth', then: 'images/then-now/MV5BMjA1NDY3ODIyM15BMl5BanBnXkFtZTgwODQ5MjYzNzM@._V1_.jpg', now: 'images/then-now/Gwendoline_Christie.webp'},
	{name: 'Natalie Dormer', born: 1982, character: 'Margaery Tyrell', then: 'images/then-now/1.jpg', now: 'images/then-now/Natalie_Dormer.webp'},
	{name: 'Carice van Houten', born: 1977, character: 'Melisandre', then: 'images/then-now/30got-vanhouten-2-superJumbo.jpg', now: 'images/then-now/Carice_van_Houten.webp'},
	{name: 'Alfie Allen', born: 1986, character: 'Theon Greyjoy', then: 'images/then-now/was-alfie-allen-the-best-actor-of-the-stark-children-v0-xv8pm3j93xaf1.webp', now: 'images/then-now/Alfie_Allen.webp'},
	{name: 'Iain Glen', born: 1961, character: 'Jorah Mormont', then: 'images/then-now/is-it-just-me-or-does-iain-glen-look-strikingly-similar-to-v0-bapp5okkyorc1.jpg', now: 'images/then-now/Iain_Glen.jpg'},
	{name: 'Rose Leslie', born: 1987, character: 'Ygritte', then: 'images/then-now/Ygritte-promotionals4pic.webp', now: 'images/then-now/images (2).jpg'},
	{name: 'Rory McCann', born: 1969, character: 'The Hound', then: 'images/then-now/Rory_McCann_in_2014_by_Gage_Skidmore.jpg', now: 'images/then-now/square.jpg'},
	{name: 'Nathalie Emmanuel', born: 1989, character: 'Missandei', then: 'images/then-now/a73c9ec9727a3c1ee620d453163e0e21.jpg', now: 'images/then-now/koSwmmonFJiZDfwmZgdVA7I1aR.webp'},
	{name: 'John Bradley', born: 1988, character: 'Samwell Tarly', then: 'images/then-now/Samwell_Tarly-John_Bradley.jpg', now: 'images/then-now/John_Bradley_by_Gage_Skidmore_2.jpg'},
	{name: 'Aidan Gillen', born: 1968, character: 'Petyr Baelish', then: 'images/then-now/Aidan_Gillen_playing_Petyr_Baelish.jpg', now: 'images/then-now/110977221517510-nm_200.jpg'},
	{name: 'Joe Dempsie', born: 1987, character: 'Gendry', then: 'images/then-now/MV5BZDUwMWE0NjMtMDg5MS00Y2IwLWJmMDgtZDhiYjQ4MDE5MjQxXkEyXkFqcGc@._V1_.jpg', now: 'images/then-now/Joe_Dempsie.webp'},
	{name: 'Kristofer Hivju', born: 1978, character: 'Tormund', then: 'images/then-now/1503503945-syn-elm-1503486795-kristofer-hivju-as-tormund-got-1.png', now: 'images/then-now/images (5).jpg'},
	{name: 'Charles Dance', born: 1946, character: 'Tywin Lannister', then: 'images/then-now/game-thrones-charles-dance-tywin-1558698033.png', now: 'images/then-now/images (6).jpg'},
	{name: 'Hafþór Júlíus Björnsson', born: 1988, character: 'The Mountain', then: 'images/then-now/images (9).jpg', now: 'images/then-now/QM6VT4LGWFD2BKVFKVBKDKAIWM.jpg'},
];

const FPS = 30;
const ACTOR_DURATION = 300; // 10 seconds per actor
const TRANSITION = 20;

function ActorPair({then, now, name, character}: any) {
	const frame = useCurrentFrame();
	const opacity = interpolate(
		frame,
		[0, 10, ACTOR_DURATION - 10, ACTOR_DURATION],
		[0, 1, 1, 0],
		{extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
	);

	return (
		<AbsoluteFill style={{opacity}}>
			{/* Left THEN */}
			<div style={{width: '50%', height: '100%', position: 'relative', overflow: 'hidden'}}>
				<Img
					src={then}
					style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 15%'}}
				/>
				<div style={{position: 'absolute', inset: 0, background: 'linear-gradient(to right, transparent 50%, rgba(0,0,0,0.4) 100%)'}} />
				<div style={{position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', height: 120, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 20}}>
					<div style={{fontFamily: 'Arial, sans-serif', color: '#fff', fontSize: 32, fontWeight: 'bold', textAlign: 'center'}}>
						<div>2011</div>
						<div style={{fontSize: 20, marginTop: 4, opacity: 0.9}}>S1-S8</div>
					</div>
				</div>
			</div>

			{/* Right NOW */}
			<div style={{width: '50%', height: '100%', position: 'relative', overflow: 'hidden'}}>
				<Img
					src={now}
					style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 15%'}}
				/>
				<div style={{position: 'absolute', inset: 0, background: 'linear-gradient(to left, transparent 50%, rgba(0,0,0,0.4) 100%)'}} />
				<div style={{position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', height: 120, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 20}}>
					<div style={{fontFamily: 'Arial, sans-serif', color: '#fff', fontSize: 32, fontWeight: 'bold', textAlign: 'center'}}>
						<div>2026</div>
						<div style={{fontSize: 20, marginTop: 4, opacity: 0.9}}>Today</div>
					</div>
				</div>
			</div>

			{/* Center divider + name */}
			<div style={{position: 'absolute', left: '50%', top: 0, bottom: 0, width: 2, backgroundColor: '#ffd700'}} />
			<div style={{position: 'absolute', top: 20, left: '50%', transform: 'translateX(-50%)', backgroundColor: 'rgba(0,0,0,0.7)', padding: '10px 20px', borderRadius: 8, textAlign: 'center', maxWidth: '80%'}}>
				<div style={{fontFamily: 'Arial Black, sans-serif', color: '#fff', fontSize: 40, fontWeight: 900}}>{name}</div>
				<div style={{fontFamily: 'Arial, sans-serif', color: '#ffd700', fontSize: 18, marginTop: 4}}>{character}</div>
			</div>
		</AbsoluteFill>
	);
}

export const GameOfThronesNowThen: React.FC = () => {
	return (
		<AbsoluteFill style={{backgroundColor: '#0a0a0a'}}>
			{ACTORS.map((actor, i) => (
				<Sequence key={i} from={i * ACTOR_DURATION} durationInFrames={ACTOR_DURATION}>
					<ActorPair then={actor.then} now={actor.now} name={actor.name} character={actor.character} />
				</Sequence>
			))}
		</AbsoluteFill>
	);
};
