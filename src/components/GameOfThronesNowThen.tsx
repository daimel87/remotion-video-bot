import React from 'react';
import {AbsoluteFill, Img, Sequence, useCurrentFrame, interpolate} from 'remotion';

const ACTORS = [
	{name: 'Emilia Clarke', born: 1986, then: 'images/then-now/actor-01-then.jpg', now: 'images/then-now/actor-01-now.jpg'},
	{name: 'Kit Harington', born: 1986, then: 'images/then-now/actor-02-then.jpg', now: 'images/then-now/actor-02-now.jpg'},
	{name: 'Sophie Turner', born: 1996, then: 'images/then-now/actor-03-then.jpg', now: 'images/then-now/actor-03-now.jpg'},
	{name: 'Isaac Hempstead Wright', born: 1999, then: 'images/then-now/actor-04-then.jpg', now: 'images/then-now/actor-04-now.jpg'},
	{name: 'Lena Headey', born: 1973, then: 'images/then-now/actor-05-then.jpg', now: 'images/then-now/actor-05-now.jpg'},
	{name: 'Peter Dinklage', born: 1969, then: 'images/then-now/actor-06-then.jpg', now: 'images/then-now/actor-06-now.jpg'},
	{name: 'Nikolaj Coster-Waldau', born: 1975, then: 'images/then-now/actor-07-then.jpg', now: 'images/then-now/actor-07-now.jpg'},
	{name: 'Jason Momoa', born: 1979, then: 'images/then-now/actor-08-then.jpg', now: 'images/then-now/actor-08-now.jpg'},
	{name: 'Sean Bean', born: 1959, then: 'images/then-now/actor-09-then.jpg', now: 'images/then-now/actor-09-now.jpg'},
	{name: 'Richard Madden', born: 1986, then: 'images/then-now/actor-10-then.jpg', now: 'images/then-now/actor-10-now.jpg'},
	{name: 'Gwendoline Christie', born: 1981, then: 'images/then-now/actor-11-then.jpg', now: 'images/then-now/actor-11-now.jpg'},
	{name: 'Natalie Dormer', born: 1982, then: 'images/then-now/actor-12-then.jpg', now: 'images/then-now/actor-12-now.jpg'},
	{name: 'Carice van Houten', born: 1977, then: 'images/then-now/actor-13-then.jpg', now: 'images/then-now/actor-13-now.jpg'},
	{name: 'Alfie Allen', born: 1986, then: 'images/then-now/actor-14-then.jpg', now: 'images/then-now/actor-14-now.jpg'},
	{name: 'Iain Glen', born: 1961, then: 'images/then-now/actor-15-then.jpg', now: 'images/then-now/actor-15-now.jpg'},
	{name: 'Rose Leslie', born: 1987, then: 'images/then-now/actor-16-then.jpg', now: 'images/then-now/actor-16-now.jpg'},
	{name: 'Rory McCann', born: 1969, then: 'images/then-now/actor-17-then.jpg', now: 'images/then-now/actor-17-now.jpg'},
	{name: 'Nathalie Emmanuel', born: 1989, then: 'images/then-now/actor-18-then.jpg', now: 'images/then-now/actor-18-now.jpg'},
	{name: 'John Bradley', born: 1988, then: 'images/then-now/actor-19-then.jpg', now: 'images/then-now/actor-19-now.jpg'},
	{name: 'Aidan Gillen', born: 1968, then: 'images/then-now/actor-20-then.jpg', now: 'images/then-now/actor-20-now.jpg'},
	{name: 'Joe Dempsie', born: 1987, then: 'images/then-now/actor-21-then.jpg', now: 'images/then-now/actor-21-now.jpg'},
	{name: 'Kristofer Hivju', born: 1978, then: 'images/then-now/actor-22-then.jpg', now: 'images/then-now/actor-22-now.jpg'},
	{name: 'Charles Dance', born: 1946, then: 'images/then-now/actor-23-then.jpg', now: 'images/then-now/actor-23-now.jpg'},
	{name: 'Michelle Fairley', born: 1957, then: 'images/then-now/actor-24-then.jpg', now: 'images/then-now/actor-24-now.jpg'},
	{name: 'Jacob Anderson', born: 1990, then: 'images/then-now/actor-25-then.jpg', now: 'images/then-now/actor-25-now.jpg'},
	{name: 'Hafþór Júlíus Björnsson', born: 1988, then: 'images/then-now/actor-26-then.jpg', now: 'images/then-now/actor-26-now.jpg'},
	{name: 'Jack Gleeson', born: 1992, then: 'images/then-now/actor-27-then.jpg', now: 'images/then-now/actor-27-now.jpg'},
	{name: 'Conleth Hill', born: 1964, then: 'images/then-now/actor-28-then.jpg', now: 'images/then-now/actor-28-now.jpg'},
	{name: 'Jerome Flynn', born: 1968, then: 'images/then-now/actor-29-then.jpg', now: 'images/then-now/actor-29-now.jpg'},
	{name: 'Maisie Williams', born: 1997, then: 'images/then-now/actor-30-then.jpg', now: 'images/then-now/actor-30-now.jpg'},
];

const FPS = 30;
const ACTOR_DURATION = 300; // 10 seconds per actor
const TRANSITION = 20;

function ActorPair({then, now, born}: any) {
	const frame = useCurrentFrame();
	const opacity = interpolate(
		frame,
		[0, 10, ACTOR_DURATION - 10, ACTOR_DURATION],
		[0, 1, 1, 0],
		{extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
	);

	const age2011 = 2011 - born;
	const age2026 = 2026 - born;

	return (
		<AbsoluteFill style={{opacity}}>
			{/* Left THEN */}
			<div style={{width: '50%', height: '100%', position: 'relative', overflow: 'hidden'}}>
				<Img
					src={then}
					style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 15%'}}
				/>
				<div style={{position: 'absolute', inset: 0, background: 'linear-gradient(to right, transparent 60%, rgba(0,0,0,0.3) 100%)'}} />
				{/* Year + Age bottom left */}
				<div style={{position: 'absolute', bottom: 30, left: 30}}>
					<div style={{fontFamily: 'Arial Black, sans-serif', color: '#fff', fontSize: 56, fontWeight: 900, textShadow: '3px 3px 6px rgba(0,0,0,0.8)'}}>2011</div>
					<div style={{fontFamily: 'Arial Black, sans-serif', color: '#22dd22', fontSize: 52, fontWeight: 900, textShadow: '2px 2px 4px rgba(0,0,0,0.8)', marginTop: 8}}>{age2011}</div>
				</div>
			</div>

			{/* Right NOW */}
			<div style={{width: '50%', height: '100%', position: 'relative', overflow: 'hidden'}}>
				<Img
					src={now}
					style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 15%'}}
				/>
				<div style={{position: 'absolute', inset: 0, background: 'linear-gradient(to left, transparent 60%, rgba(0,0,0,0.3) 100%)'}} />
				{/* Year + Age bottom right */}
				<div style={{position: 'absolute', bottom: 30, right: 30, textAlign: 'right'}}>
					<div style={{fontFamily: 'Arial Black, sans-serif', color: '#fff', fontSize: 56, fontWeight: 900, textShadow: '3px 3px 6px rgba(0,0,0,0.8)'}}>2026</div>
					<div style={{fontFamily: 'Arial Black, sans-serif', color: '#22dd22', fontSize: 52, fontWeight: 900, textShadow: '2px 2px 4px rgba(0,0,0,0.8)', marginTop: 8}}>{age2026}</div>
				</div>
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
