import React from 'react';
import {AbsoluteFill, Img} from 'remotion';

export const StaticFrame: React.FC<{src: string}> = ({src}) => {
  return (
    <AbsoluteFill style={{backgroundColor: '#ffffff'}}>
      <Img src={src} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
    </AbsoluteFill>
  );
};
