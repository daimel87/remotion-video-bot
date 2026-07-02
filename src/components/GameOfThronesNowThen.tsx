import React from 'react';
import {AbsoluteFill, Img, staticFile, Sequence, useCurrentFrame, interpolate, spring, useVideoConfig} from 'remotion';

interface ActorData {
	name: string;
	born: number;
	then: string;
	now: string;
}

const ACTORS: ActorData[] = [
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
const ACTOR_DURATION = 300;
const TRANSITION = 20;

const ActorSegment: React.FC<{actor: ActorData; index: number}> = ({actor, index}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const currentYear = 2026;
	const age = currentYear - actor.born;

	const fadeIn = index === 0
		? 1
		: interpolate(frame, [0, TRANSITION], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const fadeOut = index === ACTORS.length - 1
		? 1
		: interpolate(frame, [ACTOR_DURATION - TRANSITION, ACTOR_DURATION], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	const thenScale = spring({fps, frame: frame - 10, config: {damping: 80, stiffness: 120}});
	const nowScale = spring({fps, frame: frame - 25, config: {damping: 80, stiffness: 120}});
	const thenOpacity = interpolate(frame, [10, 30, ACTOR_DURATION - 15, ACTOR_DURATION], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const nowOpacity = interpolate(frame, [25, 45, ACTOR_DURATION - 15, ACTOR_DURATION], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	const nameY = interpolate(frame, [15, 40], [40, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const nameOpacity = interpolate(frame, [15, 40, ACTOR_DURATION - 15, ACTOR_DURATION], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	const infoOpacity = interpolate(frame, [40, 60, ACTOR_DURATION - 15, ACTOR_DURATION], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	const photoW = 550;
	const photoH = 700;

	return (
		<AbsoluteFill style={{opacity: Math.min(fadeIn, fadeOut), backgroundColor: '#080810'}}>
			<div style={{position: 'absolute', left: 0, top: 0, width: '50%', height: '100%', background: 'linear-gradient(135deg, rgba(180,140,60,0.06) 0%, transparent 100%)'}} />
			<div style={{position: 'absolute', right: 0, top: 0, width: '50%', height: '100%', background: 'linear-gradient(225deg, rgba(60,120,220,0.06) 0%, transparent 100%)'}} />

			<div style={{position: 'absolute', left: '50%', top: '10%', height: '80%', width: 1, background: 'linear-gradient(180deg, transparent, rgba(201,168,76,0.5), rgba(201,168,76,0.5), transparent)', transform: 'translateX(-50%)'}} />

			<div style={{position: 'absolute', top: 32, left: 0, width: '50%', textAlign: 'center', opacity: nameOpacity}}>
				<div style={{fontFamily: "'Georgia', serif", color: '#d4a844', fontSize: 28, fontWeight: 700, letterSpacing: 10}}>THEN</div>
				<div style={{color: '#666', fontSize: 16, letterSpacing: 4, marginTop: 4}}>2011</div>
			</div>

			<div style={{position: 'absolute', top: 32, right: 0, width: '50%', textAlign: 'center', opacity: nameOpacity}}>
				<div style={{fontFamily: "'Georgia', serif", color: '#4a9eff', fontSize: 28, fontWeight: 700, letterSpacing: 10}}>NOW</div>
				<div style={{color: '#666', fontSize: 16, letterSpacing: 4, marginTop: 4}}>2026</div>
			</div>

			<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 0, paddingTop: 30, paddingBottom: 160}}>
				<div style={{width: photoW, height: photoH, transform: `scale(${thenScale})`, opacity: thenOpacity, overflow: 'hidden', border: '3px solid rgba(212,168,68,0.6)', boxShadow: '0 0 40px rgba(212,168,68,0.2)', margin: '0 20px'}}>
					<Img
						src={staticFile(actor.then)}
						style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 15%', filter: 'sepia(30%) contrast(1.05)'}}
					/>
					<div style={{position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 60%, rgba(20,15,5,0.6) 100%)'}} />
				</div>

				<div style={{width: photoW, height: photoH, transform: `scale(${nowScale})`, opacity: nowOpacity, overflow: 'hidden', border: '3px solid rgba(74,158,255,0.5)', boxShadow: '0 0 40px rgba(74,158,255,0.15)', margin: '0 20px', position: 'relative'}}>
					<Img
						src={staticFile(actor.now)}
						style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 15%'}}
					/>
					<div style={{position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 60%, rgba(8,8,16,0.5) 100%)'}} />
				</div>
			</AbsoluteFill>

			<AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', flexDirection: 'column', paddingBottom: 60}}>
				<div style={{opacity: nameOpacity, transform: `translateY(${nameY}px)`, textAlign: 'center'}}>
					<div style={{fontFamily: "'Georgia', serif", color: '#ffffff', fontSize: 72, fontWeight: 700, letterSpacing: 4, textShadow: '0 2px 30px rgba(0,0,0,0.9)', lineHeight: 1}}>
						{actor.name.toUpperCase()}
					</div>
				</div>

				<div style={{opacity: infoOpacity, marginTop: 16, textAlign: 'center'}}>
					<div style={{width: 600, height: 2, background: 'linear-gradient(90deg, transparent, #c9a84c, transparent)', margin: '0 auto'}} />
					<div style={{display: 'flex', gap: 40, justifyContent: 'center', marginTop: 14, alignItems: 'center'}}>
						<div style={{fontFamily: "'Georgia', serif", color: '#c9a84c', fontSize: 24, letterSpacing: 2}}>
							Born {actor.born}
						</div>
						<div style={{color: '#444', fontSize: 20}}>•</div>
						<div style={{fontFamily: "'Georgia', serif", color: '#8ab4f8', fontSize: 24, letterSpacing: 2}}>
							{age} years old
						</div>
					</div>
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

export const GameOfThronesNowThen: React.FC = () => {
	return (
		<AbsoluteFill style={{backgroundColor: '#080810'}}>
			{ACTORS.map((actor, index) => {
				const start = index * (ACTOR_DURATION - TRANSITION);
				return (
					<Sequence key={actor.name} from={start} durationInFrames={ACTOR_DURATION}>
						<ActorSegment actor={actor} index={index} />
					</Sequence>
				);
			})}
		</AbsoluteFill>
	);
};
