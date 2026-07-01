import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';

export const BrendanFraserThumbnailEdit: React.FC = () => {
	return (
		<AbsoluteFill style={{backgroundColor: '#000', flexDirection: 'row'}}>
			{/* THEN photo - left half */}
			<div style={{width: '50%', height: '100%', position: 'relative', overflow: 'hidden'}}>
				<Img
					src={staticFile('images/then-now/k594q7aujal71.jpg')}
					style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 10%'}}
				/>
				{/* Dark gradient right edge */}
				<div style={{position: 'absolute', inset: 0, background: 'linear-gradient(to right, transparent 70%, rgba(0,0,0,0.6) 100%)'}} />
			</div>

			{/* NOW photo - right half */}
			<div style={{width: '50%', height: '100%', position: 'relative', overflow: 'hidden'}}>
				<Img
					src={staticFile('images/then-now/Brendan_Fraser_MFF_2025.jpg')}
					style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 10%'}}
				/>
				{/* Dark gradient left edge */}
				<div style={{position: 'absolute', inset: 0, background: 'linear-gradient(to left, transparent 70%, rgba(0,0,0,0.6) 100%)'}} />
			</div>

			{/* Top red banner */}
			<div style={{
				position: 'absolute',
				top: 0, left: 0, right: 0,
				height: 110,
				backgroundColor: '#cc1111',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'space-between',
				paddingLeft: 60,
				paddingRight: 60,
			}}>
				<div style={{
					fontFamily: "'Arial Black', 'Impact', sans-serif",
					color: '#ffffff',
					fontSize: 72,
					fontWeight: 900,
					letterSpacing: 6,
					textShadow: '2px 2px 0px rgba(0,0,0,0.5)',
				}}>THEN</div>
				<div style={{
					fontFamily: "'Arial Black', 'Impact', sans-serif",
					color: '#ffffff',
					fontSize: 72,
					fontWeight: 900,
					letterSpacing: 6,
					textShadow: '2px 2px 0px rgba(0,0,0,0.5)',
				}}>NOW</div>
			</div>

			{/* Center arrow */}
			<div style={{
				position: 'absolute',
				left: '50%',
				top: '50%',
				transform: 'translate(-50%, -50%)',
				backgroundColor: '#cc1111',
				borderRadius: '50%',
				width: 100,
				height: 100,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				boxShadow: '0 0 30px rgba(0,0,0,0.8)',
				border: '4px solid #fff',
			}}>
				<div style={{
					fontFamily: 'Arial',
					color: '#fff',
					fontSize: 52,
					fontWeight: 900,
					marginTop: -4,
				}}>→</div>
			</div>

			{/* Name bottom */}
			<div style={{
				position: 'absolute',
				bottom: 0, left: 0, right: 0,
				height: 100,
				background: 'linear-gradient(to top, rgba(0,0,0,0.95), transparent)',
				display: 'flex',
				alignItems: 'flex-end',
				justifyContent: 'center',
				paddingBottom: 20,
			}}>
				<div style={{
					fontFamily: "'Arial Black', 'Impact', sans-serif",
					color: '#ffffff',
					fontSize: 52,
					fontWeight: 900,
					letterSpacing: 4,
					textShadow: '2px 2px 0px rgba(0,0,0,0.9)',
				}}>BRENDAN FRASER</div>
			</div>
		</AbsoluteFill>
	);
};
